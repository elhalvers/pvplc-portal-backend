import { Router } from "express";
import * as controller from "../controllers/usercontroller";
import { checkJWT } from "../middleware/auth";
const router = Router();
router.get("/", controller.getUser);

router.post("/login", controller.login);

router.patch("/", checkJWT, controller.checkJWT);

router.delete("/", controller.signout);

export default router;
