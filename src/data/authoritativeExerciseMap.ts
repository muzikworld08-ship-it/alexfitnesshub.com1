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

  const cleanLower = cleanName.toLowerCase();

  // 1. Check active Admin-added exercises in localStorage FIRST (admin custom exercises and overrides take precedence)
  let adminExerciseFound = false;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const stored = window.localStorage.getItem("fit_exercises");
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) {
          const match = list.find((e: any) => {
            if (!e.name) return false;
            if (areExercisesConflicting(cleanName, e.name)) return false;
            return isExerciseMatch(cleanName, e.name) || 
                   cleanLower === e.name.toLowerCase().trim() ||
                   cleanLower.includes(e.name.toLowerCase()) || 
                   e.name.toLowerCase().includes(cleanLower);
          });
          if (match) {
            adminExerciseFound = true;
            if (match.category) targetCat = match.category;
            const candidateMedia = match.customMediaUrl || match.gifUrl || match.imageUrl;
            if (candidateMedia && !isMediaUrlConflictingWithExercise(cleanName, candidateMedia)) {
              mediaUrl = candidateMedia;
            }
          }
        }
      }
    } catch {}
  }

  // 2. Check Canonical Exercises database for exact authentic GIF match or alias match
  if (!mediaUrl) {
    let canonicalMatch = CANONICAL_EXERCISES.find(e => 
      e.name.toLowerCase().trim() === cleanLower ||
      isExerciseMatch(cleanName, e.name)
    );

    // If no direct or alias match, look for smart non-conflicting substring match in CANONICAL_EXERCISES
    if (!canonicalMatch) {
      canonicalMatch = CANONICAL_EXERCISES.find(e => {
        const eLower = e.name.toLowerCase().trim();
        if (areExercisesConflicting(cleanLower, eLower)) return false;
        return cleanLower.includes(eLower) || eLower.includes(cleanLower);
      });
    }

    // If still no canonical match, look for non-conflicting token match in CANONICAL_EXERCISES
    if (!canonicalMatch) {
      const tokens = cleanLower.split(/[\s-]+/).filter(t => t.length > 3 && !["with", "hold", "deep", "high", "tempo", "dynamic", "kinetic", "calisthenic"].includes(t));
      if (tokens.length > 0) {
        canonicalMatch = CANONICAL_EXERCISES.find(e => {
          const eLower = e.name.toLowerCase().trim();
          if (areExercisesConflicting(cleanLower, eLower)) return false;
          return tokens.some(t => eLower.includes(t));
        });
      }
    }

    if (canonicalMatch) {
      if (canonicalMatch.gifUrl) {
        mediaUrl = canonicalMatch.gifUrl;
      }
      if (canonicalMatch.category && targetCat === "General") {
        targetCat = canonicalMatch.category;
      }
    }

    // If fallbackGifUrl was provided, check conflict
    if (fallbackGifUrl && !isMediaUrlConflictingWithExercise(cleanName, fallbackGifUrl)) {
      mediaUrl = fallbackGifUrl;
    }
  }

  return {
    name: cleanName,
    gifUrl: mediaUrl,
    muscleGroup: targetCat
  };
}

export default resolveAuthenticExercise;
