import { Request, Response } from "express";
import * as notificationService from "../services/notification.services";

export const createNotification = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const notification = await notificationService.createNotification(data);
    res.status(201).json({ message: "Notification created", notification });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const notifications = await notificationService.getUserNotifications(
      userId
    );
    res.status(200).json({ notifications });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const notificationId = Number(req.params.notificationId);
    await notificationService.markNotificationAsRead(notificationId, userId);
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const clearNotifications = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const result = await notificationService.clearAllNotifications(userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
