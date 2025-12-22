import { CreateListResponse, CreateListSchema, GetListsResponse, QUERY_PARAMS } from "@repo/types";
import { createListSchema } from "@repo/validation";
import { Response } from "express";

import { APIError } from "../../helpers/api-error.js";
import { asyncHandler } from "../../helpers/async-handler.js";
import { RequireAuthRequest, RequireWorkspaceRequest } from "../../types/custom-request.js";
import { listService } from "./list.service.js";

export const listController = {
    // ----------------------------------------
    // Create List
    // ----------------------------------------

    create: asyncHandler(
        async (
            req: RequireAuthRequest &
                RequireWorkspaceRequest & {
                    body: CreateListSchema;
                    query: {
                        [QUERY_PARAMS.board_id]?: string;
                    };
                },
            res: Response<CreateListResponse>
        ) => {
            const { success, error, data } = createListSchema.safeParse(req.body);
            if (!success) {
                throw new APIError(400, {
                    code: "validation_error",
                    message: error.issues[0].message,
                });
            }

            const boardId = req.query[QUERY_PARAMS.board_id];
            if (!boardId) {
                throw new APIError(400, {
                    code: "missing_parameter",
                    message: "Required parameter is missing.",
                });
            }

            if (!req.workspacePolicy.canCreateLists()) {
                throw new APIError(403, {
                    code: "forbidden",
                    message: "Action not permitted.",
                });
            }

            const { list } = await listService.create({
                userId: req.session.user.id,
                workspaceId: req.activeWorkspaceId,
                boardId,
                ...data,
            });

            res.status(201).json(list);
        }
    ),

    // ----------------------------------------
    // Get All List
    // ----------------------------------------

    getList: asyncHandler(
        async (
            req: RequireWorkspaceRequest & {
                query: {
                    [QUERY_PARAMS.board_id]?: string;
                };
            },
            res: Response<GetListsResponse>
        ) => {
            const boardId = req.query[QUERY_PARAMS.board_id];
            if (!boardId) {
                throw new APIError(400, {
                    code: "missing_parameter",
                    message: "Required parameter is missing.",
                });
            }

            const { lists } = await listService.getAll({
                workspaceId: req.activeWorkspaceId,
                boardId,
            });

            res.json(lists);
        }
    ),
};
