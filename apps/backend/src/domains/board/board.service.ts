import { prisma, WorkspaceMemberRole } from "@repo/database";
import { permissions } from "@repo/types";
import { v7 as uuidv7 } from "uuid";
import { APIError } from "../../helpers/api-error.js";

export const boardService = {
    create: async ({
        workspaceId,
        title,
        role,
        userId,
        emailAddress,
    }: {
        emailAddress: string;
        userId: string;
        role: WorkspaceMemberRole;
        title: string;
        workspaceId: string;
    }): Promise<void> => {
        if (!permissions[role].includes("workspace:boards:create")) {
            throw new APIError(403, {
                message: "You do not have the permission to perform this action.",
                code: "forbidden",
            });
        }

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
                    message: `${emailAddress} created board "${title}"`,
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
