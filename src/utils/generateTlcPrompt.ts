export type TlcPromptOptions = {
  userName: string;
  age?: number | null;
  gender?: string | null;
  mhi38Category: string; // "Crisis" | "Struggling" | "Responding" | "Healthy"
  goal: string;
  tone?: string;
};

export const buildGuidedTlcPrompt = (opts: TlcPromptOptions) => {
  const demographic = [
    opts.userName ? `User name: ${opts.userName}` : null,
    opts.age ? `Age: ${opts.age}` : null,
    opts.gender ? `Gender: ${opts.gender}` : null,
    `MHI-38 category: ${opts.mhi38Category}`,
  ]
    .filter(Boolean)
    .join("\n");

  const tone =
    opts.tone ?? "calm, supportive, empowering, and clinically accurate";

  return [
    `You are a board-certified clinical psychologist with expertise in Therapeutic Lifestyle Change (TLC).`,
    `Generate a detailed, fully enumerated JSON-only TLC plan.`,

    `📘 **Plan Generation Rules**:
1. Total program duration must be **maximum 14 days**.
2. Generate **every single day sequentially** from day 1 to durationDays (no skips).
3. Each day must have:
   - "day": number (1-based)
   - "instructions": 50–100 word paragraph describing the day's focus
   - "tasks": 3–6 actionable items
4. Each task must include:
   - "text": detailed instruction (longer than 20 words if needed)
   - "durationMinutes": number or null
   - "completed": false
   - "notes": optional rationale or mental health context
5. Cover multiple domains: mindfulness, movement, journaling, social connection, nutrition, sleep hygiene.
6. Tone: ${tone}.
7. Gradual progression: easier tasks in early days, deeper reflection and habit-building later.
8. End with "resultMessage" including title, message, and certificate.`,

    `🧍 **USER CONTEXT**
${demographic}
Goal: ${opts.goal}`,

    `🧩 **OUTPUT FORMAT**
{
  "title": "Personalized Guided TLC Program for [goal/condition]",
  "goal": "Goal stated by the user",
  "durationDays": 14,
  "days": [
    {
      "day": 1,
      "instructions": "Begin by grounding yourself and becoming aware of your thoughts and emotions. Focus on slow breathing and noticing sensations in your body to cultivate calm and presence.",
      "tasks": [
        { "text": "Practice 10 minutes of mindful breathing while focusing on your heart rate and body sensations", "durationMinutes": 10, "completed": false, "notes": "Reduces stress and increases self-awareness" },
        { "text": "Take a 20-minute walk outdoors, observing your surroundings, colors, and sounds mindfully", "durationMinutes": 20, "completed": false, "notes": "Promotes relaxation and exposure to natural light" },
        { "text": "Write a detailed reflection of 5–10 sentences on your current emotional state and any sensations noticed", "durationMinutes": 30, "completed": false, "notes": "Encourages emotional literacy and self-awareness" }
      ]
    },
    {
      "day": 2,
      "instructions": "Focus on gratitude, self-compassion, and gentle physical activity. Take time to notice positive moments and cultivate a sense of control over your emotions.",
      "tasks": [
        { "text": "Write three detailed entries about things you are grateful for today, explaining why each is meaningful", "durationMinutes": 20, "completed": false, "notes": "Improves mood and perspective" },
        { "text": "Perform 15 minutes of gentle stretching or yoga, paying attention to muscle tension and relaxation", "durationMinutes": 15, "completed": false, "notes": "Supports physical and emotional balance" },
        { "text": "Reach out to a friend or family member and share one positive experience from your day", "durationMinutes": 15, "completed": false, "notes": "Strengthens social support and connection" }
      ]
    }
    /* Continue for day 3–14 with similar detailed, long tasks */
  ],
  "resultMessage": {
    "title": "Congratulations on Completing Your Guided TLC Journey",
    "message": "You’ve completed your personalized 14-day TLC program. Your commitment to self-care, reflection, and habit-building demonstrates strength, growth, and resilience.",
    "certificate": {
      "title": "Certificate of Completion",
      "body": "This certifies that {{name}} has successfully completed the AI-Guided Therapeutic Lifestyle Change Program, demonstrating consistent engagement in self-guided mental wellness activities.",
      "date": "YYYY-MM-DD"
    }
  }
}`,

    `🧠 **Strict Output Rules**
- Include every day from 1 to 14.
- No skipped numbers, ellipsis, or trailing commas.
- Tasks must be detailed and long where appropriate.
- Output strictly valid JSON, no markdown or commentary.`,
  ].join("\n\n");
};
