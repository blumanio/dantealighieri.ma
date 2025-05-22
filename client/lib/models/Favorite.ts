import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: { // To store the ID of the user who favorited the course
    type: String,
    required: true,
    index: true, // Index for efficient querying of a user's favorites
  },
  courseUni: {
    type: String,
    required: true,
  },
  courseNome: {
    type: String,
    required: true,
  },
  courseLink: {
    type: String,
    required: true,
  },
  courseComune: {
    type: String,
    required: true,
  },
  // You could also store a unique identifier for the course if available
  // courseId: { type: String, required: true, unique: true } // Example
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Prevent OverwriteModelError which can occur in Next.js dev environment
export default mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);