import { Request, Response } from "express";
import { getReportOverview } from "../services/report.services";

export const getReports = async (req: Request, res: Response) => {
  try {
    const couselorId = Number(req?.user?.id);
console.log("couselorId", couselorId);

    const response = await getReportOverview(couselorId);
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
