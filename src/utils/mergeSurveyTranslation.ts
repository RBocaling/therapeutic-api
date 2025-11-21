import { MHI38_TAGALOG } from "./static_mhi_38";

export const translateSurvey = (
  code: string,
  originalSurvey: any,
  lang: string
) => {
  if (lang !== "fil") return originalSurvey;
  if (code !== "MHI-38") return originalSurvey;

  return {
    ...originalSurvey,
    questions: originalSurvey.questions.map((q: any, index: number) => {
      const translatedQ = MHI38_TAGALOG[index];

      return {
        ...q,
        questionName: translatedQ.questionName,
        options: {
          options: q.options.options.map((o: any, optIndex: number) => ({
            ...o,
            text: translatedQ.options.options[optIndex].text,
            score: o.score,
          })),
        },
      };
    }),
  };
};
