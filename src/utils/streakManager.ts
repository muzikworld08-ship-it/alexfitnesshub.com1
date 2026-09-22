import { db, auth, isMockFirebase } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Consistency Streak Manager
 * Authoritative tracking of consecutive daily workout completions across all programs:
 * - Immortal 90 Day Challenge
 * - 180 Day Home Workout Challenge
 * - 5-Month Belly Fat Shred System
 * - Women Confidence Program
 * - Lifestyle & Academy Splits
 * - Daily Plan & Generator sessions
 */

export interface WorkoutCompletionRecord {
  id: string;
  programId: string;
  programTitle?: string;
  dayNumber?: number;
  workoutName?: string;
  completedAt: number; // Unix timestamp ms
  completedDateStr: string; // YYYY-MM-DD
  source?: "program" | "daily_plan" | "manual" | "activity_log";
}

export interface DayStreakStatus {
  dateStr: string;
  dayLabel: string; // "Mon", "Tue", etc.
  dayNumber: number; // Day of month 1-31
  isToday: boolean;
  isYesterday: boolean;
  isFuture: boolean;
  isCompleted: boolean;
  records: WorkoutCompletionRecord[];
}

export interface StreakMilestone {
  name: string;
  targetDays: number;
  previousTarget: number;
  progressDays: number;
  remainingDays: number;
  percent: number;
  badge: string;
  description: string;
}

export interface ConsistencyStreakData {
  currentStreak: number;
  longestStreak: number;
  totalWorkoutsCompleted: number;
  isTodayCompleted: boolean;
  isYesterdayCompleted: boolean;
  lastCompletedDate: string | null;
  status: "completed_today" | "pending_today" | "broken";
  statusText: string;
  motivationalQuote: string;
  timelineDays: DayStreakStatus[];
  milestone: StreakMilestone;
  allCompletedDates: string[];
}

const STREAK_HISTORY_KEY = "fit_workout_completion_history";
const HIGHEST_STREAK_KEY = "fit_highest_workout_streak";
const EVENT_NAME = "workout_completion_updated";

/**
 * Returns local date string in YYYY-MM-DD format
 */
export function getLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Normalizes any ISO string or timestamp to local YYYY-MM-DD
 */
export function normalizeDateToLocalDateStr(raw: string | number | Date): string {
  if (!raw) return getLocalDateString();
  const d = new Date(raw);
  if (isNaN(d.getTime())) return getLocalDateString();
  return getLocalDateString(d);
}

/**
 * Load raw completion records from local storage
 */
export function getStoredWorkoutCompletions(): WorkoutCompletionRecord[] {
  if (typeof window === "undefined" || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(STREAK_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Failed to load workout completion history:", err);
    return [];
  }
}

/**
 * Save raw completion records to local storage and broadcast
 */
function saveWorkoutCompletions(records: WorkoutCompletionRecord[]): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    localStorage.setItem(STREAK_HISTORY_KEY, JSON.stringify(records));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { records } }));
    
    // Asynchronously synchronize with Firestore so progress is mirrored across all devices
    const currentUid = auth?.currentUser?.uid;
    if (currentUid && !isMockFirebase) {
      setDoc(
        doc(db, "user_streak_history", currentUid),
        {
          userId: currentUid,
          records: records.slice(0, 150),
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      ).catch((err) => {
        console.warn("Notice: background streak sync to Firestore:", err?.message || err);
      });
    }
  } catch (err) {
    console.warn("Failed to save workout completion history:", err);
  }
}

/**
 * Synchronize streak records with Firestore across multiple devices
 */
export async function syncStreakWithFirestore(uid: string): Promise<WorkoutCompletionRecord[]> {
  if (!uid || isMockFirebase) return getStoredWorkoutCompletions();
  try {
    const snap = await getDoc(doc(db, "user_streak_history", uid));
    if (snap.exists()) {
      const cloudData = snap.data();
      const cloudRecords: WorkoutCompletionRecord[] = Array.isArray(cloudData.records) ? cloudData.records : [];
      const localRecords = getStoredWorkoutCompletions();
      
      const mergedMap = new Map<string, WorkoutCompletionRecord>();
      [...cloudRecords, ...localRecords].forEach(r => {
        const key = r.id || `${r.completedDateStr}_${r.programId}_${r.dayNumber || 0}`;
        if (!mergedMap.has(key)) {
          mergedMap.set(key, r);
        }
      });
      const mergedList = Array.from(mergedMap.values()).sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
      
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(STREAK_HISTORY_KEY, JSON.stringify(mergedList));
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { records: mergedList } }));
      }
      return mergedList;
    } else {
      const localRecords = getStoredWorkoutCompletions();
      if (localRecords.length > 0) {
        setDoc(
          doc(db, "user_streak_history", uid),
          {
            userId: uid,
            records: localRecords.slice(0, 150),
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        ).catch(() => {});
      }
      return localRecords;
    }
  } catch (err) {
    console.warn("Notice: Firestore streak sync exception:", err);
    return getStoredWorkoutCompletions();
  }
}

