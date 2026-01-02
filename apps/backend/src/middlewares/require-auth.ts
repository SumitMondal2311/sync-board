import { prisma } from "@repo/database";
import { COOKIES } from "@repo/types";

import { SESSION_EXPIRY } from "@/configs/constants";
import { env } from "@/configs/env";
import { addSecondsToNow } from "@/helpers/add-seconds-to-now";
import { APIError } from "@/helpers/api-error";
import { asyncHandler } from "@/helpers/async-handler";
import { RequireAuthRequest } from "@/types/custom-request";

export const requireAuthMiddleware = asyncHandler(
    async (
        req: RequireAuthRequest & {
            cookies: {
                [COOKIES.session_id]?: string;
            };
        },
        res,
        next
    ) => {
        const sessionId = req.cookies[COOKIES.session_id];
        if (!sessionId) {
            throw new APIError(401, {
                code: "unauthorized",
                message: "Authentication required.",
            });
        }

        const clearCookies = () => {
            res.clearCookie(COOKIES.session_id, {
                sameSite: "lax",
                httpOnly: true,
                secure: env.isProd,
            });
        };

        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            select: { expiresAt: true },
        });

        if (!session) {
            clearCookies();
            throw new APIError(401, {
                code: "invalid_session",
                message: "Session is no longer valid.",
            });
        }

        const deleteSession = async () => {
            clearCookies();
            await prisma.session.deleteMany({
                where: { id: sessionId },
            });
        };

        if (new Date() >= session.expiresAt) {
            await deleteSession();
            throw new APIError(401, {
                code: "session_expired",
                message: "Session has already expired.",
            });
        }

        const updatedSession = await prisma.session.update({
            where: { id: sessionId },
            data: {
                expiresAt: addSecondsToNow(SESSION_EXPIRY),
                lastActiveAt: new Date(),
            },
            omit: { userId: true },
            include: {
                user: {
                    omit: { passwordHash: true },
                    include: {
                        workspaceMemberships: {
                            select: { workspace: true, role: true, createdAt: true },
                        },
                    },
                },
            },
        });

        const { user, ...restOfSession } = updatedSession;
        const { workspaceMemberships, ...restOfUser } = user;

        req.session = {
            ...restOfSession,
            user: {
                ...restOfUser,
                workspaces: workspaceMemberships.map((membership) => ({
                    ...membership.workspace,
                    membership: {
                        role: membership.role,
                        createdAt: membership.createdAt,
                    },
                })),
            },
        };

        next();
    }
);
