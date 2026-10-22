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
        return data.overrides;
      }
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

  memoryOverrides = finalData;
  currentSource = "remote";
  lastUpdatedAt = incomingIso;

  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(finalData));
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
  memoryOverrides = data;
  currentSource = "remote";
  lastUpdatedAt = now;

  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
