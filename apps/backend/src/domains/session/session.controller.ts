import { SessionAPIContext } from "@repo/types";
import { Request, Response } from "express";
import { IS_PROD } from "../../configs/constants.js";
import { asyncHandler } from "../../helpers/async-handler.js";
import { AuthContext } from "../../types/auth-context.js";
import { sessionService } from "./session.service.js";

export const sessionController = {
    get: asyncHandler(
        async (
            req: Request & {
                authContext: AuthContext;
            },
            res: Response<{ session: SessionAPIContext }>
            // eslint-disable-next-line @typescript-eslint/require-await
        ) => {
            const { session } = req.authContext;
            res.json({ session });
        }
    ),
    getAll: asyncHandler(
        async (
            req: Request & {
                authContext: AuthContext;
            },
            res
        ) => {
            const {
                session: { user },
            } = req.authContext;
            const { sessions } = await sessionService.getAll(user.id);
            res.json({ sessions });
        }
    ),
    delete: asyncHandler(
        async (
            req: Request & {
                authContext: AuthContext;
                params: { id: string };
            },
            res
        ) => {
            const { session } = req.authContext;
            await sessionService.delete({
                userId: session.user.id,
                sessionId: req.params.id,
            });

            if (req.params.id === session.id) {
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
