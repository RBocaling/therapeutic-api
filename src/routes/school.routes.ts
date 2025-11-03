import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import * as schoolController from "../controllers/school.controllers";

const router = Router();

router.post("/add-school", authenticateUser, schoolController.addSchool);
router.post("/add-course", authenticateUser, schoolController.addCourse);
router.get("/schools", authenticateUser, schoolController.getSchools);
router.get(
  "/courses/:schoolId",
  authenticateUser,
  schoolController.getCoursesBySchool
);

export default router;
