import React, { useState, useMemo } from "react";
import { X, Search, Dumbbell, Play, ShieldAlert, Award, Heart, CheckCircle2, ChevronRight, Plus } from "lucide-react";
import { EXERCISES, Exercise } from "../../data/exercises";
import { DailyWorkoutExerciseItem } from "../../types/dailyWorkout";

interface MasterLibraryBrowserModalProps {
  onClose: () => void;
  onAddExerciseToRoutine?: (exercise: DailyWorkoutExerciseItem) => void;
}

export default function MasterLibraryBrowserModal({
  onClose,
  onAddExerciseToRoutine
}: MasterLibraryBrowserModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const categories = useMemo(() => {
    return [
      { id: "all", label: "All 237 Exercises" },
      { id: "immortal", label: "90 Days Immortal" },
      { id: "women", label: "Women Confidence" },
      { id: "belly", label: "5-Month Belly Fat Shred" },
      { id: "home", label: "Home Workouts" },
      { id: "chest", label: "Chest & Triceps" },
      { id: "back", label: "Back & Biceps" },
      { id: "legs", label: "Legs & Glutes" },
      { id: "cardio", label: "Cardio & Calisthenics" }
    ];
  }, []);

  const filteredExercises = useMemo(() => {
    let pool = EXERCISES;

    if (selectedCategory === "immortal") {
      pool = pool.filter(e => e.programAssignments?.includes("90-days-immortal") || e.category.includes("Gym"));
    } else if (selectedCategory === "women") {
      pool = pool.filter(e => e.categories?.includes("Women Confidence Program") || e.category.includes("Women") || e.categories?.includes("Glutes"));
    } else if (selectedCategory === "belly") {
      pool = pool.filter(e => e.categories?.includes("Abs") || e.categories?.includes("Core") || e.name.toLowerCase().includes("plank") || e.name.toLowerCase().includes("crunch"));
    } else if (selectedCategory === "home") {
      pool = pool.filter(e => e.categories?.includes("Home Workouts") || e.equipment?.includes("Bodyweight"));
    } else if (selectedCategory === "chest") {
      pool = pool.filter(e => e.category.toLowerCase().includes("chest") || e.muscleGroups.some(m => m.toLowerCase().includes("chest") || m.toLowerCase().includes("tricep")));
    } else if (selectedCategory === "back") {
      pool = pool.filter(e => e.category.toLowerCase().includes("back") || e.muscleGroups.some(m => m.toLowerCase().includes("back") || m.toLowerCase().includes("bicep")));
    } else if (selectedCategory === "legs") {
      pool = pool.filter(e => e.category.toLowerCase().includes("leg") || e.muscleGroups.some(m => m.toLowerCase().includes("quad") || m.toLowerCase().includes("glute") || m.toLowerCase().includes("leg")));
    } else if (selectedCategory === "cardio") {
      pool = pool.filter(e => e.category.toLowerCase().includes("cardio") || e.categories?.some(c => c.toLowerCase().includes("calisthenics") || c.toLowerCase().includes("hiit")));
    }

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
  }, [searchQuery, selectedCategory]);

  const handleAdd = (ex: Exercise) => {
    if (!onAddExerciseToRoutine) return;
    const item: DailyWorkoutExerciseItem = {
      id: ex.id,
      name: ex.name,
      sets: 3,
      reps: "10-12 reps",
      restSeconds: 60,
      tempo: "3-0-1-0",
      coachingCues: ex.movementExecution || "Maintain strict core stability and full range.",
      targetMuscle: ex.musclesWorked?.[0] || ex.muscleGroups?.[0] || ex.category,
      equipment: ex.equipment && ex.equipment.length > 0 ? ex.equipment : ["Bodyweight"],
      difficulty: ex.difficulty,
      gifUrl: ex.gifUrl,
      instructions: ex.instructions || ["Set position.", "Execute with control.", "Return to start."],
      startingPosition: ex.startingPosition,
      movementExecution: ex.movementExecution,
      finishingPosition: ex.finishingPosition,
      safetyTips: ex.safetyTips,
      commonMistakes: ex.commonMistakes,
      matchedMasterExercise: ex
    };
    onAddExerciseToRoutine(item);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in text-slate-900">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Top Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-mono font-black uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Verified Media Engine • 237 Uploaded Animated GIFs
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Admin Master Exercise Library
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-slate-700 rounded-2xl hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-slate-150 bg-white space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search across all 237 exercises by name, body part, equipment..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition font-sans ${
                  selectedCategory === cat.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Two-Column Grid: List & Detail Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Left: Exercise Cards List */}
          <div className="lg:col-span-6 p-4 overflow-y-auto space-y-2 border-r border-slate-150 max-h-[520px]">
            {filteredExercises.map(ex => {
              const isSelected = selectedExercise?.id === ex.id;
              return (
                <div
                  key={ex.id}
                  onClick={() => setSelectedExercise(ex)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-blue-50 border-blue-400 shadow-md ring-1 ring-blue-400"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-slate-950 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                      {ex.gifUrl ? (
                        <img
                          src={ex.gifUrl}
                          alt={ex.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      ) : (
                        <Dumbbell className="w-5 h-5 text-slate-600" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-mono font-bold uppercase text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
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
                        {ex.movementExecution || ex.startingPosition}
                      </p>
                    </div>
                  </div>

                  {onAddExerciseToRoutine && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleAdd(ex);
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 transition flex-shrink-0"
                      title="Add to workout"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Selected Exercise Detailed Inspector */}
          <div className="lg:col-span-6 p-6 overflow-y-auto max-h-[520px] bg-slate-50 space-y-6">
            {selectedExercise ? (
              <div className="space-y-6">
                <div className="bg-slate-950 rounded-2xl overflow-hidden p-4 flex items-center justify-center relative">
                  {selectedExercise.gifUrl ? (
                    <img
                      src={selectedExercise.gifUrl}
                      alt={selectedExercise.name}
                      className="max-h-[240px] w-auto object-contain rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-center p-8 text-slate-400">
                      <Dumbbell className="w-12 h-12 mx-auto text-slate-600" />
                    </div>
                  )}
                  <span className="absolute bottom-2 right-2 text-[9px] font-mono font-bold px-2 py-0.5 bg-black/70 text-white rounded">
                    Admin GIF Asset
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full">
                      {selectedExercise.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase bg-blue-500/10 text-blue-600 px-2.5 py-0.5 rounded-full">
                      {selectedExercise.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {selectedExercise.equipment.join(", ") || "Bodyweight"}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {selectedExercise.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    <strong>Primary Focus: </strong>
                    {(selectedExercise.musclesWorked || selectedExercise.muscleGroups || []).join(", ")}
                  </p>
                </div>

                {/* Biomechanics Breakdown */}
                <div className="space-y-3 text-xs text-slate-700 bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="space-y-1">
                    <strong className="text-slate-900 block font-mono text-[10px] uppercase">Starting Position:</strong>
                    <p className="text-slate-600 leading-relaxed">{selectedExercise.startingPosition || "Establish balanced postural tension."}</p>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <strong className="text-slate-900 block font-mono text-[10px] uppercase">Movement Execution:</strong>
                    <p className="text-slate-600 leading-relaxed">{selectedExercise.movementExecution || "Lift under full continuous muscular tension."}</p>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <strong className="text-slate-900 block font-mono text-[10px] uppercase">Finishing Position:</strong>
                    <p className="text-slate-600 leading-relaxed">{selectedExercise.finishingPosition || "Complete full repetition under eccentric control."}</p>
                  </div>
                </div>

                {onAddExerciseToRoutine && (
                  <button
                    onClick={() => handleAdd(selectedExercise)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    Add This Drill to Today's Routine
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400 space-y-3">
                <Dumbbell className="w-12 h-12 mx-auto text-slate-300 animate-pulse" />
                <h4 className="text-sm font-bold text-slate-600">Select any exercise from the library</h4>
                <p className="text-xs max-w-xs mx-auto">
                  Click on any of the 237 master exercises on the left to inspect its live animated GIF, starting position, and coaching cues.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Showing {filteredExercises.length} of 237 Verified Exercises</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition"
          >
            Done Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
