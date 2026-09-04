import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Flame, ChevronRight, X, Sun, Sparkles } from "lucide-react";
import { 
  getActiveMorningNotification, 
  dismissMorningNotification, 
  ScheduledMorningNotification,
  triggerMorningBrowserNotification
} from "../utils/notificationScheduler";

interface MorningWorkoutBannerProps {
  onNavigateToProgram?: (programId: string, dayNumber: number) => void;
}

export default function MorningWorkoutBanner({ onNavigateToProgram }: MorningWorkoutBannerProps) {
  const [activeNotification, setActiveNotification] = useState<ScheduledMorningNotification | null>(null);

  const checkStatus = () => {
    const item = getActiveMorningNotification();
    setActiveNotification(item);
    if (item) {
      // Also try to fire browser native notification if permitted
      triggerMorningBrowserNotification(item);
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

  return (
    <AnimatePresence>
      <motion.div
        id="morning-workout-notification-banner"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 260 }}
        className="relative z-40 w-full bg-gradient-to-r from-amber-600 via-red-600 to-amber-700 text-white shadow-xl border-b border-amber-400/30 px-4 py-3"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          {/* Left info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
              <Sun className="w-6 h-6 text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded text-amber-200">
                  Morning Workout Alert
                </span>
                <span className="text-xs font-mono font-bold text-white/90">
                  Day {activeNotification.nextDay} is Ready
                </span>
              </div>
              <p className="text-sm font-bold text-white tracking-tight mt-0.5">
                Good Morning! You crushed Day {activeNotification.completedDay} of {activeNotification.programName}. Time for Day {activeNotification.nextDay}!
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleStartWorkout}
              className="px-4 py-2 rounded-xl bg-white text-red-700 hover:bg-neutral-100 font-black text-xs uppercase tracking-wide flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
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
