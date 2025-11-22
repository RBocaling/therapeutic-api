"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePeerSupport = exports.listMessages = exports.sendMessage = exports.getPeerSupportById = exports.listPeerSupports = exports.createPeerSupport = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createPeerSupport = async (data) => {
    try {
        const peerSupport = await prisma_1.default.peerSupport.create({
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
    }
    catch (error) {
        throw new Error(`Failed to create peer support: ${error.message}`);
    }
};
exports.createPeerSupport = createPeerSupport;
const listPeerSupports = async (id) => {
    try {
        const supports = await prisma_1.default.peerSupport.findMany({
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
    }
    catch (error) {
        throw new Error(`Failed to list peer supports: ${error.message}`);
    }
};
exports.listPeerSupports = listPeerSupports;
const getPeerSupportById = async (id) => {
    try {
        const support = await prisma_1.default.peerSupport.findUnique({
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
    }
    catch (error) {
        throw new Error(`Failed to get peer support details: ${error.message}`);
    }
};
exports.getPeerSupportById = getPeerSupportById;
const sendMessage = async (data) => {
    try {
        const newMessage = await prisma_1.default.peerMessage.create({
            data: {
                peerSupportId: data.peerSupportId,
                fromMessage: data.fromMessage,
                message: data.message,
                imageUrl: data.imageUrl,
            },
        });
        return newMessage;
    }
    catch (error) {
        throw new Error(`Failed to send message: ${error.message}`);
    }
};
exports.sendMessage = sendMessage;
const listMessages = async (peerSupportId) => {
    try {
        const messages = await prisma_1.default.peerMessage.findMany({
            where: { peerSupportId },
            orderBy: { createdAt: "asc" },
        });
        return messages;
    }
    catch (error) {
        throw new Error(`Failed to list messages: ${error.message}`);
    }
};
exports.listMessages = listMessages;
const closePeerSupport = async (id) => {
    try {
        const closed = await prisma_1.default.peerSupport.update({
            where: { id },
            data: { status: "CLOSED" },
        });
        return closed;
    }
    catch (error) {
        throw new Error(`Failed to close peer support: ${error.message}`);
    }
};
exports.closePeerSupport = closePeerSupport;
