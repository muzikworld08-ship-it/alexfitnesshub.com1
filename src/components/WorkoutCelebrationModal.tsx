import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Calendar, 
  Bell, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Clock,
  Heart,
  Ban,
  Moon,
  ShieldCheck,
  X
} from "lucide-react";
import { scheduleNextDayMorningNotification } from "../utils/notificationScheduler";
import ResendEmailWidget from "./ResendEmailWidget";

interface WorkoutCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  programId: string;
  programName: string;
  completedDay: number;
  totalDays: number;
  streakCount?: number;
  caloriesBurned?: number;
  exercisesCompletedCount?: number;
  onContinue?: () => void;
}

export default function WorkoutCelebrationModal({
  isOpen,
  onClose,
  programId,
  programName,
  completedDay,
  totalDays,
  streakCount = 1,
  caloriesBurned = 320,
  exercisesCompletedCount = 8,
  onContinue
}: WorkoutCelebrationModalProps) {
  const [testNotificationSent, setTestNotificationSent] = useState(false);
  const nextDay = completedDay + 1;
  const isFinalDay = completedDay >= totalDays;

  // Auto-schedule next day morning notification when modal opens
  useEffect(() => {
    if (isOpen) {
      scheduleNextDayMorningNotification({
        programId,
        programName,
        completedDay,
        totalDays
      });
      setTestNotificationSent(false);
    }
  }, [isOpen, programId, programName, completedDay, totalDays]);

  const handleTestMorningAlert = async () => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted") {
        const perm = await Notification.requestPermission();
        if (perm !== "granted") {
          alert("Please allow notifications in your browser settings to receive morning reminders.");
          return;
        }
      }
      try {
        new Notification(`🌅 Morning Workout Reminder: Day ${nextDay}!`, {
          body: `Good morning! You completed Day ${completedDay} of ${programName}. Day ${nextDay} is ready to crush!`,
          icon: "/favicon.ico"
        });
        setTestNotificationSent(true);
      } catch (e) {
        console.warn("Could not fire notification directly", e);
      }
    } else {
      alert("Browser desktop notifications are not supported in this environment.");
    }
  };

  const handleContinue = () => {
    onClose();
    if (onContinue) {
      onContinue();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="workout-celebration-modal-backdrop"
        className="fixed inset-0 z-50 overflow-y-auto bg-black/90 p-4 sm:p-6 flex flex-col justify-start sm:justify-center items-center py-6 sm:py-10 min-h-screen"
      >
        {/* Modal Window */}
        <motion.div
          id="workout-celebration-card"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className="relative my-auto w-full max-w-lg bg-neutral-900 border border-neutral-700/80 rounded-3xl p-5 sm:p-7 text-white shadow-2xl shadow-red-950/40 overflow-hidden shrink-0"
        >
          {/* Top Radial Glow Accent */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-red-600/20 via-amber-500/10 to-transparent pointer-events-none" />

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={handleContinue}
            aria-label="Close celebration modal"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-neutral-800/90 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-neutral-700/60"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Trophy & Badge */}
          <div className="relative text-center space-y-2.5 pt-2">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 350, delay: 0.1 }}
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-amber-500 to-red-500 text-white shadow-xl shadow-red-500/30 ring-4 ring-amber-400/20"
            >
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </motion.div>

            <div className="block">
              <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono font-bold tracking-widest uppercase">
                {programName}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white uppercase">
              Day {completedDay} Completed!
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-sm mx-auto font-medium leading-relaxed">
              Outstanding discipline! You conquered today's challenge and elevated your physical conditioning.
            </p>
          </div>

          {/* Performance Stats Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 my-5">
            <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl p-2.5 sm:p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span className="text-[11px] font-mono font-bold uppercase">Burned</span>
              </div>
              <div className="text-lg sm:text-2xl font-black font-mono text-white">
                {caloriesBurned}
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">kcal</span>
            </div>

            <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl p-2.5 sm:p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[11px] font-mono font-bold uppercase">Drills</span>
              </div>
              <div className="text-lg sm:text-2xl font-black font-mono text-white">
                {exercisesCompletedCount}
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">drills</span>
            </div>

            <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl p-2.5 sm:p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
                <Zap className="w-3.5 h-3.5 fill-red-400" />
                <span className="text-[11px] font-mono font-bold uppercase">Streak</span>
              </div>
              <div className="text-lg sm:text-2xl font-black font-mono text-white">
                {streakCount}
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">days active</span>
            </div>
          </div>

          {/* Overall Challenge Progress Bar */}
          <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-3.5 mb-5 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-neutral-400 uppercase font-bold">Challenge Progression</span>
              <span className="text-red-400 font-black">
                Day {completedDay} of {totalDays} ({Math.round((completedDay / totalDays) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-neutral-700 h-2.5 rounded-full overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 h-full rounded-full"
                initial={{ width: `${Math.max(2, Math.round(((completedDay - 1) / totalDays) * 100))}%` }}
                animate={{ width: `${Math.round((completedDay / totalDays) * 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* MANDATORY COACHING DIRECTIVES */}
          <div className="mb-5 space-y-2.5 text-left">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Coach Alex's Mandatory Directives</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Directive 1 */}
              <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs uppercase">
                  <Ban className="w-3.5 h-3.5 shrink-0" />
                  <span>Strictly Cut Out Sugar</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Eliminate all sodas, juices, and sweets today. Keeping blood sugar baseline ensures 100% fat burning mode.
                </p>
              </div>

              {/* Directive 2 */}
              <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase">
                  <Moon className="w-3.5 h-3.5 shrink-0" />
                  <span>No Late-Night Eating</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Stop eating after 7:30 PM. Overnight fasting maximizes natural growth hormone release and burns stubborn fat while you sleep.
                </p>
              </div>
            </div>
          </div>

          {/* 5-Hour Program Waiting Notification Notice Box */}
          {!isFinalDay ? (
            <div className="bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-2xl p-3.5 mb-5 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wide">
                    Next Up: Day {nextDay} (5-Hour Wait Active)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                  5h Recovery
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Day {completedDay} is complete! Each program waits for <strong>5 hours</strong> before displaying the next workout, so when you visit tomorrow, Day {nextDay} will be ready and waiting for you.
              </p>
              
              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleTestMorningAlert}
                  className="text-[11px] font-mono font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  {testNotificationSent ? "Morning Alert Sent! Check device" : "Test Morning Reminder"}
                </button>
                <span className="text-[10px] font-mono text-neutral-400">Next Workout Ready Tomorrow</span>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 mb-5 text-center space-y-1">
              <span className="text-sm font-bold text-emerald-400">🎉 Challenge Champion!</span>
              <p className="text-xs text-neutral-300">
                You have reached the final milestone of the entire program. Extraordinary work!
              </p>
            </div>
          )}

          {/* Resend Email Dispatch Widget */}
          <div className="mb-5 text-left">
            <ResendEmailWidget
              programName={programName}
              dayNumber={completedDay}
              compact={true}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              id="celebration-continue-button"
              type="button"
              onClick={handleContinue}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              <span>Claim Victory & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
