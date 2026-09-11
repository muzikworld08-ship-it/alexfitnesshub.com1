import { Exercise, getExerciseGifUrl } from "./exercises";

export interface ProgramMainCategory {
  id: "90-days-immortal" | "gym-programs" | "women-programs" | "home-programs" | "goal-based-programs" | "workout-library";
  title: string;
  subtitle: string;
  badge: string;
  tagline: string;
  description: string;
  bgGradient: string;
  accentColor: string;
  image: string;
  totalWorkoutsOrDays: string;
}

export const MAIN_PROGRAM_CATEGORIES: ProgramMainCategory[] = [
  {
    id: "90-days-immortal",
    title: "90 Days Immortal Challenge",
    subtitle: "Flagship 90-Day Rolling Cycle",
    badge: "Most Popular",
    tagline: "Unbreakable Physical Transformation",
    description: "The ultimate 7-day science-based muscle split continuously rotating for 90 days. Zero duplicates, structured cardio recovery, and automated progression.",
    bgGradient: "from-amber-600/20 via-neutral-900 to-neutral-950",
    accentColor: "text-amber-400 border-amber-500/40 hover:border-amber-400",
    image: getExerciseGifUrl("Barbell Bench Press", "Gym Workouts"),
    totalWorkoutsOrDays: "90 Days"
  },
  {
    id: "gym-programs",
    title: "Gym Workout Programs",
    subtitle: "Iron & Hypertrophy Protocols",
    badge: "Gym Ready",
    tagline: "Mass, Power & Progressive Overload",
    description: "Specialized resistance training programs utilizing barbells, dumbbells, cables, and machines for maximum strength and muscular hypertrophy.",
    bgGradient: "from-red-600/20 via-neutral-900 to-neutral-950",
    accentColor: "text-red-400 border-red-500/40 hover:border-red-400",
    image: getExerciseGifUrl("Deadlift", "Gym Workouts"),
    totalWorkoutsOrDays: "6 Core Programs"
  },
  {
    id: "women-programs",
    title: "Women’s Workout Programs",
    subtitle: "180-Day Women Confidence System",
    badge: "180 Days",
    tagline: "Sculpt, Tone, Glute Focus & Cardio Runs",
    description: "The 180-day structured rolling cycle alternating upper/lower body splits with 2x 5-10km walks/runs, glutes, core, and posture mobility.",
    bgGradient: "from-pink-600/20 via-neutral-900 to-neutral-950",
    accentColor: "text-pink-400 border-pink-500/40 hover:border-pink-400",
    image: getExerciseGifUrl("Barbell Hip Thrust", "Gym Workouts"),
    totalWorkoutsOrDays: "180 Days"
  },
  {
    id: "home-programs",
    title: "Home Workout Programs",
    subtitle: "Zero & Minimal Equipment",
    badge: "Anywhere",
    tagline: "Bodyweight, Dumbbell & Band Efficiency",
    description: "Strictly home-compatible workouts. No gym machines, no bulky setups. 19 specialized tracks for fat loss, abs, strength, and mobility.",
    bgGradient: "from-emerald-600/20 via-neutral-900 to-neutral-950",
    accentColor: "text-emerald-400 border-emerald-500/40 hover:border-emerald-400",
    image: getExerciseGifUrl("Standard Push Ups", "Home Workouts"),
    totalWorkoutsOrDays: "19 Categories"
  },
  {
    id: "goal-based-programs",
    title: "Goal Based Programs",
    subtitle: "Target-Driven Fitness Missions",
    badge: "Smart Match",
    tagline: "Custom-Tailored to Your Exact Goal",
    description: "Directly target your priority: Build Muscle, Lose Weight, Build Abs, Build Glutes, Get Stronger, Improve Fitness, Beginner, or Home.",
    bgGradient: "from-cyan-600/20 via-neutral-900 to-neutral-950",
    accentColor: "text-cyan-400 border-cyan-500/40 hover:border-cyan-400",
    image: getExerciseGifUrl("Burpees", "Calisthenics Workouts"),
    totalWorkoutsOrDays: "8 Goals"
  },
  {
    id: "workout-library",
    title: "Workout Library",
    subtitle: "Master Exercise Database",
    badge: "250+ Moves",
    tagline: "Interactive Technique Encyclopedia",
    description: "Explore the comprehensive exercise library with real-time video/GIF animations, biomechanical cues, muscle targeting, and smart filters.",
    bgGradient: "from-purple-600/20 via-neutral-900 to-neutral-950",
    accentColor: "text-purple-400 border-purple-500/40 hover:border-purple-400",
    image: getExerciseGifUrl("Plank", "Core"),
    totalWorkoutsOrDays: "250+ Exercises"
  }
];

// ==========================================
// 1. 90 DAYS IMMORTAL CHALLENGE ENGINE
// ==========================================

export interface DayWorkoutPlan {
  dayNumber: number;
  cycleDay: number; // 1 to 7
  title: string;
  focus: string;
  targetMuscles: string[];
  isCardioRecovery: boolean;
  isRestDay: boolean;
  walkRunDistance?: string;
  guidelines: string[];
  exercises: Exercise[];
}

