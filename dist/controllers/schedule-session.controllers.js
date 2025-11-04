"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchedule = exports.updateScheduleStatus = exports.getSchedule = exports.listCounselorSchedules = exports.listMySchedules = exports.createSchedule = void 0;
const scheduleService = __importStar(require("../services/schedule-session.services"));
const createSchedule = async (req, res) => {
    try {
        const authUser = req.user;
        if (!authUser)
            return res.status(401).json({ message: "Unauthorized" });
        if (!["COUNSELOR", "ADMIN"].includes(authUser.role))
            return res.status(403).json({ message: "Forbidden" });
        const payload = {
            counselorId: Number(req.body.counselorId ?? authUser.id),
            userId: Number(req.body.userId),
            startAt: req.body.startAt,
            endAt: req.body.endAt,
            sessionType: req.body.sessionType,
            notes: req.body.notes,
            reminder: req.body.reminder,
            locationType: req.body.locationType,
            locationDetail: req.body.locationDetail,
            meetingLink: req.body.meetingLink,
            phoneNumber: req.body.phoneNumber,
        };
        const result = await scheduleService.createSchedule(payload);
        res.status(201).json({
            success: true,
            message: "Session scheduled successfully",
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.createSchedule = createSchedule;
const listMySchedules = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        const schedules = await scheduleService.listSchedulesForUser(userId);
        res.json(schedules);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.listMySchedules = listMySchedules;
const listCounselorSchedules = async (req, res) => {
    try {
        const counselorId = Number(req.user?.id);
        const schedules = await scheduleService.listSchedulesForCounselor(counselorId);
        res.json(schedules);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.listCounselorSchedules = listCounselorSchedules;
const getSchedule = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const schedule = await scheduleService.getScheduleById(id);
        if (!schedule)
            return res.status(404).json({ message: "Not found" });
        const requesterId = Number(req.user?.id);
        if (requesterId !== schedule.userId &&
            requesterId !== schedule.counselorId &&
            req.user?.role !== "ADMIN")
            return res.status(403).json({ message: "Forbidden" });
        res.json(schedule);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.getSchedule = getSchedule;
const updateScheduleStatus = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;
        const allowed = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
        if (!allowed.includes(status))
            return res.status(400).json({ message: "Invalid status" });
        const updated = await scheduleService.updateScheduleStatus(id, status);
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.updateScheduleStatus = updateScheduleStatus;
const deleteSchedule = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const requesterId = Number(req.user?.id);
        const schedule = await scheduleService.getScheduleById(id);
        if (!schedule)
            return res.status(404).json({ message: "Not found" });
        if (requesterId !== schedule.counselorId && req.user?.role !== "ADMIN")
            return res.status(403).json({ message: "Forbidden" });
        const deleted = await scheduleService.deleteSchedule(id);
        res.json(deleted);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.deleteSchedule = deleteSchedule;
