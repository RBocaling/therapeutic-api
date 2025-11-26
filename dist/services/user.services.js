"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.listUsersWithSurvey = exports.listUsers = exports.getUserUserInfo = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getUserUserInfo = async (userId) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                role: true,
                suffix: true,
                email: true,
                profilePic: true,
                isTakeSurvey: true,
                profile: true,
            },
        });
        if (!user)
            throw new Error("User not found.");
        return {
            id: user.id,
            name: `${user.firstName} ${user.middleName ?? ""} ${user.lastName} ${user.suffix ?? ""}`.trim(),
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            isTakeSurvey: user.isTakeSurvey,
            profile: user.profile,
        };
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getUserUserInfo = getUserUserInfo;
const listUsers = async () => {
    try {
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isAccountVerified: true,
                profilePic: true,
                createdAt: true,
                updatedAt: true,
                profile: true,
            },
            orderBy: { createdAt: "desc" },
        });
        const user = users?.map((item) => ({
            ...item,
            category: item?.profile?.userStatus,
        }));
        return user;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.listUsers = listUsers;
const listUsersWithSurvey = async () => {
    try {
        const users = await prisma_1.default.user.findMany({
            include: {
                profile: {
                    select: {
                        userStatus: true,
                    },
                },
                responses: {
                    include: {
                        surveyForm: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return users.map((u) => {
            // Map each survey response
            const surveys = u.responses.map((r) => {
                const score = r.score ?? null;
                const code = r.surveyForm?.code ?? "";
                // Only MHI-38 has 228 max score
                let percent = null;
                if (score !== null && code === "MHI-38") {
                    percent = Math.min(Math.trunc((score / 228) * 100), 100);
                }
                return {
                    id: r.id,
                    surveyCode: code,
                    surveyTitle: r.surveyForm?.title ?? "",
                    attempt: r.attemptNumber,
                    score,
                    percent,
                    status: r.status,
                    resultCategory: r.resultCategory,
                    dateTaken: r.createdAt,
                    category: r,
                };
            });
            // Collect all valid percentages for MHI-38 only
            const percents = surveys
                .map((s) => s.percent)
                .filter((p) => typeof p === "number");
            console.log("category3", surveys);
            // Average percentage
            const avg = percents.length > 0
                ? percents.reduce((a, b) => a + b, 0) / percents.length
                : null;
            // Convert average % into risk level
            let atRisk = "unknown";
            if (avg !== null) {
                if (avg >= 76)
                    atRisk = "low";
                else if (avg >= 51)
                    atRisk = "medium";
                else if (avg >= 26)
                    atRisk = "high";
                else
                    atRisk = "critical";
            }
            return {
                ...u,
                hasSurvey: surveys.length > 0,
                surveys,
                atRisk, // <-- THIS IS WHAT YOU WANT
            };
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.listUsersWithSurvey = listUsersWithSurvey;
const getUserById = async (id) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id },
            include: {
                profile: true,
                counselorInfo: true,
            },
        });
        if (!user)
            throw new Error("User not found");
        return user;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getUserById = getUserById;
