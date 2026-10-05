import { Exercise, AUTHENTIC_STRETCH_EXERCISES } from "../data/exercises";
import { ChallengeExerciseItem, DayWorkoutMeta, DayExecutionPlan } from "../types/challengeEngine";
import { isWomenWorkoutEligibleExercise } from "../data/womenConfidenceProgramData";
import { UserProfile } from "../types";

/**
 * Checks whether an exercise is primarily a Chest movement.
 */
export function isChestExercise(name: string, category: string, muscleGroups: string[] = []): boolean {
  const n = (name || "").toLowerCase();
  const c = (category || "").toLowerCase();
  const mg = muscleGroups.map(m => (m || "").toLowerCase());
  if (c.includes("chest") || c.includes("pec")) return true;
  if (mg.some(m => m.includes("chest") || m.includes("pec"))) return true;
  if (n.includes("bench press") || n.includes("chest press") || n.includes("incline press") || 
      n.includes("decline press") || n.includes("flat bench") || n.includes("pushup") || 
      n.includes("push up") || n.includes("push-up") || n.includes("pec fly") || 
      n.includes("pec deck") || n.includes("chest fly") || n.includes("svend press") || 
      n.includes("cable crossover") || n.includes("dumbbell fly") || n.includes("dumbbell bench") ||
      n.includes("incline dumbbell") || n.includes("decline dumbbell")) {
    return true;
  }
  return false;
}

/**
 * Checks whether an exercise is primarily a Back movement.
 */
export function isBackExercise(name: string, category: string, muscleGroups: string[] = []): boolean {
  const n = (name || "").toLowerCase();
  const c = (category || "").toLowerCase();
  const mg = muscleGroups.map(m => (m || "").toLowerCase());
  if (c.includes("back") || c.includes("lat") || c.includes("trap") || c.includes("rhomboid")) return true;
  if (mg.some(m => m.includes("back") || m.includes("lat") || m.includes("trap") || m.includes("rhomboid"))) return true;
  if (n.includes("row") || n.includes("pulldown") || n.includes("pull up") || 
      n.includes("pullup") || n.includes("pull-up") || n.includes("chin up") || 
      n.includes("chinup") || n.includes("chin-up") || n.includes("deadlift") || 
      n.includes("lat ") || n.includes("lats") || n.includes("shrug") || 
      n.includes("face pull") || n.includes("hyperextension") || n.includes("back extension") ||
      n.includes("t-bar row") || n.includes("seated cable row") || n.includes("bent over row")) {
    return true;
  }
  return false;
}

/**
 * Checks whether an exercise is primarily a Biceps movement.
 */
export function isBicepsExercise(name: string, category: string, muscleGroups: string[] = []): boolean {
  const n = (name || "").toLowerCase();
  const c = (category || "").toLowerCase();
  const mg = muscleGroups.map(m => (m || "").toLowerCase());
  if (c.includes("bicep") || c === "arms") return true;
  if (mg.some(m => m.includes("bicep"))) return true;
  if (n.includes("curl") && !n.includes("leg curl") && !n.includes("hamstring curl")) return true;
  if (n.includes("bicep") || n.includes("preacher") || n.includes("hammer curl") || 
      n.includes("concentration curl") || n.includes("spider curl") || n.includes("incline curl")) {
    return true;
  }
  return false;
}

/**
 * Checks whether an exercise is primarily a Triceps movement.
 */
export function isTricepsExercise(name: string, category: string, muscleGroups: string[] = []): boolean {
  const n = (name || "").toLowerCase();
  const c = (category || "").toLowerCase();
  const mg = muscleGroups.map(m => (m || "").toLowerCase());
  if (c.includes("tricep")) return true;
  if (mg.some(m => m.includes("tricep"))) return true;
  if (n.includes("tricep") || n.includes("pushdown") || n.includes("skull crusher") || 
      n.includes("kickback") || (n.includes("dip") && !n.includes("hip dip")) || 
      n.includes("overhead tricep") || n.includes("close grip bench") || n.includes("rope pushdown")) {
    return true;
  }
  return false;
}

/**
 * Checks whether an exercise is primarily a Leg / Lower Body movement.
 */
