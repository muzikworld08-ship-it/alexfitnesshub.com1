import React, { useState, useMemo, useEffect, useCallback } from "react";
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Search, Filter, 
  Layers, Dumbbell, Calendar, RefreshCw, Eye, Edit3, Trash2, 
  Plus, Save, Check, ExternalLink, HelpCircle, ArrowRightLeft,
  Activity, Flame, Clock, Compass, ShieldAlert, Sparkles,
  GripVertical, ChevronUp, ChevronDown, Repeat, Footprints,
  Sliders, ArrowUpRight, Zap, Info, RotateCcw, Copy
} from "lucide-react";
import { ProgramId, ChallengeExerciseItem, ValidationError } from "../../types/challengeEngine";
import { 
  CHALLENGE_PROGRAMS_METADATA, 
  getWorkoutForProgramAndDay,
  normalizeProgramId,
  resolveProgramDayOverride
} from "../../data/challengeEngineDatabase";
import { 
  purgeMismatchedExercisesFromRoutine, 
  isExerciseBelongingToSplit, 
  PROGRAM_SPLIT_DEFINITIONS,
  resetAndCleanAllProgramSplits 
} from "../../utils/dynamicWorkoutEngine";
import { 
  getScheduleOverrides, 
  setScheduleOverridesFromRemote, 
  setScheduleOverridesFromAdmin 
} from "../../utils/scheduleOverridesStore";
import { getExerciseGifUrl, Exercise, EXERCISES } from "../../data/exercises";
import { ChallengeValidationService } from "../../services/challengeValidationService";
import { useApp } from "../../context/AppContext";
import { getChallengeWorkouts } from "../../data/challenges";
import { auth, db, safeFirestoreSetDoc, getFirebaseIdToken, fetchWithFirebaseAuth } from "../../lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import DeleteWorkoutConfirmModal, { DeleteWorkoutTarget } from "./DeleteWorkoutConfirmModal";
import ExerciseReplacementModal from "./ExerciseReplacementModal";
import AddWorkoutModal from "./AddWorkoutModal";
import EditWorkoutDrillModal from "./EditWorkoutDrillModal";
import UnifiedExerciseMedia from "../UnifiedExerciseMedia";
import { subscribeScheduleOverrides } from "../../utils/scheduleOverridesStore";

interface CardioProtocolState {
  isCardio: boolean;
  type: string;
  distance: string;
  durationMinutes: number;
  guidelines: string;
}

// Universal Canonical 7-Day Continuous Repeating Splits for Programs
const PROGRAM_CANONICAL_SPLITS: Record<string, Record<number, { title: string; focus: string; muscles: string[]; isCardio: boolean; cardioKm?: string }>> = {
  immortal_90: {
    1: { title: "Monday: Push", focus: "Chest, shoulders and triceps", muscles: ["Chest", "Shoulders", "Triceps"], isCardio: false },
    2: { title: "Tuesday: Pull", focus: "Back, rear delts and biceps", muscles: ["Back", "Rear Delts", "Biceps"], isCardio: false },
    3: { title: "Wednesday: Legs + Core", focus: "Quads, hamstrings, glutes, calves and abs", muscles: ["Quadriceps", "Hamstrings", "Glutes", "Calves", "Core", "Abs"], isCardio: false },
    4: { title: "Thursday: Cardio + Mobility", focus: "Running, conditioning and mobility", muscles: ["Cardiovascular System", "Running", "Conditioning", "Mobility"], isCardio: true, cardioKm: "5.0 - 10.0 KM" },
    5: { title: "Friday: Upper Body", focus: "Chest, back, shoulders and arms", muscles: ["Chest", "Back", "Shoulders", "Arms", "Biceps", "Triceps"], isCardio: false },
    6: { title: "Saturday: Athletic Conditioning + Core", focus: "Functional movements, conditioning and abdominal work", muscles: ["Functional Movements", "Conditioning", "Core", "Abs"], isCardio: false },
    7: { title: "Sunday: Recovery", focus: "Recovery & System Reset", muscles: ["Recovery", "Mobility", "Stretching"], isCardio: false }
  },
  women_confidence: {
    1: { title: "Monday: Glutes + Hamstrings", focus: "Glutes + Hamstrings", muscles: ["Glutes", "Hamstrings", "Posterior Chain"], isCardio: false },
    2: { title: "Tuesday: Upper Body + Core", focus: "Upper Body + Core", muscles: ["Upper Body", "Back", "Shoulders", "Arms", "Core", "Abs"], isCardio: false },
    3: { title: "Wednesday: Quads + Glutes", focus: "Quads + Glutes", muscles: ["Quadriceps", "Glutes", "Lower Body"], isCardio: false },
    4: { title: "Thursday: Cardio + Core + Mobility", focus: "Cardio + Core + Mobility", muscles: ["Cardio", "Core", "Abs", "Mobility"], isCardio: true, cardioKm: "3.0 - 5.0 KM" },
    5: { title: "Friday: Glutes + Full Lower Body", focus: "Glutes + Full Lower Body", muscles: ["Glutes", "Hamstrings", "Quadriceps", "Calves"], isCardio: false },
    6: { title: "Saturday: Full Body Conditioning", focus: "Full Body Conditioning", muscles: ["Full Body", "Conditioning", "Cardio", "Tone"], isCardio: false },
    7: { title: "Sunday: Recovery", focus: "Restorative Recovery", muscles: ["Recovery", "Mobility", "Stretching"], isCardio: false }
  },
  belly_fat_shred: {
    1: { title: "Monday: Full Body + Core", focus: "Full Body + Core", muscles: ["Full Body", "Core", "Abs"], isCardio: false },
    2: { title: "Tuesday: Cardio + Abs", focus: "Cardio + Abs", muscles: ["Cardio", "Abs", "Core", "HIIT"], isCardio: true, cardioKm: "Cardio Intervals" },
    3: { title: "Wednesday: Full Body Strength", focus: "Full Body Strength", muscles: ["Full Body", "Chest", "Back", "Legs", "Strength"], isCardio: false },
    4: { title: "Thursday: Cardio + Core", focus: "Cardio + Core", muscles: ["Cardio", "Transverse Core", "Abs"], isCardio: true, cardioKm: "Cardio Conditioning" },
    5: { title: "Friday: Full Body Conditioning", focus: "Full Body Conditioning", muscles: ["Full Body", "Conditioning", "HIIT", "Cardio"], isCardio: false },
    6: { title: "Saturday: Walking + Mobility", focus: "Walking + Mobility", muscles: ["Walking", "Cardio", "Mobility"], isCardio: true, cardioKm: "5.0 - 10.0 KM Brisk Walk" },
    7: { title: "Sunday: Recovery", focus: "Recovery & System Reset", muscles: ["Recovery", "Mobility", "Active Reset"], isCardio: false }
  },
  home_180: {
    1: { title: "Monday: Upper Body Push & Calisthenics", focus: "Chest, Shoulders & Triceps", muscles: ["Chest", "Shoulders", "Triceps", "Upper Body"], isCardio: false },
    2: { title: "Tuesday: Core & Abs Shred", focus: "Core, Abs & Obliques", muscles: ["Core", "Abs", "Obliques"], isCardio: false },
    3: { title: "Wednesday: Lower Body & Legs", focus: "Quads, Hamstrings & Calves", muscles: ["Legs", "Quadriceps", "Hamstrings", "Calves"], isCardio: false },
    4: { title: "Thursday: Cardio + Mobility", focus: "Cardio & Joint Mobility", muscles: ["Cardio", "Running", "Mobility", "Conditioning"], isCardio: true, cardioKm: "5.0 - 10.0 KM" },
    5: { title: "Friday: Upper Body Pull & Back", focus: "Back, Biceps & Posture", muscles: ["Back", "Biceps", "Upper Body"], isCardio: false },
    6: { title: "Saturday: Athletic Full Body Conditioning", focus: "Functional Power & Stamina", muscles: ["Full Body", "Cardio", "Conditioning"], isCardio: false },
    7: { title: "Sunday: Recovery", focus: "Regenerative Mobility & Rest", muscles: ["Recovery", "Mobility", "Stretching"], isCardio: false }
  },
  home_180_women: {
    1: { title: "Monday: Glutes + Hamstrings", focus: "Glutes + Hamstrings", muscles: ["Glutes", "Hamstrings", "Lower Body"], isCardio: false },
    2: { title: "Tuesday: Upper Body Tone + Core", focus: "Upper Body Tone + Core", muscles: ["Upper Body", "Back", "Shoulders", "Core", "Abs"], isCardio: false },
    3: { title: "Wednesday: Quads + Glutes", focus: "Quads + Glutes", muscles: ["Quadriceps", "Glutes", "Lower Body"], isCardio: false },
    4: { title: "Thursday: Cardio + Core + Mobility", focus: "Cardio + Core + Mobility", muscles: ["Cardio", "Core", "Abs", "Mobility", "Walking"], isCardio: true, cardioKm: "5.0 - 10.0 KM" },
    5: { title: "Friday: Glutes + Full Lower Body", focus: "Glutes + Full Lower Body", muscles: ["Glutes", "Full Lower Body", "Hamstrings", "Quads", "Calves"], isCardio: false },
    6: { title: "Saturday: Full Body Conditioning", focus: "Full Body Conditioning", muscles: ["Full Body", "Conditioning", "Cardio"], isCardio: false },
    7: { title: "Sunday: Recovery", focus: "Regenerative Mobility & Rest", muscles: ["Recovery", "Mobility", "Stretching"], isCardio: false }
  },
  posture_vitality: {
    1: { title: "Monday: Upper Back + Shoulder Mobility", focus: "Upper Back + Shoulder Mobility", muscles: ["Upper Back", "Shoulders", "Mobility", "Scapular", "Thoracic"], isCardio: false },
    2: { title: "Tuesday: Core Stability + Hip Mobility", focus: "Core Stability + Hip Mobility", muscles: ["Core", "Hips", "Pelvic", "Abs", "Mobility"], isCardio: false },
    3: { title: "Wednesday: Full Body Posture Training", focus: "Full Body Posture Training", muscles: ["Posture", "Spine", "Full Body", "Alignment", "Posterior Chain"], isCardio: false },
    4: { title: "Thursday: Recovery Mobility", focus: "Recovery Mobility", muscles: ["Recovery", "Mobility", "Stretching", "Joints"], isCardio: false },
    5: { title: "Friday: Upper Back + Core", focus: "Upper Back + Core", muscles: ["Upper Back", "Core", "Abs", "Scapular", "Spine"], isCardio: false },
    6: { title: "Saturday: Full Body Mobility + Stability", focus: "Full Body Mobility + Stability", muscles: ["Full Body", "Mobility", "Stability", "Balance"], isCardio: false },
    7: { title: "Sunday: Recovery", focus: "Restorative Recovery", muscles: ["Recovery", "Rest", "Mobility", "Breathing"], isCardio: false }
  },
  lean_muscle: {
    1: { title: "Monday: Chest & Triceps Hypertrophy", focus: "Chest & Triceps Hypertrophy", muscles: ["Chest", "Triceps"], isCardio: false },
    2: { title: "Tuesday: Back & Biceps Overload", focus: "Back & Biceps Overload", muscles: ["Back", "Biceps"], isCardio: false },
    3: { title: "Wednesday: Quads, Hamstrings & Abs", focus: "Quads, Hamstrings & Abs", muscles: ["Quadriceps", "Hamstrings", "Glutes", "Abs"], isCardio: false },
    4: { title: "Thursday: Deltoids, Traps & Lateral Shoulders", focus: "Deltoids, Traps & Shoulders", muscles: ["Shoulders", "Deltoids", "Traps"], isCardio: false },
    5: { title: "Friday: Upper Body Compound Overload", focus: "Upper Body Compound Overload", muscles: ["Chest", "Back", "Arms", "Biceps", "Triceps"], isCardio: false },
    6: { title: "Saturday: Legs & Core Power", focus: "Legs & Core Power", muscles: ["Legs", "Calves", "Core", "Abs"], isCardio: false },
    7: { title: "Sunday: System Recovery & Mobility", focus: "System Recovery & Mobility", muscles: ["Recovery", "Mobility"], isCardio: false }
  },
  fat_burning: {
    1: { title: "Monday: HIIT Cardio Intervals", focus: "HIIT Cardio Intervals", muscles: ["Cardio", "HIIT", "Core"], isCardio: true, cardioKm: "HIIT Intervals" },
    2: { title: "Tuesday: Lower Body Tone & Conditioning", focus: "Lower Body Tone & Conditioning", muscles: ["Quadriceps", "Hamstrings", "Glutes", "Calves"], isCardio: false },
    3: { title: "Wednesday: Aerobic Calorie Burn", focus: "Aerobic Calorie Burn", muscles: ["Cardio", "Running"], isCardio: true, cardioKm: "5.0 - 10.0 KM" },
    4: { title: "Thursday: Upper Body Circuit", focus: "Upper Body Circuit", muscles: ["Chest", "Back", "Shoulders", "Arms"], isCardio: false },
    5: { title: "Friday: Full Body Shred", focus: "Full Body Shred", muscles: ["Full Body", "HIIT", "Conditioning"], isCardio: false },
    6: { title: "Saturday: HIIT Endurance & Mobility", focus: "HIIT Endurance & Mobility", muscles: ["Cardio", "Mobility", "Core"], isCardio: true, cardioKm: "5.0 KM" },
    7: { title: "Sunday: Recovery", focus: "Recovery & System Reset", muscles: ["Recovery", "Rest"], isCardio: false }
  },
  body_transformation: {
    1: { title: "Monday: Upper Body Strength", focus: "Upper Body Strength", muscles: ["Chest", "Back", "Shoulders"], isCardio: false },
    2: { title: "Tuesday: Lower Body Strength", focus: "Lower Body Strength", muscles: ["Quadriceps", "Hamstrings", "Glutes"], isCardio: false },
    3: { title: "Wednesday: Core Armor & Mobility", focus: "Core Armor & Mobility", muscles: ["Core", "Abs", "Mobility"], isCardio: false },
    4: { title: "Thursday: Full Body Hypertrophy", focus: "Full Body Hypertrophy", muscles: ["Full Body", "Chest", "Back", "Legs"], isCardio: false },
    5: { title: "Friday: HIIT Conditioning & Stamina", focus: "HIIT Conditioning & Stamina", muscles: ["Cardio", "HIIT", "Conditioning"], isCardio: true, cardioKm: "HIIT Stamina" },
    6: { title: "Saturday: Core & Athletic Conditioning", focus: "Core & Athletic Conditioning", muscles: ["Core", "Abs", "Full Body"], isCardio: false },
    7: { title: "Sunday: Recovery", focus: "Active Recovery", muscles: ["Recovery", "Rest"], isCardio: false }
  },
  athletic_performance: {
    1: { title: "Monday: Plyometrics & Sprint Speed", focus: "Plyometrics & Sprint Speed", muscles: ["Legs", "Calves", "Agility"], isCardio: false },
    2: { title: "Tuesday: Lower Body Explosive Power", focus: "Lower Body Explosive Power", muscles: ["Quadriceps", "Glutes", "Hamstrings"], isCardio: false },
    3: { title: "Wednesday: Aerobic Capacity & Conditioning", focus: "Aerobic Capacity & Conditioning", muscles: ["Cardio", "Stamina"], isCardio: true, cardioKm: "5.0 - 8.0 KM" },
    4: { title: "Thursday: Upper Body Rotational Power", focus: "Upper Body Rotational Power", muscles: ["Chest", "Back", "Shoulders"], isCardio: false },
    5: { title: "Friday: Agility Vectors & Deep Core", focus: "Agility Vectors & Deep Core", muscles: ["Core", "Abs", "Agility"], isCardio: false },
    6: { title: "Saturday: Endurance Running & Mobility", focus: "Endurance Running & Mobility", muscles: ["Cardio", "Running", "Mobility"], isCardio: true, cardioKm: "5.0 - 10.0 KM" },
    7: { title: "Sunday: Athletic System Reset", focus: "Athletic System Reset", muscles: ["Recovery", "Rest"], isCardio: false }
  },
  strength_challenge: {
    1: { title: "Monday: Heavy Squats & Lower Body", focus: "Heavy Squats & Lower Body", muscles: ["Quadriceps", "Glutes", "Hamstrings", "Calves"], isCardio: false },
    2: { title: "Tuesday: Heavy Bench Press & Chest", focus: "Heavy Bench Press & Chest", muscles: ["Chest", "Triceps", "Shoulders"], isCardio: false },
    3: { title: "Wednesday: Active Recovery & Joint Mobility", focus: "Active Recovery & Joint Mobility", muscles: ["Mobility", "Recovery"], isCardio: false },
    4: { title: "Thursday: Deadlifts & Posterior Chain", focus: "Deadlifts & Posterior Chain", muscles: ["Back", "Lats", "Hamstrings", "Traps"], isCardio: false },
    5: { title: "Friday: Overhead Press & Shoulders", focus: "Overhead Press & Shoulders", muscles: ["Shoulders", "Deltoids", "Triceps"], isCardio: false },
    6: { title: "Saturday: Heavy Bracing & Core Citadel", focus: "Heavy Bracing & Core Citadel", muscles: ["Core", "Abs", "Lower Back"], isCardio: false },
    7: { title: "Sunday: Recovery & Central Nervous Reset", focus: "Recovery & Central Nervous Reset", muscles: ["Recovery", "Rest"], isCardio: false }
  },
  home_fitness: {
    1: { title: "Monday: Bodyweight Push & Full Body", focus: "Bodyweight Push & Full Body", muscles: ["Chest", "Legs", "Core"], isCardio: false },
    2: { title: "Tuesday: Core Armor & Spinal Mobility", focus: "Core Armor & Spinal Mobility", muscles: ["Core", "Abs", "Mobility"], isCardio: false },
    3: { title: "Wednesday: Calisthenics HIIT Cardio", focus: "Calisthenics HIIT Cardio", muscles: ["Cardio", "HIIT", "Calisthenics"], isCardio: true, cardioKm: "Calisthenics HIIT" },
    4: { title: "Thursday: Bodyweight Upper Body & Posture", focus: "Bodyweight Upper Body & Posture", muscles: ["Chest", "Back", "Shoulders", "Triceps"], isCardio: false },
    5: { title: "Friday: Bodyweight Lower Body & Legs", focus: "Bodyweight Lower Body & Legs", muscles: ["Quadriceps", "Glutes", "Hamstrings", "Calves"], isCardio: false },
    6: { title: "Saturday: Home Conditioning & Tone", focus: "Home Conditioning & Tone", muscles: ["Full Body", "Core", "Conditioning"], isCardio: false },
    7: { title: "Sunday: Rest & Mobility", focus: "Rest & Mobility", muscles: ["Recovery", "Rest"], isCardio: false }
  },
  six_pack_core: {
    1: { title: "Monday: Upper Abs & Oblique Definition", focus: "Upper Abs & Oblique Definition", muscles: ["Upper Abs", "Obliques", "Core"], isCardio: false },
    2: { title: "Tuesday: Lower Abs & Deep Pelvic Floor", focus: "Lower Abs & Deep Pelvic Floor", muscles: ["Lower Abs", "Transverse Core", "Abs"], isCardio: false },
    3: { title: "Wednesday: Cardio Burn & Core Endurance", focus: "Cardio Burn & Core Endurance", muscles: ["Cardio", "Abs", "Core"], isCardio: true, cardioKm: "Cardio + Abs Burn" },
    4: { title: "Thursday: Isometric Planks & Bracing", focus: "Isometric Planks & Bracing", muscles: ["Core", "Transverse Abdominis", "Stability"], isCardio: false },
    5: { title: "Friday: Rotational Core & Obliques", focus: "Rotational Core & Obliques", muscles: ["Obliques", "Rotational Core", "Abs"], isCardio: false },
    6: { title: "Saturday: Full Core Citadel Circuit", focus: "Full Core Citadel Circuit", muscles: ["Abs", "Core", "Conditioning"], isCardio: false },
    7: { title: "Sunday: Abdominal Recovery & Mobility", focus: "Abdominal Recovery & Mobility", muscles: ["Recovery", "Rest"], isCardio: false }
  },
  cardio_calisthenics: {
    1: { title: "Monday: Calisthenics Push & Dynamic Volume", focus: "Calisthenics Push & Dynamic Volume", muscles: ["Chest", "Shoulders", "Triceps", "Calisthenics"], isCardio: false },
    2: { title: "Tuesday: Tactical Running & Cardio Test", focus: "Tactical Running & Cardio Test", muscles: ["Cardio", "Running"], isCardio: true, cardioKm: "5.0 - 10.0 KM" },
    3: { title: "Wednesday: Calisthenics Pull & Back Armor", focus: "Calisthenics Pull & Back Armor", muscles: ["Back", "Biceps", "Pull Ups", "Calisthenics"], isCardio: false },
    4: { title: "Thursday: Tactical Ruck & Core Bracing", focus: "Tactical Ruck & Core Bracing", muscles: ["Core", "Abs", "Back", "Walking"], isCardio: true, cardioKm: "5.0 - 10.0 KM Ruck" },
    5: { title: "Friday: Calisthenics Lower Body Power", focus: "Calisthenics Lower Body Power", muscles: ["Quadriceps", "Hamstrings", "Calves", "Glutes"], isCardio: false },
    6: { title: "Saturday: Military Fitness Benchmark", focus: "Military Fitness Benchmark", muscles: ["Full Body", "Conditioning", "Cardio"], isCardio: false },
    7: { title: "Sunday: Rest & Regenerative Mobility", focus: "Rest & Regenerative Mobility", muscles: ["Recovery", "Mobility"], isCardio: false }
  },
  lifestyle_academy: {
    1: { title: "Monday: Posture Alignment & Posterior Chain", focus: "Posture Alignment & Posterior Chain", muscles: ["Upper Back", "Shoulders", "Mobility"], isCardio: false },
    2: { title: "Tuesday: Hip Flexor Decompression & Reset", focus: "Hip Flexor Decompression & Reset", muscles: ["Hips", "Glutes", "Mobility"], isCardio: false },
    3: { title: "Wednesday: Aerobic Circulation & Brisk Walking", focus: "Aerobic Circulation & Brisk Walking", muscles: ["Cardio", "Walking"], isCardio: true, cardioKm: "5.0 - 10.0 KM" },
    4: { title: "Thursday: Chest Opening & Anterior Mobility", focus: "Chest Opening & Anterior Mobility", muscles: ["Chest", "Shoulders", "Mobility"], isCardio: false },
    5: { title: "Friday: Spinal Decompression & Core Stability", focus: "Spinal Decompression & Core Stability", muscles: ["Core", "Spine", "Abs"], isCardio: false },
    6: { title: "Saturday: Glute Activation & Kinetic Chain", focus: "Glute Activation & Kinetic Chain", muscles: ["Glutes", "Legs", "Hamstrings"], isCardio: false },
    7: { title: "Sunday: Restorative Mobility & Rest", focus: "Restorative Mobility & Rest", muscles: ["Recovery", "Mobility"], isCardio: false }
  }
};

