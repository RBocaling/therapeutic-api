import prisma from "../config/prisma";

export const createSession = async (
  userId: number,
  counselorId?: number,
  isAIChat = false
) => {
  let session = await prisma.chatSession.findFirst({
    where: { userId, counselorId: counselorId || null, isAIChat },
  });

  if (!session) {
    session = await prisma.chatSession.create({
      data: { userId, counselorId, isAIChat },
      include: { messages: true },
    });
  }

  return session;
};

export const sendMessage = async (
  senderId: number,
  chatSessionId: number,
  content: string,
  imageUrl?: string,
  isFromAI = false
) => {
  const message = await prisma.chatMessage.create({
    data: { chatSessionId, senderId, content, imageUrl, isFromAI },
  });
  return message;
};

export const listSessions = async (userId: number, isCounselor: boolean) => {
  if (isCounselor) {
    return prisma.chatSession.findMany({
      where: { counselorId: userId },
      include: {
        user: true,
        messages: { take: 1, orderBy: { createdAt: "desc" } },
      },
    });
  } else {
    return prisma.chatSession.findMany({
      where: { userId },
      include: {
        counselor: true,
        messages: { take: 1, orderBy: { createdAt: "desc" } },
      },
    });
  }
};

export const getMessages = async (
  chatSessionId: number,
  requesterId: number
) => {
  const session = await prisma.chatSession.findUnique({
    where: { id: chatSessionId },
  });
  if (!session) throw new Error("Session not found");
  if (session.userId !== requesterId && session.counselorId !== requesterId)
    throw new Error("Unauthorized access");

  return prisma.chatMessage.findMany({
    where: { chatSessionId },
    orderBy: { createdAt: "asc" },
  });
};
