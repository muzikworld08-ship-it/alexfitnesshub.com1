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
 * Checks active Admin-added exercises in storage so any new exercise/GIF is immediately reflected.
 */
export function resolveAuthenticExercise(
  name: string,
  fallbackGifUrl: string = "",
  category: string = ""
): AuthenticExerciseInfo {
  const cleanName = (name || "").trim();
  let mediaUrl = fallbackGifUrl || "";
  let targetCat = category || "General";

  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const stored = window.localStorage.getItem("fit_exercises");
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) {
          const lower = cleanName.toLowerCase();
          const match = list.find((e: any) => {
            const eName = (e.name || "").toLowerCase().trim();
            return eName === lower || (eName.length > 2 && lower.includes(eName)) || (lower.length > 2 && eName.includes(lower));
          });
          if (match) {
            mediaUrl = match.customMediaUrl || match.gifUrl || match.imageUrl || mediaUrl;
            if (match.category) targetCat = match.category;
          }
        }
      }
    } catch {}
  }

  return {
    name: cleanName,
    gifUrl: mediaUrl,
    muscleGroup: targetCat
  };
}

export default resolveAuthenticExercise;
