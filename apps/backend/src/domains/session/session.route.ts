import { Router } from "express";

import { requireAuthMiddleware } from "@/middlewares/require-auth.js";
import { sessionController } from "./session.controller.js";

export const sessionRouter: Router = Router();
sessionRouter.use(requireAuthMiddleware);
sessionRouter.get("/current", sessionController.getCurrent);
sessionRouter.get("/", sessionController.listActive);
sessionRouter.delete("/:id", sessionController.delete);
