import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { 
  signOut, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs, query, where, deleteDoc, onSnapshot } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { auth, db, isMockFirebase, handleFirestoreError, OperationType } from "../lib/firebase";
import { supabase } from "../utils/supabase/client";
import { AssetManifestService } from "../services/AssetManifestService";
import { 
  UserProfile, 
  SavedWorkout, 
  ActivityLog, 
  WeightGoalLog, 
  PaystackTransaction,
  ChatMessage,
  CommunityPost,
  Testimonial,
  CustomProgram,
  PopupTestimonial,
  VitalsLog,
  CalibrationGoals,
  WorkoutLibraryFilters,
  ChallengeWorkout,
  ChallengeItem,
  ProgramProgressItem
} from "../types";
import { calculateReadinessScore } from "../utils/readiness";
import { EXERCISES, Exercise } from "../data/exercises";
import { PremiumChallenge, FLAGSHIP_CHALLENGES, getChallengeWorkouts } from "../data/challenges";
import { isExerciseMatch } from "../utils/exerciseMatching";
import { fetchAllExerciseMediaFromDatabase } from "../utils/mediaStorageService";
import { samplePopupTestimonials } from "../data/sampleTestimonials";
import { queueWelcomeEmail, queueWorkoutSummaryEmail, queueBellyFatShredReminderEmail } from "../lib/mailTriggers";

export const DEFAULT_PROGRAM_PROGRESS: Record<string, ProgramProgressItem> = {
  "90_day_immortal": {
    programId: "90_day_immortal",
    programTitle: "90 Days Immortal Challenge",
    category: "Elite Transformation",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
    viewName: "challenges",
    enrolled: true,
    enrolledAt: new Date().toISOString(),
    currentDay: 1,
    currentWeek: 1,
    currentWorkoutIndex: 0,
    lastStoppedWorkoutName: "Day 1: Upper Body Power Split",
    lastStoppedWorkoutId: "90day-d1-ex1",
    lastStoppedAt: new Date().toISOString(),
    completedWorkoutIds: [],
    totalWorkouts: 90,
    progressPercent: 0
  },
  "belly_fat_shred": {
    programId: "belly_fat_shred",
    programTitle: "Belly Fat Shred Transformation",
    category: "Fat Loss & Midsection",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    viewName: "belly-fat-shred",
    enrolled: true,
    enrolledAt: new Date().toISOString(),
    currentDay: 1,
    currentWeek: 1,
    currentWorkoutIndex: 0,
    lastStoppedWorkoutName: "Week 1 Day 1: HIIT Intervals & Midsection Stability",
    lastStoppedWorkoutId: "bf-w1-d1-ex1",
    lastStoppedAt: new Date().toISOString(),
    completedWorkoutIds: [],
    totalWorkouts: 20,
    progressPercent: 0
  },
  "lifestyle_academy": {
    programId: "lifestyle_academy",
    programTitle: "Lifestyle Fitness Academy",
    category: "Athletic Longevity & Posture",
    imageUrl: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80",
    viewName: "lifestyle-academy",
    enrolled: true,
    enrolledAt: new Date().toISOString(),
    currentDay: 1,
    currentWeek: 1,
    currentWorkoutIndex: 0,
    lastStoppedWorkoutName: "Day 1: Posterior Chain & Back Restoration",
    lastStoppedWorkoutId: "lfa-d1-ex1",
    lastStoppedAt: new Date().toISOString(),
    completedWorkoutIds: [],
    totalWorkouts: 12,
    progressPercent: 0
  },
  "women_confidence": {
    programId: "women_confidence",
    programTitle: "Women Confidence Program",
    category: "180-Day Transformation & Strength",
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
    viewName: "women-confidence",
    enrolled: true,
    enrolledAt: new Date().toISOString(),
    currentDay: 1,
    currentWeek: 1,
    currentWorkoutIndex: 0,
    lastStoppedWorkoutName: "Day 1: Glute & Posterior Kinetic Awakening",
    lastStoppedWorkoutId: "wc-d1-ex1",
    lastStoppedAt: new Date().toISOString(),
    completedWorkoutIds: [],
    totalWorkouts: 180,
    progressPercent: 0
  }
};

interface AppContextType {
  user: UserProfile | null;
  loading: boolean;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  savedWorkouts: string[];
  activityLogs: ActivityLog[];
  weightLogs: WeightGoalLog[];
  transactions: PaystackTransaction[];
  chatMessages: ChatMessage[];
  exercises: Exercise[];
  isBlockedUser: boolean;
  authDatabaseError: string | null;
  setAuthDatabaseError: (err: string | null) => void;
  
  // Custom interactive models
  communityPosts: CommunityPost[];
  testimonials: Testimonial[];
  
  // Auth Functions
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  signUpEmail: (email: string, pass: string, name: string, remember?: boolean) => Promise<void>;
  loginEmail: (email: string, pass: string, remember?: boolean) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Profile Update Functions
  updateProfileDetails: (details: { weight?: number; height?: number; gender?: string; fitnessGoals?: string }) => Promise<void>;
  completeOnboarding: (onboardingData: Partial<UserProfile>) => Promise<void>;
  
  // Workout Interactions
  toggleSaveWorkout: (exerciseId: string) => Promise<void>;
  logWorkoutCompletion: (exerciseId: string, reps: number, weight: number, notes?: string) => Promise<void>;
  
  // Progress
  addWeightLogAction: (weight: number, bodyFat?: number) => Promise<void>;
  updateWaterIntake: (amountMl: number) => Promise<void>;
  
  // Subscriptions & Payments
  upgradeWithPaystack: (reference: string, plan?: "monthly" | "yearly" | "multi") => Promise<UserProfile | void>;
  cancelSubscription: () => Promise<void>;
  
  // AI Coach Chat
  sendCoachMessage: (message: string) => Promise<void>;
  clearCoachChat: () => void;
  
  // Community Forum & Testimonials
  addCommunityPost: (content: string, category: "Progress Picture" | "Workout Result" | "Transformation Story" | "Achievement" | "General Discussion" | "Challenge", imageUrl?: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  commentOnPost: (postId: string, commentContent: string) => Promise<void>;
  reportPost: (postId: string) => Promise<void>;
  moderatePost: (postId: string, action: "approve" | "delete") => Promise<void>;
  submitTestimonial: (category: "Weight Loss" | "Muscle Building" | "General Journey" | "Transformation Story", rating: number, content: string, beforeImageUrl?: string, afterImageUrl?: string) => Promise<void>;
  approveTestimonial: (testimonialId: string) => Promise<void>;
  deleteTestimonial: (testimonialId: string) => Promise<void>;

  // Custom Programs Context Fields
  customPrograms: CustomProgram[];
  saveCustomProgram: (program: Omit<CustomProgram, "userId" | "id" | "createdAt">) => Promise<void>;
  updateCustomProgram: (program: CustomProgram) => Promise<void>;
  deleteCustomProgram: (id: string) => Promise<void>;
  
  // Testimonial Popup & Management
  popupTestimonials: PopupTestimonial[];
  addPopupTestimonial: (t: Omit<PopupTestimonial, "id" | "created_at">) => Promise<void>;
  updatePopupTestimonial: (id: string, t: Partial<PopupTestimonial>) => Promise<void>;
  deletePopupTestimonial: (id: string) => Promise<void>;
  
  // Admin Workout & Media Operations
  adminTogglePremium: (exerciseId: string) => void;
  adminUpdateUserTier: (uid: string, level: "free" | "premium", tier: "monthly" | "yearly" | "none") => void;
  adminModifySubscription: (uid: string, action: "activate" | "extend" | "suspend" | "cancel") => void;
  allSystemUsers: UserProfile[];
  uploadExerciseMedia: (exerciseId: string, mediaUrl: string | null, mediaType?: "image" | "video") => Promise<void>;
  addExerciseToLibrary: (workout: Exercise) => Promise<void>;
  editExercise: (exerciseId: string, updates: Partial<Exercise>) => Promise<boolean>;
  addWorkout: (workout: Partial<Exercise>) => Promise<Exercise>;
  deleteWorkout: (exerciseId: string) => Promise<boolean>;

  // Challenges Management
  customChallenges: PremiumChallenge[];
  allChallenges: PremiumChallenge[];
  addCustomChallenge: (challenge: Partial<PremiumChallenge>) => Promise<PremiumChallenge>;
  updateCustomChallenge: (challengeId: string, updates: Partial<PremiumChallenge>) => Promise<boolean>;
  deleteCustomChallenge: (challengeId: string) => Promise<boolean>;
  
  // Weekly Reports
  weeklyReports: any[];
  loadWeeklyReports: () => Promise<void>;
  triggerWeeklyReportGeneration: () => Promise<void>;

  // Vitals Logs & Profile uploads
  vitalsLogs: VitalsLog[];
  calibrationGoals: CalibrationGoals;
  updateCalibrationGoalsAction: (goals: Partial<CalibrationGoals>) => Promise<void>;
  addVitalsLogAction: (
    vitalsDataOrRhr: number | {
      sleepDuration: number;
      hydrationGlasses?: number;
      restingHeartRate?: number;
      energyLevel?: number;
      notes?: string;
      date?: string;
    },
    sleepDuration?: number,
    date?: string
  ) => Promise<void>;
  deleteVitalsLogAction: (logId: string) => Promise<void>;
  updateProfilePicture: (photoURL: string) => Promise<void>;

  // Program Progress & Resume Tracking
  programProgress: Record<string, ProgramProgressItem>;
  enrollProgram: (programId: string, details?: Partial<ProgramProgressItem>) => Promise<void>;
  updateProgramProgress: (programId: string, updates: Partial<ProgramProgressItem>) => Promise<void>;
  recordProgramStopPoint: (programId: string, workoutName: string, workoutId?: string, day?: number, week?: number, extra?: Partial<ProgramProgressItem>) => Promise<void>;
  markProgramWorkoutComplete: (programId: string, workoutId: string, nextWorkoutNameOrDay?: string | number, day?: number, week?: number) => Promise<void>;
  resumeProgram: (programId: string) => void;
  getActiveEnrolledPrograms: () => ProgramProgressItem[];

  // Navigation / Switchboard State
  currentView: string;
  setView: (view: string) => void;

  // Workout Library Filters & Centralized Search State
  workoutFilters: WorkoutLibraryFilters;
  setWorkoutFilters: (filters: Partial<WorkoutLibraryFilters>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`localStorage Quota Exceeded for key "${key}". Gracefully falling back without crashing.`, error);
    try {
      // Clear a potentially huge element that is not absolutely critical to active user profile session
      if (key !== "fit_exercises") {
        localStorage.removeItem("fit_exercises");
        localStorage.setItem(key, value);
      }
    } catch (retryError) {
      console.error("Critical: Retrying localStorage setItem after freeing space still failed:", retryError);
    }
  }
};

const ADMIN_EMAILS = [
  "alexfitnesshub@gmail.com",
  "muzikworld08@gmail.com"
];

export const isEmailAdmin = (email?: string) => {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return ADMIN_EMAILS.includes(clean);
};

export const checkIsUserPremium = (u?: UserProfile | null): boolean => {
  if (!u) return false;
  if (u.role === "admin" || (u.email && isEmailAdmin(u.email))) return true;
  const isPremStatus = 
    u.subscriptionStatus === "premium" || 
    (u.subscriptionStatus as string) === "active" || 
    u.subscription === "premium" || 
    (u.subscription as string) === "active" || 
    u.isPremium === true || 
    u.premiumAccess === true || 
    (u as any).paymentStatus === "paid";
  
  if (!isPremStatus) return false;
  
  // If subscriptionExpiry is present, ensure it hasn't expired
  if (u.subscriptionExpiry) {
    const expiryDate = new Date(u.subscriptionExpiry);
    if (!isNaN(expiryDate.getTime()) && expiryDate < new Date()) {
      return false; // Subscription has reached end of term
    }
  }
  return true;
};

