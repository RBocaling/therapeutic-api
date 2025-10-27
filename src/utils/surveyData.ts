export const seedAllSurveysData = [
  {
    title: "Mental Health Inventory 38",
    description: "MHI-38: Measures psychological well-being and distress.",
    code: "MHI-38",
    questions: [
      // ----------------- Q1: Scale_A_Happiness -----------------
      {
        questionName:
          "How happy, satisfied, or pleased have you been with your personal life during the past month?",
        questionType: "single_choice",
        options: {
          options: [
            {
              text: "Extremely happy, could not have been more satisfied or pleased",
              score: 6,
            },
            { text: "Very happy most of the time", score: 5 },
            { text: "Generally, satisfied, pleased", score: 4 },
            {
              text: "Sometimes fairly satisfied, sometimes fairly unhappy",
              score: 3,
            },
            { text: "Generally dissatisfied, unhappy", score: 2 },
            { text: "Very dissatisfied, unhappy most of the time", score: 1 },
          ],
        },
      },
      // ----------------- Q2: Scale_B_Time -----------------
      {
        questionName:
          "How much of the time have you felt lonely during the past month?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 1 }, // Note: Loneliness is reversed-scored for Well-being
            { text: "Most of the time", score: 2 },
            { text: "A good bit of the time", score: 3 },
            { text: "Some of the time", score: 4 },
            { text: "A little of the time", score: 5 },
            { text: "None of the time", score: 6 },
          ],
        },
      },
      // ----------------- Q3: Scale_C_Frequency -----------------
      {
        questionName:
          "How often did you become nervous or jumpy when faced with excitement or unexpected situations during the past month?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Always", score: 1 },
            { text: "Very often", score: 2 },
            { text: "Fairly often", score: 3 },
            { text: "Sometimes", score: 4 },
            { text: "Almost never", score: 5 },
            { text: "Never", score: 6 },
          ],
        },
      },
      // ----------------- Q4: Scale_B_Time (Well-being) -----------------
      {
        questionName:
          "How much of the time have you felt that the future looks hopeful and promising?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 6 },
            { text: "Most of the time", score: 5 },
            { text: "A good bit of the time", score: 4 },
            { text: "Some of the time", score: 3 },
            { text: "A little of the time", score: 2 },
            { text: "None of the time", score: 1 },
          ],
        },
      },
      // ----------------- Q5: Scale_B_Time (Well-being) -----------------
      {
        questionName:
          "How much of the time, during the past month, has your daily life been full of things that were interesting to you?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 6 },
            { text: "Most of the time", score: 5 },
            { text: "A good bit of the time", score: 4 },
            { text: "Some of the time", score: 3 },
            { text: "A little of the time", score: 2 },
            { text: "None of the time", score: 1 },
          ],
        },
      },
      // ----------------- Q6: Scale_B_Time (Well-being) -----------------
      {
        questionName:
          "How much of the time, during the past month, did you feel relaxed and free from tension?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 6 },
            { text: "Most of the time", score: 5 },
            { text: "A good bit of the time", score: 4 },
            { text: "Some of the time", score: 3 },
            { text: "A little of the time", score: 2 },
            { text: "None of the time", score: 1 },
          ],
        },
      },
      // ----------------- Q7: Scale_B_Time (Well-being) -----------------
      {
        questionName:
          "How much of the time have you generally enjoyed the things you do?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 6 },
            { text: "Most of the time", score: 5 },
            { text: "A good bit of the time", score: 4 },
            { text: "Some of the time", score: 3 },
            { text: "A little of the time", score: 2 },
            { text: "None of the time", score: 1 },
          ],
        },
      },
      // ----------------- Q8: Scale_D_LosingControl -----------------
      {
        questionName:
          "During the past month, have you had any reason to wonder if you were losing your mind, or losing control over the way you act, talk, think, feel, or of your memory?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "No, not at all", score: 5 },
            { text: "Maybe a little", score: 4 },
            {
              text: "Yes, but not enough to be concerned or worried about",
              score: 3,
            },
            { text: "Yes, and I have been a little concerned", score: 2 },
            { text: "Yes, and I am quite concerned", score: 1 },
            { text: "Yes, I am very much concerned about it", score: 1 },
          ],
        },
      },
      // ----------------- Q9: Scale_E_Depression -----------------
      {
        questionName: "Did you feel depressed during the past month?",
        questionType: "single_choice",
        options: {
          options: [
            {
              text: "Yes, to the point that I did not care about anything for days at a time",
              score: 1,
            },
            { text: "Yes, very depressed almost every day", score: 2 },
            { text: "Yes, quite depressed several times", score: 3 },
            { text: "Yes, a little depressed now and then", score: 4 },
            { text: "No, never felt depressed at all", score: 5 },
          ],
        },
      },
      // ----------------- Q10: Scale_B_Time (Well-being) -----------------
      {
        questionName:
          "How much of the time during the past month have you felt loved and wanted?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 6 },
            { text: "Most of the time", score: 5 },
            { text: "A good bit of the time", score: 4 },
            { text: "Some of the time", score: 3 },
            { text: "A little of the time", score: 2 },
            { text: "None of the time", score: 1 },
          ],
        },
      },
      // ----------------- Q11: Scale_B_Time (Distress) -----------------
      {
        questionName:
          "How much of the time, during the past month, have you been a very nervous person?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 1 },
            { text: "Most of the time", score: 2 },
            { text: "A good bit of the time", score: 3 },
            { text: "Some of the time", score: 4 },
            { text: "A little of the time", score: 5 },
            { text: "None of the time", score: 6 },
          ],
        },
      },
      // ----------------- Q12: Scale_C_Frequency (Well-being) -----------------
      {
        questionName:
          "When you have got up in the morning, the past month, about how often did you expect to have an interesting day?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Always", score: 6 },
            { text: "Very often", score: 5 },
            { text: "Fairly often", score: 4 },
            { text: "Sometimes", score: 3 },
            { text: "Almost never", score: 2 },
            { text: "Never", score: 1 },
          ],
        },
      },
      // ----------------- Q13: Scale_B_Time (Distress) -----------------
      {
        questionName:
          'How much of the time have you felt tense or "high-strung"?',
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 1 },
            { text: "Most of the time", score: 2 },
            { text: "A good bit of the time", score: 3 },
            { text: "Some of the time", score: 4 },
            { text: "A little of the time", score: 5 },
            { text: "None of the time", score: 6 },
          ],
        },
      },
      // ----------------- Q14: Scale_F_Control -----------------
      {
        questionName:
          "During the past month, have you been in firm control of your behaviour, thoughts, emotions or feelings?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Yes, very definitely", score: 6 },
            { text: "Yes, for the most part", score: 5 },
            { text: "Yes, I guess so", score: 4 },
            { text: "No, not too well", score: 3 },
            { text: "No, and I am somewhat disturbed", score: 2 },
            { text: "No, and I am very disturbed", score: 1 },
          ],
        },
      },
      // ----------------- Q15: Scale_C_Frequency (Distress) -----------------
      {
        questionName:
          "During the past month, how often did your hands shake when you tried to do something?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Always", score: 1 },
            { text: "Very often", score: 2 },
            { text: "Fairly often", score: 3 },
            { text: "Sometimes", score: 4 },
            { text: "Almost never", score: 5 },
            { text: "Never", score: 6 },
          ],
        },
      },
      // ----------------- Q16: Scale_C_Frequency (Distress) -----------------
      {
        questionName:
          "During the past month, how often did you feel that you had nothing to look forward to?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Always", score: 1 },
            { text: "Very often", score: 2 },
            { text: "Fairly often", score: 3 },
            { text: "Sometimes", score: 4 },
            { text: "Almost never", score: 5 },
            { text: "Never", score: 6 },
          ],
        },
      },
      // ----------------- Q17: Scale_B_Time (Well-being) -----------------
      {
        questionName:
          "How much of the time during the past month, have you felt calm and peaceful?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 6 },
            { text: "Most of the time", score: 5 },
            { text: "A good bit of the time", score: 4 },
            { text: "Some of the time", score: 3 },
            { text: "A little of the time", score: 2 },
            { text: "None of the time", score: 1 },
          ],
        },
      },
      // ----------------- Q18: Scale_B_Time (Well-being) -----------------
      {
        questionName:
          "How much of the time, during the past month, have you felt emotionally stable?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 6 },
            { text: "Most of the time", score: 5 },
            { text: "A good bit of the time", score: 4 },
            { text: "Some of the time", score: 3 },
            { text: "A little of the time", score: 2 },
            { text: "None of the time", score: 1 },
          ],
        },
      },
      // ----------------- Q19: Scale_B_Time (Distress) -----------------
      {
        questionName:
          "How much of the time during the past month have you felt downhearted and blue?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 1 },
            { text: "Most of the time", score: 2 },
            { text: "A good bit of the time", score: 3 },
            { text: "Some of the time", score: 4 },
            { text: "A little of the time", score: 5 },
            { text: "None of the time", score: 6 },
          ],
        },
      },
      // ----------------- Q20: Scale_C_Frequency (Distress) -----------------
      {
        questionName:
          "How often have you felt like crying, during the past month?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Always", score: 1 },
            { text: "Very often", score: 2 },
            { text: "Fairly often", score: 3 },
            { text: "Sometimes", score: 4 },
            { text: "Almost never", score: 5 },
            { text: "Never", score: 6 },
          ],
        },
      },
      // ----------------- Q21: Scale_C_Frequency (Distress) -----------------
      {
        questionName:
          "During the past month, how often have you felt that others would be better off if you were dead?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Always", score: 1 },
            { text: "Very often", score: 2 },
            { text: "Fairly often", score: 3 },
            { text: "Sometimes", score: 4 },
            { text: "Almost never", score: 5 },
            { text: "Never", score: 6 },
          ],
        },
      },
      // ----------------- Q22: Scale_B_Time (Well-being) -----------------
      {
        questionName:
          "How much of the time, during the past month, were you able to relax without difficulty?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 6 },
            { text: "Most of the time", score: 5 },
            { text: "A good bit of the time", score: 4 },
            { text: "Some of the time", score: 3 },
            { text: "A little of the time", score: 2 },
            { text: "None of the time", score: 1 },
          ],
        },
      },
      // ----------------- Q23: Scale_B_Time (Well-being) -----------------
      {
        questionName:
          "How much of the time, during the past month, did you feel that your love relationships, loving and being loved, were full and complete?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 6 },
            { text: "Most of the time", score: 5 },
            { text: "A good bit of the time", score: 4 },
            { text: "Some of the time", score: 3 },
            { text: "A little of the time", score: 2 },
            { text: "None of the time", score: 1 },
          ],
        },
      },
      // ----------------- Q24: Scale_C_Frequency (Distress) -----------------
      {
        questionName:
          "How often, during the past month, did you feel that nothing turned out for you the way you wanted it to?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Always", score: 1 },
            { text: "Very often", score: 2 },
            { text: "Fairly often", score: 3 },
            { text: "Sometimes", score: 4 },
            { text: "Almost never", score: 5 },
            { text: "Never", score: 6 },
          ],
        },
      },
      // ----------------- Q25: Scale_G_Nerves -----------------
      {
        questionName:
          'How much have you been bothered by nervousness or your "nerves" during the past month?',
        questionType: "single_choice",
        options: {
          options: [
            {
              text: "Extremely so, to the point where I could not take care of things",
              score: 1,
            },
            { text: "Very much bothered", score: 2 },
            { text: "Bothered quite a bit by nerves", score: 3 },
            { text: "Bothered some, enough to notice", score: 4 },
            { text: "Bothered just a little by nerves", score: 5 },
            { text: "Not bothered at all by this", score: 6 },
          ],
        },
      },
      // ----------------- Q26: Scale_B_Time (Well-being) -----------------
      {
        questionName:
          "During the past month, how much of the time have you been a wonderful adventure for you?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 6 },
            { text: "Most of the time", score: 5 },
            { text: "A good bit of the time", score: 4 },
            { text: "Some of the time", score: 3 },
            { text: "A little of the time", score: 2 },
            { text: "None of the time", score: 1 },
          ],
        },
      },
      // ----------------- Q27: Scale_C_Frequency (Distress) -----------------
      {
        questionName:
          "How often, during the past month, have you felt so down in the dumps that nothing could cheer you up?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Always", score: 1 },
            { text: "Very often", score: 2 },
            { text: "Fairly often", score: 3 },
            { text: "Sometimes", score: 4 },
            { text: "Almost never", score: 5 },
            { text: "Never", score: 6 },
          ],
        },
      },
      // ----------------- Q28: Scale_H_Suicidal -----------------
      {
        questionName:
          "During the past month, did you think about taking your own life?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Yes, very often", score: 1 },
            { text: "Yes, fairly often", score: 2 },
            { text: "Yes, a couple of times", score: 3 },
            { text: "Yes, at one time", score: 4 },
            { text: "No, never", score: 5 },
          ],
        },
      },
      // ----------------- Q29: Scale_B_Time (Distress) -----------------
      {
        questionName:
          "During the past month, how much of the time have you felt restless, fidgety, or impatient?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 1 },
            { text: "Most of the time", score: 2 },
            { text: "A good bit of the time", score: 3 },
            { text: "Some of the time", score: 4 },
            { text: "A little of the time", score: 5 },
            { text: "None of the time", score: 6 },
          ],
        },
      },
      // ----------------- Q30: Scale_B_Time (Distress) -----------------
      {
        questionName:
          "During the past month, how much of the time have you been moody or brooded about things?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 1 },
            { text: "Most of the time", score: 2 },
            { text: "A good bit of the time", score: 3 },
            { text: "Some of the time", score: 4 },
            { text: "A little of the time", score: 5 },
            { text: "None of the time", score: 6 },
          ],
        },
      },
      // ----------------- Q31: Scale_B_Time (Well-being) -----------------
      {
        questionName:
          "How often did you feel cheerful, lighthearted, or happy?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 6 },
            { text: "Most of the time", score: 5 },
            { text: "A good bit of the time", score: 4 },
            { text: "Some of the time", score: 3 },
            { text: "A little of the time", score: 2 },
            { text: "None of the time", score: 1 },
          ],
        },
      },
      // ----------------- Q32: Scale_C_Frequency (Distress) -----------------
      {
        questionName: "How often did you get rattled, upset or flustered?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Always", score: 1 },
            { text: "Very often", score: 2 },
            { text: "Fairly often", score: 3 },
            { text: "Sometimes", score: 4 },
            { text: "Almost never", score: 5 },
            { text: "Never", score: 6 },
          ],
        },
      },
      // ----------------- Q33: Scale_I_Anxious -----------------
      {
        questionName:
          "During the past month, have you been anxious or worried?",
        questionType: "single_choice",
        options: {
          options: [
            {
              text: "Yes, extremely to the point of being sick or almost sick",
              score: 1,
            },
            { text: "Yes, very much so", score: 2 },
            { text: "Yes, quite a bit", score: 3 },
            { text: "Yes, some, enough to bother me", score: 4 },
            { text: "Yes, a little bit", score: 5 },
            { text: "No, not at all", score: 6 },
          ],
        },
      },
      // ----------------- Q34: Scale_B_Time (Well-being) -----------------
      {
        questionName: "How much of the time were you a happy person?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 6 },
            { text: "Most of the time", score: 5 },
            { text: "A good bit of the time", score: 4 },
            { text: "Some of the time", score: 3 },
            { text: "A little of the time", score: 2 },
            { text: "None of the time", score: 1 },
          ],
        },
      },
      // ----------------- Q35: Scale_C_Frequency (Distress) -----------------
      {
        questionName:
          "How often during the past month did you find yourself trying to calm down?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Always", score: 1 },
            { text: "Very often", score: 2 },
            { text: "Fairly often", score: 3 },
            { text: "Sometimes", score: 4 },
            { text: "Almost never", score: 5 },
            { text: "Never", score: 6 },
          ],
        },
      },
      // ----------------- Q36: Scale_B_Time (Distress) -----------------
      {
        questionName:
          "How much of the time have you been in low or very low spirits?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "All of the time", score: 1 },
            { text: "Most of the time", score: 2 },
            { text: "A good bit of the time", score: 3 },
            { text: "Some of the time", score: 4 },
            { text: "A little of the time", score: 5 },
            { text: "None of the time", score: 6 },
          ],
        },
      },
      // ----------------- Q37: Scale_J_Rested -----------------
      {
        questionName:
          "How often, during the past month, have you been waking up feeling fresh and rested?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Always, every day", score: 6 },
            { text: "Almost every day", score: 5 },
            { text: "Most days", score: 4 },
            { text: "Some days, but usually not", score: 3 },
            { text: "Hardly ever", score: 2 },
            { text: "Never wake up feeling rested", score: 1 },
          ],
        },
      },
      // ----------------- Q38: Scale_K_Stress -----------------
      {
        questionName:
          "During the past month, have you been under or felt you were under any strain, stress or pressure?",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Yes, almost more than I could stand or bear", score: 1 },
            { text: "Yes, quite a bit of pressure", score: 2 },
            { text: "Yes, some more than usual", score: 3 },
            { text: "Yes, some, but about normal", score: 4 },
            { text: "Yes, a little bit", score: 5 },
            { text: "No, not at all", score: 6 },
          ],
        },
      },
    ],
  },
  // --- Other Surveys (PHQ-9, GAD-7, Combined) ---
  {
    title: "Patient Health Questionnaire (PHQ-9)",
    description: "Measures depression severity over the past 2 weeks.",
    code: "PHQ-9",
    questions: [
      {
        questionName: "Little interest or pleasure in doing things",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Feeling down, depressed, or hopeless",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Trouble falling or staying asleep, or sleeping too much",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Feeling tired or having little energy",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Poor appetite or overeating",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName:
          "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName:
          "Trouble concentrating on things, such as reading or watching television",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName:
          "Moving or speaking so slowly that other people could have noticed? Or being so fidgety or restless that you have been moving more than usual",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName:
          "Thoughts that you would be better off dead or of hurting yourself in some way",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
    ],
  },

  {
    title: "Generalized Anxiety Disorder (GAD-7)",
    description: "Measures anxiety severity over the past 2 weeks.",
    code: "GAD-7",
    questions: [
      {
        questionName: "Feeling nervous, anxious, or on edge",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Not being able to stop or control worrying",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Worrying too much about different things",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Trouble relaxing",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Being so restless that it is hard to sit still",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Becoming easily annoyed or irritable",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Feeling afraid as if something awful might happen",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
    ],
  },
  {
    title: "Combined PHQ-9 + GAD-7 Assessment",
    description:
      "A combined screening for depression and anxiety using PHQ-9 and GAD-7 scales.",
    code: "COMBINED",
    questions: [
      // --- PHQ-9 (Depression) ---
      {
        questionName: "Little interest or pleasure in doing things",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Feeling down, depressed, or hopeless",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Trouble falling or staying asleep, or sleeping too much",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Feeling tired or having little energy",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Poor appetite or overeating",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName:
          "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName:
          "Trouble concentrating on things, such as reading or watching television",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName:
          "Moving or speaking so slowly that other people could have noticed? Or being so fidgety or restless that you have been moving more than usual",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName:
          "Thoughts that you would be better off dead or of hurting yourself in some way",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },

      // --- GAD-7 (Anxiety) ---
      {
        questionName: "Feeling nervous, anxious, or on edge",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Not being able to stop or control worrying",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Worrying too much about different things",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Trouble relaxing",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Being so restless that it is hard to sit still",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Becoming easily annoyed or irritable",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
      {
        questionName: "Feeling afraid as if something awful might happen",
        questionType: "single_choice",
        options: {
          options: [
            { text: "Not at all", score: 0 },
            { text: "Several days", score: 1 },
            { text: "More than half the days", score: 2 },
            { text: "Nearly every day", score: 3 },
          ],
        },
      },
    ],
  },
];
