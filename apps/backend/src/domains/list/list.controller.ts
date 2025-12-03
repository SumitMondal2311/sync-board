import {
    CreateListAPISuccessResponse,
    GetAllListsAPISuccessResponse,
    TitleSchema,
} from "@repo/types";
import { titleSchema } from "@repo/validation";
import { Response } from "express";
import { APIError } from "../../helpers/api-error.js";
import { asyncHandler } from "../../helpers/async-handler.js";
import { RequireAuthRequest, RequireWorkspaceRequest } from "../../types/custom-request.js";
import { listService } from "./list.service.js";

export const listController = {
    // ----- Create List Controller ----- //

    create: asyncHandler(
        async (
            req: RequireAuthRequest &
                RequireWorkspaceRequest & {
                    body: TitleSchema;
                    query: { board_id?: string };
                },
            res: Response<{ list: CreateListAPISuccessResponse }>
        ) => {
            const { workspacePolicy, query, body, session, activeWorkspaceId } = req;
            if (!workspacePolicy.canCreateLists()) {
                throw new APIError(403, {
                    message: "Current user is not allowed to perform this action.",
                    code: "forbidden_list_creation",
                });
            }

            const { board_id } = query;
            if (!board_id) {
                throw new APIError(400, {
                    message: "Missing 'board_id' param.",
                    code: "missing_query_param",
                });
            }

            const { success, error, data } = titleSchema.safeParse(body);
            if (!success) {
                throw new APIError(400, {
                    message: error.issues[0].message,
                    code: "validation_failed",
                });
            }

            const { id: userId, email } = session.user;
            const { list } = await listService.create({
                userId,
                email,
                boardId: board_id,
                workspaceId: activeWorkspaceId,
                ...data,
            });

            res.status(201).json({ list });
        }
    ),

    // ----- Get Lists Controller ----- //

    getList: asyncHandler(
        async (
            req: RequireWorkspaceRequest & {
                query: { board_id?: string };
            },
            res: Response<{ lists: GetAllListsAPISuccessResponse }>
        ) => {
            const { board_id } = req.query;
            if (!board_id) {
                throw new APIError(400, {
                    message: "Missing 'board_id' param.",
                    code: "missing_query_param",
                });
            }

            const { lists } = await listService.getList({
                boardId: board_id,
                workspaceId: req.activeWorkspaceId,
            });
            res.status(200).json({ lists });
        }
    ),
};