export default function AdminWorkoutChallengeEngine() {
  const { exercises: libraryExercises, allChallenges, user, addWorkout, deleteWorkout, uploadExerciseMedia } = useApp();

  // Selected Program & Mode
  const [selectedProgramId, setSelectedProgramId] = useState<string>("immortal_90");
  const [adminTrack, setAdminTrack] = useState<"men" | "women">("men");
  const [viewMode, setViewMode] = useState<"cycle" | "day">("cycle");
  const [selectedCycleDay, setSelectedCycleDay] = useState<number>(1);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [applyToAllCycleWeeks, setApplyToAllCycleWeeks] = useState<boolean>(true);

  // Difficulty Level Tier (Beginner, Intermediate, Advanced)
  const [selectedDifficultyLevel, setSelectedDifficultyLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  // Overrides Cache - initialize immediately from cached schedule store
  const [serverOverrides, setServerOverrides] = useState<Record<string, any>>(() => getScheduleOverrides());
  const [isLoadingOverrides, setIsLoadingOverrides] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);
  const [isPurging, setIsPurging] = useState<boolean>(false);

  // Subscribe to live schedule store updates
  useEffect(() => {
    const unsub = subscribeScheduleOverrides((updated) => {
      if (updated && typeof updated === "object" && Object.keys(updated).length > 0) {
        setServerOverrides(updated);
      }
    });
    return () => unsub();
  }, []);

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

  // Deployment Version and Firestore Sync State
  const [deploymentInfo, setDeploymentInfo] = useState<{
    buildId?: string;
    commit?: string;
    status?: string;
    verifiedAt?: string;
  } | null>(null);
  const [isVerifyingSync, setIsVerifyingSync] = useState(false);

  const checkDeploymentSync = useCallback(async () => {
    setIsVerifyingSync(true);
    try {
      const res = await fetch("/api/version");
      if (res.ok) {
        const data = await res.json();
        setDeploymentInfo({
          buildId: data.buildId,
          commit: data.commit,
          status: data.status,
          verifiedAt: new Date().toLocaleTimeString()
        });
      }
    } catch {
      // ignore network errors
    } finally {
      setIsVerifyingSync(false);
    }
  }, []);

  useEffect(() => {
    checkDeploymentSync();
  }, [checkDeploymentSync]);

  // Split Meta Editing
  const [splitTitle, setSplitTitle] = useState<string>("");
  const [splitCategory, setSplitCategory] = useState<string>("");
  const [splitMuscles, setSplitMuscles] = useState<string>("");

  // Validation State
  const [validationReports, setValidationReports] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [auditTimestamp, setAuditTimestamp] = useState<string | null>(null);

  // Load Overrides from Server, Cloud Firestore & LocalStorage
  const refreshOverrides = useCallback(async () => {
    setIsLoadingOverrides(true);
    let loaded = false;
    try {
      const res = await fetch("/api/admin/programs/overrides?fresh=true", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.overrides && typeof data.overrides === "object" && Object.keys(data.overrides).length > 0) {
          setServerOverrides(data.overrides);
          setScheduleOverridesFromRemote(data.overrides, data.updatedAt || data.serverTime);
          loaded = true;
        }
      }
    } catch (err) {
      console.warn("Notice fetching overrides from /api/admin/programs/overrides:", err);
    }

    // Direct Firestore self-healing: query all program_schedules documents
    try {
      const snap = await getDocs(collection(db, "program_schedules"));
      if (!snap.empty) {
        const firestoreOverrides: Record<string, any> = {};
        snap.forEach(d => {
          if (d.id === "overrides") return;
          const docData = d.data();
          if (docData && docData.schedule && typeof docData.schedule === "object") {
            firestoreOverrides[d.id] = docData.schedule;
          } else if (docData && typeof docData === "object") {
            const { updatedAt, updatedBy, programId, ...cleanSchedule } = docData;
            if (Object.keys(cleanSchedule).length > 0) {
              firestoreOverrides[d.id] = cleanSchedule;
            }
          }
        });
        if (Object.keys(firestoreOverrides).length > 0) {
          setServerOverrides(firestoreOverrides);
          setScheduleOverridesFromRemote(firestoreOverrides);
          loaded = true;
          console.log(`[Firestore Recovery OK] Recovered ${Object.keys(firestoreOverrides).length} programs from Firestore program_schedules collection.`);
        }
      }
    } catch (e) {}

    // Cache fallback
    if (!loaded) {
      try {
        const cached = getScheduleOverrides();
        if (cached && typeof cached === "object") setServerOverrides(prev => ({ ...cached, ...prev }));
      } catch (e) {}
    }
    setIsLoadingOverrides(false);
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
        targetAudience: "Beginner to Advanced"
      };
    }

    return {
      id: selectedProgramId as any,
      name: selectedProgramId.replace(/_/g, " ").toUpperCase(),
      totalDays: 90,
      category: "Specialized Training",
      targetAudience: "Beginner to Advanced"
    };
  }, [selectedProgramId, allChallenges]);

  // Base day plan from challenge engine
  const baseDayPlan = useMemo(() => {
    // Check if selected program is a custom challenge in allChallenges
    const customMatch = (allChallenges || []).find((c: any) => c.id === selectedProgramId || c.challengeId === selectedProgramId);
    if (customMatch) {
      // If custom challenge has workouts attached to it
      const challengeWorkouts = (customMatch.workouts && Array.isArray(customMatch.workouts) && customMatch.workouts.length > 0)
        ? customMatch.workouts
        : getChallengeWorkouts(customMatch, libraryExercises, effectiveDayNumber);

      if (challengeWorkouts && challengeWorkouts.length > 0) {
        const mappedDrills: ChallengeExerciseItem[] = challengeWorkouts.map((w: any, idx: number) => {
          const wName = w.name || w.exerciseName || `Drill ${idx + 1}`;
          const diff = (w.difficulty || "Beginner") as any;
          const gif = w.gifUrl || w.customMediaUrl || w.imageUrl || getExerciseGifUrl(wName, w.category);
          return {
            id: w.id || `custom_${selectedProgramId}_ex_${idx + 1}`,
            programId: selectedProgramId as any,
            programName: customMatch.title || selectedProgramId,
            dayNumber: effectiveDayNumber,
            category: w.category || customMatch.category || "Specialized Training",
            muscleGroup: w.muscleGroups || (w.muscleGroup ? [w.muscleGroup] : ["Full Body"]),
            exerciseName: wName,
            name: wName,
            equipment: Array.isArray(w.equipment) ? w.equipment.join(", ") : String(w.equipment || "Bodyweight"),
            difficulty: diff,
            sets: typeof w.sets === "number" ? w.sets : (parseInt(String(w.sets)) || 3),
            reps: String(w.reps || "10-12 reps"),
            duration: w.duration || "45s",
            instructions: w.instructions || ["Execute with precision, controlled tempo, and deliberate focus."],
            restTime: w.restTime || "60s",
            gifUrl: gif,
            imageUrl: gif,
            coachingCues: w.coachingCues || (w.movementExecution ? [w.movementExecution] : ["Full range of motion and core stability."])
          };
        });

        return {
          meta: {
            dayNumber: effectiveDayNumber,
            programId: selectedProgramId as any,
            title: `Day ${effectiveDayNumber}: ${customMatch.title || "Custom Challenge"}`,
            category: customMatch.category || "Specialized Training",
            targetMuscles: [customMatch.category || "Full Body"],
            estimatedDuration: "45-60 mins",
            estimatedCalories: 450,
            isRestDay: false,
            isCardioOnly: false,
            guidelines: [
              `Focus: ${customMatch.title || "Custom Workout Session"}.`,
              "Focus on progressive tension and strict movement mechanics."
            ],
            coachingNotes: `${customMatch.title} - complete each prescribed drill.`
          },
          exercises: mappedDrills
        };
      }
    }

    return getWorkoutForProgramAndDay(selectedProgramId as ProgramId, effectiveDayNumber, undefined, adminTrack);
  }, [selectedProgramId, effectiveDayNumber, adminTrack, allChallenges, libraryExercises, serverOverrides]);

  // Check if override exists for this day or cycle using canonical public-view precedence
  const currentDayOverride = useMemo(() => {
    const normId = normalizeProgramId(selectedProgramId);
    const baseTrackNormId = String(normId).replace(/_(women|men)$/i, "");
    const trackKey = adminTrack ? `${baseTrackNormId}_${adminTrack}` : null;
    const progOverrides =
      (adminTrack === "women" && trackKey && serverOverrides[trackKey])
        ? serverOverrides[trackKey]
        : (trackKey && serverOverrides[trackKey]) || serverOverrides[selectedProgramId] || serverOverrides[normId] || {};
    return resolveProgramDayOverride(progOverrides, effectiveDayNumber);
  }, [serverOverrides, selectedProgramId, effectiveDayNumber, adminTrack]);

  // Tier counts per difficulty level (Beginner, Intermediate, Advanced only)
  const tierCounts = useMemo(() => {
    const override = currentDayOverride;
    const base = baseDayPlan.exercises || [];
    const fallbackCount = (override && Array.isArray(override.exercises))
      ? override.exercises.length
      : base.length;

    const getTierCount = (tier: "beginner" | "intermediate" | "advanced") => {
      if (tier === "advanced") {
        if (override?.levels && "advanced" in override.levels && Array.isArray(override.levels.advanced)) {
          return override.levels.advanced.length;
        }
        if (override && "advancedExercises" in override && Array.isArray(override.advancedExercises)) {
          return override.advancedExercises.length;
        }
        return 0;
      }
      if (tier === "intermediate") {
        const hasCustomInterLevels =
          override?.levels &&
          "intermediate" in override.levels &&
          Array.isArray(override.levels.intermediate) &&
          (override.levels.intermediate.length > 0 || override.intermediateExplicitlyCleared === true);
        if (hasCustomInterLevels) return override.levels.intermediate.length;

        const hasCustomInterArray =
          override &&
          "intermediateExercises" in override &&
          Array.isArray(override.intermediateExercises) &&
          (override.intermediateExercises.length > 0 || override.intermediateExplicitlyCleared === true);
        if (hasCustomInterArray) return override.intermediateExercises.length;

        if (override?.levels && "beginner" in override.levels && Array.isArray(override.levels.beginner)) {
          return override.levels.beginner.length;
        }
        return fallbackCount;
      }
      if (override?.levels && tier in override.levels && Array.isArray(override.levels[tier])) {
        return override.levels[tier].length;
      }
      const tierExKey = `${tier}Exercises` as "beginnerExercises" | "intermediateExercises";
      if (override && tierExKey in override && Array.isArray(override[tierExKey])) {
        return override[tierExKey].length;
      }
      return fallbackCount;
    };

    return {
      beginner: getTierCount("beginner"),
      intermediate: getTierCount("intermediate"),
      advanced: getTierCount("advanced")
    };
  }, [currentDayOverride, baseDayPlan]);

  // Is the currently selected tier customized with its own distinct routine
  const isTierCustomized = useMemo(() => {
    if (!currentDayOverride) return false;
    const lvl = currentDayOverride.levels?.[selectedDifficultyLevel];
    const tierExKey = `${selectedDifficultyLevel}Exercises` as "beginnerExercises" | "intermediateExercises" | "advancedExercises";
    if (selectedDifficultyLevel === "advanced") {
      return Array.isArray(lvl) || Array.isArray(currentDayOverride[tierExKey]);
    }
    if (selectedDifficultyLevel === "intermediate") {
      return (
        (Array.isArray(lvl) && (lvl.length > 0 || currentDayOverride.intermediateExplicitlyCleared === true)) ||
        (Array.isArray(currentDayOverride[tierExKey]) && (currentDayOverride[tierExKey].length > 0 || currentDayOverride.intermediateExplicitlyCleared === true))
      );
    }
    return Array.isArray(lvl) || (Array.isArray(currentDayOverride[tierExKey]) && currentDayOverride[tierExKey].length > 0);
  }, [currentDayOverride, selectedDifficultyLevel]);

  // Active exercises list for currently selected tier
  const activeExercises = useMemo(() => {
    let rawList: ChallengeExerciseItem[] = [];

    const getTierList = (tier: "beginner" | "intermediate" | "advanced") => {
      if (tier === "advanced") {
        if (currentDayOverride?.levels && "advanced" in currentDayOverride.levels && Array.isArray(currentDayOverride.levels.advanced)) {
          return currentDayOverride.levels.advanced;
        }
        if (currentDayOverride && "advancedExercises" in currentDayOverride && Array.isArray(currentDayOverride.advancedExercises)) {
          return currentDayOverride.advancedExercises;
        }
        return [];
      }
      if (tier === "intermediate") {
        const hasCustomInterLevels =
          currentDayOverride?.levels &&
          "intermediate" in currentDayOverride.levels &&
          Array.isArray(currentDayOverride.levels.intermediate) &&
          (currentDayOverride.levels.intermediate.length > 0 || currentDayOverride.intermediateExplicitlyCleared === true);
        if (hasCustomInterLevels) return currentDayOverride.levels.intermediate;

        const hasCustomInterArray =
          currentDayOverride &&
          "intermediateExercises" in currentDayOverride &&
          Array.isArray(currentDayOverride.intermediateExercises) &&
          (currentDayOverride.intermediateExercises.length > 0 || currentDayOverride.intermediateExplicitlyCleared === true);
        if (hasCustomInterArray) return currentDayOverride.intermediateExercises;

        if (currentDayOverride?.levels && "beginner" in currentDayOverride.levels && Array.isArray(currentDayOverride.levels.beginner) && currentDayOverride.levels.beginner.length > 0) {
          return currentDayOverride.levels.beginner;
        }
        if (currentDayOverride && "beginnerExercises" in currentDayOverride && Array.isArray(currentDayOverride.beginnerExercises) && currentDayOverride.beginnerExercises.length > 0) {
          return currentDayOverride.beginnerExercises;
        }
      } else {
        if (currentDayOverride?.levels && tier in currentDayOverride.levels && Array.isArray(currentDayOverride.levels[tier])) {
          return currentDayOverride.levels[tier];
        }
        const tierExKey = `${tier}Exercises` as "beginnerExercises" | "intermediateExercises";
        if (currentDayOverride && tierExKey in currentDayOverride && Array.isArray(currentDayOverride[tierExKey])) {
          return currentDayOverride[tierExKey];
        }
      }
      return (currentDayOverride && Array.isArray(currentDayOverride.exercises))
        ? currentDayOverride.exercises
        : (baseDayPlan.exercises || []);
    };

    const selectedTierList = getTierList(selectedDifficultyLevel);
    const hasAdminInTier = Array.isArray(selectedTierList) && selectedTierList.some((d: any) => d && d.addedByAdmin === true);
    rawList = hasAdminInTier ? selectedTierList.filter((d: any) => d && d.addedByAdmin === true) : selectedTierList;

    const seenNames = new Set<string>();
    const seenGifs = new Set<string>();
    const deduplicated: ChallengeExerciseItem[] = [];

    for (const ex of rawList) {
      if (!ex) continue;
      const name = (ex.exerciseName || (ex as any).name || "").trim();
      if (!name) continue;
      const lower = name.toLowerCase();
      if (seenNames.has(lower)) continue;
      seenNames.add(lower);

      let gif = ex.gifUrl !== undefined ? ex.gifUrl : ((ex as any).customMediaUrl !== undefined ? (ex as any).customMediaUrl : undefined);
      if (gif === undefined) {
        gif = getExerciseGifUrl(name, ex.category, seenGifs);
      }
      if (gif) {
        seenGifs.add(gif);
      }

      deduplicated.push({
        ...ex,
        name,
        exerciseName: name,
        gifUrl: gif || "",
        imageUrl: gif || ""
      });
    }

    return deduplicated;
  }, [currentDayOverride, baseDayPlan, selectedDifficultyLevel]);

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

    const normKey = normalizeProgramId(selectedProgramId);
    const cycleDay = ((effectiveDayNumber - 1) % 7) + 1;
    const progSplits = PROGRAM_CANONICAL_SPLITS[normKey] || PROGRAM_CANONICAL_SPLITS.immortal_90;
    const canonical = progSplits[cycleDay];

    setSplitTitle(currentDayOverride?.title || baseDayPlan.meta.title || canonical?.title || `Day ${effectiveDayNumber} Workout`);
    setSplitCategory(currentDayOverride?.category || currentDayOverride?.focus || baseDayPlan.meta.category || canonical?.focus || "Custom Split");
    setSplitMuscles(Array.isArray(baseDayPlan.meta.targetMuscles) ? baseDayPlan.meta.targetMuscles.join(", ") : canonical?.muscles?.join(", ") || "Target Muscles");
  }, [selectedProgramId, effectiveDayNumber, currentDayOverride, baseDayPlan, adminTrack]);

  // Broadcast and persist changes helper
  const broadcastOverridesUpdated = (updatedOverrides: Record<string, any>) => {
    setScheduleOverridesFromAdmin(updatedOverrides);
  };

  // Reorder Exercises Handler
  const handleReorderExercises = async (
    newExercises: ChallengeExerciseItem[], 
    forTier?: "beginner" | "intermediate" | "advanced",
    explicitLevels?: { beginner?: ChallengeExerciseItem[]; intermediate?: ChallengeExerciseItem[]; advanced?: ChallengeExerciseItem[] }
  ) => {
    // Deduplicate exercises and GIFs to strictly enforce zero duplication
    const seenNames = new Set<string>();
    const seenGifs = new Set<string>();
    const sanitizedExercises: ChallengeExerciseItem[] = [];

    for (const ex of newExercises) {
      const name = (ex.exerciseName || (ex as any).name || "").trim();
      if (!name) continue;
      const lower = name.toLowerCase();
      if (seenNames.has(lower)) continue;
      seenNames.add(lower);

      let rawCandidate = ex.gifUrl !== undefined ? ex.gifUrl : ((ex as any).customMediaUrl !== undefined ? (ex as any).customMediaUrl : undefined);
      let gif: string = "";

      if (rawCandidate && !["none", "deleted", "null"].includes(String(rawCandidate).trim().toLowerCase())) {
        gif = rawCandidate;
      } else {
        gif = getExerciseGifUrl(name, ex.category, seenGifs);
      }

      if (gif) {
        seenGifs.add(gif);
      }

      sanitizedExercises.push({
        ...ex,
        name,
        exerciseName: name,
        gifUrl: gif,
        imageUrl: gif,
        addedByAdmin: true
      } as any);
    }

    const existingDayData = currentDayOverride || {};
    const existingLevels = existingDayData.levels || {};
    const nextLevels = explicitLevels ? { ...existingLevels, ...explicitLevels } : { ...existingLevels };
    const targetTier = forTier || selectedDifficultyLevel;

    if (!explicitLevels) {
      if (targetTier === "beginner") {
        nextLevels.beginner = sanitizedExercises;
      } else if (targetTier === "intermediate") {
        nextLevels.intermediate = sanitizedExercises;
      } else if (targetTier === "advanced") {
        nextLevels.advanced = sanitizedExercises;
      }
    }

    const baselineExercises = explicitLevels
      ? (nextLevels.beginner || sanitizedExercises)
      : (targetTier === "beginner"
        ? sanitizedExercises
        : (nextLevels.beginner || sanitizedExercises));

    // Preserve empty intermediate array only if intermediate was explicitly cleared; otherwise remove stale empty placeholder
    const intermediateExplicitlyCleared = targetTier === "intermediate"
      ? sanitizedExercises.length === 0
      : (Boolean(existingDayData.intermediateExplicitlyCleared) && (!Array.isArray(nextLevels.intermediate) || nextLevels.intermediate.length === 0));

    if (!intermediateExplicitlyCleared && Array.isArray(nextLevels.intermediate)) {
      const hasCustomInter = nextLevels.intermediate.some((d: any) => d && d.addedByAdmin === true);
      if (!hasCustomInter && targetTier !== "intermediate") {
        delete nextLevels.intermediate;
      }
    }

    const updatedDayData: any = {
      ...existingDayData,
      title: splitTitle,
      category: splitCategory,
      focus: splitCategory,
      isCardioOnly: cardioState.isCardio,
      cardioDistance: cardioState.distance,
      cardioType: cardioState.type,
      cardioGuidelines: cardioState.guidelines,
      estimatedDuration: cardioState.durationMinutes,
      exercises: baselineExercises,
      levels: nextLevels,
      intermediateExplicitlyCleared,
      beginnerExercises: Array.isArray(nextLevels.beginner) ? nextLevels.beginner : (targetTier === "beginner" ? sanitizedExercises : (existingDayData.beginnerExercises || baselineExercises)),
      advancedExercises: Array.isArray(nextLevels.advanced) ? nextLevels.advanced : (targetTier === "advanced" ? sanitizedExercises : (Array.isArray(existingDayData.advancedExercises) ? existingDayData.advancedExercises : [])),
    };
    if (Array.isArray(nextLevels.intermediate) && (nextLevels.intermediate.length > 0 || intermediateExplicitlyCleared)) {
      updatedDayData.intermediateExercises = nextLevels.intermediate;
    } else if (targetTier === "intermediate") {
      updatedDayData.intermediateExercises = sanitizedExercises;
    } else {
      delete updatedDayData.intermediateExercises;
    }

    // Strict Men vs Women track key isolation (Women home_180 never overwrites Men's home_180)
    const isHomeProgram = selectedProgramId === "home_180" || selectedProgramId.startsWith("home_180");
    const targetProgKey = (isHomeProgram && adminTrack === "women")
      ? "home_180_women"
      : (isHomeProgram && adminTrack === "men")
        ? "home_180_men"
        : selectedProgramId;
    const keysToUpdate = (isHomeProgram && adminTrack === "women")
      ? ["home_180_women"]
      : (isHomeProgram && adminTrack === "men")
        ? ["home_180", "home_180_men"]
        : [selectedProgramId];

    const dayKey = String(effectiveDayNumber);
    const cycleKey = `cycle_${((effectiveDayNumber - 1) % 7) + 1}`;
    const isCycleSplitting = viewMode === "cycle" || applyToAllCycleWeeks;
    const computedCycleDay = ((effectiveDayNumber - 1) % 7) + 1;
    const totalProgDays = currentProgramMeta.totalDays || 90;

    let previousOverridesSnapshot: Record<string, any> | null = null;
    setServerOverrides(prev => {
      previousOverridesSnapshot = prev;
      const next = { ...prev };

      keysToUpdate.forEach(key => {
        const progCopy = { ...(next[key] || {}) };
        if (isCycleSplitting) {
          progCopy[cycleKey] = { ...updatedDayData, cycleDay: computedCycleDay };
          for (const existingKey of Object.keys(progCopy)) {
            if (/^\d+$/.test(existingKey) && progCopy[existingKey]?.isOneOff !== true) {
              const cycForNum = ((Number(existingKey) - 1) % 7) + 1;
              if (progCopy[`cycle_${cycForNum}`]) {
                delete progCopy[existingKey];
              }
            }
          }
        } else {
          progCopy[dayKey] = { ...updatedDayData, dayNumber: effectiveDayNumber, isOneOff: true };
        }
        next[key] = progCopy;
      });
      broadcastOverridesUpdated(next);
      return next;
    });

    const adminEmail = user?.email || localStorage.getItem("fit_saved_email") || "muzikworld08@gmail.com";

    const tryClientFirestoreFallback = async (): Promise<boolean> => {
      try {
        const latestOverrides = getScheduleOverrides();
        const fsResults = await Promise.all(
          keysToUpdate.map(async (persistKey) => {
            const fullSchedule: Record<string, any> = {
              ...(latestOverrides[persistKey] || serverOverrides[persistKey] || {})
            };
            if (isCycleSplitting) {
              fullSchedule[cycleKey] = { ...updatedDayData, cycleDay: computedCycleDay };
              for (const existingKey of Object.keys(fullSchedule)) {
                if (/^\d+$/.test(existingKey) && fullSchedule[existingKey]?.isOneOff !== true) {
                  const cycForNum = ((Number(existingKey) - 1) % 7) + 1;
                  if (fullSchedule[`cycle_${cycForNum}`]) {
                    delete fullSchedule[existingKey];
                  }
                }
              }
            } else {
              fullSchedule[dayKey] = { ...updatedDayData, dayNumber: effectiveDayNumber, isOneOff: true };
            }
            return await safeFirestoreSetDoc(
              doc(db, "program_schedules", persistKey),
              {
                programId: persistKey,
                schedule: fullSchedule,
                updatedAt: new Date().toISOString(),
                updatedBy: adminEmail
              },
              { merge: false },
              true
            );
          })
        );
        return fsResults.length > 0 && fsResults.every(Boolean);
      } catch (fsErr) {
        console.error(`[Firestore Admin Persist ERROR] Fallback write failed:`, fsErr);
        return false;
      }
    };

    try {
      const res = await fetchWithFirebaseAuth("/api/admin/programs/save-day-override", {
        method: "POST",
        body: JSON.stringify({
          programId: selectedProgramId,
          track: isHomeProgram ? adminTrack : undefined,
          targetProgramKey: targetProgKey,
          dayNumber: effectiveDayNumber,
          cycleDay: computedCycleDay,
          applyToAllCycleWeeks: isCycleSplitting,
          totalDays: totalProgDays,
          dayOverride: updatedDayData
        })
      });

      const resData = await res.json().catch(() => ({}));
      let confirmedInCloud = Boolean(res.ok && resData?.success !== false && resData?.cloudSaved !== false);
      if (!confirmedInCloud && !resData?.quotaExceeded) {
        confirmedInCloud = await tryClientFirestoreFallback();
      }

      if (confirmedInCloud) {
        setServerOverrides(prev => {
          const next = { ...prev };
          keysToUpdate.forEach(pid => {
            if (pid === (keysToUpdate[0] || selectedProgramId) && resData?.allProgramOverrides) {
              next[pid] = resData.allProgramOverrides;
              return;
            }
            const progCopy = { ...(next[pid] || {}) };
            if (isCycleSplitting) {
              progCopy[`cycle_${computedCycleDay}`] = updatedDayData;
              for (const existingKey of Object.keys(progCopy)) {
                if (/^\d+$/.test(existingKey) && progCopy[existingKey]?.isOneOff !== true) {
                  const cycForNum = ((Number(existingKey) - 1) % 7) + 1;
                  if (progCopy[`cycle_${cycForNum}`]) {
                    delete progCopy[existingKey];
                  }
                }
              }
            } else {
              progCopy[String(effectiveDayNumber)] = { ...updatedDayData, isOneOff: true };
            }
            next[pid] = progCopy;
          });
          broadcastOverridesUpdated(next);
          return next;
        });

        setSaveErrorMsg(null);
        setSaveSuccessMsg(`Routine for ${targetTier.toUpperCase()} manifested successfully!`);
        setTimeout(() => setSaveSuccessMsg(null), 3000);
        return true;
      } else {
        if (previousOverridesSnapshot) {
          setServerOverrides(previousOverridesSnapshot);
          broadcastOverridesUpdated(previousOverridesSnapshot);
        }
        setSaveSuccessMsg(null);
        setSaveErrorMsg(resData?.error || "Could not confirm permanent Cloud Firestore save. Changes reverted.");
        return false;
      }
    } catch (err: any) {
      console.error("[Server Admin API Error] Failed saving reordered exercises:", err);
      const fsFallbackOk = await tryClientFirestoreFallback();
      if (fsFallbackOk) {
        setSaveErrorMsg(null);
        setSaveSuccessMsg(`Routine for ${targetTier.toUpperCase()} saved to Cloud Firestore.`);
        setTimeout(() => setSaveSuccessMsg(null), 3000);
        return true;
      }
      if (previousOverridesSnapshot) {
        setServerOverrides(previousOverridesSnapshot);
        broadcastOverridesUpdated(previousOverridesSnapshot);
      }
      setSaveSuccessMsg(null);
      setSaveErrorMsg(err?.message || "Could not confirm permanent Cloud Firestore save. Please check network/permissions.");
      return false;
    }
  };

  // Move exercise up
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const reordered = [...activeExercises];
    const temp = reordered[index - 1];
    reordered[index - 1] = reordered[index];
    reordered[index] = temp;
    handleReorderExercises(reordered, selectedDifficultyLevel);
  };

  // Move exercise down
  const handleMoveDown = (index: number) => {
    if (index >= activeExercises.length - 1) return;
    const reordered = [...activeExercises];
    const temp = reordered[index + 1];
    reordered[index + 1] = reordered[index];
    reordered[index] = temp;
    handleReorderExercises(reordered, selectedDifficultyLevel);
  };

  // Instant clear/empty all workouts for the active tier routine (no blocking window dialogs)
  const handleClearTierRoutine = async () => {
    const existingLevels = currentDayOverride?.levels || {};
    const nextLevels: Record<string, ChallengeExerciseItem[]> = {
      ...existingLevels,
      [selectedDifficultyLevel]: []
    };
    const cloudOk = await handleReorderExercises([], selectedDifficultyLevel, nextLevels);
    if (cloudOk) {
      setSaveSuccessMsg(`Cleared all drills from ${selectedDifficultyLevel.toUpperCase()} routine.`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.closest("button") || target.closest("input") || target.closest("a"))) {
      e.preventDefault();
      return;
    }
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
    handleReorderExercises(reordered, selectedDifficultyLevel);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Add Exercise Handler with Category/Tier routing (Beginner, Intermediate, Advanced)
  const handleAddExercise = async (newEx: ChallengeExerciseItem, targetTier?: "Beginner" | "Intermediate" | "Advanced") => {
    const activeTierTarget = (targetTier 
      ? (targetTier.toLowerCase() as "beginner" | "intermediate" | "advanced")
      : selectedDifficultyLevel);

    if (activeTierTarget !== selectedDifficultyLevel) {
      setSelectedDifficultyLevel(activeTierTarget);
    }

    const name = (newEx.exerciseName || (newEx as any).name || "").trim();
    if (!name) return;

    // Read strictly from explicit drills for the target tier — never pull unadded pre-seeded or beginner fallbacks
    const rawTierExercises: any[] = (() => {
      if (activeTierTarget === "beginner") {
        if (currentDayOverride?.levels?.beginner && Array.isArray(currentDayOverride.levels.beginner)) {
          return currentDayOverride.levels.beginner;
        }
        if (Array.isArray(currentDayOverride?.beginnerExercises)) {
          return currentDayOverride.beginnerExercises;
        }
        return Array.isArray(currentDayOverride?.exercises) ? currentDayOverride.exercises : [];
      }
      if (activeTierTarget === "intermediate") {
        if (currentDayOverride?.levels?.intermediate && Array.isArray(currentDayOverride.levels.intermediate)) {
          return currentDayOverride.levels.intermediate;
        }
        return Array.isArray(currentDayOverride?.intermediateExercises) ? currentDayOverride.intermediateExercises : [];
      }
      if (activeTierTarget === "advanced") {
        if (currentDayOverride?.levels?.advanced && Array.isArray(currentDayOverride.levels.advanced)) {
          return currentDayOverride.levels.advanced;
        }
        return Array.isArray(currentDayOverride?.advancedExercises) ? currentDayOverride.advancedExercises : [];
      }
      return [];
    })();

    // If this day/tier only holds unadded legacy pre-seeded drills (none flagged addedByAdmin), start cleanly with ONLY admin's drill
    const hasAdminAddedDrills = rawTierExercises.some((d: any) => d && d.addedByAdmin === true);
    const currentTierExercises = hasAdminAddedDrills ? rawTierExercises : [];

    if (currentTierExercises.some(e => (e.exerciseName || (e as any).name || "").toLowerCase().trim() === name.toLowerCase())) {
      setSaveErrorMsg(`"${name}" is already included in this ${activeTierTarget.toUpperCase()} routine.`);
      return;
    }

    const assignedGif =
      newEx.gifUrl && !["none", "deleted", "null"].includes(newEx.gifUrl.trim().toLowerCase())
        ? newEx.gifUrl.trim()
        : getExerciseGifUrl(name, newEx.category);

    const assignedDiff = (activeTierTarget.charAt(0).toUpperCase() + activeTierTarget.slice(1)) as any;

    const existingLibMatch = libraryExercises.find(
      e => (e.name || "").toLowerCase().trim() === name.toLowerCase() || (newEx.exerciseId && e.id === newEx.exerciseId) || e.id === newEx.id
    );
    let targetLibraryId = existingLibMatch?.id || newEx.exerciseId || newEx.id;

    if (!existingLibMatch && addWorkout) {
      try {
        const persistedExercise = await addWorkout({
          id: targetLibraryId,
          name,
          category: newEx.category || "Gym Workouts",
          categories: [newEx.category || "Gym Workouts"],
          difficulty: assignedDiff,
          muscleGroups: Array.isArray(newEx.muscleGroup)
            ? newEx.muscleGroup
            : newEx.muscleGroup
            ? [String(newEx.muscleGroup)]
            : [newEx.category || "Full Body"],
          equipment: Array.isArray(newEx.equipment)
            ? newEx.equipment
            : newEx.equipment
            ? [String(newEx.equipment)]
            : ["Bodyweight"],
          instructions: Array.isArray(newEx.instructions) && newEx.instructions.length > 0
            ? newEx.instructions
            : ["Execute movement with controlled tempo and strict posture."],
          recommendedSets: String(newEx.sets || 3),
          recommendedReps: String(newEx.reps || "10-12"),
          restTime: newEx.restTime || "60s",
          gifUrl: assignedGif,
          imageUrl: assignedGif,
          customMediaUrl: assignedGif,
          customMediaType: "image",
          genderSuitability: newEx.genderSuitability,
          womenCategories: newEx.womenCategories,
          reuseIfExists: true
        });
        if (persistedExercise?.id) {
          targetLibraryId = persistedExercise.id;
        }
      } catch (libErr) {
        console.warn("[ChallengeEngine] Exercise already in library or sync deferred:", libErr);
      }
    }

    const finalEx: ChallengeExerciseItem = {
      ...newEx,
      exerciseId: targetLibraryId,
      name,
      exerciseName: name,
      difficulty: assignedDiff,
      gifUrl: assignedGif,
      imageUrl: assignedGif,
      addedByAdmin: true
    } as any;

    const updated = [...currentTierExercises, finalEx];
    const ok = await handleReorderExercises(updated, activeTierTarget);

    if (ok && assignedGif && !existingLibMatch) {
      try {
        await uploadExerciseMedia(targetLibraryId, assignedGif, "image");
      } catch {}
    }

    if (ok) {
      setSaveErrorMsg(null);
      setSaveSuccessMsg(`Added "${name}" to ${activeTierTarget.toUpperCase()} routine & saved permanently to Firebase!`);
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    }
  };

  // Save edited exercise drill parameters
  const handleSaveEditedExercise = async (updatedEx: ChallengeExerciseItem) => {
    const updated = activeExercises.map(ex => ex.id === updatedEx.id ? updatedEx : ex);
    const ok = await handleReorderExercises(updated, selectedDifficultyLevel);

    const rawName = (updatedEx.exerciseName || (updatedEx as any).name || "").toLowerCase().trim();
    const match = libraryExercises.find(
      e => (updatedEx.exerciseId && e.id === updatedEx.exerciseId) || e.id === updatedEx.id || (rawName && (e.name || "").toLowerCase().trim() === rawName)
    );
    const targetId = match?.id || updatedEx.exerciseId || updatedEx.id;

    if (updatedEx.gifUrl && !["none", "deleted", "null"].includes(updatedEx.gifUrl.trim().toLowerCase())) {
      try {
        await uploadExerciseMedia(targetId, updatedEx.gifUrl, "image");
      } catch {}
    } else {
      try {
        await uploadExerciseMedia(targetId, null, "image");
      } catch {}
    }

    if (ok) {
      setSaveSuccessMsg(`Updated parameters for "${updatedEx.exerciseName}" in ${selectedDifficultyLevel.toUpperCase()} routine!`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
      setEditingExercise(null);
    }
  };

  // Replace Exercise with Chosen Exercise
  const handleReplaceExercise = async (chosenEx: Exercise | any, keepSetsReps: boolean) => {
    if (!targetToReplace) return;
    setIsReplacing(true);

    try {
      const chosenName = chosenEx.name || chosenEx.exerciseName;
      const candidateGif = chosenEx.customMediaUrl || chosenEx.gifUrl || chosenEx.imageUrl || "";
      const finalGif =
        candidateGif && !["none", "deleted", "null"].includes(String(candidateGif).trim().toLowerCase())
          ? String(candidateGif).trim()
          : getExerciseGifUrl(chosenName, chosenEx.category || targetToReplace.category);

      const assignedDiff = (selectedDifficultyLevel.charAt(0).toUpperCase() + selectedDifficultyLevel.slice(1)) as any;

      const replacementItem: ChallengeExerciseItem = {
        id: `rep_${selectedProgramId}_${selectedDifficultyLevel}_d${effectiveDayNumber}_${Date.now()}`,
        programId: selectedProgramId as any,
        programName: selectedProgramId,
        dayNumber: effectiveDayNumber,
        category: chosenEx.category || targetToReplace.category,
        muscleGroup: chosenEx.muscleGroups || targetToReplace.muscleGroup,
        exerciseName: chosenName,
        name: chosenName,
        equipment: Array.isArray(chosenEx.equipment) ? chosenEx.equipment.join(", ") : String(chosenEx.equipment || targetToReplace.equipment),
        difficulty: assignedDiff,
        sets: keepSetsReps ? targetToReplace.sets : (assignedDiff === "Beginner" ? 3 : (assignedDiff === "Advanced" ? 4 : 3)),
        reps: keepSetsReps ? targetToReplace.reps : (assignedDiff === "Beginner" ? "10-12 reps" : (assignedDiff === "Advanced" ? "6-8 heavy reps" : "8-10 reps")),
        duration: targetToReplace.duration || "45s set",
        instructions: chosenEx.instructions && chosenEx.instructions.length > 0 
          ? chosenEx.instructions 
          : targetToReplace.instructions,
        restTime: targetToReplace.restTime || (assignedDiff === "Beginner" ? "60s" : (assignedDiff === "Advanced" ? "90s" : "45s")),
        gifUrl: finalGif,
        imageUrl: finalGif,
        coachingCues: chosenEx.movementExecution ? [chosenEx.movementExecution] : targetToReplace.coachingCues
      };

      const updated = activeExercises.map((ex: ChallengeExerciseItem) => ex.id === targetToReplace.id ? replacementItem : ex);
      const cloudOk = await handleReorderExercises(updated, selectedDifficultyLevel);

      if (cloudOk) {
        setSaveSuccessMsg(`Replaced "${targetToReplace.exerciseName}" with "${replacementItem.exerciseName}" in ${selectedDifficultyLevel.toUpperCase()} routine!`);
        setTimeout(() => setSaveSuccessMsg(null), 3500);
      }
      setTargetToReplace(null);
    } catch (err: any) {
      console.error("Replacement error:", err);
      setSaveErrorMsg("Failed replacing workout: " + (err?.message || "Unknown error"));
    } finally {
      setIsReplacing(false);
    }
  };

  // Row-Only Drill Removal: removes strictly from THIS program/day/tier routine without touching other tiers/programs or global library
  const handleDeleteOnly = async (targetParam?: any) => {
    const target = targetParam || targetToDelete;
    if (!target) return;
    setTargetToDelete(null);
    setIsDeleting(true);

    try {
      const targetId = target.id;
      const targetExId = target.exerciseId;
      const targetName = (target.exerciseName || target.name || "").toLowerCase().trim();
      const targetNameClean = targetName.replace(/[^a-z0-9]/g, "");

      const filterOutTarget = (list: ChallengeExerciseItem[]) => {
        if (!Array.isArray(list)) return [];
        return list.filter((ex: ChallengeExerciseItem) => {
          if (!ex) return false;
          if (targetId && (ex.id === targetId || (ex as any).exerciseId === targetId)) return false;
          if (targetExId && (ex.id === targetExId || (ex as any).exerciseId === targetExId)) return false;
          const n = (ex.exerciseName || (ex as any).name || "").toLowerCase().trim();
          if (targetName && n === targetName) return false;
          if (targetNameClean && n.replace(/[^a-z0-9]/g, "") === targetNameClean) return false;
          return true;
        });
      };

      const updated = filterOutTarget(activeExercises);

      // Update ONLY the currently active tier so other tiers stay completely untouched
      const existingLevels = currentDayOverride?.levels || {};
      const nextLevels: Record<string, ChallengeExerciseItem[]> = {
        ...existingLevels,
        [selectedDifficultyLevel]: updated
      };

      // 1. Call atomic remove-drill endpoint for this program/day/tier
      let apiRemoved = false;
      try {
        const remRes = await fetchWithFirebaseAuth("/api/admin/programs/remove-drill", {
          method: "POST",
          body: JSON.stringify({
            programId: selectedProgramId,
            track: (selectedProgramId === "home_180" || selectedProgramId.includes("home")) ? adminTrack : undefined,
            dayNumber: effectiveDayNumber,
            cycleDay: ((effectiveDayNumber - 1) % 7) + 1,
            applyToAllCycleWeeks: viewMode === "cycle" || applyToAllCycleWeeks,
            totalDays: currentProgramMeta.totalDays,
            tier: selectedDifficultyLevel,
            exerciseId: targetId,
            exerciseName: target.exerciseName || target.name
          })
        });
        const remData = await remRes.json().catch(() => ({}));
        if (remRes.ok && remData?.success && remData?.cloudSaved !== false) {
          apiRemoved = true;
        }
      } catch (remErr) {
        console.warn("[Admin remove-drill] Falling back to direct schedule save:", remErr);
      }

      // 2. Persist full day state cleanly to Firestore + overrides store
      const cloudOk = await handleReorderExercises(updated, selectedDifficultyLevel, nextLevels);

      if (cloudOk || apiRemoved) {
        setSaveErrorMsg(null);
        setSaveSuccessMsg(`Removed "${target.exerciseName || target.name}" from ${selectedDifficultyLevel.toUpperCase()} routine.`);
        setTimeout(() => setSaveSuccessMsg(null), 3000);
      } else {
        setSaveErrorMsg("Could not confirm routine update in Cloud Firestore.");
      }
    } catch (err: any) {
      console.error("[Firestore Admin Transaction ERROR] Routine drill removal error:", err);
      setSaveErrorMsg("Failed to remove workout: " + (err?.message || "Unknown error"));
    } finally {
      setIsDeleting(false);
    }
  };

  // Explicit Global Soft-Delete + Archive everywhere across platform
  const handleGlobalArchiveDelete = async (targetParam?: any) => {
    const target = targetParam || targetToDelete;
    if (!target) return;
    setTargetToDelete(null);
    setIsDeleting(true);

    try {
      const targetId = target.id;
      const targetExId = target.exerciseId;
      const targetName = (target.exerciseName || target.name || "").toLowerCase().trim();
      const targetNameClean = targetName.replace(/[^a-z0-9]/g, "");

      const filterOutTarget = (list: ChallengeExerciseItem[]) => {
        if (!Array.isArray(list)) return [];
        return list.filter((ex: ChallengeExerciseItem) => {
          if (!ex) return false;
          if (targetId && (ex.id === targetId || (ex as any).exerciseId === targetId)) return false;
          if (targetExId && (ex.id === targetExId || (ex as any).exerciseId === targetExId)) return false;
          const n = (ex.exerciseName || (ex as any).name || "").toLowerCase().trim();
          if (targetName && n === targetName) return false;
          if (targetNameClean && n.replace(/[^a-z0-9]/g, "") === targetNameClean) return false;
          return true;
        });
      };

      const updated = filterOutTarget(activeExercises);
      const existingLevels = currentDayOverride?.levels || {};
      const nextLevels: Record<string, ChallengeExerciseItem[]> = {
        ...existingLevels,
        [selectedDifficultyLevel]: updated
      };

      const cloudOk = await handleReorderExercises(updated, selectedDifficultyLevel, nextLevels);
      let globalDeleted = false;
      if (deleteWorkout) {
        globalDeleted = await deleteWorkout(targetExId || targetId, target.exerciseName || target.name);
      }

      if (cloudOk || globalDeleted) {
        setSaveErrorMsg(null);
        setSaveSuccessMsg(`Archived and removed "${target.exerciseName || target.name}" across the platform.`);
        setTimeout(() => setSaveSuccessMsg(null), 3500);
      } else {
        setSaveErrorMsg("Could not confirm global archive in Cloud Firestore.");
      }
    } catch (err: any) {
      setSaveErrorMsg("Failed to archive workout: " + (err?.message || "Unknown error"));
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete and Auto-Replace via Dynamic Library Replacement (Instant & Resilient)
  const handleAutoReplace = async (targetParam?: any) => {
    const target = targetParam || targetToDelete;
    if (!target) return;
    setTargetToDelete(null);
    setIsDeleting(true);

    try {
      const targetMuscle = Array.isArray(target.muscleGroup) ? target.muscleGroup[0] : (target.muscleGroup || "");
      const targetCategory = target.category || "Gym Workouts";
      const existingNames = new Set(activeExercises.map(e => (e.exerciseName || (e as any).name || "").toLowerCase().trim()));

      // Pick best matching candidate from libraryExercises or EXERCISES
      const allPool = libraryExercises && libraryExercises.length > 0 ? libraryExercises : EXERCISES;
      const candidate = allPool.find(e => {
        if (!e || !e.name) return false;
        const n = e.name.toLowerCase().trim();
        if (n === (target.exerciseName || "").toLowerCase().trim() || existingNames.has(n)) return false;
        const muscleMatch = e.muscleGroups?.some(m => targetMuscle && m.toLowerCase().includes(targetMuscle.toLowerCase()));
        const catMatch = e.category && targetCategory && e.category.toLowerCase().includes(targetCategory.toLowerCase());
        return muscleMatch || catMatch;
      }) || allPool.find(e => {
        if (!e || !e.name) return false;
        const n = e.name.toLowerCase().trim();
        return n !== (target.exerciseName || "").toLowerCase().trim() && !existingNames.has(n);
      });

      if (candidate) {
        const replacementItem: ChallengeExerciseItem = {
          id: `drill_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          exerciseId: candidate.id,
          name: candidate.name,
          exerciseName: candidate.name,
          category: candidate.category || target.category,
          muscleGroup: Array.isArray(candidate.muscleGroups) ? candidate.muscleGroups : (Array.isArray(target.muscleGroup) ? target.muscleGroup : [String(target.muscleGroup || "Full Body")]),
          equipment: Array.isArray(candidate.equipment) ? candidate.equipment : [String(candidate.equipment || target.equipment || "Bodyweight")],
          gifUrl: candidate.customMediaUrl || candidate.gifUrl || candidate.imageUrl || getExerciseGifUrl(candidate.name, candidate.category),
          imageUrl: candidate.customMediaUrl || candidate.imageUrl || candidate.gifUrl || getExerciseGifUrl(candidate.name, candidate.category),
          sets: target.sets || 3,
          reps: target.reps || "10-12",
          duration: target.duration || "45s set",
          instructions: candidate.instructions || target.instructions || [],
          coachingCues: candidate.movementExecution ? [candidate.movementExecution] : (target.coachingCues || [])
        };

        const updated = activeExercises.map((ex: ChallengeExerciseItem) => ex.id === target.id ? replacementItem : ex);
        // Instant optimistic manifestation across all tier mappings
        const cloudOk = await handleReorderExercises(updated, selectedDifficultyLevel);

        // Ensure replacement GIF is permanent globally
        if (replacementItem.gifUrl) {
          try {
            uploadExerciseMedia(replacementItem.exerciseId || replacementItem.id, replacementItem.gifUrl, "image");
          } catch (e) {}
        }

        if (cloudOk) {
          setSaveSuccessMsg(`Dynamically substituted "${target.exerciseName || target.name}" with "${replacementItem.exerciseName}" in ${selectedDifficultyLevel.toUpperCase()} routine!`);
          setTimeout(() => setSaveSuccessMsg(null), 3500);
        }

        // Notify server in background
        (async () => {
          try {
            const repRes = await fetchWithFirebaseAuth("/api/admin/programs/delete-and-replace", {
              method: "POST",
              body: JSON.stringify({
                programId: selectedProgramId,
                dayNumber: effectiveDayNumber,
                cycleDay: ((effectiveDayNumber - 1) % 7) + 1,
                applyToAllCycleWeeks: applyToAllCycleWeeks || viewMode === "cycle",
                totalDays: currentProgramMeta.totalDays,
                exerciseId: target.id,
                currentExercises: activeExercises,
                categoryHint: target.category,
                muscleGroupHint: targetMuscle
              })
            });
            const repData = await repRes.json().catch(() => ({}));
            if (repData?.cloudSaved === false) {
              setSaveSuccessMsg(null);
              setSaveErrorMsg("Saved on this server only. NOT permanent. Check Firestore quota/logs.");
            }
          } catch (e) {}
        })();
      } else {
        await handleDeleteOnly();
      }
    } catch (err: any) {
      console.error("Auto-replace error:", err);
      setSaveErrorMsg("Failed to auto-replace: " + (err?.message || "Unknown error"));
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy drills from another tier into the currently active tier
  const handleCopyTier = (fromTier: "beginner" | "intermediate" | "advanced") => {
    const sourceList = (currentDayOverride?.levels?.[fromTier] && Array.isArray(currentDayOverride.levels[fromTier]) && currentDayOverride.levels[fromTier].length > 0)
      ? currentDayOverride.levels[fromTier]
      : (currentDayOverride?.[`${fromTier}Exercises`] && Array.isArray(currentDayOverride[`${fromTier}Exercises`]) && currentDayOverride[`${fromTier}Exercises`].length > 0)
      ? currentDayOverride[`${fromTier}Exercises`]
      : activeExercises;

    const formattedTarget = selectedDifficultyLevel.charAt(0).toUpperCase() + selectedDifficultyLevel.slice(1);
    const copied: ChallengeExerciseItem[] = sourceList.map(ex => ({
      ...ex,
      id: `ex_${selectedProgramId}_${selectedDifficultyLevel}_d${effectiveDayNumber}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      difficulty: formattedTarget as any,
      sets: selectedDifficultyLevel === "beginner" ? 3 : (selectedDifficultyLevel === "advanced" ? 4 : 3),
      reps: selectedDifficultyLevel === "beginner" ? "10-12 reps" : (selectedDifficultyLevel === "advanced" ? "6-8 heavy reps" : "8-10 reps"),
      restTime: selectedDifficultyLevel === "beginner" ? "60s" : (selectedDifficultyLevel === "advanced" ? "90s" : "45s")
    }));

    handleReorderExercises(copied, selectedDifficultyLevel);
    setSaveSuccessMsg(`Copied ${copied.length} drills from ${fromTier.toUpperCase()} into ${formattedTarget} routine!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Start a fresh blank routine for the active tier
  const handleStartBlankActiveTier = () => {
    handleReorderExercises([], selectedDifficultyLevel);
    setSaveSuccessMsg(`Started blank routine for ${selectedDifficultyLevel.toUpperCase()}! Click "+ Add Exercise Drill" to add drills.`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Save Split and Cardio Setup
  const handleSaveDayConfiguration = async () => {
    setIsSaving(true);
    try {
      const existingLevels = currentDayOverride?.levels || {};
      const nextLevels: any = { ...existingLevels };
      const stampedActive = activeExercises.map(ex => ({ ...ex, addedByAdmin: true }));
      nextLevels[selectedDifficultyLevel] = stampedActive;

      const baselineList = selectedDifficultyLevel === "beginner"
        ? stampedActive
        : (nextLevels.beginner || currentDayOverride?.exercises || baseDayPlan.exercises || []);

      const existingInter = Array.isArray(nextLevels.intermediate)
        ? nextLevels.intermediate
        : (Array.isArray(currentDayOverride?.intermediateExercises) ? currentDayOverride.intermediateExercises : []);
      const hasInterDrills = existingInter.length > 0;
      const intermediateExplicitlyCleared = selectedDifficultyLevel === "intermediate"
        ? stampedActive.length === 0
        : (Boolean(currentDayOverride?.intermediateExplicitlyCleared) && !hasInterDrills);

      const savedLevels: any = {
        beginner: cardioState.isCardio ? [] : (selectedDifficultyLevel === "beginner" ? stampedActive : (nextLevels.beginner || currentDayOverride?.beginnerExercises || baselineList)),
        advanced: cardioState.isCardio ? [] : (selectedDifficultyLevel === "advanced" ? stampedActive : (nextLevels.advanced || currentDayOverride?.advancedExercises || []))
      };
      if (!cardioState.isCardio && (selectedDifficultyLevel === "intermediate" || hasInterDrills || intermediateExplicitlyCleared)) {
        savedLevels.intermediate = selectedDifficultyLevel === "intermediate" ? stampedActive : existingInter;
      }

      const dayData: any = {
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
        exercises: cardioState.isCardio ? [] : (selectedDifficultyLevel === "beginner" ? stampedActive : baselineList),
        levels: savedLevels,
        intermediateExplicitlyCleared,
        beginnerExercises: savedLevels.beginner,
        advancedExercises: savedLevels.advanced,
        ...(savedLevels.intermediate !== undefined ? { intermediateExercises: savedLevels.intermediate } : {})
      };

      const isHomeProgSave = selectedProgramId === "home_180" || selectedProgramId.startsWith("home_180");
      const targetProgKey = (isHomeProgSave && adminTrack === "women")
        ? "home_180_women"
        : (isHomeProgSave && adminTrack === "men")
          ? "home_180_men"
          : selectedProgramId;
      const pidsToSave = (isHomeProgSave && adminTrack === "women")
        ? ["home_180_women"]
        : (isHomeProgSave && adminTrack === "men")
          ? ["home_180", "home_180_men"]
          : [selectedProgramId];

      const res = await fetchWithFirebaseAuth("/api/admin/programs/save-day-override", {
        method: "POST",
        body: JSON.stringify({
          programId: selectedProgramId,
          track: isHomeProgSave ? adminTrack : undefined,
          targetProgramKey: targetProgKey,
          dayNumber: effectiveDayNumber,
          cycleDay: ((effectiveDayNumber - 1) % 7) + 1,
          applyToAllCycleWeeks: applyToAllCycleWeeks || viewMode === "cycle",
          totalDays: currentProgramMeta.totalDays,
          dayOverride: dayData
        })
      });

      const data = await res.json().catch(() => ({}));
      const computedCycle = ((effectiveDayNumber - 1) % 7) + 1;
      const isCycleMode = viewMode === "cycle" || applyToAllCycleWeeks;

      let serverConfirmed = Boolean(res.ok && data?.success && data?.cloudSaved !== false && data?.firestoreOk !== false);
      let clientFallbackConfirmed = false;

      // Only attempt direct authenticated client SDK write if server could not confirm (and not already blocked by quota)
      if (!serverConfirmed && !data?.quotaExceeded) {
        try {
          const auditEmail = user?.email || localStorage.getItem("fit_saved_email") || "admin";
          const latestSnapshot = getScheduleOverrides();
          const fallbackResults = await Promise.all(
            pidsToSave.map(async (pid) => {
              const progCopy: Record<string, any> = {
                ...(latestSnapshot[pid] || serverOverrides[pid] || {})
              };
              if (isCycleMode) {
                progCopy[`cycle_${computedCycle}`] = {
                  ...dayData,
                  cycleDay: computedCycle,
                  updatedAt: new Date().toISOString(),
                  updatedBy: auditEmail
                };
                for (const existingKey of Object.keys(progCopy)) {
                  if (/^\d+$/.test(existingKey) && progCopy[existingKey]?.isOneOff !== true) {
                    const cycForNum = ((Number(existingKey) - 1) % 7) + 1;
                    if (progCopy[`cycle_${cycForNum}`]) {
                      delete progCopy[existingKey];
                    }
                  }
                }
              } else {
                progCopy[String(effectiveDayNumber)] = {
                  ...dayData,
                  dayNumber: effectiveDayNumber,
                  isOneOff: true,
                  updatedAt: new Date().toISOString(),
                  updatedBy: auditEmail
                };
              }
              return await safeFirestoreSetDoc(
                doc(db, "program_schedules", pid),
                {
                  programId: pid,
                  schedule: progCopy,
                  updatedAt: new Date().toISOString(),
                  updatedBy: auditEmail
                },
                { merge: false },
                true
              );
            })
          );
          clientFallbackConfirmed = fallbackResults.length > 0 && fallbackResults.every(Boolean);
        } catch (fsErr) {
          console.warn("Direct Firestore fallback notice:", fsErr);
        }
      }

      if (!serverConfirmed && !clientFallbackConfirmed) {
        throw new Error(data?.error || "Cloud Firestore did not confirm schedule override save. Changes were not confirmed.");
      }

      setServerOverrides(prev => {
        const next = { ...prev };
        pidsToSave.forEach(pid => {
          if (pid === (pidsToSave[0] || selectedProgramId) && data?.allProgramOverrides) {
            next[pid] = data.allProgramOverrides;
            return;
          }
          const progCopy = { ...(next[pid] || {}) };
          if (isCycleMode) {
            progCopy[`cycle_${computedCycle}`] = data?.savedOverride || { ...dayData, cycleDay: computedCycle };
            for (const existingKey of Object.keys(progCopy)) {
              if (/^\d+$/.test(existingKey) && progCopy[existingKey]?.isOneOff !== true) {
                const cycForNum = ((Number(existingKey) - 1) % 7) + 1;
                if (progCopy[`cycle_${cycForNum}`]) {
                  delete progCopy[existingKey];
                }
              }
            }
          } else {
            progCopy[String(effectiveDayNumber)] = data?.savedOverride || { ...dayData, dayNumber: effectiveDayNumber, isOneOff: true };
          }
          next[pid] = progCopy;
        });
        broadcastOverridesUpdated(next);
        return next;
      });

      setSaveErrorMsg(null);
      setSaveSuccessMsg(`Day ${effectiveDayNumber} (${splitTitle}) configuration successfully saved and manifested!`);
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } catch (err: any) {
      console.error("Save day configuration error:", err);
      setSaveErrorMsg(err?.message || "Could not confirm Cloud Firestore save.");
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

  // Purge mismatched workouts from the active day/split
  const handlePurgeMismatchedWorkouts = async (overrideCycleDay?: number) => {
    setIsPurging(true);
    try {
      const cycleDay = overrideCycleDay !== undefined ? overrideCycleDay : ((effectiveDayNumber - 1) % 7) + 1;
      const targetDay = overrideCycleDay !== undefined ? overrideCycleDay : effectiveDayNumber;
      
      const splitResolver = PROGRAM_SPLIT_DEFINITIONS[normalizeProgramId(selectedProgramId)] || PROGRAM_SPLIT_DEFINITIONS["immortal_90"];
      const splitDef = splitResolver(cycleDay);

      const targetMuscles = Array.isArray(baseDayPlan.meta.targetMuscles) && baseDayPlan.meta.targetMuscles.length > 0
        ? baseDayPlan.meta.targetMuscles
        : splitDef.targetMuscles;
      const categoryTitle = splitCategory || splitDef.categoryTitle;

      const result = purgeMismatchedExercisesFromRoutine(
        activeExercises,
        targetMuscles,
        categoryTitle,
        libraryExercises || [],
        selectedProgramId,
        targetDay
      );

      // Reorder and persist the sanitized exercise array
      const cloudOk = await handleReorderExercises(result.cleanedExercises);

      if (cloudOk) {
        if (result.removedNames.length > 0) {
          setSaveSuccessMsg(
            `🧹 Purged ${result.removedNames.length} mismatched workout(s): ${result.removedNames.join(", ")}. Split reset to strictly contain only valid ${categoryTitle} exercises!`
          );
        } else {
          setSaveSuccessMsg(`✨ Zero mismatched workouts found! Every drill in this split 100% authentically belongs to ${categoryTitle}.`);
        }
        setTimeout(() => setSaveSuccessMsg(null), 5000);
      }
    } catch (err: any) {
      console.error("Purge error:", err);
      setSaveErrorMsg("Error purging workouts: " + (err?.message || "Unknown error"));
    } finally {
      setIsPurging(false);
    }
  };

  // Purge mismatched workouts across the ENTIRE 7-day program cadence
  const handlePurgeAllProgramSplits = async () => {
    setIsPurging(true);
    try {
      const updatedOverrides = { ...(serverOverrides[selectedProgramId] || {}) };
      const splitResolver = PROGRAM_SPLIT_DEFINITIONS[normalizeProgramId(selectedProgramId)] || PROGRAM_SPLIT_DEFINITIONS["immortal_90"];
      let totalPurged = 0;
      const allRemovedItems: string[] = [];

      for (let cDay = 1; cDay <= 7; cDay++) {
        const splitDef = splitResolver(cDay);
        const dayPlan = getWorkoutForProgramAndDay(selectedProgramId as ProgramId, cDay);
        const existingOverride = updatedOverrides[String(cDay)] || updatedOverrides[`cycle_${cDay}`];
        const existingList = (existingOverride && Array.isArray(existingOverride.exercises)) 
          ? existingOverride.exercises 
          : (dayPlan.exercises || []);

        const result = purgeMismatchedExercisesFromRoutine(
          existingList,
          splitDef.targetMuscles,
          splitDef.categoryTitle,
          libraryExercises || [],
          selectedProgramId,
          cDay
        );

        totalPurged += result.removedNames.length;
        if (result.removedNames.length > 0) {
          allRemovedItems.push(`Day ${cDay} (${splitDef.categoryTitle}): removed [${result.removedNames.join(", ")}]`);
        }

        const dayData = {
          ...(existingOverride || {}),
          title: splitDef.categoryTitle,
          category: splitDef.categoryTitle,
          focus: splitDef.categoryTitle,
          isCardioOnly: !!splitDef.isCardioOnly,
          cardioDistance: splitDef.cardioDistance || "5.0 - 10.0 KM",
          exercises: result.cleanedExercises,
          updatedAt: new Date().toISOString()
        };

        updatedOverrides[String(cDay)] = dayData;
        updatedOverrides[`cycle_${cDay}`] = dayData;
      }

      setServerOverrides(prev => ({
        ...prev,
        [selectedProgramId]: updatedOverrides
      }));
      broadcastOverridesUpdated({
        ...serverOverrides,
        [selectedProgramId]: updatedOverrides
      });

      // Persist to backend server
      const purgeRes = await fetchWithFirebaseAuth("/api/admin/programs/purge-all-splits", {
        method: "POST",
        body: JSON.stringify({
          programId: selectedProgramId,
          overrides: updatedOverrides
        })
      }).catch(err => {
        console.warn("Purge sync warn:", err);
        return null;
      });
      const purgeData = purgeRes ? await purgeRes.json().catch(() => ({})) : { cloudSaved: false };

      if (!purgeRes || !purgeRes.ok || purgeData?.cloudSaved === false) {
        setSaveSuccessMsg(null);
        setSaveErrorMsg("Saved on this server only. NOT permanent. Check Firestore quota/logs.");
      } else {
        setSaveErrorMsg(null);
        setSaveSuccessMsg(
          totalPurged > 0
            ? `🚀 Full Program Purged! Removed ${totalPurged} mismatched drills across the 7-day split. All splits strictly reset to authentic category exercises!`
            : `✨ Program Cadence Audited: All 7 days are already strictly aligned with their official muscle splits!`
        );
        setTimeout(() => setSaveSuccessMsg(null), 6000);
      }
    } catch (err: any) {
      console.error("Purge all error:", err);
      setSaveErrorMsg("Error purging all splits: " + (err?.message || "Unknown error"));
    } finally {
      setIsPurging(false);
    }
  };

  // Normalize Cycles (Remove stale per-day numeric copies)
  const [isNormalizingCycles, setIsNormalizingCycles] = useState(false);

  const handleNormalizeCycles = async () => {
    setIsNormalizingCycles(true);
    try {
      const res = await fetchWithFirebaseAuth("/api/admin/programs/normalize-cycles", {
        method: "POST"
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed normalizing cycles");

      if (data.overrides) {
        setServerOverrides(data.overrides);
        setScheduleOverridesFromAdmin(data.overrides);
      }

      if (data.cloudSaved === false) {
        setSaveSuccessMsg(null);
        setSaveErrorMsg("Saved on this server only. NOT permanent. Check Firestore quota/logs.");
      } else {
        setSaveErrorMsg(null);
        setSaveSuccessMsg(`Normalized cycle schedules: removed ${data.removedCount ?? 0} stale per-day copy(ies).`);
        setTimeout(() => setSaveSuccessMsg(null), 5000);
      }
    } catch (err: any) {
      console.error("Normalize cycles error:", err);
      setSaveErrorMsg("Failed normalizing cycles: " + (err?.message || "Unknown error"));
    } finally {
      setIsNormalizingCycles(false);
    }
  };

  // Universal Reset and Clean All Programs (One-Click, inline confirmation)
  const [isResettingAllPrograms, setIsResettingAllPrograms] = useState(false);
  const [confirmResetAll, setConfirmResetAll] = useState(false);

  const handleResetAndCleanAllPrograms = async () => {
    if (!confirmResetAll) {
      setConfirmResetAll(true);
      return;
    }
    setConfirmResetAll(false);
    setIsResettingAllPrograms(true);
    try {
      const cleanRes = resetAndCleanAllProgramSplits(libraryExercises || [], serverOverrides || {});
      setServerOverrides(cleanRes.updatedOverrides);
      setScheduleOverridesFromAdmin(cleanRes.updatedOverrides);

      const resetRes = await fetchWithFirebaseAuth("/api/admin/programs/reset-and-clean-all-programs", {
        method: "POST",
        body: JSON.stringify({
          allOverrides: cleanRes.updatedOverrides,
          stats: cleanRes.stats
        })
      });
      const resetData = await resetRes.json().catch(() => ({}));

      if (!resetRes.ok || resetData?.cloudSaved === false) {
        setSaveSuccessMsg(null);
        setSaveErrorMsg("Saved on this server only. NOT permanent. Check Firestore quota/logs.");
      } else {
        setSaveErrorMsg(null);
        setSaveSuccessMsg(
          `All programs reset and cleaned! ${cleanRes.stats.totalProgramsCleaned} programs updated (${cleanRes.stats.totalDaysReset} days verified), ${cleanRes.stats.totalMismatchesRemoved} mismatched exercises purged, capped at 10 daily.`
        );
        setTimeout(() => setSaveSuccessMsg(null), 8000);
      }
    } catch (err: any) {
      console.error("Reset all error:", err);
      setSaveErrorMsg("Error resetting and cleaning all programs: " + (err?.message || "Unknown error"));
    } finally {
      setIsResettingAllPrograms(false);
    }
  };

  // Available programs list
  const programOptions = useMemo(() => {
    const standard = [
      { id: "immortal_90", label: "1. 90 Immortal Challenge (Target: Men • 90 Days)" },
      { id: "women_confidence", label: "2. 180 Women Confidence Challenge (Target: Women • 180 Days)" },
      { id: "belly_fat_shred", label: "3. Belly Fat Shred (Target: Men & Women • 140 Days)" },
      { id: "home_180", label: "4. 180 Days Home Workout (Target: Men & Women • 180 Days)" },
      { id: "posture_vitality", label: "5. Posture Correction Challenge (Target: Men & Women • 90 Days)" },
      { id: "lean_muscle", label: "90 Day Lean Muscle Challenge (90 Days)" },
      { id: "fat_burning", label: "90 Day Fat Burning Challenge (90 Days)" },
      { id: "body_transformation", label: "90 Day Body Transformation (90 Days)" },
      { id: "athletic_performance", label: "90 Day Athletic Performance (90 Days)" },
      { id: "strength_challenge", label: "90 Day Strength Challenge (90 Days)" },
      { id: "home_fitness", label: "90 Day Home Fitness Challenge (90 Days)" },
      { id: "six_pack_core", label: "90 Day Six Pack & Core Challenge (90 Days)" },
      { id: "gym_hypertrophy", label: "Gym Hypertrophy & Muscle Density (90 Days)" },
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

            {/* Live Deployment & Persistence Sync Indicator */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700/70 text-xs font-mono text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-neutral-400">Build:</span>
                <span className="text-white font-bold">{deploymentInfo?.buildId || "live"}</span>
                <span className="text-neutral-600">|</span>
                <span className="text-neutral-400">Database:</span>
                <span className="text-emerald-400 font-semibold">Firestore Cloud Live</span>
              </div>

              <button
                type="button"
                onClick={checkDeploymentSync}
                disabled={isVerifyingSync}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs text-neutral-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Verify sync between browser, backend, and Cloud Firestore"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-neutral-400 ${isVerifyingSync ? "animate-spin text-red-500" : ""}`} />
                <span>{isVerifyingSync ? "Verifying..." : "Verify Live Sync"}</span>
              </button>

              {deploymentInfo?.verifiedAt && (
                <span className="text-[11px] text-neutral-500">
                  Last verified: {deploymentInfo.verifiedAt}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleNormalizeCycles}
              disabled={isNormalizingCycles || isResettingAllPrograms || isPurging}
              className="px-4 py-2.5 rounded-2xl bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/50 text-xs font-bold text-indigo-200 hover:text-white transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              title="Delete stale numeric per-day copies so canonical 7-day cycle splits control all repeating days"
            >
              <Repeat className={`w-4 h-4 text-indigo-400 ${isNormalizingCycles ? "animate-spin" : ""}`} />
              <span>{isNormalizingCycles ? "Normalizing..." : "Normalize cycles (remove stale per-day copies)"}</span>
            </button>

            {!confirmResetAll ? (
              <button
                type="button"
                onClick={handleResetAndCleanAllPrograms}
                disabled={isResettingAllPrograms || isPurging}
                className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 border border-amber-400 text-xs font-black text-white transition flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-600/30 disabled:opacity-50"
                title="One-Click: resets and cleans every day across all programs, removing mismatched exercises (like chest/legs on back & biceps day) and capping at 10 workouts"
              >
                <RotateCcw className={`w-4 h-4 text-white ${isResettingAllPrograms ? "animate-spin" : ""}`} />
                <span>{isResettingAllPrograms ? "Resetting All Programs..." : "Reset & Clean All Programs"}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-950/90 border border-amber-500/50 text-xs">
                <span className="font-bold text-amber-200">Reset & clean all programs?</span>
                <button
                  type="button"
                  onClick={handleResetAndCleanAllPrograms}
                  className="px-2.5 py-1 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmResetAll(false)}
                  className="px-2.5 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handlePurgeAllProgramSplits}
              disabled={isPurging || isResettingAllPrograms}
              className="px-4 py-2.5 rounded-2xl bg-amber-950/60 border border-amber-500/50 hover:border-amber-400 text-xs font-bold text-amber-300 hover:text-white transition flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-950/50 disabled:opacity-50"
              title="Audit and purge mismatched exercises across all 7 days of this program cadence"
            >
              <Trash2 className="w-4 h-4 text-amber-400" />
              <span>{isPurging ? "Purging..." : "Purge Entire Program Cadence"}</span>
            </button>

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

        {/* Save Toast / Cloud Persistence Error Toast */}
        {saveErrorMsg && (
          <div className="mt-4 p-3.5 rounded-2xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-bold flex items-center justify-between gap-2.5 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{saveErrorMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setSaveErrorMsg(null)}
              className="text-red-300 hover:text-white text-[11px] px-2 py-0.5 rounded bg-red-900/60 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
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

        {/* Track Switcher for Programs with separate Tracks (e.g. 180 Days Home Workout) */}
        {(selectedProgramId === "home_180" || selectedProgramId.includes("home")) && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-neutral-950 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-300">Workout Track:</span>
              <span className="text-xs text-neutral-400">Separate progressive workouts for Men and Women</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAdminTrack("men")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  adminTrack === "men"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-black"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                <span>👨 Men Track (Push/Pull, Calisthenics & Power)</span>
              </button>
              <button
                type="button"
                onClick={() => setAdminTrack("women")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  adminTrack === "women"
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 font-black"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                <span>👩 Women Track (Glutes, Tone, Core & Conditioning)</span>
              </button>
            </div>
          </div>
        )}

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
                const canonicalLookupKey = (selectedProgramId === "home_180" && adminTrack === "women")
                  ? "home_180_women"
                  : normalizeProgramId(selectedProgramId);
                const canonical = (PROGRAM_CANONICAL_SPLITS[canonicalLookupKey] || PROGRAM_CANONICAL_SPLITS.immortal_90)[cycleDay];
                const cycleKey = `cycle_${cycleDay}`;
                const trackKey = (selectedProgramId === "home_180" && adminTrack)
                  ? `home_180_${adminTrack}`
                  : (adminTrack ? `${normalizeProgramId(selectedProgramId)}_${adminTrack}` : "");
                const progOverrides = (trackKey && serverOverrides[trackKey]) || serverOverrides[selectedProgramId] || serverOverrides[normalizeProgramId(selectedProgramId)] || {};
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

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => handlePurgeMismatchedWorkouts()}
              disabled={isPurging}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-600/25 disabled:opacity-50"
              title="Purge exercises that do not belong to this split (e.g. remove Flat Bench Press from Back & Biceps day) and reset strictly with authentic category drills"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{isPurging ? "Purging..." : "Purge Mismatched Workouts"}</span>
            </button>

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

        {/* Difficulty Level & Tier Category Selector - Beginner / Intermediate / Advanced */}
        <div className="bg-neutral-950 p-4 sm:p-5 rounded-2xl border border-neutral-800 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  Fitness Level & Difficulty Tier Prescriptions
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 font-bold">
                  Separate Drills per Tier
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Choose a category (Beginner, Intermediate, Advanced) to add, drag-and-drop reorder, and configure separate workout routines tailored for that athlete tier.
              </p>
            </div>

            {/* Quick stats badges */}
            <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
              <span className="px-2.5 py-1 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Beginner: <strong>{tierCounts.beginner}</strong></span>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Intermediate: <strong>{tierCounts.intermediate}</strong></span>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>Advanced: <strong>{tierCounts.advanced}</strong></span>
              </span>
            </div>
          </div>

          {/* Tier Category Selector Buttons - ONLY Beginner, Intermediate, Advanced */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedDifficultyLevel("beginner")}
              className={`p-3.5 rounded-xl border text-left transition relative cursor-pointer flex items-center justify-between gap-2 ${
                selectedDifficultyLevel === "beginner"
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/50 ring-1 ring-emerald-400"
                  : "bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-emerald-300 hover:border-neutral-700"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-300">Beginner</span>
                </div>
                <div className="text-[10px] text-neutral-400 truncate mt-0.5">Form, Joint Prep & Toning</div>
              </div>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-neutral-950 border border-emerald-500/30 text-emerald-300 shrink-0">
                {tierCounts.beginner} drills
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDifficultyLevel("intermediate")}
              className={`p-3.5 rounded-xl border text-left transition relative cursor-pointer flex items-center justify-between gap-2 ${
                selectedDifficultyLevel === "intermediate"
                  ? "bg-amber-950/80 border-amber-500 text-amber-200 shadow-md shadow-amber-950/50 ring-1 ring-amber-400"
                  : "bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-amber-300 hover:border-neutral-700"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">Intermediate</span>
                </div>
                <div className="text-[10px] text-neutral-400 truncate mt-0.5">Progressive Hypertrophy</div>
              </div>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-neutral-950 border border-amber-500/30 text-amber-300 shrink-0">
                {tierCounts.intermediate} drills
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDifficultyLevel("advanced")}
              className={`p-3.5 rounded-xl border text-left transition relative cursor-pointer flex items-center justify-between gap-2 ${
                selectedDifficultyLevel === "advanced"
                  ? "bg-rose-950/80 border-rose-500 text-rose-200 shadow-md shadow-rose-950/50 ring-1 ring-rose-400"
                  : "bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-rose-300 hover:border-neutral-700"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-rose-300">Advanced</span>
                </div>
                <div className="text-[10px] text-neutral-400 truncate mt-0.5">High Volume & Compounds</div>
              </div>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-neutral-950 border border-rose-500/30 text-rose-300 shrink-0">
                {tierCounts.advanced} drills
              </span>
            </button>
          </div>

          {/* Tier Assistance Notice & Quick Copy Action */}
          {!isTierCustomized && (
            <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  No distinct <strong>{selectedDifficultyLevel.toUpperCase()}</strong> routine saved yet. Currently displaying {activeExercises.length} default drills.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {selectedDifficultyLevel !== "beginner" && (
                  <button
                    type="button"
                    onClick={() => handleCopyTier("beginner")}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-neutral-700"
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copy Beginner Drills</span>
                  </button>
                )}
                {selectedDifficultyLevel === "advanced" && (
                  <button
                    type="button"
                    onClick={() => handleCopyTier("intermediate")}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-neutral-700"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copy Intermediate Drills</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleStartBlankActiveTier}
                  className="px-3 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/50 text-red-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-red-800/40"
                >
                  <Plus className="w-3.5 h-3.5 text-red-400" />
                  <span>Start Blank</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Workouts Routine List (Drag & Drop Reorder) */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-neutral-800">
            <h4 className="text-sm font-black uppercase tracking-wider text-neutral-300 flex items-center gap-2 flex-wrap">
              <Dumbbell className="w-4 h-4 text-red-500" />
              <span>
                Prescribed {selectedDifficultyLevel.toUpperCase()} Routine ({activeExercises.length} Drills)
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                selectedDifficultyLevel === "beginner"
                  ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                  : selectedDifficultyLevel === "advanced"
                  ? "bg-rose-950 text-rose-300 border-rose-500/40"
                  : "bg-amber-950 text-amber-300 border-amber-500/40"
              }`}>
                {selectedDifficultyLevel.toUpperCase()} TIER
              </span>
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 hidden md:inline">
                Grab the handle <GripVertical className="w-3 h-3 inline text-neutral-400" /> to drag & reorder, or use the arrow buttons.
              </span>
              {activeExercises.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearTierRoutine}
                  className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-red-400 border border-neutral-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                  title={`Clear all workouts from ${selectedDifficultyLevel} routine`}
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span>Clear Routine</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-600/20 shrink-0"
                title={`Add a new ${selectedDifficultyLevel} workout drill to this routine`}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+ Add {selectedDifficultyLevel.charAt(0).toUpperCase() + selectedDifficultyLevel.slice(1)} Drill</span>
              </button>
            </div>
          </div>

          {activeExercises.length === 0 ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-amber-950/70 border border-amber-500/50 text-amber-200 text-xs font-bold flex items-center gap-2.5 text-left">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>No drills assigned for this tier. Athletes at this level will see an empty workout.</span>
              </div>
              <div className="text-center py-12 rounded-2xl bg-neutral-950/60 border border-dashed border-neutral-800 space-y-3">
                <Dumbbell className="w-10 h-10 mx-auto text-neutral-600" />
                <p className="text-sm text-neutral-400">
                  {cardioState.isCardio 
                    ? "This is a dedicated Cardio day. No heavy weight drills required." 
                    : `No workouts currently assigned to this ${selectedDifficultyLevel} day routine.`}
                </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition cursor-pointer"
                >
                  + Add {selectedDifficultyLevel.charAt(0).toUpperCase() + selectedDifficultyLevel.slice(1)} Drill
                </button>
                {selectedDifficultyLevel !== "beginner" && (
                  <button
                    type="button"
                    onClick={() => handleCopyTier("beginner")}
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition cursor-pointer border border-neutral-700"
                  >
                    Copy Beginner Drills
                  </button>
                )}
              </div>
              </div>
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
                          exerciseId={exercise.id}
                          exerciseName={exercise.exerciseName}
                          mediaUrl={exercise.gifUrl}
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
                    <div 
                      className="flex items-center gap-1.5 shrink-0"
                      draggable={false}
                      onMouseDown={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      {/* Move Up / Down Buttons for quick mobile/touch reorder */}
                      <div className="flex items-center gap-0.5 mr-1" draggable={false} onMouseDown={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          draggable={false}
                          disabled={index === 0}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveUp(index);
                          }}
                          title="Move drill up"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          draggable={false}
                          disabled={index === activeExercises.length - 1}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveDown(index);
                          }}
                          title="Move drill down"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Edit Button */}
                      <button
                        type="button"
                        draggable={false}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingExercise(exercise);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Edit drill sets, reps, cues & parameters"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      {/* Replace Button */}
                      <button
                        type="button"
                        draggable={false}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTargetToReplace(exercise);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Replace with another exercise"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Replace</span>
                      </button>

                      {/* One-Click Remove from this drill routine */}
                      <button
                        type="button"
                        draggable={false}
                        disabled={isDeleting}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOnly(exercise);
                        }}
                        className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-red-950/40 hover:bg-red-950/70 text-red-400 border border-red-900/50 text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        title="Remove workout once from this drill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>

                      {/* Global Delete / Archive options modal */}
                      <button
                        type="button"
                        draggable={false}
                        disabled={isDeleting}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTargetToDelete(exercise);
                        }}
                        className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-red-300 border border-neutral-800 text-xs font-bold transition flex items-center justify-center cursor-pointer disabled:opacity-50"
                        title="Archive or replace workout options"
                      >
                        <Sliders className="w-3.5 h-3.5" />
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
        currentExercises={activeExercises}
        targetDifficulty={(selectedDifficultyLevel.charAt(0).toUpperCase() + selectedDifficultyLevel.slice(1)) as "Beginner" | "Intermediate" | "Advanced"}
      />

      {/* 3. Edit Workout Drill Modal */}
      <EditWorkoutDrillModal
        isOpen={!!editingExercise}
        exercise={editingExercise}
        onClose={() => setEditingExercise(null)}
        onSave={handleSaveEditedExercise}
        currentTier={selectedDifficultyLevel}
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
        onConfirm={() => handleDeleteOnly(targetToDelete)}
        onDeleteOnly={() => handleDeleteOnly(targetToDelete)}
        onGlobalDelete={() => handleGlobalArchiveDelete(targetToDelete)}
        onAutoReplace={() => handleAutoReplace(targetToDelete)}
        onChooseReplacement={() => {
          const item = targetToDelete;
          setTargetToDelete(null);
          if (item) setTargetToReplace(item);
        }}
        onCancel={() => setTargetToDelete(null)}
      />
    </div>
  );
}
