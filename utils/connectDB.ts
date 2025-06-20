/* eslint-disable */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL || process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define DATABASE_URL or MONGODB_URI');
}

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
};

export default connectDB;
