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
  Heart
} from "lucide-react";
import { scheduleNextDayMorningNotification } from "../utils/notificationScheduler";

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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      >
        {/* Floating Confetti Particle Sparks */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(24)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: ["#E53935", "#F59E0B", "#10B981", "#3B82F6", "#EC4899", "#8B5CF6"][i % 6],
                left: `${(i * 4.2 + 3) % 94}%`,
                top: `${(i * 7 + 10) % 85}%`
              }}
              initial={{ scale: 0, y: 0, opacity: 1 }}
              animate={{ 
                scale: [0, 1.2, 0.8], 
                y: [0, -60 - (i * 5), 100], 
                opacity: [1, 1, 0],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 2.2 + (i % 3) * 0.4, 
                repeat: Infinity, 
                delay: (i * 0.08) % 1.5,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        {/* Modal Window */}
        <motion.div
          id="workout-celebration-card"
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 24, stiffness: 300 }}
          className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700/80 rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-red-950/40 overflow-hidden"
        >
          {/* Top Radial Glow */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-red-600/20 via-amber-500/10 to-transparent pointer-events-none" />

          {/* Header Trophy & Badge */}
          <div className="relative text-center space-y-3 pt-2">
            <motion.div 
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 350, delay: 0.15 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-red-500 text-white shadow-xl shadow-red-500/30 ring-4 ring-amber-400/20"
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>

            <div className="inline-block px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono font-bold tracking-widest uppercase">
              {programName}
            </div>

            <h2 className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-white uppercase">
              Day {completedDay} Completed!
            </h2>
            <p className="text-sm text-neutral-300 max-w-sm mx-auto font-medium">
              Outstanding discipline! You conquered today's challenge and elevated your physical conditioning.
            </p>
          </div>

          {/* Performance Stats Grid */}
          <div className="grid grid-cols-3 gap-3 my-6">
            <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span className="text-xs font-mono font-bold uppercase">Burned</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-white">
                {caloriesBurned}
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">kcal burned</span>
            </div>

            <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase">Drills</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-white">
                {exercisesCompletedCount}
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">movements</span>
            </div>

            <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
                <Zap className="w-4 h-4 fill-red-400" />
                <span className="text-xs font-mono font-bold uppercase">Streak</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-white">
                {streakCount}
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">days active</span>
            </div>
          </div>

          {/* Overall Challenge Progress Bar */}
          <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-4 mb-6 space-y-2">
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

          {/* Morning Notification Notice Box */}
          {!isFinalDay ? (
            <div className="bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-2xl p-4 mb-6 space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <Bell className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase tracking-wide">
                  Next Up: Day {nextDay} Morning Workout
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Day {nextDay} has been scheduled for tomorrow morning! You will receive a morning reminder so you can step straight into Day {nextDay} and maintain your training streak.
              </p>
              
              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleTestMorningAlert}
                  className="text-[11px] font-mono font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  {testNotificationSent ? "Morning Alert Sent! Check your device" : "Test Morning Notification"}
                </button>
                <span className="text-[10px] font-mono text-neutral-400">Scheduled: 08:00 AM</span>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 mb-6 text-center space-y-1">
              <span className="text-sm font-bold text-emerald-400">🎉 Challenge Champion!</span>
              <p className="text-xs text-neutral-300">
                You have reached the final milestone of the entire program. Extraordinary work!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2.5">
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
