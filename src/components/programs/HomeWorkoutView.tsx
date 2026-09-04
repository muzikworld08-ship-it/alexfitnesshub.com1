import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { 
  filterHomeExercises, 
  HOME_PROGRAM_CATEGORIES, 
  HomeCategoryName 
} from "../../data/programsSystem";
import WorkoutVisual from "../WorkoutVisual";
import { 
  Home, 
  Dumbbell, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  Zap
} from "lucide-react";

interface HomeWorkoutViewProps {
  onBackToPrograms?: () => void;
  onOpenExerciseLibrary?: () => void;
}

export default function HomeWorkoutView({ onBackToPrograms, onOpenExerciseLibrary }: HomeWorkoutViewProps) {
  const { exercises } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>("Full Body");
  const [equipmentFilter, setEquipmentFilter] = useState<"All" | "No Equipment" | "Dumbbell" | "Resistance Band">("All");
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  // Filter exercises
  const filteredHomeExercises = useMemo(() => {
    return filterHomeExercises(exercises, selectedCategory, equipmentFilter);
  }, [exercises, selectedCategory, equipmentFilter]);

  const activeExercise = useMemo(() => {
    if (selectedExerciseId) {
      const found = filteredHomeExercises.find(e => e.id === selectedExerciseId);
      if (found) return found;
    }
    return filteredHomeExercises[0];
  }, [filteredHomeExercises, selectedExerciseId]);

  const toggleComplete = (id: string) => {
    setCompletedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div id="home-workout-container" className="min-h-screen bg-neutral-950 text-white pb-24">
      {/* Header Banner */}
      <div className="border-b border-neutral-800 bg-gradient-to-b from-emerald-950/30 via-neutral-950 to-neutral-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
            <button onClick={onBackToPrograms} className="hover:text-emerald-400 transition font-medium">
              All Programs
            </button>
            <span>/</span>
            <span className="text-emerald-400 font-semibold">Home Workout Programs</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center gap-1">
                  <Home className="w-3.5 h-3.5" />
                  Home Friendly
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold bg-neutral-800 text-neutral-300 rounded-full">
                  19 Specialized Tracks
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold bg-neutral-800 text-neutral-300 rounded-full">
                  No Bulky Machines
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                Home Workout Programs
              </h1>
              <p className="text-neutral-400 max-w-3xl text-sm sm:text-base">
                Only displaying movements designed for living rooms and home setups. Filter effortlessly by available equipment: bodyweight only, dumbbells, or resistance bands.
              </p>
            </div>

            {/* Equipment Segmented Controls */}
            <div className="bg-neutral-900 border border-neutral-800 p-2 rounded-xl flex items-center gap-1">
              {(["All", "No Equipment", "Dumbbell", "Resistance Band"] as const).map(eq => (
                <button
                  key={eq}
                  onClick={() => setEquipmentFilter(eq)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    equipmentFilter === eq
                      ? "bg-emerald-500 text-neutral-950"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>

          {/* 19 Home Categories Pills */}
          <div className="mt-6 pt-4 border-t border-neutral-800/80">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              19 Specialized Categories
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {HOME_PROGRAM_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? "bg-emerald-500 text-neutral-950 font-bold"
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

      {/* Main Grid Interface */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{selectedCategory} Home Workouts</span>
            <span className="text-xs text-neutral-400 font-normal">({filteredHomeExercises.length} Exercises)</span>
          </h2>
          {completedIds.length > 0 && (
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {completedIds.length} Exercises Completed Today
            </div>
          )}
        </div>

        {filteredHomeExercises.length === 0 ? (
          <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-2xl text-neutral-400">
            No home exercises found matching the selected filter ({selectedCategory} &bull; {equipmentFilter}). Try switching equipment to "All".
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Exercise List */}
            <div className="lg:col-span-6 space-y-3">
              {filteredHomeExercises.map((ex, idx) => {
                const isSelected = activeExercise?.id === ex.id;
                const isDone = completedIds.includes(ex.id);
                return (
                  <div
                    key={ex.id}
                    onClick={() => setSelectedExerciseId(ex.id)}
                    className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected 
                        ? "border-emerald-400 bg-neutral-900 shadow-md ring-1 ring-emerald-400/30" 
                        : "border-neutral-800 bg-neutral-900/60 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleComplete(ex.id);
                        }}
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition flex-shrink-0 ${
                          isDone 
                            ? "border-emerald-500 bg-emerald-500 text-neutral-950" 
                            : "border-neutral-600 hover:border-emerald-400 bg-neutral-800"
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-400">#{idx + 1}</span>
                          <h4 className={`text-sm font-bold truncate ${isSelected ? "text-emerald-400" : isDone ? "text-neutral-500 line-through" : "text-white"}`}>
                            {ex.name}
                          </h4>
                        </div>
                        <div className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                          <span>{ex.recommendedSets || "3"} Sets</span>
                          <span>&bull;</span>
                          <span>{ex.recommendedReps || "12"} Reps</span>
                          <span>&bull;</span>
                          <span className="text-neutral-500">{ex.equipment.join(", ") || "Bodyweight"}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-neutral-800 text-neutral-300 rounded flex-shrink-0">
                      {ex.difficulty}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Active Exercise Detail Stage */}
            <div className="lg:col-span-6">
              {activeExercise && (
                <div key={activeExercise.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6 sticky top-24">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-xs font-semibold rounded">
                          {activeExercise.difficulty}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded">
                          {activeExercise.equipment.join(", ") || "Bodyweight"}
                        </span>
                        <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-xs font-semibold rounded">
                          {activeExercise.muscleGroups[0]}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {activeExercise.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => toggleComplete(activeExercise.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
                        completedIds.includes(activeExercise.id)
                          ? "bg-emerald-500 text-neutral-950"
                          : "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {completedIds.includes(activeExercise.id) ? "Done" : "Mark Done"}
                    </button>
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
                      Step-by-Step Technique
                    </h4>
                    {activeExercise.instructions && activeExercise.instructions.length > 0 ? (
                      activeExercise.instructions.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2.5 bg-neutral-950/60 p-2.5 rounded-lg text-xs text-neutral-300">
                          <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0">
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
        )}
      </div>
    </div>
  );
}
