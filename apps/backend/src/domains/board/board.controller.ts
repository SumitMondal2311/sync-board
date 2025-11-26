import { TitleSchema } from "@repo/types";
import { titleSchema } from "@repo/validation";
import { APIError } from "../../helpers/api-error.js";
import { asyncHandler } from "../../helpers/async-handler.js";
import { RequireAuthRequest, RequireWorkspaceRequest } from "../../types/custom-request.js";
import { boardService } from "./board.service.js";

export const boardController = {
    // ----- Create Board Controller ----- //

    create: asyncHandler(
        async (
            req: RequireAuthRequest &
                RequireWorkspaceRequest & {
                    body: TitleSchema;
                },
            res
        ) => {
            if (!req.workspacePolicy.canCreateBoards()) {
                throw new APIError(403, {
                    message: "Current user is not allowed to perform this action.",
                    code: "forbidden_board_creation",
                });
            }

            const { success, error, data } = titleSchema.safeParse(req.body);
            if (!success) {
                throw new APIError(400, {
                    message: error.issues[0].message,
                    code: "validation_failed",
                });
            }

            const { id: userId, email } = req.session.user;
            await boardService.create({
                userId,
                email,
                workspaceId: req.activeWorkspaceId,
                ...data,
            });

            res.status(201).json({ success: true });
        }
    ),

    // ----- Get Boards Controller ----- //

    getList: asyncHandler(async (req: RequireWorkspaceRequest, res) => {
        const { boards } = await boardService.getList(req.activeWorkspaceId);
        res.status(200).json({ boards });
    }),
};
