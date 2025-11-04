"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.listSessions = exports.sendAIMessage = exports.sendMessage = exports.createSession = void 0;
const chatService = __importStar(require("../services/chat.services"));
const aiService = __importStar(require("../services/openai.services"));
const createSession = async (req, res) => {
    try {
        const userId = Number(req?.user?.id);
        const { counselorId, isAIChat } = req.body;
        const session = await chatService.createSession(userId, counselorId, isAIChat);
        res.status(201).json({ session });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.createSession = createSession;
const sendMessage = async (req, res) => {
    try {
        const userId = Number(req?.user?.id);
        const { chatSessionId, content, imageUrl } = req.body;
        const message = await chatService.sendMessage(userId, chatSessionId, content, imageUrl, false);
        res.status(201).json({ message });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.sendMessage = sendMessage;
const sendAIMessage = async (req, res) => {
    try {
        const userId = Number(req?.user?.id);
        const { chatSessionId, content } = req.body;
        const aiReply = await aiService.sendAIMessage(userId, chatSessionId, content);
        res.status(200).json({ message: aiReply });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.sendAIMessage = sendAIMessage;
const listSessions = async (req, res) => {
    try {
        const userId = Number(req?.user?.id);
        const isCounselor = req?.user?.role === "COUNSELOR";
        const sessions = await chatService.listSessions(userId, isCounselor);
        res.status(200).json({ sessions });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.listSessions = listSessions;
const getMessages = async (req, res) => {
    try {
        const chatSessionId = Number(req.params.chatSessionId);
        const requesterId = Number(req?.user?.id);
        const messages = await chatService.getMessages(chatSessionId, requesterId);
        const messageResponse = messages?.map((item) => ({
            ...item,
            isMe: item?.senderId == requesterId,
        }));
        res.status(200).json({ messages: messageResponse });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.getMessages = getMessages;
