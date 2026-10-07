export interface Exercise {
  id: string;
  name: string;
  muscleGroups: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructions: string[];
  equipment: string[];
  category: string;
  categories: string[];
  commonMistakes: string[];
  safetyTips: string[];
  alternativeExercises: string[];
  progressionVariations: string[];
  isPremium: boolean;
  isCustom?: boolean;
  youtubeVideoId?: string;
  
  // Real Biomechanical coaching fields
  startingPosition: string;
  movementExecution: string;
  finishingPosition: string;
  regressionVariations: string[];
  musclesWorked: string[];
  gifUrl: string; // HD professional fitness loop / video url
  customMediaType?: "image" | "video";
  customMediaUrl?: string;
  description?: string;
  imageUrl?: string;
  duration?: string;
  tags?: string[];

  // Detailed Coaching Parameters
  breathingInstructions?: string;
  recommendedSetsReps?: string;
  benefits?: string[];
  trainingRecommendations?: string;

  // Curated Refactoring Fields
  bodyPart?: string;
  recommendedSets?: string;
  recommendedReps?: string;
  restTime?: string;
  caloriesBurned?: number;
  trainerTips?: string;
  safetyNotes?: string;
  variations?: string[];

  // ALEXFITNESSHUB Intelligent Program Categorization & Classification
  secondaryMuscles?: string[];
  exerciseType?: string;
  genderSuitability?: "Unisex" | "Women" | "Men";
  locationSuitability?: "Gym" | "Home" | "Both";
  goals?: string[];
  programAssignments?: string[];
  womenCategories?: string[];
  homeCategories?: string[];
  durationMinutes?: number;
}

export function getExerciseGifUrl(name: string = "", category: string = "", usedGifs?: Set<string>): string {
  return "";
}

export interface Program {
  id: string;
  name: string;
  category: "Home Workout Programs" | "Men's Programs" | "Women's Programs" | "Calisthenics Programs" | "Training Styles";
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  searchTags: string[];
  imageUrl: string;
  isPremium: boolean;
  schedule: {
    day: string;
    focus: string;
    exercises: string[]; // exercise names or IDs
    mealPlan?: string;  // Shred, Bulk, or Lean meal plans
  }[];
}

export const BACKUP_EXERCISE_MEDIA = {
  chest: "",
  back: "",
  shoulders: "",
  arms: "",
  core: "",
  legs: "",
  neck: "",
  cardio: "",
  mobility: ""
};

export const REAL_EXERCISE_MEDIA = {
  chest: "",
  back: "",
  shoulders: "",
  arms: "",
  core: "",
  legs: "",
  neck: "",
  cardio: "",
  mobility: ""
};

