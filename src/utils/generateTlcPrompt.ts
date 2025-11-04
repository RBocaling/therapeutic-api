export type TlcPromptOptions = {
  userName: string;
  age?: number | null;
  gender?: string | null;
  mhi38: {
    score: number;
    resultCategory: "Crisis" | "Struggling" | "Responding" | "Healthy";
  };
};

export const buildGuidedTlcPrompt = (opts: TlcPromptOptions) => {
  let duration = 14;
  if (opts.mhi38.resultCategory === "Responding") duration = 7;
  if (opts.mhi38.resultCategory === "Healthy") duration = 3;

  const demographic = [
    `User name: ${opts.userName}`,
    opts.age ? `Age: ${opts.age}` : null,
    opts.gender ? `Gender: ${opts.gender}` : null,
    `MHI-38 Score: ${opts.mhi38.score}`,
    `MHI-38 Result: ${opts.mhi38.resultCategory}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `
You are a board-certified clinical psychologist with expertise in Therapeutic Lifestyle Change (TLC).
Generate a detailed JSON ONLY – no markdown, no explanation.

📘 TLC PROGRAM RULES
1. Duration must be exactly **${duration} days**
2. Each day must include:
   - "day"
   - "instructions" (50–100 words)
   - "tasks": array of 3–6 items
3. Each task must include:
   - "text"
   - "durationMinutes"
   - "completed": false
   - "notes"
4. Domains to include within the program: mindfulness, movement, journaling, nutrition, sleep hygiene, social connection.
5. Gradual progression (easy → deeper reflection).

👤 USER CONTEXT:
${demographic}

🧩 OUTPUT FORMAT STRICT JSON:
{
  "title": "Personalized Guided TLC Program",
  "durationDays": ${duration},
  "days": [
    {
      "day": 1,
      "instructions": "Begin by grounding yourself and becoming aware of your thoughts...",
      "tasks": [
        { "text": "Practice slow mindful breathing...", "durationMinutes": 10, "completed": false, "notes": "Regulates breathing and reduces tension" },
        { "text": "Walk outdoors mindfully...", "durationMinutes": 20, "completed": false, "notes": "Improves mood and reduces cortisol" },
        { "text": "Write a reflection journal...", "durationMinutes": 30, "completed": false, "notes": "Encourages emotional awareness" }
      ]
    }
  ],
  "resultMessage": {
    "title": "Congratulations on Completing Your Guided TLC Journey",
    "message": "You’ve completed your personalized TLC program...",
    "certificate": {
      "title": "Certificate of Completion",
      "body": "This certifies that {{name}} has completed the Guided TLC Program.",
      "date": "YYYY-MM-DD"
    }
  }
}

⚠ STRICT RULES
- OUTPUT JSON ONLY
- NO markdown
- NO comments
- NO trailing commas
`;
};
