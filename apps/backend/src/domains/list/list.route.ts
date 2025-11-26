import { Router } from "express";
import { requireBodyMiddleware } from "../../middlewares/require-body.js";
import { listController } from "./list.controller.js";

export const listRouter: Router = Router();
listRouter.post("/", requireBodyMiddleware, listController.create);
