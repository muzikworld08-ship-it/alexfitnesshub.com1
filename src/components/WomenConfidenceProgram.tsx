import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { 
  Sparkles, Heart, Trophy, Crown, Flame, Shield, Award, Calendar, 
  Check, CheckCircle2, ChevronRight, ChevronLeft, ArrowRight, Play, 
  RotateCcw, Clock, Droplets, Footprints, Moon, Apple, Activity, 
  BookOpen, Star, Dumbbell, AlertCircle, RefreshCw, BarChart3, 
  Layers, Smile, Compass, Send, CheckSquare, Plus, Minus, Info, 
  Lock, Zap, Users, MessageSquare, ExternalLink, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isMockFirebase } from "../lib/firebase";
import { 
  WomenOnboardingProfile, 
  WomenDailyWorkout, 
  WomenDailyLifestyle, 
  WomenDailyExercise, 
  PROGRAM_PHASES, 
  MILESTONE_ACHIEVEMENTS, 
  getDailyWorkoutForDay, 
  getDailyLifestyleForDay,
  WOMEN_EXERCISE_CATALOG
} from "../data/womenConfidenceProgramData";
import { UnifiedExerciseMedia } from "./UnifiedExerciseMedia";
import WorkoutCelebrationModal from "./WorkoutCelebrationModal";

interface WomenConfidenceProgressState {
  userId: string;
  onboarding: WomenOnboardingProfile | null;
  startDate?: string;
  dayCompletedTimestamps?: Record<number, string>; // dayNumber -> ISO timestamp
  currentDay: number;
  currentPhase: number;
  completedDays: number[];
  completedWorkouts: string[]; // e.g. "wc_day_1"
  completedExercises: Record<string, string[]>; // dayStr -> [exerciseIds]
  dailyChecklist: Record<string, {
    workout: boolean;
    steps: boolean;
    water: boolean;
    protein: boolean;
    sleep: boolean;
    confidenceChallenge: boolean;
  }>;
  dailyWaterIntake: Record<string, number>; // dateStr -> ml
  dailySteps: Record<string, number>; // dateStr -> steps
  weightLogs: { date: string; weight: number }[];
  bodyMeasurements: {
    date: string;
    waist?: number;
    hips?: number;
    thighs?: number;
    arms?: number;
  }[];
  journalEntries: {
    id: string;
    dayNumber: number;
    date: string;
    prompt: string;
    response: string;
    confidenceScore: number; // 1-10
  }[];
  achievements: string[]; // unlocked milestone ids
  streaks: {
    currentStreak: number;
    bestStreak: number;
    lastActiveDate: string;
  };
  lastStoppedWorkout: {
    dayNumber: number;
    workoutTitle: string;
    exerciseIndex: number;
    exerciseName: string;
    timestamp: string;
  };
}

const DEFAULT_CONFIDENCE_STATE: WomenConfidenceProgressState = {
  userId: "",
  onboarding: null,
  startDate: new Date().toISOString(),
  dayCompletedTimestamps: {},
  currentDay: 1,
  currentPhase: 1,
  completedDays: [],
  completedWorkouts: [],
  completedExercises: {},
  dailyChecklist: {},
  dailyWaterIntake: {},
  dailySteps: {},
  weightLogs: [],
  bodyMeasurements: [],
  journalEntries: [],
  achievements: [],
  streaks: {
    currentStreak: 0,
    bestStreak: 0,
    lastActiveDate: ""
  },
  lastStoppedWorkout: {
    dayNumber: 1,
    workoutTitle: "Day 1: Glute & Posterior Kinetic Awakening",
    exerciseIndex: 0,
    exerciseName: "Glute Bridge & Isometric Hold",
    timestamp: new Date().toISOString()
  }
};

