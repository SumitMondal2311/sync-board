import { CreateBoardResponse, CreateBoardSchema, GetBoardsResponse } from "@repo/types";
import { createBoardSchema } from "@repo/validation";
import { Response } from "express";

import { APIError } from "@/helpers/api-error.js";
import { asyncHandler } from "@/helpers/async-handler.js";
import { RequireAuthRequest, RequireWorkspaceRequest } from "@/types/custom-request.js";
import { boardService } from "./board.service.js";

export const boardController = {
    // ----------------------------------------
    // Create Board
    // ----------------------------------------

    create: asyncHandler(
        async (
            req: RequireAuthRequest &
                RequireWorkspaceRequest & {
                    body: CreateBoardSchema;
                },
            res: Response<CreateBoardResponse>
        ) => {
            const { success, error, data } = createBoardSchema.safeParse(req.body);
            if (!success) {
                throw new APIError(400, {
                    code: "validation_error",
                    message: error.issues[0].message,
                });
            }

            if (!req.workspacePolicy.canCreateBoards()) {
                throw new APIError(403, {
                    code: "forbidden",
                    message: "Current user is not allowed to perform this action.",
                });
            }

            const { board } = await boardService.create({
                userId: req.session.user.id,
                workspaceId: req.activeWorkspaceId,
                ...data,
            });

            res.status(201).json(board);
        }
    ),

    // ----------------------------------------
    // Get All Board
    // ----------------------------------------

    getAll: asyncHandler(async (req: RequireWorkspaceRequest, res: Response<GetBoardsResponse>) => {
        const { boards } = await boardService.getAll(req.activeWorkspaceId);
        res.status(200).json(boards);
    }),
};
