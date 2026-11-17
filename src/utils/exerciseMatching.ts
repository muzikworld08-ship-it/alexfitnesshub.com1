// Known exercise aliases: strictly spelling/formatting variations only. Never alias one exercise into a different exercise!
const EXERCISE_ALIASES: Record<string, string> = {
  // Chest & Press
  "push-up": "strict calisthenic push-ups",
  "push-ups": "strict calisthenic push-ups",
  "push up": "strict calisthenic push-ups",
  "push ups": "strict calisthenic push-ups",
  "pushup": "strict calisthenic push-ups",
  "pushups": "strict calisthenic push-ups",
  "tempo push-ups": "strict calisthenic push-ups",
  "3-second eccentric tempo push-ups": "strict calisthenic push-ups",
  "diamond push-ups": "close-grip diamond push-ups",
  "diamond push up": "close-grip diamond push-ups",
  "diamond pushups": "close-grip diamond push-ups",
  "incline push-ups": "incline calisthenic push-ups",
  "decline push-ups": "decline upper chest push-ups",
  "bench press": "barbell flat bench press",
  "flat bench press": "barbell flat bench press",
  "barbell bench press": "barbell flat bench press",
  "incline bench press": "incline dumbbell bench press",
  "incline dumbbell press": "incline dumbbell bench press",
  "incline press": "incline dumbbell bench press",
  "pec deck": "pec deck machine flyes",
  "chest flyes": "cable standing chest flyes",
  "chest dips": "parallel bar chest dips",
  "dips": "parallel bar chest dips",

  // Core & Abs
  "plank": "isometric forearm plank",
  "forearm plank": "isometric forearm plank",
  "plank hold": "isometric forearm plank",
  "russian twist": "seated russian twists",
  "russian twists": "seated russian twists",
  "bicycle crunch": "bicycle crunches",
  "bicycle crunches": "bicycle crunches",
  "mountain climbers": "high-tempo mountain climbers",
  "mountain climber": "high-tempo mountain climbers",
  "burpee": "full body conditioning burpees",
  "burpees": "full body conditioning burpees",
  "hanging leg raises": "hanging knee / leg raises",
  "leg raises": "hanging knee / leg raises",
  "knee raises": "hanging knee / leg raises",

  // Legs & Glutes
  "squat": "bodyweight deep air squats",
  "squats": "bodyweight deep air squats",
  "air squat": "bodyweight deep air squats",
  "air squats": "bodyweight deep air squats",
  "bodyweight squat": "bodyweight deep air squats",
  "bodyweight squats": "bodyweight deep air squats",
  "back squat": "barbell back squat",
  "barbell squat": "barbell back squat",
  "glute bridge": "supine kinetic glute bridges",
  "glute bridges": "supine kinetic glute bridges",
  "lunges": "dumbbell walking lunges",
  "lunge": "dumbbell walking lunges",
  "walking lunges": "dumbbell walking lunges",
  "bulgarian split squat": "bodyweight bulgarian split squats",
  "bulgarian split squats": "bodyweight bulgarian split squats",
  "split squat": "bodyweight bulgarian split squats",
  "split squats": "bodyweight bulgarian split squats",
  "wall sit": "isometric quad wall sit",
  "leg press": "45-degree leg press machine",
  "calf raise": "standing calf raises",
  "calf raises": "standing calf raises",
  "standing calf raise": "standing calf raises",

  // Back & Pull
  "pull up": "bodyweight pull-ups",
  "pull ups": "bodyweight pull-ups",
  "pullup": "bodyweight pull-ups",
  "pullups": "bodyweight pull-ups",
  "chin up": "bodyweight pull-ups",
  "chin-up": "bodyweight pull-ups",
  "lat pulldown": "lat pulldown (wide grip)",
  "wide grip lat pulldown": "lat pulldown (wide grip)",
  "seated row": "seated cable row",
  "cable row": "seated cable row",
  "bent over row": "barbell bent-over row",
  "barbell row": "barbell bent-over row",
  "rdl": "romanian deadlift (rdl)",
  "romanian deadlift": "romanian deadlift (rdl)",

  // Arms & Shoulders
  "bicep curl": "standing dumbbell biceps curls",
  "bicep curls": "standing dumbbell biceps curls",
  "dumbbell curl": "standing dumbbell biceps curls",
  "dumbbell curls": "standing dumbbell biceps curls",
  "hammer curl": "incline dumbbell hammer curls",
  "hammer curls": "incline dumbbell hammer curls",
  "triceps pushdown": "triceps cable rope pushdown",
  "cable pushdown": "triceps cable rope pushdown",
  "rope pushdown": "triceps cable rope pushdown",
  "skull crushers": "ez-bar lying skull crushers",
  "skull crusher": "ez-bar lying skull crushers",
  "triceps extension": "seated overhead dumbbell triceps extension",
  "bench dips": "chair / bench triceps dips",
  "chair dips": "chair / bench triceps dips",
  "military press": "barbell overhead military press",
  "overhead press": "barbell overhead military press",
  "shoulder press": "barbell overhead military press",
  "lateral raise": "standing dumbbell lateral raises",
  "lateral raises": "standing dumbbell lateral raises",
  "side lateral raise": "standing dumbbell lateral raises",

  // Mobility & Warmup
  "cat-cow": "cat-cow dynamic spine flow",
  "cat cow": "cat-cow dynamic spine flow",
  "cat-cow dynamic breathing flow": "cat-cow dynamic spine flow",
  "cat cow dynamic breathing flow": "cat-cow dynamic spine flow",
  "primal cat-cow spinal waves": "cat-cow dynamic spine flow",
  "child's pose": "child's pose deep breathing reset",
  "childs pose": "child's pose deep breathing reset",
  "cobra pose": "downward dog to cobra flow",
  "cobra": "downward dog to cobra flow",
  "world's greatest stretch": "world's greatest thoracic stretch",
  "quad stretch": "standing quadriceps & hip stretch",
  "figure 4 stretch": "supine figure-4 glute stretch",
  "figure-4 stretch": "supine figure-4 glute stretch"
};

