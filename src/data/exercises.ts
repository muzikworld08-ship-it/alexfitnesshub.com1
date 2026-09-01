export interface Exercise {
  id: string;
  name: string;
  muscleGroups: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructions: string[];
  equipment: string[];
  category: string;
  categories: string[];
  commonMistakes: string[];
  safetyTips: string[];
  alternativeExercises: string[];
  progressionVariations: string[];
  isPremium: boolean;
  youtubeVideoId?: string;
  
  // Real Biomechanical coaching fields
  startingPosition: string;
  movementExecution: string;
  finishingPosition: string;
  regressionVariations: string[];
  musclesWorked: string[];
  gifUrl: string; // HD professional fitness loop / video url
  customMediaType?: "image" | "video";
  customMediaUrl?: string;
  description?: string;
  imageUrl?: string;
  duration?: string;
  tags?: string[];

  // Detailed Coaching Parameters
  breathingInstructions?: string;
  recommendedSetsReps?: string;
  benefits?: string[];
  trainingRecommendations?: string;

  // Curated Refactoring Fields
  bodyPart?: string;
  recommendedSets?: string;
  recommendedReps?: string;
  restTime?: string;
  caloriesBurned?: number;
  trainerTips?: string;
  safetyNotes?: string;
  variations?: string[];
}

export function getExerciseGifUrl(name: string, category: string = ""): string {
  const nameLower = name.toLowerCase();
  
  // Specific Chest exercises
  if (
    nameLower.includes("bench press") ||
    nameLower.includes("chest press") ||
    nameLower.includes("push up") ||
    nameLower.includes("pushup") ||
    nameLower.includes("push-up") ||
    nameLower.includes("pec deck") ||
    nameLower.includes("crossover") ||
    nameLower.includes("guillotine") ||
    (nameLower.includes("fly") && !nameLower.includes("rear delt")) ||
    (nameLower.includes("dips") && nameLower.includes("chest")) ||
    nameLower.includes("incline dumbbell press") ||
    nameLower.includes("decline bench")
  ) {
    return "https://media.giphy.com/media/3o84U6421O1IIXbowg/giphy.gif";
  }

  // Glutes & Hip Thrusts
  if (
    nameLower.includes("glute bridge") ||
    nameLower.includes("hip thrust") ||
    (nameLower.includes("kickback") && nameLower.includes("glute")) ||
    nameLower.includes("frog pump") ||
    nameLower.includes("pull-through") ||
    nameLower.includes("kas glute") ||
    nameLower.includes("glute walk") ||
    nameLower.includes("hip abduction") ||
    nameLower.includes("band walk") ||
    nameLower.includes("curtsy")
  ) {
    return "https://media.giphy.com/media/v1F0A8f5Ff6hO/giphy.gif";
  }

  // Legs, Squats, Lunges, Quads, Hamstrings
  if (
    nameLower.includes("squat") ||
    nameLower.includes("leg press") ||
    nameLower.includes("lunge") ||
    nameLower.includes("step up") ||
    nameLower.includes("step-up") ||
    nameLower.includes("sissy") ||
    nameLower.includes("cyclist") ||
    nameLower.includes("hamstring") ||
    nameLower.includes("leg extension") ||
    nameLower.includes("leg curl") ||
    nameLower.includes("calf raise") ||
    nameLower.includes("bulgarian") ||
    nameLower.includes("goblet") ||
    nameLower.includes("hack squat") ||
    nameLower.includes("wall sit")
  ) {
    return "https://media.giphy.com/media/u8946fAnhQ6cH9R16e/giphy.gif";
  }

  // Core, Abs, Obliques
  if (
    nameLower.includes("plank") ||
    nameLower.includes("crunch") ||
    nameLower.includes("twist") ||
    nameLower.includes("abdominal") ||
    nameLower.includes("sit up") ||
    nameLower.includes("situp") ||
    nameLower.includes("sit-up") ||
    nameLower.includes("dead bug") ||
    nameLower.includes("vacuum") ||
    nameLower.includes("pallof") ||
    nameLower.includes("dragon flag") ||
    nameLower.includes("wiper") ||
    nameLower.includes("woodchopper") ||
    nameLower.includes("flutter kick") ||
    nameLower.includes("hollow body") ||
    nameLower.includes("l sit") ||
    nameLower.includes("l-sit") ||
    nameLower.includes("bird dog") ||
    nameLower.includes("ab wheel") ||
    nameLower.includes("knee raise") ||
    nameLower.includes("leg raise") ||
    nameLower.includes("toe touch")
  ) {
    return "https://media.giphy.com/media/xT8qB7Sbwskk27Rdy8/giphy.gif";
  }

  // Jump Rope / Rope Jump
  if (
    nameLower.includes("jump rope") ||
    nameLower.includes("rope jump") ||
    nameLower.includes("skipping")
  ) {
    return "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif";
  }

  // Cardio, HIIT, Sprints, Walking, Running
  if (
    nameLower.includes("mountain climber") ||
    nameLower.includes("burpee") ||
    nameLower.includes("jumping jack") ||
    nameLower.includes("bike") ||
    nameLower.includes("cycling") ||
    nameLower.includes("run") ||
    nameLower.includes("sprint") ||
    nameLower.includes("walk") ||
    nameLower.includes("treadmill") ||
    nameLower.includes("devil press") ||
    nameLower.includes("wall ball") ||
    nameLower.includes("sled") ||
    nameLower.includes("battle rope") ||
    nameLower.includes("box jump") ||
    nameLower.includes("skater jump") ||
    nameLower.includes("high knee") ||
    nameLower.includes("rowing machine") ||
    nameLower.includes("cardio") ||
    nameLower.includes("hiit") ||
    nameLower.includes("aerobic") ||
    nameLower.includes("12-3-30")
  ) {
    return "https://media.giphy.com/media/13sc1CHidbO6S4/giphy.gif";
  }

  // Back, Lats, Pullups, Rows, Deadlifts
  if (
    (nameLower.includes("row") && !nameLower.includes("upright row") && !nameLower.includes("rowing machine")) ||
    nameLower.includes("pull-up") ||
    nameLower.includes("pullup") ||
    nameLower.includes("chin-up") ||
    nameLower.includes("chinup") ||
    nameLower.includes("deadlift") ||
    nameLower.includes("rdl") ||
    nameLower.includes("lat pulldown") ||
    nameLower.includes("pullover") ||
    nameLower.includes("meadows") ||
    nameLower.includes("pendlay") ||
    nameLower.includes("seal row") ||
    nameLower.includes("lat prayer") ||
    nameLower.includes("straight arm pulldown") ||
    nameLower.includes("t-bar") ||
    nameLower.includes("t bar") ||
    nameLower.includes("back extension") ||
    nameLower.includes("hyperextension")
  ) {
    return "https://media.giphy.com/media/duuVpx00In40Syc7m6/giphy.gif";
  }

  // Biceps, Forearms
  if (
    nameLower.includes("bicep") ||
    (nameLower.includes("curl") && !nameLower.includes("leg curl") && !nameLower.includes("hamstring")) ||
    nameLower.includes("zottman") ||
    nameLower.includes("bayesian") ||
    nameLower.includes("spider curl") ||
    nameLower.includes("preacher") ||
    nameLower.includes("wrist curl") ||
    nameLower.includes("hammer curl") ||
    nameLower.includes("concentration curl")
  ) {
    return "https://media.giphy.com/media/3o7qE1YN7aBOFPRw8E/giphy.gif";
  }

  // Triceps
  if (
    (nameLower.includes("dip") && !nameLower.includes("hip dip") && !nameLower.includes("plank")) ||
    nameLower.includes("tricep") ||
    nameLower.includes("pushdown") ||
    nameLower.includes("skull crusher") ||
    (nameLower.includes("kickback") && !nameLower.includes("glute")) ||
    nameLower.includes("close grip bench") ||
    nameLower.includes("jm press") ||
    nameLower.includes("tate press") ||
    (nameLower.includes("overhead") && nameLower.includes("extension")) ||
    nameLower.includes("french press")
  ) {
    return "https://media.giphy.com/media/3o84U39K5Cj6D0v2w0/giphy.gif";
  }

  // Calisthenics Advanced (Handstands, Planche, Muscle Ups, Levers)
  if (
    nameLower.includes("handstand") ||
    nameLower.includes("planche") ||
    nameLower.includes("front lever") ||
    nameLower.includes("back lever") ||
    nameLower.includes("muscle up") ||
    nameLower.includes("muscle-up") ||
    nameLower.includes("calisthenic")
  ) {
    return "https://media.giphy.com/media/3o7TKMGpx4g2iNffYk/giphy.gif";
  }

  // Shoulders, Deltoids, Overhead Presses, Traps
  if (
    nameLower.includes("shoulder") ||
    nameLower.includes("overhead press") ||
    nameLower.includes("military press") ||
    nameLower.includes("lateral raise") ||
    nameLower.includes("front raise") ||
    nameLower.includes("rear delt") ||
    nameLower.includes("deltoid") ||
    nameLower.includes("face pull") ||
    nameLower.includes("lu raise") ||
    nameLower.includes("bradford") ||
    nameLower.includes("upright row") ||
    nameLower.includes("shrug") ||
    nameLower.includes("arnold press") ||
    nameLower.includes("pull-apart") ||
    nameLower.includes("pullapart")
  ) {
    return "https://media.giphy.com/media/3o7qE6b39zV1LALZRe/giphy.gif";
  }

  // Mobility, Stretching, Yoga, Recovery
  if (
    nameLower.includes("stretch") ||
    nameLower.includes("mobility") ||
    nameLower.includes("pigeon") ||
    nameLower.includes("scorpion") ||
    nameLower.includes("couch") ||
    nameLower.includes("shin box") ||
    nameLower.includes("cat-cow") ||
    nameLower.includes("child's pose") ||
    nameLower.includes("cobra") ||
    nameLower.includes("breathing") ||
    nameLower.includes("recovery") ||
    nameLower.includes("warm-up") ||
    nameLower.includes("warmup") ||
    nameLower.includes("cool down") ||
    nameLower.includes("cooldown")
  ) {
    return "https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif";
  }

  // Universal High-Tension Movement Demonstration Loop
  return "https://media.giphy.com/media/u8946fAnhQ6cH9R16e/giphy.gif";
}

export interface Program {
  id: string;
  name: string;
  category: "Home Workout Programs" | "Men's Programs" | "Women's Programs" | "Calisthenics Programs" | "Training Styles";
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  searchTags: string[];
  imageUrl: string;
  isPremium: boolean;
  schedule: {
    day: string;
    focus: string;
    exercises: string[]; // exercise names or IDs
    mealPlan?: string;  // Shred, Bulk, or Lean meal plans
  }[];
}

export const BACKUP_EXERCISE_MEDIA = {
  chest: "",
  back: "",
  shoulders: "",
  arms: "",
  core: "",
  legs: "",
  neck: "",
  cardio: "",
  mobility: ""
};

export const REAL_EXERCISE_MEDIA = {
  chest: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80",
  back: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80",
  shoulders: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80",
  arms: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
  core: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
  legs: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80",
  neck: "",
  cardio: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&auto=format&fit=crop&q=80",
  mobility: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80"
};

interface RawExerciseData {
  name: string;
  displayName?: string;
  category: "Gym Workouts" | "Home Workouts" | "Cardio Workouts" | "Calisthenics Workouts" | "Military Style Fitness";
  sub: string; // Sub-segment like Chest, Back, HIIT Cardio, Beginner Calisthenics etc.
  equipment: string[];
  primary: string;
  secondary: string[];
  diff: "Beginner" | "Intermediate" | "Advanced";
}

