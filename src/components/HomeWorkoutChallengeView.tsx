import React, { useState, useEffect, useMemo } from "react";
import { useApp, isEmailAdmin, checkIsUserPremium } from "../context/AppContext";
import { 
  Trophy, Flame, Zap, Award, CheckCircle2, Lock, Calendar, 
  ChevronRight, ChevronLeft, TrendingUp, Sparkles, Clock, Dumbbell, 
  Droplets, Footprints, Moon, Apple, Activity, BookOpen, Star, 
  AlertCircle, RefreshCw, BarChart3, Layers, Smile, Compass, Send, 
  CheckSquare, Plus, Minus, Info, Shield, Play, RotateCcw, Heart, 
  Camera, Upload, Eye, Check, X, ArrowRight, Share2, Crown, Coffee,
  Target, AlertTriangle, Video, Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isMockFirebase } from "../lib/firebase";
import { 
  HomeOnboardingProfile, 
  HomeDailyWorkout, 
  HomeExercise,
  HOME_PROGRAM_PHASES, 
  HOME_EXERCISES_CATALOG, 
  HOME_MILESTONE_BADGES,
  getHomeWorkoutForDay 
} from "../data/homeWorkoutChallengeData";
import { UnifiedExerciseMedia } from "./UnifiedExerciseMedia";
import { saveExerciseMediaToDatabase } from "../utils/mediaStorageService";
import { DailyLifestyleChecklist, DailyLifestyleHabits } from "./DailyLifestyleChecklist";
import { getExerciseGifUrl } from "../data/exercises";
import { resolveAdminMediaUrl } from "../lib/mediaStorage";
import { preloadImage } from "../utils/imageCache";

interface HomeChallengeState {
  userId: string;
  onboarding: HomeOnboardingProfile | null;
  currentDay: number;
  completedDays: number[]; // e.g. [1, 2, 3]
  completedCardioDays: number[]; // days where 5km was logged
  cardioLogs: {
    dayNumber: number;
    type: "5 KM Run" | "5 KM Walk";
    durationMinutes: number;
    date: string;
    notes?: string;
  }[];
  lifestyleChecklist: Record<string, DailyLifestyleHabits>;
  weightLogs: { date: string; weight: number }[];
  streaks: {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string;
  };
  achievements: string[]; // unlocked badge ids
  updatedAt: string;
}

const DEFAULT_CHALLENGE_STATE: HomeChallengeState = {
  userId: "",
  onboarding: null,
  currentDay: 1,
  completedDays: [],
  completedCardioDays: [],
  cardioLogs: [],
  lifestyleChecklist: {},
  weightLogs: [],
  streaks: {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: ""
  },
  achievements: [],
  updatedAt: new Date().toISOString()
};

