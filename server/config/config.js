import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URL) {
    throw new Error("MongoURL must be set");
}

if (!process.env.PORT) {
    throw new Error("PORT must be set");
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be set");
}

const config = {
    MongoURL: process.env.MONGO_URL,
    Port: process.env.PORT,
    JWTSecret: process.env.JWT_SECRET,
};

export default config;