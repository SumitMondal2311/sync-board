import { Router } from "express";
import { requireBodyMiddleware } from "../../middlewares/require-body.js";
import { boardController } from "./board.controller.js";

export const boardRouter: Router = Router();
boardRouter.post("/", requireBodyMiddleware, boardController.create);
boardRouter.get("/", boardController.getList);
