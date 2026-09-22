/**
 * Email Notification Service
 * Dispatches workout completion, congrats messages, and daily protocols
 * via Resend API (with MailerSend fallback & Firestore logging).
 */

export interface SendEmailOptions {
  to?: string;
  recipientEmail?: string;
  recipientName?: string;
  programName?: string;
  dayNumber?: number;
  caloriesBurned?: number;
  durationMinutes?: number;
  exercisesCompleted?: string[] | number;
  subject?: string;
  customHtml?: string;
  customText?: string;
}

export interface SendEmailResult {
  success: boolean;
  provider?: "resend" | "mailersend" | "simulated";
  id?: string;
  message?: string;
  error?: string;
}

/**
 * Trigger the 'Congrats' workout completion email to the user.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const targetEmail = (options.to || options.recipientEmail || "").trim();

  if (!targetEmail || !targetEmail.includes("@")) {
    console.warn("[sendEmail] Invalid or missing recipient email address:", targetEmail);
    return {
      success: false,
      error: "Valid recipient email address is required."
    };
  }

  const programName = options.programName || "AlexFitnessHub Training System";
  const dayNumber = options.dayNumber || 1;
  const caloriesBurned = options.caloriesBurned || 350;
  const subject = options.subject || `🎉 Congratulations on Finishing Today's Workout! - ${programName}`;

  console.log(`[sendEmail] Sending workout congrats email to ${targetEmail} for ${programName} (Day ${dayNumber})...`);

  // Attempt 1: Resend API (/api/resend/send)
  try {
    const resendResponse = await fetch("/api/resend/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: targetEmail,
        subject,
        programName,
        dayNumber,
        caloriesBurned,
        html: options.customHtml,
        text: options.customText
      })
    });

    const data = await resendResponse.json();
    if (resendResponse.ok && data.success) {
      console.log(`[sendEmail] Successfully dispatched via Resend API:`, data);
      return {
        success: true,
        provider: "resend",
        id: data.id || data.messageId,
        message: `Congrats email successfully delivered via Resend to ${targetEmail}!`
      };
    } else {
      console.warn(`[sendEmail] Resend API returned non-success (${resendResponse.status}):`, data);
    }
  } catch (resendErr) {
    console.warn(`[sendEmail] Resend API network error, attempting MailerSend fallback:`, resendErr);
  }

  // Attempt 2: Fallback to workout-summary (/api/mail/workout-summary)
  try {
    const mailResponse = await fetch("/api/mail/workout-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientEmail: targetEmail,
        recipientName: options.recipientName || targetEmail.split("@")[0] || "Athlete",
        workoutTitle: `${programName} - Day ${dayNumber}`,
        durationMinutes: options.durationMinutes || 45,
        caloriesBurned,
        exercisesCompleted: options.exercisesCompleted || ["Completed scheduled drills"],
        milestones: [`Crushed Day ${dayNumber} of ${programName}`, "Maintained strict 5-hour recovery window"],
        advice: "Cut out refined sugars immediately and cease eating after 7:30 PM to optimize deep sleep fat burning."
      })
    });

    const mailData = await mailResponse.json();
    if (mailResponse.ok && mailData.success) {
      console.log(`[sendEmail] Successfully dispatched via MailerSend fallback:`, mailData);
      return {
        success: true,
        provider: "mailersend",
        id: mailData.result?.id,
        message: `Congrats email delivered via MailerSend fallback to ${targetEmail}!`
      };
    }
  } catch (fallbackErr) {
    console.warn(`[sendEmail] MailerSend fallback error:`, fallbackErr);
  }

  return {
    success: false,
    error: "Failed to dispatch email via both Resend and MailerSend endpoints."
  };
}

export default sendEmail;
