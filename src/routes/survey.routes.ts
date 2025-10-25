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


// anay;isis
router.get("/analytics", authenticateUser, survey.getAnalyticsController);
router.get(
  "/analytics/critical-alerts",
  authenticateUser,
  survey.getCriticalAlertsController
);
router.put(
  "/analytics/critical-alerts/acknowledge/:id",
  authenticateUser,
  survey.acknowledgeAlertController
);
router.put(
  "/mark-as-review/:id",
  authenticateUser,
  survey.markAsMarkedController
);

// review mhi 38
router.get("/mhi-38-review", authenticateUser, survey.fetchMHI38Review);

export default router;
