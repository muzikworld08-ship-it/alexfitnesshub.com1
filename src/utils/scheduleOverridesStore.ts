import DEFAULT_PROGRAM_SCHEDULE_OVERRIDES from "../data/program_schedule_overrides.json";

// The canonical localStorage key for schedule overrides cache.
// Per project requirement, this string must ONLY exist in this store file.
const STORAGE_KEY = "fit_program_schedule_overrides";
const UPDATED_AT_KEY = "fit_schedule_overrides_updated_at";

export type ScheduleSource = "remote" | "cache" | "bundled";

export interface ScheduleSyncStatus {
  source: ScheduleSource;
  updatedAt: string | null;
  degraded: boolean;
}

type Subscriber = (overrides: Record<string, any>) => void;

let memoryOverrides: Record<string, any> | null = null;
let currentSource: ScheduleSource = "bundled";
let lastUpdatedAt: string | null = null;
const subscribers = new Set<Subscriber>();

function initFromCache() {
  if (typeof window === "undefined" || !window.localStorage) {
    memoryOverrides = (DEFAULT_PROGRAM_SCHEDULE_OVERRIDES as Record<string, any>) || {};
    currentSource = "bundled";
    lastUpdatedAt = null;
    return;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const storedTime = window.localStorage.getItem(UPDATED_AT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
        memoryOverrides = parsed;
        currentSource = "cache";
        lastUpdatedAt = storedTime || null;
        return;
      }
    }
  } catch (err) {
    console.warn("[ScheduleOverridesStore] Error reading cached overrides:", err);
  }

  memoryOverrides = (DEFAULT_PROGRAM_SCHEDULE_OVERRIDES as Record<string, any>) || {};
  currentSource = "bundled";
  lastUpdatedAt = null;
}

// Initialize on module load
initFromCache();

let isHydratingFromServer = false;

/**
 * Fetch authoritative schedule overrides from server endpoint /api/admin/programs/overrides.
 * Hydrates store, writes to local cache, and notifies all UI subscribers.
 */
export async function refreshScheduleOverridesFromServer(): Promise<Record<string, any>> {
  if (typeof window === "undefined") return getScheduleOverrides();
  if (isHydratingFromServer) return getScheduleOverrides();
  isHydratingFromServer = true;

  try {
    const res = await fetch("/api/admin/programs/overrides");
    if (res.ok) {
      const data = await res.json();
      if (data && data.overrides && typeof data.overrides === "object" && Object.keys(data.overrides).length > 0) {
        setScheduleOverridesFromRemote(data.overrides);
      }

      // Also sync deleted exercises so client-side routine renders omit permanently deleted drills across devices
      if (typeof window !== "undefined" && window.localStorage) {
        try {
          const delRes = await fetch("/api/exercises/deleted");
          if (delRes.ok) {
            const delData = await delRes.json();
            if (delData?.deletedExercises && Array.isArray(delData.deletedExercises)) {
              const existingRaw = window.localStorage.getItem("fit_deleted_exercises");
              let existing: string[] = [];
              if (existingRaw) {
                try { existing = JSON.parse(existingRaw); } catch {}
              }
              const merged = Array.from(new Set([...existing, ...delData.deletedExercises]));
              window.localStorage.setItem("fit_deleted_exercises", JSON.stringify(merged));
            }
          }
        } catch {}
      }

      if (data?.overrides) return data.overrides;
    }
  } catch (err) {
    console.warn("[ScheduleOverridesStore] Notice fetching schedule overrides from server:", err);
  } finally {
    isHydratingFromServer = false;
  }
  return getScheduleOverrides();
}

// Automatically sync latest overrides from server on client startup
if (typeof window !== "undefined") {
  setTimeout(() => {
    refreshScheduleOverridesFromServer();
  }, 50);

  // Cross-tab sync for schedule overrides
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed && typeof parsed === "object") {
          memoryOverrides = parsed;
          currentSource = "cache";
          notifySubscribers();
        }
      } catch {}
    }
  });
}

function notifySubscribers() {
  const current = getScheduleOverrides();
  subscribers.forEach((cb) => {
    try {
      cb(current);
    } catch (e) {
      console.warn("[ScheduleOverridesStore] Subscriber error:", e);
    }
  });

  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new CustomEvent("fit_program_schedule_overrides_updated", { detail: current }));
      window.dispatchEvent(new CustomEvent("fit_schedule_overrides_updated", { detail: current }));
    } catch {}
  }
}

