import { Router } from "express";

import { requireBodyMiddleware } from "../../middlewares/require-body.js";
import { authController } from "./auth.controller.js";

export const authRouter: Router = Router();
authRouter.post("/sign-up", requireBodyMiddleware, authController.signUp);
authRouter.get("/verify-email/prepare", authController.prepareVerifyEmail);
authRouter.post("/verify-email/attempt", requireBodyMiddleware, authController.attemptVerifyEmail);
authRouter.post("/sign-in", requireBodyMiddleware, authController.signIn);
