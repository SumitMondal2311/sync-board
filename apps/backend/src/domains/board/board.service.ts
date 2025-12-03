import { prisma } from "@repo/database";
import { CreateBoardAPISuccessResponse, GetAllBoardsAPISuccessResponse } from "@repo/types";
import { v7 as uuidv7 } from "uuid";

export const boardService = {
    // ----- Create Board Service ----- //

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
    }): Promise<{
        board: CreateBoardAPISuccessResponse;
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

            return { board };
        });

        return {
            board: { title, ...board },
        };
    },

    // ----- Get Boards Service ----- //

    getList: async (
        workspaceId: string
    ): Promise<{
        boards: GetAllBoardsAPISuccessResponse;
    }> => {
        const boardRecords = await prisma.board.findMany({
            where: { workspaceId },
            select: { id: true, title: true },
        });

        return { boards: boardRecords };
    },
};
