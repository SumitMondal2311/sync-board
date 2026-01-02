import { prisma } from "@repo/database";
import { CreateBoardResponse, GetBoardsResponse } from "@repo/types";
import { v7 as uuidv7 } from "uuid";

export const boardService = {
    // ----------------------------------------
    // Create Board
    // ----------------------------------------

    create: async ({
        userId,
        workspaceId,
        title,
    }: {
        userId: string;
        workspaceId: string;
        title: string;
    }): Promise<{
        board: CreateBoardResponse;
    }> => {
        const { board } = await prisma.$transaction(async (tx) => {
            const board = await tx.board.create({
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
                select: { creatorId: true, id: true },
            });
            await tx.workspaceActivity.create({
                data: {
                    message: `Board "${title}" created`,
                    id: uuidv7(),
                    actor: {
                        connect: { id: userId },
                    },
                    workspace: {
                        connect: { id: workspaceId },
                    },
                },
            });

            return { board };
        });

        return {
            board: { title, ...board },
        };
    },

    // ----------------------------------------
    // Get All Board
    // ----------------------------------------

    getAll: async (
        workspaceId: string
    ): Promise<{
        boards: GetBoardsResponse;
    }> => {
        const boards = await prisma.board.findMany({
            where: { workspaceId },
            select: { creatorId: true, id: true, title: true },
        });

        return { boards };
    },
};
