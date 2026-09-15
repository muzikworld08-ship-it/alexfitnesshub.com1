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

export interface ProgramEmailDeliveryParams {
  userEmail: string;
  userName?: string;
  programId: string;
  programName: string;
  completedDay?: number;
  nextDay: number;
  totalDays: number;
  progressPercent?: number;
  completedWorkoutCount?: number;
  lastStoppedWorkoutName?: string;
  forceSend?: boolean;
}

/**
 * Delivers program workout notifications directly to the user's email address
 * based on their enrolled program, tracking progress, and next scheduled day.
 */
export async function deliverProgramNotificationToEmail(
  params: ProgramEmailDeliveryParams
): Promise<{ sent: boolean; message: string }> {
  const {
    userEmail,
    userName,
    programId,
    programName,
    completedDay = 0,
    nextDay,
    totalDays,
    progressPercent = 0,
    completedWorkoutCount = 0,
    lastStoppedWorkoutName,
    forceSend = false
  } = params;

  if (!userEmail || !userEmail.includes("@")) {
    return { sent: false, message: "No valid user email provided." };
  }

  const todayStr = getFormattedDate(new Date());
  const emailSentKey = `alexfit_email_sent_${programId}_d${nextDay}_${todayStr}`;
  
  // Prevent duplicate sending on the same day unless forceSend is requested
  if (!forceSend && typeof localStorage !== "undefined" && localStorage.getItem(emailSentKey)) {
    return { sent: true, message: `Notification already delivered to ${userEmail} today.` };
  }

  const recipientName = userName || userEmail.split("@")[0] || "Athlete";
  const workoutTitle = lastStoppedWorkoutName || `Day ${nextDay} Power Protocol`;
  const calculatedPercent = progressPercent || Math.min(100, Math.round((nextDay / totalDays) * 100));

  const subject = `🔥 Workout Alert: Day ${nextDay} of ${programName} is Ready!`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 32px 20px; background-color: #0f172a; border-radius: 16px; border: 1px solid #1e293b; margin-top: 20px; margin-bottom: 20px;">
          
          <!-- Header Logo & Subtitle -->
          <div style="text-align: center; border-bottom: 2px solid #ef4444; padding-bottom: 20px; margin-bottom: 24px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">
              ALEX<span style="color: #ef4444;">FITNESSHUB</span>
            </h1>
            <p style="color: #94a3b8; font-size: 11px; margin: 6px 0 0; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">
              ATHLETE PROGRAM TRACKING &amp; WORKOUT DISPATCH
            </p>
          </div>

          <!-- Hero Greeting -->
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="background-color: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; padding: 6px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
              ${programName}
            </span>
            <h2 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 16px 0 8px;">
              Good Day, ${recipientName}!
            </h2>
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0;">
              Your scheduled program workout is ready. Consistent execution is the bridge between goals and reality.
            </p>
          </div>

          <!-- Program & Tracking Summary Card -->
          <div style="background-color: #1e293b; border-radius: 12px; padding: 20px; border: 1px solid #334155; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 14px;">
              <div>
                <p style="margin: 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Next Scheduled Session</p>
                <p style="margin: 4px 0 0; font-size: 16px; color: #ffffff; font-weight: 800;">Day ${nextDay} of ${totalDays}</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Program Progress</p>
                <p style="margin: 4px 0 0; font-size: 16px; color: #22c55e; font-weight: 800;">${calculatedPercent}%</p>
              </div>
            </div>

            <!-- Progress Bar -->
            <div style="width: 100%; background-color: #0f172a; height: 8px; border-radius: 9999px; overflow: hidden; margin-bottom: 16px;">
              <div style="background: linear-gradient(90deg, #ef4444, #f97316); width: ${calculatedPercent}%; height: 100%; border-radius: 9999px;"></div>
            </div>

            <!-- Session Details -->
            <div style="background-color: #0f172a; border-radius: 8px; padding: 12px 14px; border-left: 4px solid #ef4444;">
              <p style="margin: 0; font-size: 12px; color: #ef4444; font-weight: 700; text-transform: uppercase;">Session Focus</p>
              <p style="margin: 4px 0 0; font-size: 14px; color: #ffffff; font-weight: 700;">${workoutTitle}</p>
              ${completedDay > 0 ? `<p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">Completed checkpoint: Day ${completedDay}</p>` : ""}
            </div>
          </div>

          <!-- Direct Execution Button -->
          <div style="text-align: center; margin: 32px 0 24px;">
            <a href="https://alexfitnesshub.com" style="background-color: #ef4444; color: #ffffff; padding: 16px 32px; font-size: 15px; font-weight: 800; text-decoration: none; border-radius: 10px; display: inline-block; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);">
              Start Day ${nextDay} Workout Now
            </a>
          </div>

          <!-- Athlete Directives & Nutrition Tips -->
          <div style="background-color: #182234; border-radius: 10px; padding: 16px; border: 1px dashed #3b82f6; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 13px; color: #60a5fa; font-weight: 700; text-transform: uppercase;">
              ⚡ Athlete Performance Checklist
            </p>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #cbd5e1; line-height: 1.6;">
              <li>Drink 400ml - 500ml water 20 minutes before workout initiation</li>
              <li>Focus on full range of motion over sheer movement velocity</li>
              <li>Log your weight sets and reps to keep your progressive overload on target</li>
            </ul>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #1e293b; padding-top: 20px; text-align: center; color: #64748b; font-size: 12px; line-height: 1.5;">
            <p style="margin: 0;">Delivered directly to ${userEmail} according to your program and tracking schedule.</p>
            <p style="margin: 4px 0 0;">Manage alert frequency anytime in the Hamburger Menu > Notification Settings.</p>
            <p style="margin: 12px 0 0; color: #475569;">AlexFitnessHub &copy; 2026. All rights reserved.</p>
          </div>

        </div>
      </body>
    </html>
  `;

  try {
    const res = await fetch("/api/resend/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: userEmail,
        subject,
        html,
        programName,
        dayNumber: nextDay
      })
    });

    if (res.ok) {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(emailSentKey, new Date().toISOString());
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("alexfit:email_notification_delivered", {
          detail: { email: userEmail, programName, nextDay, timestamp: Date.now() }
        }));
      }
      return { sent: true, message: `Delivered workout notification to ${userEmail}` };
    }
  } catch (err) {
    console.warn("[deliverProgramNotificationToEmail] Failed:", err);
  }

  return { sent: false, message: "Could not send email. Please check network connectivity." };
}

