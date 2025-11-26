import { prisma } from "@repo/database";
import { TaskSchema } from "@repo/types";
import { v7 as uuidv7 } from "uuid";
import { APIError } from "../../helpers/api-error.js";

export const taskService = {
    create: async ({
        listId,
        boardId,
        input,
        email,
        userId,
        workspaceId,
    }: {
        workspaceId: string;
        userId: string;
        email: string;
        input: TaskSchema;
        boardId: string;
        listId: string;
    }): Promise<void> => {
        const listRecord = await prisma.list.findFirst({
            where: {
                id: listId,
                board: { id: boardId, workspaceId },
            },
            select: { title: true },
        });

        if (!listRecord) {
            throw new APIError(404, {
                message: "List does not exist or belong to the current board or workspace",
                code: "resource_not_found",
            });
        }

        const taskCount = await prisma.task.count({
            where: {
                list: { id: listId },
            },
        });

        const { title, assigneeId, dueDate } = input;
        if (assigneeId) {
            const workspaceMembershipRecord = await prisma.workspaceMembership.findFirst({
                where: { userId: assigneeId, workspaceId },
                select: { role: true },
            });

            if (!workspaceMembershipRecord) {
                throw new APIError(404, {
                    message: "Assignee does not belong to the current workspace",
                    code: "resource_not_found",
                });
            }

            if (workspaceMembershipRecord.role === "GUEST") {
                throw new APIError(403, {
                    message: "Tasks cannot be assigned to Guests.",
                    code: "forbidden_task_assign",
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
                    message: `${email} created a task "${title}" into list "${listRecord.title}"`,
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