export function isLegExercise(name: string, category: string, muscleGroups: string[] = []): boolean {
  const n = (name || "").toLowerCase();
  const c = (category || "").toLowerCase();
  const mg = muscleGroups.map(m => (m || "").toLowerCase());
  if (c.includes("leg") || c.includes("quad") || c.includes("hamstring") || c.includes("calf") || c.includes("calves") || c.includes("glute")) return true;
  if (mg.some(m => m.includes("leg") || m.includes("quad") || m.includes("hamstring") || m.includes("calf") || m.includes("calves") || m.includes("glute"))) return true;
  if (n.includes("squat") || n.includes("lunge") || n.includes("leg press") || 
      n.includes("leg extension") || n.includes("leg curl") || n.includes("calf raise") || 
      n.includes("step up") || n.includes("hip thrust") || n.includes("glute bridge") || 
      n.includes("romanian deadlift") || n.includes("rdl") || n.includes("hack squat") || 
      n.includes("wall sit") || n.includes("split squat") || n.includes("goblet squat")) {
    return true;
  }
  return false;
}

/**
 * Checks whether an exercise is primarily a Shoulder movement.
 */
export function isShoulderExercise(name: string, category: string, muscleGroups: string[] = []): boolean {
  const n = (name || "").toLowerCase();
  const c = (category || "").toLowerCase();
  const mg = muscleGroups.map(m => (m || "").toLowerCase());
  if (c.includes("shoulder") || c.includes("delt")) return true;
  if (mg.some(m => m.includes("shoulder") || m.includes("delt"))) return true;
  if (n.includes("overhead press") || n.includes("shoulder press") || n.includes("lateral raise") ||
      n.includes("front raise") || n.includes("arnold press") || n.includes("military press") ||
      n.includes("rear delt") || n.includes("upright row") || n.includes("face pull")) {
    return true;
  }
  return false;
}

/**
 * Checks whether an exercise is primarily a Core / Abs movement.
 */
export function isCoreExercise(name: string, category: string, muscleGroups: string[] = []): boolean {
  const n = (name || "").toLowerCase();
  const c = (category || "").toLowerCase();
  const mg = muscleGroups.map(m => (m || "").toLowerCase());
  if (c.includes("core") || c.includes("abs") || c.includes("abdom") || c.includes("oblique")) return true;
  if (mg.some(m => m.includes("core") || m.includes("abs") || m.includes("abdom") || m.includes("oblique"))) return true;
  if (n.includes("plank") || n.includes("crunch") || n.includes("sit up") || 
      n.includes("sit-up") || n.includes("dead bug") || n.includes("russian twist") || 
      n.includes("bicycle crunch") || n.includes("hollow body") || n.includes("flutter kick") || 
      n.includes("leg raise") || n.includes("ab rollout") || n.includes("vacuum") || 
      n.includes("mountain climber") || n.includes("hanging leg raise")) {
    return true;
  }
  return false;
}

/**
 * Detects whether an exercise counts by TIME (e.g. 45s countdown) or REPS (e.g. 10-12 reps).
 */
export function detectWorkoutType(name: string = "", repsOrDuration: string = ""): "time" | "reps" {
  const n = (name || "").toLowerCase().trim();
  const r = (repsOrDuration || "").toLowerCase().trim();

  // If rep string explicitly says "reps" or "rep" without seconds
  if ((r.includes("rep") || r.includes("reps")) && !r.includes("sec") && !r.includes("s set") && !r.includes("s hold")) {
    return "reps";
  }

  // Explicit time indicators in reps/duration text
  if (
    r.includes("sec") || 
    r.includes("s set") || 
    r.includes("s hold") || 
    r.endsWith("s") || 
    r.includes("min") || 
    r.includes("continuous") || 
    r.includes("km") ||
    r.includes("hold")
  ) {
    return "time";
  }

  // Keywords that are fundamentally duration/time based
  const timeKeywords = [
    "plank", "wall sit", "hold", "hang", "jumping jack", "jump rope", "skipping",
    "high knees", "mountain climber", "running", "walking", "jogging", "sprint",
    "cardio", "battle rope", "butt kick", "bear crawl", "flutter kick", "vacuum",
    "dead bug hold", "hollow body", "hollow hold", "l-sit", "static hold", "stretch",
    "cat-cow", "child's pose", "bridge hold", "aerobic", "liss", "hiit interval"
  ];

  for (const kw of timeKeywords) {
    if (n.includes(kw)) {
      return "time";
    }
  }

  return "reps";
}

