import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { Exercise } from "../../data/exercises";
import UnifiedExerciseMedia from "../UnifiedExerciseMedia";
import { 
  Plus, Edit3, Trash2, Search, Filter, Check, X, Dumbbell, 
  Sparkles, Image as ImageIcon, Save, RefreshCw, AlertCircle, 
  CheckCircle2, Layers, Flame, ArrowUpDown, ChevronRight, Eye,
  LayoutGrid, Table as TableIcon, CheckSquare, ShieldCheck, Video,
  SlidersHorizontal, Upload, ExternalLink, RotateCcw
} from "lucide-react";
import { uploadMediaToCloud, saveExerciseMediaToDatabase } from "../../utils/mediaStorageService";
import { AssetManifestService } from "../../services/AssetManifestService";

const CATEGORIES = [
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
  "Home Workouts",
  "Mobility & Recovery",
  "Functional & Calisthenics"
];

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

const MUSCLE_OPTIONS = [
  "Chest", "Back", "Biceps", "Triceps", "Shoulders", "Quads", "Hamstrings", "Glutes", "Abs/Core", "Calves", "Full Body"
];

const EQUIPMENT_OPTIONS = [
  "Dumbbells", "Barbell", "Cable", "Machine", "Resistance Bands", "Bodyweight", "Kettlebell", "Pull-up Bar", "None"
];

const GOAL_OPTIONS = [
  "Build Muscle", "Lose Weight", "Build Abs", "Build Glutes", "Get Stronger", "Improve Fitness", "Beginner Fitness", "Home Fitness"
];

const WOMEN_CATEGORY_OPTIONS = [
  "Full Body Tone", "Glute & Lower Body Shaping", "Upper Body Sculpt", "Core & Waist Slimming", "Walking & Running"
];

const PROGRAM_OPTIONS = [
  "90 Days Immortal Challenge",
  "Gym Workout Programs",
  "Women’s Workout Programs",
  "Home Workout Programs",
  "Goal Based Programs",
  "Workout Library"
];

