// routes/application.js
import express from 'express';
import Application from '../models/Application.js';

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('Received application data:', req.body);
  
  try {
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
      applicationId: savedApplication._id
    });
  } catch (error) {
    console.error('Failed to save application:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit application'
    });
  }
});

// Add 'default' to the export
export { router as default };