/**
 * Strict validator: Does this exercise authentically belong to the split targets?
 * Completely eliminates cross-contamination:
 * - On Back & Biceps day, Chest exercises (Bench Press, Incline Press, Pushups) and Leg exercises (Squats, Lunges) DISAPPEAR.
 * - On Chest & Triceps day, Back and Leg exercises DISAPPEAR.
 * - On Leg day, Chest and Back exercises DISAPPEAR.
 */
export function isExerciseBelongingToSplit(
  ex: Exercise | ChallengeExerciseItem | any,
  targets: string[],
  categoryTitle: string = ""
): boolean {
  if (!ex) return false;
  const name = (ex.name || ex.exerciseName || "").trim();
  const category = (ex.category || "").trim();
  const muscleGroups = Array.isArray(ex.muscleGroups) 
    ? ex.muscleGroups 
    : Array.isArray(ex.muscleGroup) 
      ? ex.muscleGroup 
      : [String(ex.muscleGroup || ex.category || "")];

  const targetLower = targets.map(t => t.toLowerCase().trim());
  const titleLower = categoryTitle.toLowerCase().trim();

  const allowsChest = targetLower.some(t => t.includes("chest") || t.includes("pec")) || titleLower.includes("chest");
  const allowsBack = targetLower.some(t => t.includes("back") || t.includes("lat")) || titleLower.includes("back");
  const allowsBiceps = targetLower.some(t => t.includes("bicep")) || titleLower.includes("bicep");
  const allowsTriceps = targetLower.some(t => t.includes("tricep")) || titleLower.includes("tricep");
  const allowsLegs = targetLower.some(t => t.includes("leg") || t.includes("quad") || t.includes("hamstring") || t.includes("glute") || t.includes("calf") || t.includes("lower body")) || titleLower.includes("leg");
  const allowsCore = targetLower.some(t => t.includes("core") || t.includes("abs") || t.includes("abdom")) || titleLower.includes("core") || titleLower.includes("abs");
  const allowsShoulders = targetLower.some(t => t.includes("shoulder") || t.includes("delt")) || titleLower.includes("shoulder");
  const allowsForearms = targetLower.some(t => t.includes("forearm") || t.includes("grip")) || titleLower.includes("forearm");
  const isFullBody = targetLower.some(t => t.includes("full body") || t.includes("functional")) || titleLower.includes("full body");
  const isPureCardio = (targetLower.some(t => t.includes("cardio") || t.includes("running") || t.includes("walking")) || titleLower.includes("cardio")) && !allowsChest && !allowsBack && !allowsLegs;

  const hasChest = isChestExercise(name, category, muscleGroups);
  const hasBack = isBackExercise(name, category, muscleGroups);
  const hasBiceps = isBicepsExercise(name, category, muscleGroups);
  const hasTriceps = isTricepsExercise(name, category, muscleGroups);
  const hasLegs = isLegExercise(name, category, muscleGroups);
  const hasShoulders = isShoulderExercise(name, category, muscleGroups);
  const hasCore = isCoreExercise(name, category, muscleGroups);

  // Rule 1: Back and/or Biceps day MUST NOT contain Chest or Leg exercises (e.g. Flat Bench Press, Squats, Lunges)
  if ((allowsBack || allowsBiceps) && !allowsChest && !allowsLegs) {
    if (hasChest || hasLegs) return false;
    // Allow Back, Biceps, Forearms, or Core if specified in title
    if (hasBack || hasBiceps) return true;
    if (allowsCore && hasCore) return true;
    if (allowsForearms && (category.toLowerCase().includes("forearm") || name.toLowerCase().includes("wrist") || name.toLowerCase().includes("grip"))) return true;
    return false;
  }

  // Rule 2: Chest and/or Triceps day MUST NOT contain Back or Leg exercises
  if ((allowsChest || allowsTriceps) && !allowsBack && !allowsLegs) {
    if (hasBack || hasLegs) return false;
    if (hasChest || hasTriceps) return true;
    if (allowsForearms && (category.toLowerCase().includes("forearm") || name.toLowerCase().includes("grip"))) return true;
    return false;
  }

  // Rule 3: Pure Cardio days (Days 3 & 7) cannot have heavy barbell/dumbbell compound lifts
  if (isPureCardio) {
    if (hasChest || hasBack || (hasLegs && !name.toLowerCase().includes("walk") && !name.toLowerCase().includes("run") && !name.toLowerCase().includes("jump"))) {
      return false;
    }
  }

  // Rule 4: Leg and Shoulder day MUST NOT contain Chest or Back movements (e.g. Flat Bench Press on Leg day)
  if (allowsLegs && !allowsChest && !allowsBack) {
    if (hasChest || hasBack) return false;
    if (hasLegs || hasShoulders || (allowsCore && hasCore)) return true;
    return false;
  }

  // Rule 5: Chest, Triceps and Forearms day
  if (allowsChest && allowsTriceps && !allowsBack) {
    if (hasBack || hasLegs) return false;
    return hasChest || hasTriceps || allowsForearms;
  }

  // Rule 6: Back, Biceps and Core day
  if (allowsBack && allowsBiceps && allowsCore && !allowsChest && !allowsLegs) {
    if (hasChest || hasLegs) return false;
    return hasBack || hasBiceps || hasCore;
  }

  // Fallback to intelligent categorization
  return matchesTargetCategories(ex as Exercise, targets);
}

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

  const isBackDayOnly = targetSet.some(t => t.includes("back") || t.includes("bicep")) && !targetSet.some(t => t.includes("chest") || t.includes("leg"));
  const isChestDayOnly = targetSet.some(t => t.includes("chest") || t.includes("tricep")) && !targetSet.some(t => t.includes("back") || t.includes("leg"));

  // Strictly prevent chest or leg moves on back-only day
  if (isBackDayOnly && (isChestExercise(exName, exCat, exMuscles) || isLegExercise(exName, exCat, exMuscles))) {
    return false;
  }
  // Strictly prevent back or leg moves on chest-only day
  if (isChestDayOnly && (isBackExercise(exName, exCat, exMuscles) || isLegExercise(exName, exCat, exMuscles))) {
    return false;
  }

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
  const workoutType = detectWorkoutType(ex.name, reps);

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
    duration: ex.duration || (workoutType === "time" ? "45s set" : "3-4 Sets"),
    workoutType: workoutType,
    isTimeBased: workoutType === "time",
    isRepBased: workoutType === "reps",
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
  absFocusApplied?: string;
}