/**
 * Record a workout completion into the unified consistency log
 */
export function recordWorkoutCompletion(entry: {
  programId: string;
  programTitle?: string;
  dayNumber?: number;
  workoutName?: string;
  completedAt?: number;
  completedDateStr?: string;
  source?: "program" | "daily_plan" | "manual" | "activity_log";
}): WorkoutCompletionRecord {
  const now = entry.completedAt || Date.now();
  const dateStr = entry.completedDateStr || getLocalDateString(new Date(now));
  const recordId = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newRecord: WorkoutCompletionRecord = {
    id: recordId,
    programId: entry.programId || "general_workout",
    programTitle: entry.programTitle || getProgramDefaultTitle(entry.programId),
    dayNumber: entry.dayNumber,
    workoutName: entry.workoutName || `Day ${entry.dayNumber || 1} Workout`,
    completedAt: now,
    completedDateStr: dateStr,
    source: entry.source || "program"
  };

  const existing = getStoredWorkoutCompletions();
  
  // Prevent exact duplicate identical workout completion on the same calendar date
  const isDuplicate = existing.some(
    r => r.completedDateStr === dateStr && 
         r.programId === newRecord.programId && 
         (newRecord.dayNumber === undefined || r.dayNumber === newRecord.dayNumber)
  );

  if (!isDuplicate) {
    const updated = [newRecord, ...existing];
    saveWorkoutCompletions(updated);
  }

  return newRecord;
}

/**
 * Toggle or mark today's workout complete manually
 */
export function markTodayWorkoutComplete(programTitle: string = "Daily Scheduled Workout"): WorkoutCompletionRecord {
  return recordWorkoutCompletion({
    programId: "daily_scheduled",
    programTitle,
    dayNumber: 1,
    workoutName: "Scheduled Daily Training Session",
    source: "manual"
  });
}

/**
 * Remove any workout completed on a specific date (e.g. undo manual mark)
 */
export function removeWorkoutCompletionForDate(dateStr: string): void {
  const existing = getStoredWorkoutCompletions();
  const filtered = existing.filter(r => r.completedDateStr !== dateStr);
  saveWorkoutCompletions(filtered);
}

/**
 * Resolve friendly program titles
 */
export function getProgramDefaultTitle(programId: string): string {
  switch (programId) {
    case "immortal_90":
    case "90_day_immortal":
      return "Immortal 90 Day Challenge";
    case "home_workout":
    case "home_180_challenge":
    case "home_180":
      return "180 Day Home Workout Challenge";
    case "women_confidence":
      return "Women Confidence Program";
    case "belly_fat_shred":
      return "5-Month Belly Fat Shred System";
    case "lifestyle_academy":
    case "programs_academy":
      return "Lifestyle Fitness Academy";
    case "daily_plan":
      return "My Daily Plan";
    default:
      return "Scheduled Program Workout";
  }
}

/**
 * Aggregate all completion dates across all local and contextual sources
 */
