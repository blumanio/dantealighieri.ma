// api/index.js
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import routes from server directory
import postRoutes from "./server/routes/posts.js";
import autoPostRoutes from "./server/routes/autoPost.js";
import generatedPostRoutes from './server/routes/generatedPosts.js';
import coursesRoutes from './server/routes/courses.js';
import healthcheckRouter from './server/routes/healthcheck.js';
import testRouter from './server/routes/test.js';

// Rest of your server code...

// Mount API routes
const apiRouter = express.Router();
apiRouter.use("/posts", postRoutes);
apiRouter.use("/generated-posts", generatedPostRoutes);
apiRouter.use("/autopost", autoPostRoutes);
apiRouter.use("/courses", coursesRoutes);
apiRouter.use("/healthcheck", healthcheckRouter);
apiRouter.use("/test", testRouter);

app.use("/api", apiRouter);

export default app;