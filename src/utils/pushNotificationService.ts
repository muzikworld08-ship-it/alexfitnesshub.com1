import { WorkoutReminderSchedule } from "../types";
export type { WorkoutReminderSchedule };
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export const STORAGE_KEY_REMINDER_SCHEDULE = "alexfit_workout_reminder_schedule";
export const REMINDER_SCHEDULE_EVENT = "alexfit:workout_reminder_schedule_updated";
export const NOTIFICATION_CLICK_NAV_EVENT = "alexfit:notification_navigate";

export const DEFAULT_REMINDER_SCHEDULE: WorkoutReminderSchedule = {
  enabled: false,
  scheduledTime: "08:00",
  leadTimeMinutes: 0,
  activeDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
  soundEnabled: true,
  programPreference: "all",
  customLabel: "Daily Training Session"
};

export type PushPermissionStatus = "default" | "granted" | "denied" | "unsupported";

/**
 * Check if browser supports notifications
 */
export function isPushNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

/**
 * Get current browser notification permission status
 */
export function getNotificationPermission(): PushPermissionStatus {
  if (!isPushNotificationSupported()) return "unsupported";
  return Notification.permission as PushPermissionStatus;
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<PushPermissionStatus> {
  if (!isPushNotificationSupported()) return "unsupported";

  try {
    const result = await Notification.requestPermission();
    return result as PushPermissionStatus;
  } catch (err) {
    console.error("[Push Notification] Error requesting permission:", err);
    return Notification.permission as PushPermissionStatus;
  }
}

/**
 * Get saved workout reminder schedule
 */
export function getSavedReminderSchedule(): WorkoutReminderSchedule {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_REMINDER_SCHEDULE);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_REMINDER_SCHEDULE,
        ...parsed
      };
    }
  } catch (e) {
    console.error("[Push Notification] Failed to load schedule from storage:", e);
  }
  return { ...DEFAULT_REMINDER_SCHEDULE };
}

/**
 * Save workout reminder schedule and sync with Firestore if authenticated
 */
export async function saveReminderSchedule(
  schedule: WorkoutReminderSchedule,
  userUid?: string
): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY_REMINDER_SCHEDULE, JSON.stringify(schedule));
    window.dispatchEvent(
      new CustomEvent(REMINDER_SCHEDULE_EVENT, { detail: schedule })
    );

    // Sync to Firestore user profile document if available
    if (userUid && db) {
      try {
        const userRef = doc(db, "users", userUid);
        await updateDoc(userRef, {
          workoutReminderSchedule: schedule
        });
      } catch (cloudErr) {
        // Non-blocking: local storage is already updated
        console.warn("[Push Notification] Firestore schedule sync notice:", cloudErr);
      }
    }
  } catch (err) {
    console.error("[Push Notification] Failed to save schedule:", err);
  }
}

/**
 * Synthesizes an athletic, clean dual-tone notification chime using Web Audio API
 */
export function playWorkoutReminderChime(): void {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Tone 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.exponentialRampToValueAtTime(0.25, now + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.28);

    // Tone 2: 880.00 Hz (A5 - higher energetic finish)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880.0, now + 0.12);
    gain2.gain.setValueAtTime(0.001, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.3, now + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (err) {
    // Audio autoplay or context failure is non-fatal
    console.warn("[Push Notification] Audio chime playback error:", err);
  }
}

export interface DispatchNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: {
    url?: string;
    programId?: string;
    action?: string;
    [key: string]: any;
  };
  playSound?: boolean;
}

/**
 * Dispatches a native browser notification (using ServiceWorker if available, falling back to Notification constructor)
 */
