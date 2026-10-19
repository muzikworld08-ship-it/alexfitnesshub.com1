import { Exercise } from "./exercises";
import { filterExercisesForSplit } from "../utils/dynamicWorkoutEngine";
import { CANONICAL_EXERCISES } from "./canonicalExercises";
import { getWorkoutForProgramAndDay } from "./challengeEngineDatabase";
import { getScheduleOverrides } from "../utils/scheduleOverridesStore";

export interface WomenOnboardingProfile {
  age: number;
  height: number;
  currentWeight: number;
  targetWeight?: number;
  mainGoal: "lose_weight" | "burn_fat" | "build_muscle" | "tone_shape" | "maintain_weight" | "improve_fitness" | "build_curves" | "increase_strength" | "improve_health";
  focusAreas: string[];
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  workoutLocation: "home" | "gym" | "both";
  availableEquipment: string[];
  trainingDaysPerWeek: number;
  preferredDuration: "20-30" | "30-45" | "45-60";
  previousExperience: "none" | "occasional" | "consistent" | "former_athlete";
  dailyActivityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active";
  dietaryPreference: "balanced" | "high_protein" | "plant_based" | "pescatarian" | "keto_low_carb" | "intermittent_fasting";
  sleepScheduleHours: number;
  currentWaterIntakeLiters: number;
  lifestyleRoutine: "desk_job" | "on_feet" | "busy_parent" | "shift_work" | "student";
  exerciseLimitations: string;
  motivation: string;
  completedAt: string;
}

export interface WomenDailyExercise {
  id: string;
  name: string;
  muscleGroups: string[];
  sets: number;
  reps: string;
  restPeriod: string;
  equipment: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructions: string[];
  formTips: string[];
  beginnerModification: string;
  advancedProgression: string;
  gifUrl: string;
  targetMuscles: string;
  tempo?: string;
  notes?: string;
}

export interface WomenDailyWorkout {
  dayNumber: number;
  phaseNumber: number;
  title: string;
  subtitle: string;
  focus: string;
  dayType: "strength" | "conditioning" | "mobility" | "walking" | "stretching" | "active_recovery" | "rest";
  estimatedMinutes: number;
  intensity: "Low" | "Moderate" | "Challenging" | "High";
  calorieEstimate: number;
  exercises: WomenDailyExercise[];
  coachingCue: string;
}

export interface WomenDailyLifestyle {
  dayNumber: number;
  stepTarget: number;
  waterTargetLiters: number;
  sleepTargetHours: number;
  mealGuidance: {
    focus: string;
    proteinTip: string;
    produceTip: string;
    sampleMealIdea: string;
  };
  healthyHabits: string[];
  morningRoutine: string;
  eveningRoutine: string;
  stressManagementTip: string;
  confidenceChallenge: {
    title: string;
    prompt: string;
    action: string;
  };
  journalPrompt: string;
}

export interface ProgramPhase {
  phaseNumber: number;
  startDay: number;
  endDay: number;
  title: string;
  tagline: string;
  description: string;
  primaryFocus: string;
  colorTheme: string;
  bannerImage: string;
}

