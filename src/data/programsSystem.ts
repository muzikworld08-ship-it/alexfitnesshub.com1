import { Exercise } from "./exercises";

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
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80",
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
    focus: "Horizontal & Incline Pressing + Tricep Lockouts",
    targetMuscles: ["Chest", "Triceps"],
    isCardioRecovery: false,
    isRestDay: false,
    guidelines: [
      "Warm up rotator cuffs with light arm circles and band pull-aparts.",
      "Start with compound pressing movements before moving to isolated flys and tricep pushdowns.",
      "Control the eccentric (negative) portion for 2-3 seconds on every rep."
    ]
  },
  {
    cycleDay: 2,
    title: "Back + Biceps",
    focus: "Vertical & Horizontal Pulling + Bicep Hypertrophy",
    targetMuscles: ["Back", "Biceps"],
    isCardioRecovery: false,
    isRestDay: false,
    guidelines: [
      "Initiate all pulls from your lats and scapula, not your hands or wrists.",
      "Keep your spine neutral on heavy deadlifts and barbell rows.",
      "Achieve full extension at the bottom of bicep curls without swinging your torso."
    ]
  },
  {
    cycleDay: 3,
    title: "5-10 KM Cardio & Complete Rest",
    focus: "5 to 10 KM Aerobic Run or Walk + Full Post-Cardio Muscular Rest",
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
    title: "Legs + Shoulders",
    focus: "Quad & Hamstring Overload + Deltoid Boulder Shaping",
    targetMuscles: ["Legs", "Shoulders", "Quadriceps", "Hamstrings", "Calves"],
    isCardioRecovery: false,
    isRestDay: false,
    guidelines: [
      "Prioritize depth and knee tracking over pure weight on leg movements.",
      "Keep elbows slightly in front of the body on overhead shoulder presses.",
      "Control lateral raises with thumbs slightly turned up to protect the impingement zone."
    ]
  },
  {
    cycleDay: 5,
    title: "Chest + Triceps + Forearms",
    focus: "Pectoral Volume + Tricep Deep Burn + Grip & Forearms",
    targetMuscles: ["Chest", "Triceps", "Forearms"],
    isCardioRecovery: false,
    isRestDay: false,
    guidelines: [
      "Utilize moderate load with high mind-muscle squeeze on chest movements.",
      "Focus on continuous mechanical tension on triceps extensions.",
      "Finish with forearm wrist curls or reverse curls to develop iron grip strength."
    ]
  },
  {
    cycleDay: 6,
    title: "Back + Biceps",
    focus: "Lat Width, Upper Back Thickness + Bicep Peak Overload",
    targetMuscles: ["Back", "Biceps"],
    isCardioRecovery: false,
    isRestDay: false,
    guidelines: [
      "Focus on driving your elbows back toward your hips on all rows.",
      "Squeeze your shoulder blades together tightly at peak contraction.",
      "Use varied grips (neutral, pronated, supinated) across bicep movements."
    ]
  },
  {
    cycleDay: 7,
    title: "Rest + Walking",
    focus: "5 to 10 KM Recovery Walk + Full Central Nervous Recovery",
    targetMuscles: ["Recovery", "Mobility"],
    isCardioRecovery: true,
    isRestDay: true,
    walkRunDistance: "5 to 10 km Recovery Walk",
    guidelines: [
      "Total active recovery day. No resistance or weightlifting permitted.",
      "A 5 to 10 kilometer brisk outdoor or treadmill walk is recommended to stimulate lymphatic flow.",
      "Prioritize nutrient-dense whole foods, 3-4 liters of water, and 8+ hours of quality sleep."
    ]
  }
];

/**
 * Returns the exact workout plan for any given day (Day 1 through Day 90)
 * of the 90 Days Immortal Challenge, using real exercises from the live library.
 */
