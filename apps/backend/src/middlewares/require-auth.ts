import { prisma } from "@repo/database";
import { Request } from "express";
import { IS_PROD, SESSION_EXPIRY } from "../configs/constants.js";
import { addSecondsToNow } from "../helpers/add-seconds-to-now.js";
import { APIError } from "../helpers/api-error.js";
import { asyncHandler } from "../helpers/async-handler.js";
import { AuthContext } from "../types/auth-context.js";

export const requireAuthMiddleware = asyncHandler(
    async (
        req: Request & {
            cookies: { __session_id?: string };
            authContext: AuthContext;
        },
        res,
        next
    ) => {
        const { __session_id } = req.cookies;
        if (!__session_id) {
            throw new APIError(401, {
                message: "Authorization required. Please sign in to get authorized.",
                code: "unauthorized",
            });
        }

        const clearCookies = () => {
            res.clearCookie("__session_id", {
                secure: IS_PROD,
                httpOnly: true,
                sameSite: "lax",
                maxAge: 0,
            });
        };

        const sessionRecord = await prisma.session.findUnique({
            where: { id: __session_id },
            select: { expiresAt: true },
        });

        if (!sessionRecord) {
            clearCookies();
            throw new APIError(401, {
                message: "Invalid session. Please sign in again.",
                code: "unauthorized",
            });
        }

        const deleteSession = async () => {
            clearCookies();
            await prisma.session.deleteMany({
                where: { id: __session_id },
            });
        };

        if (new Date() >= sessionRecord.expiresAt) {
            await deleteSession();
            throw new APIError(401, {
                message: "Session has been expired. Please sign in again.",
                code: "unauthorized",
            });
        }

        const updatedSession = await prisma.session.update({
            where: { id: __session_id },
            data: {
                expiresAt: addSecondsToNow(SESSION_EXPIRY),
                lastActiveAt: new Date(),
            },
            omit: { userId: true },
            include: {
                user: {
                    omit: { passwordHash: true },
                },
            },
        });

        req.authContext = { session: updatedSession };
        next();
    }
);
