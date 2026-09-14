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

/**
 * Dispatches next-day morning workout reminder email to the user via Resend API.
 * Requirement: Only sends on active workout days (not rest days), and stops displaying on home page.
 */
export async function dispatchMorningWorkoutEmailNotification(
  userEmail: string,
  userName?: string
): Promise<{ sent: boolean; message: string }> {
  if (!userEmail || !userEmail.includes("@")) {
    return { sent: false, message: "No valid user email provided." };
  }

  const all = getAllScheduledMorningNotifications();
  const todayStr = getFormattedDate(new Date());
  const keys = Object.keys(all);
  if (keys.length === 0) return { sent: false, message: "No scheduled notifications found." };

  for (const key of keys) {
    const item = all[key];
    if (!item) continue;

    // Check if target date reached and email not already sent today
    if (todayStr >= item.targetDate && item.notificationFiredForDate !== todayStr) {
      // Check if nextDay is an active workout day (not rest day)
      const dayCycle = ((item.nextDay - 1) % 7) + 1;
      const isRestDay = dayCycle === 7;

      if (isRestDay) {
        console.log(`[Email Notification] Day ${item.nextDay} is a scheduled Rest Day for ${item.programName}. Skipping workout email notification as requested.`);
        item.notificationFiredForDate = todayStr;
        localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(all));
        continue;
      }

      try {
        const subject = `🌅 Good Morning! Time for Day ${item.nextDay} Workout - ${item.programName}`;
        const recipientName = userName || userEmail.split("@")[0] || "Athlete";
        const emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090d16; color: #f8fafc; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid #1e293b;">
            <div style="text-align: center; border-bottom: 2px solid #ef4444; padding-bottom: 20px; margin-bottom: 24px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
                ALEX<span style="color: #ef4444;">FITNESSHUB</span>
              </h1>
              <p style="color: #94a3b8; font-size: 11px; margin: 6px 0 0; text-transform: uppercase; letter-spacing: 2px;">
                MORNING WORKOUT ALERT
              </p>
            </div>
            <div style="padding: 10px 0;">
              <h2 style="color: #ffffff; font-size: 20px; font-weight: 700; margin-bottom: 12px;">
                Good Morning, ${recipientName}!
              </h2>
              <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
                You crushed Day ${item.completedDay} of your <strong>${item.programName}</strong>. Today is an active workout day, and <strong>Day ${item.nextDay}</strong> is waiting for you on your athlete desk!
              </p>
              <div style="background-color: #1e293b; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #f8fafc; font-weight: 600; font-size: 14px;">
                  📋 Protocol: Day ${item.nextDay} of ${item.totalDays}
                </p>
                <p style="margin: 6px 0 0; color: #94a3b8; font-size: 13px;">
                  Fuel up with high protein, hydrate with at least 500ml water before starting, and execute your sets with precision.
                </p>
              </div>
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://alexfitnesshub.com" style="background-color: #ef4444; color: #ffffff; padding: 14px 28px; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 8px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
                  Start Day ${item.nextDay} Workout
                </a>
              </div>
            </div>
            <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #1e293b; text-align: center; color: #64748b; font-size: 12px;">
              <p style="margin: 0;">Stay committed. Consistency transforms athletic potential.</p>
              <p style="margin: 4px 0 0;">AlexFitnessHub &copy; 2026. All rights reserved.</p>
            </div>
          </div>
        `;

        await fetch("/api/resend/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: userEmail,
            subject,
            html: emailHtml,
            programName: item.programName,
            dayNumber: item.nextDay
          })
        });

        item.notificationFiredForDate = todayStr;
        localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(all));
        return { sent: true, message: `Dispatched workout email to ${userEmail} for Day ${item.nextDay}` };
      } catch (err) {
        console.warn("[Email Notification] Failed to dispatch via Resend API:", err);
      }
    }
  }

  return { sent: false, message: "No workout notifications due for today." };
}

