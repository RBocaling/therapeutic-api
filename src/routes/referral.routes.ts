import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import * as referral from "../controllers/referral.controllers";

const router = Router();

router.post("/", authenticateUser, referral.createReferralController as any);
router.get("/", authenticateUser, referral.listReferralsController);
router.get("/:id", authenticateUser, referral.getReferralController as any);
router.put("/:id", authenticateUser, referral.updateReferralController  as any);
router.delete("/:id", authenticateUser, referral.deleteReferralController as any);

export default router;
