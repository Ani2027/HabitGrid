import mongoose from 'mongoose';
import config from '../config/config.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.MongoURL);
        console.log(`MongoDB connection succesful : ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB conncetion error : ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;