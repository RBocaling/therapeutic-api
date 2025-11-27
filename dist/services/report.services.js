"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportOverview = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const date_fns_1 = require("date-fns");
/**
 * ✅ At-Risk categories (string contains, lowercase compare)
 */
const AT_RISK_KEYWORDS = [
    "moderate",
    "severe",
    "crisis",
    "struggling",
    "at risk",
];
const getReportOverview = async (counselorId) => {
    try {
        // 1️⃣ Fetch chat sessions for the counselor
        const data = await prisma_1.default.chatSession.findMany({
            where: { counselorId },
            include: {
                user: {
                    include: {
                        profile: true,
                        responses: true,
                    },
                },
                messages: { take: 1, orderBy: { createdAt: "desc" } },
            },
        });
        // 2️⃣ Filter out null users
        const users = data?.map((item) => item.user).filter(Boolean);
        // 3️⃣ AT-RISK USERS based on responses
        const atRiskUsers = users?.filter((u) => u.responses?.some((r) => AT_RISK_KEYWORDS?.some((key) => (r.resultCategory ?? "").toLowerCase().includes(key)))) || [];
        // 4️⃣ Interventions most given by this counselor
        const interventions = await prisma_1.default.counselorNote.groupBy({
            by: ["noteType"],
            where: { counselorId },
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
        });
        // 5️⃣ AGE BRACKET BUCKETING
        const ageBracketCount = {
            "18-24": 0,
            "25-34": 0,
            "35-44": 0,
            "45-54": 0,
            "55+": 0,
        };
        atRiskUsers.forEach((u) => {
            const bday = u.profile?.birthday;
            if (!bday)
                return;
            const age = (0, date_fns_1.differenceInYears)(new Date(), new Date(bday));
            if (age < 25)
                ageBracketCount["18-24"]++;
            else if (age < 35)
                ageBracketCount["25-34"]++;
            else if (age < 45)
                ageBracketCount["35-44"]++;
            else if (age < 55)
                ageBracketCount["45-54"]++;
            else
                ageBracketCount["55+"]++;
        });
        // 6️⃣ GENDER DISTRIBUTION
        const genderCount = {};
        atRiskUsers.forEach((u) => {
            const gender = u.profile?.gender ?? "Unknown";
            genderCount[gender] = (genderCount[gender] || 0) + 1;
        });
        // 7️⃣ Indigenous / Tribe counting
        const indigenousCases = atRiskUsers.filter((u) => u.profile?.indigenousGroup);
        const tribeCount = {};
        indigenousCases.forEach((u) => {
            const tribe = u.profile?.indigenousGroup;
            tribeCount[tribe] = (tribeCount[tribe] || 0) + 1;
        });
        // 8️⃣ Single parents
        const singleParents = atRiskUsers.filter((u) => u.profile?.isSingleParent);
        // 9️⃣ Poor family at-risk
        const poorFamilies = atRiskUsers.filter((u) => u.profile?.familyIncomeRange &&
            u.profile.familyIncomeRange.toLowerCase().includes("below"));
        // 🔟 First generation students
        const firstGenStudents = atRiskUsers.filter((u) => u.profile?.isFirstGenerationStudent);
        // 1️⃣1️⃣ PWD and disability counting
        const pwds = atRiskUsers.filter((u) => u.profile?.isPWD);
        const disabilityCount = {};
        pwds.forEach((u) => {
            if (!u.profile?.disability)
                return;
            const dis = u.profile.disability;
            disabilityCount[dis] = (disabilityCount[dis] || 0) + 1;
        });
        // 1️⃣2️⃣ FINAL REPORT RESPONSE
        return {
            summary: {
                interventionMostGiven: interventions[0]?.noteType || null,
                ageBracketMostCrisis: Object.entries(ageBracketCount).sort((a, b) => b[1] - a[1])[0]?.[0],
                genderMostCases: Object.entries(genderCount).sort((a, b) => b[1] - a[1])[0]?.[0],
                indigenousWithCases: indigenousCases.length,
                tribeMostCases: Object.entries(tribeCount).sort((a, b) => b[1] - a[1])[0]?.[0],
                singleParents: singleParents.length,
                poorFamilyAtRisk: poorFamilies.length,
                firstGenStudentsAtRisk: firstGenStudents.length,
                pwdCount: pwds.length,
                disabilityMostCases: Object.entries(disabilityCount).sort((a, b) => b[1] - a[1])[0]?.[0],
                totalAtRisk: atRiskUsers.length,
            },
            lists: {
                atRiskUsers,
                interventions,
                genderCases: atRiskUsers,
                ageBracketCrisis: atRiskUsers,
                indigenousCases,
                tribeCases: indigenousCases,
                singleParents,
                poorFamilies,
                firstGenStudents,
                pwds,
                disabilities: pwds,
            },
        };
    }
    catch (error) {
        throw new Error(error.message || "Failed to generate report");
    }
};
exports.getReportOverview = getReportOverview;
