(function () {
  const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

  const LEVEL_META = {
    A1: {
      title: "Beginner",
      descriptor: "Foundation skills for everyday communication",
      objective: "Build confidence with greetings, simple sentences, and daily routines.",
      accent: "#8b5cf6"
    },
    A2: {
      title: "Elementary",
      descriptor: "Everyday fluency and practical vocabulary",
      objective: "Use English for travel, routines, and clear personal expression.",
      accent: "#06b6d4"
    },
    B1: {
      title: "Intermediate",
      descriptor: "Extended communication and structured ideas",
      objective: "Describe experiences, explain opinions, and handle common situations.",
      accent: "#22d3ee"
    },
    B2: {
      title: "Upper Intermediate",
      descriptor: "Advanced fluency with nuance and detail",
      objective: "Discuss complex topics and express clearer, more natural viewpoints.",
      accent: "#34d399"
    },
    C1: {
      title: "Advanced",
      descriptor: "Precision, flexibility, and complex reasoning",
      objective: "Communicate with sophistication across academic and professional contexts.",
      accent: "#fbbf24"
    },
    C2: {
      title: "Proficiency",
      descriptor: "Mastery-level command of English",
      objective: "Use English with nuance, rhetorical control, and native-like flexibility.",
      accent: "#fb7185"
    }
  };

  const grammarBlueprints = {
    A1: ["Present Simple", "There Is / There Are", "Question Words", "Can / Can't", "Adverbs of Frequency"],
    A2: ["Past Simple", "Comparatives", "Prepositions of Time", "Object Pronouns", "Will / Going To"],
    B1: ["Present Perfect", "First Conditional", "Relative Clauses", "Modals of Obligation", "Passive Voice"],
    B2: ["Second Conditional", "Reported Speech", "Cleft Sentences", "Inversion", "Narrative Tenses"],
    C1: ["Discourse Markers", "Hypothetical Structures", "Causative Form", "Reduced Clauses", "Nominalization"],
    C2: ["Subjunctive Mood", "Register Shifting", "Ellipsis", "Rhetorical Parallelism", "Advanced Cohesion"]
  };

  const lessonThemes = {
    A1: ["Greetings", "Family", "Food", "Travel", "School", "Work", "Weather", "Shopping", "Daily Routine", "City Life"],
    A2: ["Hobbies", "Health", "Transport", "Household", "Technology", "Leisure", "Plans", "Communication", "Environment", "Culture"],
    B1: ["Career", "Education", "Social Issues", "Environment", "Media", "Personal Growth", "Remote Work", "Travel Stories", "Work-Life Balance", "Innovation"],
    B2: ["Leadership", "Global Trends", "Public Policy", "Media Bias", "Economics", "Business Strategy", "Psychology", "Contemporary Issues", "Marketing", "Social Change"],
    C1: ["Academic Writing", "Research Methods", "Complex Debate", "Professional Communication", "Policy Analysis", "Critical Thinking", "Cultural Critique", "Discourse Strategy", "Negotiation", "Argumentation"],
    C2: ["Elite Analysis", "Advanced Rhetoric", "Cross-Cultural Fluency", "Predictive Language", "Academic Precision", "High-Stakes Negotiation", "Synthesis", "Professional Eloquence", "Editorial Craft", "Mastery Practice"]
  };

  const vocabClusters = {
    A1: ["Daily objects", "Travel essentials", "Family terms", "Common verbs", "Colors", "Weather words", "Food vocabulary", "School items", "Body parts", "Places"],
    A2: ["Work phrases", "Household terms", "Hobbies", "Health language", "Transport words", "Free time", "Social expressions", "Shopping items", "Technology", "Emotions"],
    B1: ["Career vocabulary", "Academic language", "Problem-solving", "Negotiation", "Lifestyle words", "Business phrases", "Environment", "Citizen vocabulary", "Digital skills", "Community"],
    B2: ["Policy language", "Abstract concepts", "Leadership terms", "Market vocabulary", "Media terms", "Ethics", "Urban life", "Sustainability", "Innovation", "Debate language"],
    C1: ["Analytical terms", "Research vocabulary", "Professional discourse", "Complex reasoning", "Cultural critique", "Strategy language", "Formal expression", "Academic precision", "Evaluation", "Negotiation tactics"],
    C2: ["Mastery expressions", "Rhetorical devices", "Elite discourse", "Sophisticated nuance", "Editorial and speech language", "Advanced argumentation", "Cultural intelligence", "High-level idiom", "Signal words", "Precision vocabulary"]
  };

  const questionPool = [
    "Choose the best answer.",
    "Which option is most appropriate?",
    "Identify the correct structure.",
    "Select the best completion.",
    "Use the correct form to complete the sentence.",
    "Choose the sentence with the best meaning.",
    "Which answer is grammatically correct?"
  ];

  function slugify(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function padIndex(value) {
    return String(value).padStart(3, "0");
  }

  function createLesson(level, index) {
    const theme = lessonThemes[level][(index - 1) % lessonThemes[level].length];
    const focus = grammarBlueprints[level][(index - 1) % grammarBlueprints[level].length];
    return {
      id: `${level}-lesson-${index}`,
      level,
      title: `${theme} • Lesson ${padIndex(index)}`,
      topic: theme,
      focus,
      duration: 8 + ((index * 7) % 12),
      difficulty: ["Easy", "Core", "Challenge", "Stretch"][(index - 1) % 4],
      objective: `Practice ${theme.toLowerCase()} in real-life speaking and writing tasks.`,
      description: `This lesson develops confidence in ${theme.toLowerCase()} through guided examples, interactive tasks, and short speaking exercises.`,
      lessonNumber: index,
      keywords: [theme, focus, level],
      progress: ((index * 17) % 100)
    };
  }

  function createGrammar(level, index) {
    const grammarFocus = grammarBlueprints[level][(index - 1) % grammarBlueprints[level].length];
    const rule = lessonThemes[level][(index - 1) % lessonThemes[level].length];

    return {
      id: `${level}-grammar-${index}`,
      level,
      title: `${grammarFocus} • ${padIndex(index)}`,
      rule: grammarFocus,
      topic: rule,
      explanation: `Understand the structure and meaning of ${grammarFocus.toLowerCase()} and apply it when discussing ${rule.toLowerCase()} in context.`,
      examples: [
        `I use ${grammarFocus.toLowerCase()} when I want to explain a clear and practical idea.`,
        `This pattern helps me speak more naturally during conversations and writing tasks.`,
        `The skill becomes more effective when I combine it with accurate vocabulary and sentence rhythm.`
      ],
      difficulty: ["Foundational", "Applied", "Advanced", "Mastery"][(index - 1) % 4],
      lessonNumber: index
    };
  }

  function createVocabulary(level, index) {
    const cluster = vocabClusters[level][(index - 1) % vocabClusters[level].length];
    const word = `${cluster.split(" ")[0]} ${index % 10 + 1}`;
    const meaning = `Vocabulary block ${index} focused on ${cluster.toLowerCase()}.`;

    return {
      id: `${level}-vocab-${index}`,
      level,
      title: `${cluster} • ${padIndex(index)}`,
      cluster,
      term: `${word}`,
      meaning,
      example: `I can use this vocabulary naturally when talking about ${cluster.toLowerCase()} and everyday experiences.`,
      difficulty: ["Core", "Essential", "Extended", "Precision"][(index - 1) % 4],
      lessonNumber: index
    };
  }

  function createQuiz(level, index) {
    const questionText = questionPool[(index - 1) % questionPool.length];
    const grammarFocus = grammarBlueprints[level][(index - 1) % grammarBlueprints[level].length];
    const theme = lessonThemes[level][(index - 1) % lessonThemes[level].length];

    const answerIndex = (index + 2) % 4;
    const choices = [
      `Correct option for ${grammarFocus.toLowerCase().slice(0, 12)} in ${theme.toLowerCase()}.`,
      `Alternate response that is plausible but less precise.`,
      `A near-miss choice with a common grammatical issue.`,
      `A distractor designed for testing accuracy and nuance.`
    ];

    const question = {
      id: `${level}-quiz-${index}`,
      title: `${theme} quiz ${padIndex(index)}`,
      difficulty: ["Easy", "Average", "Medium", "Challenge"][(index - 1) % 4],
      prompt: `${questionText} Evaluate the correct sentence related to ${grammarFocus.toLowerCase()}.`,
      context: `Context: ${theme} in a ${LEVEL_META[level].title.toLowerCase()} learning scenario.`,
      choices: choices.map((choice, choiceIndex) => ({
        id: `q${index}-choice-${choiceIndex}`,
        text: choice,
        isCorrect: choiceIndex === answerIndex
      })),
      correctIndex: answerIndex,
      level
    };

    return question;
  }

  function buildLevelData(level) {
    const lessons = Array.from({ length: 1000 }, (_, index) => createLesson(level, index + 1));
    const grammar = Array.from({ length: 1000 }, (_, index) => createGrammar(level, index + 1));
    const vocabulary = Array.from({ length: 1000 }, (_, index) => createVocabulary(level, index + 1));
    const quizzes = Array.from({ length: 1000 }, (_, index) => createQuiz(level, index + 1));

    return {
      code: level,
      meta: LEVEL_META[level],
      lessons,
      grammar,
      vocabulary,
      quizzes
    };
  }

  const curriculum = {
    levels: Object.fromEntries(LEVELS.map((level) => [level, buildLevelData(level)])),
    levelOrder: LEVELS,
    totalLessons: LEVELS.reduce((sum, level) => sum + 1000, 0),
    totalGrammar: LEVELS.reduce((sum, level) => sum + 1000, 0),
    totalVocabulary: LEVELS.reduce((sum, level) => sum + 1000, 0),
    totalQuizzes: LEVELS.reduce((sum, level) => sum + 1000, 0)
  };

  window.curriculum = curriculum;
})();
