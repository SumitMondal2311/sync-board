import { Router } from "express";

import { requireAuthMiddleware } from "@/middlewares/require-auth.js";
import { requireBodyMiddleware } from "@/middlewares/require-body.js";
import { requireWorkspaceMiddleware } from "@/middlewares/require-workspace.js";
import { boardController } from "./board.controller.js";

export const boardRouter: Router = Router();
boardRouter.use(requireAuthMiddleware, requireWorkspaceMiddleware);
boardRouter.post("/", requireBodyMiddleware, boardController.create);
boardRouter.get("/", boardController.getAll);
