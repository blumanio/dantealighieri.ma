// client/lib/models/Course.js
import mongoose from 'mongoose';

// Destructure Schema from mongoose
const { Schema } = mongoose;

const DeadlineSchema = new Schema({ // Changed from mongoose.Schema to Schema
  deadlineType: { 
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true
  },
  description: { 
    type: String,
    trim: true,
    default: '', // Explicitly default to empty string
  },
  isRollingAdmission: { 
    type: Boolean,
    default: false
  },
  relatedLink: { 
    type: String,
    trim: true,
    default: '', // Explicitly default to empty string
  }
}, { _id: true }); // _id: true is default for subdocuments, but explicit is fine.

const courseSchema = new Schema({ // Changed from mongoose.Schema to Schema
  nome: {
    type: String,
    trim: true,
    // required: [true, 'Program name (nome) is required.'] // Retaining as commented, per user files
  },
  link: { 
    type: String,
    trim: true,
    // required: [true, 'Course link is required.']
  },
  tipo: { 
    type: String,
    trim: true
  },
  uni: { 
    type: String,
    trim: true,
    // required: [true, 'University name (uni) is required.']
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
    trim: true,
    // required: [true, 'Comune is required.']
  },
  // Note on Course.deadlines:
  // The current API logic in deadlineUtils.ts dynamically fetches/generates deadlines
  // based on italianUniversities data. This 'deadlines' array here is for storing
  // specific, official deadlines directly on the course document if available/scraped.
  // Ensure your data strategy aligns with whether this field will be populated and used
  // in conjunction with or instead of the dynamic deadline generation.
  deadlines: [DeadlineSchema], 
  academicYear: {
    type: String,
    trim: true
  },
  intake: {
    type: String,
    trim: true
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0 // Ensure count doesn't go negative
  },
  favoriteCount: {
    type: Number,
    default: 0,
    min: 0 // Ensure count doesn't go negative
  },
  trackedCount: {
    type: Number,
    default: 0,
    min: 0 // Ensure count doesn't go negative
  }
}, {
  timestamps: true
});

// Example: Index for searching, if needed
// courseSchema.index({ nome: 'text', uni: 'text', area: 'text' });

export default mongoose.models.Course || mongoose.model("Course", courseSchema);