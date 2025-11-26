import { TaskSchema } from "@repo/types";
import { taskSchema } from "@repo/validation";
import { APIError } from "../../helpers/api-error.js";
import { asyncHandler } from "../../helpers/async-handler.js";
import { RequireAuthRequest, RequireWorkspaceRequest } from "../../types/custom-request.js";
import { taskService } from "./task.service.js";

export const taskController = {
    create: asyncHandler(
        async (
            req: RequireAuthRequest &
                RequireWorkspaceRequest & {
                    query: { board_id?: string; list_id?: string };
                    body: TaskSchema;
                },
            res
        ) => {
            if (!req.workspacePolicy.canCreateTasks()) {
                throw new APIError(403, {
                    message: "Current user is not allowed to perform this action.",
                    code: "forbidden_task_creation",
                });
            }

            const { board_id, list_id } = req.query;
            if (!board_id || !list_id) {
                throw new APIError(400, {
                    message: "Missing either of 'board_id' or 'list_id' param.",
                    code: "missing_query_param",
                });
            }

            const { success, error, data } = taskSchema.safeParse(req.body);
            if (!success) {
                throw new APIError(400, {
                    message: error.issues[0].message,
                    code: "validation_failed",
                });
            }

            const { id: userId, email } = req.session.user;
            await taskService.create({
                userId,
                email,
                input: data,
                boardId: board_id,
                listId: list_id,
                workspaceId: req.activeWorkspaceId,
            });

            res.status(201).json({ success: true });
        }
    ),
};
