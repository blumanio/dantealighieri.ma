// models/courses.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  nome: {
    type: String,
    trim: true // Good practice to trim whitespace
  },
  link: {
    type: String,
    trim: true
  },
  tipo: {
    type: String,
    trim: true
  },
  uni: {
    type: String,
    trim: true
  },
  accesso: {
    type: String,
    trim: true
  },
  area: {
    type: String,
    trim: true
  },
  lingua: {
    type: String,
    trim: true
  },
  comune: {
    type: String,
    trim: true
  }
}, {
  // Optional: Add timestamps (createdAt, updatedAt) if needed
  // timestamps: true
});

// Create the model from the schema
// Mongoose will automatically look for the plural, lowercased version
// of your model name for the collection (e.g., 'courses')
const Course = mongoose.model("Course", courseSchema);

// Export the model so it can be imported elsewhere
export default Course;