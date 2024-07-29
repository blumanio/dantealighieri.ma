import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import postRoutes from "./routes/posts.js";
import applicationRoutes from "./routes/application.js";
import { Webhook } from "svix";
import User from "./models/User.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware setup
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// API routes
app.use("/posts", postRoutes);
app.use("/applications", applicationRoutes);

// MongoDB connection
const CONNECTION_URL =
  process.env.MONGODB_URI || "your-mongodb-connection-string";
const PORT = process.env.PORT || 5000;
mongoose.set("strictQuery", false);

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

// Connect to MongoDB and start the server
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../client/build")));

  // Wildcard route for serving index.html for any other route in production
  app.get("*", (request, response) => {
    response.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
} else {
  // For development, add a catch-all route that returns a JSON response
  app.get("*", (req, res) => {
    res.json({
      message:
        "API is running. For client-side routes, please run the React development server.",
    });
  });
}
