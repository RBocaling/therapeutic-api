// src/services/case.services.ts
import prisma from "../config/prisma";

export const createCase = async (
  userId: number,
  data: {
    counselorId: number;
    category: "STUDENT" | "EMPLOYEE";
    title: string;
    description?: string;
    evidenceUrls?: string[];
  }
) => {
  return await prisma.$transaction(async (tx) => {
    const created = await tx.caseManagement.create({
      data: {
        userId,
        counselorId: data.counselorId,
        category: data.category,
        title: data.title,
        description: data.description,
      },
    });

    if (data.evidenceUrls?.length) {
      await tx.caseEvidence.createMany({
        data: data.evidenceUrls.map((url) => ({
          caseId: created.id,
          imageUrl: url,
        })),
      });
    }

    return created;
  });
};

export const getAllCases = async () => {
  return prisma.caseManagement.findMany({
    include: {
      evidences: true,
      user: { select: { id: true, firstName: true, lastName: true } },
      counselor: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getCaseById = async (caseId: number) => {
  return prisma.caseManagement.findUnique({
    where: { id: caseId },
    include: { evidences: true, user: true, counselor: true },
  });
};

export const updateCaseStatus = async (caseId: number, status: any) => {
  return prisma.caseManagement.update({
    where: { id: caseId },
    data: { status },
  });
};