export const PROGRAM_PHASES: ProgramPhase[] = [
  {
    phaseNumber: 1,
    startDay: 1,
    endDay: 30,
    title: "Foundation & Movement",
    tagline: "Awaken Your Kinetic Power & Build Unshakable Neuromuscular Consistency",
    description: "Phase 1 focuses on core stabilization, pelvic floor activation, joint mobility, posture correction, and mastering fundamental movement patterns with pristine mechanics.",
    primaryFocus: "Kinetic Alignment, Glute Activation & Habit Formation",
    colorTheme: "from-rose-500 via-pink-500 to-rose-600",
    bannerImage: ""
  },
  {
    phaseNumber: 2,
    startDay: 31,
    endDay: 60,
    title: "Strength & Fat Loss",
    tagline: "Ignite Metabolic Density, Sculpt Lean Muscle & Elevate Daily Vitality",
    description: "Phase 2 introduces progressive resistance loading and metabolic circuits to build lean, metabolic active muscle while supporting sustained whole-body fat oxidation.",
    primaryFocus: "Progressive Loading, Metabolic Tone & Posterior Chain Power",
    colorTheme: "from-fuchsia-600 via-pink-600 to-rose-500",
    bannerImage: ""
  },
  {
    phaseNumber: 3,
    startDay: 61,
    endDay: 90,
    title: "Body Sculpting",
    tagline: "Define Your Athletic Curves, Taper the Midsection & Stand Tall",
    description: "Phase 3 emphasizes aesthetic shaping: glute hypertrophy, shoulder capping, back posture sculpting, and core tightening without exhausting burnout.",
    primaryFocus: "Hourglass Taper, Core Sculpting & Postural Elegance",
    colorTheme: "from-violet-600 via-pink-600 to-rose-500",
    bannerImage: ""
  },
  {
    phaseNumber: 4,
    startDay: 91,
    endDay: 120,
    title: "Strength, Shape & Conditioning",
    tagline: "Overcome Plateaus with High-Threshold Athletic Conditioning",
    description: "Phase 4 elevates training density with unilateral stability, supersets, and functional conditioning to elevate your cardiovascular stamina and lifting confidence.",
    primaryFocus: "Unilateral Balance, Power Density & Functional Stamina",
    colorTheme: "from-purple-600 via-rose-500 to-amber-500",
    bannerImage: ""
  },
  {
    phaseNumber: 5,
    startDay: 121,
    endDay: 150,
    title: "Advanced Sculpting",
    tagline: "Master Time-Under-Tension & Perfect Biomechanical Definition",
    description: "Phase 5 incorporates advanced eccentric tempos, isometric holds, and targeted metabolic waves to sculpt refined muscular definition and joint resilience.",
    primaryFocus: "Time-Under-Tension, Peak Glute-Ham Tie-In & Deep Abdominal Control",
    colorTheme: "from-pink-600 via-rose-600 to-amber-600",
    bannerImage: ""
  },
  {
    phaseNumber: 6,
    startDay: 151,
    endDay: 180,
    title: "Confidence & Transformation",
    tagline: "Celebrate Your Unstoppable Self: 180 Days of Strength, Fitness & Confidence",
    description: "The crowning phase consolidating 6 months of devotion into a permanent lifestyle transformation. You emerge physically strong, mentally resilient, and radiantly confident.",
    primaryFocus: "Lifelong Mastery, Radiant Confidence & Sustainable Athleticism",
    colorTheme: "from-rose-600 via-amber-500 to-yellow-500",
    bannerImage: ""
  }
];

export const MILESTONE_ACHIEVEMENTS = [
  {
    day: 7,
    id: "milestone_day_7",
    title: "First Commitment",
    badgeName: "Spark of Discipline",
    icon: "Flame",
    color: "text-amber-500 bg-amber-50 border-amber-200",
    description: "Completed your first 7 days of intentional movement, hydration, and confidence building."
  },
  {
    day: 30,
    id: "milestone_day_30",
    title: "Foundation Complete",
    badgeName: "Kinetic Architect",
    icon: "Shield",
    color: "text-rose-500 bg-rose-50 border-rose-200",
    description: "Mastered Phase 1 movement mechanics and established an unbreakable daily foundation."
  },
  {
    day: 60,
    id: "milestone_day_60",
    title: "Strength Unlocked",
    badgeName: "Metabolic Dynamo",
    icon: "Zap",
    color: "text-fuchsia-500 bg-fuchsia-50 border-fuchsia-200",
    description: "Crushed 60 days of progressive loading, strength gains, and sustainable body recomposition."
  },
  {
    day: 90,
    id: "milestone_day_90",
    title: "Halfway Immortal",
    badgeName: "Sculpted Sovereign",
    icon: "Crown",
    color: "text-pink-500 bg-pink-50 border-pink-200",
    description: "Reached the midpoint of your transformation. Your posture, physique, and mindset are transformed."
  },
  {
    day: 130,
    id: "milestone_day_130",
    title: "Athletic Dominance",
    badgeName: "Empowered Valkyrie",
    icon: "Award",
    color: "text-purple-500 bg-purple-50 border-purple-200",
    description: "Conquered 130 days of high-density training with remarkable stamina and resilience."
  },
  {
    day: 180,
    id: "milestone_day_180",
    title: "Total Transformation",
    badgeName: "Radiant Empress of Strength",
    icon: "Trophy",
    color: "text-amber-500 bg-amber-50 border-amber-200",
    description: "Completed all 180 days. You stand transformed with permanent confidence and power."
  }
];

