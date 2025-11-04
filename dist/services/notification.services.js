"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAllNotifications = exports.markNotificationAsRead = exports.getUserNotifications = exports.createNotification = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createNotification = async (data) => {
    try {
        const notification = await prisma_1.default.notification.create({
            data: {
                recipientId: data.recipientId,
                type: data.type,
                title: data.title,
                message: data.message,
            },
        });
        return notification;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.createNotification = createNotification;
const getUserNotifications = async (userId) => {
    try {
        const notifications = await prisma_1.default.notification.findMany({
            where: { recipientId: userId },
            orderBy: { createdAt: "desc" },
        });
        return notifications;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getUserNotifications = getUserNotifications;
const markNotificationAsRead = async (notificationId, userId) => {
    try {
        const notification = await prisma_1.default.notification.updateMany({
            where: { id: notificationId, recipientId: userId },
            data: { isRead: true },
        });
        return notification;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.markNotificationAsRead = markNotificationAsRead;
const clearAllNotifications = async (userId) => {
    try {
        await prisma_1.default.notification.deleteMany({ where: { recipientId: userId } });
        return { message: "All notifications cleared." };
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.clearAllNotifications = clearAllNotifications;
