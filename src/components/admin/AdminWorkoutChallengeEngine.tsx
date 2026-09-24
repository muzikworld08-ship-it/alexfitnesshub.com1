import React, { useState, useMemo, useEffect, useCallback } from "react";
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Search, Filter, 
  Layers, Dumbbell, Calendar, RefreshCw, Eye, Edit3, Trash2, 
  Plus, Save, Check, ExternalLink, HelpCircle, ArrowRightLeft,
  Activity, Flame, Clock, Compass, ShieldAlert, Sparkles,
  GripVertical, ChevronUp, ChevronDown, Repeat, Footprints,
  Sliders, ArrowUpRight, Zap, Info
} from "lucide-react";
import { ProgramId, ChallengeExerciseItem, ValidationError } from "../../types/challengeEngine";
import { 
  CHALLENGE_PROGRAMS_METADATA, 
  getWorkoutForProgramAndDay,
  normalizeProgramId 
} from "../../data/challengeEngineDatabase";
import { getExerciseGifUrl, Exercise } from "../../data/exercises";
import { ChallengeValidationService } from "../../services/challengeValidationService";
import { useApp } from "../../context/AppContext";
import { auth } from "../../lib/firebase";
import DeleteWorkoutConfirmModal, { DeleteWorkoutTarget } from "./DeleteWorkoutConfirmModal";
import ExerciseReplacementModal from "./ExerciseReplacementModal";
import AddWorkoutModal from "./AddWorkoutModal";
import UnifiedExerciseMedia from "../UnifiedExerciseMedia";

interface CardioProtocolState {
  isCardio: boolean;
  type: string;
  distance: string;
  durationMinutes: number;
  guidelines: string;
}

// 7-Day Canonical Immortal Standard Splits
const IMMORTAL_7_DAY_CANONICAL: Record<number, { title: string; focus: string; muscles: string[]; isCardio: boolean; cardioKm?: string }> = {
  1: { title: "Day 1: Chest and Triceps Hypertrophy", focus: "Chest and Triceps", muscles: ["Pectoralis Major", "Triceps Brachii", "Anterior Deltoids"], isCardio: false },
  2: { title: "Day 2: Back and Biceps Pull Power", focus: "Back and Biceps", muscles: ["Latissimus Dorsi", "Biceps Brachii", "Rhomboids", "Rear Delts"], isCardio: false },
  3: { title: "Day 3: Dedicated Cardio & Mobility Protocol", focus: "Cardio and Mobility", muscles: ["Cardiovascular System", "Legs", "Joints"], isCardio: true, cardioKm: "5.0 - 10.0 KM" },
  4: { title: "Day 4: Legs and Shoulders Compound Force", focus: "Legs and Shoulders", muscles: ["Quadriceps", "Hamstrings", "Deltoids", "Calves"], isCardio: false },
  5: { title: "Day 5: Chest, Triceps and Forearms Grip & Density", focus: "Chest, Triceps and Forearms", muscles: ["Chest", "Triceps", "Forearms", "Grip Strength"], isCardio: false },
  6: { title: "Day 6: Back, Biceps and Core Structural Integrity", focus: "Back, Biceps and Core", muscles: ["Back", "Biceps", "Abdominals", "Obliques"], isCardio: false },
  7: { title: "Day 7: Rest, Recovery & Aerobic Flush Cardio", focus: "Rest and Recovery", muscles: ["Cardiovascular Flush", "Full Body Recovery"], isCardio: true, cardioKm: "5.0 - 10.0 KM" }
};

