import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import * as campaignController from "../controllers/awareness.controllers";

const router = Router();

router.post("/", authenticateUser, campaignController.createCampaign as any);
router.get("/", authenticateUser, campaignController.listCampaigns);
router.patch(
  "/:id/status",
  authenticateUser,
  campaignController.updateCampaignStatus as any
);
router.get("/:id", authenticateUser, campaignController.getCampaignById as any);
router.post("/comment/:id", authenticateUser, campaignController.addComment);
router.post(
  "/feedback/:id",
  authenticateUser,
  campaignController.submitFeedback
);
router.get("/feedbacks/:id", authenticateUser, campaignController.listFeedbacks);

export default router;
