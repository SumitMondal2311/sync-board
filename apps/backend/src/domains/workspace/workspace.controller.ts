import { CreateWorkspaceResponse, CreateWorkspaceSchema } from "@repo/types";
import { createWorkspaceSchema } from "@repo/validation";
import { Response } from "express";

import { APIError } from "@/helpers/api-error";
import { asyncHandler } from "@/helpers/async-handler";
import { RequireAuthRequest } from "@/types/custom-request";
import { workspaceService } from "./workspace.service";

export const workspaceController = {
    createWorkspace: asyncHandler(
        async (
            req: RequireAuthRequest & {
                body: CreateWorkspaceSchema;
            },
            res: Response<CreateWorkspaceResponse>
        ) => {
            const { success, error, data } = createWorkspaceSchema.safeParse(req.body);
            if (!success) {
                throw new APIError(400, {
                    code: "validation_error",
                    message: error.issues[0].message,
                });
            }

            const { workspace } = await workspaceService.createWorkspace({
                userId: req.session.user.id,
                ...data,
            });

            res.status(201).json(workspace);
        }
    ),
};
