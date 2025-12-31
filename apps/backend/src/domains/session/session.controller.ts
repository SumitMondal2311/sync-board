import { GetActiveSessionsResponse, GetSessionResponse } from "@repo/types/api";
import { COOKIES } from "@repo/types/constants";
import { Response } from "express";

import { env } from "@/configs/env";
import { APIError } from "@/helpers/api-error";
import { asyncHandler } from "@/helpers/async-handler";
import { RequireAuthRequest } from "@/types/custom-request";
import { sessionService } from "./session.service";

export const sessionController = {
    // ----------------------------------------
    // Get Current Session
    // ----------------------------------------

    getCurrent: asyncHandler(
        async (
            req: RequireAuthRequest,
            res: Response<GetSessionResponse>
            // eslint-disable-next-line @typescript-eslint/require-await
        ) => {
            res.json(req.session);
        }
    ),

    // ----------------------------------------
    // List Active Sessions
    // ----------------------------------------

    listActive: asyncHandler(
        async (req: RequireAuthRequest, res: Response<GetActiveSessionsResponse>) => {
            const { activeSessions } = await sessionService.listActive(req.session.user.id);
            res.json(activeSessions);
        }
    ),

    // ----------------------------------------
    // Delete Session
    // ----------------------------------------

    delete: asyncHandler(
        async (
            req: RequireAuthRequest & {
                params: { id?: string };
            },
            res
        ) => {
            const sessionId = req.params.id;
            if (!sessionId) {
                throw new APIError(400, {
                    code: "missing_parameter",
                    message: "Required parameter is missing.",
                });
            }

            await sessionService.delete({
                userId: req.session.user.id,
                sessionId,
            });

            if (sessionId === req.session.id) {
                return res
                    .clearCookie(COOKIES.session_id, {
                        httpOnly: true,
                        maxAge: 0,
                        sameSite: "lax",
                        secure: env.isProd,
                    })
                    .json({ success: true });
            }

            res.json({ success: true });
        }
    ),
};
