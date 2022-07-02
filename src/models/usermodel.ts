import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  login: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date(), imutable: true },
  email: { type: String, unique: true, lowercase: true },
  roles: [String],
});

export default mongoose.model("User", userSchema);
