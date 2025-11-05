import { Request, Response } from "express";
import * as user from "../services/user.services";
import { generateQuoteOfTheDay } from "../services/qoutes.services";

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    await generateQuoteOfTheDay(userId);
    const data = await user.getUserUserInfo(userId);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const listUsersController = async (req: Request, res: Response) => {
  try {
    const users = await user.listUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid ID" });

    const userResponse = await user.getUserById(id);
    res.json(userResponse);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};