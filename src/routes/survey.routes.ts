import { Router } from "express";
import * as survey from "../controllers/survey.controllers";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.post("/seed", survey.seedSurveys);
router.get("/seed/:code", authenticateUser, survey.getSurveyByCode as any);

router.get("/", authenticateUser, survey.getAllSurveys);
router.get("/results", authenticateUser, survey.getUserSurveyResults);

router.get("/survey-history",authenticateUser, survey.getSurveyHistoryController);
router.get(
    "/survey-progress/:surveyFormId",
    authenticateUser,
  survey.getSurveyProgressController
);

router.post("/:code/submit", authenticateUser, survey.submitSurveyResponses);
router.get(
  "/progress-monitoring",
  authenticateUser,
  survey.getAllUserProgressMonitoring
);

// view
router.get(
  "/view-user-with-survey/:id",
  authenticateUser,
  survey.getUserSurveyResultsByAdmin
);

export default router;
