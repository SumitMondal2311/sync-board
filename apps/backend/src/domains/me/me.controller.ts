import { ChangePasswordSchema } from "@repo/types";
import { changePasswordSchema } from "@repo/validation";

import { APIError } from "@/helpers/api-error";
import { asyncHandler } from "@/helpers/async-handler";
import { RequireAuthRequest } from "@/types/custom-request";
import { meService } from "./me.service";

export const meController = {
    changePassword: asyncHandler(
        async (req: RequireAuthRequest & { body: ChangePasswordSchema }, res) => {
            const { success, error, data } = changePasswordSchema.safeParse(req.body);
            if (!success) {
                throw new APIError(400, {
                    code: "validation_error",
                    message: error.issues[0].message,
                });
            }

            const {
                id: sessionId,
                user: { id: userId },
            } = req.session;

            await meService.changePassword({
                sessionId,
                userId,
                ...data,
            });

            res.json({ success: true });
        }
    ),
};
