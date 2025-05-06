// index.js (Updated)

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// --- Import Routers ---
import postRoutes from "../routes/posts.js";
import autoPostRoutes from "../routes/autoPost.js";
import generatedPostRoutes from '../routes/generatedPosts.js';
import coursesRoutes from '../routes/courses.js';
import healthcheckRouter from '../routes/healthcheck.js';
import testRouter from '../routes/test.js'; // Import the new test router

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
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS denied for origin: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MongoDB connection setup ---
const CONNECTION_URL = process.env.MONGODB_URI || "mongodb+srv://medlique:HXRMVGMsPpdCjDSt@cluster0.4d0iacb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.set("strictQuery", false);

let dbConnection = null;
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("Using existing MongoDB connection.");
    return;
  }

  try {
    console.log("Attempting new MongoDB connection...");
    await mongoose.connect(CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully.");
    dbConnection = mongoose.connection;
  } catch (error) {
    console.error("--- MONGODB CONNECTION ERROR ---");
    console.error("Connection string used:", CONNECTION_URL.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://[USERNAME]:[PASSWORD]@'));
    console.error("Error details:", error);
    console.error("--- END MONGODB CONNECTION ERROR ---");
    throw new Error("Database connection failed");
  }
};

// --- Direct Health check endpoint (keep this one direct for simplicity) ---
app.get('/api/health', (req, res) => {
  console.log("Health check endpoint accessed");
  res.status(200).json({
    status: 'ok',
    message: 'Express server is running correctly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root endpoint for easy testing
app.get('/', (req, res) => {
  console.log("Root endpoint accessed");
  res.status(200).json({
    message: 'Express server is running',
    endpoints: ['/api/health', '/api/test', '/api/test/ping']
  });
});

// Middleware to ensure DB connection before handling API requests
app.use(async (req, res, next) => {
  // Skip DB connection for health and test endpoints
  if (req.path === '/api/health' || req.path.startsWith('/api/test') || req.path === '/') {
    return next();
  }
  
  // For all other API routes, ensure DB connection
  try {
    await connectDB();
    next();
  } catch (dbError) {
    console.error("DB Middleware caught connection error:", dbError.message);
    res.status(503).json({ error: "Service Unavailable - Database connection failed" });
  }
});

// --- API ROUTES ---
const apiRouter = express.Router();
apiRouter.use("/posts", postRoutes);
apiRouter.use("/generated-posts", generatedPostRoutes);
apiRouter.use("/autopost", autoPostRoutes);
apiRouter.use("/courses", coursesRoutes);
apiRouter.use("/healthcheck", healthcheckRouter);
apiRouter.use("/test", testRouter); // Mount the test router

app.use("/api", apiRouter);

// --- Catch-all for API routes not handled above ---
app.use('/api/*', (req, res) => {
  console.log(`API route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "API endpoint not found", path: req.originalUrl });
});

// --- IMPORTANT: Start the server when running directly ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});

// --- Export the app for Vercel ---
export default app;