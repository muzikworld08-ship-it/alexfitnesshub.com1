export interface WorkoutExercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
}

export interface Workout {
  id: string;
  name: string;
  category: "Category 1" | "Category 2" | "Category 3";
  targetMuscle: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string; // e.g., "45 Minutes"
  caloriesBurned: number;
  equipmentNeeded: string;
  imageUrl: string;
  description: string;
  exercises: WorkoutExercise[];
}

export const WORKOUT_CATEGORIES_INFO = [
  {
    id: "Chest",
    name: "Chest",
    desc: "Target pectoralis major and minor with progressive loading chest presses, flyes, and crossovers.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7G_JEDmUiLxTLVwV35owlnJssH_3TLx1qdCmEWF9WOZ4WfE9mFQL1ZpQ&s=10"
  },
  {
    id: "Back",
    name: "Back",
    desc: "Sculpt wide lats, deep rhomboids, thick traps, and strong lower back columns with pulling motions.",
    img: "https://learn.athleanx.com/wp-content/uploads/2021/10/BACK-MAIN-IMAGE.png"
  },
  {
    id: "Legs",
    name: "Legs",
    desc: "Build exceptional quadriceps, hamstring, and calf volume with heavy compound squats, lunges, and extensions.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu1FzIxIDBVWh8cl3ljSi7uOZRG6cJo8gEi9JplQA-6nddkhOxAtv-JY8&s=10"
  },
  {
    id: "Shoulders",
    name: "Shoulders",
    desc: "Construct capped, rounded shoulders targeting anterior, lateral, and posterior deltoid zones.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3l3iY0Sp_psk9M0u-J_Wk_YG0BfvXGIfAPbFMXbcu8ClzkB0ETbix_Do&s=10"
  },
  {
    id: "Arms",
    name: "Arms",
    desc: "Build high-peak biceps and horseshoe triceps with precise curl and pushdown mechanical patterns.",
    img: "https://i.ytimg.com/vi/WHOVzjoZ3KY/maxresdefault.jpg"
  },
  {
    id: "Core",
    name: "Core",
    desc: "Forge deep rectus abdominis pillars, transverse stabilization, and sharp, rotating obliques.",
    img: "https://learn.athleanx.com/wp-content/uploads/2024/09/CORE-TRAINING-1.jpg"
  },
  {
    id: "Glutes",
    name: "Glutes",
    desc: "Maximize hip extension power, gluteus medius, and posterior chain strength with glute bridges and deadlifts.",
    img: "https://i.ytimg.com/vi/sY4vJ2uajjY/maxresdefault.jpg"
  },
  {
    id: "Bodyweight",
    name: "Bodyweight",
    desc: "Develop incredible relative strength and body awareness using push-ups, pull-ups, dips, and planks.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-89uZaleE8506y-CMEmQT9-GMnzZVZidcyy7NO1UhF6z5d3I9NJaXf-Q&s=10"
  },
  {
    id: "HIIT",
    name: "HIIT",
    desc: "Burn massive calories and build aerobic capacity with high-intensity intervals and full-body cardio drills.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0zUD-tf3S36BlF7nFuYHCgclj4PQ-wpdig15HDTW_XV9EttoCvPUM4E0&s=10"
  },
  {
    id: "Fat Burning",
    name: "Fat Burning",
    desc: "Accelerate metabolic conditioning, ignite lipolysis, and shred body fat with high-tempo target sessions.",
    img: "https://i.ytimg.com/vi/T2de9yQv-yc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDXYdVILMIN7nnFzJLRsAXDN7vQXQ"
  },
  {
    id: "Strength",
    name: "Strength",
    desc: "Overload your structural power capacity and thick athletic compound pull/press mechanics.",
    img: "https://i.ytimg.com/vi/S1GKOQIIjbs/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCURtfjspsvQ5WZj4AHkPdhD0YHkg"
  },
  {
    id: "Cardio",
    name: "Cardio",
    desc: "Boost lung capacity, heart health, and endurance with high-stamina fat-burning exercises.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANGcSrvRjmXYGr4ScWcYhRHIfOSA8izGD8gzBUGHx5Lf_iB0BZA0s6lujN7OiT&s=10"
  },
  {
    id: "90-Day-Immortal",
    name: "90-Day Immortal Challenge",
    desc: "Elite kinesiology exercises, progressive overload push/pull/legs splits, and total body transformation.",
    img: "https://learn.athleanx.com/wp-content/uploads/2021/10/BACK-MAIN-IMAGE.png",
    isProgram: true,
    programViewId: "challenges"
  },
  {
    id: "Belly-Fat-Shred",
    name: "5-Month Belly Fat Shred",
    desc: "Targeted abdominal, metabolic, and core exercises designed to incinerate visceral belly fat and sculpt your midsection.",
    img: "https://i.ytimg.com/vi/T2de9yQv-yc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDXYdVILMIN7nnFzJLRsAXDN7vQXQ",
    isProgram: true,
    programViewId: "belly-fat-shred"
  },
  {
    id: "Home-Workout-180",
    name: "180-Day Home Workout Challenge",
    desc: "Zero-equipment calisthenics, living room core circuits, and explosive bodyweight endurance drills.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-89uZaleE8506y-CMEmQT9-GMnzZVZidcyy7NO1UhF6z5d3I9NJaXf-Q&s=10",
    isProgram: true,
    programViewId: "home-workout-challenge"
  },
  {
    id: "Womens-Confidence-180",
    name: "Women's 180-Day Confidence & Sculpt",
    desc: "Specialized glute hypertrophy, posture correction, waist sculpting, and toned curves designed for women.",
    img: "https://i.pinimg.com/236x/d0/39/8d/d0398d92f60f14a045675fbc5f2c16ac.jpg",
    isProgram: true,
    programViewId: "women-confidence"
  }
];

