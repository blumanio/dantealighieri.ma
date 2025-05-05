// routes/healthcheck.js
import express from 'express';

const router = express.Router();

// Handles GET requests to /healthcheck
// (because it will be mounted via app.use('/healthcheck', ...) in index.js)
router.get("/", (req, res) => {
  console.log("Health check route handler called!"); // Log access
  res.status(200).json({
    status: "OK",
    message: "Backend API is running",
    timestamp: new Date().toISOString()
  });
});

// Export the router
export default router;