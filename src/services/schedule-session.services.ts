import prisma from "../config/prisma";
import { ReminderTiming, SessionStatus } from "@prisma/client";

export const createSchedule = async (payload: {
  counselorId: number;
  userId: number;
  startAt: string;
  endAt?: string;
  sessionType: any;
  notes?: string;
  reminder?: ReminderTiming;
  locationType?: any;
  locationDetail?: string;
  meetingLink?: string;
  phoneNumber?: string;
}) => {
  try {
    const start = new Date(payload.startAt);
    if (isNaN(start.getTime())) throw new Error("Invalid startAt");

    const end = payload.endAt ? new Date(payload.endAt) : null;
    if (end && isNaN(end.getTime())) throw new Error("Invalid endAt");

    const schedule = await prisma.sessionSchedule.create({
      data: {
        counselorId: payload.counselorId,
        userId: payload.userId,
        startAt: start,
        endAt: end,
        sessionType: payload.sessionType,
        notes: payload.notes ?? null,
        reminder: payload.reminder ?? "NONE",
        locationType: payload.locationType ?? "IN_PERSON",
        locationDetail: payload.locationDetail ?? null,
        meetingLink: payload.meetingLink ?? null,
        phoneNumber: payload.phoneNumber ?? null,
      },
    });

    await prisma.notification.create({
      data: {
        recipientId: payload.userId,
        type: "SESSION_SCHEDULING",
        title: "New Counseling Session Scheduled",
        message: `Your ${payload.sessionType.toLowerCase()} session is scheduled on ${start.toLocaleString(
          "en-PH",
          { timeZone: "Asia/Manila" }
        )}.`,
      },
    });

    return schedule;
  } catch (error:any) {
    throw new Error(error);
  }
};

export const listSchedulesForUser = async (userId: number) => {
  try {
    return prisma.sessionSchedule.findMany({
      where: { userId },
      include: {
        counselor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
      },
      orderBy: { startAt: "desc" },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const listSchedulesForCounselor = async (counselorId: number) => {
  try {
    return await prisma.sessionSchedule.findMany({
      where: { counselorId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
      },
      orderBy: { startAt: "desc" },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getScheduleById = async (id: number) => {
  try {
    return prisma.sessionSchedule.findUnique({
      where: { id },
      include: {
        counselor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
            email: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
            email: true,
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateScheduleStatus = async (
  id: number,
  status: SessionStatus
) => {
  try {
    const s = await prisma.sessionSchedule.update({
      where: { id },
      data: { status },
      include: { user: true, counselor: true },
    });
    await prisma.notification.create({
      data: {
        recipientId: s.userId,
        type: "SESSION_SCHEDULING",
        title: `Session ${status}`,
        message: `Your session on ${s.startAt.toISOString()} is now ${status}.`,
      },
    });
    return s;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteSchedule = async (id: number) => {
  try {
    return prisma.sessionSchedule.delete({ where: { id } });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const markReminderSent = async (id: number) => {
  try {
    return prisma.sessionSchedule.update({
      where: { id },
      data: { reminderSentAt: new Date() },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const markCompletedNotified = async (id: number) => {
  try {
    return prisma.sessionSchedule.update({
      where: { id },
      data: { completedNotifiedAt: new Date(), status: "COMPLETED" },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};