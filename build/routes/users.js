"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller = __importStar(require("../controllers/usercontroller"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.checkJWT, controller.getUsers);
router.get("/volunteers", auth_1.checkJWT, controller.getVolunteers);
router.get("/:id", auth_1.checkJWT, controller.getUser);
router.delete("/:id", auth_1.checkJWT, controller.deleteUser);
router.put("/:id", auth_1.checkJWT, auth_1.canUpdate, controller.updateUser);
router.post("/login", controller.login);
router.post("/", auth_1.checkJWT, auth_1.isAdmin, controller.createUser);
router.put("/", auth_1.checkJWT, controller.update);
router.patch("/", auth_1.checkJWT, controller.checkJWT);
router.delete("/", auth_1.checkJWT, controller.signout);
exports.default = router;
