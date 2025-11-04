import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import * as campaignController from "../controllers/awareness.controllers";

const router = Router();

router.post("/", authenticateUser, campaignController.createCampaign as any);
router.get("/", authenticateUser, campaignController.listCampaigns);
router.get("/get-my-content", authenticateUser, campaignController.getMyPost);
router.get(
  "/moderator-post",
  authenticateUser,
  campaignController.moderatorCampaigns
);
router.get(
  "/user-request",
  authenticateUser,
  campaignController.counselorListCampaigns
);
router.get(
  "/user-pending",
  authenticateUser,
  campaignController.pendingListCampaigns
);
router.put(
  "/status/:id",
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
router.get(
  "/feedbacks/:id",
  authenticateUser,
  campaignController.listFeedbacks
);
router.put("/:id", authenticateUser, campaignController.updateCampaign);
router.put(
  "/delete/:id",
  authenticateUser,
  campaignController.deleteContentPost
);
router.put(
  "/approve/:id",
  authenticateUser,
  campaignController.updateCampaignPostApprove
);

export default router;
