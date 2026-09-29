export interface HomeExercise {
  id: string;
  name: string;
  duration: number; // in seconds
  instructions: string[];
  muscles: string[];
  beginnerMod: string;
  advancedVar: string;
  caloriesEst: string; // e.g. "10-15 kcal"
  safetyTips: string[];
  mediaName: string; // name to match in UnifiedExerciseMedia / exercises library
}

export interface HomeWorkoutCircuit {
  id: string;
  title: string;
  category: string;
  level: string;
  workoutType: string;
  equipment: string;
  duration: number; // total in minutes
  targetAreas: string[];
  estimatedCalories: string;
  exercises: HomeExercise[];
}

// Clean default: All legacy hardcoded exercises removed permanently.
// Real workouts are dynamically populated from Admin-added exercises.
export const bellyFatCardioCircuit: HomeWorkoutCircuit = {
  id: "belly_fat_cardio_circuit_12",
  title: "12 Minute Belly Fat Cardio Circuit",
  category: "Home Workout",
  level: "Beginner to Intermediate",
  workoutType: "HIIT Cardio",
  equipment: "No Equipment",
  duration: 12,
  targetAreas: ["Full Body", "Core", "Legs", "Glutes", "Shoulders"],
  estimatedCalories: "120 to 220 kcal",
  exercises: []
};
