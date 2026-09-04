import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { FITNESS_GOALS, FitnessGoalConfig } from "../../data/programsSystem";
import WorkoutVisual from "../WorkoutVisual";
import { 
  Target, 
  Dumbbell, 
  Flame, 
  Zap, 
  Award, 
  Shield, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  ChevronRight, 
  Filter, 
  ArrowRight 
} from "lucide-react";

interface GoalBasedWorkoutsViewProps {
  onBackToPrograms?: () => void;
  onOpenExerciseLibrary?: () => void;
  onSelectProgramCategory?: (catId: string) => void;
}

export default function GoalBasedWorkoutsView({ 
  onBackToPrograms, 
  onOpenExerciseLibrary,
  onSelectProgramCategory 
}: GoalBasedWorkoutsViewProps) {
  const { exercises } = useApp();

  const [selectedGoalId, setSelectedGoalId] = useState<string>("build-muscle");
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");

  const activeGoal: FitnessGoalConfig = useMemo(() => {
    return FITNESS_GOALS.find(g => g.id === selectedGoalId) || FITNESS_GOALS[0];
  }, [selectedGoalId]);

  // Filter exercises directly matching the selected goal
  const goalExercises = useMemo(() => {
    const goalName = activeGoal.name;
    const matched = exercises.filter(e => {
      if (e.goals?.includes(goalName)) return true;

      const p = e.muscleGroups[0]?.toLowerCase() || "";
      const n = e.name.toLowerCase();

      if (selectedGoalId === "build-muscle") {
        return ["Chest", "Back", "Legs", "Shoulders", "Biceps", "Triceps"].includes(e.muscleGroups[0]);
      }
      if (selectedGoalId === "lose-weight") {
        return e.exerciseType === "Cardio" || n.includes("jump") || n.includes("hiit") || n.includes("run") || n.includes("burpee");
      }
      if (selectedGoalId === "build-abs") {
        return p.includes("abs") || p.includes("core") || n.includes("plank") || n.includes("crunch");
      }
      if (selectedGoalId === "build-glutes") {
        return p.includes("glute") || n.includes("thrust") || n.includes("bridge") || n.includes("squat");
      }
      if (selectedGoalId === "get-stronger") {
        return e.exerciseType === "Compound Strength" || n.includes("deadlift") || n.includes("squat") || n.includes("bench");
      }
      if (selectedGoalId === "improve-fitness") {
        return e.exerciseType === "Cardio" || e.exerciseType === "Mobility" || n.includes("calisthenic");
      }
      if (selectedGoalId === "beginner-fitness") {
        return e.difficulty === "Beginner";
      }
      if (selectedGoalId === "home-fitness") {
        return e.locationSuitability === "Home" || e.locationSuitability === "Both";
      }
      return true;
    });

    return matched.length > 0 ? matched : exercises.slice(0, 12);
  }, [activeGoal, exercises, selectedGoalId]);

  const activeExercise = useMemo(() => {
    if (selectedExerciseId) {
      const found = goalExercises.find(e => e.id === selectedExerciseId);
      if (found) return found;
    }
    return goalExercises[0];
  }, [goalExercises, selectedExerciseId]);

  const getGoalIcon = (iconName: string) => {
    switch (iconName) {
      case "Dumbbell": return <Dumbbell className="w-5 h-5" />;
      case "Flame": return <Flame className="w-5 h-5" />;
      case "Zap": return <Zap className="w-5 h-5" />;
      case "Award": return <Award className="w-5 h-5" />;
      case "Shield": return <Shield className="w-5 h-5" />;
      case "TrendingUp": return <TrendingUp className="w-5 h-5" />;
      case "Sparkles": return <Sparkles className="w-5 h-5" />;
      case "Layers": return <Layers className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  return (
    <div id="goal-based-workouts-container" className="min-h-screen bg-neutral-950 text-white pb-24">
      {/* Header Banner */}
      <div className="border-b border-neutral-800 bg-gradient-to-b from-cyan-950/30 via-neutral-950 to-neutral-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
            <button onClick={onBackToPrograms} className="hover:text-cyan-400 transition font-medium">
              All Programs
            </button>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">Goal Based Programs</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-full flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" />
                  Target-Driven Architecture
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold bg-neutral-800 text-neutral-300 rounded-full">
                  8 Core Goals
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                Goal Based Workout System
              </h1>
              <p className="text-neutral-400 max-w-3xl text-sm sm:text-base">
                Select your primary fitness objective. The system automatically filters the entire Workout Library to prioritize the most biomechanically effective exercises.
              </p>
            </div>
          </div>

          {/* 8 Goals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mt-6">
            {FITNESS_GOALS.map(goal => {
              const isSelected = selectedGoalId === goal.id;
              return (
                <button
                  key={goal.id}
                  onClick={() => {
                    setSelectedGoalId(goal.id);
                    setSelectedExerciseId("");
                  }}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-2 ${
                    isSelected
                      ? "border-cyan-400 bg-cyan-500/10 ring-1 ring-cyan-400/30 text-white"
                      : "border-neutral-800 bg-neutral-900/70 hover:border-neutral-700 text-neutral-400 hover:text-white"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-cyan-500 text-neutral-950" : "bg-neutral-800 text-neutral-300"}`}>
                    {getGoalIcon(goal.iconName)}
                  </div>
                  <span className="text-xs font-bold leading-tight">
                    {goal.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Goal Blueprint Details & Exercises */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Goal Strategy Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md border ${activeGoal.badgeColor}`}>
                {activeGoal.name} Blueprint
              </span>
              <span className="text-xs text-neutral-400">{activeGoal.tagline}</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {activeGoal.name} Strategy
            </h2>
            <p className="text-sm text-neutral-300 max-w-2xl">
              {activeGoal.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800/80 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold text-neutral-500">Rep Range</div>
              <div className="text-xs sm:text-sm font-bold text-cyan-400">{activeGoal.recommendedRepRange}</div>
            </div>
            <div className="border-x border-neutral-800 px-2">
              <div className="text-[10px] uppercase font-bold text-neutral-500">Rest Interval</div>
              <div className="text-xs sm:text-sm font-bold text-neutral-200">{activeGoal.restPeriod}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-neutral-500">Split Structure</div>
              <div className="text-xs sm:text-sm font-bold text-neutral-200">{activeGoal.weeklyStructure}</div>
            </div>
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <Dumbbell className="w-5 h-5 text-cyan-400" />
              Recommended Exercises ({goalExercises.length})
            </h3>
            <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
              {goalExercises.map((ex, idx) => {
                const isSelected = activeExercise?.id === ex.id;
                return (
                  <div
                    key={ex.id}
                    onClick={() => setSelectedExerciseId(ex.id)}
                    className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? "border-cyan-400 bg-neutral-900 ring-1 ring-cyan-400/30"
                        : "border-neutral-800 bg-neutral-900/60 hover:border-neutral-700"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-400">#{idx + 1}</span>
                        <h4 className={`text-sm font-bold truncate ${isSelected ? "text-cyan-400" : "text-white"}`}>
                          {ex.name}
                        </h4>
                      </div>
                      <div className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                        <span>{ex.recommendedSets || "3"} Sets</span>
                        <span>&bull;</span>
                        <span>{activeGoal.recommendedRepRange}</span>
                        <span>&bull;</span>
                        <span className="text-neutral-500">{ex.muscleGroups[0]}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? "text-cyan-400" : "text-neutral-600"}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Media & Details */}
          <div className="lg:col-span-6">
            {activeExercise && (
              <div key={activeExercise.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6 sticky top-24">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-xs font-semibold rounded">
                      {activeExercise.difficulty}
                    </span>
                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-xs font-semibold rounded">
                      {activeExercise.muscleGroups.join(" &bull; ")}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {activeExercise.name}
                  </h3>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-neutral-800">
                  <WorkoutVisual 
                    key={activeExercise.id}
                    exerciseId={activeExercise.id}
                    exerciseName={activeExercise.name}
                    customMediaUrl={activeExercise.customMediaUrl || activeExercise.gifUrl || activeExercise.imageUrl}
                    customMediaType={activeExercise.customMediaType}
                    category={activeExercise.category}
                    muscleGroups={activeExercise.muscleGroups}
                    className="w-full h-full object-cover"
                    priority={true}
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Form Cues for {activeGoal.name}
                  </h4>
                  {activeExercise.instructions && activeExercise.instructions.length > 0 ? (
                    activeExercise.instructions.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2.5 bg-neutral-950/60 p-2.5 rounded-lg text-xs text-neutral-300">
                        <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center flex-shrink-0">
                          {sIdx + 1}
                        </span>
                        <p>{step}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-400">{activeExercise.description}</p>
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
