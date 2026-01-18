import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            return;
        }

        const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/amlgp';

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        // Do not exit process in serverless, just throw or let request fail
        throw new Error(`Database connection failed: ${error.message}`);
    }
};

export default connectDB;
