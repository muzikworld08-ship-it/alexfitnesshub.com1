// Known exercise aliases and program mappings
const EXERCISE_ALIASES: Record<string, string> = {
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
  "explosive squat jumps": "jump squats",
  "plyometric split jump lunges": "jump squats",
  "prone superman holds": "prone superman holds",
  "dumbbell pullover": "single-arm lat prayer (cable pullover)",
  "lying leg curls": "leg curl",
  "sumo deadlift": "deadlift",
  "dumbbell step-ups": "step ups with knee drive",
  "bodyweight chair / sofa dips": "dips",
  "chair dips": "dips",
  "sofa dips": "dips"
};

/**
 * Normalizes an exercise name or ID by lowercasing, stripping prefixes, 
 * removing parentheticals, and reducing whitespace.
 */
function cleanExerciseString(str: string): string {
  return str
    .toLowerCase()
    .replace(/^exercise[-_]/, "")
    .replace(/^exercise/, "")
    .replace(/\([^)]*\)/g, "") // remove parentheticals like (feet soles together)
    .replace(/[^a-z0-9\s]/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Utility for robust exercise matching across names and IDs.
 * Handles singular/plural variations, program aliases, and prefix differences.
 */
export function isExerciseMatch(
  targetIdOrName?: string | null,
  candidateIdOrName?: string | null
): boolean {
  if (!targetIdOrName || !candidateIdOrName) return false;

  const targetRaw = targetIdOrName.toLowerCase().trim();
  const candidateRaw = candidateIdOrName.toLowerCase().trim();

  if (targetRaw === candidateRaw) return true;

  // Direct alias check
  const aliasTarget = EXERCISE_ALIASES[targetRaw];
  if (aliasTarget && (aliasTarget === candidateRaw || candidateRaw.includes(aliasTarget))) return true;

  const aliasCand = EXERCISE_ALIASES[candidateRaw];
  if (aliasCand && (aliasCand === targetRaw || targetRaw.includes(aliasCand))) return true;

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

  // Exact normalized match (e.g. "push-ups" vs "pushups" or "push ups")
  if (normTarget === normCandidate) return true;

  // Singular / Plural variation (e.g. "pushup" vs "pushups" or "squat" vs "squats")
  if (normTarget + "s" === normCandidate || normTarget === normCandidate + "s") return true;

  // Substring inclusion when one is fully contained in the other (e.g. "frog pump" in "frog pump glute burner")
  if (
    (cleanTarget.length >= 6 && cleanCandidate.includes(cleanTarget)) ||
    (cleanCandidate.length >= 6 && cleanTarget.includes(cleanCandidate))
  ) {
    return true;
  }

  return false;
}

const matchingExerciseCache = new Map<string, any>();

/**
 * Finds the exact or best matching exercise from an array of exercises.
 */
export function findMatchingExercise<T extends { id: string; name: string }>(
  exercises: T[],
  exerciseId?: string | null,
  exerciseName?: string | null
): T | undefined {
  if (!exercises || exercises.length === 0) return undefined;

  const cacheKey = `${exerciseId || ""}:::${exerciseName || ""}:::${exercises.length}`;
  if (matchingExerciseCache.has(cacheKey)) {
    return matchingExerciseCache.get(cacheKey);
  }

  // 1. Direct ID exact match
  if (exerciseId) {
    const trimmedId = exerciseId.toLowerCase().trim();
    const directId = exercises.find(ex => ex.id.toLowerCase() === trimmedId);
    if (directId) {
      matchingExerciseCache.set(cacheKey, directId);
      return directId;
    }
  }

  // 2. Direct Name exact match
  if (exerciseName) {
    const trimmedName = exerciseName.toLowerCase().trim();
    const directName = exercises.find(ex => ex.name.toLowerCase() === trimmedName);
    if (directName) {
      matchingExerciseCache.set(cacheKey, directName);
      return directName;
    }
  }

  // 3. Check alias resolution first
  const aliasResolved = EXERCISE_ALIASES[exerciseName?.toLowerCase().trim() || ""] ||
                        EXERCISE_ALIASES[exerciseId?.toLowerCase().trim() || ""];
  if (aliasResolved) {
    const aliasMatch = exercises.find(ex => 
      ex.name.toLowerCase().includes(aliasResolved) || 
      ex.id.toLowerCase().includes(aliasResolved) ||
      isExerciseMatch(aliasResolved, ex.name)
    );
    if (aliasMatch) {
      matchingExerciseCache.set(cacheKey, aliasMatch);
      return aliasMatch;
    }
  }

  // 4. Normalized ID / Name match using isExerciseMatch
  for (const ex of exercises) {
    if (exerciseId && (isExerciseMatch(exerciseId, ex.id) || isExerciseMatch(exerciseId, ex.name))) {
      matchingExerciseCache.set(cacheKey, ex);
      return ex;
    }
    if (exerciseName && (isExerciseMatch(exerciseName, ex.name) || isExerciseMatch(exerciseName, ex.id))) {
      matchingExerciseCache.set(cacheKey, ex);
      return ex;
    }
  }

  // 5. Stemmed token overlap match (handles "Frog Pump" matching "Frog Pump Glute Burner")
  if (exerciseName) {
    const stemWord = (w: string) => w.replace(/(s|es|ing|ed)$/, "");
    const targetWords = cleanExerciseString(exerciseName)
      .split(/\s+/)
      .filter(w => w.length > 2)
      .map(stemWord);

    if (targetWords.length > 0) {
      let bestMatch: T | undefined = undefined;
      let highestOverlap = 0;

      for (const ex of exercises) {
        const candWords = cleanExerciseString(ex.name)
          .split(/\s+/)
          .filter(w => w.length > 2)
          .map(stemWord);

        const overlap = targetWords.filter(w => candWords.includes(w)).length;
        if (overlap > highestOverlap && overlap >= Math.min(2, targetWords.length)) {
          highestOverlap = overlap;
          bestMatch = ex;
        }
      }

      if (bestMatch) {
        matchingExerciseCache.set(cacheKey, bestMatch);
        return bestMatch;
      }
    }
  }

  matchingExerciseCache.set(cacheKey, undefined);
  return undefined;
}
