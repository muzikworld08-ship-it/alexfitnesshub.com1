import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { Exercise } from "../../data/exercises";
import UnifiedExerciseMedia from "../UnifiedExerciseMedia";
import { 
  Plus, Edit3, Trash2, Search, Filter, Check, X, Dumbbell, 
  Sparkles, Image as ImageIcon, Save, RefreshCw, AlertCircle, 
  CheckCircle2, Layers, Flame, ArrowUpDown, ChevronRight, Eye
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

export default function AdminWorkoutEditor() {
  const { exercises, editExercise, addWorkout, deleteWorkout, uploadExerciseMedia } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [premiumFilter, setPremiumFilter] = useState<"All" | "Premium" | "Free">("All");

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWorkout, setNewWorkout] = useState<Partial<Exercise>>({
    name: "",
    recommendedSets: "3-4",
    recommendedReps: "10-12",
    category: "Gym Workouts",
    difficulty: "Intermediate",
    muscleGroups: ["Chest"],
    equipment: ["Dumbbells"],
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

  // Filtered exercises
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.muscleGroups?.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));

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
  }, [exercises, searchQuery, selectedCategory, selectedDifficulty, premiumFilter]);

  // Open Edit Modal
  const handleOpenEdit = (ex: Exercise) => {
    setEditingExercise(ex);
    setEditForm({
      name: ex.name,
      recommendedSets: ex.recommendedSets || "3",
      recommendedReps: ex.recommendedReps || "10-12",
      category: ex.category,
      difficulty: ex.difficulty,
      muscleGroups: ex.muscleGroups || [ex.category],
      equipment: ex.equipment || ["Bodyweight"],
      isPremium: ex.isPremium,
      customMediaUrl: ex.customMediaUrl || ex.gifUrl || ex.imageUrl,
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
      }, 1200);
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
    setQuickSets(ex.recommendedSets || "3");
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
      
      {/* Top Action Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-red-100 text-red-700 text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full">
              Workout Command
            </span>
            <span className="text-xs font-bold text-slate-500">
              {exercises.length} Total Exercises in Library
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight mt-1">
            Workout & Exercise Manager
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Edit existing workout names, sets, reps, and image media. Add brand new custom exercises with photos/GIFs to immediately update user routines and challenges.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs px-5 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add New Workout
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search exercise name or muscle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>Category: {cat}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 cursor-pointer"
            >
              {DIFFICULTIES.map(diff => (
                <option key={diff} value={diff}>Difficulty: {diff}</option>
              ))}
            </select>
          </div>

          {/* Premium Filter */}
          <div>
            <select
              value={premiumFilter}
              onChange={(e) => setPremiumFilter(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="All">Tier: All Workouts</option>
              <option value="Premium">Tier: Premium Only</option>
              <option value="Free">Tier: Free Workouts</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-1">
          <span>Showing <strong className="text-slate-900">{filteredExercises.length}</strong> of {exercises.length} workouts</span>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="text-red-600 hover:underline cursor-pointer"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Workouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredExercises.map((exercise) => {
          const isQuickEditing = quickEditId === exercise.id;

          return (
            <div
              key={exercise.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Card Header & Visual Media */}
              <div>
                <div className="relative h-48 bg-slate-900 overflow-hidden group">
                  <UnifiedExerciseMedia
                    exerciseId={exercise.id}
                    exerciseName={exercise.name}
                    defaultGifUrl={exercise.gifUrl || exercise.imageUrl}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    <span className="bg-slate-950/80 backdrop-blur-sm text-white font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                      {exercise.category}
                    </span>
                    {exercise.isPremium ? (
                      <span className="bg-amber-500/90 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-2.5 h-2.5" /> Premium
                      </span>
                    ) : (
                      <span className="bg-emerald-600/90 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-md">
                        Free
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-950/80 text-slate-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                    {exercise.difficulty}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {isQuickEditing ? (
                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-red-200">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500">Workout Name</label>
                        <input
                          type="text"
                          value={quickName}
                          onChange={(e) => setQuickName(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500">Sets</label>
                          <input
                            type="text"
                            value={quickSets}
                            onChange={(e) => setQuickSets(e.target.value)}
                            placeholder="e.g. 3-4"
                            className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500">Reps</label>
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
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-black text-sm sm:text-base text-slate-900 leading-tight">
                          {exercise.name}
                        </h3>
                      </div>

                      {/* Reps & Sets Highlights */}
                      <div className="mt-2.5 grid grid-cols-2 gap-2 text-center">
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="block text-[9px] font-mono uppercase font-bold text-slate-400">Target Sets</span>
                          <span className="block text-xs font-black text-slate-800">{exercise.recommendedSets || "3-4"} Sets</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="block text-[9px] font-mono uppercase font-bold text-slate-400">Target Reps</span>
                          <span className="block text-xs font-black text-red-600">{exercise.recommendedReps || "10-12"} Reps</span>
                        </div>
                      </div>

                      {/* Muscle Groups */}
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {exercise.muscleGroups?.slice(0, 3).map((m, i) => (
                          <span key={i} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() => handleStartQuickEdit(exercise)}
                  className="text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Quick Sets/Reps
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(exercise)}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                    title="Full Workout Settings"
                  >
                    Edit All
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${exercise.name}"?`)) {
                        deleteWorkout(exercise.id);
                      }
                    }}
                    className="text-slate-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-all cursor-pointer"
                    title="Delete Workout"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL EDIT WORKOUT MODAL */}
      {editingExercise && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
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

            <div className="space-y-4 text-left">
              {/* Workout Name */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Workout Name *</label>
                <input
                  type="text"
                  value={editForm.name || ""}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="e.g., Incline Dumbbell Press"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-500"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Recommended Reps *</label>
                  <input
                    type="text"
                    value={editForm.recommendedReps || ""}
                    onChange={(e) => setEditForm({ ...editForm, recommendedReps: e.target.value })}
                    placeholder="e.g., 8-12 Reps or 45s"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Category & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Category</label>
                  <select
                    value={editForm.category || "Gym Workouts"}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500 cursor-pointer"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Media Image / GIF / Video Preview & Upload */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-xs font-black uppercase text-slate-700">Workout Image / Video</label>
                
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl bg-slate-900 overflow-hidden flex-shrink-0 relative border border-slate-200">
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
                      placeholder="Paste Image/GIF/Video URL (e.g. https://...)"
                      value={editForm.customMediaUrl || ""}
                      onChange={(e) => setEditForm({ ...editForm, customMediaUrl: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
                    />
                    
                    <label className="inline-flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all">
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

      {/* ADD NEW WORKOUT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
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

            <div className="space-y-4 text-left">
              {/* Workout Name */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Workout Name *</label>
                <input
                  type="text"
                  value={newWorkout.name || ""}
                  onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                  placeholder="e.g., Bulgarian Split Squats"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-500"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Recommended Reps *</label>
                  <input
                    type="text"
                    value={newWorkout.recommendedReps || "10-12"}
                    onChange={(e) => setNewWorkout({ ...newWorkout, recommendedReps: e.target.value })}
                    placeholder="e.g., 10-12 Reps"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Category & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Category</label>
                  <select
                    value={newWorkout.category || "Gym Workouts"}
                    onChange={(e) => setNewWorkout({ ...newWorkout, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500 cursor-pointer"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Image / GIF / Video */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-xs font-black uppercase text-slate-700">Workout Image / GIF URL</label>
                
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl bg-slate-900 overflow-hidden flex-shrink-0 relative border border-slate-200">
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
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
                    />
                    
                    <label className="inline-flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all">
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
