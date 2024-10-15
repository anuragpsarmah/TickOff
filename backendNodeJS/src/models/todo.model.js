import { Schema, model } from "mongoose";

const todoSchema = Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        deadline: {
            type: Date,
            required: [true, "Deadline is required"],
        },
        isComplete: {
            type: Boolean,
            default: false,
        },
        todoCategoryId: {
            type: Schema.Types.ObjectId,
            ref: "todoCategory",
            required: [true, "Todo Category Id is required"],
        },
    },
    { timestamps: true }
);

export const ToDo = model("ToDo", todoSchema);
