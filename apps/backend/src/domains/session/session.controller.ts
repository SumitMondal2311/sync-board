import { SessionAPIContext } from "@repo/types";
import { Response } from "express";
import { IS_PROD } from "../../configs/constants.js";
import { APIError } from "../../helpers/api-error.js";
import { asyncHandler } from "../../helpers/async-handler.js";
import { RequireAuthRequest } from "../../types/custom-request.js";
import { sessionService } from "./session.service.js";

export const sessionController = {
    // ----- Get Session Controller ----- //

    get: asyncHandler(
        async (
            req: RequireAuthRequest,
            res: Response<{ session: SessionAPIContext }>
            // eslint-disable-next-line @typescript-eslint/require-await
        ) => {
            res.json({ session: req.session });
        }
    ),

    // ----- Get All Session Controller ----- //

    getActiveList: asyncHandler(async (req: RequireAuthRequest, res) => {
        const { sessions } = await sessionService.getActiveList(req.session.user.id);
        res.json({ sessions });
    }),

    // ----- Delete Session Controller ----- //

    delete: asyncHandler(
        async (
            req: RequireAuthRequest & {
                params: { id?: string };
            },
            res
        ) => {
            const { id: sessionId } = req.params;
            if (!sessionId) {
                throw new APIError(400, {
                    message: "Missing 'id: <session_id>' param.",
                    code: "missing_path_param",
                });
            }

            await sessionService.delete({
                userId: req.session.user.id,
                sessionId,
            });

            if (sessionId === req.session.id) {
                return res
                    .clearCookie("__session_id", {
                        secure: IS_PROD,
                        httpOnly: true,
                        sameSite: "lax",
                        maxAge: 0,
                    })
                    .json({ success: true });
            }

            res.json({ success: true });
        }
    ),
};
