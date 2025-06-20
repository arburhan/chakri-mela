/* eslint-disable */
import mongoose from 'mongoose';

// Define interface for cached connection
interface CachedConnection {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
}

// Extend global namespace
declare global {
    // eslint-disable-next-line no-var
    var mongoose: CachedConnection | undefined;
}

// Get database URL from environment
const DATABASE_URL = process.env.DATABASE_URL || process.env.MONGODB_URI;

if (!DATABASE_URL) {
    throw new Error('Please define DATABASE_URL or MONGODB_URI in your environment variables');
}

// Type assertion to ensure DATABASE_URL is string
const MONGODB_URI: string = DATABASE_URL;

// Initialize cached connection
let cached: CachedConnection = global.mongoose || {
    conn: null,
    promise: null,
};

// Cache the connection in development
if (process.env.NODE_ENV === 'development') {
    global.mongoose = cached;
}

/**
 * Connect to MongoDB database
 * @returns Promise<mongoose.Connection>
 */
async function connectDB(): Promise<mongoose.Connection> {
    // Return existing connection if available
    if (cached.conn) {
        return cached.conn;
    }

    // If no cached promise, create new connection
    if (!cached.promise) {
        const options = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
            console.log('✅ Database connected successfully');
            return mongoose.connection;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

export default connectDB;