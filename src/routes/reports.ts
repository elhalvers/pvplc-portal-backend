import { Router } from "express";
import * as controller from "../controllers/reportscontroller";
import { checkJWT, hasAccess, isAdmin } from "../middleware/auth";
const router = Router();
router.use(checkJWT);
router.get("/", controller.getReports);

router.get("/subtotals", isAdmin, controller.getSubtotals);

router.get("/total", isAdmin, controller.getTotal);

router.get("/:id", controller.getReport);

router.post("/", controller.createReport);

router.delete("/:id", hasAccess, controller.deleteReport);

router.put("/:id", hasAccess, controller.updateReport);

export default router;
