export const seedAllSurveysData = [
  {
    title: "Mental Health Inventory 38",
    description: "MHI-38: Measures psychological well-being and distress.",
    code: "MHI-38",
    questions: [
      {
        questionName:
          "How happy, satisfied, or pleased have you been with your personal life during the past month?",
        questionType: "single_choice",
        options: {
          options: [
            "very unhappy",
            "unhappy",
            "slightly unhappy",
            "neutral",
            "slightly happy",
            "happy",
            "very happy",
          ],
        },
      },
      {
        questionName:
          "In the past month, how often did you feel downhearted or blue?",
        questionType: "single_choice",
        options: {
          options: ["never", "rarely", "sometimes", "often", "always"],
        },
      },
    ],
  },
  {
    title: "Patient Health Questionnaire 9",
    description: "PHQ-9: Measures depression severity.",
    code: "PHQ-9",
    questions: [
      {
        questionName: "Little interest or pleasure in doing things",
        questionType: "single_choice",
        options: {
          options: [
            "Not at all",
            "Several days",
            "More than half the days",
            "Nearly every day",
          ],
        },
      },
    ],
  },
  {
    title: "Generalized Anxiety Disorder 7",
    description: "GAD-7: Measures anxiety levels.",
    code: "GAD-7",
    questions: [
      {
        questionName: "Feeling nervous, anxious, or on edge",
        questionType: "single_choice",
        options: {
          options: [
            "Not at all",
            "Several days",
            "More than half the days",
            "Nearly every day",
          ],
        },
      },
    ],
  },
  {
    title: "Combined PHQ-9 + GAD-7",
    description: "Combined flow for both PHQ-9 and GAD-7 assessments.",
    code: "COMBINED",
    questions: [
      {
        questionName: "Little interest or pleasure in doing things",
        questionType: "single_choice",
        options: {
          options: [
            "Not at all",
            "Several days",
            "More than half the days",
            "Nearly every day",
          ],
        },
      },
    ],
  },
];
