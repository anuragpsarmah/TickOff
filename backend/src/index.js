import dotenv from "dotenv";
import { dbConnect } from "./db/dbConnect.js";
import { dbRetries } from "./constants.js";
import { app } from "./app.js";

dotenv.config();

await (async () => {
    let retries = dbRetries;
    while (retries--) {
        try {
            console.log("Trying to connect to database");
            await dbConnect();
            break;
        } catch (error) {
            if (!retries) process.exit(1);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
