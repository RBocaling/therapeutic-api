import prisma from "../config/prisma";

export const createSupportTicket = async (data: {
  userId: number;
  subject: string;
  message: string;
  imageUrl?: string | null;
}) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) throw new Error("User not found");

    return await prisma.contactSupport.create({
      data: {
        userId: data.userId,
        subject: data.subject,
        message: data.message,
        imageUrl: data.imageUrl ?? null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to create support ticket: ${error.message}`);
  }
};

export const addSupportResponse = async (data: {
  contactSupportId: number;
  responderId: number;
  message: string;
  imageUrl?: string | null;
}) => {
  try {
    const ticket = await prisma.contactSupport.findUnique({
      where: { id: data.contactSupportId },
    });
    if (!ticket) throw new Error("Support ticket not found");

    return await prisma.supportResponse.create({
      data: {
        contactSupportId: data.contactSupportId,
        responderId: data.responderId,
        message: data.message,
        imageUrl: data.imageUrl ?? null,
      },
      include: {
        responder: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            profilePic: true,
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to send response: ${error.message}`);
  }
};

export const getSupportTicket = async (id: number) => {
  try {
    return await prisma.contactSupport.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        responses: {
          include: {
            responder: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                profilePic: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch ticket: ${error.message}`);
  }
};

export const listSupportTickets = async (role: any, userId: number) => {
  try {
    const where =
      role === "ADMIN"
        ? {}
        : {
            userId,
          };

    return await prisma.contactSupport.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        responses: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: { message: true, createdAt: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  } catch (error: any) {
    throw new Error(`Failed to list support tickets: ${error.message}`);
  }
};

export const updateTicketStatus = async (
  id: number,
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED"
) => {
  try {
    return await prisma.contactSupport.update({
      where: { id },
      data: { status },
    });
  } catch (error: any) {
    throw new Error(`Failed to update status: ${error.message}`);
  }
};
