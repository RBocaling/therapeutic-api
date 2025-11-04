import { authenticateUser } from "./../middlewares/auth.middleware";
import { Router } from "express";
import * as tlc from "../controllers/tlc.controllers";

const router = Router();
router.post("/", authenticateUser, authenticateUser, tlc.createGuidedTlc);
router.get("/", authenticateUser, tlc.getUserPlans);
router.get("/:planId", authenticateUser, tlc.getPlanById as any);
router.put("/", authenticateUser, tlc.completeTasks);

export default router;
