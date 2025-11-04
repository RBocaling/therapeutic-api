import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { getReports } from "../controllers/report.controllers";

const router = Router();

router.get("/", authenticateUser, getReports as any);

export default router;
