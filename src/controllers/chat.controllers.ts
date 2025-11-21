import { Request, Response } from "express";
import * as chatService from "../services/chat.services";
import * as aiService from "../services/openai.services";

export const createSession = async (req: Request, res: Response) => {
  try {
    const isModerator = req.user?.role === "MODERATOR";

    const creatorId = isModerator ? Number(req.user?.id) : Number(req.user?.id);

    const { counselorId, isAIChat } = req.body;

    const session = await chatService.createSession(
      creatorId,
      counselorId,
      isModerator ? creatorId : undefined,
      isAIChat
    );

    res.status(201).json({ session });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const createCounselorSession = async (req: Request, res: Response) => {
  try {
    const counselorId = Number(req.user?.id);
    const { userId, moderatorId } = req.body;
    const session = await chatService.createSession(
      userId,
      counselorId,
      moderatorId,
      false
    );
    res.status(201).json({ session });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const senderId = Number(req.user?.id);
    const { chatSessionId, content, imageUrl } = req.body;
    const message = await chatService.sendMessage(
      senderId,
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
    const senderId = Number(req.user?.id);
    const { chatSessionId, content } = req.body;
    const aiReply = await aiService.sendAIMessage(
      senderId,
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
    const userId = Number(req.user?.id);
    const isCounselor = req.user?.role === "COUNSELOR";
    const isModerator = req.user?.role === "MODERATOR";
    const sessions = await chatService.listSessions(
      userId,
      isCounselor,
      isModerator
    );
    res.status(200).json({ sessions });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const chatSessionId = Number(req.params.chatSessionId);
    const requesterId = Number(req.user?.id);
    const messages = await chatService.getMessages(chatSessionId, requesterId);
    const formatted = messages.map((m) => ({
      ...m,
      isMe: m.senderId === requesterId,
    }));
    res.status(200).json({ messages: formatted });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getCounselorClient = async (req: Request, res: Response) => {
  try {
    const counselorId = Number(req.user?.id);
    const clients = await chatService.getCounselorClient(counselorId);
    res.status(200).json(clients);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const createChatRequest = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const counselorId = Number(req.body?.counselorId);
    const result = await chatService.createChatRequest(userId, counselorId);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getChatRequest = async (_req: Request, res: Response) => {
  try {
    const result = await chatService.getChatRequest();
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getMyChatRequest = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const result = await chatService.getMyChatRequest(userId);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const approveChatRequest = async (req: Request, res: Response) => {
  try {
    const moderatorId =
      req.user?.role === "MODERATOR" ? Number(req.user?.id) : undefined;
    const { id, status } = req.body;
    const result = await chatService.approveChatRequest(
      id,
      status,
      moderatorId
    );
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
