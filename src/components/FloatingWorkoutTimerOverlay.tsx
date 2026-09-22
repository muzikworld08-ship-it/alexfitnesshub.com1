import React, { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  SkipForward, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Volume2, 
  VolumeX, 
  Clock, 
  Flame, 
  Sparkles, 
  Dumbbell, 
  Activity,
  Layers,
  Minimize2,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useWorkoutTimer } from "../context/WorkoutTimerContext";

export default function FloatingWorkoutTimerOverlay() {
  const {
    isActive,
    workoutTitle,
    currentExercise,
    currentSet,
    totalSets,
    phase,
    secondsRemaining,
    totalPhaseDuration,
    elapsedWorkoutSeconds,
    isPaused,
    isMinimized,
    soundEnabled,
    voiceEnabled,
    togglePause,
    addSeconds,
    setRestDuration,
    skipRest,
    stopWorkout,
    toggleMinimize,
    setMinimized,
    toggleSound,
    toggleVoice,
  } = useWorkoutTimer();

  // If timer is not active, don't render anything
  if (!isActive) return null;

  // Format mm:ss
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Progress percentage (0 to 1) for the circular progress ring
  const progressRatio = totalPhaseDuration > 0 
    ? Math.max(0, Math.min(1, secondsRemaining / totalPhaseDuration)) 
    : 0;

  // SVG Circular progress params
  const circleRadius = 38;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const getPhaseColor = () => {
    if (isPaused) return "text-amber-400 border-amber-500/40 bg-amber-500/10";
    if (phase === "rest") return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
    if (phase === "prep") return "text-sky-400 border-sky-500/40 bg-sky-500/10";
    if (phase === "work") return "text-rose-400 border-rose-500/40 bg-rose-500/10";
    return "text-slate-400 border-slate-700 bg-slate-800";
  };

  const getPhaseBadgeText = () => {
    if (isPaused) return "PAUSED";
    if (phase === "rest") return "REST INTERVAL";
    if (phase === "prep") return "GET READY";
    if (phase === "work") return "ACTIVE SET";
    if (phase === "completed") return "FINISHED";
    return "WORKOUT";
  };

  return (
    <div
      id="floating-workout-timer-container"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 select-none font-sans pointer-events-auto"
    >
      <AnimatePresence mode="wait">
        {isMinimized ? (
          /* ================= MINIMAL COMPACT FLOATING PILL ================= */
          <motion.div
            key="minimized-pill"
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={() => setMinimized(false)}
            className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-900/95 hover:bg-slate-850 text-white shadow-2xl border border-slate-700/80 backdrop-blur-md cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-98 ring-1 ring-white/10"
            title="Click to expand workout rest timer"
          >
            {/* Pulsing state dot */}
            <span className="relative flex h-2.5 w-2.5">
              {!isPaused && (
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    phase === "rest" ? "bg-emerald-400" : phase === "work" ? "bg-rose-400" : "bg-sky-400"
                  }`}
                />
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isPaused ? "bg-amber-400" : phase === "rest" ? "bg-emerald-500" : phase === "work" ? "bg-rose-500" : "bg-sky-500"
                }`}
              />
            </span>

            {/* Quick Timer Digits */}
            <div className="flex items-center gap-1.5 font-mono text-xs font-extrabold tracking-tight">
              {phase === "rest" || phase === "prep" ? (
                <span className={phase === "rest" ? "text-emerald-400" : "text-sky-400"}>
                  {formatTime(secondsRemaining)}
                </span>
              ) : (
                <span className="text-rose-400">
                  {formatTime(elapsedWorkoutSeconds)}
                </span>
              )}
              <span className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider">
                {phase === "rest" ? "Rest" : `Set ${currentSet}`}
              </span>
            </div>

            {/* Quick action button inside pill */}
            <div className="flex items-center gap-1 pl-1 border-l border-slate-700/70">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePause();
                }}
                className="p-1 text-slate-300 hover:text-white rounded-full hover:bg-slate-700/60 transition-colors"
                title={isPaused ? "Resume" : "Pause"}
              >
                {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
              </button>

              {phase === "rest" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addSeconds(30);
                  }}
                  className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded-md border border-emerald-500/30 transition-colors"
                  title="Add 30 seconds rest"
                >
                  +30s
                </button>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMinimized(false);
                }}
                className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-700/60 transition-colors"
                title="Expand overlay"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* ================= EXPANDED FLOATING OVERLAY CARD ================= */
          <motion.div
            key="expanded-overlay"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-[300px] sm:w-[320px] bg-slate-900/95 text-slate-100 rounded-3xl border border-slate-700/80 shadow-2xl backdrop-blur-xl overflow-hidden ring-1 ring-white/10"
          >
            {/* Top Bar / Header */}
            <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border ${getPhaseColor()}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {getPhaseBadgeText()}
                </span>
                <span className="text-[11px] font-mono text-slate-400 truncate max-w-[110px]" title={workoutTitle}>
                  {workoutTitle}
                </span>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-1 text-slate-400">
                <button
                  type="button"
                  onClick={toggleSound}
                  className={`p-1.5 rounded-lg hover:bg-slate-700/60 transition-colors ${
                    soundEnabled ? "text-slate-200" : "text-slate-500"
                  }`}
                  title={soundEnabled ? "Mute audio cues" : "Unmute audio cues"}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMinimize}
                  className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-300 hover:text-white transition-colors"
                  title="Minimize to floating pill"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={stopWorkout}
                  className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                  title="End workout session"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="p-4 space-y-3.5">
              {/* Exercise Name & Set Tracker */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase font-bold tracking-wider">
                    <Dumbbell className="w-3 h-3 text-rose-400 shrink-0" />
                    <span className="truncate">Exercise</span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate mt-0.5" title={currentExercise?.name || workoutTitle}>
                    {currentExercise?.name || workoutTitle}
                  </h4>
                </div>

                <div className="text-right shrink-0 bg-slate-800/90 border border-slate-700/60 px-2.5 py-1 rounded-xl">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">SET</span>
                  <span className="text-xs font-mono font-extrabold text-white">
                    {currentSet} <span className="text-slate-400 font-normal">/ {totalSets}</span>
                  </span>
                </div>
              </div>

              {/* Circular Progress & Countdown Visual */}
              <div className="flex items-center justify-center py-1">
                <div className="relative flex items-center justify-center w-28 h-28">
                  {/* SVG Progress Circle */}
                  <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background track */}
                    <circle
                      cx="50"
                      cy="50"
                      r={circleRadius}
                      className="stroke-slate-800"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    {/* Active progress ring */}
                    <circle
                      cx="50"
                      cy="50"
                      r={circleRadius}
                      className={`transition-all duration-500 ease-linear ${
                        phase === "rest"
                          ? "stroke-emerald-400"
                          : phase === "prep"
                          ? "stroke-sky-400"
                          : "stroke-rose-400"
                      }`}
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>

                  {/* Centered Timer Readout */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    {phase === "rest" || phase === "prep" ? (
                      <>
                        <span className="font-mono text-3xl font-black tracking-tight text-white tabular-nums drop-shadow-sm">
                          {formatTime(secondsRemaining)}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                          {phase === "rest" ? "REST TIME" : "PREP"}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-mono text-2xl font-black tracking-tight text-white tabular-nums">
                          {formatTime(elapsedWorkoutSeconds)}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-rose-400 mt-0.5">
                          ACTIVE TIME
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Rest Presets (When in Rest Mode or starting Rest) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>REST PRESETS:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => addSeconds(15)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[9px] border border-slate-700 transition-colors"
                      title="Add 15 seconds"
                    >
                      +15s
                    </button>
                    <button
                      type="button"
                      onClick={() => addSeconds(30)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[9px] border border-slate-700 transition-colors"
                      title="Add 30 seconds"
                    >
                      +30s
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-1">
                  {[30, 45, 60, 90, 120].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setRestDuration(sec)}
                      className={`py-1 rounded-lg font-mono text-[10px] font-bold transition-all ${
                        phase === "rest" && secondsRemaining === sec
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                          : "bg-slate-800/90 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700/60"
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePause}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 ${
                    isPaused
                      ? "bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold"
                      : "bg-slate-800 hover:bg-slate-750 text-white border border-slate-700/80"
                  }`}
                >
                  {isPaused ? (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  )}
                </button>

                {phase === "rest" ? (
                  <button
                    type="button"
                    onClick={skipRest}
                    className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all active:scale-98"
                  >
                    <SkipForward className="w-3.5 h-3.5 fill-current" />
                    <span>Next Set</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRestDuration(60)}
                    className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all active:scale-98"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Start Rest</span>
                  </button>
                )}
              </div>

              {/* Total Session Stopwatch Footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>TOTAL ELAPSED:</span>
                </div>
                <span className="font-bold text-slate-200">
                  {formatTime(elapsedWorkoutSeconds)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