export const normalizeExerciseId = (id: string): string => {
  if (!id) return id;
  const cleaned = id.toLowerCase().trim();
  if (!cleaned.startsWith("exercise-")) return id;
  
  const prefixes = [
    "chest-", "back-", "shoulders-", "legs-", "biceps-", "triceps-", "forearms-", "abs-", "core-", "glutes-", "calves-",
    "cardio-", "hiit-", "calisthenics-", "home-workouts-", "gym-workouts-", "mobility-", "stretching-", "recovery-",
    "warm-up-", "cool-down-", "yoga-", "pilates-", "functional-training-", "military-style-fitness-"
  ];
  
  let stripped = cleaned.slice("exercise-".length);
  for (const prefix of prefixes) {
    if (stripped.startsWith(prefix)) {
      const remainder = stripped.slice(prefix.length);
      if (remainder) {
        stripped = remainder;
      }
    }
  }
  
  return `exercise-${stripped}`;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setView] = useState<string>(() => {
    const pathname = window.location.pathname;
    const pathToView: Record<string, string> = {
      "/": "home",
      "/payment/success": "payment-success",
      "/premium/library": "library",
      "/premium/workout-generator": "workout-generator",
      "/premium/workout-videos": "workout-videos",
      "/premium/saved-exercises": "saved-exercises",
      "/premium/coach": "coach",
      "/premium/nutrition": "nutrition",
      "/premium/daily-plan": "daily-plan",
      "/premium/challenges": "challenges",
      "/premium/community": "community",
      "/premium/weekly-reports": "weekly-reports",
      "/premium/daily-habit-tracker": "daily-habit-tracker",
      "/premium/daily-calibration-desk": "daily-calibration-desk",
      "/premium/handbook": "handbook",
      "/premium/weight-trajectory": "weight-trajectory",
      "/premium/dashboard": "dashboard",
      "/premium/belly-fat-shred": "belly-fat-shred",
      "/lifestyle-academy": "lifestyle-academy",
    };
    if (pathToView[pathname]) {
      return pathToView[pathname];
    }
    try {
      const activeUid = localStorage.getItem("fit_active_uid");
      if (activeUid) {
        const cachedUser = localStorage.getItem(`fit_user_${activeUid}`);
        if (cachedUser) {
          const parsed = JSON.parse(cachedUser);
          if (parsed && parsed.onboarded !== false) {
            return "daily-plan";
          }
        }
      }
    } catch (e) {}
    return "home";
  });

  const [userState, setUserState] = useState<UserProfile | null>(() => {
    try {
      const activeUid = localStorage.getItem("fit_active_uid");
      if (activeUid) {
        const cachedUser = localStorage.getItem(`fit_user_${activeUid}`);
        if (cachedUser) {
          const parsed = JSON.parse(cachedUser);
          if (parsed && isEmailAdmin(parsed.email)) {
            return {
              ...parsed,
              role: "admin",
              subscriptionStatus: "premium",
              subscriptionTier: "yearly"
            };
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error parsing cached user profile on initial load:", e);
    }
    return null;
  });

  const setUser = (profileOrFn: UserProfile | null | ((prev: UserProfile | null) => UserProfile | null)) => {
    const applyAdminOverride = (profile: UserProfile | null): UserProfile | null => {
      if (!profile) return null;
      const isAdmin = isEmailAdmin(profile.email);
      const isPremium = isAdmin || checkIsUserPremium(profile);
      return {
        ...profile,
        role: isAdmin ? "admin" : (profile.role === "admin" && !isAdmin ? "user" : (profile.role || "user")),
        subscription: isPremium ? "premium" : "free",
        subscriptionStatus: isPremium ? "premium" : "free",
        isPremium: isPremium,
        premiumAccess: isPremium,
        accountType: isPremium ? (isAdmin ? "Admin Athlete" : "Premium Athlete") : (profile.accountType || "Free Athlete"),
        badge: isPremium ? (isAdmin ? "Admin Athlete" : "Premium Athlete") : (profile.badge || "Free Athlete"),
        subscriptionTier: isAdmin 
          ? "yearly" 
          : (profile.subscriptionTier === "none" || !profile.subscriptionTier ? (isPremium ? "monthly" : "none") : profile.subscriptionTier),
        subscriptionPlan: isPremium ? (profile.subscriptionPlan && profile.subscriptionPlan !== "none" ? profile.subscriptionPlan : "monthly") : "none"
      };
    };

    if (typeof profileOrFn === "function") {
      setUserState(prev => {
        const next = applyAdminOverride(profileOrFn(prev));
        if (next) {
          localStorage.setItem("fit_active_uid", next.uid);
        } else {
          localStorage.removeItem("fit_active_uid");
        }
        return next;
      });
    } else {
      const next = applyAdminOverride(profileOrFn);
      if (next) {
        localStorage.setItem("fit_active_uid", next.uid);
      } else {
        localStorage.removeItem("fit_active_uid");
      }
      setUserState(next);
    }
  };

  const user = userState;
  const [loading, setLoading] = useState(() => {
    try {
      const activeUid = localStorage.getItem("fit_active_uid");
      if (activeUid && localStorage.getItem(`fit_user_${activeUid}`)) {
        return false;
      }
    } catch (e) {}
    return true;
  });
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const setTheme = (t: "light" | "dark") => {
    // Completely locked to light theme
  };
  const [savedWorkouts, setSavedWorkouts] = useState<string[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [weightLogs, setWeightLogs] = useState<WeightGoalLog[]>([]);
  const [vitalsLogs, setVitalsLogs] = useState<VitalsLog[]>([]);
  const [calibrationGoals, setCalibrationGoals] = useState<CalibrationGoals>(() => {
    const defaults: CalibrationGoals = {
      userId: "guest",
      dailyHydrationGoal: 10,
      dailySleepGoal: 8.0,
      targetReadinessScore: 85,
      targetRestingHeartRate: 60
    };
    try {
      const activeUid = localStorage.getItem("fit_active_uid");
      const key = activeUid ? `fit_calibration_goals_${activeUid}` : "fit_calibration_goals_guest";
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          return { ...defaults, ...parsed };
        }
      }
    } catch (e) {}
    return defaults;
  });
  const [transactions, setTransactions] = useState<PaystackTransaction[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [exercises, setExercisesState] = useState<Exercise[]>(EXERCISES);
  const [customPrograms, setCustomPrograms] = useState<CustomProgram[]>([]);
  const [isBlockedUser, setIsBlockedUser] = useState(false);
  const [authDatabaseError, setAuthDatabaseError] = useState<string | null>(null);

  const [workoutFilters, setWorkoutFiltersState] = useState<WorkoutLibraryFilters>(() => {
    const defaults = {
      searchQuery: "",
      selectedCategory: "All",
      selectedDifficulty: "All",
      selectedMuscleGroup: "All",
      selectedEquipment: "All",
      selectedExerciseType: "All",
      selectedTrainingGoal: "All",
      activeBrowseTab: "bodyparts" as const
    };
    try {
      const activeUid = localStorage.getItem("fit_active_uid");
      const key = activeUid ? `fit_workout_filters_${activeUid}` : "fit_workout_filters_guest";
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          return {
            searchQuery: typeof parsed.searchQuery === "string" ? parsed.searchQuery : defaults.searchQuery,
            selectedCategory: typeof parsed.selectedCategory === "string" ? parsed.selectedCategory : defaults.selectedCategory,
            selectedDifficulty: typeof parsed.selectedDifficulty === "string" ? parsed.selectedDifficulty : defaults.selectedDifficulty,
            selectedMuscleGroup: typeof parsed.selectedMuscleGroup === "string" ? parsed.selectedMuscleGroup : defaults.selectedMuscleGroup,
            selectedEquipment: typeof parsed.selectedEquipment === "string" ? parsed.selectedEquipment : defaults.selectedEquipment,
            selectedExerciseType: typeof parsed.selectedExerciseType === "string" ? parsed.selectedExerciseType : defaults.selectedExerciseType,
            selectedTrainingGoal: typeof parsed.selectedTrainingGoal === "string" ? parsed.selectedTrainingGoal : defaults.selectedTrainingGoal,
            activeBrowseTab: (parsed.activeBrowseTab === "bodyparts" || parsed.activeBrowseTab === "cardio" || parsed.activeBrowseTab === "mobility" || parsed.activeBrowseTab === "programs" || parsed.activeBrowseTab === "all") ? parsed.activeBrowseTab : defaults.activeBrowseTab
          };
        }
      }
    } catch (e) {}
    return defaults;
  });

  // Admin view datasets (fallback analytics)
  const [allSystemUsers, setAllSystemUsers] = useState<UserProfile[]>([]);
  const [weeklyReports, setWeeklyReports] = useState<any[]>([]);

  // Community & Testimonial states
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [popupTestimonials, setPopupTestimonials] = useState<PopupTestimonial[]>([]);

  // Challenges state (7 Flagship + Admin Custom Created)
  const [customChallenges, setCustomChallenges] = useState<PremiumChallenge[]>(() => {
    try {
      const stored = localStorage.getItem("fit_custom_challenges");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  // Program Progress & Resume Tracking state
  const [programProgress, setProgramProgressState] = useState<Record<string, ProgramProgressItem>>(() => {
    try {
      const activeUid = localStorage.getItem("fit_active_uid");
      const key = activeUid ? `fit_program_progress_${activeUid}` : "fit_program_progress_guest";
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          return { ...DEFAULT_PROGRAM_PROGRESS, ...parsed };
        }
      }
    } catch (e) {}
    return DEFAULT_PROGRAM_PROGRESS;
  });

  const allChallenges = React.useMemo(() => {
    const map = new Map<string, PremiumChallenge>();
    FLAGSHIP_CHALLENGES.forEach(fc => map.set(fc.id, fc));
    customChallenges.forEach(cc => {
      if (cc && cc.id) {
        map.set(cc.id, cc);
      }
    });
    return Array.from(map.values());
  }, [customChallenges]);


  // Apply visual theme to document body
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
    try {
      localStorage.setItem("fit_theme", "light");
    } catch (e) {}
  }, []);

  // Handle local state tracking for offline or unauthenticated sessions
  useEffect(() => {
    const storedExercises = localStorage.getItem("fit_exercises");
    if (storedExercises) {
      try {
        const parsed = JSON.parse(storedExercises) as Exercise[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If stored exercises is stale (e.g. fewer items than authoritative EXERCISES), merge cleanly
          const map = new Map<string, Exercise>();
          EXERCISES.forEach(e => map.set(e.id, e));
          
          // Preserve any custom user-added exercises (gen_ or cust_)
          parsed.forEach(p => {
            if (p.id.startsWith("gen_") || p.id.startsWith("cust_")) {
              map.set(p.id, p);
            } else if (map.has(p.id)) {
              // Apply any locally saved custom media/sets/reps overrides
              const existing = map.get(p.id)!;
              map.set(p.id, {
                ...existing,
                customMediaUrl: p.customMediaUrl || existing.customMediaUrl,
                customMediaType: p.customMediaType || existing.customMediaType,
                recommendedSets: p.recommendedSets || existing.recommendedSets,
                recommendedReps: p.recommendedReps || existing.recommendedReps
              });
            }
          });

          const merged = Array.from(map.values());
          setExercisesState(merged);
          localStorage.setItem("fit_exercises", JSON.stringify(merged));
          return;
        }
      } catch (e) {}
    }
    localStorage.setItem("fit_exercises", JSON.stringify(EXERCISES));
  }, []);

  // Fetch and sync custom exercise overrides from Firestore and local Express server JSON file
  useEffect(() => {
    const fetchCustomDatabaseOverrides = async () => {
      try {
        // 1. Fetch from Local Express Server JSON file
        const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
        const apiRes = await fetch("/api/exercises/custom-media", {
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        const apiData = await apiRes.json();
        const serverOverrides = apiData.success ? apiData.overrides : {};
        
        // 2. Fetch persistent exercise media records from Supabase DB and Cloud Firestore
        const persistentMediaOverrides = await fetchAllExerciseMediaFromDatabase();

        let firestoreOverrides: Record<string, { customMediaUrl?: string; customMediaType?: "image" | "video" }> = {};
        if (!isMockFirebase) {
          try {
            const snap = await getDocs(collection(db, "exercises"));
            snap.docs.forEach(d => {
              const data = d.data();
              if (data.customMediaUrl) {
                firestoreOverrides[d.id] = {
                  customMediaUrl: data.customMediaUrl,
                  customMediaType: data.customMediaType || "image"
                };
              }
            });
          } catch (fErr) {
            console.warn("Firestore custom exercise overrides fetch failed, relying on server file:", fErr);
          }
        }

        // 3. Fetch dynamically generated exercises
        let fetchedGeneratedExercises: Exercise[] = [];
        if (!isMockFirebase) {
          try {
            const genSnap = await getDocs(collection(db, "generated_exercises"));
            genSnap.docs.forEach(d => {
              fetchedGeneratedExercises.push(d.data() as Exercise);
            });
          } catch (gErr) {
            console.warn("Firestore dynamically generated exercises fetch failed:", gErr);
          }
        }

        // Merge sources (Persistent Supabase/Firestore DB media overrides take ultimate priority)
        const mergedOverrides = { ...serverOverrides, ...firestoreOverrides, ...persistentMediaOverrides };

        setExercisesState(prev => {
          const baseList = [...EXERCISES];
          const mapped = baseList.map(ex => {
            let override = mergedOverrides[ex.id];
            if (!override) {
              const matchedKey = Object.keys(mergedOverrides).find(k => 
                isExerciseMatch(k, ex.id) || isExerciseMatch(k, ex.name)
              );
              if (matchedKey) {
                override = mergedOverrides[matchedKey];
              }
            }
            if (override) {
              return {
                ...ex,
                customMediaUrl: override.customMediaUrl ?? ex.customMediaUrl,
                customMediaType: override.customMediaType ?? ex.customMediaType
              };
            }
            return ex;
          });

          // Avoid duplicates
          const filteredGenerated = fetchedGeneratedExercises.filter(
            g => !mapped.some(m => m.name.toLowerCase() === g.name.toLowerCase())
          );

          // Get local storage generated exercises
          let localExercisesList: Exercise[] = [];
          const storedEx = localStorage.getItem("fit_exercises");
          if (storedEx) {
            try {
              const parsed = JSON.parse(storedEx) as Exercise[];
              localExercisesList = parsed.filter(p => p.id.startsWith("gen_") || p.id.startsWith("cust_"));
            } catch {}
          }

          const combinedGenerated = [...filteredGenerated];
          localExercisesList.forEach(le => {
            if (!combinedGenerated.some(cg => cg.name.toLowerCase() === le.name.toLowerCase()) && 
                !mapped.some(m => m.name.toLowerCase() === le.name.toLowerCase())) {
              combinedGenerated.push(le);
            }
          });

          return [...combinedGenerated, ...mapped];
        });

      } catch (err) {
        console.warn("Error loading customized exercises overrides (falling back):", err);
      }
    };

    fetchCustomDatabaseOverrides();
  }, [isMockFirebase]);

  // Real-time listener for Firestore custom exercise overrides & challenges
  useEffect(() => {
    // Initial fetch for challenges from server API
    const fetchServerChallenges = async () => {
      try {
        const res = await fetch("/api/challenges");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.challenges) && data.challenges.length > 0) {
            setCustomChallenges(data.challenges);
            safeSetItem("fit_custom_challenges", JSON.stringify(data.challenges));
          }
        }
      } catch (e) {
        console.warn("Could not fetch server challenges:", e);
      }
    };
    fetchServerChallenges();

    if (isMockFirebase) return;

    try {
      // 1. Exercise collection listener
      const unsub = onSnapshot(collection(db, "exercises"), (snap) => {
        if (snap.empty) return;
        const firestoreMap: Record<string, Partial<Exercise>> = {};
        const newExercises: Exercise[] = [];

        snap.docs.forEach(docSnap => {
          const d = docSnap.data() as any;
          if (d) {
            firestoreMap[docSnap.id] = d;
            if (d.name && !EXERCISES.some(e => e.id === docSnap.id)) {
              newExercises.push({
                id: docSnap.id,
                name: d.name,
                muscleGroups: d.muscleGroups || [d.category || "Full Body"],
                difficulty: d.difficulty || "Intermediate",
                instructions: d.instructions || ["Perform with proper form."],
                equipment: d.equipment || ["Bodyweight"],
                category: d.category || "Gym Workouts",
                categories: d.categories || [d.category || "Gym Workouts"],
                commonMistakes: d.commonMistakes || [],
                safetyTips: d.safetyTips || [],
                alternativeExercises: d.alternativeExercises || [],
                progressionVariations: d.progressionVariations || [],
                isPremium: d.isPremium !== undefined ? Boolean(d.isPremium) : true,
                startingPosition: d.startingPosition || "",
                movementExecution: d.movementExecution || "",
                finishingPosition: d.finishingPosition || "",
                regressionVariations: d.regressionVariations || [],
                musclesWorked: d.musclesWorked || [d.category || "Full Body"],
                gifUrl: d.customMediaUrl || d.gifUrl || d.imageUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
                imageUrl: d.customMediaUrl || d.imageUrl || d.gifUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
                customMediaUrl: d.customMediaUrl,
                customMediaType: d.customMediaType || "image",
                description: d.description || "",
                duration: d.duration || "45s",
                recommendedSets: d.recommendedSets || "3",
                recommendedReps: d.recommendedReps || "10-12",
                recommendedSetsReps: d.recommendedSetsReps || `${d.recommendedSets || '3'} Sets x ${d.recommendedReps || '10-12'} Reps`,
                restTime: d.restTime || "60s",
                caloriesBurned: d.caloriesBurned || 110,
                benefits: d.benefits || [],
                trainerTips: d.trainerTips || "",
                safetyNotes: d.safetyNotes || ""
              });
            }
          }
        });

        setExercisesState(prev => {
          let changed = false;
          const updated = prev.map(ex => {
            const override = firestoreMap[ex.id];
            if (override) {
              changed = true;
              return {
                ...ex,
                ...override,
                recommendedSetsReps: override.recommendedSetsReps || 
                  (override.recommendedSets || override.recommendedReps ? `${override.recommendedSets || ex.recommendedSets || '3'} Sets x ${override.recommendedReps || ex.recommendedReps || '10-12'} Reps` : ex.recommendedSetsReps)
              };
            }
            return ex;
          });

          // Add newly discovered exercises from Firestore
          for (const newEx of newExercises) {
            if (!updated.some(u => u.id === newEx.id)) {
              updated.unshift(newEx);
              changed = true;
            }
          }

          if (changed) {
            safeSetItem("fit_exercises", JSON.stringify(updated));
            return updated;
          }
          return prev;
        });
      }, (err) => {
        console.warn("Real-time Firestore exercise listener notice:", err?.message || err);
      });

      // 2. Real-time listener for 'assets_manifest' collection
      const manifestUnsub = onSnapshot(collection(db, "assets_manifest"), (snap) => {
        if (snap.empty) return;
        AssetManifestService.syncAllManifestsWithFirestore();
        
        const manifestMap: Record<string, { mediaUrl: string; mediaType: "image" | "video" }> = {};
        snap.docs.forEach(docSnap => {
          const d = docSnap.data();
          const assetId = d.assetId || docSnap.id;
          const mediaUrl = d.mediaUrl || d.url;
          if (mediaUrl) {
            manifestMap[assetId] = {
              mediaUrl,
              mediaType: d.mediaType || "image"
            };
          }
        });

        if (Object.keys(manifestMap).length > 0) {
          setExercisesState(prev => {
            let changed = false;
            const updated = prev.map(ex => {
              const override = manifestMap[ex.id];
              if (override && (ex.customMediaUrl !== override.mediaUrl || ex.customMediaType !== override.mediaType)) {
                changed = true;
                return {
                  ...ex,
                  customMediaUrl: override.mediaUrl,
                  customMediaType: override.mediaType
                };
              }
              return ex;
            });
            if (changed) {
              safeSetItem("fit_exercises", JSON.stringify(updated));
              return updated;
            }
            return prev;
          });
        }
      }, (err) => {
        console.warn("Real-time Firestore assets_manifest listener notice:", err?.message || err);
      });

      // 3. Real-time listener for 'challenges' collection
      const challengesUnsub = onSnapshot(collection(db, "challenges"), (snap) => {
        if (snap.empty) return;
        const loaded: PremiumChallenge[] = [];
        snap.docs.forEach(docSnap => {
          const d = docSnap.data();
          if (d && !d.isDeleted) {
            loaded.push({
              id: d.id || docSnap.id,
              title: d.title || "Custom Challenge",
              description: d.description || "",
              category: d.category || "Hypertrophy",
              goal: d.goal || d.description || "",
              image: d.image || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
              badgeId: d.badgeId || `badge_${docSnap.id}`,
              badgeName: d.badgeName || `${d.title} Champion`,
              badgeColor: d.badgeColor || "from-red-500 to-amber-600",
              durationDays: Number(d.durationDays) || 30,
              isPremium: d.isPremium !== undefined ? Boolean(d.isPremium) : true,
              workouts: Array.isArray(d.workouts) ? d.workouts : [],
              createdAt: d.createdAt,
              createdBy: d.createdBy,
              isCustom: true
            });
          }
        });
        if (loaded.length > 0) {
          setCustomChallenges(loaded);
          safeSetItem("fit_custom_challenges", JSON.stringify(loaded));
        }
      }, (err) => {
        console.warn("Real-time Firestore challenges listener notice:", err?.message || err);
      });

      return () => {
        unsub();
        manifestUnsub();
        challengesUnsub();
      };
    } catch (e) {
      console.warn("Could not set up real-time exercise/asset/challenge listeners:", e);
    }
  }, [isMockFirebase]);

  // --- UNIFIED AUTHENTICATION SERVICES AND UTILITIES ---

  const handleAuthError = (err: any): Error => {
    console.error("[Auth Error Handled]:", err);
    let message = "An authentication error occurred. Please try again.";
    if (err && err.code) {
      switch (err.code) {
        case "auth/invalid-email":
          message = "The email address format is invalid. Please check your spelling.";
          break;
        case "auth/user-disabled":
          message = "This user account has been disabled. Please contact support.";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          message = "Invalid email or password combination. Please try again.";
          break;
        case "auth/email-already-in-use":
          message = "An account with this email address already exists. Try signing in.";
          break;
        case "auth/weak-password":
          message = "The password provided is too weak. It must be at least 6 characters.";
          break;
        case "auth/popup-blocked":
        case "auth/cancelled-popup-request":
          message = "The Google sign-in window was closed or blocked. Please click the Google button again, enable popups, or use the fast-login option.";
          break;
        case "auth/operation-not-allowed":
          message = "This sign-in method is not enabled. Please contact support.";
          break;
        case "auth/network-request-failed":
          message = "Network error. Please check your internet connection and try again.";
          break;
        case "auth/iframe-directory-not-supported":
          message = "Google Sign-In is blocked inside this preview iframe. Please click 'Open in New Tab' at the top right of the application preview or use Email/Password login.";
          break;
        case "auth/unauthorized-domain":
          message = "This domain is not listed in Firebase Authentication Authorized Domains. Please sign in using Email/Password or add this domain in Firebase Console.";
          break;
        default:
          message = err.message || message;
      }
    } else if (err && err.message) {
      message = err.message;
    }
    return new Error(message);
  };

  const validateEmailAndPassword = (email: string, password?: string, name?: string, isSignUp: boolean = false) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error("Email address is required.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      throw new Error("Invalid email address format. Example: user@domain.com");
    }
    if (password !== undefined) {
      if (!password) {
        throw new Error("Password is required.");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters in length.");
      }
    }
    if (isSignUp) {
      const cleanName = (name || "").trim();
      if (!cleanName) {
        throw new Error("Please specify your athlete name.");
      }
      if (cleanName.length < 2) {
        throw new Error("Athlete name must be at least 2 characters long.");
      }
    }
  };

  const syncProfileToSupabase = async (p: UserProfile) => {
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: p.uid,
        uid: p.uid,
        email: p.email,
        display_name: p.displayName,
        photo_url: p.photoURL || null,
        role: p.role,
        subscription_status: p.subscriptionStatus,
        subscription_tier: p.subscriptionTier,
        subscription_plan: p.subscriptionPlan || "none",
        subscription_activation_date: p.subscriptionActivationDate || null,
        payment_reference: p.paymentReference || null,
        fitness_goals: p.fitnessGoals || null,
        weight: p.weight || null,
        height: p.height || null,
        target_weight: p.targetWeight || null,
        gender: p.gender || null,
        onboarded: p.onboarded !== undefined ? p.onboarded : false,
        age: p.age || null,
        activity_level: p.activityLevel || null,
        workout_experience: p.workoutExperience || null,
        workout_preference: p.workoutPreference || null,
        dietary_preference: p.dietaryPreference || null,
        available_days: p.availableDays || null,
        training_location: p.trainingLocation || null,
        available_equipment: p.availableEquipment || null,
        food_allergies: p.foodAllergies || null,
        health_restrictions: p.healthRestrictions || null,
        daily_schedule: p.dailySchedule || null,
        wake_up_time: p.wakeUpTime || null,
        bed_time: p.bedTime || null,
        country_region: p.countryRegion || null,
        water_goal: p.waterGoal || 2500,
        water_intake_today: p.waterIntakeToday || 0,
        water_last_logged: p.waterLastLogged || null,
        status: p.status || "active",
        is_blocked: p.isBlocked || false,
        updated_at: new Date().toISOString()
      });
      if (error) console.warn("[Supabase Profiles] Upsert notice:", error.message);
    } catch (err) {
      console.warn("[Supabase Profiles] Background sync error:", err);
    }
  };

  /**
   * Central Unified Auth Success Handler
   * Standardizes session persistence, Firestore synchronization, cached profiles,
   * admin analytics registration, and safety guards across ALL authentication methods.
   */
  const processAuthSuccess = async (
    firebaseUser: any,
    additionalData?: { displayName?: string },
    remember: boolean = true,
    isNewSignUp: boolean = false
  ): Promise<UserProfile> => {
    const uid = firebaseUser.uid;
    const email = firebaseUser.email || "";
    localStorage.setItem("fit_active_uid", uid);

    // Clean session flags
    if (remember && firebaseUser.email) {
      localStorage.setItem("fit_saved_email", email);
      localStorage.removeItem("fit_explicitly_logged_out");
    } else {
      localStorage.removeItem("fit_saved_email");
      localStorage.setItem("fit_explicitly_logged_out", "true");
    }

    // Attempt to load existing local profile first for near-instant UI reactivity
    let profile: UserProfile | null = null;
    const cached = localStorage.getItem(`fit_user_${uid}`);
    if (cached) {
      try {
        profile = JSON.parse(cached);
      } catch (e) {
        profile = null;
      }
    }

    // Standardize default profile fields if none cached or if we need a base
    // Returning logging-in users should default onboarded to true, while brand new sign ups default to false
    const baseProfile: UserProfile = {
      uid,
      email,
      displayName: additionalData?.displayName || firebaseUser.displayName || email.split("@")[0] || "Athlete",
      photoURL: firebaseUser.photoURL || undefined,
      role: isEmailAdmin(email) ? "admin" : "user",
      subscriptionStatus: "free",
      subscriptionTier: "none",
      createdAt: new Date().toISOString(),
      onboarded: isNewSignUp ? false : true,
      ...profile, // overlay cached attributes if any
    };

    // If returning user, ensure onboarded is true
    if (!isNewSignUp && baseProfile.onboarded !== false) {
      baseProfile.onboarded = true;
    }

    // Keep state updated immediately to trigger App.tsx redirect flow
    setUser(baseProfile);

    if (!isMockFirebase) {
      try {
        const userDocRef = doc(db, "users", uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const fetchedData = userSnap.data() as UserProfile;
          const isAdmin = isEmailAdmin(email);
          const hasActiveExpiry = fetchedData.subscriptionExpiry ? (new Date(fetchedData.subscriptionExpiry) > new Date()) : true;
          const isUserPremium = isAdmin || ((fetchedData.subscriptionStatus === "premium" || fetchedData.subscription === "premium" || fetchedData.isPremium === true) && hasActiveExpiry);
          
          profile = { 
            ...baseProfile, 
            ...fetchedData,
            role: isAdmin ? "admin" : "user", // Normal subscribers always role = "user"
            subscription: isUserPremium ? "premium" : "free",
            subscriptionStatus: isUserPremium ? "premium" : "free",
            isPremium: isUserPremium,
            premiumAccess: isUserPremium,
            accountType: isUserPremium ? (isAdmin ? "Admin Athlete" : "Premium Athlete") : "Free Athlete",
            badge: isUserPremium ? (isAdmin ? "Admin Athlete" : "Premium Athlete") : "Free Athlete",
            onboarded: fetchedData.onboarded !== undefined ? fetchedData.onboarded : (isNewSignUp ? false : true)
          };
        } else {
          // Check Supabase profiles table as persistent backend database source
          try {
            const { data: sbProfile } = await supabase.from("profiles").select("*").eq("uid", uid).maybeSingle();
            if (sbProfile) {
              const isAdmin = isEmailAdmin(email);
              const isUserPremium = isAdmin || (sbProfile.subscription_status === "premium" || sbProfile.subscription === "premium");
              profile = {
                ...baseProfile,
                displayName: sbProfile.display_name || baseProfile.displayName,
                photoURL: sbProfile.photo_url || baseProfile.photoURL,
                role: isAdmin ? "admin" : "user",
                subscription: isUserPremium ? "premium" : "free",
                subscriptionStatus: isUserPremium ? "premium" : "free",
                isPremium: isUserPremium,
                premiumAccess: isUserPremium,
                subscriptionTier: sbProfile.subscription_tier || baseProfile.subscriptionTier,
                subscriptionPlan: sbProfile.subscription_plan || baseProfile.subscriptionPlan,
                fitnessGoals: sbProfile.fitness_goals || baseProfile.fitnessGoals,
                weight: sbProfile.weight || baseProfile.weight,
                height: sbProfile.height || baseProfile.height,
                targetWeight: sbProfile.target_weight || baseProfile.targetWeight,
                gender: sbProfile.gender || baseProfile.gender,
                onboarded: sbProfile.onboarded !== undefined ? sbProfile.onboarded : (isNewSignUp ? false : true),
                age: sbProfile.age || baseProfile.age,
                activityLevel: sbProfile.activity_level || baseProfile.activityLevel,
                workoutExperience: sbProfile.workout_experience || baseProfile.workoutExperience,
                trainingLocation: sbProfile.training_location || baseProfile.trainingLocation,
                waterGoal: sbProfile.water_goal || baseProfile.waterGoal,
                waterIntakeToday: sbProfile.water_intake_today || baseProfile.waterIntakeToday
              };
            } else {
              profile = baseProfile;
            }
          } catch (sErr) {
            profile = baseProfile;
          }
          await setDoc(userDocRef, profile);
        }
        
        // Handle Welcome email trigger for new sign-ups
        if (additionalData?.displayName) {
          queueWelcomeEmail(email, additionalData.displayName).catch(err => {
            console.warn("Could not queue welcome email:", err);
          });
        }
      } catch (dbErr: any) {
        console.warn("Firestore error during unified profile load/sync:", dbErr);
        profile = baseProfile;
      }
    } else {
      profile = baseProfile;
    }

    // Filter and update admin lists
    if (profile) {
      safeSetItem(`fit_user_${uid}`, JSON.stringify(profile));
      setUser(profile);
      
      // Dual sync to Supabase profiles
      syncProfileToSupabase(profile);

      // Update admin analytics active users
      setAllSystemUsers(prev => {
        const filtered = prev.filter(u => u.uid !== uid);
        const nextList = [...filtered, profile!];
        safeSetItem("all_system_users", JSON.stringify(nextList));
        return nextList;
      });

      // Special action: Admin activity logs
      if (profile.role === "admin") {
        try {
          const token = await firebaseUser.getIdToken();
          await fetch("/api/admin/log-activity", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              actionType: "ADMIN_LOGIN",
              description: `Admin ${profile.displayName} authenticated successfully.`
            })
          }).catch(() => {});
        } catch (e) {}
      }
    }

    // Load any user data (saved workouts, activity logs, etc.)
    loadUserData(uid);

    return profile || baseProfile;
  };

  // Sync state data on Auth State Transitions
  useEffect(() => {
    // Check if we have a cached user profile to prevent any visual blocking / flashing
    const activeUid = localStorage.getItem("fit_active_uid");
    if (!activeUid || !localStorage.getItem(`fit_user_${activeUid}`)) {
      setLoading(true);
    }
    
    // Safety timeout to prevent hanging on initial load if Firebase Auth is slow or blocked
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    // Clean up any legacy saved passwords if present
    localStorage.removeItem("fit_saved_password");

    // Check if user has returned from a Google OAuth Redirect
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          console.log("[Redirect Auth Sync] Successfully retrieved redirect login results:", result.user);
          await processAuthSuccess(result.user, undefined, true);
        }
      })
      .catch((err) => {
        console.error("[Redirect Auth Sync] Redirect sign-in error occurred:", err);
      });
    
    // Primary Firebase Session Management
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(safetyTimer);
      if (firebaseUser) {
        localStorage.setItem("fit_active_uid", firebaseUser.uid);
        
        // SPEED UP: Load from local cache immediately so the UI is responsive in milliseconds
        const localCachedUser = localStorage.getItem(`fit_user_${firebaseUser.uid}`);
        if (localCachedUser) {
          try {
            let cachedProfile = JSON.parse(localCachedUser);
            if (cachedProfile.subscriptionStatus === "premium" && cachedProfile.subscriptionExpiry) {
              const expiryDate = new Date(cachedProfile.subscriptionExpiry);
              if (expiryDate < new Date()) {
                console.log(`[Subscription Expired] Automatically expiring cached premium access for user ${cachedProfile.uid}.`);
                cachedProfile = {
                  ...cachedProfile,
                  subscriptionStatus: "free",
                  subscriptionTier: "none"
                };
                safeSetItem(`fit_user_${cachedProfile.uid}`, JSON.stringify(cachedProfile));
              }
            }
            setUser(cachedProfile);
            setLoading(false); // Disable spinner since we have the cached user
            loadUserData(firebaseUser.uid);
          } catch (e) {}
        }

        let profile: UserProfile | null = null;
        let dbErrorOccurred = false;
        let dbErrorMessage = "";

        try {
          // Attempt profile fetch from Firestore
          if (!isMockFirebase) {
            try {
              const userDocRef = doc(db, "users", firebaseUser.uid);
              const userSnap = await getDoc(userDocRef);
              
              if (userSnap.exists()) {
                const fetched = userSnap.data() as UserProfile;
                const isAdmin = isEmailAdmin(firebaseUser.email || undefined);
                const hasActiveExpiry = fetched.subscriptionExpiry ? (new Date(fetched.subscriptionExpiry) > new Date()) : true;
                const isPremium = isAdmin || ((fetched.subscriptionStatus === "premium" || fetched.subscription === "premium" || fetched.isPremium === true) && hasActiveExpiry);
                profile = {
                  ...fetched,
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || fetched.email || "",
                  displayName: fetched.displayName || firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Athlete",
                  photoURL: firebaseUser.photoURL || fetched.photoURL,
                  role: isAdmin ? "admin" : (fetched.role === "admin" && !isAdmin ? "user" : (fetched.role || "user")),
                  subscription: isPremium ? "premium" : "free",
                  subscriptionStatus: isPremium ? "premium" : "free",
                  isPremium: isPremium,
                  premiumAccess: isPremium,
                  subscriptionTier: isPremium ? (fetched.subscriptionTier === "none" || !fetched.subscriptionTier ? "monthly" : fetched.subscriptionTier) : "none",
                  subscriptionPlan: isPremium ? (fetched.subscriptionPlan || "monthly") : "none",
                  accountType: isPremium ? (isAdmin ? "Admin Athlete" : "Premium Athlete") : "Free Athlete",
                  badge: isPremium ? (isAdmin ? "Admin Athlete" : "Premium Athlete") : "Free Athlete",
                  isFreeTrial: false,
                  freeTrialStatus: isPremium ? "none" : "expired",
                  freeTrialDaysRemaining: 0,
                  onboarded: fetched.onboarded !== undefined ? fetched.onboarded : true
                };
                // Cache in local storage for subsequent offline loads
                safeSetItem(`fit_user_${profile.uid}`, JSON.stringify(profile));
              } else {
                // Brand new user: Check local storage or build clean Free Trial profile with onboarded = false
                const cachedStr = localStorage.getItem(`fit_user_${firebaseUser.uid}`);
                if (cachedStr) {
                  try {
                    profile = JSON.parse(cachedStr);
                  } catch (e) {}
                }

                if (!profile) {
                  const pendingName = localStorage.getItem("fit_pending_name");
                  localStorage.removeItem("fit_pending_name");
                  const isAdmin = isEmailAdmin(firebaseUser.email || undefined);

                  profile = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || "",
                    displayName: firebaseUser.displayName || pendingName || firebaseUser.email?.split("@")[0] || "Athlete",
                    photoURL: firebaseUser.photoURL || undefined,
                    role: isAdmin ? "admin" : "user",
                    subscriptionStatus: isAdmin ? "premium" : "free",
                    subscriptionTier: isAdmin ? "yearly" : "none",
                    accountType: isAdmin ? "Admin Athlete" : "Free Trial",
                    badge: isAdmin ? "Admin Athlete" : "Free Trial",
                    isFreeTrial: isAdmin ? false : true,
                    freeTrialStatus: isAdmin ? "none" : "active",
                    freeTrialDaysRemaining: isAdmin ? 0 : 7,
                    onboarded: false, // Brand new users must complete onboarding
                    createdAt: new Date().toISOString(),
                  };
                  await setDoc(userDocRef, profile, { merge: true });
                }
                // Cache in local storage
                safeSetItem(`fit_user_${profile.uid}`, JSON.stringify(profile));
              }
            } catch (dbErr: any) {
              console.warn("Database error during user profile fetch (quota exceeded / network offline). Resolving to local storage cache:", dbErr);
              const cachedStr = localStorage.getItem(`fit_user_${firebaseUser.uid}`);
              if (cachedStr) {
                try {
                  profile = JSON.parse(cachedStr);
                } catch (parseErr) {
                  profile = null;
                }
              }
              
              if (!profile) {
                profile = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || "",
                  displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Athlete",
                  role: isEmailAdmin(firebaseUser.email || undefined) ? "admin" : "user",
                  subscriptionStatus: "free",
                  subscriptionTier: "none",
                  createdAt: new Date().toISOString(),
                  onboarded: false,
                };
                safeSetItem(`fit_user_${firebaseUser.uid}`, JSON.stringify(profile));
              }
              dbErrorOccurred = false;
            }
          } else {
            // Local fallback extraction
            const localUser = localStorage.getItem(`fit_user_${firebaseUser.uid}`);
            if (localUser) {
              profile = JSON.parse(localUser);
            } else {
              profile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || "",
                displayName: firebaseUser.displayName || "Fallback User",
                role: isEmailAdmin(firebaseUser.email || undefined) ? "admin" : "user",
                subscriptionStatus: "free",
                subscriptionTier: "none",
                createdAt: new Date().toISOString()
              };
              safeSetItem(`fit_user_${firebaseUser.uid}`, JSON.stringify(profile));
            }
          }

          if (dbErrorOccurred) {
            setAuthDatabaseError(`Could not verify your account status due to a database connection error. Please refresh and try again. [Details: ${dbErrorMessage}]`);
            setUser(null);
            setLoading(false);
            return;
          }

          setAuthDatabaseError(null);

          // Verify if blocked
          const isBlocked = profile && (profile.status === "blocked" || profile.isBlocked === true);
          if (isBlocked) {
            console.warn(`Blocked user detected: ${profile?.email}`);
            setIsBlockedUser(true);
            setUser(null);
            setLoading(false);
            signOut(auth);
            return;
          }

          setIsBlockedUser(false);

          if (profile && profile.subscriptionStatus === "premium" && profile.subscriptionExpiry) {
            const expiryDate = new Date(profile.subscriptionExpiry);
            if (expiryDate < new Date()) {
              console.log(`[Subscription Expired] Automatically expiring premium access for user ${profile.uid}.`);
              profile = {
                ...profile,
                subscriptionStatus: "free",
                subscriptionTier: "none"
              };
              if (!isMockFirebase) {
                const { updateDoc, doc } = await import("firebase/firestore");
                await updateDoc(doc(db, "users", profile.uid), {
                  subscriptionStatus: "free",
                  subscriptionTier: "none"
                }).catch(err => console.warn("Firestore subscription expiration background update failed:", err));
              }
              safeSetItem(`fit_user_${profile.uid}`, JSON.stringify(profile));
            }
          }

          setUser(profile);
          
          // Background verification with backend profile-status (triggers auto-healing for paid users)
          firebaseUser.getIdToken().then(token => {
            fetch("/api/user/profile-status", {
              headers: { Authorization: `Bearer ${token}` }
            })
            .then(r => r.json())
            .then(data => {
              if (data && data.profile) {
                console.log(`[Profile Status Sync] Backend returned profile status: ${data.profile.subscriptionStatus}`);
                setUser(data.profile);
                safeSetItem(`fit_user_${firebaseUser.uid}`, JSON.stringify(data.profile));
              }
            })
            .catch(e => console.warn("Background profile status check failed:", e));
          }).catch(() => {});

          // Load User metadata records (saved Workouts, logs)
          loadUserData(firebaseUser.uid);
          
        } catch (err: any) {
          console.warn("Firestore profile read failed, resolving to local backup cache:", err);
          
          // Fallback to local cache if present
          const localUser = localStorage.getItem(`fit_user_${firebaseUser.uid}`);
          let backupProfile: UserProfile;
          
          if (localUser) {
            try {
              backupProfile = JSON.parse(localUser);
            } catch (parseErr) {
              backupProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || "local@alexfitness.com",
                displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Athlete",
                role: isEmailAdmin(firebaseUser.email || undefined) ? "admin" : "user",
                subscriptionStatus: "free",
                subscriptionTier: "none",
                createdAt: new Date().toISOString()
              };
            }
          } else {
            backupProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "local@alexfitness.com",
              displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Athlete",
              role: isEmailAdmin(firebaseUser.email || undefined) ? "admin" : "user",
              subscriptionStatus: "free",
              subscriptionTier: "none",
              createdAt: new Date().toISOString()
            };
            safeSetItem(`fit_user_${firebaseUser.uid}`, JSON.stringify(backupProfile));
          }
          
          setUser(backupProfile);
          loadUserData(firebaseUser.uid);
        }
      } else {
        // Explicitly logged out
        setUser(null);
        localStorage.removeItem("fit_active_uid");
        setSavedWorkouts([]);
        setActivityLogs([]);
        setWeightLogs([]);
        setVitalsLogs([]);
        setTransactions([]);
        setChatMessages([]);
        setCustomPrograms([]);
        setWeeklyReports([]);
      }
      setLoading(false);
    });

    loadPopupTestimonials();

    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  // Periodic and visibility-based subscription expiration monitor
  useEffect(() => {
    const checkExpiration = async () => {
      if (!user || user.role === "admin" || user.subscriptionStatus !== "premium") return;
      if (!user.subscriptionExpiry) return;

      const expiryDate = new Date(user.subscriptionExpiry);
      if (!isNaN(expiryDate.getTime()) && expiryDate < new Date()) {
        console.log(`[Subscription Monitor] Premium subscription for ${user.uid} expired on ${user.subscriptionExpiry}. Transitioning to Free Athlete.`);
        const expiredUser: UserProfile = {
          ...user,
          subscriptionStatus: "free",
          subscriptionTier: "none",
          subscriptionPlan: "none",
          accountType: "Free Athlete",
          badge: "Free Athlete",
          isFreeTrial: false,
          freeTrialStatus: "expired",
          freeTrialDaysRemaining: 0
        };
        await syncUserToStorageAndPlatform(expiredUser);
      }
    };

    const interval = setInterval(checkExpiration, 30000); // Check every 30 seconds
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkExpiration();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", checkExpiration);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", checkExpiration);
    };
  }, [user?.uid, user?.subscriptionStatus, user?.subscriptionExpiry, user?.role]);

  const saveWorkoutFiltersToFirebase = async (uid: string, filters: WorkoutLibraryFilters) => {
    if (isMockFirebase) return;
    try {
      await setDoc(doc(db, "workout_library_filters", uid), {
        userId: uid,
        ...filters,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.warn("Error saving workout filters to Firestore:", error);
    }
  };

  const loadWorkoutFilters = async (uid: string) => {
    const defaults = {
      searchQuery: "",
      selectedCategory: "All",
      selectedDifficulty: "All",
      selectedMuscleGroup: "All",
      selectedEquipment: "All",
      selectedExerciseType: "All",
      selectedTrainingGoal: "All",
      activeBrowseTab: "bodyparts" as const
    };

    const pFilters = localStorage.getItem(`fit_workout_filters_${uid}`);
    if (pFilters) {
      try {
        const parsed = JSON.parse(pFilters);
        if (parsed && typeof parsed === "object") {
          const loaded: WorkoutLibraryFilters = {
            searchQuery: typeof parsed.searchQuery === "string" ? parsed.searchQuery : defaults.searchQuery,
            selectedCategory: typeof parsed.selectedCategory === "string" ? parsed.selectedCategory : defaults.selectedCategory,
            selectedDifficulty: typeof parsed.selectedDifficulty === "string" ? parsed.selectedDifficulty : defaults.selectedDifficulty,
            selectedMuscleGroup: typeof parsed.selectedMuscleGroup === "string" ? parsed.selectedMuscleGroup : defaults.selectedMuscleGroup,
            selectedEquipment: typeof parsed.selectedEquipment === "string" ? parsed.selectedEquipment : defaults.selectedEquipment,
            selectedExerciseType: typeof parsed.selectedExerciseType === "string" ? parsed.selectedExerciseType : defaults.selectedExerciseType,
            selectedTrainingGoal: typeof parsed.selectedTrainingGoal === "string" ? parsed.selectedTrainingGoal : defaults.selectedTrainingGoal,
            activeBrowseTab: (parsed.activeBrowseTab === "bodyparts" || parsed.activeBrowseTab === "cardio" || parsed.activeBrowseTab === "mobility" || parsed.activeBrowseTab === "programs" || parsed.activeBrowseTab === "all") ? parsed.activeBrowseTab : defaults.activeBrowseTab
          };
          setWorkoutFiltersState(loaded);
        }
      } catch (e) {}
    }
    if (!isMockFirebase) {
      try {
        const snap = await getDoc(doc(db, "workout_library_filters", uid));
        if (snap.exists()) {
          const data = snap.data();
          const loadedFilters: WorkoutLibraryFilters = {
            searchQuery: typeof data.searchQuery === "string" ? data.searchQuery : defaults.searchQuery,
            selectedCategory: typeof data.selectedCategory === "string" ? data.selectedCategory : defaults.selectedCategory,
            selectedDifficulty: typeof data.selectedDifficulty === "string" ? data.selectedDifficulty : defaults.selectedDifficulty,
            selectedMuscleGroup: typeof data.selectedMuscleGroup === "string" ? data.selectedMuscleGroup : defaults.selectedMuscleGroup,
            selectedEquipment: typeof data.selectedEquipment === "string" ? data.selectedEquipment : defaults.selectedEquipment,
            selectedExerciseType: typeof data.selectedExerciseType === "string" ? data.selectedExerciseType : defaults.selectedExerciseType,
            selectedTrainingGoal: typeof data.selectedTrainingGoal === "string" ? data.selectedTrainingGoal : defaults.selectedTrainingGoal,
            activeBrowseTab: (data.activeBrowseTab === "bodyparts" || data.activeBrowseTab === "cardio" || data.activeBrowseTab === "mobility" || data.activeBrowseTab === "programs" || data.activeBrowseTab === "all") ? data.activeBrowseTab : defaults.activeBrowseTab
          };
          setWorkoutFiltersState(loadedFilters);
          safeSetItem(`fit_workout_filters_${uid}`, JSON.stringify(loadedFilters));
        }
      } catch (error) {
        console.warn("Failed to fetch workout filters from Firestore:", error);
      }
    }
  };

  const saveProgramProgressToFirebase = async (uid: string, progress: Record<string, ProgramProgressItem>) => {
    if (isMockFirebase) return;
    try {
      await setDoc(doc(db, "user_program_progress", uid), {
        userId: uid,
        progress,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.warn("Error saving program progress to Firestore:", error);
    }
  };

  const loadProgramProgress = async (uid: string) => {
    const key = `fit_program_progress_${uid}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setProgramProgressState(prev => ({ ...DEFAULT_PROGRAM_PROGRESS, ...prev, ...parsed }));
        }
      } catch (e) {}
    }
    if (!isMockFirebase) {
      try {
        const snap = await getDoc(doc(db, "user_program_progress", uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data && data.progress && typeof data.progress === "object") {
            setProgramProgressState(prev => {
              const merged = { ...DEFAULT_PROGRAM_PROGRESS, ...prev, ...data.progress };
              safeSetItem(key, JSON.stringify(merged));
              return merged;
            });
          }
        }
      } catch (err) {
        console.warn("Failed to fetch program progress from Firestore:", err);
      }
    }
  };

  const enrollProgram = useCallback(async (programId: string, details?: Partial<ProgramProgressItem>) => {
    const now = new Date().toISOString();
    setProgramProgressState(prev => {
      const existing = prev[programId] || DEFAULT_PROGRAM_PROGRESS[programId] || {
        programId,
        programTitle: details?.programTitle || programId.replace(/_/g, " ").toUpperCase(),
        category: details?.category || "Fitness Program",
        imageUrl: details?.imageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
        viewName: details?.viewName || "challenges",
        enrolled: true,
        enrolledAt: now,
        currentDay: 1,
        currentWeek: 1,
        currentWorkoutIndex: 0,
        lastStoppedWorkoutName: details?.lastStoppedWorkoutName || "Day 1 Workout",
        lastStoppedWorkoutId: details?.lastStoppedWorkoutId || `${programId}_d1_w0`,
        lastStoppedAt: now,
        completedWorkoutIds: [],
        totalWorkouts: details?.totalWorkouts || 10,
        progressPercent: 0
      };

      const updated: ProgramProgressItem = {
        ...existing,
        ...details,
        enrolled: true,
        enrolledAt: existing.enrolled ? existing.enrolledAt : now,
        lastStoppedAt: now
      };

      const next = { ...prev, [programId]: updated };
      try {
        const uid = auth.currentUser?.uid;
        safeSetItem("fit_program_progress_guest", JSON.stringify(next));
        if (uid) {
          safeSetItem(`fit_program_progress_${uid}`, JSON.stringify(next));
          saveProgramProgressToFirebase(uid, next);
        }
      } catch (e) {}
      return next;
    });
  }, []);

  const updateProgramProgress = useCallback(async (programId: string, updates: Partial<ProgramProgressItem>) => {
    setProgramProgressState(prev => {
      const existing = prev[programId] || DEFAULT_PROGRAM_PROGRESS[programId];
      if (!existing) return prev;

      const updated: ProgramProgressItem = {
        ...existing,
        ...updates,
        lastStoppedAt: updates.lastStoppedAt || new Date().toISOString()
      };

      const next = { ...prev, [programId]: updated };
      try {
        const uid = auth.currentUser?.uid;
        safeSetItem("fit_program_progress_guest", JSON.stringify(next));
        if (uid) {
          safeSetItem(`fit_program_progress_${uid}`, JSON.stringify(next));
          saveProgramProgressToFirebase(uid, next);
        }
      } catch (e) {}
      return next;
    });
  }, []);

  const recordProgramStopPoint = useCallback(async (
    programId: string,
    workoutName: string,
    workoutId?: string,
    day?: number,
    week?: number,
    extra?: Partial<ProgramProgressItem>
  ) => {
    setProgramProgressState(prev => {
      const existing = prev[programId] || DEFAULT_PROGRAM_PROGRESS[programId];
      if (
        existing &&
        existing.lastStoppedWorkoutName === workoutName &&
        existing.lastStoppedWorkoutId === (workoutId || existing.lastStoppedWorkoutId) &&
        (day === undefined || existing.currentDay === day) &&
        (week === undefined || existing.currentWeek === week)
      ) {
        return prev;
      }

      const now = new Date().toISOString();
      const base = existing || {
        programId,
        programTitle: extra?.programTitle || programId.replace(/_/g, " ").toUpperCase(),
        category: extra?.category || "Fitness Program",
        imageUrl: extra?.imageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
        viewName: extra?.viewName || "challenges",
        enrolled: true,
        enrolledAt: now,
        currentDay: day || 1,
        currentWeek: week || 1,
        currentWorkoutIndex: 0,
        lastStoppedWorkoutName: workoutName,
        lastStoppedWorkoutId: workoutId,
        lastStoppedAt: now,
        completedWorkoutIds: [],
        totalWorkouts: extra?.totalWorkouts || 10,
        progressPercent: 0
      };

      const updated: ProgramProgressItem = {
        ...base,
        ...extra,
        enrolled: true,
        currentDay: day !== undefined ? day : base.currentDay,
        currentWeek: week !== undefined ? week : base.currentWeek,
        lastStoppedWorkoutName: workoutName,
        lastStoppedWorkoutId: workoutId || base.lastStoppedWorkoutId,
        lastStoppedAt: now
      };

      const next = { ...prev, [programId]: updated };
      try {
        const uid = auth.currentUser?.uid;
        safeSetItem("fit_program_progress_guest", JSON.stringify(next));
        if (uid) {
          safeSetItem(`fit_program_progress_${uid}`, JSON.stringify(next));
          saveProgramProgressToFirebase(uid, next);
        }
      } catch (e) {}
      return next;
    });
  }, []);

  const markProgramWorkoutComplete = useCallback(async (
    programId: string,
    workoutId: string,
    nextWorkoutNameOrDay?: string | number,
    day?: number,
    week?: number
  ) => {
    const now = new Date().toISOString();
    setProgramProgressState(prev => {
      const existing = prev[programId] || DEFAULT_PROGRAM_PROGRESS[programId];
      if (!existing) return prev;

      const completed = Array.from(new Set([...(existing.completedWorkoutIds || []), workoutId]));
      const total = existing.totalWorkouts || 10;
      const progressPercent = Math.min(100, Math.round((completed.length / total) * 100));

      const nextName = typeof nextWorkoutNameOrDay === "string" ? nextWorkoutNameOrDay : existing.lastStoppedWorkoutName;
      const resolvedDay = day !== undefined ? day : (typeof nextWorkoutNameOrDay === "number" ? nextWorkoutNameOrDay : existing.currentDay);

      const updated: ProgramProgressItem = {
        ...existing,
        completedWorkoutIds: completed,
        progressPercent,
        currentDay: resolvedDay,
        currentWeek: week !== undefined ? week : existing.currentWeek,
        lastStoppedWorkoutName: nextName,
        lastStoppedWorkoutId: workoutId,
        lastStoppedAt: now
      };

      const next = { ...prev, [programId]: updated };
      try {
        const uid = auth.currentUser?.uid;
        safeSetItem("fit_program_progress_guest", JSON.stringify(next));
        if (uid) {
          safeSetItem(`fit_program_progress_${uid}`, JSON.stringify(next));
          saveProgramProgressToFirebase(uid, next);
        }
      } catch (e) {}
      return next;
    });
  }, []);

  const resumeProgram = useCallback((programId: string) => {
    const item = programProgress[programId] || DEFAULT_PROGRAM_PROGRESS[programId];
    if (!item) {
      setView("challenges");
      return;
    }
    if (item.viewName) {
      setView(item.viewName);
    } else if (programId === "90_day_immortal") {
      setView("challenges");
    } else if (programId === "belly_fat_shred") {
      setView("belly-fat-shred");
    } else if (programId === "lifestyle_academy") {
      setView("lifestyle-academy");
    } else {
      setView("challenges");
    }
  }, [programProgress]);

  const getActiveEnrolledPrograms = useCallback((): ProgramProgressItem[] => {
    return Object.values(programProgress)
      .filter(p => p.enrolled)
      .sort((a, b) => new Date(b.lastStoppedAt || 0).getTime() - new Date(a.lastStoppedAt || 0).getTime());
  }, [programProgress]);

  const setWorkoutFilters = useCallback((filters: Partial<WorkoutLibraryFilters>) => {
    setWorkoutFiltersState(prev => {
      const updated = { ...prev, ...filters };
      try {
        // Always save to guest key as fallback
        safeSetItem("fit_workout_filters_guest", JSON.stringify(updated));
        if (auth.currentUser?.uid) {
          safeSetItem(`fit_workout_filters_${auth.currentUser.uid}`, JSON.stringify(updated));
          saveWorkoutFiltersToFirebase(auth.currentUser.uid, updated);
        }
      } catch (e) {}
      return updated;
    });
  }, []);

  const loadUserData = (uid: string) => {
    // Load Workout Library Search and Filters from local/cloud
    loadWorkoutFilters(uid);
    loadProgramProgress(uid);

    // Custom programs loading
    const pCustomProgs = localStorage.getItem(`fit_custom_programs_${uid}`);
    if (pCustomProgs) {
      try {
        const parsed = JSON.parse(pCustomProgs) as CustomProgram[];
        const normalized = parsed.map(prog => ({
          ...prog,
          schedule: (prog.schedule || []).map(item => ({
            ...item,
            exercises: (item.exercises || []).map(ex => ({
              ...ex,
              id: normalizeExerciseId(ex.id)
            }))
          }))
        }));
        setCustomPrograms(normalized);
      } catch (e) {
        setCustomPrograms([]);
      }
    }

    if (!isMockFirebase) {
      const q = query(collection(db, "custom_programs"), where("userId", "==", uid));
      getDocs(q)
        .then((snapshot) => {
          const list: CustomProgram[] = [];
          snapshot.forEach((d) => {
            const rawProg = d.data() as CustomProgram;
            const normalizedProg: CustomProgram = {
              ...rawProg,
              schedule: (rawProg.schedule || []).map(item => ({
                ...item,
                exercises: (item.exercises || []).map(ex => ({
                  ...ex,
                  id: normalizeExerciseId(ex.id)
                }))
              }))
            };
            list.push(normalizedProg);
          });
          list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
          setCustomPrograms(list);
          safeSetItem(`fit_custom_programs_${uid}`, JSON.stringify(list));
        })
        .catch((err) => {
          console.warn("Error fetching custom programs from firestore: ", err);
        });
    }

    // Standard Local Storage keys mapped to specific users so we survive any Firestore quotas/permissions
    const pSaves = localStorage.getItem(`fit_saves_${uid}`);
    if (pSaves) {
      try {
        const parsed = JSON.parse(pSaves) as string[];
        const normalized = Array.from(new Set(parsed.map(normalizeExerciseId)));
        setSavedWorkouts(normalized);
      } catch (e) {
        setSavedWorkouts([]);
      }
    }

    const pLogs = localStorage.getItem(`fit_activity_${uid}`);
    if (pLogs) {
      try {
        const parsed = JSON.parse(pLogs) as ActivityLog[];
        const normalized = parsed.map(log => ({
          ...log,
          exerciseId: normalizeExerciseId(log.exerciseId)
        }));
        setActivityLogs(normalized);
      } catch (e) {
        setActivityLogs([]);
      }
    }

    // Load completed activity logs from Firestore if active
    if (!isMockFirebase) {
      const qActivity = query(collection(db, "user_workout_actions"), where("userId", "==", uid));
      getDocs(qActivity)
        .then((snapshot) => {
          const list: ActivityLog[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.completed) {
              const normId = normalizeExerciseId(data.workoutId);
              list.push({
                id: data.id,
                exerciseId: normId,
                exerciseName: data.workoutId, // Fallback, resolved dynamically
                date: data.loggedAt || new Date().toISOString(),
                notes: data.notes
              });
            }
          });
          list.sort((a, b) => b.date.localeCompare(a.date));
          if (list.length > 0) {
            setActivityLogs(list);
            safeSetItem(`fit_activity_${uid}`, JSON.stringify(list));
          }
        })
        .catch((err) => console.warn("Failed to fetch user_workout_actions from firestore:", err));
    }

    const pWeights = localStorage.getItem(`fit_weights_${uid}`);
    if (pWeights) {
      try {
        setWeightLogs(JSON.parse(pWeights));
      } catch (e) {
        // Fallback in case of parse error
        setWeightLogs([]);
      }
    } else {
      // Default logs to draw an initial pretty progress chart
      const initialLogs: WeightGoalLog[] = [
        { id: "1", date: "2026-06-01", weight: 81.2 },
        { id: "2", date: "2026-06-03", weight: 80.8 },
        { id: "3", date: "2026-06-06", weight: 80.5 },
        { id: "4", date: "2026-06-09", weight: 79.9 },
        { id: "5", date: "2026-06-12", weight: 79.2 },
      ];
      setWeightLogs(initialLogs);
      safeSetItem(`fit_weights_${uid}`, JSON.stringify(initialLogs));
    }

    // Load progress logs from Firestore if active
    if (!isMockFirebase) {
      const qProgress = query(collection(db, "progress_logs"), where("userId", "==", uid));
      getDocs(qProgress)
        .then((snapshot) => {
          const list: WeightGoalLog[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
              id: data.id,
              date: data.date,
              weight: data.weight,
              bodyFat: data.bodyFat || undefined
            });
          });
          list.sort((a, b) => a.date.localeCompare(b.date));
          if (list.length > 0) {
            setWeightLogs(list);
            safeSetItem(`fit_weights_${uid}`, JSON.stringify(list));
          }
        })
        .catch((err) => console.warn("Failed to fetch progress_logs from firestore:", err));
    }

    const pVitals = localStorage.getItem(`fit_vitals_${uid}`);
    if (pVitals) {
      try {
        setVitalsLogs(JSON.parse(pVitals));
      } catch (e) {
        setVitalsLogs([]);
      }
    } else {
      const initialVitals: VitalsLog[] = [
        { id: "v1", userId: uid, date: "2026-06-01", restingHeartRate: 68, sleepDuration: 7.2, hydrationGlasses: 8, readinessScore: 82 },
        { id: "v2", userId: uid, date: "2026-06-03", restingHeartRate: 65, sleepDuration: 6.8, hydrationGlasses: 7, readinessScore: 76 },
        { id: "v3", userId: uid, date: "2026-06-06", restingHeartRate: 62, sleepDuration: 8.0, hydrationGlasses: 10, readinessScore: 94 },
        { id: "v4", userId: uid, date: "2026-06-09", restingHeartRate: 64, sleepDuration: 7.5, hydrationGlasses: 8, readinessScore: 86 },
        { id: "v5", userId: uid, date: "2026-06-12", restingHeartRate: 60, sleepDuration: 8.2, hydrationGlasses: 9, readinessScore: 96 },
      ];
      setVitalsLogs(initialVitals);
      safeSetItem(`fit_vitals_${uid}`, JSON.stringify(initialVitals));
    }

    if (!isMockFirebase) {
      const qVitals = query(collection(db, "vitals_logs"), where("userId", "==", uid));
      getDocs(qVitals)
        .then((snapshot) => {
          const list: VitalsLog[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const sleep = typeof data.sleepDuration === "number" ? data.sleepDuration : 7.5;
            const hyd = typeof data.hydrationGlasses === "number" ? data.hydrationGlasses : 8;
            const rhr = typeof data.restingHeartRate === "number" ? data.restingHeartRate : undefined;
            const energy = typeof data.energyLevel === "number" ? data.energyLevel : undefined;
            const calcScore = typeof data.readinessScore === "number" ? data.readinessScore : calculateReadinessScore(sleep, hyd, rhr, energy).score;

            list.push({
              id: data.id || docSnap.id,
              userId: data.userId || uid,
              date: data.date,
              restingHeartRate: rhr,
              sleepDuration: sleep,
              hydrationGlasses: hyd,
              readinessScore: calcScore,
              energyLevel: energy,
              notes: data.notes || undefined,
              createdAt: data.createdAt || undefined
            });
          });
          list.sort((a, b) => a.date.localeCompare(b.date));
          if (list.length > 0) {
            setVitalsLogs(list);
            safeSetItem(`fit_vitals_${uid}`, JSON.stringify(list));
          }
        })
        .catch((err) => console.warn("Failed to fetch vitals_logs from firestore:", err));

      // Fetch calibration goals for user
      getDoc(doc(db, "calibration_goals", uid))
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const loadedGoals: CalibrationGoals = {
              userId: uid,
              dailyHydrationGoal: typeof data.dailyHydrationGoal === "number" ? data.dailyHydrationGoal : 10,
              dailySleepGoal: typeof data.dailySleepGoal === "number" ? data.dailySleepGoal : 8.0,
              targetReadinessScore: typeof data.targetReadinessScore === "number" ? data.targetReadinessScore : 85,
              targetRestingHeartRate: typeof data.targetRestingHeartRate === "number" ? data.targetRestingHeartRate : 60,
              updatedAt: data.updatedAt || undefined
            };
            setCalibrationGoals(loadedGoals);
            safeSetItem(`fit_calibration_goals_${uid}`, JSON.stringify(loadedGoals));
          }
        })
        .catch((err) => console.warn("Failed to fetch calibration_goals from firestore:", err));
    }

    // Sync weekly progress reports
    loadWeeklyReports(uid);

    const pTrans = localStorage.getItem(`fit_trans_${uid}`);
    if (pTrans) {
      try {
        setTransactions(JSON.parse(pTrans));
      } catch (e) {
        setTransactions([]);
      }
    }

    const pChats = localStorage.getItem(`fit_chats_${uid}`);
    if (pChats) {
      try {
        setChatMessages(JSON.parse(pChats));
      } catch (e) {
        setChatMessages([]);
      }
    }

    // Load community posts
    if (!isMockFirebase) {
      getDocs(collection(db, "community_posts"))
        .then((snapshot) => {
          const list: CommunityPost[] = [];
          snapshot.forEach((d) => list.push(d.data() as CommunityPost));
          list.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
          if (list.length > 0) {
            setCommunityPosts(list);
            safeSetItem("fit_community_posts", JSON.stringify(list));
          } else {
            loadLocalCommunitySeed();
          }
        })
        .catch(() => loadLocalCommunitySeed());
    } else {
      loadLocalCommunitySeed();
    }

    // Load testimonials
    if (!isMockFirebase) {
      getDocs(collection(db, "testimonials"))
        .then((snapshot) => {
          const list: Testimonial[] = [];
          snapshot.forEach((d) => list.push(d.data() as Testimonial));
          list.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
          if (list.length > 0) {
            setTestimonials(list);
            safeSetItem("fit_testimonials", JSON.stringify(list));
          } else {
            loadLocalTestimonialSeed();
          }
        })
        .catch(() => loadLocalTestimonialSeed());
    } else {
      loadLocalTestimonialSeed();
    }

    // Gather overall admin analytics dataset safely
    const adminSavedUsers = localStorage.getItem("all_system_users");

    let parsedUsers: UserProfile[] | null = null;
    if (adminSavedUsers) {
      try {
        parsedUsers = JSON.parse(adminSavedUsers);
      } catch (e) {}
    }

    if (parsedUsers) {
      setAllSystemUsers(parsedUsers);
    } else {
      // Seed some demo users in the admin dashboard to make the UI look alive
      const seeds: UserProfile[] = [
        { uid: "admin1", email: "alexfitnesshub@gmail.com", displayName: "Alex Admin", role: "admin", subscriptionStatus: "premium", subscriptionTier: "yearly" },
        { uid: "user1", email: "david.beck@gmail.com", displayName: "David Beck", role: "user", subscriptionStatus: "premium", subscriptionTier: "monthly" },
        { uid: "user2", email: "clara.fit@yahoo.com", displayName: "Clara Oswald", role: "user", subscriptionStatus: "free", subscriptionTier: "none" },
        { uid: "user3", email: "samuel.strong@gmail.com", displayName: "Sam Muscles", role: "user", subscriptionStatus: "premium", subscriptionTier: "yearly" }
      ];
      setAllSystemUsers(seeds);
      safeSetItem("all_system_users", JSON.stringify(seeds));
    }
  };

  const syncUserToStorageAndPlatform = async (updated: UserProfile) => {
    setUser(updated);
    if (updated.uid) {
      safeSetItem(`fit_user_${updated.uid}`, JSON.stringify(updated));
      safeSetItem("fit_active_user", JSON.stringify(updated));
    }
    
    // Update admin analytics list
    setAllSystemUsers(prev => {
      const filtered = prev.filter(u => u.uid !== updated.uid);
      const nextList = [...filtered, updated];
      safeSetItem("all_system_users", JSON.stringify(nextList));
      return nextList;
    });

    if (!isMockFirebase && updated.uid) {
      // Fire-and-forget background synchronization to prevent UI main-thread latency or blockage from TCP offline retries
      setDoc(doc(db, "users", updated.uid), { ...updated }, { merge: true })
        .catch(err => {
          console.warn("Firestore background sync failed, relying on local state:", err);
        });
    }

    // Permanent Dual Sync to Supabase profiles table
    syncProfileToSupabase(updated);
  };

  // --- AUTH SERVICES ---
  
  const loginWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    if (firebaseConfig.oAuthClientId) {
      provider.setCustomParameters({
        client_id: firebaseConfig.oAuthClientId,
        prompt: 'select_account'
      });
    }
    try {
      const cred = await signInWithPopup(auth, provider);
      await processAuthSuccess(cred.user, undefined, true);
    } catch (err: any) {
      console.warn("Google authentication error:", err?.code || err?.message || err);
      if (err?.code === "auth/popup-blocked") {
        throw new Error("Google popup was blocked by your browser. Please allow popups or use Email login.");
      }
      if (err?.code === "auth/unauthorized-domain") {
        throw new Error("This domain is not authorized in Firebase OAuth settings. Please use Email/Password sign in.");
      }
      throw handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const loginWithApple = async () => {
    setLoading(true);
    try {
      const provider = new OAuthProvider('apple.com');
      const cred = await signInWithPopup(auth, provider);
      await processAuthSuccess(cred.user, undefined, true);
    } catch (err: any) {
      console.warn("Apple authentication error:", err?.code || err?.message || err);
      if (err?.code === "auth/popup-blocked") {
        throw new Error("Apple popup was blocked by your browser. Please allow popups or use Email login.");
      }
      throw handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const signUpEmail = async (email: string, pass: string, name: string, remember: boolean = true) => {
    setLoading(true);
    try {
      validateEmailAndPassword(email, pass, name, true);
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      await processAuthSuccess(cred.user, { displayName: name.trim() }, remember, true);
    } catch (err: any) {
      throw handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const loginEmail = async (email: string, pass: string, remember: boolean = true) => {
    setLoading(true);
    try {
      validateEmailAndPassword(email, pass);
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      await processAuthSuccess(cred.user, undefined, remember, false);
    } catch (err: any) {
      throw handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      const cleanEmail = (email || "").trim().toLowerCase();
      if (!cleanEmail) {
        throw new Error("Email address is required.");
      }
      await sendPasswordResetEmail(auth, cleanEmail);
    } catch (err: any) {
      throw handleAuthError(err);
    }
  };

  const logout = async () => {
    setLoading(true);
    localStorage.setItem("fit_explicitly_logged_out", "true");
    localStorage.removeItem("fit_saved_email");
    localStorage.removeItem("fit_active_uid");
    await signOut(auth);
    setUser(null);
    setLoading(false);
  };

  // --- WORKOUT LOGIC ---

  const toggleSaveWorkout = async (exerciseId: string) => {
    if (!user) return;
    const normId = normalizeExerciseId(exerciseId);
    const isSaved = savedWorkouts.includes(normId);
    let nextSaves: string[];
    if (isSaved) {
      nextSaves = savedWorkouts.filter(id => id !== normId);
    } else {
      nextSaves = [...savedWorkouts, normId];
    }
    setSavedWorkouts(nextSaves);
    safeSetItem(`fit_saves_${user.uid}`, JSON.stringify(nextSaves));
  };

  const logWorkoutCompletion = async (exerciseId: string, reps: number, weight: number, notes?: string) => {
    if (!user) return;
    const normId = normalizeExerciseId(exerciseId);
    const targetEx = exercises.find(e => e.id === normId);
    const newLog: ActivityLog = {
      id: "act_" + Math.random().toString(36).substring(7),
      exerciseId: normId,
      exerciseName: targetEx?.name || exerciseId,
      date: new Date().toISOString(),
      weight,
      reps,
      notes
    };
    const nextLogs = [newLog, ...activityLogs];
    setActivityLogs(nextLogs);
    safeSetItem(`fit_activity_${user.uid}`, JSON.stringify(nextLogs));

    // Save to Firestore user_workout_actions if real connection
    if (!isMockFirebase) {
      setDoc(doc(db, "user_workout_actions", newLog.id), {
        id: newLog.id,
        userId: user.uid,
        workoutId: normId,
        completed: true,
        loggedAt: newLog.date,
        notes: notes || ""
      }).catch(err => handleFirestoreError(err, OperationType.WRITE, `user_workout_actions/${newLog.id}`));
    }
  };

  const addWeightLogAction = async (weight: number, bodyFat?: number) => {
    if (!user) return;
    const newLog: WeightGoalLog = {
      id: "wgt_" + Math.random().toString(36).substring(7),
      date: new Date().toISOString().split("T")[0],
      weight,
      bodyFat
    };
    const nextLogs = [...weightLogs, newLog].sort((a,b) => a.date.localeCompare(b.date));
    setWeightLogs(nextLogs);
    safeSetItem(`fit_weights_${user.uid}`, JSON.stringify(nextLogs));

    // Save to Firestore progress_logs if real connection
    if (!isMockFirebase) {
      setDoc(doc(db, "progress_logs", newLog.id), {
        id: newLog.id,
        userId: user.uid,
        weight,
        bodyFat: bodyFat || null,
        date: newLog.date,
        notes: ""
      }).catch(err => handleFirestoreError(err, OperationType.WRITE, `progress_logs/${newLog.id}`));
    }
  };

  const addVitalsLogAction = async (
    vitalsDataOrRhr: number | {
      sleepDuration: number;
      hydrationGlasses?: number;
      restingHeartRate?: number;
      energyLevel?: number;
      notes?: string;
      date?: string;
    },
    legacySleep?: number,
    legacyDate?: string
  ) => {
    if (!user) return;
    let sleepDuration = 7.5;
    let hydrationGlasses = 8;
    let restingHeartRate: number | undefined = undefined;
    let energyLevel: number | undefined = undefined;
    let notes: string | undefined = undefined;
    let logDate = new Date().toISOString().split("T")[0];

    if (typeof vitalsDataOrRhr === "object" && vitalsDataOrRhr !== null) {
      sleepDuration = vitalsDataOrRhr.sleepDuration;
      hydrationGlasses = typeof vitalsDataOrRhr.hydrationGlasses === "number" ? vitalsDataOrRhr.hydrationGlasses : 8;
      restingHeartRate = vitalsDataOrRhr.restingHeartRate;
      energyLevel = vitalsDataOrRhr.energyLevel;
      notes = vitalsDataOrRhr.notes;
      if (vitalsDataOrRhr.date) logDate = vitalsDataOrRhr.date;
    } else {
      restingHeartRate = typeof vitalsDataOrRhr === "number" ? vitalsDataOrRhr : undefined;
      sleepDuration = typeof legacySleep === "number" ? legacySleep : 7.5;
      if (legacyDate) logDate = legacyDate;
    }

    const calcResult = calculateReadinessScore(sleepDuration, hydrationGlasses, restingHeartRate, energyLevel);

    const newLog: VitalsLog = {
      id: "vit_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      userId: user.uid,
      date: logDate,
      restingHeartRate: restingHeartRate || undefined,
      sleepDuration,
      hydrationGlasses,
      readinessScore: calcResult.score,
      energyLevel: energyLevel || undefined,
      notes: notes || undefined,
      createdAt: new Date().toISOString()
    };

    // Filter out existing log for same date if updating, or append
    const existingFiltered = vitalsLogs.filter(l => l.date !== newLog.date);
    const nextLogs = [...existingFiltered, newLog].sort((a,b) => a.date.localeCompare(b.date));
    setVitalsLogs(nextLogs);
    safeSetItem(`fit_vitals_${user.uid}`, JSON.stringify(nextLogs));

    if (!isMockFirebase) {
      setDoc(doc(db, "vitals_logs", newLog.id), {
        id: newLog.id,
        userId: user.uid,
        restingHeartRate: newLog.restingHeartRate || null,
        sleepDuration: newLog.sleepDuration,
        hydrationGlasses: newLog.hydrationGlasses,
        readinessScore: newLog.readinessScore,
        energyLevel: newLog.energyLevel || null,
        notes: newLog.notes || null,
        date: newLog.date,
        createdAt: newLog.createdAt || new Date().toISOString()
      }).catch(err => handleFirestoreError(err, OperationType.WRITE, `vitals_logs/${newLog.id}`));
    }
  };

  const deleteVitalsLogAction = async (logId: string) => {
    if (!user) return;
    const nextLogs = vitalsLogs.filter(l => l.id !== logId);
    setVitalsLogs(nextLogs);
    safeSetItem(`fit_vitals_${user.uid}`, JSON.stringify(nextLogs));

    if (!isMockFirebase) {
      deleteDoc(doc(db, "vitals_logs", logId))
        .catch(err => handleFirestoreError(err, OperationType.DELETE, `vitals_logs/${logId}`));
    }
  };

  const updateCalibrationGoalsAction = async (goalsUpdate: Partial<CalibrationGoals>) => {
    const activeUid = user ? user.uid : "guest";
    const updated: CalibrationGoals = {
      ...calibrationGoals,
      ...goalsUpdate,
      userId: activeUid,
      updatedAt: new Date().toISOString()
    };
    setCalibrationGoals(updated);
    safeSetItem(`fit_calibration_goals_${activeUid}`, JSON.stringify(updated));

    if (user && !isMockFirebase) {
      setDoc(doc(db, "calibration_goals", user.uid), {
        userId: user.uid,
        dailyHydrationGoal: updated.dailyHydrationGoal,
        dailySleepGoal: updated.dailySleepGoal,
        targetReadinessScore: updated.targetReadinessScore || 85,
        targetRestingHeartRate: updated.targetRestingHeartRate || 60,
        updatedAt: updated.updatedAt
      }, { merge: true }).catch(err => handleFirestoreError(err, OperationType.WRITE, `calibration_goals/${user.uid}`));
    }
  };

  const updateProfilePicture = async (photoURL: string) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      photoURL
    };
    await syncUserToStorageAndPlatform(updated);
  };

  // --- WEEKLY REPORTS HANDLERS ---

  const loadWeeklyReports = useCallback(async (targetUid?: string) => {
    const uid = targetUid || user?.uid;
    if (!uid) return;

    // Load from cache first
    const cached = localStorage.getItem(`fit_weekly_reports_${uid}`);
    if (cached) {
      try {
        setWeeklyReports(JSON.parse(cached));
      } catch (e) {}
    }

    if (!isMockFirebase) {
      try {
        const q = query(collection(db, "weekly_reports"), where("userId", "==", uid));
        const snapshot = await getDocs(q);
        const list: any[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        list.sort((a, b) => (b.sentAt || "").localeCompare(a.sentAt || ""));
        setWeeklyReports(list);
        safeSetItem(`fit_weekly_reports_${uid}`, JSON.stringify(list));
      } catch (err) {
        console.warn("Error fetching weekly reports from Firestore/client: ", err);
      }
    } else {
      if (!cached) {
        // seed a pretty demo report in mock mode
        const demoReport = {
          id: "demo_rep_1",
          userId: uid,
          email: user?.email || "athlete@alexfitness.com",
          subject: `AlexFitnessHub Weekly Progress Report: Keep Pushing, ${user?.displayName || 'Athlete'}!`,
          totalWorkouts: 4,
          totalWorkoutTimeMinutes: 60,
          milestones: ["Logged 4 workout sessions this week!", "Successfully maintained a stable target body weight!", "Laid the foundation for a life-changing fitness journey!"],
          sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          reportContent: `
# AlexFitnessHub Premium Weekly Performance Review
Hello **${user?.displayName || 'Athlete'}**,

Congratulations on wrapping up another elite training week! Consistency is the bedrock of athletic transformation, and your efforts are starting to yield measurable metabolic adaptations.

## 📊 Weekly Performance Metrics
*   **Total Exercises Logged**: 4 actions
*   **Estimated Training Volume**: 60 active minutes
*   **Starting Biometric Weight**: ${user?.weight || 80} kg
*   **Latest Biometric Weight**: ${user?.weight || 80} kg (Stable weight maintenance)

## 🏆 Progress Milestones Achieved
*   **Logged 4 workout sessions this week!**
*   **Successfully maintained a stable target body weight!**
*   **Laid the foundation for an elite fitness journey!**

---

## 💡 Alex's Custom Sports Science Advice
1.  **Biomechanical Eccentrics**: To maximize myofibrillar hypertrophy, ensure a controlled 3-second negative (eccentric) phase on all compound lifts. This increases micro-tears and accelerates metabolic conditioning.
2.  **Nutrition Calibration**: Prioritize 1.6g to 2.2g of protein per kilogram of bodyweight. Lean proteins such as egg whites, grilled chicken breast, and locally sourced beans/lentils are excellent for recovery.
3.  **Lemon Water & Cucumber protocol**: Hydrate actively with our signature formula (ambient water infused with fresh lemon and sliced cucumber rounds) to optimize cellular volume and liver detoxification post-workout.

## 🎯 Next Week's Battle Strategy
*   **Goal**: Target a 10% increase in estimated active minutes or add 1 additional logging checkpoint.
*   **Action**: Try loading one of our custom programs or search the video library for an active recovery routine!

*In health and strength,*  
**Alex**  
*Lead Sports Scientist & AI Head Coach, AlexFitnessHub*
`
        };
        const list = [demoReport];
        setWeeklyReports(list);
        safeSetItem(`fit_weekly_reports_${uid}`, JSON.stringify(list));
      }
    }
  }, [user?.uid, user?.email, user?.displayName, user?.weight]);

  const triggerWeeklyReportGeneration = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (!isMockFirebase) {
        const response = await fetch("/api/weekly-reports/trigger", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.uid,
            userEmail: user.email,
            displayName: user.displayName,
            activityLogs,
            weightLogs
          })
        });
        const resData = await response.json();
        if (resData.success && resData.report) {
          const nextReports = [resData.report, ...weeklyReports.filter(r => r.id !== resData.report.id)];
          setWeeklyReports(nextReports);
          safeSetItem(`fit_weekly_reports_${user.uid}`, JSON.stringify(nextReports));

          // Automatically trigger and queue Workout Summary email via Firebase Trigger Email Extension
          queueWorkoutSummaryEmail(
            user.email,
            user.displayName || "Athlete",
            resData.report.totalWorkouts || 0,
            resData.report.totalWorkoutTimeMinutes || 0,
            resData.report.milestones || [],
            ""
          ).catch(err => {
            console.warn("Could not queue weekly report summary email:", err);
          });
        } else {
          throw new Error(resData.error || "Failed to generate weekly progress report.");
        }
      } else {
        // Math in mock mode
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentLogs = activityLogs.filter(l => new Date(l.date) >= sevenDaysAgo);
        const totalWorkouts = recentLogs.length;
        const totalWorkoutTimeMinutes = recentLogs.reduce((acc, log) => {
          if (log.duration) {
            const m = log.duration.match(/\d+/);
            return acc + (m ? parseInt(m[0]) : 15);
          }
          return acc + 15;
        }, 0);

        const initialWeight = weightLogs[0]?.weight || user.weight || 80;
        const latestWeight = weightLogs[weightLogs.length - 1]?.weight || initialWeight;
        const weightDiff = parseFloat((latestWeight - initialWeight).toFixed(1));

        const milestones: string[] = [];
        if (totalWorkouts >= 1) milestones.push(`Logged ${totalWorkouts} workout sessions this week!`);
        if (totalWorkouts >= 4) milestones.push("Achieved 'Consistent Athlete' streak status (4+ exercises)!");
        if (weightDiff < 0) milestones.push(`Successfully lost ${Math.abs(weightDiff)} kg from starting point!`);
        else if (weightDiff === 0 && weightLogs.length > 1) milestones.push("Successfully maintained a stable target body weight!");
        else if (weightDiff > 0) milestones.push(`Gained ${weightDiff} kg of potential lean muscle tissue!`);
        if (weightLogs.length >= 3) milestones.push("Superb biometric logging frequency (3+ weight checkpoints)!");
        if (milestones.length === 0) milestones.push("Laid the foundation for a life-changing fitness journey!");

        const mockReport = {
          id: "rep_" + Math.random().toString(36).substring(7),
          userId: user.uid,
          email: user.email,
          subject: `AlexFitnessHub Weekly Progress Report: Keep Pushing, ${user.displayName || 'Athlete'}!`,
          totalWorkouts,
          totalWorkoutTimeMinutes,
          milestones,
          sentAt: new Date().toISOString(),
          reportContent: `
# AlexFitnessHub Premium Weekly Performance Review
Hello **${user.displayName || 'Athlete'}**,

Congratulations on wrapping up another elite training week! Consistency is the bedrock of athletic transformation, and your efforts are starting to yield measurable metabolic adaptations.

## 📊 Weekly Performance Metrics
*   **Total Exercises Logged**: ${totalWorkouts} actions
*   **Estimated Training Volume**: ${totalWorkoutTimeMinutes} active minutes
*   **Starting Biometric Weight**: ${initialWeight} kg
*   **Latest Biometric Weight**: ${latestWeight} kg (${weightDiff < 0 ? 'Lost' : 'Gained'} ${Math.abs(weightDiff)} kg)

## 🏆 Progress Milestones Achieved
${milestones.map(m => `*   **${m}**`).join("\n")}

---

## 💡 Alex's Custom Sports Science Advice
1.  **Biomechanical Eccentrics**: To maximize myofibrillar hypertrophy, ensure a controlled 3-second negative (eccentric) phase on all compound lifts. This increases micro-tears and accelerates metabolic conditioning.
2.  **Nutrition Calibration**: Prioritize 1.6g to 2.2g of protein per kilogram of bodyweight. Lean proteins such as egg whites, grilled chicken breast, and locally sourced beans/lentils are excellent for recovery.
3.  **Lemon Water & Cucumber protocol**: Hydrate actively with our signature formula (ambient water infused with fresh lemon and sliced cucumber rounds) to optimize cellular volume and liver detoxification post-workout.

## 🎯 Next Week's Battle Strategy
*   **Goal**: Target a 10% increase in estimated active minutes or add 1 additional logging checkpoint.
*   **Action**: Try loading one of our custom programs or search the video library for an active recovery routine!

*In health and strength,*  
**Alex**  
*Lead Sports Scientist & AI Head Coach, AlexFitnessHub*
`
        };

        const nextReports = [mockReport, ...weeklyReports];
        setWeeklyReports(nextReports);
        safeSetItem(`fit_weekly_reports_${user.uid}`, JSON.stringify(nextReports));

        // Automatically trigger and queue Workout Summary email via Firebase Trigger Email Extension in mock mode
        queueWorkoutSummaryEmail(
          user.email,
          user.displayName || "Athlete",
          totalWorkouts,
          totalWorkoutTimeMinutes,
          milestones,
          ""
        ).catch(err => {
          console.warn("Could not queue weekly report summary email in mock mode:", err);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS & PAYMENTS HANDLERS ---

  const upgradeWithPaystack = async (reference: string, plan?: "monthly" | "yearly" | "multi") => {
    setLoading(true);
    try {
      let token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      if (!token) {
        await new Promise(resolve => setTimeout(resolve, 800));
        token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      }

      const currentEmail = user?.email || auth.currentUser?.email || "";
      const currentUid = user?.uid || auth.currentUser?.uid || "";

      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ reference, email: currentEmail, plan, userId: currentUid })
      });
      const verifyRes = await res.json();
      
      if (verifyRes.success) {
        const verifiedProfile = verifyRes.profile;
        let resolvedUser: UserProfile;

        if (verifiedProfile) {
          resolvedUser = verifiedProfile;
        } else {
          let resolvedPlan: "monthly" | "yearly" | "multi" = plan || "monthly";
          let txMetadata = verifyRes.data?.metadata;
          if (typeof txMetadata === "string") {
            try { txMetadata = JSON.parse(txMetadata); } catch (e) {}
          }
          if (txMetadata && txMetadata.plan) {
            resolvedPlan = txMetadata.plan;
          }

          const baseUser = user || {
            uid: currentUid,
            email: currentEmail,
            displayName: currentEmail ? currentEmail.split("@")[0] : "Athlete",
            role: "user"
          };

          resolvedUser = {
            ...baseUser,
            subscriptionStatus: "premium",
            subscriptionTier: resolvedPlan === "multi" ? "monthly" : resolvedPlan,
            subscriptionPlan: resolvedPlan,
            paymentReference: reference,
            subscriptionExpiry: verifyRes.data?.subscriptionExpiry || new Date(Date.now() + (resolvedPlan === "yearly" ? 365 : 30) * 86400000).toISOString()
          } as UserProfile;
        }

        // Guarantee premium normalization across all fields
        const isAdmin = isEmailAdmin(resolvedUser.email);
        resolvedUser = {
          ...resolvedUser,
          role: isAdmin ? "admin" : "user", // Normal subscribers never receive admin role
          subscription: "premium",
          subscriptionStatus: "premium",
          isPremium: true,
          premiumAccess: true,
          accountType: isAdmin ? "Admin Athlete" : "Premium Athlete",
          badge: isAdmin ? "Admin Athlete" : "Premium Athlete",
          isFreeTrial: false,
          freeTrialStatus: "none",
          freeTrialDaysRemaining: 0,
          subscriptionTier: resolvedUser.subscriptionTier && resolvedUser.subscriptionTier !== "none" ? resolvedUser.subscriptionTier : "monthly"
        };

        await syncUserToStorageAndPlatform(resolvedUser);
        
        const activePlan = (resolvedUser.subscriptionPlan && resolvedUser.subscriptionPlan !== "none" ? resolvedUser.subscriptionPlan : "monthly") as "monthly" | "yearly" | "multi";
        const transaction: PaystackTransaction = {
          id: reference,
          reference,
          amount: verifyRes.data?.amount ? (verifyRes.data.amount / 100) : (activePlan === "yearly" ? 215989 : 19999),
          plan: activePlan,
          status: "success",
          paidAt: new Date().toISOString()
        };
        const nextTrans = [transaction, ...transactions];
        setTransactions(nextTrans);
        if (currentUid) {
          safeSetItem(`fit_trans_${currentUid}`, JSON.stringify(nextTrans));
        }
        return resolvedUser;
      } else {
        throw new Error(verifyRes.error || "Payment verification declined.");
      }
    } catch (err: any) {
      console.error("Paystack verification failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      subscriptionStatus: "free",
      subscriptionTier: "none",
      subscriptionExpiry: null
    };
    await syncUserToStorageAndPlatform(updated);
  };

  const updateProfileDetails = async (details: { weight?: number; height?: number; gender?: string; fitnessGoals?: string }) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      ...details
    };
    await syncUserToStorageAndPlatform(updated);
  };

  // --- COACH AI ASSISTANT CHAT LINK ---

  const sendCoachMessage = async (messageText: string) => {
    if (!user) return;
    
    // 1. Save user query node
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      message: messageText,
      timestamp: new Date().toISOString()
    };
    
    const draftChats = [...chatMessages, userMsg];
    setChatMessages(draftChats);
    safeSetItem(`fit_chats_${user.uid}`, JSON.stringify(draftChats));

    try {
      // 2. Query Gemini-certified proxy
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/gemini/coach", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          goal: user.fitnessGoals || "General body improvement",
          currentWeight: user.weight,
          targetWeight: user.height ? Number(user.height) - 105 : 75, // intelligent math
          query: messageText,
          history: chatMessages.slice(-8), // send last 8 turns of context
          userEmail: user.email
        })
      });

      const resText = await response.json();
      
      let finalMessage = "";
      if (!response.ok) {
        finalMessage = `### ⚠️ API Error (Status ${response.status})\n\n**Details:** ${resText.error || resText.message || "Failed to communicate with the AI engine."}`;
      } else if (resText.error) {
        finalMessage = `### ⚠️ AI Processing Error\n\n**Details:** ${resText.error}`;
      } else {
        finalMessage = resText.text || "I was unable to formulate a response. Let's try adjusting our routine direction!";
      }
      
      const coachMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: "model",
        message: finalMessage,
        timestamp: new Date().toISOString()
      };

      const finalChats = [...draftChats, coachMsg];
      setChatMessages(finalChats);
      safeSetItem(`fit_chats_${user.uid}`, JSON.stringify(finalChats));

    } catch (err: any) {
      console.error(err);
      const errMessage: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: "model",
        message: "Apologies, I'm experiencing high latency in my synthetic muscle-response cortex. Here's a quick coach tip: Focus on deep, slow concentric movements and ensure 1g of protein per pound of bodyweight today. Try sending again!",
        timestamp: new Date().toISOString()
      };
      setChatMessages([...draftChats, errMessage]);
    }
  };

  const clearCoachChat = () => {
    if (!user) return;
    setChatMessages([]);
    localStorage.removeItem(`fit_chats_${user.uid}`);
  };

  // --- ADMIN CUSTOMIZERS ---

  const logAdminAction = async (actionType: string, description: string, details?: any) => {
    if (!user || (!isEmailAdmin(user.email) && user.role !== "admin")) return;
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;
      await fetch("/api/admin/log-activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ actionType, description, details })
      });
      console.log(`[Admin Front Log] Registered admin action: ${actionType}`);
    } catch (err) {
      console.warn("Failed to log admin action on server:", err);
    }
  };

  const adminTogglePremium = (exerciseId: string) => {
    const updatedExercises = exercises.map(ex => {
      if (ex.id === exerciseId) {
        const nextPremium = !ex.isPremium;
        logAdminAction("TOGGLE_PREMIUM_EXERCISE", `Toggled premium status for exercise ID ${exerciseId} to ${nextPremium}`, { exerciseId, isPremium: nextPremium });
        return { ...ex, isPremium: nextPremium };
      }
      return ex;
    });
    setExercisesState(updatedExercises);
    safeSetItem("fit_exercises", JSON.stringify(updatedExercises));
  };

  const uploadExerciseMedia = async (exerciseId: string, mediaUrl: string | null, mediaType?: "image" | "video") => {
    let finalMediaUrl = mediaUrl;

    // 1. Persist to local server-side JSON file (and translate physical Base64 payload into static files)
    try {
      const token = await auth.currentUser?.getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/exercises/save-custom-media", {
        method: "POST",
        headers,
        body: JSON.stringify({
          exerciseId,
          customMediaUrl: mediaUrl,
          customMediaType: mediaType
        })
      });
      let data: any = {};
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const textErr = await res.text();
        data = { success: false, error: textErr || `Server returned status ${res.status}` };
      }
      if (!data.success) {
        console.warn("Local server save notice:", data.error);
      } else {
        console.log(`Saved custom exercise media to local server files.`);
        if (data.customMediaUrl) {
          finalMediaUrl = data.customMediaUrl;
        }
      }
    } catch (err) {
      console.error("Failed to save custom media to local server files:", err);
    }

    // 2. Update React Local Client State and LocalStorage with the clean local path
    const targetEx = exercises.find(e => e.id === exerciseId);

    const updatedExercises = exercises.map(ex => {
      const isMatch = ex.id === exerciseId ||
                      isExerciseMatch(exerciseId, ex.id) ||
                      isExerciseMatch(exerciseId, ex.name) ||
                      (targetEx && isExerciseMatch(targetEx.name, ex.name));

      if (isMatch) {
        return { 
          ...ex, 
          customMediaUrl: finalMediaUrl || undefined, 
          customMediaType: mediaType || undefined 
        };
      }
      return ex;
    });
    setExercisesState(updatedExercises);
    safeSetItem("fit_exercises", JSON.stringify(updatedExercises));

    // 3. Persist same clean path to real Cloud Firestore (so other users see it instantly across all matching variations)
    if (!isMockFirebase) {
      try {
        const matchingIds = updatedExercises.filter(ex => ex.customMediaUrl === (finalMediaUrl || undefined)).map(ex => ex.id);
        const uniqueIds = Array.from(new Set([exerciseId, ...matchingIds]));

        let safeFirestoreUrl = finalMediaUrl || null;
        if (safeFirestoreUrl && safeFirestoreUrl.startsWith("data:") && safeFirestoreUrl.length > 800000) {
          // Do not write raw base64 >800KB directly into Firestore document
          safeFirestoreUrl = null;
        }

        for (const mId of uniqueIds) {
          const docRef = doc(db, "exercises", mId);
          await setDoc(docRef, {
            id: mId,
            customMediaUrl: safeFirestoreUrl,
            customMediaType: mediaType || null,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
        console.log(`Saved custom exercise media to Cloud Firestore across ${uniqueIds.length} exercise documents!`);
      } catch (err) {
        console.error("Failed to save custom media to Cloud Firestore:", err);
      }
    }
  };

  const adminUpdateUserTier = async (uid: string, level: "free" | "premium", tier: "monthly" | "yearly" | "none") => {
    const editIndex = allSystemUsers.findIndex(u => u.uid === uid);
    if (editIndex !== -1) {
      const list = [...allSystemUsers];
      const targetUser = list[editIndex];
      const isAdmin = isEmailAdmin(targetUser.email);
      const isPrem = level === "premium";
      const now = new Date();
      const updatedUser: UserProfile = {
        ...targetUser,
        subscriptionStatus: level,
        subscription: level,
        subscriptionTier: tier,
        subscriptionPlan: tier,
        isPremium: isPrem,
        premiumAccess: isPrem,
        accountType: isAdmin ? "Admin Athlete" : (isPrem ? "Premium Athlete" : "Free Athlete"),
        badge: isAdmin ? "Admin Athlete" : (isPrem ? "Premium Athlete" : "Free Athlete"),
        isFreeTrial: false,
        freeTrialStatus: isPrem ? "none" : "expired",
        freeTrialDaysRemaining: 0,
        subscriptionExpiry: isPrem ? (targetUser.subscriptionExpiry || new Date(now.getTime() + (tier === "yearly" ? 365 : 30) * 86400000).toISOString()) : null
      };
      list[editIndex] = updatedUser;
      setAllSystemUsers(list);
      safeSetItem("all_system_users", JSON.stringify(list));
      
      logAdminAction("UPDATE_USER_TIER", `Updated user ${uid} tier to status: ${level}, tier: ${tier}`, { targetUid: uid, level, tier });

      // If editing current user, sync immediately
      if (user && user.uid === uid) {
        await syncUserToStorageAndPlatform(updatedUser);
      } else if (!isMockFirebase) {
        const { updateDoc, doc } = await import("firebase/firestore");
        await updateDoc(doc(db, "users", uid), {
          subscriptionStatus: updatedUser.subscriptionStatus,
          subscription: updatedUser.subscription,
          subscriptionTier: updatedUser.subscriptionTier,
          subscriptionPlan: updatedUser.subscriptionPlan,
          isPremium: updatedUser.isPremium,
          premiumAccess: updatedUser.premiumAccess,
          accountType: updatedUser.accountType,
          badge: updatedUser.badge,
          isFreeTrial: updatedUser.isFreeTrial,
          freeTrialStatus: updatedUser.freeTrialStatus,
          freeTrialDaysRemaining: updatedUser.freeTrialDaysRemaining,
          subscriptionExpiry: updatedUser.subscriptionExpiry
        }).catch(err => console.warn("Firestore admin tier update sync failed:", err));
      }
    }
  };

  const adminModifySubscription = async (uid: string, action: "activate" | "extend" | "suspend" | "cancel") => {
    const editIndex = allSystemUsers.findIndex(u => u.uid === uid);
    if (editIndex !== -1) {
      const list = [...allSystemUsers];
      const targetUser = list[editIndex];
      let updatedUser = { ...targetUser };
      const isAdmin = isEmailAdmin(targetUser.email);

      const now = new Date();
      if (action === "activate") {
        const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
        updatedUser = {
          ...updatedUser,
          subscriptionStatus: "premium",
          subscription: "premium",
          subscriptionTier: "monthly",
          subscriptionPlan: "monthly",
          isPremium: true,
          premiumAccess: true,
          accountType: isAdmin ? "Admin Athlete" : "Premium Athlete",
          badge: isAdmin ? "Admin Athlete" : "Premium Athlete",
          isFreeTrial: false,
          freeTrialStatus: "none",
          freeTrialDaysRemaining: 0,
          subscriptionActivationDate: now.toISOString(),
          subscriptionExpiry: expiry,
          paymentReference: "ADMIN_OVERRIDE_ACTIVATE_" + Math.random().toString(36).substring(2, 8).toUpperCase()
        };
      } else if (action === "extend") {
        let currentExpiry = updatedUser.subscriptionExpiry ? new Date(updatedUser.subscriptionExpiry) : now;
        if (currentExpiry < now) currentExpiry = now; // If already expired, extend from now
        const extended = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
        const resolvedTier = updatedUser.subscriptionTier === "none" || !updatedUser.subscriptionTier ? "monthly" : updatedUser.subscriptionTier;
        updatedUser = {
          ...updatedUser,
          subscriptionStatus: "premium",
          subscription: "premium",
          subscriptionTier: resolvedTier,
          subscriptionPlan: updatedUser.subscriptionPlan || resolvedTier,
          isPremium: true,
          premiumAccess: true,
          accountType: isAdmin ? "Admin Athlete" : "Premium Athlete",
          badge: isAdmin ? "Admin Athlete" : "Premium Athlete",
          isFreeTrial: false,
          freeTrialStatus: "none",
          freeTrialDaysRemaining: 0,
          subscriptionExpiry: extended,
          subscriptionActivationDate: updatedUser.subscriptionActivationDate || now.toISOString()
        };
      } else if (action === "suspend") {
        updatedUser = {
          ...updatedUser,
          subscriptionStatus: "free",
          subscription: "free",
          subscriptionTier: "none",
          subscriptionPlan: "none",
          isPremium: false,
          premiumAccess: false,
          accountType: isAdmin ? "Admin Athlete" : "Free Athlete",
          badge: isAdmin ? "Admin Athlete" : "Free Athlete",
          isFreeTrial: false,
          freeTrialStatus: "expired",
          freeTrialDaysRemaining: 0,
          subscriptionExpiry: now.toISOString() // past or now date
        };
      } else if (action === "cancel") {
        updatedUser = {
          ...updatedUser,
          subscriptionStatus: "free",
          subscription: "free",
          subscriptionTier: "none",
          subscriptionPlan: "none",
          isPremium: false,
          premiumAccess: false,
          accountType: isAdmin ? "Admin Athlete" : "Free Athlete",
          badge: isAdmin ? "Admin Athlete" : "Free Athlete",
          isFreeTrial: false,
          freeTrialStatus: "expired",
          freeTrialDaysRemaining: 0,
          subscriptionExpiry: null
        };
      }

      list[editIndex] = updatedUser;
      setAllSystemUsers(list);
      safeSetItem("all_system_users", JSON.stringify(list));

      logAdminAction("MODIFY_USER_SUBSCRIPTION", `Modified subscription of user ${uid} to status: ${updatedUser.subscriptionStatus}, tier: ${updatedUser.subscriptionTier} (Action: ${action})`, { targetUid: uid, action, email: updatedUser.email });

      // Synchronize immediately if targeting current user
      if (user && user.uid === uid) {
        await syncUserToStorageAndPlatform(updatedUser);
      } else if (!isMockFirebase) {
        const { updateDoc, doc } = await import("firebase/firestore");
        await updateDoc(doc(db, "users", uid), {
          subscriptionStatus: updatedUser.subscriptionStatus,
          subscription: updatedUser.subscription,
          subscriptionTier: updatedUser.subscriptionTier,
          subscriptionPlan: updatedUser.subscriptionPlan || null,
          isPremium: updatedUser.isPremium,
          premiumAccess: updatedUser.premiumAccess,
          accountType: updatedUser.accountType,
          badge: updatedUser.badge,
          isFreeTrial: updatedUser.isFreeTrial,
          freeTrialStatus: updatedUser.freeTrialStatus,
          freeTrialDaysRemaining: updatedUser.freeTrialDaysRemaining,
          subscriptionActivationDate: updatedUser.subscriptionActivationDate || null,
          subscriptionExpiry: updatedUser.subscriptionExpiry || null,
          paymentReference: updatedUser.paymentReference || null
        }).catch(err => console.warn("Firestore admin modify subscription sync failed:", err));
      }
    }
  };

  function setThemeAction(t: "light" | "dark") {
    // Locked to light mode
  }

  // --- SEED SECTIONS ---
  const loadLocalCommunitySeed = () => {
    const cached = localStorage.getItem("fit_community_posts");
    if (cached) {
      try {
        setCommunityPosts(JSON.parse(cached));
      } catch (e) {
        setCommunityPosts([]);
      }
    } else {
      const seedPosts: CommunityPost[] = [
        {
          id: "seed_post_1",
          userId: "user1",
          userDisplayName: "David Beck",
          userEmail: "david.beck@gmail.com",
          content: "Just completed my second week of the Gladiator Powerbuilding routine. Down to 80.5kg and muscle definition is peaking! The customized training tips are so authentic.",
          category: "Transformation Story",
          likes: ["user2", "user3"],
          comments: [
            { id: "c1", userId: "user2", userDisplayName: "Clara Oswald", content: "Super proud of your consistency, David! Keep squeezing those traps!", createdAt: new Date(Date.now() - 3600000).toISOString() }
          ],
          status: "active",
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "seed_post_2",
          userId: "user3",
          userDisplayName: "Sam Muscles",
          userEmail: "samuel.strong@gmail.com",
          content: "First time hitting a solid 140kg barbell back squat squat bench series today! Absolute landmark performance. Let's conquer the weekend warriors!",
          category: "Achievement",
          likes: ["user1"],
          comments: [],
          status: "active",
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      setCommunityPosts(seedPosts);
      safeSetItem("fit_community_posts", JSON.stringify(seedPosts));
    }
  };

  const loadLocalTestimonialSeed = () => {
    const cached = localStorage.getItem("fit_testimonials");
    if (cached) {
      try {
        setTestimonials(JSON.parse(cached));
      } catch (e) {
        setTestimonials([]);
      }
    } else {
      const seedStories: Testimonial[] = [
        {
          id: "story_1",
          userId: "user1",
          userDisplayName: "David Beck",
          userEmail: "david.beck@gmail.com",
          category: "Weight Loss",
          rating: 5,
          content: "AlexFitnessHub has revolutionized my approach to diet. As an African fitness enthusiast, getting macros calibrated around plantains, egusi soup, and sweet potatoes with accurate counts was impossible until this platform. The AI Coach recommendations are incredibly precise!",
          approved: true,
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "story_2",
          userId: "user3",
          userDisplayName: "Sam Muscles",
          userEmail: "samuel.strong@gmail.com",
          category: "Muscle Building",
          rating: 5,
          content: "The custom exercise database is unmatched. Detailed instructions, alternative plans, and common error checklists kept me completely injury-free as I bulked to 90kg. Premium is gold standard!",
          approved: true,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setTestimonials(seedStories);
      safeSetItem("fit_testimonials", JSON.stringify(seedStories));
    }
  };

  const loadPopupTestimonials = async () => {
    const cached = localStorage.getItem("fit_popup_testimonials");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length === samplePopupTestimonials.length) {
          setPopupTestimonials(parsed);
        }
      } catch (err) {
        console.warn("Error parsing cached popup testimonials", err);
      }
    }

    if (!isMockFirebase) {
      try {
        const querySnapshot = await getDocs(collection(db, "popup_testimonials"));
        const list: PopupTestimonial[] = [];
        querySnapshot.forEach((doc) => {
          list.push({ ...doc.data() as PopupTestimonial, id: doc.id });
        });
        
        if (list.length === samplePopupTestimonials.length) {
          setPopupTestimonials(list);
          safeSetItem("fit_popup_testimonials", JSON.stringify(list));
        } else {
          // Re-seed if length changed or DB has old schema
          await seedFirestorePopupTestimonials();
        }
      } catch (error) {
        console.warn("Error reading popup_testimonials from Firestore, falling back to seed:", error);
        seedLocalPopupTestimonials();
      }
    } else {
      seedLocalPopupTestimonials();
    }
  };

  const seedLocalPopupTestimonials = () => {
    setPopupTestimonials(samplePopupTestimonials);
    safeSetItem("fit_popup_testimonials", JSON.stringify(samplePopupTestimonials));
  };

  const seedFirestorePopupTestimonials = async () => {
    try {
      const promises = samplePopupTestimonials.map(async (item) => {
        const docRef = doc(db, "popup_testimonials", item.id);
        await setDoc(docRef, item);
      });
      await Promise.all(promises);
      setPopupTestimonials(samplePopupTestimonials);
      safeSetItem("fit_popup_testimonials", JSON.stringify(samplePopupTestimonials));
    } catch (err) {
      console.warn("Failed to seed firestore popup testimonials (quota limits may apply):", err);
      seedLocalPopupTestimonials();
    }
  };

  // --- ACTIONS ---
  const completeOnboarding = async (onboardingData: Partial<UserProfile>) => {
    if (!user) return;
    const userWeight = onboardingData.weight || user.weight || 75;
    let baseGoal = userWeight * 35;
    if (onboardingData.activityLevel?.includes("Very") || onboardingData.activityLevel?.includes("Super")) {
      baseGoal += 500;
    }
    const finalWaterGoal = Math.round(baseGoal);

    const updated: UserProfile = {
      ...user,
      ...onboardingData,
      onboarded: true,
      waterGoal: finalWaterGoal,
      waterIntakeToday: 0,
      waterLastLogged: new Date().toISOString().split("T")[0]
    };
    await syncUserToStorageAndPlatform(updated);
  };

  const updateWaterIntake = async (amountMl: number) => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    const isNewDay = user.waterLastLogged !== today;
    
    const currIntake = isNewDay ? 0 : (user.waterIntakeToday || 0);
    const updated: UserProfile = {
      ...user,
      waterIntakeToday: Math.max(0, currIntake + amountMl),
      waterLastLogged: today
    };
    await syncUserToStorageAndPlatform(updated);
  };

  const addCommunityPost = async (content: string, category: "Progress Picture" | "Workout Result" | "Transformation Story" | "Achievement" | "General Discussion" | "Challenge", imageUrl?: string) => {
    if (!user) return;
    const newPost: CommunityPost = {
      id: Math.random().toString(36).substring(7),
      userId: user.uid,
      userDisplayName: user.displayName,
      userEmail: user.email,
      content,
      category,
      imageUrl,
      likes: [],
      comments: [],
      reports: [],
      status: "active",
      createdAt: new Date().toISOString()
    };

    const nextPosts = [newPost, ...communityPosts];
    setCommunityPosts(nextPosts);
    safeSetItem("fit_community_posts", JSON.stringify(nextPosts));

    if (!isMockFirebase) {
      try {
        await setDoc(doc(db, "community_posts", newPost.id), newPost);
      } catch (err) {
        console.warn("Firestore sync failed, relying on local:", err);
      }
    }
  };

  const likePost = async (postId: string) => {
    if (!user) return;
    const nextPosts = communityPosts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(user.uid);
        const nextLikes = isLiked
          ? post.likes.filter(id => id !== user.uid)
          : [...post.likes, user.uid];
        const nextPost = { ...post, likes: nextLikes };

        if (!isMockFirebase) {
          updateDoc(doc(db, "community_posts", postId), { likes: nextLikes })
            .catch(err => console.warn(err));
        }
        return nextPost;
      }
      return post;
    });
    setCommunityPosts(nextPosts);
    safeSetItem("fit_community_posts", JSON.stringify(nextPosts));
  };

  const commentOnPost = async (postId: string, commentContent: string) => {
    if (!user) return;
    const nextComment = {
      id: Math.random().toString(36).substring(7),
      userId: user.uid,
      userDisplayName: user.displayName,
      content: commentContent,
      createdAt: new Date().toISOString()
    };

    const nextPosts = communityPosts.map(post => {
      if (post.id === postId) {
        const nextComments = [...post.comments, nextComment];
        const nextPost = { ...post, comments: nextComments };

        if (!isMockFirebase) {
          updateDoc(doc(db, "community_posts", postId), { comments: nextComments })
            .catch(err => console.warn(err));
        }
        return nextPost;
      }
      return post;
    });
    setCommunityPosts(nextPosts);
    safeSetItem("fit_community_posts", JSON.stringify(nextPosts));
  };

  const reportPost = async (postId: string) => {
    if (!user) return;
    const nextPosts = communityPosts.map(post => {
      if (post.id === postId) {
        const reportsList = post.reports || [];
        const nextReports = reportsList.includes(user.uid) ? reportsList : [...reportsList, user.uid];
        const autoMod = nextReports.length >= 3;
        const nextStatus = autoMod ? ("reported" as "active" | "moderated" | "reported") : post.status;
        const nextPost = { ...post, reports: nextReports, status: nextStatus };

        if (!isMockFirebase) {
          updateDoc(doc(db, "community_posts", postId), { reports: nextReports, status: nextStatus })
            .catch(err => console.warn(err));
        }
        return nextPost;
      }
      return post;
    });
    setCommunityPosts(nextPosts);
    safeSetItem("fit_community_posts", JSON.stringify(nextPosts));
  };

  const moderatePost = async (postId: string, action: "approve" | "delete") => {
    if (!user || user.role !== "admin") return;
    let nextPosts: CommunityPost[];
    if (action === "delete") {
      nextPosts = communityPosts.filter(p => p.id !== postId);
      if (!isMockFirebase) {
        deleteDoc(doc(db, "community_posts", postId)).catch(err => console.warn(err));
      }
    } else {
      nextPosts = communityPosts.map(post => {
        if (post.id === postId) {
          const nextPost: CommunityPost = { ...post, status: "active", reports: [] };
          if (!isMockFirebase) {
            updateDoc(doc(db, "community_posts", postId), { status: "active", reports: [] })
              .catch(err => console.warn(err));
          }
          return nextPost;
        }
        return post;
      });
    }
    setCommunityPosts(nextPosts);
    safeSetItem("fit_community_posts", JSON.stringify(nextPosts));
  };

  const submitTestimonial = async (category: "Weight Loss" | "Muscle Building" | "General Journey" | "Transformation Story", rating: number, content: string, beforeImageUrl?: string, afterImageUrl?: string) => {
    if (!user) return;
    const newTestimonial: Testimonial = {
      id: Math.random().toString(36).substring(7),
      userId: user.uid,
      userDisplayName: user.displayName,
      userEmail: user.email,
      category,
      rating,
      content,
      beforeImageUrl,
      afterImageUrl,
      approved: false,
      createdAt: new Date().toISOString()
    };

    const nextStories = [newTestimonial, ...testimonials];
    setTestimonials(nextStories);
    safeSetItem("fit_testimonials", JSON.stringify(nextStories));

    if (!isMockFirebase) {
      try {
        await setDoc(doc(db, "testimonials", newTestimonial.id), newTestimonial);
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const approveTestimonial = async (testimonialId: string) => {
    if (!user || user.role !== "admin") return;
    const nextStories = testimonials.map(t => {
      if (t.id === testimonialId) {
        const nextT = { ...t, approved: true };
        if (!isMockFirebase) {
          updateDoc(doc(db, "testimonials", testimonialId), { approved: true })
            .catch(err => console.warn(err));
        }
        return nextT;
      }
      return t;
    });
    setTestimonials(nextStories);
    safeSetItem("fit_testimonials", JSON.stringify(nextStories));
  };

  const deleteTestimonial = async (testimonialId: string) => {
    if (!user || user.role !== "admin") return;
    const nextStories = testimonials.filter(t => t.id !== testimonialId);
    setTestimonials(nextStories);
    safeSetItem("fit_testimonials", JSON.stringify(nextStories));
    if (!isMockFirebase) {
      deleteDoc(doc(db, "testimonials", testimonialId)).catch(err => console.warn(err));
    }
  };

  const addPopupTestimonial = async (t: Omit<PopupTestimonial, "id" | "created_at">) => {
    const id = "testimonial-" + Date.now();
    const newTestimonial: PopupTestimonial = {
      ...t,
      id,
      created_at: new Date().toISOString()
    };

    const nextList = [newTestimonial, ...popupTestimonials];
    setPopupTestimonials(nextList);
    safeSetItem("fit_popup_testimonials", JSON.stringify(nextList));

    if (!isMockFirebase) {
      try {
        await setDoc(doc(db, "popup_testimonials", id), newTestimonial);
      } catch (err) {
        console.warn("Error saving testimonial to firestore: ", err);
      }
    }
  };

  const updatePopupTestimonial = async (id: string, updatedFields: Partial<PopupTestimonial>) => {
    const nextList = popupTestimonials.map((item) => {
      if (item.id === id) {
        return { ...item, ...updatedFields };
      }
      return item;
    });

    setPopupTestimonials(nextList);
    safeSetItem("fit_popup_testimonials", JSON.stringify(nextList));

    if (!isMockFirebase) {
      try {
        const docRef = doc(db, "popup_testimonials", id);
        await updateDoc(docRef, updatedFields as any);
      } catch (err) {
        console.warn("Error updating testimonial in firestore: ", err);
      }
    }
  };

  const deletePopupTestimonial = async (id: string) => {
    const nextList = popupTestimonials.filter((item) => item.id !== id);
    setPopupTestimonials(nextList);
    safeSetItem("fit_popup_testimonials", JSON.stringify(nextList));

    if (!isMockFirebase) {
      try {
        await deleteDoc(doc(db, "popup_testimonials", id));
      } catch (err) {
        console.warn("Error deleting testimonial from firestore: ", err);
      }
    }
  };

  const saveCustomProgram = async (programData: Omit<CustomProgram, "userId" | "id" | "createdAt">) => {
    if (!user) throw new Error("Please sign in to build a custom program.");
    if (user.subscriptionStatus !== "premium") {
      throw new Error("Custom Workout Program Builder is exclusive to Premium Elite Athletes. Please upgrade your tier.");
    }

    const newProgram: CustomProgram = {
      ...programData,
      id: "cust_prog_" + Math.random().toString(36).substring(7),
      userId: user.uid,
      createdAt: new Date().toISOString()
    };

    const nextPrograms = [newProgram, ...customPrograms];
    setCustomPrograms(nextPrograms);
    safeSetItem(`fit_custom_programs_${user.uid}`, JSON.stringify(nextPrograms));

    if (!isMockFirebase) {
      try {
        await setDoc(doc(db, "custom_programs", newProgram.id), newProgram);
      } catch (err) {
        console.warn("Firestore error saving custom program, relying on local cache:", err);
      }
    }
  };

  const updateCustomProgram = async (updatedProgram: CustomProgram) => {
    if (!user) return;
    const nextPrograms = customPrograms.map(p => p.id === updatedProgram.id ? updatedProgram : p);
    setCustomPrograms(nextPrograms);
    safeSetItem(`fit_custom_programs_${user.uid}`, JSON.stringify(nextPrograms));

    if (!isMockFirebase) {
      try {
        await setDoc(doc(db, "custom_programs", updatedProgram.id), updatedProgram);
      } catch (err) {
        console.warn("Firestore error updating custom program:", err);
      }
    }
  };

  const deleteCustomProgram = async (id: string) => {
    if (!user) return;
    const nextPrograms = customPrograms.filter(p => p.id !== id);
    setCustomPrograms(nextPrograms);
    safeSetItem(`fit_custom_programs_${user.uid}`, JSON.stringify(nextPrograms));

    if (!isMockFirebase) {
      try {
        await deleteDoc(doc(db, "custom_programs", id));
      } catch (err) {
        console.warn("Firestore error deleting custom program:", err);
      }
    }
  };

  const addExerciseToLibrary = async (newEx: Exercise) => {
    setExercisesState(prev => {
      if (prev.some(e => e.name.toLowerCase() === newEx.name.toLowerCase())) {
        return prev;
      }
      const updated = [newEx, ...prev];
      safeSetItem("fit_exercises", JSON.stringify(updated));
      return updated;
    });

    if (!isMockFirebase) {
      try {
        await setDoc(doc(db, "generated_exercises", newEx.id), newEx);
      } catch (err) {
        console.warn("Firestore error saving generated exercise:", err);
      }
    }
  };

  const editExercise = async (exerciseId: string, updates: Partial<Exercise>): Promise<boolean> => {
    try {
      const updatedExercises = exercises.map(ex => {
        if (ex.id === exerciseId) {
          const next = { ...ex, ...updates };
          if (updates.recommendedSets || updates.recommendedReps) {
            const nextSets = updates.recommendedSets || ex.recommendedSets || '3';
            const nextReps = updates.recommendedReps || ex.recommendedReps || '10-12';
            next.recommendedSets = nextSets;
            next.recommendedReps = nextReps;
            next.recommendedSetsReps = `${nextSets} Sets x ${nextReps} Reps`;
          }
          return next;
        }
        return ex;
      });
      setExercisesState(updatedExercises);
      safeSetItem("fit_exercises", JSON.stringify(updatedExercises));

      // Persist to server API
      try {
        const token = await auth.currentUser?.getIdToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        await fetch("/api/exercises/update", {
          method: "POST",
          headers,
          body: JSON.stringify({ exerciseId, updates })
        });
      } catch (e) {
        console.warn("Server exercise update notice:", e);
      }

      // Persist to Firestore
      if (!isMockFirebase) {
        try {
          await setDoc(doc(db, "exercises", exerciseId), { id: exerciseId, ...updates }, { merge: true });
        } catch (dbErr) {
          console.warn("Firestore exercise update notice:", dbErr);
        }
      }

      logAdminAction("EDIT_WORKOUT", `Edited workout ${exerciseId} (Name: ${updates.name || 'same'}, Sets: ${updates.recommendedSets || 'same'}, Reps: ${updates.recommendedReps || 'same'})`, { exerciseId, updates });
      return true;
    } catch (err) {
      console.error("Failed to edit exercise:", err);
      return false;
    }
  };

  const addWorkout = async (workoutData: Partial<Exercise>): Promise<Exercise> => {
    const newId = workoutData.id || `custom_ex_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const sets = workoutData.recommendedSets || "3";
    const reps = workoutData.recommendedReps || "10-12";
    const setsReps = workoutData.recommendedSetsReps || `${sets} Sets x ${reps} Reps`;

    const fullExercise: Exercise = {
      id: newId,
      name: workoutData.name || "Custom Workout",
      muscleGroups: workoutData.muscleGroups && workoutData.muscleGroups.length > 0 ? workoutData.muscleGroups : [workoutData.category || "Full Body"],
      difficulty: workoutData.difficulty || "Intermediate",
      instructions: workoutData.instructions && workoutData.instructions.length > 0 ? workoutData.instructions : [
        `Set up your starting position and brace your core tightly.`,
        `Execute ${workoutData.name || 'the exercise'} through the full range of motion.`,
        `Hold contraction at peak for 1 second, then lower under control.`
      ],
      equipment: workoutData.equipment && workoutData.equipment.length > 0 ? workoutData.equipment : ["Bodyweight"],
      category: workoutData.category || "Gym Workouts",
      categories: workoutData.categories && workoutData.categories.length > 0 ? workoutData.categories : [workoutData.category || "Gym Workouts"],
      commonMistakes: workoutData.commonMistakes || ["Rushing the movement or using excessive momentum."],
      safetyTips: workoutData.safetyTips || ["Maintain a neutral spine and controlled breathing."],
      alternativeExercises: workoutData.alternativeExercises || ["Standard Pushups"],
      progressionVariations: workoutData.progressionVariations || ["Increase resistance or hold eccentric count for 3 seconds."],
      isPremium: workoutData.isPremium !== undefined ? workoutData.isPremium : true,
      startingPosition: workoutData.startingPosition || `Assume stable starting stance with core braced.`,
      movementExecution: workoutData.movementExecution || `Execute deliberate contraction through target muscle group.`,
      finishingPosition: workoutData.finishingPosition || `Return smoothly to starting position.`,
      regressionVariations: workoutData.regressionVariations || ["Perform with lighter load or bodyweight assistance."],
      musclesWorked: workoutData.musclesWorked || [workoutData.category || "Full Body"],
      gifUrl: workoutData.customMediaUrl || workoutData.gifUrl || workoutData.imageUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      imageUrl: workoutData.customMediaUrl || workoutData.imageUrl || workoutData.gifUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      customMediaUrl: workoutData.customMediaUrl,
      customMediaType: workoutData.customMediaType || "image",
      description: workoutData.description || `${workoutData.name} targets key muscular chains to build strength and hypertrophy.`,
      duration: workoutData.duration || "45s",
      recommendedSets: sets,
      recommendedReps: reps,
      recommendedSetsReps: setsReps,
      restTime: workoutData.restTime || "60s",
      caloriesBurned: workoutData.caloriesBurned || 110,
      benefits: workoutData.benefits || ["Increases functional power and muscular endurance."],
      trainerTips: workoutData.trainerTips || "Focus on intense mind-muscle connection and controlled tempo.",
      safetyNotes: workoutData.safetyNotes || "Warm up thoroughly before working sets.",
      ...workoutData
    };

    setExercisesState(prev => {
      const next = [fullExercise, ...prev.filter(e => e.id !== newId)];
      safeSetItem("fit_exercises", JSON.stringify(next));
      return next;
    });

    // Save to server
    try {
      const token = await auth.currentUser?.getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      await fetch("/api/exercises/create", {
        method: "POST",
        headers,
        body: JSON.stringify({ workout: fullExercise })
      });
    } catch (e) {
      console.warn("Server workout creation notice:", e);
    }

    // Save to Firestore
    if (!isMockFirebase) {
      try {
        await setDoc(doc(db, "exercises", newId), fullExercise);
        await setDoc(doc(db, "generated_exercises", newId), fullExercise);
      } catch (dbErr) {
        console.warn("Firestore workout creation notice:", dbErr);
      }
    }

    logAdminAction("ADD_WORKOUT", `Created new workout "${fullExercise.name}" with Sets: ${sets}, Reps: ${reps}`, { workout: fullExercise });
    return fullExercise;
  };

  const deleteWorkout = async (exerciseId: string): Promise<boolean> => {
    setExercisesState(prev => {
      const next = prev.filter(e => e.id !== exerciseId);
      safeSetItem("fit_exercises", JSON.stringify(next));
      return next;
    });

    try {
      const token = await auth.currentUser?.getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      await fetch("/api/exercises/delete", {
        method: "POST",
        headers,
        body: JSON.stringify({ exerciseId })
      });
    } catch (e) {}

    if (!isMockFirebase) {
      try {
        await deleteDoc(doc(db, "exercises", exerciseId)).catch(() => {});
        await deleteDoc(doc(db, "generated_exercises", exerciseId)).catch(() => {});
      } catch (e) {}
    }
    return true;
  };

  // Challenges CRUD Operations
  const addCustomChallenge = async (challengeData: Partial<PremiumChallenge>): Promise<PremiumChallenge> => {
    const newId = challengeData.id || `chal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const fullChallenge: PremiumChallenge = {
      id: newId,
      title: challengeData.title || "Elite Fitness Challenge",
      description: challengeData.description || "Comprehensive multi-phase workout challenge designed for peak performance.",
      category: challengeData.category || "Hypertrophy",
      goal: challengeData.goal || challengeData.description || "Build strength and transform body composition.",
      image: challengeData.image || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      badgeId: challengeData.badgeId || `badge_${newId}`,
      badgeName: challengeData.badgeName || `${challengeData.title || 'Challenge'} Champion`,
      badgeColor: challengeData.badgeColor || "from-amber-500 to-red-600",
      durationDays: Number(challengeData.durationDays) || 30,
      isPremium: challengeData.isPremium !== undefined ? Boolean(challengeData.isPremium) : true,
      workouts: Array.isArray(challengeData.workouts) ? challengeData.workouts : [],
      createdAt: new Date().toISOString(),
      createdBy: user?.email || "admin",
      isCustom: true,
      ...challengeData
    };

    setCustomChallenges(prev => {
      const next = [fullChallenge, ...prev.filter(c => c.id !== newId)];
      safeSetItem("fit_custom_challenges", JSON.stringify(next));
      return next;
    });

    // Save to server
    try {
      const token = await auth.currentUser?.getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      await fetch("/api/challenges/save", {
        method: "POST",
        headers,
        body: JSON.stringify({ challenge: fullChallenge })
      });
    } catch (e) {
      console.warn("Server challenge save notice:", e);
    }

    // Save to Firestore
    if (!isMockFirebase) {
      try {
        await setDoc(doc(db, "challenges", newId), fullChallenge);
      } catch (dbErr) {
        console.warn("Firestore challenge save notice:", dbErr);
      }
    }

    logAdminAction("CREATE_CHALLENGE", `Created challenge "${fullChallenge.title}" with ${fullChallenge.workouts?.length || 0} workouts`, { challenge: fullChallenge });
    return fullChallenge;
  };

  const updateCustomChallenge = async (challengeId: string, updates: Partial<PremiumChallenge>): Promise<boolean> => {
    let updatedObj: PremiumChallenge | null = null;
    setCustomChallenges(prev => {
      const next = prev.map(c => {
        if (c.id === challengeId) {
          updatedObj = { ...c, ...updates };
          return updatedObj;
        }
        return c;
      });
      safeSetItem("fit_custom_challenges", JSON.stringify(next));
      return next;
    });

    if (updatedObj) {
      try {
        const token = await auth.currentUser?.getIdToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        await fetch("/api/challenges/save", {
          method: "POST",
          headers,
          body: JSON.stringify({ challenge: updatedObj })
        });
      } catch (e) {}

      if (!isMockFirebase) {
        try {
          await setDoc(doc(db, "challenges", challengeId), updatedObj, { merge: true });
        } catch (e) {}
      }
    }
    return true;
  };

  const deleteCustomChallenge = async (challengeId: string): Promise<boolean> => {
    setCustomChallenges(prev => {
      const next = prev.filter(c => c.id !== challengeId);
      safeSetItem("fit_custom_challenges", JSON.stringify(next));
      return next;
    });

    try {
      const token = await auth.currentUser?.getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      await fetch(`/api/challenges/${challengeId}`, {
        method: "DELETE",
        headers
      });
    } catch (e) {}

    if (!isMockFirebase) {
      try {
        await deleteDoc(doc(db, "challenges", challengeId));
      } catch (e) {}
    }
    return true;
  };

  return (
    <AppContext.Provider value={{
      user,
      loading,
      theme,
      setTheme: setThemeAction,
      currentView,
      setView,
      savedWorkouts,
      activityLogs,
      weightLogs,
      transactions,
      chatMessages,
      exercises,
      isBlockedUser,
      authDatabaseError,
      setAuthDatabaseError,
      
      communityPosts,
      testimonials,
      
      loginWithGoogle,
      loginWithApple,
      signUpEmail,
      loginEmail,
      sendPasswordReset,
      logout,
      
      updateProfileDetails,
      completeOnboarding,
      toggleSaveWorkout,
      logWorkoutCompletion,
      addWeightLogAction,
      updateWaterIntake,
      
      vitalsLogs,
      calibrationGoals,
      updateCalibrationGoalsAction,
      addVitalsLogAction,
      deleteVitalsLogAction,
      updateProfilePicture,
      
      upgradeWithPaystack,
      cancelSubscription,
      
      sendCoachMessage,
      clearCoachChat,
      
      addCommunityPost,
      likePost,
      commentOnPost,
      reportPost,
      moderatePost,
      submitTestimonial,
      approveTestimonial,
      deleteTestimonial,

      customPrograms,
      saveCustomProgram,
      updateCustomProgram,
      deleteCustomProgram,

      popupTestimonials,
      addPopupTestimonial,
      updatePopupTestimonial,
      deletePopupTestimonial,
      
      adminTogglePremium,
      adminUpdateUserTier,
      adminModifySubscription,
      allSystemUsers,
      uploadExerciseMedia,
      addExerciseToLibrary,
      editExercise,
      addWorkout,
      deleteWorkout,

      customChallenges,
      allChallenges,
      addCustomChallenge,
      updateCustomChallenge,
      deleteCustomChallenge,
      
      weeklyReports,
      loadWeeklyReports,
      triggerWeeklyReportGeneration,
      workoutFilters,
      setWorkoutFilters,
      programProgress,
      enrollProgram,
      updateProgramProgress,
      recordProgramStopPoint,
      markProgramWorkoutComplete,
      resumeProgram,
      getActiveEnrolledPrograms
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be inside AppProvider");
  return context;
}
