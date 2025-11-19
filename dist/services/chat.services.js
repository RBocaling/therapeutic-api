"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyChatRequest = exports.getChatRequest = exports.approveChatRequest = exports.createChatRequest = exports.getCounselorClient = exports.getMessages = exports.listSessions = exports.sendMessage = exports.createSession = void 0;
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
        return await prisma_1.default.chatSession.findMany({
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
        const exist = await prisma_1.default.chatSession.findFirst({
            where: {
                userId,
                isAIChat: true,
            },
        });
        if (!exist) {
            await prisma_1.default.chatSession.create({
                data: { userId, isAIChat: true },
                include: { messages: true },
            });
        }
        return await prisma_1.default.chatSession.findMany({
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
//clients
const getCounselorClient = async (counselorId) => {
    try {
        return await prisma_1.default.chatSession.findMany({
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
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getCounselorClient = getCounselorClient;
//chat request
const createChatRequest = async (userId, counselorId) => {
    try {
        const findChatRequest = await prisma_1.default.chatRequest.findFirst({
            where: { isDeleted: false, userId: Number(userId), counselorId: Number(counselorId), status: { in: ["PENDING", "REJECTED"] } },
            include: {
                user: true,
                counselor: true,
            },
        });
        console.log("!findChatRequest", !findChatRequest);
        if (!findChatRequest) {
            return await prisma_1.default.chatRequest.create({
                data: {
                    userId,
                    counselorId,
                },
            });
        }
        return "Success";
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.createChatRequest = createChatRequest;
const approveChatRequest = async (id, status) => {
    try {
        const findChatRequest = await prisma_1.default.chatRequest.findUnique({
            where: { isDeleted: false, id: Number(id) },
            include: {
                user: true,
                counselor: true,
            },
        });
        if (!findChatRequest?.userId || !findChatRequest?.counselorId) {
            throw new Error("Request not found");
        }
        const response = await prisma_1.default.chatRequest.updateMany({
            where: { isDeleted: false, id: Number(id) },
            data: {
                status
            }
        });
        if (status === "APPROVED") {
            let existSession = await prisma_1.default.chatSession.findFirst({
                where: {
                    userId: findChatRequest?.userId,
                    counselorId: findChatRequest?.counselorId,
                },
            });
            if (!existSession) {
                existSession = await prisma_1.default.chatSession.create({
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
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.approveChatRequest = approveChatRequest;
const getChatRequest = async () => {
    try {
        return await prisma_1.default.chatRequest.findMany({
            where: { isDeleted: false },
            include: {
                user: true,
                counselor: true
            },
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getChatRequest = getChatRequest;
const getMyChatRequest = async (userId) => {
    try {
        return await prisma_1.default.chatRequest.findMany({
            where: { isDeleted: false, userId },
            include: {
                user: true,
                counselor: true,
            },
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getMyChatRequest = getMyChatRequest;
