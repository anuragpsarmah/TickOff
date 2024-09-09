import { response } from "../utils/response.util.js";
import { todoCategory } from "../models/todoCategory.model.js";
import { User } from "../models/user.model.js";
import { ToDo } from "../models/todo.model.js";
import { mongoose } from "mongoose";

const getToDoCategory = async (req, res) => {
    const user = req.user;

    if (!user)
        return response(res, 404, "Something went wrong. Clear cookies.");

    const userid = user.id;
    const userId = new mongoose.Types.ObjectId(userid);

    try {
        const todoCategories = await todoCategory
            .find({ userId: userId })
            .select(["-_id, -__v"]);

        return response(
            res,
            200,
            "Categories fetched successfully",
            todoCategories
        );
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error", null, error);
    }
};

const createToDoCategory = async (req, res) => {
    const user = req.user;

    if (!user)
        return response(res, 404, "Cannot fetch categories. Clear cookies.");

    const userid = user.id;
    const userId = new mongoose.Types.ObjectId(userid);

    const { categoryName } = req.body;

    if (!categoryName) return response(res, 400, "Category name is required");

    try {
        const category = await todoCategory.findOne({ categoryName, userId });
        if (category) return response(res, 400, "Category already exists");

        const newCategory = await todoCategory.create({
            categoryName,
            userId,
        });

        const userData = await User.findOne({ _id: userId });

        userData.categoryNames = [...userData.categoryNames, newCategory._id];

        await userData.save();

        return response(res, 200, "Category created successfully");
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error", null, error);
    }
};

const deleteToDoCategory = async (req, res) => {
    const user = req.user;

    if (!user)
        return response(res, 404, "Something went wrong. Clear cookies.");

    const id = req.query.id;

    if (!id) return response(res, 400, "Category id param was not sent");

    const deleteId = new mongoose.Types.ObjectId(id);
    const userId = new mongoose.Types.ObjectId(user.id);

    try {
        await todoCategory.deleteOne({ _id: deleteId });
        await ToDo.deleteMany({ todoCategoryId: deleteId });
        await User.updateOne(
            { _id: userId },
            { $pull: { categoryNames: deleteId } }
        );

        return response(res, 200, "Category deleted successfully");
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error", null, error);
    }
};

const getToDo = async (req, res) => {
    const user = req.user;

    if (!user)
        return response(res, 404, "Something went wrong. Clear cookies.");

    const categoryId = req.query.categoryId;

    if (!categoryId)
        return response(res, 400, "Category Id param not received");

    const todoCategoryId = new mongoose.Types.ObjectId(categoryId);

    try {
        const todos = await ToDo.find({
            todoCategoryId: todoCategoryId,
        }).select(["-_id, -__v"]);

        return response(res, 200, "ToDos fetched successfully", todos);
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error", null, error);
    }
};

const createToDo = async (req, res) => {
    const user = req.user;

    if (!user)
        return response(res, 404, "Something went wrong. Clear cookies.");

    const { title, description, deadline, todoCategoryId } = req.body;

    if (
        [title, description, deadline, todoCategoryId].some((item) => {
            return !item;
        })
    )
        return response(res, 400, "Missing fields were received");

    const newTodoCategoryId = new mongoose.Types.ObjectId(todoCategoryId);

    try {
        const todo = await ToDo.create({
            title,
            description,
            deadline,
            todoCategoryId: newTodoCategoryId,
        });

        const todoCategoryData = await todoCategory.findOne({
            _id: newTodoCategoryId,
        });
        todoCategoryData.todos = [...todoCategoryData.todos, todo._id];
        await todoCategoryData.save();

        return response(res, 200, "Todos added successfully");
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error", null, error);
    }
};

const toggleToDo = async (req, res) => {
    const user = req.user;

    if (!user)
        return response(res, 404, "Something went wrong. Clear cookies.");

    const todoId = req.query.todoId;

    if (!todoId) return response(res, 400, "ToDo Id param not received");

    const id = new mongoose.Types.ObjectId(todoId);

    try {
        const todos = await ToDo.findOne({ _id: id });
        todos.isComplete = !todos.isComplete;
        await todos.save();

        return response(
            res,
            200,
            "ToDo completion toggled successfully",
            todos
        );
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error", null, error);
    }
};

const deleteToDo = async (req, res) => {
    const user = req.user;

    if (!user)
        return response(res, 404, "Something went wrong. Clear cookies.");

    const todoId = req.query.id;

    if (!todoId) return response(res, 400, "ToDo Id param not received");

    const id = new mongoose.Types.ObjectId(todoId);

    try {
        const todo = await ToDo.findOne({ _id: id });

        await ToDo.deleteOne({ _id: id });

        const categoryId = new mongoose.Types.ObjectId(todo.todoCategoryId);

        await todoCategory.updateOne(
            { _id: categoryId },
            { $pull: { todos: id } }
        );

        return response(res, 200, "Todo deleted successfully");
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error", null, error);
    }
};

export {
    getToDoCategory,
    createToDoCategory,
    getToDo,
    createToDo,
    toggleToDo,
    deleteToDoCategory,
    deleteToDo,
};