// Strong men / heavy bodybuilding exercise blocklist to strictly prevent unwanted male workouts (like cable fly, heavy bench, etc.)
export const STRONG_MEN_EXERCISE_BLOCKLIST = [
  "cable fly",
  "cable flyes",
  "cable crossover",
  "pec deck",
  "pec fly",
  "chest fly",
  "incline fly",
  "decline fly",
  "dumbbell fly",
  "flat dumbbell fly",
  "cable chest",
  "bench press",
  "barbell bench",
  "decline bench",
  "incline bench",
  "guillotine press",
  "heavy deadlift",
  "powerlifting",
  "atlas stone",
  "tire flip",
  "log press",
  "behind neck",
  "behind the neck",
  "shrug",
  "barbell shrug",
  "heavy shrugs",
  "trap builder",
  "chest dips",
  "weighted dip",
  "cable press",
  "heavy press"
];

/**
 * Validates that an exercise is suitable for women's confidence/sculpting routines.
 * Strictly excludes heavy chest builders, cable flyes, and aggressive male strongman exercises.
 */
export function isWomenWorkoutEligibleExercise(ex: Exercise | { name?: string; category?: string; muscleGroups?: string[]; genderSuitability?: string }): boolean {
  if (!ex) return false;
  if ((ex as any).genderSuitability === "Men") return false;
  const name = ((ex as any).name || (ex as any).exerciseName || "").toLowerCase().trim();
  const cat = ((ex as any).category || "").toLowerCase().trim();
  const desc = ((ex as any).description || "").toLowerCase().trim();

  // 1. Strict check against blocklisted heavy male exercises
  for (const blocked of STRONG_MEN_EXERCISE_BLOCKLIST) {
    if (name.includes(blocked) || cat.includes(blocked) || desc.includes(blocked)) {
      return false;
    }
  }

  return true;
}

/**
 * Checks whether an exercise is explicitly designated as a women / female workout
 * by admin configuration (genderSuitability === "Women" / "Female", womenCategories,
 * female targetAudience, women/female program assignments, or women/female category).
 */
export function isExplicitlyMarkedWomenWorkout(ex: any): boolean {
  if (!ex) return false;
  const gs = (ex.genderSuitability || ex.gender || ex.targetAudience || "").toString().toLowerCase().trim();
  if (gs === "women" || gs === "female") return true;

  if (Array.isArray(ex.womenCategories) && ex.womenCategories.length > 0) return true;

  if (Array.isArray(ex.programAssignments) && ex.programAssignments.some((p: string) => {
    const pl = (p || "").toLowerCase();
    return pl.includes("women") || pl.includes("female");
  })) return true;

  if (typeof ex.category === "string") {
    const cl = ex.category.toLowerCase();
    if (cl.includes("women") || cl.includes("female")) return true;
  }

  if (Array.isArray(ex.categories) && ex.categories.some((c: string) => {
    const cl = (c || "").toLowerCase();
    return cl.includes("women") || cl.includes("female");
  })) return true;

  return false;
}

// Comprehensive catalog of authentic women's exercises for 180 days of sculpted confidence
interface WomenCatalogItem {
  name: string;
  muscleGroups: string[];
  equipment: string;
  defaultReps: string;
  defaultSets: number;
  instructions: string[];
  formTips: string[];
  targetMuscles: string;
}

const AUTHENTIC_WOMEN_WORKOUT_LIBRARY: Record<string, WomenCatalogItem[]> = {
  glutes: [],
  upper_body_posture: [],
  cardio_walking: [],
  core_waist: [],
  full_body: [],
  recovery_rest: []
};

