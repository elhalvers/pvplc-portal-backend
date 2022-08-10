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
exports.isAdmin = exports.canUpdate = exports.hasAccess = exports.checkJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const reportmodel_1 = __importDefault(require("../models/reportmodel"));
function checkJWT(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
        jsonwebtoken_1.default.verify(token, process.env.SECRET, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.status(403).json({ status: false });
            }
            else {
                console.log("token", decoded);
                req._id = decoded._id;
                req.login = decoded.login;
                req.roles = decoded.roles;
                next();
            }
        }));
    }
    else {
        res.status(403).json({ status: false });
    }
}
exports.checkJWT = checkJWT;
function hasAccess(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const roles = req.roles;
        const login = req.login;
        try {
            if (roles.includes("ADMIN") || roles.includes("MOD"))
                next();
            else if (id) {
                const result = yield reportmodel_1.default.findById(id).populate("createdBy", "login").lean();
                if (typeof result == "undefined" || !result)
                    throw "Doesn't exist";
                console.log("result", result);
                if (result.createdBy.login == login) {
                    next();
                }
                else
                    throw "logins don't match";
            }
            else
                throw "No id";
        }
        catch (error) {
            console.log("here2");
            res.status(403).json({ message: "Not authorized", error });
        }
    });
}
exports.hasAccess = hasAccess;
function canUpdate(req, res, next) {
    if (req.body.login || req.body.roles) {
        console.log("here");
        if (req.roles.includes("ADMIN"))
            next();
        else
            res.json({ message: "no permission to update", roles: req.roles });
    }
    else
        next();
}
exports.canUpdate = canUpdate;
function isAdmin(req, res, next) {
    if (req.roles.includes("ADMIN"))
        next();
    else
        res.json({ message: "no permission to create", roles: req.roles });
}
exports.isAdmin = isAdmin;