export default function WomenConfidenceProgram() {
  const { user, programProgress, updateProgramProgress, recordProgramStopPoint, markProgramWorkoutComplete } = useApp();
  
  // Program tabs
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "workout" | "journey" | "lifestyle" | "nutrition" | 
    "recovery" | "reviews" | "achievements" | "measurements" | "history" | "journal"
  >("dashboard");

  // State Management
  const [progState, setProgState] = useState<WomenConfidenceProgressState>(DEFAULT_CONFIDENCE_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  
  // Workout execution state
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerInitial, setTimerInitial] = useState<number>(45);

  // Journal state
  const [journalInput, setJournalInput] = useState<string>("");
  const [journalConfidenceScore, setJournalConfidenceScore] = useState<number>(8);
  const [journalSaveStatus, setJournalSaveStatus] = useState<string>("");

  // Measurement state
  const [inputWeight, setInputWeight] = useState<string>("");
  const [inputWaist, setInputWaist] = useState<string>("");
  const [inputHips, setInputHips] = useState<string>("");
  const [inputThighs, setInputThighs] = useState<string>("");
  const [measurementStatus, setMeasurementStatus] = useState<string>("");

  // Completion Celebration Modal
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [celebrationModalData, setCelebrationModalData] = useState<{
    isOpen: boolean;
    completedDay: number;
    totalDays: number;
    streakCount: number;
    caloriesBurned: number;
    exercisesCount: number;
  } | null>(null);

  // Onboarding Form State (Step 1 of 8)
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [onbAge, setOnbAge] = useState<number>(28);
  const [onbHeight, setOnbHeight] = useState<number>(165);
  const [onbWeight, setOnbWeight] = useState<number>(64);
  const [onbTargetWeight, setOnbTargetWeight] = useState<number>(59);
  const [onbGoal, setOnbGoal] = useState<WomenOnboardingProfile["mainGoal"]>("tone_shape");
  const [onbFocusAreas, setOnbFocusAreas] = useState<string[]>(["glutes", "core", "posture"]);
  const [onbLevel, setOnbLevel] = useState<WomenOnboardingProfile["fitnessLevel"]>("intermediate");
  const [onbLocation, setOnbLocation] = useState<WomenOnboardingProfile["workoutLocation"]>("home");
  const [onbEquipment, setOnbEquipment] = useState<string[]>(["bodyweight", "bands", "dumbbells"]);
  const [onbDaysPerWeek, setOnbDaysPerWeek] = useState<number>(5);
  const [onbDuration, setOnbDuration] = useState<WomenOnboardingProfile["preferredDuration"]>("30-45");
  const [onbExperience, setOnbExperience] = useState<WomenOnboardingProfile["previousExperience"]>("occasional");
  const [onbActivity, setOnbActivity] = useState<WomenOnboardingProfile["dailyActivityLevel"]>("moderately_active");
  const [onbDiet, setOnbDiet] = useState<WomenOnboardingProfile["dietaryPreference"]>("balanced");
  const [onbSleep, setOnbSleep] = useState<number>(8);
  const [onbWater, setOnbWater] = useState<number>(2.5);
  const [onbRoutine, setOnbRoutine] = useState<WomenOnboardingProfile["lifestyleRoutine"]>("desk_job");
  const [onbLimitations, setOnbLimitations] = useState<string>("None");
  const [onbMotivation, setOnbMotivation] = useState<string>("I want to feel genuinely strong, energized, and confident in my body and mind every single day.");

  const uid = user?.uid || "guest_woman_athlete";
  const storageKey = `fit_women_confidence_${uid}`;

  // Load progress from Firestore and LocalStorage
  useEffect(() => {
    let isMounted = true;
    const loadProgress = async () => {
      setIsLoading(true);
      try {
        let loadedState: WomenConfidenceProgressState | null = null;
        
        // 1. Try local storage
        const local = localStorage.getItem(storageKey);
        if (local) {
          try {
            loadedState = JSON.parse(local);
          } catch (e) {}
        }

        // 2. Try Firestore if logged in
        if (user && !isMockFirebase) {
          try {
            const docRef = doc(db, "users", user.uid, "programs", "women_confidence");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const remoteData = docSnap.data() as WomenConfidenceProgressState;
              loadedState = { ...DEFAULT_CONFIDENCE_STATE, ...loadedState, ...remoteData };
            }
          } catch (err) {
            console.warn("Could not fetch remote women confidence progress:", err);
          }
        }

        if (isMounted) {
          if (loadedState && loadedState.onboarding) {
            setProgState(loadedState);
            setSelectedDayNumber(loadedState.currentDay || 1);
            if (loadedState.currentDay >= 180 && loadedState.completedDays.includes(180)) {
              setShowCompletionModal(true);
            }
          } else {
            // New user, trigger onboarding
            setProgState({ ...DEFAULT_CONFIDENCE_STATE, userId: uid });
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error loading Women Confidence Program:", err);
        if (isMounted) setIsLoading(false);
      }
    };

    loadProgress();
    return () => { isMounted = false; };
  }, [uid, storageKey, user]);

  // Sync state to local storage and remote Firestore
  const persistState = async (newState: WomenConfidenceProgressState) => {
    setProgState(newState);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newState));
      
      // Update global context programProgress
      if (updateProgramProgress) {
        updateProgramProgress("women_confidence", {
          currentDay: newState.currentDay,
          currentWeek: Math.ceil(newState.currentDay / 7),
          completedWorkoutIds: newState.completedWorkouts,
          progressPercent: Math.min(100, Math.round((newState.completedDays.length / 180) * 100)),
          lastStoppedWorkoutName: newState.lastStoppedWorkout.workoutTitle,
          lastStoppedWorkoutId: `wc-d${newState.lastStoppedWorkout.dayNumber}-ex${newState.lastStoppedWorkout.exerciseIndex + 1}`,
          lastStoppedAt: new Date().toISOString()
        });
      }

      if (user && !isMockFirebase) {
        const docRef = doc(db, "users", user.uid, "programs", "women_confidence");
        await setDoc(docRef, newState, { merge: true });
      }
    } catch (err) {
      console.warn("Failed to persist Women Confidence progress:", err);
    }
  };

  // Compute Today's Date String
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Compute Current Workout & Lifestyle based on selectedDayNumber and profile
  const currentWorkout: WomenDailyWorkout = useMemo(() => {
    return getDailyWorkoutForDay(selectedDayNumber, progState.onboarding);
  }, [selectedDayNumber, progState.onboarding]);

  const currentLifestyle: WomenDailyLifestyle = useMemo(() => {
    return getDailyLifestyleForDay(selectedDayNumber, progState.onboarding);
  }, [selectedDayNumber, progState.onboarding]);

  const activePhase = useMemo(() => {
    return PROGRAM_PHASES.find(p => selectedDayNumber >= p.startDay && selectedDayNumber <= p.endDay) || PROGRAM_PHASES[0];
  }, [selectedDayNumber]);

  // Handle Onboarding Completion
  const handleCompleteOnboarding = () => {
    const profile: WomenOnboardingProfile = {
      age: onbAge,
      height: onbHeight,
      currentWeight: onbWeight,
      targetWeight: onbTargetWeight,
      mainGoal: onbGoal,
      focusAreas: onbFocusAreas,
      fitnessLevel: onbLevel,
      workoutLocation: onbLocation,
      availableEquipment: onbEquipment,
      trainingDaysPerWeek: onbDaysPerWeek,
      preferredDuration: onbDuration,
      previousExperience: onbExperience,
      dailyActivityLevel: onbActivity,
      dietaryPreference: onbDiet,
      sleepScheduleHours: onbSleep,
      currentWaterIntakeLiters: onbWater,
      lifestyleRoutine: onbRoutine,
      exerciseLimitations: onbLimitations,
      motivation: onbMotivation,
      completedAt: new Date().toISOString()
    };

    const initialWorkout = getDailyWorkoutForDay(1, profile);

    const newState: WomenConfidenceProgressState = {
      ...DEFAULT_CONFIDENCE_STATE,
      userId: uid,
      onboarding: profile,
      currentDay: 1,
      currentPhase: 1,
      lastStoppedWorkout: {
        dayNumber: 1,
        workoutTitle: initialWorkout.title,
        exerciseIndex: 0,
        exerciseName: initialWorkout.exercises[0]?.name || "Warmup",
        timestamp: new Date().toISOString()
      },
      weightLogs: [{ date: todayStr, weight: onbWeight }]
    };

    persistState(newState);
    setSelectedDayNumber(1);
    setActiveTab("dashboard");
  };

  // Timer Handlers
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Play subtle chime if allowed
      try {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startRestTimer = (seconds: number = 45) => {
    setTimerInitial(seconds);
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  // Toggle Exercise Completion
  const handleToggleExercise = (exerciseId: string) => {
    const dayKey = `day_${selectedDayNumber}`;
    const currentList = progState.completedExercises[dayKey] || [];
    const isCompleted = currentList.includes(exerciseId);

    const updatedList = isCompleted
      ? currentList.filter(id => id !== exerciseId)
      : [...currentList, exerciseId];

    const newCompletedMap = {
      ...progState.completedExercises,
      [dayKey]: updatedList
    };

    // Update last stopped exercise
    const exerciseIdx = currentWorkout.exercises.findIndex(e => e.id === exerciseId);
    const lastStopped = {
      dayNumber: selectedDayNumber,
      workoutTitle: currentWorkout.title,
      exerciseIndex: Math.max(0, exerciseIdx),
      exerciseName: currentWorkout.exercises[exerciseIdx]?.name || "Exercise",
      timestamp: new Date().toISOString()
    };

    if (recordProgramStopPoint) {
      recordProgramStopPoint("women_confidence", currentWorkout.title, `wc-d${selectedDayNumber}-ex${exerciseIdx + 1}`, selectedDayNumber);
    }

    persistState({
      ...progState,
      completedExercises: newCompletedMap,
      lastStoppedWorkout: lastStopped
    });
  };

  // Live ticker for 24-hour progressive unlocks
  const [nowTime, setNowTime] = useState<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper to check if a specific day is unlocked
  const getDayUnlockStatus = (dayNum: number) => {
    if (dayNum <= 1) return { unlocked: true, remainingSeconds: 0, reason: "available" };
    const prevDay = dayNum - 1;
    const isPrevDone = progState.completedDays.includes(prevDay);
    if (!isPrevDone) {
      return { unlocked: false, remainingSeconds: -1, reason: "prev_incomplete" };
    }

    const prevCompletedTime = progState.dayCompletedTimestamps?.[prevDay];
    if (prevCompletedTime) {
      const unlockTargetMs = new Date(prevCompletedTime).getTime() + 24 * 60 * 60 * 1000;
      const diffMs = unlockTargetMs - nowTime;
      if (diffMs <= 0) {
        return { unlocked: true, remainingSeconds: 0, reason: "available" };
      }
      return { 
        unlocked: false, 
        remainingSeconds: Math.ceil(diffMs / 1000), 
        unlockTime: new Date(unlockTargetMs),
        reason: "timer_active" 
      };
    }

    if (progState.startDate) {
      const unlockTargetMs = new Date(progState.startDate).getTime() + (dayNum - 1) * 24 * 60 * 60 * 1000;
      const diffMs = unlockTargetMs - nowTime;
      if (diffMs <= 0) {
        return { unlocked: true, remainingSeconds: 0, reason: "available" };
      }
      return { 
        unlocked: false, 
        remainingSeconds: Math.ceil(diffMs / 1000), 
        unlockTime: new Date(unlockTargetMs),
        reason: "timer_active" 
      };
    }

    return { unlocked: true, remainingSeconds: 0, reason: "available" };
  };

  const selectedDayStatus = getDayUnlockStatus(selectedDayNumber);

  const formatCountdown = (totalSec: number) => {
    if (totalSec <= 0) return "00:00:00";
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hours).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
  };

  // Complete Full Day Workout
  const handleCompleteFullDay = (dayNum: number) => {
    const workoutKey = `wc_day_${dayNum}`;
    const allExIds = currentWorkout.exercises.map(e => e.id);
    const dayKey = `day_${dayNum}`;
    const nowIso = new Date().toISOString();

    const updatedCompletedDays = Array.from(new Set([...progState.completedDays, dayNum]));
    const updatedWorkouts = Array.from(new Set([...progState.completedWorkouts, workoutKey]));
    const updatedTimestamps = {
      ...(progState.dayCompletedTimestamps || {}),
      [dayNum]: nowIso
    };
    const nextDay = Math.min(180, dayNum + 1);

    // Calculate streaks
    const currentStreak = progState.streaks.currentStreak + 1;
    const bestStreak = Math.max(progState.streaks.bestStreak, currentStreak);

    // Check Milestones
    const newAchievements = [...progState.achievements];
    MILESTONE_ACHIEVEMENTS.forEach(m => {
      if (dayNum >= m.day && !newAchievements.includes(m.id)) {
        newAchievements.push(m.id);
      }
    });

    const newState: WomenConfidenceProgressState = {
      ...progState,
      startDate: progState.startDate || nowIso,
      dayCompletedTimestamps: updatedTimestamps,
      currentDay: nextDay,
      currentPhase: Math.ceil(nextDay / 30),
      completedDays: updatedCompletedDays,
      completedWorkouts: updatedWorkouts,
      completedExercises: {
        ...progState.completedExercises,
        [dayKey]: allExIds
      },
      achievements: newAchievements,
      streaks: {
        currentStreak,
        bestStreak,
        lastActiveDate: todayStr
      },
      lastStoppedWorkout: {
        dayNumber: nextDay,
        workoutTitle: `Day ${nextDay}: Next Progression`,
        exerciseIndex: 0,
        exerciseName: "Start Workout",
        timestamp: nowIso
      }
    };

    if (markProgramWorkoutComplete) {
      markProgramWorkoutComplete("women_confidence", workoutKey, `Day ${nextDay}: Next Progression`, nextDay);
    }

    persistState(newState);

    setCelebrationModalData({
      isOpen: true,
      completedDay: dayNum,
      totalDays: 180,
      streakCount: currentStreak,
      caloriesBurned: 320,
      exercisesCount: currentWorkout.exercises?.length || 6
    });

    if (dayNum === 180) {
      setShowCompletionModal(true);
    } else {
      setSelectedDayNumber(nextDay);
    }
  };

  // Toggle Daily Checklist Item
  const handleToggleDailyHabit = (habitKey: "workout" | "steps" | "water" | "protein" | "sleep" | "confidenceChallenge") => {
    const current = progState.dailyChecklist[todayStr] || {
      workout: false,
      steps: false,
      water: false,
      protein: false,
      sleep: false,
      confidenceChallenge: false
    };

    const updated = {
      ...current,
      [habitKey]: !current[habitKey]
    };

    persistState({
      ...progState,
      dailyChecklist: {
        ...progState.dailyChecklist,
        [todayStr]: updated
      }
    });
  };

  // Water Hydration Logger
  const handleAdjustWater = (deltaMl: number) => {
    const current = progState.dailyWaterIntake[todayStr] || 0;
    const nextVal = Math.max(0, current + deltaMl);
    const targetMl = (currentLifestyle.waterTargetLiters || 2.5) * 1000;

    const checklist = progState.dailyChecklist[todayStr] || {
      workout: false,
      steps: false,
      water: false,
      protein: false,
      sleep: false,
      confidenceChallenge: false
    };

    persistState({
      ...progState,
      dailyWaterIntake: {
        ...progState.dailyWaterIntake,
        [todayStr]: nextVal
      },
      dailyChecklist: {
        ...progState.dailyChecklist,
        [todayStr]: {
          ...checklist,
          water: nextVal >= targetMl
        }
      }
    });
  };

  // Save Confidence Journal Entry
  const handleSaveJournalEntry = () => {
    if (!journalInput.trim()) return;
    const entry = {
      id: `journal_${Date.now()}`,
      dayNumber: selectedDayNumber,
      date: todayStr,
      prompt: currentLifestyle.journalPrompt,
      response: journalInput.trim(),
      confidenceScore: journalConfidenceScore
    };

    const updatedEntries = [entry, ...progState.journalEntries];
    persistState({
      ...progState,
      journalEntries: updatedEntries
    });

    setJournalInput("");
    setJournalSaveStatus("Saved to your personal confidence journal!");
    setTimeout(() => setJournalSaveStatus(""), 3000);
  };

  // Save Body Measurement
  const handleSaveMeasurement = () => {
    const w = parseFloat(inputWeight);
    const waist = parseFloat(inputWaist);
    const hips = parseFloat(inputHips);
    const thighs = parseFloat(inputThighs);

    if (isNaN(w) && isNaN(waist) && isNaN(hips) && isNaN(thighs)) return;

    let updatedWeightLogs = [...progState.weightLogs];
    if (!isNaN(w)) {
      updatedWeightLogs.push({ date: todayStr, weight: w });
    }

    const measurementEntry = {
      date: todayStr,
      waist: isNaN(waist) ? undefined : waist,
      hips: isNaN(hips) ? undefined : hips,
      thighs: isNaN(thighs) ? undefined : thighs
    };

    const updatedMeasurements = [measurementEntry, ...progState.bodyMeasurements];

    persistState({
      ...progState,
      weightLogs: updatedWeightLogs,
      bodyMeasurements: updatedMeasurements
    });

    setInputWeight("");
    setInputWaist("");
    setInputHips("");
    setInputThighs("");
    setMeasurementStatus("Measurements recorded successfully!");
    setTimeout(() => setMeasurementStatus(""), 3000);
  };

  // ----------------------------------------------------
  // ONBOARDING WIZARD RENDERER
  // ----------------------------------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full border-4 border-rose-200 border-t-rose-600 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Loading Women Confidence Program...</h2>
        <p className="text-sm text-gray-500 mt-1">Calibrating your 180-day personalized coaching journey...</p>
      </div>
    );
  }

  if (!progState.onboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF0F5] via-[#FAF9F6] to-white text-gray-900 py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header Banner */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> 180 Days to Become Stronger, Fitter & More Confident
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              WOMEN CONFIDENCE PROGRAM
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base max-w-xl mx-auto">
              Welcome to your dedicated 6-month transformative journey. Let's personalize your daily workouts, nutrition targets, and lifestyle habits.
            </p>
            
            {/* Step Progress Indicator */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs font-bold text-rose-700 mb-2">
                <span>STEP {onboardingStep} OF 8</span>
                <span>{Math.round((onboardingStep / 8) * 100)}% COMPLETE</span>
              </div>
              <div className="w-full h-2.5 bg-rose-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-600 transition-all duration-300 rounded-full"
                  style={{ width: `${(onboardingStep / 8) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Onboarding Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-rose-100/80 p-6 sm:p-8 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              {/* STEP 1: Biometrics & Target */}
              {onboardingStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Your Biometrics & Target</h2>
                    <p className="text-sm text-gray-600 mt-1">This calibrates your baseline hydration, calorie expenditure, and training volume.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Age</label>
                      <input 
                        type="number"
                        min="16"
                        max="85"
                        value={onbAge}
                        onChange={e => setOnbAge(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Height (cm)</label>
                      <input 
                        type="number"
                        min="120"
                        max="220"
                        value={onbHeight}
                        onChange={e => setOnbHeight(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Current Weight (kg)</label>
                      <input 
                        type="number"
                        min="35"
                        max="200"
                        step="0.5"
                        value={onbWeight}
                        onChange={e => setOnbWeight(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Weight (kg, optional)</label>
                      <input 
                        type="number"
                        min="35"
                        max="200"
                        step="0.5"
                        value={onbTargetWeight}
                        onChange={e => setOnbTargetWeight(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Primary Goal */}
              {onboardingStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">What is your primary goal?</h2>
                    <p className="text-sm text-gray-600 mt-1">Select the main outcome you want to accomplish in this 180-day transformation.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "tone_shape", label: "Tone & Shape", desc: "Sculpt lean athletic contours", icon: Sparkles },
                      { id: "burn_fat", label: "Burn Fat & Lean Out", desc: "Accelerate fat oxidation safely", icon: Flame },
                      { id: "build_curves", label: "Build Curves & Glutes", desc: "Posterior chain hypertrophy", icon: Heart },
                      { id: "increase_strength", label: "Increase Strength", desc: "Lift heavier with confidence", icon: Dumbbell },
                      { id: "lose_weight", label: "Lose Weight", desc: "Gradual, sustainable loss", icon: Activity },
                      { id: "improve_fitness", label: "Improve Stamina & Fit", desc: "Cardiovascular energy", icon: Zap },
                      { id: "build_muscle", label: "Build Lean Muscle", desc: "Increase lean body mass", icon: Shield },
                      { id: "maintain_weight", label: "Maintain & Rebalance", desc: "Body recomposition", icon: CheckCircle2 },
                      { id: "improve_health", label: "Improve Overall Health", desc: "Vitality, posture & sleep", icon: Star }
                    ].map(g => {
                      const Icon = g.icon;
                      const isSelected = onbGoal === g.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setOnbGoal(g.id as any)}
                          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            isSelected 
                              ? "border-rose-500 bg-rose-50/80 ring-2 ring-rose-400" 
                              : "border-gray-200 hover:border-rose-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Icon className={`w-5 h-5 ${isSelected ? "text-rose-600" : "text-gray-400"}`} />
                            {isSelected && <Check className="w-4 h-4 text-rose-600" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-gray-900">{g.label}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{g.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Focus Areas */}
              {onboardingStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Which body areas do you want to emphasize?</h2>
                    <p className="text-sm text-gray-600 mt-1">Select all that apply. (Fat loss is whole-body, but resistance training sculpts target muscles).</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: "glutes", label: "Glutes & Hips" },
                      { id: "core", label: "Core & Waistline" },
                      { id: "legs", label: "Legs & Thighs" },
                      { id: "posture", label: "Posture & Spine" },
                      { id: "back", label: "Upper & Mid Back" },
                      { id: "shoulders", label: "Shoulders" },
                      { id: "arms", label: "Arms & Triceps" },
                      { id: "full_body", label: "Full Body Balance" }
                    ].map(area => {
                      const isSelected = onbFocusAreas.includes(area.id);
                      return (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setOnbFocusAreas(onbFocusAreas.filter(a => a !== area.id));
                            } else {
                              setOnbFocusAreas([...onbFocusAreas, area.id]);
                            }
                          }}
                          className={`p-4 rounded-xl border text-center font-bold text-sm transition-all ${
                            isSelected 
                              ? "border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-400" 
                              : "border-gray-200 hover:border-rose-200 text-gray-700 bg-white"
                          }`}
                        >
                          {area.label}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Fitness Level */}
              {onboardingStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Your Current Fitness Level</h2>
                    <p className="text-sm text-gray-600 mt-1">This sets your starting volume, modification tiers, and rest pacing.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        id: "beginner",
                        title: "Beginner",
                        desc: "New to lifting or returning after a long break. Focus on mastering form, kinetic cues, and fundamental mobility."
                      },
                      {
                        id: "intermediate",
                        title: "Intermediate",
                        desc: "Comfortable with basic dumbbell exercises and squat/hinge patterns. Ready for moderate progressive overload."
                      },
                      {
                        id: "advanced",
                        title: "Advanced",
                        desc: "Consistent strength trainer looking for high-density sculpting, tempo variations, and peak physical conditioning."
                      }
                    ].map(lvl => {
                      const isSelected = onbLevel === lvl.id;
                      return (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setOnbLevel(lvl.id as any)}
                          className={`w-full p-4 rounded-xl border text-left transition-all ${
                            isSelected 
                              ? "border-rose-500 bg-rose-50/90 ring-2 ring-rose-400" 
                              : "border-gray-200 hover:border-rose-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-base text-gray-900">{lvl.title}</span>
                            {isSelected && <Check className="w-5 h-5 text-rose-600" />}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{lvl.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 5: Location & Equipment */}
              {onboardingStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Workout Location & Available Equipment</h2>
                    <p className="text-sm text-gray-600 mt-1">We will only assign exercises using equipment you actually have.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Where will you train?</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "home", label: "Home" },
                        { id: "gym", label: "Gym" },
                        { id: "both", label: "Both" }
                      ].map(loc => (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => setOnbLocation(loc.id as any)}
                          className={`p-3 rounded-xl border text-center font-bold text-sm ${
                            onbLocation === loc.id 
                              ? "border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-400" 
                              : "border-gray-200 text-gray-700"
                          }`}
                        >
                          {loc.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Available Equipment (Select all that apply)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: "bodyweight", label: "Bodyweight / Mat" },
                        { id: "bands", label: "Resistance Bands" },
                        { id: "dumbbells", label: "Dumbbells" },
                        { id: "kettlebells", label: "Kettlebells" },
                        { id: "barbell", label: "Barbell & Plates" },
                        { id: "gym_machines", label: "Gym Machines & Cables" }
                      ].map(eq => {
                        const isSelected = onbEquipment.includes(eq.id);
                        return (
                          <button
                            key={eq.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setOnbEquipment(onbEquipment.filter(e => e !== eq.id));
                              } else {
                                setOnbEquipment([...onbEquipment, eq.id]);
                              }
                            }}
                            className={`p-3 rounded-xl border text-center text-xs font-bold ${
                              isSelected 
                                ? "border-rose-500 bg-rose-50 text-rose-700" 
                                : "border-gray-200 text-gray-600"
                            }`}
                          >
                            {eq.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 6: Schedule & Duration */}
              {onboardingStep === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Training Schedule & Duration</h2>
                    <p className="text-sm text-gray-600 mt-1">Realistic consistency beats short-lived extremes every time.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Training Days Per Week: <span className="text-rose-600 font-extrabold">{onbDaysPerWeek} Days</span>
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {[3, 4, 5, 6].map(days => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => setOnbDaysPerWeek(days)}
                          className={`p-3 rounded-xl border text-center font-bold text-sm ${
                            onbDaysPerWeek === days 
                              ? "border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-400" 
                              : "border-gray-200 text-gray-700"
                          }`}
                        >
                          {days} Days
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Preferred Workout Duration</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "20-30", label: "20 - 30 min", desc: "High efficiency" },
                        { id: "30-45", label: "30 - 45 min", desc: "Optimal balance" },
                        { id: "45-60", label: "45 - 60 min", desc: "Comprehensive" }
                      ].map(dur => (
                        <button
                          key={dur.id}
                          type="button"
                          onClick={() => setOnbDuration(dur.id as any)}
                          className={`p-3 rounded-xl border text-center ${
                            onbDuration === dur.id 
                              ? "border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-400" 
                              : "border-gray-200 text-gray-700"
                          }`}
                        >
                          <div className="font-bold text-sm">{dur.label}</div>
                          <div className="text-xs text-gray-500">{dur.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 7: Lifestyle, Sleep & Hydration */}
              {onboardingStep === 7 && (
                <motion.div
                  key="step7"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Lifestyle, Sleep & Hydration Baseline</h2>
                    <p className="text-sm text-gray-600 mt-1">Recovery and daily habits account for over 70% of long-term body recomposition.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Daily Activity Level</label>
                      <select
                        value={onbActivity}
                        onChange={e => setOnbActivity(e.target.value as any)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 font-semibold"
                      >
                        <option value="sedentary">Sedentary (Desk Job / Mostly Sitting)</option>
                        <option value="lightly_active">Lightly Active (Some walking)</option>
                        <option value="moderately_active">Moderately Active (Active during day)</option>
                        <option value="very_active">Very Active (Physical work / High steps)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Dietary Preference</label>
                      <select
                        value={onbDiet}
                        onChange={e => setOnbDiet(e.target.value as any)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 font-semibold"
                      >
                        <option value="balanced">Balanced Whole Foods</option>
                        <option value="high_protein">High Protein Focus</option>
                        <option value="plant_based">Plant-Based / Vegetarian</option>
                        <option value="pescatarian">Pescatarian</option>
                        <option value="intermittent_fasting">Intermittent Fasting (16:8)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Average Sleep (Hours/night)</label>
                      <input 
                        type="number"
                        min="4"
                        max="12"
                        value={onbSleep}
                        onChange={e => setOnbSleep(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Current Water Intake (Liters/day)</label>
                      <input 
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="6"
                        value={onbWater}
                        onChange={e => setOnbWater(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 font-semibold"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 8: Limitations & Motivation */}
              {onboardingStep === 8 && (
                <motion.div
                  key="step8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Safety, Limitations & Deep Motivation</h2>
                    <p className="text-sm text-gray-600 mt-1">We tailor exercise modifications around your joints and personal reasons for joining.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Any injuries or joint limitations? (Optional)</label>
                    <input 
                      type="text"
                      placeholder="e.g. Mild lower back sensitivity, sensitive left knee, or None"
                      value={onbLimitations}
                      onChange={e => setOnbLimitations(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 font-semibold focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Deep Motivation (Why are you doing this 180-day journey?)</label>
                    <textarea 
                      rows={3}
                      value={onbMotivation}
                      onChange={e => setOnbMotivation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 font-semibold focus:ring-2 focus:ring-rose-500 text-sm"
                      placeholder="e.g. I want to build true physical strength, stand with radiant confidence, and prove to myself what I am capable of."
                    />
                  </div>

                  {/* Safety & Medical Notice */}
                  <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-800 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" /> Responsible Coaching & Medical Guidance Notice
                    </div>
                    <p>
                      The Women Confidence Program promotes balanced, progressive training without extreme calorie starvation or unsafe deficits. Women with medical conditions, pregnancy, postpartum recovery, or injuries should obtain professional medical clearance before following physical exercise routines.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stepper Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              {onboardingStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setOnboardingStep(s => s - 1)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : <div />}

              {onboardingStep < 8 ? (
                <button
                  type="button"
                  onClick={() => setOnboardingStep(s => s + 1)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteOnboarding}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-extrabold text-sm shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-[1.02] transition-transform"
                >
                  <Sparkles className="w-4 h-4" /> Launch My 180-Day Program
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RETURNING USER EXPERIENCE: MAIN PROGRAM DASHBOARD
  // ----------------------------------------------------
  const completedPercent = Math.min(100, Math.round((progState.completedDays.length / 180) * 100));
  const isSelectedDayCompleted = progState.completedDays.includes(selectedDayNumber);
  const currentDayWaterMl = progState.dailyWaterIntake[todayStr] || 0;
  const currentDaySteps = progState.dailySteps[todayStr] || (progState.dailyChecklist[todayStr]?.steps ? currentLifestyle.stepTarget : 0);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-gray-900 pb-20 pt-4 sm:pt-6 px-3 sm:px-6 max-w-7xl mx-auto w-full overflow-x-hidden">
      {/* Top Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-md border border-rose-100 bg-gradient-to-r from-rose-900 via-pink-900 to-purple-950 text-white p-5 sm:p-8 md:p-10 mb-6 sm:mb-8 w-full">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full">
          <div className="space-y-2 max-w-2xl min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/30 border border-rose-400/40 text-rose-200 text-xs font-bold uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" /> Women Confidence Program • Phase {activePhase.phaseNumber} of 6
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight break-words">
              180 Days to Become Stronger, Fitter & More Confident
            </h1>
            <p className="text-rose-100/90 text-xs sm:text-sm md:text-base leading-relaxed break-words">
              Welcome back, <span className="font-bold text-white">{user?.displayName || "Athlete"}</span>. You are on <span className="font-extrabold text-amber-300">Day {progState.currentDay}</span> ({activePhase.title}).
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-3 bg-white/10 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-white/15 w-full md:w-auto">
            <div className="text-center px-1 sm:px-3 border-r border-white/20">
              <div className="text-[11px] sm:text-xs text-rose-200 font-medium">Progress</div>
              <div className="text-lg sm:text-xl font-black text-white">{completedPercent}%</div>
            </div>
            <div className="text-center px-1 sm:px-3 border-r border-white/20">
              <div className="text-[11px] sm:text-xs text-rose-200 font-medium">Streak</div>
              <div className="text-lg sm:text-xl font-black text-amber-300 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-300 flex-shrink-0" /> {progState.streaks.currentStreak}d
              </div>
            </div>
            <div className="text-center px-1 sm:px-3">
              <div className="text-[11px] sm:text-xs text-rose-200 font-medium">Days Done</div>
              <div className="text-lg sm:text-xl font-black text-white">{progState.completedDays.length}/180</div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 relative z-10 w-full">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-200 mb-1.5">
            <span>Overall Transformation Progress</span>
            <span>Day {progState.currentDay} of 180</span>
          </div>
          <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(2, completedPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Program Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-gray-200 w-full max-w-full touch-pan-x">
        {[
          { id: "dashboard", label: "Daily Dashboard", icon: Sparkles },
          { id: "workout", label: `Day ${selectedDayNumber} Workout`, icon: Dumbbell },
          { id: "journey", label: "180 Day Journey", icon: Layers },
          { id: "lifestyle", label: "Daily Lifestyle", icon: Heart },
          { id: "nutrition", label: "Nutrition Matrix", icon: Apple },
          { id: "recovery", label: "Recovery & Sleep", icon: Moon },
          { id: "reviews", label: "Weekly Reports", icon: BarChart3 },
          { id: "achievements", label: "Achievements", icon: Trophy },
          { id: "measurements", label: "Measurements", icon: Activity },
          { id: "journal", label: "Confidence Journal", icon: BookOpen }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                isActive 
                  ? "bg-rose-600 text-white shadow-sm" 
                  : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200/80 hover:border-gray-300"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TAB 1: DAILY DASHBOARD */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 w-full min-w-0">
          {/* Continue Journey Hero Action */}
          <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 rounded-2xl border border-rose-200/80 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm w-full">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="text-xs font-extrabold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 flex-shrink-0" /> Resume Where You Stopped
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 break-words">
                DAY {String(selectedDayNumber).padStart(2, "0")} / 180: {currentWorkout.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 break-words">
                Focus: <span className="font-bold text-gray-800">{currentWorkout.focus}</span> • {currentWorkout.estimatedMinutes} Mins • {currentWorkout.exercises.length} Drills
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("workout")}
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-extrabold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
              >
                <Play className="w-4 h-4 fill-white" /> Start Today's Workout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {/* Left 2 Cols: Today's Workout & Lifestyle Checklist */}
            <div className="lg:col-span-2 space-y-6 w-full min-w-0">
              {/* Daily Checklist */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-900 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-rose-600 flex-shrink-0" /> Today's Confidence Checklist
                  </h3>
                  <span className="text-xs font-semibold text-gray-500">{todayStr}</span>
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  {[
                    { key: "workout", label: `Complete Day ${selectedDayNumber} Workout (${currentWorkout.focus})`, icon: Dumbbell },
                    { key: "steps", label: `Hit ${currentLifestyle.stepTarget.toLocaleString()} Daily Steps`, icon: Footprints },
                    { key: "water", label: `Drink ${currentLifestyle.waterTargetLiters}L Hydration Target`, icon: Droplets },
                    { key: "protein", label: `25g+ Protein per meal & Colorful Greens`, icon: Apple },
                    { key: "sleep", label: `${currentLifestyle.sleepTargetHours} Hours Restorative Sleep & Night Wind-down`, icon: Moon },
                    { key: "confidenceChallenge", label: `Daily Confidence Challenge: ${currentLifestyle.confidenceChallenge.title}`, icon: Sparkles }
                  ].map(item => {
                    const habitKey = item.key as "workout" | "steps" | "water" | "protein" | "sleep" | "confidenceChallenge";
                    const isChecked = Boolean(progState.dailyChecklist[todayStr]?.[habitKey]);
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.key}
                        onClick={() => handleToggleDailyHabit(habitKey)}
                        className={`flex items-center justify-between p-3 sm:p-3.5 rounded-xl border cursor-pointer transition-all gap-3 ${
                          isChecked 
                            ? "bg-rose-50/70 border-rose-300 text-rose-900" 
                            : "bg-white border-gray-200 hover:border-rose-200 text-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center border transition-all flex-shrink-0 ${
                            isChecked ? "bg-rose-600 border-rose-600 text-white" : "border-gray-300 bg-white text-transparent"
                          }`}>
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <span className={`text-xs sm:text-sm font-semibold break-words ${isChecked ? "line-through text-gray-500" : ""}`}>
                            {item.label}
                          </span>
                        </div>
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isChecked ? "text-rose-500" : "text-gray-400"}`} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Confidence Challenge of the Day */}
              <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 rounded-2xl p-5 sm:p-6 border border-pink-200/80 shadow-sm w-full">
                <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <Star className="w-4 h-4 fill-rose-500 text-rose-500 flex-shrink-0" /> Daily Mindset & Confidence Challenge
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 break-words">
                  {currentLifestyle.confidenceChallenge.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4 break-words">
                  "{currentLifestyle.confidenceChallenge.prompt}"
                </p>
                <div className="p-3 rounded-xl bg-white/80 border border-pink-100 text-xs text-rose-900 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span className="break-words">Action Step: {currentLifestyle.confidenceChallenge.action}</span>
                </div>
              </div>
            </div>

            {/* Right Col: Hydration, Steps, and Quick Coaching */}
            <div className="space-y-6 w-full min-w-0">
              {/* Hydration Tracker */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm w-full">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500 flex-shrink-0" /> Hydration Tracker
                  </h4>
                  <span className="text-xs font-bold text-blue-600">
                    {(currentDayWaterMl / 1000).toFixed(1)} / {currentLifestyle.waterTargetLiters} L
                  </span>
                </div>

                {/* Visual Water Gauge */}
                <div className="w-full h-3 bg-blue-50 rounded-full overflow-hidden mb-4 border border-blue-100">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (currentDayWaterMl / (currentLifestyle.waterTargetLiters * 1000)) * 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => handleAdjustWater(-250)}
                    className="py-2 px-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1 min-w-0"
                  >
                    <Minus className="w-3.5 h-3.5 flex-shrink-0" /> 250ml
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustWater(250)}
                    className="py-2 px-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 flex items-center justify-center gap-1 min-w-0"
                  >
                    <Plus className="w-3.5 h-3.5 flex-shrink-0" /> 250ml
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustWater(500)}
                    className="py-2 px-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center justify-center gap-1 shadow-sm min-w-0"
                  >
                    <Plus className="w-3.5 h-3.5 flex-shrink-0" /> 500ml
                  </button>
                </div>
              </div>

              {/* Coaching Cue */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-3 w-full">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500">
                  <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" /> Coach Alex's Tip for Today
                </div>
                <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed break-words">
                  "{currentWorkout.coachingCue}"
                </p>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Phase {activePhase.phaseNumber}: {activePhase.title}</span>
                  <span className="font-semibold text-rose-600">{currentWorkout.intensity} Intensity</span>
                </div>
              </div>

              {/* Quick Jump to Milestone */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm w-full">
                <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0" /> Next Milestone Unlocked
                </h4>
                {(() => {
                  const nextMilestone = MILESTONE_ACHIEVEMENTS.find(m => m.day > progState.currentDay) || MILESTONE_ACHIEVEMENTS[MILESTONE_ACHIEVEMENTS.length - 1];
                  const daysLeft = Math.max(0, nextMilestone.day - progState.currentDay);
                  return (
                    <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-amber-900">{nextMilestone.badgeName}</span>
                        <span className="text-[11px] font-extrabold text-amber-700">Day {nextMilestone.day}</span>
                      </div>
                      <p className="text-xs text-amber-800 break-words">{nextMilestone.description}</p>
                      <div className="text-[11px] font-semibold text-amber-600 pt-1">
                        {daysLeft === 0 ? "Unlocked!" : `${daysLeft} days to unlock`}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 2: TODAY'S WORKOUT */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "workout" && (
        <div className="space-y-6 w-full min-w-0">
          {/* Workout Header Bar */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase">
                  Day {selectedDayNumber} of 180
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                  {currentWorkout.dayType.toUpperCase()}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                  {currentWorkout.intensity} Intensity
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 break-words">{currentWorkout.title}</h2>
              <p className="text-xs sm:text-sm text-gray-600 break-words">{currentWorkout.subtitle}</p>
            </div>

            {/* Quick Rest Timer Bar */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200 w-full sm:w-auto flex-shrink-0">
              <div className="text-center pr-3 border-r border-gray-200">
                <div className="text-[10px] uppercase font-bold text-gray-500">Rest Timer</div>
                <div className={`text-lg font-black ${isTimerRunning ? "text-rose-600 animate-pulse" : "text-gray-800"}`}>
                  {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, "0")}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => startRestTimer(30)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-rose-50"
                >
                  30s
                </button>
                <button
                  type="button"
                  onClick={() => startRestTimer(45)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-rose-50"
                >
                  45s
                </button>
                <button
                  type="button"
                  onClick={() => startRestTimer(60)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-rose-50"
                >
                  60s
                </button>
                {isTimerRunning && (
                  <button
                    type="button"
                    onClick={() => setIsTimerRunning(false)}
                    className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                    title="Stop timer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 24-HOUR PROGRESSIVE UNLOCK NOTICE IF LOCKED */}
          {!selectedDayStatus.unlocked && !progState.completedDays.includes(selectedDayNumber) && (
            <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-pink-50 border border-amber-200 rounded-2xl p-5 sm:p-6 text-center space-y-4 shadow-sm w-full">
              <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-200 text-amber-700 mx-auto flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              
              <div className="space-y-1 max-w-lg mx-auto min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-black text-gray-900 break-words">
                  {selectedDayStatus.reason === "timer_active" 
                    ? `Day ${selectedDayNumber} Unlocks in 24 Hours` 
                    : `Day ${selectedDayNumber} Locked`}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed break-words">
                  {selectedDayStatus.reason === "timer_active"
                    ? "Workouts unlock sequentially one after the other every 24 hours. This ensures scientific recovery, muscle protein synthesis, and hormone optimization."
                    : `Please complete Day ${selectedDayNumber - 1} before proceeding to this training session.`}
                </p>
              </div>

              {selectedDayStatus.reason === "timer_active" && (
                <div className="inline-flex flex-col items-center justify-center p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-amber-200 shadow-sm min-w-[200px]">
                  <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest">
                    Next Unlock Countdown
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-rose-600 font-mono tracking-tight mt-1">
                    {formatCountdown(selectedDayStatus.remainingSeconds)}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDayNumber(progState.currentDay);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md hover:bg-rose-700"
                >
                  Go to Active Day {progState.currentDay}
                </button>
              </div>
            </div>
          )}

          {/* Exercise List (8-10 exercises) */}
          <div className="space-y-4 w-full">
            {currentWorkout.exercises.map((ex, index) => {
              const dayKey = `day_${selectedDayNumber}`;
              const isCompleted = (progState.completedExercises[dayKey] || []).includes(ex.id);

              return (
                <div 
                  key={ex.id}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden w-full ${
                    isCompleted ? "border-emerald-300 bg-emerald-50/20" : "border-gray-200 shadow-sm"
                  }`}
                >
                  <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-5 sm:gap-6 items-start w-full">
                    {/* Media / Unified Media Demonstration */}
                    <div className="w-full lg:w-72 aspect-video rounded-xl overflow-hidden workout-media-frameless flex-shrink-0 relative">
                      <UnifiedExerciseMedia 
                        exerciseName={ex.name}
                        exerciseId={ex.id}
                        className="w-full h-full object-contain workout-gif-display"
                        fallbackType="dumbbell"
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold z-10 border border-white/10">
                        Drill #{index + 1}
                      </div>
                      {isCompleted && (
                        <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                          <div className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1 shadow-md">
                            <Check className="w-3.5 h-3.5" /> COMPLETED
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Exercise Spec & Details */}
                    <div className="flex-1 space-y-3 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-rose-600 uppercase tracking-wider">{ex.targetMuscles}</div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 break-words">{ex.name}</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleExercise(ex.id)}
                          className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-sm flex-shrink-0 ${
                            isCompleted 
                              ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                              : "bg-gray-100 text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-200"
                          }`}
                        >
                          <Check className="w-4 h-4" /> {isCompleted ? "Completed" : "Mark Done"}
                        </button>
                      </div>

                      {/* Sets / Reps / Rest Bar */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-extrabold border border-rose-100">
                          {ex.sets} Sets
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-extrabold border border-purple-100">
                          {ex.reps}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-extrabold border border-blue-100">
                          Rest: {ex.restPeriod}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-semibold">
                          Equip: {ex.equipment}
                        </span>
                      </div>

                      {/* Instructions */}
                      <div className="space-y-1 text-xs text-gray-600 leading-relaxed">
                        {ex.instructions.map((ins, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="font-bold text-gray-400 flex-shrink-0">{i + 1}.</span>
                            <span className="break-words">{ins}</span>
                          </div>
                        ))}
                      </div>

                      {/* Form Tips & Modifications */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-[11px] w-full">
                        <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 text-amber-900 break-words">
                          <span className="font-bold">Form Tip:</span> {ex.formTips[0]}
                        </div>
                        <div className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-100 text-rose-900 break-words">
                          <span className="font-bold">Modification:</span> {ex.beginnerModification}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Complete Day Workout Button */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full">
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="font-bold text-gray-900 text-sm sm:text-base">Finished all exercises for Day {selectedDayNumber}?</div>
              <p className="text-xs text-gray-500">Completing this day will record your progress, log your streak, and start the 24-hour countdown for Day {selectedDayNumber + 1}.</p>
            </div>

            <button
              type="button"
              onClick={() => handleCompleteFullDay(selectedDayNumber)}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform flex-shrink-0"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> Mark Day {selectedDayNumber} Complete
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 3: 180 DAY JOURNEY MAP */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "journey" && (
        <div className="space-y-6 sm:space-y-8 w-full min-w-0">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm w-full">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">180-Day Progressive Curriculum Map</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Workouts unlock one after the other after each 24-hour cycle. Select any day to view details and progression.
            </p>
          </div>

          {PROGRAM_PHASES.map(phase => {
            const isPhaseActive = progState.currentDay >= phase.startDay && progState.currentDay <= phase.endDay;
            const daysInPhase = Array.from({ length: phase.endDay - phase.startDay + 1 }, (_, i) => phase.startDay + i);

            return (
              <div key={phase.phaseNumber} className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm space-y-4 w-full min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                      Phase {phase.phaseNumber} • Days {phase.startDay} - {phase.endDay}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-gray-900">{phase.title}</h3>
                    <p className="text-xs text-gray-500">{phase.tagline}</p>
                  </div>
                  {isPhaseActive && (
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-extrabold w-fit flex-shrink-0">
                      CURRENT ACTIVE PHASE
                    </span>
                  )}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-1.5 sm:gap-2 w-full">
                  {daysInPhase.map(dayNum => {
                    const isDone = progState.completedDays.includes(dayNum);
                    const isCurrent = progState.currentDay === dayNum;
                    const isSelected = selectedDayNumber === dayNum;
                    const dayStatus = getDayUnlockStatus(dayNum);
                    const isLocked = !dayStatus.unlocked && !isDone;

                    return (
                      <button
                        key={dayNum}
                        type="button"
                        onClick={() => {
                          setSelectedDayNumber(dayNum);
                          setActiveTab("workout");
                        }}
                        className={`p-2 sm:p-2.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center justify-center gap-1 min-w-0 w-full ${
                          isDone 
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800" 
                            : isCurrent 
                              ? "bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-300" 
                              : isSelected 
                                ? "border-purple-400 bg-purple-50 text-purple-800" 
                                : isLocked
                                  ? "border-gray-200 text-gray-400 bg-gray-50/70"
                                  : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <span>{dayNum}</span>
                        {isDone ? (
                          <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        ) : isCurrent ? (
                          <Flame className="w-3 h-3 text-rose-500 fill-rose-500 flex-shrink-0" />
                        ) : isLocked ? (
                          <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 4: DAILY LIFESTYLE */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "lifestyle" && (
        <div className="space-y-6 w-full min-w-0">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm w-full">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Day {selectedDayNumber} Lifestyle Matrix</h2>
            <p className="text-xs sm:text-sm text-gray-600">Personalized daily habits, hydration, nutrition habits, and routines.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Morning & Evening Routine */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-4 w-full">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" /> Daily Empowering Routines
              </h3>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 space-y-1">
                <div className="font-bold text-xs text-amber-900 uppercase">Morning Awakening Routine</div>
                <p className="text-xs text-amber-800 leading-relaxed break-words">{currentLifestyle.morningRoutine}</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 space-y-1">
                <div className="font-bold text-xs text-purple-900 uppercase">Evening Rest & Wind-Down</div>
                <p className="text-xs text-purple-800 leading-relaxed break-words">{currentLifestyle.eveningRoutine}</p>
              </div>

              <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-100 space-y-1">
                <div className="font-bold text-xs text-teal-900 uppercase">Stress Management Reset</div>
                <p className="text-xs text-teal-800 leading-relaxed break-words">{currentLifestyle.stressManagementTip}</p>
              </div>
            </div>

            {/* Nutrition & Protein Guidance */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-4 w-full">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                <Apple className="w-5 h-5 text-rose-500 flex-shrink-0" /> Daily Nourishment Focus
              </h3>

              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-100 space-y-1">
                <div className="font-bold text-xs text-rose-900 uppercase">{currentLifestyle.mealGuidance.focus}</div>
                <p className="text-xs text-rose-800 leading-relaxed break-words">{currentLifestyle.mealGuidance.proteinTip}</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                <div className="font-bold text-xs text-emerald-900 uppercase">Colorful Produce Tip</div>
                <p className="text-xs text-emerald-800 leading-relaxed break-words">{currentLifestyle.mealGuidance.produceTip}</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1">
                <div className="font-bold text-xs text-blue-900 uppercase">Sample Meal Suggestion</div>
                <p className="text-xs text-blue-800 leading-relaxed break-words">{currentLifestyle.mealGuidance.sampleMealIdea}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 5: NUTRITION MATRIX */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "nutrition" && (
        <div className="space-y-6 w-full min-w-0">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm w-full">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Women's Sustainable Nutrition Guide</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              No starvation, no extreme deficits. We fuel your metabolism with protein, micronutrients, and balanced energy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 w-full">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-100 shadow-sm space-y-2 w-full">
              <div className="text-rose-600 font-extrabold text-2xl">25 - 35g</div>
              <h3 className="font-bold text-gray-900 text-sm">Protein per Meal</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Chicken breast, wild salmon, Greek yogurt, tofu, eggs, edamame, and collagen peptides to support muscle recovery.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-100 shadow-sm space-y-2 w-full">
              <div className="text-emerald-600 font-extrabold text-2xl">50% Plate</div>
              <h3 className="font-bold text-gray-900 text-sm">Vibrant Vegetables</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Spinach, broccoli, zucchini, bell peppers, asparagus, and leafy greens to provide fiber and antioxidant defense.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-blue-100 shadow-sm space-y-2 w-full">
              <div className="text-blue-600 font-extrabold text-2xl">{currentLifestyle.waterTargetLiters} Liters</div>
              <h3 className="font-bold text-gray-900 text-sm">Pure Hydration</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Water with lemon, herbal teas, and mineral electrolytes to maintain cellular energy and glowing skin.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 6: RECOVERY & SLEEP */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "recovery" && (
        <div className="space-y-6 w-full min-w-0">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm w-full">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Restorative Recovery & Sleep Matrix</h2>
            <p className="text-xs sm:text-sm text-gray-600">Your body transforms during sleep and recovery, not while training.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-3 w-full">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Moon className="w-4 h-4 text-purple-600 flex-shrink-0" /> Sleep Hygiene Protocol
              </h3>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>Aim for 7.5 to 9 hours of uninterrupted sleep in a dark, cool room (65-68°F).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>Cut off caffeine 8 hours before your target bedtime.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>Switch screens to night shift / warm color spectrum 1 hour before sleep.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-3 w-full">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Active Recovery Stretches
              </h3>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>90/90 Hip Flow:</strong> 2 minutes per side to loosen tight hip capsules.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Cat-Cow & Thoracic Rotations:</strong> 10 slow reps to decompress spinal disks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Elevated Legs Up the Wall:</strong> 5 minutes before bed to drain venous pool.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 7: WEEKLY REPORTS */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "reviews" && (
        <div className="space-y-6 w-full min-w-0">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm w-full">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Weekly Transformation Reviews</h2>
            <p className="text-xs sm:text-sm text-gray-600">Every 7 days, review your trends, consistency scores, and strength progression.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-gray-200 shadow-sm w-full">
              <div className="text-xs text-gray-500 font-semibold">Total Workouts Completed</div>
              <div className="text-2xl font-black text-rose-600 mt-1">{progState.completedWorkouts.length}</div>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-gray-200 shadow-sm w-full">
              <div className="text-xs text-gray-500 font-semibold">Current Discipline Streak</div>
              <div className="text-2xl font-black text-amber-500 mt-1">{progState.streaks.currentStreak} Days</div>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-gray-200 shadow-sm w-full">
              <div className="text-xs text-gray-500 font-semibold">Achievements Unlocked</div>
              <div className="text-2xl font-black text-purple-600 mt-1">{progState.achievements.length} / 7</div>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-gray-200 shadow-sm w-full">
              <div className="text-xs text-gray-500 font-semibold">Journal Reflections</div>
              <div className="text-2xl font-black text-teal-600 mt-1">{progState.journalEntries.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 8: ACHIEVEMENTS & BADGES */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "achievements" && (
        <div className="space-y-6 w-full min-w-0">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm w-full">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Milestones & Confidence Badges</h2>
            <p className="text-xs sm:text-sm text-gray-600">Celebrate every 30-day phase, consistency streak, and physical breakthrough.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {MILESTONE_ACHIEVEMENTS.map(m => {
              const isUnlocked = progState.achievements.includes(m.id) || progState.completedDays.length >= m.day;
              return (
                <div 
                  key={m.id}
                  className={`p-5 rounded-2xl border transition-all w-full ${
                    isUnlocked ? "bg-white border-amber-300 shadow-md ring-1 ring-amber-200" : "bg-gray-50/80 border-gray-200 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${isUnlocked ? m.color : "bg-gray-200 text-gray-400"}`}>
                      <Crown className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-500">Day {m.day}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">{m.title}</h3>
                  <div className="text-xs font-extrabold text-amber-600 mt-0.5">{m.badgeName}</div>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed break-words">{m.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 9: MEASUREMENTS & BODY COMPOSITION */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "measurements" && (
        <div className="space-y-6 w-full min-w-0">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm w-full">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Body Measurements & Weight History</h2>
            <p className="text-xs sm:text-sm text-gray-600">Track circumference trends over the 180 days rather than obsessing over daily scale fluctuations.</p>
          </div>

          {/* Measurement Input Form */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-4 w-full">
            <h3 className="font-bold text-gray-900 text-sm">Log New Checkpoint</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  placeholder="e.g. 62.5" 
                  value={inputWeight}
                  onChange={e => setInputWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Waist (cm)</label>
                <input 
                  type="number" 
                  step="0.5" 
                  placeholder="e.g. 70" 
                  value={inputWaist}
                  onChange={e => setInputWaist(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Hips (cm)</label>
                <input 
                  type="number" 
                  step="0.5" 
                  placeholder="e.g. 96" 
                  value={inputHips}
                  onChange={e => setInputHips(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Thighs (cm)</label>
                <input 
                  type="number" 
                  step="0.5" 
                  placeholder="e.g. 54" 
                  value={inputThighs}
                  onChange={e => setInputThighs(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              {measurementStatus && <span className="text-xs font-bold text-emerald-600">{measurementStatus}</span>}
              <button
                type="button"
                onClick={handleSaveMeasurement}
                className="w-full sm:w-auto sm:ml-auto px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-sm"
              >
                Save Measurements
              </button>
            </div>
          </div>

          {/* Weight Chart */}
          {progState.weightLogs.length > 0 && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm w-full min-w-0 overflow-hidden">
              <h3 className="font-bold text-gray-900 text-sm mb-4">Weight Trend Over Time</h3>
              <div className="h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progState.weightLogs}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#e11d48" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 10: CONFIDENCE JOURNAL */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "journal" && (
        <div className="space-y-6 w-full min-w-0">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm w-full">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Daily Confidence & Mindset Journal</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Reflect on your mental breakthroughs, gratitude, and feelings of growing inner strength.
            </p>
          </div>

          {/* Journal Entry Box */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-4 w-full">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-900 text-xs font-semibold break-words">
              Today's Prompt: "{currentLifestyle.journalPrompt}"
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Your Confidence Score Today (1 to 10): <span className="text-rose-600 font-extrabold">{journalConfidenceScore}/10</span>
              </label>
              <input 
                type="range"
                min="1"
                max="10"
                value={journalConfidenceScore}
                onChange={e => setJournalConfidenceScore(Number(e.target.value))}
                className="w-full accent-rose-600"
              />
            </div>

            <textarea 
              rows={4}
              value={journalInput}
              onChange={e => setJournalInput(e.target.value)}
              placeholder="Write your honest reflection, wins, or breakthroughs here..."
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 text-sm font-normal"
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {journalSaveStatus && <span className="text-xs font-bold text-emerald-600">{journalSaveStatus}</span>}
              <button
                type="button"
                onClick={handleSaveJournalEntry}
                className="w-full sm:w-auto sm:ml-auto px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-sm flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Save Reflection
              </button>
            </div>
          </div>

          {/* Past Entries */}
          <div className="space-y-3 w-full">
            <h3 className="font-bold text-gray-900 text-sm">Past Journal Reflections ({progState.journalEntries.length})</h3>
            {progState.journalEntries.map(entry => (
              <div key={entry.id} className="p-4 sm:p-5 rounded-xl bg-white border border-gray-200 shadow-sm space-y-1.5 w-full">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-bold text-rose-600">Day {entry.dayNumber} • {entry.date}</span>
                  <span className="font-semibold text-amber-600">Score: {entry.confidenceScore}/10</span>
                </div>
                <p className="text-xs text-gray-800 italic break-words">"{entry.prompt}"</p>
                <p className="text-xs text-gray-700 pt-1 leading-relaxed break-words">{entry.response}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medical Safety Notice Footer */}
      <div className="mt-12 p-4 rounded-2xl bg-white border border-gray-200 text-center text-xs text-gray-500 max-w-2xl mx-auto shadow-sm">
        <p className="leading-relaxed">
          <span className="font-bold text-gray-700">Medical Safety Notice:</span> The Women Confidence Program promotes balanced, progressive training without extreme calorie starvation or unsafe deficits. Women with medical conditions, pregnancy, postpartum recovery, or injuries should obtain professional medical clearance before following physical exercise routines.
        </p>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full text-center space-y-4 shadow-2xl border border-rose-200"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 mx-auto flex items-center justify-center text-white shadow-lg">
                <Crown className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                WOMEN CONFIDENCE COMPLETE!
              </h2>
              <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
                180 Days to Become Stronger, Fitter and More Confident
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Congratulations, <span className="font-bold">{user?.displayName || "Athlete"}</span>! You have successfully completed the entire 180-day curriculum across all 6 progressive phases. You have cultivated genuine physical power, posture elegance, discipline, and lifelong confidence.
              </p>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-gray-500">Total Days</div>
                  <div className="font-extrabold text-base text-gray-900">180</div>
                </div>
                <div>
                  <div className="text-gray-500">Workouts</div>
                  <div className="font-extrabold text-base text-rose-600">{progState.completedWorkouts.length}</div>
                </div>
                <div>
                  <div className="text-gray-500">Badges</div>
                  <div className="font-extrabold text-base text-amber-600">{progState.achievements.length}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCompletionModal(false)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-extrabold text-sm shadow-lg hover:shadow-xl"
              >
                View My Dashboard & Certificate
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebratory Completion Modal */}
      {celebrationModalData && (
        <WorkoutCelebrationModal
          isOpen={celebrationModalData.isOpen}
          onClose={() => setCelebrationModalData(null)}
          programId="women_confidence"
          programName="Women 180-Day Confidence & Glute Sculpt"
          completedDay={celebrationModalData.completedDay}
          totalDays={celebrationModalData.totalDays}
          streakCount={celebrationModalData.streakCount}
          caloriesBurned={celebrationModalData.caloriesBurned}
          exercisesCompletedCount={celebrationModalData.exercisesCount}
          onContinue={() => {
            setCelebrationModalData(null);
            setActiveTab("dashboard");
          }}
        />
      )}
    </div>
  );
}
