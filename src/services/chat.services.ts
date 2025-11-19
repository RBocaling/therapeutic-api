import prisma from "../config/prisma";

export const createSession = async (
  userId: number,
  counselorId?: any,
  isAIChat = false
) => {
  try {
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
    const message = await prisma.chatMessage.create({
      data: { chatSessionId, senderId, content, imageUrl, isFromAI },
    });
    return message;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const listSessions = async (userId: number, isCounselor: boolean) => {
  if (isCounselor) {
    return await prisma.chatSession.findMany({
      where: { counselorId: userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
            email: true,
            profilePic: true,
            role: true,
            isAccountVerified: true,
          },
        },
        messages: { take: 1, orderBy: { createdAt: "desc" } },
      },
    });
  } else {
    const exist = await prisma.chatSession.findFirst({
      where: {
        userId,
        isAIChat: true,
      },
    });
    if (!exist) {
      await prisma.chatSession.create({
        data: { userId, isAIChat: true },
        include: { messages: true },
      });
    }
    return await prisma.chatSession.findMany({
      where: { userId },
      include: {
        counselor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
            email: true,
            profilePic: true,
            role: true,
            isAccountVerified: true,
          },
        },
        // messages: { take: 1, orderBy: { createdAt: "desc" } },
      },
    });
  }
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
    if (session.userId !== requesterId && session.counselorId !== requesterId)
      throw new Error("Unauthorized access");

    return prisma.chatMessage.findMany({
      where: { chatSessionId },
      orderBy: { createdAt: "asc" },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

//clients
export const getCounselorClient = async (counselorId: number) => {
  try {
   return await prisma.chatSession.findMany({
     where: { counselorId: counselorId },
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


//chat request
export const createChatRequest = async (
  userId: number,
  counselorId: any,
) => {
  try {
    const findChatRequest = await prisma.chatRequest.findFirst({
      where: { isDeleted: false, userId: Number(userId), counselorId: Number(counselorId), status: { in: ["PENDING", "REJECTED"] } },
      include: {
        user: true,
        counselor: true,
      },
    });
    console.log("!findChatRequest",!findChatRequest);
    
    if (!findChatRequest) {
      return await prisma.chatRequest.create({
        data: {
          userId,
          counselorId,
        },
      });
    }
      
    return "Success";
  } catch (error: any) {
    throw new Error(error);
  }
};


export const approveChatRequest = async (
  id: number,
  status:any
) => {
  try {
     const findChatRequest = await prisma.chatRequest.findUnique({
       where: { isDeleted: false, id: Number(id) },
       include: {
         user: true,
         counselor: true,
       },
     });
    
     if (!findChatRequest?.userId || !findChatRequest?.counselorId) {
       throw new Error("Request not found");
    }

     const response = await prisma.chatRequest.updateMany({
      where: { isDeleted: false, id: Number(id) },
      data: {
       status
     }
    });

    if (status === "APPROVED") {
      let existSession = await prisma.chatSession.findFirst({
        where: {
          userId: findChatRequest?.userId,
          counselorId: findChatRequest?.counselorId,
        },
      });

      if (!existSession) {
        existSession = await prisma.chatSession.create({
          data: {
            userId: findChatRequest?.userId,
            counselorId: findChatRequest?.counselorId,
            isAIChat: false,
          },
        });
      }
       return existSession;
    }

    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};


export const getChatRequest = async () => {
  try {
    return await prisma.chatRequest.findMany({
      where:{isDeleted:false},
      include: {
        user: true,
        counselor:true
      },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getMyChatRequest = async (userId:number) => {
  try {
    return await prisma.chatRequest.findMany({
      where: { isDeleted: false, userId },
      include: {
        user: true,
        counselor: true,
      },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};