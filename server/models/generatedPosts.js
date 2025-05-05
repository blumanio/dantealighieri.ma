// models/generatedPosts.js
import mongoose from 'mongoose';

// Define the nested schema for frontmatter first
const frontmatterSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  date: { type: Date, required: true, default: Date.now }, // Store as Date object
  excerpt: { type: String, trim: true },
  author: { type: String, trim: true, default: 'Studentitaly Staff' },
  tags: { type: [String], default: [] }, // Array of strings
  coverImage: { type: String, trim: true }, // URL or path to image
  language: { type: String, trim: true }, // Might be redundant if using top-level lang
  originalUrl: { type: String, trim: true } // If applicable
  // Add any other frontmatter fields you need
}, { _id: false }); // Don't create a separate _id for the subdocument

// Define the main schema for the generated post
const generatedPostSchema = new mongoose.Schema({
  slug: { 
    type: String,
    required: true,
    trim: true,
    lowercase: true, // Good for slugs
    index: true // Index for faster lookups by slug
  },
  lang: {
    type: String,
    required: true,
    trim: true,
    lowercase: true, // Good for language codes
    index: true // Index for faster lookups/filtering by language
  },
  content: {
    type: String,
    required: true
  },
  frontmatter: frontmatterSchema // Embed the frontmatter schema
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Optional: Add a compound index if the combination of slug and lang must be unique
generatedPostSchema.index({ slug: 1, lang: 1 }, { unique: true });

// Optional: Index the date within frontmatter for sorting performance
generatedPostSchema.index({ "frontmatter.date": -1 });

// Create the model
const GeneratedPost = mongoose.model("GeneratedPost", generatedPostSchema);

// Export the model
export default GeneratedPost;