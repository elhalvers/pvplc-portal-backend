import mongoose from "mongoose";
import reserves from "./reserves.json";

const keys = reserves.map((reserve) => reserve.label);

const activitySchema = new mongoose.Schema({
  trail: { type: String, required: [true, "Need trail"] },
  activity: { type: String, required: [true, "Need activity"] },
  quantity: { type: Number, required: false, min: [0, "Value too low"], max: [200, "Value too high"] },
  notes: { type: String, required: false, maxLength: [300, "Too much text"] },
  uuid: { type: String, required: [true, "Need uuid"] },
  pictures: { type: [String] },
});
const reportSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reserve: { type: String, required: [true, "No reserve"], enum: keys },
  date: { type: Date, required: true },
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: function (time: string) {
        return /^[0-2]\d:[0-6]\d$/.test(time);
      },
      message: "Regex failed to validate",
    },
  },
  endTime: {
    type: String,
    required: [true, "No end Time"],
    validate: {
      validator: function (time: string) {
        return /^[0-2]\d:[0-6]\d$/.test(time);
      },
      message: "Regex failed to validate",
    },
  },
  activities: {
    type: [activitySchema],
<<<<<<< HEAD
=======
    // validate: {
    //   validator: function (array: any) {
    //     return array.length > 0;
    //   },
    //   message: "Array must have at least 1 element",
    // },
>>>>>>> 6aff2cdc6772104cc4142ad3a4b1906fe4c183ee
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
      validator: function (time: number) {
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

export default mongoose.model("Report", reportSchema);
