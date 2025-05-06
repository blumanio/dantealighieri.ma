import express from "express";
const router = express.Router();

// Simple test endpoint that doesn't require DB connection
router.get('/', (req, res) => {
  console.log("Test endpoint accessed");
  res.status(200).json({
    message: 'API test endpoint working',
    serverTime: new Date().toISOString(),
    route: 'test router'
  });
});

// Additional test endpoints can be added here
router.get('/ping', (req, res) => {
  res.status(200).json({
    message: 'pong',
    timestamp: new Date().toISOString()
  });
});

export default router;