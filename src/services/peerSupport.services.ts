import prisma from "../config/prisma";

export const createPeerSupport = async (data: {
  initiatorId: number;
  recipientId: number;
  campaignId?: number | null;
  isAnonymous?: boolean;
}) => {
  try {
    const { initiatorId, recipientId, campaignId, isAnonymous } = data;

    const initiator = await prisma.user.findUnique({
      where: { id: initiatorId },
    });
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });
    if (!initiator || !recipient)
      throw new Error("Invalid initiator or recipient");

    const existing = await prisma.peerSupport.findFirst({
      where: {
        OR: [
          { initiatorId, recipientId },
          { initiatorId: recipientId, recipientId: initiatorId },
        ],
        campaignId: campaignId ?? null,
        isActive: true,
      },
    });

    if (existing) return existing;

    return await prisma.peerSupport.create({
      data: {
        initiatorId,
        recipientId,
        campaignId: campaignId ?? null,
        isAnonymous: isAnonymous ?? false,
      },
      include: {
        initiator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to create peer support: ${error.message}`);
  }
};

export const sendPeerMessage = async (data: {
  peerSupportId: number;
  senderId: number;
  message?: string;
  imageUrl?: string | null;
}) => {
  try {
    const peerSupport = await prisma.peerSupport.findUnique({
      where: { id: data.peerSupportId },
    });
    if (!peerSupport) throw new Error("Peer support not found");

    return await prisma.peerMessage.create({
      data: {
        peerSupportId: data.peerSupportId,
        senderId: data.senderId,
        message: data.message ?? null,
        imageUrl: data.imageUrl ?? null,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to send message: ${error.message}`);
  }
};

export const getPeerMessages = async (peerSupportId: number) => {
  try {
    return await prisma.peerMessage.findMany({
      where: { peerSupportId },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }
};

export const listPeerSupports = async (userId: number) => {
  try {
    return await prisma.peerSupport.findMany({
      where: { OR: [{ initiatorId: userId }, { recipientId: userId }] },
      include: {
        initiator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
        campaign: { select: { id: true, title: true, isAnonymous: true } },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: { message: true, imageUrl: true, createdAt: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  } catch (error: any) {
    throw new Error(`Failed to list peer supports: ${error.message}`);
  }
};
