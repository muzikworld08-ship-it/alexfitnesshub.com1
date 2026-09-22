import React, { useState, useMemo } from "react";
import { Plus, Search, X, Dumbbell, Check, Filter, Sparkles, Layers } from "lucide-react";
import { Exercise, getExerciseGifUrl } from "../../data/exercises";
import { ChallengeExerciseItem } from "../../types/challengeEngine";
import UnifiedExerciseMedia from "../UnifiedExerciseMedia";

interface AddWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExercise: (newExercise: ChallengeExerciseItem) => void;
  libraryExercises: Exercise[];
  programId: string;
  dayNumber: number;
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

export default function AddWorkoutModal({
  isOpen,
  onClose,
  onAddExercise,
  libraryExercises,
  programId,
  dayNumber
}: AddWorkoutModalProps) {
  const [activeTab, setActiveTab] = useState<"library" | "custom">("library");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Custom Form State
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState("Strength");
  const [customMuscleGroup, setCustomMuscleGroup] = useState("");
  const [customEquipment, setCustomEquipment] = useState("Dumbbells");
  const [customDifficulty, setCustomDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [customSets, setCustomSets] = useState("3");
  const [customReps, setCustomReps] = useState("10-12 reps");
  const [customDuration, setCustomDuration] = useState("45s set");
  const [customInstructions, setCustomInstructions] = useState("");
  const [customGifUrl, setCustomGifUrl] = useState("");

  const filteredExercises = useMemo(() => {
    return libraryExercises.filter(ex => {
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
  }, [libraryExercises, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const handleSelectFromLibrary = (ex: Exercise) => {
    const newEx: ChallengeExerciseItem = {
      id: `ex_${programId}_d${dayNumber}_${Date.now()}`,
      programId: programId as any,
      programName: programId,
      dayNumber: Number(dayNumber),
      category: ex.category || "General Strength",
      muscleGroup: ex.muscleGroups || ["Full Body"],
      exerciseName: ex.name,
      equipment: Array.isArray(ex.equipment) ? ex.equipment.join(", ") : String(ex.equipment || "Bodyweight"),
      difficulty: ex.difficulty || "Intermediate",
      sets: 3,
      reps: "10-12 reps",
      duration: "45s set",
      instructions: ex.instructions && ex.instructions.length > 0 
        ? ex.instructions 
        : ["Execute controlled biomechanics through full active range of motion."],
      restTime: "45s",
      gifUrl: ex.gifUrl || getExerciseGifUrl(ex.name, ex.category),
      coachingCues: ex.movementExecution ? [ex.movementExecution] : ["Maintain rigid core stability and steady breathing."]
    };
    onAddExercise(newEx);
    onClose();
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const muscles = customMuscleGroup
      .split(",")
      .map(m => m.trim())
      .filter(Boolean);

    const newEx: ChallengeExerciseItem = {
      id: `custom_${programId}_d${dayNumber}_${Date.now()}`,
      programId: programId as any,
      programName: programId,
      dayNumber: Number(dayNumber),
      category: customCategory || "Custom Workout",
      muscleGroup: muscles.length > 0 ? muscles : ["Full Body"],
      exerciseName: customName.trim(),
      equipment: customEquipment,
      difficulty: customDifficulty,
      sets: parseInt(customSets) || 3,
      reps: customReps.trim() || "10-12 reps",
      duration: customDuration.trim() || "45s set",
      instructions: customInstructions.trim() 
        ? [customInstructions.trim()] 
        : ["Execute controlled movement with strict posture and tempo."],
      restTime: "45s",
      gifUrl: customGifUrl.trim() || getExerciseGifUrl(customName.trim(), customCategory),
      coachingCues: ["Maintain core tension and controlled eccentric phase."]
    };

    onAddExercise(newEx);
    onClose();
  };

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
              <div className="w-10 h-10 rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  Add Workout Exercise
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Append a workout to Day {dayNumber} of {programId}. You can drag and drop it into any position.
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

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => setActiveTab("library")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                activeTab === "library"
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Browse Exercise Library ({libraryExercises.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                activeTab === "custom"
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Custom Workout Drill</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Library Browser */}
        {activeTab === "library" && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Filters */}
            <div className="p-4 sm:px-6 border-b border-neutral-800 bg-neutral-900/50 space-y-3 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search exercise by name, muscle (e.g. chest, lats, biceps, quads), or equipment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition"
                />
              </div>

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
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5">
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
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {ex.equipment?.[0] || "Standard"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSelectFromLibrary(ex)}
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Workout</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Create Custom Workout */}
        {activeTab === "custom" && (
          <form onSubmit={handleCreateCustom} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-300 mb-1 block">Exercise Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Incline Dumbbell Squeeze Press"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 mb-1 block">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Chest and Triceps"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 mb-1 block">Target Muscles (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Upper Chest, Triceps, Anterior Deltoids"
                  value={customMuscleGroup}
                  onChange={(e) => setCustomMuscleGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 mb-1 block">Equipment</label>
                <input
                  type="text"
                  placeholder="e.g. Dumbbells, Adjustable Bench"
                  value={customEquipment}
                  onChange={(e) => setCustomEquipment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 mb-1 block">Sets</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={customSets}
                  onChange={(e) => setCustomSets(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 mb-1 block">Reps / Scheme</label>
                <input
                  type="text"
                  placeholder="e.g. 10-12 reps or 45s continuous"
                  value={customReps}
                  onChange={(e) => setCustomReps(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 mb-1 block">Instructions / Coaching Cue</label>
              <textarea
                rows={2}
                placeholder="Key coaching execution cues, tempo, breathing..."
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 mb-1 block">GIF / Video URL (Optional)</label>
              <input
                type="url"
                placeholder="https://... (or leave blank to auto-match)"
                value={customGifUrl}
                onChange={(e) => setCustomGifUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="pt-3 border-t border-neutral-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Workout to Routine</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
