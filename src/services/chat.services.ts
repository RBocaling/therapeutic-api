import prisma from "../config/prisma";
import { createNotification } from "./notification.services";

export const createSession = async (
  userId: number,
  counselorId?: number,
  moderatorId?: number,
  isAIChat = false
) => {
  try {
    let session = await prisma.chatSession.findFirst({
      where: {
        userId,
        counselorId: counselorId || null,
        moderatorId: moderatorId || null,
        isAIChat,
      },
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: { userId, counselorId, moderatorId, isAIChat },
        include: { messages: true },
      });
    }

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const sendMessage = async (
  senderId: number,
  chatSessionId: number,
  content: string,
  imageUrl?: string,
  isFromAI = false
) => {
  try {
    return await prisma.chatMessage.create({
      data: { chatSessionId, senderId, content, imageUrl, isFromAI },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};
export const listSessions = async (
  userId: number,
  isCounselor: boolean,
  isModerator: boolean
) => {
  return await prisma.chatSession.findMany({
    where: {
      OR: [
        { userId },
        ...(isCounselor ? [{ counselorId: userId }] : []),
        ...(isModerator ? [{ moderatorId: userId }] : []),
      ],
      isAIChat: false,
    },
    include: {
      user: true,
      counselor: true,
      moderator: true,
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

export const getMessages = async (
  chatSessionId: number,
  requesterId: number
) => {
  try {
    const session = await prisma.chatSession.findUnique({
      where: { id: chatSessionId },
    });

    if (!session) throw new Error("Session not found");

    const isAuthorized =
      session.userId === requesterId ||
      session.counselorId === requesterId ||
      session.moderatorId === requesterId;

    if (!isAuthorized) throw new Error("Unauthorized access");

    return prisma.chatMessage.findMany({
      where: { chatSessionId },
      orderBy: { createdAt: "asc" },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getCounselorClient = async (counselorId: number) => {
  try {
    return prisma.chatSession.findMany({
      where: { counselorId },
      include: {
        user: {
          include: {
            profile: true,
            responses: true,
          },
        },
        messages: { take: 1, orderBy: { createdAt: "desc" } },
      },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createChatRequest = async (
  userId: number,
  counselorId: number
) => {
  try {
    const findChatRequest = await prisma.chatRequest.findFirst({
      where: {
        isDeleted: false,
        userId,
        counselorId,
        status: { in: ["PENDING", "REJECTED"] },
      },
      include: { user: true, counselor: true },
    });

    if (!findChatRequest) {
      return prisma.chatRequest.create({
        data: { userId, counselorId },
      });
    }

    return "Success";
  } catch (error: any) {
    throw new Error(error);
  }
};

export const approveChatRequest = async (
  id: number,
  status: any,
  moderatorId?: number
) => {
  try {
    const findChatRequest = await prisma.chatRequest.findUnique({
      where: { id, isDeleted: false },
      include: { user: true, counselor: true },
    });

    if (!findChatRequest?.userId || !findChatRequest?.counselorId) {
      throw new Error("Request not found");
    }

    const response = await prisma.chatRequest.updateMany({
      where: { id, isDeleted: false },
      data: { status },
    });

    if (status === "APPROVED") {
      let session = await prisma.chatSession.findFirst({
        where: {
          userId: findChatRequest.userId,
          counselorId: findChatRequest.counselorId,
        },
      });

      if (!session) {
        session = await prisma.chatSession.create({
          data: {
            userId: findChatRequest.userId,
            counselorId: findChatRequest.counselorId,
            moderatorId: moderatorId || null,
            isAIChat: false,
          },
        });

        await prisma.chatMessage.create({
          data: {
            chatSessionId: session.id,
            senderId: findChatRequest.counselorId,
            isFromAI: false,
            content: `Hello! Your consultation request has been approved by the moderator. I'm here to guide you and support your journey toward improving your health and well-being.\n\nHow are you feeling today?`,
          },
        });

        await createNotification({
          recipientId: findChatRequest.userId,
          type: "MESSAGE_APPROVED",
          title: "Your consultation request was approved",
          message: "You can now start chatting with your counselor.",
        });

        await createNotification({
          recipientId: findChatRequest.counselorId,
          type: "MESSAGE_APPROVED",
          title: "New consultation session assigned",
          message:
            "A new student/employee has been approved and is now ready for consultation.",
        });

        if (moderatorId) {
          await createNotification({
            recipientId: moderatorId,
            type: "MESSAGE",
            title: "New chat session created",
            message: "You have been added as moderator to a chat session.",
          });
        }
      }

      return session;
    }

    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getChatRequest = async () => {
  try {
    return prisma.chatRequest.findMany({
      where: { isDeleted: false },
      include: { user: true, counselor: true },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getMyChatRequest = async (userId: number) => {
  try {
    return prisma.chatRequest.findMany({
      where: { isDeleted: false, userId },
      include: { user: true, counselor: true },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};