/**
 * Selects 2 authentic pre-workout stretch exercises matching the day's targeted muscle groups.
 * Every daily workout begins with exactly 2 stretch workouts with full GIF animations.
 */
export function getPreWorkoutStretchesForDay(
  targetMuscles: string[] = [],
  availableExercises: Exercise[] = [],
  count: number = 2
): ChallengeExerciseItem[] {
  const allStretches: Exercise[] = [];
  const seenIds = new Set<string>();

  // 1. Check active library for custom or admin-edited stretch exercises
  if (Array.isArray(availableExercises)) {
    for (const ex of availableExercises) {
      if (!ex || !ex.id) continue;
      const cat = (ex.category || "").toLowerCase();
      const name = (ex.name || "").toLowerCase();
      const isStretch = cat.includes("stretch") || cat.includes("mobility") || name.includes("stretch") || name.includes("mobility");
      if (isStretch && !seenIds.has(ex.id)) {
        seenIds.add(ex.id);
        allStretches.push(ex);
      }
    }
  }

  // 2. Supplement with core authentic stretch library
  for (const st of AUTHENTIC_STRETCH_EXERCISES) {
    if (!seenIds.has(st.id)) {
      seenIds.add(st.id);
      allStretches.push(st);
    }
  }

  // 3. Score stretches based on target muscles of the day
  const targetsLower = targetMuscles.map(t => (t || "").toLowerCase());
  const scored = allStretches.map(st => {
    let score = 0;
    const stName = (st.name || "").toLowerCase();
    const stMuscles = (st.muscleGroups || []).map(m => m.toLowerCase());
    const isFullBody = targetsLower.some(t => t.includes("full") || t.includes("cardio") || t.includes("recovery"));

    for (const t of targetsLower) {
      if (stMuscles.some(m => m.includes(t) || t.includes(m))) score += 4;
      if (stName.includes(t)) score += 3;
    }

    if (isFullBody && (stName.includes("world") || stName.includes("cobra") || stName.includes("cat-cow"))) {
      score += 5;
    }

    // Baseline score for quality
    score += (st.gifUrl || st.customMediaUrl ? 2 : 0);
    return { exercise: st, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const selected: Exercise[] = [];
  for (const s of scored) {
    if (selected.length >= count) break;
    selected.push(s.exercise);
  }

  // If still fewer than requested count, fill from AUTHENTIC_STRETCH_EXERCISES
  for (const fallback of AUTHENTIC_STRETCH_EXERCISES) {
    if (selected.length >= count) break;
    if (!selected.some(s => s.id === fallback.id)) {
      selected.push(fallback);
    }
  }

  return selected.map((st, idx) => ({
    id: `preworkout_stretch_${idx + 1}_${st.id}`,
    programId: "stretch" as any,
    programName: "Pre-Workout Dynamic Stretch & Mobility",
    dayNumber: 1,
    category: "Stretching & Mobility",
    muscleGroup: st.muscleGroups || ["Mobility", "Full Body"],
    targetMuscles: st.muscleGroups || ["Mobility"],
    exerciseName: st.name,
    name: st.name,
    equipment: st.equipment || ["Bodyweight"],
    difficulty: st.difficulty || "Beginner",
    sets: 1,
    reps: st.recommendedReps || st.duration || "45s-60s hold",
    duration: st.duration || "45s hold",
    workoutType: "time",
    isTimeBased: true,
    isRepBased: false,
    restTime: "15s transition",
    gifUrl: st.customMediaUrl || st.gifUrl || "",
    mediaUrl: st.customMediaUrl || st.gifUrl || "",
    instructions: st.instructions && st.instructions.length > 0 ? st.instructions : [
      `Assume starting position for ${st.name}.`,
      "Engage steady diaphragmatic breathing.",
      "Hold the stretch gently without bouncing; release tension on each exhalation."
    ],
    coachingCues: [
      "Dynamic warm-up stretch: do not force beyond comfortable range of motion.",
      "Maintain steady rhythmic breathing throughout the 45-60 second duration."
    ],
    isPreWorkoutStretch: true
  }));
}

/**
 * Resolves effective Abs workout preference:
 * - "dedicated_day": specific day purely for abs & core
 * - "cardio_abs": cardio and abs workout together
 * - "leg_day": on leg days includes abs workout
 * - "smart_adaptive": dynamically tuned to user's onboarding goal
 */
export function resolveEffectiveAbsPreference(
  userProfile?: Partial<UserProfile> | null
): "dedicated_day" | "cardio_abs" | "leg_day" | "smart_adaptive" {
  // 1. Explicit preference from profile or localStorage
  let pref = userProfile?.absWorkoutPreference;
  if (!pref && typeof window !== "undefined" && window.localStorage) {
    try {
      pref = (window.localStorage.getItem("fit_abs_preference") as any) || null;
    } catch {}
  }

  if (pref && pref !== "smart_adaptive") {
    return pref;
  }

  // 2. Smart adaptive based on user onboarding goals
  const goals = `${userProfile?.fitnessGoals || ""} ${userProfile?.workoutPreference || ""}`.toLowerCase();
  if (goals.includes("weight") || goals.includes("fat") || goals.includes("shred") || goals.includes("slim") || goals.includes("belly")) {
    return "cardio_abs";
  }
  if (goals.includes("muscle") || goals.includes("hypertrophy") || goals.includes("strength") || goals.includes("bulk") || goals.includes("power")) {
    return "leg_day";
  }
  if (goals.includes("abs") || goals.includes("core") || goals.includes("six") || goals.includes("midsection") || goals.includes("waist")) {
    return "dedicated_day";
  }

  return "smart_adaptive";
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
        return { categoryTitle: "Glute & Posterior Awakening", targetMuscles: ["Glutes", "Hamstrings", "Lower Body", "Hips"] };
      case 2:
        return { categoryTitle: "Upper Body Posture & Sculpt", targetMuscles: ["Upper Body", "Back", "Shoulders", "Arms", "Posture"] };
      case 3:
        return { categoryTitle: "Aerobic Step Walk & Active Reset", targetMuscles: ["Cardio", "Walking", "Core"], isCardioOnly: true, cardioDistance: "3 to 5 KM" };
      case 4:
        return { categoryTitle: "Core & Waist Kinetic Compression", targetMuscles: ["Core", "Abs", "Obliques"] };
      case 5:
        return { categoryTitle: "Full Body Tone & Metabolic Flush", targetMuscles: ["Full Body", "Glutes", "Upper Body"] };
      case 6:
        return { categoryTitle: "Deep Pelvic Mobility & Glute Sculpt", targetMuscles: ["Glutes", "Hips", "Mobility"] };
      case 7:
      default:
        return { categoryTitle: "Restorative Regeneration & Rest", targetMuscles: ["Recovery", "Mobility", "Posture"], isRestDay: true };
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
 * Gathers exercises from the active library, tunes them according to user's onboarding credentials,
 * integrates user's abs workout preferences (dedicated abs day, cardio+abs, or leg day+abs),
 * guarantees 2 pre-workout stretch workouts with GIFs at the beginning before daily workout drills,
 * and respects gender suitability without forcing all workouts to female.
 */
export function buildDynamicDayPlan(
  programId: string,
  dayNumber: number,
  allExercises: Exercise[],
  userProfile?: Partial<UserProfile> | null
): DayExecutionPlan {
  const safeDay = Math.max(1, Number(dayNumber) || 1);
  const cycleDay = ((safeDay - 1) % 7) + 1;
  const programKey = (programId || "immortal_90").toLowerCase().replace(/[^a-z0-9_]/g, "_");

  const splitResolver = PROGRAM_SPLIT_DEFINITIONS[programKey] || PROGRAM_SPLIT_DEFINITIONS["immortal_90"];
  let splitDef = { ...splitResolver(cycleDay) };

  // 1. Resolve and apply user's Abs workout preference according to goal & onboarding credentials
  const effectiveAbsPref = resolveEffectiveAbsPreference(userProfile);

  if (effectiveAbsPref === "dedicated_day") {
    // Option A: Specific dedicated day purely for Abs & Core Workout
    if (cycleDay === 6) {
      splitDef = {
        categoryTitle: "Dedicated Core & Six-Pack Shred Day",
        targetMuscles: ["Core", "Abs", "Obliques", "Transverse Abdominis"],
        absFocusApplied: "dedicated_day"
      };
    }
  } else if (effectiveAbsPref === "cardio_abs") {
    // Option B: Cardio and Abs workout together
    if (cycleDay === 3 || splitDef.isCardioOnly) {
      splitDef = {
        categoryTitle: "Cardio Endurance & Abdominal Core Burnout",
        targetMuscles: ["Cardio", "Core", "Abs", "Running", "Walking"],
        isCardioOnly: false,
        cardioDistance: "5 to 10 KM + Core Burnout Circuit",
        absFocusApplied: "cardio_abs"
      };
    }
  } else if (effectiveAbsPref === "leg_day") {
    // Option C: On Leg days, integrate Abs workout
    const isLegDay = splitDef.targetMuscles.some(m => ["Legs", "Quadriceps", "Hamstrings", "Glutes", "Quads"].includes(m));
    if (cycleDay === 4 || isLegDay) {
      splitDef = {
        categoryTitle: "Legs, Lower Body & Abdominal Core Finisher",
        targetMuscles: ["Legs", "Quadriceps", "Hamstrings", "Glutes", "Core", "Abs"],
        absFocusApplied: "leg_day"
      };
    }
  }

  // 2. Gender suitability filtering: do NOT make all workouts female!
  const isHomeProgram = programKey.includes("home") || programKey === "home_180";
  const isWomenProgram = programKey.includes("women") || programKey === "women_confidence";
  const userGender = (userProfile?.gender || "").toLowerCase().trim();

  let eligibleExercises = allExercises;
  if (isWomenProgram && userGender === "female") {
    eligibleExercises = allExercises.filter(isWomenWorkoutEligibleExercise);
  } else if (userGender === "male") {
    // Male users should never have female-only exercises forced on them
    eligibleExercises = allExercises.filter(ex => ex.genderSuitability !== "Women");
  }

  // 3. User Goal & Onboarding Experience tuning: sets, reps, rest
  const userGoal = (userProfile?.fitnessGoals || "").toLowerCase();
  const userExp = (userProfile?.workoutExperience || userProfile?.activityLevel || "").toLowerCase();

  let setsMultiplier = 3;
  let repScheme = "10-12 reps";
  let restTime = "60s";

  if (userGoal.includes("muscle") || userGoal.includes("strength") || userGoal.includes("hypertrophy")) {
    setsMultiplier = 4;
    repScheme = "8-12 reps";
    restTime = "90s";
  } else if (userGoal.includes("fat") || userGoal.includes("weight") || userGoal.includes("shred") || userGoal.includes("loss")) {
    setsMultiplier = 3;
    repScheme = "15-20 reps";
    restTime = "45s";
  } else if (userGoal.includes("tone") || userGoal.includes("sculpt") || userGoal.includes("six pack") || userGoal.includes("abs")) {
    setsMultiplier = 3;
    repScheme = "12-15 reps";
    restTime = "50s";
  }

  if (userExp.includes("beginner")) {
    setsMultiplier = Math.min(setsMultiplier, 3);
    repScheme = "10-12 reps";
    restTime = "60s";
  } else if (userExp.includes("advanced")) {
    setsMultiplier = Math.max(setsMultiplier, 4);
  }

  // 4. Match exercises to split
  const matchedExercises = filterExercisesForSplit(eligibleExercises, splitDef.targetMuscles, { requireHomeOnly: isHomeProgram });
  
  // Enforce strict maximum of 10 workouts daily
  const challengeItems = matchedExercises.slice(0, 10).map((ex, idx) =>
    exerciseToChallengeItem(ex, programId, safeDay, idx, setsMultiplier, repScheme)
  );

  // 5. Select 2 Pre-Workout Dynamic Stretch Workouts with GIFs at the very beginning of the workout
  const preWorkoutStretches = getPreWorkoutStretchesForDay(splitDef.targetMuscles, allExercises, 2);

  const meta: DayWorkoutMeta = {
    dayNumber: safeDay,
    programId: programId as any,
    title: `Day ${safeDay}: ${splitDef.categoryTitle}`,
    category: splitDef.categoryTitle,
    targetMuscles: splitDef.targetMuscles,
    estimatedDuration: splitDef.isCardioOnly ? "50-70 mins" : splitDef.isRestDay ? "20 mins" : "45-60 mins",
    estimatedCalories: splitDef.isCardioOnly ? 500 : splitDef.isRestDay ? 100 : (setsMultiplier >= 4 ? 540 : 460),
    isRestDay: !!splitDef.isRestDay,
    isCardioOnly: !!splitDef.isCardioOnly,
    cardioDistance: splitDef.cardioDistance,
    preWorkoutStretches,
    absPreferenceApplied: effectiveAbsPref,
    goalTuned: userProfile?.fitnessGoals || "All-Around Athletic Conditioning",
    guidelines: [
      `Focus: ${splitDef.categoryTitle}.`,
      "Execute the 2 pre-workout dynamic stretch drills before starting main working sets.",
      "Strict form and progressive overload on all working sets.",
      "Rest adequately between sets and follow the prescribed routine."
    ],
    coachingNotes: `${splitDef.categoryTitle} - tuned to your goals. Execute with intention and discipline.`
  };

  return {
    meta,
    exercises: challengeItems,
    preWorkoutStretches
  };
}

/**
 * Purges every exercise that does not authentically belong to this split's category/muscles,
 * and resets or refills the day with strictly authentic matching exercises from the library.
 * e.g. on Back & Biceps Day, Flat Bench Press is purged, leaving ONLY Back and Biceps exercises.
 * Strictly guarantees maximum 10 workouts daily.
 */
export function purgeMismatchedExercisesFromRoutine(
  currentExercises: ChallengeExerciseItem[],
  targetMuscles: string[],
  categoryTitle: string,
  availableLibraryExercises: Exercise[],
  programId: string,
  dayNumber: number
): {
  cleanedExercises: ChallengeExerciseItem[];
  removedNames: string[];
  addedNames: string[];
} {
  const removedNames: string[] = [];
  const keptExercises: ChallengeExerciseItem[] = [];
  const seenKept = new Set<string>();

  for (const item of currentExercises) {
    const name = (item.exerciseName || item.name || "").trim();
    if (!name) continue;
    const belongs = isExerciseBelongingToSplit(item, targetMuscles, categoryTitle);
    if (!belongs) {
      removedNames.push(name);
    } else {
      const lower = name.toLowerCase();
      if (!seenKept.has(lower)) {
        seenKept.add(lower);
        keptExercises.push(item);
      }
    }
  }

  const addedNames: string[] = [];
  // If fewer than 5 exercises remain, replenish with authentic matching exercises from the admin library
  if (keptExercises.length < 5 && availableLibraryExercises && availableLibraryExercises.length > 0) {
    const isHome = programId.includes("home");
    const matchingFromLib = filterExercisesForSplit(
      availableLibraryExercises,
      targetMuscles,
      { requireHomeOnly: isHome }
    ).filter(ex => isExerciseBelongingToSplit(ex, targetMuscles, categoryTitle));

    for (const ex of matchingFromLib) {
      if (keptExercises.length >= 6) break;
      const cleanName = (ex.name || "").trim();
      const lower = cleanName.toLowerCase();
      if (!seenKept.has(lower)) {
        seenKept.add(lower);
        addedNames.push(cleanName);
        keptExercises.push(
          exerciseToChallengeItem(ex, programId, dayNumber, keptExercises.length)
        );
      }
    }
  }

  // Strictly enforce maximum 10 workouts daily
  return {
    cleanedExercises: keptExercises.slice(0, 10),
    removedNames,
    addedNames
  };
}

/**
 * Universal One-Click Reset & Clean utility across ALL programs.
 * Scans every program in PROGRAM_SPLIT_DEFINITIONS and resets every day:
 * - On Back & Biceps day, any Chest or Leg exercises immediately disappear.
 * - On Chest & Triceps day, any Back or Leg exercises immediately disappear.
 * - Caps every day at maximum 10 workouts daily.
 */
export function resetAndCleanAllProgramSplits(
  allExercises: Exercise[],
  currentOverrides: Record<string, any> = {}
): {
  updatedOverrides: Record<string, any>;
  stats: {
    totalProgramsCleaned: number;
    totalDaysReset: number;
    totalMismatchesRemoved: number;
    removedDetails: { programId: string; day: number; removed: string[] }[];
  };
} {
  const updatedOverrides: Record<string, any> = { ...currentOverrides };
  const removedDetails: { programId: string; day: number; removed: string[] }[] = [];
  let totalDaysReset = 0;
  let totalMismatchesRemoved = 0;

  const programIds = Object.keys(PROGRAM_SPLIT_DEFINITIONS);

  for (const progId of programIds) {
    if (!updatedOverrides[progId]) updatedOverrides[progId] = {};
    const splitResolver = PROGRAM_SPLIT_DEFINITIONS[progId];

    for (let cDay = 1; cDay <= 7; cDay++) {
      totalDaysReset++;
      const splitDef = splitResolver(cDay);
      const isHome = progId.includes("home");

      // Resolve base dynamic exercises
      const dynamicPlan = buildDynamicDayPlan(progId, cDay, allExercises);
      
      const existingOverride = updatedOverrides[progId][String(cDay)] || updatedOverrides[progId][`cycle_${cDay}`];
      const existingList: ChallengeExerciseItem[] = (existingOverride && Array.isArray(existingOverride.exercises) && existingOverride.exercises.length > 0)
        ? existingOverride.exercises
        : dynamicPlan.exercises;

      const result = purgeMismatchedExercisesFromRoutine(
        existingList,
        splitDef.targetMuscles,
        splitDef.categoryTitle,
        allExercises,
        progId,
        cDay
      );

      if (result.removedNames.length > 0) {
        totalMismatchesRemoved += result.removedNames.length;
        removedDetails.push({
          programId: progId,
          day: cDay,
          removed: result.removedNames
        });
      }

      const dayPayload = {
        title: splitDef.categoryTitle,
        category: splitDef.categoryTitle,
        focus: splitDef.categoryTitle,
        targetMuscles: splitDef.targetMuscles,
        isCardioOnly: !!splitDef.isCardioOnly,
        isRestDay: !!splitDef.isRestDay,
        cardioDistance: splitDef.cardioDistance || (splitDef.isCardioOnly ? "5 to 10 KM" : undefined),
        exercises: result.cleanedExercises.slice(0, 10),
        updatedAt: new Date().toISOString()
      };

      updatedOverrides[progId][String(cDay)] = dayPayload;
      updatedOverrides[progId][`cycle_${cDay}`] = dayPayload;
    }
  }

  return {
    updatedOverrides,
    stats: {
      totalProgramsCleaned: programIds.length,
      totalDaysReset,
      totalMismatchesRemoved,
      removedDetails
    }
  };
}
