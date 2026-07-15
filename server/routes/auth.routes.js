import { Router } from "express";
import * as authController from "../controllers/auth.cantroller.js"

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);


/*
 GET /api/auth/get-me
*/
authRouter.get("/getMe", authController.getMe);


/*
 GET /api/auth/refresh-token
*/
authRouter.get("/refreshToken", authController.refreshToken);


export default authRouter;