import { Request, Response } from "express";
import * as peerService from "../services/peerSupport.services";

export const createPeerSupport = async (req: Request, res: Response) => {
  try {
    const initiatorId = Number(req.user?.id);
    if (!initiatorId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { recipientId, campaignId, isAnonymous } = req.body;

    const data = await peerService.createPeerSupport({
      initiatorId,
      recipientId,
      campaignId,
      isAnonymous,
    });

    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendPeerMessage = async (req: Request, res: Response) => {
  try {
    const senderId = Number(req.user?.id);
    if (!senderId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { peerSupportId, message, imageUrl } = req.body;

    const data = await peerService.sendPeerMessage({
      peerSupportId,
      senderId,
      message,
      imageUrl,
    });

    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPeerMessages = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = await peerService.getPeerMessages(id);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listPeerSupports = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const data = await peerService.listPeerSupports(userId);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
