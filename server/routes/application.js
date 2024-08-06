import express from "express";
import multer from "multer";
import { createApplication } from "../controllers/applicationController.js"; // Import the controller function
import {
  uploadDocuments,
  getFilePath,
  generateFilename,
} from "../middleware/upload.js";
import path from "path";
const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDFs are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
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
