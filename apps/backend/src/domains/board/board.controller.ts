import { TitleSchema } from "@repo/types";
import { titleSchema } from "@repo/validation";
import { Request } from "express";
import { APIError } from "../../helpers/api-error.js";
import { asyncHandler } from "../../helpers/async-handler.js";
import { AuthContext } from "../../types/auth-context.js";
import { WorkspaceContext } from "../../types/workspace-context.js";
import { boardService } from "./board.service.js";

export const boardController = {
    create: asyncHandler(
        async (
            req: Request & {
                body: TitleSchema;
                authContext: AuthContext;
                workspaceContext: WorkspaceContext;
            },
            res
        ) => {
            const { success, error, data } = titleSchema.safeParse(req.body);
            if (!success) {
                throw new APIError(400, {
                    message: error.issues[0].message,
                    code: "validation_failed",
                });
            }

            const {
                workspaceContext: { workspace },
                authContext: {
                    session: { user },
                },
            } = req;

            await boardService.create({
                role: workspace.membership.role,
                emailAddress: user.emailAddress,
                userId: user.id,
                workspaceId: workspace.id,
                ...data,
            });

            res.status(201).json({ success: true });
        }
    ),
};
