import { ChallengeExerciseItem } from "../types/challengeEngine";

// Clean, empty exports for 180-Day Home Workout Challenge.
// Real workouts are dynamically populated from Admin-added exercises.
export const HOME_UPPER_BODY_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
export const HOME_LEGS_GLUTES_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
export const HOME_CARDIO_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
export const HOME_BACK_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
export const HOME_CORE_ABS_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
export const HOME_MOBILITY_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
export const HOME_180_EXERCISES_POOL: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