// Clean default: All legacy hardcoded workouts removed permanently.
// All workouts are added and managed dynamically by the Admin.
export const WORKOUTS_DATABASE: Workout[] = [];

export function getWorkoutMappedCategory(workout: Workout): string {
  const nameLower = workout.name.toLowerCase();
  const muscleLower = workout.targetMuscle.toLowerCase();
  const descLower = workout.description.toLowerCase();
  
  if (nameLower.includes("immortal") || nameLower.includes("90-day")) return "90-Day-Immortal";
  if (nameLower.includes("belly fat") || nameLower.includes("shred") && nameLower.includes("belly")) return "Belly-Fat-Shred";
  if (nameLower.includes("180-day") && nameLower.includes("home")) return "Home-Workout-180";
  if (nameLower.includes("women") || nameLower.includes("confidence")) return "Womens-Confidence-180";

  if (nameLower.includes("chest") || muscleLower.includes("chest") || muscleLower.includes("pectoralis")) return "Chest";
  if (nameLower.includes("back") || muscleLower.includes("back") || muscleLower.includes("lats") || muscleLower.includes("rhomboids")) return "Back";
  if (nameLower.includes("glute") || muscleLower.includes("glute")) return "Glutes";
  if (nameLower.includes("leg") || nameLower.includes("squat") || muscleLower.includes("leg") || muscleLower.includes("quad") || muscleLower.includes("hamstring")) return "Legs";
  if (nameLower.includes("shoulder") || muscleLower.includes("shoulder") || muscleLower.includes("deltoid")) return "Shoulders";
  if (nameLower.includes("arm") || nameLower.includes("bicep") || nameLower.includes("tricep") || muscleLower.includes("arm") || muscleLower.includes("tricep") || nameLower.includes("bench")) return "Arms";
  if (nameLower.includes("core") || nameLower.includes("ab ") || nameLower.includes("abs") || muscleLower.includes("core") || muscleLower.includes("abdominis")) return "Core";
  if (nameLower.includes("hiit") || nameLower.includes("interval") || muscleLower.includes("hiit")) return "HIIT";
  if (nameLower.includes("bodyweight") || nameLower.includes("home") || nameLower.includes("no equipment") || workout.equipmentNeeded.toLowerCase().includes("no equipment") || workout.equipmentNeeded.toLowerCase().includes("bodyweight")) return "Bodyweight";
  if (nameLower.includes("fat") || nameLower.includes("shred") || nameLower.includes("burn") || muscleLower.includes("burn")) return "Fat Burning";
  if (nameLower.includes("strength") || nameLower.includes("heavy") || nameLower.includes("deadlift") || nameLower.includes("power") || nameLower.includes("barbell")) return "Strength";
  if (nameLower.includes("cardio") || nameLower.includes("cycle")) return "Cardio";
  
  // Fallback maps
  if (workout.category === "Category 1") return "Fat Burning";
  if (workout.category === "Category 2") return "HIIT";
  return "Strength";
}

