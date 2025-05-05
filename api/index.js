// api/index.js
import app from '../server/api/index.js';

// More robust handler for Vercel
export default async function handler(req, res) {
  // Add a check to help debug the path issue
  console.log('Vercel handler received request for:', req.url);
  
  // Handle favicon.ico requests directly
  if (req.url === '/favicon.ico') {
    res.status(204).end(); // No content for favicon
    return;
  }
  
  try {
    // Forward all requests to your Express app
    return app(req, res);
  } catch (error) {
    console.error('Error in Vercel handler:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}