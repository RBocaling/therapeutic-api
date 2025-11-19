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
        const data = await prisma_1.default.chatSession.findMany({
            where: { counselorId: counselorId },
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
        const users = data?.map((item) => item?.user);
        // ✅ 2. Filter AT-RISK USERS based on resultCategory
        const atRiskUsers = users?.filter((u) => u.responses?.some((r) => AT_RISK_KEYWORDS?.some((key) => (r.resultCategory ?? "").toLowerCase().includes(key))));
        // ✅ 3. Interventions most given (Counselor Notes)
        const interventions = await prisma_1.default.counselorNote.groupBy({
            by: ["noteType"],
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
        });
        // ✅ 4. AGE BRACKET BUCKETING
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
        // ✅ 5. GENDER DISTRIBUTION
        const genderCount = {};
        atRiskUsers.forEach((u) => {
            const gender = u.profile?.gender ?? "Unknown";
            genderCount[gender] = (genderCount[gender] || 0) + 1;
        });
        // ✅ 6. Indigenous / Tribe counting
        const indigenousCases = atRiskUsers.filter((u) => u.profile?.indigenousGroup);
        const tribeCount = {};
        indigenousCases.forEach((u) => {
            const tribe = u.profile?.indigenousGroup;
            tribeCount[tribe] = (tribeCount[tribe] || 0) + 1;
        });
        // ✅ 7. Single parents
        const singleParents = atRiskUsers.filter((u) => u.profile?.isSingleParent);
        // ✅ 8. Poor family at-risk
        const poorFamilies = atRiskUsers.filter((u) => u.profile?.familyIncomeRange &&
            u.profile.familyIncomeRange.toLowerCase().includes("below"));
        // ✅ 9. First generation students
        const firstGenStudents = atRiskUsers.filter((u) => u.profile?.isFirstGenerationStudent);
        // ✅ 10. PWD and disability counting
        const pwds = atRiskUsers.filter((u) => u.profile?.isPWD);
        const disabilityCount = {};
        pwds.forEach((u) => {
            if (!u.profile?.disability)
                return;
            const dis = u.profile.disability;
            disabilityCount[dis] = (disabilityCount[dis] || 0) + 1;
        });
        // ✅ FINAL REPORT RESPONSE
        return {
            summary: {
                interventionMostGiven: interventions.length > 0 ? interventions[0].noteType : null,
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
