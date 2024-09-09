import jwt from "jsonwebtoken";
import { response } from "../utils/response.util.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const newAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return response(res, 401, "Refresh Token was not sent");

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_KEY);
        const userid = decoded.id;
        const id = new mongoose.Types.ObjectId(userid);

        const user = await User.findOne({ _id: id });

        if (!user) return response(res, 401, "Unauthorized access was found");

        if (refreshToken != user.refreshToken)
            return response(res, 401, "Unauthorized access was found");

        const newAccessToken = jwt.sign(
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

        const newRefreshToken = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_KEY,
            {
                expiresIn: "15d",
            }
        );

        user.refreshToken = newRefreshToken;
        await user.save();

        return res
            .status(200)
            .cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
            })
            .cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
            })
            .json({
                message: "User authorized successfully",
                data: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
                error: "none",
            });
    } catch (error) {
        response(res, 401, "Unauthorized access was found");
    }
};

export { newAccessToken };
