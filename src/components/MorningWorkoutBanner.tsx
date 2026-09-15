import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Flame, ChevronRight, X, Sun, Sparkles, Mail, CheckCircle, RefreshCw } from "lucide-react";
import { 
  getActiveMorningNotification, 
  dismissMorningNotification, 
  ScheduledMorningNotification,
  triggerMorningBrowserNotification,
  deliverProgramNotificationToEmail
} from "../utils/notificationScheduler";
import { useApp } from "../context/AppContext";
import { getSavedReminderSchedule } from "../utils/pushNotificationService";

interface MorningWorkoutBannerProps {
  onNavigateToProgram?: (programId: string, dayNumber: number) => void;
}

export default function MorningWorkoutBanner({ onNavigateToProgram }: MorningWorkoutBannerProps) {
  const { user, programProgress } = useApp();
  const [activeNotification, setActiveNotification] = useState<ScheduledMorningNotification | null>(null);
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [deliveredEmail, setDeliveredEmail] = useState<string | null>(null);
  const [customEmailInput, setCustomEmailInput] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);

  // Resolve target email for user
  const getTargetEmail = () => {
    if (user?.email && user.email.includes("@")) return user.email;
    const schedule = getSavedReminderSchedule();
    if (schedule?.notificationEmail && schedule.notificationEmail.includes("@")) return schedule.notificationEmail;
    const local = localStorage.getItem("alexfit_user_email") || localStorage.getItem("alexfit_reminder_email");
    if (local && local.includes("@")) return local;
    return null;
  };

  const deliverEmailNotification = async (item: ScheduledMorningNotification, force: boolean = false, overrideEmail?: string) => {
    const targetEmail = overrideEmail || getTargetEmail();
    if (!targetEmail) {
      setShowEmailInput(true);
      return;
    }

    // Get current program progress details for tracking accuracy
    const progData = programProgress[item.programId];
    const progressPercent = progData?.progressPercent || Math.min(100, Math.round((item.nextDay / item.totalDays) * 100));

    setEmailStatus("sending");
    try {
      const result = await deliverProgramNotificationToEmail({
        userEmail: targetEmail,
        userName: user?.displayName || undefined,
        programId: item.programId,
        programName: item.programName,
        completedDay: item.completedDay,
        nextDay: item.nextDay,
        totalDays: item.totalDays,
        progressPercent,
        completedWorkoutCount: progData?.completedWorkoutIds?.length || item.completedDay,
        lastStoppedWorkoutName: progData?.lastStoppedWorkoutName || `Day ${item.nextDay} Workout`,
        forceSend: force
      });

      if (result.sent) {
        setEmailStatus("sent");
        setDeliveredEmail(targetEmail);
        setShowEmailInput(false);
      } else {
        setEmailStatus("failed");
      }
    } catch (err) {
      console.warn("Failed to deliver notification to email:", err);
      setEmailStatus("failed");
    }
  };

  const checkStatus = () => {
    const item = getActiveMorningNotification();
    setActiveNotification(item);
    if (item) {
      // Also try to fire browser native notification if permitted
      triggerMorningBrowserNotification(item);
      // Automatically deliver notification directly to user's email according to their program and tracking
      deliverEmailNotification(item, false);
    }
  };

  useEffect(() => {
    checkStatus();

    // Listen for custom notification update event
    const handleUpdate = () => checkStatus();
    window.addEventListener("alexfit:morning_notification_update", handleUpdate);
    window.addEventListener("focus", handleUpdate);

    // Also check periodically (every 30 seconds)
    const timer = setInterval(checkStatus, 30000);

    return () => {
      window.removeEventListener("alexfit:morning_notification_update", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
      clearInterval(timer);
    };
  }, []);

  if (!activeNotification) return null;

  const handleStartWorkout = () => {
    dismissMorningNotification(activeNotification.programId);
    setActiveNotification(null);
    if (onNavigateToProgram) {
      onNavigateToProgram(activeNotification.programId, activeNotification.nextDay);
    }
  };

  const handleDismiss = () => {
    dismissMorningNotification(activeNotification.programId);
    setActiveNotification(null);
  };

  const handleSaveAndSendCustomEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmailInput.includes("@")) return;
    localStorage.setItem("alexfit_reminder_email", customEmailInput.trim());
    deliverEmailNotification(activeNotification, true, customEmailInput.trim());
  };

  return (
    <AnimatePresence>
      <motion.div
        id="morning-workout-notification-banner"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 260 }}
        className="relative z-40 w-full bg-gradient-to-r from-amber-600 via-red-600 to-amber-700 text-white shadow-xl border-b border-amber-400/30 px-3 sm:px-4 py-3"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          {/* Left info */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
              <Sun className="w-6 h-6 text-amber-200 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded text-amber-200">
                  Morning Workout Alert
                </span>
                <span className="text-xs font-mono font-bold text-white/90">
                  Day {activeNotification.nextDay} of {activeNotification.totalDays}
                </span>
                {emailStatus === "sent" && deliveredEmail && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black uppercase tracking-wider bg-emerald-950/80 border border-emerald-400/40 px-2 py-0.5 rounded text-emerald-300">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    Delivered to {deliveredEmail}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-bold text-white tracking-tight mt-0.5 truncate sm:whitespace-normal">
                Good Morning! You completed Day {activeNotification.completedDay} of {activeNotification.programName}. Day {activeNotification.nextDay} is active!
              </p>
            </div>
          </div>

          {/* Inline Email Delivery Prompt if no email on file */}
          {showEmailInput && (
            <form onSubmit={handleSaveAndSendCustomEmail} className="flex items-center gap-2 bg-black/30 p-1.5 rounded-xl border border-white/20 w-full md:w-auto">
              <Mail className="w-4 h-4 text-amber-300 shrink-0 ml-1.5" />
              <input
                type="email"
                placeholder="Enter email to receive alerts"
                value={customEmailInput}
                onChange={(e) => setCustomEmailInput(e.target.value)}
                className="text-xs px-2 py-1 bg-white/10 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-1 focus:ring-amber-300 min-w-[170px]"
                required
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded-lg uppercase tracking-wider shrink-0 cursor-pointer"
              >
                Send
              </button>
            </form>
          )}

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 shrink-0 justify-center w-full md:w-auto">
            {emailStatus === "sent" && (
              <button
                type="button"
                onClick={() => deliverEmailNotification(activeNotification, true)}
                className="px-2.5 py-2 rounded-xl bg-black/20 hover:bg-black/40 text-amber-200 text-xs font-bold uppercase tracking-wide flex items-center gap-1 transition-all cursor-pointer"
                title="Resend workout protocol to your email"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Resend Email</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleStartWorkout}
              className="px-3 sm:px-4 py-2 rounded-xl bg-white text-red-700 hover:bg-neutral-100 font-black text-xs uppercase tracking-wide flex items-center gap-1.5 shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Start Day {activeNotification.nextDay} Workout</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss morning alert"
              className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
