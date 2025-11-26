"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const mailer_1 = require("../utils/mailer");
const notification_services_1 = require("./notification.services");
exports.scheduleService = {
    listSchedulesForUser: async (userId) => {
        return prisma_1.default.sessionSchedule.findMany({
            where: { userId },
            include: { counselor: true, user: true },
            orderBy: { startAt: "asc" },
        });
    },
    listSchedulesForCounselor: async (counselorId) => {
        return prisma_1.default.sessionSchedule.findMany({
            where: { counselorId },
            include: { counselor: true, user: true },
            orderBy: { startAt: "asc" },
        });
    },
    processDueSessions: async () => {
        const now = new Date();
        const sessions = await prisma_1.default.sessionSchedule.findMany({
            where: {
                startAt: { lte: now }, // start time reached
                reminderSentAt: null, // not yet notified
                status: "PENDING",
            },
            include: { user: true, counselor: true },
        });
        for (const s of sessions) {
            // send notifications
            await (0, notification_services_1.createNotification)({
                recipientId: s.userId,
                type: "SESSION_SCHEDULING",
                title: "Your session starts now",
                message: `Your counseling session with ${s.counselor.firstName} starts now.`,
            });
            await (0, notification_services_1.createNotification)({
                recipientId: s.counselorId,
                type: "SESSION_SCHEDULING",
                title: "Your session starts now",
                message: `Your session with ${s.user.firstName} starts now.`,
            });
            // send email to user
            if (s.user.email) {
                await (0, mailer_1.sendMail)(s.user.email, "Your session is starting", `
            <h2>Hello ${s.user.firstName}</h2>
            <p>Your counseling session is starting now.</p>
            <p>Counselor: <b>${s.counselor.firstName} ${s.counselor.lastName}</b></p>
          `);
            }
            // send email to counselor
            if (s.counselor.email) {
                await (0, mailer_1.sendMail)(s.counselor.email, "Your session is starting", `
            <h2>Hello ${s.counselor.firstName}</h2>
            <p>Your scheduled session with ${s.user.firstName} ${s.user.lastName} is starting now.</p>
          `);
            }
            // mark reminder as sent
            await prisma_1.default.sessionSchedule.update({
                where: { id: s.id },
                data: { reminderSentAt: new Date() },
            });
        }
        return sessions.length;
    },
};
