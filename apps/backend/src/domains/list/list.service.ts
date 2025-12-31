import { v7 as uuidv7 } from "uuid";

import { prisma } from "@repo/database";
import { CreateListResponse, GetListsResponse } from "@repo/types/api";
import { APIError } from "@/helpers/api-error.js";

export const listService = {
    // ----------------------------------------
    // Create List
    // ----------------------------------------

    create: async ({
        userId,
        workspaceId,
        boardId,
        title,
    }: {
        userId: string;
        workspaceId: string;
        boardId: string;
        title: string;
    }): Promise<{
        list: CreateListResponse;
    }> => {
        const board = await prisma.board.findFirst({
            where: { id: boardId, workspaceId },
            select: { title: true },
        });

        if (!board) {
            throw new APIError(404, {
                code: "resource_not_found",
                message: "Board not found.",
            });
        }

        const listCount = await prisma.list.count({
            where: { boardId },
        });

        const { list } = await prisma.$transaction(async (tx) => {
            const list = await tx.list.create({
                data: {
                    id: uuidv7(),
                    position: listCount + 1,
                    title,
                    board: {
                        connect: { id: boardId },
                    },
                },
                select: { id: true, position: true },
            });
            await tx.workspaceActivity.create({
                data: {
                    message: `List "${title}" created into board "${board.title}"`,
                    id: uuidv7(),
                    actor: {
                        connect: { id: userId },
                    },
                    workspace: {
                        connect: { id: workspaceId },
                    },
                },
            });

            return { list };
        });

        return {
            list: { title, ...list },
        };
    },

    // ----------------------------------------
    // Get All List
    // ----------------------------------------

    getAll: async ({
        workspaceId,
        boardId,
    }: {
        workspaceId: string;
        boardId: string;
    }): Promise<{
        lists: GetListsResponse;
    }> => {
        const lists = await prisma.list.findMany({
            where: {
                board: { id: boardId, workspaceId },
            },
            orderBy: { position: "asc" },
            select: {
                title: true,
                id: true,
                position: true,
                tasks: {
                    orderBy: { position: "asc" },
                    select: {
                        title: true,
                        id: true,
                        position: true,
                        dueDate: true,
                        assignee: {
                            select: { firstName: true, lastName: true, id: true, email: true },
                        },
                        _count: {
                            select: { comments: true },
                        },
                    },
                },
            },
        });

        return {
            lists: lists.map((listRecord) => ({
                title: listRecord.title,
                id: listRecord.id,
                position: listRecord.position,
                tasks: listRecord.tasks.map(
                    (taskRecord) =>
                        ({
                            position: taskRecord.position,
                            dueDate: taskRecord.dueDate,
                            id: taskRecord.id,
                            title: taskRecord.title,
                            assignee: taskRecord.assignee,
                            commentsCount: taskRecord._count.comments,
                        }) satisfies GetListsResponse[number]["tasks"][number]
                ),
            })),
        };
    },
};