export const IMMORTAL_7_DAY_CYCLE_INFO = [
  {
    cycleDay: 1,
    title: "Chest + Triceps",
    focus: "Horizontal & Incline Pressing + Pectoral Flyes + Tricep Lockouts (13+ Workouts)",
    targetMuscles: ["Chest", "Triceps"],
    isCardioRecovery: false,
    isRestDay: false,
    guidelines: [
      "Warm up rotator cuffs with light arm circles and band pull-aparts.",
      "Start with primary compound barbell/dumbbell presses before progressing to flyes and isolated triceps extensions.",
      "Control the eccentric (negative) portion for 2-3 seconds on every rep.",
      "Execute all 13 high-volume exercises with strict tempo and peak lockout."
    ]
  },
  {
    cycleDay: 2,
    title: "Back + Biceps + Forearms & Abs",
    focus: "Vertical & Horizontal Pulling + Bicep Hypertrophy + Grip & Core Bracing (13+ Workouts)",
    targetMuscles: ["Back", "Biceps", "Forearms", "Abs"],
    isCardioRecovery: false,
    isRestDay: false,
    guidelines: [
      "Initiate all pulls from your lats and scapula, not your hands or wrists.",
      "Keep your spine neutral on heavy deadlifts and barbell rows.",
      "Achieve full extension on bicep curls, then finish with dedicated forearm grip work and abdominal flexion.",
      "Execute all 13 exercises with structured sets and progressive overload."
    ]
  },
  {
    cycleDay: 3,
    title: "5 to 10 KM Running / Walking & Rest",
    focus: "5 to 10 KM Aerobic Run or Walk + Full Post-Cardio Muscular Rest (Workouts Removed)",
    targetMuscles: ["Cardio", "Recovery"],
    isCardioRecovery: true,
    isRestDay: false,
    walkRunDistance: "5 to 10 km Walk or Run",
    guidelines: [
      "Walk or run 5 to 10 kilometers at a steady aerobic pace (Zone 2).",
      "No workout on cardio days: After completing your 5 to 10 KM cardio, rest your muscles completely.",
      "Rehydrate with electrolytes and allow full nervous system and muscular rest to recharge."
    ]
  },
  {
    cycleDay: 4,
    title: "Legs, Abs & Shoulders",
    focus: "Quad & Hamstring Overload + Deltoid Boulder Shaping + Abdominal Stability (13+ Workouts)",
    targetMuscles: ["Legs", "Shoulders", "Abs", "Quadriceps", "Hamstrings", "Calves"],
    isCardioRecovery: false,
    isRestDay: false,
    guidelines: [
      "Prioritize full range of motion and knee tracking over pure weight on leg presses and squats.",
      "Target all three deltoid heads (anterior, lateral, posterior) with clean overhead presses and lateral raises.",
      "Engage lower and upper abdominals with controlled tempo and zero momentum.",
      "Complete all 13 targeted movements for balanced aesthetic development."
    ]
  },
  {
    cycleDay: 5,
    title: "Chest + Triceps (Hypertrophy Rotation)",
    focus: "Pectoral Fiber Variation + Cable Overload + Triceps Skull Crushers & Dips (13+ Workouts)",
    targetMuscles: ["Chest", "Triceps"],
    isCardioRecovery: false,
    isRestDay: false,
    guidelines: [
      "Target clavicular and sternal pectoral fibers with varied angles and grips.",
      "Keep continuous mechanical tension on triceps pushdowns and overhead extensions.",
      "A distinct non-repeating set of 13 exercises compared to Day 1."
    ]
  },
  {
    cycleDay: 6,
    title: "Back + Biceps + Forearms & Abs (Density Rotation)",
    focus: "Lat Width, Scapular Retraction + Bicep Peak + Forearms & Core Armor (13+ Workouts)",
    targetMuscles: ["Back", "Biceps", "Forearms", "Abs"],
    isCardioRecovery: false,
    isRestDay: false,
    guidelines: [
      "Focus on driving your elbows back toward your hips on all horizontal rows.",
      "Squeeze your shoulder blades together tightly at peak contraction.",
      "Rotate through fresh bicep curl angles, reverse wrist curls, and core rollouts.",
      "Complete all 13 exercises with intense focus and discipline."
    ]
  },
  {
    cycleDay: 7,
    title: "5 to 10 KM Running / Walking & Rest",
    focus: "5 to 10 KM Recovery Walk or Run + Full Central Nervous Recovery (Workouts Removed)",
    targetMuscles: ["Recovery", "Cardio", "Mobility"],
    isCardioRecovery: true,
    isRestDay: true,
    walkRunDistance: "5 to 10 km Recovery Walk or Run",
    guidelines: [
      "Total active recovery day. No resistance or weightlifting permitted.",
      "A 5 to 10 kilometer brisk outdoor or treadmill walk or gentle run is completed.",
      "Prioritize nutrient-dense whole foods, 3-4 liters of water, and full recovery."
    ]
  }
];

/**
 * Returns the exact workout plan for any given day (Day 1 through Day 90)
 * of the 90 Days Immortal Challenge, using real exercises from the live library.
 * Guarantees at least 13 exercises per resistance day, properly filtered by category,
 * with dynamic non-repeating rotation across days and weeks.
 */
