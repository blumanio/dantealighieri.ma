import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
