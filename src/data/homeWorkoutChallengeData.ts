import { Exercise } from "./exercises";
import { filterExercisesForSplit, isHomeEligibleExercise } from "../utils/dynamicWorkoutEngine";

export interface HomeOnboardingProfile {
  gender: "Male" | "Female" | "Other";
  age: number;
  currentWeight: number;
  height: number;
  fitnessLevel: "Beginner" | "Intermediate" | "Advanced";
  mainGoal: "Build muscle" | "Lose body fat" | "Improve fitness" | "Build strength" | "Improve endurance" | "General fitness";
  trainingDaysPerWeek: number;
  currentAbilityLevel: "Complete Beginner" | "Some Experience" | "Consistent" | "Advanced";
  workoutTimePreference: "Morning" | "Evening" | "Flexible";
  startingPhotoUrl?: string;
  startDate: string;
}

export interface HomeExercise {
  id: string;
  name: string;
  targetMuscles: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  workoutType: "reps" | "time";
  instructions: string[];
  sets: string;
  repsOrDuration: string;
  restPeriod: string;
  beginnerModification: string;
  advancedProgression: string;
  coachingCues: string[];
  gifUrl: string;
  equipment: "Zero Equipment (Bodyweight)";
  sectionName?: string;
  sectionId?: string;
}

export interface HomeWorkoutSection {
  id: string;
  title: string;
  name?: string;
  description: string;
  exerciseIndices: number[];
}

export interface HomeDailyWorkout {
  dayNumber: number;
  phaseNumber: 1 | 2 | 3 | 4;
  phaseName: string;
  title: string;
  focus: string;
  isRestDay: boolean;
  is5KmCardioDay: boolean;
  cardioTypeRecommended?: "5 to 10 KM Run or Walk" | "5 to 10 KM Walk" | "5 KM Run" | "5 KM Walk";
  estimatedMinutes: number;
  exercises: HomeExercise[];
  sections: HomeWorkoutSection[];
  motivationalQuote: string;
}

export interface HomeProgramPhase {
  phaseNumber: 1 | 2 | 3 | 4;
  name: string;
  weekRange: string;
  dayRange: string;
  focus: string;
  description: string;
  iconName: string;
  color: string;
}

export const HOME_PROGRAM_PHASES: HomeProgramPhase[] = [
  {
    phaseNumber: 1,
    name: "Movement Foundations & Core Activation",
    weekRange: "Weeks 1 – 4",
    dayRange: "Days 1 – 30",
    focus: "Baseline Movement Mastery, Kinetic Joint Mobility & Aerobic Adaptation",
    description: "Build clean motor control, strengthen connective tissues, and activate dormant stabilizer muscles with structured bodyweight mechanics.",
    iconName: "Shield",
    color: "from-blue-600 to-cyan-600"
  },
  {
    phaseNumber: 2,
    name: "Strength Endurance & Kinetic Definition",
    weekRange: "Weeks 5 – 10",
    dayRange: "Days 31 – 75",
    focus: "Volume Accumulation, Unilateral Balance & Time-Under-Tension",
    description: "Increase repetition volume, shorten rest intervals, and introduce multi-planar bodyweight movements for muscle tone and stamina.",
    iconName: "Flame",
    color: "from-amber-600 to-orange-600"
  },
  {
    phaseNumber: 3,
    name: "High-Output Conditioning & Core Power",
    weekRange: "Weeks 11 – 18",
    dayRange: "Days 76 – 130",
    focus: "Metabolic Density, Explosive Power & Calisthenic Control",
    description: "Elevate your anaerobic threshold, strengthen your anterior/posterior core chain, and burn stubborn fat with high-efficiency home circuits.",
    iconName: "Zap",
    color: "from-rose-600 to-red-600"
  },
  {
    phaseNumber: 4,
    name: "Peak Transformation & Calisthenic Mastery",
    weekRange: "Weeks 19 – 26",
    dayRange: "Days 131 – 180",
    focus: "Total Body Mastery, Peak Cardiovascular Output & Lifelong Habit Lock-In",
    description: "Achieve pinnacle home athletic performance, complete advanced calisthenic variations, and solidify permanent lifestyle discipline.",
    iconName: "Trophy",
    color: "from-purple-600 to-indigo-600"
  }
];

