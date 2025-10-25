export const computeSurveyScore = (surveyCode: string, answers: any[]) => {
  const numericAnswers = answers.map((a) => a.numericValue || 0);
  const totalScore = numericAnswers.reduce((sum, val) => sum + val, 0);
  let category = "Normal";

  switch (surveyCode) {
    case "PHQ-9":
      if (totalScore >= 20) category = "Severe Depression";
      else if (totalScore >= 15) category = "Moderately Severe Depression";
      else if (totalScore >= 10) category = "Moderate Depression";
      else if (totalScore >= 5) category = "Mild Depression";
      else category = "Minimal Depression";
      break;

    case "GAD-7":
      if (totalScore >= 15) category = "Severe Anxiety";
      else if (totalScore >= 10) category = "Moderate Anxiety";
      else if (totalScore >= 5) category = "Mild Anxiety";
      else category = "Minimal Anxiety";
      break;

    case "MHI-38":
      if (totalScore >= 180) category = "Healthy";
      else if (totalScore >= 132) category = "Responding";
      else if (totalScore >= 85) category = "Struggling";
      else category = "Crisis";
      break;

    default:
      category = "Normal";
  }

  return { totalScore, category };
};
