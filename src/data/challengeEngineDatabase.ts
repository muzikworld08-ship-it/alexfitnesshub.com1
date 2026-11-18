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
  },
  lean_muscle: {
    id: "lean_muscle",
    name: "90 Day Lean Muscle Challenge",
    tagline: "Hypertrophy, Progressive Overload & Lean Mass",
    totalDays: 90,
    description: "Build lean muscle definition, optimize progressive compound load, and improve body composition.",
    accentColor: "from-red-500 to-amber-600",
    badge: "Lean Muscle 90",
    categories: ["Chest & Triceps", "Back & Biceps", "Cardio & Mobility", "Legs & Shoulders", "Recovery"],
    equipmentRequired: ["Barbell", "Dumbbells", "Machines"],
    coverImage: ""
  },
  fat_burning: {
    id: "fat_burning",
    name: "90 Day Fat Burning Challenge",
    tagline: "Metabolic Conditioning & Caloric Expenditure",
    totalDays: 90,
    description: "High-efficiency metabolic conditioning designed to burn stubborn adipose tissue while preserving muscle.",
    accentColor: "from-orange-500 to-red-600",
    badge: "Fat Burning 90",
    categories: ["HIIT Cardio", "Lower Body Conditioning", "Aerobic Cardio", "Upper Body Circuit", "Full Body Shred"],
    equipmentRequired: ["Dumbbells", "Bodyweight", "Cardio"],
    coverImage: ""
  },
  body_transformation: {
    id: "body_transformation",
    name: "90 Day Body Transformation",
    tagline: "Full Recomposition Blueprint",
    totalDays: 90,
    description: "Simultaneously stimulate muscular development and systemic fat loss across 90 structured days.",
    accentColor: "from-purple-500 to-indigo-600",
    badge: "Transformation 90",
    categories: ["Upper Body Strength", "Lower Body Strength", "Core & Mobility", "Full Body Hypertrophy", "HIIT Cardio"],
    equipmentRequired: ["Dumbbells", "Barbell", "Bodyweight"],
    coverImage: ""
  },
  athletic_performance: {
    id: "athletic_performance",
    name: "90 Day Athletic Performance",
    tagline: "Speed, Power, Agility & Conditioning",
    totalDays: 90,
    description: "Enhance rate of force development, rotational power, agility vectors, and structural endurance.",
    accentColor: "from-cyan-500 to-blue-600",
    badge: "Athletic 90",
    categories: ["Plyometrics & Speed", "Lower Body Power", "Conditioning", "Upper Body Power", "Agility + Core"],
    equipmentRequired: ["Barbell", "Plyo Box", "Bodyweight"],
    coverImage: ""
  },
  strength_challenge: {
    id: "strength_challenge",
    name: "90 Day Strength Challenge",
    tagline: "Compound Strength & Barbell Overload",
    totalDays: 90,
    description: "Command major compound lifts and systematically overload neurological pathways.",
    accentColor: "from-yellow-600 to-amber-700",
    badge: "Strength 90",
    categories: ["Squats & Legs", "Bench Press & Chest", "Deadlifts & Back", "Overhead Press & Shoulders", "Heavy Bracing Core"],
    equipmentRequired: ["Barbell", "Squat Rack", "Bench"],
    coverImage: ""
  },
  home_fitness: {
    id: "home_fitness",
    name: "90 Day Home Fitness Challenge",
    tagline: "Bodyweight Progressions & Minimal Setup",
    totalDays: 90,
    description: "Train effectively at home using structured bodyweight progressions and conditioning.",
    accentColor: "from-emerald-500 to-teal-600",
    badge: "Home Fitness 90",
    categories: ["Bodyweight Full Body", "Core & Mobility", "Home HIIT Cardio", "Upper Body", "Lower Body"],
    equipmentRequired: ["Bodyweight", "Mat"],
    coverImage: ""
  },
  six_pack_core: {
    id: "six_pack_core",
    name: "90 Day Six Pack & Core Challenge",
    tagline: "Deep Core Stability & Abdominal Definition",
    totalDays: 90,
    description: "Build deep anterior and posterior core stability, define the abdominals, and strengthen bracing.",
    accentColor: "from-pink-500 to-rose-600",
    badge: "Six Pack Core 90",
    categories: ["Upper Abs + Obliques", "Lower Abs + Deep Core", "Cardio + Core Burn", "Planks & Isometrics", "Full Core Circuit"],
    equipmentRequired: ["Mat", "Bodyweight"],
    coverImage: ""
  }
};

import { CANONICAL_EXERCISES } from "./canonicalExercises";
import { getScheduleOverrides } from "../utils/scheduleOverridesStore";
import { normalizeProgramId } from "../utils/programNormalization";

