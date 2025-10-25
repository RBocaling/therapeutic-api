import { Request, Response } from "express";
import * as auth from "../services/auth.services";
import { createNotification } from "../services/notification.services";


export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const tokens = await auth.googleAuthService(token);
    res.status(200).json({ message: "Google login successful", tokens });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


export const register = async (req: Request, res: Response) => {
  try {
    await auth.registerUser(req.body);
    res.status(201).json({ message: "Registered successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    await auth.loginUser(req.body, res);
    res.status(200).json({ message: "Login successful" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyAccount = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    await auth.verifyAccountService(email, otp);

    res.status(200).json({ message: "Account verified successfully." });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const completeProfile = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    await auth.completeUserProfile(userId, req.body);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
export const updateKycStatus = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const user = await auth.completeUserProfile(userId, req.body);
    if (req?.body) {
      await createNotification({
        recipientId: Number(user.id),
        type: "KYC_VERIFIED",
        title: "KYC Verification Completed",
        message: `Your KYC verification has been successfully completed.`,
      });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getProfileProgress = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const result = await auth.getProfileProgress(userId);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateProfilePicture = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const { profilePic } = req.body;
    await auth.updateProfilePictureService(userId, profilePic);
    res.json({
      message: "Profile picture updated successfully",
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// secu
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const { oldPassword, newPassword } = req.body;
    const result = await auth.changePassword(userId, oldPassword, newPassword);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await auth.forgotPassword(email);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await auth.resetPassword(email, otp, newPassword);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};