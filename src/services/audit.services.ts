import prisma from "../config/prisma";

export const createAudit = async (data: {
  userId?: number;
  type: string;
  description: string;
}) => {
  try {
    return prisma.auditTrail.create({
      data: {
        userId: data.userId,
        type: data.type,
        description: data.description,
      },
    });
  } catch (error:any) {
    throw new Error(error)
  }
};

export const getAllAudits = async () => {
  try {
    return prisma.auditTrail.findMany({
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, role: true, profilePic:true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error:any) {
    throw new Error(error)
  }
};

export const getUserAudits = async (userId: number) => {
  try {
    return prisma.auditTrail.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error:any) {
    throw new Error(error)
  }
};