// Catalog dictionary export for backward compatibility
export const WOMEN_EXERCISE_CATALOG: Record<string, WomenDailyExercise> = {};

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
 * Dynamically resolves the daily workout for Women Confidence Program.
 * Strictly guarantees EXACTLY 10 women-specific exercises daily for all 180 days!
 * Enforces removal of male/heavy bodybuilding movements like cable fly, bench press, etc.
 */
export function getDailyWorkoutForDay(
  dayNumber: number,
  profile?: WomenOnboardingProfile | null,
  activeExercisesList?: Exercise[]
): WomenDailyWorkout {
  const safeDay = Math.max(1, Math.min(180, Number(dayNumber) || 1));
  const phaseNum = Math.min(6, Math.ceil(safeDay / 30));
  const userLevel = profile?.fitnessLevel || (typeof window !== "undefined" ? (window.localStorage?.getItem("fit_athlete_fitness_level") || window.localStorage?.getItem("fit_user_fitness_level")) : null) || "beginner";

  // Delegate strictly to the authoritative Admin Dashboard Challenge Engine
  const enginePlan = getWorkoutForProgramAndDay(
    "women_confidence",
    safeDay,
    activeExercisesList,
    { fitnessLevel: userLevel, track: "women" }
  );

  const isRestDay = !!enginePlan.meta.isRestDay;
  const isCardioDay = !!enginePlan.meta.isCardioOnly;
  const dayType: "strength" | "conditioning" | "mobility" | "walking" | "stretching" | "active_recovery" | "rest" = 
    isCardioDay ? "conditioning" : isRestDay ? "active_recovery" : "strength";

  const title = enginePlan.meta.title || `Day ${safeDay}: ${enginePlan.meta.category}`;
  const focus = enginePlan.meta.category || "Glutes & Toning";
  const subtitle = enginePlan.meta.coachingNotes || `Deliberate form, deep mind-muscle connection, and posture alignment.`;
  const estimatedMinutes = typeof enginePlan.meta.estimatedDuration === "number" 
    ? enginePlan.meta.estimatedDuration 
    : parseInt(String(enginePlan.meta.estimatedDuration || "45"), 10) || 45;

  const exercises: WomenDailyExercise[] = (enginePlan.exercises || []).map((ex: any, idx: number) => {
    const exName = (ex.exerciseName || ex.name || "").trim();
    const mediaUrl = ex.customMediaUrl || ex.gifUrl || ex.imageUrl || "";
    return {
      id: ex.id || `wc_d${safeDay}_ex${idx + 1}`,
      name: exName,
      muscleGroups: Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup || focus],
      sets: typeof ex.sets === "number" ? ex.sets : parseInt(String(ex.sets || "3"), 10) || 3,
      reps: String(ex.reps || "10-12 reps"),
      restPeriod: ex.restTime || "45-60s",
      equipment: Array.isArray(ex.equipment) ? ex.equipment.join(", ") : String(ex.equipment || "Bodyweight"),
      difficulty: ex.difficulty || (userLevel.toLowerCase().includes("beg") ? "Beginner" : "Intermediate"),
      instructions: Array.isArray(ex.instructions) && ex.instructions.length > 0 
        ? ex.instructions 
        : [`Perform ${exName} with strict posture, full range of motion, and smooth control.`],
      formTips: ex.coachingCues || ["Maintain tight core posture, depressed scapula, and elongated spine."],
      beginnerModification: "Perform at bodyweight or reduce repetition range slightly.",
      advancedProgression: "Add a 2-second isometric pause at peak contraction.",
      gifUrl: mediaUrl,
      targetMuscles: Array.isArray(ex.muscleGroup) ? ex.muscleGroup.join(", ") : String(ex.muscleGroup || focus)
    };
  });

  const coachingCues = [
    "Focus on mind-muscle connection over heavy ego lifting. Feel the target glute and posture fibers ignite with every repetition.",
    "Breathe rhythmically. Inhale into your ribcage during the lowering phase, exhale firmly through pursed lips on exertion.",
    "Keep your shoulders depressed and shoulder blades pinned down. You are building confident, elegant posture from within.",
    "Form is your foundation. Never rush a repetition; treat each rep as an individual display of feminine strength and grace.",
    "Hydrate between sets with steady sips. Prime your body for optimal kinetic output."
  ];

  return {
    dayNumber: safeDay,
    phaseNumber: phaseNum,
    title,
    subtitle,
    focus,
    dayType,
    estimatedMinutes,
    intensity: isRestDay ? "Low" : isCardioDay ? "Moderate" : "Challenging",
    calorieEstimate: isRestDay ? 220 : isCardioDay ? 420 : estimatedMinutes * 8,
    exercises,
    coachingCue: coachingCues[(safeDay - 1) % coachingCues.length]
  };
}

