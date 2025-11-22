"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyChatRequest = exports.getChatRequest = exports.approveChatRequest = exports.createChatRequest = exports.getCounselorClient = exports.getMessages = exports.listSessions = exports.sendMessage = exports.createSession = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const mailer_1 = require("../utils/mailer");
const notification_services_1 = require("./notification.services");
const createSession = async (userId, counselorId, moderatorId, isAIChat = false) => {
    try {
        let session = await prisma_1.default.chatSession.findFirst({
            where: {
                userId,
                counselorId: counselorId || null,
                moderatorId: moderatorId || null,
                isAIChat,
            },
        });
        if (!session) {
            session = await prisma_1.default.chatSession.create({
                data: { userId, counselorId, moderatorId, isAIChat },
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
        return await prisma_1.default.chatMessage.create({
            data: { chatSessionId, senderId, content, imageUrl, isFromAI },
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.sendMessage = sendMessage;
const listSessions = async (userId, isCounselor, isModerator) => {
    if (!isCounselor && !isModerator) {
        const existingAI = await prisma_1.default.chatSession.findFirst({
            where: {
                userId,
                isAIChat: true,
            },
        });
        if (!existingAI) {
            const aiSession = await prisma_1.default.chatSession.create({
                data: {
                    userId,
                    isAIChat: true,
                    counselorId: null,
                    moderatorId: null,
                    topic: "AI Wellness Assistant",
                },
            });
            await prisma_1.default.chatMessage.create({
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
    return await prisma_1.default.chatSession.findMany({
        where: {
            OR: [
                { userId },
                ...(isCounselor ? [{ counselorId: userId }] : []),
                ...(isModerator ? [{ moderatorId: userId }] : []),
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
exports.listSessions = listSessions;
const getMessages = async (chatSessionId, requesterId) => {
    try {
        const session = await prisma_1.default.chatSession.findUnique({
            where: { id: chatSessionId },
        });
        if (!session)
            throw new Error("Session not found");
        const isAuthorized = session.userId === requesterId ||
            session.counselorId === requesterId ||
            session.moderatorId === requesterId;
        if (!isAuthorized)
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
const getCounselorClient = async (counselorId) => {
    try {
        return prisma_1.default.chatSession.findMany({
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
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getCounselorClient = getCounselorClient;
const createChatRequest = async (userId, counselorId) => {
    try {
        const findChatRequest = await prisma_1.default.chatRequest.findFirst({
            where: {
                isDeleted: false,
                userId,
                counselorId,
                status: { in: ["PENDING", "REJECTED"] },
            },
            include: { user: true, counselor: true },
        });
        if (!findChatRequest) {
            return prisma_1.default.chatRequest.create({
                data: { userId, counselorId },
            });
        }
        return "Success";
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.createChatRequest = createChatRequest;
const approveChatRequest = async (id, status, moderatorId) => {
    try {
        const findChatRequest = await prisma_1.default.chatRequest.findUnique({
            where: { id, isDeleted: false },
            include: { user: true, counselor: true },
        });
        if (!findChatRequest?.user || !findChatRequest?.counselor) {
            throw new Error("Request must have both user and counselor");
        }
        const response = await prisma_1.default.chatRequest.updateMany({
            where: { id, isDeleted: false },
            data: { status },
        });
        if (status !== "APPROVED")
            return response;
        const user = findChatRequest.user;
        const counselor = findChatRequest.counselor;
        const moderator = moderatorId
            ? await prisma_1.default.user.findUnique({ where: { id: moderatorId } })
            : null;
        let session = await prisma_1.default.chatSession.findFirst({
            where: {
                userId: user.id,
                counselorId: counselor.id,
            },
        });
        if (!session) {
            session = await prisma_1.default.chatSession.create({
                data: {
                    userId: user.id,
                    counselorId: counselor.id,
                    moderatorId: moderatorId || null,
                    isAIChat: false,
                },
            });
            await prisma_1.default.chatMessage.create({
                data: {
                    chatSessionId: session.id,
                    senderId: counselor.id,
                    isFromAI: false,
                    content: "Hello! Your consultation request has been approved by the moderator. I'm here to guide you and support your journey toward improving your well-being.\nHow are you feeling today?",
                },
            });
            await (0, notification_services_1.createNotification)({
                recipientId: user.id,
                type: "MESSAGE_APPROVED",
                title: "Your consultation was approved",
                message: "You can now start chatting with your counselor.",
            });
            await (0, notification_services_1.createNotification)({
                recipientId: counselor.id,
                type: "MESSAGE_APPROVED",
                title: "New consultation assigned",
                message: "A new student/employee has been assigned to you.",
            });
            if (moderatorId) {
                await (0, notification_services_1.createNotification)({
                    recipientId: moderatorId,
                    type: "MESSAGE",
                    title: "New chat session created",
                    message: "You have been added as moderator for a consultation.",
                });
            }
            if (user.email) {
                await (0, mailer_1.sendMail)(user.email, "Your consultation request is approved", `
          <h2>Welcome ${user.firstName}</h2>
          <p>Congratulations! Your consultation request has been <b>approved</b> by our moderator.</p>
          <p>Your assigned counselor is <b>${counselor.firstName} ${counselor.lastName}</b>.</p>
          ${moderator
                    ? `<p>Approved by Moderator: <b>${moderator.firstName} ${moderator.lastName}</b></p>`
                    : ""}
          <p>You may now start your consultation session.</p>
          <br/>
          <p>ASCOT AI MindCare Support</p>
        `);
            }
            if (counselor.email) {
                await (0, mailer_1.sendMail)(counselor.email, "A new consultation has been assigned to you", `
          <h2>Hello ${counselor.firstName}</h2>
          <p>A new consultation request has been assigned to you.</p>
          <p>User: <b>${user.firstName} ${user.lastName}</b></p>
          ${moderator
                    ? `<p>Assigned by Moderator: <b>${moderator.firstName} ${moderator.lastName}</b></p>`
                    : ""}
          <p>Please start the consultation when you are ready.</p>
          <br/>
          <p>ASCOT AI MindCare Support</p>
        `);
            }
        }
        return session;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.approveChatRequest = approveChatRequest;
const getChatRequest = async () => {
    try {
        return prisma_1.default.chatRequest.findMany({
            where: { isDeleted: false },
            include: { user: true, counselor: true },
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getChatRequest = getChatRequest;
const getMyChatRequest = async (userId) => {
    try {
        return prisma_1.default.chatRequest.findMany({
            where: { isDeleted: false, userId },
            include: { user: true, counselor: true },
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getMyChatRequest = getMyChatRequest;
