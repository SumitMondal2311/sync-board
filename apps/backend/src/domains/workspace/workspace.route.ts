import { Router } from "express";

import { requireAuthMiddleware } from "@/middlewares/require-auth";
import { requireBodyMiddleware } from "@/middlewares/require-body";
import { workspaceController } from "./workspace.controller";

export const workspaceRouter: Router = Router();
workspaceRouter.use(requireAuthMiddleware);
workspaceRouter.post("/", requireBodyMiddleware, workspaceController.createWorkspace);
