import { ChallengeExerciseItem } from "../types/challengeEngine";

// Clean, empty exports for Posture & Vitality Program.
// Real workouts are dynamically populated from Admin-added exercises.
export const POSTURE_CORRECTION_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
export const POSTURE_CHEST_OPENING_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
export const POSTURE_HIP_MOBILITY_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
export const POSTURE_SPINAL_MOBILITY_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
export const POSTURE_GLUTE_ACTIVATION_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
export const POSTURE_DAILY_MOVEMENT_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
export const POSTURE_VITALITY_POOL: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
