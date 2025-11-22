"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markCompletedNotified = exports.markReminderSent = exports.deleteSchedule = exports.updateScheduleStatus = exports.getScheduleById = exports.listSchedulesForCounselor = exports.listSchedulesForUser = exports.createSchedule = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createSchedule = async (payload) => {
    try {
        const start = new Date(payload.startAt);
        if (isNaN(start.getTime()))
            throw new Error("Invalid startAt");
        const end = payload.endAt ? new Date(payload.endAt) : null;
        if (end && isNaN(end.getTime()))
            throw new Error("Invalid endAt");
        const schedule = await prisma_1.default.sessionSchedule.create({
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
        await prisma_1.default.notification.create({
            data: {
                recipientId: payload.userId,
                type: "SESSION_SCHEDULING",
                title: "New Counseling Session Scheduled",
                message: `Your ${payload.sessionType.toLowerCase()} session is scheduled on ${start.toLocaleString("en-PH", { timeZone: "Asia/Manila" })}.`,
            },
        });
        return schedule;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.createSchedule = createSchedule;
const listSchedulesForUser = async (userId) => {
    try {
        return prisma_1.default.sessionSchedule.findMany({
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
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.listSchedulesForUser = listSchedulesForUser;
const listSchedulesForCounselor = async (counselorId) => {
    try {
        return await prisma_1.default.sessionSchedule.findMany({
            where: { counselorId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePic: true,
                        profile: {
                            select: {
                                userStatus: true,
                            },
                        },
                    },
                },
            },
            orderBy: { startAt: "desc" },
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.listSchedulesForCounselor = listSchedulesForCounselor;
const getScheduleById = async (id) => {
    try {
        return prisma_1.default.sessionSchedule.findUnique({
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
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getScheduleById = getScheduleById;
const updateScheduleStatus = async (id, status) => {
    try {
        const s = await prisma_1.default.sessionSchedule.update({
            where: { id },
            data: { status },
            include: { user: true, counselor: true },
        });
        await prisma_1.default.notification.create({
            data: {
                recipientId: s.userId,
                type: "SESSION_SCHEDULING",
                title: `Session ${status}`,
                message: `Your session on ${s.startAt.toISOString()} is now ${status}.`,
            },
        });
        return s;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.updateScheduleStatus = updateScheduleStatus;
const deleteSchedule = async (id) => {
    try {
        return prisma_1.default.sessionSchedule.delete({ where: { id } });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.deleteSchedule = deleteSchedule;
const markReminderSent = async (id) => {
    try {
        return prisma_1.default.sessionSchedule.update({
            where: { id },
            data: { reminderSentAt: new Date() },
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.markReminderSent = markReminderSent;
const markCompletedNotified = async (id) => {
    try {
        return prisma_1.default.sessionSchedule.update({
            where: { id },
            data: { completedNotifiedAt: new Date(), status: "COMPLETED" },
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.markCompletedNotified = markCompletedNotified;
