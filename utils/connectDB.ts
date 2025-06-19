/* eslint-disable */

import mongoose, { Mongoose } from 'mongoose';

interface CachedConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// Correctly extend the global namespace
declare global {
    // eslint-disable-next-line no-var
    var mongoose: CachedConnection | undefined;
}

const DATABASE_URL: string = process.env.DATABASE_URL!;

if (!DATABASE_URL) {
    throw new Error(
        'Please define the DATABASE_URL environment variable inside .env.local'
    );
}

// Initialize cached connection
let cached: CachedConnection = global.mongoose || {
    conn: null,
    promise: null,
};

// Only assign to global in development to prevent memory leaks in production
if (process.env.NODE_ENV === 'development') {
    global.mongoose = cached;
}

async function connectDB(): Promise<Mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose
            .connect(DATABASE_URL, opts)
            .then((mongoose) => {
                console.log('✅ Database connected successfully');
                return mongoose;
            })
            .catch((error) => {
                console.error('❌ Error connecting to database:', error);
                throw error;
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