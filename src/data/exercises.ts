export interface Exercise {
  id: string;
  name: string;
  muscleGroups: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructions: string[];
  equipment: string[];
  category: string;
  categories: string[];
  commonMistakes?: string[];
  safetyTips?: string[];
  alternativeExercises?: string[];
  progressionVariations?: string[];
  isPremium: boolean;
  isCustom?: boolean;
  youtubeVideoId?: string;
  
  // Real Biomechanical coaching fields
  startingPosition?: string;
  movementExecution?: string;
  finishingPosition?: string;
  regressionVariations?: string[];
  musclesWorked?: string[];
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

import { CANONICAL_EXERCISES } from "./canonicalExercises";
import { resolveAuthenticExercise } from "./authoritativeExerciseMap";

export function getExerciseGifUrl(name: string = "", category: string = "", usedGifs?: Set<string>): string {
  if (!name && !category) return "";
  const auth = resolveAuthenticExercise(name, "", category);
  if (auth?.gifUrl) return auth.gifUrl;

  const clean = name.toLowerCase().trim();
  const cat = category.toLowerCase().trim();

  // 1. Direct exact or substring match in CANONICAL_EXERCISES
  const direct = CANONICAL_EXERCISES.find(e => {
    const eName = e.name.toLowerCase().trim();
    return eName === clean || clean.includes(eName) || eName.includes(clean);
  });
  if (direct?.gifUrl) return direct.gifUrl;

  // 2. Category matching in CANONICAL_EXERCISES
  if (cat) {
    const catMatch = CANONICAL_EXERCISES.find(e => {
      const eCat = e.category.toLowerCase();
      return eCat.includes(cat) || cat.includes(eCat);
    });
    if (catMatch?.gifUrl) return catMatch.gifUrl;
  }

  // 3. Muscle group matching
  const muscleMatch = CANONICAL_EXERCISES.find(e => 
    (e.muscleGroups || []).some(m => clean.includes(m.toLowerCase()) || (cat && cat.includes(m.toLowerCase())))
  );
  if (muscleMatch?.gifUrl) return muscleMatch.gifUrl;

  return CANONICAL_EXERCISES[0]?.gifUrl || "";
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

// Authentic Canonical Baseline Exercise Pool:
// Admin modifications and additions in fit_exercises take precedence.
export const EXERCISES: Exercise[] = CANONICAL_EXERCISES;

export const PROGRAMS: Program[] = [
  {
    id: "immortal_90",
    name: "90 Immortal Challenge",
    category: "Men's Programs",
    description: "Designed specifically for men. Strict 7-day cyclical split repeating continuously across all 90 days with heavy compound lifts, sarcoplasmic volume, and dedicated cardio.",
    duration: "90 Days",
    difficulty: "Advanced",
    searchTags: ["immortal", "hypertrophy", "muscle building", "chest", "back", "legs"],
    imageUrl: "https://learn.athleanx.com/wp-content/uploads/2021/10/BACK-MAIN-IMAGE.png",
    isPremium: true,
    schedule: [
      { day: "Day 1", focus: "Monday: Push (Chest, shoulders and triceps)", exercises: ["Barbell Flat Bench Press", "Incline Dumbbell Bench Press", "Incline Barbell Bench Press", "Dumbbell Overhead Shoulder Press", "Standing Dumbbell Lateral Raises"] },
      { day: "Day 2", focus: "Tuesday: Pull (Back, rear delts and biceps)", exercises: ["Barbell Bent-Over Row", "Lat Pulldown (Wide Grip)", "Seated Cable Row", "Bodyweight Pull-Ups", "Standing Dumbbell Biceps Curls", "Incline Dumbbell Hammer Curls"] },
      { day: "Day 3", focus: "Wednesday: Legs + Core (Quads, hamstrings, glutes, calves and abs)", exercises: ["Barbell Back Squat", "Romanian Deadlift (RDL)", "Dumbbell Walking Lunges", "45-Degree Leg Press Machine", "Standing Calf Raises", "Isometric Forearm Plank", "Hanging Knee / Leg Raises"] },
      { day: "Day 4", focus: "Thursday: Cardio + Mobility (Running, conditioning and mobility)", exercises: ["5 to 10 KM Aerobic Running or Walking", "Downward Dog to Cobra Flow", "Cat-Cow Dynamic Spine Flow", "World's Greatest Thoracic Stretch", "Child's Pose Deep Breathing Reset"] },
      { day: "Day 5", focus: "Friday: Upper Body (Chest, back, shoulders and arms)", exercises: ["Incline Dumbbell Bench Press", "Barbell Bent-Over Row", "Barbell Flat Bench Press", "Lat Pulldown (Wide Grip)", "Standing Dumbbell Lateral Raises", "Standing Dumbbell Biceps Curls", "Triceps Cable Rope Pushdown"] },
      { day: "Day 6", focus: "Saturday: Athletic Conditioning + Core (Functional movements, conditioning and abdominal work)", exercises: ["Full Body Conditioning Burpees", "High-Tempo Mountain Climbers", "Seated Russian Twists", "Bicycle Crunches", "Isometric Forearm Plank", "Bodyweight Deep Air Squats"] },
      { day: "Day 7", focus: "Sunday: Recovery (Recovery & System Reset)", exercises: ["Child's Pose Deep Breathing Reset", "Cat-Cow Dynamic Spine Flow", "Supine Figure-4 Glute Stretch", "Standing Quadriceps & Hip Stretch", "Downward Dog to Cobra Flow"] }
    ]
  },
  {
    id: "women_confidence",
    name: "180 Women Confidence Challenge",
    category: "Women's Programs",
    description: "Designed for women. Continuous 7-day split repeating across 180 days: glute shaping, posture correction, waist sculpting, and toned athletic curves.",
    duration: "180 Days",
    difficulty: "Intermediate",
    searchTags: ["women", "glutes", "confidence", "toning", "curves", "sculpt"],
    imageUrl: "https://i.pinimg.com/236x/d0/39/8d/d0398d92f60f14a045675fbc5f2c16ac.jpg",
    isPremium: true,
    schedule: [
      { day: "Day 1", focus: "Monday: Glutes + Hamstrings", exercises: ["Supine Kinetic Glute Bridges", "Bodyweight Dynamic Walking Lunges", "Bodyweight Deep Air Squats", "Bodyweight Bulgarian Split Squats", "Supine Figure-4 Glute Stretch"] },
      { day: "Day 2", focus: "Tuesday: Upper Body + Core", exercises: ["Incline Calisthenic Push-Ups", "Chair / Bench Triceps Dips", "Isometric Forearm Plank", "Bicycle Crunches", "Cat-Cow Dynamic Spine Flow"] },
      { day: "Day 3", focus: "Wednesday: Quads + Glutes", exercises: ["Bodyweight Deep Air Squats", "Isometric Quad Wall Sit", "Supine Kinetic Glute Bridges", "Standing Bodyweight Calf Raises", "Standing Quadriceps & Hip Stretch"] },
      { day: "Day 4", focus: "Thursday: Cardio + Core + Mobility", exercises: ["5 to 10 KM Aerobic Running or Walking", "High-Tempo Mountain Climbers", "Isometric Forearm Plank", "Child's Pose Deep Breathing Reset"] },
      { day: "Day 5", focus: "Friday: Glutes + Full Lower Body", exercises: ["Supine Kinetic Glute Bridges", "Bodyweight Dynamic Walking Lunges", "Bodyweight Deep Air Squats", "Bodyweight Bulgarian Split Squats", "Supine Figure-4 Glute Stretch"] },
      { day: "Day 6", focus: "Saturday: Full Body Conditioning", exercises: ["Full Body Conditioning Burpees", "High-Tempo Mountain Climbers", "Bicycle Crunches", "Isometric Forearm Plank"] },
      { day: "Day 7", focus: "Sunday: Recovery & Restorative Stretches", exercises: ["Child's Pose Deep Breathing Reset", "Cat-Cow Dynamic Spine Flow", "Supine Figure-4 Glute Stretch", "Standing Quadriceps & Hip Stretch"] }
    ]
  },
  {
    id: "belly_fat_shred",
    name: "5-Month Belly Fat Shred System",
    category: "Home Workout Programs",
    description: "Continuous 7-day repeating split designed to incinerate visceral belly fat, tone the core, and elevate metabolic conditioning across 140 days.",
    duration: "140 Days",
    difficulty: "Beginner",
    searchTags: ["belly fat", "shred", "core", "abs", "fat loss", "cardio"],
    imageUrl: "https://i.ytimg.com/vi/T2de9yQv-yc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDXYdVILMIN7nnFzJLRsAXDN7vQXQ",
    isPremium: true,
    schedule: [
      { day: "Day 1", focus: "Monday: Full Body + Core", exercises: ["Isometric Forearm Plank", "Bicycle Crunches", "Bodyweight Deep Air Squats", "Strict Calisthenic Push-Ups", "High-Tempo Mountain Climbers"] },
      { day: "Day 2", focus: "Tuesday: Cardio + Abs", exercises: ["5 to 10 KM Aerobic Running or Walking", "Seated Russian Twists", "Bicycle Crunches", "Isometric Forearm Plank"] },
      { day: "Day 3", focus: "Wednesday: Full Body Strength", exercises: ["Bodyweight Deep Air Squats", "Strict Calisthenic Push-Ups", "Chair / Bench Triceps Dips", "Bodyweight Dynamic Walking Lunges", "Isometric Forearm Plank"] },
      { day: "Day 4", focus: "Thursday: Cardio + Core", exercises: ["High-Tempo Mountain Climbers", "Seated Russian Twists", "Bicycle Crunches", "Isometric Forearm Plank", "5 to 10 KM Aerobic Running or Walking"] },
      { day: "Day 5", focus: "Friday: Full Body Conditioning", exercises: ["Full Body Conditioning Burpees", "High-Tempo Mountain Climbers", "Bodyweight Deep Air Squats", "Strict Calisthenic Push-Ups"] },
      { day: "Day 6", focus: "Saturday: Walking + Mobility (5-10 KM Brisk Walk)", exercises: ["5 to 10 KM Aerobic Running or Walking", "Downward Dog to Cobra Flow", "Cat-Cow Dynamic Spine Flow", "Standing Quadriceps & Hip Stretch"] },
      { day: "Day 7", focus: "Sunday: Recovery & Parasympathetic Reset", exercises: ["Child's Pose Deep Breathing Reset", "Cat-Cow Dynamic Spine Flow", "Supine Figure-4 Glute Stretch", "Downward Dog to Cobra Flow"] }
    ]
  },
  {
    id: "home_180",
    name: "180 Days Home Workout",
    category: "Home Workout Programs",
    description: "Zero and minimal equipment calisthenics, core armor, and functional conditioning repeating continuously across 180 days with dedicated tracks for Men and Women.",
    duration: "180 Days",
    difficulty: "Beginner",
    searchTags: ["home", "bodyweight", "calisthenics", "180 days", "no equipment"],
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-89uZaleE8506y-CMEmQT9-GMnzZVZidcyy7NO1UhF6z5d3I9NJaXf-Q&s=10",
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Monday: Upper Body Push & Calisthenics", exercises: ["Strict Calisthenic Push-Ups", "Incline Calisthenic Push-Ups", "Decline Upper Chest Push-Ups", "Close-Grip Diamond Push-Ups", "Chair / Bench Triceps Dips"] },
      { day: "Day 2", focus: "Tuesday: Core & Abs Shred", exercises: ["Isometric Forearm Plank", "Bicycle Crunches", "Seated Russian Twists", "High-Tempo Mountain Climbers"] },
      { day: "Day 3", focus: "Wednesday: Lower Body & Legs", exercises: ["Bodyweight Deep Air Squats", "Bodyweight Dynamic Walking Lunges", "Isometric Quad Wall Sit", "Standing Bodyweight Calf Raises", "Supine Kinetic Glute Bridges"] },
      { day: "Day 4", focus: "Thursday: Cardio + Mobility (5-10 KM Run/Walk)", exercises: ["5 to 10 KM Aerobic Running or Walking", "Downward Dog to Cobra Flow", "Cat-Cow Dynamic Spine Flow", "Standing Quadriceps & Hip Stretch"] },
      { day: "Day 5", focus: "Friday: Upper Body Pull & Back", exercises: ["Bodyweight Pull-Ups", "Incline Calisthenic Push-Ups", "Cat-Cow Dynamic Spine Flow", "Downward Dog to Cobra Flow"] },
      { day: "Day 6", focus: "Saturday: Athletic Full Body Conditioning", exercises: ["Full Body Conditioning Burpees", "High-Tempo Mountain Climbers", "Bodyweight Deep Air Squats", "Isometric Forearm Plank"] },
      { day: "Day 7", focus: "Sunday: Recovery & Joint Mobility", exercises: ["Child's Pose Deep Breathing Reset", "Cat-Cow Dynamic Spine Flow", "Supine Figure-4 Glute Stretch", "Standing Quadriceps & Hip Stretch"] }
    ]
  },
  {
    id: "posture_vitality",
    name: "Posture Correction Challenge",
    category: "Training Styles",
    description: "Continuous 7-day cyclical split reversing slouching, forward neck tilt, and lower back tightness with clinical mobility and spinal stabilization.",
    duration: "60 Days",
    difficulty: "Beginner",
    searchTags: ["posture", "mobility", "spine", "vitality", "alignment"],
    imageUrl: "https://fitnessprogramer.com/wp-content/uploads/2023/02/warm-up-exercises.png",
    isPremium: true,
    schedule: [
      { day: "Day 1", focus: "Monday: Upper Back + Shoulder Mobility", exercises: ["Cat-Cow Dynamic Spine Flow", "World's Greatest Thoracic Stretch", "Downward Dog to Cobra Flow", "Child's Pose Deep Breathing Reset"] },
      { day: "Day 2", focus: "Tuesday: Core Stability + Hip Mobility", exercises: ["Isometric Forearm Plank", "Supine Figure-4 Glute Stretch", "Standing Quadriceps & Hip Stretch", "Cat-Cow Dynamic Spine Flow"] },
      { day: "Day 3", focus: "Wednesday: Full Body Posture Training", exercises: ["Cat-Cow Dynamic Spine Flow", "Downward Dog to Cobra Flow", "World's Greatest Thoracic Stretch", "Isometric Forearm Plank"] },
      { day: "Day 4", focus: "Thursday: Recovery Mobility", exercises: ["Child's Pose Deep Breathing Reset", "Standing Quadriceps & Hip Stretch", "Supine Figure-4 Glute Stretch"] },
      { day: "Day 5", focus: "Friday: Upper Back + Core", exercises: ["Cat-Cow Dynamic Spine Flow", "Isometric Forearm Plank", "Downward Dog to Cobra Flow"] },
      { day: "Day 6", focus: "Saturday: Full Body Mobility + Stability", exercises: ["World's Greatest Thoracic Stretch", "Isometric Forearm Plank", "Supine Figure-4 Glute Stretch"] },
      { day: "Day 7", focus: "Sunday: Recovery & Decompression", exercises: ["Child's Pose Deep Breathing Reset", "Cat-Cow Dynamic Spine Flow"] }
    ]
  },
  {
    id: "lifestyle_academy",
    name: "Lifestyle Fitness Academy",
    category: "Training Styles",
    description: "Counteract prolonged sitting and desk work with clinical mobility, brisk walking, and functional strength designed for modern lifestyle athletes.",
    duration: "90 Days",
    difficulty: "Beginner",
    searchTags: ["lifestyle", "desk", "wellness", "longevity", "mobility"],
    imageUrl: "https://learn.athleanx.com/wp-content/uploads/2022/12/FULL-BODY-WORKOUTS.jpg",
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Monday: Posture Alignment & Posterior Chain", exercises: ["Cat-Cow Dynamic Spine Flow", "World's Greatest Thoracic Stretch", "Downward Dog to Cobra Flow", "Isometric Forearm Plank"] },
      { day: "Day 2", focus: "Tuesday: Hip Flexor Decompression & Reset", exercises: ["Supine Figure-4 Glute Stretch", "Standing Quadriceps & Hip Stretch", "Isometric Quad Wall Sit"] },
      { day: "Day 3", focus: "Wednesday: Aerobic Circulation & Brisk Walking", exercises: ["5 to 10 KM Aerobic Running or Walking", "Child's Pose Deep Breathing Reset", "Cat-Cow Dynamic Spine Flow"] },
      { day: "Day 4", focus: "Thursday: Chest Opening & Anterior Mobility", exercises: ["Downward Dog to Cobra Flow", "World's Greatest Thoracic Stretch", "Child's Pose Deep Breathing Reset"] },
      { day: "Day 5", focus: "Friday: Spinal Decompression & Core Stability", exercises: ["Isometric Forearm Plank", "Bicycle Crunches", "Cat-Cow Dynamic Spine Flow"] },
      { day: "Day 6", focus: "Saturday: Glute Activation & Kinetic Chain", exercises: ["Supine Kinetic Glute Bridges", "Bodyweight Deep Air Squats", "Bodyweight Dynamic Walking Lunges"] },
      { day: "Day 7", focus: "Sunday: Restorative Mobility & Rest", exercises: ["Child's Pose Deep Breathing Reset", "Cat-Cow Dynamic Spine Flow", "Supine Figure-4 Glute Stretch"] }
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
  "Stretching & Mobility",
  "Mobility & Recovery",
  "Full Body"
];

/**
 * Authentic Pre-Workout Dynamic Stretch & Mobility Workouts.
 * Every daily workout begins with 2 prescribed stretch workouts with full GIF demonstrations.
 * Fully editable and customizable by Admin.
 */
export const AUTHENTIC_STRETCH_EXERCISES: Exercise[] = [
  {
    id: "stretch-worlds-greatest",
    name: "World's Greatest Dynamic Stretch",
    category: "Stretching & Mobility",
    categories: ["Stretching & Mobility", "Mobility & Recovery", "Full Body"],
    muscleGroups: ["Hip Flexors", "Hamstrings", "Thoracic Spine", "Glutes"],
    difficulty: "Beginner",
    instructions: [
      "Step forward into a deep lunge with your back leg extended.",
      "Place both hands flat inside your front foot on the floor.",
      "Rotate your torso toward your front knee, reaching your top arm straight to the ceiling.",
      "Lower your hand, drive your hips up and back to briefly straighten both legs for a hamstring stretch.",
      "Switch sides and repeat with steady rhythmic breathing."
    ],
    equipment: ["Bodyweight"],
    commonMistakes: ["Rounding lower back", "Rushing the thoracic rotation"],
    safetyTips: ["Keep back knee cushioned if needed", "Move smoothly without bouncing"],
    alternativeExercises: ["Deep Kneeling Hip Flexor Stretch", "Downward Dog to Cobra Mobility Flow"],
    progressionVariations: ["Add deep elbow-to-instep drop"],
    regressionVariations: ["Kneeling lunge rotation"],
    startingPosition: "High plank or standing tall ready to lunge forward.",
    movementExecution: "Fluid dynamic rotation through hips, thoracic spine, and hamstrings.",
    finishingPosition: "Return to neutral athletic stance.",
    musclesWorked: ["Iliopsoas", "Hamstrings", "Thoracic Spine", "Gluteus Maximus"],
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/05/Worlds-Greatest-Stretch.gif",
    customMediaUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/05/Worlds-Greatest-Stretch.gif",
    duration: "60s Dynamic Flow",
    recommendedSets: "1",
    recommendedReps: "60s continuous",
    restTime: "15s transition",
    isPremium: false,
    isCustom: false,
    genderSuitability: "Unisex",
    locationSuitability: "Both"
  },
  {
    id: "stretch-cat-cow",
    name: "Cat-Cow Dynamic Spine & Core Stretch",
    category: "Stretching & Mobility",
    categories: ["Stretching & Mobility", "Core", "Mobility & Recovery"],
    muscleGroups: ["Spine", "Thoracic", "Core", "Lower Back"],
    difficulty: "Beginner",
    instructions: [
      "Start on all fours with wrists directly under shoulders and knees beneath hips.",
      "Inhale deeply: drop your belly toward the floor, tilt your pelvis up, and gently look up (Cow).",
      "Exhale slowly: tuck your chin, round your entire spine toward the ceiling, and scoop your abdominals (Cat).",
      "Flow continuously with your breath for 10-12 smooth cycles."
    ],
    equipment: ["Bodyweight", "Mat"],
    commonMistakes: ["Forcing excessive neck extension", "Bending elbows"],
    safetyTips: ["Avoid hyper-extending the lower back if sensitive"],
    alternativeExercises: ["Child's Pose with Lateral Lat Reach"],
    progressionVariations: ["Add lateral ribcage circles"],
    regressionVariations: ["Seated cat-cow on a chair"],
    startingPosition: "Quadruped tabletop position on mat.",
    movementExecution: "Vertebra-by-vertebra wave like articulation with rhythmic breathing.",
    finishingPosition: "Return to neutral spine tabletop.",
    musclesWorked: ["Spinal Erectors", "Rectus Abdominis", "Thoracolumbar Fascia"],
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/06/Cat-Cow-Stretch.gif",
    customMediaUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/06/Cat-Cow-Stretch.gif",
    duration: "60s Smooth Flow",
    recommendedSets: "1",
    recommendedReps: "10-12 cycles",
    restTime: "15s transition",
    isPremium: false,
    isCustom: false,
    genderSuitability: "Unisex",
    locationSuitability: "Both"
  },
  {
    id: "stretch-kneeling-hip-flexor",
    name: "Deep Kneeling Hip Flexor & Psoas Stretch",
    category: "Stretching & Mobility",
    categories: ["Stretching & Mobility", "Legs", "Mobility & Recovery"],
    muscleGroups: ["Hip Flexors", "Psoas", "Quadriceps", "Lower Back"],
    difficulty: "Beginner",
    instructions: [
      "Kneel on your left knee with your right foot flat on the floor in front, forming 90-degree angles.",
      "Gently tuck your pelvis under (posterior pelvic tilt) to lock the stretch into the hip flexor.",
      "Shift your hips forward slightly until you feel a deep stretch in the front of your left hip.",
      "Raise your left arm straight overhead and lean subtly to the right.",
      "Hold for 30-45 seconds, then switch legs."
    ],
    equipment: ["Bodyweight", "Mat"],
    commonMistakes: ["Arching lumbar spine instead of tucking pelvis", "Lurching too far forward"],
    safetyTips: ["Pad the kneeling knee with a mat or towel"],
    alternativeExercises: ["Standing Quadriceps Stretch", "World's Greatest Dynamic Stretch"],
    progressionVariations: ["Add gentle torso rotation toward front knee"],
    regressionVariations: ["Hold onto a stable wall or chair for balance"],
    startingPosition: "Half-kneeling 90/90 split stance.",
    movementExecution: "Squeeze trailing glute and posteriorly tilt pelvis with overhead reach.",
    finishingPosition: "Step back to kneeling and switch legs.",
    musclesWorked: ["Iliopsoas", "Rectus Femoris", "Tensor Fasciae Latae"],
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/05/Kneeling-Hip-Flexor-Stretch.gif",
    customMediaUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/05/Kneeling-Hip-Flexor-Stretch.gif",
    duration: "45s Each Leg",
    recommendedSets: "1",
    recommendedReps: "45s hold per side",
    restTime: "15s transition",
    isPremium: false,
    isCustom: false,
    genderSuitability: "Unisex",
    locationSuitability: "Both"
  },
  {
    id: "stretch-thread-needle",
    name: "Thoracic Thread the Needle Shoulder Opener",
    category: "Stretching & Mobility",
    categories: ["Stretching & Mobility", "Back", "Shoulders", "Mobility & Recovery"],
    muscleGroups: ["Thoracic Spine", "Upper Back", "Shoulders", "Rhomboids"],
    difficulty: "Beginner",
    instructions: [
      "Begin on hands and knees with your hands beneath shoulders.",
      "Slide your right arm under your chest and torso across the floor with palm facing up.",
      "Gently lower your right shoulder and temple to the floor, feeling the stretch across your upper back.",
      "Hold for 30-45 seconds while breathing deeply into your ribcage.",
      "Press back up and switch to the left arm."
    ],
    equipment: ["Bodyweight", "Mat"],
    commonMistakes: ["Twisting hips out of alignment", "Tensing neck muscles"],
    safetyTips: ["Rest cheek comfortably on mat or a folded towel"],
    alternativeExercises: ["Doorway Chest Stretch", "Standing Overhead Lat Stretch"],
    progressionVariations: ["Extend non-threading arm overhead along mat"],
    regressionVariations: ["Keep torso higher without lowering head all the way"],
    startingPosition: "Hands and knees tabletop on mat.",
    movementExecution: "Smooth rotational reach beneath torso with relaxed shoulder resting.",
    finishingPosition: "Press back to tabletop.",
    musclesWorked: ["Posterior Deltoid", "Rhomboids", "Middle Trapezius", "Thoracic Rotators"],
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/09/Thread-The-Needle.gif",
    customMediaUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/09/Thread-The-Needle.gif",
    duration: "45s Each Side",
    recommendedSets: "1",
    recommendedReps: "45s hold per side",
    restTime: "15s transition",
    isPremium: false,
    isCustom: false,
    genderSuitability: "Unisex",
    locationSuitability: "Both"
  },
  {
    id: "stretch-downward-dog-cobra",
    name: "Downward Dog to Cobra Dynamic Mobility Flow",
    category: "Stretching & Mobility",
    categories: ["Stretching & Mobility", "Full Body", "Mobility & Recovery"],
    muscleGroups: ["Calves", "Hamstrings", "Chest", "Spine", "Shoulders"],
    difficulty: "Beginner",
    instructions: [
      "From high plank, press your hands firmly into the floor and drive your hips up and back into Downward Dog.",
      "Pedal your heels toward the mat for 3 seconds to stretch calves and hamstrings.",
      "Roll forward smoothly through your spine into a plank, then lower hips toward floor into Cobra.",
      "Lift your chest, draw shoulder blades down and back, and lengthen your neck.",
      "Push back into Downward Dog and repeat for 6-8 continuous flows."
    ],
    equipment: ["Bodyweight", "Mat"],
    commonMistakes: ["Collapsing into lower back in Cobra", "Shrugging shoulders into ears"],
    safetyTips: ["Engage glutes lightly in Cobra to protect lumbar vertebrae"],
    alternativeExercises: ["Cat-Cow Dynamic Spine & Core Stretch"],
    progressionVariations: ["Full Upward Facing Dog with knees off mat"],
    regressionVariations: ["Baby Cobra on forearms (Sphinx Pose)"],
    startingPosition: "High pushup plank position.",
    movementExecution: "Rhythmic wave from inverted V Downward Dog to gentle anterior Cobra opening.",
    finishingPosition: "Return to plank or child's pose.",
    musclesWorked: ["Gastrocnemius", "Hamstrings", "Pectoralis Major", "Abdominal Wall"],
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2022/07/Downward-Facing-Dog.gif",
    customMediaUrl: "https://fitnessprogramer.com/wp-content/uploads/2022/07/Downward-Facing-Dog.gif",
    duration: "60s Dynamic Flow",
    recommendedSets: "1",
    recommendedReps: "6-8 flows",
    restTime: "15s transition",
    isPremium: false,
    isCustom: false,
    genderSuitability: "Unisex",
    locationSuitability: "Both"
  },
  {
    id: "stretch-overhead-lat-side-bend",
    name: "Standing Overhead Lat & Side Body Stretch",
    category: "Stretching & Mobility",
    categories: ["Stretching & Mobility", "Back", "Core", "Mobility & Recovery"],
    muscleGroups: ["Latissimus Dorsi", "Obliques", "Intercostals", "Shoulders"],
    difficulty: "Beginner",
    instructions: [
      "Stand tall with feet shoulder-width apart, interlace your fingers overhead with palms facing up.",
      "Inhale and reach as high as possible toward the ceiling, lengthening your spine.",
      "Exhale and gently side-bend your torso to the right, feeling the elongation all down your left lat and ribs.",
      "Hold for 3-5 deep breaths, return to center, and side-bend to the left."
    ],
    equipment: ["Bodyweight"],
    commonMistakes: ["Twisting torso forward or backward", "Holding breath"],
    safetyTips: ["Keep weight distributed evenly across both feet"],
    alternativeExercises: ["Child's Pose with Lateral Lat Reach"],
    progressionVariations: ["Cross trailing leg behind for increased fascia stretch"],
    regressionVariations: ["Seated side reach on a bench"],
    startingPosition: "Standing upright with neutral posture.",
    movementExecution: "Pure lateral flexion of torso with active axial reach.",
    finishingPosition: "Return to center standing tall.",
    musclesWorked: ["Latissimus Dorsi", "Internal & External Obliques", "Quadratus Lumborum"],
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2022/02/Side-Bend-Stretch.gif",
    customMediaUrl: "https://fitnessprogramer.com/wp-content/uploads/2022/02/Side-Bend-Stretch.gif",
    duration: "45s Each Side",
    recommendedSets: "1",
    recommendedReps: "45s per side",
    restTime: "15s transition",
    isPremium: false,
    isCustom: false,
    genderSuitability: "Unisex",
    locationSuitability: "Both"
  },
  {
    id: "stretch-glute-figure-4",
    name: "Supine Glute & Piriformis Figure-4 Stretch",
    category: "Stretching & Mobility",
    categories: ["Stretching & Mobility", "Legs", "Glutes", "Mobility & Recovery"],
    muscleGroups: ["Glutes", "Piriformis", "Hips", "Lower Back"],
    difficulty: "Beginner",
    instructions: [
      "Lie on your back with knees bent and feet flat on the floor.",
      "Cross your right ankle over your left knee, creating a figure-4 shape.",
      "Reach your hands through your legs to grasp behind your left hamstring.",
      "Gently draw your left knee toward your chest while keeping your right foot flexed.",
      "Hold for 45 seconds feeling the deep stretch in your right hip and glute, then switch sides."
    ],
    equipment: ["Bodyweight", "Mat"],
    commonMistakes: ["Lifting shoulders off mat", "Letting ankle sickle inward"],
    safetyTips: ["Keep flexed foot to stabilize knee joint"],
    alternativeExercises: ["Pigeon Pose with Diaphragmatic Breathing"],
    progressionVariations: ["Grasp front of shin instead of hamstring"],
    regressionVariations: ["Leave resting foot on a wall or chair"],
    startingPosition: "Supine lying flat on mat with bent knees.",
    movementExecution: "Gentle pull of thighs toward chest in figure-4 geometry.",
    finishingPosition: "Lower feet to floor and switch legs.",
    musclesWorked: ["Piriformis", "Gluteus Medius", "Deep Hip External Rotators"],
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2022/04/Figure-Four-Stretch.gif",
    customMediaUrl: "https://fitnessprogramer.com/wp-content/uploads/2022/04/Figure-Four-Stretch.gif",
    duration: "45s Each Leg",
    recommendedSets: "1",
    recommendedReps: "45s hold per side",
    restTime: "15s transition",
    isPremium: false,
    isCustom: false,
    genderSuitability: "Unisex",
    locationSuitability: "Both"
  },
  {
    id: "stretch-standing-quad",
    name: "Standing Quadriceps & Anterior Hip Stretch",
    category: "Stretching & Mobility",
    categories: ["Stretching & Mobility", "Legs", "Mobility & Recovery"],
    muscleGroups: ["Quadriceps", "Hip Flexors", "Patellar Tendon"],
    difficulty: "Beginner",
    instructions: [
      "Stand tall on your left leg. If needed, touch a wall or sturdy object for balance.",
      "Bend your right knee and grasp your right foot or ankle behind you with your right hand.",
      "Keep your knees touching and gently push your hips forward while drawing your heel toward your glute.",
      "Hold for 45 seconds maintaining a tall, upright torso, then switch sides."
    ],
    equipment: ["Bodyweight"],
    commonMistakes: ["Letting knee drift out to the side", "Excessive arching of lower back"],
    safetyTips: ["Do not pull foot so hard as to stress the knee joint"],
    alternativeExercises: ["Deep Kneeling Hip Flexor & Psoas Stretch"],
    progressionVariations: ["Reach opposite arm straight overhead"],
    regressionVariations: ["Side-lying quad stretch on mat"],
    startingPosition: "Standing upright with neutral posture.",
    movementExecution: "Knee flexion with slight hip extension and glute squeeze.",
    finishingPosition: "Release foot gently to floor and switch.",
    musclesWorked: ["Rectus Femoris", "Vastus Lateralis", "Vastus Medialis"],
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/05/Standing-Quad-Stretch.gif",
    customMediaUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/05/Standing-Quad-Stretch.gif",
    duration: "45s Each Leg",
    recommendedSets: "1",
    recommendedReps: "45s hold per side",
    restTime: "15s transition",
    isPremium: false,
    isCustom: false,
    genderSuitability: "Unisex",
    locationSuitability: "Both"
  }
];
