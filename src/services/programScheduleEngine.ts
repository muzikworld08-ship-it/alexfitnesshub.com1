import { ChallengeExerciseItem } from "../types/challengeEngine";
import { getExerciseGifUrl } from "../data/exercises";
import {
  IMMORTAL_CHEST_TRICEPS,
  IMMORTAL_BACK_BICEPS,
  IMMORTAL_LEGS_SHOULDERS,
  IMMORTAL_BACK_BICEPS_FOREARMS,
  IMMORTAL_LEGS_SHOULDERS_ABS,
  IMMORTAL_PURE_LOWER_BODY,
  getWorkoutForProgramAndDay,
  normalizeProgramId
} from "../data/challengeEngineDatabase";
import {
  HOME_UPPER_BODY_EXERCISES,
  HOME_LEGS_GLUTES_EXERCISES,
  HOME_CARDIO_EXERCISES,
  HOME_BACK_EXERCISES,
  HOME_CORE_ABS_EXERCISES,
  HOME_MOBILITY_EXERCISES
} from "../data/home180ProgramData";
import {
  WOMEN_EXERCISE_CATALOG,
  getDailyWorkoutForDay as getWomenDailyWorkout
} from "../data/womenConfidenceProgramData";
import {
  BELLY_CORE_EXERCISES,
  BELLY_HIIT_EXERCISES,
  BELLY_CARDIO_EXERCISES,
  BELLY_OBLIQUES_EXERCISES,
  BELLY_CONDITIONING_EXERCISES
} from "../data/bellyFatProgramData";
import {
  POSTURE_CORRECTION_EXERCISES,
  POSTURE_CHEST_OPENING_EXERCISES,
  POSTURE_HIP_MOBILITY_EXERCISES,
  POSTURE_SPINAL_MOBILITY_EXERCISES,
  POSTURE_GLUTE_ACTIVATION_EXERCISES
} from "../data/postureVitalityProgramData";

export type DayType = "WORKOUT_DAY" | "CARDIO_DAY" | "REST_DAY" | "RECOVERY_DAY";

export interface ProgramDaySchedule {
  programId: string;
  programName: string;
  dayNumber: number;
  weekNumber: number;
  dayType: DayType;
  title: string;
  category: string;
  targetMuscles: string[];
  equipmentRequired: string[];
  estimatedDuration: string;
  estimatedCalories: number;
  isCardio: boolean;
  cardioDistanceKm?: number;
  cardioDistanceDisplay?: string;
  cardioTargetMinutes?: number;
  cardioGuidelines?: string[];
  isRestDay: boolean;
  restGuidelines?: string[];
  coachingNotes: string;
  allowedCategories: string[];
  allowedMuscles: string[];
}

export interface ApprovedDayWorkout {
  schedule: ProgramDaySchedule;
  exercises: ChallengeExerciseItem[];
  exerciseCount: number;
}

// ============================================================================
// 1. DETERMINISTIC SCHEDULE DEFINITIONS
// ============================================================================

