import { Exercise } from "../data/exercises";

export type DailyWorkoutProgramType =
  | "immortal_90"
  | "women_confidence"
  | "lifestyle_academy"
  | "home_workout"
  | "belly_fat_shred"
  | "gym_hypertrophy"
  | "cardio_calisthenics"
  | "posture_vitality"
  | "custom";

export interface DailyWorkoutExerciseItem {
  id: string;
  name: string;
  sets: number;
  reps: string | number;
  restSeconds: number;
  tempo?: string;
  coachingCues: string;
  targetMuscle: string;
  equipment: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  gifUrl: string;
  instructions: string[];
  startingPosition?: string;
  movementExecution?: string;
  finishingPosition?: string;
  safetyTips?: string[];
  commonMistakes?: string[];
  matchedMasterExercise?: Exercise;
}

export interface DailyWorkoutWarmupItem {
  name: string;
  durationOrReps: string;
  instructions: string;
  gifUrl?: string;
}

export interface DailyWorkoutCooldownItem {
  name: string;
  duration: string;
  instructions: string;
  gifUrl?: string;
}

export interface AIDailyWorkoutPlan {
  id: string;
  title: string;
  tagline: string;
  programType: DailyWorkoutProgramType;
  programName: string;
  dayNumber: number;
  targetMuscles: string[];
  fitnessLevel: "Beginner" | "Intermediate" | "Advanced" | "Immortal";
  equipmentRequired: string[];
  estimatedMinutes: number;
  estimatedCalories: string;
  coachingBrief: string;
  warmup: DailyWorkoutWarmupItem[];
  exercises: DailyWorkoutExerciseItem[];
  cooldown: DailyWorkoutCooldownItem[];
  nutritionTip: string;
  hydrationTip: string;
  createdAt: string;
  isAiGenerated: boolean;
  isFallback?: boolean;
}

export interface GenerateDailyWorkoutParams {
  programType: DailyWorkoutProgramType;
  dayNumber?: number;
  targetMuscle?: string;
  fitnessLevel?: "Beginner" | "Intermediate" | "Advanced" | "Immortal";
  equipment?: string;
  duration?: number;
  intensity?: "Moderate" | "High" | "Peak Immortal";
  customFocusPrompt?: string;
  workoutStyle?: string;
}
