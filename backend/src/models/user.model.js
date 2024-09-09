import { Schema, model } from "mongoose";

const userSchema = Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            lowercase: true,
            minlength: [3, "Username must be at least 3 characters long"],
            maxlength: [10, "Username must be at most 10 characters long"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
        },
        categoryNames: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

export const User = model("User", userSchema);
