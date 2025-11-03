export type TlcPromptOptions = {
  userName: string;
  age?: number | null;
  gender?: string | null;
  mhi38Category: string;
  goal: string;
};

export const buildGuidedTlcPrompt = (opts: TlcPromptOptions) => {
  const demographic = [
    opts.userName ? `Name: ${opts.userName}` : null,
    opts.age ? `Age: ${opts.age}` : null,
    opts.gender ? `Gender: ${opts.gender}` : null,
    `Current Mental Health Category: ${opts.mhi38Category}`,
  ]
    .filter(Boolean)
    .join("\n");

  return [
    `You are a licensed clinical psychologist specializing in Therapeutic Lifestyle Change (TLC).`,
    `Generate a highly structured and motivational TLC plan as a JSON object. No markdown, no explanation.`,
    `User Info:\n${demographic}`,
    `Goal: ${opts.goal}`,

    `📘 Guidelines:
1. The program duration is fixed based on the user's MHI-38 category (3 / 7 / 14 days).
2. Each day must include:
   - "day": number
   - "instructions": a 70–100 word daily focus narrative that feels encouraging and educational
   - "tasks": 4–6 actionable tasks from these domains:
       • 🧘 Mindfulness or relaxation
       • 🏃 Physical movement or exercise
       • 🍎 Nutrition and healthy eating
       • 💬 Journaling or reflection
       • 🤝 Social connection or positive interaction
   - Each task must have:
       - "text": actionable sentence
       - "durationMinutes": integer estimate
       - "completed": false
       - "notes": 1–2 sentences explaining its psychological or wellness benefit
3. Gradually increase intensity — start easy, deepen self-reflection later.
4. End the JSON with a "resultMessage" containing:
   - "title": uplifting short phrase
   - "message": 2–3 sentence motivational summary acknowledging progress.
5. Tone: Empathetic, professional, supportive, and evidence-based.`,
  ].join("\n\n");
};
