import { differenceInYears } from "date-fns";
import prisma from "../config/prisma";
import {
  calculateAverage,
  calculatePercentageChange,
  computeRiskDistribution,
  groupByAge,
} from "../utils/compute.analytics";
import { computeProgress } from "../utils/computeProgress";
import { computeSurveyScore } from "../utils/surveyScoring";
import { generateGuidedTlc } from "./tlc.services";

export const seedSurveys = async (surveys: any[]) => {
  try {
    for (const survey of surveys) {
      const form = await prisma.surveyForm.upsert({
        where: { code: survey.code },
        update: {},
        create: {
          title: survey.title,
          description: survey.description,
          code: survey.code,
          scoringRules: survey.scoringRules ?? {},
        },
      });

      for (const [index, question] of survey.questions.entries()) {
        await prisma.surveyQuestion.upsert({
          where: {
            surveyFormId_orderQuestion: {
              surveyFormId: form.id,
              orderQuestion: index + 1,
            } as any,
          },
          update: {},
          create: {
            surveyFormId: form.id,
            questionName: question.questionName,
            questionType: question.questionType,
            options: question.options,
            orderQuestion: index + 1,
          },
        });
      }
    }
    return prisma.surveyForm.findMany({ include: { questions: true } });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getAllSurveys = () => {
  try {
    return prisma.surveyForm.findMany({
      where: { isActive: true },
      select: { id: true, title: true, description: true, code: true },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getSurveyByCode = (code: string) => {
  try {
    return prisma.surveyForm.findUnique({
      where: { code },
      include: { questions: { orderBy: { orderQuestion: "asc" } } },
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const submitSurveyResponse = async (
  userId: number,
  surveyCode: string,
  answers: { questionId: number; value: string; numericValue?: number }[]
) => {
  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });
    if (!userProfile) throw new Error("User profile not found.");

    const survey = await prisma.surveyForm.findUnique({
      where: { code: surveyCode },
    });
    if (!survey) throw new Error("Survey not found.");

    const computed = computeSurveyScore(surveyCode, answers);

    const lastResponse = await prisma.userResponse.findFirst({
      where: {
        userId,
        surveyFormId: survey.id,
      },
      orderBy: { attemptNumber: "desc" },
    });

    const nextAttemptNumber = (lastResponse?.attemptNumber || 0) + 1;

    const userResponse = await prisma.userResponse.create({
      data: {
        userId: userProfile.userId,
        userProfileId: userProfile.id,
        surveyFormId: survey.id,
        status: "completed",
        score: computed.totalScore,
        resultCategory: computed.category,
        attemptNumber: nextAttemptNumber,
        answers: {
          create: answers.map((a) => ({
            surveyQuestionId: a.questionId,
            value: a.value,
            numericValue: a.numericValue ?? null,
          })),
        },
      },
    });

    if (!userResponse) {
      throw new Error("Failed");
    }

    let result;
    if (
      userResponse?.resultCategory !== "Crisis" ||
      Number(userResponse?.score) > 85
    ) {
      result = await generateGuidedTlc(userId, {
        score: Number(userResponse?.score),
        resultCategory: userResponse?.resultCategory,
      });
    }

    // const generateExerciseawait = await generateGuidedTlc(userId);
    await prisma.user.update({
      where: { id: userId },
      data: { isTakeSurvey: true },
    });

    return { ...userResponse, tlcGuideGenerate: result };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getUserSurveyResults = async (userId: number) => {
  try {
    const profile = await prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error("Profile not found");

    const responses = await prisma.userResponse.findMany({
      where: { userProfileId: profile.id },
      include: {
        surveyForm: { include: { questions: true } },
        answers: true,
      },
      orderBy: [{ surveyFormId: "asc" }, { createdAt: "desc" }],
    });

    const parseOptions = (options: any): string[] => {
      if (!options) return [];
      if (Array.isArray(options)) return options;
      if (typeof options === "string") {
        try {
          const parsed = JSON.parse(options);
          return Array.isArray(parsed)
            ? parsed
            : Array.isArray(parsed?.options)
            ? parsed.options
            : [];
        } catch {
          return [];
        }
      }
      if (typeof options === "object" && Array.isArray(options.options))
        return options.options;
      return [];
    };

    return responses.map((r, i) => ({
      takeNumber: responses.length - i,
      surveyId: r.surveyForm.id,
      surveyTitle: r.surveyForm.title,
      surveyCode: r.surveyForm.code,
      score: r.score,
      resultCategory: r.resultCategory,
      status: r.status,
      dateTaken: r.createdAt,
      questions: r.surveyForm.questions.map((q) => ({
        questionName: q.questionName,
        options: parseOptions(q.options),
        userAnswer:
          r.answers.find((a) => a.surveyQuestionId === q.id)?.value ?? null,
      })),
    }));
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getSurveyHistory = async (userProfileId: number) => {
  try {
    const responses = await prisma.userResponse.findMany({
      where: { userProfileId },
      include: {
        surveyForm: {
          select: { id: true, title: true, code: true },
        },
      },
      orderBy: [{ surveyFormId: "asc" }, { attemptNumber: "asc" }],
    });

    const grouped = responses.reduce((acc: any, res) => {
      const key = res.surveyFormId;
      if (!acc[key]) {
        acc[key] = {
          surveyFormId: res.surveyFormId,
          surveyTitle: res.surveyForm.title,
          code: res.surveyForm.code,
          history: [],
        };
      }

      const totalScore = res.score ?? 0;
      let percentage = 0;

      switch (res.surveyForm.code) {
        case "PHQ-9":
          percentage = Math.min((totalScore / 27) * 100, 100);
          break;
        case "GAD-7":
          percentage = Math.min((totalScore / 21) * 100, 100);
          break;
        case "COMBINED":
          percentage = Math.min((totalScore / 48) * 100, 100);
          break;
        case "MHI-38":
          percentage = Math.min((totalScore / 228) * 100, 100);
          break;
        default:
          percentage = Math.min((totalScore / 100) * 100, 100);
      }

      acc[key].history.push({
        attemptNumber: res.attemptNumber,
        score: totalScore,
        percentage: Number(percentage.toFixed(1)),
        resultCategory: res.resultCategory,
        status: res.status,
        takenAt: res.createdAt,
      });

      return acc;
    }, {});

    return {
      userProfileId,
      surveys: Object.values(grouped),
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch survey history");
  }
};


export const getSurveyProgress = async (
  userProfileId: number,
  surveyFormId: number
) => {
  try {
    const responses = await prisma.userResponse.findMany({
      where: { userProfileId, surveyFormId },
      orderBy: { attemptNumber: "asc" },
      include: {
        surveyForm: {
          select: { id: true, title: true, code: true },
        },
      },
    });

    if (!responses.length) {
      return {
        message: "No survey data found for this user and survey form.",
      };
    }

    const surveyInfo = responses[0].surveyForm;

    const progress = responses.map((res) => ({
      attemptNumber: res.attemptNumber,
      score: res.score,
      resultCategory: res.resultCategory,
      takenAt: res.createdAt,
    }));

    const scores = responses.map((r) => r.score ?? 0);
    const analysis = computeProgress(scores);

    return {
      userProfileId,
      surveyFormId,
      surveyTitle: surveyInfo.title,
      code: surveyInfo.code,
      progress,
      analysis,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};

// progress monitoringg
export const getAllUserProgressMonitoring = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
      },
      include: {
        profile: true,
        responses: {
          include: { surveyForm: true },
          orderBy: { createdAt: "desc" },
        },
        UserNotes: {
          include: {
            counselor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                profilePic: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const result = users.map((user) => {
      const responses = user.responses || [];
      const notes = user.UserNotes || [];

      if (responses.length === 0) {
        return {
          userId: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          program: "No Program",
          riskLevel: "No Data",
          progressScore: 0,
          improvementStatus: "No Data",
          lastAssessment: null,
          totalSessions: 0,
          notes,
        };
      }

      const scores = responses.map((r) => r.score ?? 0);
      const { improvement, status } = computeProgress(scores);

      const firstScore = scores[0] || 1;
      const lastScore = scores[scores.length - 1] || 0;
      const rawProgress = (lastScore / firstScore) * 100;
      const progressScore = Math.min(
        Math.max(Number(rawProgress.toFixed(1)), 0),
        100
      );

      const lastResponse = responses[0];
      const lastAssessment = lastResponse.createdAt;
      const riskLevel = lastResponse.resultCategory || "Normal";

      const program = lastResponse.surveyForm.title.includes("Anxiety")
        ? "Anxiety Management"
        : lastResponse.surveyForm.title.includes("Depression")
        ? "Depression Treatment"
        : "General Well-being";

      const totalSessions = responses.length;

      return {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        program,
        riskLevel,
        progressScore,
        improvementStatus: status || improvement || "Stable",
        lastAssessment,
        totalSessions,
        notes,
      };
    });

    return result;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createNote = async (data: {
  userId: number;
  counselorId: number;
  noteType: "SESSION_NOTE" | "OBSERVATION" | "ASSESSMENT" | "INTERVENTION";
  mood: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  content: string;
  tags?: string | null;
}) => {
  try {
    const note = await prisma.counselorNote.create({
      data: {
        userId: data.userId,
        counselorId: data.counselorId,
        noteType: data.noteType,
        mood: data.mood,
        riskLevel: data.riskLevel,
        content: data.content,
        tags: data.tags ?? null,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        counselor: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
      },
    });

    return note;
  } catch (error: any) {
    throw new Error(`Failed to create note: ${error.message}`);
  }
};

// analytics
export const getAnalytics = async (counselorId?: number) => {
  try {
    const referrals = await prisma.referral.findMany({
      where: counselorId ? { counselorId } : {},
      include: {
        user: {
          include: {
            profile: true,
            responses: {
              include: { surveyForm: true },
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    const allResponses = referrals.flatMap((r) => r.user.responses);
    if (!allResponses.length) {
      return {
        totalCount: 0,
        averages: {},
        demographics: {},
        trends: {},
      };
    }

    const groupedBySurvey: Record<
      string,
      { current: number[]; previous: number[] }
    > = {
      "PHQ-9": { current: [], previous: [] },
      "GAD-7": { current: [], previous: [] },
      "MHI-38": { current: [], previous: [] },
      STRESS: { current: [], previous: [] },
    };

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    for (const r of allResponses) {
      const date = new Date(r.createdAt);
      const month = date.getMonth();
      const year = date.getFullYear();
      const score = r.score || 0;

      if (year === currentYear && month === currentMonth)
        groupedBySurvey[r.surveyForm.code]?.current.push(score);
      else if (year === currentYear && month === currentMonth - 1)
        groupedBySurvey[r.surveyForm.code]?.previous.push(score);
    }

    // Compute averages
    const avgPHQ = calculateAverage(groupedBySurvey["PHQ-9"].current);
    const avgPHQPrev = calculateAverage(groupedBySurvey["PHQ-9"].previous);

    const avgGAD = calculateAverage(groupedBySurvey["GAD-7"].current);
    const avgGADPrev = calculateAverage(groupedBySurvey["GAD-7"].previous);

    const avgWellbeing = calculateAverage(groupedBySurvey["MHI-38"].current);
    const avgWellbeingPrev = calculateAverage(
      groupedBySurvey["MHI-38"].previous
    );

    const avgStress = calculateAverage(groupedBySurvey["STRESS"].current);
    const avgStressPrev = calculateAverage(groupedBySurvey["STRESS"].previous);

    // Engagement rate
    const totalUsers = referrals.length;
    const engagedUsers = referrals.filter((r) =>
      r.user.responses.some((resp) => {
        const d = new Date(resp.createdAt);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
    ).length;

    const engagementRate = totalUsers ? (engagedUsers / totalUsers) * 100 : 0;

    const prevEngagedUsers = referrals.filter((r) =>
      r.user.responses.some((resp) => {
        const d = new Date(resp.createdAt);
        return (
          d.getMonth() === currentMonth - 1 && d.getFullYear() === currentYear
        );
      })
    ).length;

    const prevEngagementRate = totalUsers
      ? (prevEngagedUsers / totalUsers) * 100
      : 0;

    const crisisAlertsCount = await prisma.referral.count({
      where: { counselorId, priority: "URGENT" },
    });

    // Demographics
    const ages = referrals
      .map((r) => {
        const birthdate = r.user.profile?.birthday;
        if (!birthdate) return null;
        return differenceInYears(new Date(), new Date(birthdate));
      })
      .filter((a): a is number => !!a);
    const ageGroupsRaw = groupByAge(ages);
    const totalAges = Object.values(ageGroupsRaw).reduce((a, b) => a + b, 0);
    const ageGroups = Object.fromEntries(
      Object.entries(ageGroupsRaw).map(([k, v]) => [
        k,
        {
          count: v,
          percentage: totalAges
            ? ((v / totalAges) * 100).toFixed(1) + "%"
            : "0%",
        },
      ])
    );

    const riskDistributionRaw = computeRiskDistribution(
      allResponses.map((r) => r.resultCategory || "Normal")
    );
    const totalRisks = Object.values(riskDistributionRaw).reduce(
      (a, b) => a + b,
      0
    );
    const riskDistribution = Object.fromEntries(
      Object.entries(riskDistributionRaw).map(([k, v]) => [
        k,
        {
          count: v,
          percentage: totalRisks
            ? ((v / totalRisks) * 100).toFixed(1) + "%"
            : "0%",
        },
      ])
    );

    // Trends data for charts
    const trends = {
      depressionAnxiety: {
        label: "Depression & Anxiety Trends",
        PHQ9: {
          current: avgPHQ,
          previous: avgPHQPrev,
        },
        GAD7: {
          current: avgGAD,
          previous: avgGADPrev,
        },
      },
      wellbeingStress: {
        label: "Wellbeing & Stress Trends",
        Wellbeing: {
          current: avgWellbeing,
          previous: avgWellbeingPrev,
        },
        Stress: {
          current: avgStress,
          previous: avgStressPrev,
        },
      },
    };

    return {
      totalCount: totalUsers,
      averages: {
        PHQ9: {
          value: avgPHQ,
          change: calculatePercentageChange(avgPHQ, avgPHQPrev),
        },
        GAD7: {
          value: avgGAD,
          change: calculatePercentageChange(avgGAD, avgGADPrev),
        },
        Stress: {
          value: avgStress,
          change: calculatePercentageChange(avgStress, avgStressPrev),
        },
        Wellbeing: {
          value: avgWellbeing,
          change: calculatePercentageChange(avgWellbeing, avgWellbeingPrev),
        },
        CrisisAlerts: {
          value: crisisAlertsCount,
          change: "N/A",
        },
        EngagementRate: {
          value: `${engagementRate.toFixed(1)}%`,
          change: calculatePercentageChange(engagementRate, prevEngagementRate),
        },
      },
      demographics: {
        ageDistribution: ageGroups,
        riskDistribution,
      },
      trends,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getCriticalAlerts = async (counselorId?: number) => {
  try {
    const referrals = await prisma.referral.findMany({
      where: counselorId ? { counselorId } : {},
      include: {
        user: {
          include: {
            profile: true,
            responses: {
              include: { surveyForm: true },
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    const alerts = referrals.map((ref) => {
      const latestResponse = ref.user.responses[0];
      const latestSurvey = latestResponse?.surveyForm?.code || "N/A";
      const category = latestResponse?.resultCategory || "Normal";

      let riskLevel: "Low" | "Medium" | "High" | "Critical" = "Low";

      if (
        category.includes("Severe") ||
        category.includes("At Risk") ||
        category.includes("Crisis")
      ) {
        riskLevel = "Critical";
      } else if (
        category.includes("Moderate") ||
        category.includes("Struggling")
      ) {
        riskLevel = "High";
      } else if (category.includes("Mild") || category.includes("Responding")) {
        riskLevel = "Medium";
      } else if (category.includes("Healthy") || category.includes("Normal")) {
        riskLevel = "Low";
      }

      const priority =
        riskLevel === "Critical"
          ? "URGENT"
          : riskLevel === "High"
          ? "HIGH"
          : riskLevel === "Medium"
          ? "MEDIUM"
          : "LOW";

      return {
        referralId: ref.id,
        userId: ref.user.id,
        userName: `${ref.user.firstName} ${ref.user.lastName}`,
        surveyCode: latestSurvey,
        resultCategory: category,
        riskLevel,
        priority,
        status: ref.status,
        acknowledgeStatus: ref.acknowledgeStatus,
        createdAt: ref.createdAt,
      };
    });

    const uniqueAlerts = Array.from(
      new Map(alerts.map((a) => [a.userId, a])).values()
    );

    const criticalAlerts = uniqueAlerts.filter(
      (a) => a.riskLevel === "Critical"
    );

    const summary = {
      totalAlerts: uniqueAlerts.length,
      critical: criticalAlerts.length,
      new: criticalAlerts.filter((a) => !a.acknowledgeStatus).length,
      inProgress: criticalAlerts.filter(
        (a) => a.status === "ACCEPTED" || a.status === "PENDING"
      ).length,
      resolved: criticalAlerts.filter((a) => a.status === "COMPLETED").length,
    };

    return {
      summary,
      alerts: uniqueAlerts,
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch alerts");
  }
};





export const acknowledgeAlert = async (id: number) => {
  try {
    const updated = await prisma.referral.update({
      where: { id },
      data: { acknowledgeStatus: true },
    });
    return updated;
  } catch (error: any) {
    throw new Error(error);
  }
};
export const markAsReviewed = async (id: number) => {
  try {
    const updated = await prisma.userResponse.update({
      where: { id },
      data: { isReviewed: true },
    });
    return updated;
  } catch (error: any) {
    throw new Error(error);
  }
};

// mhi review
export const getMHI38Review = async () => {
  try {
    const responses = await prisma.userResponse.findMany({
      where: { surveyForm: { code: "MHI-38" } },
      include: {
        user: {
          include: { profile: true },
        },
        surveyForm: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (responses.length === 0) {
      return {
        summary: {
          totalSubmissions: 0,
          highRisk: 0,
          unreviewed: 0,
        },
        data: [],
      };
    }

    const groupedByUser = responses.reduce((acc: any, res) => {
      const key = res.userId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(res);
      return acc;
    }, {});

    const data = Object.values(groupedByUser).map((userResponses: any) => {
      const user = userResponses[0].user;
      const program = "MHI-38 Review Program";

      const sorted = userResponses.sort(
        (a: any, b: any) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      const scores = sorted.map((r: any) => r.score ?? 0);
      const progress = computeProgress(scores);
      const latest = sorted[sorted.length - 1];

      const riskCategory = latest.resultCategory || "Normal";
      const isHighRisk =
        riskCategory.includes("Crisis") ||
        riskCategory.includes("Severe") ||
        riskCategory.includes("At Risk");

      return {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        program,
        totalScore: latest.score,
        resultCategory: riskCategory,
        submittedDate: latest.createdAt,
        totalSurveysTaken: userResponses.length,
        isReviewed: latest.isReviewed,
        riskLevel: isHighRisk ? "Critical" : "Normal",
      };
    });

    const totalSubmissions = data.length;
    const highRisk = data.filter((d) => d.riskLevel === "Critical").length;
    const unreviewed = data.filter((d) => !d.isReviewed).length;

    return {
      summary: {
        totalSubmissions,
        highRisk,
        unreviewed,
      },
      data,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
