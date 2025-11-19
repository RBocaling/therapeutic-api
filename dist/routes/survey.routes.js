"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const survey = __importStar(require("../controllers/survey.controllers"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/seed", survey.seedSurveys);
router.get("/seed/:code", auth_middleware_1.authenticateUser, survey.getSurveyByCode);
router.get("/", auth_middleware_1.authenticateUser, survey.getAllSurveys);
router.get("/results", auth_middleware_1.authenticateUser, survey.getUserSurveyResults);
router.get("/survey-history", auth_middleware_1.authenticateUser, survey.getSurveyHistoryController);
router.get("/counselor-survey-history/:userId", auth_middleware_1.authenticateUser, survey.getSurveyHistoryCounselorController);
router.get("/survey-progress/:surveyFormId", auth_middleware_1.authenticateUser, survey.getSurveyProgressController);
router.post("/:code/submit", auth_middleware_1.authenticateUser, survey.submitSurveyResponses);
router.post("/progress-monitoring/notes", auth_middleware_1.authenticateUser, survey.createNote);
router.get("/progress-monitoring", auth_middleware_1.authenticateUser, survey.getAllUserProgressMonitoring);
// view
router.get("/view-user-with-survey/:id", auth_middleware_1.authenticateUser, survey.getUserSurveyResultsByAdmin);
// anay;isis
router.get("/analytics", auth_middleware_1.authenticateUser, survey.getAnalyticsController);
router.get("/analytics/critical-alerts", auth_middleware_1.authenticateUser, survey.getCriticalAlertsController);
router.put("/analytics/critical-alerts/acknowledge/:id", auth_middleware_1.authenticateUser, survey.acknowledgeAlertController);
router.put("/mark-as-review/:id", auth_middleware_1.authenticateUser, survey.markAsMarkedController);
// review mhi 38
router.get("/mhi-38-review", auth_middleware_1.authenticateUser, survey.fetchMHI38Review);
exports.default = router;
