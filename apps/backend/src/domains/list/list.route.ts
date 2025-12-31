import { Router } from "express";

import { requireAuthMiddleware } from "@/middlewares/require-auth.js";
import { requireBodyMiddleware } from "@/middlewares/require-body.js";
import { requireWorkspaceMiddleware } from "@/middlewares/require-workspace.js";
import { listController } from "./list.controller.js";

export const listRouter: Router = Router();
listRouter.use(requireAuthMiddleware, requireWorkspaceMiddleware);
listRouter.post("/", requireBodyMiddleware, listController.create);
listRouter.get("/", listController.getList);
