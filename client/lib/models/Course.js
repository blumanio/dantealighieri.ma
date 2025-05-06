// client/lib/models/Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  nome: {
    type: String,
    trim: true
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
  // timestamps: true // Optional
});

// Important: Prevent Mongoose from recompiling the model if it already exists
// This is crucial for Next.js hot-reloading and serverless environments
export default mongoose.models.Course || mongoose.model("Course", courseSchema);