export const HOME_MILESTONE_BADGES = [
  {
    id: "badge_first_step",
    name: "Ignition Spark",
    requirement: "Complete Day 1 Workout",
    requiredDays: 1,
    iconName: "Zap",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "badge_week_1",
    name: "Week 1 Master",
    requirement: "Complete 7 Days of Challenge",
    requiredDays: 7,
    iconName: "CheckCircle2",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: "badge_phase_1",
    name: "Foundations Champion",
    requirement: "Complete Phase 1 (Day 30)",
    requiredDays: 30,
    iconName: "Shield",
    color: "from-blue-600 to-indigo-600"
  },
  {
    id: "badge_day_60",
    name: "Habit Warrior",
    requirement: "Complete 60 Consecutive Days",
    requiredDays: 60,
    iconName: "Flame",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: "badge_phase_2",
    name: "Kinetic Definition",
    requirement: "Complete Phase 2 (Day 75)",
    requiredDays: 75,
    iconName: "Award",
    color: "from-orange-600 to-rose-600"
  },
  {
    id: "badge_day_90",
    name: "Halfway Immortal",
    requirement: "Reach 90 Days of Transformation",
    requiredDays: 90,
    iconName: "Crown",
    color: "from-rose-600 to-red-600"
  },
  {
    id: "badge_phase_3",
    name: "Conditioning Beast",
    requirement: "Complete Phase 3 (Day 130)",
    requiredDays: 130,
    iconName: "Zap",
    color: "from-purple-600 to-indigo-600"
  },
  {
    id: "badge_phase_4",
    name: "180 Day Sovereign Titan",
    requirement: "Complete the Entire 180 Day Challenge",
    requiredDays: 180,
    iconName: "Trophy",
    color: "from-amber-400 via-yellow-500 to-amber-600"
  }
];

// Clean empty catalog
export const HOME_EXERCISES_CATALOG: Record<string, HomeExercise> = {};

