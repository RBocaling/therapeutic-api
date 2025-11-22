"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateSurvey = void 0;
const static_mhi_38_1 = require("./static_mhi_38");
const translateSurvey = (code, originalSurvey, lang) => {
    if (lang !== "fil")
        return originalSurvey;
    if (code !== "MHI-38")
        return originalSurvey;
    return {
        ...originalSurvey,
        questions: originalSurvey.questions.map((q, index) => {
            const translatedQ = static_mhi_38_1.MHI38_TAGALOG[index];
            return {
                ...q,
                questionName: translatedQ.questionName,
                options: {
                    options: q.options.options.map((o, optIndex) => ({
                        ...o,
                        text: translatedQ.options.options[optIndex].text,
                        score: o.score,
                    })),
                },
            };
        }),
    };
};
exports.translateSurvey = translateSurvey;
