import { prisma } from "@repo/database";
import { v7 as uuidv7 } from "uuid";

import { APIError } from "@/helpers/api-error.js";

export const taskService = {
    create: async ({
        workspaceId,
        listId,
        boardId,
        title,
        assigneeId,
        userId,
        dueDate,
    }: {
        workspaceId: string;
        listId: string;
        boardId: string;
        title: string;
        assigneeId?: string;
        userId: string;
        dueDate?: Date;
    }): Promise<void> => {
        const list = await prisma.list.findFirst({
            where: {
                id: listId,
                board: { id: boardId, workspaceId },
            },
            select: {
                title: true,
                board: {
                    select: { title: true },
                },
            },
        });

        if (!list) {
            throw new APIError(404, {
                code: "resource_not_found",
                message: "List not found.",
            });
        }

        const taskCount = await prisma.task.count({
            where: {
                list: { id: listId },
            },
        });

        if (assigneeId) {
            const assigneeMembership = await prisma.workspaceMembership.findFirst({
                where: { userId: assigneeId, workspaceId },
                select: { role: true },
            });

            if (!assigneeMembership) {
                throw new APIError(404, {
                    code: "resource_not_found",
                    message: "Assignee not found.",
                });
            }

            if (assigneeMembership.role === "GUEST") {
                throw new APIError(403, {
                    code: "forbidden",
                    message: "Action not permitted.",
                });
            }
        }

        await prisma.$transaction(async (tx) => {
            await tx.task.create({
                data: {
                    id: uuidv7(),
                    position: taskCount + 1,
                    title,
                    ...(dueDate && { dueDate }),
                    ...(assigneeId && {
                        assignee: {
                            connect: { id: assigneeId },
                        },
                    }),
                    list: {
                        connect: { id: listId },
                    },
                },
                select: { id: true },
            });
            await tx.workspaceActivity.create({
                data: {
                    message: `Task "${title}" created into board "${list.board.title}" list "${list.title}"`,
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
