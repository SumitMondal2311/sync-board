import { Router } from "express";

import { requireAuthMiddleware } from "../../middlewares/require-auth.js";
import { requireBodyMiddleware } from "../../middlewares/require-body.js";
import { requireWorkspaceMiddleware } from "../../middlewares/require-workspace.js";
import { taskController } from "./task.controller.js";

export const taskRouter: Router = Router();
taskRouter.use(requireAuthMiddleware, requireWorkspaceMiddleware);
taskRouter.post("/", requireBodyMiddleware, taskController.create);
