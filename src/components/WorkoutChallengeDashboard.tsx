import React, { useState, useMemo } from "react";
import { 
  Trophy, Flame, Shield, Clock, CheckCircle2, Lock, Sparkles, 
  ChevronRight, Dumbbell, AlertTriangle, Play, RefreshCw, 
  Check, Calendar, Activity, Zap, Info, ShieldCheck, Heart, User, Compass,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useChallengeEngine } from "../hooks/useChallengeEngine";
import { CHALLENGE_PROGRAMS_METADATA, getWorkoutForProgramAndDay } from "../data/challengeEngineDatabase";
import { ChallengeValidationService } from "../services/challengeValidationService";
import { ProgramId, ChallengeExerciseItem } from "../types/challengeEngine";
import { useApp, isEmailAdmin } from "../context/AppContext";
import ProgramCooldownWaitingScreen from "./ProgramCooldownWaitingScreen";
import { sendEmail } from "../services/emailNotificationService";

export default function WorkoutChallengeDashboard() {
  const { user, resetAllSettings } = useApp();
  const isAdmin = user?.role === "admin" || (user?.email && isEmailAdmin(user.email));

  const {
    isLoaded,
    activeProgramId,
    setActiveProgramId,
    metadata,
    currentProgress,
    allProgramStates,
    workoutPlan,
    validatedExercises,
    unlockCountdown,
    isLockedAwaitingTimer,
    cooldownWaitState,
    startTodayWorkout,
    toggleExerciseComplete,
    completeTodayWorkout,
    advanceToNextDay,
    adminBypassUnlock,
    jumpToDay,
    resetProgramProgress
  } = useChallengeEngine("immortal_90");

  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Viewed day vs actual current prescribed day
  const viewingDay = selectedDay ?? currentProgress.currentDay;
  const isViewingCurrentDay = viewingDay === currentProgress.currentDay;

  // Check if viewed day is locked behind the 5-hour cool-down period
  const isCooldownLockedForDay = isLockedAwaitingTimer && viewingDay >= cooldownWaitState.nextDay;

  // Dynamically resolve workout plan and validated exercises for viewed day
  const displayPlan = useMemo(() => {
    return getWorkoutForProgramAndDay(activeProgramId, viewingDay);
  }, [activeProgramId, viewingDay]);

  const displayExercises = useMemo(() => {
    return ChallengeValidationService.filterValidExercisesForDay(
      displayPlan.exercises,
      activeProgramId,
      viewingDay
    );
  }, [displayPlan, activeProgramId, viewingDay]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3 text-neutral-400">
          <RefreshCw className="w-6 h-6 animate-spin text-red-500" />
          <span>Synchronizing Workout Engine...</span>
        </div>
      </div>
    );
  }

  const completedCount = isViewingCurrentDay ? currentProgress.exercisesCompleted.length : 0;
  const totalCount = displayExercises.length;
  const allExercisesFinished = totalCount > 0 && completedCount >= totalCount;

  const handleFinishWorkout = async () => {
    completeTodayWorkout();
    setShowCelebration(true);

    // Trigger Congrats Email via Resend / MailerSend
    if (user?.email) {
      sendEmail({
        to: user.email,
        recipientName: user.displayName || undefined,
        programName: metadata.name,
        dayNumber: currentProgress.currentDay,
        caloriesBurned: 350,
        exercisesCompleted: validatedExercises.map(e => e.exerciseName)
      }).catch(err => console.warn("[WorkoutChallenge] Failed to dispatch congrats email:", err));
    }

    setTimeout(() => setShowCelebration(false), 5000);
  };

  const handleSetActiveDay = (day: number) => {
    jumpToDay(day);
    setSelectedDay(null);
  };

  return (
    <div id="challenge_engine_dashboard" className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-24">
      {/* 1. TOP HEADER & PROGRAM SELECTOR */}
      <div className="border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                  CHALLENGE ENGINE V2
                </span>
                <span className="text-xs text-neutral-400">
                  7-Day Repeating Cadence • Day 1 to 90
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                {metadata.name}
              </h1>
            </div>

            {/* Independent Programs Tabs & Reset Settings */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {(Object.keys(CHALLENGE_PROGRAMS_METADATA) as ProgramId[]).map((pid) => {
                  const p = CHALLENGE_PROGRAMS_METADATA[pid];
                  const pProgress = allProgramStates[pid];
                  const isActive = activeProgramId === pid;

                  return (
                    <button
                      key={pid}
                      onClick={() => {
                        setActiveProgramId(pid);
                        setSelectedDay(null);
                      }}
                      className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        isActive 
                          ? "bg-red-600 text-white shadow-lg shadow-red-600/25 ring-1 ring-red-500" 
                          : "bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700/80 hover:text-white"
                      }`}
                    >
                      <span>{p.badge}</span>
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-neutral-900/60 text-neutral-200">
                        D{pProgress.currentDay}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="shrink-0 px-3 py-2 rounded-xl text-xs font-bold bg-neutral-800/80 hover:bg-red-950/60 text-neutral-400 hover:text-red-400 border border-neutral-700/60 hover:border-red-500/50 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Reset settings and start new"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* SCIENTIFIC DISCLAIMER (BELLY FAT SHRED) */}
        {metadata.scientificDisclaimer && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 text-amber-200 text-xs sm:text-sm leading-relaxed">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 font-bold block mb-1">Scientific Metabolic Disclosure:</strong>
              {metadata.scientificDisclaimer}
            </div>
          </div>
        )}

        {/* 7-DAY CADENCE SELECTOR STRIP */}
        <div className="mb-6 p-5 rounded-3xl bg-neutral-900/70 border border-neutral-800/90 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-800 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400 font-mono">
                Strict 7-Day Cycle Cadence
              </span>
              <h3 className="text-base font-extrabold text-white">
                Inspect Any Day in the 90-Day Challenge
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-semibold">Week:</span>
              <div className="flex items-center gap-1 overflow-x-auto max-w-[280px] sm:max-w-none">
                {Array.from({ length: Math.ceil(metadata.totalDays / 7) }).map((_, wIdx) => {
                  const w = wIdx + 1;
                  const isCurrentWeek = selectedWeek === w;
                  return (
                    <button
                      key={w}
                      onClick={() => setSelectedWeek(w)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        isCurrentWeek
                          ? "bg-red-600 text-white shadow-xs"
                          : "bg-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      W{w}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Days of Selected Week */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, dayIdxInWeek) => {
              const dayNum = (selectedWeek - 1) * 7 + dayIdxInWeek + 1;
              if (dayNum > metadata.totalDays) return null;

              const isSelected = viewingDay === dayNum;
              const isPrescribedToday = currentProgress.currentDay === dayNum;

              // Dynamically retrieve exact verified program workout meta for this day
              const dayPlan = getWorkoutForProgramAndDay(activeProgramId, dayNum);
              const cycleLabel = dayPlan.meta.category;
              const isCardioDay = dayPlan.meta.isCardioOnly || dayPlan.meta.isRestDay;

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`p-3 rounded-2xl text-left border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? "bg-red-950/40 border-red-500 shadow-md ring-1 ring-red-500"
                      : isPrescribedToday
                      ? "bg-neutral-800/80 border-amber-500/50 hover:border-neutral-600"
                      : "bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black uppercase font-mono ${isSelected ? "text-red-400" : "text-neutral-400"}`}>
                      Day {dayNum}
                    </span>
                    {isPrescribedToday && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Today
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5">
                    <p className={`text-xs font-extrabold leading-tight line-clamp-1 ${isSelected ? "text-white" : isCardioDay ? "text-sky-300" : "text-neutral-300"}`}>
                      {cycleLabel}
                    </p>
                    <span className={`text-[10px] font-mono mt-1 inline-block ${isCardioDay ? "text-sky-400" : "text-neutral-500"}`}>
                      {dayPlan.meta.isRestDay ? "Rest & Recovery" : isCardioDay ? "Cardio" : "Resistance"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {!isViewingCurrentDay && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-xs">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-red-400 shrink-0" />
                <span>
                  Currently inspecting <strong>Day {viewingDay}</strong> ({displayPlan.meta.category}). Your current tracked day is <strong>Day {currentProgress.currentDay}</strong>.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSetActiveDay(viewingDay)}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-all text-xs flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Set Day {viewingDay} as Active Today</span>
                </button>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-semibold transition-all text-xs"
                >
                  Return to Day {currentProgress.currentDay}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. PROGRAM OVERVIEW & DAY STATUS HERO */}
        <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/10 text-white border border-white/10">
                  DAY {viewingDay} OF {metadata.totalDays}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/20">
                  {displayPlan.meta.category}
                </span>
                {displayPlan.meta.isCardioOnly && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    5 TO 10 KM CARDIO & RECOVERY (ZERO WEIGHTS)
                  </span>
                )}
                {displayPlan.meta.isRestDay && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    COMPLETE REST & WALKING
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {displayPlan.meta.title}
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
                {displayPlan.meta.coachingNotes}
              </p>

              {/* Target Muscles Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Targeted Muscles:</span>
                {displayPlan.meta.targetMuscles.map((muscle) => (
                  <span key={muscle} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-800 text-neutral-200 border border-neutral-700/60">
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Metrics & Progression */}
            <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                <span>{isViewingCurrentDay ? "Today's Progress" : `Day ${viewingDay} Drills`}</span>
                <span className="text-white font-bold">{completedCount} / {totalCount} Drills</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-800 h-3 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${isViewingCurrentDay ? currentProgress.completionPercentage : 0}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-neutral-900/90 rounded-xl p-3 border border-neutral-800">
                  <div className="text-[11px] text-neutral-400 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    Est. Duration
                  </div>
                  <div className="text-sm font-bold text-white mt-1">
                    {displayPlan.meta.estimatedDuration}
                  </div>
                </div>

                <div className="bg-neutral-900/90 rounded-xl p-3 border border-neutral-800">
                  <div className="text-[11px] text-neutral-400 font-medium flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    Est. Burn
                  </div>
                  <div className="text-sm font-bold text-white mt-1">
                    ~{displayPlan.meta.estimatedCalories} kcal
                  </div>
                </div>
              </div>

              {/* Quick Jump / Reset Controls */}
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" /> Challenge Navigator
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adminBypassUnlock()}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
                    title="Advance to next training day"
                  >
                    Next Day
                  </button>
                  <button
                    onClick={() => resetProgramProgress()}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  >
                    Reset Day 1
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. WORKOUT GUIDELINES & CADENCE RULES */}
        <div className="mb-8 p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-500" />
            Execution Protocol & Rules (Day {viewingDay}: {displayPlan.meta.category})
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {displayPlan.meta.guidelines.map((guide, idx) => (
              <li key={idx} className="text-xs text-neutral-300 flex items-start gap-2 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/60">
                <span className="w-4 h-4 rounded-full bg-red-600/20 text-red-400 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                  {idx + 1}
                </span>
                <span>{guide}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 5. EXERCISE LIST (STRICTLY VALIDATED FOR PROGRAM, DAY, AND MUSCLE GROUP) */}
        {isCooldownLockedForDay ? (
          <ProgramCooldownWaitingScreen
            programId={activeProgramId}
            programName={metadata.name}
            completedDay={cooldownWaitState.completedDay}
            nextDay={cooldownWaitState.nextDay}
            nextUnlockAt={cooldownWaitState.nextUnlockAt}
            onReviewTodayWorkout={() => setSelectedDay(cooldownWaitState.completedDay)}
            onUnlocked={() => {
              adminBypassUnlock();
            }}
          />
        ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-red-500" />
              Day {viewingDay} Prescribed Routine ({displayExercises.length} Exercises)
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-medium">
                Category: <strong className="text-white">{displayPlan.meta.category}</strong>
              </span>
              {!isViewingCurrentDay && (
                <button
                  onClick={() => handleSetActiveDay(viewingDay)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-600 hover:bg-red-500 text-white transition-all"
                >
                  Train Day {viewingDay} Now
                </button>
              )}
            </div>
          </div>

          {displayExercises.length === 0 ? (
            <div className="p-8 text-center bg-neutral-900/60 border border-neutral-800 rounded-3xl">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-white font-bold">No exercises found for this day's category.</p>
              <p className="text-xs text-neutral-400 mt-1">Check administrator mappings or program configuration.</p>
            </div>
          ) : (
            displayExercises.map((exercise: ChallengeExerciseItem, index: number) => {
              const isCompleted = isViewingCurrentDay && currentProgress.exercisesCompleted.includes(exercise.id);
              const isExpanded = expandedExerciseId === exercise.id;

              return (
                <div
                  key={exercise.id}
                  className={`rounded-2xl border transition-all ${
                    isCompleted
                      ? "bg-neutral-900/40 border-emerald-900/40 opacity-85"
                      : "bg-neutral-900/90 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <div className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3.5">
                      {/* Completion checkbox button */}
                      <button
                        onClick={() => {
                          if (isViewingCurrentDay) {
                            toggleExerciseComplete(exercise.id);
                          } else {
                            handleSetActiveDay(viewingDay);
                          }
                        }}
                        disabled={isViewingCurrentDay && isLockedAwaitingTimer}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isCompleted
                            ? "bg-emerald-600 text-white ring-2 ring-emerald-500 shadow-md shadow-emerald-600/20"
                            : "border-2 border-neutral-700 text-transparent hover:border-red-500"
                        } ${isViewingCurrentDay && isLockedAwaitingTimer ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                        title={
                          !isViewingCurrentDay 
                            ? "Click to switch active training to this day" 
                            : isCompleted ? "Mark Incomplete" : "Mark Complete"
                        }
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-black uppercase text-neutral-400">
                            #{index + 1}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-800 text-neutral-300">
                            {exercise.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-800/60 text-neutral-400">
                            {exercise.equipment}
                          </span>
                        </div>

                        <h4 className={`text-base sm:text-lg font-bold mt-0.5 ${isCompleted ? "line-through text-neutral-400" : "text-white"}`}>
                          {exercise.exerciseName}
                        </h4>

                        <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                          <span>Sets: <strong className="text-white">{exercise.sets}</strong></span>
                          <span>•</span>
                          <span>Reps: <strong className="text-white">{exercise.reps}</strong></span>
                          {exercise.restTime && (
                            <>
                              <span>•</span>
                              <span>Rest: <strong className="text-neutral-300">{exercise.restTime}</strong></span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedExerciseId(isExpanded ? null : exercise.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-all flex items-center gap-1.5"
                      >
                        <span>{isExpanded ? "Hide Specs" : "Form Specs"}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Form Instructions & Video preview */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-neutral-800/80 p-4 sm:p-5 bg-neutral-950/60 space-y-4"
                      >
                        {/* Visual Asset if available */}
                        {exercise.gifUrl && (
                          <div className="w-full max-w-sm rounded-xl overflow-hidden border border-neutral-800 bg-black">
                            <img 
                              src={exercise.gifUrl} 
                              alt={exercise.exerciseName}
                              className="w-full h-48 object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}

                        <div>
                          <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                            Step-by-Step Instructions
                          </h5>
                          <ol className="list-decimal list-inside text-xs sm:text-sm text-neutral-300 space-y-1">
                            {exercise.instructions.map((inst: string, i: number) => (
                              <li key={i} className="leading-relaxed">{inst}</li>
                            ))}
                          </ol>
                        </div>

                        {exercise.coachingCues && exercise.coachingCues.length > 0 && (
                          <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20">
                            <h5 className="text-[11px] font-bold uppercase tracking-wider text-red-400 mb-1 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              Trainer Kinetic Cue
                            </h5>
                            <ul className="text-xs text-neutral-300 space-y-0.5">
                              {exercise.coachingCues.map((cue: string, i: number) => (
                                <li key={i}>• {cue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
        )}

        {/* 6. WORKOUT COMPLETION CALL TO ACTION */}
        <div className="mt-8 pt-6 border-t border-neutral-800">
          {!currentProgress.workoutCompleted ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-lg sm:text-xl font-black text-white">
                  Finish Day {currentProgress.currentDay} Workout
                </h4>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-lg">
                  Complete today's training to record your achievement. This activates your mandatory 5-hour cool-down recovery window before Day {currentProgress.currentDay + 1} unlocks.
                </p>
              </div>

              <button
                onClick={handleFinishWorkout}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-base shadow-xl shadow-red-600/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>COMPLETE TODAY'S WORKOUT</span>
              </button>
            </div>
          ) : isLockedAwaitingTimer ? (
            <div className="bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                      5-Hour Cooldown Active
                    </span>
                    <span className="text-xs text-neutral-400">Day {currentProgress.currentDay} Finished</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-white mt-1">
                    Next Workout Unlocks In: <span className="text-amber-400 font-mono">{unlockCountdown}</span>
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Muscular and metabolic recovery active. Day {currentProgress.currentDay + 1} will unlock automatically when cooldown finishes.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => adminBypassUnlock()}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-mono font-bold uppercase transition border border-neutral-700 cursor-pointer"
                  title="Test or Admin Override"
                >
                  ⚡ Bypass 5-Hr Wait
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    Day {currentProgress.currentDay} Recovery Complete!
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                    Your 5-hour rest window has concluded. You are cleared to advance to Day {currentProgress.currentDay + 1}!
                  </p>
                </div>
              </div>

              <button
                onClick={() => advanceToNextDay()}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-base shadow-xl shadow-red-600/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>START DAY {currentProgress.currentDay + 1}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RESET SETTINGS CONFIRMATION MODAL */}
      <AnimatePresence>
        {isResetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center gap-3 text-red-400">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                  <RefreshCw className={`w-6 h-6 ${isResetting ? "animate-spin" : ""}`} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Reset Program Settings</h3>
                  <p className="text-xs text-neutral-400">Restart fresh with updated engine & database</p>
                </div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 text-xs text-neutral-300 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Your historical workout logs and logs are preserved.</span>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  This resets all active workout timers, unlocks, search filters, and cooldown gates to clean Day 1 defaults across all programs.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={isResetting}
                  onClick={() => setIsResetModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isResetting}
                  onClick={async () => {
                    setIsResetting(true);
                    try {
                      resetProgramProgress(activeProgramId);
                      await resetAllSettings();
                      setIsResetModalOpen(false);
                    } catch (e) {
                      console.error("Reset failed:", e);
                    } finally {
                      setIsResetting(false);
                    }
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isResetting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{isResetting ? "Resetting..." : "Confirm Reset"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
