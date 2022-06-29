import { Router } from "express";
import * as controller from "../controllers/reportscontroller";
import { checkJWT } from "../middleware/auth";
const router = Router();
router.use(checkJWT);
router.get("/", controller.getReports);

router.post("/", controller.createReport);

router.delete("/", controller.deleteReport);

export default router;
