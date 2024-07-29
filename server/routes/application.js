import express from "express";
import multer from "multer";
import { createApplication } from "../controllers/applicationController.js"; // Import the controller function

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDFs are allowed."), false);
    }
  },
});

router.post(
  "/",
  upload.fields([
    { name: "documents", maxCount: 7 },
    { name: "receipt", maxCount: 1 },
  ]),
  createApplication // Use the controller function
);

export default router;
