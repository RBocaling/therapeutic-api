"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAIMessage = void 0;
const openai_1 = __importDefault(require("openai"));
const prisma_1 = __importDefault(require("../config/prisma"));
const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
const sendAIMessage = async (senderId, chatSessionId, content) => {
    try {
        // Save user's message first
        await prisma_1.default.chatMessage.create({
            data: { chatSessionId, senderId, content, isFromAI: false },
        });
        // Prepare messages for AI
        const messagesForAI = [
            {
                role: "system",
                content: `
          You are a professional mental health counselor AI.
          Respond empathetically and warmly.
          Provide practical, safe, and actionable coping strategies for stress, anxiety, or mild depression.
          Avoid generic "I'm sorry" responses.
          Encourage reflection, journaling, deep breathing, relaxation, and healthy routines.
          Encourage follow-up questions and further conversation.
          Always maintain confidentiality and professionalism.
        `,
            },
            { role: "user", content },
        ];
        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: messagesForAI,
            max_tokens: 300,
            temperature: 0.8,
        });
        const aiReply = completion.choices?.[0]?.message?.content?.trim();
        if (!aiReply)
            throw new Error("AI did not return a reply");
        const safeReply = aiReply.slice(0, 2000);
        // Save AI's reply
        await prisma_1.default.chatMessage.create({
            data: {
                chatSessionId,
                senderId: null,
                content: safeReply,
                isFromAI: true,
            },
        });
        return safeReply;
    }
    catch (error) {
        console.error("Error in sendAIMessage:", error);
        return "Oops! Something went wrong. Please try again later.";
    }
};
exports.sendAIMessage = sendAIMessage;