export async function dispatchBrowserWorkoutNotification(
  options: DispatchNotificationOptions
): Promise<boolean> {
  if (!isPushNotificationSupported()) return false;
  if (Notification.permission !== "granted") return false;

  const title = options.title;
  const body = options.body;
  const icon = options.icon || "/icons/icon-192.png";
  const badge = options.badge || "/favicon.png";
  const tag = options.tag || "alexfit-scheduled-workout";
  const data = options.data || { url: "/?view=challenges" };

  if (options.playSound !== false) {
    playWorkoutReminderChime();
  }

  // 1. Attempt Service Worker Notification first (handles rich actions & background clicks)
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration && "showNotification" in registration) {
        await registration.showNotification(title, {
          body,
          icon,
          badge,
          tag,
          data,
          vibrate: [200, 100, 200],
          requireInteraction: true,
          actions: [
            { action: "start", title: "🚀 Start Workout" },
            { action: "dismiss", title: "Dismiss" }
          ]
        } as any);
        return true;
      }
    } catch (swErr) {
      console.warn("[Push Notification] SW showNotification failed, using fallback:", swErr);
    }
  }

  // 2. Direct Window Notification fallback
  try {
    const notification = new Notification(title, {
      body,
      icon,
      badge,
      tag,
      data
    });

    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notification.close();
      window.dispatchEvent(
        new CustomEvent(NOTIFICATION_CLICK_NAV_EVENT, { detail: data })
      );
    };

    return true;
  } catch (err) {
    console.error("[Push Notification] Native Notification dispatch failed:", err);
    return false;
  }
}

/**
 * Format 24-hour time "08:30" to readable "8:30 AM"
 */
export function formatTime12Hour(time24: string): string {
  if (!time24 || !time24.includes(":")) return time24 || "08:00 AM";
  const [hStr, mStr] = time24.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = String(m).padStart(2, "0");
  return `${displayH}:${displayM} ${ampm}`;
}

/**
 * Computes trigger hour and minute taking lead time into account
 */
export function calculateTriggerTime(
  scheduledTime: string,
  leadMinutes: number
): { hour: number; minute: number } {
  const [hStr, mStr] = (scheduledTime || "08:00").split(":");
  let totalMinutes = parseInt(hStr, 10) * 60 + parseInt(mStr, 10) - (leadMinutes || 0);

  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }

  return {
    hour: Math.floor(totalMinutes / 60) % 24,
    minute: totalMinutes % 60
  };
}

/**
 * Calculate the next upcoming scheduled reminder occurrence description
 */
export function getNextScheduledReminderInfo(
  schedule: WorkoutReminderSchedule
): {
  isScheduled: boolean;
  nextDate: Date | null;
  displaySummary: string;
  timeRemaining: string;
} {
  if (!schedule.enabled || !schedule.activeDays || schedule.activeDays.length === 0) {
    return {
      isScheduled: false,
      nextDate: null,
      displaySummary: "Reminders are currently paused",
      timeRemaining: ""
    };
  }

  const now = new Date();
  const triggerTime = calculateTriggerTime(schedule.scheduledTime, schedule.leadTimeMinutes);

  // Look ahead up to 7 days
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const candidate = new Date(now);
    candidate.setDate(candidate.getDate() + dayOffset);
    candidate.setHours(triggerTime.hour, triggerTime.minute, 0, 0);

    const dayOfWeek = candidate.getDay(); // 0 = Sunday, 1 = Monday...
    if (!schedule.activeDays.includes(dayOfWeek)) {
      continue;
    }

    // If dayOffset is 0 (today), candidate must be in the future
    if (dayOffset === 0 && candidate.getTime() <= now.getTime()) {
      continue;
    }

    // Found next occurrence!
    const diffMs = candidate.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    const timeRemainingStr =
      diffHours > 0
        ? `in ${diffHours}h ${diffMins}m`
        : `in ${diffMins}m`;

    const dayName =
      dayOffset === 0
        ? "Today"
        : dayOffset === 1
        ? "Tomorrow"
        : candidate.toLocaleDateString(undefined, { weekday: "long" });

    const leadNote =
      schedule.leadTimeMinutes > 0
        ? ` (${schedule.leadTimeMinutes}m before your ${formatTime12Hour(schedule.scheduledTime)} workout)`
        : "";

    return {
      isScheduled: true,
      nextDate: candidate,
      displaySummary: `${dayName} at ${formatTime12Hour(
        `${String(triggerTime.hour).padStart(2, "0")}:${String(triggerTime.minute).padStart(2, "0")}`
      )}${leadNote}`,
      timeRemaining: timeRemainingStr
    };
  }

  return {
    isScheduled: false,
    nextDate: null,
    displaySummary: "No upcoming scheduled days found",
    timeRemaining: ""
  };
}

