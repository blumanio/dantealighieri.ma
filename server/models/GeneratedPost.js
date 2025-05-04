import mongoose from "mongoose";

// Define the structure for the nested frontmatter object
// This provides better validation and clarity
const frontmatterSchemaDefinition = {
    title: {
        type: String,
        required: [true, 'Frontmatter title is required.'],
        trim: true,
    },
    date: { // Renamed from publishedDate, now inside frontmatter
        type: Date,
        required: [true, 'Frontmatter date is required.'],
        // default: Date.now // Default can be set when creating if needed
    },
    excerpt: {
        type: String,
        trim: true,
    },
    author: { // Renamed from authorName, now inside frontmatter
        type: String,
        required: [true, 'Frontmatter author is required.'],
    },
    tags: {
        type: [String],
        default: [],
    },
    // --- Keep other relevant metadata fields inside frontmatter ---
    language: { // Optional: keep original language info if needed
        type: String,
        trim: true,
    },
    originalUrl: { // Moved inside frontmatter
        type: String,
        // required: true, // Decide if still required
    }
    // Add other frontmatter fields like coverImage if necessary
    // coverImage: { type: String }
};

const generatedPostSchema = new mongoose.Schema(
  {
    // --- Top-level fields ---
    slug: {
      type: String,
      required: [true, 'Slug is required.'],
      trim: true,
      // Unique index combined with lang below is usually better
    },
    lang: { // Use 'lang' for the primary language code
      type: String,
      required: [true, 'Language code (lang) is required.'],
      trim: true,
      lowercase: true, // Good practice for language codes
    },
    content: {
      type: String,
      required: [true, 'Content is required.'],
    },
    // --- Nested frontmatter object ---
    frontmatter: {
      type: frontmatterSchemaDefinition, // Use the definition above
      required: [true, 'Frontmatter object is required.'],
      _id: false // No separate _id for the subdocument needed
    }
    // Removed flat fields: title, authorName, excerpt, tags, language, originalUrl, publishedDate
  },
  {
    timestamps: true, // Keeps createdAt and updatedAt (correct)
  }
);

// --- Indexes ---
// Index for unique combination of language and slug
generatedPostSchema.index({ lang: 1, slug: 1 }, { unique: true });

// Index for potentially querying by language and date (for sorting blog lists)
generatedPostSchema.index({ lang: 1, "frontmatter.date": -1 });


// Prevent model overwrite errors in development
const GeneratedPost = mongoose.models.GeneratedPost || mongoose.model("GeneratedPost", generatedPostSchema);

export default GeneratedPost;