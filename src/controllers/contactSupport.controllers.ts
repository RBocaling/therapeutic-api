import { Request, Response } from "express";
import * as supportService from "../services/contactSupport.services";

export const createSupportTicket = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const { subject, message, imageUrl } = req.body;

    const data = await supportService.createSupportTicket({
      userId,
      subject,
      message,
      imageUrl,
    });

    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addSupportResponse = async (req: Request, res: Response) => {
  try {
    const responderId = Number(req.user?.id);
    const { contactSupportId, message, imageUrl } = req.body;

    const data = await supportService.addSupportResponse({
      contactSupportId,
      responderId,
      message,
      imageUrl,
    });

    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSupportTicket = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = await supportService.getSupportTicket(id);

    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Support ticket not found" });
    }

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listSupportTickets = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const role = req.user?.role;

    const data = await supportService.listSupportTickets(role, userId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTicketStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const data = await supportService.updateTicketStatus(id, status);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
