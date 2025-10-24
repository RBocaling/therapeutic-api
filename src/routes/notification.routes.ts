import { authenticateUser } from './../middlewares/auth.middleware';
import { Router } from "express";
import * as notificationController from "../controllers/notification.controllers";

const router = Router();

router.get("/", authenticateUser, notificationController.getNotifications);
router.put(
  "/marked-as-read/:notificationId",
  authenticateUser, notificationController.markAsRead
);
router.delete("/clear",authenticateUser, notificationController.clearNotifications);

export default router;
