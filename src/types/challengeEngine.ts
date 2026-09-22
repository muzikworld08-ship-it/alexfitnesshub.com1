export type ProgramId = 
  | "immortal_90" 
  | "home_180" 
  | "belly_fat_shred" 
  | "posture_vitality" 
  | "women_confidence"
  | string;

export interface ProgramMetadata {
  id: ProgramId;
  name: string;
  tagline: string;
  totalDays: number;
  bannerImage?: string;
  category?: string;
  difficulty?: string;
  description?: string;
  themeColor?: string;
  features?: string[];
  [key: string]: any;
}

export interface ChallengeExerciseItem {
  id?: string;
  programId?: ProgramId;
  programName?: string;
  category?: string;
  name?: string;
  muscleGroup?: string[];
  targetMuscles?: string[];
  equipment?: string[];
  difficulty?: string;
  reps?: string;
  sets?: any;
  restSeconds?: number;
  restTime?: string;
  instructions?: string[];
  safetyTips?: string[];
  mediaUrl?: string;
  mediaType?: "image" | "video";
  gifUrl?: string;
  imageUrl?: string;
  dayNumber?: number;
  [key: string]: any;
}

export interface DayWorkoutMeta {
  dayNumber?: number;
  dayTitle?: string;
  title?: string;
  focus?: string;
  estimatedMinutes?: number;
  caloriesBurnEstimate?: number;
  totalExercises?: number;
  isRestDay?: boolean;
  [key: string]: any;
}

export interface DayExecutionPlan {
  programId?: ProgramId;
  dayNumber?: number;
  title?: string;
  focus?: string;
  exercises?: ChallengeExerciseItem[];
  meta?: DayWorkoutMeta;
  warmup?: string[];
  cooldown?: string[];
  isRestDay?: boolean;
  notes?: string;
  [key: string]: any;
}
