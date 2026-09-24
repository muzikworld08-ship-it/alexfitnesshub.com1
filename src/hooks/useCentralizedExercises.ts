import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { EXERCISES, Exercise } from "../data/exercises";

let cachedRawList: Exercise[] | null = null;
let cachedDeduplicated: Exercise[] | null = null;

function getCachedDeduplicatedExercises(rawList: Exercise[]): Exercise[] {
  if (cachedRawList === rawList && cachedDeduplicated) {
    return cachedDeduplicated;
  }
  const seen = new Set<string>();
  const deduplicated: Exercise[] = [];
  for (const ex of rawList) {
    const clean = ex.name.toLowerCase().trim();
    if (seen.has(clean) || seen.has(ex.id)) continue;
    seen.add(clean);
    seen.add(ex.id);
    deduplicated.push(ex);
  }
  cachedRawList = rawList;
  cachedDeduplicated = deduplicated;
  return deduplicated;
}

export function useCentralizedExercises(): { exercises: Exercise[]; loading: boolean; error: Error | null } {
  let rawList: Exercise[] = EXERCISES;
  try {
    const { exercises } = useApp();
    if (exercises && exercises.length > 0) {
      rawList = exercises;
    }
  } catch (err) {
    // Fallback if rendered outside AppContext
  }

  const exercises = useMemo(() => getCachedDeduplicatedExercises(rawList), [rawList]);

  return { exercises, loading: false, error: null };
}

export default useCentralizedExercises;
