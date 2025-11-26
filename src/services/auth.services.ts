import argon2 from "argon2";
import { Response } from "express";
import prisma from "../config/prisma";
import { sendMail } from "../utils/mailer";
import { generateOtp } from "../utils/otp";
import { generateTokens } from "../utils/jwt";
import { createNotification } from "./notification.services";
import { verifyGoogleToken } from "../utils/googleClient";

// connect google
export const googleAuthService = async (token: string, res: Response) => {
  try {
    let googleUser: any;
    if (token.startsWith("ya29.")) {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      googleUser = await response.json();
      if (!googleUser?.email) throw new Error("Invalid Google access token.");
    } else {
      googleUser = await verifyGoogleToken(token);
      if (!googleUser?.email) throw new Error("Invalid Google ID token.");
    }

    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firstName: googleUser.given_name ?? "",
          lastName: googleUser.family_name ?? "",
          email: googleUser.email,
          isAccountVerified: true,
          googleId: googleUser.sub,
          profile: { create: { userStatus: "STUDENT" } },
        },
      });
    } else if (!user.googleId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { googleId: googleUser.sub },
      });
    }

    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return user;
  } catch (error: any) {
    throw new Error(error.message || "Google authentication failed.");
  }
};

// manualll
export const registerUser = async (data: any) => {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new Error("Email already registered.");

    const hashedPassword = await argon2.hash(data.password);
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: data.middleName ?? null,
          suffix: data.suffix ?? null,
          email: data.email,
          password: hashedPassword,
          profile: { create: { userStatus: data.userStatus ?? "STUDENT" } },
          otpCode: otp,
          otpExpiresAt: expiresAt,
        },
        include: { profile: true },
      });

      await sendMail(
        data.email,
        "Verify your Account",
        `<h3>Welcome, ${data.firstName}!</h3>
         <p>Your OTP is:</p>
         <h2 style="color:#4CAF50;">${otp}</h2>
         <p>Expires in 10 minutes.</p>`
      );

      return newUser;
    });

    return user;
  } catch (err: any) {
    throw new Error(err.message || "Registration failed.");
  }
};

export const loginUser = async (
  { email, password }: { email: string; password: string },
  res: Response
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        role: true,
        isAccountVerified: true,
        profile: { select: { id: true } },
      },
    });
    if (!user?.password || !user) throw new Error("User not found.");

    const valid = await argon2.verify(user?.password, password);
    if (!valid) throw new Error("Invalid credentials.");
    if (user.role === "USER" && !user.isAccountVerified)
      throw new Error("Account not verified.");

    const tokens = generateTokens(user);
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".ascot-mentalhealthcare.site",
      path: "/",
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".ascot-mentalhealthcare.site",
      path: "/",
    });


    return user;
  } catch (err: any) {
    throw new Error(err.message || "Login failed.");
  }
};

export const verifyAccountService = async (email: string, otp: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found.");
    if (user.isAccountVerified) throw new Error("Account already verified.");
    if (user.otpCode !== otp) throw new Error("Invalid OTP.");
    if (user.otpExpiresAt && user.otpExpiresAt < new Date())
      throw new Error("OTP expired.");

    const data = await prisma.user.update({
      where: { email },
      data: { isAccountVerified: true, otpCode: null, otpExpiresAt: null },
    });

    await createNotification({
      recipientId: Number(user.id),
      type: "ACCOUNT_VERIFIED",
      title: "Account Verified Successfully",
      message: `Hi ${user.firstName}, your account has been verified. `,
    });

    return data;
  } catch (err: any) {
    throw new Error(err.message || "Verification failed.");
  }
};

