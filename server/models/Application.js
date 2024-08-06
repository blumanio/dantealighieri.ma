import mongoose from "mongoose";
const applicationSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    degreeType: { type: String, required: true },
    program: { type: String, required: true },
    accessType: { type: String, required: true },
    courseLanguage: { type: String, required: true },
    academicArea: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

const PostApplication = mongoose.model("PostApplication", applicationSchema);
export default PostApplication;
