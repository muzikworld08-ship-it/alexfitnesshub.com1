import { ProgramId, ProgramMetadata, ChallengeExerciseItem, DayWorkoutMeta, DayExecutionPlan } from "../types/challengeEngine";
import { Exercise, EXERCISES } from "./exercises";
import { buildDynamicDayPlan } from "../utils/dynamicWorkoutEngine";

// Clean, empty legacy pools to eliminate all old exercises and third-party GIFs
export const HOME_UPPER_BODY_EXERCISES: any[] = [];
export const HOME_LEGS_GLUTES_EXERCISES: any[] = [];
export const HOME_CARDIO_EXERCISES: any[] = [];
export const HOME_BACK_EXERCISES: any[] = [];
export const HOME_CORE_ABS_EXERCISES: any[] = [];
export const HOME_MOBILITY_EXERCISES: any[] = [];
export const HOME_180_EXERCISES_POOL: any[] = [];

export const BELLY_CORE_EXERCISES: any[] = [];
export const BELLY_HIIT_EXERCISES: any[] = [];
export const BELLY_CARDIO_EXERCISES: any[] = [];
export const BELLY_OBLIQUES_EXERCISES: any[] = [];
export const BELLY_CONDITIONING_EXERCISES: any[] = [];
export const BELLY_FAT_EXERCISES_POOL: any[] = [];

export const POSTURE_CORRECTION_EXERCISES: any[] = [];
export const POSTURE_CHEST_OPENING_EXERCISES: any[] = [];
export const POSTURE_HIP_MOBILITY_EXERCISES: any[] = [];
export const POSTURE_SPINAL_MOBILITY_EXERCISES: any[] = [];
export const POSTURE_GLUTE_ACTIVATION_EXERCISES: any[] = [];
export const POSTURE_DAILY_MOVEMENT_EXERCISES: any[] = [];
export const POSTURE_VITALITY_POOL: any[] = [];

export const IMMORTAL_CHEST_TRICEPS: ChallengeExerciseItem[] = [];
export const IMMORTAL_BACK_BICEPS: ChallengeExerciseItem[] = [];
export const IMMORTAL_CARDIO_MOBILITY: ChallengeExerciseItem[] = [];
export const IMMORTAL_LEGS_SHOULDERS: ChallengeExerciseItem[] = [];
export const IMMORTAL_CHEST_TRICEPS_FOREARMS: ChallengeExerciseItem[] = [];
export const IMMORTAL_BACK_BICEPS_CORE: ChallengeExerciseItem[] = [];
export const IMMORTAL_REST_RECOVERY: ChallengeExerciseItem[] = [];
export const IMMORTAL_PURE_LOWER_BODY: ChallengeExerciseItem[] = [];
export const IMMORTAL_CARDIO_RECOVERY: ChallengeExerciseItem[] = [];
export const IMMORTAL_BACK_BICEPS_FOREARMS: ChallengeExerciseItem[] = [];
export const IMMORTAL_LEGS_SHOULDERS_ABS: ChallengeExerciseItem[] = [];

