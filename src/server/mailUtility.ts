import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  setDoc,
  getFirestore
} from "firebase/firestore";

// Initialize Lazy MailerSend Instance
let mailerSendClient: MailerSend | null = null;

export function getMailerSend(): MailerSend | null {
  if (!mailerSendClient) {
    const key = process.env.MAILERSEND_API_KEY || process.env.API_KEY || "";
    if (!key) {
      console.warn("[MailerSend Utility] MAILERSEND_API_KEY is not defined. Email dispatch will operate in simulation mode.");
      return null;
    }
    mailerSendClient = new MailerSend({
      apiKey: key,
    });
  }
  return mailerSendClient;
}

// Brand Header & Footer HTML Components
const brandHeaderHtml = `
  <div style="background-color: #090d16; padding: 32px 24px; text-align: center; border-radius: 16px 16px 0 0; border-bottom: 3px solid #C0392B;">
    <h1 style="color: #ffffff; font-family: 'Space Grotesk', 'Inter', Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; margin: 0; text-transform: uppercase;">
      ALEX<span style="color: #C0392B;">FITNESSHUB</span>
    </h1>
    <p style="color: #94A3B8; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 10px; font-weight: bold; margin: 6px 0 0 0; letter-spacing: 2px; text-transform: uppercase;">
      ATHLETE CALIBRATION ENGINE
    </p>
  </div>
`;

const brandFooterHtml = `
  <div style="background-color: #090d16; padding: 24px; text-align: center; border-radius: 0 0 16px 16px; margin-top: 32px; border-top: 1px solid #1E293B;">
    <p style="color: #64748B; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 11px; line-height: 1.6; margin: 0;">
      You are receiving this automated email notification from AlexFitnessHub based on your active training profile and Firestore platform triggers.
    </p>
    <p style="color: #94A3B8; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 11px; margin: 12px 0 0 0; font-weight: bold;">
      Direct Coaching Support & Inquiries:
    </p>
    <div style="margin-top: 10px;">
      <a href="mailto:alexfitnesshub@gmail.com" style="color: #C0392B; text-decoration: none; font-weight: bold; font-family: 'JetBrains Mono', monospace; font-size: 11px; margin: 0 10px;">alexfitnesshub@gmail.com</a>
      <span style="color: #334155;">|</span>
      <a href="https://wa.me/2347073307875" style="color: #C0392B; text-decoration: none; font-weight: bold; font-family: 'JetBrains Mono', monospace; font-size: 11px; margin: 0 10px;">WhatsApp Support Desk</a>
    </div>
    <p style="color: #475569; font-family: 'JetBrains Mono', monospace; font-size: 9px; margin: 16px 0 0 0; letter-spacing: 1px;">
      &copy; 2026 ALEXFITNESSHUB. ALL RIGHTS RESERVED.
    </p>
  </div>
`;

export function wrapInBrandTemplate(contentHtml: string): string {
  return `
    <div style="background-color: #F8FAFC; padding: 40px 16px; min-height: 100%; width: 100%; box-sizing: border-box;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025); overflow: hidden;">
        ${brandHeaderHtml}
        <div style="padding: 40px 32px; background-color: #ffffff; color: #1E293B;">
          ${contentHtml}
        </div>
        ${brandFooterHtml}
      </div>
    </div>
  `;
}

