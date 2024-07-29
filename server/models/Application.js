import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    degreeType: { type: String, required: true },
    program: { type: String, required: true },
    paymentOption: { type: String, required: true },
    documents: [{ type: String }], // Array of file paths or identifiers
    receipt: { type: String }, // Path to the receipt file
    userId: { type: String },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