// ============================================================================
// CHALLENGE PROGRAMS METADATA
// ============================================================================
export const CHALLENGE_PROGRAMS_METADATA: Record<ProgramId, ProgramMetadata> = {
  immortal_90: {
    id: "immortal_90",
    name: "Immortal 90 Day Challenge",
    tagline: "The 7-Day Science-Based Muscle Split with Progressive Overload",
    totalDays: 90,
    description: "The premier 90-day hypertrophy and athletic conditioning cycle. Built upon a strict 7-day rolling cadence alternating targeted muscle groups with dedicated 5-10 KM cardio pacing and rest.",
    accentColor: "from-amber-500 to-red-600",
    badge: "Flagship 90 Days",
    categories: [
      "Chest and Triceps",
      "Back and Biceps",
      "Cardio and Mobility",
      "Legs and Shoulders",
      "Chest, Triceps and Forearms",
      "Back, Biceps and Core",
      "Rest and Recovery"
    ],
    equipmentRequired: ["Barbell", "Dumbbells", "Cable Machine", "Bench", "Pull-up Bar"],
    coverImage: ""
  },
  home_180: {
    id: "home_180",
    name: "180 Day Home Workout Challenge",
    tagline: "Zero & Minimal Equipment Bodyweight & Calisthenics Mastery",
    totalDays: 180,
    description: "180 days of progressive home-compatible training. Features calisthenics, core armor, mobility flows, and cardiovascular conditioning that can be executed anywhere.",
    accentColor: "from-emerald-500 to-teal-700",
    badge: "180 Days Home",
    categories: [
      "Upper body",
      "Chest",
      "Back",
      "Legs",
      "Core",
      "Cardio",
      "Full Body"
    ],
    equipmentRequired: ["Bodyweight", "Optional Resistance Bands", "Pull-up Bar"],
    coverImage: ""
  },
  belly_fat_shred: {
    id: "belly_fat_shred",
    name: "5-Month Belly Fat Shred System",
    tagline: "Visceral Fat Oxidation, Transverse Abdominis & Metabolic Conditioning",
    totalDays: 140,
    description: "20 weeks of visceral fat mobilization. Combines deep core vacuum contractions, high-velocity intervals, and compound density routines.",
    accentColor: "from-rose-500 to-red-700",
    badge: "Belly Fat Shred",
    categories: [
      "Core",
      "Cardio",
      "HIIT",
      "Conditioning",
      "Compound"
    ],
    equipmentRequired: ["Dumbbells", "Jump Rope", "Bodyweight", "Mat"],
    coverImage: ""
  },
  posture_vitality: {
    id: "posture_vitality",
    name: "Reclaim Your Posture & Vitality",
    tagline: "Sedentary Reversal, Spinal Decompression & Joint Longevity",
    totalDays: 60,
    description: "60 days of posture correction and spinal renewal. Restores anterior shoulder rounding, hip flexor tightness, and posterior chain integrity.",
    accentColor: "from-cyan-500 to-blue-700",
    badge: "Posture Vitality",
    categories: [
      "Posture Correction",
      "Chest Opening",
      "Spinal Mobility",
      "Glute Activation",
      "Daily Movement"
    ],
    equipmentRequired: ["Yoga Mat", "Foam Roller", "Resistance Band", "Bodyweight"],
    coverImage: ""
  },
  gym_hypertrophy: {
    id: "gym_hypertrophy",
    name: "Gym Hypertrophy & Muscle Density",
    tagline: "Heavy Mechanical Tension & Maximum Sarcoplasmic Growth",
    totalDays: 90,
    description: "Full commercial gym protocol with dedicated compound lifts, cables, and machine drop-sets for maximal hypertrophy.",
    accentColor: "from-orange-500 to-amber-700",
    badge: "Gym Hypertrophy",
    categories: [
      "Chest",
      "Back",
      "Legs",
      "Shoulders",
      "Arms"
    ],
    equipmentRequired: ["Full Commercial Gym"],
    coverImage: ""
  },
  cardio_calisthenics: {
    id: "cardio_calisthenics",
    name: "Cardio, Calisthenics & Military Fitness",
    tagline: "Bodyweight Mastery, Tactical Pushing & Combat Conditioning",
    totalDays: 60,
    description: "Military-inspired physical fitness test protocol combining bodyweight endurance with 5-10 KM ruck and tempo runs.",
    accentColor: "from-lime-500 to-emerald-800",
    badge: "Tactical Fitness",
    categories: [
      "Calisthenics",
      "Push Ups",
      "Pull Ups",
      "Running",
      "Core"
    ],
    equipmentRequired: ["Pull-up Bar", "Dip Bars", "Running Shoes"],
    coverImage: ""
  },
  women_confidence: {
    id: "women_confidence",
    name: "Women Confidence Program",
    tagline: "180-Day Glute Shaping, Lean Core & Athletic Poise",
    totalDays: 180,
    description: "A tailored 180-day transformation focused on glute development, core tightening, posture, and empowered athletic confidence.",
    accentColor: "from-pink-500 to-rose-600",
    badge: "Women Confidence",
    categories: [
      "Glutes",
      "Upper Body",
      "Core",
      "Full Body",
      "Active Reset"
    ],
    equipmentRequired: ["Dumbbells", "Resistance Bands", "Yoga Mat"],
    coverImage: ""
  },
  lifestyle_academy: {
    id: "lifestyle_academy",
    name: "Lifestyle Fitness Academy",
    tagline: "Athletic Longevity, Functional Movement & Daily Wellness",
    totalDays: 90,
    description: "Counteract prolonged sitting and desk work with clinical mobility, brisk walking, and functional strength.",
    accentColor: "from-indigo-500 to-purple-700",
    badge: "Lifestyle Academy",
    categories: [
      "Posture Alignment",
      "Hip Decompression",
      "Cardio Walking",
      "Spinal Stability",
      "Restorative Mobility"
    ],
    equipmentRequired: ["Bodyweight", "Mat"],
    coverImage: ""
  }
};

