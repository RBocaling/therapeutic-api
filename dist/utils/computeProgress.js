"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeProgressPercentage = exports.computeProgress = void 0;
const computeProgress = (scores) => {
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
    if (improvement > 0)
        status = "Improved";
    else if (improvement < 0)
        status = "Declined";
    return {
        totalAttempts: scores.length,
        firstScore,
        latestScore,
        improvement,
        status,
    };
};
exports.computeProgress = computeProgress;
const computeProgressPercentage = (scores) => {
    if (scores.length < 2)
        return 0;
    const first = scores[0];
    const latest = scores[scores.length - 1];
    const progress = ((latest - first) / (first || 1)) * 100;
    return Math.min(Math.max(progress, 0), 100);
};
exports.computeProgressPercentage = computeProgressPercentage;
