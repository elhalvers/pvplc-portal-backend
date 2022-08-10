"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReport = exports.deleteReport = exports.getReport = exports.getSubtotals = exports.getTotal = exports.getReports = exports.createReport = void 0;
const reportmodel_1 = __importDefault(require("../models/reportmodel"));
function createReport(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        console.log(req.body);
        try {
            const report = new reportmodel_1.default({
                endTime: body.endTime,
                startTime: body.startTime,
                activities: body.activities,
                date: body.date,
                createdBy: req._id,
                reserve: body.reserve,
                buddies: body.buddies,
            });
            yield report.save();
            const formatted = report.toJSON();
            res.json({ message: "Created post", report: formatted });
        }
        catch (error) {
            res.status(500).json({ message: "Failed to create post", error });
        }
    });
}
exports.createReport = createReport;
function getReports(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { start, end, reserve, trail, volunteer } = req.query;
            console.log(req.query);
            const results = yield reportmodel_1.default.find(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (start &&
                end && {
                date: {
                    $lte: new Date(end),
                    $gte: new Date(start),
                },
            })), (reserve && { reserve })), (volunteer && { createdBy: volunteer })), (reserve && trail && { activities: { $elemMatch: { trail } } })), (!req.roles.includes("ADMIN") && { createdBy: req._id })))
                .populate("createdBy", "name")
                .select("timeSpent reserve activities")
                .lean();
            console.log(results);
            if (results) {
                res.json({ reports: results });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Couldn't load ", error });
        }
    });
}
exports.getReports = getReports;
function getTotal(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { start, end, reserve, trail, volunteer } = req.query;
            const results = yield reportmodel_1.default.find(Object.assign(Object.assign(Object.assign(Object.assign({}, (start &&
                end && {
                date: {
                    $lte: Date.parse(end),
                    $gte: Date.parse(start),
                },
            })), (reserve && { reserve })), (volunteer && { createdBy: volunteer })), (reserve && trail && { activities: { $elemMatch: { trail } } })))
                .populate("createdBy", "name")
                .select("timeSpent reserve activities  startTime endTime date createdAt")
                .lean();
            // console.log(results);
            if (results) {
                res.json({ total: results });
            }
            else
                res.json({ total: [] });
        }
        catch (error) {
            res.status(500).json({ message: "Couldn't load ", error });
        }
    });
}
exports.getTotal = getTotal;
function getSubtotals(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { start, end, reserve, trail, volunteer } = req.query;
            console.log(req.query);
            console.log(new Date(start));
            console.log(new Date(end));
            const results = yield reportmodel_1.default.aggregate([
                {
                    $match: Object.assign(Object.assign(Object.assign(Object.assign({}, (start &&
                        end && {
                        date: {
                            $lte: new Date(end),
                            $gte: new Date(start),
                        },
                    })), (reserve && { reserve })), (volunteer && { createdBy: volunteer })), (reserve && trail && { activities: { $elemMatch: { trail } } })),
                },
                {
                    $project: {
                        buddyid: "$buddies._id",
                        _id: 1,
                        createdBy: 1,
                        timeSpent: 1,
                    },
                },
                {
                    $addFields: {
                        contributors: { $concatArrays: ["$buddyid", ["$createdBy"]] },
                    },
                },
                {
                    $unwind: { path: "$contributors", preserveNullAndEmptyArrays: true },
                },
                {
                    $group: {
                        _id: "$contributors",
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
        }
        catch (error) {
            res.status(500).json({ message: "Couldn't calculate subtotals", error });
        }
    });
}
exports.getSubtotals = getSubtotals;
function getReport(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            if (!id)
                throw "No id";
            console.log(id);
            const result = yield reportmodel_1.default.findById(id).populate("createdBy", "name login").lean();
            if (!result)
                throw "Doesn't exist";
            else
                res.json(result);
        }
        catch (error) {
            res.status(404).json({ message: "No such id", error });
        }
    });
}
exports.getReport = getReport;
function deleteReport(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            if (!id)
                throw "No id";
            console.log(id);
            const result = yield reportmodel_1.default.deleteOne({ _id: id });
            if (!result)
                throw "Doesn't exist";
            else
                res.send("success fully deleted");
        }
        catch (error) {
            res.status(404).json({ message: "Failed to delete", error });
        }
    });
}
exports.deleteReport = deleteReport;
function updateReport(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            if (!id)
                throw "No id";
            const report = req.body;
            console.log(id);
            const result = yield reportmodel_1.default.findOneAndReplace({ _id: id }, Object.assign(Object.assign({}, report), { createdBy: req._id }), { runValidators: true });
            if (!result)
                throw "Doesn't exist";
            else
                res.send("successfully replaced");
        }
        catch (error) {
            res.status(404).json({ message: "Failed to update", error });
        }
    });
}
exports.updateReport = updateReport;
