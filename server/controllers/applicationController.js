export const createApplication = async (req, res) => {
  const files = [];
  try {
    const {
      firstName,
      lastName,
      birthDate,
      country,
      city,
      degreeType,
      program,
      paymentOption,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !birthDate ||
      !country ||
      !city ||
      !degreeType ||
      !program ||
      !paymentOption
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Process documents
    const documents =
      req.files && req.files["documents"]
        ? req.files["documents"].map((file) => {
            const newPath = path.join("uploads", "documents", file.filename);
            files.push({ oldPath: file.path, newPath });
            return newPath;
          })
        : [];

    // Process receipt
    let receipt = null;
    if (req.files && req.files["receipt"] && req.files["receipt"][0]) {
      const receiptFile = req.files["receipt"][0];
      receipt = path.join("uploads", "receipts", receiptFile.filename);
      files.push({ oldPath: receiptFile.path, newPath: receipt });
    }

    const newApplication = new Application({
      firstName,
      lastName,
      birthDate,
      country,
      city,
      degreeType,
      program,
      paymentOption,
      documents,
      receipt,
    });

    await newApplication.save();

    // Move files to their final locations
    for (const file of files) {
      await fs.rename(file.oldPath, file.newPath);
    }

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      data: newApplication,
    });
  } catch (error) {
    console.error("Error creating application:", error);

    // Delete uploaded files if an error occurs
    for (const file of files) {
      try {
        await fs.unlink(file.oldPath);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: "An error occurred while processing the application.",
    });
  }
};
