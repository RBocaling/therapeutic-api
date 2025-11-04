import prisma from "../config/prisma";
import { differenceInYears } from "date-fns";

const AT_RISK_KEYWORDS = [
  "moderate",
  "moderately severe",
  "severe",
  "crisis",
  "struggling",
  "at risk",
  "depression",
  "anxiety",
];

export const getReportOverview = async () => {
  try {
    const users = await prisma.user.findMany({
      where: { role: "USER" },
      include: {
        profile: true,
        responses: {
          select: {
            id: true,
            resultCategory: true, // <-- MUST SELECT THIS
          },
        },
      },
    });

    console.log("🟡 DEBUG USERS:", users); // <--- ADD DEBUG TO SEE RESULTS

    // ✅ Filter based on resultCategory
    const atRiskUsers = users.filter((u) =>
      u.responses.some((r) =>
        AT_RISK_KEYWORDS.some((key) =>
          (r.resultCategory ?? "").toLowerCase().includes(key)
        )
      )
    );

    console.log("🟢 DEBUG atRiskUsers:", atRiskUsers); // <--- CHECK IF MAY LAMAN

    // ✅ Get highest intervention from Counselor notes
    const interventions = await prisma.counselorNote.groupBy({
      by: ["noteType"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    const ageBuckets = {
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45-54": 0,
      "55+": 0,
    };

    atRiskUsers.forEach((u) => {
      const age = u.profile?.birthday
        ? differenceInYears(new Date(), new Date(u.profile.birthday))
        : null;
      if (!age) return;
      if (age < 25) ageBuckets["18-24"]++;
      else if (age < 35) ageBuckets["25-34"]++;
      else if (age < 45) ageBuckets["35-44"]++;
      else if (age < 55) ageBuckets["45-54"]++;
      else ageBuckets["55+"]++;
    });

    const genderCount: Record<string, number> = {};
    atRiskUsers.forEach((u) => {
      const gender = u.profile?.gender || "Unknown";
      genderCount[gender] = (genderCount[gender] || 0) + 1;
    });

    const indigenousCases = atRiskUsers.filter(
      (u) => u.profile?.indigenousGroup
    );
    const tribeCount: Record<string, number> = {};
    indigenousCases.forEach((u) => {
      const tribe = u.profile?.indigenousGroup!;
      tribeCount[tribe] = (tribeCount[tribe] || 0) + 1;
    });

    const singleParents = atRiskUsers.filter((u) => u.profile?.isSingleParent);
    const poorFamilies = atRiskUsers.filter(
      (u) => u.profile?.familyIncomeRange
    );
    const firstGenStudents = atRiskUsers.filter(
      (u) => u.profile?.isFirstGenerationStudent
    );
    const pwds = atRiskUsers.filter((u) => u.profile?.isPWD);

    const disabilityCount: Record<string, number> = {};
    pwds.forEach((u) => {
      const d = u.profile?.disability;
      if (d) disabilityCount[d] = (disabilityCount[d] || 0) + 1;
    });

    return {
      summary: {
        interventionMostGiven:
          interventions.length > 0 ? interventions[0].noteType : null,
        ageBracketMostCrisis: Object.entries(ageBuckets).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0],
        genderMostCases: Object.entries(genderCount).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0],
        indigenousWithCases: indigenousCases.length,
        tribeMostCases: Object.entries(tribeCount).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0],
        singleParents: singleParents.length,
        poorFamilyAtRisk: poorFamilies.length,
        firstGenStudentsAtRisk: firstGenStudents.length,
        pwdCount: pwds.length,
        disabilityMostCases: Object.entries(disabilityCount).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0],
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
  } catch (error: any) {
    console.error("❌ REPORT ERROR:", error);
    throw new Error(error.message || "Failed to generate report");
  }
};
