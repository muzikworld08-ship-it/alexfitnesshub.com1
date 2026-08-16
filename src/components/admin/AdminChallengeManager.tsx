import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { PremiumChallenge, getChallengeWorkouts } from "../../data/challenges";
import { ChallengeWorkout } from "../../types";
import { Exercise } from "../../data/exercises";
import { 
  Trophy, Plus, Edit3, Trash2, Award, Calendar, Flame, 
  Sparkles, Image as ImageIcon, Layers, Check, X, 
  ChevronRight, Dumbbell, AlertCircle, RefreshCw, Save, Search,
  Eye, CheckCircle2
} from "lucide-react";
import { uploadMediaToCloud } from "../../utils/mediaStorageService";

const CHALLENGE_CATEGORIES = [
  "Hypertrophy",
  "Conditioning",
  "Recomposition",
  "Athleticism",
  "Powerlifting",
  "Calisthenics",
  "Core Force",
  "Full Body"
];

const BADGE_COLORS = [
  { label: "Red / Amber (Aggressive)", value: "from-red-500 to-amber-600" },
  { label: "Orange / Red (Conditioning)", value: "from-orange-500 to-red-600" },
  { label: "Purple / Indigo (Recomposition)", value: "from-purple-500 to-indigo-600" },
  { label: "Cyan / Blue (Athleticism)", value: "from-cyan-500 to-blue-600" },
  { label: "Yellow / Amber (Strength Titan)", value: "from-yellow-600 to-amber-700" },
  { label: "Emerald / Teal (Calisthenics)", value: "from-emerald-500 to-teal-600" },
  { label: "Pink / Rose (Core Focus)", value: "from-pink-500 to-rose-600" }
];