/**
 * Check if a reminder should fire right now based on current clock and schedule
 */
export async function checkAndTriggerScheduledReminder(
  schedule: WorkoutReminderSchedule,
  userName?: string
): Promise<boolean> {
  if (!schedule.enabled) return false;
  if (!isPushNotificationSupported()) return false;
  if (Notification.permission !== "granted") return false;

  const now = new Date();
  const currentDayOfWeek = now.getDay();

  // 1. Is today an active workout day?
  if (!schedule.activeDays.includes(currentDayOfWeek)) {
    return false;
  }

  // 2. Compute trigger time
  const trigger = calculateTriggerTime(schedule.scheduledTime, schedule.leadTimeMinutes);
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  if (currentHour !== trigger.hour || currentMinute !== trigger.minute) {
    return false;
  }

  // 3. Prevent duplicate triggers on the exact same date and trigger time
  const todayStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const triggerKey = `${todayStr}_${currentHour}:${currentMinute}`;
  const lastFiredKey = localStorage.getItem("alexfit_last_reminder_fired_key");

  if (lastFiredKey === triggerKey) {
    return false;
  }

  // Prepare notification copy
  const athleteName = userName ? userName.split(" ")[0] : "Athlete";
  const workoutTimeDisplay = formatTime12Hour(schedule.scheduledTime);
  const isEarlyLead = schedule.leadTimeMinutes > 0;

  let title = `⏰ Scheduled Workout Alert - ${workoutTimeDisplay}`;
  let body = `Hey ${athleteName}! It's time for your scheduled physical training session. Step in and dominate today's workout!`;

  if (isEarlyLead) {
    title = `⏰ Workout in ${schedule.leadTimeMinutes} Minutes! (${workoutTimeDisplay})`;
    body = `Hey ${athleteName}, your training begins at ${workoutTimeDisplay}. Prepare your gear, hydrate, and get ready!`;
  }

  const dispatched = await dispatchBrowserWorkoutNotification({
    title,
    body,
    tag: `alexfit-scheduled-workout-${todayStr}`,
    playSound: schedule.soundEnabled,
    data: {
      url: "/?view=challenges",
      action: "scheduled_workout_reminder",
      scheduledTime: schedule.scheduledTime
    }
  });

  if (dispatched) {
    localStorage.setItem("alexfit_last_reminder_fired_key", triggerKey);
    const updatedSchedule: WorkoutReminderSchedule = {
      ...schedule,
      lastFiredDate: todayStr,
      lastFiredTimestamp: Date.now()
    };
    saveReminderSchedule(updatedSchedule);
  }

  return dispatched;
}

/**
 * Send an immediate test workout notification to verify permissions and audio
 */
export async function sendTestWorkoutReminder(
  schedule: WorkoutReminderSchedule,
  userName?: string
): Promise<{ success: boolean; message: string }> {
  if (!isPushNotificationSupported()) {
    return {
      success: false,
      message: "Push Notifications are not supported by this browser."
    };
  }

  let permission = getNotificationPermission();
  if (permission !== "granted") {
    permission = await requestNotificationPermission();
    if (permission !== "granted") {
      return {
        success: false,
        message:
          "Notification permission was denied. Please allow notifications in your browser address bar settings to receive workout reminders."
      };
    }
  }

  const athleteName = userName ? userName.split(" ")[0] : "Athlete";
  const formattedTime = formatTime12Hour(schedule.scheduledTime);

  const title = `🏋️ AlexFitnessHub Workout Reminder (Test)`;
  const body = `Awesome, ${athleteName}! Browser push alerts are working. Your scheduled daily reminder is set for ${formattedTime}.`;

  const success = await dispatchBrowserWorkoutNotification({
    title,
    body,
    tag: `alexfit-test-${Date.now()}`,
    playSound: schedule.soundEnabled,
    data: {
      url: "/?view=challenges",
      action: "test_push_notification"
    }
  });

  return {
    success,
    message: success
      ? `Push alert dispatched! Check your desktop/mobile notification tray.`
      : "Could not display notification. Ensure system 'Do Not Disturb' or Focus mode is turned off."
  };
}