// Low-level MailerSend dispatch helper
export async function sendEmailViaMailerSend(
  to: string, 
  subject: string, 
  htmlContent: string, 
  plainTextContent: string
): Promise<{ success: boolean; result?: any; simulated?: boolean }> {
  const mailer = getMailerSend();
  const recipientName = to.split("@")[0] || "Athlete";

  if (!mailer) {
    console.log(`[MailerSend Simulated Dispatch]
To: ${to} (${recipientName})
Subject: "${subject}"
Content Preview: ${plainTextContent.substring(0, 120)}...
Status: API key not configured - logged in simulation mode.`);
    return { success: true, simulated: true };
  }

  try {
    const senderEmail = process.env.MAILERSEND_SENDER_EMAIL || "info@alexfitnesshub.com";
    const senderName = process.env.MAILERSEND_SENDER_NAME || "AlexFitnessHub";

    const sentFrom = new Sender(senderEmail, senderName);
    const recipients = [new Recipient(to, recipientName)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setHtml(htmlContent)
      .setText(plainTextContent);

    const result = await mailer.email.send(emailParams);
    console.log(`[MailerSend Success] Email delivered to ${to}. Result:`, result);
    return { success: true, result };
  } catch (error: any) {
    console.error(`[MailerSend Error] Delivery failed to ${to}:`, error);
    if (error.response?.body) {
      console.error(`[MailerSend API Error Body]:`, JSON.stringify(error.response.body));
    }
    throw error;
  }
}

/**
 * 1. AUTOMATED WELCOME EMAIL
 */
export async function sendWelcomeEmail(email: string, displayName?: string) {
  const athleteName = displayName || email.split("@")[0] || "Athlete";
  const appUrl = process.env.APP_URL || "https://alexfitnesshub.com";
  const subject = `🚀 Welcome to AlexFitnessHub, ${athleteName}! Your Athlete Account is Active.`;

  const plainText = `
Welcome to AlexFitnessHub, ${athleteName}!

Your athlete profile is officially active. You now have full access to our sports science platform, exercise libraries, AI coaching feedback, and custom high-density workout regimens.

Key Platform Features Available Now:
1. Centralized Exercise Library & Biomechanics
2. 5-Month Belly Fat Shred Program
3. AI Coach Assistant for Form & Nutrition
4. Daily Workout & Biometric Logging

Launch your dashboard now: ${appUrl}

To your ultimate strength,
Coach Alex & The AlexFitnessHub Team
  `.trim();

  const bodyHtml = `
    <h2 style="font-family: 'Space Grotesk', 'Inter', Helvetica, Arial, sans-serif; font-size: 22px; font-weight: bold; color: #0F172A; margin: 0 0 12px 0; letter-spacing: -0.5px;">
      Welcome to the Athlete Squad, ${athleteName}! 🚀
    </h2>
    <p style="font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
      Your profile has been created and verified on the <strong style="color: #0F172A;">AlexFitnessHub</strong> sports science engine. You are now officially cleared to track workouts, log biometrics, and train with world-class biomechanical guidance.
    </p>

    <!-- HIGHLIGHTED CARDS -->
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-left: 4px solid #C0392B; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
      <h3 style="font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 13px; font-weight: bold; color: #0F172A; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
        ⚡ Immediate Onboarding Actions:
      </h3>
      <ul style="font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #475569; margin: 0; padding-left: 18px;">
        <li style="margin-bottom: 8px;"><strong style="color: #0F172A;">Set Your Biometrics</strong>: Log your initial weight and target goals on your portal.</li>
        <li style="margin-bottom: 8px;"><strong style="color: #0F172A;">Explore Workouts</strong>: Browse pre-made regimens designed for Hypertrophy, Strength, or Fat Loss.</li>
        <li style="margin-bottom: 8px;"><strong style="color: #0F172A;">Start the Belly Fat Shred</strong>: Access our signature 5-Month program to kickstart abdominal visceral fat reduction.</li>
        <li style="margin-bottom: 0;"><strong style="color: #0F172A;">Consult AI Coach</strong>: Get personalized nutritional breakdown & exercise biomechanics anytime.</li>
      </ul>
    </div>

    <p style="font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
      Whenever you log a workout or complete a milestone, your stats are synchronized directly to your dashboard and backed up to Cloud Firestore.
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${appUrl}" style="background-color: #C0392B; color: #ffffff; text-decoration: none; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: bold; padding: 14px 28px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(192, 57, 43, 0.3); text-transform: uppercase; letter-spacing: 0.5px;">
        Launch Athlete Portal
      </a>
    </div>

    <p style="font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 13px; color: #64748B; margin: 24px 0 0 0; border-top: 1px solid #E2E8F0; padding-top: 20px;">
      In health and performance,<br />
      <strong>Coach Alex</strong><br />
      <span style="font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #94A3B8;">Lead Sports Scientist & AI Head Coach</span>
    </p>
  `;

  const fullHtml = wrapInBrandTemplate(bodyHtml);
  return sendEmailViaMailerSend(email, subject, fullHtml, plainText);
}

/**
 * 2. AUTOMATED WORKOUT SUMMARY NOTIFICATION
 */
export interface WorkoutSummaryParams {
  recipientEmail: string;
  recipientName?: string;
  workoutTitle?: string;
  durationMinutes?: number;
  exercisesCompleted?: number | string[];
  caloriesBurned?: number;
  totalWorkoutsWeek?: number;
  milestones?: string[];
  advice?: string;
  loggedAt?: string;
}

export async function sendWorkoutSummaryNotification(params: WorkoutSummaryParams) {
  const {
    recipientEmail,
    recipientName,
    workoutTitle = "Training Session Completed",
    durationMinutes = 30,
    exercisesCompleted = 3,
    caloriesBurned = 250,
    totalWorkoutsWeek,
    milestones = [],
    advice,
    loggedAt = new Date().toLocaleDateString()
  } = params;

  const athleteName = recipientName || recipientEmail.split("@")[0] || "Athlete";
  const appUrl = process.env.APP_URL || "https://alexfitnesshub.com";
  const subject = `🔥 Workout Summary: ${workoutTitle} Completed! (${loggedAt})`;

  const exerciseListText = Array.isArray(exercisesCompleted) 
    ? exercisesCompleted.map(e => `- ${e}`).join("\n")
    : `${exercisesCompleted} exercise actions logged`;

  const plainText = `
Workout Summary Notification for ${athleteName}:

Workout: ${workoutTitle}
Date: ${loggedAt}
Duration: ${durationMinutes} minutes
Calories Burned: ${caloriesBurned} kcal
Exercises Completed:
${exerciseListText}

${milestones.length > 0 ? `Milestones:\n${milestones.map(m => `- ${m}`).join("\n")}\n` : ""}

View your complete history on AlexFitnessHub: ${appUrl}

Keep grinding!
Coach Alex
  `.trim();

  const exercisesHtml = Array.isArray(exercisesCompleted)
    ? exercisesCompleted.map(ex => `
        <li style="margin-bottom: 8px; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 13px; color: #334155;">
          ⚡ <strong>${ex}</strong>
        </li>
      `).join("")
    : `<p style="font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 14px; color: #334155; margin: 0;"><strong>${exercisesCompleted}</strong> exercises executed cleanly.</p>`;

  const milestonesHtml = milestones.length > 0 ? `
    <div style="background-color: #FFFDFD; border: 1px solid #FADBD8; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
      <h3 style="font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 13px; font-weight: bold; color: #C0392B; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
        🏆 Milestones & Achievements Unlocked:
      </h3>
      <ul style="margin: 0; padding-left: 0; list-style: none;">
        ${milestones.map(m => `
          <li style="margin-bottom: 6px; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 13px; color: #475569;">
            ✅ <strong>${m}</strong>
          </li>
        `).join("")}
      </ul>
    </div>
  ` : "";

  const adviceHtml = advice ? `
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
      <h3 style="font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 13px; font-weight: bold; color: #0F172A; margin: 0 0 8px 0; text-transform: uppercase;">
        💡 Coach Alex Biomechanical Advice:
      </h3>
      <p style="font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #475569; margin: 0;">
        ${advice}
      </p>
    </div>
  ` : "";

  const bodyHtml = `
    <div style="margin-bottom: 20px;">
      <span style="background-color: #FEF2F2; color: #C0392B; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: bold; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;">
        WORKOUT SUMMARY REPORT
      </span>
      <h2 style="font-family: 'Space Grotesk', 'Inter', Helvetica, Arial, sans-serif; font-size: 22px; font-weight: bold; color: #0F172A; margin: 8px 0 4px 0; letter-spacing: -0.5px;">
        ${workoutTitle}
      </h2>
      <p style="font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 12px; color: #64748B; margin: 0;">
        Logged on ${loggedAt} for athlete <strong>${athleteName}</strong>
      </p>
    </div>

    <!-- STATS SUMMARY GRID -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; border-collapse: separate; border-spacing: 8px;">
      <tr>
        <td width="33%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; text-align: center;">
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #64748B; font-weight: bold; display: block; text-transform: uppercase;">DURATION</span>
          <span style="font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 800; color: #0F172A; display: block; margin-top: 4px;">${durationMinutes}m</span>
        </td>
        <td width="33%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; text-align: center;">
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #64748B; font-weight: bold; display: block; text-transform: uppercase;">CALORIES</span>
          <span style="font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 800; color: #C0392B; display: block; margin-top: 4px;">${caloriesBurned}</span>
        </td>
        <td width="33%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; text-align: center;">
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #64748B; font-weight: bold; display: block; text-transform: uppercase;">THIS WEEK</span>
          <span style="font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 800; color: #0F172A; display: block; margin-top: 4px;">${totalWorkoutsWeek || 1}</span>
        </td>
      </tr>
    </table>

    <!-- EXERCISES BREAKDOWN -->
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
      <h3 style="font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 13px; font-weight: bold; color: #0F172A; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
        🏋️ Exercise Execution Log:
      </h3>
      <ul style="margin: 0; padding-left: 0; list-style: none;">
        ${exercisesHtml}
      </ul>
    </div>

    ${milestonesHtml}
    ${adviceHtml}

    <div style="text-align: center; margin: 32px 0;">
      <a href="${appUrl}" style="background-color: #0F172A; color: #ffffff; text-decoration: none; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 13px; font-weight: bold; padding: 12px 24px; border-radius: 8px; display: inline-block;">
        View Detailed Progress Dashboard
      </a>
    </div>

    <p style="font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 13px; color: #64748B; margin: 24px 0 0 0; border-top: 1px solid #E2E8F0; padding-top: 20px;">
      Stay consistent and keep holding the standard,<br />
      <strong>Coach Alex</strong>
    </p>
  `;

  const fullHtml = wrapInBrandTemplate(bodyHtml);
  return sendEmailViaMailerSend(recipientEmail, subject, fullHtml, plainText);
}

/**
 * 3. FIRESTORE MAIL QUEUE PROCESSOR
 * Scans Firestore 'mail' collection for documents marked with status: "pending"
 * or unhandled mail triggers, sends them via MailerSend, and marks them as "processed".
 */
let quotaCooldownUntil: number = 0;

export async function processPendingFirestoreMailQueue(db: any) {
  if (!db) return { processed: 0, errors: 0 };

  // Check if we are in quota cooldown period
  if (Date.now() < quotaCooldownUntil) {
    return { processed: 0, errors: 0, paused: true };
  }

  let processedCount = 0;
  let errorCount = 0;

  try {
    const mailRef = collection(db, "mail");
    const q = query(mailRef, where("status", "==", "pending"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { processed: 0, errors: 0 };
    }

    console.log(`[Firestore Mail Queue Worker] Found ${snapshot.size} pending mail triggers in Firestore...`);

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const docId = docSnap.id;
      const recipient = data.to || data.recipientEmail || data.email;
      const eventType = data.type || data.eventType || "generic";

      if (!recipient) {
        console.warn(`[Firestore Mail Queue] Document ${docId} has no recipient email address. Marking failed.`);
        await updateDoc(doc(db, "mail", docId), { status: "failed", error: "Missing recipient email" });
        errorCount++;
        continue;
      }

      try {
        console.log(`[Firestore Mail Queue] Processing trigger ${docId} (Type: ${eventType}) for ${recipient}...`);

        let sendResult;
        if (eventType === "welcome") {
          sendResult = await sendWelcomeEmail(recipient, data.displayName || data.name);
        } else if (eventType === "workout_summary") {
          sendResult = await sendWorkoutSummaryNotification({
            recipientEmail: recipient,
            recipientName: data.displayName || data.name,
            workoutTitle: data.workoutTitle || data.subject,
            durationMinutes: data.durationMinutes,
            exercisesCompleted: data.exercisesCompleted || data.exercises,
            caloriesBurned: data.caloriesBurned,
            milestones: data.milestones,
            advice: data.advice,
            loggedAt: data.loggedAt
          });
        } else {
          // Generic email payload
          const subject = data.subject || data.message?.subject || "AlexFitnessHub Update";
          const htmlContent = data.html || data.message?.html || wrapInBrandTemplate(`<p>${data.text || data.message?.text || ""}</p>`);
          const plainText = data.text || data.message?.text || "AlexFitnessHub notification.";
          
          sendResult = await sendEmailViaMailerSend(recipient, subject, htmlContent, plainText);
        }

        await updateDoc(doc(db, "mail", docId), {
          status: "processed",
          processedAt: new Date().toISOString(),
          mailerSendResult: sendResult || { success: true }
        });

        processedCount++;
        console.log(`[Firestore Mail Queue] Successfully processed trigger ${docId} for ${recipient}.`);
      } catch (err: any) {
        console.error(`[Firestore Mail Queue Error] Failed processing trigger ${docId}:`, err);
        await updateDoc(doc(db, "mail", docId), {
          status: "failed",
          failedAt: new Date().toISOString(),
          error: err.message || "Email dispatch failure"
        });
        errorCount++;
      }
    }
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    if (errMsg.includes("Quota limit exceeded") || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED")) {
      // Pause worker for 15 minutes on quota limit
      quotaCooldownUntil = Date.now() + 15 * 60 * 1000;
      console.warn(`[Firestore Mail Queue Worker] Firestore daily quota reached. Pausing worker polling for 15 minutes until ${new Date(quotaCooldownUntil).toLocaleTimeString()}. Direct API email dispatching remains functional.`);
    } else {
      console.warn(`[Firestore Mail Queue Worker Notice] Could not scan 'mail' collection:`, errMsg);
    }
  }

  return { processed: processedCount, errors: errorCount };
}

/**
 * 4. START BACKGROUND FIRESTORE MAIL WORKER
 * Periodically polls Firestore for new mail queue triggers every intervalMs.
 */
let isWorkerRunning = false;
let workerIntervalId: any = null;

export function startFirestoreMailWorker(db: any, intervalMs: number = 300000) {
  if (isWorkerRunning) {
    console.log("[Firestore Mail Worker] Already running.");
    return;
  }

  isWorkerRunning = true;
  console.log(`[Firestore Mail Worker Started] Polling Firestore 'mail' collection every ${intervalMs / 1000} seconds for MailerSend triggers...`);

  // Run immediately on boot
  processPendingFirestoreMailQueue(db).catch(err => console.warn("[Mail Worker Initial Run Notice]:", err?.message || err));

  // Set recurring interval
  workerIntervalId = setInterval(() => {
    processPendingFirestoreMailQueue(db).catch(err => console.warn("[Mail Worker Interval Notice]:", err?.message || err));
  }, intervalMs);
}

export function stopFirestoreMailWorker() {
  if (workerIntervalId) {
    clearInterval(workerIntervalId);
    workerIntervalId = null;
  }
  isWorkerRunning = false;
  console.log("[Firestore Mail Worker Stopped].");
}
