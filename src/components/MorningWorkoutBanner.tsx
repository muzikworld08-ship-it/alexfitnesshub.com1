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

  // Headless notification delivery: deliver directly to user's email without displaying a top banner on the home page
  return null;
}
