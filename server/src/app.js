import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "../routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // React dev server URL
    credentials: true,              // allows cookies (refresh token) to be sent
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth",authRouter);

export default app;