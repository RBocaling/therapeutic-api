import prisma from "../config/prisma";
import argon2 from "argon2";

export const addAdmin = async (data: any) => {
  const { email, password } = data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already registered.");

  const hashedPassword = await argon2.hash(password);

  const admin = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      email,
      password: hashedPassword,
      role: "ADMIN",
      profilePic: data.profilePic ?? null,
    },
  });

  return admin;
};

export const addModerator = async (data: any) => {
  const { email, password } = data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already registered.");

  const hashedPassword = await argon2.hash(password);

  const moderator = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      email,
      password: hashedPassword,
      role: "MODERATOR",
      profilePic: data.profilePic ?? null,
    },
  });

  return moderator;
};

export const addCounselor = async (data: any) => {
  const { email, password } = data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already registered.");

  const hashedPassword = await argon2.hash(password);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        email,
        password: hashedPassword,
        role: "COUNSELOR",
        profilePic: data.profilePic ?? null,
      },
    });

    const counselorProfile = await tx.counselorProfile.create({
      data: {
        userId: user.id,
        licenseNumber: data.licenseNumber ?? null,
        specialization: data.specialization ?? null,
        experienceYears: data.experienceYears ?? 0,
      },
    });

    return { ...user, counselorProfile };
  });

  return result;
};
