// src/controllers/case.controllers.ts
import { Request, Response } from "express";
import * as caseService from "../services/case.services";

export const createCase = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);

    const result = await caseService.createCase(userId, req.body);

    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCases = async (_req: Request, res: Response) => {
  try {
    const cases = await caseService.getAllCases();
    res.json({ success: true, data: cases });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCaseById = async (req: Request, res: Response) => {
  try {
    const caseId = Number(req.params.caseId);
    const found = await caseService.getCaseById(caseId);

    if (!found)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, data: found });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCaseStatus = async (req: Request, res: Response) => {
  try {
    const caseId = Number(req.params.caseId);
    const { status } = req.body;

    const result = await caseService.updateCaseStatus(caseId, status);

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
