import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import postRoutes from "./routes/posts.js";
import autoPostRoutes from "./routes/autoPost.js";
import GeneratedPost from "./models/GeneratedPost.js";
import { Webhook } from "svix";
import User from "./models/User.js";
import {
  uploadDocuments,
  getFilePath,
  generateFilename,
} from "./middleware/upload.js";

dotenv.config();

const app = express();

// Middleware setup
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
const allowedOrigins = ["https://studentitaly.it", "http://localhost:3000"];
console.log("index js ");

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection setup
const CONNECTION_URL =
  process.env.MONGODB_URI ||
  "mongodb+srv://medlique:HXRMVGMsPpdCjDSt@cluster0.4d0iacb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const PORT = process.env.PORT || 5000;

// Connect to MongoDB first
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB successfully");

    // Start the server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    console.error("Connection string:", CONNECTION_URL.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://[USERNAME]:[PASSWORD]@'));
    console.error("Error details:", JSON.stringify(error, null, 2));
  });

mongoose.set("strictQuery", false);

// Schema Definitions
// GeneratedPost model definition
// Somewhere in your index.js, add this code to check
// if the GeneratedPost model is properly registered


// Course Schema
const courseSchema = new mongoose.Schema({
  nome: String,
  link: String,
  tipo: String,
  uni: String,
  accesso: String,
  area: String,
  lingua: String,
  comune: String,
});

const Course = mongoose.model("Course", courseSchema);

// Application Schema
const applicationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    countryCode: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: true
    }
  },
  education: {
    degree: {
      type: String,
      required: true
    },
    graduationYear: {
      type: Number,
      required: true
    },
    points: {
      type: String,
      required: true
    }
  },
  studyPreference: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'processing', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);

// Route Handlers - Define these AFTER DB connection but BEFORE any middleware
// API Routes - moved to the top for priority

// Add this after your other routes in index.js
app.get('/api/generated-posts', async (req, res) => {
  console.log("Direct generated-posts handler called");
  try {
    const { lang } = req.query;
    let filter = {};
    if (lang) {
      filter.lang = lang;
    }

    const posts = await GeneratedPost.find(filter);
    console.log(`Found ${posts.length} posts`);

    res.status(200).json(posts.map(post => ({
      slug: post.slug,
      frontmatter: {
        title: post.title,
        date: post.date,
        excerpt: post.excerpt,
        author: post.author,
        tags: post.tags
      }
    })));
  } catch (error) {
    console.error("Error in direct handler:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/test-generated-posts', (req, res) => {
  console.log(">>> HIT /api/test-generated-posts route handler <<<"); // Add this line
  res.status(200).json({ message: 'Generated Posts test endpoint working' });
});
// API endpoint for generated posts (single post)
app.get('/api/generated-posts/:slug', async (req, res) => {
  console.log("Directly handling /api/generated-posts/:slug endpoint");
  const startTime = Date.now();
  console.log(`${new Date().toISOString()} - GET /api/generated-posts/${req.params.slug} - Request received.`);
  console.log('Params:', req.params);
  console.log('Query:', req.query);

  try {
    const { slug } = req.params;
    const { lang } = req.query;

    let filter = { slug };
    if (lang) {
      filter.lang = lang;
    }

    const post = await GeneratedPost.findOne(filter);

    if (!post) {
      console.log(`Post not found for filter: ${JSON.stringify(filter)}`);
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    console.log(`Found post with slug: ${post.slug}, lang: ${post.lang}`);

    res.status(200).json({
      slug: post.slug,
      lang: post.lang,
      content: post.content,
      frontmatter: {
        title: post.title,
        date: post.date,
        excerpt: post.excerpt,
        author: post.author,
        tags: post.tags,
        coverImage: post.coverImage
      }
    });
  } catch (error) {
    console.error(`[API Error] Error in single post handler:`, error);
    res.status(500).json({ success: false, error: 'Failed to fetch post' });
  }
});

// API endpoint for adjacent posts
app.get('/api/generated-posts/:slug/adjacent', async (req, res) => {
  console.log("Handling /api/generated-posts/:slug/adjacent endpoint");
  try {
    const { slug } = req.params;
    const { lang } = req.query;

    if (!lang) {
      return res.status(400).json({ error: 'Language parameter is required' });
    }

    // Get the current post's date to find prev/next
    const currentPost = await GeneratedPost.findOne({ slug, lang });

    if (!currentPost) {
      return res.status(404).json({ error: 'Current post not found' });
    }

    // Find previous post (published before this one)
    const prevPost = await GeneratedPost.findOne({
      lang,
      date: { $lt: currentPost.date }
    }).sort({ date: -1 }).select('slug title excerpt');

    // Find next post (published after this one)
    const nextPost = await GeneratedPost.findOne({
      lang,
      date: { $gt: currentPost.date }
    }).sort({ date: 1 }).select('slug title excerpt');

    res.status(200).json({
      prev: prevPost ? {
        slug: prevPost.slug,
        frontmatter: {
          title: prevPost.title,
          excerpt: prevPost.excerpt
        }
      } : null,
      next: nextPost ? {
        slug: nextPost.slug,
        frontmatter: {
          title: nextPost.title,
          excerpt: nextPost.excerpt
        }
      } : null
    });
  } catch (error) {
    console.error("Error fetching adjacent posts:", error);
    res.status(500).json({ error: "Failed to fetch adjacent posts" });
  }
});

// API endpoint for courses
app.get("/api/courses", async (req, res) => {
  try {
    const { tipo, accesso, lingua, area } = req.query;

    let query = {};

    if (tipo) {
      console.log("tipo", tipo);
      query.tipo = tipo;
    }
    if (lingua) {
      console.log("lingua", lingua);
      query.lingua = lingua;
    }
    if (area) {
      console.log("area", area);
      query.area = area;
    }
    if (accesso) {
      console.log("accesso", accesso);
      query.accesso = accesso;
    }
    console.log("query", query);

    const courses = await Course.find(query);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





// Webhook endpoint



// Router-based routes (no longer needed with direct handler functions)
// app.use("/api/posts", postRoutes);
// app.use('/api/generated-posts', generatedPostRoutes);
// app.use("/api/autopost", autoPostRoutes);

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Body:", JSON.stringify(req.body, null, 2));
  next();
});

// API 404 handler - must be last
app.use('/api/*', (req, res) => {
  console.log(`API route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "API endpoint not found", path: req.originalUrl });
});

export default app;