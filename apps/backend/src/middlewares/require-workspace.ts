import { prisma } from "@repo/database";
import { HEADERS, WorkspacePolicy } from "@repo/types";

import { APIError } from "../helpers/api-error.js";
import { asyncHandler } from "../helpers/async-handler.js";
import { RequireAuthRequest, RequireWorkspaceRequest } from "../types/custom-request.js";

export const requireWorkspaceMiddleware = asyncHandler(
    async (
        req: RequireAuthRequest &
            RequireWorkspaceRequest & {
                headers: {
                    [HEADERS.workspace_id]?: string;
                };
            },
        _,
        next
    ) => {
        const workspaceId = req.headers[HEADERS.workspace_id];
        if (!workspaceId) {
            throw new APIError(400, {
                code: "missing_header",
                message: "Required workspace context.",
            });
        }

        const { user } = req.session;

        const membership = await prisma.workspaceMembership.findUnique({
            where: {
                userId_workspaceId: {
                    userId: user.id,
                    workspaceId: workspaceId,
                },
            },
            select: {
                role: true,
                workspace: {
                    select: { strictMode: true },
                },
            },
        });

        if (!membership) {
            throw new APIError(403, {
                code: "forbidden",
                message: "Action not permitted.",
            });
        }

        const {
            workspace: { strictMode },
            role,
        } = membership;

        req.activeWorkspaceId = workspaceId;
        req.workspacePolicy = new WorkspacePolicy({
            strictMode,
            role,
            userId: user.id,
        });

        next();
    }
);
