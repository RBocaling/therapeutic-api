import { Request, Response } from "express";
import * as auth from "../services/auth.services";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await auth.registerUser(req.body);
    res.status(201).json({ message: "Registered successfully", user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await auth.loginUser({ email, password }, res);
    res.status(200).json({ message: "Login successful" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};



export const verifyAccount = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const result = await auth.verifyAccountService(email, otp);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};