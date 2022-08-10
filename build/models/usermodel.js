"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const rolePossible = ["ADMIN", "MOD", "VOLUNTEER"];
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (name) {
                return /^[a-zA-Z]+ [a-zA-Z]+$/.test(name);
            },
            message: "Regex failed to validate name",
        },
    },
    login: { type: String, required: true, lowercase: true, unique: true, trim: true, minlength: 5 },
    volunteerID: { type: String, required: true, lowercase: true, unique: true, trim: true },
    password: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (password) {
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
            validator: function (password) {
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
            validator: function (array) {
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
exports.default = mongoose_1.default.model("User", userSchema);