/**
 * Normalizes program id string aliases.
 */
export function normalizeProgramId(rawId: string = ""): ProgramId {
  const clean = rawId.toLowerCase().trim();
  if (clean.includes("immortal") || clean === "90_day_immortal" || clean === "90-days-immortal") return "immortal_90";
  if (clean.includes("home") || clean === "home_180" || clean === "180_day_home") return "home_180";
  if (clean.includes("belly") || clean.includes("shred") || clean === "belly_fat_shred") return "belly_fat_shred";
  if (clean.includes("posture") || clean === "posture_vitality") return "posture_vitality";
  if (clean.includes("women") || clean === "women_confidence") return "women_confidence";
  if (clean.includes("lifestyle") || clean === "lifestyle_academy") return "lifestyle_academy";
  if (clean.includes("tactical") || clean.includes("military") || clean === "cardio_calisthenics") return "cardio_calisthenics";
  return "immortal_90";
}

/**
 * Retrieve active exercises from memory or local cache safely.
 */
function getActiveExercisesFromStorage(): Exercise[] {
  if (typeof window === "undefined" || !window.localStorage) return EXERCISES;
  try {
    const raw = window.localStorage.getItem("fit_exercises");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return EXERCISES;
}

function getUserProfileFromStorage(): any {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem("fit_active_user");
    if (raw) return JSON.parse(raw);
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith("fit_user_")) {
        const uRaw = window.localStorage.getItem(k);
        if (uRaw) return JSON.parse(uRaw);
      }
    }
  } catch (e) {}
  return null;
}

/**
 * Main dynamic challenge engine resolver.
 * Gathers exercises from the active exercise database, tunes them to user's onboarding credentials & goals,
 * integrates abs preferences (dedicated day, cardio+abs, or leg day+abs), and includes 2 pre-workout stretch workouts with GIFs.
 */
export function getWorkoutForProgramAndDay(
  programId: string,
  dayNumber: number,
  customExercisesListOrTarget?: Exercise[] | string,
  userProfile?: any
): DayExecutionPlan {
  const normId = normalizeProgramId(programId);
  const safeDay = Math.max(1, Number(dayNumber) || 1);

  // If a live exercise list was provided by the calling component, use it; otherwise read from storage
  const activeExercises = Array.isArray(customExercisesListOrTarget) && customExercisesListOrTarget.length > 0
    ? customExercisesListOrTarget
    : getActiveExercisesFromStorage();

  const effectiveProfile = userProfile || getUserProfileFromStorage();

  return buildDynamicDayPlan(normId, safeDay, activeExercises, effectiveProfile);
}

export default getWorkoutForProgramAndDay;
