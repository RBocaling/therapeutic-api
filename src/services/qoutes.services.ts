import prisma from "../config/prisma";
import { QUOTES } from "../utils/qoutes";
import { createNotification } from "./notification.services"; 

export const generateQuoteOfTheDay = async (userId: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingQuote = await prisma.notification.findFirst({
    where: {
      recipientId: userId,
      type: "QUOTE",
      createdAt: {
        gte: today, 
      },
    },
  });

  if (existingQuote) {
    return {
      alreadyGenerated: true,
      message: "Quote already generated today.",
      data: existingQuote,
    };
  }

  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  const notification = await createNotification({
    recipientId: userId,
    type: "QUOTE",
    title: "Quote of the Day",
    message: randomQuote,
  });

  return {
    alreadyGenerated: false,
    message: "Quote generated successfully.",
    data: notification,
  };
};