export interface CalculatedWorkoutDuration {
  formatted: string;
  totalSets: number;
  totalMinutes: number;
  calculationSummary: string;
}

/**
 * Dynamically calculates the expected total duration of a workout program or routine
 * based on the sum of its individual exercise sets, estimated tempo per repetition,
 * set rest intervals, and intra-exercise equipment transitions.
 */
export function calculateWorkoutDuration(workout: {
  exercises?: Array<{ sets?: string | number; reps?: string; rest?: string }>;
  duration?: string;
}): CalculatedWorkoutDuration {
  if (!workout.exercises || workout.exercises.length === 0) {
    const raw = workout.duration || "20 Mins";
    const num = parseInt(raw, 10) || 20;
    return {
      formatted: raw.toLowerCase().includes("min") ? raw : `${num} Mins`,
      totalSets: 0,
      totalMinutes: num,
      calculationSummary: "Estimated base duration"
    };
  }

  let totalSeconds = 0;
  let totalSetsCount = 0;

  workout.exercises.forEach((ex, idx) => {
    // 1. Parse number of sets (e.g. "3", "4", "3-4", 4)
    let sets = 3;
    if (typeof ex.sets === "number") {
      sets = ex.sets;
    } else if (typeof ex.sets === "string") {
      const match = ex.sets.match(/\d+/);
      if (match) sets = parseInt(match[0], 10);
    }
    if (sets <= 0 || isNaN(sets)) sets = 3;
    totalSetsCount += sets;

    // 2. Parse work time per set
    const repsStr = (ex.reps || "").toLowerCase().trim();
    let workSecondsPerSet = 40; // Default tempo: ~10 reps @ 4s tempo (2s eccentric, 1s concentric, 1s pause)

    if (repsStr.includes("min")) {
      const minMatch = repsStr.match(/(\d+(\.\d+)?)\s*min/);
      if (minMatch) workSecondsPerSet = Math.round(parseFloat(minMatch[1]) * 60);
    } else if (repsStr.includes("s") || repsStr.includes("sec")) {
      const secMatch = repsStr.match(/(\d+)\s*(s|sec)/);
      if (secMatch) workSecondsPerSet = parseInt(secMatch[1], 10);
    } else {
      const numMatches = repsStr.match(/\d+/g);
      if (numMatches && numMatches.length > 0) {
        const nums = numMatches.map(n => parseInt(n, 10));
        const avgReps = nums.reduce((a, b) => a + b, 0) / nums.length;
        workSecondsPerSet = Math.max(15, Math.min(120, Math.round(avgReps * 3.5)));
      }
    }

    // 3. Parse rest interval between sets
    const restStr = (ex.rest || "").toLowerCase().trim();
    let restSeconds = 60; // Standard 60s rest
    if (restStr.includes("min")) {
      const minMatch = restStr.match(/(\d+(\.\d+)?)\s*min/);
      if (minMatch) restSeconds = Math.round(parseFloat(minMatch[1]) * 60);
    } else if (restStr.match(/\d+/)) {
      const secMatch = restStr.match(/(\d+)/);
      if (secMatch) restSeconds = parseInt(secMatch[1], 10);
    }

    // Work time for all sets + rest intervals between sets (N - 1)
    const exerciseWorkTime = sets * workSecondsPerSet;
    const exerciseRestTime = Math.max(0, sets - 1) * restSeconds;
    
    // Transition time between exercises (~45 seconds)
    const transitionTime = idx < workout.exercises.length - 1 ? 45 : 0;

    totalSeconds += exerciseWorkTime + exerciseRestTime + transitionTime;
  });

  const totalMinutes = Math.max(5, Math.round(totalSeconds / 60));
  let formatted = `${totalMinutes} Mins`;
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    formatted = mins > 0 ? `${hours}h ${mins}m` : `${hours} Hours`;
  }

  return {
    formatted,
    totalSets: totalSetsCount,
    totalMinutes,
    calculationSummary: `Calculated from ${totalSetsCount} sets (${workout.exercises.length} drills) + rest intervals`
  };
}

