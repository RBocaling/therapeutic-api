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
exports.fetchMHI38Review = exports.markAsMarkedController = exports.acknowledgeAlertController = exports.getCriticalAlertsController = exports.getAnalyticsController = exports.createNote = exports.getAllUserProgressMonitoring = exports.getSurveyProgressController = exports.getSurveyHistoryController = exports.getUserSurveyResultsByAdmin = exports.getUserSurveyResults = exports.submitSurveyResponses = exports.getSurveyByCode = exports.getAllSurveys = exports.seedSurveys = void 0;
const surveyService = __importStar(require("../services/survey.services"));
const surveyData_1 = require("../utils/surveyData");
const seedSurveys = async (_req, res) => {
    try {
        const data = await surveyService.seedSurveys(surveyData_1.seedAllSurveysData);
        res.status(200).json({ message: "Surveys seeded successfully", data });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.seedSurveys = seedSurveys;
const getAllSurveys = async (_req, res) => {
    try {
        const surveys = await surveyService.getAllSurveys();
        res.json(surveys);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllSurveys = getAllSurveys;
const getSurveyByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const survey = await surveyService.getSurveyByCode(code);
        if (!survey)
            return res.status(404).json({ message: "Survey not found" });
        const cleanedSurvey = {
            ...survey,
            questions: survey.questions.map((q) => ({
                ...q,
                options: Array.isArray(q.options)
                    ? q.options
                    : q.options?.options || [],
            })),
        };
        res.json(cleanedSurvey);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getSurveyByCode = getSurveyByCode;
const submitSurveyResponses = async (req, res) => {
    try {
        const { code } = req.params;
        const userId = req.user?.id;
        const { answers } = req.body;
        const response = await surveyService.submitSurveyResponse(userId, code, answers);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.submitSurveyResponses = submitSurveyResponses;
const getUserSurveyResults = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        const data = await surveyService.getUserSurveyResults(userId);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserSurveyResults = getUserSurveyResults;
const getUserSurveyResultsByAdmin = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const data = await surveyService.getUserSurveyResults(userId);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserSurveyResultsByAdmin = getUserSurveyResultsByAdmin;
const getSurveyHistoryController = async (req, res) => {
    try {
        const userProfileId = Number(req.user?.profile?.id);
        const data = await surveyService.getSurveyHistory(userProfileId);
        res.status(200).json(data);
    }
    catch (error) {
        console.error("Error fetching survey history:", error);
        res.status(500).json({ message: "Failed to fetch survey history." });
    }
};
exports.getSurveyHistoryController = getSurveyHistoryController;
// progress monitoringg
const getSurveyProgressController = async (req, res) => {
    try {
        const userProfileId = Number(req.user?.profile?.id);
        const surveyFormId = Number(req.params.surveyFormId);
        const data = await surveyService.getSurveyProgress(userProfileId, surveyFormId);
        res.status(200).json(data);
    }
    catch (error) {
        console.error("Error fetching survey progress:", error);
        res.status(500).json({ message: "Failed to fetch survey progress." });
    }
};
exports.getSurveyProgressController = getSurveyProgressController;
const getAllUserProgressMonitoring = async (req, res) => {
    try {
        const data = await surveyService.getAllUserProgressMonitoring();
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllUserProgressMonitoring = getAllUserProgressMonitoring;
const createNote = async (req, res) => {
    try {
        const counselorId = Number(req.user?.id);
        if (!counselorId)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const { userId, noteType, mood, riskLevel, content, tags } = req.body;
        const note = await surveyService.createNote({
            userId,
            counselorId,
            noteType,
            mood,
            riskLevel,
            content,
            tags,
        });
        res.status(201).json({ success: true, data: note });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createNote = createNote;
// anyalysis
const getAnalyticsController = async (req, res) => {
    try {
        const counselorId = req.user?.role === "COUNSELOR" ? req.user.id : undefined;
        const data = await surveyService.getAnalytics(counselorId);
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAnalyticsController = getAnalyticsController;
const getCriticalAlertsController = async (req, res) => {
    try {
        const counselorId = req.user?.role === "COUNSELOR" ? req.user.id : undefined;
        const data = await surveyService.getCriticalAlerts(counselorId);
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCriticalAlertsController = getCriticalAlertsController;
const acknowledgeAlertController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updated = await surveyService.acknowledgeAlert(id);
        res.status(200).json({ success: true, updated });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.acknowledgeAlertController = acknowledgeAlertController;
const markAsMarkedController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updated = await surveyService.markAsReviewed(id);
        res.status(200).json({ success: true, updated });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.markAsMarkedController = markAsMarkedController;
const fetchMHI38Review = async (req, res) => {
    try {
        const result = await surveyService.getMHI38Review();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.fetchMHI38Review = fetchMHI38Review;
