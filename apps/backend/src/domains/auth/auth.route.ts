import { Router } from "express";
import { requireBodyMiddleware } from "../../middlewares/require-body.js";
import { authController } from "./auth.controller.js";

export const authRouter: Router = Router();
authRouter.post("/sign-up", requireBodyMiddleware, authController.signUp);
authRouter.post("/sign-up/:token/verify", requireBodyMiddleware, authController.verifySignUp);
