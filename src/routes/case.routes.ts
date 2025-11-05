// src/routes/case.routes.ts
import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import * as Case from "../controllers/case.controllers";

const router = Router();

router.post("/", authenticateUser, Case.createCase);
router.get("/", authenticateUser, Case.getCases);
router.get("/:caseId", authenticateUser, Case.getCaseById as any);
router.put("/status/:caseId", authenticateUser, Case.updateCaseStatus);

export default router;
