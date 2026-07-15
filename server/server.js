import app from "./src/app.js";
import connectDB from "./db/db.js";
import config from "./config/config.js";

connectDB();

app.listen(config.Port, () => {
    console.log(`Server is running on port ${config.Port}`);
});