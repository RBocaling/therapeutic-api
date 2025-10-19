import { Request, Response } from "express";
import * as user from "../services/user.services";

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const data = await user.getUserUserInfo(userId);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
