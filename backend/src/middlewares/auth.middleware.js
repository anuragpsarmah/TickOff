import jwt from "jsonwebtoken";
import { response } from "../utils/response.util.js";

export const authValidation = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    console.log(accessToken);

    if (!accessToken) return response(res, 401, "Unauthorized Access");

    jwt.verify(accessToken, process.env.JWT_KEY, (error, decoded) => {
        if (error) return response(res, 401, "Unauthorized Access");

        req.user = decoded;
        next();
    });
};