export default function HomeWorkoutChallengeView() {
  const { user, setView } = useApp();
  const isPremium = checkIsUserPremium(user);
  const isAdmin = user && (user.role === "admin" || (user.email && isEmailAdmin(user.email)));

  const [state, setState] = useState<HomeChallengeState>(DEFAULT_CHALLENGE_STATE);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<
    "workout" | "cardio" | "calendar" | "lifestyle" | "nutrition" | "progress" | "admin"
  >("workout");

  // Onboarding form state
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [formData, setFormData] = useState<Partial<HomeOnboardingProfile>>({
    gender: "Male",
    age: 28,
    currentWeight: 75,
    height: 175,
    fitnessLevel: "Beginner",
    mainGoal: "Lose body fat",
    trainingDaysPerWeek: 5,
    currentAbilityLevel: "Complete Beginner",
    workoutTimePreference: "Morning"
  });
  const [photoPreview, setPhotoPreview] = useState<string>("");

  // Workout player / timer state
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [timerInitial, setTimerInitial] = useState<number>(45);

  // Cardio logging modal
  const [cardioType, setCardioType] = useState<"5 KM Run" | "5 KM Walk">("5 KM Walk");
  const [cardioDuration, setCardioDuration] = useState<number>(40);
  const [cardioNotes, setCardioNotes] = useState<string>("");
  const [cardioSuccessMsg, setCardioSuccessMsg] = useState<string>("");

  // Weight log input
  const [newWeightInput, setNewWeightInput] = useState<string>("");

  // Admin Custom Media state
  const [adminSelectedExerciseKey, setAdminSelectedExerciseKey] = useState<string>("push_ups");
  const [adminMediaUrl, setAdminMediaUrl] = useState<string>("");
  const [adminMediaType, setAdminMediaType] = useState<"image" | "video">("image");
  const [adminUploadStatus, setAdminUploadStatus] = useState<string>("");

  const todayDateStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // 1. Fetch user state on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!user) {
        // Check localStorage for offline/guest persistence
        const cached = localStorage.getItem("fit_home_challenge_state");
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (isMounted) {
              setState(parsed);
              setSelectedDayNumber(parsed.currentDay || 1);
            }
          } catch (e) {}
        }
        setLoading(false);
        return;
      }

      try {
        if (!isMockFirebase) {
          const docRef = doc(db, "home_workout_challenge", user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists() && isMounted) {
            const d = snap.data() as HomeChallengeState;
            setState(d);
            setSelectedDayNumber(d.currentDay || 1);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn("[HomeChallenge] Firestore fetch fallback:", e);
      }

      // Fallback to local storage
      const local = localStorage.getItem(`fit_home_challenge_${user.uid}`);
      if (local && isMounted) {
        try {
          const parsed = JSON.parse(local);
          setState(parsed);
          setSelectedDayNumber(parsed.currentDay || 1);
        } catch (e) {}
      }
      if (isMounted) setLoading(false);
    }

    loadData();
    return () => { isMounted = false; };
  }, [user]);

  // Sync state to local and Firestore
  const saveState = async (newState: HomeChallengeState) => {
    setState(newState);
    const storageKey = user ? `fit_home_challenge_${user.uid}` : "fit_home_challenge_state";
    localStorage.setItem(storageKey, JSON.stringify(newState));

    if (user && !isMockFirebase) {
      try {
        const docRef = doc(db, "home_workout_challenge", user.uid);
        await setDoc(docRef, { ...newState, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (e) {
        console.warn("[HomeChallenge] Firestore sync notice:", e);
      }
    }
  };

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const startTimer = (seconds: number) => {
    setTimerInitial(seconds);
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(timerInitial);
  };

  // Get current selected day workout
  const currentWorkout: HomeDailyWorkout = useMemo(() => {
    return getHomeWorkoutForDay(selectedDayNumber);
  }, [selectedDayNumber]);

  // Reset active exercise index when user switches day
  useEffect(() => {
    setActiveExerciseIndex(0);
  }, [selectedDayNumber]);

  // Preload next exercise GIFs in the background for instant transitions
  useEffect(() => {
    if (!currentWorkout || !currentWorkout.exercises || currentWorkout.exercises.length === 0) return;

    // 1. Immediately preload the active and next exercise with high priority
    const currentEx = currentWorkout.exercises[activeExerciseIndex];
    const nextEx = currentWorkout.exercises[activeExerciseIndex + 1];

    if (currentEx) {
      const url = currentEx.gifUrl || getExerciseGifUrl(currentEx.name);
      if (url) {
        const resolved = resolveAdminMediaUrl(url);
        if (resolved) preloadImage(resolved, true);
      }
    }

    if (nextEx) {
      const url = nextEx.gifUrl || getExerciseGifUrl(nextEx.name);
      if (url) {
        const resolved = resolveAdminMediaUrl(url);
        if (resolved) preloadImage(resolved, true);
      }
    }

    // 2. Preload the next-next exercise and remaining exercises in background on idle
    const timer = setTimeout(() => {
      const nextNextEx = currentWorkout.exercises[activeExerciseIndex + 2];
      if (nextNextEx) {
        const url = nextNextEx.gifUrl || getExerciseGifUrl(nextNextEx.name);
        if (url) {
          const resolved = resolveAdminMediaUrl(url);
          if (resolved) preloadImage(resolved, false);
        }
      }

      // Preload the rest of the daily workout exercises
      currentWorkout.exercises.forEach((ex, idx) => {
        if (idx !== activeExerciseIndex && idx !== activeExerciseIndex + 1 && idx !== activeExerciseIndex + 2) {
          const url = ex.gifUrl || getExerciseGifUrl(ex.name);
          if (url) {
            const resolved = resolveAdminMediaUrl(url);
            if (resolved) preloadImage(resolved, false);
          }
        }
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [currentWorkout, activeExerciseIndex]);

  // Onboarding completion
  const handleCompleteOnboarding = () => {
    const profile: HomeOnboardingProfile = {
      gender: formData.gender as any || "Male",
      age: Number(formData.age) || 28,
      currentWeight: Number(formData.currentWeight) || 75,
      height: Number(formData.height) || 175,
      fitnessLevel: formData.fitnessLevel as any || "Beginner",
      mainGoal: formData.mainGoal as any || "Lose body fat",
      trainingDaysPerWeek: Number(formData.trainingDaysPerWeek) || 5,
      currentAbilityLevel: formData.currentAbilityLevel as any || "Complete Beginner",
      workoutTimePreference: formData.workoutTimePreference as any || "Morning",
      startingPhotoUrl: photoPreview || undefined,
      startDate: new Date().toISOString()
    };

    const newState: HomeChallengeState = {
      ...state,
      userId: user?.uid || "guest",
      onboarding: profile,
      currentDay: 1,
      completedDays: [],
      weightLogs: [{ date: todayDateStr, weight: profile.currentWeight }],
      streaks: { currentStreak: 1, longestStreak: 1, lastActiveDate: todayDateStr },
      achievements: ["badge_first_step"],
      updatedAt: new Date().toISOString()
    };

    saveState(newState);
  };

  // Toggle workout completion
  const handleToggleWorkoutComplete = (dayNum: number) => {
    const isCompleted = state.completedDays.includes(dayNum);
    let newCompletedDays: number[];
    let newAchievements = [...state.achievements];

    if (isCompleted) {
      newCompletedDays = state.completedDays.filter((d) => d !== dayNum);
    } else {
      newCompletedDays = [...state.completedDays, dayNum];

      // Check milestones
      if (newCompletedDays.length >= 1 && !newAchievements.includes("badge_first_step")) {
        newAchievements.push("badge_first_step");
      }
      if (newCompletedDays.length >= 7 && !newAchievements.includes("badge_week_1")) {
        newAchievements.push("badge_week_1");
      }
      if (dayNum >= 30 && !newAchievements.includes("badge_phase_1")) {
        newAchievements.push("badge_phase_1");
      }
      if (newCompletedDays.length >= 60 && !newAchievements.includes("badge_day_60")) {
        newAchievements.push("badge_day_60");
      }
      if (dayNum >= 75 && !newAchievements.includes("badge_phase_2")) {
        newAchievements.push("badge_phase_2");
      }
      if (dayNum >= 90 && !newAchievements.includes("badge_day_90")) {
        newAchievements.push("badge_day_90");
      }
      if (dayNum >= 130 && !newAchievements.includes("badge_phase_3")) {
        newAchievements.push("badge_phase_3");
      }
      if (dayNum >= 180 && !newAchievements.includes("badge_phase_4")) {
        newAchievements.push("badge_phase_4");
      }
    }

    const nextDay = !isCompleted && dayNum === state.currentDay && dayNum < 180 
      ? dayNum + 1 
      : state.currentDay;

    const newStreak = !isCompleted 
      ? state.streaks.currentStreak + 1 
      : Math.max(0, state.streaks.currentStreak - 1);

    const newState: HomeChallengeState = {
      ...state,
      currentDay: nextDay,
      completedDays: newCompletedDays,
      achievements: newAchievements,
      streaks: {
        currentStreak: newStreak,
        longestStreak: Math.max(state.streaks.longestStreak, newStreak),
        lastActiveDate: todayDateStr
      },
      updatedAt: new Date().toISOString()
    };

    saveState(newState);
  };

  // Cardio Logging
  const handleLogCardio = () => {
    const newLog = {
      dayNumber: selectedDayNumber,
      type: cardioType,
      durationMinutes: Number(cardioDuration) || 40,
      date: todayDateStr,
      notes: cardioNotes
    };

    const newCardioDays = Array.from(new Set([...state.completedCardioDays, selectedDayNumber]));
    const newState: HomeChallengeState = {
      ...state,
      completedCardioDays: newCardioDays,
      cardioLogs: [newLog, ...state.cardioLogs],
      updatedAt: new Date().toISOString()
    };

    saveState(newState);
    setCardioSuccessMsg(`Great job! Logged 5 KM ${cardioType.includes("Run") ? "Run" : "Walk"} for Day ${selectedDayNumber}.`);
    setTimeout(() => setCardioSuccessMsg(""), 4000);
  };

  // Lifestyle checklist toggle
  const handleToggleLifestyle = (key: keyof DailyLifestyleHabits, customValue?: any) => {
    const currentToday: DailyLifestyleHabits = state.lifestyleChecklist[todayDateStr] || {
      walkAfterMeals: false,
      noEatingAfter730PM: false,
      water3Liters: false,
      sleep8Hours: false,
      waterAmountMl: 0,
      walkMinutes: 0
    };

    const nextValue = customValue !== undefined ? customValue : !currentToday[key];
    const updatedToday: DailyLifestyleHabits = {
      ...currentToday,
      [key]: nextValue
    };

    const newState: HomeChallengeState = {
      ...state,
      lifestyleChecklist: {
        ...state.lifestyleChecklist,
        [todayDateStr]: updatedToday
      },
      updatedAt: new Date().toISOString()
    };

    saveState(newState);
  };

  // Add weight log
  const handleAddWeightLog = () => {
    const val = parseFloat(newWeightInput);
    if (isNaN(val) || val <= 30 || val >= 300) return;

    const updatedLogs = [{ date: todayDateStr, weight: val }, ...state.weightLogs];
    const newState: HomeChallengeState = {
      ...state,
      weightLogs: updatedLogs,
      updatedAt: new Date().toISOString()
    };

    saveState(newState);
    setNewWeightInput("");
  };

  // Admin Media Upload handler
  const handleAdminSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminMediaUrl.trim()) return;

    setAdminUploadStatus("Uploading & syncing to Supabase / Firestore...");
    try {
      const res = await saveExerciseMediaToDatabase(
        adminSelectedExerciseKey,
        adminMediaUrl.trim(),
        adminMediaType
      );

      if (res.success) {
        setAdminUploadStatus("✅ Successfully saved custom GIF across the entire platform!");
        setTimeout(() => setAdminUploadStatus(""), 4000);
      } else {
        setAdminUploadStatus("⚠️ Stored in active session / fallback cache");
      }
    } catch (err: any) {
      setAdminUploadStatus(`Error: ${err.message}`);
    }
  };

  // Calculated metrics
  const totalCompletedWorkouts = state.completedDays.length;
  const totalCompletedCardio = state.completedCardioDays.length;
  const progressPercent = Math.round((totalCompletedWorkouts / 180) * 100);

  const todayLifestyle = state.lifestyleChecklist[todayDateStr] || {
    walkAfterMeals: false,
    noEatingAfter730PM: false,
    water3Liters: false,
    sleep8Hours: false
  };

  // ----------------------------------------------------
  // GUEST / FREE PREVIEW (NON-PREMIUM)
  // ----------------------------------------------------
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-10">
          
          {/* Header Banner */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 font-mono text-xs font-black uppercase tracking-wider border border-red-100">
              <Sparkles className="w-4 h-4" />
              <span>Premium Home Transformation System</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight uppercase font-sans">
              180 Day Home Workout Challenge
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              Build strength, improve your fitness, and transform your lifestyle from home with zero equipment.
            </p>

            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                👤 Men & Women
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                🏠 100% Zero Equipment
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                🏃 2x Weekly 5 KM Run/Walk
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                🥗 7:30 PM Lifestyle Protocol
              </span>
            </div>
          </div>

          {/* 4 Phases Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOME_PROGRAM_PHASES.map((phase) => (
              <div 
                key={phase.phaseNumber} 
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase font-mono text-red-600">
                      Phase {phase.phaseNumber}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {phase.weekRange}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 leading-snug">
                    {phase.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {phase.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 text-[10px] font-mono text-slate-500 font-bold">
                  {phase.dayRange}
                </div>
              </div>
            ))}
          </div>

          {/* Key Features Callout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-900 text-white rounded-3xl p-6 sm:p-8">
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm">Progressive Bodyweight Architecture</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Step-by-step progressions from beginner variations (knee push-ups, chair squats) to master-level calisthenics.
              </p>
            </div>

            <div className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                <Footprints className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm">Weekly 5 KM Run or Walk</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Built-in twice weekly aerobic sessions with personal logging and milestones to maximize cardiovascular vitality.
              </p>
            </div>

            <div className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                <Apple className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm">Nutrition Matrix & 7:30 PM Target</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Whole food protein blueprints (eggs, fish, beans, yam, oats) and actionable lifestyle habits to prevent late-night eating.
              </p>
            </div>
          </div>

          {/* Sample Day 1 Workout Preview */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-red-600 uppercase">Interactive Preview</span>
                <h3 className="text-lg font-black text-slate-900">Day 1: Full Body Strength & Kinetic Foundations</h3>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full font-mono">
                30 Mins • Zero Equipment
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: "Standard Push-Ups (or Incline)", sets: "3 sets • 10-15 reps", cue: "Chest & Triceps" },
                { name: "Bodyweight Squats", sets: "3 sets • 15-20 reps", cue: "Quads & Glutes" },
                { name: "Floor Glute Bridges", sets: "3 sets • 15-20 reps", cue: "Posterior Chain" },
                { name: "Forearm Plank", sets: "3 sets • 30-60 sec", cue: "Deep Core" },
                { name: "Dynamic Jumping Jacks", sets: "3 sets • 45-60 sec", cue: "Cardio Ignition" }
              ].map((ex, i) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 font-bold block">Exercise 0{i + 1}</span>
                  <p className="text-xs font-bold text-slate-900">{ex.name}</p>
                  <p className="text-[11px] font-mono text-slate-500">{ex.sets}</p>
                  <span className="inline-block text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                    {ex.cue}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="text-center space-y-4 pt-4 border-t border-slate-200">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Ready to transform your physique from home?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
                Join thousands of athletes who transformed their stamina, strength, and health without stepping into a gym.
              </p>
            </div>

            <button
              onClick={() => setView("pricing")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-red-600/25 transition cursor-pointer"
            >
              <Crown className="w-5 h-5 text-amber-300" />
              <span>Unlock 180 Day Home Challenge with Premium</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ONBOARDING WIZARD FOR FIRST TIME USERS
  // ----------------------------------------------------
  if (!state.onboarding) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
          
          {/* Header */}
          <div className="space-y-2 text-center">
            <span className="text-xs font-mono font-black uppercase text-red-600 tracking-wider">
              Step {onboardingStep} of 4 • Personalized Setup
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">
              180 Day Home Workout Challenge Onboarding
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Tell us about yourself so we can calibrate your 180-day bodyweight journey for optimal progress and safety.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-red-600 h-full transition-all duration-300 rounded-full" 
              style={{ width: `${(onboardingStep / 4) * 100}%` }}
            />
          </div>

          {/* Step 1: Basic Biometrics */}
          {onboardingStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-base font-black text-slate-900 uppercase">1. Gender & Core Biometrics</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Gender</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Male", "Female"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: g as any })}
                        className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition ${
                          formData.gender === g 
                            ? "bg-red-600 text-white border-red-600 shadow-sm" 
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Age (Years)</label>
                  <input
                    type="number"
                    min={14}
                    max={95}
                    value={formData.age || ""}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="e.g. 28"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Current Weight (kg)</label>
                  <input
                    type="number"
                    min={35}
                    max={250}
                    value={formData.currentWeight || ""}
                    onChange={(e) => setFormData({ ...formData, currentWeight: parseFloat(e.target.value) || 0 })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="e.g. 75"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Height (cm)</label>
                  <input
                    type="number"
                    min={120}
                    max={230}
                    value={formData.height || ""}
                    onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="e.g. 175"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setOnboardingStep(2)}
                  className="px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <span>Next: Goals & Experience</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Goal & Fitness Level */}
          {onboardingStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-base font-black text-slate-900 uppercase">2. Main Goal & Experience Level</h3>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Primary Goal</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    "Build muscle",
                    "Lose body fat",
                    "Improve fitness",
                    "Build strength",
                    "Improve endurance",
                    "General fitness"
                  ].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setFormData({ ...formData, mainGoal: goal as any })}
                      className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition text-left ${
                        formData.mainGoal === goal 
                          ? "bg-red-600 text-white border-red-600 shadow-sm" 
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Fitness Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({ ...formData, fitnessLevel: lvl as any })}
                      className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition ${
                        formData.fitnessLevel === lvl 
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Current Ability Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Complete Beginner", "Some Experience", "Consistent", "Advanced"].map((ab) => (
                    <button
                      key={ab}
                      type="button"
                      onClick={() => setFormData({ ...formData, currentAbilityLevel: ab as any })}
                      className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition ${
                        formData.currentAbilityLevel === ab 
                          ? "bg-red-50 text-red-700 border-red-300 font-extrabold" 
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {ab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setOnboardingStep(1)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setOnboardingStep(3)}
                  className="px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <span>Next: Schedule & Preference</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Schedule & Preference */}
          {onboardingStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-base font-black text-slate-900 uppercase">3. Training Frequency & Preferred Time</h3>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">
                  How many days per week can you train at home?
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[3, 4, 5, 6, 7].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, trainingDaysPerWeek: num })}
                      className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition text-center ${
                        formData.trainingDaysPerWeek === num 
                          ? "bg-red-600 text-white border-red-600 shadow-sm" 
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {num} Days
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Preferred Workout Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Morning", "Evening", "Flexible"].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData({ ...formData, workoutTimePreference: time as any })}
                      className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition ${
                        formData.workoutTimePreference === time 
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setOnboardingStep(2)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setOnboardingStep(4)}
                  className="px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <span>Next: Starting Photo (Optional)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Optional Starting Photo & Launch */}
          {onboardingStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-base font-black text-slate-900 uppercase">4. Starting Progress Checkpoint</h3>
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Starting Progress Photo (Optional)</h4>
                    <p className="text-[11px] text-slate-500">Upload a Day 1 photo to compare when you conquer Day 180.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPhotoPreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-black cursor-pointer"
                  />
                </div>

                {photoPreview && (
                  <div className="pt-2">
                    <img 
                      src={photoPreview} 
                      alt="Day 1 starting checkpoint" 
                      className="h-32 w-32 object-cover rounded-xl border border-slate-300"
                    />
                  </div>
                )}
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/80 text-xs space-y-1 text-amber-900">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>180 Day Transformation Ready</span>
                </p>
                <p className="text-amber-800/90 text-[11px] leading-relaxed">
                  Your customized zero-equipment program is assembled. Prepare for progressive weekly workouts, twice-weekly 5 KM sessions, and the 7:30 PM nutrition guideline.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setOnboardingStep(3)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleCompleteOnboarding}
                  className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <span>Launch 180 Day Challenge</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN ACTIVE 180-DAY CHALLENGE DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      
      {/* Top Banner & Header Summary */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-red-50 text-red-600 font-mono text-[10px] font-black uppercase rounded-full border border-red-100">
                Phase {currentWorkout.phaseNumber} • {currentWorkout.phaseName.split(":")[1] || currentWorkout.phaseName}
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                100% Zero Equipment
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase font-sans tracking-tight">
              180 Day Home Workout Challenge
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl font-medium leading-relaxed">
              Build strength, improve your fitness, and transform your lifestyle from home with zero equipment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => setActiveTab("admin")}
                className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin GIF Manager</span>
              </button>
            )}
            <div className="text-right">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Progress</span>
              <span className="text-lg font-black text-red-600 font-mono">{progressPercent}% Conquered</span>
            </div>
          </div>
        </div>

        {/* Motivational Dynamic Quote */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-700 font-bold leading-relaxed">
            <strong className="text-red-600 font-mono">Day {selectedDayNumber} of 180:</strong> {currentWorkout.motivationalQuote}
          </p>
        </div>

        {/* Core Stats 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Current Challenge Day</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-slate-900 font-mono">Day {selectedDayNumber}</span>
              <span className="text-[10px] font-mono text-slate-400">/ 180</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Completed Workouts</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-emerald-600 font-mono">{totalCompletedWorkouts}</span>
              <span className="text-[10px] font-mono text-slate-400">days</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">5 KM Cardio Logs</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-blue-600 font-mono">{totalCompletedCardio}</span>
              <span className="text-[10px] font-mono text-slate-400">sessions</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Current Active Streak</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-amber-600 font-mono">{state.streaks.currentStreak}</span>
              <span className="text-[10px] font-mono text-slate-400">streak days</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">7:30 PM Cut-Off Today</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md font-mono ${
                todayLifestyle.noEatingAfter730PM 
                  ? "bg-emerald-100 text-emerald-800" 
                  : "bg-amber-100 text-amber-800"
              }`}>
                {todayLifestyle.noEatingAfter730PM ? "Completed" : "Pending Target"}
              </span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500">
            <span>Overall 180 Day Progression</span>
            <span>{totalCompletedWorkouts} of 180 Days ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-red-600 to-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Interactive Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-slate-100 pt-4">
          {[
            { id: "workout", label: "Today's Workout", icon: Dumbbell },
            { id: "cardio", label: "5 KM Run / Walk", icon: Footprints },
            { id: "calendar", label: "Weekly Schedule", icon: Calendar },
            { id: "lifestyle", label: "Lifestyle & 7:30 PM", icon: Clock },
            { id: "nutrition", label: "Nutrition & Foods", icon: Apple },
            { id: "progress", label: "Milestones & Metrics", icon: Trophy },
            ...(isAdmin ? [{ id: "admin", label: "Admin GIF Vault", icon: Shield }] : [])
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB 1: TODAY'S WORKOUT */}
      {/* ---------------------------------------------------- */}
      {activeTab === "workout" && (
        <div className="space-y-6">
          
          {/* Day Selector Ribbon */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
            <button
              onClick={() => setSelectedDayNumber((p) => Math.max(1, p - 1))}
              disabled={selectedDayNumber <= 1}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </button>

            <div className="text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                Browsing Day
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
                  Day {selectedDayNumber} of 180
                </span>
                {state.completedDays.includes(selectedDayNumber) && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full font-mono flex items-center gap-1">
                    <Check className="w-3 h-3" /> Completed
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedDayNumber((p) => Math.min(180, p + 1))}
              disabled={selectedDayNumber >= 180}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>

          {/* Workout Header Info */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-red-600 uppercase">
                  {currentWorkout.focus}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
                  {currentWorkout.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 font-mono text-xs font-bold rounded-full">
                  ⏱️ ~{currentWorkout.estimatedMinutes} Minutes
                </span>
                <button
                  onClick={() => handleToggleWorkoutComplete(selectedDayNumber)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer ${
                    state.completedDays.includes(selectedDayNumber)
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-red-600 hover:bg-red-700 text-white shadow-sm"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {state.completedDays.includes(selectedDayNumber) ? "Workout Completed" : "Mark Day Complete"}
                  </span>
                </button>
              </div>
            </div>

            {currentWorkout.isRestDay ? (
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl text-blue-900 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Moon className="w-5 h-5 text-blue-600" />
                  <span>Active Recovery & Joint Restoration Day</span>
                </div>
                <p className="text-xs text-blue-800/90 leading-relaxed">
                  Today is scheduled for tissue healing and mental decompression. Take a 20-minute relaxing outdoor walk, perform light stretching below, and focus on deep hydration and hitting your 7:30 PM eating cut-off.
                </p>
              </div>
            ) : currentWorkout.is5KmCardioDay ? (
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-amber-900 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Footprints className="w-5 h-5 text-amber-600" />
                    <span>5 Kilometer Aerobic Milestone Scheduled</span>
                  </div>
                  <button
                    onClick={() => setActiveTab("cardio")}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Open Cardio Tracker
                  </button>
                </div>
                <p className="text-xs text-amber-800/90 leading-relaxed">
                  Choose between a <strong>5 KM Run</strong> or <strong>5 KM Walk</strong>. Complete the distance at your own pace and log your time in the Cardio Tracker tab!
                </p>
              </div>
            ) : null}
          </div>

          {/* Interactive Workout Timer & Active Exercise Showcase */}
          {currentWorkout.exercises.length > 0 && (
            <div className="space-y-6">
              
              {/* Section Navigation Ribbon for Fast & Smooth Movement */}
              {currentWorkout.sections && currentWorkout.sections.length > 0 && (
                <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between gap-2 mb-2 px-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-red-500" />
                      Workout Sections ({currentWorkout.sections.length})
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Jump directly to any section
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    {currentWorkout.sections.map((sec, secIdx) => {
                      const isSecActive = sec.exerciseIndices.includes(activeExerciseIndex);
                      return (
                        <button
                          key={sec.id || secIdx}
                          type="button"
                          onClick={() => {
                            if (sec.exerciseIndices.length > 0) {
                              setActiveExerciseIndex(sec.exerciseIndices[0]);
                            }
                          }}
                          className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 border ${
                            isSecActive
                              ? "bg-red-600 border-red-600 text-white shadow-xs"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold ${
                            isSecActive ? "bg-white/25 text-white" : "bg-slate-200 text-slate-700"
                          }`}>
                            SEC {secIdx + 1}
                          </span>
                          <span>{sec.title || sec.name}</span>
                          <span className={`text-[10px] font-mono ${isSecActive ? "text-red-100" : "text-slate-400"}`}>
                            ({sec.exerciseIndices.length})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Active Exercise Focus (7 cols) */}
                <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                  {(() => {
                    const currentEx = currentWorkout.exercises[activeExerciseIndex] || currentWorkout.exercises[0];
                    const currentSecIdx = currentWorkout.sections?.findIndex(s => s.exerciseIndices.includes(activeExerciseIndex)) ?? -1;
                    const currentSec = currentSecIdx >= 0 && currentWorkout.sections ? currentWorkout.sections[currentSecIdx] : null;
                    const indexInSec = currentSec ? currentSec.exerciseIndices.indexOf(activeExerciseIndex) : -1;
                    const nextEx = currentWorkout.exercises[activeExerciseIndex + 1];
                    const isLastExercise = activeExerciseIndex === currentWorkout.exercises.length - 1;

                    return (
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              {currentSec && (
                                <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 text-[10px] font-mono font-bold uppercase border border-red-200">
                                  Section {currentSecIdx + 1}: {currentSec.title || currentSec.name}
                                </span>
                              )}
                              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                                Movement {activeExerciseIndex + 1} of {currentWorkout.exercises.length}
                                {indexInSec >= 0 && currentSec && ` (Step ${indexInSec + 1}/${currentSec.exerciseIndices.length})`}
                              </span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">
                              {currentEx.name}
                            </h3>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold shrink-0">
                            {currentEx.difficulty}
                          </span>
                        </div>

                        {/* GIF Video / Media Demonstration with Explicit React Key */}
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                          <UnifiedExerciseMedia
                            key={`${currentEx.id}-${currentEx.name}-${activeExerciseIndex}`}
                            exerciseId={currentEx.id}
                            exerciseName={currentEx.name}
                            className="w-full h-full object-cover"
                            priority={true}
                          />
                        </div>

                        {/* Sets, Reps/Time, Rest Interval - Strictly Distinguished */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Sets</span>
                            <span className="text-xs font-black text-slate-900 font-mono">{currentEx.sets}</span>
                          </div>

                          <div className={`p-2.5 rounded-xl border text-center ${
                            currentEx.workoutType === "reps" 
                              ? "bg-amber-50/70 border-amber-200 text-amber-950" 
                              : "bg-blue-50/70 border-blue-200 text-blue-950"
                          }`}>
                            <span className="text-[9px] font-mono uppercase font-bold block">
                              {currentEx.workoutType === "reps" ? "Target Reps" : "Target Duration"}
                            </span>
                            <span className="text-xs font-black font-mono">
                              {currentEx.repsOrDuration}
                            </span>
                            <span className="text-[8px] font-mono font-bold uppercase tracking-wider block mt-0.5 opacity-80">
                              {currentEx.workoutType === "reps" ? "Reps Based" : "Time Based"}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Rest Interval</span>
                            <span className="text-xs font-black text-slate-900 font-mono">{currentEx.restPeriod}</span>
                          </div>
                        </div>

                        {/* Beginner Friendly Modification Alert */}
                        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs space-y-1">
                          <span className="font-extrabold text-emerald-900 uppercase font-mono text-[10px] flex items-center gap-1">
                            <Smile className="w-3.5 h-3.5 text-emerald-600" />
                            Beginner Friendly Modification:
                          </span>
                          <p className="text-emerald-800 text-[11px] font-medium leading-relaxed">
                            {currentEx.beginnerModification}
                          </p>
                        </div>

                        {/* Kinetic Form Instructions */}
                        <div className="space-y-2">
                          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-tight block">
                            Form Instructions & Coaching Cues:
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-600">
                            {currentEx.instructions.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="h-4 w-4 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Fast & Smooth Navigation Controls */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveExerciseIndex((p) => Math.max(0, p - 1))}
                            disabled={activeExerciseIndex === 0}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 cursor-pointer flex items-center gap-1.5 transition"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous Movement</span>
                          </button>

                          {!isLastExercise ? (
                            <button
                              type="button"
                              onClick={() => setActiveExerciseIndex((p) => Math.min(currentWorkout.exercises.length - 1, p + 1))}
                              className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide bg-slate-900 text-white hover:bg-black cursor-pointer flex items-center gap-1.5 transition shadow-xs"
                            >
                              <span>Move to Next Movement</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleWorkoutComplete(selectedDayNumber)}
                              className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer flex items-center gap-1.5 transition shadow-xs"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Finish Day {selectedDayNumber} Workout</span>
                            </button>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Right Column: Rest Timer & Section-Grouped Routine List (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Built-in Interval Rest Timer */}
                  <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-red-500" />
                        Rest & Work Interval Timer
                      </span>
                      <span className="text-xs font-mono font-bold text-red-400">
                        {isTimerRunning ? "Running" : "Paused"}
                      </span>
                    </div>

                    <div className="text-center py-4">
                      <span className="text-5xl font-black font-mono tracking-tight text-white">
                        {String(Math.floor(timerSeconds / 60)).padStart(2, "0")}:{String(timerSeconds % 60).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Preset Timer Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      {[30, 45, 60, 90].map((sec) => (
                        <button
                          key={sec}
                          onClick={() => startTimer(sec)}
                          className={`py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                            timerInitial === sec && isTimerRunning 
                              ? "bg-red-600 text-white" 
                              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          {sec}s
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      {isTimerRunning ? (
                        <button
                          onClick={stopTimer}
                          className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black uppercase cursor-pointer"
                        >
                          Pause Timer
                        </button>
                      ) : (
                        <button
                          onClick={() => startTimer(timerSeconds || 45)}
                          className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Start Interval</span>
                        </button>
                      )}
                      <button
                        onClick={resetTimer}
                        className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Section-Grouped Movements List */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase text-slate-900 tracking-tight block">
                        Day {selectedDayNumber} Movements ({currentWorkout.exercises.length})
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        {currentWorkout.sections?.length || 1} Sections
                      </span>
                    </div>

                    <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
                      {(currentWorkout.sections && currentWorkout.sections.length > 0
                        ? currentWorkout.sections
                        : [{ id: "all", title: "Routine Movements", name: "Routine Movements", description: "", exerciseIndices: currentWorkout.exercises.map((_, i) => i) }]
                      ).map((section, secIdx) => {
                        const isSecActive = section.exerciseIndices.includes(activeExerciseIndex);
                        return (
                          <div key={section.id || secIdx} className="space-y-2">
                            {/* Section Header */}
                            <div className={`px-3 py-1.5 rounded-xl flex items-center justify-between text-xs font-bold ${
                              isSecActive ? "bg-red-50 text-red-900 border border-red-200" : "bg-slate-100 text-slate-700"
                            }`}>
                              <span className="flex items-center gap-1.5 uppercase font-mono text-[10px]">
                                <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                                  {secIdx + 1}
                                </span>
                                {section.title || section.name}
                              </span>
                              <span className="text-[10px] font-mono opacity-70">
                                {section.exerciseIndices.length} movements
                              </span>
                            </div>

                            {/* Exercises in this section */}
                            <div className="space-y-1.5 pl-1">
                              {section.exerciseIndices.map((idx) => {
                                const ex = currentWorkout.exercises[idx];
                                if (!ex) return null;
                                const isSelected = idx === activeExerciseIndex;
                                return (
                                  <div
                                    key={ex.id || idx}
                                    onClick={() => setActiveExerciseIndex(idx)}
                                    className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2.5 ${
                                      isSelected
                                        ? "bg-red-50/80 border-red-300 shadow-xs ring-1 ring-red-400"
                                        : "bg-white border-slate-200 hover:bg-slate-50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <span className={`h-6 w-6 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold shrink-0 ${
                                        isSelected ? "bg-red-600 text-white" : "bg-slate-100 text-slate-700"
                                      }`}>
                                        {idx + 1}
                                      </span>
                                      <div className="min-w-0">
                                        <p className={`text-xs font-bold truncate ${isSelected ? "text-red-900" : "text-slate-800"}`}>
                                          {ex.name}
                                        </p>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span className="text-[10px] font-mono text-slate-500">
                                            {ex.sets}
                                          </span>
                                          <span className="text-[10px] text-slate-300">•</span>
                                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                                            ex.workoutType === "reps" ? "bg-amber-100 text-amber-900" : "bg-blue-100 text-blue-900"
                                          }`}>
                                            {ex.repsOrDuration}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-red-600" : "text-slate-400"}`} />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* Daily Lifestyle Checklist Section */}
          <DailyLifestyleChecklist
            dateStr={todayDateStr}
            data={todayLifestyle}
            onToggle={handleToggleLifestyle}
          />

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 2: 5 KM RUN / WALK TRACKER */}
      {/* ---------------------------------------------------- */}
      {activeTab === "cardio" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 uppercase">
                  Bi-Weekly Aerobic Pillar
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
                  5 Kilometer Run or Walk Tracker
                </h2>
                <p className="text-xs text-slate-500 max-w-xl font-medium mt-1">
                  Complete a 5 KM session twice per week. Choose either a brisk walk or an aerobic run according to your current stamina.
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-center">
                <span className="text-[10px] font-mono font-bold text-blue-700 uppercase block">Total Distance Logged</span>
                <span className="text-xl font-black text-blue-900 font-mono">
                  {totalCompletedCardio * 5} KM
                </span>
              </div>
            </div>

            {/* Log Cardio Form */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-900">
                Log 5 KM Session for Day {selectedDayNumber}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Cardio Modality</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(["5 KM Walk", "5 KM Run"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setCardioType(t)}
                        className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                          cardioType === t 
                            ? "bg-blue-600 text-white border-blue-600" 
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Duration (Minutes)</label>
                  <input
                    type="number"
                    min={15}
                    max={120}
                    value={cardioDuration || ""}
                    onChange={(e) => setCardioDuration(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 42"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Notes / Elevation</label>
                  <input
                    type="text"
                    value={cardioNotes}
                    onChange={(e) => setCardioNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Felt great, outdoor brisk pace"
                  />
                </div>
              </div>

              {cardioSuccessMsg && (
                <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  {cardioSuccessMsg}
                </p>
              )}

              <button
                type="button"
                onClick={handleLogCardio}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save 5 KM Completion</span>
              </button>
            </div>

            {/* Previous Cardio Logs List */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-slate-900 uppercase">
                Completed 5 KM Sessions ({state.cardioLogs.length})
              </span>

              {state.cardioLogs.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No cardio sessions logged yet. Complete your first 5 KM walk or run today!</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {state.cardioLogs.map((log, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-700 font-mono">{log.type}</span>
                        <span className="text-[10px] font-mono text-slate-400">{log.date}</span>
                      </div>
                      <p className="text-xs text-slate-900 font-bold">
                        Day {log.dayNumber} • {log.durationMinutes} Minutes
                      </p>
                      {log.notes && (
                        <p className="text-[11px] text-slate-500 italic leading-snug">"{log.notes}"</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 3: WEEKLY CALENDAR & SCHEDULE */}
      {/* ---------------------------------------------------- */}
      {activeTab === "calendar" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-red-600 uppercase">
                26-Week Progressive Blueprint
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
                180 Day Weekly Schedule
              </h2>
              <p className="text-xs text-slate-500 max-w-xl font-medium mt-1">
                Every 7-day cycle features progressive bodyweight training, 2 scheduled 5 KM cardio sessions, and active joint recovery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
              {[
                { day: "Day 1", focus: "Full Body Strength", type: "Bodyweight", color: "bg-red-50 border-red-200 text-red-900" },
                { day: "Day 2", focus: "Core & Posture", type: "Isometrics", color: "bg-purple-50 border-purple-200 text-purple-900" },
                { day: "Day 3", focus: "5 KM Run or Walk", type: "Cardio", color: "bg-blue-50 border-blue-200 text-blue-900" },
                { day: "Day 4", focus: "Upper Body Push", type: "Calisthenics", color: "bg-amber-50 border-amber-200 text-amber-900" },
                { day: "Day 5", focus: "Lower Body Stamina", type: "Legs & Glutes", color: "bg-rose-50 border-rose-200 text-rose-900" },
                { day: "Day 6", focus: "5 KM Run or Walk", type: "Cardio", color: "bg-blue-50 border-blue-200 text-blue-900" },
                { day: "Day 7", focus: "Active Recovery", type: "Joint Reset", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${item.color} space-y-2 flex flex-col justify-between`}>
                  <div>
                    <span className="text-[10px] font-mono font-extrabold uppercase block">{item.day}</span>
                    <h4 className="text-xs font-black mt-1">{item.focus}</h4>
                  </div>
                  <span className="text-[9px] font-mono uppercase font-bold opacity-80">{item.type}</span>
                </div>
              ))}
            </div>

            {/* Quick 180-Day Grid Navigator */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 uppercase">
                  Quick Day Jumper (1 to 180)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Click any day to inspect</span>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-20 gap-1.5 max-h-64 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-200">
                {Array.from({ length: 180 }, (_, i) => i + 1).map((d) => {
                  const isDone = state.completedDays.includes(d);
                  const isSelected = selectedDayNumber === d;
                  return (
                    <button
                      key={d}
                      onClick={() => {
                        setSelectedDayNumber(d);
                        setActiveTab("workout");
                      }}
                      className={`h-8 rounded-lg text-[10px] font-mono font-bold transition flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 text-white ring-2 ring-red-500"
                          : isDone
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200/60"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 4: LIFESTYLE & 7:30 PM TARGET */}
      {/* ---------------------------------------------------- */}
      {activeTab === "lifestyle" && (
        <div className="space-y-6">
          
          {/* Dedicated Interactive Daily Checklist */}
          <DailyLifestyleChecklist
            dateStr={todayDateStr}
            data={todayLifestyle}
            onToggle={handleToggleLifestyle}
          />

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-amber-600 uppercase">
                Lifestyle Discipline Desk
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
                The Science of the 7:30 PM Cut-off & Daily Protocols
              </h2>
              <p className="text-xs text-slate-500 max-w-xl font-medium mt-1">
                Exercise alone is not enough. Locking in simple, actionable daily lifestyle routines accelerates metabolic recovery, digestion, and fat oxidation.
              </p>
            </div>

            {/* In-Depth Educational Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Why Stop Eating by 7:30 PM?</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Digesting large meals requires significant blood flow and elevates core body temperature. By cutting off calories at 7:30 PM, your digestive system rests before sleep, allowing the pituitary gland to release maximum Human Growth Hormone (HGH) for cellular repair and fat mobilization.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase">
                  <Footprints className="w-4 h-4 text-emerald-600" />
                  <span>The 15-Minute Post-Meal Thermal Walk</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Walking lightly immediately after dinner activates GLUT-4 glucose transporters in muscle tissue independently of insulin. This prevents sharp blood sugar spikes, clears post-dinner lethargy, and naturally burns an additional 80-120 kcal per day.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase">
                  <Droplets className="w-4 h-4 text-cyan-600" />
                  <span>3 Liters Clean Hydration Protocol</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Muscles are approximately 75% water. Proper daily hydration lubricates articular cartilage, improves electrolyte conduction for bodyweight strength sets, and enhances kidney filtration of metabolic waste.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase">
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span>7 to 8 Hours Dark Room Recovery</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Central nervous system (CNS) fatigue from daily push-ups and cardio accumulates without deep sleep. Keep your room dark, minimize blue light 60 minutes prior to bed, and let sleep handle the physical transformation.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 5: NUTRITION & FOOD MATRIX */}
      {/* ---------------------------------------------------- */}
      {activeTab === "nutrition" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-8">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-600 uppercase">
                Fuel & Recovery Nutrition
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
                Home Challenge Nutrition Guide
              </h2>
              <p className="text-xs text-slate-500 max-w-xl font-medium mt-1">
                Prioritize nutrient-dense whole foods and adequate protein rather than crash diets.
              </p>
            </div>

            {/* Whole Foods Priority Showcase */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                What to Prioritize (Whole Food Staples):
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: "Eggs & Egg Whites", role: "Complete Amino Acids", icon: "🥚" },
                  { name: "Chicken & Turkey", role: "Lean Protein", icon: "🍗" },
                  { name: "Fish & Seafood", role: "Omega-3s & Protein", icon: "🐟" },
                  { name: "Beans & Lentils", role: "Fiber & Plant Protein", icon: "🫘" },
                  { name: "Rice, Yam & Potatoes", role: "Clean Carbohydrates", icon: "🍠" },
                  { name: "Plantain & Oats", role: "Complex Glycogen", icon: "🥣" },
                  { name: "Green Vegetables", role: "Micronutrients & Fiber", icon: "🥦" },
                  { name: "Fresh Fruits & Water", role: "Hydration & Antioxidants", icon: "🍎" }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-xl">{item.icon}</span>
                    <p className="text-xs font-bold text-slate-900">{item.name}</p>
                    <span className="text-[10px] font-mono text-slate-500 block">{item.role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Goal-Specific Nutrition Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-black uppercase text-red-600 font-mono">Fat Loss Protocol</span>
                <h4 className="text-sm font-bold text-slate-900">Moderate Deficit + High Protein</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Focus on high-volume fibrous vegetables, lean poultry/fish, and cut all liquid sugars. Stop eating at 7:30 PM.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-black uppercase text-blue-600 font-mono">Muscle Building Protocol</span>
                <h4 className="text-sm font-bold text-slate-900">Slight Surplus + Nutrient Density</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Add clean energy sources like oats, yam, plantain, and whole eggs. Ensure at least 1.6g protein per kg of bodyweight.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-black uppercase text-emerald-600 font-mono">General Fitness Protocol</span>
                <h4 className="text-sm font-bold text-slate-900">Balanced Home Plate Ratio</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Plate breakdown: 1/2 vegetables and salad, 1/4 quality protein, 1/4 complex carbohydrate. Drink 3L water daily.
                </p>
              </div>
            </div>

            {/* Things to Limit / Avoid Section */}
            <div className="bg-red-50/60 border border-red-200 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-black uppercase text-red-900 tracking-tight">
                  Things To Limit (General Lifestyle Guidance)
                </h3>
              </div>
              <p className="text-xs text-red-800/90 leading-relaxed">
                Rather than extreme medical restrictions, we recommend systematically minimizing these items to maximize your 180-day transformation:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-700">
                {[
                  "Excessive sugary sodas, juices & energy drinks",
                  "Excessive alcohol intake",
                  "Ultra-processed snack foods & trans fats",
                  "Frequent deep-fried fast foods",
                  "Excessive sweets & refined pastries",
                  "Constant mindless grazing / snacking",
                  "Very large, heavy meals late at night",
                  "Extremely restrictive or unsustainable crash diets"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-red-100">
                    <X className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span className="font-medium text-xs text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 6: PROGRESS, MILESTONES & WEIGH-IN */}
      {/* ---------------------------------------------------- */}
      {activeTab === "progress" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-8">
            <div>
              <span className="text-xs font-mono font-bold text-amber-600 uppercase">
                Trajectory & Badges
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
                Milestone Achievements & Checkpoints
              </h2>
            </div>

            {/* Badges Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-900">Challenge Milestone Badges:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {HOME_MILESTONE_BADGES.map((b) => {
                  const isUnlocked = state.achievements.includes(b.id);
                  return (
                    <div 
                      key={b.id} 
                      className={`p-4 rounded-2xl border space-y-2 text-center transition ${
                        isUnlocked 
                          ? "bg-amber-50/60 border-amber-300 text-slate-900 shadow-xs" 
                          : "bg-slate-50 border-slate-200 text-slate-400 opacity-60"
                      }`}
                    >
                      <div className={`h-10 w-10 mx-auto rounded-xl flex items-center justify-center font-bold ${
                        isUnlocked ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-400"
                      }`}>
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black">{b.name}</h4>
                        <span className="text-[10px] font-mono">{b.requirement}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weigh-in Tracker */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-xs font-black uppercase text-slate-900">Log Current Bodyweight</h3>
                  <span className="text-[11px] text-slate-500">Record a weekly weigh-in to monitor body composition changes.</span>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="number"
                    step="0.1"
                    value={newWeightInput}
                    onChange={(e) => setNewWeightInput(e.target.value)}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold w-28 focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="Weight (kg)"
                  />
                  <button
                    onClick={handleAddWeightLog}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Log Weight
                  </button>
                </div>
              </div>

              {state.weightLogs.length > 0 && (
                <div className="space-y-1 pt-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Recent Weigh-Ins:</span>
                  <div className="flex flex-wrap gap-2">
                    {state.weightLogs.slice(0, 8).map((log, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800">
                        {log.date}: <strong className="text-red-600">{log.weight} kg</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Day 180 Final Completion Congratulatory Screen (Unlocks at Day 180 or 100% completion) */}
            {totalCompletedWorkouts >= 180 && (
              <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-slate-900 shadow-xl space-y-4 text-center">
                <Trophy className="w-16 h-16 mx-auto text-white drop-shadow-md" />
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                  180 Day Transformation Conquered!
                </h3>
                <p className="text-sm font-medium text-amber-950 max-w-xl mx-auto leading-relaxed">
                  Congratulations! You have completed all 180 days of the Sovereign Home Workout Challenge. You have built enduring strength, cardiovascular stamina, and unbreakable daily lifestyle habits.
                </p>
                <div className="inline-flex gap-4 bg-white/90 p-4 rounded-2xl font-mono text-xs font-black">
                  <span>180 Workouts</span>
                  <span>•</span>
                  <span>{totalCompletedCardio * 5} KM Logged</span>
                  <span>•</span>
                  <span>{state.streaks.longestStreak} Day Peak Streak</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 7: ADMIN GIF & EXERCISE DESK (ADMIN ONLY) */}
      {/* ---------------------------------------------------- */}
      {activeTab === "admin" && isAdmin && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-red-600 uppercase">Administrator Operations</span>
                <h2 className="text-xl font-black text-slate-900 uppercase">
                  Home Workout GIF & Exercise Asset Manager
                </h2>
              </div>
            </div>

            <form onSubmit={handleAdminSaveMedia} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Target Home Movement</label>
                  <select
                    value={adminSelectedExerciseKey}
                    onChange={(e) => setAdminSelectedExerciseKey(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:ring-2 focus:ring-red-500 outline-none cursor-pointer"
                  >
                    {Object.values(HOME_EXERCISES_CATALOG).map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name} ({ex.targetMuscles.join(", ")})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Media Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["image", "video"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setAdminMediaType(t)}
                        className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                          adminMediaType === t 
                            ? "bg-slate-900 text-white border-slate-900" 
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {t === "image" ? "Animated GIF / Image" : "MP4 Video"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Media URL (Giphy / Cloud Storage / CDN)</label>
                <input
                  type="url"
                  value={adminMediaUrl}
                  onChange={(e) => setAdminMediaUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono font-medium focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="https://media.giphy.com/media/.../giphy.gif"
                />
              </div>

              {adminUploadStatus && (
                <p className="text-xs font-bold text-blue-700 bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                  {adminUploadStatus}
                </p>
              )}

              <button
                type="submit"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>Save & Broadcast GIF Site-Wide</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
