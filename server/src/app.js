import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "../routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();

// ALLOWED_ORIGIN env var = your Vercel frontend URL in production
// e.g. https://habit-grid.vercel.app
// Falls back to localhost for local development
const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:5174";

app.use(cors({
    origin: allowedOrigin,
    credentials: true, // required so httpOnly refreshToken cookie is sent cross-origin
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth",authRouter);

export default app;