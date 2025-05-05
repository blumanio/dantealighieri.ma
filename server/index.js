// index.js (Updated)

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// --- Import Routers ---
// Make sure these paths are correct relative to your index.js file
import postRoutes from "./routes/posts.js";
import autoPostRoutes from "./routes/autoPost.js";
import generatedPostRoutes from './routes/generatedPosts.js';
import coursesRoutes from './routes/courses.js';
// No need to import Models here unless used directly in this file for other logic

dotenv.config();

const app = express();

// --- Middleware setup ---
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Configure CORS
const allowedOrigins = ["https://studentitaly.it", "http://localhost:3000"];
console.log("Initializing server setup..."); // Log startup

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    // Also allow requests from specified origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS denied for origin: ${origin}`); // Log denied origins
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // If you need cookies/authorization headers
  optionsSuccessStatus: 200, // For legacy browser compatibility
};

app.use(cors(corsOptions)); // Apply CORS middleware
app.options("*", cors(corsOptions)); // Enable pre-flight requests for all routes

// Standard Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MongoDB connection setup ---
const CONNECTION_URL = process.env.MONGODB_URI || "mongodb+srv://medlique:HXRMVGMsPpdCjDSt@cluster0.4d0iacb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Mongoose configuration (optional but recommended)
mongoose.set("strictQuery", false); // Prepare for Mongoose 7 behavior

// Database connection management for serverless
let dbConnection = null;
const connectDB = async () => {
  // READ_ONLY means the function is already connected or connecting
  if (mongoose.connection.readyState >= 1) {
    console.log("Using existing MongoDB connection.");
    return;
  }

  try {
    console.log("Attempting new MongoDB connection...");
    await mongoose.connect(CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // serverSelectionTimeoutMS: 5000 // Optional: Fail fast if connection takes too long
    });
    console.log("Connected to MongoDB successfully.");
    dbConnection = mongoose.connection; // Store connection if needed elsewhere
  } catch (error) {
    console.error("--- MONGODB CONNECTION ERROR ---");
    console.error("Connection string used:", CONNECTION_URL.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://[USERNAME]:[PASSWORD]@'));
    console.error("Error details:", error);
    console.error("--- END MONGODB CONNECTION ERROR ---");
    // Exit process might be too harsh for serverless, re-throw instead
    // process.exit(1);
    throw new Error("Database connection failed"); // Make sure subsequent requests fail clearly
  }
};

// Middleware to ensure DB connection before handling API requests
app.use(async (req, res, next) => {
  // Exclude non-API routes if necessary, though typically all routes here are API
  if (!req.path.startsWith('/api/') && !req.path.startsWith('/')) { // Adjust condition if needed
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (dbError) {
    console.error("DB Middleware caught connection error:", dbError.message);
    res.status(503).json({ error: "Service Unavailable - Database connection failed" }); // 503 Service Unavailable
  }
});


// --- API ROUTES ---
// Mount routers WITHOUT the /api prefix.
// Vercel's rewrite rule (`/api/(.*)` -> `/index.js`) handles the /api part externally.
// Express internally sees paths like `/posts`, `/generated-posts`, etc.
app.use("/posts", postRoutes);
app.use("/generated-posts", generatedPostRoutes);
app.use("/autopost", autoPostRoutes);
app.use("/courses", coursesRoutes);

// --- Optional: Logging Middleware (place after routes if you only want to log successful routes) ---
// app.use((req, res, next) => { ... });

// --- Catch-all for API routes not handled above ---
// This handles requests like /api/nonexistentroute
app.use('/api/*', (req, res) => {
  console.log(`API route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "API endpoint not found", path: req.originalUrl });
});

// --- Optional: General 404 handler for any other request not caught (if needed) ---
// Placed last, it catches anything not matched by previous routes or API 404
// app.use((req, res) => {
//   res.status(404).send('Resource not found');
// });


// --- Export the app for Vercel ---
// DO NOT include app.listen() - Vercel handles this.
export default app;