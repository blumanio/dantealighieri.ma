// routes/application.js
import express from 'express';
import mongoose from 'mongoose';
import Application from '../models/Application.js';

const router = express.Router();

// Add a test endpoint to check if the route is working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Application API is working',
    timestamp: new Date().toISOString(),
    mongoConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

router.post('/', async (req, res) => {
  console.log('Received application data in express route:', req.body);

  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB not connected. Current state:', mongoose.connection.readyState);
      return res.status(500).json({
        success: false,
        message: 'Database connection error'
      });
    }

    // Validate the request body
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

    // Check for required fields
    if (!firstName || !lastName || !email || !countryCode || !whatsapp || 
        !lastDegree || !graduationYear || !degreePoints || !studyPreference) {
      console.error('Missing required fields in request', req.body);
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

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

    console.log('Saving application with data:', applicationData);

    // Create model instance
    const application = new Application(applicationData);
    
    // Save with explicit error handling
    try {
      const savedApplication = await application.save();
      console.log('Application saved successfully with ID:', savedApplication._id);
      
      return res.status(201).json({
        success: true,
        applicationId: savedApplication._id
      });
    } catch (saveError) {
      console.error('Error saving to MongoDB:', saveError.message);
      console.error('Full error:', saveError);
      
      // Check for validation errors
      if (saveError.name === 'ValidationError') {
        const validationErrors = Object.keys(saveError.errors).map(field => ({
          field,
          message: saveError.errors[field].message
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validationErrors
        });
      }
      
      return res.status(500).json({
        success: false,
        message: `Database save error: ${saveError.message}`
      });
    }
  } catch (error) {
    console.error('Failed to process application:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit application'
    });
  }
});

export default router;