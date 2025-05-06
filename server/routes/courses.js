// routes/courses.js
import express from 'express';
import mongoose from 'mongoose';
import Course from '../models/Course.js'; // Import the Course model
const router = express.Router();

// Access the Course model registered with Mongoose in index.js
// If you define and export the Course model from a separate models/ file,
// import it directly instead: import Course from '../models/Course.js';

// Handles GET requests to /courses
// (because it will be mounted via app.use('/courses', coursesRoutes) in index.js)
router.get("/", async (req, res) => {
    console.log(`Courses route handler called for ${req.originalUrl}`); // Add log
    try {
        const { tipo, accesso, lingua, area } = req.query;

        let query = {};

        // Build the query object based on provided query parameters
        if (tipo) {
            console.log("Filtering by tipo:", tipo);
            query.tipo = tipo;
        }
        if (lingua) {
            console.log("Filtering by lingua:", lingua);
            query.lingua = lingua;
        }
        if (area) {
            console.log("Filtering by area:", area);
            query.area = area;
        }
        if (accesso) {
            console.log("Filtering by accesso:", accesso);
            query.accesso = accesso;
        }

        console.log("Executing Course.find with query:", query);

        const courses = await Course.find(query).lean(); // Use .lean() for better performance
        console.log(`Found ${courses.length} courses`);

        res.status(200).json(courses); // Send the courses back as JSON

    } catch (err) {
        console.error("Error fetching courses:", err);
        res.status(500).json({ message: "Failed to fetch courses", error: err.message });
    }
});

// Export the router so it can be used in index.js
export default router;