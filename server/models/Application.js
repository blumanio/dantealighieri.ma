import mongoose from "mongoose";
const applicationSchema = mongoose.Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  birthDate: { type: String, required: false },
  country: { type: String, required: false },
  city: { type: String, required: false },
  degreeType: { type: String, required: false },
  program: { type: String, required: false },
  accessType: { type: String, required: false },
  courseLanguage: { type: String, required: false },
  academicArea: { type: String, required: false },
  userId: { type: String, required: false },
});

const PostApplication = mongoose.model("PostApplication", applicationSchema);
export default PostApplication;
