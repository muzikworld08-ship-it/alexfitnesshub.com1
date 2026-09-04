import React, { useState, useEffect, useMemo, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { 
  getWomen180DayPlan, 
  WOMEN_PROGRAM_CATEGORIES, 
  WomenCategoryName,
  WOMEN_180_CYCLE_INFO,
  DayWorkoutPlan
} from "../../data/programsSystem";
import WorkoutVisual from "../WorkoutVisual";
import { 
  Trophy, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  Footprints, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  Calendar, 
  ShieldCheck, 
  ArrowRight,
  Filter,
  Dumbbell
} from "lucide-react";

interface WomenWorkoutViewProps {
  onBackToPrograms?: () => void;
  onOpenExerciseLibrary?: () => void;
}

const STORAGE_KEY = "alexfitness_women_180_progress";

export default function WomenWorkoutView({ onBackToPrograms, onOpenExerciseLibrary }: WomenWorkoutViewProps) {
  const { exercises } = useApp();

  // Active subcategory filter (defaults to "Glutes + Legs" or "All")
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Progress state (180 days)
  const [progress, setProgress] = useState<{ currentDay: number; completedDays: number[]; completedExercises: Record<number, string[]> }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { currentDay: 1, completedDays: [], completedExercises: {} };
  });

  const [selectedDay, setSelectedDay] = useState<number>(() => progress.currentDay || 1);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(0);

  // Week filter for 180 days (approx 26 weeks)
  const [selectedWeek, setSelectedWeek] = useState<number>(() => Math.ceil((progress.currentDay || 1) / 7));

  // Rest Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Rest Timer effect
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

  // Compute day plan
  const dayPlan: DayWorkoutPlan = useMemo(() => {
    return getWomen180DayPlan(selectedDay, exercises);
  }, [selectedDay, exercises]);

  // Filter exercises if user clicked a specific category filter
  const displayedExercises = useMemo(() => {
    if (activeCategory === "All") return dayPlan.exercises;

    // Filter from whole library if filtering by a distinct category
    const catLower = activeCategory.toLowerCase();
    const filtered = exercises.filter(e => {
      if (e.womenCategories?.includes(activeCategory)) return true;
      const m = e.muscleGroups[0]?.toLowerCase() || "";
      const n = e.name.toLowerCase();
      if (catLower.includes("glute") && (m.includes("glute") || n.includes("hip thrust") || n.includes("bridge") || n.includes("squat"))) return true;
      if (catLower.includes("loss") && (e.exerciseType === "Cardio" || n.includes("jump") || n.includes("run") || n.includes("walk"))) return true;
      if (catLower.includes("core") && (m.includes("abs") || m.includes("core") || n.includes("plank"))) return true;
      if (catLower.includes("upper") && ["Chest", "Back", "Shoulders", "Biceps", "Triceps"].includes(e.muscleGroups[0])) return true;
      if (catLower.includes("lower") && ["Legs", "Quadriceps", "Hamstrings", "Glutes"].includes(e.muscleGroups[0])) return true;
      if (catLower.includes("posture") && (e.exerciseType === "Mobility" || n.includes("stretch") || n.includes("cat-cow"))) return true;
      return false;
    });

    return filtered.length > 0 ? filtered.slice(0, 8) : dayPlan.exercises;
  }, [activeCategory, dayPlan.exercises, exercises]);

  useEffect(() => {
    setSelectedExerciseIndex(0);
  }, [selectedDay, activeCategory]);

  const currentExercise = displayedExercises[selectedExerciseIndex] || displayedExercises[0];

  const completedTodayList = progress.completedExercises[selectedDay] || [];

  const toggleExerciseDone = (exerciseId: string) => {
    setProgress(prev => {
      const todayDone = prev.completedExercises[selectedDay] || [];
      const updated = todayDone.includes(exerciseId)
        ? todayDone.filter(id => id !== exerciseId)
        : [...todayDone, exerciseId];
      
      const newMap = { ...prev.completedExercises, [selectedDay]: updated };
      let newDays = [...prev.completedDays];
      if (displayedExercises.every(e => updated.includes(e.id)) && !newDays.includes(selectedDay)) {
        newDays.push(selectedDay);
      }
      return { ...prev, completedExercises: newMap, completedDays: newDays };
    });
  };

  const markDayDone = () => {
    setProgress(prev => {
      const newDays = prev.completedDays.includes(selectedDay) ? prev.completedDays : [...prev.completedDays, selectedDay];
      const nextDay = selectedDay < 180 ? selectedDay + 1 : 180;
      return {
        ...prev,
        currentDay: nextDay,
        completedDays: newDays,
        completedExercises: { ...prev.completedExercises, [selectedDay]: displayedExercises.map(e => e.id) }
      };
    });
    if (selectedDay < 180) {
      setSelectedDay(selectedDay + 1);
      setSelectedWeek(Math.ceil((selectedDay + 1) / 7));
    }
  };

  const totalWeeks = Math.ceil(180 / 7);

  return (
    <div id="women-workout-container" className="min-h-screen bg-neutral-950 text-white pb-24">
      {/* Top Banner */}
      <div className="border-b border-neutral-800 bg-gradient-to-b from-pink-950/30 via-neutral-950 to-neutral-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
            <button onClick={onBackToPrograms} className="hover:text-pink-400 transition font-medium">
              All Programs
            </button>
            <span>/</span>
            <span className="text-pink-400 font-semibold">Women’s Workout Programs</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-pink-500/20 text-pink-400 border border-pink-500/40 rounded-full flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-pink-400" />
                  180 Days Women Confidence
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold bg-neutral-800 text-neutral-300 rounded-full">
                  7-Day Rolling Cycle
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold bg-neutral-800 text-neutral-300 rounded-full">
                  2x 5-10km Walks/Runs
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                Women’s Workout Programs & 180-Day Confidence
              </h1>
              <p className="text-neutral-400 max-w-3xl text-sm sm:text-base">
                Structured upper and lower body days with dedicated glute shaping, core definition, posture mobility, and 2 times weekly 5 to 10 kilometer aerobic walks or runs.
              </p>
            </div>

            {/* Overall Stats */}
            <div className="flex items-center gap-4 bg-neutral-900/90 border border-neutral-800 p-4 rounded-xl">
              <div>
                <div className="text-xs text-neutral-400 font-medium">180-Day Progress</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-pink-400">{progress.completedDays.length}</span>
                  <span className="text-sm text-neutral-400">/ 180 Days</span>
                </div>
              </div>
              {selectedDay !== progress.currentDay && (
                <button
                  onClick={() => {
                    setSelectedDay(progress.currentDay);
                    setSelectedWeek(Math.ceil(progress.currentDay / 7));
                  }}
                  className="px-3.5 py-2 bg-pink-500 hover:bg-pink-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-lg transition"
                >
                  Day {progress.currentDay}
                </button>
              )}
            </div>
          </div>

          {/* 15 Program Category Filter Chips */}
          <div className="mt-6 pt-4 border-t border-neutral-800/80">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
              <Filter className="w-3.5 h-3.5 text-pink-400" />
              Categories (15 Tracks)
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setActiveCategory("All")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeCategory === "All"
                    ? "bg-pink-500 text-neutral-950"
                    : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800"
                }`}
              >
                Today's Split (Day {selectedDay})
              </button>
              {WOMEN_PROGRAM_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    activeCategory === cat
                      ? "bg-pink-500 text-neutral-950"
                      : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Week & Day Selector */}
      <div className="border-b border-neutral-800 bg-neutral-900/60 px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-bold uppercase text-neutral-300">
              Week {selectedWeek} of {totalWeeks}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[70%] sm:max-w-none">
            {Array.from({ length: 7 }).map((_, idx) => {
              const dayNum = (selectedWeek - 1) * 7 + idx + 1;
              if (dayNum > 180) return null;
              const isSelected = selectedDay === dayNum;
              const isDone = progress.completedDays.includes(dayNum);
              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                    isSelected
                      ? "bg-pink-500 text-neutral-950"
                      : isDone
                      ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/40"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  }`}
                >
                  Day {dayNum}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Interface */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Day Header */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-pink-500/20 text-pink-400 border border-pink-500/30 text-xs font-bold rounded">
                Day {selectedDay} of 180
              </span>
              <span className="text-xs text-neutral-400">
                Cycle Day {dayPlan.cycleDay} of 7
              </span>
              {dayPlan.walkRunDistance && (
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-bold rounded flex items-center gap-1">
                  <Footprints className="w-3.5 h-3.5" />
                  {dayPlan.walkRunDistance}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {activeCategory === "All" ? dayPlan.title : `${activeCategory} Specialization`}
            </h2>
            <p className="text-sm text-neutral-400">
              {dayPlan.focus}
            </p>
          </div>

          <button
            onClick={markDayDone}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 ${
              progress.completedDays.includes(selectedDay)
                ? "bg-emerald-600/30 text-emerald-400 border border-emerald-500/40"
                : "bg-pink-500 hover:bg-pink-400 text-neutral-950 shadow-md"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {progress.completedDays.includes(selectedDay) ? "Day Completed" : "Mark Day Complete"}
          </button>
        </div>

        {/* Exercises & Media Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
              <Dumbbell className="w-5 h-5 text-pink-400" />
              Exercises ({displayedExercises.length})
            </h3>
            {displayedExercises.map((ex, idx) => {
              const isSelected = selectedExerciseIndex === idx;
              const isDone = completedTodayList.includes(ex.id);
              return (
                <div
                  key={ex.id}
                  onClick={() => setSelectedExerciseIndex(idx)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-pink-400 bg-neutral-900 ring-1 ring-pink-400/30"
                      : "border-neutral-800 bg-neutral-900/60 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExerciseDone(ex.id);
                      }}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition ${
                        isDone ? "border-emerald-500 bg-emerald-500 text-neutral-950" : "border-neutral-600 bg-neutral-800"
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div className="min-w-0">
                      <h4 className={`text-sm font-semibold truncate ${isSelected ? "text-pink-400" : isDone ? "text-neutral-500 line-through" : "text-white"}`}>
                        {ex.name}
                      </h4>
                      <div className="text-xs text-neutral-400">
                        {ex.recommendedSets || "3"} Sets &bull; {ex.recommendedReps || "12-15"} Reps &bull; {ex.muscleGroups[0]}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? "text-pink-400" : "text-neutral-600"}`} />
                </div>
              );
            })}
          </div>

          {/* Media & Rest Timer */}
          <div className="lg:col-span-7 space-y-6">
            {currentExercise && (
              <div key={currentExercise.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-xs font-semibold rounded">
                      {currentExercise.difficulty}
                    </span>
                    <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 text-xs font-semibold rounded">
                      {currentExercise.muscleGroups.join(" &bull; ")}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {currentExercise.name}
                  </h3>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-neutral-800">
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
                </div>

                {/* Rest Timer */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-pink-400" />
                    <div>
                      <div className="text-xs text-neutral-400">Rest Timer</div>
                      <div className="text-xl font-bold tracking-wider">{timerSeconds}s</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTimerRunning(!timerRunning)}
                      className="px-3 py-1.5 bg-pink-500 hover:bg-pink-400 text-neutral-950 font-bold text-xs rounded-lg transition flex items-center gap-1"
                    >
                      {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{timerRunning ? "Pause" : "Start"}</span>
                    </button>
                    <button
                      onClick={() => {
                        setTimerRunning(false);
                        setTimerSeconds(45);
                      }}
                      className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded-lg transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Form Instructions */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Form & Technique Instructions
                  </h4>
                  {currentExercise.instructions && currentExercise.instructions.length > 0 ? (
                    currentExercise.instructions.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2.5 bg-neutral-950/60 p-2.5 rounded-lg text-xs text-neutral-300">
                        <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-400 font-bold flex items-center justify-center flex-shrink-0">
                          {sIdx + 1}
                        </span>
                        <p>{step}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-400">{currentExercise.description}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
