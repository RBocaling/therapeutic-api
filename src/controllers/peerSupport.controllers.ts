import { Request, Response } from "express";
import * as peerService from "../services/peerSupport.services";

export const createPeerSupport = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const data = await peerService.createPeerSupport({
      userId,
      title: req.body.title,
      category: req.body.category,
      priority: req.body.priority,
      message: req.body.message,
      imageUrl: req.body.imageUrl,
      isAnonymous: req.body.isAnonymous,
      moderator:
        req?.user?.role === "MODERATOR"
          ? `${req?.user?.firstName} ${req?.user?.lastName}`
          : null,
    });

    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const listPeerSupports = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);

    const data = await peerService.listPeerSupports(userId, req?.user?.role);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getPeerSupportById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = await peerService.getPeerSupportById(id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Peer support not found" });
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const peerSupportId = Number(req.params.id);
    const role = req.user?.role;
    const fromMessage = role === "MODERATOR" ? "MODERATOR" : "USER";

    const data = await peerService.sendMessage({
      peerSupportId,
      fromMessage,
      message: req.body.message,
      imageUrl: req.body.imageUrl,
    });

    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const listMessages = async (req: Request, res: Response) => {
  try {
    const peerSupportId = Number(req.params.id);
    const data = await peerService.listMessages(peerSupportId);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const closePeerSupport = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = await peerService.closePeerSupport(id);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
