import React, { useState, useEffect, useMemo, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { 
  getImmortalChallengeDayPlan, 
  DayWorkoutPlan,
  IMMORTAL_7_DAY_CYCLE_INFO 
} from "../../data/programsSystem";
import WorkoutVisual from "../WorkoutVisual";
import { 
  Trophy, 
  Flame, 
  Zap, 
  Award, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  Dumbbell, 
  Footprints, 
  ShieldCheck, 
  Sparkles, 
  Info, 
  TrendingUp, 
  ArrowRight,
  Layers,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Immortal90DayViewProps {
  onBackToPrograms?: () => void;
  onNavigateToCategory?: (catId: string) => void;
}

const STORAGE_KEY = "alexfitness_immortal_90_progress";

interface ImmortalProgress {
  currentDay: number;
  completedDays: number[]; // e.g. [1, 2, 3]
  completedExercisesByDay: Record<number, string[]>; // dayNumber -> exerciseId[]
}

export default function Immortal90DayView({ onBackToPrograms, onNavigateToCategory }: Immortal90DayViewProps) {
  const { exercises } = useApp();

  // Load saved progress from localStorage or default to Day 1
  const [progress, setProgress] = useState<ImmortalProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          currentDay: parsed.currentDay || 1,
          completedDays: Array.isArray(parsed.completedDays) ? parsed.completedDays : [],
          completedExercisesByDay: parsed.completedExercisesByDay || {}
        };
      }
    } catch {
      // ignore
    }
    return { currentDay: 1, completedDays: [], completedExercisesByDay: {} };
  });

  // Selected viewing day (defaults to currentDay)
  const [selectedDay, setSelectedDay] = useState<number>(() => progress.currentDay);

  // Active exercise selected for visual inspection & instructions
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(0);

  // Filter timeline by week for smooth mobile & desktop navigation
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<number>(() => {
    return Math.ceil((progress.currentDay || 1) / 7);
  });

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [customRestTarget, setCustomRestTarget] = useState<number>(60);
  const timerRef = useRef<any>(null);

  // Persist progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Compute today's workout plan
  const dayPlan: DayWorkoutPlan = useMemo(() => {
    return getImmortalChallengeDayPlan(selectedDay, exercises);
  }, [selectedDay, exercises]);

  // Ensure selectedExerciseIndex is in range
  useEffect(() => {
    setSelectedExerciseIndex(0);
  }, [selectedDay]);

  const currentExercise = dayPlan.exercises[selectedExerciseIndex] || dayPlan.exercises[0];

  // Rest Timer countdown
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const startTimer = (seconds: number) => {
    setCustomRestTarget(seconds);
    setTimerSeconds(seconds);
    setTimerRunning(true);
  };

  const toggleTimer = () => {
    if (timerSeconds === 0) {
      setTimerSeconds(customRestTarget);
      setTimerRunning(true);
    } else {
      setTimerRunning(!timerRunning);
    }
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(customRestTarget);
  };

  // Toggle exercise completion
  const toggleExerciseComplete = (exerciseId: string) => {
    setProgress(prev => {
      const dayCompleted = prev.completedExercisesByDay[selectedDay] || [];
      const exists = dayCompleted.includes(exerciseId);
      const updated = exists 
        ? dayCompleted.filter(id => id !== exerciseId)
        : [...dayCompleted, exerciseId];
      
      const newMap = { ...prev.completedExercisesByDay, [selectedDay]: updated };
      
      // If all exercises in dayPlan are completed, mark the day as completed!
      let newCompletedDays = [...prev.completedDays];
      const allDone = dayPlan.exercises.every(e => updated.includes(e.id));
      if (allDone && !newCompletedDays.includes(selectedDay)) {
        newCompletedDays.push(selectedDay);
      } else if (!allDone && newCompletedDays.includes(selectedDay)) {
        newCompletedDays = newCompletedDays.filter(d => d !== selectedDay);
      }

      return {
        ...prev,
        completedExercisesByDay: newMap,
        completedDays: newCompletedDays
      };
    });
  };

  // Mark entire day as complete and advance
  const markDayComplete = () => {
    setProgress(prev => {
      const newCompletedDays = prev.completedDays.includes(selectedDay)
        ? prev.completedDays
        : [...prev.completedDays, selectedDay];
      
      const nextDay = selectedDay < 90 ? selectedDay + 1 : 90;
      
      // Mark all exercises for this day as done
      const allExerciseIds = dayPlan.exercises.map(e => e.id);
      const newMap = { ...prev.completedExercisesByDay, [selectedDay]: allExerciseIds };

      return {
        ...prev,
        currentDay: nextDay,
        completedDays: newCompletedDays,
        completedExercisesByDay: newMap
      };
    });

    if (selectedDay < 90) {
      setSelectedDay(selectedDay + 1);
      setSelectedWeekFilter(Math.ceil((selectedDay + 1) / 7));
    }
  };

  // Quick jump to resume day
  const jumpToCurrentDay = () => {
    setSelectedDay(progress.currentDay);
    setSelectedWeekFilter(Math.ceil(progress.currentDay / 7));
  };

  const completedTodayList = progress.completedExercisesByDay[selectedDay] || [];
  const dailyProgressPercent = dayPlan.exercises.length > 0 
    ? Math.round((completedTodayList.length / dayPlan.exercises.length) * 100)
    : 0;

  const totalProgressPercent = Math.round((progress.completedDays.length / 90) * 100);

  // Total 13 weeks of 7 days
  const totalWeeks = Math.ceil(90 / 7);

  return (
    <div id="immortal-90-challenge-container" className="min-h-screen bg-neutral-950 text-white pb-24">
      {/* Top Header Hero */}
      <div className="relative border-b border-neutral-800 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
            <button 
              onClick={onBackToPrograms}
              className="hover:text-amber-400 transition flex items-center gap-1 font-medium"
            >
              All Programs
            </button>
            <span>/</span>
            <span className="text-amber-400 font-semibold">90 Days Immortal Challenge</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full">
                  Flagship Program
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold bg-neutral-800 text-neutral-300 rounded-full">
                  90 Days Total
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold bg-neutral-800 text-neutral-300 rounded-full">
                  Intermediate &bull; Advanced
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold bg-neutral-800 text-neutral-300 rounded-full">
                  Full Gym Required
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                90 Days Immortal Challenge
              </h1>
              <p className="text-neutral-400 max-w-3xl text-sm sm:text-base">
                Structured 7-day science-based muscle split continuously repeating until Day 90. Zero duplicates, structured cardio recovery runs, and progressive overload with your live Workout Library.
              </p>
            </div>

            {/* Quick Resume Button & Overall Stats */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-neutral-900/90 border border-neutral-800 p-4 rounded-xl">
              <div>
                <div className="text-xs text-neutral-400 font-medium">Overall Progress</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-400">{progress.completedDays.length}</span>
                  <span className="text-sm text-neutral-400">/ 90 Days ({totalProgressPercent}%)</span>
                </div>
                <div className="w-36 sm:w-44 h-2 bg-neutral-800 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${totalProgressPercent}%` }}
                  />
                </div>
              </div>

              {selectedDay !== progress.currentDay && (
                <button
                  onClick={jumpToCurrentDay}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-lg transition shadow-md flex items-center justify-center gap-1.5"
                >
                  <ArrowRight className="w-4 h-4" />
                  Jump to Day {progress.currentDay}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 90-DAY INTERACTIVE TIMELINE SELECTOR */}
      <div className="border-b border-neutral-800 bg-neutral-900/60 px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Week Selector Bar */}
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Timeline: Week {selectedWeekFilter} of {totalWeeks}
              </span>
            </div>

            {/* Week navigation pills */}
            <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none max-w-[60%] sm:max-w-none">
              {Array.from({ length: totalWeeks }).map((_, idx) => {
                const weekNum = idx + 1;
                const isSelected = selectedWeekFilter === weekNum;
                return (
                  <button
                    key={weekNum}
                    onClick={() => setSelectedWeekFilter(weekNum)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition ${
                      isSelected 
                        ? "bg-amber-500 text-neutral-950 font-bold" 
                        : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white"
                    }`}
                  >
                    W{weekNum}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Days in Selected Week (7 Days Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, dayIdx) => {
              const dayNum = (selectedWeekFilter - 1) * 7 + dayIdx + 1;
              if (dayNum > 90) return null;

              const isCompleted = progress.completedDays.includes(dayNum);
              const isToday = progress.currentDay === dayNum;
              const isSelected = selectedDay === dayNum;
              const cycleDay = ((dayNum - 1) % 7) + 1;
              const isRest = cycleDay === 7;
              const isCardio = cycleDay === 3;

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`p-2.5 rounded-lg border text-left transition relative flex flex-col justify-between ${
                    isSelected
                      ? "border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/20"
                      : isCompleted
                      ? "border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-500/60"
                      : isToday
                      ? "border-amber-500/80 bg-neutral-800 hover:border-amber-400"
                      : "border-neutral-800 bg-neutral-900/80 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${isSelected ? "text-amber-400" : isCompleted ? "text-emerald-400" : "text-neutral-300"}`}>
                      Day {dayNum}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isToday ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    ) : isRest ? (
                      <span className="text-[10px] uppercase font-bold text-neutral-500">Rest</span>
                    ) : null}
                  </div>

                  <div className="text-[11px] font-semibold text-neutral-300 truncate">
                    {IMMORTAL_7_DAY_CYCLE_INFO[cycleDay - 1].title}
                  </div>

                  <div className="text-[10px] text-neutral-400 mt-1 flex items-center justify-between">
                    <span>{isRest ? "Walk" : isCardio ? "Cardio" : "Weights"}</span>
                    {isToday && (
                      <span className="text-[9px] font-bold uppercase text-amber-400">Current</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN PROGRAM WORKOUT INTERFACE */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Day Header Banner */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-extrabold rounded-md uppercase">
                  Day {selectedDay} of 90
                </span>
                <span className="text-xs text-neutral-400">
                  Cycle Day {dayPlan.cycleDay} of 7 (Repeats every 7 days)
                </span>
                {dayPlan.isRestDay && (
                  <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-md">
                    Recovery Day
                  </span>
                )}
                {dayPlan.isCardioRecovery && !dayPlan.isRestDay && (
                  <span className="px-2.5 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-semibold rounded-md">
                    Cardio Day
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
                {dayPlan.title}
              </h2>
              <p className="text-sm text-neutral-400 mb-3">
                {dayPlan.focus}
              </p>

              {/* Muscle targets & distance tag */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-neutral-400">Target:</span>
                {dayPlan.targetMuscles.map((muscle, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-0.5 text-xs font-medium bg-neutral-800 text-neutral-300 rounded"
                  >
                    {muscle}
                  </span>
                ))}
                {dayPlan.walkRunDistance && (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded flex items-center gap-1">
                    <Footprints className="w-3.5 h-3.5" />
                    {dayPlan.walkRunDistance}
                  </span>
                )}
              </div>
            </div>

            {/* Daily Completion Status & Mark Done Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 border-t md:border-t-0 md:border-l border-neutral-800 pt-4 md:pt-0 md:pl-6">
              <div>
                <div className="text-xs text-neutral-400 font-medium">Daily Completion</div>
                <div className="text-xl font-bold text-white">
                  {completedTodayList.length} / {dayPlan.exercises.length} Exercises
                </div>
                <div className="w-36 h-2 bg-neutral-800 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${dailyProgressPercent}%` }}
                  />
                </div>
              </div>

              <button
                onClick={markDayComplete}
                className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg ${
                  progress.completedDays.includes(selectedDay)
                    ? "bg-emerald-600/30 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-600/40"
                    : "bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 hover:from-amber-400 hover:to-amber-500"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {progress.completedDays.includes(selectedDay) ? "Day Completed" : "Mark Day Complete"}
              </button>
            </div>
          </div>
        </div>

        {/* WORKOUT INTERACTIVE STAGE: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (5 Cols): Exercise List for Today */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-amber-400" />
                Today's Exercises ({dayPlan.exercises.length})
              </h3>
              <span className="text-xs text-neutral-400">Click to view technique</span>
            </div>

            {/* List of exercises */}
            <div className="space-y-2.5">
              {dayPlan.exercises.map((ex, idx) => {
                const isSelected = selectedExerciseIndex === idx;
                const isCompleted = completedTodayList.includes(ex.id);

                return (
                  <div
                    key={ex.id}
                    onClick={() => setSelectedExerciseIndex(idx)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-amber-400 bg-neutral-900 shadow-md ring-1 ring-amber-400/30"
                        : "border-neutral-800/80 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExerciseComplete(ex.id);
                        }}
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition flex-shrink-0 ${
                          isCompleted
                            ? "border-emerald-500 bg-emerald-500 text-neutral-950"
                            : "border-neutral-600 hover:border-amber-400 bg-neutral-800"
                        }`}
                      >
                        {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-400">#{idx + 1}</span>
                          <h4 className={`text-sm font-semibold truncate ${isSelected ? "text-amber-400" : isCompleted ? "text-neutral-400 line-through" : "text-white"}`}>
                            {ex.name}
                          </h4>
                        </div>
                        <div className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                          <span>{ex.recommendedSets || "3-4"} Sets</span>
                          <span>&bull;</span>
                          <span>{ex.recommendedReps || "10-12"} Reps</span>
                          <span>&bull;</span>
                          <span className="text-neutral-500">{ex.muscleGroups[0]}</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-amber-400" : "text-neutral-600"}`} />
                  </div>
                );
              })}
            </div>

            {/* Rest Day Protocol Info Card if Day 3 or Day 7 */}
            {(dayPlan.isCardioRecovery || dayPlan.isRestDay) && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase mb-1">
                  <Footprints className="w-4 h-4" />
                  {dayPlan.walkRunDistance || "5 to 10 km Protocol"}
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {dayPlan.guidelines[0]} Keep your heart rate aerobic (Zone 2). Do not perform heavy resistance training today to allow muscular supercompensation.
                </p>
              </div>
            )}
          </div>

          {/* Right Column (7 Cols): Active Exercise Visual, GIF/Video Player, Instructions, Rest Timer */}
          <div className="lg:col-span-7 space-y-6">
            {currentExercise ? (
              <div 
                key={currentExercise.id} 
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-6"
              >
                {/* Exercise Title Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-xs font-semibold rounded">
                        {currentExercise.difficulty}
                      </span>
                      <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-xs font-semibold rounded">
                        {currentExercise.equipment.join(", ") || "Bodyweight"}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded">
                        {currentExercise.muscleGroups.join(" &bull; ")}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {currentExercise.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleExerciseComplete(currentExercise.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 ${
                      completedTodayList.includes(currentExercise.id)
                        ? "bg-emerald-500 text-neutral-950"
                        : "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {completedTodayList.includes(currentExercise.id) ? "Completed" : "Mark Done"}
                  </button>
                </div>

                {/* HD Visual GIF/Video Player - Guaranteed Instant Load with key={currentExercise.id} */}
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-neutral-800 shadow-inner">
                  <WorkoutVisual 
                    key={currentExercise.id}
                    exerciseId={currentExercise.id}
                    exerciseName={currentExercise.name}
                    customMediaUrl={currentExercise.customMediaUrl || currentExercise.gifUrl || currentExercise.imageUrl}
                    customMediaType={currentExercise.customMediaType}
                    category={currentExercise.category}
                    muscleGroups={currentExercise.muscleGroups}
                    className="w-full h-full object-cover"
                    priority={true}
                  />
                  
                  {/* Floating target overlay */}
                  <div className="absolute bottom-3 left-3 bg-neutral-950/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-neutral-800 text-xs text-neutral-300 flex items-center gap-2">
                    <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
                    <span>Target: <strong>{currentExercise.recommendedSets || "3"} Sets &times; {currentExercise.recommendedReps || "10-12"} Reps</strong></span>
                  </div>
                </div>

                {/* REST TIMER COMPONENT */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-neutral-400 font-medium">Interval Rest Timer</div>
                        <div className="text-2xl font-black text-white tracking-widest">
                          {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, "0")}
                        </div>
                      </div>
                    </div>

                    {/* Quick Rest Presets */}
                    <div className="flex items-center gap-1.5">
                      {[30, 45, 60, 90, 120].map(sec => (
                        <button
                          key={sec}
                          onClick={() => startTimer(sec)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded transition ${
                            customRestTarget === sec 
                              ? "bg-amber-500 text-neutral-950" 
                              : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white"
                          }`}
                        >
                          {sec}s
                        </button>
                      ))}
                    </div>

                    {/* Play / Pause / Reset Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleTimer}
                        className={`p-2.5 rounded-lg transition font-bold text-xs flex items-center gap-1 ${
                          timerRunning
                            ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                            : "bg-amber-500 text-neutral-950 hover:bg-amber-400"
                        }`}
                      >
                        {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{timerRunning ? "Pause" : "Start"}</span>
                      </button>

                      <button
                        onClick={resetTimer}
                        className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-lg transition"
                        title="Reset Timer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* BIOMECHANICAL TECHNIQUE INSTRUCTIONS */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    Biomechanical Instructions & Form Cues
                  </h4>

                  <div className="space-y-2.5 text-sm text-neutral-300">
                    {currentExercise.instructions && currentExercise.instructions.length > 0 ? (
                      currentExercise.instructions.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-3 bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/60">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <p className="leading-relaxed text-xs sm:text-sm">{step}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-neutral-400">
                        {currentExercise.description || "Perform each repetition with strict tempo control. Squeeze target muscles at peak contraction."}
                      </p>
                    )}
                  </div>

                  {/* Breathing & Trainer Tips */}
                  {currentExercise.breathingInstructions && (
                    <div className="p-3 bg-neutral-950/80 rounded-lg border border-neutral-800 text-xs text-neutral-400">
                      <strong className="text-amber-400 block mb-0.5">Breathing Mechanics:</strong>
                      {currentExercise.breathingInstructions}
                    </div>
                  )}

                  {currentExercise.trainerTips && (
                    <div className="p-3 bg-neutral-950/80 rounded-lg border border-neutral-800 text-xs text-neutral-400">
                      <strong className="text-amber-400 block mb-0.5">Trainer Pro-Tip:</strong>
                      {currentExercise.trainerTips}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-neutral-400 bg-neutral-900 rounded-2xl border border-neutral-800">
                Select an exercise to preview movement kinetics.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
