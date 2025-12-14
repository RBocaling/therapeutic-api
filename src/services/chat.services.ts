import prisma from "../config/prisma";
import { sendMail } from "../utils/mailer";
import { createAudit } from "./audit.services";
import { createNotification } from "./notification.services";

export const createSession = async (
  creatorId: number,
  counselorId?: number,
  moderatorId?: number,
  isAIChat = false
) => {
  try {
    let session = await prisma.chatSession.findFirst({
      where: {
        isAIChat,
        userId: moderatorId ? undefined : creatorId,
        counselorId: counselorId ?? undefined,
        moderatorId: moderatorId ?? undefined,
      },
    });

    if (!session) {
      const data: any = {
        isAIChat,
      };

      if (moderatorId) {
        data.moderatorId = moderatorId;
        if (counselorId) data.counselorId = counselorId;
        data.userId = undefined as unknown as number; // Prisma requires number, but we intentionally leave user empty
      } else {
        data.userId = creatorId;
        if (counselorId) data.counselorId = counselorId;
        data.moderatorId = undefined as unknown as number; // Prisma requires number, but we intentionally leave moderator empty
      }

      session = await prisma.chatSession.create({
        data,
        include: { messages: true },
      });

      if (counselorId || moderatorId) {
        await createAudit({
          description: "CREATE CHAT",
          type: "CHAT REQUEST",
          userId: Number(counselorId ?? moderatorId),
        });
      }
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
  if (!isCounselor && !isModerator) {
    const existingAI = await prisma.chatSession.findFirst({
      where: {
        userId,
        isAIChat: true,
      },
    });

    if (!existingAI) {
      const aiSession = await prisma.chatSession.create({
        data: {
          userId,
          isAIChat: true,
          counselorId: null,
          moderatorId: null,
          topic: "AI Wellness Assistant",
        },
      });

      await prisma.chatMessage.create({
        data: {
          chatSessionId: aiSession.id,
          senderId: null,
          isFromAI: true,
          content: `Hello! I'm K.A (KeyEy) – King Alvin, your AI Wellness Companion.

I'm here to help improve your emotional and mental well-being.  
You can ask me anything about stress, anxiety, self-care, motivation,  
or anything you want support with.

How are you feeling today?`,
        },
      });
    }
  }

  return await prisma.chatSession.findMany({
    where: {
      OR: [
        ...(isModerator ? [{ moderatorId: userId }] : []),
        ...(isCounselor ? [{ counselorId: userId }] : []),
        ...(!isCounselor && !isModerator ? [{ userId }] : []),
      ],
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
        status: { in: ["PENDING", "APPROVED"] },
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
  moderatorId?: number,
  reason?: string
) => {
  try {
    const findChatRequest = await prisma.chatRequest.findUnique({
      where: { id },
      include: { user: true, counselor: true },
    });

    if (!findChatRequest?.user || !findChatRequest?.counselor) {
      throw new Error("Request must have both user and counselor");
    }

    const response = await prisma.chatRequest.update({
      where: { id },
      data: { status, reason },
    });

    if (status !== "APPROVED") return response;

    const user = findChatRequest.user;
    const counselor = findChatRequest.counselor;

    let session = await prisma.chatSession.findFirst({
      where: {
        userId: user.id,
        counselorId: counselor.id,
      },
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          userId: user.id,
          counselorId: counselor.id,
          isAIChat: false,
        },
      });

      await prisma.chatMessage.create({
        data: {
          chatSessionId: session.id,
          senderId: counselor.id,
          isFromAI: false,
          content:
            "Hello! Your consultation request has been approved by the moderator. I'm here to guide you and support your journey toward improving your well-being.\nHow are you feeling today?",
        },
      });

      await createNotification({
        recipientId: user.id,
        type: "MESSAGE_APPROVED",
        title: "Your consultation was approved",
        message: "You can now start chatting with your counselor.",
      });

      await createNotification({
        recipientId: counselor.id,
        type: "MESSAGE_APPROVED",
        title: "New consultation assigned",
        message: "A new student/employee has been assigned to you.",
      });

      if (user.email) {
        await sendMail(
          user.email,
          "Your consultation request is approved",
          `
          <h2>Welcome ${user.firstName}</h2>
          <p>Congratulations! Your consultation request has been <b>approved</b> by our moderator.</p>
          <p>Your assigned counselor is <b>${counselor.firstName} ${counselor.lastName}</b>.</p>
          <p>You may now start your consultation session.</p>
          <br/>
          <p>ASCOT AI MindCare Support</p>
        `
        );
      }

      if (counselor.email) {
        await sendMail(
          counselor.email,
          "A new consultation has been assigned to you",
          `
          <h2>Hello ${counselor.firstName}</h2>
          <p>A new consultation request has been assigned to you.</p>
          <p>User: <b>${user.firstName} ${user.lastName}</b></p>
          <p>Please start the consultation when you are ready.</p>
          <br/>
          <p>ASCOT AI MindCare Support</p>
        `
        );
      }
    }

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
};



export const getChatRequest = async () => {
  try {
    return prisma.chatRequest.findMany({
      where: { isDeleted: false },
      include: { user: true, counselor: true },
      orderBy: [ { createdAt: "desc" }],
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
