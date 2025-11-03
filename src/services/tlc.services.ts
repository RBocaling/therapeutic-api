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
      .replace(/\.\.\./g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .trim()
      .replace(/,(\s*[}\]])/g, "$1");
    const first = clean.indexOf("{");
    const last = clean.lastIndexOf("}");
    if (first === -1 || last === -1) throw new Error("Invalid AI response");
    return JSON.parse(clean.slice(first, last + 1));
  }
};

export const generateGuidedTlc = async (userId: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        responses: {
          where: {
            surveyForm: { code: "MHI-38" },
          },
          include: { surveyForm: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) throw new Error("User not found");

    const latestMHI = user.responses[0];
    if (!latestMHI) throw new Error("No MHI-38 survey found for this user");

    const totalScore = latestMHI.score ?? 0;
    const percentage = Math.min((totalScore / 228) * 100, 100);
    const resultCategory = latestMHI.resultCategory ?? "Normal";

    let category = "";
    let durationDays = 0;

    if (resultCategory.includes("Crisis") || resultCategory.includes("Red")) {
      category = "Crisis";
      durationDays = 0;
    } else if (
      resultCategory.includes("Struggling") ||
      resultCategory.includes("Orange")
    ) {
      category = "Struggling";
      durationDays = 14;
    } else if (
      resultCategory.includes("Responding") ||
      resultCategory.includes("Yellow")
    ) {
      category = "Responding";
      durationDays = 7;
    } else if (
      resultCategory.includes("Healthy") ||
      resultCategory.includes("Green")
    ) {
      category = "Healthy";
      durationDays = 3;
    } else {
      throw new Error("Invalid MHI-38 category");
    }

    const surveyData = {
      surveyCode: "MHI-38",
      totalScore,
      percentage: Number(percentage.toFixed(1)),
      resultCategory,
      category,
      durationDays,
    };

    if (category === "Crisis") {
      return {
        planId: null,
        surveyData,
        message:
          "Your MHI-38 result indicates a crisis level. Please contact a counselor for immediate professional support.",
      };
    }

    const opts: TlcPromptOptions = {
      userName: `${user.firstName} ${user.lastName ?? ""}`.trim(),
      age: user.profile?.birthday
        ? new Date().getFullYear() -
          new Date(user.profile.birthday).getFullYear()
        : null,
      gender: user.profile?.gender ?? null,
      mhi38Category: category,
      goal: `Based on the user's MHI-38 result of "${resultCategory}" with a score of ${totalScore} (${percentage.toFixed(
        1
      )}%), create a ${durationDays}-day detailed therapeutic lifestyle program that focuses on improving mental well-being, emotional regulation, and balance. Include activities for physical health, mindfulness, nutrition, and social connection.`,
    };

    const prompt = buildGuidedTlcPrompt(opts);

    const ai = await client.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.85,
    });

    const content = ai.choices[0].message?.content ?? "{}";
    const json = parseAssistantJson(content);

    const plan = await prisma.guidedTLCPlan.create({
      data: {
        userId,
        surveyResult: surveyData,
        durationDays,
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

    return {
      planId: plan.id,
      durationDays,
      surveyData,
      aiGenerated: json,
    };
  } catch (error) {
    throw new Error(`Error fetching plan: ${error}`);
  }
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
