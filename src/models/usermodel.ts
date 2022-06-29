import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, require: true, trim: true },
  login: { type: String, require: true, lowercase: true, unique: true },
  password: { type: String, require: true },
  createdAt: { type: Date, default: () => new Date(), imutable: true },
  email: { type: String, unique: true, lowercase: true },
  roles: [String],
});

export default mongoose.model("User", userSchema);