export const completeUserProfile = async (userId: number, data: any) => {
  try {
    return await prisma.userProfile.update({
      where: { userId },
      data: {
        gender: data.gender ?? undefined,
        birthday: data.birthday ? new Date(data.birthday) : undefined,
        country: data.country ?? undefined,
        province: data.province ?? undefined,
        municipality: data.municipality ?? undefined,
        barangay: data.barangay ?? undefined,
        contactNo: data.contactNo ?? undefined,
        guardianName: data.guardianName ?? undefined,
        guardianContact: data.guardianContact ?? undefined,
        userStatus: data.userStatus ?? undefined,
        validId: data.validId ?? undefined,
        selfieImage: data.selfieImage ?? undefined,
        isFirstGenerationStudent: data.isFirstGenerationStudent ?? undefined,
        employeeOffice: data.employeeOffice ?? undefined,
        employeeUnit: data.employeeUnit ?? undefined,
        indigenousGroup: data.indigenousGroup ?? undefined,
        isSingleParent: data.isSingleParent ?? undefined,
        singleParentYears: data.singleParentYears ?? undefined,
        isPWD: data.isPWD ?? undefined,
        disability: data.disability ?? undefined,
        familyIncomeRange: data.familyIncomeRange ?? undefined,
        school: data.school ?? undefined,
        course: data.course ?? undefined,
        yearLevel: data.yearLevel ?? undefined,
        sectionBlock: data.sectionBlock ?? undefined,
        office: data.office ?? undefined,
        jobPosition: data.jobPosition ?? undefined,
        isKycVerified: data.isKycVerified ?? undefined,
      },
    });
  } catch (err: any) {
    throw new Error(err.message || "Profile update failed.");
  }
};

export const getProfileProgress = async (userId: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || !user.profile) throw new Error("Profile not found");

    const profile = user.profile;
    const personalFields = [
      "gender",
      "birthday",
      "country",
      "province",
      "municipality",
      "barangay",
      "contactNo",
      "guardianName",
      "guardianContact",
      "userStatus",
      "validId",
      "selfieImage",
    ];

    const filledFields = personalFields.filter(
      (f) =>
        profile[f as keyof typeof profile] !== null &&
        profile[f as keyof typeof profile] !== undefined &&
        profile[f as keyof typeof profile] !== ""
    );

    const personalInfoComplete =
      filledFields.length / personalFields.length >= 0.8;
    const profilePictureComplete = !!user.profilePic;
    const kycComplete = !!profile.isKycVerified;

    let progress = 0;
    if (personalInfoComplete) progress += 50;
    if (profilePictureComplete) progress += 20;
    if (kycComplete) progress += 30;

    const summary = {
      personalInfo: personalInfoComplete,
      profilePicture: profilePictureComplete,
      kycVerification: kycComplete,
    };

    return { progress, summary };
  } catch (error: any) {
    throw new Error(error.message || "Failed to get profile progress.");
  }
};

export const updateProfilePictureService = async (
  userId: number,
  profilePic: string
) => {
  try {
    if (!profilePic) throw new Error("Profile picture is required");
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { profilePic },
    });
    return updated;
  } catch (error: any) {
    throw new Error(error.message || "Failed to upload profile.");
  }
};

// SECURITY
export const changePassword = async (
  userId: number,
  oldPassword: string,
  newPassword: string
) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user?.password || !user?.email)
      throw new Error("User not found.");

    const valid = await argon2.verify(user.password, oldPassword);
    if (!valid) throw new Error("Old password is incorrect.");

    const hashed = await argon2.hash(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    await sendMail(
      user.email,
      "Your Password Has Been Changed",
      `<p>Hello ${user.firstName},</p>
     <p>Your account password has been successfully changed. If you did not perform this action, please contact support immediately.</p>`
    );

    return { message: "Password changed successfully." };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found.");

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { otpCode: otp, otpExpiresAt: expiresAt },
    });

    await sendMail(
      email,
      "Reset Your Password",
      `<p>Hello ${user.firstName},</p>
     <p>Your password reset OTP is:</p>
     <h2 style="color:#4CAF50;">${otp}</h2>
     <p>Expires in 10 minutes.</p>`
    );

    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found.");
    if (user.otpCode !== otp) throw new Error("Invalid OTP.");
    if (user.otpExpiresAt && user.otpExpiresAt < new Date())
      throw new Error("OTP expired.");

    const hashed = await argon2.hash(newPassword);

    await prisma.user.update({
      where: { email },
      data: { password: hashed, otpCode: null, otpExpiresAt: null },
    });

    await sendMail(
      email,
      "Your Password Has Been Reset",
      `<p>Hello ${user.firstName},</p>
     <p>Your account password has been successfully reset. If you did not perform this action, please contact support immediately.</p>`
    );

    return { message: "Password reset successfully." };
  } catch (error: any) {
    throw new Error(error);
  }
};
