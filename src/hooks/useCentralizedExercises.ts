import { useApp } from "../context/AppContext";
import { EXERCISES, Exercise } from "../data/exercises";

export function useCentralizedExercises(): { exercises: Exercise[]; loading: boolean; error: Error | null } {
  try {
    const { exercises } = useApp();
    if (exercises && exercises.length > 0) {
      return { exercises, loading: false, error: null };
    }
  } catch (err) {
    // Fallback if rendered outside AppContext
  }
  return { exercises: EXERCISES, loading: false, error: null };
}

export default useCentralizedExercises;