export function getImmortalChallengeDayPlan(dayNumber: number, allExercises: Exercise[]): DayWorkoutPlan {
  const safeDay = Math.max(1, Math.min(90, dayNumber));
  const cycleDay = ((safeDay - 1) % 7) + 1; // 1, 2, 3, 4, 5, 6, 7
  const cycleInfo = IMMORTAL_7_DAY_CYCLE_INFO[cycleDay - 1];

  let dayExercises: Exercise[] = [];

  if (cycleDay === 1) {
    // Day 1: Chest + Triceps
    const chestExercises = allExercises.filter(e => {
      const p = e.muscleGroups[0]?.toLowerCase() || "";
      const s = e.secondaryMuscles?.map(m => m.toLowerCase()) || [];
      const n = e.name.toLowerCase();
      return (p.includes("chest") || s.some(m => m.includes("chest")) || n.includes("bench") || n.includes("chest") || n.includes("push up")) &&
             !p.includes("back") && !p.includes("leg");
    });

    const tricepExercises = allExercises.filter(e => {
      const p = e.muscleGroups[0]?.toLowerCase() || "";
      const s = e.secondaryMuscles?.map(m => m.toLowerCase()) || [];
      const n = e.name.toLowerCase();
      return (p.includes("tricep") || s.some(m => m.includes("tricep")) || n.includes("dip") || n.includes("skull crusher") || n.includes("pushdown")) &&
             !p.includes("back") && !p.includes("bicep");
    });

    // Select distinct, high-quality chest & tricep exercises without duplicates
    const seen = new Set<string>();
    const selected: Exercise[] = [];
    for (const ex of chestExercises) {
      if (!seen.has(ex.id) && selected.length < 5) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    for (const ex of tricepExercises) {
      if (!seen.has(ex.id) && selected.length < 8) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    dayExercises = selected;
  } else if (cycleDay === 2 || cycleDay === 6) {
    // Day 2 & Day 6: Back + Biceps
    const backExercises = allExercises.filter(e => {
      const p = e.muscleGroups[0]?.toLowerCase() || "";
      const s = e.secondaryMuscles?.map(m => m.toLowerCase()) || [];
      const n = e.name.toLowerCase();
      return (p.includes("back") || s.some(m => m.includes("back")) || n.includes("pull up") || n.includes("row") || n.includes("deadlift") || n.includes("lat")) &&
             !p.includes("chest") && !p.includes("tricep");
    });

    const bicepExercises = allExercises.filter(e => {
      const p = e.muscleGroups[0]?.toLowerCase() || "";
      const s = e.secondaryMuscles?.map(m => m.toLowerCase()) || [];
      const n = e.name.toLowerCase();
      return (p.includes("bicep") || s.some(m => m.includes("bicep")) || n.includes("curl")) &&
             !p.includes("tricep") && !p.includes("chest");
    });

    const seen = new Set<string>();
    const selected: Exercise[] = [];
    // If Day 6, offset slightly for balanced variety
    const backPool = cycleDay === 6 ? [...backExercises].reverse() : backExercises;
    const bicepPool = cycleDay === 6 ? [...bicepExercises].reverse() : bicepExercises;

    for (const ex of backPool) {
      if (!seen.has(ex.id) && selected.length < 5) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    for (const ex of bicepPool) {
      if (!seen.has(ex.id) && selected.length < 8) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    dayExercises = selected;
  } else if (cycleDay === 3) {
    // Day 3: Cardio & Complete Rest (5 to 10 km Walk or Run)
    // NO resistance or workout - they rest completely after the cardio
    const cardioRestDrills: Exercise[] = [
      {
        id: "5-10km-aerobic-run-walk",
        name: "5 to 10 KM Aerobic Run / Walk",
        muscleGroups: ["Cardio"],
        difficulty: "Beginner",
        instructions: [
          "Maintain a rhythmic, conversational aerobic pacing (Zone 2).",
          "Breathe steadily through your nose and diaphragm.",
          "Complete the 5 to 10 KM distance outdoors or on a treadmill.",
          "Once finished, discontinue all workouts and begin complete rest."
        ],
        equipment: ["Bodyweight"],
        category: "Cardio Workouts",
        categories: ["Cardio Workouts"],
        commonMistakes: ["Sprinting too fast and spiking cortisol", "Adding heavy weight training on cardio day"],
        safetyTips: ["Wear cushioned running shoes", "Hydrate with water and electrolytes"],
        alternativeExercises: ["12-3-30 Treadmill Walk"],
        progressionVariations: ["Increase distance toward 10 km", "Increase incline"],
        isPremium: false,
        startingPosition: "Upright athletic posture.",
        movementExecution: "Smooth aerobic strides.",
        finishingPosition: "Gradual cooldown walk.",
        regressionVariations: ["5 km power walk"],
        musclesWorked: ["Cardiovascular System", "Legs"],
        gifUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80",
        imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80",
        description: "Pure cardiovascular pacing engine. Build aerobic base and burn fat while sparing muscular joints.",
        duration: "45-60 min",
        tags: ["Cardio", "Zone 2", "Fat Burn"],
        breathingInstructions: "Rhythmic nasal and diaphragmatic breathing.",
        recommendedSetsReps: "5 to 10 KM Continuous Distance",
        recommendedSets: "1",
        recommendedReps: "5-10 KM",
        restTime: "Complete Rest Post-Cardio",
        caloriesBurned: 450,
        benefits: ["Maximizes fat oxidation", "Expands lung VO2 max", "Allows muscular recovery from lifting"],
        trainerTips: "No workout today. Just complete your cardio and rest!",
        safetyNotes: "Stay hydrated.",
        bodyPart: "Cardio"
      },
      {
        id: "post-cardio-complete-rest",
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
        regressionVariations: ["Seated meditation"],
        musclesWorked: ["Full Body Recovery", "Parasympathetic System"],
        gifUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80",
        description: "Mandatory complete rest protocol following your cardio session. No workout is performed today so muscles recover fully.",
        duration: "Full Rest",
        tags: ["Rest", "Recovery", "Hydration"],
        breathingInstructions: "Slow diaphragmatic box breathing.",
        recommendedSetsReps: "Complete Muscular Rest",
        recommendedSets: "1",
        recommendedReps: "Full Rest",
        restTime: "Until Next Morning",
        caloriesBurned: 50,
        benefits: ["Lowers systemic inflammation", "Replenishes glycogen", "Prevents overtraining"],
        trainerTips: "Respect the recovery. You will come back stronger tomorrow.",
        safetyNotes: "Rest is essential for muscular growth.",
        bodyPart: "Full Body"
      }
    ];

    dayExercises = cardioRestDrills;
  } else if (cycleDay === 4) {
    // Day 4: Legs + Shoulders
    const legExercises = allExercises.filter(e => {
      const p = e.muscleGroups[0]?.toLowerCase() || "";
      const s = e.secondaryMuscles?.map(m => m.toLowerCase()) || [];
      const n = e.name.toLowerCase();
      return (p.includes("leg") || p.includes("quad") || p.includes("hamstring") || p.includes("glute") || p.includes("calf") || n.includes("squat") || n.includes("lunge") || n.includes("leg press")) &&
             !p.includes("chest") && !p.includes("back");
    });

    const shoulderExercises = allExercises.filter(e => {
      const p = e.muscleGroups[0]?.toLowerCase() || "";
      const s = e.secondaryMuscles?.map(m => m.toLowerCase()) || [];
      const n = e.name.toLowerCase();
      return (p.includes("shoulder") || s.some(m => m.includes("shoulder")) || n.includes("overhead press") || n.includes("lateral raise") || n.includes("face pull") || n.includes("military")) &&
             !p.includes("chest") && !p.includes("back");
    });

    const seen = new Set<string>();
    const selected: Exercise[] = [];
    for (const ex of legExercises) {
      if (!seen.has(ex.id) && selected.length < 4) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    for (const ex of shoulderExercises) {
      if (!seen.has(ex.id) && selected.length < 8) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    dayExercises = selected;
  } else if (cycleDay === 5) {
    // Day 5: Chest + Triceps + Forearms
    const chestExercises = allExercises.filter(e => {
      const p = e.muscleGroups[0]?.toLowerCase() || "";
      const n = e.name.toLowerCase();
      return (p.includes("chest") || n.includes("press") || n.includes("fly") || n.includes("push up")) &&
             !p.includes("back") && !p.includes("leg");
    });

    const tricepExercises = allExercises.filter(e => {
      const p = e.muscleGroups[0]?.toLowerCase() || "";
      const n = e.name.toLowerCase();
      return (p.includes("tricep") || n.includes("dip") || n.includes("pushdown") || n.includes("skull crusher")) &&
             !p.includes("bicep");
    });

    const forearmExercises = allExercises.filter(e => {
      const p = e.muscleGroups[0]?.toLowerCase() || "";
      const s = e.secondaryMuscles?.map(m => m.toLowerCase()) || [];
      const n = e.name.toLowerCase();
      return p.includes("forearm") || s.some(m => m.includes("forearm")) || n.includes("wrist") || n.includes("reverse curl") || n.includes("farmer");
    });

    const seen = new Set<string>();
    const selected: Exercise[] = [];
    for (const ex of chestExercises) {
      if (!seen.has(ex.id) && selected.length < 3) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    for (const ex of tricepExercises) {
      if (!seen.has(ex.id) && selected.length < 6) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    for (const ex of (forearmExercises.length > 0 ? forearmExercises : allExercises.filter(e => e.name.toLowerCase().includes("curl")))) {
      if (!seen.has(ex.id) && selected.length < 8) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    dayExercises = selected;
  } else if (cycleDay === 7) {
    // Day 7: Rest + Walking (5 to 10 km Recovery Walk)
    const recoveryExercises = allExercises.filter(e => {
      const n = e.name.toLowerCase();
      const p = e.muscleGroups[0]?.toLowerCase() || "";
      return (p.includes("mobility") || n.includes("walk") || n.includes("stretch") || n.includes("cat-cow") || n.includes("hip stretch") || n.includes("breathing") || n.includes("foam")) &&
             !n.includes("press") && !n.includes("squat") && !n.includes("curl");
    });

    const seen = new Set<string>();
    const selected: Exercise[] = [];
    for (const ex of recoveryExercises) {
      if (!seen.has(ex.id) && selected.length < 5) {
        seen.add(ex.id);
        selected.push(ex);
      }
    }
    dayExercises = selected;
  }

  // Ensure every workout has at least 3-6 exercises from the library
  if (dayExercises.length === 0) {
    dayExercises = allExercises.slice(0, 6);
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
      if (!seen.has(ex.id) && selected.length < 7) {
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
      if (!seen.has(ex.id) && selected.length < 7) {
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
    coverImage: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80",
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
    coverImage: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80",
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
    coverImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
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
    coverImage: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80",
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
