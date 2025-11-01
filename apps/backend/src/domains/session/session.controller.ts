import { Request } from "express";
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
            res
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
                user: { id: userId },
            } = req.authContext;
            const { sessions } = await sessionService.getAll(userId);
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
            const { user, session } = req.authContext;
            await sessionService.delete({
                userId: user.id,
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
