import { Router } from "express";
import { requireBodyMiddleware } from "../../middlewares/require-body.js";
import { taskController } from "./task.controller.js";

export const taskRouter: Router = Router();
taskRouter.post("/", requireBodyMiddleware, taskController.create);
