import React, { useState, useMemo } from "react";
import { Plus, Search, X, Dumbbell, Check, Filter, Sparkles, Layers, AlertCircle, Heart } from "lucide-react";
import { Exercise, getExerciseGifUrl } from "../../data/exercises";
import { ChallengeExerciseItem } from "../../types/challengeEngine";
import { isHomeEligibleExercise } from "../../utils/dynamicWorkoutEngine";
import { isWomenWorkoutEligibleExercise, STRONG_MEN_EXERCISE_BLOCKLIST, isExplicitlyMarkedWomenWorkout } from "../../data/womenConfidenceProgramData";
import UnifiedExerciseMedia from "../UnifiedExerciseMedia";

interface AddWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExercise: (newExercise: ChallengeExerciseItem, targetTier?: "Beginner" | "Intermediate" | "Advanced" | "All") => void;
  libraryExercises: Exercise[];
  programId: string;
  dayNumber: number;
  currentExercises?: ChallengeExerciseItem[];
  targetDifficulty?: "Beginner" | "Intermediate" | "Advanced" | "All";
}

const CATEGORY_FILTERS = [
  "All",
  "Chest",
  "Back",
  "Biceps",
  "Triceps",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Cardio",
  "Full Body",
  "Gym Workouts",
  "Home Workouts"
];

const WOMEN_CATEGORY_FILTERS = [
  "All",
  "Glutes",
  "Core",
  "Shoulders",
  "Arms",
  "Legs",
  "Back",
  "Cardio",
  "Full Body"
];

