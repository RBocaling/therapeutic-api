import { Router } from "express";
import * as authController from "../controllers/auth.controllers";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.post("/google-auth", authController.googleLogin);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-account", authController.verifyAccount);
router.put(
  "/complete-profile",
  authenticateUser,
  authController.completeProfile
);
router.put(
  "/update-kyc-status",
  authenticateUser,
  authController.updateKycStatus
);
router.put(
  "/update-profile",
  authenticateUser,
  authController.updateProfilePicture
);
router.get(
  "/profile-progress",
  authenticateUser,
  authController.getProfileProgress as any
);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.put("/change-password", authenticateUser, authController.changePassword);

export default router;
