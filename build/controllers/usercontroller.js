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
exports.createUser = exports.updateUser = exports.update = exports.checkJWT = exports.signout = exports.login = exports.deleteUser = exports.getVolunteers = exports.getUser = exports.getUsers = void 0;
const usermodel_1 = __importDefault(require("../models/usermodel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const results = yield usermodel_1.default.find({}).select("-password -note").lean();
            console.log(results);
            if (results) {
                res.json({ users: results });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Couldn't load " });
        }
    });
}
exports.getUsers = getUsers;
function getUser(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
            const result = yield usermodel_1.default.findById(id).select("-password").lean();
            console.log(result);
            if (result) {
                res.json({ user: result });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Couldn't load", error });
        }
    });
}
exports.getUser = getUser;
function getVolunteers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const results = yield usermodel_1.default.find({ roles: "VOLUNTEER" }).select("-password -note -email -login -phone").lean();
            console.log(results);
            if (results) {
                res.json({ users: results });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Couldn't load " });
        }
    });
}
exports.getVolunteers = getVolunteers;
function deleteUser(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
            if (!id)
                throw "No id";
            const result = yield usermodel_1.default.deleteOne({ _id: id }).lean();
            if (result) {
                res.json({ deleted: result });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Couldn't load", error });
        }
    });
}
exports.deleteUser = deleteUser;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookies = req.cookies;
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ message: "Username and password are required." });
        const foundUser = yield usermodel_1.default.findOne({ login: username, password }).select("-password").lean();
        console.log(foundUser);
        if (!foundUser)
            return res.status(401).json({ message: "User doesn't exist or passwords don't match" });
        else {
            const roles = foundUser.roles;
            const token = jsonwebtoken_1.default.sign({
                login: foundUser.login,
                name: foundUser.name,
                _id: foundUser._id,
                roles: roles,
            }, process.env.SECRET, { expiresIn: "1d" });
            if (cookies === null || cookies === void 0 ? void 0 : cookies.jwt)
                res.clearCookie("jwt", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: "none",
                secure: true,
            });
            res.json({ user: foundUser });
        }
    });
}
exports.login = login;
function signout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookies = req.cookies;
        if (cookies === null || cookies === void 0 ? void 0 : cookies.jwt)
            res.clearCookie("jwt", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
        res.json({ message: "signed out and cleared cookie" });
    });
}
exports.signout = signout;
function checkJWT(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const foundUser = yield usermodel_1.default.findOne({ login: req.login }).select("-password").lean();
        console.log("foundUser");
        if (!foundUser)
            return res.status(401).json({ message: "User doesn't exist or passwords don't match" });
        res.json({ user: foundUser });
    });
}
exports.checkJWT = checkJWT;
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, note, phone } = req.body;
        try {
            const result = yield usermodel_1.default.findById(req._id, "-password");
            if (!result)
                throw "Doesn't exist";
            result.name = name;
            result.email = email;
            result.note = note;
            result.phone = phone;
            const saved = yield result.save();
            const JSONED = saved.toJSON();
            res.json({ message: "Successfully updated user", user: JSONED });
        }
        catch (error) {
            console.log(error);
            res.status(404).json({ message: "User doesn't exist", error });
        }
    });
}
exports.update = update;
function updateUser(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, note, login, roles, phone, volunteerID } = req.body;
        try {
            console.log("here 2");
            const id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
            const result = yield usermodel_1.default.findById(id, "-password");
            if (!result)
                throw "Doesn't exist";
            if (name)
                result.name = name;
            if (email)
                result.email = email;
            if (note)
                result.note = note;
            if (login)
                result.login = login;
            if (phone)
                result.phone = phone;
            if (volunteerID)
                result.volunteerID = volunteerID;
            if (roles)
                result.roles = roles.split(" ");
            const saved = yield result.save();
            const JSONED = saved.toJSON();
            res.json({ message: "Successfully updated user", user: JSONED });
        }
        catch (error) {
            console.log(error);
            res.status(404).json({ message: "User doesn't exist", error });
        }
    });
}
exports.updateUser = updateUser;
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, note, login, roles, password, phone, volunteerID } = req.body;
        try {
            console.log("here 2");
            const newuser = new usermodel_1.default({ name, email, login, roles: roles.split(" "), password, note, phone, volunteerID });
            const saved = yield newuser.save();
            const JSONED = saved.toJSON();
            res.json({ message: "Successfully updated user", user: JSONED });
        }
        catch (error) {
            console.log(error);
            res.status(404).json({ message: "Couldn't create user", error });
        }
    });
}
exports.createUser = createUser;