/**
 * Synchronously retrieves current program schedule overrides:
 * Memory -> localStorage Cache -> Bundled Defaults.
 */
export function getScheduleOverrides(): Record<string, any> {
  if (memoryOverrides && Object.keys(memoryOverrides).length > 0) {
    return memoryOverrides;
  }

  initFromCache();
  return memoryOverrides || (DEFAULT_PROGRAM_SCHEDULE_OVERRIDES as Record<string, any>) || {};
}

/**
 * Updates store from canonical remote Firestore document (system_settings/program_schedule_overrides).
 * A remote snapshot REPLACES the cache (no merging) when its _updatedAt is newer or equal.
 */
export function setScheduleOverridesFromRemote(
  data: Record<string, any>,
  updatedAt?: string | number | null
): void {
  if (!data || typeof data !== "object") return;

  const incomingTime = updatedAt || data._updatedAt;
  const incomingIso = incomingTime
    ? (typeof incomingTime === "number" ? new Date(incomingTime).toISOString() : String(incomingTime))
    : new Date().toISOString();

  // If we already have a newer timestamp in memory/cache, do not overwrite with older data
  if (lastUpdatedAt && incomingTime) {
    const prevMs = new Date(lastUpdatedAt).getTime();
    const nextMs = new Date(incomingIso).getTime();
    if (!isNaN(prevMs) && !isNaN(nextMs) && nextMs < prevMs) {
      console.log("[ScheduleOverridesStore] Ignoring stale remote snapshot:", { incomingIso, lastUpdatedAt });
      return;
    }
  }

  // Strip internal metadata fields before caching
  const { _updatedAt, _updatedBy, ...cleanOverrides } = data;
  const finalData = cleanOverrides.overrides && typeof cleanOverrides.overrides === "object"
    ? cleanOverrides.overrides
    : cleanOverrides;

  // Deep merge to guarantee no program is wiped when receiving remote updates
  const current = memoryOverrides || (DEFAULT_PROGRAM_SCHEDULE_OVERRIDES as Record<string, any>) || {};
  const merged: Record<string, any> = { ...current };
  for (const [k, v] of Object.entries(finalData)) {
    merged[k] = { ...(current[k] || {}), ...(v as any) };
  }

  memoryOverrides = merged;
  currentSource = "remote";
  lastUpdatedAt = incomingIso;

  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      window.localStorage.setItem(UPDATED_AT_KEY, incomingIso);
    } catch (e) {
      console.warn("[ScheduleOverridesStore] Failed to write localStorage cache:", e);
    }
  }

  notifySubscribers();
}

/**
 * Save schedule overrides from Admin dashboards (AdminWorkoutChallengeEngine / AdminWorkoutEditor).
 * Replaces the cache, records update time, and broadcasts to all components.
 */
export function setScheduleOverridesFromAdmin(data: Record<string, any>): void {
  if (!data || typeof data !== "object") return;
  const now = new Date().toISOString();
  // Deep merge to guarantee no program is wiped when an admin saves another program
  const current = memoryOverrides || (DEFAULT_PROGRAM_SCHEDULE_OVERRIDES as Record<string, any>) || {};
  const merged: Record<string, any> = { ...current };
  for (const [k, v] of Object.entries(data)) {
    merged[k] = { ...(current[k] || {}), ...(v as any) };
  }

  memoryOverrides = merged;
  currentSource = "remote";
  lastUpdatedAt = now;

  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      window.localStorage.setItem(UPDATED_AT_KEY, now);
    } catch (e) {
      console.warn("[ScheduleOverridesStore] Failed to write localStorage cache:", e);
    }
  }

  notifySubscribers();
}

/**
 * Subscribe to schedule override updates.
 */
