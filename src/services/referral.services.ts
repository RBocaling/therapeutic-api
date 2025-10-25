import prisma from "../config/prisma";
import { createNotification } from "./notification.services";

export const createReferral = async (payload: {
  userId: number;
  counselorId?: number | null;
  referrerId: number;
  concern: string;
  shortDescription: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  recipient: string;
  summaryNotes?: string | null;
}) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) throw new Error("User not found");

    if (payload.counselorId) {
      const counselor = await prisma.user.findUnique({
        where: { id: payload.counselorId },
      });
      if (!counselor) throw new Error("Counselor not found");
    }

    const referrer = await prisma.user.findUnique({
      where: { id: payload.referrerId },
    });
    if (!referrer) throw new Error("Referrer not found");

    const referral = await prisma.referral.create({
      data: {
        userId: payload.userId,
        counselorId: payload.counselorId ?? null,
        referrerId: payload.referrerId,
        concern: payload.concern,
        shortDescription: payload.shortDescription,
        priority: payload.priority,
        recipient: payload.recipient,
        summaryNotes: payload.summaryNotes ?? null,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        counselor: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        referrer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    if (referral.counselorId) {        
        await createNotification({
          recipientId: referral.counselorId,
          type: "REFERRAL",
          title: "New Referral Assigned",
          message: `You have been assigned a referral for ${referral.user.firstName} ${referral.user.lastName}.`,
        });
    }

      await createNotification({
        recipientId: referral.referrerId,
        type: "REFERRAL",
        title: "Referral Sent",
        message: `Referral for ${referral.user.firstName} ${referral.user.lastName} has been created.`,
      });

    return referral;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create referral");
  }
};

export const listReferrals = async (id:number, role:any) => {

  const where: any = {};

  if (role === "USER") where.userId = id;
  if (role === "COUNSELOR") where.counselorId = id;
  if (role === "REFERRER") where.referrerId = id;

  try {
    const referrals = await prisma.referral.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePic: true,
            isAccountVerified: true,
          },
        },
        counselor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePic: true,
          },
        },
        referrer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return referrals;
  } catch (error: any) {
    throw new Error(error.message || "Failed to list referrals");
  }
};

export const getReferralById = async (id: number) => {
  try {
    const referral = await prisma.referral.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePic: true,
          },
        },
        counselor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePic: true,
          },
        },
        referrer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
    if (!referral) throw new Error("Referral not found");
    return referral;
  } catch (error: any) {
    throw new Error(error.message || "Failed to get referral");
  }
};

export const updateReferral = async (
  id: number,
  data: {
    counselorId?: number | null;
    status?: "SENT" | "ACCEPTED" | "COMPLETED" | "REJECTED" | "PENDING";
    summaryNotes?: string | null;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    recipient?: string;
  },
  actorId?: number
) => {
  if (data.counselorId) {
    const counselor = await prisma.user.findUnique({
      where: { id: data.counselorId },
    });
    if (!counselor) throw new Error("Counselor not found");
  }

  const referral = await prisma.referral.update({
    where: { id },
    data: {
      counselorId: data.counselorId ?? undefined,
      status: data.status ?? undefined,
      summaryNotes: data.summaryNotes ?? undefined,
      priority: data.priority ?? undefined,
      recipient: data.recipient ?? undefined,
    },
    include: {
      user: true,
      counselor: true,
      referrer: true,
    },
  });

  if (data.status) {
    await prisma.notification.create({
      data: {
        recipientId: referral.referrerId,
        type: "ACTIVITY_PROGRESS",
        title: `Referral ${data.status}`,
        message: `Referral for ${referral.user.firstName} ${referral.user.lastName} is now ${data.status}.`,
      },
    });
  }

  if (data.counselorId) {
    await prisma.notification.create({
      data: {
        recipientId: Number(data.counselorId),
        type: "REFERRAL",
        title: "Referral Assigned",
        message: `You were assigned referral for ${referral.user.firstName} ${referral.user.lastName}.`,
      },
    });
  }

  return referral;
};

export const deleteReferral = async (id: number) => {
  try {
    await prisma.referral.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete referral");
  }
};
