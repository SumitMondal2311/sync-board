import { CreateTaskSchema, QUERY_PARAMS } from "@repo/types";
import { createTaskSchema } from "@repo/validation";

import { APIError } from "../../helpers/api-error.js";
import { asyncHandler } from "../../helpers/async-handler.js";
import { RequireAuthRequest, RequireWorkspaceRequest } from "../../types/custom-request.js";
import { taskService } from "./task.service.js";

export const taskController = {
    create: asyncHandler(
        async (
            req: RequireAuthRequest &
                RequireWorkspaceRequest & {
                    query: {
                        [QUERY_PARAMS.board_id]?: string;
                        [QUERY_PARAMS.list_id]?: string;
                    };
                    body: CreateTaskSchema;
                },
            res
        ) => {
            const { success, error, data } = createTaskSchema.safeParse(req.body);
            if (!success) {
                throw new APIError(400, {
                    code: "validation_error",
                    message: error.issues[0].message,
                });
            }

            const boardId = req.query[QUERY_PARAMS.board_id];
            const listId = req.query[QUERY_PARAMS.list_id];
            if (!boardId || !listId) {
                throw new APIError(400, {
                    code: "missing_parameter",
                    message: "Required parameter is missing.",
                });
            }

            if (!req.workspacePolicy.canCreateTasks()) {
                throw new APIError(403, {
                    code: "forbidden",
                    message: "Action not permitted.",
                });
            }

            await taskService.create({
                workspaceId: req.activeWorkspaceId,
                listId,
                boardId,
                userId: req.session.user.id,
                ...data,
            });

            res.status(201).json({ success: true });
        }
    ),
};
