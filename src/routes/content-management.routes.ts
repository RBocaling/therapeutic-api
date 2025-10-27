import { Router } from "express";
import * as contentManagement from "../controllers/content-management.controllers";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticateUser, contentManagement.createContentController);
router.post(
  "/add-rating",
  authenticateUser,
  contentManagement.addOrUpdateRating as any
);
router.get("/:id", authenticateUser, contentManagement.viewContentById as any);

router.get("/", authenticateUser, contentManagement.listContentsController);
router.put("/:id", authenticateUser, contentManagement.updateContentController);
router.delete(
  "/:id",
  authenticateUser,
  contentManagement.deleteContentController
);





export default router;