function getActiveExercisesFromStorage(): Exercise[] {
  if (typeof window === "undefined" || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem("fit_exercises");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

/**
 * Dynamically resolves the daily workout for 180-Day Home Workout Challenge from active Admin-added exercises.
 */
export function getHomeWorkoutForDay(
  day: number,
  level: "Beginner" | "Intermediate" | "Advanced" = "Intermediate",
  profile?: HomeOnboardingProfile | null,
  activeExercisesList?: Exercise[]
): HomeDailyWorkout {
  const safeDay = Math.max(1, Number(day) || 1);
  const phaseNumber = (safeDay <= 30 ? 1 : safeDay <= 75 ? 2 : safeDay <= 130 ? 3 : 4) as 1 | 2 | 3 | 4;
  const phase = HOME_PROGRAM_PHASES[phaseNumber - 1];
  const phaseName = phase ? phase.name : "Movement Foundations";

  const dayInWeek = ((safeDay - 1) % 7) + 1;
  const isRestDay = dayInWeek === 7;
  const is5KmCardioDay = dayInWeek === 3;

  let title = `Day ${safeDay}: `;
  let focus = "";
  let targets: string[] = [];

  if (isRestDay) {
    title += "Rest, CNS Recovery & Regenerative Mobility";
    focus = "Parasympathetic Nervous Reset & Joint Decompression";
    targets = ["Recovery", "Mobility", "Stretching"];
  } else if (is5KmCardioDay) {
    title += "Midweek 5-10 KM Aerobic Conditioning";
    focus = "Aerobic Threshold, Cardiovascular Stamina & Active Calorie Flush";
    targets = ["Cardio", "Running", "Walking"];
  } else if (dayInWeek === 1) {
    title += "Upper Body Push & Scapular Stability";
    focus = "Chest, Shoulders, Triceps & Anterior Core";
    targets = ["Chest", "Upper Body", "Shoulders", "Triceps", "Home Workouts"];
  } else if (dayInWeek === 2) {
    title += "Core Armor & Spinal Bracing";
    focus = "Transverse Abdominis, Obliques & Deep Core";
    targets = ["Core", "Abs", "Obliques"];
  } else if (dayInWeek === 4) {
    title += "Posterior Chain & Back Strength";
    focus = "Upper Back, Lats, Rhomboids & Biceps";
    targets = ["Back", "Biceps", "Arms", "Upper Body"];
  } else if (dayInWeek === 5) {
    title += "Lower Body Power & Kinetic Stamina";
    focus = "Quadriceps, Glutes, Hamstrings & Calves";
    targets = ["Legs", "Glutes", "Quads", "Hamstrings"];
  } else {
    title += "Full Body Functional Agility";
    focus = "Full Body Calisthenics, Power & Coordination";
    targets = ["Full Body", "Cardio", "Chest", "Legs"];
  }

  const allActive = Array.isArray(activeExercisesList) && activeExercisesList.length > 0
    ? activeExercisesList
    : getActiveExercisesFromStorage();

  // Strictly filter for home-eligible exercises only: no barbell, dumbbell, or gym machines
  const matched = filterExercisesForSplit(allActive, targets, { requireHomeOnly: true });

  const exercises: HomeExercise[] = matched.map((ex, idx) => {
    const mediaUrl = ex.customMediaUrl || ex.gifUrl || ex.imageUrl || "";
    return {
      id: `home_d${safeDay}_ex_${idx + 1}`,
      name: ex.name,
      targetMuscles: ex.muscleGroups || targets,
      difficulty: ex.difficulty || level,
      workoutType: "reps",
      instructions: ex.instructions && ex.instructions.length > 0 ? ex.instructions : [
        `Assume starting position for ${ex.name}.`,
        `Execute movement with strict form and full range of motion.`,
        `Hold peak contraction briefly, return under control.`
      ],
      sets: `${ex.recommendedSets || "3-4"} Sets`,
      repsOrDuration: ex.recommendedReps || "12-15 Reps",
      restPeriod: ex.restTime || "45-60s",
      beginnerModification: "Perform with reduced range or bodyweight assistance.",
      advancedProgression: "Slow down eccentric tempo or increase repetition volume.",
      coachingCues: ex.movementExecution ? [ex.movementExecution] : ["Maintain rigid core stability and steady breathing."],
      gifUrl: mediaUrl,
      equipment: "Zero Equipment (Bodyweight)"
    };
  });

  const sections: HomeWorkoutSection[] = exercises.length > 0 ? [
    {
      id: `sec_${safeDay}_1`,
      title: focus,
      description: `Targeted workout session for Day ${safeDay}.`,
      exerciseIndices: exercises.map((_, i) => i)
    }
  ] : [];

  const quotes = [
    "Discipline is choosing between what you want now and what you want most.",
    "Small daily improvements over time lead to stunning results.",
    "Your only limit is you. Show up today with intention.",
    "Consistency creates momentum. Keep pushing forward.",
    "Strength does not come from what you can do; it comes from overcoming what you once thought you couldn't."
  ];

  return {
    dayNumber: safeDay,
    phaseNumber,
    phaseName,
    title,
    focus,
    isRestDay,
    is5KmCardioDay,
    cardioTypeRecommended: is5KmCardioDay ? "5 to 10 KM Run or Walk" : undefined,
    estimatedMinutes: isRestDay ? 20 : is5KmCardioDay ? 50 : 35 + (phaseNumber * 3),
    exercises,
    sections,
    motivationalQuote: quotes[(safeDay - 1) % quotes.length]
  };
}
