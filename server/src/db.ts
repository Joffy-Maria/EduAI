import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            return;
        }

        const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/amlgp';

        // Check if we are trying to connect to localhost in reduced environments
        const isLocalhost = uri.includes('localhost') || uri.includes('127.0.0.1');

        await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);

        const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/amlgp';
        const isLocalhost = uri.includes('localhost') || uri.includes('127.0.0.1');

        if (isLocalhost) {
            console.error('\n\x1b[31m%s\x1b[0m', 'CRITICAL ERROR: You are trying to connect to a local database (localhost) but the connection failed.');
            console.error('\x1b[33m%s\x1b[0m', 'If this is a deployed application (Vercel, Render, Heroku, etc.), it CANNOT connect to your local computer.');
            console.error('\x1b[36m%s\x1b[0m', 'SOLUTION: You must use a cloud database like MongoDB Atlas.');
            console.error('1. Create a cluster on MongoDB Atlas.');
            console.error('2. Get the connection string (starting with mongodb+srv://...).');
            console.error('3. Set MONGODB_URI in your deployment environment variables.\n');
        }

        // Do not exit process in serverless, just throw or let request fail
        throw new Error(`Database connection failed: ${error.message}`);
    }
};

export default connectDB;
