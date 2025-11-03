// src/routes/contentCourse.routes.ts
import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import * as controller from "../controllers/content-management.controllers";

const router = Router();
router.post("/", authenticateUser, controller.createFullCourseController);
router.get("/", authenticateUser, controller.listCoursesController);
router.put("/course/:id", authenticateUser, controller.updateCourseController);
router.put("/module/:id", authenticateUser, controller.updateModuleController);
router.put("/lesson/:id", authenticateUser, controller.updateLessonController);
router.put(
  "/content/:id",
  authenticateUser,
  controller.updateContentController
);
router.post(
  "/rating",
  authenticateUser,
  controller.addOrUpdateRatingController
);
router.get(
  "/ratings/:contentId",
  authenticateUser,
  controller.getRatingsByContentController
);
router.get("/:id", authenticateUser, controller.getCourseByIdController);
export default router;
