import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { auth } from "../lib/firebase";
import {
  Sparkles, Dumbbell, Play, CheckCircle2, Bookmark, BookmarkCheck,
  Award, ShieldAlert, Heart, Calendar, HelpCircle, RefreshCw, ChevronRight, Zap,
  Flame, Shield, Home, BookOpen, Clock, Copy, Check, Filter, Share2, Layers, Search
} from "lucide-react";
import {
  AIDailyWorkoutPlan,
  DailyWorkoutProgramType,
  DailyWorkoutExerciseItem,
  GenerateDailyWorkoutParams
} from "../types/dailyWorkout";
import {
  generateAIDailyWorkout,
  generateLocalFallbackDailyWorkout,
  PROGRAM_METADATA_CONFIG
} from "../services/dailyWorkoutAIService";
import { EXERCISES, Exercise } from "../data/exercises";
import LiveWorkoutPlayerModal from "./generator/LiveWorkoutPlayerModal";
import ExerciseSwapperModal from "./generator/ExerciseSwapperModal";
import MasterLibraryBrowserModal from "./generator/MasterLibraryBrowserModal";

interface WorkoutGeneratorViewProps {
  setView?: (view: string) => void;
}

export default function WorkoutGeneratorView({ setView }: WorkoutGeneratorViewProps) {
  const { user, toggleSaveWorkout, savedWorkouts, programProgress } = useApp();

  // Mode Selection
  const [activeTab, setActiveTab] = useState<"daily-generator" | "single-search">("daily-generator");

  // Daily Generator Form State
  const [selectedProgram, setSelectedProgram] = useState<DailyWorkoutProgramType>("immortal_90");
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedMuscle, setSelectedMuscle] = useState<string>("");
  const [fitnessLevel, setFitnessLevel] = useState<"Beginner" | "Intermediate" | "Advanced" | "Immortal">("Intermediate");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("All");
  const [selectedDuration, setSelectedDuration] = useState<number>(45);
  const [customFocusPrompt, setCustomFocusPrompt] = useState<string>("");
  const [isGeneratingDaily, setIsGeneratingDaily] = useState<boolean>(false);

  // Active Generated Daily Workout
  const [dailyWorkout, setDailyWorkout] = useState<AIDailyWorkoutPlan | null>(null);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  // Modals State
  const [isLivePlayerOpen, setIsLivePlayerOpen] = useState<boolean>(false);
  const [exerciseToSwap, setExerciseToSwap] = useState<DailyWorkoutExerciseItem | null>(null);
  const [isMasterLibraryOpen, setIsMasterLibraryOpen] = useState<boolean>(false);

  // Single Search Drill State (Preserved legacy generator)
  const [singleSearchQuery, setSingleSearchQuery] = useState("");
  const [isGeneratingSingle, setIsGeneratingSingle] = useState(false);
  const [singleGeneratedExercise, setSingleGeneratedExercise] = useState<Exercise | null>(null);

  // Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedRoutine, setCopiedRoutine] = useState(false);
  const [aiTweakPrompt, setAiTweakPrompt] = useState("");
  const [isTweaking, setIsTweaking] = useState(false);

  // Load initial daily workout on mount
  useEffect(() => {
    // Check if user has active program progress
    if (programProgress) {
      const progressList = Object.values(programProgress);
      if (progressList.length > 0) {
        const active = progressList.find(p => p.enrolled);
        if (active) {
          if (active.programId.includes("immortal")) {
            setSelectedProgram("immortal_90");
            setSelectedDay(active.currentDay || 1);
          } else if (active.programId.includes("women")) {
            setSelectedProgram("women_confidence");
            setSelectedDay(active.currentDay || 1);
          } else if (active.programId.includes("belly")) {
            setSelectedProgram("belly_fat_shred");
            setSelectedDay(active.currentDay || 1);
          } else if (active.programId.includes("home")) {
            setSelectedProgram("home_workout");
            setSelectedDay(active.currentDay || 1);
          }
        }
      }
    }

    // Generate initial workout seamlessly
    const initial = generateLocalFallbackDailyWorkout({
      programType: "immortal_90",
      dayNumber: 1,
      duration: 45,
      fitnessLevel: "Intermediate"
    });
    setDailyWorkout(initial);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Generate Daily Workout with AI
  const handleGenerateDailyWorkout = async (overridePrompt?: string) => {
    setIsGeneratingDaily(true);
    setToastMessage(null);

    const promptToUse = overridePrompt || customFocusPrompt;

    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      const params: GenerateDailyWorkoutParams = {
        programType: selectedProgram,
        dayNumber: selectedDay,
        targetMuscle: selectedMuscle,
        fitnessLevel,
        equipment: selectedEquipment,
        duration: selectedDuration,
        customFocusPrompt: promptToUse
      };

      const result = await generateAIDailyWorkout(params, token);
      setDailyWorkout(result);
      triggerToast(`AI Generated Day ${selectedDay} Workout for ${result.programName}!`);
    } catch (err: any) {
      console.warn("AI generation failed, launching clinical local generator:", err);
      const fallback = generateLocalFallbackDailyWorkout({
        programType: selectedProgram,
        dayNumber: selectedDay,
        targetMuscle: selectedMuscle,
        fitnessLevel,
        equipment: selectedEquipment,
        duration: selectedDuration,
        customFocusPrompt: promptToUse
      });
      setDailyWorkout(fallback);
      triggerToast(`Daily workout generated from 237 Master GIF Library!`);
    } finally {
      setIsGeneratingDaily(false);
      setIsTweaking(false);
    }
  };

  // AI Tweak Handler
  const handleAiTweak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTweakPrompt.trim()) return;
    setIsTweaking(true);
    const combinedPrompt = `${customFocusPrompt ? customFocusPrompt + ". " : ""}User Modification: ${aiTweakPrompt}`;
    handleGenerateDailyWorkout(combinedPrompt);
    setAiTweakPrompt("");
  };

  // Single Search Drill Generator Handler
  const handleGenerateSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleSearchQuery.trim()) return;

    setIsGeneratingSingle(true);
    setSingleGeneratedExercise(null);

    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      const response = await fetch("/api/gemini/generate-search-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ workoutName: singleSearchQuery })
      });

      const data = await response.json();
      if (data.success && data.exercise) {
        setSingleGeneratedExercise(data.exercise);
        triggerToast(`"${data.exercise.name}" generated with full biomechanics!`);
      } else {
        throw new Error(data.error || "Failed to formulate mechanics");
      }
    } catch (err: any) {
      triggerToast(`Notice: Generated fallback biomechanics for ${singleSearchQuery}`);
    } finally {
      setIsGeneratingSingle(false);
    }
  };

  // Handle Exercise Swap
  const handleApplySwap = (newEx: DailyWorkoutExerciseItem) => {
    if (!dailyWorkout || !exerciseToSwap) return;

    const updatedExercises = dailyWorkout.exercises.map(ex => {
      if (ex.id === exerciseToSwap.id || ex.name.toLowerCase() === exerciseToSwap.name.toLowerCase()) {
        return newEx;
      }
      return ex;
    });

    setDailyWorkout({
      ...dailyWorkout,
      exercises: updatedExercises
    });

    setExerciseToSwap(null);
    triggerToast(`Swapped in "${newEx.name}" with verified GIF!`);
  };

  // Copy full workout to clipboard
  const handleCopyWorkout = () => {
    if (!dailyWorkout) return;

    const text = `🔥 ${dailyWorkout.title}\n` +
      `Program: ${dailyWorkout.programName} (Day ${dailyWorkout.dayNumber})\n` +
      `Estimated Burn: ${dailyWorkout.estimatedCalories} • ${dailyWorkout.estimatedMinutes} Minutes\n\n` +
      `Coach Alex Directive: ${dailyWorkout.coachingBrief}\n\n` +
      `WARM-UP:\n` +
      dailyWorkout.warmup.map(w => `• ${w.name} (${w.durationOrReps}) - ${w.instructions}`).join("\n") +
      `\n\nMAIN CIRCUIT (237 Master GIF Library):\n` +
      dailyWorkout.exercises.map((e, i) => `${i + 1}. ${e.name} - ${e.sets} Sets x ${e.reps} (Rest: ${e.restSeconds}s, Tempo: ${e.tempo || "3-0-1-0"})\n   Cue: ${e.coachingCues}`).join("\n") +
      `\n\nCOOL-DOWN & RECOVERY:\n` +
      dailyWorkout.cooldown.map(c => `• ${c.name} (${c.duration}) - ${c.instructions}`).join("\n") +
      `\n\nNUTRITION FUEL: ${dailyWorkout.nutritionTip}\n` +
      `Generated by AlexFitnessHub AI Engine`;

    navigator.clipboard.writeText(text);
    setCopiedRoutine(true);
    triggerToast("Full workout plan copied to clipboard!");
    setTimeout(() => setCopiedRoutine(false), 3000);
  };

  // Check if active workout is bookmarked
  const isWorkoutBookmarked = dailyWorkout ? savedWorkouts.includes(dailyWorkout.id) : false;

  const handleBookmarkToggle = () => {
    if (!dailyWorkout) return;
    toggleSaveWorkout(dailyWorkout.id);
    triggerToast(isWorkoutBookmarked ? "Removed from saved workouts" : "Saved to your workout collection!");
  };

  // Direct Program Navigation
  const handleNavigateToProgram = (progType: DailyWorkoutProgramType) => {
    if (!setView) return;
    if (progType === "immortal_90") setView("challenges");
    else if (progType === "women_confidence") setView("women-confidence");
    else if (progType === "belly_fat_shred") setView("belly-fat-shred");
    else if (progType === "home_workout") setView("home-challenge");
    else if (progType === "lifestyle_academy") setView("academy");
    else setView("library");
  };

  const currentProgConfig = PROGRAM_METADATA_CONFIG[selectedProgram] || PROGRAM_METADATA_CONFIG.immortal_90;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-slate-900 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-slide-down border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-[10px] font-mono font-black tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 uppercase">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>AI Daily Workout Engine</span>
          <span className="w-1 h-1 rounded-full bg-emerald-400" />
          <span>237 Master GIF Workouts</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-sans tracking-tight text-slate-900">
          Daily AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Workout Generator</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed max-w-2xl mx-auto">
          Intelligently synthesize complete daily training sessions for the <strong>90 Days Immortal</strong>, <strong>Women Confidence</strong>, <strong>5-Month Belly Fat Shred</strong>, <strong>Lifestyle Academy</strong>, or <strong>Home Challenge</strong>. Every movement features verified animated GIFs and clinical kinesiology cues.
        </p>

        {/* Quick Nav Switcher */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab("daily-generator")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 font-sans ${
              activeTab === "daily-generator"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>AI Daily Program Generator</span>
          </button>

          <button
            onClick={() => setIsMasterLibraryOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-sans"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Explore 237 GIF Library</span>
          </button>

          <button
            onClick={() => setActiveTab("single-search")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 font-sans ${
              activeTab === "single-search"
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Single Drill Search</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODE 1: COMPLETE AI DAILY WORKOUT GENERATOR */}
      {/* ===================================================================== */}
      {activeTab === "daily-generator" && (
        <div className="space-y-8">
          {/* Controls & Configuration Panel */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs font-mono">
                  01
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Select Target Program or Challenge</h3>
                  <p className="text-[11px] text-slate-400">Choose from flagship programs or synthesize a custom split</p>
                </div>
              </div>

              {setView && (
                <button
                  onClick={() => handleNavigateToProgram(selectedProgram)}
                  className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <span>Open Full Program Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Program Selection Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "immortal_90", name: "90 Days Immortal", badge: "Flagship 90 Days", icon: Shield, color: "hover:border-amber-500" },
                { id: "women_confidence", name: "Women Confidence", badge: "180 Days Women", icon: Sparkles, color: "hover:border-pink-500" },
                { id: "belly_fat_shred", name: "5-Month Belly Fat", badge: "5 Mo Core Shred", icon: Flame, color: "hover:border-orange-500" },
                { id: "home_workout", name: "Home Workout 180", badge: "Zero Equipment", icon: Home, color: "hover:border-emerald-500" },
                { id: "lifestyle_academy", name: "Lifestyle Academy", badge: "12-Week Splits", icon: BookOpen, color: "hover:border-indigo-500" },
                { id: "gym_hypertrophy", name: "Gym Muscle Power", badge: "PPL Overload", icon: Dumbbell, color: "hover:border-slate-600" },
                { id: "cardio_calisthenics", name: "Cardio & Calisthenics", badge: "Tactical Stamina", icon: Zap, color: "hover:border-green-500" },
                { id: "custom", name: "Custom Target Split", badge: "AI Synthesis", icon: Sparkles, color: "hover:border-purple-500" }
              ].map(prog => {
                const isSelected = selectedProgram === prog.id;
                const Icon = prog.icon;
                return (
                  <button
                    key={prog.id}
                    onClick={() => {
                      setSelectedProgram(prog.id as any);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-blue-500 scale-[1.02]"
                        : `bg-slate-50 text-slate-700 border-slate-200 ${prog.color} hover:bg-white`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-4 h-4 ${isSelected ? "text-blue-400" : "text-slate-500"}`} />
                      <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                        isSelected ? "bg-white/10 text-white" : "bg-slate-200/60 text-slate-600"
                      }`}>
                        {prog.badge}
                      </span>
                    </div>
                    <span className="text-xs font-black tracking-tight leading-tight block">
                      {prog.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Secondary Parameter Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
              {/* Day Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                  Workout Day Number (1 - {currentProgConfig.defaultDays})
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={currentProgConfig.defaultDays}
                    value={selectedDay}
                    onChange={e => setSelectedDay(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => setSelectedDay(prev => Math.min(currentProgConfig.defaultDays, prev + 1))}
                    className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold font-mono"
                  >
                    +1
                  </button>
                </div>
              </div>

              {/* Target Muscle Focus */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                  Target Muscle Focus
                </label>
                <select
                  value={selectedMuscle}
                  onChange={e => setSelectedMuscle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Program Prescribed Split</option>
                  <option value="Chest & Triceps">Chest & Triceps</option>
                  <option value="Back & Biceps">Back & Biceps</option>
                  <option value="Legs & Glutes">Legs & Glutes</option>
                  <option value="Shoulders & Arms">Shoulders & Arms</option>
                  <option value="Core, Abs & Visceral Belly Fat">Core, Abs & Visceral Belly Fat</option>
                  <option value="Full Body Conditioning">Full Body Conditioning</option>
                  <option value="Glutes & Waist Trimming">Glutes & Waist Trimming</option>
                  <option value="Cardio & Aerobic Endurance">Cardio & Aerobic Endurance</option>
                </select>
              </div>

              {/* Equipment Available */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                  Equipment Available
                </label>
                <select
                  value={selectedEquipment}
                  onChange={e => setSelectedEquipment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="All">Full Gym Equipment</option>
                  <option value="Dumbbells">Dumbbells & Bench</option>
                  <option value="Resistance Bands">Resistance Bands</option>
                  <option value="Bodyweight">Bodyweight / No Equipment</option>
                </select>
              </div>

              {/* Duration & Fitness Level */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                  Duration & Intensity
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    value={selectedDuration}
                    onChange={e => setSelectedDuration(parseInt(e.target.value) || 45)}
                    className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans font-bold text-slate-800"
                  >
                    <option value={15}>15m Express</option>
                    <option value={30}>30m Short</option>
                    <option value={45}>45m Standard</option>
                    <option value={60}>60m Heavy</option>
                  </select>

                  <select
                    value={fitnessLevel}
                    onChange={e => setFitnessLevel(e.target.value as any)}
                    className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans font-bold text-slate-800"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Immortal">Immortal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Custom Focus Prompt Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                Coach Alex Form Guidance / Special Constraints (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 'Focus on glute contraction and knee-friendly squats', 'Heavy chest press and triceps burn', 'Visceral belly fat HIIT'..."
                value={customFocusPrompt}
                onChange={e => setCustomFocusPrompt(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-sans shadow-inner"
              />
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-slate-400 font-mono">
                ⚡ Grounded in 237 verified admin exercises with video GIF demonstrations
              </span>

              <button
                onClick={() => handleGenerateDailyWorkout()}
                disabled={isGeneratingDaily}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isGeneratingDaily ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Day {selectedDay} Biomechanics...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>Generate AI Day {selectedDay} Workout</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Loading Skeletal State */}
          {isGeneratingDaily && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-slate-200 rounded-md w-1/3" />
                  <div className="h-3 bg-slate-200 rounded-md w-1/4" />
                </div>
              </div>
              <div className="h-16 bg-slate-100 rounded-2xl" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-44 bg-slate-100 rounded-2xl" />
                ))}
              </div>
            </div>
          )}

          {/* ACTIVE GENERATED DAILY WORKOUT DISPLAY */}
          {dailyWorkout && !isGeneratingDaily && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-slide-down space-y-0">
              {/* Header Hero Banner */}
              <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-extrabold uppercase px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      {dailyWorkout.programName}
                    </span>
                    <span className="text-[10px] font-mono font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Day {dailyWorkout.dayNumber} Protocol
                    </span>
                    <span className="text-[10px] font-mono text-slate-300">
                      {dailyWorkout.fitnessLevel} Level
                    </span>
                  </div>

                  {/* Actions Header Toolbar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBookmarkToggle}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                        isWorkoutBookmarked
                          ? "bg-amber-500 text-white border-amber-400"
                          : "bg-white/10 text-white border-white/10 hover:bg-white/20"
                      }`}
                      title="Bookmark Workout"
                    >
                      {isWorkoutBookmarked ? <BookmarkCheck className="w-4 h-4 text-white" /> : <Bookmark className="w-4 h-4" />}
                      <span className="hidden sm:inline">{isWorkoutBookmarked ? "Saved" : "Save"}</span>
                    </button>

                    <button
                      onClick={handleCopyWorkout}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold transition flex items-center gap-1.5"
                      title="Copy Routine"
                    >
                      {copiedRoutine ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span className="hidden sm:inline">{copiedRoutine ? "Copied!" : "Copy"}</span>
                    </button>

                    <button
                      onClick={() => setIsLivePlayerOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-black uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-blue-500/30 active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Workout</span>
                    </button>
                  </div>
                </div>

                {/* Workout Title & Tagline */}
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {dailyWorkout.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                    {dailyWorkout.tagline}
                  </p>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">Duration</span>
                      <span className="text-xs font-extrabold text-white">{dailyWorkout.estimatedMinutes} Minutes</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">Est. Caloric Burn</span>
                      <span className="text-xs font-extrabold text-white">{dailyWorkout.estimatedCalories}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">Total Drills</span>
                      <span className="text-xs font-extrabold text-white">{dailyWorkout.exercises.length} Movements</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">Visual Media</span>
                      <span className="text-xs font-extrabold text-emerald-300">100% Admin GIFs</span>
                    </div>
                  </div>
                </div>

                {/* Coach Alex Personal Daily Briefing */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 mt-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="font-mono font-bold uppercase text-blue-300 tracking-wider block text-[10px]">
                      Coach Alex Daily Directive
                    </span>
                    <p className="text-slate-200 leading-relaxed font-sans italic">
                      "{dailyWorkout.coachingBrief}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Content Body */}
              <div className="p-6 sm:p-8 space-y-8 bg-white">
                {/* 1. Dynamic Warm-Up Protocol */}
                {dailyWorkout.warmup && dailyWorkout.warmup.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-mono font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Phase 1: Dynamic Warm-Up & Neural Priming
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">3-5 Minutes</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {dailyWorkout.warmup.map((warm, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">
                              {warm.durationOrReps}
                            </span>
                          </div>
                          <h4 className="text-xs font-black text-slate-900">{warm.name}</h4>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{warm.instructions}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Main Resistance & Conditioning Circuit (Grounded in 237 GIF Library) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-mono font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      Phase 2: Master Exercise Circuit ({dailyWorkout.exercises.length} Drills with Animated GIFs)
                    </h3>

                    <button
                      onClick={() => setIsMasterLibraryOpen(true)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Browse 237 Library</span>
                    </button>
                  </div>

                  {/* Exercise Cards List */}
                  <div className="space-y-4">
                    {dailyWorkout.exercises.map((exercise, index) => {
                      const isExpanded = expandedExerciseId === exercise.id;

                      return (
                        <div
                          key={exercise.id || index}
                          className="rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-sm overflow-hidden"
                        >
                          <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            {/* Left: GIF Thumbnail & Metadata */}
                            <div className="flex items-center gap-4 flex-1">
                              {/* Animated GIF Thumbnail */}
                              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950 overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-inner">
                                {exercise.gifUrl ? (
                                  <img
                                    src={exercise.gifUrl}
                                    alt={exercise.name}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                  />
                                ) : (
                                  <Dumbbell className="w-6 h-6 text-slate-600" />
                                )}
                                <span className="absolute bottom-1 right-1 text-[8px] font-mono font-bold px-1 rounded bg-black/70 text-white">
                                  GIF
                                </span>
                              </div>

                              {/* Titles & Specs */}
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[9px] font-mono font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                    {exercise.targetMuscle}
                                  </span>
                                  <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                    {exercise.equipment.join(", ") || "Bodyweight"}
                                  </span>
                                  {exercise.tempo && (
                                    <span className="text-[9px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                                      Tempo: {exercise.tempo}
                                    </span>
                                  )}
                                </div>

                                <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                                  {index + 1}. {exercise.name}
                                </h4>

                                <p className="text-xs text-slate-500 font-sans line-clamp-2">
                                  <strong className="text-slate-700">Coach Cue: </strong>
                                  {exercise.coachingCues}
                                </p>
                              </div>
                            </div>

                            {/* Center/Right: Sets, Reps, Rest & Actions */}
                            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                              {/* Volume Pill */}
                              <div className="text-right sm:pr-2">
                                <span className="text-sm sm:text-base font-black text-slate-900 font-mono block">
                                  {exercise.sets} Sets × {exercise.reps}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  Rest: {exercise.restSeconds}s
                                </span>
                              </div>

                              {/* Swap Button */}
                              <button
                                onClick={() => setExerciseToSwap(exercise)}
                                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1"
                                title="Swap this exercise with another from the 237 library"
                              >
                                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                                <span className="hidden sm:inline">Swap</span>
                              </button>

                              {/* Expand Biomechanics Details */}
                              <button
                                onClick={() => setExpandedExerciseId(isExpanded ? null : exercise.id)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                                  isExpanded
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                              >
                                <span>{isExpanded ? "Hide Form" : "View Form"}</span>
                              </button>
                            </div>
                          </div>

                          {/* Expandable Biomechanics Accordion */}
                          {isExpanded && (
                            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-4 animate-fade-in text-xs">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                                  <span className="text-[10px] font-mono font-bold uppercase text-blue-600 block">
                                    1. Starting Position Setup
                                  </span>
                                  <p className="text-slate-700 leading-relaxed">
                                    {exercise.startingPosition || "Align feet, brace core and establish joint tension."}
                                  </p>
                                </div>

                                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                                  <span className="text-[10px] font-mono font-bold uppercase text-blue-600 block">
                                    2. Movement Execution
                                  </span>
                                  <p className="text-slate-700 leading-relaxed">
                                    {exercise.movementExecution || "Drive with target muscle group through full active range."}
                                  </p>
                                </div>

                                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                                  <span className="text-[10px] font-mono font-bold uppercase text-blue-600 block">
                                    3. Finishing Position & Control
                                  </span>
                                  <p className="text-slate-700 leading-relaxed">
                                    {exercise.finishingPosition || "Complete repetition under smooth eccentric decelerating control."}
                                  </p>
                                </div>
                              </div>

                              {/* Common Mistakes & Safety Tips */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 space-y-1">
                                  <span className="text-[10px] font-mono font-bold uppercase text-orange-700 block">
                                    Avoid These Common Mistakes:
                                  </span>
                                  <ul className="list-disc pl-4 space-y-1 text-orange-900">
                                    {(exercise.commonMistakes || ["Rushing the negative.", "Arching the lumbar spine."]).map((m, i) => (
                                      <li key={i}>{m}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 block">
                                    Clinical Safety Precaution:
                                  </span>
                                  <ul className="list-disc pl-4 space-y-1 text-emerald-900">
                                    {(exercise.safetyTips || ["Breathe rhythmically.", "Stop if sharp pain occurs."]).map((s, i) => (
                                      <li key={i}>{s}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Cool-Down & Recovery Protocol */}
                {dailyWorkout.cooldown && dailyWorkout.cooldown.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-mono font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-teal-500" />
                        Phase 3: Cool-Down & Tissue Decompression
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">3-5 Minutes</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {dailyWorkout.cooldown.map((cool, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-1">
                          <span className="text-[10px] font-mono font-bold text-teal-700 uppercase">
                            {cool.duration}
                          </span>
                          <h4 className="text-xs font-black text-slate-900">{cool.name}</h4>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{cool.instructions}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Nutrition & Hydration Directive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-800 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      Post-Workout Fuel Strategy
                    </span>
                    <p className="text-xs text-amber-950 leading-relaxed font-sans">
                      {dailyWorkout.nutritionTip}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-800 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-blue-600" />
                      Hydration & Recovery Target
                    </span>
                    <p className="text-xs text-blue-950 leading-relaxed font-sans">
                      {dailyWorkout.hydrationTip}
                    </p>
                  </div>
                </div>

                {/* 5. Tweak Routine with AI Input */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                    <span className="text-xs font-black text-slate-900">Want to tweak today's routine with AI?</span>
                  </div>
                  <form onSubmit={handleAiTweak} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 'Replace squats with Bulgarian split squats', 'Make it dumbbell only', 'Add 2 core drills'..."
                      value={aiTweakPrompt}
                      onChange={e => setAiTweakPrompt(e.target.value)}
                      disabled={isTweaking}
                      className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-sans"
                    />
                    <button
                      type="submit"
                      disabled={isTweaking || !aiTweakPrompt.trim()}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 disabled:opacity-40"
                    >
                      {isTweaking ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>Update Routine</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span>Day {dailyWorkout.dayNumber} Complete?</span>
                  <button
                    onClick={() => {
                      setSelectedDay(prev => prev + 1);
                      handleGenerateDailyWorkout();
                    }}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Advance to Day {selectedDay + 1} →
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setIsMasterLibraryOpen(true)}
                    className="flex-1 sm:flex-none px-4 py-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl transition"
                  >
                    Browse 237 GIFs
                  </button>

                  <button
                    onClick={() => setIsLivePlayerOpen(true)}
                    className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Interactive Workout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODE 2: SINGLE EXERCISE DRILL GENERATOR & SEARCH (PRESERVED) */}
      {/* ===================================================================== */}
      {activeTab === "single-search" && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
            <form onSubmit={handleGenerateSingle} className="space-y-4">
              <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Enter Any Kind of Specific Movement or Drill
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g., 'Kettlebell snatch to overhead lunge', 'Spanish squat holds', 'Clapping pushups'..."
                    value={singleSearchQuery}
                    disabled={isGeneratingSingle}
                    onChange={e => setSingleSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-blue-500 placeholder:text-slate-400 font-sans shadow-inner transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isGeneratingSingle || !singleSearchQuery.trim()}
                  className="bg-blue-600 text-white font-bold font-sans text-xs uppercase px-6 py-3.5 rounded-2xl hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                >
                  {isGeneratingSingle ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Formulating Drill...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span>Generate Drill</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase select-none">
                AI Quick Presets:
              </span>
              {[
                "Kettlebell Windmill",
                "Sissy Squats",
                "Pike Push Up Progression",
                "Hanging Windshield Wipers",
                "Barbell Hip Thrust"
              ].map(term => (
                <button
                  key={term}
                  onClick={() => setSingleSearchQuery(term)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] rounded-lg font-sans text-slate-600 transition"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Single Drill Result */}
          {singleGeneratedExercise && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-slide-down">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {singleGeneratedExercise.category}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                    {singleGeneratedExercise.name}
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {singleGeneratedExercise.difficulty} Level
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">1. Setup</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{singleGeneratedExercise.startingPosition}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">2. Execution</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{singleGeneratedExercise.movementExecution}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">3. Finish</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{singleGeneratedExercise.finishingPosition}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODALS */}
      {/* ===================================================================== */}

      {/* 1. Live Workout Player Modal */}
      {isLivePlayerOpen && dailyWorkout && (
        <LiveWorkoutPlayerModal
          workout={dailyWorkout}
          onClose={() => setIsLivePlayerOpen(false)}
          onWorkoutCompleted={stats => {
            triggerToast(`🎉 Workout completed and logged! Est burn: ${stats.estimatedCalories}`);
          }}
        />
      )}

      {/* 2. Exercise Swapper Modal */}
      {exerciseToSwap && (
        <ExerciseSwapperModal
          currentExercise={exerciseToSwap}
          programType={selectedProgram}
          onClose={() => setExerciseToSwap(null)}
          onSwapSelected={handleApplySwap}
        />
      )}

      {/* 3. Master 237 GIF Library Explorer Modal */}
      {isMasterLibraryOpen && (
        <MasterLibraryBrowserModal
          onClose={() => setIsMasterLibraryOpen(false)}
          onAddExerciseToRoutine={newItem => {
            if (dailyWorkout) {
              setDailyWorkout({
                ...dailyWorkout,
                exercises: [...dailyWorkout.exercises, newItem]
              });
              triggerToast(`Added "${newItem.name}" to today's workout!`);
            }
          }}
        />
      )}
    </div>
  );
}
