import { CANONICAL_EXERCISES } from "./canonicalExercises";
import { 
  isExerciseMatch, 
  areExercisesConflicting, 
  isMediaUrlConflictingWithExercise 
} from "../utils/exerciseMatching";

export interface RawExerciseItem {
  name: string;
  target: string;
  muscle_group: string;
  secondary_muscles: string[];
  gif_url: string;
}

export interface AuthenticExerciseInfo {
  name: string;
  gifUrl: string;
  target?: string;
  muscleGroup?: string;
}

/**
 * Converts exercise names to clean Title Case.
 */
export function toAccurateTitleCase(str: string): string {
  if (!str) return "";
  return str
    .split(/[\s-]+/)
    .map(w => {
      if (w.toLowerCase() === "and" || w.toLowerCase() === "or" || w.toLowerCase() === "with") return w.toLowerCase();
      if (w.toLowerCase() === "1rm") return "1RM";
      if (w.toLowerCase() === "rdl") return "RDL";
      if (w.toLowerCase() === "ez") return "EZ";
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Resolves exercise info cleanly based on the exercise's actual configured name and media.
 * Checks authoritative Canonical Exercises and Admin-added exercises in storage.
 * Strictly guarantees that no exercise ever receives a conflicting GIF (e.g. bench press for back squat).
 */
export function resolveAuthenticExercise(
  name: string,
  fallbackGifUrl: string = "",
  category: string = ""
): AuthenticExerciseInfo {
  const cleanName = (name || "").trim();
  let mediaUrl = fallbackGifUrl || "";
  let targetCat = category || "General";

  // 1. Check Canonical Exercises database for exact authentic GIF match
  const canonicalMatch = CANONICAL_EXERCISES.find(e => 
    e.name.toLowerCase().trim() === cleanName.toLowerCase() ||
    isExerciseMatch(cleanName, e.name)
  );

  if (canonicalMatch) {
    if (canonicalMatch.gifUrl) {
      mediaUrl = canonicalMatch.gifUrl;
    }
    if (canonicalMatch.category) {
      targetCat = canonicalMatch.category;
    }
  }

  // 2. If fallbackGifUrl was provided, only keep it if it does NOT conflict with cleanName
  if (fallbackGifUrl && isMediaUrlConflictingWithExercise(cleanName, fallbackGifUrl)) {
    // Discard conflicting media (e.g. bench press GIF for back squat)
    mediaUrl = canonicalMatch?.gifUrl || "";
  }

  // 3. Check active Admin-added exercises in localStorage
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const stored = window.localStorage.getItem("fit_exercises");
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) {
          const match = list.find((e: any) => {
            if (!e.name) return false;
            // Never match an exercise with a conflicting name
            if (areExercisesConflicting(cleanName, e.name)) return false;
            return isExerciseMatch(cleanName, e.name);
          });
          if (match) {
            const candidateMedia = match.customMediaUrl || match.gifUrl || match.imageUrl;
            if (candidateMedia && !isMediaUrlConflictingWithExercise(cleanName, candidateMedia)) {
              mediaUrl = candidateMedia;
            }
            if (match.category) targetCat = match.category;
          }
        }
      }
    } catch {}
  }

  // 4. Final safety check: if mediaUrl still conflicts with cleanName, fallback to canonical
  if (mediaUrl && isMediaUrlConflictingWithExercise(cleanName, mediaUrl)) {
    mediaUrl = canonicalMatch?.gifUrl || "";
  }

  return {
    name: cleanName,
    gifUrl: mediaUrl,
    muscleGroup: targetCat
  };
}

export default resolveAuthenticExercise;
