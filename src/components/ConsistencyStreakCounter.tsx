import React, { useState, useEffect, useMemo } from "react";
import { 
  Flame, 
  Trophy, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Info,
  ChevronRight,
  Award,
  Check,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  calculateConsistencyStreak, 
  markTodayWorkoutComplete, 
  removeWorkoutCompletionForDate,
  getLocalDateString,
  ConsistencyStreakData 
} from "../utils/streakManager";
import { useApp } from "../context/AppContext";

interface ConsistencyStreakCounterProps {
  onNavigate?: (view: string) => void;
  compact?: boolean;
}

export default function ConsistencyStreakCounter({ onNavigate, compact = false }: ConsistencyStreakCounterProps) {
  const { activityLogs, user, programProgress } = useApp();
  const [streakData, setStreakData] = useState<ConsistencyStreakData>(() => 
    calculateConsistencyStreak(activityLogs || [])
  );
  const [showMilestonesModal, setShowMilestonesModal] = useState(false);
  const [justCompletedAnim, setJustCompletedAnim] = useState(false);

  // Recalculate streak whenever activityLogs changes or storage/custom event fires
  const refreshStreak = () => {
    setStreakData(calculateConsistencyStreak(activityLogs || []));
  };

  useEffect(() => {
    refreshStreak();

    const handleCustomUpdate = () => refreshStreak();
    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === "fit_workout_completion_history" || 
        e.key === "fit_programs_wait_all" || 
        e.key?.startsWith("fit_activity_")
      ) {
        refreshStreak();
      }
    };

    window.addEventListener("workout_completion_updated", handleCustomUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("workout_completion_updated", handleCustomUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, [activityLogs]);

  // Handle Quick Log Today's Workout
  const handleQuickLogToday = () => {
    // Determine active program title if available
    const activeEnrolled = Object.values(programProgress || {}).find(p => p.enrolled);
    const title = activeEnrolled?.programTitle || "Scheduled Workout";
    markTodayWorkoutComplete(title);
    setJustCompletedAnim(true);
    setTimeout(() => setJustCompletedAnim(false), 2500);
    refreshStreak();
  };

  // Handle Undo Today's Log
  const handleUndoToday = () => {
    const todayStr = getLocalDateString(new Date());
    removeWorkoutCompletionForDate(todayStr);
    refreshStreak();
  };

  // Determine navigation target
  const handleGoToWorkout = () => {
    if (onNavigate) {
      const activeEnrolled = Object.values(programProgress || {}).find(p => p.enrolled);
      if (activeEnrolled?.viewName) {
        onNavigate(activeEnrolled.viewName);
      } else if (activeEnrolled?.programId === "90_day_immortal") {
        onNavigate("challenges");
      } else if (activeEnrolled?.programId === "belly_fat_shred") {
        onNavigate("belly-fat-shred");
      } else if (activeEnrolled?.programId === "lifestyle_academy") {
        onNavigate("lifestyle-academy");
      } else {
        onNavigate("daily-plan");
      }
    }
  };

  const {
    currentStreak,
    longestStreak,
    totalWorkoutsCompleted,
    isTodayCompleted,
    isYesterdayCompleted,
    status,
    statusText,
    motivationalQuote,
    timelineDays,
    milestone
  } = streakData;

  // Compact variant (e.g. for sidebar or mini widgets)
  if (compact) {
    return (
      <div 
        id="compact_consistency_streak_badge"
        onClick={() => setShowMilestonesModal(true)}
        className="flex items-center justify-between p-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 cursor-pointer hover:border-red-500/50 transition shadow-xs"
        title="View Consistency Streak Details"
      >
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${currentStreak > 0 ? "bg-red-500/20 text-[#D32F2F]" : "bg-slate-800 text-slate-400"}`}>
            <Flame className={`w-4 h-4 ${currentStreak > 0 ? "fill-[#D32F2F] animate-pulse" : ""}`} />
          </div>
          <div>
            <div className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-300">
              Consistency Streak
            </div>
            <div className="text-xs font-black text-white font-mono">
              {currentStreak} {currentStreak === 1 ? "Day" : "Days"}
            </div>
          </div>
        </div>
        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-black uppercase ${
          isTodayCompleted ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
        }`}>
          {isTodayCompleted ? "Done" : "Pending"}
        </span>
      </div>
    );
  }

  return (
    <section 
      id="dashboard_consistency_streak_section" 
      aria-label="Consistency Streak Tracker"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-neutral-950 border border-slate-800 text-white p-5 sm:p-7 shadow-xl w-full"
    >
      {/* Dynamic ambient red athletic glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#D32F2F]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Label + Milestone Badge & Status Tag */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/30 text-[#D32F2F] shadow-sm">
            <Flame className="w-5 h-5 fill-[#D32F2F] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#D32F2F]">
                ATHLETIC DISCIPLINE ENGINE
              </span>
              <span className="text-[9px] font-mono bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">
                Consecutive Workouts
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white font-sans mt-0.5">
              Consistency Streak
            </h2>
          </div>
        </div>

        {/* Dynamic Status Pill */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setShowMilestonesModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono font-bold text-amber-300 transition cursor-pointer"
            title="View streak milestones and achievements"
          >
            <span className="text-sm">{milestone.badge}</span>
            <span className="hidden sm:inline text-[11px] font-sans font-black uppercase">{milestone.name}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider border shadow-xs ${
            isTodayCompleted 
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" 
              : currentStreak > 0
                ? "bg-amber-500/15 border-amber-500/30 text-amber-400 animate-pulse"
                : "bg-slate-800 border-slate-700 text-slate-400"
          }`}>
            {isTodayCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Today Secured</span>
              </>
            ) : currentStreak > 0 ? (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Workout Pending</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Day 1 Ready</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Main Metric & Coach Banner */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
        
        {/* Left: Giant Streak Visual Counter */}
        <div className="lg:col-span-5 flex items-baseline sm:items-center gap-4">
          <div className="relative">
            <div className="flex items-baseline gap-2">
              <span 
                id="consistency_streak_count" 
                className="text-5xl sm:text-6xl lg:text-7xl font-black font-mono tracking-tight text-white drop-shadow-md"
              >
                {currentStreak}
              </span>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-black uppercase tracking-wider text-red-400 leading-none">
                  {currentStreak === 1 ? "Day" : "Days"}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">
                  Unbroken
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:block h-12 w-px bg-slate-800" />

          {/* Quick summary status text */}
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-bold text-slate-200 leading-snug">
              {statusText}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              {motivationalQuote}
            </p>
          </div>
        </div>

        {/* Right: 3 Metric Bento Tiles */}
        <div className="lg:col-span-7 grid grid-cols-3 gap-2.5 sm:gap-3">
          
          {/* Tile 1: Current Streak */}
          <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-red-500/30 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[9px] font-mono uppercase tracking-wider">Active</span>
              <Flame className="w-3.5 h-3.5 text-[#D32F2F]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black font-mono text-white">
                {currentStreak} <span className="text-[10px] font-sans font-bold text-slate-400">D</span>
              </div>
              <span className="text-[9px] text-slate-400 font-sans block mt-0.5">Current Streak</span>
            </div>
          </div>

          {/* Tile 2: Best Streak (Record) */}
          <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-amber-500/30 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[9px] font-mono uppercase tracking-wider">Peak</span>
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black font-mono text-amber-300">
                {longestStreak} <span className="text-[10px] font-sans font-bold text-slate-400">D</span>
              </div>
              <span className="text-[9px] text-slate-400 font-sans block mt-0.5">Best Record</span>
            </div>
          </div>

          {/* Tile 3: Total Completed Workouts */}
          <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-emerald-500/30 transition">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[9px] font-mono uppercase tracking-wider">Total</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-300">
                {totalWorkoutsCompleted} <span className="text-[10px] font-sans font-bold text-slate-400">S</span>
              </div>
              <span className="text-[9px] text-slate-400 font-sans block mt-0.5">Total Sessions</span>
            </div>
          </div>

        </div>
      </div>

      {/* 7-Day Rolling Visual Timeline */}
      <div className="relative z-10 pt-4 pb-5 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
              7-Day Rolling Consistency Track
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-400">
            {timelineDays.filter(d => d.isCompleted).length} / 7 Days Completed
          </span>
        </div>

        {/* 7 Day Pills */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
          {timelineDays.map((day, idx) => {
            const isCompleted = day.isCompleted;
            const isToday = day.isToday;

            return (
              <div
                key={day.dateStr}
                className={`relative flex flex-col items-center justify-center py-2 sm:py-3 px-1 rounded-2xl border transition-all ${
                  isToday
                    ? isCompleted
                      ? "bg-emerald-500/15 border-emerald-500/50 shadow-sm"
                      : "bg-red-500/15 border-red-500/50 shadow-md ring-2 ring-red-500/30 animate-pulse"
                    : isCompleted
                      ? "bg-white/10 border-white/20"
                      : "bg-white/5 border-white/5 opacity-70"
                }`}
                title={`${day.dayLabel}, ${day.dateStr}: ${isCompleted ? "Completed" : isToday ? "Pending Today" : "Missed"}`}
              >
                {/* Day Name */}
                <span className={`text-[9px] sm:text-[10px] font-mono uppercase font-black ${
                  isToday ? "text-white" : isCompleted ? "text-slate-300" : "text-slate-400"
                }`}>
                  {isToday ? "Today" : day.dayLabel}
                </span>

                {/* Day of Month */}
                <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 my-0.5">
                  {day.dayNumber}
                </span>

                {/* Status Indicator Icon */}
                <div className="mt-1 flex items-center justify-center">
                  {isCompleted ? (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                    </div>
                  ) : isToday ? (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" style={{ animationDuration: "6s" }} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-dashed border-slate-700 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone Progress Bar */}
      <div className="relative z-10 pt-4 pb-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{milestone.badge}</span>
            <span className="text-[11px] font-mono font-bold text-slate-300 uppercase">
              Next Goal: {milestone.name} ({milestone.targetDays} Days)
            </span>
          </div>
          <span className="text-[10px] font-mono text-amber-400 font-bold">
            {milestone.remainingDays === 0 
              ? "Milestone Unlocked!" 
              : `${milestone.progressDays}/${milestone.targetDays} Days (${milestone.percent}%)`}
          </span>
        </div>

        {/* Progress track */}
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${milestone.percent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#D32F2F] to-amber-500 rounded-full"
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 font-sans">
          {milestone.description}
        </p>
      </div>

      {/* Action Footer Bar */}
      <div className="relative z-10 mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {isTodayCompleted ? (
          <div className="flex items-center justify-between w-full bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-3 sm:px-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-emerald-300 font-sans leading-none">
                  Today's Scheduled Session Verified Complete
                </p>
                <p className="text-[10px] text-emerald-400/80 font-mono mt-0.5 leading-none">
                  Recovery window active. Streak defended until tomorrow.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleUndoToday}
              className="text-[9px] font-mono uppercase text-slate-400 hover:text-slate-200 underline cursor-pointer ml-3 shrink-0"
              title="Undo today's completion mark if clicked in error"
            >
              Undo
            </button>
          </div>
        ) : (
          <>
            <div className="text-left">
              <span className="text-xs font-black uppercase tracking-wide text-white block">
                Defend Your Consistency Record
              </span>
              <span className="text-[11px] text-slate-400">
                {currentStreak > 0 
                  ? "Execute today's scheduled workout to keep your streak alive."
                  : "Complete today's session to kick off Day 1 of your unbroken streak."}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Manual Quick Check In Toggle */}
              <button
                type="button"
                id="quick_log_today_btn"
                onClick={handleQuickLogToday}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[11px] font-black uppercase tracking-wider font-sans transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95"
                title="Mark today's scheduled workout done directly"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark Today Done</span>
              </button>

              {/* Primary Navigate to Workout Button */}
              <button
                type="button"
                id="start_today_workout_btn"
                onClick={handleGoToWorkout}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-[11px] font-black uppercase tracking-wider font-sans transition shadow-lg cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Launch Workout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Celebration Popup Overlay on Instant Mark Complete */}
      <AnimatePresence>
        {justCompletedAnim && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute inset-0 z-30 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 rounded-3xl"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D32F2F] to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/30 mb-3 animate-bounce">
              <Flame className="w-8 h-8 text-white fill-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-sans">
              Streak Verified & Updated!
            </h3>
            <p className="text-sm text-amber-300 font-mono font-bold mt-1">
              🔥 {currentStreak} Consecutive Days Logged
            </p>
            <p className="text-xs text-slate-300 max-w-sm mt-2">
              Incredible dedication! Your scheduled workout completion is registered and locked in.
            </p>
            <button
              type="button"
              onClick={() => setJustCompletedAnim(false)}
              className="mt-4 px-5 py-2 rounded-xl bg-white text-slate-900 text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              Continue
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestones & Badges Modal */}
      <AnimatePresence>
        {showMilestonesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setShowMilestonesModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 sm:p-7 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto scrollbar-none"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-white font-mono">
                    Consistency Milestones
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMilestonesModal(false)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Consecutive workout streaks unlock elite badges and condition permanent athletic habits. Defend your streak daily to progress through each tier:
              </p>

              <div className="space-y-2.5">
                {[
                  { target: 3, name: "Spark of Momentum", badge: "⚡", desc: "3 consecutive days of execution" },
                  { target: 7, name: "Iron Consistency", badge: "🛡️", desc: "1 uninterrupted week of scheduled sessions" },
                  { target: 14, name: "Fortified Habit", badge: "⚔️", desc: "2 unbroken weeks of dedicated training" },
                  { target: 21, name: "Discipline Master", badge: "🔥", desc: "21 days — biological habit crystallization" },
                  { target: 30, name: "Centurion Champion", badge: "👑", desc: "30 straight days of physical dominance" },
                  { target: 45, name: "Elite Force", badge: "💎", desc: "45 days of unyielding focus" },
                  { target: 60, name: "Titan Fortress", badge: "🏛️", desc: "60 unbroken days of athletic conditioning" },
                  { target: 90, name: "Immortal Legend", badge: "🏆", desc: "90 days of legendary supremacy" },
                  { target: 180, name: "Master of Iron", badge: "🌟", desc: "180 days of absolute mastery" },
                ].map((tier) => {
                  const isUnlocked = currentStreak >= tier.target || longestStreak >= tier.target;
                  const isCurrent = milestone.name === tier.name;

                  return (
                    <div
                      key={tier.target}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                        isUnlocked
                          ? "bg-amber-500/10 border-amber-500/30 text-white"
                          : isCurrent
                            ? "bg-red-500/10 border-red-500/30 text-slate-200"
                            : "bg-white/5 border-white/5 text-slate-400 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tier.badge}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-wide font-sans text-white">
                              {tier.name}
                            </span>
                            <span className="text-[10px] font-mono text-amber-400 font-bold">
                              {tier.target} Days
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                            {tier.desc}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-md ${
                        isUnlocked 
                          ? "bg-emerald-500/20 text-emerald-300"
                          : isCurrent 
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-slate-800 text-slate-500"
                      }`}>
                        {isUnlocked ? "Unlocked" : isCurrent ? "Current Goal" : "Locked"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowMilestonesModal(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  Close Milestones
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
