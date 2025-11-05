import { prisma } from "@repo/database";
import { Request } from "express";
import { APIError } from "../helpers/api-error.js";
import { asyncHandler } from "../helpers/async-handler.js";
import { AuthContext } from "../types/auth-context.js";
import { WorkspaceContext } from "../types/workspace-context.js";

export const requireWorkspaceMiddleware = asyncHandler(
    async (
        req: Request & {
            headers: { "x-workspace-id"?: string };
            authContext: AuthContext;
            workspaceContext: WorkspaceContext;
        },
        _,
        next
    ) => {
        const workspaceId = req.headers["x-workspace-id"];
        if (!workspaceId) {
            throw new APIError(400, {
                message: "Missing 'X-Workspace-ID' header.",
                code: "missing_request_header",
            });
        }

        const {
            session: { user },
        } = req.authContext;

        const workspaceMembershipRecord = await prisma.workspaceMembership.findUnique({
            where: {
                userId_workspaceId: {
                    userId: user.id,
                    workspaceId: workspaceId,
                },
            },
            select: { createdAt: true, role: true, workspace: true },
        });

        if (!workspaceMembershipRecord) {
            throw new APIError(403, {
                message: "Access forbidden. You are not a member of the requested workspace.",
                code: "forbidden_workspace_access",
            });
        }

        const { workspace, ...rest } = workspaceMembershipRecord;

        req.workspaceContext = {
            workspace: { membership: rest, ...workspace },
        };

        next();
    }
);
