import { AuthSchema, VerificationCodeSchema } from "@repo/types";
import { authSchema, verificationCodeSchema } from "@repo/validation";
import { Request } from "express";
import { IS_PROD, SESSION_EXPIRY } from "../../configs/constants.js";
import { APIError } from "../../helpers/api-error.js";
import { asyncHandler } from "../../helpers/async-handler.js";
import { normalizedIP } from "../../helpers/normalized-ip.js";
import { authService } from "./auth.service.js";

export const authController = {
    // -- -- -- -- -- Sign Up Controller -- -- -- -- -- //

    signUp: asyncHandler(
        async (
            req: Request & {
                body: AuthSchema;
            },
            res
        ) => {
            const { success, error, data } = authSchema.safeParse(req.body);
            if (!success) {
                throw new APIError(400, {
                    message: error.issues[0].message,
                    code: "validation_failed",
                });
            }

            const { token } = await authService.signUp(data);

            res.status(201).json({ token });
        }
    ),

    // -- -- -- -- -- Verify Sign Up Controller -- -- -- -- -- //

    verifySignUp: asyncHandler(
        async (
            req: Request & {
                body: VerificationCodeSchema;
                params: { token: string };
            },
            res
        ) => {
            const { success, error, data } = verificationCodeSchema.safeParse(req.body);
            if (!success) {
                throw new APIError(400, {
                    message: error.issues[0].message,
                    code: "validation_failed",
                });
            }

            const { sessionId } = await authService.verifySignUp({
                ipAddress: normalizedIP(req.ip || "unknown"),
                userAgent: req.headers["user-agent"] || "unknown",
                ...data,
                signUpToken: req.params.token,
            });

            res.cookie("__session_id", sessionId, {
                secure: IS_PROD,
                httpOnly: true,
                sameSite: "lax",
                maxAge: SESSION_EXPIRY * 1000,
            }).json({ success: true });
        }
    ),

    // -- -- -- -- -- Sign In Controller -- -- -- -- -- //

    signIn: asyncHandler(
        async (
            req: Request & {
                body: AuthSchema;
            },
            res
        ) => {
            const { success, error, data } = authSchema.safeParse(req.body);
            if (!success) {
                throw new APIError(400, {
                    message: error.issues[0].message,
                    code: "validation_failed",
                });
            }

            const { sessionId } = await authService.signIn({
                ...data,
                userAgent: req.headers["user-agent"] || "unknown",
                ipAddress: normalizedIP(req.ip || "unknown"),
            });

            res.cookie("__session_id", sessionId, {
                secure: IS_PROD,
                httpOnly: true,
                sameSite: "lax",
                maxAge: SESSION_EXPIRY * 1000,
            }).json({ success: true });
        }
    ),
};
