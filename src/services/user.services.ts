import prisma from "../config/prisma";

export const getUserUserInfo = async (userId: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        middleName: true,
        role: true,
        suffix: true,
        email: true,
        profilePic: true,
        isTakeSurvey: true,
        profile: true,
      },
    });

    if (!user) throw new Error("User not found.");

    return {
      id: user.id,
      name: `${user.firstName} ${user.middleName ?? ""} ${user.lastName} ${
        user.suffix ?? ""
      }`.trim(),
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
      isTakeSurvey: user.isTakeSurvey,
      profile: user.profile,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const listUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isAccountVerified: true,
        profilePic: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return users;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getUserById = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        counselorInfo: true,
      },
    });
    if (!user) throw new Error("User not found");
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};
