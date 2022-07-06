import mongoose from "mongoose";
const rolePossible = ["ADMIN", "MOD", "VOLUNTEER"];

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (name: string) {
        return /^[a-zA-Z]+ [a-zA-Z]+$/.test(name);
      },
      message: "Regex failed to validate name",
    },
  },
  login: { type: String, required: true, lowercase: true, unique: true, trim: true, minlength: 5 },
  password: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (password: string) {
        return /^(?=.*[0-9]).{8,32}$/.test(password);
      },
      message: "Regex failed to validate password",
    },
  },
  createdAt: { type: Date, default: () => new Date(), imutable: true, required: true },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    trim: true,
    validate: {
      validator: function (password: string) {
        return /^[A-Za-z0-9+_.-]+@(.+)$/.test(password);
      },
      message: "Regex failed to validate password",
    },
  },
  phone: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
    minLength: 10,
    maxLength: 11,
  },
  note: { type: String, maxLength: 300, default: "" },
  roles: {
    type: [String],
    required: true,
    validate: {
      validator: function (array: string[]) {
        return array.every((role) => rolePossible.includes(role));
      },
      message: "Regex failed to validate",
    },
  },
});

userSchema.pre("validate", function (next) {
  this.roles = this.roles.filter((role) => rolePossible.includes(role));
  this.roles = this.roles.sort();
  next();
});

export default mongoose.model("User", userSchema);
