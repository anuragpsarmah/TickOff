import { Schema, model } from "mongoose";

const todoCategorySchema = Schema(
    {
        categoryName: {
            type: String,
            required: [true, "Category name is required"],
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Userid is required"],
        },
        todos: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

export const todoCategory = model("ToDoCategory", todoCategorySchema);
