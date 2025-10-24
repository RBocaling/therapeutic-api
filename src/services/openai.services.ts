import OpenAI from "openai";
import prisma from "../config/prisma";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const sendAIMessage = async (
  senderId: number | null,
  chatSessionId: number,
  content: string
) => {
  try {
    // Save user's message first
    await prisma.chatMessage.create({
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
      messages: messagesForAI as any,
      max_tokens: 300,
      temperature: 0.8,
    });

    const aiReply = completion.choices?.[0]?.message?.content?.trim();
    if (!aiReply) throw new Error("AI did not return a reply");

    const safeReply = aiReply.slice(0, 2000);

    // Save AI's reply
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
    console.error("Error in sendAIMessage:", error);
    return "Oops! Something went wrong. Please try again later.";
  }
};
