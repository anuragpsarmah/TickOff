import { Router } from "express";
import { newAccessToken } from "../controllers/newAccessToken.controller.js";

export const tokenRouter = Router();

tokenRouter.route("/newToken").get(newAccessToken);
