"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reserves_json_1 = __importDefault(require("./reserves.json"));
const keys = reserves_json_1.default.map((reserve) => reserve.label);
const activitySchema = new mongoose_1.default.Schema({
    trail: { type: String, required: [true, "Need trail"] },
    activity: { type: String, required: [true, "Need activity"] },
    quantity: { type: Number, required: false, min: [0, "Value too low"], max: [200, "Value too high"] },
    notes: { type: String, required: false, maxLength: [300, "Too much text"] },
    uuid: { type: String, required: [true, "Need uuid"] },
    pictures: { type: [String] },
});
const reportSchema = new mongoose_1.default.Schema({
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    reserve: { type: String, required: [true, "No reserve"], enum: keys },
    date: { type: Date, required: true },
    buddies: { type: [{ name: String, _id: mongoose_1.default.Schema.Types.ObjectId }] },
    startTime: {
        type: String,
        required: true,
        validate: {
            validator: function (time) {
                return /^[0-2]\d:[0-6]\d$/.test(time);
            },
            message: "Regex failed to validate",
        },
    },
    endTime: {
        type: String,
        required: [true, "No end Time"],
        validate: {
            validator: function (time) {
                return /^[0-2]\d:[0-6]\d$/.test(time);
            },
            message: "Regex failed to validate",
        },
    },
    activities: {
        type: [activitySchema],
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
        imutable: true,
    },
    timeSpent: {
        type: Number,
        required: [true, "No time spent"],
        validate: {
            validator: function (time) {
                return time > 0;
            },
            message: "Incorrect time",
        },
    },
});
reportSchema.pre("validate", function (next) {
    const time_start = new Date();
    const time_end = new Date();
    const value_start = this.startTime.split(":");
    const value_end = this.endTime.split(":");
    time_start.setHours(parseInt(value_start[0]), parseInt(value_start[1]), 0, 0);
    time_end.setHours(parseInt(value_end[0]), parseInt(value_end[1]), 0, 0);
    const difference = (time_end.getTime() - time_start.getTime()) / 1000 / 60;
    this.timeSpent = difference;
    next();
});
// export function getTimeSpent(startTime: string, endTime: string): number {
//   const time_start = new Date();
//   const time_end = new Date();
//   const value_start = startTime.split(":");
//   const value_end = endTime.split(":");
//   time_start.setHours(parseInt(value_start[0]), parseInt(value_start[1]), 0, 0);
//   time_end.setHours(parseInt(value_end[0]), parseInt(value_end[1]), 0, 0);
//   const difference = (time_end.getTime() - time_start.getTime()) / 1000 / 60;
//   return difference;
// }
exports.default = mongoose_1.default.model("Report", reportSchema);
