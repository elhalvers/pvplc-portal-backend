import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  trail: { type: String, required: true },
  activity: { type: String, required: true },
  quantity: { type: Number, required: false },
  notes: { type: String, required: false },
  uuid: { type: String, required: true },
});
const reportSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  login: { type: String, required: true, lowercase: true, trim: true },
  reserve: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  activities: {
    type: [activitySchema],
    required: true,
    validate: {
      validator: function (array: any) {
        return array.length > 0;
      },
      message: "Array must have at least 1 element",
    },
  },
  createdAt: { type: Date, default: () => new Date(), imutable: true },
  timeSpent: {
    type: Number,
    required: true,
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
  var difference = (time_end.getTime() - time_start.getTime()) / 1000 / 60;
  this.timeSpent = difference;
  console.log("difference", difference);
  next();
});

export default mongoose.model("Report", reportSchema);
