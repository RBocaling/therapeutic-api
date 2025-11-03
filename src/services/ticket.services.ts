import prisma from "../config/prisma";

export const createTicket = async (data: {
  userId: number;
  description: string;
  imageUrl?: string;
}) => {
  try {
    return prisma.supportTicket.create({
      data: {
        userId: data.userId,
        description: data.description,
        imageUrl: data.imageUrl,
      },
    });
  } catch (error:any) {
    throw new Error(error);
  }
};

export const getUserTickets = async (userId: number) => {
  try {
    return prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error:any) {
    throw new Error(error);
  }
};

export const getAllTickets = async () => {
  try {
    return prisma.supportTicket.findMany({
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error:any) {
    throw new Error(error);
  }
};

export const updateTicketStatus = async (
  id: number,
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
) => {
  try {
    return prisma.supportTicket.update({
      where: { id },
      data: { status },
    });
  } catch (error:any) {
    throw new Error(error);
  }
};
