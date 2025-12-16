import prisma from "../config/prisma";
import OpenAI from "openai";
import {
  buildGuidedTlcPrompt,
  TlcPromptOptions,
} from "../utils/generateTlcPrompt";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const parseAssistantJson = (text: string) => {
  try {
    return JSON.parse(text);
  } catch {
    let clean = text
      .replace(/```json|```/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/,(\s*[}\]])/g, "$1")
      .trim();

    return JSON.parse(
      clean.slice(clean.indexOf("{"), clean.lastIndexOf("}") + 1)
    );
  }
};

export const generateGuidedTlc = async (userId: number, mhi38: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        responses: {
          include: { surveyForm: true },
          where: { surveyForm: { code: "MHI-38" } },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) throw new Error("User not found");
    const lastSurvey = user.responses[0];
    if (!lastSurvey) throw new Error("No MHI-38 result found.");

    const opts: TlcPromptOptions = {
      userName: `${user.firstName} ${user.lastName ?? ""}`.trim(),
      age: user.profile?.birthday
        ? new Date().getFullYear() -
          new Date(user.profile.birthday).getFullYear()
        : null,
      gender: user.profile?.gender ?? null,
      mhi38,
    };

    const prompt = buildGuidedTlcPrompt(opts);

    const ai = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });


    const json = parseAssistantJson(ai.choices[0].message?.content ?? "{}");

    const plan = await prisma.guidedTLCPlan.create({
      data: {
        userId,
        durationDays: json.durationDays,
        surveyResult: opts.mhi38,
        certificateMsg: JSON.stringify(json.resultMessage),
      },
    });

    for (const d of json.days) {
      await prisma.guidedTLCDay.create({
        data: {
          planId: plan.id,
          dayNumber: d.day,
          instructions: d.instructions,
          tasks: d.tasks,
        },
      });
    }

    return { planId: plan.id, raw: json };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getAllPlansByUser = async (userId: number) => {
  try {
    return prisma.guidedTLCPlan.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    throw new Error(`Error fetching plans: ${error}`);
  }
};

export const getPlanWithDaysById = async (planId: number) => {
  try {
    return prisma.guidedTLCPlan.findUnique({
      where: { id: planId },
      include: {
        days: { orderBy: { dayNumber: "asc" } }, user: {
          select: {
            firstName: true,
            lastName:true
          }
      } },
    });
  } catch (error) {
    throw new Error(`Error fetching plan: ${error}`);
  }
};

export const updateTasks = async (
  planId: number,
  dayNumber: number,
  taskIndices: number[]
) => {
  try {
    const day = await prisma.guidedTLCDay.findFirst({
      where: { planId, dayNumber },
    });
    if (!day) throw new Error("Day not found");

    const tasks = Array.isArray(day.tasks) ? day.tasks : [];
    taskIndices.forEach((i) => {
      if (tasks[i]) (tasks[i] as any).completed = true;
    });

    const allTasksCompleted = tasks.every((t: any) => t.completed === true);

    await prisma.guidedTLCDay.update({
      where: { id: day.id },
      data: {
        tasks,
        isCompleted: allTasksCompleted,
        completedAt: allTasksCompleted ? new Date() : null,
      },
    });

    const remaining = await prisma.guidedTLCDay.count({
      where: { planId, isCompleted: false },
    });

    if (remaining === 0) {
      await prisma.guidedTLCPlan.update({
        where: { id: planId },
        data: { isCompleted: true, certificateAt: new Date() },
      });
    }

    return { dayCompleted: allTasksCompleted, planCompleted: remaining === 0 };
  } catch (error) {
    throw new Error(`Error updating tasks: ${error}`);
  }
};
