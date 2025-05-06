import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Express server is running correctly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

export default router;