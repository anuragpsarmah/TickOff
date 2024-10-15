import mongoose from "mongoose";
import { dbName } from "../constants.js";

export const dbConnect = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${process.env.dbName}`
        );
        console.log(
            `Database connected successfully at host: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log("Error connecting to database.", error);
        throw error;
    }
};
