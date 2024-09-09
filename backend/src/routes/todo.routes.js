import { Router } from "express";
import { authValidation } from "../middlewares/auth.middleware.js";
import {
    getToDoCategory,
    createToDoCategory,
    getToDo,
    createToDo,
    toggleToDo,
    deleteToDoCategory,
    deleteToDo,
} from "../controllers/todo.controller.js";

export const todoRouter = Router();

todoRouter.route("/getToDoCategory").get(authValidation, getToDoCategory);
todoRouter
    .route("/createToDoCategory")
    .post(authValidation, createToDoCategory);
todoRouter
    .route("/deleteToDoCategory")
    .delete(authValidation, deleteToDoCategory);
todoRouter.route("/getToDo").get(authValidation, getToDo);
todoRouter.route("/createToDo").post(authValidation, createToDo);
todoRouter.route("/deleteToDo").delete(authValidation, deleteToDo);
todoRouter.route("/toggleToDo").get(authValidation, toggleToDo);