export default function AdminWorkoutEditor() {
  const { exercises, editExercise, addWorkout, deleteWorkout, uploadExerciseMedia } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [premiumFilter, setPremiumFilter] = useState<"All" | "Premium" | "Free">("All");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [sortBy, setSortBy] = useState<"name" | "category" | "difficulty" | "customMedia">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWorkout, setNewWorkout] = useState<Partial<Exercise>>({
    name: "",
    recommendedSets: "3-4",
    recommendedReps: "10-12",
    durationMinutes: 10,
    category: "Gym Workouts",
    difficulty: "Intermediate",
    muscleGroups: ["Chest"],
    equipment: ["Dumbbells"],
    locationSuitability: "Gym",
    goals: ["Build Muscle"],
    womenCategories: [],
    programAssignments: ["Gym Workout Programs"],
    isPremium: true,
    customMediaUrl: "",
    customMediaType: "image",
    instructions: [
      "Set up proper starting posture and brace core.",
      "Perform deliberate eccentric movement under control.",
      "Drive contraction to peak and pause for 1 second."
    ],
    safetyTips: ["Maintain neutral spine and controlled breathing."]
  });
  const [newMediaInput, setNewMediaInput] = useState("");
  const [isSavingNew, setIsSavingNew] = useState(false);

  // Edit Modal State
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editForm, setEditForm] = useState<Partial<Exercise>>({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState("");

  // Inline Quick Edit state
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [quickSets, setQuickSets] = useState("");
  const [quickReps, setQuickReps] = useState("");
  const [quickName, setQuickName] = useState("");
  const [isSavingQuick, setIsSavingQuick] = useState(false);

  // Filtered and Sorted Exercises
  const filteredExercises = useMemo(() => {
    const list = exercises.filter((ex) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        ex.name.toLowerCase().includes(q) ||
        ex.id.toLowerCase().includes(q) ||
        ex.category.toLowerCase().includes(q) ||
        ex.muscleGroups?.some(m => m.toLowerCase().includes(q));

      const matchesCat = selectedCategory === "All" || 
        ex.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        ex.categories?.some(c => c.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        ex.muscleGroups?.some(m => m.toLowerCase().includes(selectedCategory.toLowerCase()));

      const matchesDiff = selectedDifficulty === "All" || ex.difficulty === selectedDifficulty;

      const matchesPrem = 
        premiumFilter === "All" ||
        (premiumFilter === "Premium" && ex.isPremium) ||
        (premiumFilter === "Free" && !ex.isPremium);

      return matchesSearch && matchesCat && matchesDiff && matchesPrem;
    });

    return list.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "category") {
        comparison = a.category.localeCompare(b.category);
      } else if (sortBy === "difficulty") {
        comparison = (a.difficulty || "").localeCompare(b.difficulty || "");
      } else if (sortBy === "customMedia") {
        const aHasMedia = a.customMediaUrl ? 1 : 0;
        const bHasMedia = b.customMediaUrl ? 1 : 0;
        comparison = bHasMedia - aHasMedia;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [exercises, searchQuery, selectedCategory, selectedDifficulty, premiumFilter, sortBy, sortOrder]);

  // Open Edit Modal
  const handleOpenEdit = (ex: Exercise) => {
    setEditingExercise(ex);
    setEditForm({
      name: ex.name,
      recommendedSets: ex.recommendedSets || "3-4",
      recommendedReps: ex.recommendedReps || "10-12",
      durationMinutes: ex.durationMinutes || 10,
      category: ex.category,
      difficulty: ex.difficulty || "Intermediate",
      muscleGroups: ex.muscleGroups && ex.muscleGroups.length > 0 ? ex.muscleGroups : [ex.category],
      equipment: ex.equipment && ex.equipment.length > 0 ? ex.equipment : ["Dumbbells"],
      locationSuitability: ex.locationSuitability || (ex.equipment?.includes("Bodyweight") ? "Home" : "Gym"),
      goals: ex.goals && ex.goals.length > 0 ? ex.goals : ["Build Muscle"],
      womenCategories: ex.womenCategories || [],
      programAssignments: ex.programAssignments || ["Gym Workout Programs"],
      isPremium: ex.isPremium !== undefined ? ex.isPremium : true,
      customMediaUrl: ex.customMediaUrl || ex.gifUrl || ex.imageUrl || "",
      customMediaType: ex.customMediaType || "image",
      instructions: ex.instructions && ex.instructions.length > 0 ? ex.instructions : ["Perform movement with strict technique."],
      safetyTips: ex.safetyTips && ex.safetyTips.length > 0 ? ex.safetyTips : ["Maintain neutral spine."]
    });
    setEditSuccessMsg("");
  };

  // Save Edit
  const handleSaveEdit = async () => {
    if (!editingExercise) return;
    if (!editForm.name?.trim()) {
      alert("Workout name cannot be empty.");
      return;
    }

    setIsSavingEdit(true);
    try {
      await editExercise(editingExercise.id, editForm);
      setEditSuccessMsg("Workout updated successfully!");
      setTimeout(() => {
        setEditingExercise(null);
        setEditSuccessMsg("");
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Quick Inline Edit
  const handleStartQuickEdit = (ex: Exercise) => {
    setQuickEditId(ex.id);
    setQuickName(ex.name);
    setQuickSets(ex.recommendedSets || "3-4");
    setQuickReps(ex.recommendedReps || "10-12");
  };

  const handleSaveQuickEdit = async (exId: string) => {
    setIsSavingQuick(true);
    try {
      await editExercise(exId, {
        name: quickName.trim(),
        recommendedSets: quickSets.trim(),
        recommendedReps: quickReps.trim()
      });
      setQuickEditId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update workout.");
    } finally {
      setIsSavingQuick(false);
    }
  };

  // Save New Workout
  const handleSaveNewWorkout = async () => {
    if (!newWorkout.name?.trim()) {
      alert("Please provide a workout name.");
      return;
    }

    setIsSavingNew(true);
    try {
      const mediaUrl = newMediaInput.trim() || newWorkout.customMediaUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80";
      const isVideo = mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".webm");

      await addWorkout({
        ...newWorkout,
        customMediaUrl: mediaUrl,
        customMediaType: isVideo ? "video" : "image",
        gifUrl: mediaUrl,
        imageUrl: mediaUrl
      });

      setIsAddModalOpen(false);
      setNewWorkout({
        name: "",
        recommendedSets: "3-4",
        recommendedReps: "10-12",
        category: "Gym Workouts",
        difficulty: "Intermediate",
        muscleGroups: ["Chest"],
        equipment: ["Dumbbells"],
        isPremium: true,
        customMediaUrl: "",
        customMediaType: "image"
      });
      setNewMediaInput("");
    } catch (err) {
      console.error(err);
      alert("Failed to create workout.");
    } finally {
      setIsSavingNew(false);
    }
  };

  // Handle File upload inside modals
  const handleModalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      alert("File exceeds 25MB limit.");
      return;
    }

    const isVideo = file.type.startsWith("video/");
    try {
      const tempId = isNew ? `temp_new_${Date.now()}` : (editingExercise?.id || `ex_${Date.now()}`);
      const cloudUrl = await uploadMediaToCloud(file, tempId, isVideo ? "video" : "image");
      
      if (isNew) {
        setNewWorkout(prev => ({ ...prev, customMediaUrl: cloudUrl, customMediaType: isVideo ? "video" : "image" }));
        setNewMediaInput(cloudUrl);
      } else {
        setEditForm(prev => ({ ...prev, customMediaUrl: cloudUrl, customMediaType: isVideo ? "video" : "image" }));
      }
    } catch (err) {
      console.error("Cloud upload error:", err);
      alert("Failed to upload image/video. You can also paste an image URL.");
    }
  };

  return (
    <div id="admin_workout_editor_root" className="space-y-6">
      
      {/* Command Control Header - Athlete Performance Desk Design System */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full border border-red-200">
              <Dumbbell className="w-3 h-3 text-red-600" />
              Workout Management Desk
            </span>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              {exercises.length} Exercises Loaded
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight font-sans">
            Exercise Catalog & Prescription Desk
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl font-medium leading-relaxed">
            Configure authoritative workout targets, progressive overload prescriptions (sets × reps), difficulty ratings, and visual GIF demonstration media.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-sans font-black uppercase tracking-wider text-xs px-5 py-3 rounded-2xl transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Exercise</span>
          </button>
        </div>
      </div>

      {/* Filter and View Layout Controls */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="relative sm:col-span-2 lg:col-span-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by exercise name, target muscle, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600 cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>Category: {cat}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600 cursor-pointer"
            >
              {DIFFICULTIES.map(diff => (
                <option key={diff} value={diff}>Difficulty: {diff}</option>
              ))}
            </select>
          </div>

          {/* Tier Filter */}
          <div className="lg:col-span-3">
            <select
              value={premiumFilter}
              onChange={(e) => setPremiumFilter(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600 cursor-pointer"
            >
              <option value="All">Tier: All Workouts ({exercises.length})</option>
              <option value="Premium">Tier: Premium Only ({exercises.filter(e => e.isPremium).length})</option>
              <option value="Free">Tier: Free Workouts ({exercises.filter(e => !e.isPremium).length})</option>
            </select>
          </div>

        </div>

        {/* View Switcher & Result Stats Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-medium">
              Showing <strong className="text-slate-900 font-bold">{filteredExercises.length}</strong> of {exercises.length} workouts
            </span>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="text-red-600 hover:underline font-bold cursor-pointer"
              >
                Reset filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700">
              <span className="text-[10px] font-mono uppercase text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="name">Name (A-Z)</option>
                <option value="category">Category</option>
                <option value="difficulty">Difficulty</option>
                <option value="customMedia">Custom Media First</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                title={`Toggle sort order (Currently ${sortOrder.toUpperCase()})`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Layout Mode Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Table Layout"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>

              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Grid Layout"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TABLE VIEW: Consistent with Athlete Performance Desk Data System
          ========================================================================= */}
      {viewMode === "table" && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="sm:hidden px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 text-[11px] font-mono text-slate-600 flex items-center justify-between">
            <span>← Scroll horizontally to see full workout row</span>
            <span>Edit / Delete at far right →</span>
          </div>
          <div className="overflow-x-auto max-h-[750px] scrollbar-thin">
            <table className="w-full min-w-[780px] text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-mono tracking-wider text-slate-500 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="py-3.5 px-4 font-bold">#</th>
                  <th className="py-3.5 px-4 font-bold">Exercise & Media</th>
                  <th className="py-3.5 px-4 font-bold">Category & Muscle</th>
                  <th className="py-3.5 px-4 font-bold">Prescription (Sets × Reps)</th>
                  <th className="py-3.5 px-4 font-bold">Difficulty & Tier</th>
                  <th className="py-3.5 px-4 font-bold">Media Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExercises.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-500">
                      <Dumbbell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-bold text-slate-700 text-sm">No exercises matched your query.</p>
                      <p className="text-xs text-slate-400 mt-1">Try clearing filters or search keywords.</p>
                    </td>
                  </tr>
                ) : (
                  filteredExercises.map((exercise, index) => {
                    const isQuickEditing = quickEditId === exercise.id;

                    return (
                      <tr 
                        key={exercise.id} 
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isQuickEditing ? "bg-red-50/30" : ""
                        }`}
                      >
                        {/* Index */}
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          {index + 1}
                        </td>

                        {/* Exercise & Thumbnail */}
                        <td className="py-3 px-4 min-w-[240px]">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 relative group shadow-xs">
                              <UnifiedExerciseMedia
                                exerciseId={exercise.id}
                                exerciseName={exercise.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="min-w-0">
                              {isQuickEditing ? (
                                <input
                                  type="text"
                                  value={quickName}
                                  onChange={(e) => setQuickName(e.target.value)}
                                  className="w-full bg-white border border-red-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                                />
                              ) : (
                                <>
                                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate leading-snug">
                                    {exercise.name}
                                  </h4>
                                  <span className="text-[10px] font-mono text-slate-400 truncate block">
                                    ID: {exercise.id}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category & Muscle */}
                        <td className="py-3 px-4 min-w-[150px]">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px]">
                            {exercise.category}
                          </span>
                          <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                            {exercise.muscleGroups?.slice(0, 2).join(", ") || exercise.bodyPart || "Core"}
                          </div>
                        </td>

                        {/* Prescription (Sets × Reps) */}
                        <td className="py-3 px-4 min-w-[180px]">
                          {isQuickEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={quickSets}
                                onChange={(e) => setQuickSets(e.target.value)}
                                placeholder="Sets"
                                className="w-16 bg-white border border-red-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none"
                              />
                              <span className="text-slate-400">×</span>
                              <input
                                type="text"
                                value={quickReps}
                                onChange={(e) => setQuickReps(e.target.value)}
                                placeholder="Reps"
                                className="w-20 bg-white border border-red-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-800 font-black text-[11px] font-mono">
                                {exercise.recommendedSets || "3-4"} Sets
                              </span>
                              <span className="text-slate-400 font-mono text-xs">×</span>
                              <span className="px-2 py-1 rounded-lg bg-red-50 text-red-700 font-black text-[11px] font-mono">
                                {exercise.recommendedReps || "10-12"} Reps
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Difficulty & Tier */}
                        <td className="py-3 px-4 min-w-[140px]">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                              {exercise.difficulty || "Intermediate"}
                            </span>
                            {exercise.isPremium ? (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase">
                                <Sparkles className="w-2.5 h-2.5" /> Premium
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase">
                                Free
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Media Status */}
                        <td className="py-3 px-4 min-w-[120px]">
                          {exercise.customMediaUrl ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Custom
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                              Standard
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap min-w-[150px]">
                          {isQuickEditing ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleSaveQuickEdit(exercise.id)}
                                disabled={isSavingQuick}
                                className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition shadow-xs"
                              >
                                <Save className="w-3 h-3" /> Save
                              </button>
                              <button
                                onClick={() => setQuickEditId(null)}
                                className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold text-[11px] cursor-pointer transition"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleStartQuickEdit(exercise)}
                                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                title="Quick Edit Sets & Reps"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(exercise)}
                                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-xl transition cursor-pointer"
                                title="Full Workout Configuration"
                              >
                                Edit All
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${exercise.name}"?`)) {
                                    deleteWorkout(exercise.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                title="Delete Exercise"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          GRID VIEW: Responsive Card Grid Layout
          ========================================================================= */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredExercises.map((exercise) => {
            const isQuickEditing = quickEditId === exercise.id;

            return (
              <div
                key={exercise.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Media Header */}
                <div>
                  <div className="relative h-44 bg-slate-900 overflow-hidden group">
                    <UnifiedExerciseMedia
                      exerciseId={exercise.id}
                      exerciseName={exercise.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">
                      <span className="bg-slate-950/80 backdrop-blur-xs text-white font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                        {exercise.category}
                      </span>
                      {exercise.isPremium ? (
                        <span className="bg-amber-500/90 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                          <Sparkles className="w-2.5 h-2.5" /> Premium
                        </span>
                      ) : (
                        <span className="bg-emerald-600/90 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-md">
                          Free
                        </span>
                      )}
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-slate-950/80 text-slate-200 text-[9px] font-mono font-bold px-2 py-0.5 rounded-md">
                      {exercise.difficulty || "Intermediate"}
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 space-y-3">
                    {isQuickEditing ? (
                      <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-red-200">
                        <div>
                          <label className="block text-[9px] font-black uppercase text-slate-500">Exercise Name</label>
                          <input
                            type="text"
                            value={quickName}
                            onChange={(e) => setQuickName(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-500">Sets</label>
                            <input
                              type="text"
                              value={quickSets}
                              onChange={(e) => setQuickSets(e.target.value)}
                              placeholder="e.g. 3-4"
                              className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-500">Reps</label>
                            <input
                              type="text"
                              value={quickReps}
                              onChange={(e) => setQuickReps(e.target.value)}
                              placeholder="e.g. 10-12"
                              className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleSaveQuickEdit(exercise.id)}
                            disabled={isSavingQuick}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" /> Save
                          </button>
                          <button
                            onClick={() => setQuickEditId(null)}
                            className="px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[11px] py-1.5 rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-black text-sm text-slate-900 leading-snug line-clamp-1">
                          {exercise.name}
                        </h3>

                        {/* Prescriptions Tiles */}
                        <div className="mt-2.5 grid grid-cols-2 gap-2 text-center">
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span className="block text-[8px] font-mono uppercase font-bold text-slate-400">Target Sets</span>
                            <span className="block text-xs font-black text-slate-800">{exercise.recommendedSets || "3-4"} Sets</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span className="block text-[8px] font-mono uppercase font-bold text-slate-400">Target Reps</span>
                            <span className="block text-xs font-black text-red-600">{exercise.recommendedReps || "10-12"} Reps</span>
                          </div>
                        </div>

                        {/* Target Muscles */}
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {exercise.muscleGroups?.slice(0, 2).map((m, i) => (
                            <span key={i} className="text-[9px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-3.5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <button
                    onClick={() => handleStartQuickEdit(exercise)}
                    className="text-[11px] font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" /> Quick Edit
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(exercise)}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
                    >
                      Edit All
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${exercise.name}"?`)) {
                          deleteWorkout(exercise.id);
                        }
                      }}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-xl hover:bg-red-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          FULL EDIT MODAL
          ========================================================================= */}
      {editingExercise && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-left">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-black uppercase text-red-600 tracking-wider">Exercise Customizer</span>
                <h3 className="text-xl font-black text-slate-900 uppercase">Edit Workout Details</h3>
              </div>
              <button
                onClick={() => setEditingExercise(null)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {editSuccessMsg}
              </div>
            )}

            <div className="space-y-4">
              {/* Workout Name */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Workout Name *</label>
                <input
                  type="text"
                  value={editForm.name || ""}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="e.g., Incline Dumbbell Press"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Sets and Reps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Recommended Sets *</label>
                  <input
                    type="text"
                    value={editForm.recommendedSets || ""}
                    onChange={(e) => setEditForm({ ...editForm, recommendedSets: e.target.value })}
                    placeholder="e.g., 3-4 Sets"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Recommended Reps *</label>
                  <input
                    type="text"
                    value={editForm.recommendedReps || ""}
                    onChange={(e) => setEditForm({ ...editForm, recommendedReps: e.target.value })}
                    placeholder="e.g., 8-12 Reps or 45s"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Category, Difficulty & Estimated Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Category</label>
                  <select
                    value={editForm.category || "Gym Workouts"}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600 cursor-pointer"
                  >
                    {CATEGORIES.filter(c => c !== "All").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Difficulty</label>
                  <select
                    value={editForm.difficulty || "Intermediate"}
                    onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600 cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Duration (Mins)</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={editForm.durationMinutes || 10}
                    onChange={(e) => setEditForm({ ...editForm, durationMinutes: parseInt(e.target.value) || 10 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Location Suitability (Gym vs Home) */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Training Facility Suitability</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Gym", "Home", "Both"] as const).map(loc => {
                    const isSelected = (editForm.locationSuitability || "Gym") === loc;
                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, locationSuitability: loc })}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {loc === "Both" ? "Gym & Home (Both)" : loc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Muscle Groups Assignment */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  Target Muscle Groups <span className="text-[10px] text-slate-400 font-normal font-mono">(Multi-Select)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {MUSCLE_OPTIONS.map(muscle => {
                    const selectedMuscles = editForm.muscleGroups || [];
                    const isSelected = selectedMuscles.includes(muscle);
                    return (
                      <button
                        key={muscle}
                        type="button"
                        onClick={() => {
                          const updated = isSelected 
                            ? selectedMuscles.filter(m => m !== muscle)
                            : [...selectedMuscles, muscle];
                          setEditForm({ ...editForm, muscleGroups: updated });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-red-600 text-white border-red-600 shadow-xs"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {muscle}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Equipment Assignment */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  Equipment Required <span className="text-[10px] text-slate-400 font-normal font-mono">(Multi-Select)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {EQUIPMENT_OPTIONS.map(eq => {
                    const selectedEq = editForm.equipment || [];
                    const isSelected = selectedEq.includes(eq);
                    return (
                      <button
                        key={eq}
                        type="button"
                        onClick={() => {
                          const updated = isSelected 
                            ? selectedEq.filter(item => item !== eq)
                            : [...selectedEq, eq];
                          setEditForm({ ...editForm, equipment: updated });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {eq}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Program Assignments */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  Program Category Inclusions <span className="text-[10px] text-slate-400 font-normal font-mono">(Multi-Select)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PROGRAM_OPTIONS.map(prog => {
                    const selectedProgs = editForm.programAssignments || [];
                    const isSelected = selectedProgs.includes(prog);
                    return (
                      <button
                        key={prog}
                        type="button"
                        onClick={() => {
                          const updated = isSelected 
                            ? selectedProgs.filter(p => p !== prog)
                            : [...selectedProgs, prog];
                          setEditForm({ ...editForm, programAssignments: updated });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {prog}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Women's Categories Assignment */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  Women's Workout Focus <span className="text-[10px] text-slate-400 font-normal font-mono">(Multi-Select)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {WOMEN_CATEGORY_OPTIONS.map(wCat => {
                    const selectedWCats = editForm.womenCategories || [];
                    const isSelected = selectedWCats.includes(wCat);
                    return (
                      <button
                        key={wCat}
                        type="button"
                        onClick={() => {
                          const updated = isSelected 
                            ? selectedWCats.filter(w => w !== wCat)
                            : [...selectedWCats, wCat];
                          setEditForm({ ...editForm, womenCategories: updated });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {wCat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Goal Assignment */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  Target Goals <span className="text-[10px] text-slate-400 font-normal font-mono">(Multi-Select)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {GOAL_OPTIONS.map(goal => {
                    const selectedGoals = editForm.goals || [];
                    const isSelected = selectedGoals.includes(goal);
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => {
                          const updated = isSelected 
                            ? selectedGoals.filter(g => g !== goal)
                            : [...selectedGoals, goal];
                          setEditForm({ ...editForm, goals: updated });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {goal}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Media Preview & Upload */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-xs font-black uppercase text-slate-700">Workout Image / Video</label>
                
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-slate-900 overflow-hidden shrink-0 relative border border-slate-200">
                    <img 
                      src={editForm.customMediaUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <input
                      type="text"
                      placeholder="Paste Image/GIF/Video URL"
                      value={editForm.customMediaUrl || ""}
                      onChange={(e) => setEditForm({ ...editForm, customMediaUrl: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                    />
                    
                    <label className="inline-flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Upload from Device
                      <input 
                        type="file" 
                        accept="image/*,video/*" 
                        onChange={(e) => handleModalFileUpload(e, false)} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Premium Tier Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="block text-xs font-black uppercase text-slate-900">Premium Workout Lock</span>
                  <span className="block text-[11px] text-slate-500">Requires active athlete membership to unlock</span>
                </div>
                <input
                  type="checkbox"
                  checked={editForm.isPremium || false}
                  onChange={(e) => setEditForm({ ...editForm, isPremium: e.target.checked })}
                  className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setEditingExercise(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSavingEdit}
                className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {isSavingEdit ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          ADD NEW WORKOUT MODAL
          ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-left">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-black uppercase text-red-600 tracking-wider">New Exercise</span>
                <h3 className="text-xl font-black text-slate-900 uppercase">Create Workout</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Workout Name */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Workout Name *</label>
                <input
                  type="text"
                  value={newWorkout.name || ""}
                  onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                  placeholder="e.g., Bulgarian Split Squats"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Sets and Reps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Recommended Sets *</label>
                  <input
                    type="text"
                    value={newWorkout.recommendedSets || "3-4"}
                    onChange={(e) => setNewWorkout({ ...newWorkout, recommendedSets: e.target.value })}
                    placeholder="e.g., 3-4 Sets"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Recommended Reps *</label>
                  <input
                    type="text"
                    value={newWorkout.recommendedReps || "10-12"}
                    onChange={(e) => setNewWorkout({ ...newWorkout, recommendedReps: e.target.value })}
                    placeholder="e.g., 10-12 Reps"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Category, Difficulty & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Category</label>
                  <select
                    value={newWorkout.category || "Gym Workouts"}
                    onChange={(e) => setNewWorkout({ ...newWorkout, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600 cursor-pointer"
                  >
                    {CATEGORIES.filter(c => c !== "All").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Difficulty</label>
                  <select
                    value={newWorkout.difficulty || "Intermediate"}
                    onChange={(e) => setNewWorkout({ ...newWorkout, difficulty: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600 cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Duration (Mins)</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={newWorkout.durationMinutes || 10}
                    onChange={(e) => setNewWorkout({ ...newWorkout, durationMinutes: parseInt(e.target.value) || 10 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Location Suitability (Gym vs Home) */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Training Facility Suitability</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Gym", "Home", "Both"] as const).map(loc => {
                    const isSelected = (newWorkout.locationSuitability || "Gym") === loc;
                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setNewWorkout({ ...newWorkout, locationSuitability: loc })}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {loc === "Both" ? "Gym & Home (Both)" : loc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Muscle Groups Assignment */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  Target Muscle Groups <span className="text-[10px] text-slate-400 font-normal font-mono">(Multi-Select)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {MUSCLE_OPTIONS.map(muscle => {
                    const selectedMuscles = newWorkout.muscleGroups || [];
                    const isSelected = selectedMuscles.includes(muscle);
                    return (
                      <button
                        key={muscle}
                        type="button"
                        onClick={() => {
                          const updated = isSelected 
                            ? selectedMuscles.filter(m => m !== muscle)
                            : [...selectedMuscles, muscle];
                          setNewWorkout({ ...newWorkout, muscleGroups: updated });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-red-600 text-white border-red-600 shadow-xs"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {muscle}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Equipment Assignment */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  Equipment Required <span className="text-[10px] text-slate-400 font-normal font-mono">(Multi-Select)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {EQUIPMENT_OPTIONS.map(eq => {
                    const selectedEq = newWorkout.equipment || [];
                    const isSelected = selectedEq.includes(eq);
                    return (
                      <button
                        key={eq}
                        type="button"
                        onClick={() => {
                          const updated = isSelected 
                            ? selectedEq.filter(item => item !== eq)
                            : [...selectedEq, eq];
                          setNewWorkout({ ...newWorkout, equipment: updated });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {eq}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Program Assignments */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  Program Category Inclusions <span className="text-[10px] text-slate-400 font-normal font-mono">(Multi-Select)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PROGRAM_OPTIONS.map(prog => {
                    const selectedProgs = newWorkout.programAssignments || [];
                    const isSelected = selectedProgs.includes(prog);
                    return (
                      <button
                        key={prog}
                        type="button"
                        onClick={() => {
                          const updated = isSelected 
                            ? selectedProgs.filter(p => p !== prog)
                            : [...selectedProgs, prog];
                          setNewWorkout({ ...newWorkout, programAssignments: updated });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {prog}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Women's Categories Assignment */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  Women's Workout Focus <span className="text-[10px] text-slate-400 font-normal font-mono">(Multi-Select)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {WOMEN_CATEGORY_OPTIONS.map(wCat => {
                    const selectedWCats = newWorkout.womenCategories || [];
                    const isSelected = selectedWCats.includes(wCat);
                    return (
                      <button
                        key={wCat}
                        type="button"
                        onClick={() => {
                          const updated = isSelected 
                            ? selectedWCats.filter(w => w !== wCat)
                            : [...selectedWCats, wCat];
                          setNewWorkout({ ...newWorkout, womenCategories: updated });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {wCat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Goal Assignment */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  Target Goals <span className="text-[10px] text-slate-400 font-normal font-mono">(Multi-Select)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {GOAL_OPTIONS.map(goal => {
                    const selectedGoals = newWorkout.goals || [];
                    const isSelected = selectedGoals.includes(goal);
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => {
                          const updated = isSelected 
                            ? selectedGoals.filter(g => g !== goal)
                            : [...selectedGoals, goal];
                          setNewWorkout({ ...newWorkout, goals: updated });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {goal}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image / GIF / Video */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-xs font-black uppercase text-slate-700">Workout Image / GIF URL</label>
                
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-slate-900 overflow-hidden shrink-0 relative border border-slate-200">
                    <img 
                      src={newMediaInput || newWorkout.customMediaUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"} 
                      alt="New Workout Preview" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <input
                      type="text"
                      placeholder="Paste Image or GIF URL"
                      value={newMediaInput}
                      onChange={(e) => setNewMediaInput(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                    />
                    
                    <label className="inline-flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Upload from Device
                      <input 
                        type="file" 
                        accept="image/*,video/*" 
                        onChange={(e) => handleModalFileUpload(e, true)} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Premium Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="block text-xs font-black uppercase text-slate-900">Make Workout Premium</span>
                  <span className="block text-[11px] text-slate-500">Accessible only to active subscribing athletes</span>
                </div>
                <input
                  type="checkbox"
                  checked={newWorkout.isPremium !== undefined ? newWorkout.isPremium : true}
                  onChange={(e) => setNewWorkout({ ...newWorkout, isPremium: e.target.checked })}
                  className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewWorkout}
                disabled={isSavingNew}
                className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {isSavingNew ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Create Workout
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
