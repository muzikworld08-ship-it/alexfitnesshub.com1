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

  if (!cleanName) {
    return {
      name: "",
      gifUrl: "",
      muscleGroup: targetCat
    };
  }

  const cleanLower = cleanName.toLowerCase();

  // If caller explicitly cleared the media, honor it immediately without resurrecting
  if (fallbackGifUrl === "none" || fallbackGifUrl === "deleted" || fallbackGifUrl === "null") {
    return {
      name: cleanName,
      gifUrl: "",
      muscleGroup: targetCat
    };
  }

  // Check if exercise has been deleted by admin
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const deletedRaw = window.localStorage.getItem("fit_deleted_exercises");
      if (deletedRaw) {
        const deletedArr = JSON.parse(deletedRaw);
        if (Array.isArray(deletedArr) && (deletedArr.includes(cleanName) || deletedArr.includes(cleanLower))) {
          return {
            name: cleanName,
            gifUrl: "",
            muscleGroup: targetCat
          };
        }
      }
    } catch {}
  }

  // 1. Check custom exercise overrides in localStorage FIRST (admin custom GIF overrides take highest precedence)
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const overridesRaw = window.localStorage.getItem("fit_custom_exercise_overrides");
      if (overridesRaw) {
        const overridesObj = JSON.parse(overridesRaw);
        const directOverride = overridesObj[cleanName] || overridesObj[cleanLower] || Object.values(overridesObj).find((o: any) => o?.name && o.name.toLowerCase().trim() === cleanLower);
        if (directOverride) {
          const customUrl = directOverride.customMediaUrl ?? directOverride.gifUrl ?? directOverride.imageUrl;
          if (customUrl === "none" || customUrl === "deleted" || customUrl === "" || directOverride.isDeleted) {
            return {
              name: cleanName,
              gifUrl: "",
              muscleGroup: directOverride.category || targetCat
            };
          }
          if (customUrl) {
            return {
              name: cleanName,
              gifUrl: customUrl,
              muscleGroup: directOverride.category || targetCat
            };
          }
        }
      }
    } catch {}

    try {
      const stored = window.localStorage.getItem("fit_exercises");
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) {
          const match = list.find((e: any) => {
            if (!e.name) return false;
            return cleanLower === e.name.toLowerCase().trim() ||
                   isExerciseMatch(cleanName, e.name) || 
                   cleanLower.includes(e.name.toLowerCase()) || 
                   e.name.toLowerCase().includes(cleanLower);
          });
          if (match) {
            if (match.category) targetCat = match.category;
            const candidateMedia = match.customMediaUrl || match.gifUrl || match.imageUrl;
            if (candidateMedia) {
              return {
                name: cleanName,
                gifUrl: candidateMedia,
                muscleGroup: targetCat
              };
            }
          }
        }
      }
    } catch {}
  }

  // 2. If fallbackGifUrl was explicitly supplied, preserve it
  if (fallbackGifUrl) {
    return {
      name: cleanName,
      gifUrl: fallbackGifUrl,
      muscleGroup: targetCat
    };
  }

  // 3. Check Canonical Exercises database for exact authentic GIF match or alias match
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
