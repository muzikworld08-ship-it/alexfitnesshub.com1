/**
 * Utility for robust, strict exercise matching across names and IDs.
 * Prevents false-positive matches (e.g., matching "Push-ups" to "Diamond Push-ups", "Pike Push-ups", "Incline Push-ups").
 */
export function isExerciseMatch(
  targetIdOrName?: string | null,
  candidateIdOrName?: string | null
): boolean {
  if (!targetIdOrName || !candidateIdOrName) return false;

  const targetRaw = targetIdOrName.toLowerCase().trim();
  const candidateRaw = candidateIdOrName.toLowerCase().trim();

  if (targetRaw === candidateRaw) return true;

  // Helper to strip standard 'exercise-' or 'exercise_' prefix
  const stripPrefix = (str: string) => str.replace(/^exercise[-_]/, "").replace(/^exercise/, "");

  const cleanTarget = stripPrefix(targetRaw);
  const cleanCandidate = stripPrefix(candidateRaw);

  if (cleanTarget === cleanCandidate) return true;

  const normTarget = cleanTarget.replace(/[^a-z0-9]/g, "");
  const normCandidate = cleanCandidate.replace(/[^a-z0-9]/g, "");

  if (!normTarget || !normCandidate) return false;

  // Exact normalized match (e.g. "push-ups" vs "pushups" or "push ups")
  if (normTarget === normCandidate) return true;

  // Singular / Plural variation (e.g. "pushup" vs "pushups" or "squat" vs "squats")
  if (normTarget + "s" === normCandidate || normTarget === normCandidate + "s") return true;

  return false;
}

/**
 * Finds the exact or best matching exercise from an array of exercises.
 */
export function findMatchingExercise<T extends { id: string; name: string }>(
  exercises: T[],
  exerciseId?: string | null,
  exerciseName?: string | null
): T | undefined {
  if (!exercises || exercises.length === 0) return undefined;

  // 1. Direct ID exact match
  if (exerciseId) {
    const directId = exercises.find(ex => ex.id.toLowerCase() === exerciseId.toLowerCase().trim());
    if (directId) return directId;
  }

  // 2. Direct Name exact match
  if (exerciseName) {
    const directName = exercises.find(ex => ex.name.toLowerCase() === exerciseName.toLowerCase().trim());
    if (directName) return directName;
  }

  // 3. Normalized ID / Name match using isExerciseMatch
  for (const ex of exercises) {
    if (exerciseId && (isExerciseMatch(exerciseId, ex.id) || isExerciseMatch(exerciseId, ex.name))) {
      return ex;
    }
    if (exerciseName && (isExerciseMatch(exerciseName, ex.name) || isExerciseMatch(exerciseName, ex.id))) {
      return ex;
    }
  }

  // 4. Token overlap match (e.g., "Incline Dumbbell Press" vs "Incline Dumbbell Bench Press")
  if (exerciseName) {
    const targetWords = exerciseName.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(w => w.length > 2);
    if (targetWords.length > 0) {
      let bestMatch: T | undefined = undefined;
      let highestOverlap = 0;

      for (const ex of exercises) {
        const candWords = ex.name.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(w => w.length > 2);
        const overlap = targetWords.filter(w => candWords.includes(w)).length;
        if (overlap > highestOverlap && overlap >= Math.min(2, targetWords.length)) {
          highestOverlap = overlap;
          bestMatch = ex;
        }
      }

      if (bestMatch) return bestMatch;
    }
  }

  return undefined;
}
