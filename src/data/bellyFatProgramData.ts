import { ChallengeExerciseItem } from "../types/challengeEngine";

// Clean, empty exports for Belly Fat Shred.
// Real workouts are dynamically populated from Admin-added exercises.
export const BELLY_CORE_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
export const BELLY_HIIT_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
export const BELLY_CARDIO_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
export const BELLY_OBLIQUES_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
export const BELLY_CONDITIONING_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
export const BELLY_FAT_EXERCISES_POOL: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [];
