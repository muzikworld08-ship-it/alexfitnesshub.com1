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

let cachedDeletedRaw: string | null = null;
let cachedDeletedSet = new Set<string>();

let cachedOverridesRaw: string | null = null;
let cachedOverridesObj: Record<string, any> = {};
let cachedOverridesByLowerName = new Map<string, any>();

let cachedExercisesRaw: string | null = null;
let cachedExercisesList: any[] = [];
let cachedExercisesByLowerName = new Map<string, any>();

export function getCachedExerciseStorageTables(): {
  deletedSet: Set<string>;
  overridesObj: Record<string, any>;
  overridesByLowerName: Map<string, any>;
  exercisesList: any[];
  exercisesByLowerName: Map<string, any>;
} {
  if (typeof window === "undefined" || !window.localStorage) {
    return {
      deletedSet: new Set<string>(),
      overridesObj: {},
      overridesByLowerName: new Map<string, any>(),
      exercisesList: [],
      exercisesByLowerName: new Map<string, any>()
    };
  }

  try {
    const delRaw = window.localStorage.getItem("fit_deleted_exercises");
    if (delRaw !== cachedDeletedRaw) {
      cachedDeletedRaw = delRaw;
      const nextDel = new Set<string>();
      if (delRaw) {
        const arr = JSON.parse(delRaw);
        if (Array.isArray(arr)) {
          for (const d of arr) {
            if (typeof d === "string" && d) {
              const lower = d.toLowerCase().trim();
              nextDel.add(d);
              nextDel.add(lower);
              nextDel.add(lower.replace(/_/g, " "));
              nextDel.add(lower.replace(/\s+/g, "_"));
            }
          }
        }
      }
      cachedDeletedSet = nextDel;
    }
  } catch {}

  try {
    const ovrRaw = window.localStorage.getItem("fit_custom_exercise_overrides");
    if (ovrRaw !== cachedOverridesRaw) {
      cachedOverridesRaw = ovrRaw;
      const nextByName = new Map<string, any>();
      let parsed: Record<string, any> = {};
      if (ovrRaw) {
        const rawParsed = JSON.parse(ovrRaw);
        if (rawParsed && typeof rawParsed === "object") {
          parsed = rawParsed;
          for (const key of Object.keys(parsed)) {
            const val = parsed[key];
            if (val && typeof val === "object" && val.name) {
              const ln = String(val.name).toLowerCase().trim();
              if (ln && !nextByName.has(ln)) nextByName.set(ln, val);
            }
          }
        }
      }
      cachedOverridesObj = parsed;
      cachedOverridesByLowerName = nextByName;
    }
  } catch {}

  try {
    const exRaw = window.localStorage.getItem("fit_exercises");
    if (exRaw !== cachedExercisesRaw) {
      cachedExercisesRaw = exRaw;
      const nextMap = new Map<string, any>();
      let parsed: any[] = [];
      if (exRaw) {
        const rawParsed = JSON.parse(exRaw);
        if (Array.isArray(rawParsed)) {
          parsed = rawParsed;
          for (const item of parsed) {
            if (item && typeof item === "object" && item.name) {
              const ln = String(item.name).toLowerCase().trim();
              if (ln && !nextMap.has(ln)) nextMap.set(ln, item);
            }
          }
        }
      }
      cachedExercisesList = parsed;
      cachedExercisesByLowerName = nextMap;
    }
  } catch {}

  return {
    deletedSet: cachedDeletedSet,
    overridesObj: cachedOverridesObj,
    overridesByLowerName: cachedOverridesByLowerName,
    exercisesList: cachedExercisesList,
    exercisesByLowerName: cachedExercisesByLowerName
  };
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

  const {
    deletedSet,
    overridesObj,
    overridesByLowerName,
    exercisesList,
    exercisesByLowerName
  } = getCachedExerciseStorageTables();

  // Check if exercise has been deleted by admin
  if (deletedSet.has(cleanName) || deletedSet.has(cleanLower)) {
    return {
      name: cleanName,
      gifUrl: "",
      muscleGroup: targetCat
    };
  }

  // 1. Check exact match in cached custom exercise overrides (admin custom GIF overrides)
  let exactOverrideUrl = "";
  const directOverride =
    overridesObj[cleanName] ||
    overridesObj[cleanLower] ||
    overridesByLowerName.get(cleanLower);
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

  // 3. Check exact match (never loose substring) in cached fit_exercises
  if (exercisesList.length > 0) {
    const directMatch = exercisesByLowerName.get(cleanLower);
    const match = directMatch || exercisesList.find((e: any) => e?.name && isExerciseMatch(cleanName, e.name));
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
