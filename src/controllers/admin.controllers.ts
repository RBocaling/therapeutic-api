import { Request, Response } from "express";
import * as adminService from "../services/admin.services";

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await adminService.addAdmin(req.body);
    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createModerator = async (req: Request, res: Response) => {
  try {
    const moderator = await adminService.addModerator(req.body);
    res
      .status(201)
      .json({ message: "Moderator created successfully", moderator });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createCounselor = async (req: Request, res: Response) => {
  try {
    const counselor = await adminService.addCounselor(req.body);
    res
      .status(201)
      .json({ message: "Counselor created successfully", counselor });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
