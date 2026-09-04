export interface ScheduledMorningNotification {
  programId: string;
  programName: string;
  completedDay: number;
  nextDay: number;
  totalDays: number;
  completedDate: string; // YYYY-MM-DD
  targetDate: string;    // YYYY-MM-DD (next morning)
  dismissedForDate?: string;
  notificationFiredForDate?: string;
}

const STORAGE_KEY_NOTIFICATIONS = "alexfit_scheduled_morning_notifications";
const NOTIFICATION_EVENT = "alexfit:morning_notification_update";

/**
 * Get formatted YYYY-MM-DD string
 */
export function getFormattedDate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Get all scheduled program notifications
 */
export function getAllScheduledMorningNotifications(): Record<string, ScheduledMorningNotification> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to parse morning notifications:", err);
  }
  return {};
}

/**
 * Schedule next day morning workout notification after completing Day X
 */
export function scheduleNextDayMorningNotification({
  programId,
  programName,
  completedDay,
  totalDays = 90
}: {
  programId: string;
  programName: string;
  completedDay: number;
  totalDays?: number;
}): ScheduledMorningNotification | null {
  if (completedDay >= totalDays) {
    // Challenge complete! No next day
    const all = getAllScheduledMorningNotifications();
    delete all[programId];
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent(NOTIFICATION_EVENT, { detail: { programId, completed: true } }));
    return null;
  }

  const nextDay = completedDay + 1;
  const today = new Date();
  const completedDate = getFormattedDate(today);

  // Next morning target
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const targetDate = getFormattedDate(tomorrow);

  const notificationItem: ScheduledMorningNotification = {
    programId,
    programName,
    completedDay,
    nextDay,
    totalDays,
    completedDate,
    targetDate
  };

  const all = getAllScheduledMorningNotifications();
  all[programId] = notificationItem;
  localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(all));

  // Also request notification permission in background if not already decided
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().catch(() => {});
  }

  window.dispatchEvent(new CustomEvent(NOTIFICATION_EVENT, { detail: notificationItem }));
  return notificationItem;
}

/**
 * Check if there is an active morning notification ready to display right now
 * (i.e. currentDate >= targetDate, or test mode enabled)
 */
export function getActiveMorningNotification(testMode: boolean = false): ScheduledMorningNotification | null {
  const all = getAllScheduledMorningNotifications();
  const todayStr = getFormattedDate(new Date());

  const keys = Object.keys(all);
  if (keys.length === 0) return null;

  for (const key of keys) {
    const item = all[key];
    if (!item) continue;

    // In test mode, return the most recent active item
    if (testMode) {
      return item;
    }

    // Normal mode: active if today >= targetDate and not dismissed today
    if (todayStr >= item.targetDate && item.dismissedForDate !== todayStr) {
      return item;
    }
  }

  return null;
}

/**
 * Dismiss morning notification for today
 */
export function dismissMorningNotification(programId: string): void {
  const all = getAllScheduledMorningNotifications();
  if (all[programId]) {
    all[programId].dismissedForDate = getFormattedDate(new Date());
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent(NOTIFICATION_EVENT, { detail: { programId, dismissed: true } }));
  }
}

/**
 * Trigger browser native push notification for morning workout
 */
export function triggerMorningBrowserNotification(notification: ScheduledMorningNotification): void {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const todayStr = getFormattedDate(new Date());
  // Prevent firing multiple times on the exact same calendar day
  if (notification.notificationFiredForDate === todayStr) {
    return;
  }

  try {
    const title = `🌅 Good Morning! Time for Day ${notification.nextDay} Workout!`;
    const body = `You crushed Day ${notification.completedDay} of ${notification.programName}. Your Day ${notification.nextDay} challenge is waiting for you!`;
    new Notification(title, {
      body,
      icon: "/favicon.ico",
      tag: `alexfit-morning-${notification.programId}-${notification.nextDay}`
    });

    const all = getAllScheduledMorningNotifications();
    if (all[notification.programId]) {
      all[notification.programId].notificationFiredForDate = todayStr;
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(all));
    }
  } catch (err) {
    console.warn("Native notification display failed:", err);
  }
}
