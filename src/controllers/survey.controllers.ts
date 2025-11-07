import { Request, Response } from "express";
import * as surveyService from "../services/survey.services";
import { seedAllSurveysData } from "../utils/surveyData";

export const seedSurveys = async (_req: Request, res: Response) => {
  try {
    const data = await surveyService.seedSurveys(seedAllSurveysData);
    res.status(200).json({ message: "Surveys seeded successfully", data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSurveys = async (_req: Request, res: Response) => {
  try {
    const surveys = await surveyService.getAllSurveys();
    res.json(surveys);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSurveyByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const survey = await surveyService.getSurveyByCode(code);

    if (!survey) return res.status(404).json({ message: "Survey not found" });

   const cleanedSurvey = {
     ...survey,
     questions: survey.questions.map((q: any) => ({
       ...q,
       options: Array.isArray(q.options)
         ? q.options
         : q.options?.options?.sort((a: any, b: any) => b?.score - a?.score) ||
           [],
     })),
   };


    res.json(cleanedSurvey);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitSurveyResponses = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const userId = req.user?.id;
    const { answers } = req.body;

    const response = await surveyService.submitSurveyResponse(
      userId!,
      code,
      answers
    );

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserSurveyResults = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const data = await surveyService.getUserSurveyResults(userId);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserSurveyResultsByAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.id);
    const data = await surveyService.getUserSurveyResults(userId);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSurveyHistoryController = async (
  req: Request,
  res: Response
) => {
  try {
    const userProfileId = Number(req.user?.profile?.id);
    const data = await surveyService.getSurveyHistory(userProfileId);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching survey history:", error);
    res.status(500).json({ message: "Failed to fetch survey history." });
  }
};

// progress monitoringg
export const getSurveyProgressController = async (
  req: Request,
  res: Response
) => {
  try {
    const userProfileId = Number(req.user?.profile?.id);
    const surveyFormId = Number(req.params.surveyFormId);
    const data = await surveyService.getSurveyProgress(
      userProfileId,
      surveyFormId
    );
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching survey progress:", error);
    res.status(500).json({ message: "Failed to fetch survey progress." });
  }
};

export const getAllUserProgressMonitoring = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await surveyService.getAllUserProgressMonitoring();
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNote = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// anyalysis
export const getAnalyticsController = async (req: Request, res: Response) => {
  try {
    const counselorId =
      req.user?.role === "COUNSELOR" ? req.user.id : undefined;
    const data = await surveyService.getAnalytics(counselorId);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCriticalAlertsController = async (
  req: Request,
  res: Response
) => {
  try {
    const counselorId =
      req.user?.role === "COUNSELOR" ? req.user.id : undefined;
    const data = await surveyService.getCriticalAlerts(counselorId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const acknowledgeAlertController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const updated = await surveyService.acknowledgeAlert(id);
    res.status(200).json({ success: true, updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const markAsMarkedController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const updated = await surveyService.markAsReviewed(id);
    res.status(200).json({ success: true, updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}; 


export const fetchMHI38Review = async (req: Request, res: Response) => {
  try {
    const result = await surveyService.getMHI38Review();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};