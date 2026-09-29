import { Exercise } from "../data/exercises";
import { ChallengeExerciseItem, DayWorkoutMeta, DayExecutionPlan } from "../types/challengeEngine";

/**
 * Intelligent categorization and muscle matching helper.
 * When an admin adds an exercise (e.g. "Bench Press" with category "Chest"),
 * this engine automatically maps it to every program, split, and challenge day where that muscle/category appears.
 */
export function matchesTargetCategories(ex: Exercise, targets: string[]): boolean {
  if (!ex || !targets || targets.length === 0) return false;

  const targetSet = targets.map(t => t.toLowerCase().trim());
  const exCat = (ex.category || "").toLowerCase().trim();
  const exCats = (ex.categories || []).map(c => c.toLowerCase().trim());
  const exMuscles = (ex.muscleGroups || []).map(m => m.toLowerCase().trim());
  const exSecondary = (ex.secondaryMuscles || []).map(s => s.toLowerCase().trim());
  const exWorked = (ex.musclesWorked || []).map(w => w.toLowerCase().trim());
  const exName = (ex.name || "").toLowerCase().trim();

  const allExAttributes = new Set([
    exCat,
    ...exCats,
    ...exMuscles,
    ...exSecondary,
    ...exWorked
  ]);

  // Check direct matches
  for (const t of targetSet) {
    if (allExAttributes.has(t)) return true;

    // Substring matches in category, name, or muscle
    if (exCat.includes(t)) return true;
    if (exCats.some(c => c.includes(t))) return true;
    if (exMuscles.some(m => m.includes(t))) return true;

    // Semantic aliases
    if (t === "chest" && (exName.includes("bench") || exName.includes("pushup") || exName.includes("push up") || exName.includes("pec"))) return true;
    if (t === "triceps" && (exName.includes("tricep") || exName.includes("pushdown") || exName.includes("dip") || exName.includes("skull crusher"))) return true;
    if (t === "back" && (exName.includes("row") || exName.includes("pullup") || exName.includes("pull up") || exName.includes("pulldown") || exName.includes("lat") || exName.includes("deadlift"))) return true;
    if (t === "biceps" && (exName.includes("curl") || exName.includes("bicep"))) return true;
    if (t === "shoulders" && (exName.includes("overhead press") || exName.includes("shoulder press") || exName.includes("lateral raise") || exName.includes("delt"))) return true;
    if (t === "legs" && (exName.includes("squat") || exName.includes("lunge") || exName.includes("leg press") || exName.includes("hamstring") || exName.includes("quad") || exName.includes("calf") || exName.includes("calves"))) return true;
    if (t === "glutes" && (exName.includes("glute") || exName.includes("hip thrust") || exName.includes("squat") || exName.includes("lunge") || exName.includes("bridge"))) return true;
    if ((t === "core" || t === "abs") && (exName.includes("plank") || exName.includes("crunch") || exName.includes("sit up") || exName.includes("dead bug") || exName.includes("twist"))) return true;
    if (t === "cardio" && (exName.includes("run") || exName.includes("walk") || exName.includes("jump rope") || exName.includes("hiit") || exName.includes("burpee") || exName.includes("climber"))) return true;
    if (t === "mobility" && (exName.includes("stretch") || exName.includes("mobility") || exName.includes("yoga") || exName.includes("cat-cow") || exName.includes("reach"))) return true;
  }

  return false;
}

/**
 * Strict validator to determine whether an exercise is appropriate for home workouts.
 * Enforces zero-equipment, bodyweight, or home-accessible items only.
 * Strictly prevents barbell, dumbbell, cable, machine, and gym equipment exercises from entering home programs.
 */
