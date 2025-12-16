import { Request, Response } from "express";
import * as scheduleService from "../services/schedule-session.services";
import { createAudit } from "../services/audit.services";


export const createSchedule = async (req: Request, res: Response) => {
  try {
    const authUser = req.user;
    if (!authUser) return res.status(401).json({ message: "Unauthorized" });
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
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listMySchedules = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const schedules = await scheduleService.listSchedulesForUser(userId);
    res.json(schedules);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listCounselorSchedules = async (req: Request, res: Response) => {
  try {
    const counselorId = Number(req.user?.id);
    const schedules = await scheduleService.listSchedulesForCounselor(
      counselorId
    );
    res.json(schedules);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getSchedule = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const schedule = await scheduleService.getScheduleById(id);
    if (!schedule) return res.status(404).json({ message: "Not found" });
    const requesterId = Number(req.user?.id);
    if (
      requesterId !== schedule.userId &&
      requesterId !== schedule.counselorId &&
      req.user?.role !== "ADMIN"
    )
      return res.status(403).json({ message: "Forbidden" });
    res.json(schedule);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateScheduleStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const allowed = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status" });
    const updated = await scheduleService.updateScheduleStatus(
      id,
      status as any
    );
    await createAudit({
      description: ` Session Schedule ${status}`,
      type: "SESSION SCHEDULE STATUS",
      userId: Number(req.user?.id),
    });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const requesterId = Number(req.user?.id);
    const schedule = await scheduleService.getScheduleById(id);
    if (!schedule) return res.status(404).json({ message: "Not found" });
    if (requesterId !== schedule.counselorId && req.user?.role !== "ADMIN")
      return res.status(403).json({ message: "Forbidden" });
    const deleted = await scheduleService.deleteSchedule(id);
    res.json(deleted);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
