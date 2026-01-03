import { prisma, WorkspaceMemberRole } from "@repo/database";
import { v7 as uuidv7 } from "uuid";

import { APIError } from "@/helpers/api-error";
import { CreateWorkspaceResponse } from "@repo/types";

export const workspaceService = {
    createWorkspace: async ({
        userId,
        name,
    }: {
        userId: string;
        name: string;
    }): Promise<{ workspace: CreateWorkspaceResponse }> => {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { createdAt: true },
        });

        if (!user) {
            throw new APIError(404, {
                code: "resource_not_found",
                message: "User not found",
            });
        }

        const workspaceMembership = await prisma.workspaceMembership.create({
            data: {
                role: WorkspaceMemberRole.ADMIN,
                user: {
                    connect: { id: userId },
                },
                workspace: {
                    create: { id: uuidv7(), name },
                },
            },
            select: { role: true, createdAt: true, workspace: true },
        });

        const { workspace, ...membership } = workspaceMembership;

        return {
            workspace: { membership, ...workspace },
        };
    },
};