const RAW_EXERCISES_DATA: RawExerciseData[] = [
  // ================= GYM WORKOUTS =================
  // CHEST
  { name: "Barbell Bench Press", category: "Gym Workouts", sub: "Chest", equipment: ["Barbell"], primary: "Chest", secondary: ["Triceps", "Shoulders"], diff: "Intermediate" },
  { name: "Incline Dumbbell Press", category: "Gym Workouts", sub: "Chest", equipment: ["Dumbbell"], primary: "Chest", secondary: ["Shoulders"], diff: "Intermediate" },
  { name: "Dumbbell Chest Press", category: "Gym Workouts", sub: "Chest", equipment: ["Dumbbell"], primary: "Chest", secondary: ["Triceps"], diff: "Intermediate" },
  { name: "Decline Bench Press", category: "Gym Workouts", sub: "Chest", equipment: ["Barbell"], primary: "Chest", secondary: ["Triceps"], diff: "Intermediate" },
  { name: "Cable Chest Fly", category: "Gym Workouts", sub: "Chest", equipment: ["Cable Machine"], primary: "Chest", secondary: ["Front Delts"], diff: "Intermediate" },
  { name: "Dumbbell Fly", category: "Gym Workouts", sub: "Chest", equipment: ["Dumbbell"], primary: "Chest", secondary: ["Front Delts"], diff: "Beginner" },
  { name: "Push Ups", category: "Gym Workouts", sub: "Chest", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Triceps", "Core"], diff: "Beginner" },
  { name: "Chest Dips", category: "Gym Workouts", sub: "Chest", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Triceps", "Shoulders"], diff: "Intermediate" },
  { name: "Machine Chest Press", category: "Gym Workouts", sub: "Chest", equipment: ["Machine"], primary: "Chest", secondary: ["Triceps"], diff: "Beginner" },
  { name: "Pec Deck Fly", category: "Gym Workouts", sub: "Chest", equipment: ["Machine"], primary: "Chest", secondary: ["Front Delts"], diff: "Beginner" },

  // BACK
  { name: "Pull Ups", category: "Gym Workouts", sub: "Back", equipment: ["Bodyweight"], primary: "Back", secondary: ["Biceps", "Lats"], diff: "Intermediate" },
  { name: "Lat Pulldown", category: "Gym Workouts", sub: "Back", equipment: ["Machine"], primary: "Back", secondary: ["Biceps"], diff: "Beginner" },
  { name: "Barbell Row", category: "Gym Workouts", sub: "Back", equipment: ["Barbell"], primary: "Back", secondary: ["Biceps", "Core"], diff: "Intermediate" },
  { name: "Seated Cable Row", category: "Gym Workouts", sub: "Back", equipment: ["Cable Machine"], primary: "Back", secondary: ["Biceps"], diff: "Beginner" },
  { name: "Dumbbell Row", category: "Gym Workouts", sub: "Back", equipment: ["Dumbbell"], primary: "Back", secondary: ["Biceps"], diff: "Beginner" },
  { name: "T Bar Row", category: "Gym Workouts", sub: "Back", equipment: ["Barbell"], primary: "Back", secondary: ["Biceps"], diff: "Intermediate" },
  { name: "Deadlift", category: "Gym Workouts", sub: "Back", equipment: ["Barbell"], primary: "Back", secondary: ["Hamstrings", "Glutes", "Lower Back"], diff: "Advanced" },
  { name: "Straight Arm Pulldown", category: "Gym Workouts", sub: "Back", equipment: ["Cable Machine"], primary: "Back", secondary: ["Triceps"], diff: "Intermediate" },
  { name: "Face Pulls", category: "Gym Workouts", sub: "Back", equipment: ["Cable Machine"], primary: "Back", secondary: ["Shoulders", "Traps"], diff: "Beginner" },
  { name: "Back Extension", category: "Gym Workouts", sub: "Back", equipment: ["Machine"], primary: "Back", secondary: ["Glutes", "Hamstrings"], diff: "Beginner" },

  // SHOULDERS
  { name: "Overhead Barbell Press", category: "Gym Workouts", sub: "Shoulders", equipment: ["Barbell"], primary: "Shoulders", secondary: ["Triceps"], diff: "Intermediate" },
  { name: "Dumbbell Shoulder Press", category: "Gym Workouts", sub: "Shoulders", equipment: ["Dumbbell"], primary: "Shoulders", secondary: ["Triceps"], diff: "Intermediate" },
  { name: "Lateral Raises", category: "Gym Workouts", sub: "Shoulders", equipment: ["Dumbbell"], primary: "Shoulders", secondary: ["Traps"], diff: "Beginner" },
  { name: "Front Raises", category: "Gym Workouts", sub: "Shoulders", equipment: ["Dumbbell"], primary: "Shoulders", secondary: ["Chest"], diff: "Beginner" },
  { name: "Rear Delt Fly", category: "Gym Workouts", sub: "Shoulders", equipment: ["Dumbbell"], primary: "Shoulders", secondary: ["Traps"], diff: "Beginner" },
  { name: "Arnold Press", category: "Gym Workouts", sub: "Shoulders", equipment: ["Dumbbell"], primary: "Shoulders", secondary: ["Triceps"], diff: "Intermediate" },
  { name: "Cable Lateral Raise", category: "Gym Workouts", sub: "Shoulders", equipment: ["Cable Machine"], primary: "Shoulders", secondary: ["Traps"], diff: "Intermediate" },
  { name: "Upright Row", category: "Gym Workouts", sub: "Shoulders", equipment: ["Barbell"], primary: "Shoulders", secondary: ["Traps"], diff: "Intermediate" },
  { name: "Shrugs", category: "Gym Workouts", sub: "Shoulders", equipment: ["Dumbbell"], primary: "Shoulders", secondary: ["Traps"], diff: "Beginner" },
  { name: "Machine Shoulder Press", category: "Gym Workouts", sub: "Shoulders", equipment: ["Machine"], primary: "Shoulders", secondary: ["Triceps"], diff: "Beginner" },

  // BICEPS
  { name: "Barbell Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["Barbell"], primary: "Biceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "Dumbbell Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["Dumbbell"], primary: "Biceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "Hammer Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["Dumbbell"], primary: "Biceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "Preacher Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["EZ-Bar"], primary: "Biceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "Cable Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["Cable Machine"], primary: "Biceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "Concentration Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["Dumbbell"], primary: "Biceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "Incline Dumbbell Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["Dumbbell"], primary: "Biceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "EZ Bar Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["EZ-Bar"], primary: "Biceps", secondary: ["Forearms"], diff: "Beginner" },

  // TRICEPS
  { name: "Triceps Pushdown", category: "Gym Workouts", sub: "Triceps", equipment: ["Cable Machine"], primary: "Triceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "Skull Crushers", category: "Gym Workouts", sub: "Triceps", equipment: ["EZ-Bar"], primary: "Triceps", secondary: ["Forearms"], diff: "Intermediate" },
  { name: "Close Grip Bench Press", category: "Gym Workouts", sub: "Triceps", equipment: ["Barbell"], primary: "Triceps", secondary: ["Chest", "Shoulders"], diff: "Intermediate" },
  { name: "Overhead Triceps Extension", category: "Gym Workouts", sub: "Triceps", equipment: ["Dumbbell"], primary: "Triceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "Dips", category: "Gym Workouts", sub: "Triceps", equipment: ["Bodyweight"], primary: "Triceps", secondary: ["Chest", "Shoulders"], diff: "Intermediate" },
  { name: "Dumbbell Kickbacks", category: "Gym Workouts", sub: "Triceps", equipment: ["Dumbbell"], primary: "Triceps", secondary: ["Shoulders"], diff: "Beginner" },
  { name: "Cable Overhead Extension", category: "Gym Workouts", sub: "Triceps", equipment: ["Cable Machine"], primary: "Triceps", secondary: ["Forearms"], diff: "Intermediate" },

  // LEGS
  { name: "Barbell Squat", category: "Gym Workouts", sub: "Legs", equipment: ["Barbell"], primary: "Legs", secondary: ["Glutes", "Hamstrings"], diff: "Intermediate" },
  { name: "Leg Press", category: "Gym Workouts", sub: "Legs", equipment: ["Machine"], primary: "Legs", secondary: ["Hamstrings", "Glutes"], diff: "Beginner" },
  { name: "Lunges", category: "Gym Workouts", sub: "Legs", equipment: ["Dumbbell"], primary: "Legs", secondary: ["Glutes", "Hamstrings"], diff: "Beginner" },
  { name: "Romanian Deadlift", category: "Gym Workouts", sub: "Legs", equipment: ["Barbell"], primary: "Legs", secondary: ["Glutes", "Hamstrings"], diff: "Intermediate" },
  { name: "Leg Extension", category: "Gym Workouts", sub: "Legs", equipment: ["Machine"], primary: "Legs", secondary: [], diff: "Beginner" },
  { name: "Leg Curl", category: "Gym Workouts", sub: "Legs", equipment: ["Machine"], primary: "Legs", secondary: [], diff: "Beginner" },
  { name: "Calf Raises", category: "Gym Workouts", sub: "Legs", equipment: ["Dumbbell"], primary: "Calves", secondary: [], diff: "Beginner" },
  { name: "Bulgarian Split Squat", category: "Gym Workouts", sub: "Legs", equipment: ["Dumbbell"], primary: "Legs", secondary: ["Glutes", "Hamstrings"], diff: "Intermediate" },
  { name: "Hip Thrust", category: "Gym Workouts", sub: "Legs", equipment: ["Barbell"], primary: "Glutes", secondary: ["Hamstrings"], diff: "Intermediate" },
  { name: "Goblet Squat", category: "Gym Workouts", sub: "Legs", equipment: ["Kettlebell"], primary: "Legs", secondary: ["Glutes", "Core"], diff: "Beginner" },

  // ABS AND CORE
  { name: "Hanging Leg Raise", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Pullup Bar"], primary: "Core", secondary: ["Abs"], diff: "Intermediate" },
  { name: "Cable Crunch", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Cable Machine"], primary: "Core", secondary: ["Abs"], diff: "Intermediate" },
  { name: "Plank", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Bodyweight"], primary: "Core", secondary: ["Shoulders"], diff: "Beginner" },
  { name: "Russian Twist", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Bodyweight"], primary: "Core", secondary: ["Obliques"], diff: "Beginner" },
  { name: "Bicycle Crunch", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Bodyweight"], primary: "Core", secondary: ["Abs"], diff: "Beginner" },
  { name: "Mountain Climbers", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Bodyweight"], primary: "Core", secondary: ["Cardio"], diff: "Beginner" },
  { name: "Ab Wheel Rollout", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Ab Wheel"], primary: "Core", secondary: ["Lats"], diff: "Intermediate" },
  { name: "Sit Ups", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Bodyweight"], primary: "Core", secondary: ["Abs"], diff: "Beginner" },

  // ================= HOME WORKOUTS =================
  // FULL BODY HOME WORKOUT
  { name: "Full Body Home Workout: Push Ups", displayName: "Push Ups", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Triceps", "Core"], diff: "Beginner" },
  { name: "Full Body Home Workout: Bodyweight Squats", displayName: "Bodyweight Squats", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes", "Hamstrings"], diff: "Beginner" },
  { name: "Full Body Home Workout: Lunges", displayName: "Lunges", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes", "Hamstrings"], diff: "Beginner" },
  { name: "Full Body Home Workout: Glute Bridges", displayName: "Glute Bridges", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Glutes", secondary: ["Hamstrings"], diff: "Beginner" },
  { name: "Full Body Home Workout: Plank", displayName: "Plank", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Core", secondary: ["Shoulders"], diff: "Beginner" },
  { name: "Full Body Home Workout: Mountain Climbers", displayName: "Mountain Climbers", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Core", secondary: ["Cardio"], diff: "Beginner" },
  { name: "Full Body Home Workout: Burpees", displayName: "Burpees", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Full Body", secondary: ["Cardio"], diff: "Intermediate" },
  { name: "Full Body Home Workout: Jumping Jacks", displayName: "Jumping Jacks", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Full Body"], diff: "Beginner" },
  { name: "Full Body Home Workout: High Knees", displayName: "High Knees", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "Full Body Home Workout: Bear Crawl", displayName: "Bear Crawl", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Full Body", secondary: ["Core"], diff: "Intermediate" },

  // HOME CHEST WORKOUT
  { name: "Home Chest Workout: Standard Push Ups", displayName: "Standard Push Ups", category: "Home Workouts", sub: "Home Chest Workout", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Triceps"], diff: "Beginner" },
  { name: "Home Chest Workout: Wide Push Ups", displayName: "Wide Push Ups", category: "Home Workouts", sub: "Home Chest Workout", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Shoulders"], diff: "Beginner" },
  { name: "Home Chest Workout: Diamond Push Ups", displayName: "Diamond Push Ups", category: "Home Workouts", sub: "Home Chest Workout", equipment: ["Bodyweight"], primary: "Triceps", secondary: ["Chest"], diff: "Intermediate" },
  { name: "Home Chest Workout: Incline Push Ups", displayName: "Incline Push Ups", category: "Home Workouts", sub: "Home Chest Workout", equipment: ["Bodyweight"], primary: "Lower Chest", secondary: ["Triceps"], diff: "Beginner" },
  { name: "Home Chest Workout: Decline Push Ups", displayName: "Decline Push Ups", category: "Home Workouts", sub: "Home Chest Workout", equipment: ["Bodyweight"], primary: "Upper Chest", secondary: ["Triceps"], diff: "Intermediate" },
  { name: "Home Chest Workout: Chest Squeeze Push Ups", displayName: "Chest Squeeze Push Ups", category: "Home Workouts", sub: "Home Chest Workout", equipment: ["Bodyweight"], primary: "Inner Chest", secondary: ["Triceps"], diff: "Intermediate" },

  // HOME LEG WORKOUT
  { name: "Home Leg Workout: Bodyweight Squats", displayName: "Bodyweight Squats", category: "Home Workouts", sub: "Home Leg Workout", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes"], diff: "Beginner" },
  { name: "Home Leg Workout: Jump Squats", displayName: "Jump Squats", category: "Home Workouts", sub: "Home Leg Workout", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Cardio"], diff: "Intermediate" },
  { name: "Home Leg Workout: Walking Lunges", displayName: "Walking Lunges", category: "Home Workouts", sub: "Home Leg Workout", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes"], diff: "Beginner" },
  { name: "Home Leg Workout: Reverse Lunges", displayName: "Reverse Lunges", category: "Home Workouts", sub: "Home Leg Workout", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes"], diff: "Beginner" },
  { name: "Home Leg Workout: Wall Sit", displayName: "Wall Sit", category: "Home Workouts", sub: "Home Leg Workout", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Calves"], diff: "Beginner" },
  { name: "Home Leg Workout: Single Leg Glute Bridge", displayName: "Single Leg Glute Bridge", category: "Home Workouts", sub: "Home Leg Workout", equipment: ["Bodyweight"], primary: "Glutes", secondary: ["Hamstrings"], diff: "Intermediate" },
  { name: "Home Leg Workout: Calf Raises", displayName: "Calf Raises", category: "Home Workouts", sub: "Home Leg Workout", equipment: ["Bodyweight"], primary: "Calves", secondary: [], diff: "Beginner" },

  // HOME CORE WORKOUT
  { name: "Home Core Workout: Plank", displayName: "Plank", category: "Home Workouts", sub: "Home Core Workout", equipment: ["Bodyweight"], primary: "Core", secondary: ["Shoulders"], diff: "Beginner" },
  { name: "Home Core Workout: Side Plank", displayName: "Side Plank", category: "Home Workouts", sub: "Home Core Workout", equipment: ["Bodyweight"], primary: "Obliques", secondary: ["Core"], diff: "Intermediate" },
  { name: "Home Core Workout: Leg Raises", displayName: "Leg Raises", category: "Home Workouts", sub: "Home Core Workout", equipment: ["Bodyweight"], primary: "Core", secondary: ["Abs"], diff: "Beginner" },
  { name: "Home Core Workout: Sit Ups", displayName: "Sit Ups", category: "Home Workouts", sub: "Home Core Workout", equipment: ["Bodyweight"], primary: "Core", secondary: ["Abs"], diff: "Beginner" },
  { name: "Home Core Workout: Crunches", displayName: "Crunches", category: "Home Workouts", sub: "Home Core Workout", equipment: ["Bodyweight"], primary: "Abs", secondary: [], diff: "Beginner" },
  { name: "Home Core Workout: Flutter Kicks", displayName: "Flutter Kicks", category: "Home Workouts", sub: "Home Core Workout", equipment: ["Bodyweight"], primary: "Abs", secondary: ["Core"], diff: "Beginner" },
  { name: "Home Core Workout: Russian Twist", displayName: "Russian Twist", category: "Home Workouts", sub: "Home Core Workout", equipment: ["Bodyweight"], primary: "Obliques", secondary: ["Core"], diff: "Beginner" },

  // ================= CARDIO WORKOUTS =================
  // FAT BURNING CARDIO
  { name: "Fat Burning Cardio: Running", displayName: "Running", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "Fat Burning Cardio: Walking", displayName: "Walking", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "Fat Burning Cardio: Cycling", displayName: "Cycling", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Stationary Bike"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "Fat Burning Cardio: Jump Rope", displayName: "Jump Rope", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Jump Rope"], primary: "Cardio", secondary: ["Calves"], diff: "Beginner" },
  { name: "Fat Burning Cardio: Rowing Machine", displayName: "Rowing Machine", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Rowing Machine"], primary: "Cardio", secondary: ["Back", "Arms"], diff: "Intermediate" },
  { name: "Fat Burning Cardio: Stair Climbing", displayName: "Stair Climbing", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "Fat Burning Cardio: Elliptical Training", displayName: "Elliptical Training", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Elliptical Machine"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "Fat Burning Cardio: Swimming", displayName: "Swimming", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Full Body"], diff: "Intermediate" },
  { name: "Fat Burning Cardio: Hiking", displayName: "Hiking", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "Fat Burning Cardio: Sprint Intervals", displayName: "Sprint Intervals", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Intermediate" },

  // HIIT CARDIO
  { name: "HIIT Cardio: Burpees", displayName: "Burpees", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Full Body"], diff: "Intermediate" },
  { name: "HIIT Cardio: High Knees", displayName: "High Knees", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "HIIT Cardio: Jump Squats", displayName: "Jump Squats", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Intermediate" },
  { name: "HIIT Cardio: Mountain Climbers", displayName: "Mountain Climbers", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Core"], diff: "Beginner" },
  { name: "HIIT Cardio: Jumping Jacks", displayName: "Jumping Jacks", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Full Body"], diff: "Beginner" },
  { name: "HIIT Cardio: Sprint Intervals", displayName: "Sprint Intervals", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Intermediate" },
  { name: "HIIT Cardio: Skater Jumps", displayName: "Skater Jumps", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Intermediate" },
  { name: "HIIT Cardio: Battle Ropes", displayName: "Battle Ropes", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Battle Ropes"], primary: "Cardio", secondary: ["Arms", "Shoulders"], diff: "Intermediate" },
  { name: "HIIT Cardio: Box Jumps", displayName: "Box Jumps", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Plyo Box"], primary: "Cardio", secondary: ["Legs"], diff: "Intermediate" },
  { name: "HIIT Cardio: Kettlebell Swings", displayName: "Kettlebell Swings", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Kettlebell"], primary: "Cardio", secondary: ["Hamstrings", "Core"], diff: "Intermediate" },

  // ================= CALISTHENICS WORKOUTS =================
  // BEGINNER CALISTHENICS
  { name: "Beginner Calisthenics: Push Ups", displayName: "Push Ups", category: "Calisthenics Workouts", sub: "Beginner Calisthenics", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Triceps"], diff: "Beginner" },
  { name: "Beginner Calisthenics: Bodyweight Squats", displayName: "Bodyweight Squats", category: "Calisthenics Workouts", sub: "Beginner Calisthenics", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes"], diff: "Beginner" },
  { name: "Beginner Calisthenics: Assisted Pull Ups", displayName: "Assisted Pull Ups", category: "Calisthenics Workouts", sub: "Beginner Calisthenics", equipment: ["Pullup Bar", "Resistance Band"], primary: "Back", secondary: ["Biceps"], diff: "Beginner" },
  { name: "Beginner Calisthenics: Dips", displayName: "Dips", category: "Calisthenics Workouts", sub: "Beginner Calisthenics", equipment: ["Dip Bar"], primary: "Triceps", secondary: ["Chest"], diff: "Beginner" },
  { name: "Beginner Calisthenics: Plank", displayName: "Plank", category: "Calisthenics Workouts", sub: "Beginner Calisthenics", equipment: ["Bodyweight"], primary: "Core", secondary: ["Shoulders"], diff: "Beginner" },
  { name: "Beginner Calisthenics: Lunges", displayName: "Lunges", category: "Calisthenics Workouts", sub: "Beginner Calisthenics", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes"], diff: "Beginner" },
  { name: "Beginner Calisthenics: Hollow Body Hold", displayName: "Hollow Body Hold", category: "Calisthenics Workouts", sub: "Beginner Calisthenics", equipment: ["Bodyweight"], primary: "Core", secondary: ["Abs"], diff: "Beginner" },
  { name: "Beginner Calisthenics: Jumping Jacks", displayName: "Jumping Jacks", category: "Calisthenics Workouts", sub: "Beginner Calisthenics", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Full Body"], diff: "Beginner" },

  // INTERMEDIATE CALISTHENICS
  { name: "Intermediate Calisthenics: Pull Ups", displayName: "Pull Ups", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Pullup Bar"], primary: "Back", secondary: ["Biceps"], diff: "Intermediate" },
  { name: "Intermediate Calisthenics: Muscle Ups", displayName: "Muscle Ups", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Pullup Bar"], primary: "Back", secondary: ["Arms", "Chest"], diff: "Advanced" },
  { name: "Intermediate Calisthenics: Handstand Hold", displayName: "Handstand Hold", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Bodyweight"], primary: "Shoulders", secondary: ["Core"], diff: "Intermediate" },
  { name: "Intermediate Calisthenics: Pistol Squats", displayName: "Pistol Squats", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Core"], diff: "Intermediate" },
  { name: "Intermediate Calisthenics: Archer Push Ups", displayName: "Archer Push Ups", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Triceps", "Shoulders"], diff: "Intermediate" },
  { name: "Intermediate Calisthenics: Diamond Push Ups", displayName: "Diamond Push Ups", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Bodyweight"], primary: "Triceps", secondary: ["Chest"], diff: "Intermediate" },
  { name: "Intermediate Calisthenics: L Sit", displayName: "L Sit", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Dip Bar"], primary: "Core", secondary: ["Abs", "Shoulders"], diff: "Intermediate" },
  { name: "Intermediate Calisthenics: Dips", displayName: "Dips", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Dip Bar"], primary: "Triceps", secondary: ["Chest"], diff: "Intermediate" },
  { name: "Intermediate Calisthenics: Dragon Flag", displayName: "Dragon Flag", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Bench"], primary: "Core", secondary: ["Lats"], diff: "Advanced" },
  { name: "Intermediate Calisthenics: Front Lever Progression", displayName: "Front Lever Progression", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Pullup Bar"], primary: "Back", secondary: ["Core"], diff: "Intermediate" },

  // ADVANCED CALISTHENICS
  { name: "Advanced Calisthenics: Handstand Push Ups", displayName: "Handstand Push Ups", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Bodyweight"], primary: "Shoulders", secondary: ["Triceps"], diff: "Advanced" },
  { name: "Advanced Calisthenics: Muscle Ups", displayName: "Muscle Ups", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Pullup Bar"], primary: "Back", secondary: ["Arms", "Chest"], diff: "Advanced" },
  { name: "Advanced Calisthenics: Front Lever", displayName: "Front Lever", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Pullup Bar"], primary: "Back", secondary: ["Core"], diff: "Advanced" },
  { name: "Advanced Calisthenics: Back Lever", displayName: "Back Lever", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Pullup Bar"], primary: "Shoulders", secondary: ["Back", "Biceps"], diff: "Advanced" },
  { name: "Advanced Calisthenics: Planche", displayName: "Planche", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Bodyweight"], primary: "Shoulders", secondary: ["Chest", "Core"], diff: "Advanced" },
  { name: "Advanced Calisthenics: One Arm Push Up", displayName: "One Arm Push Up", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Triceps", "Core"], diff: "Advanced" },
  { name: "Advanced Calisthenics: Human Flag", displayName: "Human Flag", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Stall Bars"], primary: "Shoulders", secondary: ["Obliques", "Core"], diff: "Advanced" },
  { name: "Advanced Calisthenics: Pistol Squat", displayName: "Pistol Squat", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Core"], diff: "Advanced" },
  { name: "Advanced Calisthenics: Handstand Walking", displayName: "Handstand Walking", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Bodyweight"], primary: "Shoulders", secondary: ["Core"], diff: "Advanced" },
  { name: "Advanced Calisthenics: Dragon Flag", displayName: "Dragon Flag", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Bench"], primary: "Core", secondary: ["Lats"], diff: "Advanced" },

  // ================= MILITARY STYLE FITNESS =================
  { name: "Military Style Fitness: Push Ups", displayName: "Push Ups", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Triceps"], diff: "Intermediate" },
  { name: "Military Style Fitness: Sit Ups", displayName: "Sit Ups", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Core", secondary: ["Abs"], diff: "Beginner" },
  { name: "Military Style Fitness: Pull Ups", displayName: "Pull Ups", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Pullup Bar"], primary: "Back", secondary: ["Biceps"], diff: "Intermediate" },
  { name: "Military Style Fitness: Burpees", displayName: "Burpees", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Full Body"], diff: "Intermediate" },
  { name: "Military Style Fitness: Running", displayName: "Running", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "Military Style Fitness: Sprinting", displayName: "Sprinting", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Intermediate" },
  { name: "Military Style Fitness: Bear Crawl", displayName: "Bear Crawl", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Full Body", secondary: ["Core"], diff: "Intermediate" },
  { name: "Military Style Fitness: Mountain Climbers", displayName: "Mountain Climbers", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Core", secondary: ["Cardio"], diff: "Beginner" },
  { name: "Military Style Fitness: Bodyweight Squats", displayName: "Bodyweight Squats", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes"], diff: "Beginner" },
  { name: "Military Style Fitness: Lunges", displayName: "Lunges", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes"], diff: "Beginner" },
  { name: "Military Style Fitness: Plank Holds", displayName: "Plank Holds", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Core", secondary: ["Shoulders"], diff: "Beginner" },
  { name: "Military Style Fitness: Jump Squats", displayName: "Jump Squats", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Cardio"], diff: "Intermediate" },

  // ================= LIFESTYLE FITNESS ACADEMY & CHALLENGES =================
  { name: "Primal Cat-Cow Spinal Waves", category: "Home Workouts", sub: "Core", equipment: ["Bodyweight"], primary: "Core", secondary: ["Lower Back", "Shoulders"], diff: "Beginner" },
  { name: "Seated Thoracic Extension & Twist", category: "Home Workouts", sub: "Shoulders", equipment: ["Bodyweight"], primary: "Shoulders", secondary: ["Chest", "Upper Back"], diff: "Beginner" },
  { name: "90/90 Active Hip Opener", category: "Home Workouts", sub: "Glutes", equipment: ["Bodyweight"], primary: "Glutes", secondary: ["Hamstrings", "Lower Back"], diff: "Beginner" },
  { name: "Ankle Dorsiflexion & Calcaneal Mobilization", category: "Home Workouts", sub: "Calves", equipment: ["Bodyweight"], primary: "Calves", secondary: ["Ankles"], diff: "Beginner" },
  { name: "Deep Diaphragmatic Box Breathing", category: "Home Workouts", sub: "Core", equipment: ["Bodyweight"], primary: "Core", secondary: ["Lungs"], diff: "Beginner" },
  { name: "Y-T-W Scapular Raises (Bodyweight)", category: "Home Workouts", sub: "Shoulders", equipment: ["Bodyweight"], primary: "Shoulders", secondary: ["Traps", "Upper Back"], diff: "Beginner" },
  { name: "Cable Lat Pulldowns (Slow Eccentric)", category: "Gym Workouts", sub: "Back", equipment: ["Cable Machine"], primary: "Back", secondary: ["Biceps", "Lats"], diff: "Intermediate" },
  { name: "Dumbbell Bent-Over Row with Chest Support", category: "Home Workouts", sub: "Back", equipment: ["Dumbbell"], primary: "Back", secondary: ["Biceps", "Rhomboids"], diff: "Intermediate" },
  { name: "Romanian Barbell Deadlifts", category: "Gym Workouts", sub: "Legs", equipment: ["Barbell"], primary: "Legs", secondary: ["Hamstrings", "Glutes", "Lower Back"], diff: "Intermediate" },
  { name: "Dumbbell Romanian Deadlifts", category: "Home Workouts", sub: "Legs", equipment: ["Dumbbell"], primary: "Legs", secondary: ["Hamstrings", "Glutes", "Lower Back"], diff: "Intermediate" },
  { name: "Standing Dumbbell Overhead Press", category: "Gym Workouts", sub: "Shoulders", equipment: ["Dumbbell"], primary: "Shoulders", secondary: ["Triceps"], diff: "Intermediate" },
  { name: "Resistance Band Shoulder Press", category: "Home Workouts", sub: "Shoulders", equipment: ["Resistance Band"], primary: "Shoulders", secondary: ["Triceps"], diff: "Beginner" },
  { name: "Plank with Shoulder Taps", category: "Home Workouts", sub: "Core", equipment: ["Bodyweight"], primary: "Core", secondary: ["Shoulders", "Abs"], diff: "Intermediate" },
  { name: "Leg Press (High & Wide Stance)", category: "Gym Workouts", sub: "Legs", equipment: ["Machine"], primary: "Legs", secondary: ["Quads", "Glutes"], diff: "Intermediate" },
  { name: "Dumbbell Goblet Squats", category: "Home Workouts", sub: "Legs", equipment: ["Dumbbell"], primary: "Legs", secondary: ["Quads", "Glutes"], diff: "Beginner" },
  { name: "Single-Leg Glute Bridges", category: "Home Workouts", sub: "Glutes", equipment: ["Bodyweight"], primary: "Glutes", secondary: ["Hamstrings"], diff: "Intermediate" },
  { name: "Child's Pose Spinal Reach", category: "Home Workouts", sub: "Back", equipment: ["Bodyweight"], primary: "Back", secondary: ["Shoulders"], diff: "Beginner" },
  { name: "Active Arm Circles & Core Bracing", category: "Home Workouts", sub: "Shoulders", equipment: ["Bodyweight"], primary: "Shoulders", secondary: ["Core"], diff: "Beginner" },
  { name: "Prone Cobra Chest Opener", category: "Home Workouts", sub: "Chest", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Shoulders", "Upper Back"], diff: "Beginner" },
  { name: "Bodyweight Air Squats & Glute Kickbacks", category: "Home Workouts", sub: "Legs", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes"], diff: "Beginner" },
  { name: "90/90 Hip Stretch", category: "Home Workouts", sub: "Glutes", equipment: ["Bodyweight"], primary: "Glutes", secondary: ["Lower Back"], diff: "Beginner" },

  // ================= 90 DAY CHALLENGE EXERCISES =================
  { name: "Dynamic Warm-up Jumps", category: "Cardio Workouts", sub: "Warm-up", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "Dynamic Rotational Swings", category: "Home Workouts", sub: "Warm-up", equipment: ["Bodyweight"], primary: "Core", secondary: ["Shoulders", "Back"], diff: "Beginner" },
  { name: "Active Stretch Squats", category: "Home Workouts", sub: "Warm-up", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes", "Hamstrings"], diff: "Beginner" },
  { name: "Systemic Decompression Breathing", category: "Home Workouts", sub: "Warm-up", equipment: ["Bodyweight"], primary: "Core", secondary: ["Lungs"], diff: "Beginner" },
  { name: "Full Posterior Muscle Release Stretch", category: "Home Workouts", sub: "Stretching", equipment: ["Bodyweight"], primary: "Back", secondary: ["Hamstrings"], diff: "Beginner" },

  // ================= 5-MONTH BELLY FAT SHRED CO-EXERCISES =================
  { name: "Squats", category: "Home Workouts", sub: "Legs", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes"], diff: "Beginner" },
  { name: "Dead Bug", category: "Home Workouts", sub: "Core", equipment: ["Bodyweight"], primary: "Core", secondary: ["Abs"], diff: "Beginner" },
  { name: "Reverse Crunch", category: "Home Workouts", sub: "Core", equipment: ["Bodyweight"], primary: "Core", secondary: ["Abs"], diff: "Beginner" },
  { name: "12-3-30 Treadmill Walk", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Treadmill"], primary: "Cardio", secondary: ["Legs"], diff: "Intermediate" },
  { name: "Side Plank", category: "Home Workouts", sub: "Core", equipment: ["Bodyweight"], primary: "Core", secondary: ["Obliques"], diff: "Beginner" },
  { name: "Push-ups", category: "Home Workouts", sub: "Chest", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Triceps"], diff: "Beginner" },
  { name: "Rope Jump", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Jump Rope"], primary: "Cardio", secondary: ["Calves"], diff: "Beginner" },

  // ================= AI COACH SPECIALIZED ROUTINES =================
  { name: "Hanging Knee-to-Chest / Leg Raises", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Pullup Bar"], primary: "Core", secondary: ["Abs"], diff: "Intermediate" },
  { name: "High-Intensity Dumbbell Thrusters", category: "Gym Workouts", sub: "Legs", equipment: ["Dumbbells"], primary: "Legs", secondary: ["Quads", "Shoulders"], diff: "Intermediate" },
  { name: "Dumbbell Renegade Rows with Push-Up", category: "Gym Workouts", sub: "Back", equipment: ["Dumbbells"], primary: "Back", secondary: ["Chest", "Core"], diff: "Intermediate" },
  { name: "Explosive Hip-Hinge Kettlebell Swings", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Kettlebell"], primary: "Cardio", secondary: ["Hamstrings", "Core"], diff: "Intermediate" },

  // ================= WOMEN CONFIDENCE PROGRAM EXERCISES =================
  { name: "Glute Bridge & Isometric Hold", displayName: "Glute Bridge & Isometric Hold", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Bodyweight", "Dumbbell"], primary: "Glutes", secondary: ["Hamstrings", "Core"], diff: "Beginner" },
  { name: "Tempo Goblet Squat", displayName: "Tempo Goblet Squat", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Dumbbell", "Kettlebell"], primary: "Quadriceps", secondary: ["Glutes", "Upper Back"], diff: "Beginner" },
  { name: "Dumbbell Romanian Deadlift (RDL)", displayName: "Dumbbell Romanian Deadlift (RDL)", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Dumbbells"], primary: "Hamstrings", secondary: ["Glutes", "Lower Back"], diff: "Intermediate" },
  { name: "Bulgarian Split Squat", displayName: "Bulgarian Split Squat", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Dumbbells", "Bench"], primary: "Glutes", secondary: ["Quadriceps", "Hamstrings"], diff: "Intermediate" },
  { name: "Lateral Mini-Band Glute Walk", displayName: "Lateral Mini-Band Glute Walk", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Resistance Band"], primary: "Glutes", secondary: ["Hip Abductors"], diff: "Beginner" },
  { name: "Single-Arm Supported Row", displayName: "Single-Arm Supported Row", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Dumbbell", "Bench"], primary: "Back", secondary: ["Biceps", "Rhomboids"], diff: "Beginner" },
  { name: "Standing Dumbbell Overhead Shoulder Press", displayName: "Standing Dumbbell Overhead Shoulder Press", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Dumbbells"], primary: "Shoulders", secondary: ["Triceps", "Core"], diff: "Beginner" },
  { name: "Contralateral Dead Bug", displayName: "Contralateral Dead Bug", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Bodyweight"], primary: "Core", secondary: ["Transverse Abdominis", "Hip Flexors"], diff: "Beginner" },
  { name: "Side Plank with Glute Abduction", displayName: "Side Plank with Glute Abduction", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Bodyweight"], primary: "Obliques", secondary: ["Glutes", "Core"], diff: "Intermediate" },
  { name: "Resistance Band Pull-Aparts & Posture Opener", displayName: "Resistance Band Pull-Aparts & Posture Opener", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Resistance Band"], primary: "Shoulders", secondary: ["Rear Delts", "Upper Back"], diff: "Beginner" },
  { name: "Barbell Hip Thrust", displayName: "Barbell Hip Thrust", category: "Gym Workouts", sub: "Women Confidence Program", equipment: ["Barbell", "Bench"], primary: "Glutes", secondary: ["Hamstrings"], diff: "Intermediate" },
  { name: "Cable Glute Kickbacks", displayName: "Cable Glute Kickbacks", category: "Gym Workouts", sub: "Women Confidence Program", equipment: ["Cable Machine"], primary: "Glutes", secondary: ["Hamstrings"], diff: "Beginner" },
  { name: "Sumo Squat with Pulse", displayName: "Sumo Squat with Pulse", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Dumbbell", "Bodyweight"], primary: "Quadriceps", secondary: ["Glutes", "Adductors"], diff: "Beginner" },
  { name: "Curtsy Lunges", displayName: "Curtsy Lunges", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Bodyweight", "Dumbbells"], primary: "Glutes", secondary: ["Quads", "Hamstrings"], diff: "Intermediate" },
  { name: "Step Ups with Knee Drive", displayName: "Step Ups with Knee Drive", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Bench", "Dumbbells"], primary: "Glutes", secondary: ["Quads", "Calves"], diff: "Beginner" },
  { name: "Incline Dumbbell Chest Press", displayName: "Incline Dumbbell Chest Press", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Dumbbells", "Bench"], primary: "Chest", secondary: ["Front Delts", "Triceps"], diff: "Intermediate" },
  { name: "Lat Pulldown to Sternum", displayName: "Lat Pulldown to Sternum", category: "Gym Workouts", sub: "Women Confidence Program", equipment: ["Cable Machine"], primary: "Back", secondary: ["Biceps", "Lats"], diff: "Beginner" },
  { name: "Dumbbell Lateral Raises", displayName: "Dumbbell Lateral Raises", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Dumbbells"], primary: "Shoulders", secondary: ["Traps"], diff: "Beginner" },
  { name: "Overhead Triceps Rope Extension", displayName: "Overhead Triceps Rope Extension", category: "Gym Workouts", sub: "Women Confidence Program", equipment: ["Cable Machine"], primary: "Triceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "Dumbbell Hammer Curls", displayName: "Dumbbell Hammer Curls", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Dumbbells"], primary: "Biceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "Bird Dog Stability Hold", displayName: "Bird Dog Stability Hold", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Bodyweight"], primary: "Core", secondary: ["Glutes", "Lower Back"], diff: "Beginner" },
  { name: "Plank Hip Dips", displayName: "Plank Hip Dips", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Bodyweight"], primary: "Obliques", secondary: ["Core"], diff: "Intermediate" },
  { name: "Bicycle Crunches", displayName: "Bicycle Crunches", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Bodyweight"], primary: "Core", secondary: ["Abs", "Obliques"], diff: "Beginner" },
  { name: "Stomach Vacuum & Core Bracing", displayName: "Stomach Vacuum & Core Bracing", category: "Home Workouts", sub: "Women Confidence Program", equipment: ["Bodyweight"], primary: "Core", secondary: ["Transverse Abdominis"], diff: "Beginner" },

  // ================= 60 NEW EXPANSION EXERCISES ACROSS ALL CATEGORIES =================
  // --- CHEST & UPPER BODY PRESSING ---
  { name: "Landmine Chest Press", displayName: "Landmine Chest Press", category: "Gym Workouts", sub: "Chest", equipment: ["Landmine", "Barbell"], primary: "Chest", secondary: ["Triceps", "Front Delts"], diff: "Intermediate" },
  { name: "Incline Cable Fly with Supination", displayName: "Incline Cable Fly with Supination", category: "Gym Workouts", sub: "Chest", equipment: ["Cable Machine", "Bench"], primary: "Chest", secondary: ["Front Delts", "Inner Chest"], diff: "Intermediate" },
  { name: "Dumbbell Guillotine Press", displayName: "Dumbbell Guillotine Press", category: "Gym Workouts", sub: "Chest", equipment: ["Dumbbells", "Bench"], primary: "Chest", secondary: ["Front Delts", "Triceps"], diff: "Advanced" },
  { name: "Deficit Push-Ups with Handles", displayName: "Deficit Push-Ups with Handles", category: "Calisthenics Workouts", sub: "Chest", equipment: ["Push Up Handles"], primary: "Chest", secondary: ["Triceps", "Core"], diff: "Intermediate" },
  { name: "Standing Cable Crossover (Low to High)", displayName: "Standing Cable Crossover (Low to High)", category: "Gym Workouts", sub: "Chest", equipment: ["Cable Machine"], primary: "Chest", secondary: ["Front Delts"], diff: "Beginner" },

  // --- SHOULDERS & SCAPULAR DYNAMICS ---
  { name: "Landmine Overhead Shoulder Press", displayName: "Landmine Overhead Shoulder Press", category: "Gym Workouts", sub: "Shoulders", equipment: ["Landmine", "Barbell"], primary: "Shoulders", secondary: ["Triceps", "Core"], diff: "Intermediate" },
  { name: "Cable Face Pull with External Rotation", displayName: "Cable Face Pull with External Rotation", category: "Gym Workouts", sub: "Shoulders", equipment: ["Cable Machine", "Rope"], primary: "Rear Delts", secondary: ["Rotator Cuff", "Rhomboids"], diff: "Beginner" },
  { name: "Plate Front Raise to Overhead Lockout", displayName: "Plate Front Raise to Overhead Lockout", category: "Gym Workouts", sub: "Shoulders", equipment: ["Weight Plate"], primary: "Shoulders", secondary: ["Trapezius", "Core"], diff: "Beginner" },
  { name: "Dumbbell Lu Raises", displayName: "Dumbbell Lu Raises", category: "Gym Workouts", sub: "Shoulders", equipment: ["Dumbbells"], primary: "Shoulders", secondary: ["Trapezius", "Upper Back"], diff: "Intermediate" },
  { name: "Seated Bradford Shoulder Press", displayName: "Seated Bradford Shoulder Press", category: "Gym Workouts", sub: "Shoulders", equipment: ["Barbell", "Bench"], primary: "Shoulders", secondary: ["Triceps", "Traps"], diff: "Advanced" },
  { name: "Incline Prone Rear Delt Dumbbell Fly", displayName: "Incline Prone Rear Delt Dumbbell Fly", category: "Gym Workouts", sub: "Shoulders", equipment: ["Dumbbells", "Bench"], primary: "Rear Delts", secondary: ["Rhomboids"], diff: "Beginner" },

  // --- BACK, LATS & POSTURE ---
  { name: "Meadows Row (Landmine Row)", displayName: "Meadows Row (Landmine Row)", category: "Gym Workouts", sub: "Back", equipment: ["Landmine", "Barbell"], primary: "Back", secondary: ["Biceps", "Lats"], diff: "Intermediate" },
  { name: "Helms Dumbbell Chest-Supported Row", displayName: "Helms Dumbbell Chest-Supported Row", category: "Gym Workouts", sub: "Back", equipment: ["Dumbbells", "Incline Bench"], primary: "Back", secondary: ["Rhomboids", "Biceps"], diff: "Beginner" },
  { name: "Neutral-Grip Lat Pulldown to Clavicle", displayName: "Neutral-Grip Lat Pulldown to Clavicle", category: "Gym Workouts", sub: "Back", equipment: ["Cable Machine", "V-Grip Bar"], primary: "Back", secondary: ["Biceps", "Lats"], diff: "Beginner" },
  { name: "Single-Arm Lat Prayer (Cable Pullover)", displayName: "Single-Arm Lat Prayer (Cable Pullover)", category: "Gym Workouts", sub: "Back", equipment: ["Cable Machine", "D-Handle"], primary: "Back", secondary: ["Lats", "Triceps"], diff: "Intermediate" },
  { name: "Pendlay Barbell Explosive Row", displayName: "Pendlay Barbell Explosive Row", category: "Gym Workouts", sub: "Back", equipment: ["Barbell"], primary: "Back", secondary: ["Lats", "Hamstrings", "Core"], diff: "Advanced" },
  { name: "Inverted Bodyweight Row on Smith Machine", displayName: "Inverted Bodyweight Row on Smith Machine", category: "Calisthenics Workouts", sub: "Back", equipment: ["Smith Machine"], primary: "Back", secondary: ["Biceps", "Core"], diff: "Beginner" },
  { name: "Dumbbell Seal Row on Flat Bench", displayName: "Dumbbell Seal Row on Flat Bench", category: "Gym Workouts", sub: "Back", equipment: ["Dumbbells", "Elevated Bench"], primary: "Back", secondary: ["Rhomboids", "Biceps"], diff: "Intermediate" },
  { name: "Prone Trap-3 Scapular Raise", displayName: "Prone Trap-3 Scapular Raise", category: "Home Workouts", sub: "Back", equipment: ["Dumbbells", "Incline Bench"], primary: "Back", secondary: ["Trapezius", "Rotator Cuff"], diff: "Beginner" },

  // --- ARMS (BICEPS, TRICEPS & FOREARMS) ---
  { name: "Incline Spider Dumbbell Curl", displayName: "Incline Spider Dumbbell Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["Dumbbells", "Incline Bench"], primary: "Biceps", secondary: ["Forearms"], diff: "Intermediate" },
  { name: "Bayesian Cable Bicep Curl", displayName: "Bayesian Cable Bicep Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["Cable Machine"], primary: "Biceps", secondary: ["Forearms"], diff: "Intermediate" },
  { name: "Zottman Dumbbell Reverse Curls", displayName: "Zottman Dumbbell Reverse Curls", category: "Gym Workouts", sub: "Biceps", equipment: ["Dumbbells"], primary: "Biceps", secondary: ["Forearms", "Brachioradialis"], diff: "Beginner" },
  { name: "Preacher Hammer Cable Curl", displayName: "Preacher Hammer Cable Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["Cable Machine", "Preacher Bench"], primary: "Biceps", secondary: ["Forearms"], diff: "Intermediate" },
  { name: "JM Press (Triceps Mass Builder)", displayName: "JM Press (Triceps Mass Builder)", category: "Gym Workouts", sub: "Triceps", equipment: ["Barbell", "Bench"], primary: "Triceps", secondary: ["Chest", "Front Delts"], diff: "Advanced" },
  { name: "Overhead Cable Cross-Body Triceps Extension", displayName: "Overhead Cable Cross-Body Triceps Extension", category: "Gym Workouts", sub: "Triceps", equipment: ["Dual Cables"], primary: "Triceps", secondary: ["Shoulders"], diff: "Intermediate" },
  { name: "Tate Press (Dumbbell Triceps Flush)", displayName: "Tate Press (Dumbbell Triceps Flush)", category: "Gym Workouts", sub: "Triceps", equipment: ["Dumbbells", "Flat Bench"], primary: "Triceps", secondary: ["Chest"], diff: "Intermediate" },
  { name: "Single-Arm Cable Triceps Kickback", displayName: "Single-Arm Cable Triceps Kickback", category: "Gym Workouts", sub: "Triceps", equipment: ["Cable Machine"], primary: "Triceps", secondary: ["Rear Delts"], diff: "Beginner" },
  { name: "Behind-the-Back Barbell Wrist Curl", displayName: "Behind-the-Back Barbell Wrist Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["Barbell"], primary: "Forearms", secondary: ["Biceps", "Grip"], diff: "Beginner" },

  // --- GLUTES, LEGS & POSTERIOR CHAIN ---
  { name: "B-Stance Dumbbell Romanian Deadlift", displayName: "B-Stance Dumbbell Romanian Deadlift", category: "Home Workouts", sub: "Legs", equipment: ["Dumbbells"], primary: "Glutes", secondary: ["Hamstrings", "Core"], diff: "Intermediate" },
  { name: "Deficit Reverse Lunge on Platform", displayName: "Deficit Reverse Lunge on Platform", category: "Gym Workouts", sub: "Legs", equipment: ["Dumbbells", "Step Platform"], primary: "Glutes", secondary: ["Quadriceps", "Hamstrings"], diff: "Intermediate" },
  { name: "Kas Glute Bridge with Barbell", displayName: "Kas Glute Bridge with Barbell", category: "Gym Workouts", sub: "Legs", equipment: ["Barbell", "Bench"], primary: "Glutes", secondary: ["Hamstrings"], diff: "Intermediate" },
  { name: "Cable Pull-Through for Posterior Chain", displayName: "Cable Pull-Through for Posterior Chain", category: "Gym Workouts", sub: "Legs", equipment: ["Cable Machine", "Rope"], primary: "Glutes", secondary: ["Hamstrings", "Lower Back"], diff: "Beginner" },
  { name: "Frog Pump Glute Burner", displayName: "Frog Pump Glute Burner", category: "Home Workouts", sub: "Legs", equipment: ["Bodyweight", "Dumbbell"], primary: "Glutes", secondary: ["Core"], diff: "Beginner" },
  { name: "Heels-Elevated Goblet Cyclist Squat", displayName: "Heels-Elevated Goblet Cyclist Squat", category: "Home Workouts", sub: "Legs", equipment: ["Dumbbell", "Wedge"], primary: "Quadriceps", secondary: ["Glutes", "Core"], diff: "Intermediate" },
  { name: "Nordic Hamstring Curl", displayName: "Nordic Hamstring Curl", category: "Calisthenics Workouts", sub: "Legs", equipment: ["Bodyweight", "Ankle Anchor"], primary: "Hamstrings", secondary: ["Glutes", "Calves"], diff: "Advanced" },
  { name: "Sissy Squat with Support", displayName: "Sissy Squat with Support", category: "Calisthenics Workouts", sub: "Legs", equipment: ["Bodyweight", "Support Bar"], primary: "Quadriceps", secondary: ["Core", "Hip Flexors"], diff: "Advanced" },
  { name: "Copenhagen Adductor Side Plank", displayName: "Copenhagen Adductor Side Plank", category: "Home Workouts", sub: "Legs", equipment: ["Bench", "Mat"], primary: "Core", secondary: ["Obliques", "Glutes"], diff: "Intermediate" },
  { name: "Tibialis Anterior Wall Raise", displayName: "Tibialis Anterior Wall Raise", category: "Home Workouts", sub: "Legs", equipment: ["Bodyweight", "Wall"], primary: "Calves", secondary: ["Ankles"], diff: "Beginner" },
  { name: "Seated Soleus Calf Raise", displayName: "Seated Soleus Calf Raise", category: "Gym Workouts", sub: "Legs", equipment: ["Machine", "Dumbbells"], primary: "Calves", secondary: ["Ankles"], diff: "Beginner" },

  // --- CORE, OBLIQUES & TRANSVERSE ABDOMINIS ---
  { name: "Pallof Press with Isometric Hold", displayName: "Pallof Press with Isometric Hold", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Cable Machine", "Resistance Band"], primary: "Core", secondary: ["Obliques", "Abs"], diff: "Beginner" },
  { name: "Hanging Windshield Wipers", displayName: "Hanging Windshield Wipers", category: "Calisthenics Workouts", sub: "Abs and Core", equipment: ["Pullup Bar"], primary: "Core", secondary: ["Obliques", "Abs", "Lats"], diff: "Advanced" },
  { name: "Captain's Chair Knee-to-Elbow Twist", displayName: "Captain's Chair Knee-to-Elbow Twist", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Captain's Chair"], primary: "Core", secondary: ["Abs", "Obliques"], diff: "Intermediate" },
  { name: "Dumbbell Suitcase Carry", displayName: "Dumbbell Suitcase Carry", category: "Home Workouts", sub: "Abs and Core", equipment: ["Dumbbell"], primary: "Core", secondary: ["Obliques", "Forearms"], diff: "Beginner" },
  { name: "Dragon Flag Negative Lowering", displayName: "Dragon Flag Negative Lowering", category: "Calisthenics Workouts", sub: "Abs and Core", equipment: ["Bench"], primary: "Core", secondary: ["Abs", "Lats"], diff: "Advanced" },
  { name: "Swiss Ball Pike to Push-Up", displayName: "Swiss Ball Pike to Push-Up", category: "Home Workouts", sub: "Abs and Core", equipment: ["Stability Ball"], primary: "Core", secondary: ["Chest", "Shoulders"], diff: "Intermediate" },
  { name: "L-Sit Flutter Kicks on Parallettes", displayName: "L-Sit Flutter Kicks on Parallettes", category: "Calisthenics Workouts", sub: "Abs and Core", equipment: ["Parallettes"], primary: "Core", secondary: ["Abs", "Triceps"], diff: "Advanced" },
  { name: "Cable Woodchopper High-to-Low", displayName: "Cable Woodchopper High-to-Low", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Cable Machine"], primary: "Core", secondary: ["Obliques", "Shoulders"], diff: "Intermediate" },

  // --- ATHLETIC CONDITIONING & HYBRID FUNCTIONAL FITNESS ---
  { name: "Devil Press with Dual Dumbbells", displayName: "Devil Press with Dual Dumbbells", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Dumbbells"], primary: "Full Body", secondary: ["Chest", "Hamstrings", "Shoulders"], diff: "Advanced" },
  { name: "Sled / Prowler Push & Pull Sprint", displayName: "Sled / Prowler Push & Pull Sprint", category: "Gym Workouts", sub: "Military Fitness", equipment: ["Sled", "Weight Plates"], primary: "Full Body", secondary: ["Legs", "Calves", "Core"], diff: "Intermediate" },
  { name: "Wall Balls (Thruster into High Target)", displayName: "Wall Balls (Thruster into High Target)", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Medicine Ball", "Wall Target"], primary: "Full Body", secondary: ["Quadriceps", "Shoulders", "Cardio"], diff: "Intermediate" },
  { name: "Barbell Clean and Press", displayName: "Barbell Clean and Press", category: "Gym Workouts", sub: "Military Fitness", equipment: ["Barbell"], primary: "Full Body", secondary: ["Shoulders", "Hamstrings", "Back"], diff: "Advanced" },
  { name: "Dumbbell Snatch (Alternating Single-Arm)", displayName: "Dumbbell Snatch (Alternating Single-Arm)", category: "Gym Workouts", sub: "HIIT Cardio", equipment: ["Dumbbell"], primary: "Full Body", secondary: ["Glutes", "Shoulders"], diff: "Intermediate" },
  { name: "Turkish Get-Up with Kettlebell", displayName: "Turkish Get-Up with Kettlebell", category: "Gym Workouts", sub: "Military Fitness", equipment: ["Kettlebell"], primary: "Full Body", secondary: ["Shoulders", "Core", "Glutes"], diff: "Advanced" },
  { name: "Shadow Boxing with Light Dumbbells", displayName: "Shadow Boxing with Light Dumbbells", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Light Dumbbells"], primary: "Cardio", secondary: ["Shoulders", "Core"], diff: "Beginner" },
  { name: "Sandbag Ground-to-Shoulder Carry", displayName: "Sandbag Ground-to-Shoulder Carry", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Heavy Sandbag"], primary: "Full Body", secondary: ["Back", "Legs", "Core"], diff: "Advanced" },

  // --- MOBILITY, FLEXIBILITY & JOINT LONGEVITY ---
  { name: "World's Greatest Stretch Complex", displayName: "World's Greatest Stretch Complex", category: "Home Workouts", sub: "Warm-up", equipment: ["Bodyweight"], primary: "Mobility", secondary: ["Hamstrings", "Shoulders", "Glutes"], diff: "Beginner" },
  { name: "Scorpion Stretch for Spinal Rotation", displayName: "Scorpion Stretch for Spinal Rotation", category: "Home Workouts", sub: "Stretching", equipment: ["Bodyweight"], primary: "Mobility", secondary: ["Lower Back", "Chest"], diff: "Beginner" },
  { name: "Couch Stretch for Tight Hip Flexors", displayName: "Couch Stretch for Tight Hip Flexors", category: "Home Workouts", sub: "Stretching", equipment: ["Wall / Couch", "Mat"], primary: "Mobility", secondary: ["Quadriceps", "Glutes"], diff: "Beginner" },
  { name: "Pigeon Pose with Active Thoracic Reach", displayName: "Pigeon Pose with Active Thoracic Reach", category: "Home Workouts", sub: "Stretching", equipment: ["Mat"], primary: "Mobility", secondary: ["Glutes", "Lower Back"], diff: "Beginner" },
  { name: "Shin Box Hip Internal-External Rotations", displayName: "Shin Box Hip Internal-External Rotations", category: "Home Workouts", sub: "Warm-up", equipment: ["Mat"], primary: "Mobility", secondary: ["Glutes", "Lower Back"], diff: "Beginner" }
];

export function determineCategories(
  name: string,
  primary: string,
  secondary: string[],
  equipment: string[],
  difficulty: string,
  originalCategories: string[]
): string[] {
  const cats: string[] = [];
  const nameL = name.toLowerCase();
  const primaryL = primary.toLowerCase();
  const secondaryL = secondary.map(s => s.toLowerCase());
  const equipL = equipment.map(e => e.toLowerCase());
  const allMuscles = [primaryL, ...secondaryL];

  // 1. Chest
  const isChest =
    allMuscles.some(m => m.includes("chest") || m.includes("pectoral")) ||
    nameL.includes("bench press") ||
    nameL.includes("chest press") ||
    nameL.includes("pushup") ||
    nameL.includes("push up") ||
    nameL.includes("pec deck") ||
    nameL.includes("crossover") ||
    (nameL.includes("fly") && !nameL.includes("rear delt")) ||
    (nameL.includes("dips") && nameL.includes("chest"));
  if (isChest) {
    cats.push("Chest");
  }

  // 2. Back & Lats
  const isBack =
    allMuscles.some(m => m.includes("back") || m.includes("lat") || m.includes("traps") || m.includes("rhomboid") || m.includes("erector")) ||
    (nameL.includes("row") && !nameL.includes("upright row") && !nameL.includes("rowing machine")) ||
    nameL.includes("pullup") ||
    nameL.includes("pull-up") ||
    nameL.includes("chin-up") ||
    nameL.includes("chinup") ||
    nameL.includes("pulldown") ||
    nameL.includes("deadlift") ||
    nameL.includes("latissimus") ||
    nameL.includes("pullover") ||
    nameL.includes("hyperextension");
  if (isBack) {
    cats.push("Back");
  }

  // 3. Shoulders / Deltoids
  const isShoulder =
    allMuscles.some(m => m.includes("shoulder") || m.includes("delt") || m.includes("trapezius")) ||
    nameL.includes("overhead press") ||
    nameL.includes("shoulder press") ||
    nameL.includes("military press") ||
    nameL.includes("arnold press") ||
    nameL.includes("lateral raise") ||
    nameL.includes("front raise") ||
    nameL.includes("rear delt") ||
    nameL.includes("face pull") ||
    nameL.includes("lu raise") ||
    nameL.includes("bradford") ||
    nameL.includes("upright row") ||
    nameL.includes("shrug") ||
    nameL.includes("lateral cap");
  if (isShoulder) {
    cats.push("Shoulders");
  }

  // 4. Biceps
  const isBicep =
    allMuscles.some(m => m.includes("bicep")) ||
    (nameL.includes("curl") && !nameL.includes("leg curl") && !nameL.includes("hamstring") && !nameL.includes("wrist")) ||
    nameL.includes("preacher") ||
    nameL.includes("zottman") ||
    nameL.includes("spider curl");
  if (isBicep) {
    cats.push("Biceps");
  }

  // 5. Triceps
  const isTricep =
    allMuscles.some(m => m.includes("tricep")) ||
    nameL.includes("tricep") ||
    nameL.includes("pushdown") ||
    nameL.includes("skull crusher") ||
    (nameL.includes("kickback") && !nameL.includes("glute")) ||
    (nameL.includes("dips") && !nameL.includes("hip dip") && !nameL.includes("plank")) ||
    (nameL.includes("dip") && !nameL.includes("hip dip") && !nameL.includes("plank")) ||
    nameL.includes("close grip bench") ||
    nameL.includes("jm press") ||
    nameL.includes("tate press") ||
    (nameL.includes("overhead") && nameL.includes("extension"));
  if (isTricep) {
    cats.push("Triceps");
  }

  // 6. Forearms & Grip
  const isForearm =
    allMuscles.some(m => m.includes("forearm") || m.includes("wrist") || m.includes("grip")) ||
    nameL.includes("wrist curl") ||
    nameL.includes("grip") ||
    nameL.includes("farmer") ||
    nameL.includes("suitcase carry");
  if (isForearm) {
    cats.push("Forearms");
  }

  // 7. Abs & Core
  const isAbs =
    allMuscles.some(m => m.includes("abs") || m.includes("abdominal")) ||
    nameL.includes("crunch") ||
    nameL.includes("sit up") ||
    nameL.includes("situp") ||
    nameL.includes("leg raise") ||
    nameL.includes("flutter kick") ||
    nameL.includes("hollow body") ||
    nameL.includes("dragon flag") ||
    nameL.includes("dead bug") ||
    nameL.includes("stomach vacuum");
  if (isAbs) {
    cats.push("Abs");
    cats.push("Core");
  }

  // 8. Obliques
  const isOblique =
    allMuscles.some(m => m.includes("oblique")) ||
    nameL.includes("twist") ||
    nameL.includes("side plank") ||
    nameL.includes("woodchopper") ||
    nameL.includes("windshield wiper") ||
    nameL.includes("hip dips");
  if (isOblique) {
    cats.push("Obliques");
    cats.push("Core");
  }

  // 9. Lower Back
  if (
    allMuscles.some(m => m.includes("lower back") || m.includes("erector")) ||
    nameL.includes("good morning") ||
    nameL.includes("back extension") ||
    nameL.includes("bird dog") ||
    nameL.includes("hyperextension")
  ) {
    cats.push("Lower Back");
  }

  // 10. Glutes
  const isGlute =
    allMuscles.some(m => m.includes("glute")) ||
    nameL.includes("glute") ||
    nameL.includes("hip thrust") ||
    nameL.includes("bridge") ||
    (nameL.includes("kickback") && nameL.includes("glute")) ||
    nameL.includes("frog pump") ||
    nameL.includes("pull-through") ||
    nameL.includes("kas");
  if (isGlute) {
    cats.push("Glutes");
  }

  // 11. Quadriceps
  const isQuad =
    allMuscles.some(m => m.includes("quad")) ||
    nameL.includes("squat") ||
    nameL.includes("leg press") ||
    nameL.includes("lunge") ||
    nameL.includes("split squat") ||
    nameL.includes("leg extension") ||
    nameL.includes("sissy") ||
    nameL.includes("cyclist") ||
    nameL.includes("step up") ||
    nameL.includes("wall sit");
  if (isQuad) {
    cats.push("Quadriceps");
    cats.push("Legs");
  }

  // 12. Hamstrings
  const isHamstring =
    allMuscles.some(m => m.includes("hamstring")) ||
    nameL.includes("romanian deadlift") ||
    nameL.includes("rdl") ||
    nameL.includes("leg curl") ||
    nameL.includes("nordic");
  if (isHamstring) {
    cats.push("Hamstrings");
    cats.push("Legs");
  }

  // 13. Calves
  const isCalf =
    allMuscles.some(m => m.includes("calf") || m.includes("calves") || m.includes("soleus") || m.includes("gastrocnemius")) ||
    nameL.includes("calf");
  if (isCalf) {
    cats.push("Calves");
    cats.push("Legs");
  }

  // 14. Hip Flexors
  if (allMuscles.some(m => m.includes("hip flexor") || m.includes("psoas")) || nameL.includes("couch stretch") || nameL.includes("knee-to-chest")) {
    cats.push("Hip Flexors");
  }

  // 15. Neck
  if (allMuscles.some(m => m.includes("neck")) || nameL.includes("neck")) {
    cats.push("Neck");
  }

  // 16. Full Body
  if (nameL.includes("full body") || nameL.includes("fullbody") || nameL.includes("compound") || nameL.includes("complex") || nameL.includes("thruster") || nameL.includes("burpee") || nameL.includes("renegade") || nameL.includes("clean and press") || nameL.includes("snatch") || nameL.includes("get-up")) {
    cats.push("Full Body");
  }

  // Cardio
  if (nameL.includes("run") || nameL.includes("sprint")) cats.push("Running");
  if (nameL.includes("walk") || nameL.includes("treadmill")) cats.push("Walking");
  if (nameL.includes("rope") || nameL.includes("jump rope") || nameL.includes("rope jump")) cats.push("Jump Rope");
  if (nameL.includes("hiit") || nameL.includes("interval") || nameL.includes("circuit") || nameL.includes("tabata")) cats.push("HIIT");
  if (nameL.includes("bike") || nameL.includes("cycle") || nameL.includes("cycling")) cats.push("Cycling");
  if (nameL.includes("swim") || nameL.includes("swimming")) cats.push("Swimming");
  if (nameL.includes("rowing") || nameL.includes("rower") || nameL.includes("rowing machine")) cats.push("Rowing");
  if (nameL.includes("burpee") || nameL.includes("burpees")) cats.push("Burpees");
  if (nameL.includes("stair") || nameL.includes("stairmaster") || nameL.includes("stair climber")) cats.push("Stair Climber");

  if (allMuscles.includes("cardio") || nameL.includes("cardio")) {
    cats.push("Cardio");
  }

  // Mobility & Recovery
  if (nameL.includes("stretch") || nameL.includes("stretching") || nameL.includes("reach") || nameL.includes("opener")) cats.push("Stretching");
  if (nameL.includes("warm up") || nameL.includes("warm-up")) cats.push("Warm Up");
  if (nameL.includes("cool down") || nameL.includes("cooldown") || nameL.includes("decompression")) cats.push("Cool Down");
  if (nameL.includes("yoga") || nameL.includes("pose")) cats.push("Yoga");
  if (nameL.includes("pilates") || nameL.includes("teaser")) cats.push("Pilates");
  if (nameL.includes("recovery") || nameL.includes("mobility") || nameL.includes("cat-cow") || nameL.includes("breathing")) {
    cats.push("Recovery");
    cats.push("Mobility");
  }

  // Add difficulty
  cats.push(difficulty);

  // Women Confidence Program classification
  if (
    originalCategories.some(c => c.toLowerCase().includes("women")) ||
    nameL.includes("glute bridge") ||
    nameL.includes("goblet squat") ||
    nameL.includes("romanian deadlift") ||
    nameL.includes("bulgarian split squat") ||
    nameL.includes("mini-band") ||
    nameL.includes("supported row") ||
    nameL.includes("overhead shoulder press") ||
    nameL.includes("dead bug") ||
    nameL.includes("glute abduction") ||
    nameL.includes("pull-aparts") ||
    nameL.includes("glute kickback") ||
    nameL.includes("sumo squat") ||
    nameL.includes("curtsy lunge") ||
    nameL.includes("step ups with knee drive") ||
    nameL.includes("incline dumbbell chest press") ||
    nameL.includes("lat pulldown to sternum") ||
    nameL.includes("lateral raises") ||
    nameL.includes("triceps rope extension") ||
    nameL.includes("bird dog") ||
    nameL.includes("plank hip dips") ||
    nameL.includes("bicycle crunches") ||
    nameL.includes("stomach vacuum")
  ) {
    cats.push("Women Confidence Program");
    cats.push("Women's Programs");
  }

  // Maintain compatibility with original category names
  originalCategories.forEach(c => {
    if (c === "Gym Workouts" && !cats.includes("Gym Workouts")) cats.push("Gym Workouts");
    if (c === "Home Workouts" && !cats.includes("Home Workouts")) cats.push("Home Workouts");
    if (c === "Cardio Workouts" && !cats.includes("Cardio Workouts")) cats.push("Cardio Workouts");
    if (c === "Calisthenics Workouts" && !cats.includes("Calisthenics Workouts")) cats.push("Calisthenics Workouts");
    if (c === "Military Style Fitness" && !cats.includes("Military Style Fitness")) cats.push("Military Style Fitness");
    if (c.includes("Women") && !cats.includes("Women Confidence Program")) {
      cats.push("Women Confidence Program");
      cats.push("Women's Programs");
    }
  });

  return Array.from(new Set(cats));
}

function getExerciseYouTubeVideoId(name: string, primary: string): string {
  const nameL = name.toLowerCase();
  const primL = primary.toLowerCase();
  
  if (
    primL.includes("chest") ||
    nameL.includes("bench press") ||
    nameL.includes("chest press") ||
    nameL.includes("push up") ||
    nameL.includes("pushup") ||
    (nameL.includes("fly") && !nameL.includes("rear delt"))
  ) {
    if (nameL.includes("incline") || nameL.includes("fly")) {
      return "XvGlaH80m_o"; // Incline dumbbell press & chest fly video
    }
    return "myfEsD8S9M4"; // Bench press main chest video
  }

  if (
    primL.includes("back") ||
    (nameL.includes("row") && !nameL.includes("upright row") && !nameL.includes("rowing machine")) ||
    nameL.includes("pullup") ||
    nameL.includes("pull-up") ||
    nameL.includes("pulldown") ||
    (nameL.includes("deadlift") && !nameL.includes("romanian"))
  ) {
    if (nameL.includes("row") || nameL.includes("deadlift")) {
      return "wYREQvVeeIs"; // Back row / deadlift strength video
    }
    return "870yZl_yReQ"; // Pullup / lat pulldown back video
  }

  if (
    primL.includes("shoulder") ||
    primL.includes("deltoid") ||
    nameL.includes("overhead press") ||
    nameL.includes("shoulder press") ||
    nameL.includes("military press") ||
    nameL.includes("lateral raise") ||
    nameL.includes("rear delt") ||
    nameL.includes("upright row") ||
    nameL.includes("arnold press")
  ) {
    if (nameL.includes("raise") || nameL.includes("rear delt")) {
      return "08tO8mE6mrc"; // Shoulder lateral raises
    }
    return "7t8bSjF06D4"; // Overhead shoulder press
  }

  if (
    primL.includes("biceps") ||
    primL.includes("bicep") ||
    (nameL.includes("curl") && !nameL.includes("leg curl") && !nameL.includes("hamstring"))
  ) {
    return "H6M_eXUelO8"; // Bicep curl gym video
  }

  if (
    primL.includes("triceps") ||
    primL.includes("tricep") ||
    nameL.includes("pushdown") ||
    (nameL.includes("kickback") && !nameL.includes("glute")) ||
    (nameL.includes("dip") && !nameL.includes("hip dip") && !nameL.includes("plank")) ||
    (nameL.includes("extension") && !nameL.includes("leg") && !nameL.includes("back"))
  ) {
    return "f6300x57U4o"; // Tricep pushdowns / extension video
  }

  if (
    primL.includes("legs") ||
    primL.includes("quad") ||
    primL.includes("hamstring") ||
    primL.includes("calves") ||
    nameL.includes("squat") ||
    nameL.includes("lunge") ||
    nameL.includes("leg press") ||
    nameL.includes("leg curl") ||
    nameL.includes("leg extension")
  ) {
    if (nameL.includes("squat")) {
      return "3_p8pEqZ5L8"; // Heavy squats leg video
    }
    return "N_2gN4xP_hE"; // Leg extensions / lunges video
  }

  if (
    primL.includes("core") ||
    primL.includes("abs") ||
    nameL.includes("plank") ||
    nameL.includes("crunch") ||
    nameL.includes("sit up") ||
    nameL.includes("situp") ||
    nameL.includes("dead bug")
  ) {
    if (nameL.includes("plank") || nameL.includes("sit up") || nameL.includes("situp")) {
      return "2MoGxae-zyo"; // Flat abs home core routine
    }
    return "X_9VoUeG8-0"; // Intense core sixpack workouts
  }

  if (
    primL.includes("cardio") ||
    nameL.includes("burpee") ||
    nameL.includes("jacks") ||
    nameL.includes("climber") ||
    nameL.includes("run") ||
    nameL.includes("sprint") ||
    nameL.includes("hiit") ||
    nameL.includes("jump rope")
  ) {
    return "2pLt0T_bAkw"; // Intense cardio / fat burn video
  }

  // Fallbacks
  return "jTID7S8PsnM"; // Default Premium full body conditioning
}

const generateExercises = (): Exercise[] => {
  // Deduplicate RAW_EXERCISES_DATA by displayName || name
  const uniqueRawMap = new Map<string, typeof RAW_EXERCISES_DATA[number] & { originalCategories: string[]; originalSubs: string[] }>();

  RAW_EXERCISES_DATA.forEach(raw => {
    const displayName = raw.displayName || raw.name;
    const key = displayName.toLowerCase().trim();

    if (uniqueRawMap.has(key)) {
      const existing = uniqueRawMap.get(key)!;
      existing.equipment = Array.from(new Set([...existing.equipment, ...raw.equipment]));
      existing.secondary = Array.from(new Set([...existing.secondary, ...raw.secondary]));
      if (!existing.originalCategories.includes(raw.category)) {
        existing.originalCategories.push(raw.category);
      }
      if (!existing.originalSubs.includes(raw.sub)) {
        existing.originalSubs.push(raw.sub);
      }
    } else {
      uniqueRawMap.set(key, {
        ...raw,
        originalCategories: [raw.category],
        originalSubs: [raw.sub]
      });
    }
  });

  const deduplicatedRawList = Array.from(uniqueRawMap.values());
  const seenIds = new Set<string>();

  return deduplicatedRawList.map((raw, idx) => {
    const displayName = raw.displayName || raw.name;
    const baseId = `exercise-${displayName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    let id = baseId;
    let counter = 2;
    while (seenIds.has(id)) {
      id = `${baseId}-${counter}`;
      counter++;
    }
    seenIds.add(id);
    
    const instructions = [
      `Set up your starting alignment and stabilize your shoulders, lower back, and feet securely.`,
      `Begin executing ${displayName} focusing heavy attention on keeping tension strictly on your primary ${raw.primary}.`,
      `Hold the peak squeeze contraction at the top for 1 full second before moving to eccentric recovery.`,
      `Slowly lower the resistance under complete muscle control back to your baseline starting posture.`
    ];

    const commonMistakes = [
      `Allowing other neighboring joints to hyperextend or absorb joint load.`,
      `Using structural momentum or rushing through the lower eccentric segment.`
    ];

    const safetyTips = [
      `Always keep your spine completely neutral and avoid hyperextending joints.`,
      `Lower the resistance or weight immediately if pain or pinching is felt.`
    ];

    const benefits = [
      `Triggers powerful muscular hypertrophy inside active ${raw.primary} fiber bundles.`,
      `Reinforces compound mechanical stability across your target skeletal structure.`
    ];

    const isPremium = raw.diff === "Advanced" || idx % 4 === 0;

    const computedCats = determineCategories(
      displayName,
      raw.primary,
      raw.secondary,
      raw.equipment,
      raw.diff,
      raw.originalCategories
    );

    const ytVideoId = getExerciseYouTubeVideoId(displayName, raw.primary);

    return {
      id,
      name: displayName,
      muscleGroups: [raw.primary, ...raw.secondary],
      difficulty: raw.diff,
      instructions,
      equipment: raw.equipment,
      category: raw.originalCategories[0] || raw.category,
      categories: computedCats,
      commonMistakes,
      safetyTips,
      alternativeExercises: [raw.name.includes("Press") ? "Push Ups" : "Plank"],
      progressionVariations: ["Increase duration or increase weight load slightly", "Perform with longer eccentric counts"],
      isPremium,
      youtubeVideoId: ytVideoId,
      startingPosition: `Align with the ${raw.equipment.join(" and ")}, engage your abdominal core, and set your joints safely.`,
      movementExecution: `Drive the concentric phase forcefully through your ${raw.primary} muscles with strict biomechanical tension.`,
      finishingPosition: `Squeeze the active target area tightly at lock-out before releasing under total control.`,
      regressionVariations: ["Reduce sets or perform with partial range of motion initially"],
      musclesWorked: [raw.primary],
      gifUrl: getExerciseGifUrl(displayName, raw.category),
      imageUrl: getExerciseGifUrl(displayName, raw.category),
      description: `${displayName} targets the ${raw.primary} group to maximize hypertrophy and mechanical tension.`,
      duration: "45s",
      tags: [raw.primary, ...raw.secondary, raw.diff, raw.category],
      breathingInstructions: "Inhale on the negative eccentric phase. Exhale forcefully on the active concentric execution.",
      recommendedSetsReps: "3 Sets x 10-12 Reps",
      recommendedSets: "3",
      recommendedReps: "10-12",
      restTime: "60s",
      caloriesBurned: raw.diff === "Beginner" ? 85 : raw.diff === "Intermediate" ? 115 : 145,
      benefits,
      trainerTips: `Focus closely on active mind-muscle connection. Keep tension on the ${raw.primary} rather than neighboring joints.`,
      safetyNotes: "Always warm up with light sets before attempting heavier work. Secure weights safely.",
      bodyPart: raw.originalSubs[0] || raw.sub
    };
  });
};

export const EXERCISES: Exercise[] = generateExercises();

export const PROGRAMS: Program[] = [
  {
    id: "beginner-muscle-building",
    name: "Beginner Muscle Building",
    category: "Men's Programs",
    description: "Construct a rock-solid foundation of muscular hypertrophy with controlled machine and dumbbell lifts. Perfect starting point for raw physical adaptation.",
    duration: "8 Weeks",
    difficulty: "Beginner",
    searchTags: ["beginner", "hypertrophy", "muscle building"],
    imageUrl: REAL_EXERCISE_MEDIA.arms,
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Horizontal Upper Push & Pull", exercises: ["Push-ups", "Dumbbell Bent-Over Row with Chest Support", "Standing Dumbbell Overhead Press"] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Zone 2 Kinetic Walking & Aerobic Flush", exercises: ["12-3-30 Treadmill Walk", "Bodyweight Squats", "Deep Diaphragmatic Box Breathing"] },
      { day: "Day 3", focus: "Glute & Lower Quad Stability", exercises: ["Dumbbell Goblet Squats", "Single-Leg Glute Bridges", "Dead Bug"] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Low-Impact Cardio Conditioning", exercises: ["Rope Jump", "Mountain Climbers", "Child's Pose Spinal Reach"] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Outdoor Walking & Spinal Waves", exercises: ["Primal Cat-Cow Spinal Waves", "Plank Holds", "90/90 Hip Stretch"] }
    ]
  },
  {
    id: "advanced-hypertrophy",
    name: "Advanced Hypertrophy Mastery",
    category: "Training Styles",
    description: "Target peak muscular fiber failure through slow negatives, dropsets, and premium kinesiology-calibrated loads to maximize sarcoplasmic hypertrophy.",
    duration: "12 Weeks",
    difficulty: "Advanced",
    searchTags: ["advanced", "hypertrophy", "bodybuilding"],
    imageUrl: REAL_EXERCISE_MEDIA.chest,
    isPremium: true,
    schedule: [
      { day: "Day 1", focus: "Chest & Triceps Overload", exercises: ["Barbell Bench Press", "Dumbbell Chest Press", "Chest Dips", "Triceps Pushdowns"] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Low-Impact Cardio & Incline Walk", exercises: ["12-3-30 Treadmill Walk", "Jump Squats", "Child's Pose Spinal Reach"] },
      { day: "Day 3", focus: "Back & Biceps Thickness", exercises: ["Pull Ups", "Barbell Row", "Cable Lat Pulldowns (Slow Eccentric)", "Seated Dumbbell Bicep Peaks Curl"] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Zone 2 Kinetic Walking & Mobility Flush", exercises: ["Primal Cat-Cow Spinal Waves", "Dynamic Warm-up Jumps", "Dead Bug"] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Walking & Metabolic Recovery", exercises: ["Plank with Shoulder Taps", "Bodyweight Squats", "90/90 Hip Stretch"] }
    ]
  },
  {
    id: "fat-loss",
    name: "Fat Loss Accelerator",
    category: "Home Workout Programs",
    description: "Melt fat fast using calorie-blasting compound bodyweight movements, metabolic intervals, and conditioning tracks.",
    duration: "6 Weeks",
    difficulty: "Beginner",
    searchTags: ["fat loss", "cardio", "shred"],
    imageUrl: REAL_EXERCISE_MEDIA.mobility,
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Metabolic HIIT Blast", exercises: ["Burpees", "Mountain Climbers", "Jump Squats"] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Incline Walking & Aerobic Base", exercises: ["12-3-30 Treadmill Walk", "Primal Cat-Cow Spinal Waves", "Deep Diaphragmatic Box Breathing"] },
      { day: "Day 3", focus: "Low-Intensity Fat Burn", exercises: ["12-3-30 Treadmill Walk", "Bodyweight Squats", "Plank Holds"] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Low-Impact Steady Cardio & Steps", exercises: ["Rope Jump", "Side Plank", "Child's Pose Spinal Reach"] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Outdoor Walking & Hip Decompression", exercises: ["90/90 Hip Stretch", "Single-Leg Glute Bridges", "Dead Bug"] }
    ]
  },
  {
    id: "strength",
    name: "Max Power Strength",
    category: "Training Styles",
    description: "Build raw neural strength on the barbell deadlift, back squat, and flat bench press using systematic powerlifting principles.",
    duration: "10 Weeks",
    difficulty: "Advanced",
    searchTags: ["strength", "power", "heavy"],
    imageUrl: REAL_EXERCISE_MEDIA.back,
    isPremium: true,
    schedule: [
      { day: "Day 1", focus: "Posterior Chain Power", exercises: ["Romanian Barbell Deadlifts", "Dumbbell Romanian Deadlifts", "Pull Ups"] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Incline Walk & Parasympathetic Reset", exercises: ["12-3-30 Treadmill Walk", "Primal Cat-Cow Spinal Waves", "Deep Diaphragmatic Box Breathing"] },
      { day: "Day 3", focus: "Anterior Squat Drive", exercises: ["High-Tension Barbell Back Squats", "Dumbbell Goblet Squats", "Plank Holds"] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Zone 2 Walking & Joint Flushing", exercises: ["Dead Bug", "Single-Leg Glute Bridges", "Child's Pose Spinal Reach"] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Walking & Hip Mobility", exercises: ["90/90 Hip Stretch", "Bodyweight Squats", "Plank Holds"] }
    ]
  },
  {
    id: "womens-fitness",
    name: "Women's Toning & Glute Lift",
    category: "Women's Programs",
    description: "Sculpt, tone, and build athletic leg curves with glute bridges, squats, lunges, and active core stabilization.",
    duration: "6 Weeks",
    difficulty: "Beginner",
    searchTags: ["women", "toning", "glute lift"],
    imageUrl: REAL_EXERCISE_MEDIA.legs,
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Glute & Hamstring Lift", exercises: ["Single-Leg Glute Bridges", "Dumbbell Romanian Deadlifts", "90/90 Hip Stretch"] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Incline Treadmill Walk & Glute Flow", exercises: ["12-3-30 Treadmill Walk", "Primal Cat-Cow Spinal Waves", "Deep Diaphragmatic Box Breathing"] },
      { day: "Day 3", focus: "Core & Leg Definition", exercises: ["Dumbbell Goblet Squats", "Lunges", "Dead Bug"] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Low-Impact Cardio & Core Reset", exercises: ["Rope Jump", "Mountain Climbers", "Child's Pose Spinal Reach"] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Outdoor Walk & Hip Mobility", exercises: ["90/90 Hip Stretch", "Plank Holds", "Single-Leg Glute Bridges"] }
    ]
  },
  {
    id: "home-workouts",
    name: "Total Home Workouts",
    category: "Home Workout Programs",
    description: "Perfect workouts with zero gear needed. Build muscle, lose fat, and stay active directly from your living room.",
    duration: "4 Weeks",
    difficulty: "Beginner",
    searchTags: ["home", "no equipment", "dumbbells"],
    imageUrl: REAL_EXERCISE_MEDIA.mobility,
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Full Body Fat Burn", exercises: ["Push-ups", "Bodyweight Squats", "Plank with Shoulder Taps"] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Living Room Kinetic Walking & Mobility", exercises: ["12-3-30 Treadmill Walk", "Primal Cat-Cow Spinal Waves", "Deep Diaphragmatic Box Breathing"] },
      { day: "Day 3", focus: "Living Room Cardio", exercises: ["Rope Jump", "Mountain Climbers", "Side Plank"] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Zone 2 Step Walking & Low-Impact Flow", exercises: ["Dead Bug", "Bodyweight Squats", "Child's Pose Spinal Reach"] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Walking & Full Body Flush", exercises: ["90/90 Hip Stretch", "Plank Holds", "Single-Leg Glute Bridges"] }
    ]
  },
  {
    id: "gym-workouts",
    name: "Premium Gym Workouts",
    category: "Training Styles",
    description: "Master the gym floor. Get optimal joint setups on cable columns, barbell racks, and high-tech machines.",
    duration: "8 Weeks",
    difficulty: "Intermediate",
    searchTags: ["gym", "barbell", "cable"],
    imageUrl: REAL_EXERCISE_MEDIA.shoulders,
    isPremium: true,
    schedule: [
      { day: "Day 1", focus: "Latissimus & Chest Power", exercises: ["Cable Lat Pulldowns (Slow Eccentric)", "Barbell Bench Press", "Leg Press (High & Wide Stance)"] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Incline Treadmill Walk & Zone 2 Cardio", exercises: ["12-3-30 Treadmill Walk", "Deep Diaphragmatic Box Breathing", "Child's Pose Spinal Reach"] },
      { day: "Day 3", focus: "Anterior & Lateral Shoulder Build", exercises: ["Standing Dumbbell Overhead Press", "Hanging Knee-to-Chest / Leg Raises", "High-Intensity Dumbbell Thrusters"] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Ergometer / Steady Walking Conditioning", exercises: ["Primal Cat-Cow Spinal Waves", "Dead Bug", "Bodyweight Squats"] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Walking & Spine Decompression", exercises: ["90/90 Hip Stretch", "Plank Holds", "Single-Leg Glute Bridges"] }
    ]
  },
  {
    id: "military-training",
    name: "Military Tactical Conditioning",
    category: "Calisthenics Programs",
    description: "The gold standard in combat fitness. High rep pullups, sprint drills, bear crawls, and absolute focus to reach peak lung capacity.",
    duration: "12 Weeks",
    difficulty: "Advanced",
    searchTags: ["military", "conditioning", "hardcore"],
    imageUrl: REAL_EXERCISE_MEDIA.shoulders,
    isPremium: true,
    schedule: [
      { day: "Day 1", focus: "Combat Conditioning", exercises: ["Push Ups", "Pull Ups", "Burpees", "Sprinting"] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Ruck Walk / Kinetic Cadence Walking", exercises: ["12-3-30 Treadmill Walk", "Deep Diaphragmatic Box Breathing", "Primal Cat-Cow Spinal Waves"] },
      { day: "Day 3", focus: "Core Endurance", exercises: ["Sit Ups", "Plank Holds", "Bear Crawl", "Jump Squats"] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Low-Impact Cardio Conditioning", exercises: ["Rope Jump", "Child's Pose Spinal Reach", "Dead Bug"] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Walking & Full Systemic Recovery", exercises: ["90/90 Hip Stretch", "Bodyweight Squats", "Plank Holds"] }
    ]
  },
  {
    id: "bodyweight-training",
    name: "Clinical Bodyweight Training",
    category: "Calisthenics Programs",
    description: "Learn full skeletal control and relative functional power using calisthenic progressions like the planche and handstands.",
    duration: "6 Weeks",
    difficulty: "Intermediate",
    searchTags: ["bodyweight", "calisthenics", "mobility"],
    imageUrl: REAL_EXERCISE_MEDIA.mobility,
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Calisthenic Push Mastery", exercises: ["Advanced Calisthenics: Handstand Push Ups", "Advanced Calisthenics: Planche", "Advanced Calisthenics: One Arm Push Up"] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Kinetic Incline Walking & Scapular Flow", exercises: ["12-3-30 Treadmill Walk", "Primal Cat-Cow Spinal Waves", "Deep Diaphragmatic Box Breathing"] },
      { day: "Day 3", focus: "Calisthenic Pull & Core", exercises: ["Advanced Calisthenics: Muscle Ups", "Advanced Calisthenics: Front Lever", "Advanced Calisthenics: Dragon Flag"] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Low-Impact Cardio & Joint Recovery", exercises: ["Dead Bug", "Child's Pose Spinal Reach", "Bodyweight Squats"] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Outdoor Walking & Wrist/Shoulder Mobility", exercises: ["90/90 Hip Stretch", "Plank Holds", "Single-Leg Glute Bridges"] }
    ]
  },
  {
    id: "core-strength",
    name: "Deep Core & Spine Strength",
    category: "Home Workout Programs",
    description: "Strengthen deep abdominal walls, spinal columns, and transverse fibers for bulletproof posture and lower back safety.",
    duration: "4 Weeks",
    difficulty: "Intermediate",
    searchTags: ["core", "abs", "spine", "obliques"],
    imageUrl: REAL_EXERCISE_MEDIA.chest,
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Core Transverse Stability", exercises: ["Dead Bug", "Plank Holds", "Deep Diaphragmatic Box Breathing"] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Low-Impact Walking & Diaphragmatic Flow", exercises: ["12-3-30 Treadmill Walk", "Primal Cat-Cow Spinal Waves", "Child's Pose Spinal Reach"] },
      { day: "Day 3", focus: "Spinal Waves & Obliques", exercises: ["Primal Cat-Cow Spinal Waves", "Side Plank", "Reverse Crunch"] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Zone 2 Step Walking & Pelvic Alignment", exercises: ["Single-Leg Glute Bridges", "Dead Bug", "Bodyweight Squats"] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Walking & Lumbar Decompression", exercises: ["90/90 Hip Stretch", "Plank Holds", "Deep Diaphragmatic Box Breathing"] }
    ]
  },
  {
    id: "5-month-belly-fat",
    name: "5 Month Belly Fat Melt",
    category: "Home Workout Programs",
    description: "A comprehensive 5-month phase progression targeting visceral fat reduction, metabolic threshold increase, and posture alignment.",
    duration: "20 Weeks",
    difficulty: "Intermediate",
    searchTags: ["belly fat", "5 month", "shred"],
    imageUrl: REAL_EXERCISE_MEDIA.mobility,
    isPremium: true,
    schedule: [
      { day: "Month 1-2 Focus", focus: "Foundation Cardio & Core", exercises: ["Rope Jump", "Plank Holds", "Dead Bug", "Squats"] },
      { day: "Weekly Recovery Day 1", focus: "Active Recovery: Incline Walking (12-3-30)", exercises: ["12-3-30 Treadmill Walk", "Primal Cat-Cow Spinal Waves", "Deep Diaphragmatic Box Breathing"] },
      { day: "Month 3-5 Focus", focus: "HIIT Intensity & Burnout", exercises: ["Burpees", "Mountain Climbers", "12-3-30 Treadmill Walk", "Push-ups"] },
      { day: "Weekly Recovery Day 2", focus: "Active Recovery: Low-Impact Zone 2 Cardio", exercises: ["Rope Jump", "Child's Pose Spinal Reach", "Dead Bug"] },
      { day: "Weekly Recovery Day 3", focus: "Active Recovery: LISS Walking & Core Vacuum", exercises: ["90/90 Hip Stretch", "Plank Holds", "Single-Leg Glute Bridges"] }
    ]
  },
  {
    id: "30-day-challenge",
    name: "30 Day Habit Challenge",
    category: "Training Styles",
    description: "Build unwavering physical discipline. Perform an active, clinical biomechanical workout everyday for 30 consecutive days.",
    duration: "30 Days",
    difficulty: "Beginner",
    searchTags: ["30 day", "challenge", "habits"],
    imageUrl: REAL_EXERCISE_MEDIA.arms,
    isPremium: false,
    schedule: [
      { day: "Day 1-15 Rotation", focus: "Cardio & Stretching Recovery", exercises: ["Dynamic Warm-up Jumps", "Active Stretch Squats", "Child's Pose Spinal Reach"] },
      { day: "Active Recovery Day 1", focus: "Zone 2 Incline Walking & Breathwork", exercises: ["12-3-30 Treadmill Walk", "Deep Diaphragmatic Box Breathing", "Primal Cat-Cow Spinal Waves"] },
      { day: "Day 16-30 Rotation", focus: "Muscular Endurance Drive", exercises: ["Push-ups", "Dumbbell Romanian Deadlifts", "Plank with Shoulder Taps"] },
      { day: "Active Recovery Day 2", focus: "Low-Impact Cardio & Step Flush", exercises: ["Rope Jump", "Mountain Climbers", "Dead Bug"] },
      { day: "Active Recovery Day 3", focus: "LISS Outdoor Walking & Hip Opener", exercises: ["90/90 Hip Stretch", "Bodyweight Squats", "Single-Leg Glute Bridges"] }
    ]
  },
  {
    id: "7-day-quick-burn",
    name: "7 Day Quick Calorie Burn",
    category: "Home Workout Programs",
    description: "Tight on schedule? Push your metabolic rate to the absolute limit with quick, hyper-focused 15-minute high intensity circuits.",
    duration: "7 Days",
    difficulty: "Intermediate",
    searchTags: ["7 day", "quick burn", "hiit"],
    imageUrl: REAL_EXERCISE_MEDIA.mobility,
    isPremium: false,
    schedule: [
      { day: "Day 1-3 Focus", focus: "Anaerobic Energy Bursts", exercises: ["Explosive Hip-Hinge Kettlebell Swings", "Burpees", "Side Plank"] },
      { day: "Recovery Day 1", focus: "Active Recovery: 15-Min Incline Power Walk", exercises: ["12-3-30 Treadmill Walk", "Primal Cat-Cow Spinal Waves", "Deep Diaphragmatic Box Breathing"] },
      { day: "Day 4-7 Focus", focus: "Full-Body Density", exercises: ["Dumbbell Renegade Rows with Push-Up", "High-Intensity Dumbbell Thrusters", "Dead Bug"] },
      { day: "Recovery Day 2", focus: "Active Recovery: Light Cardio Step Intervals", exercises: ["Rope Jump", "Child's Pose Spinal Reach", "Dead Bug"] },
      { day: "Recovery Day 3", focus: "Active Recovery: LISS Outdoor Walking Flush", exercises: ["90/90 Hip Stretch", "Plank Holds", "Single-Leg Glute Bridges"] }
    ]
  },
  {
    id: "home-workout-challenge-180",
    name: "180 Day Home Workout Challenge",
    category: "Home Workout Programs",
    description: "Build strength, improve your fitness, and transform your lifestyle from home with zero equipment. Includes 4 progressive phases, 2x weekly 5 KM cardio runs/walks, and 7:30 PM nutrition protocol for Men & Women.",
    duration: "26 Weeks",
    difficulty: "Beginner",
    searchTags: ["home workout", "180 days", "zero equipment", "bodyweight", "calisthenics", "cardio", "5km"],
    imageUrl: REAL_EXERCISE_MEDIA.core,
    isPremium: true,
    schedule: [
      { day: "Phase 1 - Foundational Adaptation", focus: "Full Body Bodyweight & Isometric Base", exercises: ["Push-Ups (or Incline / Knee)", "Bodyweight Squats", "Forearm Plank", "Dynamic Jumping Jacks"] },
      { day: "Weekly 5 KM Milestone Day", focus: "Aerobic Capacity: 5 KM Outdoor Run or Brisk Walk", exercises: ["Rope Jump", "Deep Diaphragmatic Box Breathing", "Primal Cat-Cow Spinal Waves"] },
      { day: "Phase 2 - Hypertrophy & Work Capacity", focus: "Elevated Volume & Mechanical Tension", exercises: ["Decline / Diamond Push-Ups", "Reverse Lunges with Knee Drive", "Chair Tricep Dips", "Mountain Climbers"] },
      { day: "Phase 3 - Calisthenics Strength", focus: "Explosive Power & Calisthenics", exercises: ["Pike Push-Ups", "Jump Squats", "Bicycle Crunches", "Doorframe Bodyweight Rows"] },
      { day: "Phase 4 - Peak Transformation", focus: "Elite Density & Mastery", exercises: ["Push-Ups", "Bodyweight Squats", "Plank to Push-Up", "Burpees"] }
    ]
  },
  {
    id: "women-confidence-180",
    name: "180-Day Women's Confidence & Posture Program",
    category: "Women's Programs",
    description: "6 progressive phases targeting glute shaping, sculpted posture, deep core stability, and athletic confidence across 180 transformational days.",
    duration: "26 Weeks",
    difficulty: "Beginner",
    searchTags: ["women confidence", "180 days", "glutes", "posture", "toning"],
    imageUrl: REAL_EXERCISE_MEDIA.legs,
    isPremium: true,
    schedule: [
      { day: "Phase 1 - Glute Activation & Base", focus: "Glute Hypertrophy & Transverse Core", exercises: ["Glute Bridge & Isometric Hold", "Tempo Goblet Squat", "Contralateral Dead Bug", "Resistance Band Pull-Aparts & Posture Opener"] },
      { day: "Weekly Recovery Day 1", focus: "Active Recovery: Zone 2 Kinetic Walking & Incline Flow", exercises: ["12-3-30 Treadmill Walk", "Deep Diaphragmatic Box Breathing", "Primal Cat-Cow Spinal Waves"] },
      { day: "Phase 2 - Curves & Sculpting", focus: "Posterior Chain & Shoulder V-Taper", exercises: ["Bulgarian Split Squat", "Dumbbell Romanian Deadlift (RDL)", "Single-Arm Supported Row", "Standing Dumbbell Overhead Shoulder Press"] },
      { day: "Weekly Recovery Day 2", focus: "Active Recovery: Low-Impact Cardio & Core Tightening", exercises: ["Rope Jump", "Mountain Climbers", "Child's Pose Spinal Reach"] },
      { day: "Phase 3 - Dynamic Power", focus: "Compound Glute Power & Definition", exercises: ["Barbell Hip Thrust", "Curtsy Lunges", "Sumo Squat with Pulse", "Plank Hip Dips"] },
      { day: "Weekly Recovery Day 3", focus: "Active Recovery: LISS Outdoor Step Walking & Hip Release", exercises: ["90/90 Hip Stretch", "Plank Holds", "Single-Leg Glute Bridges"] }
    ]
  },
  {
    id: "athletic-conditioning-hybrid",
    name: "Hybrid Athletic Conditioning & Power",
    category: "Training Styles",
    description: "Build explosive functional athleticism, rotational torque, and unbreakable work capacity with kettlebells, sleds, and high-velocity dumbbells.",
    duration: "8 Weeks",
    difficulty: "Advanced",
    searchTags: ["hybrid", "athletic", "crossfit", "power", "conditioning"],
    imageUrl: REAL_EXERCISE_MEDIA.shoulders,
    isPremium: true,
    schedule: [
      { day: "Day 1", focus: "Explosive Full Body Power", exercises: ["Devil Press with Dual Dumbbells", "Barbell Clean and Press", "Wall Balls (Thruster into High Target)"] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Incline Ruck Walk & Zone 2 Aerobic Base", exercises: ["12-3-30 Treadmill Walk", "Deep Diaphragmatic Box Breathing", "Primal Cat-Cow Spinal Waves"] },
      { day: "Day 3", focus: "Tactical Stamina & Carries", exercises: ["Sled / Prowler Push & Pull Sprint", "Dumbbell Suitcase Carry", "Turkish Get-Up with Kettlebell"] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Low-Impact Cardio & Rotational Flushes", exercises: ["Rope Jump", "Child's Pose Spinal Reach", "Dead Bug"] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Walking & Full Systemic Recovery", exercises: ["90/90 Hip Stretch", "Plank Holds", "Single-Leg Glute Bridges"] }
    ]
  },
  {
    id: "functional-mobility-longevity",
    name: "Functional Mobility & Joint Longevity",
    category: "Home Workout Programs",
    description: "Restore hip flexibility, thoracic rotation, and spinal resilience to eliminate tightness and move pain-free for life.",
    duration: "4 Weeks",
    difficulty: "Beginner",
    searchTags: ["mobility", "longevity", "flexibility", "stretching", "recovery"],
    imageUrl: REAL_EXERCISE_MEDIA.mobility,
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Hip & Pelvic Decoupling", exercises: ["World's Greatest Stretch Complex", "Couch Stretch for Tight Hip Flexors", "Shin Box Hip Internal-External Rotations"] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Incline Walking & Diaphragmatic Flow", exercises: ["12-3-30 Treadmill Walk", "Deep Diaphragmatic Box Breathing", "Primal Cat-Cow Spinal Waves"] },
      { day: "Day 3", focus: "Thoracic & Spine Relief", exercises: ["Scorpion Stretch for Spinal Rotation", "Pigeon Pose with Active Thoracic Reach", "Pallof Press with Isometric Hold"] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Low-Impact Cardio & Step Walk", exercises: ["Rope Jump", "Child's Pose Spinal Reach", "Dead Bug"] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Walking & Joint Flushes", exercises: ["90/90 Hip Stretch", "Plank Holds", "Single-Leg Glute Bridges"] }
    ]
  }
];

export const MUSCLE_GROUPS = [
  "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Forearms", "Legs", "Quadriceps", "Hamstrings", "Glutes", "Calves", "Core", "Abs", "Obliques", "Cardio", "Full Body", "Mobility"
];

export const WORKOUT_CATEGORIES = [
  "Gym Workouts", "Home Workouts", "Cardio Workouts", "Calisthenics Workouts", "Military Style Fitness", "Women Confidence Program", "Women's Programs"
];
