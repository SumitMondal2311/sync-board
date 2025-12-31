import {
    PrepareVerifyEmailResponse,
    SignInSchema,
    SignUpSchema,
    VerifyEmailSchema,
} from "@repo/types/api";

import { COOKIES } from "@repo/types/constants";
import { signInSchema, signUpSchema, verifyEmailSchema } from "@repo/validation";
import { Request, Response } from "express";

import { SESSION_EXPIRY, VERIFICATION_CODE_EXPIRY } from "@/configs/constants";
import { env } from "@/configs/env";
import { APIError } from "@/helpers/api-error";
import { asyncHandler } from "@/helpers/async-handler";
import { normalizedIP } from "@/helpers/normalized-ip";
import { authService } from "./auth.service";

export const authController = {
    // ----------------------------------------
    // Sign Up
    // ----------------------------------------

    signUp: asyncHandler(
        async (
            req: Request & {
                body: SignUpSchema;
            },
            res
        ) => {
            const { success, error, data } = signUpSchema.safeParse(req.body);
            if (!success) {
                throw new APIError(400, {
                    code: "validation_error",
                    message: error.issues[0].message,
                });
            }

            const { token } = await authService.signUp(data);

            res.status(201)
                .cookie(COOKIES.sign_up_attempt_token, token, {
                    httpOnly: true,
                    maxAge: VERIFICATION_CODE_EXPIRY * 1000,
                    sameSite: "lax",
                    secure: env.isProd,
                })
                .json({ success: true });
        }
    ),

    // ----------------------------------------
    // Prepare Verify Email
    // ----------------------------------------

    prepareVerifyEmail: asyncHandler(
        async (
            req: Request & {
                cookies: {
                    [COOKIES.sign_up_attempt_token]?: string;
                };
            },
            res: Response<PrepareVerifyEmailResponse>
        ) => {
            const token = req.cookies[COOKIES.sign_up_attempt_token];
            if (!token) {
                throw new APIError(400, {
                    code: "missing_token",
                    message: "Sign-up attempt token is missing.",
                });
            }

            const { email } = await authService.prepareVerifyEmail(token);
            const [username, domain] = email.split("@");

            res.json({
                maskedEmail:
                    username.charAt(0) +
                    "*".repeat(Math.max(username.length - 1, 1)) +
                    "@" +
                    domain,
            });
        }
    ),

    // ----------------------------------------
    // Attempt Verify Email
    // ----------------------------------------

    attemptVerifyEmail: asyncHandler(
        async (
            req: Request & {
                cookies: {
                    [COOKIES.sign_up_attempt_token]?: string;
                };
                body: VerifyEmailSchema;
            },
            res
        ) => {
            const token = req.cookies[COOKIES.sign_up_attempt_token];
            if (!token) {
                throw new APIError(400, {
                    code: "missing_token",
                    message: "Sign-up attempt token is missing.",
                });
            }

            const { success, error, data } = verifyEmailSchema.safeParse(req.body);
            if (!success) {
                throw new APIError(400, {
                    code: "validation_error",
                    message: error.issues[0].message,
                });
            }

            const { sessionId } = await authService.attemptVerifyEmail({
                token,
                ...data,
                ipAddress: normalizedIP(req.ip ?? "unknown"),
                userAgent: req.headers["user-agent"] ?? "unknown",
            });

            res.cookie(COOKIES.sign_up_attempt_token, "", {
                httpOnly: true,
                maxAge: 0,
                sameSite: "lax",
                secure: env.isProd,
            })
                .cookie(COOKIES.session_id, sessionId, {
                    httpOnly: true,
                    maxAge: SESSION_EXPIRY * 1000,
                    sameSite: "lax",
                    secure: env.isProd,
                })
                .json({ success: true });
        }
    ),

    // ----------------------------------------
    // Sign In
    // ----------------------------------------

    signIn: asyncHandler(
        async (
            req: Request & {
                body: SignInSchema;
            },
            res
        ) => {
            const { success, error, data } = signInSchema.safeParse(req.body);
            if (!success) {
                throw new APIError(400, {
                    code: "validation_error",
                    message: error.issues[0].message,
                });
            }

            const { sessionId } = await authService.signIn({
                ...data,
                ipAddress: normalizedIP(req.ip ?? "unknown"),
                userAgent: req.headers["user-agent"] ?? "unknown",
            });

            res.cookie(COOKIES.session_id, sessionId, {
                httpOnly: true,
                maxAge: SESSION_EXPIRY * 1000,
                sameSite: "lax",
                secure: env.isProd,
            }).json({ success: true });
        }
    ),
};
