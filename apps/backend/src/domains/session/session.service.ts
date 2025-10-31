import { prisma } from "@repo/database";
import { APIError } from "../../helpers/api-error.js";

export const sessionService = {
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
