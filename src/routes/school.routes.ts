import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import * as schoolController from "../controllers/school.controllers";

const router = Router();

router.post("/add-school", schoolController.addSchool);
router.post("/add-course", schoolController.addCourse);
router.get("/schools", schoolController.getSchools);
router.get(
  "/courses/:schoolId",
  authenticateUser,
  schoolController.getCoursesBySchool
);
router.put("/course/:id", schoolController.updateCourse);
router.put("/school/:id", schoolController.updateSchool);

export default router;