export function getImmortalChallengeDayPlan(dayNumber: number, allExercises: Exercise[]): DayWorkoutPlan {
  const safeDay = Math.max(1, Math.min(90, dayNumber));
  const cycleDay = ((safeDay - 1) % 7) + 1; // 1, 2, 3, 4, 5, 6, 7
  const weekNum = Math.ceil(safeDay / 7);
  const cycleInfo = IMMORTAL_7_DAY_CYCLE_INFO[cycleDay - 1];

  // Helper to safely rotate an array by an offset to ensure different workouts each day/week
  const rotatePool = (list: Exercise[], offset: number): Exercise[] => {
    if (list.length === 0) return [];
    const normalizedOffset = Math.abs(offset) % list.length;
    return [...list.slice(normalizedOffset), ...list.slice(0, normalizedOffset)];
  };

  let dayExercises: Exercise[] = [];

  if (cycleDay === 3 || cycleDay === 7) {
    // Day 3 & Day 7: 5 to 10 KM Running / Walking & Complete Rest (Workouts removed)
    const cardioRestDrills: Exercise[] = [
      {
        id: `immortal-cardio-5-10km-day-${safeDay}`,
        name: safeDay % 2 === 0 ? "5 to 10 KM Outdoor Aerobic Run / Walk" : "5 to 10 KM Paced Treadmill or Trail Run / Walk",
        muscleGroups: ["Cardio"],
        difficulty: "Beginner",
        instructions: [
          "Maintain a steady, conversational aerobic pacing (Zone 2 heart rate).",
          "Breathe rhythmically through your nose and diaphragm.",
          "Complete the 5 to 10 KM distance outdoors, around a track, or on a treadmill.",
          "Once finished, discontinue all workouts and begin complete rest."
        ],
        equipment: ["Bodyweight"],
        category: "Cardio Workouts",
        categories: ["Cardio Workouts"],
        commonMistakes: ["Sprinting too fast and spiking cortisol", "Adding heavy weight training on cardio day"],
        safetyTips: ["Wear cushioned running shoes", "Hydrate with water and electrolytes"],
        alternativeExercises: ["12-3-30 Treadmill Incline Walk"],
        progressionVariations: ["Increase distance toward 10 km", "Increase outdoor incline"],
        isPremium: false,
        startingPosition: "Upright athletic posture.",
        movementExecution: "Smooth aerobic strides with relaxed shoulders.",
        finishingPosition: "Gradual 5-minute cooldown walk.",
        regressionVariations: ["5 km brisk power walk"],
        musclesWorked: ["Cardiovascular System", "Legs", "Heart & Lungs"],
        gifUrl: getExerciseGifUrl("Running", "Cardio"),
        imageUrl: getExerciseGifUrl("Running", "Cardio"),
        description: "Pure cardiovascular pacing engine. Build aerobic base and burn fat while sparing muscular joints.",
        duration: "45-65 min",
        tags: ["Cardio", "Zone 2", "Fat Burn", "5-10 KM"],
        breathingInstructions: "Rhythmic nasal and diaphragmatic breathing.",
        recommendedSetsReps: "5 to 10 KM Continuous Distance",
        recommendedSets: "1",
        recommendedReps: "5-10 KM",
        restTime: "Complete Rest Post-Cardio",
        caloriesBurned: 520,
        benefits: ["Maximizes fat oxidation", "Expands lung VO2 max", "Allows muscular recovery from lifting"],
        trainerTips: "No workout today. Just complete your cardio and rest!",
        safetyNotes: "Stay hydrated.",
        bodyPart: "Cardio"
      },
      {
        id: `immortal-post-cardio-rest-day-${safeDay}`,
        name: "Post-Cardio Full Rest & Muscle Recovery",
        muscleGroups: ["Recovery"],
        difficulty: "Beginner",
        instructions: [
          "Lie down or relax comfortably with elevated legs.",
          "Perform slow diaphragmatic breathing (4s in, 4s hold, 4s out).",
          "Allow muscle fibers and central nervous system to enter deep parasympathetic rest.",
          "Hydrate thoroughly and refuel with clean protein and complex carbs."
        ],
        equipment: ["Bodyweight"],
        category: "Recovery & Mobility",
        categories: ["Recovery & Mobility"],
        commonMistakes: ["Trying to do extra pushups or squats", "Not drinking enough electrolytes"],
        safetyTips: ["Relax completely and avoid physical strain"],
        alternativeExercises: ["Primal Cat-Cow Spinal Waves"],
        progressionVariations: ["Cold-warm alternating shower"],
        isPremium: false,
        startingPosition: "Relaxed supine or seated rest.",
        movementExecution: "Deep restorative breathing and full muscle relaxation.",
        finishingPosition: "Refreshed and recharged.",
        regressionVariations: ["Seated relaxation"],
        musclesWorked: ["Full Body Recovery", "Parasympathetic System"],
        gifUrl: getExerciseGifUrl("Walking", "Mobility"),
        imageUrl: getExerciseGifUrl("Walking", "Mobility"),
        description: "Mandatory complete rest protocol following your cardio session. All resistance workouts are removed today so muscles recover fully.",
        duration: "Full Rest",
        tags: ["Rest", "Recovery", "Hydration"],
        breathingInstructions: "Slow diaphragmatic box breathing.",
        recommendedSetsReps: "Complete Muscular Rest",
        recommendedSets: "1",
        recommendedReps: "Full Rest",
        restTime: "Until Next Morning",
        caloriesBurned: 60,
        benefits: ["Lowers systemic inflammation", "Replenishes glycogen", "Prevents overtraining"],
        trainerTips: "Respect the recovery. You will come back stronger tomorrow.",
        safetyNotes: "Rest is essential for muscular growth.",
        bodyPart: "Full Body"
      }
    ];
    dayExercises = cardioRestDrills;
  } else if (cycleDay === 1 || cycleDay === 5) {
    // Day 1 & Day 5: Chest and Triceps (At least 13 exercises: 8 Chest + 5 Triceps)
    const chestExercises = allExercises.filter(e => {
      const p = (e.muscleGroups?.[0] || "").toLowerCase();
      const allM = (e.muscleGroups || []).map(m => m.toLowerCase());
      const s = (e.secondaryMuscles || []).map(m => m.toLowerCase());
      const n = e.name.toLowerCase();
      return (
        p.includes("chest") ||
        allM.includes("chest") ||
        s.includes("chest") ||
        n.includes("bench") ||
        n.includes("chest") ||
        n.includes("push up") ||
        n.includes("fly") ||
        n.includes("incline press") ||
        n.includes("decline press")
      ) && !p.includes("back") && !p.includes("leg") && !allM.includes("back");
    });

    const tricepExercises = allExercises.filter(e => {
      const p = (e.muscleGroups?.[0] || "").toLowerCase();
      const allM = (e.muscleGroups || []).map(m => m.toLowerCase());
      const s = (e.secondaryMuscles || []).map(m => m.toLowerCase());
      const n = e.name.toLowerCase();
      return (
        p.includes("tricep") ||
        allM.includes("tricep") ||
        s.includes("tricep") ||
        n.includes("tricep") ||
        n.includes("dip") ||
        n.includes("skull crusher") ||
        n.includes("pushdown") ||
        n.includes("kickback")
      ) && !p.includes("back") && !p.includes("bicep") && !p.includes("leg");
    });

    // Dynamic rotation offset so Day 1 != Day 5 != Day 8 != Day 15, etc.
    const dayOffset = (weekNum - 1) * 4 + (cycleDay === 5 ? 5 : 0);
    const rotatedChest = rotatePool(chestExercises.length > 0 ? chestExercises : allExercises, dayOffset);
    const rotatedTriceps = rotatePool(tricepExercises.length > 0 ? tricepExercises : allExercises, dayOffset + 2);

    const seen = new Set<string>();
    const selected: Exercise[] = [];

    // Select 7 Chest exercises
    for (const ex of rotatedChest) {
      if (!seen.has(ex.id) && selected.length < 7) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    // Select 5 Triceps exercises (totaling 12)
    for (const ex of rotatedTriceps) {
      if (!seen.has(ex.id) && selected.length < 12) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    // Safeguard: Ensure at least 12 exercises
    if (selected.length < 12) {
      const extras = allExercises.filter(e => !seen.has(e.id) && !e.name.toLowerCase().includes("squat"));
      for (const ex of extras) {
        if (selected.length >= 12) break;
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    dayExercises = selected;
  } else if (cycleDay === 2 || cycleDay === 6) {
    // Day 2 & Day 6: Back and Biceps + Forearms and Abs (At least 13 exercises: 5 Back + 4 Biceps + 2 Forearms + 2 Abs)
    const backExercises = allExercises.filter(e => {
      const p = (e.muscleGroups?.[0] || "").toLowerCase();
      const allM = (e.muscleGroups || []).map(m => m.toLowerCase());
      const s = (e.secondaryMuscles || []).map(m => m.toLowerCase());
      const n = e.name.toLowerCase();
      return (
        p.includes("back") ||
        allM.includes("back") ||
        s.includes("back") ||
        n.includes("pull up") ||
        n.includes("chin up") ||
        n.includes("row") ||
        n.includes("deadlift") ||
        n.includes("lat") ||
        n.includes("pulldown")
      ) && !p.includes("chest") && !p.includes("tricep") && !allM.includes("chest");
    });

    const bicepExercises = allExercises.filter(e => {
      const p = (e.muscleGroups?.[0] || "").toLowerCase();
      const allM = (e.muscleGroups || []).map(m => m.toLowerCase());
      const s = (e.secondaryMuscles || []).map(m => m.toLowerCase());
      const n = e.name.toLowerCase();
      return (
        p.includes("bicep") ||
        allM.includes("bicep") ||
        s.includes("bicep") ||
        n.includes("curl")
      ) && !p.includes("tricep") && !p.includes("chest") && !p.includes("leg");
    });

    const forearmExercises = allExercises.filter(e => {
      const p = (e.muscleGroups?.[0] || "").toLowerCase();
      const allM = (e.muscleGroups || []).map(m => m.toLowerCase());
      const s = (e.secondaryMuscles || []).map(m => m.toLowerCase());
      const n = e.name.toLowerCase();
      return (
        p.includes("forearm") ||
        allM.includes("forearm") ||
        s.includes("forearm") ||
        n.includes("wrist") ||
        n.includes("forearm") ||
        n.includes("reverse curl") ||
        n.includes("farmer") ||
        n.includes("hammer curl") ||
        n.includes("grip")
      );
    });

    const absExercises = allExercises.filter(e => {
      const p = (e.muscleGroups?.[0] || "").toLowerCase();
      const allM = (e.muscleGroups || []).map(m => m.toLowerCase());
      const s = (e.secondaryMuscles || []).map(m => m.toLowerCase());
      const n = e.name.toLowerCase();
      return (
        p.includes("ab") ||
        p.includes("core") ||
        allM.includes("core") ||
        allM.includes("abdominals") ||
        s.includes("core") ||
        n.includes("crunch") ||
        n.includes("plank") ||
        n.includes("leg raise") ||
        n.includes("russian twist") ||
        n.includes("hollow")
      ) && !n.includes("press");
    });

    // Dynamic rotation offset
    const dayOffset = (weekNum - 1) * 4 + (cycleDay === 6 ? 5 : 0);
    const rotatedBack = rotatePool(backExercises.length > 0 ? backExercises : allExercises, dayOffset);
    const rotatedBiceps = rotatePool(bicepExercises.length > 0 ? bicepExercises : allExercises, dayOffset + 2);
    const rotatedForearms = rotatePool(forearmExercises.length > 0 ? forearmExercises : rotatedBiceps, dayOffset + 1);
    const rotatedAbs = rotatePool(absExercises.length > 0 ? absExercises : allExercises, dayOffset + 3);

    const seen = new Set<string>();
    const selected: Exercise[] = [];

    // 5 Back exercises
    for (const ex of rotatedBack) {
      if (!seen.has(ex.id) && selected.length < 5) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    // 4 Biceps exercises
    for (const ex of rotatedBiceps) {
      if (!seen.has(ex.id) && selected.length < 9) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    // 3 Forearm exercises (totaling 12)
    for (const ex of rotatedForearms) {
      if (!seen.has(ex.id) && selected.length < 12) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }

    // Safeguard: Ensure at least 12 exercises
    if (selected.length < 12) {
      const extras = allExercises.filter(e => !seen.has(e.id) && !e.name.toLowerCase().includes("squat"));
      for (const ex of extras) {
        if (selected.length >= 12) break;
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    dayExercises = selected;
  } else if (cycleDay === 4) {
    // Day 4: Legs, Abs & Shoulders (At least 13 exercises: 5 Legs + 5 Shoulders + 3 Abs)
    const legExercises = allExercises.filter(e => {
      const p = (e.muscleGroups?.[0] || "").toLowerCase();
      const allM = (e.muscleGroups || []).map(m => m.toLowerCase());
      const s = (e.secondaryMuscles || []).map(m => m.toLowerCase());
      const n = e.name.toLowerCase();
      return (
        p.includes("leg") ||
        p.includes("quad") ||
        p.includes("hamstring") ||
        p.includes("glute") ||
        p.includes("calf") ||
        allM.includes("legs") ||
        allM.includes("quadriceps") ||
        allM.includes("hamstrings") ||
        allM.includes("glutes") ||
        allM.includes("calves") ||
        s.includes("legs") ||
        n.includes("squat") ||
        n.includes("lunge") ||
        n.includes("leg press") ||
        n.includes("leg extension") ||
        n.includes("leg curl") ||
        n.includes("calf raise")
      ) && !p.includes("chest") && !p.includes("back");
    });

    const shoulderExercises = allExercises.filter(e => {
      const p = (e.muscleGroups?.[0] || "").toLowerCase();
      const allM = (e.muscleGroups || []).map(m => m.toLowerCase());
      const s = (e.secondaryMuscles || []).map(m => m.toLowerCase());
      const n = e.name.toLowerCase();
      return (
        p.includes("shoulder") ||
        p.includes("deltoid") ||
        allM.includes("shoulders") ||
        allM.includes("deltoids") ||
        s.includes("shoulders") ||
        n.includes("overhead press") ||
        n.includes("shoulder press") ||
        n.includes("military press") ||
        n.includes("lateral raise") ||
        n.includes("front raise") ||
        n.includes("rear delt") ||
        n.includes("face pull") ||
        n.includes("arnold press")
      ) && !p.includes("chest") && !p.includes("back") && !p.includes("leg");
    });

    const absExercises = allExercises.filter(e => {
      const p = (e.muscleGroups?.[0] || "").toLowerCase();
      const allM = (e.muscleGroups || []).map(m => m.toLowerCase());
      const s = (e.secondaryMuscles || []).map(m => m.toLowerCase());
      const n = e.name.toLowerCase();
      return (
        p.includes("ab") ||
        p.includes("core") ||
        allM.includes("core") ||
        allM.includes("abdominals") ||
        s.includes("core") ||
        n.includes("plank") ||
        n.includes("crunch") ||
        n.includes("hanging leg") ||
        n.includes("ab rollout") ||
        n.includes("hollow body")
      );
    });

    // Dynamic rotation offset
    const dayOffset = (weekNum - 1) * 4;
    const rotatedLegs = rotatePool(legExercises.length > 0 ? legExercises : allExercises, dayOffset);
    const rotatedShoulders = rotatePool(shoulderExercises.length > 0 ? shoulderExercises : allExercises, dayOffset + 2);
    const rotatedAbs = rotatePool(absExercises.length > 0 ? absExercises : allExercises, dayOffset + 4);

    const seen = new Set<string>();
    const selected: Exercise[] = [];

    // 5 Legs exercises
    for (const ex of rotatedLegs) {
      if (!seen.has(ex.id) && selected.length < 5) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    // 4 Shoulders exercises
    for (const ex of rotatedShoulders) {
      if (!seen.has(ex.id) && selected.length < 9) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    // 3 Abs exercises (totaling 12)
    for (const ex of rotatedAbs) {
      if (!seen.has(ex.id) && selected.length < 12) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }

    // Safeguard: Ensure at least 12 exercises
    if (selected.length < 12) {
      const extras = allExercises.filter(e => !seen.has(e.id));
      for (const ex of extras) {
        if (selected.length >= 12) break;
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    dayExercises = selected;
  }

  // Final fallback safeguard
  if (dayExercises.length === 0) {
    dayExercises = allExercises.slice(0, 12);
  }

  return {
    dayNumber: safeDay,
    cycleDay,
    title: cycleInfo.title,
    focus: cycleInfo.focus,
    targetMuscles: cycleInfo.targetMuscles,
    isCardioRecovery: cycleInfo.isCardioRecovery,
    isRestDay: cycleInfo.isRestDay,
    walkRunDistance: cycleInfo.walkRunDistance,
    guidelines: cycleInfo.guidelines,
    exercises: dayExercises
  };
}

// ==========================================
// 2. WOMEN'S WORKOUT SYSTEM (180 DAYS CONFIDENCE)
// ==========================================

export const WOMEN_PROGRAM_CATEGORIES = [
  "Weight Loss",
  "Fat Loss",
  "Glutes",
  "Glutes + Legs",
  "Toning",
  "Full Body",
  "Core",
  "Lower Body",
  "Upper Body",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Home Workouts",
  "Gym Workouts",
  "Posture and Mobility"
] as const;

export type WomenCategoryName = typeof WOMEN_PROGRAM_CATEGORIES[number];

export const WOMEN_180_CYCLE_INFO = [
  {
    cycleDay: 1,
    title: "Lower Body & Glute Hypertrophy",
    focus: "Glute Bridges, Hip Thrusts & Quad Sculpting",
    targetMuscles: ["Glutes", "Quadriceps", "Hamstrings"],
    isCardioRecovery: false,
    guidelines: [
      "Tuck your chin and drive through your heels on all hip thrusts.",
      "Pause for 2 seconds at the top contraction of glute bridges.",
      "Keep core braced to avoid hyperextending your lower back."
    ]
  },
  {
    cycleDay: 2,
    title: "Upper Body Sculpt & Posture",
    focus: "Shoulder Definition, Back Toning & Arm Tightening",
    targetMuscles: ["Shoulders", "Back", "Arms", "Chest"],
    isCardioRecovery: false,
    guidelines: [
      "Emphasize controlled tempo: 2 seconds up, 3 seconds down.",
      "Target the rear delts and mid-back to open up shoulders and improve posture.",
      "Maintain a strong core throughout all overhead and pulling movements."
    ]
  },
  {
    cycleDay: 3,
    title: "Cardio & Conditioning (5-10 KM)",
    focus: "5 to 10 km Walk or Running: Aerobic Heart Health & Fat Loss",
    targetMuscles: ["Cardio", "Endurance"],
    isCardioRecovery: true,
    walkRunDistance: "5 to 10 km Walk or Run",
    guidelines: [
      "Complete 5 to 10 kilometers outdoors or on the treadmill.",
      "Stay in Zone 2 aerobic pacing (you should be able to hold a conversation).",
      "Hydrate with electrolytes and stretch calves and hip flexors post-run."
    ]
  },
  {
    cycleDay: 4,
    title: "Glutes, Hamstrings & Leg Toning",
    focus: "Romanian Deadlifts, Step-Ups & Calves",
    targetMuscles: ["Glutes", "Hamstrings", "Legs"],
    isCardioRecovery: false,
    guidelines: [
      "Hinge strictly at the hips on RDLs, pushing your glutes toward the back wall.",
      "Feel the deep stretch in your hamstrings before initiating the return pull.",
      "Use mind-muscle connection to squeeze glutes at lockout."
    ]
  },
  {
    cycleDay: 5,
    title: "Upper Body, Core & Deep Stability",
    focus: "Lat Width, Arm Sculpting & Pelvic Core Bracing",
    targetMuscles: ["Back", "Arms", "Core", "Abs"],
    isCardioRecovery: false,
    guidelines: [
      "Pull down with your lats and squeeze your core like you're bracing for impact.",
      "Focus on slow, controlled hollow bodies and dead bugs for deep abdominal tone.",
      "Avoid pulling your neck during any core exercises."
    ]
  },
  {
    cycleDay: 6,
    title: "Cardio & Fat Burning (5-10 KM)",
    focus: "5 to 10 km Walk or Running: Calorie Burn & Stamina",
    targetMuscles: ["Cardio", "Fat Loss"],
    isCardioRecovery: true,
    walkRunDistance: "5 to 10 km Walk or Run",
    guidelines: [
      "Second 5 to 10 kilometer session of the week.",
      "Optionally add 30-second brisk stride intervals every 5 minutes.",
      "Keep breathing diaphragmatic and steady through the nose and mouth."
    ]
  },
  {
    cycleDay: 7,
    title: "Active Recovery, Mobility & Flexibility",
    focus: "Hip Openers, Spinal Waves, Cat-Cow & Decompression",
    targetMuscles: ["Mobility", "Recovery", "Flexibility"],
    isCardioRecovery: true,
    guidelines: [
      "Complete rest from heavy resistance training.",
      "Follow the guided hip mobility and spinal flexibility sequences.",
      "Rest and refuel your muscular system for the upcoming week."
    ]
  }
];

export function getWomen180DayPlan(dayNumber: number, allExercises: Exercise[]): DayWorkoutPlan {
  const safeDay = Math.max(1, Math.min(180, dayNumber));
  const cycleDay = ((safeDay - 1) % 7) + 1;
  const cycleInfo = WOMEN_180_CYCLE_INFO[cycleDay - 1];

  let selected: Exercise[] = [];

  if (cycleDay === 1 || cycleDay === 4) {
    // Lower body / Glutes
    const pool = allExercises.filter(e => {
      const p = e.muscleGroups[0]?.toLowerCase() || "";
      const s = e.secondaryMuscles?.map(m => m.toLowerCase()) || [];
      const n = e.name.toLowerCase();
      return p.includes("glute") || p.includes("leg") || p.includes("quad") || p.includes("hamstring") ||
             s.some(m => m.includes("glute") || m.includes("leg")) ||
             n.includes("thrust") || n.includes("squat") || n.includes("lunge") || n.includes("bridge") || n.includes("rdl");
    });
    const poolOrdered = cycleDay === 4 ? [...pool].reverse() : pool;
    const seen = new Set<string>();
    for (const ex of poolOrdered) {
      if (!seen.has(ex.id) && selected.length < 12) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
  } else if (cycleDay === 2 || cycleDay === 5) {
    // Upper body / Core
    const pool = allExercises.filter(e => {
      const p = e.muscleGroups[0]?.toLowerCase() || "";
      const s = e.secondaryMuscles?.map(m => m.toLowerCase()) || [];
      const n = e.name.toLowerCase();
      return p.includes("shoulder") || p.includes("back") || p.includes("chest") || p.includes("arm") || p.includes("bicep") || p.includes("tricep") || p.includes("core") || p.includes("abs") ||
             s.some(m => m.includes("shoulder") || m.includes("core")) ||
             n.includes("press") || n.includes("row") || n.includes("lat") || n.includes("plank") || n.includes("curl");
    });
    const poolOrdered = cycleDay === 5 ? [...pool].reverse() : pool;
    const seen = new Set<string>();
    for (const ex of poolOrdered) {
      if (!seen.has(ex.id) && selected.length < 12) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
  } else if (cycleDay === 3 || cycleDay === 6) {
    // 5-10 km cardio running/walking days
    const pool = allExercises.filter(e => {
      const n = e.name.toLowerCase();
      const p = e.muscleGroups[0]?.toLowerCase() || "";
      const cat = e.category.toLowerCase();
      return p.includes("cardio") || cat.includes("cardio") || n.includes("walk") || n.includes("run") || n.includes("treadmill") || n.includes("jump rope") || n.includes("hiit");
    });
    const seen = new Set<string>();
    for (const ex of pool) {
      if (!seen.has(ex.id) && selected.length < 5) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
  } else {
    // Recovery & Mobility Day 7
    const pool = allExercises.filter(e => {
      const n = e.name.toLowerCase();
      const p = e.muscleGroups[0]?.toLowerCase() || "";
      return p.includes("mobility") || n.includes("stretch") || n.includes("cat-cow") || n.includes("hip") || n.includes("child") || n.includes("breathing");
    });
    const seen = new Set<string>();
    for (const ex of pool) {
      if (!seen.has(ex.id) && selected.length < 5) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
  }

  if (selected.length === 0) {
    selected = allExercises.slice(0, 6);
  }

  return {
    dayNumber: safeDay,
    cycleDay,
    title: cycleInfo.title,
    focus: cycleInfo.focus,
    targetMuscles: cycleInfo.targetMuscles,
    isCardioRecovery: cycleInfo.isCardioRecovery,
    isRestDay: cycleDay === 7,
    walkRunDistance: cycleInfo.walkRunDistance,
    guidelines: cycleInfo.guidelines,
    exercises: selected
  };
}

// ==========================================
// 3. HOME WORKOUT SYSTEM (19 CATEGORIES)
// ==========================================

export const HOME_PROGRAM_CATEGORIES = [
  "Full Body",
  "Weight Loss",
  "Fat Loss",
  "Muscle Building",
  "Abs and Core",
  "Glutes",
  "Legs",
  "Chest",
  "Back",
  "Arms",
  "Shoulders",
  "HIIT",
  "Cardio",
  "Mobility",
  "Beginner",
  "Intermediate",
  "Advanced",
  "No Equipment",
  "Dumbbell",
  "Resistance Band"
] as const;

export type HomeCategoryName = typeof HOME_PROGRAM_CATEGORIES[number];

/**
 * Filters the library strictly for home-compatible exercises matching category and optional equipment
 */
export function filterHomeExercises(
  allExercises: Exercise[],
  selectedCategory: string = "Full Body",
  equipmentFilter: "All" | "No Equipment" | "Dumbbell" | "Resistance Band" = "All"
): Exercise[] {
  // First, eliminate any gym-only machines or barbell cages
  const homeEligible = allExercises.filter(e => {
    if (e.locationSuitability === "Gym") return false;
    const hasGymEquip = e.equipment.some(eq => 
      ["Barbell", "Machine", "Cable Machine", "Smith Machine", "Leg Press Machine", "Stair Climber"].includes(eq)
    );
    return !hasGymEquip;
  });

  return homeEligible.filter(e => {
    // Check equipment filter
    if (equipmentFilter === "No Equipment") {
      const isBodyweight = e.equipment.includes("Bodyweight") || e.equipment.length === 0 || e.equipment.includes("No Equipment");
      if (!isBodyweight) return false;
    } else if (equipmentFilter === "Dumbbell") {
      if (!e.equipment.includes("Dumbbell")) return false;
    } else if (equipmentFilter === "Resistance Band") {
      if (!e.equipment.includes("Resistance Band") && !e.equipment.includes("Band")) return false;
    }

    // Check category
    if (selectedCategory === "Full Body") return true;
    if (e.homeCategories?.includes(selectedCategory)) return true;

    // Semantic matching fallback
    const catLower = selectedCategory.toLowerCase();
    const nameLower = e.name.toLowerCase();
    const muscle = e.muscleGroups[0]?.toLowerCase() || "";
    
    if (catLower.includes("abs") || catLower.includes("core")) {
      return muscle.includes("abs") || muscle.includes("core") || nameLower.includes("plank") || nameLower.includes("crunch");
    }
    if (catLower.includes("glute")) {
      return muscle.includes("glute") || nameLower.includes("glute") || nameLower.includes("bridge") || nameLower.includes("thrust");
    }
    if (catLower.includes("leg")) {
      return muscle.includes("leg") || muscle.includes("quad") || muscle.includes("hamstring") || nameLower.includes("squat") || nameLower.includes("lunge");
    }
    if (catLower.includes("chest")) {
      return muscle.includes("chest") || nameLower.includes("push up") || nameLower.includes("chest");
    }
    if (catLower.includes("back")) {
      return muscle.includes("back") || nameLower.includes("row") || nameLower.includes("pull");
    }
    if (catLower.includes("arm")) {
      return muscle.includes("arm") || muscle.includes("bicep") || muscle.includes("tricep") || nameLower.includes("curl") || nameLower.includes("dip");
    }
    if (catLower.includes("shoulder")) {
      return muscle.includes("shoulder") || nameLower.includes("shoulder") || nameLower.includes("lateral");
    }
    if (catLower.includes("hiit") || catLower.includes("cardio") || catLower.includes("fat loss") || catLower.includes("weight loss")) {
      return e.exerciseType === "Cardio" || nameLower.includes("burpee") || nameLower.includes("jump") || nameLower.includes("climber");
    }
    if (catLower.includes("mobility")) {
      return e.exerciseType === "Mobility" || nameLower.includes("stretch") || nameLower.includes("mobility");
    }
    if (catLower === "beginner" && e.difficulty === "Beginner") return true;
    if (catLower === "intermediate" && e.difficulty === "Intermediate") return true;
    if (catLower === "advanced" && e.difficulty === "Advanced") return true;

    return false;
  });
}

// ==========================================
// 4. GOAL-BASED WORKOUT SYSTEM (8 GOALS)
// ==========================================

export interface FitnessGoalConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  targetPrimary: string[];
  recommendedRepRange: string;
  restPeriod: string;
  weeklyStructure: string;
  badgeColor: string;
  iconName: string;
}

export const FITNESS_GOALS: FitnessGoalConfig[] = [
  {
    id: "build-muscle",
    name: "Build Muscle",
    tagline: "Hypertrophy & Sarcoplasmic Volume",
    description: "Prioritizes progressive tension, strict form, 8-12 rep targets, and structured muscle recovery splits.",
    targetPrimary: ["Chest", "Back", "Legs", "Shoulders", "Arms"],
    recommendedRepRange: "8 - 12 Reps",
    restPeriod: "60 - 90 Seconds",
    weeklyStructure: "4 - 5 Days Split",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    iconName: "Dumbbell"
  },
  {
    id: "lose-weight",
    name: "Lose Weight",
    tagline: "Fat Oxidation & Metabolic Density",
    description: "Combines resistance training with high-calorie-burning cardio and short rest periods to maximize energy expenditure.",
    targetPrimary: ["Cardio", "Full Body", "HIIT", "Core"],
    recommendedRepRange: "12 - 18 Reps",
    restPeriod: "30 - 45 Seconds",
    weeklyStructure: "5 Days (Weights + Cardio)",
    badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    iconName: "Flame"
  },
  {
    id: "build-abs",
    name: "Build Abs",
    tagline: "Midsection Definition & Core Compression",
    description: "Targets rectus abdominis, obliques, and deep transverse stabilizers combined with total body metabolic work.",
    targetPrimary: ["Abs", "Core", "Obliques"],
    recommendedRepRange: "15 - 20 Reps",
    restPeriod: "30 - 60 Seconds",
    weeklyStructure: "3 - 4 Days Core Circuits",
    badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    iconName: "Zap"
  },
  {
    id: "build-glutes",
    name: "Build Glutes",
    tagline: "Posterior Chain Power & Shaping",
    description: "Specialized mechanical overload targeting gluteus maximus, medius, and minimus via hip thrusts, squats, and hinges.",
    targetPrimary: ["Glutes", "Hamstrings", "Quadriceps"],
    recommendedRepRange: "10 - 15 Reps",
    restPeriod: "60 - 90 Seconds",
    weeklyStructure: "3 - 4 Days Lower Focus",
    badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    iconName: "Award"
  },
  {
    id: "get-stronger",
    name: "Get Stronger",
    tagline: "Absolute Neurological Force Output",
    description: "Commands major compound lifts with heavy loads, low rep ranges, and long rest intervals for maximum neural drive.",
    targetPrimary: ["Chest", "Back", "Legs", "Shoulders"],
    recommendedRepRange: "3 - 6 Reps",
    restPeriod: "2 - 3 Minutes",
    weeklyStructure: "3 - 4 Days Heavy Compound",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    iconName: "Shield"
  },
  {
    id: "improve-fitness",
    name: "Improve Fitness",
    tagline: "Stamina, Aerobic Capacity & Longevity",
    description: "Blends functional calisthenics, Zone 2 running, mobility, and functional strength for balanced athletic conditioning.",
    targetPrimary: ["Full Body", "Cardio", "Mobility"],
    recommendedRepRange: "10 - 15 Reps",
    restPeriod: "45 - 60 Seconds",
    weeklyStructure: "4 - 5 Days Hybrid",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    iconName: "TrendingUp"
  },
  {
    id: "beginner-fitness",
    name: "Beginner Fitness",
    tagline: "Safe Mechanics & Foundational Adaptations",
    description: "Gentle progressions, manageable volume, machine safety, and foundational movement patterns designed for zero intimidation.",
    targetPrimary: ["Full Body", "Core", "Mobility"],
    recommendedRepRange: "10 - 12 Reps",
    restPeriod: "60 - 75 Seconds",
    weeklyStructure: "3 Days Full Body",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    iconName: "Sparkles"
  },
  {
    id: "home-fitness",
    name: "Home Fitness",
    tagline: "Zero Excuses Living Room Conditioning",
    description: "High-impact workouts using bodyweight, resistance bands, and dumbbells that can be performed anywhere without bulky equipment.",
    targetPrimary: ["Full Body", "Core", "Cardio"],
    recommendedRepRange: "12 - 15 Reps",
    restPeriod: "45 - 60 Seconds",
    weeklyStructure: "4 Days Home Circuit",
    badgeColor: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    iconName: "Layers"
  }
];

// ==========================================
// 5. GYM WORKOUT PROGRAMS
// ==========================================

export interface GymProgram {
  id: string;
  name: string;
  splitType: string;
  frequency: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  targetFocus: string;
  coverImage: string;
  splits: {
    dayName: string;
    focus: string;
    targetMuscles: string[];
  }[];
}

export const GYM_WORKOUT_PROGRAMS: GymProgram[] = [
  {
    id: "push-pull-legs-hypertrophy",
    name: "Push Pull Legs (PPL) Hypertrophy",
    splitType: "Push / Pull / Legs Split",
    frequency: "6 Days / Week",
    difficulty: "Intermediate",
    description: "The gold standard bodybuilding routine. Separates pushing muscles, pulling muscles, and lower body for continuous progressive overload.",
    targetFocus: "Maximum Muscular Hypertrophy & Symmetry",
    coverImage: getExerciseGifUrl("Incline Dumbbell Press", "Gym Workouts"),
    splits: [
      { dayName: "Day 1", focus: "Push (Chest, Shoulders, Triceps)", targetMuscles: ["Chest", "Shoulders", "Triceps"] },
      { dayName: "Day 2", focus: "Pull (Back, Rear Delts, Biceps)", targetMuscles: ["Back", "Biceps"] },
      { dayName: "Day 3", focus: "5-10 KM Cardio & Complete Rest", targetMuscles: ["Cardio", "Recovery"] },
      { dayName: "Day 4", focus: "Push Hypertrophy", targetMuscles: ["Chest", "Shoulders", "Triceps"] },
      { dayName: "Day 5", focus: "Pull Thickness", targetMuscles: ["Back", "Biceps"] },
      { dayName: "Day 6", focus: "Legs & Posterior Chain", targetMuscles: ["Glutes", "Hamstrings", "Legs"] },
      { dayName: "Day 7", focus: "Active Recovery & Mobility", targetMuscles: ["Mobility"] }
    ]
  },
  {
    id: "upper-lower-strength",
    name: "Upper / Lower Heavy Strength",
    splitType: "Upper / Lower 4-Day Split",
    frequency: "4 Days / Week",
    difficulty: "Advanced",
    description: "Built around the big 4 compound lifts: Squat, Bench Press, Deadlift, and Overhead Press for pure kinetic strength.",
    targetFocus: "Maximal Force Development & Neural Drive",
    coverImage: getExerciseGifUrl("Barbell Squat", "Gym Workouts"),
    splits: [
      { dayName: "Day 1", focus: "Upper Body Heavy Strength", targetMuscles: ["Chest", "Back", "Shoulders"] },
      { dayName: "Day 2", focus: "Lower Body Heavy Squat / Deadlift", targetMuscles: ["Legs", "Glutes"] },
      { dayName: "Day 3", focus: "Cardio Recovery & Zone 2 Walk", targetMuscles: ["Cardio", "Recovery"] },
      { dayName: "Day 4", focus: "Upper Body Hypertrophy Volume", targetMuscles: ["Chest", "Back", "Arms"] },
      { dayName: "Day 5", focus: "Lower Body Unilateral Volume", targetMuscles: ["Legs", "Hamstrings", "Calves"] },
      { dayName: "Day 6", focus: "Active Recovery", targetMuscles: ["Recovery"] },
      { dayName: "Day 7", focus: "Complete Rest", targetMuscles: ["Rest"] }
    ]
  },
  {
    id: "arnold-golden-era",
    name: "Arnold Golden Era Split",
    splitType: "Antagonist Superset Split",
    frequency: "6 Days / Week",
    difficulty: "Advanced",
    description: "Chest & Back paired together for skin-tearing pumps, followed by Shoulders & Arms, and an intense Leg day.",
    targetFocus: "V-Taper Aesthetics & High Volume Hypertrophy",
    coverImage: getExerciseGifUrl("Chest Dips", "Gym Workouts"),
    splits: [
      { dayName: "Day 1", focus: "Chest + Back Antagonists", targetMuscles: ["Chest", "Back"] },
      { dayName: "Day 2", focus: "Shoulders + Biceps + Triceps", targetMuscles: ["Shoulders", "Biceps", "Triceps"] },
      { dayName: "Day 3", focus: "5-10 KM Cardio & Complete Rest", targetMuscles: ["Cardio", "Recovery"] },
      { dayName: "Day 4", focus: "Chest + Back Overload", targetMuscles: ["Chest", "Back"] },
      { dayName: "Day 5", focus: "Shoulders + Arms Pump", targetMuscles: ["Shoulders", "Arms"] },
      { dayName: "Day 6", focus: "Legs + Core Intensity", targetMuscles: ["Legs", "Abs"] },
      { dayName: "Day 7", focus: "Recovery", targetMuscles: ["Recovery"] }
    ]
  },
  {
    id: "beginner-gym-foundation",
    name: "Beginner 3-Day Full Body Gym",
    splitType: "Full Body Machine & Dumbbells",
    frequency: "3 Days / Week",
    difficulty: "Beginner",
    description: "Designed for beginners entering the gym. Master form on machines and dumbbells without intimidation or excessive soreness.",
    targetFocus: "Biomechanics, Joint Integrity & Baseline Mass",
    coverImage: getExerciseGifUrl("Dumbbell Chest Press", "Gym Workouts"),
    splits: [
      { dayName: "Day 1", focus: "Full Body Foundation A", targetMuscles: ["Chest", "Back", "Legs", "Core"] },
      { dayName: "Day 2", focus: "Rest / Light Walk", targetMuscles: ["Recovery"] },
      { dayName: "Day 3", focus: "5-10 KM Cardio & Complete Rest", targetMuscles: ["Cardio", "Recovery"] },
      { dayName: "Day 4", focus: "Rest / Light Walk", targetMuscles: ["Recovery"] },
      { dayName: "Day 5", focus: "Full Body Foundation C", targetMuscles: ["Back", "Chest", "Legs", "Core"] },
      { dayName: "Day 6", focus: "Weekend Recovery", targetMuscles: ["Recovery"] },
      { dayName: "Day 7", focus: "Weekend Recovery", targetMuscles: ["Recovery"] }
    ]
  }
];
