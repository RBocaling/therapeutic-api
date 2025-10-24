import { Router } from "express";
import * as scheduleCtrl from "../controllers/schedule-session.controllers";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticateUser, scheduleCtrl.createSchedule as any);
router.get("/", authenticateUser, scheduleCtrl.listMySchedules as any);
router.get("/counselor", authenticateUser, scheduleCtrl.listCounselorSchedules);
router.get("/:id", authenticateUser, scheduleCtrl.getSchedule as any);
router.patch("/:id", authenticateUser, scheduleCtrl.updateScheduleStatus as any);
router.delete("/:id", authenticateUser, scheduleCtrl.deleteSchedule as any);

export default router;
