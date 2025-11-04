"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTasks = exports.getPlanWithDaysById = exports.getAllPlansByUser = exports.generateGuidedTlc = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const openai_1 = __importDefault(require("openai"));
const generateTlcPrompt_1 = require("../utils/generateTlcPrompt");
const client = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
const parseAssistantJson = (text) => {
    try {
        return JSON.parse(text);
    }
    catch {
        let clean = text
            .replace(/```json|```/g, "")
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/,(\s*[}\]])/g, "$1")
            .trim();
        return JSON.parse(clean.slice(clean.indexOf("{"), clean.lastIndexOf("}") + 1));
    }
};
const generateGuidedTlc = async (userId, mhi38) => {
    try {
        const user = await prisma_1.default.user.findUnique({
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
        if (!user)
            throw new Error("User not found");
        const lastSurvey = user.responses[0];
        if (!lastSurvey)
            throw new Error("No MHI-38 result found.");
        const opts = {
            userName: `${user.firstName} ${user.lastName ?? ""}`.trim(),
            age: user.profile?.birthday
                ? new Date().getFullYear() -
                    new Date(user.profile.birthday).getFullYear()
                : null,
            gender: user.profile?.gender ?? null,
            mhi38,
        };
        const prompt = (0, generateTlcPrompt_1.buildGuidedTlcPrompt)(opts);
        const ai = await client.chat.completions.create({
            model: "gpt-5",
            messages: [{ role: "user", content: prompt }],
        });
        const json = parseAssistantJson(ai.choices[0].message?.content ?? "{}");
        const plan = await prisma_1.default.guidedTLCPlan.create({
            data: {
                userId,
                durationDays: json.durationDays,
                surveyResult: opts.mhi38,
                certificateMsg: JSON.stringify(json.resultMessage),
            },
        });
        for (const d of json.days) {
            await prisma_1.default.guidedTLCDay.create({
                data: {
                    planId: plan.id,
                    dayNumber: d.day,
                    instructions: d.instructions,
                    tasks: d.tasks,
                },
            });
        }
        return { planId: plan.id, raw: json };
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.generateGuidedTlc = generateGuidedTlc;
const getAllPlansByUser = async (userId) => {
    try {
        return prisma_1.default.guidedTLCPlan.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }
    catch (error) {
        throw new Error(`Error fetching plans: ${error}`);
    }
};
exports.getAllPlansByUser = getAllPlansByUser;
const getPlanWithDaysById = async (planId) => {
    try {
        return prisma_1.default.guidedTLCPlan.findUnique({
            where: { id: planId },
            include: { days: { orderBy: { dayNumber: "asc" } } },
        });
    }
    catch (error) {
        throw new Error(`Error fetching plan: ${error}`);
    }
};
exports.getPlanWithDaysById = getPlanWithDaysById;
const updateTasks = async (planId, dayNumber, taskIndices) => {
    try {
        const day = await prisma_1.default.guidedTLCDay.findFirst({
            where: { planId, dayNumber },
        });
        if (!day)
            throw new Error("Day not found");
        const tasks = Array.isArray(day.tasks) ? day.tasks : [];
        taskIndices.forEach((i) => {
            if (tasks[i])
                tasks[i].completed = true;
        });
        const allTasksCompleted = tasks.every((t) => t.completed === true);
        await prisma_1.default.guidedTLCDay.update({
            where: { id: day.id },
            data: {
                tasks,
                isCompleted: allTasksCompleted,
                completedAt: allTasksCompleted ? new Date() : null,
            },
        });
        const remaining = await prisma_1.default.guidedTLCDay.count({
            where: { planId, isCompleted: false },
        });
        if (remaining === 0) {
            await prisma_1.default.guidedTLCPlan.update({
                where: { id: planId },
                data: { isCompleted: true, certificateAt: new Date() },
            });
        }
        return { dayCompleted: allTasksCompleted, planCompleted: remaining === 0 };
    }
    catch (error) {
        throw new Error(`Error updating tasks: ${error}`);
    }
};
exports.updateTasks = updateTasks;
