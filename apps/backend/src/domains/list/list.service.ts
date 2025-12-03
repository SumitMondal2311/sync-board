import { prisma } from "@repo/database";
import { CreateListAPISuccessResponse, GetAllListsAPISuccessResponse } from "@repo/types";
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
    }): Promise<{
        list: CreateListAPISuccessResponse;
    }> => {
        // ----- Create List Service ----- //

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

            return { list };
        });

        return {
            list: { title, ...list },
        };
    },

    // ----- Get Lists Service ----- //

    getList: async ({
        workspaceId,
        boardId,
    }: {
        boardId: string;
        workspaceId: string;
    }): Promise<{
        lists: GetAllListsAPISuccessResponse;
    }> => {
        const listRecords = await prisma.list.findMany({
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
            lists: listRecords.map((listRecord) => ({
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
                        }) satisfies GetAllListsAPISuccessResponse[number]["tasks"][number]
                ),
            })),
        };
    },
};
