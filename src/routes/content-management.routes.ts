import { Router } from "express";
import {
  createCourseController,
  listCoursesController,
  getCourseByIdController,
  updateCourseController,
  updateModuleController,
  updateLessonController,
  updateContentController,
  updateCourseImageController,
  updateCourseVideoController,
  addOrUpdateRatingController,
  getRatingsByContentController,
} from "../controllers/content-management.controllers";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticateUser, createCourseController);
router.get("/", authenticateUser, listCoursesController);
router.get("/:id", authenticateUser, getCourseByIdController as any);
router.put("/course/:id", authenticateUser, updateCourseController);
router.put("/module/:id", authenticateUser, updateModuleController);
router.put("/lesson/:id", authenticateUser, updateLessonController);
router.put("/content/:id", authenticateUser, updateContentController);
router.put("/image/:id", authenticateUser, updateCourseImageController);
router.put("/video/:id", authenticateUser, updateCourseVideoController);
router.post("/rating", authenticateUser, addOrUpdateRatingController as any);
router.get("/ratings/:id", authenticateUser, getRatingsByContentController);

export default router;
