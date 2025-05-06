// client/lib/models/GeneratedPost.js
import mongoose from 'mongoose';

// Define the nested schema for frontmatter first
const frontmatterSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  date: { type: Date, required: true, default: Date.now },
  excerpt: { type: String, trim: true },
  author: { type: String, trim: true, default: 'Studentitaly Staff' },
  tags: { type: [String], default: [] },
  coverImage: { type: String, trim: true },
  language: { type: String, trim: true },
  originalUrl: { type: String, trim: true }
}, { _id: false });

const generatedPostSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  lang: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  frontmatter: frontmatterSchema
}, {
  timestamps: true
});

generatedPostSchema.index({ slug: 1, lang: 1 }, { unique: true });
generatedPostSchema.index({ "frontmatter.date": -1 });

// Important: Prevent Mongoose from recompiling the model
export default mongoose.models.GeneratedPost || mongoose.model("GeneratedPost", generatedPostSchema);