export function isHomeEligibleExercise(ex: Exercise): boolean {
  if (!ex) return false;

  const name = (ex.name || "").toLowerCase().trim();
  const desc = (ex.description || "").toLowerCase().trim();
  const category = (ex.category || "").toLowerCase().trim();
  const location = (ex.locationSuitability || "").toLowerCase().trim();
  
  // Array of equipment items
  const equipment = (
    Array.isArray(ex.equipment) ? ex.equipment : [String(ex.equipment || "")]
  ).map(e => e.toLowerCase().trim());

  // 1. Explicit gym location requirement
  if (location === "gym") {
    return false;
  }

  // 2. Prohibited equipment and keywords for home workouts (barbells, dumbbells, machines, etc.)
  const prohibitedGymEquipment = [
    "barbell",
    "dumbbell",
    "dumbbells",
    "dumbell",
    "db ",
    " db",
    "bb ",
    " bb",
    "(db)",
    "(bb)",
    "kettlebell",
    "cable",
    "cables",
    "pulley",
    "machine",
    "smith machine",
    "leg press",
    "hack squat",
    "pec deck",
    "lat pulldown",
    "pulldown",
    "leg extension",
    "leg curl machine",
    "ez bar",
    "ez-bar",
    "t-bar",
    "landmine",
    "trap bar",
    "bench press",
    "preacher bench",
    "preacher curl",
    "plate",
    "weight plate",
    "plates",
    "rack",
    "squat rack",
    "incline bench press",
    "decline bench press"
  ];

  // Prohibited words in exercise name
  for (const kw of prohibitedGymEquipment) {
    if (name.includes(kw)) {
      return false;
    }
  }

  // Prohibited equipment listed in exercise
  for (const eq of equipment) {
    for (const kw of prohibitedGymEquipment) {
      if (eq.includes(kw)) {
        return false;
      }
    }
  }

  // If equipment explicitly says gym
  if (equipment.some(e => e === "gym" || e.includes("gym equipment"))) {
    return false;
  }

  // Check description if equipment is empty
  if (equipment.length === 0 || equipment.includes("none")) {
    for (const kw of prohibitedGymEquipment) {
      if (desc.includes(kw)) {
        return false;
      }
    }
  }

  // Category "Gym Workouts" cannot enter home workout program unless explicitly tagged Home/Both and Bodyweight
  if (category === "gym workouts") {
    const isExplicitlyHome = location === "home" || location === "both";
    const hasZeroEquip = equipment.some(e => e.includes("bodyweight") || e.includes("zero") || e === "none");
    if (!isExplicitlyHome || !hasZeroEquip) {
      return false;
    }
  }

  return true;
}

/**
 * Filter exercises matching a list of target categories or muscle groups.
 * Optionally enforces home-only eligibility.
 */
export function filterExercisesForSplit(
  exercises: Exercise[], 
  targets: string[],
  options?: { requireHomeOnly?: boolean }
): Exercise[] {
  const seen = new Set<string>();
  const results: Exercise[] = [];

  for (const ex of exercises) {
    if (!ex || !ex.id) continue;
    const cleanId = ex.id.toLowerCase().trim();
    if (seen.has(cleanId)) continue;

    // Strict filter for home workouts if required
    if (options?.requireHomeOnly && !isHomeEligibleExercise(ex)) {
      continue;
    }

    if (matchesTargetCategories(ex, targets)) {
      seen.add(cleanId);
      results.push(ex);
    }
  }

  return results;
}

/**
 * Convert an Exercise to ChallengeExerciseItem for display in challenge and program engines.
 */
export function exerciseToChallengeItem(
  ex: Exercise,
  programId: string,
  dayNumber: number,
  index: number,
  overrideSets?: number | string,
  overrideReps?: string
): ChallengeExerciseItem {
  const sets = overrideSets !== undefined ? Number(overrideSets) || 3 : Number(ex.recommendedSets) || 3;
  const reps = overrideReps || ex.recommendedReps || "10-12 reps";
  const mediaUrl = ex.customMediaUrl || ex.gifUrl || ex.imageUrl || "";

  return {
    id: `${programId}_d${dayNumber}_${ex.id || index + 1}`,
    programId: programId as any,
    programName: programId,
    dayNumber,
    category: ex.category || "General Strength",
    muscleGroup: ex.muscleGroups && ex.muscleGroups.length > 0 ? ex.muscleGroups : [ex.category || "Full Body"],
    exerciseName: ex.name,
    equipment: ex.equipment && ex.equipment.length > 0 ? (Array.isArray(ex.equipment) ? ex.equipment : [String(ex.equipment)]) : ["Bodyweight"],
    difficulty: ex.difficulty || "Intermediate",
    sets: sets,
    reps: reps,
    duration: ex.duration || "45s set",
    instructions: ex.instructions && ex.instructions.length > 0 ? ex.instructions : [
      `Set up your starting position for ${ex.name}.`,
      `Execute deliberate contraction through the target range of motion.`,
      `Squeeze at peak contraction and return under control.`
    ],
    restTime: ex.restTime || "60s",
    gifUrl: mediaUrl,
    coachingCues: ex.movementExecution
      ? [ex.movementExecution]
      : ex.trainerTips
        ? [ex.trainerTips]
        : ["Maintain rigid core stability and steady breathing."]
  };
}

