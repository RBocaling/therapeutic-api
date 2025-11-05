import { Request, Response } from "express";
import * as auth from "../services/auth.services";
import * as auditService from "../services/audit.services";
import { createNotification } from "../services/notification.services";
import { generateQuoteOfTheDay } from "../services/qoutes.services";

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const tokens = await auth.googleAuthService(token, res);
    await generateQuoteOfTheDay(token?.id);
    await auditService.createAudit({
      description: "Login on Google",
      type: "LOGIN",
      userId: token?.id,
    });

    res.status(200).json({ message: "Google login successful", tokens });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const user = await auth.registerUser(req.body);
    await auditService.createAudit({
      description: "Register",
      type: "REGISTER",
      userId: user?.id,
    });
    await generateQuoteOfTheDay(user?.id);
    res.status(201).json({ message: "Registered successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await auth.loginUser(req.body, res);
    await auditService.createAudit({
      description: "Login",
      type: "LOGIN",
      userId: user?.id,
    });
    await generateQuoteOfTheDay(user?.id);
    res.status(200).json({ message: "Login successful" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyAccount = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await auth.verifyAccountService(email, otp);
    await auditService.createAudit({
      description: "Verify Account",
      type: "VERIFY_ACCOUNT",
      userId: user?.id,
    });
    res.status(200).json({ message: "Account verified successfully." });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const completeProfile = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const user = await auth.completeUserProfile(userId, req.body);
    await auditService.createAudit({
      description: "Login",
      type: "LOGIN",
      userId: userId,
    });
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
export const updateKycStatus = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const user = await auth.completeUserProfile(userId, req.body);
    await auditService.createAudit({
      description: "Successfully Kyc Verified",
      type: "KYC_VERIFICATION",
      userId: userId,
    });
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
    await auditService.createAudit({
      description: "Successfully Updated Profile",
      type: "PROFILE_UPDATE",
      userId: userId,
    });
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
    await auditService.createAudit({
      description: "Successfully Password Changed",
      type: "CHANGE_PASSWORD",
      userId: userId,
    });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await auth.forgotPassword(email);
    await auditService.createAudit({
      description: "Successfully Password Changed",
      type: "CHANGE_PASSWORD",
      userId: result?.id,
    });
    res.status(200).json({ message: "OTP sent to your email." });
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