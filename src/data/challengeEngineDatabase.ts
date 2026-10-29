import { ProgramId, ProgramMetadata, ChallengeExerciseItem, DayWorkoutMeta, DayExecutionPlan } from "../types/challengeEngine";
import { Exercise, getExerciseGifUrl } from "./exercises";
import { buildDynamicDayPlan } from "../utils/dynamicWorkoutEngine";
import { isExplicitlyMarkedWomenWorkout } from "./womenConfidenceProgramData";

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
    name: "90 Immortal Challenge",
    tagline: "Target: Men • Continuous 7-Day Push/Pull/Legs/Upper/Athletic Split",
    totalDays: 90,
    description: "Designed specifically for men. Strict 7-day cyclical split repeating continuously across all 90 days: Monday: Push (Chest, shoulders and triceps), Tuesday: Pull (Back, rear delts and biceps), Wednesday: Legs + Core (Quads, hamstrings, glutes, calves and abs), Thursday: Cardio + Mobility (Running, conditioning and mobility), Friday: Upper Body (Chest, back, shoulders and arms), Saturday: Athletic Conditioning + Core (Functional movements, conditioning and abdominal work), Sunday: Recovery.",
    accentColor: "from-amber-500 to-red-600",
    badge: "Immortal 90 Men",
    categories: [
      "Monday: Push",
      "Tuesday: Pull",
      "Wednesday: Legs + Core",
      "Thursday: Cardio + Mobility",
      "Friday: Upper Body",
      "Saturday: Athletic Conditioning + Core",
      "Sunday: Recovery"
    ],
    equipmentRequired: ["Barbell", "Dumbbells", "Cable Machine", "Bench", "Pull-up Bar"],
    coverImage: ""
  },
  home_180: {
    id: "home_180",
    name: "180 Days Home Workout",
    tagline: "Target: Men & Women • Separate Progressive Tracks",
    totalDays: 180,
    description: "180 days of progressive home-compatible training with dedicated separate workout tracks for Men and Women. Zero and minimal equipment calisthenics, glute shaping, and core armor repeating continuously.",
    accentColor: "from-emerald-500 to-teal-700",
    badge: "180 Days Home",
    categories: [
      "Upper Body Push",
      "Core & Abs",
      "Lower Body & Legs",
      "Cardio & Mobility",
      "Upper Body Pull",
      "Athletic Conditioning",
      "Recovery"
    ],
    equipmentRequired: ["Bodyweight", "Optional Resistance Bands", "Pull-up Bar", "Mat"],
    coverImage: ""
  },
  belly_fat_shred: {
    id: "belly_fat_shred",
    name: "Belly Fat Shred",
    tagline: "Target: Men & Women • Visceral Oxidation & Full Body Taper",
    totalDays: 140,
    description: "Target: Men and Women. Continuous 7-day repeating split: Monday: Full Body + Core, Tuesday: Cardio + Abs, Wednesday: Full Body Strength, Thursday: Cardio + Core, Friday: Full Body Conditioning, Saturday: Walking + Mobility, Sunday: Recovery.",
    accentColor: "from-rose-500 to-red-700",
    badge: "Belly Fat Shred",
    categories: [
      "Monday: Full Body + Core",
      "Tuesday: Cardio + Abs",
      "Wednesday: Full Body Strength",
      "Thursday: Cardio + Core",
      "Friday: Full Body Conditioning",
      "Saturday: Walking + Mobility",
      "Sunday: Recovery"
    ],
    equipmentRequired: ["Dumbbells", "Jump Rope", "Bodyweight", "Mat"],
    coverImage: ""
  },
  posture_vitality: {
    id: "posture_vitality",
    name: "Posture Correction Challenge",
    tagline: "Target: Men & Women • Continuous 7-Day Spinal Alignment",
    totalDays: 60,
    description: "Target: Men and Women. Continuous 7-day repeating split: Monday: Upper Back + Shoulder Mobility, Tuesday: Core Stability + Hip Mobility, Wednesday: Full Body Posture Training, Thursday: Recovery Mobility, Friday: Upper Back + Core, Saturday: Full Body Mobility + Stability, Sunday: Recovery.",
    accentColor: "from-cyan-500 to-blue-700",
    badge: "Posture Correction",
    categories: [
      "Monday: Upper Back + Shoulder Mobility",
      "Tuesday: Core Stability + Hip Mobility",
      "Wednesday: Full Body Posture Training",
      "Thursday: Recovery Mobility",
      "Friday: Upper Back + Core",
      "Saturday: Full Body Mobility + Stability",
      "Sunday: Recovery"
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
    name: "180 Women Confidence Challenge",
    tagline: "Target: Women • Continuous 7-Day Glute Shaping & Athletic Poise",
    totalDays: 180,
    description: "Target: Women. Continuous 7-day split repeating across 180 days: Monday: Glutes + Hamstrings, Tuesday: Upper Body + Core, Wednesday: Quads + Glutes, Thursday: Cardio + Core + Mobility, Friday: Glutes + Full Lower Body, Saturday: Full Body Conditioning, Sunday: Recovery.",
    accentColor: "from-pink-500 to-rose-600",
    badge: "Women Confidence",
    categories: [
      "Monday: Glutes + Hamstrings",
      "Tuesday: Upper Body + Core",
      "Wednesday: Quads + Glutes",
      "Thursday: Cardio + Core + Mobility",
      "Friday: Glutes + Full Lower Body",
      "Saturday: Full Body Conditioning",
      "Sunday: Recovery"
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

import { CANONICAL_EXERCISES } from "./canonicalExercises";
import { getScheduleOverrides } from "../utils/scheduleOverridesStore";

/**
 * Normalizes program id string aliases.
 */
export function normalizeProgramId(rawId: string = ""): ProgramId {
  const clean = rawId.toLowerCase().trim();
  if (clean.includes("immortal") || clean === "90_day_immortal" || clean === "90-days-immortal") return "immortal_90";
  if (clean.includes("home") && (clean.includes("women") || clean.includes("female"))) return "home_180_women" as any;
  if (clean.includes("home") || clean === "home_180" || clean === "180_day_home") return "home_180";
  if (clean.includes("belly") || clean.includes("shred") || clean === "belly_fat_shred") return "belly_fat_shred";
  if (clean.includes("posture") || clean === "posture_vitality") return "posture_vitality";
  if (clean.includes("women") || clean === "women_confidence") return "women_confidence";
  if (clean.includes("lifestyle") || clean === "lifestyle_academy") return "lifestyle_academy";
  if (clean.includes("tactical") || clean.includes("military") || clean === "cardio_calisthenics") return "cardio_calisthenics";
  return (clean as ProgramId) || "immortal_90";
}

/**
 * Retrieve active exercises from memory or local cache safely with Canonical fallback.
 */
function getActiveExercisesFromStorage(): Exercise[] {
  if (typeof window === "undefined" || !window.localStorage) return CANONICAL_EXERCISES;
  try {
    const raw = window.localStorage.getItem("fit_exercises");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return CANONICAL_EXERCISES;
}

/**
 * Main dynamic challenge engine resolver.
 * Checks admin schedule overrides first (manifesting any additions/deletions by admin).
 * Falls back to dynamic assignment adhering to the restructured 7-day cyclical splits.
 */
export function getWorkoutForProgramAndDay(
  programId: string,
  dayNumber: number,
  customExercisesListOrTarget?: Exercise[] | string,
  trackOrUser?: "men" | "women" | any
): DayExecutionPlan {
  const normId = normalizeProgramId(programId);
  const safeDay = Math.max(1, Number(dayNumber) || 1);
  const cycleDay = ((safeDay - 1) % 7) + 1;
  const track = typeof trackOrUser === "string"
    ? (trackOrUser.toLowerCase().includes("women") || trackOrUser.toLowerCase().includes("female") ? "women" : "men")
    : (trackOrUser?.track || (trackOrUser?.gender?.toLowerCase() === "female" ? "women" : undefined));

  // 1. Check admin schedule overrides from centralized store (Memory -> localStorage cache -> Bundled defaults)
  const allOverrides = getScheduleOverrides();
  const trackKey = track ? `${normId}_${track}` : null;
  const progOverrides = (trackKey && allOverrides[trackKey]) || allOverrides[programId] || (normId !== programId ? allOverrides[normId] : undefined);

  if (progOverrides) {
    const dayOverride = progOverrides[String(safeDay)] || progOverrides[`cycle_${cycleDay}`];
    if (dayOverride) {
      // Determine requested fitness level: strictly "beginner" | "intermediate" | "advanced"
      const athleteLevelStr = (
        trackOrUser?.fitnessLevel || 
        trackOrUser?.difficulty || 
        trackOrUser?.workoutExperience ||
        (typeof customExercisesListOrTarget === "string" ? customExercisesListOrTarget : "") ||
        (typeof window !== "undefined" ? (window.localStorage?.getItem("fit_athlete_fitness_level") || window.localStorage?.getItem("fit_user_fitness_level") || "") : "")
      ).toLowerCase();

      let requestedTier: "beginner" | "intermediate" | "advanced" = "beginner";
      if (athleteLevelStr.includes("adv")) {
        requestedTier = "advanced";
      } else if (athleteLevelStr.includes("inter")) {
        requestedTier = "intermediate";
      } else {
        requestedTier = "beginner";
      }

      const isRest = !!dayOverride.isRestDay;
      const isCardio = !!dayOverride.isCardioOnly;

      let chosenExercises: ChallengeExerciseItem[] = [];

      if (!isRest && !isCardio) {
        // Direct tier lookup in dayOverride.levels[requestedTier] or dayOverride[`${requestedTier}Exercises`]
        const tierFromLevels = dayOverride.levels?.[requestedTier];
        const tierFromLegacyKey = dayOverride[`${requestedTier}Exercises`];

        if (Array.isArray(tierFromLevels)) {
          chosenExercises = tierFromLevels;
        } else if (Array.isArray(tierFromLegacyKey)) {
          chosenExercises = tierFromLegacyKey;
        } else if (Array.isArray(dayOverride.exercises)) {
          chosenExercises = dayOverride.exercises;
        } else {
          // Fallback hierarchy between tiers only if requestedTier was not configured at all:
          if (requestedTier === "advanced") {
            chosenExercises = Array.isArray(dayOverride.levels?.intermediate)
              ? dayOverride.levels.intermediate
              : (dayOverride.intermediateExercises || dayOverride.levels?.beginner || dayOverride.beginnerExercises || []);
          } else if (requestedTier === "intermediate") {
            chosenExercises = Array.isArray(dayOverride.levels?.beginner)
              ? dayOverride.levels.beginner
              : (dayOverride.beginnerExercises || dayOverride.levels?.advanced || dayOverride.advancedExercises || []);
          } else {
            // Beginner
            chosenExercises = Array.isArray(dayOverride.levels?.intermediate)
              ? dayOverride.levels.intermediate
              : (dayOverride.intermediateExercises || dayOverride.levels?.advanced || dayOverride.advancedExercises || []);
          }
        }
      }

      // Check for globally deleted exercises in localStorage
      let deletedNamesSet = new Set<string>();
      if (typeof window !== "undefined" && window.localStorage) {
        try {
          const rawDel = window.localStorage.getItem("fit_deleted_exercises");
          if (rawDel) {
            const arr = JSON.parse(rawDel);
            if (Array.isArray(arr)) {
              arr.forEach((d: string) => {
                if (typeof d === "string") deletedNamesSet.add(d.toLowerCase().trim());
              });
            }
          }
        } catch {}
      }

      // Deduplicate and sanitize drills to guarantee stable GIFs and correct tier difficulty
      const tierCapitalized = (requestedTier.charAt(0).toUpperCase() + requestedTier.slice(1)) as "Beginner" | "Intermediate" | "Advanced";
      const seenNames = new Set<string>();
      const seenGifs = new Set<string>();
      const sanitizedChosen: ChallengeExerciseItem[] = [];

      for (const ex of chosenExercises) {
        if (!ex) continue;
        const name = (ex.exerciseName || (ex as any).name || "").trim();
        if (!name) continue;
        const lower = name.toLowerCase();

        // Omit if permanently deleted
        if (deletedNamesSet.has(lower) || (ex.id && deletedNamesSet.has(ex.id.toLowerCase())) || ((ex as any).exerciseId && deletedNamesSet.has((ex as any).exerciseId.toLowerCase()))) {
          continue;
        }

        if (seenNames.has(lower)) continue;
        seenNames.add(lower);

        let customGifOverride: string | undefined = undefined;
        if (typeof window !== "undefined" && window.localStorage) {
          try {
            const rawOvr = window.localStorage.getItem("fit_custom_exercise_overrides");
            if (rawOvr) {
              const ovrObj = JSON.parse(rawOvr);
              const o = ovrObj[ex.id] || ovrObj[name] || ovrObj[lower];
              if (o) {
                if (o.customMediaUrl !== undefined) customGifOverride = o.customMediaUrl;
                else if (o.gifUrl !== undefined) customGifOverride = o.gifUrl;
                else if (o.imageUrl !== undefined) customGifOverride = o.imageUrl;
              }
            }
          } catch {}
        }

        let rawCandidate = customGifOverride !== undefined ? customGifOverride : (ex.gifUrl !== undefined ? ex.gifUrl : (ex as any).customMediaUrl);
        let gif: string = "";

        if (rawCandidate === "none" || rawCandidate === "deleted" || rawCandidate === "" || rawCandidate === null) {
          gif = "";
        } else if (rawCandidate) {
          gif = rawCandidate;
        } else {
          // rawCandidate is strictly undefined, assign default GIF
          gif = getExerciseGifUrl(name, ex.category, seenGifs);
        }

        if (gif) {
          seenGifs.add(gif);
        }

        sanitizedChosen.push({
          ...ex,
          name,
          exerciseName: name,
          difficulty: tierCapitalized,
          sets: ex.sets || (requestedTier === "beginner" ? 3 : (requestedTier === "advanced" ? 4 : 3)),
          reps: ex.reps || (requestedTier === "beginner" ? "10-12 reps" : (requestedTier === "advanced" ? "6-8 heavy reps" : "8-10 reps")),
          restTime: ex.restTime || (requestedTier === "beginner" ? "60s" : (requestedTier === "advanced" ? "90s" : "45s")),
          gifUrl: gif,
          imageUrl: gif
        });
      }

      // Return configured admin override verbatim - NEVER invent or inject extra drills
      return {
        meta: {
          dayNumber: safeDay,
          programId: normId as any,
          title: dayOverride.title || `Day ${safeDay}: ${dayOverride.category || "Targeted Split"}`,
          category: dayOverride.category || "Targeted Split",
          difficulty: tierCapitalized,
          targetMuscles: dayOverride.targetMuscles || ["Full Body"],
          estimatedDuration: dayOverride.estimatedDuration || "45-60 mins",
          estimatedCalories: dayOverride.estimatedCalories || 480,
          isRestDay: isRest,
          isCardioOnly: isCardio,
          cardioDistance: dayOverride.cardioDistance,
          cardioType: dayOverride.cardioType,
          guidelines: dayOverride.guidelines || [
            `Focus: ${dayOverride.category || "Workout Session"}.`,
            "Progressive overload and deliberate tempo on every set.",
            "Rest adequately between sets."
          ],
          coachingNotes: dayOverride.coachingNotes || `${dayOverride.category || "Workout"} - execute with strict form.`
        },
        exercises: sanitizedChosen
      };
    }
  }

  // 2. Dynamic generation adhering to new split
  let activeExercises = Array.isArray(customExercisesListOrTarget) && customExercisesListOrTarget.length > 0
    ? customExercisesListOrTarget
    : getActiveExercisesFromStorage();

  const isWomenTarget = normId === "women_confidence";
  if (!isWomenTarget) {
    // Workouts assigned as female ONLY appear in Women Confidence Program!
    activeExercises = activeExercises.filter(ex => !isExplicitlyMarkedWomenWorkout(ex));
  }

  return buildDynamicDayPlan(normId, safeDay, activeExercises, track);
}

export default getWorkoutForProgramAndDay;
