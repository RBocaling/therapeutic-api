import prisma from "../config/prisma";
import { computeProgress } from "../utils/computeProgress";
import { computeSurveyScore } from "../utils/surveyScoring";

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

    await prisma.user.update({
      where: { id: userId },
      data: { isTakeSurvey: true },
    });

    return userResponse;
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

      acc[key].history.push({
        attemptNumber: res.attemptNumber,
        score: res.score,
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
    throw new Error(error);
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
      },
    });

    const result = users.map((user) => {
      const responses = user.responses || [];

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
      };
    });

    return result;
  } catch (error: any) {
    throw new Error(error);
  }
};
