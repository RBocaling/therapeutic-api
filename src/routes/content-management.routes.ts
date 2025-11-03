import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import * as courseController from "../controllers/content-management.controllers";

const router = Router();

router.post("/", authenticateUser, courseController.createCourseController);
router.get("/", authenticateUser, courseController.listCoursesController);
router.get(
  "/:id",
  authenticateUser,
  courseController.getCourseByIdController as any
);
router.put("/:id", authenticateUser, courseController.updateCourseController);
router.post(
  "/ratings",
  authenticateUser,
  courseController.addOrUpdateRatingController
);
router.get(
  "/ratings/:id",
  authenticateUser,
  courseController.getRatingsByContentController
);

export default router;
