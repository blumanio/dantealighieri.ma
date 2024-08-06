import PostApplication from "../models/application.js";

export const createApplication = async (req, res) => {
  console.log(
    "Received application data in controller:",
    JSON.stringify(req.body, null, 2)
  );

  try {
    const newApplication = new PostApplication(req.body);
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
