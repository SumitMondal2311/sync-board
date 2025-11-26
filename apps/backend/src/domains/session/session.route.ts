import { Router } from "express";
import { sessionController } from "./session.controller.js";

export const sessionRouter: Router = Router();
sessionRouter.get("/current", sessionController.get);
sessionRouter.get("/", sessionController.getActiveList);
sessionRouter.delete("/:id", sessionController.delete);
