import { UserAPIContext } from "@repo/types";
import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/async-handler.js";
import { AuthContext } from "../../types/auth-context.js";

export const meController = {
    get: asyncHandler(
        async (
            req: Request & {
                authContext: AuthContext;
            },
            res: Response<{ user: UserAPIContext }>
            // eslint-disable-next-line @typescript-eslint/require-await
        ) => {
            res.json({ user: req.authContext.user });
        }
    ),
};
