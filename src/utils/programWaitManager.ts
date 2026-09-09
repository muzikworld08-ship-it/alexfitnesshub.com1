/**
 * Program Wait Manager
 * Manages the mandatory 5-hour waiting period after completing each day's workout
 * for:
 * 1. 180 Day Home Workout Challenge (home_180_challenge)
 * 2. Women Confidence Program (women_confidence)
 * 3. Belly Fat Shred System (belly_fat_shred)
 * 4. Monthly 90-Day Challenges (immortal_90 / 90_day_immortal)
 * 5. Programs & Academy 12-Week Physique Splits (programs_academy / lifestyle_academy)
 */

export const WAIT_PERIOD_MS = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

export interface ProgramWaitState {
  programId: string;
  completedDay: number;
  completedAt: number; // Unix timestamp ms
  nextUnlockAt: number; // Unix timestamp ms
  completedDateStr: string;
}

const STORAGE_PREFIX = "fit_program_cooldown_";

export function getProgramWaitState(programId: string): {
  isWaiting: boolean;
  completedDay: number;
  nextDay: number;
  nextUnlockAt: number;
  remainingMs: number;
  remainingFormatted: string;
} {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${programId}`);
    if (!raw) {
      return {
        isWaiting: false,
        completedDay: 0,
        nextDay: 1,
        nextUnlockAt: 0,
        remainingMs: 0,
        remainingFormatted: "00h 00m 00s"
      };
    }

    const data: ProgramWaitState = JSON.parse(raw);
    const now = Date.now();
    const remainingMs = Math.max(0, data.nextUnlockAt - now);
    const isWaiting = remainingMs > 0;

    return {
      isWaiting,
      completedDay: data.completedDay,
      nextDay: data.completedDay + 1,
      nextUnlockAt: data.nextUnlockAt,
      remainingMs,
      remainingFormatted: formatRemainingTime(remainingMs)
    };
  } catch (e) {
    console.warn("Failed to parse program wait state:", e);
    return {
      isWaiting: false,
      completedDay: 0,
      nextDay: 1,
      nextUnlockAt: 0,
      remainingMs: 0,
      remainingFormatted: "00h 00m 00s"
    };
  }
}

export function recordDailyWorkoutCompletion(programId: string, completedDay: number): ProgramWaitState {
  const now = Date.now();
  const nextUnlockAt = now + WAIT_PERIOD_MS;
  const state: ProgramWaitState = {
    programId,
    completedDay,
    completedAt: now,
    nextUnlockAt,
    completedDateStr: new Date(now).toISOString().split("T")[0]
  };

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${programId}`, JSON.stringify(state));
    // Also save in combined record
    const allRaw = localStorage.getItem("fit_programs_wait_all") || "{}";
    const all = JSON.parse(allRaw);
    all[programId] = state;
    localStorage.setItem("fit_programs_wait_all", JSON.stringify(all));
  } catch (e) {
    console.warn("Failed to persist program wait record:", e);
  }

  return state;
}

export function clearProgramWaitState(programId: string): void {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${programId}`);
    const allRaw = localStorage.getItem("fit_programs_wait_all") || "{}";
    const all = JSON.parse(allRaw);
    delete all[programId];
    localStorage.setItem("fit_programs_wait_all", JSON.stringify(all));
  } catch (e) {
    console.warn("Failed to clear program wait state:", e);
  }
}

export function formatRemainingTime(ms: number): string {
  if (ms <= 0) return "00h 00m 00s";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}
