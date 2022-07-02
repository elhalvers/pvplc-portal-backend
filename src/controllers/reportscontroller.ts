import { Request, Response } from "express";
import Report from "../models/reportmodel";

export async function createReport(req: any, res: Response) {
  const body = req.body;
  console.log(req.body);

  try {
    const report = new Report({
      endTime: body.endTime,
      startTime: body.startTime,
      activities: body.activities,
      date: body.date,
      createdBy: req._id,
      reserve: body.reserve,
    });
    await report.save();
    const formatted = report.toJSON();
    res.json({ message: "Created post", report: formatted });
  } catch (error) {
    res.status(500).json({ message: "Failed to create post", error });
  }
}

export async function getReports(req: Request, res: Response) {
  try {
    const results = await Report.find({}).populate("createdBy", "name").select("timeSpent reserve activities").lean();
    console.log(results);

    if (results) {
      res.json({ reports: results });
    }
  } catch (error) {
    res.status(500).json({ message: "Couldn't load " });
  }
}

export async function getReport(req: Request, res: Response) {
  const id = req.params.id;
  try {
    if (!id) throw "No id";
    console.log(id);

    const result = await Report.findById(id).populate("createdBy", "name email").lean();
    if (!result) throw "Doesn't exist";
    else res.json(result);
  } catch (error) {
    res.status(404).json({ message: "No such id", error });
  }
}

export async function deleteReport(req: Request, res: Response) {
  const id = req.params.id;
  try {
    if (!id) throw "No id";
    console.log(id);
    const result = await Report.deleteOne({ _id: id });
    if (!result) throw "Doesn't exist";
    else res.send("success fully deleted");
  } catch (error) {
    res.status(404).json({ message: "Failed to delete", error });
  }
}

export async function updateReport(req: any, res: Response) {
  const id = req.params.id;
  try {
    if (!id) throw "No id";
    const report = req.body;
    console.log(id);
    const result = await Report.findOneAndReplace({ _id: id }, { ...report, createdBy: req._id }, { runValidators: true });
    if (!result) throw "Doesn't exist";
    else res.send("successfully replaced");
  } catch (error) {
    res.status(404).json({ message: "Failed to update", error });
  }
}
