import { Request, Response } from "express";
import * as chatService from "../services/chat.services";
import * as aiService from "../services/openai.services";

export const createSession = async (req: Request, res: Response) => {
  try {
    const userId = Number(req?.user?.id);
    const { counselorId, isAIChat } = req.body;
    const session = await chatService.createSession(
      userId,
      counselorId,
      isAIChat
    );
    res.status(201).json({ session });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const userId = Number(req?.user?.id);
    const { chatSessionId, content, imageUrl } = req.body;
    const message = await chatService.sendMessage(
      userId,
      chatSessionId,
      content,
      imageUrl,
      false
    );
    res.status(201).json({ message });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const sendAIMessage = async (req: Request, res: Response) => {
  try {
    const userId = Number(req?.user?.id);
    const { chatSessionId, content } = req.body;
    const aiReply = await aiService.sendAIMessage(
      userId,
      chatSessionId,
      content
    );
    res.status(200).json({ message: aiReply });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listSessions = async (req: Request, res: Response) => {
  try {
    const userId = Number(req?.user?.id);
    const isCounselor = req?.user?.role === "COUNSELOR";
    const sessions = await chatService.listSessions(userId, isCounselor);
    res.status(200).json({ sessions });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const chatSessionId = Number(req.params.chatSessionId);
    const requesterId = Number(req?.user?.id);
    const messages = await chatService.getMessages(chatSessionId, requesterId);
    res.status(200).json({ messages });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
