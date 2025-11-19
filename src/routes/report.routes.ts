import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { getReports } from "../controllers/report.controllers";
import { getCounselorClient } from "../controllers/chat.controllers";

const router = Router();

router.get("/", authenticateUser, getReports as any);
router.get("/v2", authenticateUser, getCounselorClient as any);

export default router;
