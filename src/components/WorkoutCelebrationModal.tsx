import React, { useEffect, useState, useMemo } from "react";
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
  Activity, 
  Footprints,
  Dumbbell,
  X 
} from "lucide-react";
import { scheduleNextDayMorningNotification } from "../utils/notificationScheduler";
import { getWorkoutForProgramAndDay } from "../data/challengeEngineDatabase";
import { getProgramWaitState } from "../utils/programWaitManager";
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

  // Live countdown timer state (ticks every second)
  const [remainingTime, setRemainingTime] = useState<{ hours: number; minutes: number; seconds: number; formatted: string }>({
    hours: 5,
    minutes: 0,
    seconds: 0,
    formatted: "05:00:00"
  });

  // Calculate tomorrow's workout plan
  const tomorrowPlan = useMemo(() => {
    if (isFinalDay) return null;
    try {
      return getWorkoutForProgramAndDay(programId, nextDay);
    } catch (e) {
      // Fallback: Day 7 cycle is Rest Day
      const isRest = nextDay % 7 === 0;
      return {
        meta: {
          title: isRest ? `Day ${nextDay}: Active Rest & Recovery` : `Day ${nextDay}: Progressive Strength & Conditioning`,
          category: isRest ? "Rest & Recovery" : "Full Body Conditioning",
          isRestDay: isRest,
          isCardioOnly: false,
          targetMuscles: isRest ? ["Recovery", "Mobility"] : ["Core", "Full Body"],
          estimatedDuration: isRest ? "15-20 mins" : "35-45 mins",
          estimatedCalories: isRest ? 100 : 350
        },
        exercises: []
      };
    }
  }, [programId, nextDay, isFinalDay]);

  // Real-time Countdown Timer effect
  useEffect(() => {
    if (!isOpen) return;

    const updateTimer = () => {
      const waitState = getProgramWaitState(programId);
      let ms = waitState.remainingMs;

      // If no active cooldown in localStorage, calculate default 5-hour recovery window or time until tomorrow 5:00 AM
      if (ms <= 0) {
        const now = new Date();
        const tomorrow5AM = new Date(now);
        tomorrow5AM.setDate(tomorrow5AM.getDate() + 1);
        tomorrow5AM.setHours(5, 0, 0, 0);
        ms = Math.max(0, tomorrow5AM.getTime() - now.getTime());
      }

      const totalSec = Math.floor(ms / 1000);
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      const formatted = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      setRemainingTime({ hours, minutes, seconds, formatted });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isOpen, programId]);

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
    }
  };

  const handleContinue = () => {
    onClose();
    if (onContinue) {
      onContinue();
    }
  };

  if (!isOpen) return null;

  const isTomorrowRest = tomorrowPlan?.meta?.isRestDay || (nextDay % 7 === 0);
  const isTomorrowCardio = tomorrowPlan?.meta?.isCardioOnly;

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
          className="relative my-auto w-full max-w-xl bg-neutral-900 border border-neutral-700/80 rounded-3xl p-5 sm:p-7 text-white shadow-2xl shadow-red-950/40 overflow-hidden shrink-0"
        >
          {/* Top Radial Glow Accent */}
          <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-red-600/25 via-amber-500/15 to-transparent pointer-events-none" />

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
          <div className="relative text-center space-y-2 pt-2">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 350, delay: 0.1 }}
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-red-500 to-rose-600 text-white shadow-xl shadow-red-500/30 ring-4 ring-amber-400/20"
            >
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </motion.div>

            <div className="block">
              <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono font-bold tracking-widest uppercase">
                {programName}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white uppercase">
              🎉 Congratulations! Day {completedDay} Finished!
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto font-medium leading-relaxed">
              Outstanding consistency! You completed all scheduled drills for today and earned your progress milestone.
            </p>
          </div>

          {/* Performance Stats Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 my-4">
            <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl p-2.5 sm:p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-0.5">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span className="text-[10px] font-mono font-bold uppercase">Burned</span>
              </div>
              <div className="text-lg sm:text-2xl font-black font-mono text-white">
                {caloriesBurned}
              </div>
              <span className="text-[9px] text-neutral-400 font-mono">kcal</span>
            </div>

            <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl p-2.5 sm:p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono font-bold uppercase">Drills</span>
              </div>
              <div className="text-lg sm:text-2xl font-black font-mono text-white">
                {exercisesCompletedCount}
              </div>
              <span className="text-[9px] text-neutral-400 font-mono">completed</span>
            </div>

            <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl p-2.5 sm:p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-red-400 mb-0.5">
                <Zap className="w-3.5 h-3.5 fill-red-400" />
                <span className="text-[10px] font-mono font-bold uppercase">Streak</span>
              </div>
              <div className="text-lg sm:text-2xl font-black font-mono text-white">
                {streakCount}
              </div>
              <span className="text-[9px] text-neutral-400 font-mono">days active</span>
            </div>
          </div>

          {/* DYNAMIC TIMER TO TOMORROW'S PLAN */}
          {!isFinalDay && (
            <div className="my-4 p-4 rounded-2xl bg-gradient-to-br from-neutral-800 via-neutral-850 to-neutral-900 border border-amber-500/40 text-left space-y-3 shadow-lg">
              
              {/* Timer Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span className="text-xs font-mono font-black uppercase tracking-wider">
                    Next Session Countdown (Day {nextDay})
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                  Active Recovery Lock
                </span>
              </div>

              {/* Digital Countdown Timer Display */}
              <div className="flex items-center justify-center gap-2 py-2 bg-neutral-950/70 rounded-xl border border-neutral-700/60">
                <div className="text-center px-3">
                  <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400">
                    {remainingTime.hours.toString().padStart(2, "0")}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase block">Hours</span>
                </div>
                <span className="text-2xl font-mono font-black text-amber-500">:</span>
                <div className="text-center px-3">
                  <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400">
                    {remainingTime.minutes.toString().padStart(2, "0")}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase block">Mins</span>
                </div>
                <span className="text-2xl font-mono font-black text-amber-500">:</span>
                <div className="text-center px-3">
                  <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">
                    {remainingTime.seconds.toString().padStart(2, "0")}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase block">Secs</span>
                </div>
              </div>

              {/* TOMORROW'S PREVIEW ACCORDING TO PLAN */}
              <div className="pt-1">
                {isTomorrowRest ? (
                  /* Tomorrow is Rest Day Preview */
                  <div className="p-3.5 rounded-xl bg-blue-950/50 border border-blue-500/30 flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-blue-400/30 bg-slate-900">
                      <img 
                        src="/images/rest-day.jpg" 
                        alt="Rest Day" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-blue-400 text-xs font-mono font-black uppercase">
                        <Moon className="w-3.5 h-3.5 fill-blue-400" />
                        <span>Tomorrow: Rest & Recovery Day</span>
                      </div>
                      <p className="text-[11px] text-blue-200/90 leading-tight">
                        No weightlifting or heavy drills tomorrow. Focus on hydration, mobility, and 8 hours of restorative deep sleep!
                      </p>
                    </div>
                  </div>
                ) : isTomorrowCardio ? (
                  /* Tomorrow is Cardio Day Preview */
                  <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-emerald-400/30 bg-slate-900">
                      <img 
                        src="/images/cardio-day.jpg" 
                        alt="Cardio Day" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-black uppercase">
                        <Footprints className="w-3.5 h-3.5 fill-emerald-400" />
                        <span>Tomorrow: 5 KM Aerobic Cardio Day</span>
                      </div>
                      <p className="text-[11px] text-emerald-200/90 leading-tight">
                        Aerobic endurance & fat oxidation protocol. Get ready for an outdoor trail run or brisk power walk.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Tomorrow is Regular Workout Day Preview */
                  <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-700/80 flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-red-950/50 border border-red-500/30 flex items-center justify-center shrink-0 text-red-400 font-mono font-black text-sm">
                      <Dumbbell className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono font-black uppercase truncate">
                        <span>Tomorrow: Day {nextDay} • {tomorrowPlan?.meta?.category || "Strength Routine"}</span>
                      </div>
                      <p className="text-[11px] text-neutral-300 leading-tight truncate">
                        Target Focus: {tomorrowPlan?.meta?.targetMuscles?.join(", ") || "Progressive Hypertrophy & Density"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Continue / Action Button */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={handleContinue}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-sans font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Back to Program Overview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
