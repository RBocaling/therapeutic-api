import OpenAI from "openai";
import prisma from "../config/prisma";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const sendAIMessage = async (
  senderId: number | null,
  chatSessionId: number,
  content: string
) => {
  try {
    const userMessage = await prisma.chatMessage.create({
      data: { chatSessionId, senderId, content, isFromAI: false },
    });

    const previousMessages = await prisma.chatMessage.findMany({
      where: { chatSessionId },
      orderBy: { createdAt: "asc" },
    });

    const messagesForAI = [
      {
        role: "system",
        content: `
        You are a professional mental health counselor.
        Provide short, empathetic, and safe guidance.
        Always stay relevant to the topic or previous messages.
        Keep answers concise (2-4 sentences) but helpful.
        Encourage further conversation.
        Maintain confidentiality and professionalism.
      `,
      },
      ...previousMessages.map((msg) => ({
        role: msg.isFromAI ? "assistant" : "user",
        content: msg.content,
      })),
      { role: "user", content },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messagesForAI as any,
      max_tokens: 200, // Limit length for concise replies
    });

    const aiReply = completion.choices?.[0]?.message?.content?.trim();
    if (!aiReply) throw new Error("AI did not return a reply");

    const safeReply = aiReply.slice(0, 2000);

    await prisma.chatMessage.create({
      data: {
        chatSessionId,
        senderId: null,
        content: safeReply,
        isFromAI: true,
      },
    });

    return safeReply;
  } catch (error: any) {
    throw new Error(error);
  }
};
