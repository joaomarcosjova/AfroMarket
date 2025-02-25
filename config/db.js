import mongoose from "mongoose";

// Global cache object to store database connection
let cached = global.mongoose;

// If the cache doesn't exist, initialize it with default values
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connects to the MongoDB database using Mongoose.
 * 
 * - Uses a cached connection to prevent multiple connections in a serverless environment.
 * - If already connected, returns the existing connection.
 * - Otherwise, establishes a new connection and stores it in the cache.
 *
 * @returns {Promise<mongoose.Connection>} The established MongoDB connection.
 */
async function connectDB() {
    // If a connection already exists, return it immediately
    if (cached.conn) {
        return cached.conn;
    }

    // If no existing connection promise, create a new one
    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Disable buffering of commands before connecting
        };

        // Connect to the database using the provided MongoDB URI
        cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/kadoshsoftwares`, opts).then((mongoose) => {
            return mongoose;
        });
    }

    // Await the promise to resolve and store the connection
    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;
