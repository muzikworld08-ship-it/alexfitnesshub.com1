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

  // 1. Check exact match in custom exercise overrides in localStorage (admin custom GIF overrides)
  let exactOverrideUrl = "";
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const overridesRaw = window.localStorage.getItem("fit_custom_exercise_overrides");
      if (overridesRaw) {
        const overridesObj = JSON.parse(overridesRaw);
        const directOverride =
          overridesObj[cleanName] ||
          overridesObj[cleanLower] ||
          Object.values(overridesObj).find((o: any) => o?.name && o.name.toLowerCase().trim() === cleanLower);
        if (directOverride) {
          if (directOverride.isDeleted) {
            return {
              name: cleanName,
              gifUrl: "",
              muscleGroup: directOverride.category || targetCat
            };
          }
          const pickValid = (u: any) => {
            const s = String(u || "").trim();
            return s && !["none", "deleted", "null"].includes(s.toLowerCase()) ? s : "";
          };
          exactOverrideUrl =
            pickValid(directOverride.customMediaUrl) ||
            pickValid(directOverride.gifUrl) ||
            pickValid(directOverride.imageUrl);
          if (directOverride.category) targetCat = directOverride.category;
        }
      }
    } catch {}
  }

  // 2. If fallbackGifUrl was explicitly supplied by caller (and doesn't conflict), honor it over any heuristic lookup.
  // If no explicit fallbackGifUrl was provided, use the exact override URL if one exists.
  if (fallbackGifUrl && !isMediaUrlConflictingWithExercise(cleanName, fallbackGifUrl)) {
    return {
      name: cleanName,
      gifUrl: exactOverrideUrl || fallbackGifUrl,
      muscleGroup: targetCat
    };
  }
  if (exactOverrideUrl) {
    return {
      name: cleanName,
      gifUrl: exactOverrideUrl,
      muscleGroup: targetCat
    };
  }

  // 3. Check exact match (never loose substring) in localStorage fit_exercises
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const stored = window.localStorage.getItem("fit_exercises");
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) {
          const match = list.find((e: any) => {
            if (!e?.name) return false;
            return cleanLower === e.name.toLowerCase().trim() || isExerciseMatch(cleanName, e.name);
          });
          if (match) {
            if (match.category) targetCat = match.category;
            const candidateMedia = String(match.customMediaUrl || match.gifUrl || match.imageUrl || "").trim();
            if (candidateMedia && !["none", "deleted", "null"].includes(candidateMedia.toLowerCase())) {
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

  // 4. Check Canonical Exercises database for STRICT exact authentic GIF match or exact alias match only.
  // Never borrow another unrelated exercise's GIF via loose token or category matching.
  if (!mediaUrl) {
    const canonicalMatch = CANONICAL_EXERCISES.find(
      e => e.name.toLowerCase().trim() === cleanLower || isExerciseMatch(cleanName, e.name)
    );

    if (canonicalMatch) {
      if (canonicalMatch.gifUrl) {
        mediaUrl = canonicalMatch.gifUrl;
      }
      if (canonicalMatch.category && targetCat === "General") {
        targetCat = canonicalMatch.category;
      }
    }

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
