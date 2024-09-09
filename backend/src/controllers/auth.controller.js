import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { response } from "../utils/response.util.js";

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (
        [username, email, password].some((item) => {
            return !item;
        })
    )
        return response(res, 400, "Missing fields received");

    try {
        const user = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (user) return response(res, 400, "User already exists");

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return response(res, 200, "User registered successfully");
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error", null, error);
    }
};

const loginUser = async (req, res) => {
    const { identifier, password } = req.body;

    if (!password || !identifier)
        return response(res, 400, "Missing fields received");

    try {
        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }],
        });

        if (!user) return response(res, 400, "User does not exist");

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return response(res, 401, "Invalid credentials");

        const accessToken = jwt.sign(
            {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            process.env.JWT_KEY,
            {
                expiresIn: "15m",
            }
        );

        const refreshToken = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_KEY,
            {
                expiresIn: "15d",
            }
        );

        user.refreshToken = refreshToken;
        await user.save();

        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
            })
            .json({
                message: "User logged in successfully",
                data: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
                error: "none",
            });
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error", null, error);
    }
};

const logout = async (req, res) => {
    const { userid } = req.body;

    if (!userid) return response(res, 400, "Failed to log out user");

    try {
        const user = await User.findOne({ _id: userid });

        user.refreshToken = "";

        await user.save();

        return res
            .status(200)
            .cookie("accessToken", "", {
                httpOnly: true,
                secure: true,
            })
            .cookie("refreshToken", "", {
                httpOnly: true,
                secure: true,
            })
            .json({
                message: "User logged in successfully",
                data: "none",
                error: "none",
            });
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error", null, error);
    }
};

const validation = async (req, res) => {
    return response(res, 200, "Validated successfully", req.user);
};

export { loginUser, registerUser, logout, validation };
