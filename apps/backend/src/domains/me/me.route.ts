import { Router } from "express";
import { meController } from "./me.controller.js";

export const meRouter: Router = Router();
meRouter.get("/", meController.get);