/**
 * Normalizes an exercise name or ID by lowercasing, stripping file extensions, prefixes, 
 * removing parentheticals, and reducing whitespace.
 */
function cleanExerciseString(str: string): string {
  return str
    .toLowerCase()
    .replace(/\.(gif|mp4|webm|png|jpe?g|webp|mov)$/i, "") // strip file extensions from uploaded media
    .replace(/^exercise[-_]/, "")
    .replace(/^exercise/, "")
    .replace(/\([^)]*\)/g, "") // remove parentheticals like (feet soles together)
    .replace(/[^a-z0-9\s]/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Utility for robust exercise matching across names and IDs.
 * Handles singular/plural variations and clean spelling differences without cross-exercise collisions.
 */
export function isExerciseMatch(
  targetIdOrName?: string | null,
  candidateIdOrName?: string | null
): boolean {
  if (!targetIdOrName || !candidateIdOrName) return false;

  const targetRaw = targetIdOrName.toLowerCase().trim();
  const candidateRaw = candidateIdOrName.toLowerCase().trim();

  if (targetRaw === candidateRaw) return true;

  // Direct alias check (strict equality only - NEVER substring .includes)
  const aliasTarget = EXERCISE_ALIASES[targetRaw];
  if (aliasTarget && aliasTarget === candidateRaw) return true;

  const aliasCand = EXERCISE_ALIASES[candidateRaw];
  if (aliasCand && aliasCand === targetRaw) return true;

  const cleanTarget = cleanExerciseString(targetRaw);
  const cleanCandidate = cleanExerciseString(candidateRaw);

  if (cleanTarget === cleanCandidate) return true;

  // Check alias on cleaned strings
  if (EXERCISE_ALIASES[cleanTarget] === cleanCandidate || EXERCISE_ALIASES[cleanCandidate] === cleanTarget) {
    return true;
  }

  const normTarget = cleanTarget.replace(/\s+/g, "");
  const normCandidate = cleanCandidate.replace(/\s+/g, "");

  if (!normTarget || !normCandidate) return false;

  // Exact normalized match (e.g. "push-ups" vs "pushups" or "push ups" or "facepull" vs "face pull")
  if (normTarget === normCandidate) return true;

  // Singular / Plural variation (e.g. "pushup" vs "pushups" or "facepull" vs "facepulls")
  if (normTarget + "s" === normCandidate || normTarget === normCandidate + "s") return true;

  // No loose substring or partial matching: exercises must strictly match their authentic identity
  return false;
}

/**
 * Checks if two exercise names fundamentally conflict in their biomechanical category
 * (e.g. Chest/Bench vs Leg/Squat). Prevents cross-contamination where a squat gets a bench press GIF.
 */
export function areExercisesConflicting(nameA?: string | null, nameB?: string | null): boolean {
  if (!nameA || !nameB) return false;
  const a = nameA.toLowerCase().trim();
  const b = nameB.toLowerCase().trim();
  if (a === b) return false;

  const isSquatOrLegA = /\b(squat|squats|lunge|lunges|quad|quads|hamstring|leg\s*press|calf|calves)\b/i.test(a);
  const isSquatOrLegB = /\b(squat|squats|lunge|lunges|quad|quads|hamstring|leg\s*press|calf|calves)\b/i.test(b);

  const isBenchOrChestA = /\b(bench|bench\s*press|chest|chest\s*press|pushup|pushups|push-up|push-ups|pec\s*fly|chest\s*dip)\b/i.test(a);
  const isBenchOrChestB = /\b(bench|bench\s*press|chest|chest\s*press|pushup|pushups|push-up|push-ups|pec\s*fly|chest\s*dip)\b/i.test(b);

  const isBackOrPullA = /\b(deadlift|deadlifts|pullup|pullups|pull-up|pull-ups|lat\s*pulldown|row|rows|bent\s*over\s*row)\b/i.test(a);
  const isBackOrPullB = /\b(deadlift|deadlifts|pullup|pullups|pull-up|pull-ups|lat\s*pulldown|row|rows|bent\s*over\s*row)\b/i.test(b);

  const isShoulderA = /\b(military\s*press|shoulder\s*press|overhead\s*press|lateral\s*raise|front\s*raise)\b/i.test(a);
  const isShoulderB = /\b(military\s*press|shoulder\s*press|overhead\s*press|lateral\s*raise|front\s*raise)\b/i.test(b);

  // Cross-category collisions are strictly forbidden
  if (isSquatOrLegA && isBenchOrChestB) return true;
  if (isBenchOrChestA && isSquatOrLegB) return true;

  if (isSquatOrLegA && isBackOrPullB && !a.includes("deadlift") && !b.includes("deadlift")) return true;
  if (isBackOrPullA && isSquatOrLegB && !a.includes("deadlift") && !b.includes("deadlift")) return true;

  if (isBenchOrChestA && isBackOrPullB) return true;
  if (isBackOrPullA && isBenchOrChestB) return true;

  if (isSquatOrLegA && isShoulderB) return true;
  if (isShoulderA && isSquatOrLegB) return true;

  // Dead bug is a supine core drill and must never match a deadlift or bicycle crunch
  if ((a.includes("dead bug") || a.includes("deadbug")) && (b.includes("deadlift") || b.includes("bicycle"))) return true;
  if ((b.includes("dead bug") || b.includes("deadbug")) && (a.includes("deadlift") || a.includes("bicycle"))) return true;

  // Face pull is a rear-delt/upper-back exercise and must never match triceps pushdown
  if ((a.includes("face pull") || a.includes("facepull")) && (b.includes("tricep") || b.includes("pushdown"))) return true;
  if ((b.includes("face pull") || b.includes("facepull")) && (a.includes("tricep") || a.includes("pushdown"))) return true;

  return false;
}

/**
 * Validates that a media/GIF URL doesn't belong to a conflicting exercise.
 * e.g. prevents a URL with "BARBELL-BENCH-PRESS.gif" from being attached to a "Back Squat".
 */
export function isMediaUrlConflictingWithExercise(exerciseName: string, mediaUrl?: string | null): boolean {
  if (!exerciseName || !mediaUrl) return false;
  const name = exerciseName.toLowerCase().trim();
  const url = mediaUrl.toLowerCase().trim();

  const isSquat = /\b(squat|squats)\b/i.test(name);
  if (isSquat && (url.includes("bench-press") || url.includes("bench_press") || url.includes("bench") || url.includes("pec-deck") || url.includes("push-up"))) {
    return true;
  }

  const isBench = /\b(bench|bench\s*press)\b/i.test(name);
  if (isBench && (url.includes("squat") || url.includes("lunge") || url.includes("leg-press") || url.includes("deadlift"))) {
    return true;
  }

  if (/\b(face\s*pull|facepull)\b/i.test(name) && (url.includes("pushdown") || url.includes("tricep"))) {
    return true;
  }

  return false;
}

interface ExerciseLookupIndex<T extends { id: string; name: string }> {
  byExactLowerName: Map<string, T>;
  byExactLowerId: Map<string, T>;
  byCleanName: Map<string, T>;
  byNormName: Map<string, T>;
  byCleanId: Map<string, T>;
  byNormId: Map<string, T>;
}

const EXERCISE_INDEX_CACHE = new WeakMap<readonly any[], ExerciseLookupIndex<any>>();

function getExerciseLookupIndex<T extends { id: string; name: string }>(exercises: T[]): ExerciseLookupIndex<T> {
  const cached = EXERCISE_INDEX_CACHE.get(exercises);
  if (cached) return cached;

  const index: ExerciseLookupIndex<T> = {
    byExactLowerName: new Map(),
    byExactLowerId: new Map(),
    byCleanName: new Map(),
    byNormName: new Map(),
    byCleanId: new Map(),
    byNormId: new Map()
  };

  for (const ex of exercises) {
    if (!ex) continue;
    const nameLower = (ex.name || "").toLowerCase().trim();
    const idLower = (ex.id || "").toLowerCase().trim();

    if (nameLower) {
      if (!index.byExactLowerName.has(nameLower)) index.byExactLowerName.set(nameLower, ex);
      const cleanN = cleanExerciseString(nameLower);
      if (cleanN && !index.byCleanName.has(cleanN)) index.byCleanName.set(cleanN, ex);
      const normN = cleanN.replace(/\s+/g, "");
      if (normN && !index.byNormName.has(normN)) index.byNormName.set(normN, ex);
    }

    if (idLower) {
      if (!index.byExactLowerId.has(idLower)) index.byExactLowerId.set(idLower, ex);
      const cleanI = cleanExerciseString(idLower);
      if (cleanI && !index.byCleanId.has(cleanI)) index.byCleanId.set(cleanI, ex);
      const normI = cleanI.replace(/\s+/g, "");
      if (normI && !index.byNormId.has(normI)) index.byNormId.set(normI, ex);
    }
  }

  EXERCISE_INDEX_CACHE.set(exercises, index);
  return index;
}

/**
 * Finds the exact matching exercise from an array of exercises in O(1) amortized time.
 * Strictly avoids cross-exercise collisions so an exercise never mutates into a different name or GIF.
 */
export function findMatchingExercise<T extends { id: string; name: string }>(
  exercises: T[],
  exerciseId?: string | null,
  exerciseName?: string | null
): T | undefined {
  if (!exercises || exercises.length === 0) return undefined;

  const cleanName = exerciseName?.trim();
  const cleanId = exerciseId?.trim();
  const idx = getExerciseLookupIndex(exercises);

  // 1. Direct Name exact match (Highest Priority: human exercise name is ground truth)
  if (cleanName) {
    const nameLower = cleanName.toLowerCase();
    const directName = idx.byExactLowerName.get(nameLower);
    if (directName) {
      return directName;
    }

    const aliasFromTarget = EXERCISE_ALIASES[nameLower];
    if (aliasFromTarget) {
      const aliasExact = idx.byExactLowerName.get(aliasFromTarget);
      if (aliasExact && !areExercisesConflicting(cleanName, aliasExact.name)) {
        return aliasExact;
      }
    }

    const cleanTarget = cleanExerciseString(nameLower);
    const normTarget = cleanTarget.replace(/\s+/g, "");
    const fastNameMatch =
      idx.byCleanName.get(cleanTarget) ||
      (normTarget ? (idx.byNormName.get(normTarget) || idx.byNormName.get(normTarget + "s") || (normTarget.endsWith("s") ? idx.byNormName.get(normTarget.slice(0, -1)) : undefined)) : undefined);
    if (fastNameMatch && !areExercisesConflicting(cleanName, fastNameMatch.name) && isExerciseMatch(cleanName, fastNameMatch.name)) {
      return fastNameMatch;
    }

    const matchByName = exercises.find(ex => isExerciseMatch(cleanName, ex.name));
    if (matchByName && !areExercisesConflicting(cleanName, matchByName.name)) {
      return matchByName;
    }
  }

  // 2. Direct ID match - BUT ONLY if it does not conflict with cleanName!
  if (cleanId) {
    const trimmedId = cleanId.toLowerCase();
    const directId = idx.byExactLowerId.get(trimmedId);
    if (directId) {
      // If exerciseName was provided, NEVER return an exercise with a conflicting name!
      if (!cleanName || (!areExercisesConflicting(cleanName, directId.name) && isExerciseMatch(cleanName, directId.name))) {
        return directId;
      }
    }

    // 3. Normalized ID match with non-conflicting constraint
    const cleanTargetId = cleanExerciseString(trimmedId);
    const normTargetId = cleanTargetId.replace(/\s+/g, "");
    const fastIdMatch =
      idx.byCleanId.get(cleanTargetId) ||
      (normTargetId ? (idx.byNormId.get(normTargetId) || idx.byNormId.get(normTargetId + "s") || (normTargetId.endsWith("s") ? idx.byNormId.get(normTargetId.slice(0, -1)) : undefined)) : undefined);
    if (fastIdMatch && isExerciseMatch(cleanId, fastIdMatch.id)) {
      if (!cleanName || (!areExercisesConflicting(cleanName, fastIdMatch.name) && isExerciseMatch(cleanName, fastIdMatch.name))) {
        return fastIdMatch;
      }
    }
  }

  // 4. Check explicit alias resolution for name/id
  if (cleanName) {
    const aliasResolved = EXERCISE_ALIASES[cleanName.toLowerCase()] || EXERCISE_ALIASES[cleanId?.toLowerCase() || ""];
    if (aliasResolved) {
      const aliasDirect = idx.byExactLowerName.get(aliasResolved);
      if (aliasDirect && !areExercisesConflicting(cleanName, aliasDirect.name)) {
        return aliasDirect;
      }
      const aliasMatch = exercises.find(ex =>
        ex.name.toLowerCase().trim() === aliasResolved ||
        isExerciseMatch(aliasResolved, ex.name)
      );
      if (aliasMatch && !areExercisesConflicting(cleanName, aliasMatch.name)) {
        return aliasMatch;
      }
    }
  }

  return undefined;
}
