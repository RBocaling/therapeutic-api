import { computeProgress } from "./computeProgress";

export const calculateAverage = (values: number[]) => {
  if (!values.length) return 0;
  return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1));
};

export const calculatePercentageChange = (
  current: number,
  previous: number
): string => {
  if (previous === 0) return "0.0%";
  const diff = ((current - previous) / previous) * 100;
  const sign = diff >= 0 ? "+" : "-";
  return `${sign}${Math.abs(diff).toFixed(1)}%`;
};

export const groupByAge = (ages: number[]) => {
  const groups = {
    "18-24": 0,
    "25-34": 0,
    "35-44": 0,
    "45-54": 0,
    "55+": 0,
  };
  for (const age of ages) {
    if (age < 25) groups["18-24"]++;
    else if (age < 35) groups["25-34"]++;
    else if (age < 45) groups["35-44"]++;
    else if (age < 55) groups["45-54"]++;
    else groups["55+"]++;
  }
  return groups;
};

export const computeRiskDistribution = (categories: string[]) => {
  const distribution = { Low: 0, Medium: 0, High: 0, Critical: 0 };

  for (const c of categories) {
    if (
      c.includes("Minimal") ||
      c.includes("Normal") ||
      c.includes("Healthy") ||
      c.includes("Responding")
    )
      distribution.Low++;
    else if (c.includes("Mild") || c.includes("Struggling"))
      distribution.Medium++;
    else if (c.includes("Moderate")) distribution.High++;
    else if (c.includes("Severe") || c.includes("Crisis"))
      distribution.Critical++;
  }

  return distribution;
};

