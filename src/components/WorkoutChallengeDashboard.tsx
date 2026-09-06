import React, { useState } from "react";
import { 
  Trophy, Flame, Shield, Clock, CheckCircle2, Lock, Sparkles, 
  ChevronRight, Dumbbell, AlertTriangle, Play, RefreshCw, 
  Check, Calendar, Activity, Zap, Info, ShieldCheck, Heart, User, Compass
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useChallengeEngine } from "../hooks/useChallengeEngine";
import { CHALLENGE_PROGRAMS_METADATA } from "../data/challengeEngineDatabase";
import { ProgramId, ChallengeExerciseItem } from "../types/challengeEngine";
import { useApp, isEmailAdmin } from "../context/AppContext";

export default function WorkoutChallengeDashboard() {
  const { user } = useApp();
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
    startTodayWorkout,
    toggleExerciseComplete,
    completeTodayWorkout,
    adminBypassUnlock,
    resetProgramProgress
  } = useChallengeEngine("immortal_90");

  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

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

  const completedCount = currentProgress.exercisesCompleted.length;
  const totalCount = validatedExercises.length;
  const allExercisesFinished = totalCount > 0 && completedCount >= totalCount;

  const handleFinishWorkout = () => {
    completeTodayWorkout();
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 5000);
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
                  Deterministic Progression & 7-Hour Lock
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                {metadata.name}
              </h1>
            </div>

            {/* Independent Programs Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {(Object.keys(CHALLENGE_PROGRAMS_METADATA) as ProgramId[]).map((pid) => {
                const p = CHALLENGE_PROGRAMS_METADATA[pid];
                const pProgress = allProgramStates[pid];
                const isActive = activeProgramId === pid;

                return (
                  <button
                    key={pid}
                    onClick={() => setActiveProgramId(pid)}
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

        {/* 2. PROGRAM OVERVIEW & DAY STATUS HERO */}
        <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/10 text-white border border-white/10">
                  DAY {currentProgress.currentDay} OF {metadata.totalDays}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/20">
                  {workoutPlan.meta.category}
                </span>
                {workoutPlan.meta.isCardioOnly && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    5 TO 10 KM CARDIO & RECOVERY
                  </span>
                )}
                {workoutPlan.meta.isRestDay && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    COMPLETE REST & WALKING
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {workoutPlan.meta.title}
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
                {workoutPlan.meta.coachingNotes}
              </p>

              {/* Target Muscles Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Targeted:</span>
                {workoutPlan.meta.targetMuscles.map((muscle) => (
                  <span key={muscle} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-800 text-neutral-200 border border-neutral-700/60">
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Metrics & Progression */}
            <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                <span>Today's Progress</span>
                <span className="text-white font-bold">{completedCount} / {totalCount} Drills</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-800 h-3 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${currentProgress.completionPercentage}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-neutral-900/90 rounded-xl p-3 border border-neutral-800">
                  <div className="text-[11px] text-neutral-400 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    Est. Duration
                  </div>
                  <div className="text-sm font-bold text-white mt-1">
                    {workoutPlan.meta.estimatedDuration}
                  </div>
                </div>

                <div className="bg-neutral-900/90 rounded-xl p-3 border border-neutral-800">
                  <div className="text-[11px] text-neutral-400 font-medium flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    Est. Burn
                  </div>
                  <div className="text-sm font-bold text-white mt-1">
                    ~{workoutPlan.meta.estimatedCalories} kcal
                  </div>
                </div>
              </div>

              {/* Admin Bypass Controls */}
              {isAdmin && (
                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin Override
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={adminBypassUnlock}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
                      title="Advance to next day without 7 hour delay"
                    >
                      Unlock Next Day
                    </button>
                    <button
                      onClick={() => resetProgramProgress()}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    >
                      Reset Day 1
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. STRICT 7-HOUR LOCK STATUS BANNER */}
        {isLockedAwaitingTimer && (
          <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-neutral-900 to-neutral-900 border-2 border-red-500/40 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
                  <Lock className="w-7 h-7 text-red-400" />
                </div>
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Day {currentProgress.currentDay} Completed & Saved
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    Next Workout Unlocks in:
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
                    Strict recovery cadence enforced. Your muscles and nervous system require adequate recovery before Day {currentProgress.currentDay + 1} unlocks.
                  </p>
                </div>
              </div>

              {/* Live 7-Hour Countdown Clock */}
              <div className="bg-neutral-950 px-6 py-4 rounded-2xl border border-red-500/30 text-center shrink-0">
                <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
                  Unlock Timer
                </div>
                <div className="text-3xl sm:text-4xl font-mono font-black text-red-500 tracking-wider mt-0.5">
                  {unlockCountdown || "07:00:00"}
                </div>
                <div className="text-[10px] text-neutral-400 mt-1">
                  Server Synchronized (7 Hours)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. WORKOUT GUIDELINES & CADENCE RULES */}
        <div className="mb-8 p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-500" />
            Execution Protocol & Strict Rules
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {workoutPlan.meta.guidelines.map((guide, idx) => (
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
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-red-500" />
              Prescribed Exercises ({validatedExercises.length})
            </h3>
            <span className="text-xs text-neutral-400 font-medium">
              Strict Category: <strong className="text-white">{workoutPlan.meta.category}</strong>
            </span>
          </div>

          {validatedExercises.length === 0 ? (
            <div className="p-8 text-center bg-neutral-900/60 border border-neutral-800 rounded-3xl">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-white font-bold">No exercises found for this day's category.</p>
              <p className="text-xs text-neutral-400 mt-1">Check administrator mappings or program configuration.</p>
            </div>
          ) : (
            validatedExercises.map((exercise, index) => {
              const isCompleted = currentProgress.exercisesCompleted.includes(exercise.id);
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
                        onClick={() => toggleExerciseComplete(exercise.id)}
                        disabled={isLockedAwaitingTimer}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isCompleted
                            ? "bg-emerald-600 text-white ring-2 ring-emerald-500 shadow-md shadow-emerald-600/20"
                            : "border-2 border-neutral-700 text-transparent hover:border-red-500"
                        } ${isLockedAwaitingTimer ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                        title={isCompleted ? "Mark Incomplete" : "Mark Complete"}
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
                            {exercise.instructions.map((inst, i) => (
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
                              {exercise.coachingCues.map((cue, i) => (
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

        {/* 6. WORKOUT COMPLETION CALL TO ACTION */}
        <div className="mt-8 pt-6 border-t border-neutral-800">
          {!isLockedAwaitingTimer ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-lg sm:text-xl font-black text-white">
                  Finish Day {currentProgress.currentDay} Workout
                </h4>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-lg">
                  Once completed, today's workout will be permanently logged and locked for 7 hours before Day {currentProgress.currentDay + 1} unlocks.
                </p>
              </div>

              <button
                onClick={handleFinishWorkout}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-base shadow-xl shadow-red-600/25 transition-all transform active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>COMPLETE TODAY'S WORKOUT</span>
              </button>
            </div>
          ) : (
            <div className="text-center p-6 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl">
              <span className="text-xs text-neutral-400">
                Workout completed. Day {currentProgress.currentDay + 1} unlocks automatically in <strong className="text-red-400">{unlockCountdown}</strong>.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