export { normalizeProgramId };

/**
 * Retrieve active exercises from memory or local cache safely with Canonical fallback.
 */
function getActiveExercisesFromStorage(): Exercise[] {
  if (typeof window === "undefined" || !window.localStorage) return CANONICAL_EXERCISES;
  try {
    const raw = window.localStorage.getItem("fit_exercises");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const merged = new Map<string, Exercise>();
        CANONICAL_EXERCISES.forEach(e => { if (e?.id) merged.set(e.id, e); });
        parsed.forEach((e: any) => {
          if (e?.id) {
            const existing = merged.get(e.id);
            merged.set(e.id, existing ? { ...existing, ...e } : e);
          }
        });
        return Array.from(merged.values());
      }
    }
  } catch (e) {}
  return CANONICAL_EXERCISES;
}

/**
 * Canonical day-entry resolver shared by both Admin Challenge Engine and Public Program Views.
 * Respects repeating `cycle_N` overrides unless an explicit `isOneOff: true` per-day override exists.
 */
export function resolveProgramDayOverride(progOverrides: Record<string, any> | undefined, dayNumber: number): any {
  if (!progOverrides || typeof progOverrides !== "object") return null;
  const safeDay = Math.max(1, Number(dayNumber) || 1);
  const cycleDay = ((safeDay - 1) % 7) + 1;
  const cycleOverride = progOverrides[`cycle_${cycleDay}`];
  const dayEntry = progOverrides[String(safeDay)];
  return (dayEntry && dayEntry.isOneOff === true) ? dayEntry : (cycleOverride || dayEntry || null);
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

  // 1. Check admin schedule overrides from centralized store (Memory -> localStorage cache -> Remote)
  const allOverrides = getScheduleOverrides();
  const baseTrackNormId = String(normId).replace(/_(women|men)$/i, "");
  const trackKey = track ? `${baseTrackNormId}_${track}` : null;
  const hasDayEntry = (obj: any) => Boolean(obj && typeof obj === "object" && (obj[String(safeDay)] || obj[`cycle_${cycleDay}`]));

  const progOverrides =
    (track === "women" && trackKey && hasDayEntry(allOverrides[trackKey]))
      ? allOverrides[trackKey]
      : (programId && hasDayEntry(allOverrides[programId]))
        ? allOverrides[programId]
        : (trackKey && hasDayEntry(allOverrides[trackKey]))
          ? allOverrides[trackKey]
          : (normId !== programId && hasDayEntry(allOverrides[normId]))
            ? allOverrides[normId]
            : ((track === "women" && trackKey && allOverrides[trackKey]) ||
               allOverrides[programId] ||
               (trackKey && allOverrides[trackKey]) ||
               (normId !== programId ? allOverrides[normId] : undefined));

  if (progOverrides) {
    const dayOverride = resolveProgramDayOverride(progOverrides, safeDay);
    if (dayOverride) {
      const isRest = !!dayOverride.isRestDay;
      const isCardio = !!dayOverride.isCardioOnly;

      let chosenExercises: ChallengeExerciseItem[] = [];

      if (!isRest && !isCardio) {
        if (requestedTier === "advanced") {
          // Strictly isolate Advanced tier: NEVER fall back to beginner or general exercises
          if (Array.isArray(dayOverride.levels?.advanced)) {
            chosenExercises = dayOverride.levels.advanced;
          } else if (Array.isArray(dayOverride.advancedExercises)) {
            chosenExercises = dayOverride.advancedExercises;
          } else {
            chosenExercises = [];
          }
        } else if (requestedTier === "intermediate") {
          const hasExplicitInterLevels =
            dayOverride.levels &&
            "intermediate" in dayOverride.levels &&
            Array.isArray(dayOverride.levels.intermediate) &&
            (dayOverride.levels.intermediate.length > 0 || dayOverride.intermediateExplicitlyCleared === true);
          const hasExplicitInterArray =
            Array.isArray(dayOverride.intermediateExercises) &&
            (dayOverride.intermediateExercises.length > 0 || dayOverride.intermediateExplicitlyCleared === true);

          if (hasExplicitInterLevels) {
            chosenExercises = dayOverride.levels.intermediate;
          } else if (hasExplicitInterArray) {
            chosenExercises = dayOverride.intermediateExercises;
          } else if (Array.isArray(dayOverride.exercises) && dayOverride.exercises.length > 0) {
            chosenExercises = dayOverride.exercises;
          } else if (Array.isArray(dayOverride.levels?.beginner) && dayOverride.levels.beginner.length > 0) {
            chosenExercises = dayOverride.levels.beginner;
          } else if (Array.isArray(dayOverride.beginnerExercises) && dayOverride.beginnerExercises.length > 0) {
            chosenExercises = dayOverride.beginnerExercises;
          } else {
            chosenExercises = [];
          }
        } else {
          // Beginner
          if (dayOverride.levels && "beginner" in dayOverride.levels && Array.isArray(dayOverride.levels.beginner)) {
            chosenExercises = dayOverride.levels.beginner;
          } else if (Array.isArray(dayOverride.beginnerExercises)) {
            chosenExercises = dayOverride.beginnerExercises;
          } else if (Array.isArray(dayOverride.exercises)) {
            chosenExercises = dayOverride.exercises;
          } else {
            chosenExercises = [];
          }
        }
      }

      // If Admin explicitly added drills (addedByAdmin === true) in this list, exclude any leftover unadded legacy seed drills
      const hasAdminAddedDrills = Array.isArray(chosenExercises) && chosenExercises.some((d: any) => d && d.addedByAdmin === true);
      const effectiveChosenExercises = hasAdminAddedDrills
        ? chosenExercises.filter((d: any) => d && d.addedByAdmin === true)
        : chosenExercises;

      // Check for globally deleted exercises in localStorage
      let deletedNamesSet = new Set<string>();
      if (typeof window !== "undefined" && window.localStorage) {
        try {
          const rawDel = window.localStorage.getItem("fit_deleted_exercises");
          if (rawDel) {
            const arr = JSON.parse(rawDel);
            if (Array.isArray(arr)) {
              arr.forEach((d: string) => {
                if (typeof d === "string") {
                  const c = d.toLowerCase().trim();
                  deletedNamesSet.add(c);
                  deletedNamesSet.add(c.replace(/_/g, " "));
                  deletedNamesSet.add(c.replace(/\s+/g, "_"));
                }
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

      for (const ex of effectiveChosenExercises) {
        if (!ex) continue;
        const name = (ex.exerciseName || (ex as any).name || "").trim();
        if (!name) continue;
        const lower = name.toLowerCase();
        const exId = String(ex.id || (ex as any).exerciseId || "").toLowerCase().trim();

        // Omit if permanently deleted
        if (
          deletedNamesSet.has(lower) || 
          deletedNamesSet.has(lower.replace(/_/g, " ")) || 
          deletedNamesSet.has(lower.replace(/\s+/g, "_")) ||
          (exId && (deletedNamesSet.has(exId) || deletedNamesSet.has(exId.replace(/_/g, " ")) || deletedNamesSet.has(exId.replace(/\s+/g, "_"))))
        ) {
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
              const o = ovrObj[ex.id] || ovrObj[name] || ovrObj[lower] || ovrObj[lower.replace(/_/g, " ")] || ovrObj[lower.replace(/\s+/g, "_")];
              if (o) {
                if (o.customMediaUrl !== undefined) customGifOverride = o.customMediaUrl;
                else if (o.gifUrl !== undefined) customGifOverride = o.gifUrl;
                else if (o.imageUrl !== undefined) customGifOverride = o.imageUrl;
              }
            }
            if (customGifOverride === undefined) {
              const rawExs = window.localStorage.getItem("fit_exercises");
              if (rawExs) {
                const exsList: any[] = JSON.parse(rawExs);
                const matched = exsList.find(e => e.id === ex.id || (e.name && e.name.toLowerCase().trim() === lower));
                if (matched?.customMediaUrl) {
                  customGifOverride = matched.customMediaUrl;
                }
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
  const tierCapitalizedDyn = (requestedTier.charAt(0).toUpperCase() + requestedTier.slice(1)) as "Beginner" | "Intermediate" | "Advanced";
  if (requestedTier === "advanced") {
    const metaPlan = buildDynamicDayPlan(normId, safeDay, [], track);
    return {
      ...metaPlan,
      meta: {
        ...metaPlan.meta,
        difficulty: "Advanced"
      },
      exercises: []
    };
  }

  let activeExercises = Array.isArray(customExercisesListOrTarget) && customExercisesListOrTarget.length > 0
    ? customExercisesListOrTarget
    : getActiveExercisesFromStorage();

  const isWomenTarget = normId === "women_confidence";
  if (!isWomenTarget) {
    // Workouts assigned as female ONLY appear in Women Confidence Program!
    activeExercises = activeExercises.filter(ex => !isExplicitlyMarkedWomenWorkout(ex));
  }

  const dynamicPlan = buildDynamicDayPlan(normId, safeDay, activeExercises, track);
  return {
    ...dynamicPlan,
    meta: {
      ...dynamicPlan.meta,
      difficulty: tierCapitalizedDyn
    }
  };
}

export default getWorkoutForProgramAndDay;
