import { prisma } from "@repo/database";
import { v7 as uuidv7 } from "uuid";
import { APIError } from "../../helpers/api-error.js";

export const listService = {
    create: async ({
        boardId,
        workspaceId,
        title,
        email,
        userId,
    }: {
        userId: string;
        email: string;
        title: string;
        workspaceId: string;
        boardId: string;
    }): Promise<void> => {
        const boardRecord = await prisma.board.findFirst({
            where: { id: boardId, workspaceId },
            select: { title: true },
        });

        if (!boardRecord) {
            throw new APIError(404, {
                message: "Board does not exist or belong to the current workspace",
                code: "resource_not_found",
            });
        }

        const listCount = await prisma.list.count({
            where: { boardId },
        });

        await prisma.$transaction(async (tx) => {
            await tx.list.create({
                data: {
                    id: uuidv7(),
                    position: listCount + 1,
                    title,
                    board: {
                        connect: { id: boardId },
                    },
                },
                select: { id: true },
            });
            await tx.workspaceActivity.create({
                data: {
                    message: `${email} created a list "${title}" into board "${boardRecord.title}"`,
                    id: uuidv7(),
                    actor: {
                        connect: { id: userId },
                    },
                    workspace: {
                        connect: { id: workspaceId },
                    },
                },
            });
        });
    },
};
