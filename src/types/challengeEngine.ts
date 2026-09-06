export type ProgramId = 
  | "immortal_90" 
  | "home_180" 
  | "women_confidence" 
  | "belly_fat_shred" 
  | "posture_vitality";

export interface ProgramMetadata {
  id: ProgramId;
  name: string;
  tagline: string;
  totalDays: number;
  description: string;
  accentColor: string;
  badge: string;
  categories: string[];
  equipmentRequired: string[];
  scientificDisclaimer?: string;
  coverImage: string;
}

export interface ChallengeExerciseItem {
  id: string;
  programId: ProgramId;
  programName: string;
  dayNumber: number; // 1 to totalDays
  category: string;
  muscleGroup: string[];
  exerciseName: string;
  equipment: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  sets: number | string;
  reps: number | string;
  duration: string;
  instructions: string[];
  videoUrl?: string;
  animationUrl?: string;
  gifUrl?: string;
  imageUrl?: string;
  restTime?: string;
  coachingCues?: string[];
  benefits?: string[];
}

export interface DayWorkoutMeta {
  dayNumber: number;
  programId: ProgramId;
  title: string;
  category: string;
  targetMuscles: string[];
  estimatedDuration: string;
  estimatedCalories: number;
  isRestDay: boolean;
  isCardioOnly: boolean;
  cardioDistance?: string;
  guidelines: string[];
  coachingNotes: string;
}

export interface DayExecutionPlan {
  meta: DayWorkoutMeta;
  exercises: ChallengeExerciseItem[];
}

export interface ProgramProgressState {
  programId: ProgramId;
  programName: string;
  currentDay: number; // Active day 1-based
  workoutStarted: boolean;
  workoutCompleted: boolean;
  startedAt: string | null; // ISO string
  completedAt: string | null; // ISO string
  exercisesCompleted: string[]; // List of completed exercise IDs for currentDay
  completionPercentage: number;
  nextWorkoutUnlockTime: number | null; // epoch ms (completedAt + 7h)
  totalCompletedWorkouts: number;
  currentStreak: number;
  history: Record<number, {
    dayNumber: number;
    category: string;
    completedAt: string;
    exercisesCount: number;
  }>;
}

export interface ValidationError {
  type: "category_mismatch" | "program_mismatch" | "missing_workout" | "duplicate_exercise" | "missing_musclegroup" | "missing_program_assignment";
  message: string;
  severity: "error" | "warning";
  exerciseId?: string;
  exerciseName?: string;
  programId?: string;
  dayNumber?: number;
}
