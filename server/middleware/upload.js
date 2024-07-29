import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "uploads/";
    if (file.fieldname === "documents") {
      uploadPath = path.join(uploadPath, "documents");
    } else if (file.fieldname === "receipt") {
      uploadPath = path.join(uploadPath, "receipts");
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

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

export default upload;
