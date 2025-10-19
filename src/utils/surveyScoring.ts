export const computeSurveyScore = (surveyCode: string, answers: any[]) => {
  const numericAnswers = answers.map((a) => a.numericValue || 0);
  const totalScore = numericAnswers.reduce((sum, val) => sum + val, 0);
  let category = "Normal";

  switch (surveyCode) {
    case "PHQ-9":
      if (totalScore >= 20) category = "Severe Depression";
      else if (totalScore >= 15) category = "Moderately Severe";
      else if (totalScore >= 10) category = "Moderate";
      else if (totalScore >= 5) category = "Mild";
      else category = "Minimal";
      break;

    case "GAD-7":
      if (totalScore >= 15) category = "Severe Anxiety";
      else if (totalScore >= 10) category = "Moderate";
      else if (totalScore >= 5) category = "Mild";
      break;

    case "MHI-38":
      category = totalScore > 100 ? "High Well-being" : "Low Well-being";
      break;

    default:
      category = "Normal";
  }

  return { totalScore, category };
};
