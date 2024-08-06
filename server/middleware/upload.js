import multer from "multer";
import path from "path";

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

export const uploadDocuments = upload.fields([
  { name: "documents", maxCount: 7 },
  { name: "receipt", maxCount: 1 },
]);

// Helper function to simulate file paths
export const getFilePath = (fieldname, filename) => {
  let uploadPath = "uploads/";
  if (fieldname === "documents") {
    uploadPath = path.join(uploadPath, "documents");
  } else if (fieldname === "receipt") {
    uploadPath = path.join(uploadPath, "receipts");
  }
  return path.join(uploadPath, filename);
};

// Helper function to generate unique filename
export const generateFilename = (fieldname, originalname) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  return fieldname + "-" + uniqueSuffix + path.extname(originalname);
};

export default upload;
