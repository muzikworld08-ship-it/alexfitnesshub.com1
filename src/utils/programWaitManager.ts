/**
 * Program Wait Manager
 * Manages the mandatory recovery waiting period after completing each day's workout:
 * - 7-hour waiting period for Immortal 90 Day Challenge (immortal_90)
 * - 5-hour waiting period for:
 *   1. 180 Day Home Workout Challenge (home_180_challenge / home_180)
 *   2. Women Confidence Program (women_confidence)
 *   3. Belly Fat Shred System (belly_fat_shred)
 *   4. Lifestyle & Academy Splits (lifestyle_academy / programs_academy)
 * 
 * Enforced both locally and authoritatively via the backend (/api/workout/*)
 * so users cannot bypass it by refreshing the page or logging out.
 */

export const IMMORTAL_WAIT_MS = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
export const STANDARD_WAIT_MS = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
export const WAIT_PERIOD_MS = STANDARD_WAIT_MS;

export function getWaitDurationMs(programId: string): number {
  return programId === "immortal_90" ? IMMORTAL_WAIT_MS : STANDARD_WAIT_MS;
}

export function getWaitDurationHours(programId: string): number {
  return programId === "immortal_90" ? 7 : 5;
}

export interface ProgramWaitState {
  programId: string;
  completedDay: number;
  completedAt: number; // Unix timestamp ms
  nextUnlockAt: number; // Unix timestamp ms
  completedDateStr: string;
  waitDurationHours: number;
}

const STORAGE_PREFIX = "fit_program_cooldown_";