export default function AdminChallengeManager() {
  const { allChallenges, exercises, addCustomChallenge, updateCustomChallenge, deleteCustomChallenge } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<PremiumChallenge | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("Hypertrophy");
  const [formGoal, setFormGoal] = useState("");
  const [formImage, setFormImage] = useState("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80");
  const [formDuration, setFormDuration] = useState(30);
  const [formBadgeName, setFormBadgeName] = useState("");
  const [formBadgeColor, setFormBadgeColor] = useState("from-red-500 to-amber-600");
  const [formWorkouts, setFormWorkouts] = useState<ChallengeWorkout[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Workout Selector inside Modal
  const [workoutSearch, setWorkoutSearch] = useState("");
  const [selectedExToAdd, setSelectedExToAdd] = useState("");

  // Inspect Modal
  const [inspectChallenge, setInspectChallenge] = useState<PremiumChallenge | null>(null);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingChallenge(null);
    setFormTitle("");
    setFormDescription("");
    setFormCategory("Hypertrophy");
    setFormGoal("");
    setFormImage("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80");
    setFormDuration(30);
    setFormBadgeName("Challenge Master");
    setFormBadgeColor("from-red-500 to-amber-600");
    
    // Seed initial 4 workouts from library
    const defaultExs = exercises.slice(0, 4).map(ex => ({
      id: ex.id,
      name: ex.name,
      sets: ex.recommendedSets || "3-4",
      reps: ex.recommendedReps || "10-12",
      customMediaUrl: ex.customMediaUrl || ex.gifUrl || ex.imageUrl,
      customMediaType: ex.customMediaType || "image",
      gifUrl: ex.gifUrl || ex.imageUrl,
      imageUrl: ex.imageUrl || ex.gifUrl,
      category: ex.category
    }));
    setFormWorkouts(defaultExs);
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (challenge: PremiumChallenge) => {
    setEditingChallenge(challenge);
    setFormTitle(challenge.title);
    setFormDescription(challenge.description);
    setFormCategory(challenge.category);
    setFormGoal(challenge.goal || challenge.description);
    setFormImage(challenge.image);
    setFormDuration(challenge.durationDays || 30);
    setFormBadgeName(challenge.badgeName);
    setFormBadgeColor(challenge.badgeColor);
    
    const existingWorkouts = getChallengeWorkouts(challenge, exercises);
    setFormWorkouts(existingWorkouts);
    setIsCreateModalOpen(true);
  };

  // Add Exercise to Challenge Workouts
  const handleAddExerciseToChallenge = (ex: Exercise) => {
    if (formWorkouts.some(w => w.id === ex.id)) return;
    setFormWorkouts(prev => [
      ...prev,
      {
        id: ex.id,
        name: ex.name,
        sets: ex.recommendedSets || "3-4",
        reps: ex.recommendedReps || "10-12",
        customMediaUrl: ex.customMediaUrl || ex.gifUrl || ex.imageUrl,
        customMediaType: ex.customMediaType || "image",
        gifUrl: ex.gifUrl || ex.imageUrl,
        imageUrl: ex.imageUrl || ex.gifUrl,
        category: ex.category
      }
    ]);
  };

  // Remove Workout from Challenge
  const handleRemoveWorkout = (wId: string) => {
    setFormWorkouts(prev => prev.filter(w => w.id !== wId));
  };

  // Update specific workout sets/reps in challenge
  const handleUpdateWorkoutSetsReps = (wId: string, sets: string, reps: string) => {
    setFormWorkouts(prev => prev.map(w => w.id === wId ? { ...w, sets, reps } : w));
  };

  // Save Challenge
  const handleSaveChallenge = async () => {
    if (!formTitle.trim()) {
      alert("Please provide a challenge title.");
      return;
    }
    if (formWorkouts.length === 0) {
      alert("Please add at least one workout with image to this challenge.");
      return;
    }

    setIsSaving(true);
    try {
      const challengePayload: Partial<PremiumChallenge> = {
        title: formTitle.trim(),
        description: formDescription.trim() || `Transform your fitness with the ${formTitle.trim()}.`,
        category: formCategory,
        goal: formGoal.trim() || formDescription.trim() || "Achieve breakthrough physical conditioning.",
        image: formImage.trim() || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
        badgeId: editingChallenge?.badgeId || `badge_${Date.now()}`,
        badgeName: formBadgeName.trim() || `${formTitle.trim()} Finisher`,
        badgeColor: formBadgeColor,
        durationDays: Number(formDuration) || 30,
        isPremium: true,
        workouts: formWorkouts,
        isCustom: true
      };

      if (editingChallenge) {
        await updateCustomChallenge(editingChallenge.id, challengePayload);
      } else {
        await addCustomChallenge(challengePayload);
      }

      setIsCreateModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save challenge.");
    } finally {
      setIsSaving(false);
    }
  };

  // File upload for challenge banner
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const cloudUrl = await uploadMediaToCloud(file, `chal_banner_${Date.now()}`, "image");
      setFormImage(cloudUrl);
    } catch (err) {
      console.error(err);
      alert("Could not upload image.");
    }
  };

  return (
    <div id="admin_challenge_manager_root" className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-700 text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full">
              Challenges Engine
            </span>
            <span className="text-xs font-bold text-slate-500">
              {allChallenges.length} Total Challenges Available
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight mt-1">
            Fitness Challenges & Workouts Curriculum
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Create custom multi-day fitness challenges for athletes. Select target workouts—all workout images, names, sets, and reps are automatically showcased on the challenge.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs px-5 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Create New Challenge
        </button>
      </div>

      {/* Challenges List Display */}
      <div className="space-y-6">
        {allChallenges.map((challenge) => {
          const challengeWorkouts = getChallengeWorkouts(challenge, exercises);

          return (
            <div
              key={challenge.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all space-y-4"
            >
              {/* Challenge Banner Header */}
              <div className="relative h-48 sm:h-56 bg-slate-950 overflow-hidden">
                {challenge.image ? (
                  <img
                    src={challenge.image}
                    alt={challenge.title}
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  <span className="bg-red-600 text-white text-[10px] font-mono font-black uppercase px-3 py-1 rounded-full shadow-md">
                    {challenge.category}
                  </span>
                  <span className="bg-slate-900/80 backdrop-blur-sm text-amber-400 font-mono text-[10px] font-black uppercase px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {challenge.durationDays || 90} Days Program
                  </span>
                  {challenge.isCustom && (
                    <span className="bg-purple-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
                      Custom Admin Challenge
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                      {challenge.title}
                    </h3>
                    <p className="text-xs text-slate-300 max-w-2xl line-clamp-1 font-medium mt-0.5">
                      {challenge.goal || challenge.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-slate-900/90 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-slate-700/50 flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${challenge.badgeColor} flex items-center justify-center text-white`}>
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200">{challenge.badgeName}</span>
                    </div>

                    {challenge.isCustom && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(challenge)}
                          className="bg-white hover:bg-slate-100 text-slate-900 p-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                          title="Edit Challenge"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete challenge "${challenge.title}"?`)) {
                              deleteCustomChallenge(challenge.id);
                            }
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                          title="Delete Challenge"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* WORKOUTS CURRICULUM DISPLAY (All workout images, names, sets, reps) */}
              <div className="p-6 pt-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-red-600" />
                    Challenge Workout Curriculum ({challengeWorkouts.length} Exercises Included)
                  </h4>
                  <span className="text-[11px] font-bold text-slate-400">
                    All exercises with media visuals
                  </span>
                </div>

                {/* Grid of All Workout Images and Sets/Reps */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {challengeWorkouts.map((workout, idx) => (
                    <div
                      key={workout.id || idx}
                      className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-red-400 transition-all flex flex-col justify-between"
                    >
                      {/* Workout Image */}
                      <div className="relative h-28 bg-slate-900 overflow-hidden">
                        <img
                          src={workout.customMediaUrl || workout.gifUrl || workout.imageUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"}
                          alt={workout.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-1.5 left-1.5 bg-slate-950/80 text-white font-mono text-[9px] font-black px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </div>
                      </div>

                      {/* Workout Details */}
                      <div className="p-2.5 space-y-1">
                        <h5 className="font-extrabold text-xs text-slate-900 line-clamp-1 leading-tight" title={workout.name}>
                          {workout.name}
                        </h5>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                          <span className="text-slate-800">{workout.sets || "3"} Sets</span>
                          <span className="text-red-600 font-black">{workout.reps || "10-12"} Reps</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT CHALLENGE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-black uppercase text-red-600 tracking-wider">
                  Challenge Builder
                </span>
                <h3 className="text-xl font-black text-slate-900 uppercase">
                  {editingChallenge ? "Edit Challenge" : "Create New Fitness Challenge"}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 text-left">
              {/* Challenge Title */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Challenge Title *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., 30 Day Summer Shred Challenge"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Category & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    {CHALLENGE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Duration (Days)</label>
                  <select
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value={14}>14 Days Sprint</option>
                    <option value={30}>30 Days Challenge</option>
                    <option value={60}>60 Days Transformation</option>
                    <option value={90}>90 Days Mastery</option>
                  </select>
                </div>
              </div>

              {/* Goal / Description */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Goal & Focus Description</label>
                <textarea
                  rows={2}
                  value={formGoal}
                  onChange={(e) => {
                    setFormGoal(e.target.value);
                    setFormDescription(e.target.value);
                  }}
                  placeholder="e.g., Burn body fat while locking in lean muscular development."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Banner Image */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-black uppercase text-slate-700">Challenge Banner Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-xl bg-slate-900 overflow-hidden flex-shrink-0 border border-slate-200">
                    <img src={formImage} alt="Banner Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="Paste Image URL"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
                    />
                    <label className="inline-flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Upload Banner
                      <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Completer Badge Setup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Completer Badge Name</label>
                  <input
                    type="text"
                    value={formBadgeName}
                    onChange={(e) => setFormBadgeName(e.target.value)}
                    placeholder="e.g., Shred Gladiator"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Badge Color Scheme</label>
                  <select
                    value={formBadgeColor}
                    onChange={(e) => setFormBadgeColor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    {BADGE_COLORS.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* WORKOUTS SELECTION SECTION */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-900">
                      Challenge Workouts ({formWorkouts.length} Selected)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      All workouts display with full images, names, sets, and reps.
                    </p>
                  </div>
                </div>

                {/* Add Workout Picker */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex gap-2">
                    <select
                      value={selectedExToAdd}
                      onChange={(e) => setSelectedExToAdd(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value="">Select a workout from library to add...</option>
                      {exercises.map(ex => (
                        <option key={ex.id} value={ex.id}>
                          {ex.name} ({ex.category} • {ex.recommendedSets || '3'} Sets x {ex.recommendedReps || '10-12'} Reps)
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const match = exercises.find(e => e.id === selectedExToAdd);
                        if (match) {
                          handleAddExerciseToChallenge(match);
                          setSelectedExToAdd("");
                        }
                      }}
                      disabled={!selectedExToAdd}
                      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>

                {/* Selected Workouts Visual List */}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {formWorkouts.map((w, idx) => (
                    <div
                      key={w.id || idx}
                      className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-14 h-14 rounded-xl bg-slate-900 overflow-hidden flex-shrink-0 border border-slate-100">
                        <img
                          src={w.customMediaUrl || w.gifUrl || w.imageUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"}
                          alt={w.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Workout Name */}
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-black text-slate-900 truncate">{w.name}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">{w.category || "General"}</span>
                      </div>

                      {/* Custom Sets & Reps for this challenge */}
                      <div className="flex items-center gap-2">
                        <div className="w-20">
                          <label className="block text-[9px] font-black uppercase text-slate-400">Sets</label>
                          <input
                            type="text"
                            value={w.sets || "3-4"}
                            onChange={(e) => handleUpdateWorkoutSetsReps(w.id, e.target.value, w.reps || "10-12")}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 text-center"
                          />
                        </div>
                        <div className="w-20">
                          <label className="block text-[9px] font-black uppercase text-slate-400">Reps</label>
                          <input
                            type="text"
                            value={w.reps || "10-12"}
                            onChange={(e) => handleUpdateWorkoutSetsReps(w.id, w.sets || "3-4", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-red-600 text-center"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveWorkout(w.id)}
                          className="text-slate-400 hover:text-red-600 p-2 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChallenge}
                disabled={isSaving}
                className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {editingChallenge ? "Save Changes" : "Publish Challenge"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
