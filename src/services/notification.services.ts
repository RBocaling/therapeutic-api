import prisma from "../config/prisma";

export const createNotification = async (data: {
  recipientId: number;
  type: string;
  title: string;
  message: string;
}) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        recipientId: data.recipientId,
        type: data.type as any,
        title: data.title,
        message: data.message,
      },
    });
    return notification;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getUserNotifications = async (userId: number) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: "desc" },
    });
    return notifications;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const markNotificationAsRead = async (
  notificationId: number,
  userId: number
) => {
  try {
    const notification = await prisma.notification.updateMany({
      where: { id: notificationId, recipientId: userId },
      data: { isRead: true },
    });
    return notification;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const clearAllNotifications = async (userId: number) => {
  try {
    await prisma.notification.deleteMany({ where: { recipientId: userId } });
    return { message: "All notifications cleared." };
  } catch (error: any) {
    throw new Error(error);
  }
};