export function determineCategories(
  name: string,
  primary: string = "",
  secondary: string[] = [],
  equipment: string[] = [],
  difficulty: string = "Intermediate",
  originalCategories: string[] = []
): string[] {
  const cats: string[] = [];
  const nameL = (name || "").toLowerCase();
  const primaryL = (primary || "").toLowerCase();
  const secondaryL = (secondary || []).map(s => s.toLowerCase());
  const allMuscles = [primaryL, ...secondaryL];

  // Chest
  if (
    allMuscles.some(m => m.includes("chest") || m.includes("pectoral")) ||
    nameL.includes("bench press") ||
    nameL.includes("chest press") ||
    nameL.includes("pushup") ||
    nameL.includes("push up") ||
    nameL.includes("pec deck") ||
    nameL.includes("crossover") ||
    (nameL.includes("fly") && !nameL.includes("rear delt")) ||
    (nameL.includes("dip") && (nameL.includes("chest") || nameL === "dips"))
  ) {
    cats.push("Chest");
  }

  // Back & Lats
  if (
    allMuscles.some(m => m.includes("back") || m.includes("lat") || m.includes("traps") || m.includes("rhomboid")) ||
    (nameL.includes("row") && !nameL.includes("upright row") && !nameL.includes("rowing machine")) ||
    nameL.includes("pullup") ||
    nameL.includes("pull-up") ||
    nameL.includes("pull up") ||
    nameL.includes("pulldown") ||
    nameL.includes("deadlift") ||
    nameL.includes("latissimus")
  ) {
    cats.push("Back");
  }

  // Shoulders / Deltoids
  if (
    allMuscles.some(m => m.includes("shoulder") || m.includes("delt") || m.includes("trapezius")) ||
    nameL.includes("overhead press") ||
    nameL.includes("shoulder press") ||
    nameL.includes("military press") ||
    nameL.includes("arnold press") ||
    nameL.includes("lateral raise") ||
    nameL.includes("front raise") ||
    nameL.includes("rear delt") ||
    nameL.includes("face pull") ||
    nameL.includes("shrug")
  ) {
    cats.push("Shoulders");
  }

  // Biceps
  if (
    allMuscles.some(m => m.includes("bicep")) ||
    (nameL.includes("curl") && !nameL.includes("leg curl") && !nameL.includes("hamstring") && !nameL.includes("wrist"))
  ) {
    cats.push("Biceps");
  }

  // Triceps
  if (
    allMuscles.some(m => m.includes("tricep")) ||
    nameL.includes("pushdown") ||
    nameL.includes("skull crusher") ||
    nameL.includes("kickback") ||
    (nameL.includes("dip") && !nameL.includes("hip dip")) ||
    nameL.includes("close grip bench")
  ) {
    cats.push("Triceps");
  }

  // Legs, Quads, Hamstrings, Glutes, Calves
  if (
    allMuscles.some(m => m.includes("leg") || m.includes("quad") || m.includes("hamstring") || m.includes("glute") || m.includes("calf") || m.includes("calves")) ||
    nameL.includes("squat") ||
    nameL.includes("lunge") ||
    nameL.includes("leg press") ||
    nameL.includes("leg curl") ||
    nameL.includes("leg extension") ||
    nameL.includes("hip thrust") ||
    nameL.includes("glute bridge") ||
    nameL.includes("calf raise")
  ) {
    cats.push("Legs");
  }

  // Core & Abs
  if (
    allMuscles.some(m => m.includes("core") || m.includes("abs") || m.includes("oblique")) ||
    nameL.includes("plank") ||
    nameL.includes("crunch") ||
    nameL.includes("sit up") ||
    nameL.includes("situp") ||
    nameL.includes("leg raise") ||
    nameL.includes("russian twist") ||
    nameL.includes("dead bug")
  ) {
    cats.push("Core");
    cats.push("Abs");
  }

  // Cardio
  if (
    allMuscles.some(m => m.includes("cardio")) ||
    nameL.includes("run") ||
    nameL.includes("sprint") ||
    nameL.includes("walk") ||
    nameL.includes("jump rope") ||
    nameL.includes("hiit") ||
    nameL.includes("burpee") ||
    nameL.includes("jumping jack") ||
    nameL.includes("mountain climber")
  ) {
    cats.push("Cardio");
  }

  // Mobility
  if (
    allMuscles.some(m => m.includes("mobility") || m.includes("stretch")) ||
    nameL.includes("stretch") ||
    nameL.includes("mobility") ||
    nameL.includes("warmup") ||
    nameL.includes("warm up") ||
    nameL.includes("cooldown") ||
    nameL.includes("recovery")
  ) {
    cats.push("Mobility");
  }

  // Include difficulty
  if (difficulty) cats.push(difficulty);

  // Maintain original categories if present
  originalCategories.forEach(c => {
    if (c && !cats.includes(c)) cats.push(c);
  });

  return Array.from(new Set(cats));
}

// Pristine clean default: No legacy hardcoded exercises.
// All exercises are added by the Admin and dynamically persisted.
export const EXERCISES: Exercise[] = [];

