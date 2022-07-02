import { Router } from "express";
import * as controller from "../controllers/reportscontroller";
import { checkJWT, hasAccess } from "../middleware/auth";
const router = Router();
router.use(checkJWT);

router.get("/:id", controller.getReport);

router.get("/", controller.getReports);

router.post("/", controller.createReport);

router.delete("/:id", hasAccess, controller.deleteReport);

router.put("/:id", hasAccess, controller.updateReport);

export default router;
