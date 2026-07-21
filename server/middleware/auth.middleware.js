import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model.js";

/**
 * protect middleware
 * Verifies the Bearer access token from the Authorization header.
 * On success, attaches `req.user` with the user document (no password).
 * On failure, responds with 401 Unauthorized.
 */
export async function protect(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token not found" });
    }

    try {
        const decoded = jwt.verify(token, config.JWTSecret);

        if (decoded.type !== "access") {
            return res.status(401).json({ message: "Invalid token type" });
        }

        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // attach user to request for downstream handlers
        next();

    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
