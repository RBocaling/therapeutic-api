import { Request, Response } from "express";
import * as ticketService from "../services/ticket.services";

export const createTicketController = async (req: Request, res: Response) => {
  try {
    const payload = {
      userId: Number(req.user?.id),
      description: req.body.description,
      imageUrl: req.body.imageUrl,
    };
    const ticket = await ticketService.createTicket(payload);
    res.json("Successfully Submited");
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUserTicketsController = async (req: Request, res: Response) => {
  try {
    const tickets = await ticketService.getUserTickets(Number(req.user?.id));
    res.json(tickets);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTicketsController = async (_: Request, res: Response) => {
  try {
    const tickets = await ticketService.getAllTickets();
    res.json(tickets);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTicketStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const updated = await ticketService.updateTicketStatus(id, status);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json("Successfully Update");
  }
};
