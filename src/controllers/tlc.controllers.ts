import { Request, Response } from "express";
import * as tlcService from "../services/tlc.services";

export const createGuidedTlc = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const { score, resultCategory } = req.body;
    if (resultCategory == "Crisis") {
      return res.status(201).json({ success: true });
    }
    const result = await tlcService.generateGuidedTlc(userId, {
      score: Number(score),
      resultCategory,
    });
    res.status(201).json({ success: true, data: result });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getUserPlans = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const plans = await tlcService.getAllPlansByUser(userId);
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: String(error) });
  }
};

export const getPlanById = async (req: Request, res: Response) => {
  try {
    const planId = Number(req.params.planId);
    const plan = await tlcService.getPlanWithDaysById(planId);
    if (!plan)
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: String(error) });
  }
};

export const completeTasks = async (req: Request, res: Response) => {
  try {
    const planId = Number(req.body.planId);
    const dayNumber = Number(req.body.dayNumber);
    const taskIndices = req.body.taskIndices as number[];
    if (!Array.isArray(taskIndices))
      throw new Error("taskIndices must be an array");

    const result = await tlcService.updateTasks(planId, dayNumber, taskIndices);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: String(error) });
  }
};