export interface SplitDefinition {
  categoryTitle: string;
  targetMuscles: string[];
  isCardioOnly?: boolean;
  isRestDay?: boolean;
  cardioDistance?: string;
}

/**
 * 7-Day Rolling Split Definitions for programs.
 */
export const PROGRAM_SPLIT_DEFINITIONS: Record<string, (cycleDay: number) => SplitDefinition> = {
  immortal_90: (cycleDay: number) => {
    switch (cycleDay) {
      case 1:
        return { categoryTitle: "Chest and Triceps", targetMuscles: ["Chest", "Triceps", "Upper Body"] };
      case 2:
        return { categoryTitle: "Back and Biceps", targetMuscles: ["Back", "Biceps", "Lats", "Traps", "Forearms"] };
      case 3:
        return { categoryTitle: "Cardio and Mobility", targetMuscles: ["Cardio", "Mobility", "Running", "Walking"], isCardioOnly: true, cardioDistance: "5 to 10 KM" };
      case 4:
        return { categoryTitle: "Legs and Shoulders", targetMuscles: ["Legs", "Quadriceps", "Hamstrings", "Glutes", "Calves", "Shoulders"] };
      case 5:
        return { categoryTitle: "Chest, Triceps and Forearms", targetMuscles: ["Chest", "Triceps", "Forearms", "Upper Body"] };
      case 6:
        return { categoryTitle: "Back, Biceps and Core", targetMuscles: ["Back", "Biceps", "Core", "Abs"] };
      case 7:
      default:
        return { categoryTitle: "Rest and Recovery", targetMuscles: ["Recovery", "Mobility"], isRestDay: true, cardioDistance: "5 to 10 KM Optional" };
    }
  },
  belly_fat_shred: (cycleDay: number) => {
    switch (cycleDay) {
      case 1:
        return { categoryTitle: "HIIT Intervals & Midsection Stability", targetMuscles: ["Core", "Abs", "HIIT", "Cardio"] };
      case 2:
        return { categoryTitle: "Core Armor & Lower Body Toning", targetMuscles: ["Core", "Abs", "Legs", "Glutes"] };
      case 3:
        return { categoryTitle: "Wednesday 5-10 KM Running or Walking", targetMuscles: ["Cardio", "Running", "Walking"], isCardioOnly: true, cardioDistance: "5 to 10 KM" };
      case 4:
        return { categoryTitle: "Upper Body Push-Pull & Midsection Sculpt", targetMuscles: ["Chest", "Back", "Shoulders", "Core", "Abs"] };
      case 5:
        return { categoryTitle: "Lower Body Shred & Isometric Core", targetMuscles: ["Legs", "Glutes", "Core", "Abs"] };
      case 6:
        return { categoryTitle: "Saturday Total Body Resistance & Functional Core", targetMuscles: ["Full Body", "Core", "Chest", "Legs"] };
      case 7:
      default:
        return { categoryTitle: "Sunday 5-10 KM Running or Walking & Rest", targetMuscles: ["Cardio", "Recovery"], isRestDay: true, cardioDistance: "5 to 10 KM" };
    }
  },
  women_confidence: (cycleDay: number) => {
    switch (cycleDay) {
      case 1:
        return { categoryTitle: "Glute & Posterior Awakening", targetMuscles: ["Glutes", "Hamstrings", "Lower Body"] };
      case 2:
        return { categoryTitle: "Upper Body Posture & Sculpt", targetMuscles: ["Upper Body", "Back", "Shoulders", "Chest", "Arms"] };
      case 3:
        return { categoryTitle: "Aerobic Step Walk & Active Reset", targetMuscles: ["Cardio", "Walking"], isCardioOnly: true, cardioDistance: "3 to 5 KM" };
      case 4:
        return { categoryTitle: "Core & Waist Kinetic Compression", targetMuscles: ["Core", "Abs", "Obliques"] };
      case 5:
        return { categoryTitle: "Full Body Tone & Metabolic Flush", targetMuscles: ["Full Body", "Glutes", "Upper Body"] };
      case 6:
        return { categoryTitle: "Deep Pelvic Mobility & Glute Sculpt", targetMuscles: ["Glutes", "Hips", "Mobility"] };
      case 7:
      default:
        return { categoryTitle: "Restorative Regeneration & Rest", targetMuscles: ["Recovery", "Mobility"], isRestDay: true };
    }
  },
  home_180: (cycleDay: number) => {
    switch (cycleDay) {
      case 1:
        return { categoryTitle: "Upper Body Calisthenics & Chest", targetMuscles: ["Chest", "Upper Body", "Arms", "Home Workouts"] };
      case 2:
        return { categoryTitle: "Lower Body Quad & Glute Armor", targetMuscles: ["Legs", "Glutes", "Quads", "Hamstrings"] };
      case 3:
        return { categoryTitle: "Midweek 5-10 KM Aerobic Cardio", targetMuscles: ["Cardio", "Running", "Walking"], isCardioOnly: true, cardioDistance: "5 to 10 KM" };
      case 4:
        return { categoryTitle: "Posterior Chain & Back Strength", targetMuscles: ["Back", "Biceps", "Core"] };
      case 5:
        return { categoryTitle: "Core Pillar Compression & Abs", targetMuscles: ["Core", "Abs", "Obliques"] };
      case 6:
        return { categoryTitle: "Full Body Functional Conditioning", targetMuscles: ["Full Body", "Cardio", "Legs", "Chest"] };
      case 7:
      default:
        return { categoryTitle: "Sunday Active Recovery & Rest", targetMuscles: ["Recovery", "Mobility"], isRestDay: true };
    }
  },
  lifestyle_academy: (cycleDay: number) => {
    switch (cycleDay) {
      case 1:
        return { categoryTitle: "Posture Alignment & Posterior Chain", targetMuscles: ["Upper Back", "Shoulders", "Mobility"] };
      case 2:
        return { categoryTitle: "Hip Flexor Decompression & Sedentary Reset", targetMuscles: ["Hips", "Glutes", "Mobility"] };
      case 3:
        return { categoryTitle: "Aerobic Circulation & Brisk Walking", targetMuscles: ["Cardio", "Walking"], isCardioOnly: true, cardioDistance: "5 to 10 KM" };
      case 4:
        return { categoryTitle: "Chest Opening & Anterior Mobility", targetMuscles: ["Chest", "Shoulders", "Mobility"] };
      case 5:
        return { categoryTitle: "Spinal Decompression & Core Stability", targetMuscles: ["Core", "Spine", "Abs"] };
      case 6:
        return { categoryTitle: "Glute Activation & Kinetic Chain", targetMuscles: ["Glutes", "Legs", "Hamstrings"] };
      case 7:
      default:
        return { categoryTitle: "Restorative Mobility & Parasympathetic Rest", targetMuscles: ["Recovery", "Mobility"], isRestDay: true };
    }
  }
};

