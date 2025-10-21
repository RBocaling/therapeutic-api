import prisma from "../config/prisma";
import { computeProgress } from "../utils/computeProgress";
import { computeSurveyScore } from "../utils/surveyScoring";

export const seedSurveys = async (surveys: any[]) => {
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
};

export const getAllSurveys = () => {
  return prisma.surveyForm.findMany({
    where: { isActive: true },
    select: { id: true, title: true, description: true, code: true },
  });
};

export const getSurveyByCode = (code: string) => {
  return prisma.surveyForm.findUnique({
    where: { code },
    include: { questions: { orderBy: { orderQuestion: "asc" } } },
  });
};

export const submitSurveyResponse = async (
  userId: number,
  surveyCode: string,
  answers: { questionId: number; value: string; numericValue?: number }[]
) => {
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
};


export const getUserSurveyResults = async (userId: number) => {
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
};







export const getSurveyHistory = async (userProfileId: number) => {
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
};


export const getSurveyProgress = async (
  userProfileId: number,
  surveyFormId: number
) => {
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
};
