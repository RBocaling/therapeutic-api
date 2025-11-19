// src/routes/case.routes.ts
import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import * as Case from "../controllers/case.controllers";

const router = Router();

router.post("/", authenticateUser, Case.createCase);
router.get("/", authenticateUser, Case.getCases);
router.put("/status/:caseId", authenticateUser, Case.updateCaseStatus);

// intervemtion
router.post(
  "/intervention",
  authenticateUser,
  Case.createCaseIntervention as any
);
router.get("/intervention", authenticateUser, Case.getCaseIntervention);
router.delete(
  "/intervention/:id",
  authenticateUser,
  Case.deleteCaseIntervention as any
);
router.get("/:caseId", authenticateUser, Case.getCaseById as any);


export default router;
