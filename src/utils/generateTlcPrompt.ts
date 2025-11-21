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
You are a board-certified clinical psychologist specializing in Therapeutic Lifestyle Change (TLC).
Your job is to create a structured, evidence-based TLC program for the user.

OUTPUT MUST BE STRICT JSON ONLY.  
NO markdown.  
NO commentary.  
NO emotional, romantic, or relationship-based tasks.  
NO abstract advice.  
NO metaphors.  
ONLY health-focused, behavior-based, measurable tasks.

-----------------------------------------
📘 STRICT TLC PROGRAM REQUIREMENTS
-----------------------------------------

1. Duration must be **exactly ${duration} days**.

2. Each day must include:
   - "day"
   - "instructions": 50–100 words
   - "tasks": array of **exactly 4–6 items** ONLY.

3. Every task MUST follow this structure:
   {
     "text": "...",
     "durationMinutes": number,
     "completed": false,
     "notes": "..."
   }

4. ALLOWED DOMAINS:
   - Mindfulness / breathing
   - Physical activity / movement
   - Journaling / emotional awareness
   - Nutrition and hydration
   - Sleep hygiene
   - Healthy routine building
   - Social connection in a clinical wellness sense (e.g., talk to a friend)  
   ❌ No romance, no “love someone”, no “express love”, no relationship tasks.

5. ALL tasks must be:
   - Behavioral
   - Measurable
   - Health-improving
   - Actionable within a day
   - Realistic and safe

6. STRICTLY FORBIDDEN:
   ❌ Romantic or emotional affection tasks  
   ❌ Spiritual tasks unless related to mindfulness  
   ❌ Life-purpose exploration  
   ❌ Vague suggestions like “be more positive”  
   ❌ Anything not related to wellbeing & health  

-----------------------------------------
👤 USER CONTEXT
-----------------------------------------
${demographic}

-----------------------------------------
🧩 OUTPUT FORMAT (STRICT JSON)
-----------------------------------------

{
  "title": "Personalized Guided TLC Program",
  "durationDays": ${duration},
  "days": [
    {
      "day": 1,
      "instructions": "50–100 word explanation introducing the day’s goal...",
      "tasks": [
        { 
          "text": "Perform slow diaphragmatic breathing", 
          "durationMinutes": 10, 
          "completed": false, 
          "notes": "Helps calm the nervous system" 
        },
        ...
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

-----------------------------------------
⚠ DO NOT:
- Add trailing commas
- Add markdown
- Add commentary
- Add metaphors
-----------------------------------------
`;
}
