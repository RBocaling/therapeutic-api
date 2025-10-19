import argon2 from "argon2";
import { generateTokens } from "../utils/jwt";
import { Response } from "express";
import prisma from "../config/prisma";
import { sendMail } from "../utils/mailer";
import { generateOtp } from "../utils/otp";

export const registerUser = async (data: any) => {
  const { email, password } = data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already registered.");

  const hashedPassword = await argon2.hash(password);
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        suffix: data.suffix,
        email,
        password: hashedPassword,
        profilePic: data.profilePic ?? null,
        otpExpiresAt: expiresAt,
        otpCode:otp,
        profile: {
          create: {
            gender: data.gender,
            birthday: data.birthday ? new Date(data.birthday) : null,
            country: data.country,
            province: data.province,
            municipality: data.municipality,
            barangay: data.barangay,
            contactNo: data.contactNo,
            guardianName: data.guardianName,
            guardianContact: data.guardianContact,
            userStatus: data.userStatus as "STUDENT" | "EMPLOYED",
            validId: data.validId,
            selfieImage: data.selfieImage,
            isFirstGenerationStudent: data.isFirstGenerationStudent ?? false,
            indigenousGroup: data.indigenousGroup,
            isSingleParent: data.isSingleParent ?? false,
            singleParentYears: data.singleParentYears ?? null,
            isPWD: data.isPWD ?? false,
            disability: data.disability,
            familyIncomeRange: data.familyIncomeRange,
            school: data.school,
            course: data.course,
            yearLevel: data.yearLevel,
            sectionBlock: data.sectionBlock,
            office: data.office,
            jobPosition: data.jobPosition,
          },
        },
      },
      include: { profile: true },
    });

    // await sendMail(
    //   email,
    //   "Verify your Account",
    //   `
    //     <h3>Welcome, ${data.firstName}!</h3>
    //     <p>Your One-Time Password (OTP) is:</p>
    //     <h2 style="color:#4CAF50;">${otp}</h2>
    //     <p>This code will expire in 10 minutes.</p>
    //   `
    // );

    return user;
  });

  return result;
};

export const loginUser = async (
  { email, password }: { email: string; password: string },
  res: Response
) => {
  
  const user = await prisma.user.findUnique({
    where: { email }, select: {
      id: true,
      password: true,
      role: true,
      isAccountVerified:true,
      profile: {
        select: {
          id:true
        }
      }
  }});
  if (!user) throw new Error("User not found.");

  const valid = await argon2.verify(user.password, password);
  if (!valid) throw new Error("Invalid credentials.");

  if (user.role =="USER" && !user.isAccountVerified)
    throw new Error("Account not verified. Please check your email for OTP.");

  const tokens = generateTokens(user);

  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return user;
};


// verify account
export const verifyAccountService = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found.");

  if (user.isAccountVerified) throw new Error("Account already verified.");

  if (user.otpCode !== otp) throw new Error("Invalid OTP.");

  if (user.otpExpiresAt && user.otpExpiresAt < new Date())
    throw new Error("OTP expired.");

  await prisma.user.update({
    where: { email },
    data: {
      isAccountVerified: true,
      otpCode: null,
      otpExpiresAt: null,
    },
  });

  return { message: "Account verified successfully." };
};