import prisma from "../config/prisma";

export const getUserUserInfo = async (userId: number) => {
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
};