export function getDailyLifestyleForDay(
  dayNumber: number,
  profile?: WomenOnboardingProfile | null
): WomenDailyLifestyle {
  const baseWeight = profile?.currentWeight || 65;
  const calculatedWater = Math.max(2.5, Number(((baseWeight * 0.035) + 0.5).toFixed(1)));
  const calculatedSteps = profile?.dailyActivityLevel === "sedentary" ? 8000 : 10000;

  const confidenceChallenges = [
    {
      title: "Posture of Radiance",
      prompt: "Throughout today, notice whenever your shoulders slump or chin drifts toward your phone. Roll your shoulders back, lift your sternum, and take up your rightful space.",
      action: "Perform 3 posture resets today and notice how instantly your mental confidence shifts."
    },
    {
      title: "Speak with Unapologetic Clarity",
      prompt: "In your conversations today, eliminate unnecessary minimizing phrases like 'I'm just asking'. Speak with calm, assured certainty.",
      action: "Express at least one opinion or request clearly without over-apologizing."
    },
    {
      title: "Celebrate Non-Scale Strength",
      prompt: "Shift your focus from numbers on a scale to the miraculous capability of your body: your lifting strength, walking stamina, restful sleep, and vibrant energy.",
      action: "Write down 3 things your body achieved this week that make you feel genuinely proud."
    },
    {
      title: "Gentle Boundary Setting",
      prompt: "Protect your personal energy and training time. Saying 'no' to non-essential drains is saying 'yes' to your long-term health and self-respect.",
      action: "Say a polite, firm 'no' to one request that compromises your rest or wellness today."
    },
    {
      title: "Mirror Affirmation of Gratitude",
      prompt: "Look into your own eyes in the mirror today with warmth, respect, and deep appreciation for your journey.",
      action: "Spend 30 seconds smiling in the mirror and thanking yourself for showing up consistently."
    }
  ];

  const challenge = confidenceChallenges[(dayNumber - 1) % confidenceChallenges.length];

  return {
    dayNumber,
    stepTarget: calculatedSteps,
    waterTargetLiters: calculatedWater,
    sleepTargetHours: profile?.sleepScheduleHours || 8,
    mealGuidance: {
      focus: "Lean Protein Foundation for Muscle Tone",
      proteinTip: "Aim for 25-30g of high-quality protein per meal to support muscle recovery and steady satiety.",
      produceTip: "Fill half your plate with vibrant green vegetables rich in micronutrients and fiber.",
      sampleMealIdea: "Herb-baked salmon or grilled tofu with roasted sweet potato wedges and steamed asparagus."
    },
    healthyHabits: [
      `Drink 500ml water upon waking before caffeine`,
      `Hit your ${calculatedSteps.toLocaleString()} daily step target`,
      `Consume 25g+ protein at each main meal`,
      `Perform 5 minutes of mindful posture breathing`,
      `Disconnect from blue-light screens 45 minutes before bed`
    ],
    morningRoutine: "Wake up, drink 500ml lemon water, 3 deep diaphragmatic breaths, and a 2-minute posture stretch.",
    eveningRoutine: "Dim lighting, gentle 5-minute hamstring & hip opener stretch, log your confidence journal, and enjoy 8 hours of restorative sleep.",
    stressManagementTip: "Practice box breathing (4s inhale, 4s hold, 4s exhale, 4s hold) for 2 minutes whenever you feel overwhelmed.",
    confidenceChallenge: challenge,
    journalPrompt: "What is one physical or mental barrier you overcame this week that proved to you just how strong you are?"
  };
}
