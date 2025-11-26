import { prisma } from "@repo/database";
import { v7 as uuidv7 } from "uuid";

export const boardService = {
    create: async ({
        title,
        userId,
        workspaceId,
        email,
    }: {
        email: string;
        workspaceId: string;
        userId: string;
        title: string;
    }): Promise<void> => {
        await prisma.$transaction(async (tx) => {
            await tx.board.create({
                data: {
                    id: uuidv7(),
                    title,
                    creator: {
                        connect: { id: userId },
                    },
                    workspace: {
                        connect: { id: workspaceId },
                    },
                },
                select: { id: true },
            });
            await tx.workspaceActivity.create({
                data: {
                    message: `${email} created board "${title}"`,
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
