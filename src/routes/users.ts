import { Router } from "express";
import * as controller from "../controllers/usercontroller";
import { isAdmin, canUpdate, checkJWT } from "../middleware/auth";
const router = Router();
router.get("/", checkJWT, controller.getUsers);

router.get("/:id", checkJWT, controller.getUser);
router.delete("/:id", checkJWT, controller.deleteUser);
router.put("/:id", checkJWT, canUpdate, controller.updateUser);

router.post("/login", controller.login);
router.post("/", checkJWT, isAdmin, controller.createUser);

router.put("/", checkJWT, controller.update);

router.patch("/", checkJWT, controller.checkJWT);

router.delete("/", checkJWT, controller.signout);

export default router;