export function subscribeScheduleOverrides(cb: Subscriber): () => void {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

export const subscribe = subscribeScheduleOverrides;

/**
 * Returns current sync status: source ("remote" | "cache" | "bundled"), updatedAt, degraded.
 */
export function getSyncStatus(): ScheduleSyncStatus {
  const degraded = typeof window !== "undefined" ? Boolean((window as any).__AFH_SYNC_DEGRADED__) : false;
  return {
    source: currentSource,
    updatedAt: lastUpdatedAt,
    degraded
  };
}

/**
 * Purges an exercise permanently from all program schedules across all days and difficulty tiers.
 * Eliminates orphaned references, old copies, and guarantees the drill disappears everywhere.
 */
export function purgeExerciseFromAllSchedules(
  exerciseId: string,
  exerciseName?: string
): { updatedOverrides: Record<string, any>; purgedCount: number } {
  const current = getScheduleOverrides();
  const next: Record<string, any> = JSON.parse(JSON.stringify(current));
  let purgedCount = 0;

  const targetId = (exerciseId || "").toLowerCase().trim();
  const targetName = (exerciseName || "").toLowerCase().trim();

  const isMatch = (item: any) => {
    if (!item) return false;
    const itemId = String(item.id || item.exerciseId || "").toLowerCase().trim();
    const itemName = String(item.exerciseName || item.name || "").toLowerCase().trim();
    if (targetId && (itemId === targetId || itemName === targetId)) return true;
    if (targetName && (itemId === targetName || itemName === targetName)) return true;
    return false;
  };

  const sanitizeList = (list: any[]) => {
    if (!Array.isArray(list)) return list;
    const beforeLen = list.length;
    const filtered = list.filter(item => !isMatch(item));
    purgedCount += (beforeLen - filtered.length);
    return filtered;
  };

  for (const progKey of Object.keys(next)) {
    const progData = next[progKey];
    if (!progData || typeof progData !== "object") continue;

    for (const dayKey of Object.keys(progData)) {
      const dayData = progData[dayKey];
      if (!dayData || typeof dayData !== "object") continue;

      if (Array.isArray(dayData.exercises)) {
        dayData.exercises = sanitizeList(dayData.exercises);
      }
      if (Array.isArray(dayData.beginnerExercises)) {
        dayData.beginnerExercises = sanitizeList(dayData.beginnerExercises);
      }
      if (Array.isArray(dayData.intermediateExercises)) {
        dayData.intermediateExercises = sanitizeList(dayData.intermediateExercises);
      }
      if (Array.isArray(dayData.advancedExercises)) {
        dayData.advancedExercises = sanitizeList(dayData.advancedExercises);
      }
      if (dayData.levels && typeof dayData.levels === "object") {
        if (Array.isArray(dayData.levels.beginner)) {
          dayData.levels.beginner = sanitizeList(dayData.levels.beginner);
        }
        if (Array.isArray(dayData.levels.intermediate)) {
          dayData.levels.intermediate = sanitizeList(dayData.levels.intermediate);
        }
        if (Array.isArray(dayData.levels.advanced)) {
          dayData.levels.advanced = sanitizeList(dayData.levels.advanced);
        }
      }
    }
  }

  if (purgedCount > 0) {
    setScheduleOverridesFromAdmin(next);
  }

  return { updatedOverrides: next, purgedCount };
}

/**
 * Updates an exercise's metadata (GIF URL, sets, reps, category, etc.) across all program schedules.
 * Ensures newly uploaded GIFs and updated descriptions propagate instantly everywhere.
 */
export function updateExerciseInAllSchedules(
  exerciseId: string,
  updates: Record<string, any>
): { updatedOverrides: Record<string, any>; updatedCount: number } {
  const current = getScheduleOverrides();
  const next: Record<string, any> = JSON.parse(JSON.stringify(current));
  let updatedCount = 0;

  const targetId = (exerciseId || "").toLowerCase().trim();
  const targetName = (updates.name || "").toLowerCase().trim();
  const mediaUrl = updates.customMediaUrl || updates.gifUrl || updates.imageUrl;

  const isMatch = (item: any) => {
    if (!item) return false;
    const itemId = String(item.id || item.exerciseId || "").toLowerCase().trim();
    const itemName = String(item.exerciseName || item.name || "").toLowerCase().trim();
    if (targetId && (itemId === targetId || itemName === targetId)) return true;
    if (targetName && (itemId === targetName || itemName === targetName)) return true;
    return false;
  };

  const updateItem = (item: any) => {
    if (!isMatch(item)) return item;
    updatedCount++;
    return {
      ...item,
      ...(updates.name ? { name: updates.name, exerciseName: updates.name } : {}),
      ...(mediaUrl !== undefined ? { gifUrl: mediaUrl, imageUrl: mediaUrl, customMediaUrl: mediaUrl } : {}),
      ...(updates.recommendedSets ? { sets: updates.recommendedSets } : {}),
      ...(updates.recommendedReps ? { reps: updates.recommendedReps } : {}),
      ...(updates.restTime ? { restTime: updates.restTime } : {}),
      ...(updates.category ? { category: updates.category } : {})
    };
  };

  const updateList = (list: any[]) => {
    if (!Array.isArray(list)) return list;
    return list.map(updateItem);
  };

  for (const progKey of Object.keys(next)) {
    const progData = next[progKey];
    if (!progData || typeof progData !== "object") continue;

    for (const dayKey of Object.keys(progData)) {
      const dayData = progData[dayKey];
      if (!dayData || typeof dayData !== "object") continue;

      if (Array.isArray(dayData.exercises)) {
        dayData.exercises = updateList(dayData.exercises);
      }
      if (Array.isArray(dayData.beginnerExercises)) {
        dayData.beginnerExercises = updateList(dayData.beginnerExercises);
      }
      if (Array.isArray(dayData.intermediateExercises)) {
        dayData.intermediateExercises = updateList(dayData.intermediateExercises);
      }
      if (Array.isArray(dayData.advancedExercises)) {
        dayData.advancedExercises = updateList(dayData.advancedExercises);
      }
      if (dayData.levels && typeof dayData.levels === "object") {
        if (Array.isArray(dayData.levels.beginner)) {
          dayData.levels.beginner = updateList(dayData.levels.beginner);
        }
        if (Array.isArray(dayData.levels.intermediate)) {
          dayData.levels.intermediate = updateList(dayData.levels.intermediate);
        }
        if (Array.isArray(dayData.levels.advanced)) {
          dayData.levels.advanced = updateList(dayData.levels.advanced);
        }
      }
    }
  }

  if (updatedCount > 0) {
    setScheduleOverridesFromAdmin(next);
  }

  return { updatedOverrides: next, updatedCount };
}

/**
 * Inserts a new exercise into a target program schedule.
 */
export function addExerciseToProgramSchedule(
  exercise: any,
  targetProgramId: string,
  targetDay: number = 1,
  targetTier: "beginner" | "intermediate" | "advanced" = "beginner"
): Record<string, any> {
  const current = getScheduleOverrides();
  const next: Record<string, any> = JSON.parse(JSON.stringify(current));

  if (!next[targetProgramId]) {
    next[targetProgramId] = {};
  }

  const dayKey = String(targetDay);
  const cycleKey = `cycle_${((targetDay - 1) % 7) + 1}`;
  const existingDay = next[targetProgramId][dayKey] || next[targetProgramId][cycleKey] || {
    title: `Day ${targetDay} Workout`,
    category: exercise.category || "Targeted Split",
    isCardioOnly: false,
    exercises: [],
    levels: { beginner: [], intermediate: [], advanced: [] }
  };

  const newDrillItem = {
    id: exercise.id,
    name: exercise.name,
    exerciseName: exercise.name,
    category: exercise.category || "Gym Workouts",
    difficulty: targetTier.charAt(0).toUpperCase() + targetTier.slice(1),
    sets: exercise.recommendedSets || "3-4",
    reps: exercise.recommendedReps || "10-12",
    restTime: exercise.restTime || "60s",
    gifUrl: exercise.customMediaUrl || exercise.gifUrl || exercise.imageUrl || "",
    imageUrl: exercise.customMediaUrl || exercise.imageUrl || exercise.gifUrl || ""
  };

  const updatedLevels = { ...(existingDay.levels || {}) };
  if (!Array.isArray(updatedLevels[targetTier])) {
    updatedLevels[targetTier] = [];
  }

  // Deduplicate before pushing
  if (!updatedLevels[targetTier].some((d: any) => d.id === exercise.id || (d.name && d.name.toLowerCase().trim() === exercise.name.toLowerCase().trim()))) {
    updatedLevels[targetTier].push(newDrillItem);
  }

  const updatedDay = {
    ...existingDay,
    levels: updatedLevels,
    exercises: targetTier === "beginner" ? updatedLevels.beginner : (existingDay.exercises || updatedLevels.beginner)
  };

  next[targetProgramId][dayKey] = updatedDay;
  next[targetProgramId][cycleKey] = updatedDay;

  setScheduleOverridesFromAdmin(next);
  return next;
}
