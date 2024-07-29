const express = require("express");
const router = express.Router();
const {
  registerUser,
  getUser,
  postUser,
  clerkMiddleware,
  requireSession,
} = require("../controllers/userController");

// Apply the Clerk middleware to authenticate requests
router.use(clerkMiddleware);

// POST /api/users/register - Register a new user
router.post("/register", requireSession, registerUser);

// GET /api/users - Retrieve all users
router.get("/", requireSession, (req, res) => {
  // Example implementation to retrieve users
  res.send("GET users");
});

// POST /api/users - Create a new user
router.post("/", requireSession, (req, res) => {
  // Example implementation to create a new user
  res.send("POST user");
});

module.exports = router;
