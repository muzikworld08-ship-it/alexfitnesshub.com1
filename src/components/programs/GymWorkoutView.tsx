import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { GYM_WORKOUT_PROGRAMS, GymProgram } from "../../data/programsSystem";
import WorkoutVisual from "../WorkoutVisual";
import { 
  Dumbbell, 
  Calendar, 
  Trophy, 
  CheckCircle2, 
  Flame, 
  ChevronRight, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from "lucide-react";

interface GymWorkoutViewProps {
  onBackToPrograms?: () => void;
  onOpenExerciseLibrary?: () => void;
}

export default function GymWorkoutView({ onBackToPrograms, onOpenExerciseLibrary }: GymWorkoutViewProps) {
  const { exercises } = useApp();

  const [selectedProgramId, setSelectedProgramId] = useState<string>(GYM_WORKOUT_PROGRAMS[0].id);
  const [selectedSplitDayIndex, setSelectedSplitDayIndex] = useState<number>(0);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");

  const activeProgram: GymProgram = useMemo(() => {
    return GYM_WORKOUT_PROGRAMS.find(p => p.id === selectedProgramId) || GYM_WORKOUT_PROGRAMS[0];
  }, [selectedProgramId]);

  const activeSplitDay = activeProgram.splits[selectedSplitDayIndex] || activeProgram.splits[0];

  // Derive exercises for the active split day
  const splitExercises = useMemo(() => {
    const targetWords = activeSplitDay.targetMuscles.map(m => m.toLowerCase());
    const matched = exercises.filter(e => {
      const p = e.muscleGroups[0]?.toLowerCase() || "";
      const s = e.secondaryMuscles?.map(m => m.toLowerCase()) || [];
      const n = e.name.toLowerCase();
      return targetWords.some(w => p.includes(w) || s.some(sm => sm.includes(w)) || n.includes(w));
    });

    return matched.length > 0 ? matched.slice(0, 8) : exercises.slice(0, 6);
  }, [activeSplitDay, exercises]);

  const activeExercise = useMemo(() => {
    if (selectedExerciseId) {
      const found = splitExercises.find(e => e.id === selectedExerciseId);
      if (found) return found;
    }
    return splitExercises[0];
  }, [splitExercises, selectedExerciseId]);

  return (
    <div id="gym-workout-container" className="min-h-screen bg-neutral-950 text-white pb-24">
      {/* Header Banner */}
      <div className="border-b border-neutral-800 bg-gradient-to-b from-red-950/30 via-neutral-950 to-neutral-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
            <button onClick={onBackToPrograms} className="hover:text-red-400 transition font-medium">
              All Programs
            </button>
            <span>/</span>
            <span className="text-red-400 font-semibold">Gym Workout Programs</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40 rounded-full flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5" />
                  Gym Programs
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold bg-neutral-800 text-neutral-300 rounded-full">
                  Barbells &bull; Cables &bull; Free Weights
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                Gym Workout Programs
              </h1>
              <p className="text-neutral-400 max-w-3xl text-sm sm:text-base">
                Science-based splits optimized for hypertrophy, neurological strength, and symmetrical aesthetic development.
              </p>
            </div>
          </div>

          {/* Program Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            {GYM_WORKOUT_PROGRAMS.map(prog => {
              const isSelected = selectedProgramId === prog.id;
              return (
                <button
                  key={prog.id}
                  onClick={() => {
                    setSelectedProgramId(prog.id);
                    setSelectedSplitDayIndex(0);
                    setSelectedExerciseId("");
                  }}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? "border-red-500 bg-red-500/10 ring-1 ring-red-500/30"
                      : "border-neutral-800 bg-neutral-900/70 hover:border-neutral-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                        {prog.splitType}
                      </span>
                      <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">
                        {prog.frequency}
                      </span>
                    </div>
                    <h3 className={`text-sm font-bold ${isSelected ? "text-white" : "text-neutral-300"}`}>
                      {prog.name}
                    </h3>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-2 truncate">
                    {prog.targetFocus}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Program Details & Day Splits */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Split Days Selector */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {activeProgram.splits.map((split, idx) => {
            const isSelected = selectedSplitDayIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedSplitDayIndex(idx);
                  setSelectedExerciseId("");
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? "bg-red-500 text-neutral-950 shadow-md"
                    : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800"
                }`}
              >
                <span>{split.dayName}:</span>
                <span className="font-medium">{split.focus}</span>
              </button>
            );
          })}
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <Dumbbell className="w-5 h-5 text-red-400" />
              {activeSplitDay.dayName} Exercises ({splitExercises.length})
            </h3>
            {splitExercises.map((ex, idx) => {
              const isSelected = activeExercise?.id === ex.id;
              return (
                <div
                  key={ex.id}
                  onClick={() => setSelectedExerciseId(ex.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? "border-red-400 bg-neutral-900 ring-1 ring-red-400/30"
                      : "border-neutral-800 bg-neutral-900/60 hover:border-neutral-700"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-400">#{idx + 1}</span>
                      <h4 className={`text-sm font-bold truncate ${isSelected ? "text-red-400" : "text-white"}`}>
                        {ex.name}
                      </h4>
                    </div>
                    <div className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                      <span>{ex.recommendedSets || "3-4"} Sets</span>
                      <span>&bull;</span>
                      <span>{ex.recommendedReps || "8-12"} Reps</span>
                      <span>&bull;</span>
                      <span className="text-neutral-500">{ex.equipment.join(", ") || "Machine"}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? "text-red-400" : "text-neutral-600"}`} />
                </div>
              );
            })}
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
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs font-semibold rounded">
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
                    Execution Instructions
                  </h4>
                  {activeExercise.instructions && activeExercise.instructions.length > 0 ? (
                    activeExercise.instructions.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2.5 bg-neutral-950/60 p-2.5 rounded-lg text-xs text-neutral-300">
                        <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center flex-shrink-0">
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