export function collectAllCompletedDates(activityLogs: Array<{ date: string }> = []): {
  dateSet: Set<string>;
  recordsByDate: Record<string, WorkoutCompletionRecord[]>;
} {
  const dateSet = new Set<string>();
  const recordsByDate: Record<string, WorkoutCompletionRecord[]> = {};

  // 1. Load from primary unified history
  const history = getStoredWorkoutCompletions();
  history.forEach(r => {
    if (r.completedDateStr) {
      dateSet.add(r.completedDateStr);
      if (!recordsByDate[r.completedDateStr]) recordsByDate[r.completedDateStr] = [];
      recordsByDate[r.completedDateStr].push(r);
    }
  });

  // 2. Load from program wait states (fit_programs_wait_all)
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const waitAllRaw = localStorage.getItem("fit_programs_wait_all");
      if (waitAllRaw) {
        const waitAll = JSON.parse(waitAllRaw);
        Object.keys(waitAll).forEach(progId => {
          const item = waitAll[progId];
          if (item && (item.completedDateStr || item.completedAt)) {
            const dStr = item.completedDateStr || normalizeDateToLocalDateStr(item.completedAt);
            dateSet.add(dStr);
            if (!recordsByDate[dStr]) recordsByDate[dStr] = [];
            if (!recordsByDate[dStr].some(r => r.programId === progId)) {
              recordsByDate[dStr].push({
                id: `wait_${progId}_${item.completedDay}`,
                programId: progId,
                programTitle: getProgramDefaultTitle(progId),
                dayNumber: item.completedDay,
                completedAt: item.completedAt || Date.now(),
                completedDateStr: dStr,
                source: "program"
              });
            }
          }
        });
      }
    } catch (e) {
      console.warn("Could not parse fit_programs_wait_all for streaks:", e);
    }

    // 3. Scan program cooldown keys (fit_program_cooldown_*)
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("fit_program_cooldown_")) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const data = JSON.parse(raw);
            if (data?.completedDateStr || data?.completedAt) {
              const dStr = data.completedDateStr || normalizeDateToLocalDateStr(data.completedAt);
              dateSet.add(dStr);
            }
          }
        }
      }
    } catch (e) {}

    // 4. Scan 90-Day Challenge database in local storage
    try {
      const imm90 = localStorage.getItem("90_day_immortal_guest") || localStorage.getItem("fit_90_day_immortal");
      if (imm90) {
        const parsed = JSON.parse(imm90);
        if (Array.isArray(parsed?.workoutHistory)) {
          parsed.workoutHistory.forEach((wh: any) => {
            if (wh.date) {
              const dStr = normalizeDateToLocalDateStr(wh.date);
              dateSet.add(dStr);
            }
          });
        }
      }
    } catch (e) {}
  }

  // 5. Activity logs from AppContext / props
  if (Array.isArray(activityLogs)) {
    activityLogs.forEach(log => {
      if (log?.date) {
        const dStr = normalizeDateToLocalDateStr(log.date);
        dateSet.add(dStr);
        if (!recordsByDate[dStr]) recordsByDate[dStr] = [];
        if (!recordsByDate[dStr].some(r => r.id === (log as any).id)) {
          recordsByDate[dStr].push({
            id: (log as any).id || `act_${dStr}`,
            programId: "activity_log",
            programTitle: "Completed Workout Session",
            workoutName: (log as any).exerciseName || "Workout Activity",
            completedAt: new Date(log.date).getTime() || Date.now(),
            completedDateStr: dStr,
            source: "activity_log"
          });
        }
      }
    });
  }

  return { dateSet, recordsByDate };
}

/**
 * Calculate the milestone progress for a streak count
 */
export function calculateStreakMilestone(currentStreak: number): StreakMilestone {
  const MILESTONES = [
    { target: 3, name: "Spark of Momentum", badge: "⚡", description: "3 days of consecutive discipline" },
    { target: 7, name: "Iron Consistency", badge: "🛡️", description: "1 full week of uninterrupted training" },
    { target: 14, name: "Fortified Habit", badge: "⚔️", description: "2 weeks of relentless dedication" },
    { target: 21, name: "Discipline Master", badge: "🔥", description: "21 days — official habit crystallization" },
    { target: 30, name: "Centurion Champion", badge: "👑", description: "1 month of unbroken physical excellence" },
    { target: 45, name: "Elite Force", badge: "💎", description: "45 days of unyielding athletic focus" },
    { target: 60, name: "Titan Fortress", badge: "🏛️", description: "2 months of elite training adherence" },
    { target: 90, name: "Immortal Legend", badge: "🏆", description: "90 days of legendary athletic supremacy" },
    { target: 180, name: "Master of Iron", badge: "🌟", description: "Half a year of pristine consistency" }
  ];

  let prevTarget = 0;
  for (const m of MILESTONES) {
    if (currentStreak < m.target) {
      const progressDays = Math.max(0, currentStreak - prevTarget);
      const span = m.target - prevTarget;
      const percent = Math.min(100, Math.round((progressDays / span) * 100));
      return {
        name: m.name,
        targetDays: m.target,
        previousTarget: prevTarget,
        progressDays: currentStreak,
        remainingDays: m.target - currentStreak,
        percent,
        badge: m.badge,
        description: m.description
      };
    }
    prevTarget = m.target;
  }

  // Beyond 180 days: master tier
  return {
    name: "Immortal Legend",
    targetDays: currentStreak + 30,
    previousTarget: 180,
    progressDays: currentStreak,
    remainingDays: 30,
    percent: 100,
    badge: "🌟",
    description: "Transcendent athletic longevity"
  };
}

/**
 * Coach Alex motivational cue generator
 */
