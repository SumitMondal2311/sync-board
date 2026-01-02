import { Router } from "express";

import { requireAuthMiddleware } from "@/middlewares/require-auth";
import { requireBodyMiddleware } from "@/middlewares/require-body";
import { meController } from "./me.controller";

export const meRouter: Router = Router();
meRouter.use(requireAuthMiddleware);
meRouter.patch("/change-password", requireBodyMiddleware, meController.changePassword);
