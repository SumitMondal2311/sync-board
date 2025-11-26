import { TitleSchema } from "@repo/types";
import { titleSchema } from "@repo/validation";
import { APIError } from "../../helpers/api-error.js";
import { asyncHandler } from "../../helpers/async-handler.js";
import { RequireAuthRequest, RequireWorkspaceRequest } from "../../types/custom-request.js";
import { listService } from "./list.service.js";

export const listController = {
    create: asyncHandler(
        async (
            req: RequireAuthRequest &
                RequireWorkspaceRequest & {
                    query: { board_id?: string };
                    body: TitleSchema;
                },
            res
        ) => {
            const {
                workspacePolicy: { canCreateLists },
                activeWorkspaceId,
                session: {
                    user: { email, id: userId },
                },
            } = req;
            if (!canCreateLists()) {
                throw new APIError(403, {
                    message: "Current user is not allowed to perform this action.",
                    code: "forbidden_list_creation",
                });
            }

            const { board_id } = req.query;
            if (!board_id) {
                throw new APIError(400, {
                    message: "Missing 'board_id' param.",
                    code: "missing_query_param",
                });
            }

            const { success, error, data } = titleSchema.safeParse(req.body);
            if (!success) {
                throw new APIError(400, {
                    message: error.issues[0].message,
                    code: "validation_failed",
                });
            }

            await listService.create({
                userId,
                email,
                boardId: board_id,
                workspaceId: activeWorkspaceId,
                ...data,
            });

            res.status(201).json({ success: true });
        }
    ),
};
