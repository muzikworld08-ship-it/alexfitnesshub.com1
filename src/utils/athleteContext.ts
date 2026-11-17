import { ProgramId } from "../types/challengeEngine";
import { normalizeProgramId } from "./programNormalization";

export type Tier = "beginner" | "intermediate" | "advanced";

function parseTierString(val: unknown): Tier | null {
  if (typeof val !== "string" || !val.trim()) return null;
  const low = val.toLowerCase().trim();
  if (low.includes("adv")) return "advanced";
  if (low.includes("inter")) return "intermediate";
  if (low.includes("beg")) return "beginner";
  return null;
}

export function resolveAthleteTier(user?: any, dbState?: any): Tier {
  const fromProfile =
    parseTierString(dbState?.onboarding?.fitnessLevel) ||
    parseTierString(dbState?.fitnessLevel) ||
    parseTierString(user?.fitnessLevel) ||
    parseTierString(user?.workoutExperience);
  if (fromProfile) return fromProfile;

  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const fromStorage =
        parseTierString(window.localStorage.getItem("fit_athlete_fitness_level")) ||
        parseTierString(window.localStorage.getItem("fit_user_fitness_level"));
      if (fromStorage) return fromStorage;
    } catch {}
  }

  return "beginner";
}

export function persistAthleteTier(tier: Tier): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem("fit_athlete_fitness_level", tier);
    window.localStorage.setItem("fit_user_fitness_level", tier);
  } catch {}
}

export function resolveActiveProgramId(user?: any, dbState?: any): ProgramId {
  const fromDbOrUser =
    dbState?.challengeId ||
    user?.activeProgramId ||
    user?.activeChallengeId;
  if (typeof fromDbOrUser === "string" && fromDbOrUser.trim()) {
    return normalizeProgramId(fromDbOrUser);
  }

  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const storedActive = window.localStorage.getItem("fit_active_challenge_id");
      if (storedActive && storedActive.trim()) {
        return normalizeProgramId(storedActive);
      }
    } catch {}
  }

  if (user?.gender?.toLowerCase() === "female") {
    return "women_confidence";
  }

  return "immortal_90";
}