export default function AddWorkoutModal({
  isOpen,
  onClose,
  onAddExercise,
  libraryExercises,
  programId,
  dayNumber,
  currentExercises = [],
  targetDifficulty = "All"
}: AddWorkoutModalProps) {
  const [activeTab, setActiveTab] = useState<"library" | "custom">("library");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTier, setActiveTier] = useState<"Beginner" | "Intermediate" | "Advanced" | "All">(
    targetDifficulty || "All"
  );
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");

  const isHomeProgram = useMemo(() => {
    return (programId || "").toLowerCase().includes("home");
  }, [programId]);

  const isWomenProgram = useMemo(() => {
    const pid = (programId || "").toLowerCase();
    return pid.includes("women") || pid.includes("female");
  }, [programId]);

  // Sync activeTier if targetDifficulty changes
  React.useEffect(() => {
    if (targetDifficulty) {
      setActiveTier(targetDifficulty);
      if (targetDifficulty !== "All") {
        setCustomDifficulty(targetDifficulty);
      }
    }
  }, [targetDifficulty, isOpen]);

  // Custom Form State
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState(isWomenProgram ? "Glute & Lower Body Shaping" : "Strength");
  const [customMuscleGroup, setCustomMuscleGroup] = useState(isWomenProgram ? "Glutes, Hamstrings" : "");
  const [customEquipment, setCustomEquipment] = useState(isWomenProgram ? "Bodyweight / Dumbbells" : "Dumbbells");
  const [customDifficulty, setCustomDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">(
    targetDifficulty && targetDifficulty !== "All" ? targetDifficulty : "Intermediate"
  );
  const [customSets, setCustomSets] = useState("3");
  const [customReps, setCustomReps] = useState("10-12 reps");
  const [customDuration, setCustomDuration] = useState("45s set");
  const [customInstructions, setCustomInstructions] = useState("");
  const [customGifUrl, setCustomGifUrl] = useState("");
  const [targetAudience, setTargetAudience] = useState<"Women" | "Unisex" | "Men">(
    isWomenProgram ? "Women" : "Unisex"
  );

  const filteredExercises = useMemo(() => {
    const seen = new Set<string>();
    return libraryExercises.filter(ex => {
      const cleanName = ex.name.toLowerCase().trim();
      if (seen.has(cleanName) || seen.has(ex.id)) return false;
      seen.add(cleanName);
      seen.add(ex.id);

      // When adding to a home program, strictly enforce home eligibility (no barbell, dumbbell, gym equipment)
      if (isHomeProgram && !isHomeEligibleExercise(ex)) {
        return false;
      }

      // When adding to Women Confidence Program, strictly exclude heavy male bodybuilding exercises (cable fly, heavy bench, etc.)
      if (isWomenProgram && !isWomenWorkoutEligibleExercise(ex)) {
        return false;
      }

      // If NOT in Women Confidence Program, STRICTLY exclude any workout assigned as female / women
      if (!isWomenProgram && isExplicitlyMarkedWomenWorkout(ex)) {
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

      if (difficultyFilter !== "All") {
        const diff = (ex.difficulty || "").toLowerCase();
        if (!diff.includes(difficultyFilter.toLowerCase())) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = ex.name.toLowerCase().includes(q);
        const matchMuscle = (ex.muscleGroups || []).some(m => m.toLowerCase().includes(q));
        const matchEquip = (ex.equipment || []).some(eq => eq.toLowerCase().includes(q));
        const matchCat = (ex.category || "").toLowerCase().includes(q);
        const matchDiff = (ex.difficulty || "").toLowerCase().includes(q);
        if (!matchName && !matchMuscle && !matchEquip && !matchCat && !matchDiff) return false;
      }

      return true;
    });
  }, [libraryExercises, selectedCategory, difficultyFilter, searchQuery, isHomeProgram, isWomenProgram]);

  if (!isOpen) return null;

  const handleSelectFromLibrary = (ex: Exercise) => {
    const cleanName = ex.name.toLowerCase().trim();
    if (currentExercises && currentExercises.some(ce => (ce.exerciseName || (ce as any).name || "").toLowerCase().trim() === cleanName)) {
      alert(`Workout already exists!\n\n"${ex.name}" is already included in Day ${dayNumber} of this workout routine.`);
      return;
    }

    const assignedDifficulty = activeTier && activeTier !== "All"
      ? activeTier
      : (ex.difficulty || "Intermediate");

    const defaultSets = assignedDifficulty === "Beginner" ? 3 : (assignedDifficulty === "Advanced" ? 4 : 3);
    const defaultReps = assignedDifficulty === "Beginner" ? "10-12 reps" : (assignedDifficulty === "Advanced" ? "6-8 heavy reps" : "8-10 reps");
    const defaultRest = assignedDifficulty === "Beginner" ? "60s" : (assignedDifficulty === "Advanced" ? "90s" : "45s");

    const newEx: ChallengeExerciseItem = {
      id: `ex_${programId}_d${dayNumber}_${Date.now()}`,
      programId: programId as any,
      programName: programId,
      dayNumber: Number(dayNumber),
      category: ex.category || (isWomenProgram ? "Women Sculpt" : "General Strength"),
      muscleGroup: ex.muscleGroups || ["Full Body"],
      exerciseName: ex.name,
      equipment: Array.isArray(ex.equipment) ? ex.equipment : (ex.equipment ? [String(ex.equipment)] : ["Bodyweight"]),
      difficulty: assignedDifficulty,
      sets: defaultSets,
      reps: defaultReps,
      duration: "45s set",
      instructions: ex.instructions && ex.instructions.length > 0 
        ? ex.instructions 
        : ["Execute controlled biomechanics through full active range of motion."],
      restTime: defaultRest,
      gifUrl: ex.gifUrl || getExerciseGifUrl(ex.name, ex.category),
      coachingCues: ex.movementExecution ? [ex.movementExecution] : ["Maintain rigid core stability and steady breathing."],
      genderSuitability: isWomenProgram || ex.genderSuitability === "Women" ? "Women" : (ex.genderSuitability || "Unisex"),
      womenCategories: isWomenProgram ? (ex.womenCategories?.length ? ex.womenCategories : ["Full Body Tone"]) : ex.womenCategories
    };
    onAddExercise(newEx, activeTier);
    onClose();
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCustom = customName.trim();
    if (!cleanCustom) return;

    // Check if duplicate in this day's workout
    const cleanLower = cleanCustom.toLowerCase();
    if (currentExercises && currentExercises.some(ce => (ce.exerciseName || (ce as any).name || "").toLowerCase().trim() === cleanLower)) {
      alert(`Workout already exists!\n\nA workout named "${cleanCustom}" is already included in Day ${dayNumber} of this routine.`);
      return;
    }

    // Check if already in library
    const existingLib = libraryExercises.find(le => le.name.toLowerCase().trim() === cleanLower);
    if (existingLib) {
      alert(`Workout already exists!\n\nA workout named "${existingLib.name}" already exists in the exercise library. Please choose a unique name or select it from the Library tab.`);
      return;
    }

    // Ensure workouts assigned as female only appear in Women Confidence
    if (!isWomenProgram && targetAudience === "Women") {
      alert("A workout assigned as female can only be added to the Women Confidence Program. Please select Unisex or Men for this program.");
      return;
    }

    const muscles = customMuscleGroup
      .split(",")
      .map(m => m.trim())
      .filter(Boolean);

    // If adding to a Home Workout program, strictly forbid barbell, dumbbell, or gym equipment
    if (isHomeProgram) {
      const probeEx: Exercise = {
        id: "temp",
        name: customName.trim(),
        muscleGroups: muscles,
        difficulty: customDifficulty,
        instructions: [customInstructions],
        equipment: [customEquipment],
        category: customCategory,
        categories: [customCategory],
        commonMistakes: [],
        safetyTips: [],
        alternativeExercises: [],
        progressionVariations: [],
        isPremium: false,
        startingPosition: "",
        movementExecution: "",
        finishingPosition: "",
        regressionVariations: [],
        musclesWorked: muscles,
        gifUrl: customGifUrl
      };
      if (!isHomeEligibleExercise(probeEx)) {
        alert("Cannot add to 180 Home Workout Program: Exercises with barbells, dumbbells, or gym machines are not permitted. Please use Bodyweight, Mat, or Zero Equipment.");
        return;
      }
    }

    // If adding to Women Confidence Program, strictly forbid strong men / cable fly exercises
    if (isWomenProgram || targetAudience === "Women") {
      const probeLower = `${customName} ${customCategory} ${customInstructions}`.toLowerCase();
      for (const blocked of STRONG_MEN_EXERCISE_BLOCKLIST) {
        if (probeLower.includes(blocked)) {
          alert(`Cannot add to Women Confidence Program:\n\nMovement '${blocked}' is identified as a heavy bodybuilding / male-focused exercise (such as cable fly, heavy bench, etc.) and is not permitted in Women's Confidence.\n\nPlease prescribe a feminine sculpting, posture, or glute activation movement instead.`);
          return;
        }
      }
    }

    const newEx: ChallengeExerciseItem = {
      id: `custom_${programId}_d${dayNumber}_${Date.now()}`,
      programId: programId as any,
      programName: programId,
      dayNumber: Number(dayNumber),
      category: customCategory || (isWomenProgram ? "Women Sculpt" : "Custom Workout"),
      muscleGroup: muscles.length > 0 ? muscles : (isWomenProgram ? ["Glutes", "Core"] : ["Full Body"]),
      exerciseName: customName.trim(),
      equipment: [customEquipment],
      difficulty: activeTier !== "All" ? activeTier : customDifficulty,
      sets: parseInt(customSets) || 3,
      reps: customReps.trim() || "10-12 reps",
      duration: customDuration.trim() || "45s set",
      instructions: customInstructions.trim() 
        ? [customInstructions.trim()] 
        : ["Execute controlled movement with strict posture and tempo."],
      restTime: activeTier === "Beginner" ? "60s" : (activeTier === "Advanced" ? "90s" : "45s"),
      gifUrl: customGifUrl.trim() || getExerciseGifUrl(customName.trim(), customCategory),
      coachingCues: ["Maintain core tension and controlled eccentric phase."],
      genderSuitability: isWomenProgram || targetAudience === "Women" ? "Women" : targetAudience,
      womenCategories: (isWomenProgram || targetAudience === "Women") ? [customCategory] : undefined
    };

    onAddExercise(newEx, activeTier);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div 
        className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl text-neutral-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={`p-5 sm:p-6 border-b ${isWomenProgram ? "border-rose-950/60 bg-gradient-to-r from-neutral-950 via-rose-950/20 to-neutral-950" : "border-neutral-800 bg-neutral-950/60"} shrink-0`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                isWomenProgram 
                  ? "bg-rose-500/15 border border-rose-500/30 text-rose-400" 
                  : "bg-red-600/10 border border-red-500/30 text-red-500"
              }`}>
                {isWomenProgram ? <Heart className="w-5 h-5 fill-rose-500/20" /> : <Plus className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-black text-white tracking-tight">
                    {isWomenProgram ? "Add Workout for Women" : "Add Workout Exercise"}
                  </h3>
                  {isWomenProgram && (
                    <span className="bg-rose-500/20 text-rose-300 text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-rose-500/30">
                      Women Confidence (180 Days)
                    </span>
                  )}
                  <span className={`text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    activeTier === "Beginner"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : activeTier === "Advanced"
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                      : activeTier === "Intermediate"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      : "bg-neutral-800 text-neutral-300 border-neutral-700"
                  }`}>
                    Adding to: {activeTier === "All" ? "All Levels (Baseline)" : `${activeTier} Category`}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {isWomenProgram 
                    ? `Assign a movement to Day ${dayNumber} (No heavy strongman/powerlifting movements).`
                    : `Append a workout drill to Day ${dayNumber} of ${programId}. Select category/tier to manage exercises separately.`}
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

          {/* Dedicated Category / Tier Selector Bar */}
          <div className="mt-4 p-2.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-300">
              <Layers className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Target Category:</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setActiveTier("All");
                  setCustomDifficulty("Intermediate");
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTier === "All"
                    ? "bg-neutral-800 text-white border border-neutral-600 shadow-xs"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                <span>🌐 All Levels</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTier("Beginner");
                  setCustomDifficulty("Beginner");
                  setCustomSets("3");
                  setCustomReps("10-12 reps");
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTier === "Beginner"
                    ? "bg-emerald-950 text-emerald-200 border border-emerald-500 shadow-md shadow-emerald-950/40"
                    : "bg-neutral-900 text-neutral-400 hover:text-emerald-300 border border-neutral-800"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Beginner</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTier("Intermediate");
                  setCustomDifficulty("Intermediate");
                  setCustomSets("3");
                  setCustomReps("8-10 reps");
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTier === "Intermediate"
                    ? "bg-amber-950 text-amber-200 border border-amber-500 shadow-md shadow-amber-950/40"
                    : "bg-neutral-900 text-neutral-400 hover:text-amber-300 border border-neutral-800"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Intermediate</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTier("Advanced");
                  setCustomDifficulty("Advanced");
                  setCustomSets("4");
                  setCustomReps("6-8 heavy reps");
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTier === "Advanced"
                    ? "bg-rose-950 text-rose-200 border border-rose-500 shadow-md shadow-rose-950/40"
                    : "bg-neutral-900 text-neutral-400 hover:text-rose-300 border border-neutral-800"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>Advanced</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => setActiveTab("library")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                activeTab === "library"
                  ? isWomenProgram ? "bg-rose-600 text-white shadow-xs" : "bg-red-600 text-white shadow-xs"
                  : "bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Browse {isWomenProgram ? "Women's" : "Exercise"} Library ({filteredExercises.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                activeTab === "custom"
                  ? isWomenProgram ? "bg-rose-600 text-white shadow-xs" : "bg-red-600 text-white shadow-xs"
                  : "bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isWomenProgram ? "Create Custom Women Workout" : "Create Custom Workout Drill"}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Library Browser */}
        {activeTab === "library" && (
          <div className="flex-1 flex flex-col min-h-0">
            {isWomenProgram && (
              <div className="bg-rose-950/30 border-b border-rose-900/40 px-5 py-2.5 flex items-center gap-2 text-xs text-rose-300">
                <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  <strong>Curated Filter:</strong> Heavy chest bodybuilding exercises (like cable fly, heavy bench press) are excluded. Showing toning, posture & mobility drills.
                </span>
              </div>
            )}

            {/* Filters */}
            <div className="p-4 sm:px-6 border-b border-neutral-800 bg-neutral-900/50 space-y-2.5 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder={isWomenProgram ? "Search women exercises by name, glutes, core, posture, hips..." : "Search exercise by name, muscle, or equipment..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition"
                />
              </div>

              {/* Difficulty Tier Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-neutral-500" />
                  Level:
                </span>
                {["All", "Beginner", "Intermediate", "Advanced"].map(diff => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficultyFilter(diff)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                      difficultyFilter === diff
                        ? diff === "Beginner"
                          ? "bg-emerald-950 text-emerald-200 border border-emerald-500"
                          : diff === "Advanced"
                          ? "bg-rose-950 text-rose-200 border border-rose-500"
                          : diff === "Intermediate"
                          ? "bg-amber-950 text-amber-200 border border-amber-500"
                          : "bg-red-600 text-white shadow-xs"
                        : "bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                    }`}
                  >
                    {diff === "All" ? "All Levels" : diff}
                  </button>
                ))}
              </div>

              {/* Category / Muscle Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  Muscle:
                </span>
                {(isWomenProgram ? WOMEN_CATEGORY_FILTERS : CATEGORY_FILTERS).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                      selectedCategory === cat
                        ? isWomenProgram ? "bg-rose-600 text-white shadow-xs" : "bg-red-600 text-white shadow-xs"
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
                {filteredExercises.map(ex => {
                  return (
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
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-black text-white truncate group-hover:text-red-400 transition">
                              {ex.name}
                            </h4>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-[11px] text-neutral-400 truncate">
                              {ex.category}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {ex.difficulty && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                ex.difficulty.toLowerCase().includes("beg")
                                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                                  : ex.difficulty.toLowerCase().includes("adv")
                                  ? "bg-rose-950/80 text-rose-300 border-rose-500/40"
                                  : "bg-amber-950/80 text-amber-300 border-amber-500/40"
                              }`}>
                                {ex.difficulty}
                              </span>
                            )}
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
                        {(() => {
                          const isAlreadyAdded = currentExercises && currentExercises.some(
                            ce => (ce.exerciseName || (ce as any).name || "").toLowerCase().trim() === ex.name.toLowerCase().trim()
                          );
                          if (isAlreadyAdded) {
                            return (
                              <button
                                type="button"
                                onClick={() => alert(`Workout already exists!\n\n"${ex.name}" is already included in Day ${dayNumber} of this workout routine.`)}
                                className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-400 text-xs font-bold flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
                                title="This workout is already in this routine"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Already in {activeTier !== "All" ? activeTier : "Workout"}</span>
                              </button>
                            );
                          }
                          return (
                            <button
                              type="button"
                              onClick={() => handleSelectFromLibrary(ex)}
                              className={`px-3 py-1.5 rounded-xl ${
                                isWomenProgram 
                                  ? "bg-rose-600 hover:bg-rose-500" 
                                  : activeTier === "Beginner"
                                  ? "bg-emerald-600 hover:bg-emerald-500"
                                  : activeTier === "Advanced"
                                  ? "bg-rose-600 hover:bg-rose-500"
                                  : "bg-red-600 hover:bg-red-500"
                              } text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs`}
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Add to {activeTier !== "All" ? activeTier : "Workout"}</span>
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Create Custom Workout */}
        {activeTab === "custom" && (
          <form onSubmit={handleCreateCustom} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
            {/* Category / Difficulty Tier Presets */}
            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <label className="text-xs font-bold text-neutral-300 block">
                  Difficulty Category & Prescribed Volume
                </label>
                <span className="text-[11px] text-neutral-400 font-mono">
                  Currently targeted for: <strong className="text-white">{activeTier}</strong>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCustomDifficulty("Beginner");
                    setCustomSets("3");
                    setCustomReps("10-12 reps");
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                    customDifficulty === "Beginner"
                      ? "bg-emerald-950 text-emerald-200 border-emerald-500 shadow-xs"
                      : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Beginner (3×10-12)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomDifficulty("Intermediate");
                    setCustomSets("3");
                    setCustomReps("8-10 reps");
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                    customDifficulty === "Intermediate"
                      ? "bg-amber-950 text-amber-200 border-amber-500 shadow-xs"
                      : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Intermediate (3-4×8-10)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomDifficulty("Advanced");
                    setCustomSets("4");
                    setCustomReps("6-8 heavy reps");
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                    customDifficulty === "Advanced"
                      ? "bg-rose-950 text-rose-200 border-rose-500 shadow-xs"
                      : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>Advanced (4×6-8)</span>
                </button>
              </div>
            </div>

            {/* Target Audience Selector */}
            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
              <label className="text-xs font-bold text-neutral-300 block">
                Target Audience & Program Alignment
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetAudience("Unisex")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                    targetAudience === "Unisex"
                      ? "bg-neutral-800 text-white border-neutral-700 shadow-xs"
                      : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>👥 Unisex / All</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetAudience("Men")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                    targetAudience === "Men"
                      ? "bg-amber-600 text-white border-amber-500 shadow-xs"
                      : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>⚡ Men / Heavy</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetAudience("Women");
                    if (!customCategory || customCategory === "Strength") {
                      setCustomCategory("Glute & Lower Body Shaping");
                      setCustomMuscleGroup("Glutes, Hamstrings");
                    }
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                    targetAudience === "Women"
                      ? "bg-rose-600 text-white border-rose-500 shadow-xs"
                      : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>🌸 Women</span>
                </button>
              </div>

              {/* Blocklist Real-Time Warning */}
              {(() => {
                const probe = `${customName} ${customCategory} ${customInstructions}`.toLowerCase();
                const matched = STRONG_MEN_EXERCISE_BLOCKLIST.find(b => probe.includes(b));
                if (matched && (targetAudience === "Women" || isWomenProgram)) {
                  return (
                    <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-300 text-xs flex items-center gap-2 mt-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        <strong>Restricted Male Movement:</strong> '{matched}' is detected. Women Confidence strictly avoids heavy bodybuilding presses and cable flyes.
                      </span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-300 mb-1 block">Exercise Name *</label>
                <input
                  type="text"
                  required
                  placeholder={isWomenProgram || targetAudience === "Women" ? "e.g. Banded Hip Thrust with 2s Glute Pause" : "e.g. Incline Dumbbell Squeeze Press"}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 mb-1 block">Category / Focus</label>
                <input
                  type="text"
                  placeholder={isWomenProgram || targetAudience === "Women" ? "e.g. Glute & Lower Body Shaping" : "e.g. Biceps, Triceps, Chest, Back"}
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
                />
                
                {/* Fast Category Presets */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {(isWomenProgram || targetAudience === "Women" ? [
                    { label: "Glute Sculpt", cat: "Glute & Lower Body Shaping", muscles: "Glutes, Hamstrings" },
                    { label: "Posture Back", cat: "Upper Body Posture & Sculpt", muscles: "Upper Back, Scapulars, Shoulders" },
                    { label: "Core & Waist", cat: "Core & Waist Compression", muscles: "Transverse Abdominis, Obliques" },
                    { label: "Full Body", cat: "Full Body Tone", muscles: "Full Body, Glutes, Core" },
                    { label: "Hip Mobility", cat: "Restorative Mobility", muscles: "Hips, Pelvic Floor, Spine" },
                    { label: "Zone 2 Steps", cat: "Cardio & Walking", muscles: "Cardiovascular, Legs" }
                  ] : [
                    { label: "Chest", cat: "Chest", muscles: "Chest" },
                    { label: "Back", cat: "Back", muscles: "Back, Lats" },
                    { label: "Biceps", cat: "Biceps", muscles: "Biceps" },
                    { label: "Triceps", cat: "Triceps", muscles: "Triceps" },
                    { label: "Legs", cat: "Legs", muscles: "Quads, Hamstrings" },
                    { label: "Shoulders", cat: "Shoulders", muscles: "Deltoids" },
                    { label: "Core", cat: "Core", muscles: "Abs, Core" }
                  ]).map(preset => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setCustomCategory(preset.cat);
                        setCustomMuscleGroup(preset.muscles);
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                        customCategory === preset.cat
                          ? isWomenProgram || targetAudience === "Women" ? "bg-rose-600 text-white border-rose-600" : "bg-red-600 text-white border-red-600"
                          : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 mb-1 block">Target Muscles (comma separated)</label>
                <input
                  type="text"
                  placeholder={isWomenProgram || targetAudience === "Women" ? "e.g. Gluteus Maximus, Glute Medius, Upper Hamstrings" : "e.g. Upper Chest, Triceps, Anterior Deltoids"}
                  value={customMuscleGroup}
                  onChange={(e) => setCustomMuscleGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 mb-1 block">Equipment</label>
                <input
                  type="text"
                  placeholder={isWomenProgram || targetAudience === "Women" ? "e.g. Resistance Band, Dumbbells, Bench" : "e.g. Dumbbells, Adjustable Bench"}
                  value={customEquipment}
                  onChange={(e) => setCustomEquipment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 mb-1 block">Reps / Scheme</label>
                <input
                  type="text"
                  placeholder="e.g. 12-15 reps (glute focus) or 45s continuous"
                  value={customReps}
                  onChange={(e) => setCustomReps(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
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