export function getProgramWaitState(programId: string): {
  isWaiting: boolean;
  completedDay: number;
  nextDay: number;
  nextUnlockAt: number;
  remainingMs: number;
  remainingFormatted: string;
  waitDurationHours: number;
} {
  const waitDurationHours = getWaitDurationHours(programId);
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${programId}`);
    if (!raw) {
      return {
        isWaiting: false,
        completedDay: 0,
        nextDay: 1,
        nextUnlockAt: 0,
        remainingMs: 0,
        remainingFormatted: "00h 00m 00s",
        waitDurationHours
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
      remainingFormatted: formatRemainingTime(remainingMs),
      waitDurationHours: data.waitDurationHours || waitDurationHours
    };
  } catch (e) {
    console.warn("Failed to parse program wait state:", e);
    return {
      isWaiting: false,
      completedDay: 0,
      nextDay: 1,
      nextUnlockAt: 0,
      remainingMs: 0,
      remainingFormatted: "00h 00m 00s",
      waitDurationHours
    };
  }
}

/**
 * Sync cooldown status from backend server.
 * Ensures page refreshes or cross-device logins cannot bypass the timer.
 */
export async function syncCooldownWithBackend(programId: string, userEmail?: string): Promise<{
  isWaiting: boolean;
  completedDay: number;
  nextDay: number;
  nextUnlockAt: number;
  remainingMs: number;
  remainingFormatted: string;
  waitDurationHours: number;
}> {
  const waitDurationHours = getWaitDurationHours(programId);
  try {
    const res = await fetch(`/api/workout/cooldown-status?programId=${encodeURIComponent(programId)}&userEmail=${encodeURIComponent(userEmail || "")}`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.isWaiting === "boolean") {
        if (data.isWaiting && data.nextUnlockAt) {
          const state: ProgramWaitState = {
            programId,
            completedDay: data.completedDay,
            completedAt: data.completedAt || Date.now(),
            nextUnlockAt: data.nextUnlockAt,
            completedDateStr: new Date(data.nextUnlockAt).toISOString().split("T")[0],
            waitDurationHours: data.waitDurationHours || waitDurationHours
          };
          localStorage.setItem(`${STORAGE_PREFIX}${programId}`, JSON.stringify(state));
          const allRaw = localStorage.getItem("fit_programs_wait_all") || "{}";
          const all = JSON.parse(allRaw);
          all[programId] = state;
          localStorage.setItem("fit_programs_wait_all", JSON.stringify(all));

          return {
            isWaiting: true,
            completedDay: data.completedDay,
            nextDay: data.nextDay,
            nextUnlockAt: data.nextUnlockAt,
            remainingMs: Math.max(0, data.remainingMs),
            remainingFormatted: formatRemainingTime(Math.max(0, data.remainingMs)),
            waitDurationHours: data.waitDurationHours || waitDurationHours
          };
        } else if (!data.isWaiting) {
          // If server says cooldown expired, clear local storage lock
          localStorage.removeItem(`${STORAGE_PREFIX}${programId}`);
        }
      }
    }
  } catch (err) {
    console.warn("[Cooldown Sync Warning] Could not sync with server, using local state:", err);
  }

  return getProgramWaitState(programId);
}

/**
 * Record workout completion both locally and to backend.
 * Returns the recorded state and schedules tomorrow's 5 AM reminder email.
 */
export async function recordDailyWorkoutCompletionAsync(options: {
  programId: string;
  completedDay: number;
  caloriesBurned?: number;
  durationMinutes?: number;
  distanceKm?: number;
  userEmail?: string;
}): Promise<{
  success: boolean;
  state: ProgramWaitState;
  isDuplicate?: boolean;
  message?: string;
}> {
  const {
    programId,
    completedDay,
    caloriesBurned = 450,
    durationMinutes = 45,
    distanceKm = 0,
    userEmail = ""
  } = options;

  const waitHours = getWaitDurationHours(programId);
  const waitMs = getWaitDurationMs(programId);
  const now = Date.now();
  const nextUnlockAt = now + waitMs;

  const localState: ProgramWaitState = {
    programId,
    completedDay,
    completedAt: now,
    nextUnlockAt,
    completedDateStr: new Date(now).toISOString().split("T")[0],
    waitDurationHours: waitHours
  };

  // Immediate local cache
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${programId}`, JSON.stringify(localState));
    const allRaw = localStorage.getItem("fit_programs_wait_all") || "{}";
    const all = JSON.parse(allRaw);
    all[programId] = localState;
    localStorage.setItem("fit_programs_wait_all", JSON.stringify(all));
  } catch (e) {
    console.warn("Failed to persist local program wait record:", e);
  }

  // Authoritative server dispatch
  try {
    const timezoneOffset = new Date().getTimezoneOffset();
    const res = await fetch("/api/workout/complete-day", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        programId,
        completedDay,
        caloriesBurned,
        durationMinutes,
        distanceKm,
        timezoneOffset,
        userEmail
      })
    });

    const data = await res.json();
    if (!res.ok) {
      if (res.status === 409 || data.isDuplicate) {
        return {
          success: false,
          state: localState,
          isDuplicate: true,
          message: data.message || `Workout for Day ${completedDay} was already completed.`
        };
      }
    }

    if (data.nextUnlockAt) {
      localState.nextUnlockAt = data.nextUnlockAt;
      localStorage.setItem(`${STORAGE_PREFIX}${programId}`, JSON.stringify(localState));
    }

    return {
      success: true,
      state: localState,
      message: `Congratulations! Day ${completedDay} completed. Mandatory ${waitHours}-hour cooldown active.`
    };
  } catch (serverErr) {
    console.warn("Backend completion dispatch failed, local cooldown maintained:", serverErr);
    return {
      success: true,
      state: localState,
      message: `Day ${completedDay} completed locally. Recovery window active.`
    };
  }
}

/**
 * Synchronous backward-compatible signature
 */
export function recordDailyWorkoutCompletion(programId: string, completedDay: number): ProgramWaitState {
  const waitHours = getWaitDurationHours(programId);
  const waitMs = getWaitDurationMs(programId);
  const now = Date.now();
  const nextUnlockAt = now + waitMs;

  const state: ProgramWaitState = {
    programId,
    completedDay,
    completedAt: now,
    nextUnlockAt,
    completedDateStr: new Date(now).toISOString().split("T")[0],
    waitDurationHours: waitHours
  };

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${programId}`, JSON.stringify(state));
    const allRaw = localStorage.getItem("fit_programs_wait_all") || "{}";
    const all = JSON.parse(allRaw);
    all[programId] = state;
    localStorage.setItem("fit_programs_wait_all", JSON.stringify(all));
  } catch (e) {
    console.warn("Failed to persist program wait record:", e);
  }

  // Fire background backend sync
  recordDailyWorkoutCompletionAsync({ programId, completedDay }).catch(() => {});

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
