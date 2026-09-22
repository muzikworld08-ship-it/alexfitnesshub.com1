import React, { useState, useMemo } from "react";
import { X, Search, Check, Dumbbell, Filter, Sparkles, RefreshCw } from "lucide-react";
import { EXERCISES, Exercise } from "../../data/exercises";
import { DailyWorkoutExerciseItem, DailyWorkoutProgramType } from "../../types/dailyWorkout";

interface ExerciseSwapperModalProps {
  currentExercise: DailyWorkoutExerciseItem;
  programType: DailyWorkoutProgramType;
  onClose: () => void;
  onSwapSelected: (newExercise: DailyWorkoutExerciseItem) => void;
}

export default function ExerciseSwapperModal({
  currentExercise,
  programType,
  onClose,
  onSwapSelected
}: ExerciseSwapperModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"target" | "equipment" | "program" | "all">("target");

  const filteredExercises = useMemo(() => {
    let pool = EXERCISES;

    // Filter by mode
    if (activeFilter === "target") {
      const currentMuscle = (currentExercise.targetMuscle || "").toLowerCase();
      pool = pool.filter(e =>
        e.muscleGroups.some(m => m.toLowerCase().includes(currentMuscle) || currentMuscle.includes(m.toLowerCase())) ||
        e.musclesWorked?.some(m => m.toLowerCase().includes(currentMuscle) || currentMuscle.includes(m.toLowerCase())) ||
        e.category.toLowerCase().includes(currentMuscle)
      );
    } else if (activeFilter === "equipment") {
      const currentEquip = currentExercise.equipment[0] || "Bodyweight";
      pool = pool.filter(e => e.equipment.some(eq => eq.toLowerCase() === currentEquip.toLowerCase()));
    } else if (activeFilter === "program") {
      if (programType === "immortal_90") {
        pool = pool.filter(e => e.programAssignments?.includes("90-days-immortal") || e.category.includes("Gym"));
      } else if (programType === "women_confidence") {
        pool = pool.filter(e => e.categories?.includes("Women Confidence Program") || e.category.includes("Women") || e.categories?.includes("Glutes"));
      } else if (programType === "belly_fat_shred") {
        pool = pool.filter(e => e.categories?.includes("Abs") || e.categories?.includes("Core") || e.name.toLowerCase().includes("plank"));
      } else if (programType === "home_workout") {
        pool = pool.filter(e => e.categories?.includes("Home Workouts") || e.equipment?.includes("Bodyweight"));
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      pool = pool.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.muscleGroups.some(m => m.toLowerCase().includes(q)) ||
        e.equipment.some(eq => eq.toLowerCase().includes(q))
      );
    }

    return pool;
  }, [searchQuery, activeFilter, currentExercise, programType]);

  const handleSelect = (ex: Exercise) => {
    const swapped: DailyWorkoutExerciseItem = {
      id: ex.id,
      name: ex.name,
      sets: currentExercise.sets,
      reps: currentExercise.reps,
      restSeconds: currentExercise.restSeconds,
      tempo: currentExercise.tempo || "3-0-1-0",
      coachingCues: ex.movementExecution || currentExercise.coachingCues,
      targetMuscle: ex.musclesWorked?.[0] || ex.muscleGroups?.[0] || currentExercise.targetMuscle,
      equipment: ex.equipment && ex.equipment.length > 0 ? ex.equipment : currentExercise.equipment,
      difficulty: ex.difficulty,
      gifUrl: ex.gifUrl,
      instructions: ex.instructions || currentExercise.instructions,
      startingPosition: ex.startingPosition,
      movementExecution: ex.movementExecution,
      finishingPosition: ex.finishingPosition,
      safetyTips: ex.safetyTips,
      commonMistakes: ex.commonMistakes,
      matchedMasterExercise: ex
    };

    onSwapSelected(swapped);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in text-slate-900">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-blue-600 tracking-wider block">
              237 Master GIF Library
            </span>
            <h3 className="text-lg font-black text-slate-900">
              Swap "{currentExercise.name}"
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-100 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by exercise name, target muscle, or equipment..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase mr-1">Filter:</span>
            {[
              { id: "target", label: `Same Muscle (${currentExercise.targetMuscle})` },
              { id: "equipment", label: `Same Equipment (${currentExercise.equipment[0] || "Any"})` },
              { id: "program", label: "Program Library" },
              { id: "all", label: `All 237 Workouts (${EXERCISES.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition font-sans ${
                  activeFilter === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises Scroll List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 max-h-[500px]">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Dumbbell className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">No matching exercises found in this filter.</p>
              <button
                onClick={() => setActiveFilter("all")}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Show all 237 exercises
              </button>
            </div>
          ) : (
            filteredExercises.map(ex => {
              const isCurrent = ex.name.toLowerCase() === currentExercise.name.toLowerCase();

              return (
                <div
                  key={ex.id}
                  className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    isCurrent
                      ? "bg-blue-50 border-blue-200 opacity-60 pointer-events-none"
                      : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Thumbnail GIF */}
                    <div className="w-14 h-14 rounded-xl bg-slate-950 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {ex.gifUrl ? (
                        <img
                          src={ex.gifUrl}
                          alt={ex.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      ) : (
                        <Dumbbell className="w-6 h-6 text-slate-600" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-mono font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          {ex.musclesWorked?.[0] || ex.muscleGroups?.[0] || ex.category}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">
                          {ex.equipment.join(", ") || "Bodyweight"}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900 leading-tight">
                        {ex.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        {ex.instructions?.[0] || ex.startingPosition}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelect(ex)}
                    disabled={isCurrent}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-blue-600 text-white text-[11px] font-bold rounded-xl transition flex-shrink-0 flex items-center gap-1 shadow-sm"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Swap In</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>{filteredExercises.length} Exercises available</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
