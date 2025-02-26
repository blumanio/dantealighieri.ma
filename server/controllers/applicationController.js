import PostApplication from "../models/Application.js";

export const createApplication = async (req, res) => {
  console.log(
    "Received application data in controller:",
    JSON.stringify(req.body, null, 2)
  );

  try {
    // Transform the data to match your schema structure
    const applicationData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: {
        countryCode: req.body.countryCode,
        number: req.body.whatsapp
      },
      education: {
        degree: req.body.lastDegree,
        graduationYear: parseInt(req.body.graduationYear),
        points: req.body.degreePoints
      },
      studyPreference: req.body.studyPreference
    };

    const newApplication = new PostApplication(applicationData);
    await newApplication.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      data: newApplication,
    });
  } catch (error) {
    console.error("Error in createApplication:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the application.",
      error: error.message,
      stack: error.stack,
    });
  }
};