export function getScheduleForDay(programId: string, dayNumber: number): ProgramDaySchedule {
  const safeDay = Math.max(1, Number(dayNumber) || 1);
  const weekNumber = Math.ceil(safeDay / 7);

  // Normalize program ID
  const pid = programId.toLowerCase().trim();

  // --------------------------------------------------------------------------
  // 1. IMMORTAL 90 DAY CHALLENGE
  // Strict 7-day repeating rotation up to Day 90:
  // Day 1: Chest + Triceps
  // Day 2: Back + Biceps + Forearm
  // Day 3: 5–10 km walk/run + recovery (CARDIO_DAY, 5-10 km, NO weight training)
  // Day 4: Legs + Shoulders + Abs
  // Day 5: Chest + Triceps + Neck
  // Day 6: Back + Biceps + Forearm & Abs
  // Day 7: Rest + 5–10 km walk/run (RECOVERY_DAY, optional walk/run, NO resistance training)
  // --------------------------------------------------------------------------
  if (
    pid === "immortal_90" || 
    pid === "90-days-immortal" || 
    pid === "immortal" || 
    pid === "90_day_immortal" || 
    pid.includes("immortal")
  ) {
    const cycleDay = ((safeDay - 1) % 7) + 1; // 1 to 7

    if (cycleDay === 1) {
      return {
        programId: "immortal_90",
        programName: "Immortal 90 Day Challenge",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Chest + Triceps Overload`,
        category: "Chest + Triceps",
        targetMuscles: ["Chest", "Triceps"],
        equipmentRequired: ["Barbell", "Dumbbells", "Bench", "Cable Machine"],
        estimatedDuration: "50-60 mins",
        estimatedCalories: 480,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Immortal Day 1 strictly targets the anterior pushing chain: upper pecs, sternal pecs, and all 3 triceps heads. Zero back, leg, or home conditioning drills.",
        allowedCategories: ["Chest + Triceps", "Chest", "Triceps"],
        allowedMuscles: ["Chest", "Triceps", "Pectorals"]
      };
    }

    if (cycleDay === 2) {
      return {
        programId: "immortal_90",
        programName: "Immortal 90 Day Challenge",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Back + Biceps + Forearm Power`,
        category: "Back + Biceps + Forearm",
        targetMuscles: ["Back", "Biceps", "Forearms", "Lats"],
        equipmentRequired: ["Barbell", "Dumbbells", "Pull-up Bar", "Cable Row"],
        estimatedDuration: "55-65 mins",
        estimatedCalories: 510,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Immortal Day 2 engages vertical and horizontal pulling: lats, rhomboids, trapezius, biceps, and forearms. Focus on scapular retraction.",
        allowedCategories: ["Back + Biceps", "Back", "Biceps", "Forearm"],
        allowedMuscles: ["Back", "Biceps", "Lats", "Rhomboids", "Forearms"]
      };
    }

    if (cycleDay === 3) {
      return {
        programId: "immortal_90",
        programName: "Immortal 90 Day Challenge",
        dayNumber: safeDay,
        weekNumber,
        dayType: "CARDIO_DAY",
        title: `Day ${safeDay}: 5 to 10 KM Walk / Run + Recovery`,
        category: "5 to 10 KM Cardio / Walking",
        targetMuscles: ["Cardiovascular System", "Aerobic Recovery"],
        equipmentRequired: ["Running Shoes", "Treadmill or Outdoors"],
        estimatedDuration: "50-75 mins",
        estimatedCalories: 560,
        isCardio: true,
        cardioDistanceKm: 7.5,
        cardioDistanceDisplay: "5 to 10 KM",
        cardioTargetMinutes: 60,
        cardioGuidelines: [
          "Prescribed target: Minimum 5.0 KM, maximum 10.0 KM.",
          "Maintain Zone 2 aerobic pace (can hold a conversational cadence).",
          "Zero weight training. Allow upper body muscle fibers to recover completely.",
          "Hydrate with 750ml water and electrolytes after crossing 5 KM."
        ],
        isRestDay: false,
        coachingNotes: "Immortal Day 3 Cardio Focus: Dedicated 5 to 10 KM road or treadmill distance. No weight lifting is scheduled today.",
        allowedCategories: ["Cardio", "Running", "Walking"],
        allowedMuscles: ["Heart", "Legs"]
      };
    }

    if (cycleDay === 4) {
      return {
        programId: "immortal_90",
        programName: "Immortal 90 Day Challenge",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Legs + Shoulders + Abs`,
        category: "Legs + Shoulders",
        targetMuscles: ["Legs", "Quads", "Hamstrings", "Glutes", "Shoulders", "Abs"],
        equipmentRequired: ["Barbell", "Dumbbells", "Squat Rack"],
        estimatedDuration: "60-70 mins",
        estimatedCalories: 580,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Immortal Day 4 demands compound lower body recruitment: back squats, Romanian deadlifts, overhead presses, and core bracing.",
        allowedCategories: ["Legs + Shoulders", "Legs", "Shoulders", "Lower Body", "Abs"],
        allowedMuscles: ["Quads", "Hamstrings", "Glutes", "Calves", "Deltoids", "Shoulders", "Abs"]
      };
    }

    if (cycleDay === 5) {
      return {
        programId: "immortal_90",
        programName: "Immortal 90 Day Challenge",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Chest + Triceps + Neck Overload`,
        category: "Chest + Triceps + Neck",
        targetMuscles: ["Chest", "Triceps", "Neck"],
        equipmentRequired: ["Dumbbells", "Barbell", "Bench", "Dips Station"],
        estimatedDuration: "55-65 mins",
        estimatedCalories: 490,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Immortal Day 5 second push split: focus on peak metabolic squeeze, incline pressing, triceps dips, and cervical neck stabilizers.",
        allowedCategories: ["Chest + Triceps", "Chest", "Triceps", "Neck"],
        allowedMuscles: ["Chest", "Triceps", "Neck", "Trapezius"]
      };
    }

    if (cycleDay === 6) {
      return {
        programId: "immortal_90",
        programName: "Immortal 90 Day Challenge",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Back + Biceps + Forearm & Abs`,
        category: "Back + Biceps + Forearm & Abs",
        targetMuscles: ["Back", "Lats", "Biceps", "Forearms", "Abs"],
        equipmentRequired: ["Barbell", "Dumbbells", "Pull-up Station"],
        estimatedDuration: "55-65 mins",
        estimatedCalories: 510,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Immortal Day 6: High volume hypertrophy for back width, lat sweep, bicep peaks, forearm grip, and core abdominal armor.",
        allowedCategories: ["Back + Biceps", "Back", "Biceps", "Forearms", "Abs"],
        allowedMuscles: ["Back", "Lats", "Biceps", "Forearms", "Abs"]
      };
    }

    // cycleDay === 7
    return {
      programId: "immortal_90",
      programName: "Immortal 90 Day Challenge",
      dayNumber: safeDay,
      weekNumber,
      dayType: "RECOVERY_DAY",
      title: `Day ${safeDay}: Rest + 5 to 10 KM Walk / Run`,
      category: "Rest + Walking / Running",
      targetMuscles: ["Systemic Recovery", "Aerobic Flush"],
      equipmentRequired: ["Comfortable Footwear"],
      estimatedDuration: "45-60 mins",
      estimatedCalories: 420,
      isCardio: true,
      cardioDistanceKm: 5.0,
      cardioDistanceDisplay: "5 to 10 KM",
      cardioTargetMinutes: 50,
      cardioGuidelines: [
        "Light active recovery: 5 KM leisurely walk or gentle jogging.",
        "Zero resistance training or heavy weight lifting today.",
        "Deep tissue stretching and foam rolling for 15 minutes.",
        "Prioritize 8+ hours of sleep tonight to enter Week " + (weekNumber + 1) + " fully recharged."
      ],
      isRestDay: true,
      restGuidelines: [
        "No weight training exercises are assigned today.",
        "Focus on cellular muscle recovery, hydration (3.5L+), and nutrient-dense protein meals.",
        "Execute gentle dynamic mobility or the optional 5–10 km restorative walk."
      ],
      coachingNotes: "Immortal Day 7 Recovery: Muscle growth occurs during rest. Complete zero resistance training today.",
      allowedCategories: ["Recovery", "Rest", "Walking"],
      allowedMuscles: ["Systemic"]
    };
  }

  // --------------------------------------------------------------------------
  // 2. 180 DAY WOMEN CONFIDENCE PROGRAM
  // Female biomechanics & glute hypertrophy progression
  // Day 1: Glutes & Hamstrings
  // Day 2: Upper Body Sculpt & Posture (Back, Shoulders, Arms)
  // Day 3: 5 KM Outdoor Run / Walk & Recovery (CARDIO_DAY)
  // Day 4: Lower Body (Quads, Calves, Glutes)
  // Day 5: Core Vacuum, Waist Trim & Transverse Abdominis
  // Day 6: Full Body Metabolic Sculpt
  // Day 7: Active Recovery, Pelvic Floor & Restorative Mobility (RECOVERY_DAY)
  // --------------------------------------------------------------------------
  if (pid === "women_confidence" || pid === "women-programs" || pid === "women") {
    const cycleDay = ((safeDay - 1) % 7) + 1;

    if (cycleDay === 1) {
      return {
        programId: "women_confidence",
        programName: "Women Confidence Program",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Glute Sculpt & Hip Thrust Hypertrophy`,
        category: "Glutes & Hamstrings",
        targetMuscles: ["Glutes", "Hamstrings", "Posterior Chain"],
        equipmentRequired: ["Barbell or Dumbbells", "Booty Bands", "Bench"],
        estimatedDuration: "45-55 mins",
        estimatedCalories: 420,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Women Confidence Day 1: Focus on hip extension power, locked core at top lockout, and gluteus medius abductions.",
        allowedCategories: ["Glutes", "Lower Body", "Hamstrings"],
        allowedMuscles: ["Glutes", "Hamstrings"]
      };
    }

    if (cycleDay === 2) {
      return {
        programId: "women_confidence",
        programName: "Women Confidence Program",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Upper Body Toning & Posture Freedom`,
        category: "Upper Body & Posture",
        targetMuscles: ["Shoulders", "Back", "Triceps", "Upper Posture"],
        equipmentRequired: ["Dumbbells", "Resistance Bands", "Bench"],
        estimatedDuration: "40-50 mins",
        estimatedCalories: 380,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Day 2 focuses on sculpting lean arms, defining deltoids, and opening the thoracic chest for an upright posture.",
        allowedCategories: ["Upper Body", "Shoulders", "Back", "Arms"],
        allowedMuscles: ["Shoulders", "Back", "Triceps", "Biceps"]
      };
    }

    if (cycleDay === 3) {
      return {
        programId: "women_confidence",
        programName: "Women Confidence Program",
        dayNumber: safeDay,
        weekNumber,
        dayType: "CARDIO_DAY",
        title: `Day ${safeDay}: 5 KM Run / Incline Walk & Recovery`,
        category: "5 KM Cardio & Recovery",
        targetMuscles: ["Cardiovascular Stamina", "Fat Burning"],
        equipmentRequired: ["Running Shoes", "Treadmill or Outdoors"],
        estimatedDuration: "45-60 mins",
        estimatedCalories: 430,
        isCardio: true,
        cardioDistanceKm: 5.0,
        cardioDistanceDisplay: "5 KM",
        cardioTargetMinutes: 45,
        cardioGuidelines: [
          "Target: 5.0 KM steady pace or 12% incline power walk.",
          "Keep posture erect, arms swinging rhythmically.",
          "No weight lifting today; focus exclusively on oxygen intake and cardiovascular flush."
        ],
        isRestDay: false,
        coachingNotes: "Day 3 Cardio: 5 KM distance session. Elevate heart rate to mobilize fatty acids and recover joint connective tissues.",
        allowedCategories: ["Cardio", "Running", "Walking"],
        allowedMuscles: ["Full Body"]
      };
    }

    if (cycleDay === 4) {
      return {
        programId: "women_confidence",
        programName: "Women Confidence Program",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Quad Sculpt, Hamstrings & Inner Thighs`,
        category: "Legs & Lower Body",
        targetMuscles: ["Quads", "Hamstrings", "Adductors", "Calves"],
        equipmentRequired: ["Dumbbells", "Chair or Bench"],
        estimatedDuration: "45-50 mins",
        estimatedCalories: 440,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Day 4 Lower Body: Controlled eccentric Bulgarian split squats, sumo stances, and Romanian deadlifts.",
        allowedCategories: ["Legs", "Lower Body", "Quads"],
        allowedMuscles: ["Quads", "Hamstrings", "Adductors", "Calves"]
      };
    }

    if (cycleDay === 5) {
      return {
        programId: "women_confidence",
        programName: "Women Confidence Program",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Transverse Abdominis & Core Vacuum`,
        category: "Core & Waist Trimming",
        targetMuscles: ["Transverse Abdominis", "Obliques", "Deep Core"],
        equipmentRequired: ["Yoga Mat"],
        estimatedDuration: "35-40 mins",
        estimatedCalories: 320,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Day 5: Stomach vacuuming on exhale, bird-dogs, dead bugs, and side plank hip lifts for a tight athletic waist.",
        allowedCategories: ["Core", "Abs", "Obliques"],
        allowedMuscles: ["Abs", "Core", "Obliques", "Transverse Abdominis"]
      };
    }

    if (cycleDay === 6) {
      return {
        programId: "women_confidence",
        programName: "Women Confidence Program",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Full Body Metabolic Conditioning`,
        category: "Full Body Sculpt",
        targetMuscles: ["Full Body", "Glutes", "Arms", "Core"],
        equipmentRequired: ["Dumbbells", "Yoga Mat"],
        estimatedDuration: "40-45 mins",
        estimatedCalories: 450,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Day 6 combines compound drills into functional supersets for peak athletic tone.",
        allowedCategories: ["Full Body", "Conditioning"],
        allowedMuscles: ["Full Body", "Glutes", "Core"]
      };
    }

    // cycleDay === 7
    return {
      programId: "women_confidence",
      programName: "Women Confidence Program",
      dayNumber: safeDay,
      weekNumber,
      dayType: "RECOVERY_DAY",
      title: `Day ${safeDay}: Active Recovery & Pelvic Floor Mobility`,
      category: "Rest & Restorative Mobility",
      targetMuscles: ["Hip Flexors", "Pelvic Floor", "Spinal Column"],
      equipmentRequired: ["Yoga Mat", "Foam Roller"],
      estimatedDuration: "30-40 mins",
      estimatedCalories: 250,
      isCardio: false,
      isRestDay: true,
      restGuidelines: [
        "Rest day: Zero strength training today.",
        "Perform deep diaphragmatic breathing and gentle yoga flows.",
        "Hydrate with 3.0 Liters of water and take warm salt baths for muscle easing."
      ],
      coachingNotes: "Day 7 Recovery: Dedicate today to biological restoration and hormonal balance.",
      allowedCategories: ["Mobility", "Recovery", "Rest"],
      allowedMuscles: ["Systemic"]
    };
  }

  // --------------------------------------------------------------------------
  // 3. 180 DAY HOME WORKOUT CHALLENGE
  // Zero & minimal equipment bodyweight/calisthenics mastery
  // Day 1: Upper Body Calisthenics & Push-ups
  // Day 2: Lower Body & Glutes Bodyweight Density
  // Day 3: 5 KM Run / Power Walk & Post-Meal Cadence (CARDIO_DAY)
  // Day 4: Core Armor & Abdominal Conditioning
  // Day 5: Full Body Functional Movement & Calisthenics
  // Day 6: High-Intensity Metabolic Interval Home Conditioning
  // Day 7: Deep Joint Mobility, Rest & Spine Decompression (REST_DAY)
  // --------------------------------------------------------------------------
  if (pid === "home_180" || pid === "home_workout" || pid === "home-programs" || pid === "home") {
    const cycleDay = ((safeDay - 1) % 7) + 1;

    if (cycleDay === 1) {
      return {
        programId: "home_180",
        programName: "180 Day Home Workout Challenge",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Upper Body Push & Pull Calisthenics`,
        category: "Upper Body",
        targetMuscles: ["Chest", "Shoulders", "Triceps", "Upper Back"],
        equipmentRequired: ["Bodyweight Only", "Optional Resistance Band"],
        estimatedDuration: "35-45 mins",
        estimatedCalories: 390,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Home Day 1: Strict push-up variations, pike presses, and doorway rows. Zero gym equipment required.",
        allowedCategories: ["Upper Body", "Chest", "Shoulders", "Arms", "Home Workouts"],
        allowedMuscles: ["Chest", "Shoulders", "Triceps", "Back"]
      };
    }

    if (cycleDay === 2) {
      return {
        programId: "home_180",
        programName: "180 Day Home Workout Challenge",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Lower Body Calisthenics & Glute Density`,
        category: "Legs & Glutes",
        targetMuscles: ["Quads", "Glutes", "Hamstrings", "Calves"],
        equipmentRequired: ["Bodyweight Only", "Chair / Wall"],
        estimatedDuration: "40-45 mins",
        estimatedCalories: 420,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Home Day 2: Air squats, jump squats, step-ups, and wall sits. Focus on explosive concentric power.",
        allowedCategories: ["Legs & Glutes", "Lower Body", "Legs", "Glutes"],
        allowedMuscles: ["Quads", "Glutes", "Hamstrings", "Calves"]
      };
    }

    if (cycleDay === 3) {
      return {
        programId: "home_180",
        programName: "180 Day Home Workout Challenge",
        dayNumber: safeDay,
        weekNumber,
        dayType: "CARDIO_DAY",
        title: `Day ${safeDay}: 5 KM Outdoor Run / Power Walk`,
        category: "5 KM Cardio & Aerobic Health",
        targetMuscles: ["Heart Rate", "Aerobic Stamina"],
        equipmentRequired: ["Running Shoes"],
        estimatedDuration: "40-55 mins",
        estimatedCalories: 450,
        isCardio: true,
        cardioDistanceKm: 5.0,
        cardioDistanceDisplay: "5 KM",
        cardioTargetMinutes: 45,
        cardioGuidelines: [
          "Prescribed target: 5.0 KM run or brisk walk.",
          "Post-meal walking cadence: Walk 15 minutes after main meals today.",
          "Strict rule: No caloric food intake after 7:30 PM tonight for nocturnal HGH release.",
          "Zero resistance exercises today."
        ],
        isRestDay: false,
        coachingNotes: "Home Day 3 Cardio: 5 KM walk/run protocol. Eliminate late-night food after 7:30 PM.",
        allowedCategories: ["Cardio", "Running", "Walking"],
        allowedMuscles: ["Full Body"]
      };
    }

    if (cycleDay === 4) {
      return {
        programId: "home_180",
        programName: "180 Day Home Workout Challenge",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Core Armor & Isometric Plank Mastery`,
        category: "Core & Abs",
        targetMuscles: ["Rectus Abdominis", "Obliques", "Deep Stabilizers"],
        equipmentRequired: ["Yoga Mat or Floor"],
        estimatedDuration: "30-40 mins",
        estimatedCalories: 330,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Home Day 4: Anti-extension planks, Russian twists, flutter kicks, and bicycle crunches.",
        allowedCategories: ["Core & Abs", "Core", "Abs", "Obliques"],
        allowedMuscles: ["Abs", "Core", "Obliques"]
      };
    }

    if (cycleDay === 5) {
      return {
        programId: "home_180",
        programName: "180 Day Home Workout Challenge",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Full Body Calisthenics Conditioning`,
        category: "Full Body",
        targetMuscles: ["Full Body Calisthenics"],
        equipmentRequired: ["Bodyweight"],
        estimatedDuration: "40-50 mins",
        estimatedCalories: 440,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Home Day 5: Multi-joint bodyweight flow alternating upper, lower, and rotational core movements.",
        allowedCategories: ["Full Body", "Calisthenics", "Conditioning"],
        allowedMuscles: ["Full Body"]
      };
    }

    if (cycleDay === 6) {
      return {
        programId: "home_180",
        programName: "180 Day Home Workout Challenge",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: High-Intensity Metabolic Interval Melt`,
        category: "HIIT & Conditioning",
        targetMuscles: ["Metabolic Conditioning", "Stamina"],
        equipmentRequired: ["Bodyweight"],
        estimatedDuration: "35-40 mins",
        estimatedCalories: 460,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Home Day 6: Tabata intervals (20s work / 10s rest) pushing maximal aerobic threshold.",
        allowedCategories: ["HIIT", "Cardio", "Conditioning"],
        allowedMuscles: ["Full Body"]
      };
    }

    // cycleDay === 7
    return {
      programId: "home_180",
      programName: "180 Day Home Workout Challenge",
      dayNumber: safeDay,
      weekNumber,
      dayType: "REST_DAY",
      title: `Day ${safeDay}: Deep Joint Mobility & Complete Rest`,
      category: "Rest & Joint Longevity",
      targetMuscles: ["Joints", "Connective Tissue", "Spine"],
      equipmentRequired: ["Yoga Mat or Rug"],
      estimatedDuration: "25-30 mins",
      estimatedCalories: 180,
      isCardio: false,
      isRestDay: true,
      restGuidelines: [
        "Rest day: No exercises or strength drills scheduled today.",
        "Perform light spinal extension and child's pose.",
        "Refuel with clean nutrients, drink 3L water, and relax."
      ],
      coachingNotes: "Home Day 7 Rest: True biological recovery day. No workout exercises.",
      allowedCategories: ["Rest", "Mobility", "Recovery"],
      allowedMuscles: ["Systemic"]
    };
  }

  // --------------------------------------------------------------------------
  // 4. BELLY FAT SHRED SYSTEM (150 DAYS)
  // Deep visceral fat mobilization & core armor
  // Day 1: Deep Core Activation
  // Day 2: Metabolic Interval Conditioning
  // Day 3: 5 KM Outdoor Aerobic Fat Oxidation Run/Walk (CARDIO_DAY)
  // Day 4: Oblique Power & Rotational Core
  // Day 5: High-Density Bodyweight Melt
  // Day 6: Aerobic Stamina & Cardio Intervals (CARDIO_DAY)
  // Day 7: Active Rest & Cellular Recovery (REST_DAY)
  // --------------------------------------------------------------------------
  if (pid === "belly_fat_shred" || pid === "belly-fat" || pid === "fat_shred") {
    const cycleDay = ((safeDay - 1) % 7) + 1;

    if (cycleDay === 1) {
      return {
        programId: "belly_fat_shred",
        programName: "Belly Fat Shred System",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Deep Transverse Core Armor`,
        category: "Core & Abs",
        targetMuscles: ["Rectus Abdominis", "Transverse Abdominis"],
        equipmentRequired: ["Yoga Mat"],
        estimatedDuration: "35-40 mins",
        estimatedCalories: 360,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Belly Fat Day 1: Strict core tension. Full diaphragmatic exhale at top contraction to tighten transverse wall.",
        allowedCategories: ["Core", "Abs", "Transverse Abdominis"],
        allowedMuscles: ["Abs", "Core"]
      };
    }

    if (cycleDay === 2) {
      return {
        programId: "belly_fat_shred",
        programName: "Belly Fat Shred System",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Metabolic HIIT & Caloric Burn`,
        category: "Metabolic HIIT",
        targetMuscles: ["Full Body", "Core", "Heart Rate"],
        equipmentRequired: ["Bodyweight"],
        estimatedDuration: "30-40 mins",
        estimatedCalories: 450,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Belly Fat Day 2: High intensity intervals to boost EPOC (excess post-exercise oxygen consumption).",
        allowedCategories: ["HIIT", "Conditioning", "Core"],
        allowedMuscles: ["Full Body", "Core"]
      };
    }

    if (cycleDay === 3) {
      return {
        programId: "belly_fat_shred",
        programName: "Belly Fat Shred System",
        dayNumber: safeDay,
        weekNumber,
        dayType: "CARDIO_DAY",
        title: `Day ${safeDay}: 5 KM Fat Oxidation Walk / Run`,
        category: "5 KM Aerobic Cardio",
        targetMuscles: ["Lipid Mobilization", "Cardiovascular"],
        equipmentRequired: ["Running Shoes"],
        estimatedDuration: "45-60 mins",
        estimatedCalories: 480,
        isCardio: true,
        cardioDistanceKm: 5.0,
        cardioDistanceDisplay: "5 KM",
        cardioTargetMinutes: 45,
        cardioGuidelines: [
          "Target distance: 5.0 KM steady pace.",
          "Keep effort in fat-burning aerobic Zone 2 (60-70% max heart rate).",
          "Zero core or weight exercises today. Allow the abdominal wall to recover."
        ],
        isRestDay: false,
        coachingNotes: "Belly Fat Day 3 Cardio: 5 KM steady aerobic session to directly oxidize circulating fatty acids.",
        allowedCategories: ["Cardio", "Running", "Walking"],
        allowedMuscles: ["Full Body"]
      };
    }

    if (cycleDay === 4) {
      return {
        programId: "belly_fat_shred",
        programName: "Belly Fat Shred System",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Obliques & Lateral Waist Tightening`,
        category: "Obliques & Waist",
        targetMuscles: ["Obliques", "Serratus", "Deep Core"],
        equipmentRequired: ["Yoga Mat"],
        estimatedDuration: "35-40 mins",
        estimatedCalories: 340,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Belly Fat Day 4: Side planks, woodchoppers, and bicycle holds to cinch the waistline.",
        allowedCategories: ["Obliques", "Core", "Abs"],
        allowedMuscles: ["Obliques", "Abs"]
      };
    }

    if (cycleDay === 5) {
      return {
        programId: "belly_fat_shred",
        programName: "Belly Fat Shred System",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Full Body Core Conditioning`,
        category: "Full Body Conditioning",
        targetMuscles: ["Full Body", "Core Armor"],
        equipmentRequired: ["Bodyweight"],
        estimatedDuration: "40-45 mins",
        estimatedCalories: 440,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Belly Fat Day 5: Dynamic plank walks, mountain climbers, and bear crawls.",
        allowedCategories: ["Conditioning", "Full Body", "Core"],
        allowedMuscles: ["Full Body", "Core"]
      };
    }

    if (cycleDay === 6) {
      return {
        programId: "belly_fat_shred",
        programName: "Belly Fat Shred System",
        dayNumber: safeDay,
        weekNumber,
        dayType: "CARDIO_DAY",
        title: `Day ${safeDay}: 5 KM Stamina Run / Interval Cardio`,
        category: "Cardio & Stamina",
        targetMuscles: ["Heart Rate", "Lung Capacity"],
        equipmentRequired: ["Running Shoes"],
        estimatedDuration: "40-50 mins",
        estimatedCalories: 460,
        isCardio: true,
        cardioDistanceKm: 5.0,
        cardioDistanceDisplay: "5 KM",
        cardioTargetMinutes: 40,
        cardioGuidelines: [
          "Target distance: 5.0 KM continuous run or 35 mins jump rope intervals.",
          "Push cadence on the final kilometer.",
          "Zero strength drills today."
        ],
        isRestDay: false,
        coachingNotes: "Belly Fat Day 6 Cardio: 5 KM aerobic endurance.",
        allowedCategories: ["Cardio", "Running"],
        allowedMuscles: ["Full Body"]
      };
    }

    // cycleDay === 7
    return {
      programId: "belly_fat_shred",
      programName: "Belly Fat Shred System",
      dayNumber: safeDay,
      weekNumber,
      dayType: "REST_DAY",
      title: `Day ${safeDay}: Complete Recovery & Gut Health`,
      category: "Rest & Recovery",
      targetMuscles: ["Systemic Recovery"],
      equipmentRequired: ["None"],
      estimatedDuration: "20-30 mins",
      estimatedCalories: 150,
      isCardio: false,
      isRestDay: true,
      restGuidelines: [
        "Rest day: No exercises today.",
        "Focus on reducing cortisol (stress hormone) through sleep and hydration.",
        "No late-night eating after 7:30 PM."
      ],
      coachingNotes: "Belly Fat Day 7 Rest: Low cortisol is essential for visceral fat release. Rest completely.",
      allowedCategories: ["Rest", "Recovery"],
      allowedMuscles: ["Systemic"]
    };
  }

  // --------------------------------------------------------------------------
  // 5. POSTURE & JOINT VITALITY (60 DAYS)
  // Corrective biomechanics and spinal alignment
  // --------------------------------------------------------------------------
  if (pid === "posture_vitality" || pid === "posture") {
    const cycleDay = ((safeDay - 1) % 7) + 1;

    if (cycleDay === 1) {
      return {
        programId: "posture_vitality",
        programName: "Posture & Joint Vitality",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Thoracic Spine & Neck Decompression`,
        category: "Posture Correction",
        targetMuscles: ["Upper Back", "Neck", "Thoracic Spine"],
        equipmentRequired: ["Yoga Mat", "Foam Roller"],
        estimatedDuration: "30-35 mins",
        estimatedCalories: 220,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Posture Day 1: Chin tucks, wall angels, and thoracic foam rolling to eliminate tech neck.",
        allowedCategories: ["Posture correction", "Upper back", "Neck mobility"],
        allowedMuscles: ["Back", "Neck", "Shoulders"]
      };
    }

    if (cycleDay === 2) {
      return {
        programId: "posture_vitality",
        programName: "Posture & Joint Vitality",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Hip Flexor Release & Anterior Tilt Neutralizer`,
        category: "Hip Mobility & Glutes",
        targetMuscles: ["Hip Flexors", "Gluteus Medius", "Pelvic Stabilizers"],
        equipmentRequired: ["Yoga Mat"],
        estimatedDuration: "30-35 mins",
        estimatedCalories: 230,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Posture Day 2: 90/90 hip stretches, kneeling hip flexor release, and glute bridges.",
        allowedCategories: ["Hip mobility", "Glute activation"],
        allowedMuscles: ["Glutes", "Hips"]
      };
    }

    if (cycleDay === 3) {
      return {
        programId: "posture_vitality",
        programName: "Posture & Joint Vitality",
        dayNumber: safeDay,
        weekNumber,
        dayType: "CARDIO_DAY",
        title: `Day ${safeDay}: 3 to 5 KM Mindful Posture Walk`,
        category: "3 to 5 KM Posture Walk",
        targetMuscles: ["Aerobic Cadence", "Gait Alignment"],
        equipmentRequired: ["Supportive Walking Shoes"],
        estimatedDuration: "40-50 mins",
        estimatedCalories: 280,
        isCardio: true,
        cardioDistanceKm: 4.0,
        cardioDistanceDisplay: "3 to 5 KM",
        cardioTargetMinutes: 45,
        cardioGuidelines: [
          "Target distance: 3.0 to 5.0 KM.",
          "Maintain tall spinal posture, eyes level with horizon, heel-to-toe stride.",
          "Zero weight training today."
        ],
        isRestDay: false,
        coachingNotes: "Posture Day 3 Cardio: Mindful walking to recalibrate natural pelvic and spinal gait.",
        allowedCategories: ["Walking", "Cardio"],
        allowedMuscles: ["Full Body"]
      };
    }

    if (cycleDay === 4) {
      return {
        programId: "posture_vitality",
        programName: "Posture & Joint Vitality",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Scapular Retraction & Rear Delt Activation`,
        category: "Scapular Control",
        targetMuscles: ["Rhomboids", "Lower Traps", "Rear Deltoids"],
        equipmentRequired: ["Resistance Band"],
        estimatedDuration: "30-35 mins",
        estimatedCalories: 240,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Posture Day 4: Band pull-aparts, face pulls, and prone Y-T-W raises.",
        allowedCategories: ["Shoulder mobility", "Upper back"],
        allowedMuscles: ["Shoulders", "Back"]
      };
    }

    if (cycleDay === 5) {
      return {
        programId: "posture_vitality",
        programName: "Posture & Joint Vitality",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Core Stability & Spinal Freedom`,
        category: "Core Stability",
        targetMuscles: ["Transverse Core", "Erector Spinae"],
        equipmentRequired: ["Yoga Mat"],
        estimatedDuration: "30-35 mins",
        estimatedCalories: 230,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Posture Day 5: Bird-dogs, side planks, and dead bugs with zero spinal flexion.",
        allowedCategories: ["Core stability", "Spinal mobility"],
        allowedMuscles: ["Core", "Spine"]
      };
    }

    if (cycleDay === 6) {
      return {
        programId: "posture_vitality",
        programName: "Posture & Joint Vitality",
        dayNumber: safeDay,
        weekNumber,
        dayType: "WORKOUT_DAY",
        title: `Day ${safeDay}: Chest Opening & Pectoral Decompression`,
        category: "Chest Opening",
        targetMuscles: ["Pectoral Minor", "Anterior Shoulders"],
        equipmentRequired: ["Doorway or Towel"],
        estimatedDuration: "25-30 mins",
        estimatedCalories: 200,
        isCardio: false,
        isRestDay: false,
        coachingNotes: "Posture Day 6: Doorway chest stretch and overhead reach mobility.",
        allowedCategories: ["Chest opening", "Stretching"],
        allowedMuscles: ["Chest", "Shoulders"]
      };
    }

    // cycleDay === 7
    return {
      programId: "posture_vitality",
      programName: "Posture & Joint Vitality",
      dayNumber: safeDay,
      weekNumber,
      dayType: "REST_DAY",
      title: `Day ${safeDay}: Complete Spinal Recovery`,
      category: "Rest & Longevity",
      targetMuscles: ["Systemic Recovery"],
      equipmentRequired: ["None"],
      estimatedDuration: "20 mins",
      estimatedCalories: 120,
      isCardio: false,
      isRestDay: true,
      restGuidelines: [
        "Rest day: No exercises today.",
        "Practice lying supine with a rolled towel under the neck for 10 minutes.",
        "Deep breathing to relax the autonomic nervous system."
      ],
      coachingNotes: "Posture Day 7 Rest: Allow spinal ligaments and discs to rehydrate naturally.",
      allowedCategories: ["Rest", "Recovery"],
      allowedMuscles: ["Systemic"]
    };
  }

  // --------------------------------------------------------------------------
  // 6. DEFAULT / ACADEMY / GYM SPLIT PROGRAMS (LIFESTYLE ACADEMY, GYM HYPERTROPHY)
  // Deterministic 4-day push/pull/legs/arms split with 2 cardio days & 1 rest day
  // --------------------------------------------------------------------------
  const cycleDay = ((safeDay - 1) % 7) + 1;
  const programTitle = pid.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  if (cycleDay === 1) {
    return {
      programId: pid,
      programName: programTitle,
      dayNumber: safeDay,
      weekNumber,
      dayType: "WORKOUT_DAY",
      title: `Day ${safeDay}: Chest & Triceps Hypertrophy`,
      category: "Chest + Triceps",
      targetMuscles: ["Chest", "Triceps"],
      equipmentRequired: ["Barbell", "Dumbbells", "Bench"],
      estimatedDuration: "50 mins",
      estimatedCalories: 460,
      isCardio: false,
      isRestDay: false,
      coachingNotes: "Strict anterior pushing session: flat and incline barbell and dumbbell presses, followed by triceps extensions.",
      allowedCategories: ["Chest + Triceps", "Chest", "Triceps"],
      allowedMuscles: ["Chest", "Triceps"]
    };
  }

  if (cycleDay === 2) {
    return {
      programId: pid,
      programName: programTitle,
      dayNumber: safeDay,
      weekNumber,
      dayType: "WORKOUT_DAY",
      title: `Day ${safeDay}: Back & Biceps Pull`,
      category: "Back + Biceps",
      targetMuscles: ["Back", "Biceps", "Lats"],
      equipmentRequired: ["Barbell", "Dumbbells", "Cable"],
      estimatedDuration: "50 mins",
      estimatedCalories: 480,
      isCardio: false,
      isRestDay: false,
      coachingNotes: "Posterior pulling chain: lat pulldowns, bent-over rows, and strict bicep curls.",
      allowedCategories: ["Back + Biceps", "Back", "Biceps"],
      allowedMuscles: ["Back", "Biceps", "Lats"]
    };
  }

  if (cycleDay === 3) {
    return {
      programId: pid,
      programName: programTitle,
      dayNumber: safeDay,
      weekNumber,
      dayType: "CARDIO_DAY",
      title: `Day ${safeDay}: 5 KM Conditioning Run / Walk`,
      category: "5 KM Cardio",
      targetMuscles: ["Cardiovascular"],
      equipmentRequired: ["Running Shoes"],
      estimatedDuration: "45 mins",
      estimatedCalories: 450,
      isCardio: true,
      cardioDistanceKm: 5.0,
      cardioDistanceDisplay: "5 KM",
      cardioTargetMinutes: 45,
      cardioGuidelines: ["Target: 5.0 KM run or walk. No weight lifting today."],
      isRestDay: false,
      coachingNotes: "Dedicated cardio session: 5 KM aerobic endurance.",
      allowedCategories: ["Cardio", "Running"],
      allowedMuscles: ["Full Body"]
    };
  }

  if (cycleDay === 4) {
    return {
      programId: pid,
      programName: programTitle,
      dayNumber: safeDay,
      weekNumber,
      dayType: "WORKOUT_DAY",
      title: `Day ${safeDay}: Legs & Shoulder Power`,
      category: "Legs + Shoulders",
      targetMuscles: ["Quads", "Hamstrings", "Deltoids"],
      equipmentRequired: ["Barbell", "Dumbbells"],
      estimatedDuration: "55 mins",
      estimatedCalories: 520,
      isCardio: false,
      isRestDay: false,
      coachingNotes: "Lower body squats and overhead presses.",
      allowedCategories: ["Legs + Shoulders", "Legs", "Shoulders"],
      allowedMuscles: ["Quads", "Hamstrings", "Deltoids"]
    };
  }

  if (cycleDay === 5) {
    return {
      programId: pid,
      programName: programTitle,
      dayNumber: safeDay,
      weekNumber,
      dayType: "WORKOUT_DAY",
      title: `Day ${safeDay}: Arms & Core Armor`,
      category: "Arms + Core",
      targetMuscles: ["Biceps", "Triceps", "Abs"],
      equipmentRequired: ["Dumbbells", "Cable", "Mat"],
      estimatedDuration: "45 mins",
      estimatedCalories: 410,
      isCardio: false,
      isRestDay: false,
      coachingNotes: "High pump arm supersets and rotational abdominal core conditioning.",
      allowedCategories: ["Arms", "Biceps", "Triceps", "Core"],
      allowedMuscles: ["Biceps", "Triceps", "Abs"]
    };
  }

  if (cycleDay === 6) {
    return {
      programId: pid,
      programName: programTitle,
      dayNumber: safeDay,
      weekNumber,
      dayType: "CARDIO_DAY",
      title: `Day ${safeDay}: 5 KM Aerobic Stamina`,
      category: "5 KM Cardio",
      targetMuscles: ["Cardiovascular"],
      equipmentRequired: ["Running Shoes"],
      estimatedDuration: "45 mins",
      estimatedCalories: 450,
      isCardio: true,
      cardioDistanceKm: 5.0,
      cardioDistanceDisplay: "5 KM",
      cardioTargetMinutes: 45,
      cardioGuidelines: ["Target: 5.0 KM steady pace. No strength training exercises."],
      isRestDay: false,
      coachingNotes: "Aerobic flush and joint recovery through continuous 5 KM road or treadmill distance.",
      allowedCategories: ["Cardio", "Running"],
      allowedMuscles: ["Full Body"]
    };
  }

  // cycleDay === 7
  return {
    programId: pid,
    programName: programTitle,
    dayNumber: safeDay,
    weekNumber,
    dayType: "REST_DAY",
    title: `Day ${safeDay}: Rest & Active Regeneration`,
    category: "Rest & Recovery",
    targetMuscles: ["Systemic Recovery"],
    equipmentRequired: ["None"],
    estimatedDuration: "20 mins",
    estimatedCalories: 150,
    isCardio: false,
    isRestDay: true,
    restGuidelines: ["Zero workouts today. Rest completely and prepare for the upcoming training week."],
    coachingNotes: "Rest day: Muscles rebuild during recovery. No resistance exercises.",
    allowedCategories: ["Rest", "Recovery"],
    allowedMuscles: ["Systemic"]
  };
}

// ============================================================================
// 2. EXERCISE VALIDATION LAYER
// Rejects any exercise that doesn't match the program schedule!
// ============================================================================

export function validateExerciseForSchedule(
  exercise: ChallengeExerciseItem | any,
  schedule: ProgramDaySchedule
): { isValid: boolean; reason?: string } {
  if (!exercise) return { isValid: false, reason: "Exercise is null or undefined" };

  // Rule 1: Cardio days and Rest days must NEVER have strength/workout exercises!
  if (schedule.dayType === "CARDIO_DAY") {
    return {
      isValid: false,
      reason: `Day ${schedule.dayNumber} is a dedicated Cardio Day (${schedule.cardioDistanceDisplay || "5-10 KM"}). Strength exercises are forbidden.`
    };
  }

  if (schedule.dayType === "REST_DAY" || schedule.dayType === "RECOVERY_DAY") {
    return {
      isValid: false,
      reason: `Day ${schedule.dayNumber} is a dedicated Rest & Recovery Day. Strength exercises are forbidden.`
    };
  }

  // Rule 2: Program alignment
  const exProgramId = (exercise.programId || "").toLowerCase().trim();
  const schedProgramId = schedule.programId.toLowerCase().trim();
  if (exProgramId && exProgramId !== schedProgramId) {
    // Check if it's an approved cross-compatible ID
    const isImmortalMatch = (schedProgramId.includes("immortal") && exProgramId.includes("immortal"));
    const isHomeMatch = (schedProgramId.includes("home") && exProgramId.includes("home"));
    const isWomenMatch = (schedProgramId.includes("women") && exProgramId.includes("women"));
    const isBellyMatch = (schedProgramId.includes("belly") && exProgramId.includes("belly"));
    const isPostureMatch = (schedProgramId.includes("posture") && exProgramId.includes("posture"));
    const isGymMatch = (schedProgramId.includes("gym") && exProgramId.includes("gym"));
    const isCardioMatch = (schedProgramId.includes("cardio") && exProgramId.includes("cardio"));
    const isLifestyleMatch = (schedProgramId.includes("lifestyle") && exProgramId.includes("lifestyle"));

    if (!isImmortalMatch && !isHomeMatch && !isWomenMatch && !isBellyMatch && !isPostureMatch && !isGymMatch && !isCardioMatch && !isLifestyleMatch) {
      return {
        isValid: false,
        reason: `Program mismatch: Exercise belongs to "${exercise.programId}" but active schedule is "${schedule.programName}". Cross-program contamination blocked.`
      };
    }
  }

  // Rule 3: Category and Muscle Group alignment
  const exCat = (exercise.category || "").toLowerCase();
  const exMuscles = Array.isArray(exercise.muscleGroup)
    ? exercise.muscleGroup.map((m: string) => m.toLowerCase())
    : Array.isArray(exercise.musclesWorked)
    ? exercise.musclesWorked.map((m: string) => m.toLowerCase())
    : [exCat];

  const allowedCats = schedule.allowedCategories.map(c => c.toLowerCase());
  const allowedMuscles = schedule.allowedMuscles.map(m => m.toLowerCase());

  // Strict check: Category or Muscle group must overlap with allowed values
  const catMatches = allowedCats.some(c => exCat.includes(c) || c.includes(exCat));
  const muscleMatches = exMuscles.some((m: string) =>
    allowedMuscles.some(am => m.includes(am) || am.includes(m))
  );

  if (!catMatches && !muscleMatches) {
    return {
      isValid: false,
      reason: `Category mismatch: Exercise "${exercise.exerciseName || exercise.name}" (${exercise.category}) does not match prescribed category "${schedule.category}" for Day ${schedule.dayNumber}.`
    };
  }

  return { isValid: true };
}

// ============================================================================
// 3. GET APPROVED EXERCISES FOR DAY
// Pulls strictly from the program's assigned pool for that specific day & category
// ============================================================================

export function getApprovedExercisesForDay(
  programId: string,
  dayNumber: number,
  customOverrides?: Record<string, any>
): ApprovedDayWorkout {
  const schedule = getScheduleForDay(programId, dayNumber);

  // If cardio or rest day, zero exercises are permitted
  if (schedule.dayType === "CARDIO_DAY" || schedule.dayType === "REST_DAY" || schedule.dayType === "RECOVERY_DAY") {
    return {
      schedule,
      exercises: [],
      exerciseCount: 0
    };
  }

  const safeDay = schedule.dayNumber;
  const pid = normalizeProgramId(programId);

  // Centralized single source of truth for the entire platform:
  const plan = getWorkoutForProgramAndDay(pid, safeDay);
  const rawPool: any[] = plan?.exercises || [];

  // Format into standardized ChallengeExerciseItem
  const exercises: ChallengeExerciseItem[] = rawPool.slice(0, 10).map((ex, idx) => {
    const exName = ex.exerciseName || ex.name || "Target Drill";
    const sets = typeof ex.sets === "number" ? ex.sets : parseInt(String(ex.sets)) || 3;
    const reps = String(ex.reps || "10-12 reps");
    const restTime = ex.restTime || "60s";

    // Check custom overrides
    const exId = `${pid}_d${safeDay}_ex_${idx + 1}`;
    const override = customOverrides ? customOverrides[exId] || customOverrides[ex.id] : null;

    return {
      id: exId,
      programId: schedule.programId as any,
      programName: schedule.programName,
      dayNumber: safeDay,
      category: override?.category || ex.category || schedule.category,
      muscleGroup: override?.muscleGroup || ex.muscleGroup || schedule.targetMuscles,
      exerciseName: override?.exerciseName || exName,
      equipment: override?.equipment || ex.equipment || schedule.equipmentRequired[0] || "Bodyweight",
      difficulty: override?.difficulty || ex.difficulty || "Intermediate",
      sets: override?.sets !== undefined ? override.sets : sets,
      reps: override?.reps || reps,
      duration: ex.duration || "45s set",
      restTime: override?.restTime || restTime,
      instructions: override?.instructions || ex.instructions || [
        "Position yourself with biomechanically balanced alignment.",
        "Engage the target muscle group through full active range of motion.",
        "Control the lowering eccentric phase over 3 seconds."
      ],
      coachingCues: override?.coachingCues || ex.coachingCues || [
        "Keep core braced throughout the repetition.",
        "Breathe out under exertion, inhale during reset."
      ],
      gifUrl: override?.customMediaUrl || override?.gifUrl || ex.gifUrl || ex.customMediaUrl || getExerciseGifUrl(exName, schedule.category),
      videoUrl: ex.videoUrl,
      imageUrl: ex.imageUrl
    };
  });

  // Run validation pass to ensure 100% compliance
  const validated = exercises.filter(ex => {
    const val = validateExerciseForSchedule(ex, schedule);
    if (!val.isValid) {
      console.warn(`[Schedule Engine Filter] Rejected exercise "${ex.exerciseName}":`, val.reason);
    }
    return val.isValid;
  });

  return {
    schedule,
    exercises: validated,
    exerciseCount: validated.length
  };
}
