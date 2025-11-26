import { CaseIntervention } from "./../../node_modules/.prisma/client/index.d";
// src/services/case.services.ts
import prisma from "../config/prisma";

export const createCase = async (
  counselorId: number,
  data: {
    userId: number;
    category: "STUDENT" | "EMPLOYEE";
    title: string;
    description?: string;
    intervention?: string;
    evidenceUrls?: string[];
  }
) => {
  return await prisma.$transaction(async (tx) => {
    const created = await tx.caseManagement.create({
      data: {
        userId: data?.userId,
        counselorId,
        category: data.category,
        title: data.title,
        description: data.description,
        intervention: data?.intervention,
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

interface InterventionInput {
  id?: number;
  intervention: string;
}

export const createCaseIntervention = async (item: InterventionInput) => {
  const result = await prisma.caseIntervention.upsert({
    where: { intervention: item.intervention },
    update: {
      intervention: item.intervention,
    },
    create: {
      intervention: item.intervention,
    },
  });

  return result;
};

export const getCaseIntervention = async () => {
  return await prisma.caseIntervention.findMany();
};
export const deleteSingleIntervention = async (id: number) => {
  return prisma.caseIntervention.delete({
    where: { id },
  });
};