export const PROGRAMS: Program[] = [
  {
    id: "beginner-muscle-building",
    name: "Beginner Muscle Building",
    category: "Men's Programs",
    description: "Construct a rock-solid foundation of muscular hypertrophy with controlled lifts. Perfect starting point for physical adaptation.",
    duration: "8 Weeks",
    difficulty: "Beginner",
    searchTags: ["beginner", "hypertrophy", "muscle building"],
    imageUrl: "",
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Horizontal Upper Push & Pull", exercises: [] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Zone 2 Kinetic Walking & Aerobic Flush", exercises: [] },
      { day: "Day 3", focus: "Glute & Lower Quad Stability", exercises: [] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Low-Impact Cardio Conditioning", exercises: [] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Outdoor Walking", exercises: [] }
    ]
  },
  {
    id: "advanced-hypertrophy",
    name: "Advanced Hypertrophy Mastery",
    category: "Training Styles",
    description: "Target peak muscular fiber failure through systematic progressive overload and dedicated volume.",
    duration: "12 Weeks",
    difficulty: "Advanced",
    searchTags: ["advanced", "hypertrophy", "bodybuilding"],
    imageUrl: "",
    isPremium: true,
    schedule: [
      { day: "Day 1", focus: "Chest & Triceps Overload", exercises: [] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Low-Impact Cardio & Incline Walk", exercises: [] },
      { day: "Day 3", focus: "Back & Biceps Thickness", exercises: [] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Zone 2 Kinetic Walking & Mobility Flush", exercises: [] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Walking & Metabolic Recovery", exercises: [] }
    ]
  },
  {
    id: "fat-loss",
    name: "Fat Loss Accelerator",
    category: "Home Workout Programs",
    description: "Melt fat fast using calorie-blasting compound bodyweight movements, metabolic intervals, and conditioning tracks.",
    duration: "6 Weeks",
    difficulty: "Beginner",
    searchTags: ["fat loss", "cardio", "shred"],
    imageUrl: "",
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Metabolic HIIT Blast", exercises: [] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Incline Walking & Aerobic Base", exercises: [] },
      { day: "Day 3", focus: "Low-Intensity Fat Burn", exercises: [] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Low-Impact Steady Cardio & Steps", exercises: [] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Outdoor Walking & Hip Decompression", exercises: [] }
    ]
  },
  {
    id: "strength",
    name: "Max Power Strength",
    category: "Training Styles",
    description: "Build raw neural strength on compound lifts using systematic powerlifting principles.",
    duration: "10 Weeks",
    difficulty: "Advanced",
    searchTags: ["strength", "power", "heavy"],
    imageUrl: "",
    isPremium: true,
    schedule: [
      { day: "Day 1", focus: "Posterior Chain Power", exercises: [] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Incline Walk & Parasympathetic Reset", exercises: [] },
      { day: "Day 3", focus: "Anterior Squat Drive", exercises: [] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Zone 2 Walking & Joint Flushing", exercises: [] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Walking & Hip Mobility", exercises: [] }
    ]
  },
  {
    id: "womens-fitness",
    name: "Women's Toning & Glute Lift",
    category: "Women's Programs",
    description: "Sculpt, tone, and build athletic curves with glute lifts, core stabilization, and full body conditioning.",
    duration: "6 Weeks",
    difficulty: "Beginner",
    searchTags: ["women", "toning", "glute lift"],
    imageUrl: "",
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Glute & Hamstring Lift", exercises: [] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Incline Treadmill Walk & Glute Flow", exercises: [] },
      { day: "Day 3", focus: "Core & Leg Definition", exercises: [] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Low-Impact Cardio & Core Reset", exercises: [] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Outdoor Walk & Hip Mobility", exercises: [] }
    ]
  },
  {
    id: "home-workouts",
    name: "Total Home Workouts",
    category: "Home Workout Programs",
    description: "Build muscle, burn fat, and stay active directly from your home with minimal or zero equipment.",
    duration: "4 Weeks",
    difficulty: "Beginner",
    searchTags: ["home", "no equipment", "dumbbells"],
    imageUrl: "",
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Full Body Fat Burn", exercises: [] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Living Room Kinetic Walking & Mobility", exercises: [] },
      { day: "Day 3", focus: "Living Room Cardio", exercises: [] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Zone 2 Step Walking & Low-Impact Flow", exercises: [] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Walking & Full Body Flush", exercises: [] }
    ]
  }
];

export const MUSCLE_GROUPS = [
  "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Forearms", "Legs", "Quadriceps", "Hamstrings", "Glutes", "Calves", "Core", "Abs", "Obliques", "Cardio", "Full Body", "Mobility"
];

export const WORKOUT_CATEGORIES = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Forearms",
  "Legs",
  "Glutes",
  "Core & Abs",
  "Cardio",
  "HIIT & Fat Burning",
  "Gym Workouts",
  "Home Workouts",
  "Calisthenics Workouts",
  "Military Style Fitness",
  "Women Confidence Program",
  "Mobility & Recovery",
  "Full Body"
];
