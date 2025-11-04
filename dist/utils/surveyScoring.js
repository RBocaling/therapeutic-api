"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeSurveyScore = void 0;
const computeSurveyScore = (surveyCode, answers) => {
    const numericAnswers = answers.map((a) => a.numericValue || 0);
    const totalScore = numericAnswers.reduce((sum, val) => sum + val, 0);
    let category = "Normal";
    switch (surveyCode) {
        case "PHQ-9":
            if (totalScore >= 16)
                category = "Severe Depression";
            else if (totalScore >= 11)
                category = "Moderately Severe Depression";
            else if (totalScore >= 6)
                category = "Moderate Depression";
            else if (totalScore >= 0)
                category = "Mild Depression";
            break;
        case "GAD-7":
            if (totalScore >= 15)
                category = "Severe Anxiety";
            else if (totalScore >= 11)
                category = "Moderately Severe Anxiety";
            else if (totalScore >= 6)
                category = "Moderate Anxiety";
            else if (totalScore >= 0)
                category = "Mild Anxiety";
            break;
        case "COMBINED":
            const phqScore = numericAnswers.slice(0, 9).reduce((a, b) => a + b, 0);
            const gadScore = numericAnswers.slice(9, 16).reduce((a, b) => a + b, 0);
            let phqCategory = "";
            if (phqScore >= 16)
                phqCategory = "Severe Depression";
            else if (phqScore >= 11)
                phqCategory = "Moderately Severe Depression";
            else if (phqScore >= 6)
                phqCategory = "Moderate Depression";
            else
                phqCategory = "Mild Depression";
            let gadCategory = "";
            if (gadScore >= 15)
                gadCategory = "Severe Anxiety";
            else if (gadScore >= 11)
                gadCategory = "Moderately Severe Anxiety";
            else if (gadScore >= 6)
                gadCategory = "Moderate Anxiety";
            else
                gadCategory = "Mild Anxiety";
            // Combine interpretations
            category = `${phqCategory} + ${gadCategory}`;
            return {
                totalScore: phqScore + gadScore,
                category,
                breakdown: {
                    PHQ9: { score: phqScore, category: phqCategory },
                    GAD7: { score: gadScore, category: gadCategory },
                },
            };
        case "MHI-38":
            if (totalScore >= 180)
                category = "Healthy";
            else if (totalScore >= 132)
                category = "Responding";
            else if (totalScore >= 85)
                category = "Struggling";
            else
                category = "Crisis";
            break;
        default:
            category = "Normal";
    }
    return { totalScore, category };
};
exports.computeSurveyScore = computeSurveyScore;
