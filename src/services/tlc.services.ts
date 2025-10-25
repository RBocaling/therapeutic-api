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
      .replace(/```json|```/g, "") // remove code fences
      .replace(/\.\.\./g, "") // remove ellipsis
      .replace(/\/\*[\s\S]*?\*\//g, "") // remove /* comments */
      .trim();

    // Remove trailing commas before } or ]
    clean = clean.replace(/,(\s*[}\]])/g, "$1");

    // Extract from first { to last }
    const first = clean.indexOf("{");
    const last = clean.lastIndexOf("}");
    if (first === -1 || last === -1) throw new Error("No JSON found");

    const jsonText = clean.slice(first, last + 1);
    return JSON.parse(jsonText);
  }
};





export const generateGuidedTlc = async (
  userId: number,
  goal: string,
  tone?: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      responses: {
        include: { surveyForm: true },
        where: { surveyForm: { code: "MHI-38" } },
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  });
  if (!user) throw new Error("User not found");

  const mhi = user.responses[0];
  if (!mhi) throw new Error("No MHI-38 response found for this user");

  const opts: TlcPromptOptions = {
    userName: `${user.firstName} ${user.lastName ?? ""}`.trim(),
    age: user.profile?.birthday
      ? new Date().getFullYear() - new Date(user.profile.birthday).getFullYear()
      : null,
    gender: user.profile?.gender ?? null,
    mhi38Category: mhi.resultCategory as any,
    goal,
    tone,
  };

  const prompt = buildGuidedTlcPrompt(opts);
  const ai = await client.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    // max_tokens: 2000,
  });

  const content = ai.choices[0].message?.content ?? "{}";
  const json = parseAssistantJson(content);

  const durationDays =
    json.durationDays || (json.days?.length ? json.days.length : 15);
  const plan = await prisma.guidedTLCPlan.create({
    data: {
      userId,
      title: json.title || "AI Guided TLC Plan",
      goal,
      durationDays,
      notes: json.notes ?? null,
      certificateMsg: json.resultMessage
        ? JSON.stringify(json.resultMessage)
        : null,
    },
  });

  if (Array.isArray(json.days)) {
    for (const d of json.days) {
      await prisma.guidedTLCDay.create({
        data: {
          planId: plan.id,
          dayNumber: d.day ?? 0,
          instructions: d.instructions ?? "",
          tasks: d.tasks ?? [],
        },
      });
    }
  }

  return { planId: plan.id, raw: json };
};

export const getAllPlansByUser = async (userId: number) => {
    console.log("userId", userId);
    
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
      include: { days: { orderBy: { dayNumber: "asc" } } },
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