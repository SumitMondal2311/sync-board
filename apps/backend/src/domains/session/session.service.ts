import { prisma, Session } from "@repo/database";

import { APIError } from "@/helpers/api-error.js";

export const sessionService = {
    // ----------------------------------------
    // List Active Sessions
    // ----------------------------------------

    listActive: async (
        userId: string
    ): Promise<{
        activeSessions: Pick<Session, "userAgent" | "ipAddress" | "id" | "lastActiveAt">[];
    }> => {
        const activeSessions = await prisma.session.findMany({
            where: {
                expiresAt: { gt: new Date() },
                userId,
            },
            select: {
                userAgent: true,
                ipAddress: true,
                id: true,
                lastActiveAt: true,
            },
        });

        return { activeSessions };
    },

    // ----------------------------------------
    // Delete Session
    // ----------------------------------------

    delete: async ({ sessionId, userId }: { userId: string; sessionId: string }): Promise<void> => {
        const { count } = await prisma.session.deleteMany({
            where: { id: sessionId, userId },
        });

        if (count <= 0) {
            throw new APIError(404, {
                code: "resource_not_found",
                message: "Session not found.",
            });
        }
    },
};
