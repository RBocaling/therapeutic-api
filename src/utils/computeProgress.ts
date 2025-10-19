export type ProgressAnalysis = {
  totalAttempts: number;
  firstScore: number | null;
  latestScore: number | null;
  improvement: number | null;
  status: string;
};

export const computeProgress = (scores: number[]): ProgressAnalysis => {
  if (scores.length === 0) {
    return {
      totalAttempts: 0,
      firstScore: null,
      latestScore: null,
      improvement: null,
      status: "No Data",
    };
  }

  const firstScore = scores[0];
  const latestScore = scores[scores.length - 1];
  const improvement = latestScore - firstScore;

  let status = "Same";
  if (improvement > 0) status = "Improved";
  else if (improvement < 0) status = "Declined";

  return {
    totalAttempts: scores.length,
    firstScore,
    latestScore,
    improvement,
    status,
  };
};
