import { prisma } from "@repo/database";
import { hash, verify } from "argon2";
import chalk from "chalk";
import { v7 as uuidv7 } from "uuid";
import {
    IS_PROD,
    MAX_ACTIVE_SESSIONS,
    MAX_VERIFICATION_CODE_ATTEMPTS,
    SESSION_EXPIRY,
    VERIFICATION_CODE_EXPIRY,
} from "../../configs/constants.js";
import { addSecondsToNow } from "../../helpers/add-seconds-to-now.js";
import { APIError } from "../../helpers/api-error.js";
import { generateOtp } from "../../helpers/generate-otp.js";
import { generateToken } from "../../helpers/generate-token.js";

export const authService = {
    // ----- Sign Up Service ----- //

    signUp: async ({
        password,
        email,
    }: {
        email: string;
        password: string;
    }): Promise<{ token: string }> => {
        const userRecord = await prisma.user.findFirst({
            where: { email, verified: true },
        });

        if (userRecord) {
            // for preventing user enumeration
            const { token } = await prisma.signUpAttempt.create({
                data: {
                    expiresAt: addSecondsToNow(VERIFICATION_CODE_EXPIRY),
                    token: generateToken(16),
                    email,
                    passwordHash: await hash(password),
                    verificationCodeHash: await hash(generateToken(128)), // almost never guesable code
                },
                select: { token: true },
            });

            return { token };
        }

        const { rawOtp, hashedOtp } = generateOtp(6);
        const { token } = await prisma.signUpAttempt.create({
            data: {
                expiresAt: addSecondsToNow(VERIFICATION_CODE_EXPIRY),
                token: generateToken(16),
                email,
                verificationCodeHash: await hashedOtp,
                passwordHash: await hash(password),
            },
            select: { token: true },
        });

        if (!IS_PROD) {
            console.info(chalk.bgGreen(rawOtp));
        }

        return { token };
    },

    // ----- Verify Sign Up Service ----- //

    verifySignUp: async ({
        signUpAttemptToken,
        code,
        ipAddress,
        userAgent,
    }: {
        ipAddress: string;
        userAgent: string;
        code: string;
        signUpAttemptToken: string;
    }): Promise<{ sessionId: string }> => {
        const signUpAttemptRecord = await prisma.signUpAttempt.findUnique({
            where: { token: signUpAttemptToken },
            select: {
                email: true,
                passwordHash: true,
                attempts: true,
                verificationCodeHash: true,
                expiresAt: true,
            },
        });

        if (!signUpAttemptRecord) {
            throw new APIError(404, {
                message: "No sign up attempt was found. Please go back and try again.",
                code: "sign_up_attempt_not_found",
            });
        }

        if (new Date() >= signUpAttemptRecord.expiresAt) {
            throw new APIError(410, {
                message: "This sign up attempt has expired. Please go back and try again.",
                code: "sign_up_attempt_expired",
            });
        }

        const { email, passwordHash, verificationCodeHash } = signUpAttemptRecord;

        if (signUpAttemptRecord.attempts >= MAX_VERIFICATION_CODE_ATTEMPTS) {
            throw new APIError(403, {
                message: "Too many failed attempts. Please go back and try again.",
                code: "forbidden_sign_up_attempt",
            });
        }

        await prisma.signUpAttempt.update({
            where: { token: signUpAttemptToken },
            data: {
                attempts: { increment: 1 },
            },
        });

        if ((await verify(verificationCodeHash, code)) === false) {
            throw new APIError(422, {
                message: "Entered code is incorrect",
                code: "invalid_code",
            });
        }

        await prisma.signUpAttempt.deleteMany({
            where: { email },
        });

        const { id: sessionId } = await prisma.$transaction(async (tx) => {
            const workspace = await tx.workspace.create({
                data: { id: uuidv7(), name: "My workspace" },
            });
            const user = await tx.user.create({
                data: {
                    id: uuidv7(),
                    email,
                    passwordHash,
                    passwordEnabled: true,
                    verified: true,
                    workspaceMemberships: {
                        create: {
                            role: "ADMIN",
                            workspace: {
                                connect: { id: workspace.id },
                            },
                        },
                    },
                },
                select: { id: true },
            });
            return tx.session.create({
                data: {
                    id: uuidv7(),
                    ipAddress,
                    userAgent,
                    expiresAt: addSecondsToNow(SESSION_EXPIRY),
                    user: {
                        connect: { id: user.id },
                    },
                },
                select: { id: true },
            });
        });

        return { sessionId };
    },

    // ----- Sign In Service ----- //

    signIn: async ({
        ipAddress,
        userAgent,
        email,
        password,
    }: {
        password: string;
        email: string;
        ipAddress: string;
        userAgent: string;
    }): Promise<{ sessionId: string }> => {
        const userRecord = await prisma.user.findFirst({
            where: { email, verified: true },
            select: { id: true, passwordHash: true },
        });

        const dummyPasswordHash = await hash("dummy-password");
        if (!userRecord) {
            await verify(dummyPasswordHash, password); // for preventing timing attacks
            throw new APIError(422, {
                message: "Incorrect email or password",
                code: "invalid_credential",
            });
        }

        if ((await verify(userRecord.passwordHash, password)) === false) {
            throw new APIError(422, {
                message: "Incorrect email or password",
                code: "invalid_credential",
            });
        }

        const { id: userId } = userRecord;

        // LRU based session deletion for reaching max limit
        const sessionRecords = await prisma.session.findMany({
            where: {
                expiresAt: { gt: new Date() },
                userId,
            },
            orderBy: { lastActiveAt: "asc" },
            select: { id: true },
        });

        if (sessionRecords.length >= MAX_ACTIVE_SESSIONS) {
            await prisma.session.deleteMany({
                where: { id: sessionRecords[0].id },
            });
        }

        const { id: sessionId } = await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: { lastSignInAt: new Date() },
                select: { id: true },
            });
            return await tx.session.create({
                data: {
                    id: uuidv7(),
                    ipAddress,
                    userAgent,
                    expiresAt: addSecondsToNow(SESSION_EXPIRY),
                    user: { connect: { id: userId } },
                },
                select: { id: true },
            });
        });

        return { sessionId };
    },
};
