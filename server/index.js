import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import postRoutes from "./routes/posts.js";
import { Webhook } from "svix";
import User from "./models/User.js";
import {
  uploadDocuments,
  getFilePath,
  generateFilename,
} from "./middleware/upload.js";

dotenv.config();

const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//app.use(express.static(path.join(__dirname, "../client/build")));

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
// const corsOptions = {
//   origin: [
//     "http://localhost:3000",
//     "https://dantealighieri.ma",
//     "https://frontend-git-main-mohamed-el-aammaris-projects.vercel.app",
//     "https://frontend-m911g9pp6-mohamed-el-aammaris-projects.vercel.app",
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));
// API routes

// MongoDB connection
const CONNECTION_URL =
  process.env.MONGODB_URI ||
  "mongodb+srv://medlique:HXRMVGMsPpdCjDSt@cluster0.4d0iacb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
mongoose.set("strictQuery", false);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Define schema and model for courses
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

// In your server file (e.g., index.js or server.js)

// API endpoint to get courses
app.get("/api/courses", async (req, res) => {
  try {
    const { tipo, accesso, lingua, area } = req.query;

    let query = {};

    if (tipo) {
      console.log("tipo", tipo);
      query.tipo = tipo;
    }
    if (lingua) {
      console.log("tipo", lingua);
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

// Webhook route
app.post(
  "/api/webhooks",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("Received a webhook request");

    try {
      const payloadString = req.body.toString();
      const svixHeaders = req.headers;
      console.log("Payload:", payloadString);
      console.log("Headers:", svixHeaders);

      const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);
      const evt = wh.verify(payloadString, svixHeaders);
      console.log("Webhook verified");
      console.log("Event:", evt);

      const { id, ...attributes } = evt.data;
      console.log("Event data:", evt.data);

      const eventType = evt.type;
      if (eventType === "user.created") {
        console.log(`User ${id} was ${eventType}`);

        const firstName = attributes.first_name;
        const lastName = attributes.last_name;

        const user = new User({
          clerkUserId: id,
          firstName,
          lastName,
        });

        await user.save();
        console.log("User saved to database");
      }

      res.status(200).json({
        success: true,
        message: "Webhook received",
      });
    } catch (err) {
      console.error("Error handling webhook:", err.message);
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
);
// Define the Application schema and model in index.js
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

// Add POST endpoint for applications, similar to your courses endpoint
app.post("/api/applications", async (req, res) => {
  console.log("Received application data:", req.body);

  try {
    // Transform the data to match your schema structure
    const {
      firstName,
      lastName,
      email,
      countryCode,
      whatsapp,
      lastDegree,
      graduationYear,
      degreePoints,
      studyPreference
    } = req.body;

    // Create application object
    const applicationData = {
      firstName,
      lastName,
      email,
      phone: {
        countryCode,
        number: whatsapp
      },
      education: {
        degree: lastDegree,
        graduationYear: parseInt(graduationYear),
        points: degreePoints
      },
      studyPreference
    };

    const application = new Application(applicationData);
    const savedApplication = await application.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      applicationId: savedApplication._id
    });
  } catch (error) {
    console.error("Error saving application:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the application.",
      error: error.message
    });
  }
});

// Add GET endpoint for applications
app.get("/api/applications", async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
app.post("/upload", uploadDocuments, async (req, res) => {
  try {
    await client.connect();
    const db = client.db("your_database_name");
    const collection = db.collection("files");

    for (let fieldname in req.files) {
      for (let file of req.files[fieldname]) {
        const filename = generateFilename(fieldname, file.originalname);
        const filepath = getFilePath(fieldname, filename);

        await collection.insertOne({
          filename: filename,
          filepath: filepath,
          contentType: file.mimetype,
          data: file.buffer,
        });
      }
    }

    res.status(200).json({ message: "Files uploaded successfully" });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).send("Error uploading files");
  } finally {
    await client.close();
  }
});
// Connect to MongoDB and start the server
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Body:", JSON.stringify(req.body, null, 2));
  next();
});
// Serve static files
//app.use(express.static(path.resolve(__dirname, "../client/build")));

// Catch-all route
//app.get("*", (req, res) => {
//res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
//});

// Serve static files in production
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.resolve(__dirname, "../client/build")));

//   // Wildcard route for serving index.html for any other route in production
// } else {
//   // For development, add a catch-all route that returns a JSON response
//   app.get("*", (req, res) => {
//     res.json({
//       message:
//         "API is running. For client-side routes, please run the React development server.",
//     });
//   });
// }
app.use("/posts", postRoutes);
export default app;
