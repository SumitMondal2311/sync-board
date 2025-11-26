import { prisma, Session } from "@repo/database";
import { APIError } from "../../helpers/api-error.js";

export const sessionService = {
    // ----- Get Active Sessions List Service ----- //

    getActiveList: async (
        userId: string
    ): Promise<{
        sessions: Pick<Session, "userAgent" | "ipAddress" | "id" | "lastActiveAt">[];
    }> => {
        const sessionRecords = await prisma.session.findMany({
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

        return { sessions: sessionRecords };
    },

    // ----- Delete Session Service ----- //

    delete: async ({ sessionId, userId }: { userId: string; sessionId: string }): Promise<void> => {
        const { count } = await prisma.session.deleteMany({
            where: { id: sessionId, userId },
        });

        if (count <= 0) {
            throw new APIError(404, {
                message: `No session was found with id '${sessionId}'`,
                code: "resource_not_found",
            });
        }
    },
};
