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
    memoryOverrides = {};
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

  memoryOverrides = {};
  currentSource = "bundled";
  lastUpdatedAt = null;
}

// Initialize on module load
initFromCache();

let isHydratingFromServer = false;
let lastAutoRefreshAt = 0;
let lastDeletedSyncAt = 0;
let schedulePersistTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleIdleOverridesWrite(finalData: Record<string, any>, incomingIso: string) {
  if (typeof window === "undefined" || !window.localStorage) return;
  if (schedulePersistTimer) clearTimeout(schedulePersistTimer);
  schedulePersistTimer = setTimeout(() => {
    schedulePersistTimer = null;
    const writeNow = () => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(finalData));
        window.localStorage.setItem(UPDATED_AT_KEY, incomingIso);
      } catch (e) {
        console.warn("[ScheduleOverridesStore] Failed to write localStorage cache:", e);
      }
    };
    if (typeof (window as any).requestIdleCallback === "function") {
      (window as any).requestIdleCallback(writeNow, { timeout: 1500 });
    } else {
      writeNow();
    }
  }, 300);
}

/**
 * Fetch authoritative schedule overrides from server endpoint /api/admin/programs/overrides.
 * Hydrates store, writes to local cache, and notifies all UI subscribers.
 */
export async function refreshScheduleOverridesFromServer(forceFresh = false): Promise<Record<string, any>> {
  if (typeof window === "undefined") return getScheduleOverrides();
  if (isHydratingFromServer) return getScheduleOverrides();
  isHydratingFromServer = true;

  try {
    const canSyncDeleted = typeof window !== "undefined" && Boolean(window.localStorage);
    const shouldFetchDeleted = canSyncDeleted && (forceFresh || Date.now() - lastDeletedSyncAt > 60_000);
    const url = forceFresh ? "/api/admin/programs/overrides?fresh=true" : "/api/admin/programs/overrides";
    const ctrl = new AbortController();
    const timer = !forceFresh ? setTimeout(() => ctrl.abort(), 1600) : null;

    let res: Response;
    let delRes: Response | null;
    try {
      [res, delRes] = await Promise.all([
        fetch(url, {
          ...(forceFresh ? { cache: "no-store" } : {}),
          signal: ctrl.signal
        }),
        shouldFetchDeleted
          ? fetch("/api/exercises/deleted", { signal: ctrl.signal }).catch(() => null)
          : Promise.resolve(null)
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }

    if (delRes && delRes.ok && canSyncDeleted) {
      lastDeletedSyncAt = Date.now();
      try {
        const delData = await delRes.json();
        if (delData?.deletedExercises && Array.isArray(delData.deletedExercises)) {
          if (delData.authoritative) {
            const fresh = Array.from(new Set(delData.deletedExercises.filter((x: any) => typeof x === "string")));
            window.localStorage.setItem("fit_deleted_exercises", JSON.stringify(fresh));
          } else {
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

    if (res.ok) {
      const data = await res.json();
      if (data && data.overrides && typeof data.overrides === "object") {
        setScheduleOverridesFromRemote(data.overrides, data.updatedAt || data.serverTime, data.source);
      }
      if (data?.overrides) return getScheduleOverrides();
    }
  } catch (err) {
    console.warn("[ScheduleOverridesStore] Notice fetching schedule overrides from server:", err);
  } finally {
    isHydratingFromServer = false;
  }

  // Last-resort bundled fallback ONLY when cache is empty and server fetch failed
  if (!memoryOverrides || Object.keys(memoryOverrides).length === 0) {
    try {
      const mod = await import("../data/program_schedule_overrides.json");
      const bundled = (mod?.default || mod || {}) as Record<string, any>;
      if (bundled && typeof bundled === "object" && Object.keys(bundled).length > 0) {
        memoryOverrides = bundled;
        currentSource = "bundled";
        notifySubscribers();
      }
    } catch {}
  }

  return getScheduleOverrides();
}

function triggerThrottledAutoRefresh() {
  const now = Date.now();
  if (now - lastAutoRefreshAt < 120_000) return;
  lastAutoRefreshAt = now;
  refreshScheduleOverridesFromServer(false);
}

// Sync latest overrides from server on startup and throttled tab/network transitions (AppContext maintains the single Firestore real-time listener)
if (typeof window !== "undefined") {
  const hasWarmCache = Boolean(memoryOverrides && Object.keys(memoryOverrides).length > 0);
  setTimeout(() => {
    lastAutoRefreshAt = Date.now();
    refreshScheduleOverridesFromServer(false);
  }, hasWarmCache ? 1200 : 80);

  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        triggerThrottledAutoRefresh();
      }
    });
  } else {
    window.addEventListener("focus", triggerThrottledAutoRefresh);
  }

  window.addEventListener("online", triggerThrottledAutoRefresh);

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
  if (memoryOverrides !== null) {
    return memoryOverrides;
  }

  initFromCache();
  return memoryOverrides || {};
}

/**
 * Updates store from canonical remote snapshot (/api/admin/programs/overrides or Firestore).
 * Replaces the cached snapshot in full so deletions and rollbacks take effect cleanly without merging.
 */
export function setScheduleOverridesFromRemote(
  data: Record<string, any>,
  updatedAt?: string | number | null,
  sourceHint?: "cloud" | "disk" | "firestore" | "remote" | string
): boolean {
  if (!data || typeof data !== "object") return false;

  const incomingTime = updatedAt || data._updatedAt;
  const incomingIso = incomingTime
    ? (typeof incomingTime === "number" ? new Date(incomingTime).toISOString() : String(incomingTime))
    : new Date().toISOString();

  // Monotonic timestamp guard: never let stale disk or older snapshot overwrite newer remote/admin state
  const hasExisting = Boolean(memoryOverrides && Object.keys(memoryOverrides).length > 0);
  if (hasExisting && currentSource === "remote") {
    if (sourceHint === "disk") {
      // Never allow an unverified disk snapshot to overwrite confirmed cloud/admin state
      return false;
    }
    if (lastUpdatedAt && incomingTime) {
      const prevMs = Date.parse(lastUpdatedAt);
      const nextMs = Date.parse(incomingIso);
      if (!isNaN(prevMs) && !isNaN(nextMs) && nextMs < prevMs) {
        return false;
      }
    }
  }

  // Strip internal metadata fields before caching
  const { _updatedAt, _updatedBy, ...cleanOverrides } = data;
  const finalData = cleanOverrides.overrides && typeof cleanOverrides.overrides === "object"
    ? cleanOverrides.overrides
    : cleanOverrides;

  // Equality short-circuit: skip 1.2 MB serialization + full-app re-render if remote snapshot hasn't changed
  if (
    hasExisting &&
    incomingTime &&
    lastUpdatedAt === incomingIso &&
    Object.keys(finalData).length === Object.keys(memoryOverrides || {}).length
  ) {
    return false;
  }

  memoryOverrides = finalData;
  currentSource = "remote";
  lastUpdatedAt = incomingIso;

  scheduleIdleOverridesWrite(finalData, incomingIso);

  notifySubscribers();
  return true;
}

/**
 * Save schedule overrides from Admin dashboards (AdminWorkoutChallengeEngine / AdminWorkoutEditor).
 * Merges updated program keys into current snapshot, records update time, and broadcasts to all components.
 */
export function setScheduleOverridesFromAdmin(data: Record<string, any>): void {
  if (!data || typeof data !== "object") return;
  const now = new Date().toISOString();
  // Replace per program key cleanly so deleted numeric day keys never resurrect
  const current = memoryOverrides || {};
  const merged: Record<string, any> = { ...current };
  for (const [k, v] of Object.entries(data)) {
    merged[k] = v;
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
  const next: Record<string, any> = { ...current };
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
    const rawProg = next[progKey];
    if (!rawProg || typeof rawProg !== "object") continue;
    const progData: Record<string, any> = { ...rawProg };
    let progChanged = false;

    for (const dayKey of Object.keys(progData)) {
      const rawDay = progData[dayKey];
      if (!rawDay || typeof rawDay !== "object") continue;
      const beforeDayPurged = purgedCount;
      const dayData: Record<string, any> = { ...rawDay };

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
        dayData.levels = { ...dayData.levels };
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
      if (purgedCount > beforeDayPurged) {
        progData[dayKey] = dayData;
        progChanged = true;
      }
    }
    if (progChanged) next[progKey] = progData;
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
  const next: Record<string, any> = { ...current };
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
    const rawProg = next[progKey];
    if (!rawProg || typeof rawProg !== "object") continue;
    const progData: Record<string, any> = { ...rawProg };
    let progChanged = false;

    for (const dayKey of Object.keys(progData)) {
      const rawDay = progData[dayKey];
      if (!rawDay || typeof rawDay !== "object") continue;
      const beforeDayUpdated = updatedCount;
      const dayData: Record<string, any> = { ...rawDay };

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
        dayData.levels = { ...dayData.levels };
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
      if (updatedCount > beforeDayUpdated) {
        progData[dayKey] = dayData;
        progChanged = true;
      }
    }
    if (progChanged) next[progKey] = progData;
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
  const next: Record<string, any> = {
    ...current,
    [targetProgramId]: current[targetProgramId] ? { ...current[targetProgramId] } : {}
  };

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
    imageUrl: exercise.customMediaUrl || exercise.imageUrl || exercise.gifUrl || "",
    addedByAdmin: true
  };

  const updatedLevels = { ...(existingDay.levels || {}) };
  const rawExistingTierList = Array.isArray(updatedLevels[targetTier]) ? updatedLevels[targetTier] : [];
  const hasAdminAdded = rawExistingTierList.some((d: any) => d && d.addedByAdmin === true);
  updatedLevels[targetTier] = hasAdminAdded ? [...rawExistingTierList] : [];

  // Deduplicate before pushing
  if (!updatedLevels[targetTier].some((d: any) => d.id === exercise.id || (d.name && d.name.toLowerCase().trim() === exercise.name.toLowerCase().trim()))) {
    updatedLevels[targetTier].push(newDrillItem);
  }

  const tierExKey = `${targetTier}Exercises` as "beginnerExercises" | "intermediateExercises" | "advancedExercises";
  const updatedDay: any = {
    ...existingDay,
    levels: updatedLevels,
    [tierExKey]: updatedLevels[targetTier],
    exercises: targetTier === "beginner" ? updatedLevels.beginner : (existingDay.exercises || updatedLevels.beginner)
  };

  next[targetProgramId][dayKey] = updatedDay;
  next[targetProgramId][cycleKey] = updatedDay;

  setScheduleOverridesFromAdmin(next);
  return next;
}

/**
 * Removes a single drill strictly from one program/day/tier routine without
 * adding it to deleted_exercises or modifying other programs or untouched tiers.
 */
export function removeDrillFromProgramSchedule(opts: {
  programId: string;
  dayNumber: number;
  tier: "beginner" | "intermediate" | "advanced";
  exerciseId?: string;
  exerciseName?: string;
  isCycleMode?: boolean;
  totalDays?: number;
}): { updatedOverrides: Record<string, any>; removedCount: number } {
  const current = getScheduleOverrides();
  const next: Record<string, any> = { ...current };
  const progData = next[opts.programId] ? { ...next[opts.programId] } : {};

  const safeDay = Math.max(1, Number(opts.dayNumber) || 1);
  const cycleDay = ((safeDay - 1) % 7) + 1;
  const dayKey = String(safeDay);
  const cycleKey = `cycle_${cycleDay}`;
  const isCycle = opts.isCycleMode !== false;
  const targetSlotKey = isCycle ? cycleKey : dayKey;

  const existingDay = progData[targetSlotKey] || progData[cycleKey] || progData[dayKey];
  if (!existingDay || typeof existingDay !== "object") {
    return { updatedOverrides: next, removedCount: 0 };
  }

  const targetId = String(opts.exerciseId || "").toLowerCase().trim();
  const targetName = String(opts.exerciseName || "").toLowerCase().trim();
  const targetNameClean = targetName.replace(/[^a-z0-9]/g, "");

  let removedCount = 0;
  const filterList = (list: any[]) => {
    if (!Array.isArray(list)) return [];
    return list.filter((item: any) => {
      if (!item) return false;
      const itemId = String(item.id || item.exerciseId || "").toLowerCase().trim();
      const itemName = String(item.exerciseName || item.name || "").toLowerCase().trim();
      const itemClean = itemName.replace(/[^a-z0-9]/g, "");
      if (targetId && (itemId === targetId || String(item.exerciseId || "").toLowerCase().trim() === targetId)) {
        removedCount++;
        return false;
      }
      if (targetName && itemName === targetName) {
        removedCount++;
        return false;
      }
      if (targetNameClean && itemClean === targetNameClean) {
        removedCount++;
        return false;
      }
      return true;
    });
  };

  const dayCopy: Record<string, any> = { ...existingDay };
  dayCopy.levels = dayCopy.levels && typeof dayCopy.levels === "object" ? { ...dayCopy.levels } : {};
  const tierKey = `${opts.tier}Exercises` as "beginnerExercises" | "intermediateExercises" | "advancedExercises";

  const currentTierList = Array.isArray(dayCopy.levels[opts.tier])
    ? dayCopy.levels[opts.tier]
    : (Array.isArray(dayCopy[tierKey])
      ? dayCopy[tierKey]
      : (opts.tier === "beginner" && Array.isArray(dayCopy.exercises) ? dayCopy.exercises : []));

  const filteredTierList = filterList(currentTierList);
  dayCopy.levels[opts.tier] = filteredTierList;
  dayCopy[tierKey] = filteredTierList;
  if (opts.tier === "beginner") {
    dayCopy.exercises = filteredTierList;
  }

  if (isCycle) {
    dayCopy.cycleDay = cycleDay;
    progData[cycleKey] = dayCopy;
    const maxDays = opts.totalDays || 180;
    for (let d = cycleDay; d <= maxDays; d += 7) {
      if (progData[String(d)]?.isOneOff !== true) {
        delete progData[String(d)];
      }
    }
  } else {
    dayCopy.dayNumber = safeDay;
    dayCopy.isOneOff = true;
    progData[dayKey] = dayCopy;
  }

  next[opts.programId] = progData;
  setScheduleOverridesFromAdmin(next);
  return { updatedOverrides: next, removedCount };
}
