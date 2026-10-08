// Known exercise aliases: strictly spelling/formatting variations only. Never alias one exercise into a different exercise!
const EXERCISE_ALIASES: Record<string, string> = {
  "facepull": "face pulls",
  "facepulls": "face pulls",
  "face pull": "face pulls",
  "face-pull": "face pulls",
  "face-pulls": "face pulls",
  "cable face pull": "face pulls",
  "cable face pulls": "face pulls",
  "cable face pull with external rotation": "cable face pull with external rotation",
  "frog pumps": "frog pump glute burner",
  "frog pump": "frog pump glute burner",
  "frog pumps feet soles together": "frog pump glute burner",
  "wc_frog_pumps": "exercise-frog-pump-glute-burner",
  "cat-cow dynamic breathing flow": "primal cat-cow spinal waves",
  "cat cow dynamic breathing flow": "primal cat-cow spinal waves",
  "wc_cat_cow": "exercise-primal-cat-cow-spinal-waves",
  "child's pose spinal reach & decompression": "child's pose spinal reach",
  "childs pose spinal reach & decompression": "child's pose spinal reach",
  "banded clamshells with abduction": "banded clamshells with abduction",
  "banded clamshells": "banded clamshells with abduction",
  "clamshells": "banded clamshells with abduction",
  "3-second eccentric tempo push-ups": "push-ups",
  "tempo push-ups": "push-ups",
  "push up": "push-ups",
  "push ups": "push-ups",
  "pushup": "push-ups",
  "pushups": "push-ups",
  "pull up": "pull-ups",
  "pull ups": "pull-ups",
  "pullup": "pull-ups",
  "pullups": "pull-ups",
  "chest dip": "chest dips",
  "chest dips": "chest dips"
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

  return false;
}

/**
 * Finds the exact matching exercise from an array of exercises.
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

  // 1. Direct Name exact match (Highest Priority: human exercise name is ground truth)
  if (cleanName) {
    const directName = exercises.find(ex => ex.name.toLowerCase().trim() === cleanName.toLowerCase());
    if (directName) {
      return directName;
    }

    const matchByName = exercises.find(ex => isExerciseMatch(cleanName, ex.name));
    if (matchByName && !areExercisesConflicting(cleanName, matchByName.name)) {
      return matchByName;
    }
  }

  // 2. Direct ID match - BUT ONLY if it does not conflict with cleanName!
  if (cleanId) {
    const trimmedId = cleanId.toLowerCase();
    const directId = exercises.find(ex => ex.id.toLowerCase() === trimmedId);
    if (directId) {
      // If exerciseName was provided, NEVER return an exercise with a conflicting name!
      if (!cleanName || (!areExercisesConflicting(cleanName, directId.name) && isExerciseMatch(cleanName, directId.name))) {
        return directId;
      }
    }
  }

  // 3. Normalized ID match with non-conflicting constraint
  if (cleanId) {
    for (const ex of exercises) {
      if (isExerciseMatch(cleanId, ex.id)) {
        if (!cleanName || (!areExercisesConflicting(cleanName, ex.name) && isExerciseMatch(cleanName, ex.name))) {
          return ex;
        }
      }
    }
  }

  // 4. Check explicit alias resolution for name
  if (cleanName) {
    const aliasResolved = EXERCISE_ALIASES[cleanName.toLowerCase()] || EXERCISE_ALIASES[cleanId?.toLowerCase() || ""];
    if (aliasResolved) {
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
