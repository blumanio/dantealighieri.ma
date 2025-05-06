export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok',
    message: 'Server is running correctly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
}