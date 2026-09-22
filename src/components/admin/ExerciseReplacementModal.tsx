import React, { useState, useMemo } from "react";
import { Search, X, Dumbbell, Sparkles, Check, Filter, ArrowRightLeft, Flame } from "lucide-react";
import { Exercise, getExerciseGifUrl } from "../../data/exercises";
import { ChallengeExerciseItem } from "../../types/challengeEngine";
import UnifiedExerciseMedia from "../UnifiedExerciseMedia";

interface ExerciseReplacementModalProps {
  isOpen: boolean;
  targetExercise: ChallengeExerciseItem | null;
  onClose: () => void;
  onSelectReplacement: (chosenExercise: Exercise | any, keepSetsReps: boolean) => void;
  libraryExercises: Exercise[];
  isLoading?: boolean;
}

const CATEGORY_FILTERS = [
  "All",
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Cardio",
  "Full Body",
  "Gym Workouts",
  "Home Workouts"
];

export default function ExerciseReplacementModal({
  isOpen,
  targetExercise,
  onClose,
  onSelectReplacement,
  libraryExercises,
  isLoading = false
}: ExerciseReplacementModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [keepSetsReps, setKeepSetsReps] = useState(true);
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);

  // Target muscle hint
  const targetMuscles: string[] = useMemo(() => {
    if (!targetExercise) return [];
    if (Array.isArray(targetExercise.muscleGroup)) {
      return targetExercise.muscleGroup.map(m => String(m).toLowerCase());
    }
    return [String(targetExercise.muscleGroup || "").toLowerCase()];
  }, [targetExercise]);

  const targetCategory = targetExercise?.category?.toLowerCase() || "";

  // Smart suggestions: exercises matching same muscles/category
  const smartMatches = useMemo(() => {
    if (!targetExercise) return [];
    return libraryExercises.filter(ex => {
      if (ex.id === targetExercise.id || ex.name === targetExercise.exerciseName) return false;
      const exMuscles = (ex.muscleGroups || []).map(m => m.toLowerCase());
      const exCat = (ex.category || "").toLowerCase();
      const sharesMuscle = targetMuscles.some(tm => exMuscles.some(em => em.includes(tm) || tm.includes(em)));
      const sharesCat = targetCategory && (exCat.includes(targetCategory) || targetCategory.includes(exCat));
      return sharesMuscle || sharesCat;
    }).slice(0, 4);
  }, [targetExercise, libraryExercises, targetMuscles, targetCategory]);

  // Filtered pool
  const filteredExercises = useMemo(() => {
    return libraryExercises.filter(ex => {
      if (targetExercise && (ex.id === targetExercise.id || ex.name === targetExercise.exerciseName)) {
        return false;
      }

      if (selectedCategory !== "All") {
        const cat = (ex.category || "").toLowerCase();
        const cats = (ex.categories || []).map(c => c.toLowerCase());
        const muscles = (ex.muscleGroups || []).map(m => m.toLowerCase());
        const sel = selectedCategory.toLowerCase();
        const matchCat = cat.includes(sel) || cats.some(c => c.includes(sel)) || muscles.some(m => m.includes(sel));
        if (!matchCat) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = ex.name.toLowerCase().includes(q);
        const matchMuscle = (ex.muscleGroups || []).some(m => m.toLowerCase().includes(q));
        const matchEquip = (ex.equipment || []).some(eq => eq.toLowerCase().includes(q));
        const matchCat = (ex.category || "").toLowerCase().includes(q);
        if (!matchName && !matchMuscle && !matchEquip && !matchCat) return false;
      }

      return true;
    });
  }, [libraryExercises, targetExercise, selectedCategory, searchQuery]);

  if (!isOpen || !targetExercise) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div 
        className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl text-neutral-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 bg-neutral-950/60 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  Replace Workout Exercise
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Select a replacement exercise from the library to swap into this workout routine.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1.5 rounded-xl hover:bg-neutral-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Target Card */}
          <div className="mt-4 p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-950/50 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Current Exercise to Replace:</span>
                <h4 className="text-sm font-black text-white">{targetExercise.exerciseName}</h4>
                <p className="text-xs text-neutral-400">
                  {targetExercise.category} • {Array.isArray(targetExercise.muscleGroup) ? targetExercise.muscleGroup.join(", ") : targetExercise.muscleGroup} • {targetExercise.sets} sets x {targetExercise.reps}
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-300 cursor-pointer bg-neutral-800/80 px-3 py-1.5 rounded-xl border border-neutral-700/60 hover:border-neutral-600">
              <input
                type="checkbox"
                checked={keepSetsReps}
                onChange={(e) => setKeepSetsReps(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 accent-red-600 focus:ring-0 cursor-pointer"
              />
              <span>Keep current sets ({targetExercise.sets}) & reps ({targetExercise.reps})</span>
            </label>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 sm:px-6 border-b border-neutral-800 bg-neutral-900/50 space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search exercise by name, muscle (e.g. chest, biceps, triceps), or equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_FILTERS.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Smart Counterparts recommendations */}
          {smartMatches.length > 0 && !searchQuery && (
            <div className="pt-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart Biomechanical Counterparts for {targetExercise.exerciseName}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {smartMatches.map(sm => (
                  <button
                    key={sm.id}
                    type="button"
                    onClick={() => onSelectReplacement(sm, keepSetsReps)}
                    className="p-2 rounded-xl bg-neutral-950/80 border border-amber-500/20 hover:border-amber-500/60 hover:bg-neutral-800/80 text-left transition flex items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                      <UnifiedExerciseMedia
                        exerciseName={sm.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate group-hover:text-amber-300">{sm.name}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{sm.muscleGroups?.[0] || sm.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Exercises Grid List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>Showing {filteredExercises.length} available exercises</span>
            {selectedCategory !== "All" && (
              <span className="font-medium text-red-400">Filter: {selectedCategory}</span>
            )}
          </div>

          {filteredExercises.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 space-y-3">
              <Dumbbell className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-sm font-medium">No exercises match "{searchQuery || selectedCategory}"</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="text-xs text-red-400 hover:underline cursor-pointer"
              >
                Clear search and filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredExercises.map(ex => (
                <div
                  key={ex.id}
                  className="bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-3 flex flex-col justify-between gap-3 group transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                      <UnifiedExerciseMedia
                        exerciseName={ex.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-black text-white truncate group-hover:text-red-400 transition">
                        {ex.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                        {ex.category}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {(ex.muscleGroups || []).slice(0, 2).map(m => (
                          <span key={m} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800">
                            {m}
                          </span>
                        ))}
                        {ex.equipment?.[0] && (
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400">
                            {ex.equipment[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {ex.difficulty || "Intermediate"}
                    </span>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => onSelectReplacement(ex, keepSetsReps)}
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Select Replacement</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs text-neutral-400 shrink-0">
          <span>Click any exercise to swap with <strong>{targetExercise.exerciseName}</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
