import { prisma } from "@repo/database";
import { WorkspacePolicy } from "@repo/types";
import { APIError } from "../helpers/api-error.js";
import { asyncHandler } from "../helpers/async-handler.js";
import { RequireAuthRequest, RequireWorkspaceRequest } from "../types/custom-request.js";

export const requireWorkspaceMiddleware = asyncHandler(
    async (
        req: RequireAuthRequest &
            RequireWorkspaceRequest & {
                headers: { "x-workspace-id"?: string };
            },
        _,
        next
    ) => {
        const workspaceId = req.headers["x-workspace-id"];
        if (!workspaceId) {
            throw new APIError(400, {
                message: "Missing 'x-workspace-id' header.",
                code: "missing_header",
            });
        }

        const { user } = req.session;

        const workspaceMembershipRecord = await prisma.workspaceMembership.findUnique({
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

        if (!workspaceMembershipRecord) {
            throw new APIError(403, {
                message: "Current user does not belong to the requested workspace.",
                code: "forbidden_workspace_access",
            });
        }

        const {
            workspace: { strictMode },
            role,
        } = workspaceMembershipRecord;

        const workspacePolicy = new WorkspacePolicy({
            strictMode,
            role,
            userId: user.id,
        });

        req.activeWorkspaceId = workspaceId;
        req.workspacePolicy = workspacePolicy;

        next();
    }
);