export default function AdminWorkoutChallengeEngine() {
  const { exercises: libraryExercises, allChallenges, user } = useApp();

  // Selected Program & Mode
  const [selectedProgramId, setSelectedProgramId] = useState<string>("immortal_90");
  const [viewMode, setViewMode] = useState<"cycle" | "day">("cycle");
  const [selectedCycleDay, setSelectedCycleDay] = useState<number>(1);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [applyToAllCycleWeeks, setApplyToAllCycleWeeks] = useState<boolean>(true);

  // Overrides Cache
  const [serverOverrides, setServerOverrides] = useState<Record<string, any>>({});
  const [isLoadingOverrides, setIsLoadingOverrides] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Modals State
  const [targetToDelete, setTargetToDelete] = useState<ChallengeExerciseItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  const [targetToReplace, setTargetToReplace] = useState<ChallengeExerciseItem | null>(null);
  const [isReplacing, setIsReplacing] = useState<boolean>(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingExercise, setEditingExercise] = useState<ChallengeExerciseItem | null>(null);

  // Cardio State
  const [cardioState, setCardioState] = useState<CardioProtocolState>({
    isCardio: false,
    type: "Zone 2 Outdoor Running",
    distance: "5.0 - 10.0 KM",
    durationMinutes: 45,
    guidelines: "Maintain steady conversational aerobic rhythm. Strict rule: Zero weight training or heavy resistance today."
  });

  // Split Meta Editing
  const [splitTitle, setSplitTitle] = useState<string>("");
  const [splitCategory, setSplitCategory] = useState<string>("");
  const [splitMuscles, setSplitMuscles] = useState<string>("");

  // Validation State
  const [validationReports, setValidationReports] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [auditTimestamp, setAuditTimestamp] = useState<string | null>(null);

  // Load Overrides from Server & LocalStorage
  const refreshOverrides = useCallback(async () => {
    setIsLoadingOverrides(true);
    try {
      const res = await fetch("/api/admin/programs/overrides");
      if (res.ok) {
        const data = await res.json();
        if (data.overrides) {
          setServerOverrides(data.overrides);
          localStorage.setItem("fit_program_schedule_overrides", JSON.stringify(data.overrides));
        }
      } else {
        const cached = localStorage.getItem("fit_program_schedule_overrides");
        if (cached) setServerOverrides(JSON.parse(cached));
      }
    } catch (err) {
      console.error("Failed fetching program schedule overrides:", err);
      const cached = localStorage.getItem("fit_program_schedule_overrides");
      if (cached) setServerOverrides(JSON.parse(cached));
    } finally {
      setIsLoadingOverrides(false);
    }
  }, []);

  useEffect(() => {
    refreshOverrides();
  }, [refreshOverrides]);

  // Current effective day number to query
  const effectiveDayNumber = useMemo(() => {
    if (viewMode === "cycle") {
      return selectedCycleDay;
    }
    return selectedDayNumber;
  }, [viewMode, selectedCycleDay, selectedDayNumber]);

  // Program Metadata
  const currentProgramMeta = useMemo(() => {
    const defaultMeta = CHALLENGE_PROGRAMS_METADATA[selectedProgramId as ProgramId];
    if (defaultMeta) return defaultMeta;
    
    // Check custom challenges
    const customMatch = (allChallenges || []).find((c: any) => c.id === selectedProgramId || c.challengeId === selectedProgramId);
    if (customMatch) {
      return {
        id: selectedProgramId as any,
        name: customMatch.title || "Custom Challenge",
        totalDays: (customMatch as any).totalDays || (customMatch as any).durationDays || 90,
        category: customMatch.category || "Specialized Training",
        targetAudience: "All Fitness Levels"
      };
    }

    return {
      id: selectedProgramId as any,
      name: selectedProgramId.replace(/_/g, " ").toUpperCase(),
      totalDays: 90,
      category: "Specialized Training",
      targetAudience: "All Athletes"
    };
  }, [selectedProgramId, allChallenges]);

  // Base day plan from challenge engine
  const baseDayPlan = useMemo(() => {
    return getWorkoutForProgramAndDay(selectedProgramId as ProgramId, effectiveDayNumber);
  }, [selectedProgramId, effectiveDayNumber]);

  // Check if override exists for this day or cycle
  const currentDayOverride = useMemo(() => {
    const progOverrides = serverOverrides[selectedProgramId] || serverOverrides[normalizeProgramId(selectedProgramId)] || {};
    const cycleKey = `cycle_${((effectiveDayNumber - 1) % 7) + 1}`;
    return progOverrides[String(effectiveDayNumber)] || progOverrides[cycleKey] || null;
  }, [serverOverrides, selectedProgramId, effectiveDayNumber]);

  // Active exercises list
  const activeExercises = useMemo(() => {
    if (currentDayOverride && Array.isArray(currentDayOverride.exercises)) {
      return currentDayOverride.exercises;
    }
    return baseDayPlan.exercises || [];
  }, [currentDayOverride, baseDayPlan]);

  // Sync state whenever selected day, cycle, or override changes
  useEffect(() => {
    const isCardio = currentDayOverride?.isCardioOnly !== undefined 
      ? currentDayOverride.isCardioOnly 
      : !!baseDayPlan.meta.isCardioOnly;

    const cardioDist = currentDayOverride?.cardioDistance || baseDayPlan.meta.cardioDistance || "5.0 - 10.0 KM";

    setCardioState({
      isCardio,
      type: currentDayOverride?.cardioType || (baseDayPlan.meta as any).cardioType || "Zone 2 Outdoor Running",
      distance: cardioDist,
      durationMinutes: typeof currentDayOverride?.estimatedDuration === "number" ? currentDayOverride.estimatedDuration : 45,
      guidelines: currentDayOverride?.coachingNotes || (baseDayPlan.meta as any).cardioGuidelines || "Maintain steady conversational aerobic rhythm. Strict rule: Zero weight training today."
    });

    const canonical = IMMORTAL_7_DAY_CANONICAL[((effectiveDayNumber - 1) % 7) + 1];
    setSplitTitle(currentDayOverride?.title || baseDayPlan.meta.title || canonical?.title || `Day ${effectiveDayNumber} Workout`);
    setSplitCategory(currentDayOverride?.category || currentDayOverride?.focus || baseDayPlan.meta.category || canonical?.focus || "Custom Split");
    setSplitMuscles(Array.isArray(baseDayPlan.meta.targetMuscles) ? baseDayPlan.meta.targetMuscles.join(", ") : canonical?.muscles?.join(", ") || "Target Muscles");
  }, [selectedProgramId, effectiveDayNumber, currentDayOverride, baseDayPlan]);

  // Broadcast and persist changes helper
  const broadcastOverridesUpdated = (updatedOverrides: Record<string, any>) => {
    localStorage.setItem("fit_program_schedule_overrides", JSON.stringify(updatedOverrides));
    window.dispatchEvent(new CustomEvent("fit_schedule_overrides_updated", { detail: { programId: selectedProgramId } }));
  };

  // Reorder Exercises Handler
  const handleReorderExercises = async (newExercises: ChallengeExerciseItem[]) => {
    // Optimistic UI update
    setServerOverrides(prev => {
      const next = { ...prev };
      const pid = selectedProgramId;
      if (!next[pid]) next[pid] = {};
      const dayKey = String(effectiveDayNumber);
      const cycleKey = `cycle_${((effectiveDayNumber - 1) % 7) + 1}`;
      
      const updatedDayData = {
        ...(next[pid][dayKey] || next[pid][cycleKey] || {}),
        title: splitTitle,
        category: splitCategory,
        focus: splitCategory,
        isCardioOnly: cardioState.isCardio,
        cardioDistance: cardioState.distance,
        exercises: newExercises
      };

      next[pid][dayKey] = updatedDayData;
      if (viewMode === "cycle" || applyToAllCycleWeeks) {
        next[pid][cycleKey] = updatedDayData;
      }
      broadcastOverridesUpdated(next);
      return next;
    });

    try {
      const token = await auth.currentUser?.getIdToken().catch(() => null);
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const adminEmail = user?.email || localStorage.getItem("fit_saved_email") || "muzikworld08@gmail.com";
      headers["x-admin-email"] = adminEmail;

      const res = await fetch("/api/admin/programs/save-day-override", {
        method: "POST",
        headers,
        body: JSON.stringify({
          programId: selectedProgramId,
          dayNumber: effectiveDayNumber,
          cycleDay: ((effectiveDayNumber - 1) % 7) + 1,
          applyToAllCycleWeeks: applyToAllCycleWeeks || viewMode === "cycle",
          totalDays: currentProgramMeta.totalDays,
          dayOverride: {
            title: splitTitle,
            category: splitCategory,
            focus: splitCategory,
            isCardioOnly: cardioState.isCardio,
            cardioDistance: cardioState.distance,
            exercises: newExercises
          }
        })
      });

      if (res.ok) {
        const overrideData = {
          title: splitTitle,
          category: splitCategory,
          focus: splitCategory,
          isCardioOnly: cardioState.isCardio,
          cardioDistance: cardioState.distance,
          exercises: newExercises
        };
        setServerOverrides(prev => {
          const next = { ...prev };
          const pid = selectedProgramId;
          if (!next[pid]) next[pid] = {};
          next[pid][String(effectiveDayNumber)] = overrideData;
          if (viewMode === "cycle" || applyToAllCycleWeeks) {
            next[pid][`cycle_${((effectiveDayNumber - 1) % 7) + 1}`] = overrideData;
          }
          broadcastOverridesUpdated(next);
          return next;
        });
        setSaveSuccessMsg("Workout order re-arranged and manifested successfully!");
        setTimeout(() => setSaveSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error("Failed saving reordered exercises:", err);
    }
  };

  // Move exercise up
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const reordered = [...activeExercises];
    const temp = reordered[index - 1];
    reordered[index - 1] = reordered[index];
    reordered[index] = temp;
    handleReorderExercises(reordered);
  };

  // Move exercise down
  const handleMoveDown = (index: number) => {
    if (index >= activeExercises.length - 1) return;
    const reordered = [...activeExercises];
    const temp = reordered[index + 1];
    reordered[index + 1] = reordered[index];
    reordered[index] = temp;
    handleReorderExercises(reordered);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...activeExercises];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, draggedItem);

    setDraggedIndex(null);
    setDragOverIndex(null);
    handleReorderExercises(reordered);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Add Exercise Handler
  const handleAddExercise = (newEx: ChallengeExerciseItem) => {
    const updated = [...activeExercises, newEx];
    handleReorderExercises(updated);
    setSaveSuccessMsg(`Added "${newEx.exerciseName}" to the routine!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Replace Exercise with Chosen Exercise
  const handleReplaceExercise = async (chosenEx: Exercise | any, keepSetsReps: boolean) => {
    if (!targetToReplace) return;
    setIsReplacing(true);

    try {
      const replacementItem: ChallengeExerciseItem = {
        id: `rep_${selectedProgramId}_d${effectiveDayNumber}_${Date.now()}`,
        programId: selectedProgramId as any,
        programName: selectedProgramId,
        dayNumber: effectiveDayNumber,
        category: chosenEx.category || targetToReplace.category,
        muscleGroup: chosenEx.muscleGroups || targetToReplace.muscleGroup,
        exerciseName: chosenEx.name || chosenEx.exerciseName,
        equipment: Array.isArray(chosenEx.equipment) ? chosenEx.equipment.join(", ") : String(chosenEx.equipment || targetToReplace.equipment),
        difficulty: chosenEx.difficulty || targetToReplace.difficulty || "Intermediate",
        sets: keepSetsReps ? targetToReplace.sets : 3,
        reps: keepSetsReps ? targetToReplace.reps : "10-12 reps",
        duration: targetToReplace.duration || "45s set",
        instructions: chosenEx.instructions && chosenEx.instructions.length > 0 
          ? chosenEx.instructions 
          : targetToReplace.instructions,
        restTime: targetToReplace.restTime || "45s",
        gifUrl: chosenEx.gifUrl || getExerciseGifUrl(chosenEx.name || chosenEx.exerciseName, chosenEx.category),
        coachingCues: chosenEx.movementExecution ? [chosenEx.movementExecution] : targetToReplace.coachingCues
      };

      const updated = activeExercises.map((ex: ChallengeExerciseItem) => ex.id === targetToReplace.id ? replacementItem : ex);
      await handleReorderExercises(updated);

      setSaveSuccessMsg(`Replaced "${targetToReplace.exerciseName}" with "${replacementItem.exerciseName}"!`);
      setTimeout(() => setSaveSuccessMsg(null), 3500);
      setTargetToReplace(null);
    } catch (err: any) {
      console.error("Replacement error:", err);
      alert("Failed replacing workout: " + (err?.message || "Unknown error"));
    } finally {
      setIsReplacing(false);
    }
  };

  // Delete Only (Permanently remove workout)
  const handleDeleteOnly = async () => {
    if (!targetToDelete) return;
    setIsDeleting(true);

    try {
      const updated = activeExercises.filter((ex: ChallengeExerciseItem) => ex.id !== targetToDelete.id);
      await handleReorderExercises(updated);

      setSaveSuccessMsg(`Deleted "${targetToDelete.exerciseName}" from this workout.`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
      setTargetToDelete(null);
    } catch (err: any) {
      console.error("Delete only error:", err);
      alert("Failed to delete workout: " + (err?.message || "Unknown error"));
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete and Auto-Replace via Backend
  const handleAutoReplace = async () => {
    if (!targetToDelete) return;
    setIsDeleting(true);

    try {
      const token = await auth.currentUser?.getIdToken().catch(() => null);
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const adminEmail = user?.email || localStorage.getItem("fit_saved_email") || "muzikworld08@gmail.com";
      headers["x-admin-email"] = adminEmail;

      const res = await fetch("/api/admin/programs/delete-and-replace", {
        method: "POST",
        headers,
        body: JSON.stringify({
          programId: selectedProgramId,
          dayNumber: effectiveDayNumber,
          cycleDay: ((effectiveDayNumber - 1) % 7) + 1,
          applyToAllCycleWeeks: applyToAllCycleWeeks || viewMode === "cycle",
          totalDays: currentProgramMeta.totalDays,
          exerciseId: targetToDelete.id,
          currentExercises: activeExercises,
          categoryHint: targetToDelete.category,
          muscleGroupHint: Array.isArray(targetToDelete.muscleGroup) ? targetToDelete.muscleGroup[0] : targetToDelete.muscleGroup
        })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to delete & auto-replace");

      setServerOverrides(prev => {
        const next = { ...prev };
        const pid = selectedProgramId;
        if (!next[pid]) next[pid] = {};
        const dayKey = String(effectiveDayNumber);
        const cycleKey = `cycle_${((effectiveDayNumber - 1) % 7) + 1}`;
        next[pid][dayKey] = {
          ...(next[pid][dayKey] || {}),
          exercises: data.updatedExercises
        };
        if (viewMode === "cycle" || applyToAllCycleWeeks) {
          next[pid][cycleKey] = {
            ...(next[pid][cycleKey] || {}),
            exercises: data.updatedExercises
          };
        }
        broadcastOverridesUpdated(next);
        return next;
      });

      setSaveSuccessMsg(`Deleted "${targetToDelete.exerciseName}" and automatically substituted with "${data.replacementExercise?.exerciseName || "library drill"}".`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
      setTargetToDelete(null);
    } catch (err: any) {
      console.error("Auto-replace error:", err);
      alert("Failed to auto-replace: " + (err?.message || "Unknown error"));
    } finally {
      setIsDeleting(false);
    }
  };

  // Save Split and Cardio Setup
  const handleSaveDayConfiguration = async () => {
    setIsSaving(true);
    try {
      const dayData = {
        title: splitTitle,
        category: splitCategory,
        focus: splitCategory,
        targetMuscles: splitMuscles.split(",").map(m => m.trim()).filter(Boolean),
        isCardioOnly: cardioState.isCardio,
        cardioDistance: cardioState.distance,
        cardioType: cardioState.type,
        cardioGuidelines: cardioState.guidelines,
        estimatedDuration: cardioState.durationMinutes,
        coachingNotes: cardioState.isCardio 
          ? `Admin Prescribed Cardio Engine: ${cardioState.distance} conversational pace.` 
          : "Execute with strict biomechanics and progressive overload.",
        exercises: cardioState.isCardio ? [] : activeExercises
      };

      const token = await auth.currentUser?.getIdToken().catch(() => null);
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const adminEmail = user?.email || localStorage.getItem("fit_saved_email") || "muzikworld08@gmail.com";
      headers["x-admin-email"] = adminEmail;

      const res = await fetch("/api/admin/programs/save-day-override", {
        method: "POST",
        headers,
        body: JSON.stringify({
          programId: selectedProgramId,
          dayNumber: effectiveDayNumber,
          cycleDay: ((effectiveDayNumber - 1) % 7) + 1,
          applyToAllCycleWeeks: applyToAllCycleWeeks || viewMode === "cycle",
          totalDays: currentProgramMeta.totalDays,
          dayOverride: dayData
        })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed saving schedule override");

      setServerOverrides(prev => {
        const next = { ...prev };
        const pid = selectedProgramId;
        if (!next[pid]) next[pid] = {};
        next[pid][String(effectiveDayNumber)] = data.savedOverride;
        if (viewMode === "cycle" || applyToAllCycleWeeks) {
          next[pid][`cycle_${((effectiveDayNumber - 1) % 7) + 1}`] = data.savedOverride;
        }
        broadcastOverridesUpdated(next);
        return next;
      });

      setSaveSuccessMsg(`Day ${effectiveDayNumber} (${splitTitle}) configuration successfully saved and manifested!`);
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } catch (err: any) {
      console.error("Save day configuration error:", err);
      alert("Error saving: " + (err?.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  // Run Challenge Engine Validation
  const handleRunAudit = () => {
    setIsValidating(true);
    try {
      const reports = ChallengeValidationService.auditAllPrograms();
      setValidationReports(reports);
      setAuditTimestamp(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Validation audit error:", err);
    } finally {
      setIsValidating(false);
    }
  };

  // Available programs list
  const programOptions = useMemo(() => {
    const standard = [
      { id: "immortal_90", label: "Immortal 90 Day Challenge (90 Days - 7 Day Rolling Cadence)" },
      { id: "lean_muscle", label: "90 Day Lean Muscle Challenge (90 Days)" },
      { id: "fat_burning", label: "90 Day Fat Burning Challenge (90 Days)" },
      { id: "body_transformation", label: "90 Day Body Transformation (90 Days)" },
      { id: "athletic_performance", label: "90 Day Athletic Performance (90 Days)" },
      { id: "strength_challenge", label: "90 Day Strength Challenge (90 Days)" },
      { id: "home_fitness", label: "90 Day Home Fitness Challenge (90 Days)" },
      { id: "six_pack_core", label: "90 Day Six Pack & Core Challenge (90 Days)" },
      { id: "home_180", label: "180 Day Home Workout Challenge (180 Days)" },
      { id: "women_confidence", label: "Women Confidence Program (30 Days)" },
      { id: "belly_fat_shred", label: "Belly Fat Shred System (30 Days)" },
      { id: "posture_vitality", label: "Reclaim Your Posture & Vitality (21 Days)" },
      { id: "cardio_calisthenics", label: "Cardio, Calisthenics & Military (30 Days)" },
      { id: "lifestyle_academy", label: "Alex Lifestyle Academy (60 Days)" }
    ];

    const customs = (allChallenges || [])
      .filter((c: any) => !standard.some(s => s.id === c.id || s.id === c.challengeId))
      .map((c: any) => ({
        id: c.id || c.challengeId,
        label: `${c.title} (${c.totalDays || c.durationDays || 90} Days - Custom Challenge)`
      }));

    return [...standard, ...customs];
  }, [allChallenges]);

  // Weeks calculation for 7-day repeats
  const totalWeeks = Math.ceil((currentProgramMeta.totalDays || 90) / 7);

  return (
    <div className="space-y-6 animate-fade-in text-neutral-100">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-500">
              <Repeat className="w-4 h-4" />
              <span>Program Schedule Architect & 7-Day Split Manager</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Manage Workouts, Drag & Drop Reorder & 7-Day Cadence
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-3xl leading-relaxed">
              Customize exercises across all challenges and programs. Delete or replace any workout, drag to reorder drills, edit the canonical 7-day repeat splits, and enforce dedicated cardio and evening walk rules. All changes manifest instantly for athletes.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleRunAudit}
              disabled={isValidating}
              className="px-4 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-700/80 hover:border-neutral-500 text-xs font-bold text-neutral-300 hover:text-white transition flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isValidating ? "Validating..." : "Run Engine Audit"}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDayConfiguration}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition flex items-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Manifesting...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Manifest Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Evening Walk Rule Banner */}
        <div className="mt-5 p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/20 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <Footprints className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-xs text-blue-200">
              <strong>Fixed Rule:</strong> Every day of the 90-day challenge includes a mandatory <strong>30-Minute Evening Walk</strong> before sleep.
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-blue-400 px-2 py-0.5 rounded-md bg-blue-950/70 border border-blue-500/30">
            Active on all 90 Days
          </span>
        </div>

        {/* Save Toast */}
        {saveSuccessMsg && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Program Selector & Mode Tabs */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Program Select */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
              Select Program / Challenge to Edit
            </label>
            <select
              value={selectedProgramId}
              onChange={(e) => setSelectedProgramId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-bold text-white focus:outline-none focus:border-red-500 transition cursor-pointer"
            >
              {programOptions.map(prog => (
                <option key={prog.id} value={prog.id}>
                  {prog.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
              Editing Scope
            </label>
            <div className="flex items-center gap-2 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
              <button
                type="button"
                onClick={() => setViewMode("cycle")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  viewMode === "cycle"
                    ? "bg-red-600 text-white shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>7-Day Master Split</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("day")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  viewMode === "day"
                    ? "bg-red-600 text-white shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Day Inspector (1-{currentProgramMeta.totalDays})</span>
              </button>
            </div>
          </div>
        </div>

        {/* 7-Day Cycle Cadence Bar */}
        {viewMode === "cycle" ? (
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-red-500" />
                7-Day Repeating Schedule (Repeats over {totalWeeks} weeks)
              </span>
              <span className="text-neutral-400">
                Click a day to customize its split & workouts
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {[1, 2, 3, 4, 5, 6, 7].map(cycleDay => {
                const isSelected = selectedCycleDay === cycleDay;
                const canonical = IMMORTAL_7_DAY_CANONICAL[cycleDay];
                const cycleKey = `cycle_${cycleDay}`;
                const progOverrides = serverOverrides[selectedProgramId] || serverOverrides[normalizeProgramId(selectedProgramId)] || {};
                const override = progOverrides[cycleKey] || progOverrides[String(cycleDay)];
                
                const isCardio = override?.isCardioOnly !== undefined ? override.isCardioOnly : canonical?.isCardio;
                const title = override?.focus || override?.category || canonical?.focus || `Cycle Day ${cycleDay}`;
                const cardioKm = override?.cardioDistance || canonical?.cardioKm;

                return (
                  <button
                    key={cycleDay}
                    type="button"
                    onClick={() => setSelectedCycleDay(cycleDay)}
                    className={`p-3 rounded-2xl border text-left transition relative cursor-pointer flex flex-col justify-between min-h-[96px] ${
                      isSelected
                        ? "bg-red-950/40 border-red-500 shadow-lg shadow-red-950/50"
                        : "bg-neutral-950/60 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${
                          isSelected ? "text-red-400" : "text-neutral-500"
                        }`}>
                          Day {cycleDay}
                        </span>
                        {isCardio && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
                            Cardio
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1 line-clamp-2 leading-tight">
                        {title}
                      </h4>
                    </div>

                    <div className="mt-2 text-[10px] text-neutral-400 font-medium">
                      {isCardio ? (
                        <span className="text-blue-300 font-bold">{cardioKm || "5-10 KM"}</span>
                      ) : (
                        <span>Weights Routine</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Cadence Propagation Toggle */}
            <div className="p-3 bg-neutral-950/80 rounded-2xl border border-neutral-800 flex items-center justify-between gap-3 flex-wrap">
              <label className="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer font-semibold">
                <input
                  type="checkbox"
                  checked={applyToAllCycleWeeks}
                  onChange={(e) => setApplyToAllCycleWeeks(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 accent-red-600 focus:ring-0 cursor-pointer"
                />
                <span>
                  Apply Day {selectedCycleDay} changes across all {totalWeeks} recurring weeks (Days {Array.from({ length: Math.min(totalWeeks, 7) }, (_, i) => selectedCycleDay + i * 7).join(", ")}...)
                </span>
              </label>

              <span className="text-[11px] text-neutral-500 font-mono">
                Full 90-Day Cadence Lock
              </span>
            </div>
          </div>
        ) : (
          /* Specific Day Inspector */
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-300 uppercase tracking-wider">
                Specific Scheduled Day Inspector
              </span>
              <span className="text-neutral-400">
                Week {Math.ceil(selectedDayNumber / 7)} of {totalWeeks} • Cycle Day {((selectedDayNumber - 1) % 7) + 1}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max={currentProgramMeta.totalDays || 90}
                value={selectedDayNumber}
                onChange={(e) => setSelectedDayNumber(Number(e.target.value))}
                className="flex-1 accent-red-600 cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-400">Day:</span>
                <input
                  type="number"
                  min="1"
                  max={currentProgramMeta.totalDays || 90}
                  value={selectedDayNumber}
                  onChange={(e) => setSelectedDayNumber(Math.max(1, Math.min(currentProgramMeta.totalDays || 90, Number(e.target.value))))}
                  className="w-16 px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-bold text-center text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Day Split Configuration Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-7 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-red-500">
                {viewMode === "cycle" ? `Cycle Day ${selectedCycleDay} of 7` : `Day ${selectedDayNumber} of ${currentProgramMeta.totalDays}`}
              </span>
              {cardioState.isCardio ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Dedicated Cardio Day ({cardioState.distance})
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Resistance & Weight Training ({activeExercises.length} Drills)
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              {splitTitle}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Workout Drill</span>
            </button>
          </div>
        </div>

        {/* Split Header Meta Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-neutral-400 mb-1.5 block">Workout Split Title</label>
            <input
              type="text"
              value={splitTitle}
              onChange={(e) => setSplitTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-bold text-white focus:outline-none focus:border-red-500"
              placeholder="e.g. Chest and Triceps Hypertrophy"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-400 mb-1.5 block">Focus Category</label>
            <input
              type="text"
              value={splitCategory}
              onChange={(e) => setSplitCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-bold text-white focus:outline-none focus:border-red-500"
              placeholder="e.g. Chest and Triceps"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-400 mb-1.5 block">Target Muscles (comma separated)</label>
            <input
              type="text"
              value={splitMuscles}
              onChange={(e) => setSplitMuscles(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-bold text-white focus:outline-none focus:border-red-500"
              placeholder="e.g. Pectorals, Triceps, Deltoids"
            />
          </div>
        </div>

        {/* Cardio Day Configuration Accordion / Toggle */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                cardioState.isCardio ? "bg-blue-950 border border-blue-500/40 text-blue-400" : "bg-neutral-800 text-neutral-400"
              }`}>
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Dedicated Cardio Day Mode</h4>
                <p className="text-xs text-neutral-400">
                  {((effectiveDayNumber - 1) % 7) + 1 === 3 || ((effectiveDayNumber - 1) % 7) + 1 === 7
                    ? "Official Cardio Rule: Day 3 & Day 7 must have dedicated cardio and zero weight training."
                    : "Toggle this day to be a dedicated 5 to 10 KM cardio & mobility day."}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={cardioState.isCardio}
                onChange={(e) => setCardioState(prev => ({ ...prev, isCardio: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {cardioState.isCardio && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-neutral-800 animate-in fade-in">
              <div>
                <label className="text-xs font-bold text-neutral-300 mb-1 block">Cardio Target Distance</label>
                <select
                  value={cardioState.distance}
                  onChange={(e) => setCardioState(prev => ({ ...prev, distance: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="5.0 - 10.0 KM">5.0 to 10.0 KM (Standard Target)</option>
                  <option value="5.0 KM">5.0 KM (Minimum Distance)</option>
                  <option value="7.5 KM">7.5 KM (Intermediate Pace)</option>
                  <option value="10.0 KM">10.0 KM (Advanced Endurance)</option>
                  <option value="3.0 - 5.0 KM">3.0 - 5.0 KM (Beginner Aerobic)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 mb-1 block">Cardio Modality</label>
                <input
                  type="text"
                  value={cardioState.type}
                  onChange={(e) => setCardioState(prev => ({ ...prev, type: e.target.value }))}
                  placeholder="e.g. Zone 2 Outdoor Running / Treadmill"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 mb-1 block">Duration</label>
                <input
                  type="number"
                  min="20"
                  max="120"
                  value={cardioState.durationMinutes}
                  onChange={(e) => setCardioState(prev => ({ ...prev, durationMinutes: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-neutral-300 mb-1 block">Cardio Coaching Protocol</label>
                <input
                  type="text"
                  value={cardioState.guidelines}
                  onChange={(e) => setCardioState(prev => ({ ...prev, guidelines: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Workouts Routine List (Drag & Drop Reorder) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-red-500" />
              <span>Prescribed Workout Routine ({activeExercises.length} Drills)</span>
            </h4>
            <span className="text-xs text-neutral-500 hidden sm:inline">
              Grab the handle <GripVertical className="w-3 h-3 inline text-neutral-400" /> to drag & reorder, or use the arrow buttons.
            </span>
          </div>

          {activeExercises.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-neutral-950/60 border border-dashed border-neutral-800 space-y-3">
              <Dumbbell className="w-10 h-10 mx-auto text-neutral-600" />
              <p className="text-sm text-neutral-400">
                {cardioState.isCardio 
                  ? "This is a dedicated Cardio day. No heavy weight drills required." 
                  : "No workouts currently assigned to this day."}
              </p>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition cursor-pointer"
              >
                + Add Workout Drill
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {activeExercises.map((exercise: ChallengeExerciseItem, index: number) => {
                const isDragging = draggedIndex === index;
                const isDragOver = dragOverIndex === index;

                return (
                  <div
                    key={exercise.id || `drill_${index}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`bg-neutral-950/90 border rounded-2xl p-3 sm:p-4 transition flex items-center justify-between gap-3 group ${
                      isDragging 
                        ? "opacity-40 border-dashed border-red-500" 
                        : isDragOver
                        ? "border-red-500 bg-red-950/20"
                        : "border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    {/* Left: Drag Handle, Number, Media Preview & Details */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      {/* Drag Handle */}
                      <div 
                        className="text-neutral-500 group-hover:text-white transition cursor-grab active:cursor-grabbing p-1 shrink-0"
                        title="Drag to reorder"
                      >
                        <GripVertical className="w-5 h-5" />
                      </div>

                      {/* Index Badge */}
                      <span className="w-6 h-6 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] font-mono font-bold text-neutral-400 flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>

                      {/* GIF / Video Media Thumbnail */}
                      <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0 hidden sm:block">
                        <UnifiedExerciseMedia
                          exerciseName={exercise.exerciseName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Exercise Name & Specs */}
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs sm:text-sm font-black text-white truncate">
                          {exercise.exerciseName}
                        </h5>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-neutral-400 mt-0.5">
                          <span className="text-red-400 font-bold">{exercise.sets} sets × {exercise.reps}</span>
                          <span>•</span>
                          <span className="text-neutral-300 truncate">{exercise.category}</span>
                          {exercise.equipment && (
                            <>
                              <span>•</span>
                              <span className="text-neutral-400 truncate">{exercise.equipment}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick Move Buttons & Action Controls */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Move Up / Down Buttons for quick mobile/touch reorder */}
                      <div className="flex items-center gap-0.5 mr-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveUp(index)}
                          title="Move drill up"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={index === activeExercises.length - 1}
                          onClick={() => handleMoveDown(index)}
                          title="Move drill down"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Replace Button */}
                      <button
                        type="button"
                        onClick={() => setTargetToReplace(exercise)}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Replace with another exercise"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Replace</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setTargetToDelete(exercise)}
                        className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-red-950/40 hover:bg-red-950/70 text-red-400 border border-red-900/50 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Delete workout"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Engine Audit & Validation Output (if available) */}
      {validationReports.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Program Integrity Audit Report ({auditTimestamp})</span>
            </h4>
            <span className="text-xs text-neutral-400 font-mono">
              Issues Detected: {validationReports.length}
            </span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {validationReports.map((report, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2.5 text-xs"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Day {report.dayNumber || "All"} ({report.type}):</span>{" "}
                  <span className="text-neutral-300">{report.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODALS */}
      {/* 1. Exercise Replacement Modal */}
      <ExerciseReplacementModal
        isOpen={!!targetToReplace}
        targetExercise={targetToReplace}
        onClose={() => setTargetToReplace(null)}
        onSelectReplacement={handleReplaceExercise}
        libraryExercises={libraryExercises}
        isLoading={isReplacing}
      />

      {/* 2. Add Workout Modal */}
      <AddWorkoutModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddExercise={handleAddExercise}
        libraryExercises={libraryExercises}
        programId={selectedProgramId}
        dayNumber={effectiveDayNumber}
      />

      {/* 3. Delete Workout Confirmation Modal */}
      <DeleteWorkoutConfirmModal
        isOpen={!!targetToDelete}
        target={targetToDelete ? {
          id: targetToDelete.id,
          name: targetToDelete.exerciseName,
          category: targetToDelete.category,
          muscleGroup: targetToDelete.muscleGroup,
          equipment: targetToDelete.equipment,
          sets: targetToDelete.sets,
          reps: String(targetToDelete.reps || "10-12"),
          dayNumber: effectiveDayNumber,
          programName: selectedProgramId
        } : null}
        isLoading={isDeleting}
        onConfirm={handleAutoReplace}
        onDeleteOnly={handleDeleteOnly}
        onChooseReplacement={() => {
          const target = targetToDelete;
          setTargetToDelete(null);
          setTargetToReplace(target);
        }}
        onCancel={() => setTargetToDelete(null)}
      />
    </div>
  );
}
