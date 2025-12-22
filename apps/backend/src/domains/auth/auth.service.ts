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
    // ----------------------------------------
    // Sign Up
    // ----------------------------------------

    signUp: async ({
        firstName,
        lastName,
        email,
        password,
    }: {
        firstName: string;
        lastName?: string;
        email: string;
        password: string;
    }): Promise<{ token: string }> => {
        const user = await prisma.user.findFirst({
            where: { email, verified: true },
        });

        if (user) {
            const { token } = await prisma.signUpAttempt.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    passwordHash: await hash("dummy-password"),
                    verificationCodeHash: await hash("dummy-code"),
                    token: generateToken(16),
                    expiresAt: addSecondsToNow(VERIFICATION_CODE_EXPIRY),
                },
                select: { token: true },
            });

            return { token };
        }

        const { rawOtp, hashedOtp } = generateOtp(6);
        const { token } = await prisma.signUpAttempt.create({
            data: {
                firstName,
                ...(lastName && {
                    lastName,
                }),
                email,
                passwordHash: await hash(password),
                verificationCodeHash: await hashedOtp,
                token: generateToken(16),
                expiresAt: addSecondsToNow(VERIFICATION_CODE_EXPIRY),
            },
            select: { token: true },
        });

        if (!IS_PROD) {
            console.info(chalk.bgGreen(rawOtp));
        }

        return { token };
    },

    // ----------------------------------------
    // Prepare Verify Email
    // ----------------------------------------

    prepareVerifyEmail: async (token: string): Promise<{ email: string }> => {
        const signUpAttemptRecord = await prisma.signUpAttempt.findUnique({
            where: { token },
            select: { email: true },
        });

        if (!signUpAttemptRecord) {
            throw new APIError(404, {
                code: "resource_not_found",
                message: "No sign up attempt was found.",
            });
        }

        return { email: signUpAttemptRecord.email };
    },

    // ----------------------------------------
    // Attempt Verify Email
    // ----------------------------------------

    attemptVerifyEmail: async ({
        token,
        code,
        ipAddress,
        userAgent,
    }: {
        token: string;
        code: string;
        ipAddress: string;
        userAgent: string;
    }): Promise<{ sessionId: string }> => {
        const signUpAttemptRecord = await prisma.signUpAttempt.findUnique({
            where: { token },
            select: {
                attempts: true,
                firstName: true,
                lastName: true,
                email: true,
                passwordHash: true,
                verificationCodeHash: true,
                expiresAt: true,
            },
        });

        if (!signUpAttemptRecord) {
            throw new APIError(404, {
                code: "resource_not_found",
                message: "No sign-up attempt was found.",
            });
        }

        const { firstName, lastName, email, passwordHash, verificationCodeHash, expiresAt } =
            signUpAttemptRecord;
        if (new Date() >= expiresAt) {
            throw new APIError(400, {
                code: "resource_expired",
                message: "Sign-up attempt has already expired.",
            });
        }

        if (signUpAttemptRecord.attempts >= MAX_VERIFICATION_CODE_ATTEMPTS) {
            throw new APIError(403, {
                code: "too_many_attempts",
                message: "Too many failed verification attempts.",
            });
        }

        if ((await verify(verificationCodeHash, code)) === false) {
            await prisma.signUpAttempt.update({
                where: { token },
                data: {
                    attempts: { increment: 1 },
                },
            });

            throw new APIError(422, {
                code: "invalid_code",
                message: "Entered code is incorrect.",
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
                    firstName,
                    ...(lastName && {
                        lastName,
                    }),
                    email,
                    passwordEnabled: true,
                    passwordHash,
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

    // ----------------------------------------
    // Sign In
    // ----------------------------------------

    signIn: async ({
        email,
        password,
        ipAddress,
        userAgent,
    }: {
        email: string;
        password: string;
        ipAddress: string;
        userAgent: string;
    }): Promise<{ sessionId: string }> => {
        const user = await prisma.user.findFirst({
            where: { email, verified: true },
            select: { id: true, passwordHash: true },
        });

        const dummyPasswordHash = await hash("dummy-password");
        if (!user) {
            await verify(dummyPasswordHash, password);
            throw new APIError(422, {
                code: "invalid_credentials",
                message: "Incorrect email or password",
            });
        }

        if ((await verify(user.passwordHash, password)) === false) {
            throw new APIError(422, {
                code: "invalid_credentials",
                message: "Incorrect email or password",
            });
        }

        const sessionRecords = await prisma.session.findMany({
            where: {
                expiresAt: { gt: new Date() },
                userId: user.id,
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
                where: { id: user.id },
                data: { lastSignInAt: new Date() },
                select: { id: true },
            });
            return await tx.session.create({
                data: {
                    id: uuidv7(),
                    ipAddress,
                    userAgent,
                    expiresAt: addSecondsToNow(SESSION_EXPIRY),
                    user: { connect: { id: user.id } },
                },
                select: { id: true },
            });
        });

        return { sessionId };
    },
};
