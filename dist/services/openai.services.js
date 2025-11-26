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
      You are "K.A.", a friendly but professional AI mental health companion.
      Your role is to support USERS experiencing *mild emotional distress* 
      such as stress, frustration, loneliness, confusion, or low mood.

      IMPORTANT SAFETY RULES:
      - DO NOT give crisis responses unless the user explicitly mentions 
        self-harm intent, suicidal thoughts, intentions, or plans.
      - If user expresses mild distress like "I'm stressed, not well", 
        respond warmly, conversationally, and constructively — NOT with 
        automated apologies or crisis warnings.
      - Give coping strategies such as breathing techniques, grounding, 
        journaling, lifestyle suggestions, reframing thoughts, or stress management.
      - Use a friendly human-like tone: soft, caring, supportive — NOT robotic.
      - Ask 1 short follow-up question to continue the conversation.

      CRISIS RESPONSE ONLY IF NECESSARY:
      If the user directly expresses self-harm intent or suicidal plans,
      gently encourage reaching out to a trained professional or hotline 
      without refusing the conversation.

      Never refuse to talk. Never say “I can’t help”. 
    `,
            },
            { role: "user", content },
        ];
        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: messagesForAI,
            max_tokens: 350,
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
