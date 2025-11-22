import prisma from "../config/prisma";

export const createPeerSupport = async (data: {
  userId: number;
  title: string;
  category?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  message?: string;
  imageUrl?: string;
  isAnonymous?: boolean;
  moderator?: string | null;
}) => {
  try {
    const peerSupport = await prisma.peerSupport.create({
      data: {
        userId: data.userId,
        title: data.title,
        category: data.category,
        priority: data.priority ?? "MEDIUM",
        message: data.message,
        imageUrl: data.imageUrl,
        isAnonymous: data.isAnonymous ?? false,
        moderator: data?.moderator,
      },
    });
    return peerSupport;
  } catch (error: any) {
    throw new Error(`Failed to create peer support: ${error.message}`);
  }
};

export const listPeerSupports = async (id: number) => {
  try {
    const supports = await prisma.peerSupport.findMany({
      where: { userId: id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            profilePic: true,
          },
        },
        messages: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return supports;
  } catch (error: any) {
    throw new Error(`Failed to list peer supports: ${error.message}`);
  }
};

export const getPeerSupportById = async (id: number) => {
  try {
    const support = await prisma.peerSupport.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            profilePic: true,
          },
        },
        messages: { orderBy: { createdAt: "asc" } },
      },
    });
    return support;
  } catch (error: any) {
    throw new Error(`Failed to get peer support details: ${error.message}`);
  }
};

export const sendMessage = async (data: {
  peerSupportId: number;
  fromMessage: "USER" | "MODERATOR";
  message?: string;
  imageUrl?: string;
}) => {
  try {
    const newMessage = await prisma.peerMessage.create({
      data: {
        peerSupportId: data.peerSupportId,
        fromMessage: data.fromMessage,
        message: data.message,
        imageUrl: data.imageUrl,
      },
    });
    return newMessage;
  } catch (error: any) {
    throw new Error(`Failed to send message: ${error.message}`);
  }
};

export const listMessages = async (peerSupportId: number) => {
  try {
    const messages = await prisma.peerMessage.findMany({
      where: { peerSupportId },
      orderBy: { createdAt: "asc" },
    });
    return messages;
  } catch (error: any) {
    throw new Error(`Failed to list messages: ${error.message}`);
  }
};

export const closePeerSupport = async (id: number) => {
  try {
    const closed = await prisma.peerSupport.update({
      where: { id },
      data: { status: "CLOSED" },
    });
    return closed;
  } catch (error: any) {
    throw new Error(`Failed to close peer support: ${error.message}`);
  }
};
