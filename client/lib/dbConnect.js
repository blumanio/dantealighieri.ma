// client/lib/dbConnect.js
import mongoose from 'mongoose';

// Ensure MONGODB_URI is loaded from .env.local in your Next.js project
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongooseConnection;

if (!cached) {
    cached = global.mongooseConnection = { conn: null, promise: null };
}

async function dbConnect() {
    // If a connection already exists (from cache or previous call within the same lambda execution)
    if (cached.conn) {
        // Check if the connection is still active
        if (cached.conn.readyState >= 1) { // 1 for connected, 2 for connecting
            console.log("Using cached and active MongoDB connection.");
            return cached.conn;
        }
        // If readyState is 0 (disconnected) or 3 (disconnecting), nullify to attempt reconnection
        console.log("Cached connection found but not active (readyState: " + cached.conn.readyState + "). Attempting to reconnect.");
        cached.conn = null;
        cached.promise = null; // Reset promise to allow new connection attempt
    }

    // If a connection promise doesn't exist or was reset, create one
    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Disable Mongoose's buffering, good for explicit connection management
            // useNewUrlParser: true, // Deprecated in Mongoose 6+
            // useUnifiedTopology: true, // Deprecated in Mongoose 6+
        };

        console.log("Attempting new MongoDB connection...");
        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then((mongooseInstance) => {
                console.log("MongoDB connected successfully.");
                // mongooseInstance.connection is the actual Mongoose Connection object
                return mongooseInstance.connection;
            })
            .catch(error => {
                console.error("--- MONGODB CONNECTION ERROR (dbConnect.js) ---");
                // Sanitize connection string in logs as in your original code
                console.error("Connection string used (sanitized):", MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://[USERNAME]:[PASSWORD]@'));
                console.error("Error details:", error.message); // Log only error.message or specific fields if error object is too large
                if (error.reason) console.error("Error reason:", error.reason);
                console.error("--- END MONGODB CONNECTION ERROR ---");
                cached.promise = null; // Reset promise on error so next attempt will try to reconnect
                throw error; // Re-throw error to be caught by the API route handler
            });
    }

    try {
        // Await the promise to get the connection
        cached.conn = await cached.promise;
    } catch (e) {
        // If the promise rejected, it would have been handled above,
        // but ensure cached.promise is nullified if something else goes wrong here.
        cached.promise = null;
        throw e; // Re-throw the error
    }

    return cached.conn;
}

export default dbConnect;