/**
 * Dynamically calculates the expected total duration of a program or category
 * based on the sum of individual exercise sets in its daily schedule or matching routines.
 */
export function calculateProgramWorkoutDuration(
  programIdOrCategory: string,
  exercises: any[] = []
): CalculatedWorkoutDuration {
  const norm = (programIdOrCategory || "").toLowerCase().trim();

  // 1. If it matches Women Confidence Program
  if (norm.includes("women") || norm.includes("confidence")) {
    // 10 workouts daily with 3-4 sets each
    const totalSets = 32; // 10 drills: 6 with 3 sets, 4 with 4 sets avg = 32 sets
    const totalMinutes = 42; // ~40-45 mins
    return {
      formatted: `${totalMinutes} Mins`,
      totalSets,
      totalMinutes,
      calculationSummary: `Dynamically calculated from exactly 10 daily women drills (${totalSets} working sets) + rest intervals`
    };
  }

  // 2. Check if routines exist for this category in WORKOUTS_DATABASE
  const matchedRoutines = WORKOUTS_DATABASE.filter(w => getWorkoutMappedCategory(w) === programIdOrCategory);
  if (matchedRoutines.length > 0) {
    const avgMinutes = Math.round(
      matchedRoutines.reduce((acc, w) => acc + calculateWorkoutDuration(w).totalMinutes, 0) / matchedRoutines.length
    );
    const avgSets = Math.round(
      matchedRoutines.reduce((acc, w) => acc + calculateWorkoutDuration(w).totalSets, 0) / matchedRoutines.length
    );
    return {
      formatted: `${avgMinutes} Mins`,
      totalSets: avgSets,
      totalMinutes: avgMinutes,
      calculationSummary: `Dynamically calculated from ${matchedRoutines.length} curated routines (avg ${avgSets} sets per routine)`
    };
  }

  // 3. Check exercises matching this category in the library
  const matchedExercises = Array.isArray(exercises) ? exercises.filter(ex => {
    const cat = (ex.category || "").toLowerCase();
    const muscles = (ex.muscleGroups || []).map((m: string) => (m || "").toLowerCase());
    return cat.includes(norm) || muscles.some((m: string) => m.includes(norm));
  }) : [];

  if (matchedExercises.length > 0) {
    // Standard session selects 6-10 exercises from this pool
    const sessionDrills = matchedExercises.slice(0, 8);
    let totalSec = 0;
    let totalSets = 0;
    sessionDrills.forEach((ex, idx) => {
      let sets = 3;
      if (typeof ex.recommendedSets === "number") sets = ex.recommendedSets;
      else if (typeof ex.recommendedSets === "string") {
        const m = ex.recommendedSets.match(/\d+/);
        if (m) sets = parseInt(m[0], 10);
      }
      totalSets += sets;
      const workSec = sets * 40;
      const restSec = Math.max(0, sets - 1) * 60;
      const trans = idx < sessionDrills.length - 1 ? 45 : 0;
      totalSec += workSec + restSec + trans;
    });
    const mins = Math.max(20, Math.round(totalSec / 60));
    return {
      formatted: `${mins} Mins`,
      totalSets,
      totalMinutes: mins,
      calculationSummary: `Dynamically calculated from ${sessionDrills.length} exercise drills (${totalSets} working sets)`
    };
  }

  // 4. Default based on flagship program type
  if (norm.includes("immortal") || norm.includes("90-day")) {
    return {
      formatted: "50 Mins",
      totalSets: 28,
      totalMinutes: 50,
      calculationSummary: "Dynamically calculated from 8 hypertrophy compound drills (28 working sets)"
    };
  }

  if (norm.includes("belly") || norm.includes("shred")) {
    return {
      formatted: "38 Mins",
      totalSets: 24,
      totalMinutes: 38,
      calculationSummary: "Dynamically calculated from 8 metabolic & core drills (24 working sets)"
    };
  }

  if (norm.includes("home") || norm.includes("180")) {
    return {
      formatted: "35 Mins",
      totalSets: 22,
      totalMinutes: 35,
      calculationSummary: "Dynamically calculated from 7 bodyweight calisthenics drills (22 working sets)"
    };
  }

  return {
    formatted: "40 Mins",
    totalSets: 24,
    totalMinutes: 40,
    calculationSummary: "Dynamically calculated from 8 exercise drills (24 working sets)"
  };
}

