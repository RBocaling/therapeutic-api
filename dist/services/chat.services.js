"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.listSessions = exports.sendMessage = exports.createSession = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createSession = async (userId, counselorId, isAIChat = false) => {
    try {
        let session = await prisma_1.default.chatSession.findFirst({
            where: { userId, counselorId: counselorId || null, isAIChat },
        });
        if (!session) {
            session = await prisma_1.default.chatSession.create({
                data: { userId, counselorId, isAIChat },
                include: { messages: true },
            });
        }
        return session;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.createSession = createSession;
const sendMessage = async (senderId, chatSessionId, content, imageUrl, isFromAI = false) => {
    try {
        const message = await prisma_1.default.chatMessage.create({
            data: { chatSessionId, senderId, content, imageUrl, isFromAI },
        });
        return message;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.sendMessage = sendMessage;
const listSessions = async (userId, isCounselor) => {
    if (isCounselor) {
        return prisma_1.default.chatSession.findMany({
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
    }
    else {
        return prisma_1.default.chatSession.findMany({
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
exports.listSessions = listSessions;
const getMessages = async (chatSessionId, requesterId) => {
    try {
        const session = await prisma_1.default.chatSession.findUnique({
            where: { id: chatSessionId },
        });
        if (!session)
            throw new Error("Session not found");
        if (session.userId !== requesterId && session.counselorId !== requesterId)
            throw new Error("Unauthorized access");
        return prisma_1.default.chatMessage.findMany({
            where: { chatSessionId },
            orderBy: { createdAt: "asc" },
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getMessages = getMessages;
