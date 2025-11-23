import prisma from "../config/prisma";
import { sendMail } from "../utils/mailer";
import { createNotification } from "./notification.services";

export const scheduleService = {
  listSchedulesForUser: async (userId: number) => {
    return prisma.sessionSchedule.findMany({
      where: { userId },
      include: { counselor: true, user: true },
      orderBy: { startAt: "asc" },
    });
  },

  listSchedulesForCounselor: async (counselorId: number) => {
    return prisma.sessionSchedule.findMany({
      where: { counselorId },
      include: { counselor: true, user: true },
      orderBy: { startAt: "asc" },
    });
  },

  processDueSessions: async () => {
    const now = new Date();

    const sessions = await prisma.sessionSchedule.findMany({
      where: {
        startAt: { lte: now }, // start time reached
        reminderSentAt: null, // not yet notified
        status: "PENDING",
      },
      include: { user: true, counselor: true },
    });

    for (const s of sessions) {
      // send notifications
      await createNotification({
        recipientId: s.userId,
        type: "SESSION_REMINDER",
        title: "Your session starts now",
        message: `Your counseling session with ${s.counselor.firstName} starts now.`,
      });

      await createNotification({
        recipientId: s.counselorId,
        type: "SESSION_REMINDER",
        title: "Your session starts now",
        message: `Your session with ${s.user.firstName} starts now.`,
      });

      // send email to user
      if (s.user.email) {
        await sendMail(
          s.user.email,
          "Your session is starting",
          `
            <h2>Hello ${s.user.firstName}</h2>
            <p>Your counseling session is starting now.</p>
            <p>Counselor: <b>${s.counselor.firstName} ${s.counselor.lastName}</b></p>
          `
        );
      }

      // send email to counselor
      if (s.counselor.email) {
        await sendMail(
          s.counselor.email,
          "Your session is starting",
          `
            <h2>Hello ${s.counselor.firstName}</h2>
            <p>Your scheduled session with ${s.user.firstName} ${s.user.lastName} is starting now.</p>
          `
        );
      }

      // mark reminder as sent
      await prisma.sessionSchedule.update({
        where: { id: s.id },
        data: { reminderSentAt: new Date() },
      });
    }

    return sessions.length;
  },
};
