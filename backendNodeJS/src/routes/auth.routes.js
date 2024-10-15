import { Router } from "express";
import {
    loginUser,
    logout,
    registerUser,
    validation,
} from "../controllers/auth.controller.js";
import { authValidation } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.route("/register").post(registerUser);
authRouter.route("/login").post(loginUser);
authRouter.route("/logout").post(logout);
authRouter.route("/validation").get(authValidation, validation)