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
    res.json(survey);
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
      const userId = req.user?.id;
      console.log("userId", userId);
      
    const results = await surveyService.getUserSurveyResults(userId!);
    res.json(results);
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