/**
 * Universal dynamic workout resolver.
 * Gathers exercises that the admin has added to the active library and maps them to the appropriate program day.
 */
export function buildDynamicDayPlan(
  programId: string,
  dayNumber: number,
  allExercises: Exercise[]
): DayExecutionPlan {
  const safeDay = Math.max(1, Number(dayNumber) || 1);
  const cycleDay = ((safeDay - 1) % 7) + 1;
  const programKey = (programId || "immortal_90").toLowerCase().replace(/[^a-z0-9_]/g, "_");

  const splitResolver = PROGRAM_SPLIT_DEFINITIONS[programKey] || PROGRAM_SPLIT_DEFINITIONS["immortal_90"];
  const splitDef = splitResolver(cycleDay);

  const isHomeProgram = programKey.includes("home") || programKey === "home_180";
  const matchedExercises = filterExercisesForSplit(allExercises, splitDef.targetMuscles, { requireHomeOnly: isHomeProgram });
  const challengeItems = matchedExercises.map((ex, idx) =>
    exerciseToChallengeItem(ex, programId, safeDay, idx)
  );

  const meta: DayWorkoutMeta = {
    dayNumber: safeDay,
    programId: programId as any,
    title: `Day ${safeDay}: ${splitDef.categoryTitle}`,
    category: splitDef.categoryTitle,
    targetMuscles: splitDef.targetMuscles,
    estimatedDuration: splitDef.isCardioOnly ? "50-70 mins" : splitDef.isRestDay ? "20 mins" : "45-60 mins",
    estimatedCalories: splitDef.isCardioOnly ? 500 : splitDef.isRestDay ? 100 : 480,
    isRestDay: !!splitDef.isRestDay,
    isCardioOnly: !!splitDef.isCardioOnly,
    cardioDistance: splitDef.cardioDistance,
    guidelines: [
      `Focus: ${splitDef.categoryTitle}.`,
      "Strict form and progressive overload on all working sets.",
      "Rest adequately between sets and follow the prescribed routine."
    ],
    coachingNotes: `${splitDef.categoryTitle} - execute with intention and discipline.`
  };

  return {
    meta,
    exercises: challengeItems
  };
}
