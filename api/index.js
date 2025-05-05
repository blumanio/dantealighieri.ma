// /api/index.js
import app from '../server/api/index.js';

// Export a handler for Vercel serverless functions
export default async function handler(req, res) {
  // Forward all requests to your Express app
  return app(req, res);
}