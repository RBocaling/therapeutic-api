import { Request, Response } from "express";
import * as auditService from "../services/audit.services";

export const getAllAuditsController = async (_: Request, res: Response) => {
  try {
    const audits = await auditService.getAllAudits();
    res.json({ success: true, data: audits });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserAuditsController = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const audits = await auditService.getUserAudits(userId);
    res.json({ success: true, data: audits });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