function getMotivationalQuote(streak: number, isTodayCompleted: boolean): string {
  if (streak === 0) {
    return "Every immortal transformation begins with a single day. Complete your workout today to ignite your streak!";
  }
  if (!isTodayCompleted) {
    if (streak === 1) return "Day 1 is in the books! Complete today's session to make it 2 days in a row.";
    if (streak >= 7) return `You've conquered ${streak} days in a row! Don't let your hard-earned streak break today.`;
    return `You're on a ${streak}-day roll! Finish today's scheduled workout to push it to ${streak + 1} days.`;
  }
  if (streak === 1) return "Outstanding first step! You've officially initiated your Consistency Streak.";
  if (streak === 2) return "Back-to-back days secured! Momentum is building fast.";
  if (streak === 3) return "3-day momentum reached! Neurological habit loops are taking root.";
  if (streak >= 7 && streak < 14) return "A full week of iron consistency! Your body and mind are adapting.";
  if (streak >= 14 && streak < 21) return "Two straight weeks of warrior discipline. Nothing stands in your way.";
  if (streak >= 21 && streak < 30) return "21-day breakthrough achieved! Exercise is now an ingrained identity.";
  if (streak >= 30) return `Astonishing ${streak}-day streak! You are operating at an elite athletic standard.`;
  return `${streak} consecutive days of pure execution. Keep the flame burning!`;
}

/**
 * Full calculation of Consistency Streak
 */
export function calculateConsistencyStreak(activityLogs: Array<{ date: string }> = []): ConsistencyStreakData {
  const { dateSet, recordsByDate } = collectAllCompletedDates(activityLogs);

  const today = new Date();
  const todayStr = getLocalDateString(today);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  const isTodayCompleted = dateSet.has(todayStr);
  const isYesterdayCompleted = dateSet.has(yesterdayStr);

  // Calculate current streak
  let currentStreak = 0;

  if (isTodayCompleted) {
    // Count today, then step back day by day
    currentStreak = 1;
    let checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1);

    while (dateSet.has(getLocalDateString(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else if (isYesterdayCompleted) {
    // User hasn't finished today's session yet, but yesterday was completed.
    // The streak is active and not broken, pending today's session.
    currentStreak = 1;
    let checkDate = new Date(yesterday);
    checkDate.setDate(checkDate.getDate() - 1);

    while (dateSet.has(getLocalDateString(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else {
    // Neither today nor yesterday was completed -> streak broken
    currentStreak = 0;
  }

  // Calculate longest historical streak
  let calculatedLongest = 0;
  const sortedDates = Array.from(dateSet).sort();

  if (sortedDates.length > 0) {
    let tempStreak = 1;
    calculatedLongest = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1] + "T00:00:00");
      const curr = new Date(sortedDates[i] + "T00:00:00");
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        tempStreak++;
        if (tempStreak > calculatedLongest) {
          calculatedLongest = tempStreak;
        }
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
  }

  // Persist / update highest recorded streak
  let storedHighest = 0;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      storedHighest = parseInt(localStorage.getItem(HIGHEST_STREAK_KEY) || "0", 10) || 0;
      const trueMax = Math.max(calculatedLongest, currentStreak, storedHighest);
      if (trueMax > storedHighest) {
        localStorage.setItem(HIGHEST_STREAK_KEY, trueMax.toString());
        storedHighest = trueMax;
      }
    } catch (e) {}
  }

  const longestStreak = Math.max(calculatedLongest, currentStreak, storedHighest);
  const totalWorkoutsCompleted = dateSet.size;

  // Status computation
  let status: "completed_today" | "pending_today" | "broken" = "broken";
  let statusText = "Streak Inactive • Start Day 1";

  if (isTodayCompleted) {
    status = "completed_today";
    statusText = `Streak Secured • Day ${currentStreak} Complete`;
  } else if (currentStreak > 0) {
    status = "pending_today";
    statusText = `Streak In Progress • Complete Today for Day ${currentStreak + 1}`;
  }

  // Generate 7-day rolling timeline (last 6 days + today)
  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const timelineDays: DayStreakStatus[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dStr = getLocalDateString(d);
    const isThisToday = dStr === todayStr;
    const isThisYesterday = dStr === yesterdayStr;
    const isDone = dateSet.has(dStr);

    timelineDays.push({
      dateStr: dStr,
      dayLabel: DAY_NAMES[d.getDay()],
      dayNumber: d.getDate(),
      isToday: isThisToday,
      isYesterday: isThisYesterday,
      isFuture: false,
      isCompleted: isDone,
      records: recordsByDate[dStr] || []
    });
  }

  const milestone = calculateStreakMilestone(currentStreak);
  const motivationalQuote = getMotivationalQuote(currentStreak, isTodayCompleted);

  return {
    currentStreak,
    longestStreak,
    totalWorkoutsCompleted,
    isTodayCompleted,
    isYesterdayCompleted,
    lastCompletedDate: sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null,
    status,
    statusText,
    motivationalQuote,
    timelineDays,
    milestone,
    allCompletedDates: sortedDates
  };
}
