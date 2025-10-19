import OpenAI from "openai";
import prisma from "../config/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const sendAIMessage = async (
  senderId: number | null,
  chatSessionId: number,
  content: string
) => {
  await prisma.chatMessage.create({
    data: {
      chatSessionId,
      senderId,
      content,
      isFromAI: false,
    },
  });

  const previousMessages = await prisma.chatMessage.findMany({
    where: { chatSessionId },
    orderBy: { createdAt: "asc" },
  });

  const messagesForAI = [
    {
      role: "system",
      content:
        "You are a professional counselor and mental health advisor. " +
        "You provide empathetic, professional, and safe guidance to users " +
        "on emotional, psychological, or personal issues. Always give supportive advice " +
        "and maintain confidentiality.",
    },
    ...previousMessages.map((msg) => ({
      role: msg.isFromAI ? "assistant" : "user",
      content: msg.content || "",
    })),
    {
      role: "user",
      content,
    },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: messagesForAI as any,
  });

  const aiReply = completion.choices[0].message?.content || "";

  await prisma.chatMessage.create({
    data: {
      chatSessionId,
      senderId: null, 
      content: aiReply,
      isFromAI: true,
    },
  });

  return aiReply;
};
