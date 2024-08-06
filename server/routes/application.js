import express from "express";
import { createApplication } from "../controllers/applicationController.js";

const router = express.Router();

console.log("application js route");

// Logging middleware
router.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.originalUrl}`);
  next();
});

// Route definition
router.post(
  "/",
  (req, res, next) => {
    console.log(
      "Received application data in route:",
      JSON.stringify(req.body, null, 2)
    );
    next();
  },
  createApplication
);
// Error handling middleware
router.use((err, req, res, next) => {
  console.error("Router error:", err);
  res.status(500).json({
    success: false,
    message: "An error occurred in the server.",
    error: err.message,
  });
});

export default router;
