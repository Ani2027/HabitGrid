import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"; // ye dekhta hai ki user kaun hai aur uska token valid hai ya nahi
import config from "../config/config.js";

// Bug fix: centralize cookie options — secure:false + sameSite:"lax" in dev so cookies
// work over HTTP (localhost). In production (HTTPS) both are set to true/"strict".
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,             // BUG FIX: was always true, broke localhost (HTTP)
    sameSite: isProduction ? "strict" : "lax", // BUG FIX: "strict" blocked cross-port dev cookies
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please fill in all fields"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const userExist = await userModel.findOne({
            $or: [
                { username },
                { email },
            ]
        });

        if (userExist) {
            return res.status(409).json({
                message: "Username or email already exist",
            });
        }

        const user = await userModel.create({ username, email, password });

        // const token = jwt.sign({ id: user._id }, config.JWTSecret, { expiresIn: "1d" }); // yahan token generate kar rahe hai, jo ki user ke id ke sath sign kiya gaya hai aur 1 din ke liye valid hoga. (Ye 1 day hai and that is enough for our purpose, but in real world application, we can make it 1 hour or 1 minute or 1 second, depending on the requirement.)

        // Ab dikkat aati hai ki if A ka token B ko mil jaye to B A ke account me login kar sakta hai, to hm use krte hain accesstoken & refreshtoken, jisme accesstoken short time ke liye valid hota hai aur refreshtoken long time ke liye valid hota hai.

        const accessToken = jwt.sign({ id: user._id, type: "access" }, config.JWTSecret, { expiresIn: "15m" }); // ye 15 minute ke liye valid hoga, isse hm access token bolte hain.

        const refreshToken = jwt.sign({ id: user._id, type: "refresh" }, config.JWTSecret, { expiresIn: "7d" }); // ye 7 din ke liye valid hoga, isse hm refresh token bolte hain.

        // res.cookie("refreshToken", refreshToken, {
        //     httpOnly: true, // ye islie use hota hai ki client side javascript se access na ho sake, sirf server se access ho sake.
        //     secure: true, // ye islie use hota hai ki sirf https me hi cookie send ho, http me nahi.
        //     sameSite: "strict", // ye islie use hota hai ki cross site request me cookie send na ho, sirf same site request me hi cookie send ho.
        //     maxAge: 7 * 24 * 60 * 60 * 1000, // ye islie use hota hai ki cookie ka expiration time set ho, yahan 7 din ke liye set kiya gaya hai.
        // });
        res.cookie("refreshToken", refreshToken, cookieOptions);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                // _id: user._id,
                username: user.username,
                email: user.email,
            },
            accessToken, // ise to body me bhejna jaroori hota hai. Ye to memory me store hota hai.
            // We can store in local storage, but it is not secure and also not stored in cookies because not secure coz it can be accessed by javascript.
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export async function login(req, res) {
    try{
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill in all fields"
            });
        }

        const user = await userModel.findOne({email}).select("+password"); // We have set password:false in user model so we have to explicitly request for passworrd field by using select("+password") method.

        // 404 : Not Found
        // 401 : Unauthorized
        // We will use 401 Unauthorized because user is not authorized to access the resource. Because if we respond 404 Not Found then if attacker try to bruute force emails then he will get to know which email is registered and which is not. So we will use 401 Unauthorized.
        if(!user){
            return res.status(401).json({
                message: "User Unauthorized",
            });
        }

        const isPasswordValid = await user.checkPassword(password); // checkPassword is a schema method which we have defined in user model to compare the password with the hashed password in the database.

        if(!isPasswordValid){
            return res.status(401).json({
                message: "User Unauthorized",
            });
        }

        const accessToken = jwt.sign({ id: user._id, type: "access" }, config.JWTSecret, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user._id, type: "refresh" }, config.JWTSecret, { expiresIn: "7d" });

        // res.cookie("refreshToken", refreshToken, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "strict",
        //     maxAge: 7 * 24 * 60 * 60 * 1000,
        // });
        
        res.cookie("refreshToken", refreshToken, cookieOptions);

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                username: user.username,
                email: user.email,
            },
            accessToken,
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export async function getMe(req, res) {
    const token = req.headers.authorization?.split(" ")[1]; // ye dekhta hai ki authorization header me token hai ya nahi, agar hai to usko split karke second part (token) ko le leta hai, agar nahi hai to undefined return karta hai.

    // hm split is lie kr rhe hain kyunki authorization header me first part "Bearer" hota hai aur second part token hota hai, to hme second part chahiye jo ki token hai.

    // bearer kya hota hai? Bearer ek type of authentication scheme hai jo ki authorization header me use hota hai. Ye basically ye batata hai ki hme token ke sath authenticate karna hai. To authorization header me "Bearer <token>" hota hai, jahan <token> hme token ke sath replace karna hai.

    if (!token) {
        return res.status(401).json({
            message: "Token not found",
        });
    }

    try {
        const decoded = jwt.verify(token, config.JWTSecret); // ye dekhta hai ki token valid hai ya nahi, agar valid hai to decoded me user ka id aa jata hai, agar invalid hai to error throw karta hai.

        // console.log(decoded); //used for debugging purpose, to check if the token is valid and decoded properly.

        if (decoded.type !== "access") {
            return res.status(401).json({
                message: "Invalid token type",
            });
        }

        const user = await userModel.findById(decoded.id).select("-password"); // ye dekhta hai ki user exist karta hai ya nahi, agar exist karta hai to user ka data return karta hai, agar nahi karta hai to null return karta hai. (jo id mili hai use macth kr rhe hain db me)

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "User found",
            user: {
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message: "Invalid token",
        });
    }
};

export async function refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken; // ye dekhta hai ki refresh token cookie me hai ya nahi, agar hai to usko le leta hai, agar nahi hai to undefined return karta hai.

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token not found",
        });
    }

    // Below code is used to verify the refresh token, if it is valid then we can generate a new access token and send it to the client, if it is invalid then we can send an error message to the client.
    try {
        const decoded = jwt.verify(refreshToken, config.JWTSecret);

        const user = await userModel.findById(decoded.id).select("-password"); // ye dekhta hai ki user exist karta hai ya nahi.

        if(!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        
        const accessToken = jwt.sign({ id: decoded.id, type: "access" }, config.JWTSecret, { expiresIn: "15m" }); // ye access toke  15 minute ke liye valid hoga.

        const newRefreshToken = jwt.sign({ id: decoded.id, type : "refresh" }, config.JWTSecret, { expiresIn: "7d" }); // ye refresh token 7 din ke liye valid hoga.

        // res.cookie("refreshToken", newRefreshToken, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "strict",
        //     maxAge: 7 * 24 * 60 * 60 * 1000,
        // });
        
        res.cookie("refreshToken", newRefreshToken, cookieOptions);

        return res.status(200).json({
            message: "Access token generated successfully",
            accessToken,
        });

    } catch (error) {
        console.error(error);

        return res.status(401).json({
            message: "Invalid refresh token",
        });
    }

    /*
        Beginner error : I had put this statement outside the tryblock. Which was causing the error "decoded is not defined".
        
        const accessToken = jwt.sign({ id: decoded.id }, config.JWTSecret, { expiresIn: "15m" }); // ye access toke  15 minute ke liye valid hoga.

        res.status(200).json({
            message: "Access token generated successfully",
            accessToken,
        });
    */
};

export async function logout(req, res) {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "strict" : "lax",
        });
        return res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}