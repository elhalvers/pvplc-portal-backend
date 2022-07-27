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
    const { month, year, reserve, trail }: { month?: number; year?: number; reserve?: string; trail?: string } = req.query;
    console.log(req.query);

    const results = await Report.find({
      ...(year && {
        date: {
          $gte: new Date(year, month || 0, 1),
          $lte: new Date(year, month || 11, 31),
        },
      }),
      ...(reserve && { reserve }),
      ...(reserve && trail && { activities: { $elemMatch: { trail } } }),
    })
      .populate("createdBy", "name")
      .select("timeSpent reserve activities")
      .lean();
    console.log(results);

    if (results) {
      res.json({ reports: results });
    }
  } catch (error) {
    res.status(500).json({ message: "Couldn't load " });
  }
}

export async function getTotal(req: Request, res: Response) {
  try {
    const { start, end, reserve, trail }: { start?: string; end?: string; reserve?: string; trail?: string } = req.query;
    console.log(req.query);

    const results = await Report.find({
      ...(start &&
        end && {
          date: {
            $gte: Date.parse(end),
            $lte: Date.parse(start),
          },
        }),
      ...(reserve && { reserve }),
      ...(reserve && trail && { activities: { $elemMatch: { trail } } }),
    })
      .populate("createdBy", "name")
      .select("timeSpent reserve activities  startTime endTime date createdAt")
      .lean();
    console.log(results);

    if (results) {
      res.json({ total: results });
    }
  } catch (error) {
    res.status(500).json({ message: "Couldn't load ", error });
  }
}

export async function getSubtotals(req: Request, res: Response) {
  try {
    const { start, end, reserve, trail }: { start?: string; end?: string; reserve?: string; trail?: string } = req.query;
    console.log(req.query);

    const results = await Report.aggregate([
      {
        $match: {
          ...(start &&
            end && {
              date: {
                $gte: Date.parse(end),
                $lte: Date.parse(start),
              },
            }),
          ...(reserve && { reserve }),
          ...(reserve && trail && { activities: { $elemMatch: { trail } } }),
        },
      },
      {
        $group: {
          _id: "$createdBy",
          totalminutes: { $sum: "$timeSpent" },
          totalhours: { $sum: { $divide: ["$timeSpent", 60] } },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user_doc",
        },
      },
      {
        $project: {
          totalminutes: { $round: ["$totalminutes", 2] },
          totalhours: { $round: ["$totalhours", 2] },
          _id: 0,
          "user_doc.name": 1,
        },
      },
    ]);
    console.log(results);

    if (results) {
      res.json({ subtotal: results });
    }
  } catch (error) {
    res.status(500).json({ message: "Couldn't calculate subtotals", error });
  }
}

export async function getReport(req: Request, res: Response) {
  const id = req.params.id;
  try {
    if (!id) throw "No id";
    console.log(id);

    const result = await Report.findById(id).populate("createdBy", "name login").lean();
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
