import prisma from "../config/prisma";
import { differenceInYears } from "date-fns";

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



export const getReportOverview = async (counselorId: number) => {
  try {
    // 1️⃣ Fetch chat sessions for the counselor
    const data = await prisma.chatSession.findMany({
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

    console.log("dassta", data);
    
    // 2️⃣ Filter out null users
    const users = data?.map((item) => item.user).filter(Boolean);

    // 3️⃣ AT-RISK USERS based on responses
    const atRiskUsers =
      users?.filter((u: any) =>
        u.responses?.some((r: any) =>
          AT_RISK_KEYWORDS?.some((key) =>
            (r.resultCategory ?? "").toLowerCase().includes(key)
          )
        )
      ) || [];

    // 4️⃣ Interventions most given by this counselor
    const interventions = await prisma.counselorNote.groupBy({
      by: ["noteType"],
      where: { counselorId },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    // 5️⃣ AGE BRACKET BUCKETING
    const ageBracketCount: Record<string, number> = {
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45-54": 0,
      "55+": 0,
    };

    atRiskUsers.forEach((u: any) => {
      const bday = u.profile?.birthday;
      if (!bday) return;
      const age = differenceInYears(new Date(), new Date(bday));

      if (age < 25) ageBracketCount["18-24"]++;
      else if (age < 35) ageBracketCount["25-34"]++;
      else if (age < 45) ageBracketCount["35-44"]++;
      else if (age < 55) ageBracketCount["45-54"]++;
      else ageBracketCount["55+"]++;
    });

    // 6️⃣ GENDER DISTRIBUTION
    const genderCount: Record<string, number> = {};
    atRiskUsers.forEach((u: any) => {
      const gender = u.profile?.gender ?? "Unknown";
      genderCount[gender] = (genderCount[gender] || 0) + 1;
    });

    // 7️⃣ Indigenous / Tribe counting
    const indigenousCases = atRiskUsers.filter(
      (u: any) => u.profile?.indigenousGroup
    );
    const tribeCount: Record<string, number> = {};
    indigenousCases.forEach((u: any) => {
      const tribe = u.profile?.indigenousGroup!;
      tribeCount[tribe] = (tribeCount[tribe] || 0) + 1;
    });

    // 8️⃣ Single parents
    const singleParents = atRiskUsers.filter(
      (u: any) => u.profile?.isSingleParent
    );

    // 9️⃣ Poor family at-risk
    const poorFamilies = atRiskUsers.filter(
      (u: any) =>
        u.profile?.familyIncomeRange &&
        u.profile.familyIncomeRange.toLowerCase().includes("below")
    );

    // 🔟 First generation students
    const firstGenStudents = atRiskUsers.filter(
      (u: any) => u.profile?.isFirstGenerationStudent
    );

    // 1️⃣1️⃣ PWD and disability counting
    const pwds = atRiskUsers.filter((u: any) => u.profile?.isPWD);
    const disabilityCount: Record<string, number> = {};
    pwds.forEach((u: any) => {
      if (!u.profile?.disability) return;
      const dis = u.profile.disability;
      disabilityCount[dis] = (disabilityCount[dis] || 0) + 1;
    });

    // 1️⃣2️⃣ FINAL REPORT RESPONSE
    return {
      summary: {
        interventionMostGiven: interventions[0]?.noteType || null,
        ageBracketMostCrisis: Object.entries(ageBracketCount).sort(
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
    throw new Error(error.message || "Failed to generate report");
  }
};
export const getReportOverviewV2 = async (counselorId: number) => {
  try {
    // 1️⃣ Fetch chat sessions for the counselor
    const data = await prisma.referral.findMany({
      where: { counselorId },
      include: {
        user: {
          include: {
            profile: true,
            responses: true,
          },
        },
        // messages: { take: 1, orderBy: { createdAt: "desc" } },
      },
    });

    console.log("dassta", data);
    
    // 2️⃣ Filter out null users
    const users = data?.map((item) => item.user).filter(Boolean);

    // 3️⃣ AT-RISK USERS based on responses
    const atRiskUsers =
      users?.filter((u: any) =>
        u.responses?.some((r: any) =>
          AT_RISK_KEYWORDS?.some((key) =>
            (r.resultCategory ?? "").toLowerCase().includes(key)
          )
        )
      ) || [];

    // 4️⃣ Interventions most given by this counselor
    const interventions = await prisma.counselorNote.groupBy({
      by: ["noteType"],
      where: { counselorId },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    // 5️⃣ AGE BRACKET BUCKETING
    const ageBracketCount: Record<string, number> = {
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45-54": 0,
      "55+": 0,
    };

    atRiskUsers.forEach((u: any) => {
      const bday = u.profile?.birthday;
      if (!bday) return;
      const age = differenceInYears(new Date(), new Date(bday));

      if (age < 25) ageBracketCount["18-24"]++;
      else if (age < 35) ageBracketCount["25-34"]++;
      else if (age < 45) ageBracketCount["35-44"]++;
      else if (age < 55) ageBracketCount["45-54"]++;
      else ageBracketCount["55+"]++;
    });

    // 6️⃣ GENDER DISTRIBUTION
    const genderCount: Record<string, number> = {};
    atRiskUsers.forEach((u: any) => {
      const gender = u.profile?.gender ?? "Unknown";
      genderCount[gender] = (genderCount[gender] || 0) + 1;
    });

    // 7️⃣ Indigenous / Tribe counting
    const indigenousCases = atRiskUsers.filter(
      (u: any) => u.profile?.indigenousGroup
    );
    const tribeCount: Record<string, number> = {};
    indigenousCases.forEach((u: any) => {
      const tribe = u.profile?.indigenousGroup!;
      tribeCount[tribe] = (tribeCount[tribe] || 0) + 1;
    });

    // 8️⃣ Single parents
    const singleParents = atRiskUsers.filter(
      (u: any) => u.profile?.isSingleParent
    );

    // 9️⃣ Poor family at-risk
    const poorFamilies = atRiskUsers.filter(
      (u: any) =>
        u.profile?.familyIncomeRange &&
        u.profile.familyIncomeRange.toLowerCase().includes("below")
    );

    // 🔟 First generation students
    const firstGenStudents = atRiskUsers.filter(
      (u: any) => u.profile?.isFirstGenerationStudent
    );

    // 1️⃣1️⃣ PWD and disability counting
    const pwds = atRiskUsers.filter((u: any) => u.profile?.isPWD);
    const disabilityCount: Record<string, number> = {};
    pwds.forEach((u: any) => {
      if (!u.profile?.disability) return;
      const dis = u.profile.disability;
      disabilityCount[dis] = (disabilityCount[dis] || 0) + 1;
    });

    // 1️⃣2️⃣ FINAL REPORT RESPONSE
    return {
      summary: {
        interventionMostGiven: interventions[0]?.noteType || null,
        ageBracketMostCrisis: Object.entries(ageBracketCount).sort(
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
    throw new Error(error.message || "Failed to generate report");
  }
};
