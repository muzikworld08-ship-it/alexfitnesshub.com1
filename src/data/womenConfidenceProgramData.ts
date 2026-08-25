export interface WomenOnboardingProfile {
  age: number;
  height: number; // in cm
  currentWeight: number; // in kg
  targetWeight?: number; // in kg
  mainGoal: "lose_weight" | "burn_fat" | "build_muscle" | "tone_shape" | "maintain_weight" | "improve_fitness" | "build_curves" | "increase_strength" | "improve_health";
  focusAreas: string[]; // ["glutes", "legs", "core", "back", "shoulders", "arms", "posture", "full_body"]
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  workoutLocation: "home" | "gym" | "both";
  availableEquipment: string[]; // ["bodyweight", "bands", "dumbbells", "kettlebells", "barbell", "gym_machines"]
  trainingDaysPerWeek: number; // 3, 4, 5, 6
  preferredDuration: "20-30" | "30-45" | "45-60";
  previousExperience: "none" | "occasional" | "consistent" | "former_athlete";
  dailyActivityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active";
  dietaryPreference: "balanced" | "high_protein" | "plant_based" | "pescatarian" | "keto_low_carb" | "intermittent_fasting";
  sleepScheduleHours: number; // 6, 7, 8, 9
  currentWaterIntakeLiters: number;
  lifestyleRoutine: "desk_job" | "on_feet" | "busy_parent" | "shift_work" | "student";
  exerciseLimitations: string; // e.g. "knee stiffness", "lower back fatigue", "none"
  motivation: string;
  completedAt: string; // ISO date
}

export interface WomenDailyExercise {
  id: string;
  name: string;
  muscleGroups: string[];
  sets: number;
  reps: string; // e.g. "12-15 reps" or "45 sec"
  restPeriod: string; // e.g. "45s" or "60s"
  equipment: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructions: string[];
  formTips: string[];
  beginnerModification: string;
  advancedProgression: string;
  gifUrl: string;
  targetMuscles: string;
  tempo?: string;
  notes?: string;
}

export interface WomenDailyWorkout {
  dayNumber: number;
  phaseNumber: number;
  title: string;
  subtitle: string;
  focus: string;
  dayType: "strength" | "conditioning" | "mobility" | "walking" | "stretching" | "active_recovery" | "rest";
  estimatedMinutes: number;
  intensity: "Low" | "Moderate" | "Challenging" | "High";
  calorieEstimate: number;
  exercises: WomenDailyExercise[];
  coachingCue: string;
}

export interface WomenDailyLifestyle {
  dayNumber: number;
  stepTarget: number;
  waterTargetLiters: number;
  sleepTargetHours: number;
  mealGuidance: {
    focus: string;
    proteinTip: string;
    produceTip: string;
    sampleMealIdea: string;
  };
  healthyHabits: string[];
  morningRoutine: string;
  eveningRoutine: string;
  stressManagementTip: string;
  confidenceChallenge: {
    title: string;
    prompt: string;
    action: string;
  };
  journalPrompt: string;
}

export interface ProgramPhase {
  phaseNumber: number;
  startDay: number;
  endDay: number;
  title: string;
  tagline: string;
  description: string;
  primaryFocus: string;
  colorTheme: string;
  bannerImage: string;
}

export const PROGRAM_PHASES: ProgramPhase[] = [
  {
    phaseNumber: 1,
    startDay: 1,
    endDay: 30,
    title: "Foundation & Movement",
    tagline: "Awaken Your Kinetic Power & Build Unshakable Neuromuscular Consistency",
    description: "Phase 1 focuses on core stabilization, pelvic floor activation, joint mobility, posture correction, and mastering fundamental movement patterns with pristine mechanics.",
    primaryFocus: "Kinetic Alignment, Glute Activation & Habit Formation",
    colorTheme: "from-rose-500 via-pink-500 to-rose-600",
    bannerImage: "https://cdn.shopify.com/s/files/1/0503/6110/6616/files/athletes-doing-exercises-with-kettlebells_1024x1024.jpg?v=1629941573"
  },
  {
    phaseNumber: 2,
    startDay: 31,
    endDay: 60,
    title: "Strength & Fat Loss",
    tagline: "Ignite Metabolic Density, Sculpt Lean Muscle & Elevate Daily Vitality",
    description: "Phase 2 introduces progressive resistance loading and metabolic circuits to build lean, metabolic active muscle while supporting sustained whole-body fat oxidation.",
    primaryFocus: "Progressive Loading, Metabolic Tone & Posterior Chain Power",
    colorTheme: "from-fuchsia-600 via-pink-600 to-rose-500",
    bannerImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT1oxBXCFDr-HAd8_GRem87mgVwBjra6ay9NYAVcnBbeA9s_3fNDPWVDo&s=10"
  },
  {
    phaseNumber: 3,
    startDay: 61,
    endDay: 90,
    title: "Body Sculpting",
    tagline: "Define Your Athletic Curves, Taper the Midsection & Stand Tall",
    description: "Phase 3 emphasizes aesthetic shaping: glute hypertrophy, shoulder capping, back posture sculpting, and core tightening without exhausting burnout.",
    primaryFocus: "Hourglass Taper, Core Sculpting & Postural Elegance",
    colorTheme: "from-violet-600 via-pink-600 to-rose-500",
    bannerImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQR_wqJ2OvJTqTyffzsUIf2QwSAHxao_ZMkYQA5zBpYdDK8Xi9JW3U7FRF&s=10"
  },
  {
    phaseNumber: 4,
    startDay: 91,
    endDay: 120,
    title: "Strength, Shape & Conditioning",
    tagline: "Overcome Plateaus with High-Threshold Athletic Conditioning",
    description: "Phase 4 elevates training density with unilateral stability, supersets, and functional conditioning to elevate your cardiovascular stamina and lifting confidence.",
    primaryFocus: "Unilateral Balance, Power Density & Functional Stamina",
    colorTheme: "from-purple-600 via-rose-500 to-amber-500",
    bannerImage: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200&auto=format&fit=crop&q=80"
  },
  {
    phaseNumber: 5,
    startDay: 121,
    endDay: 150,
    title: "Advanced Sculpting",
    tagline: "Master Time-Under-Tension & Perfect Biomechanical Definition",
    description: "Phase 5 incorporates advanced eccentric tempos, isometric holds, and targeted metabolic waves to sculpt refined muscular definition and joint resilience.",
    primaryFocus: "Time-Under-Tension, Peak Glute-Ham Tie-In & Deep Abdominal Control",
    colorTheme: "from-pink-600 via-rose-600 to-amber-600",
    bannerImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW7GG57ik5pyyM9oxAwQmxWbLTJSHhhXYJrfgsBYmyd6ixwXnzlE3z3t4&s=10"
  },
  {
    phaseNumber: 6,
    startDay: 151,
    endDay: 180,
    title: "Confidence & Transformation",
    tagline: "Celebrate Your Unstoppable Self: 180 Days of Strength, Fitness & Confidence",
    description: "The crowning phase consolidating 6 months of devotion into a permanent lifestyle transformation. You emerge physically strong, mentally resilient, and radiantly confident.",
    primaryFocus: "Lifelong Mastery, Radiant Confidence & Sustainable Athleticism",
    colorTheme: "from-rose-600 via-amber-500 to-yellow-500",
    bannerImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6lg7QbEmeaktDsLgmzvRytUSD09Q7F52tHF6Vw4NP3J1vp8AeEpqkn6_E&s=10"
  }
];

export const MILESTONE_ACHIEVEMENTS = [
  {
    day: 7,
    id: "milestone_day_7",
    title: "First Commitment",
    badgeName: "Spark of Discipline",
    icon: "Flame",
    color: "text-amber-500 bg-amber-50 border-amber-200",
    description: "Completed your first 7 days of intentional movement, hydration, and confidence building."
  },
  {
    day: 30,
    id: "milestone_day_30",
    title: "Foundation Complete",
    badgeName: "Kinetic Architect",
    icon: "Shield",
    color: "text-rose-500 bg-rose-50 border-rose-200",
    description: "Mastered Phase 1 movement mechanics and established an unbreakable daily foundation."
  },
  {
    day: 60,
    id: "milestone_day_60",
    title: "Stronger You",
    badgeName: "Strength Pioneer",
    icon: "Award",
    color: "text-fuchsia-500 bg-fuchsia-50 border-fuchsia-200",
    description: "Noticeable strength gains, increased stamina, and metabolic conditioning in Phase 2."
  },
  {
    day: 90,
    id: "milestone_day_90",
    title: "Halfway Transformation",
    badgeName: "Hourglass Sculptor",
    icon: "Sparkles",
    color: "text-purple-500 bg-purple-50 border-purple-200",
    description: "Crossed the 90-day halfway threshold. Your body composition and posture have transformed."
  },
  {
    day: 120,
    id: "milestone_day_120",
    title: "Confidence Rising",
    badgeName: "Athletic Queen",
    icon: "Trophy",
    color: "text-indigo-500 bg-indigo-50 border-indigo-200",
    description: "Unilateral stability, mental resilience, and peak workout consistency achieved."
  },
  {
    day: 150,
    id: "milestone_day_150",
    title: "Almost There",
    badgeName: "Elite Resilience",
    icon: "Heart",
    color: "text-pink-500 bg-pink-50 border-pink-200",
    description: "Entering the final 30-day pinnacle. You are embodying the lifestyle effortlessly."
  },
  {
    day: 180,
    id: "milestone_day_180",
    title: "WOMEN CONFIDENCE COMPLETE",
    badgeName: "180-Day Legend",
    icon: "Crown",
    color: "text-yellow-500 bg-yellow-50 border-yellow-200",
    description: "180 Days to Become Stronger, Fitter and More Confident. You have fully transformed!"
  }
];

// Curated exercise catalog for women's strength, sculpting, and mobility
export const WOMEN_EXERCISE_CATALOG: Record<string, WomenDailyExercise> = {
  "glute_bridge": {
    id: "wc_glute_bridge",
    name: "Glute Bridge & Isometric Hold",
    muscleGroups: ["Gluteus Maximus", "Hamstrings", "Core"],
    targetMuscles: "Glutes & Lower Back Stability",
    sets: 3,
    reps: "15 reps (2s top squeeze)",
    restPeriod: "45s",
    equipment: "Bodyweight or Dumbbell",
    difficulty: "Beginner",
    instructions: [
      "Lie flat on your back with knees bent at 90 degrees and feet flat on the floor, hip-width apart.",
      "Drive through your heels to elevate your hips until your thighs and torso form a straight diagonal line.",
      "Squeeze your glutes forcefully at the apex for 2 full seconds without overarching your lower back.",
      "Slowly lower back down with control, stopping just before touching the floor."
    ],
    formTips: [
      "Keep your ribs drawn down and core braced to avoid hyperextending the lumbar spine.",
      "Ensure knees track directly in line with your toes throughout the lift."
    ],
    beginnerModification: "Perform on floor with bodyweight only, arms resting flat at your sides for balance.",
    advancedProgression: "Place a medium resistance band above knees or rest a 10-15kg dumbbell across hips.",
    gifUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80"
  },
  "goblet_squat": {
    id: "wc_goblet_squat",
    name: "Tempo Goblet Squat",
    muscleGroups: ["Quadriceps", "Glutes", "Adductors", "Upper Back"],
    targetMuscles: "Quads, Glute Shaping & Core",
    sets: 3,
    reps: "12-15 reps (3s descent)",
    restPeriod: "60s",
    equipment: "Dumbbell or Kettlebell",
    difficulty: "Beginner",
    instructions: [
      "Stand with feet slightly wider than shoulder-width, toes turned out 15-20 degrees.",
      "Hold a weight vertically against your chest with both hands under the top plate.",
      "Inhale, brace your core, and initiate the squat by sending your hips back and knees out.",
      "Descend smoothly over 3 seconds until thighs are parallel to the floor, then drive through mid-foot to stand."
    ],
    formTips: [
      "Keep your chest proud and elbows pointed down toward your knees.",
      "Avoid letting knees cave inward at the bottom transition."
    ],
    beginnerModification: "Perform bodyweight box squat onto a chair or bench to calibrate depth safely.",
    advancedProgression: "Add 1.5 rep pulses at the bottom or increase dumbbell load.",
    gifUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80"
  },
  "romanian_deadlift": {
    id: "wc_rdl",
    name: "Dumbbell Romanian Deadlift (RDL)",
    muscleGroups: ["Hamstrings", "Gluteus Maximus", "Erector Spinae", "Lats"],
    targetMuscles: "Hamstring-Glute Tie-in & Posture",
    sets: 3,
    reps: "12 reps",
    restPeriod: "60s",
    equipment: "Dumbbells or Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Hold dumbbells in front of thighs with a neutral grip, feet hip-width apart and knees softly unlocked.",
      "Hinge at your hips, pushing your glutes straight back toward the wall behind you.",
      "Keep the weights grazing down your shins, maintaining a neutral flat spine until feeling a deep hamstring stretch.",
      "Drive hips forward and squeeze glutes at the top to return to upright stance."
    ],
    formTips: [
      "Do not squat the weight down; motion comes purely from the hip hinge.",
      "Keep lats locked in by imagining squeezing oranges under your armpits."
    ],
    beginnerModification: "Perform with hands on hips against a wall, practicing the hip hinge touch before adding weight.",
    advancedProgression: "Switch to B-Stance (staggered foot) RDL to challenge single-leg stability.",
    gifUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80"
  },
  "bulgarian_split_squat": {
    id: "wc_bulgarian_split_squat",
    name: "Bulgarian Split Squat",
    muscleGroups: ["Gluteus Medius", "Gluteus Maximus", "Quadriceps"],
    targetMuscles: "Single Leg Glute Hypertrophy & Balance",
    sets: 3,
    reps: "10-12 reps per leg",
    restPeriod: "60s",
    equipment: "Bench / Chair & Dumbbells",
    difficulty: "Intermediate",
    instructions: [
      "Place top of your rear foot on a sturdy bench or chair 2-3 feet behind you.",
      "Take a comfortable stride forward with your working leg.",
      "Hinge slightly forward at hips (20 degrees) to maximize glute recruitment.",
      "Lower your back knee toward the floor until your front thigh is parallel, then drive up through front heel."
    ],
    formTips: [
      "Keep 85% of your weight distributed on the front working heel.",
      "Avoid letting the front knee shoot excessively past your toes."
    ],
    beginnerModification: "Perform static split squats with rear foot on the floor rather than elevated.",
    advancedProgression: "Hold dual dumbbells and add a 1-second pause at the bottom of each repetition.",
    gifUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
  },
  "lateral_band_walk": {
    id: "wc_band_walk",
    name: "Lateral Mini-Band Glute Walk",
    muscleGroups: ["Gluteus Medius", "Gluteus Minimus", "Tensor Fasciae Latae"],
    targetMuscles: "Side Glutes & Pelvic Alignment",
    sets: 3,
    reps: "15 steps each direction",
    restPeriod: "45s",
    equipment: "Mini Resistance Band",
    difficulty: "Beginner",
    instructions: [
      "Place mini-band around your ankles or just above your knees.",
      "Assume a quarter-squat athletic stance with chest up and knees tracking out.",
      "Step sideways with leading foot while maintaining constant tension on the band.",
      "Follow with trailing foot, never letting your feet touch together or lose band resistance."
    ],
    formTips: [
      "Keep toes pointed strictly forward or slightly pigeon-toed to isolate gluteus medius.",
      "Avoid bobbing up and down; stay locked at the same athletic height."
    ],
    beginnerModification: "Place band higher up above knees where leverage is easier to control.",
    advancedProgression: "Place band around the balls of your feet and increase step width.",
    gifUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80"
  },
  "single_arm_dumbbell_row": {
    id: "wc_single_arm_row",
    name: "Single-Arm Supported Row",
    muscleGroups: ["Latissimus Dorsi", "Rhomboids", "Biceps", "Posterior Deltoid"],
    targetMuscles: "Mid-Back Definition & Posture Correction",
    sets: 3,
    reps: "12 reps per side",
    restPeriod: "45s",
    equipment: "Dumbbell & Bench/Chair",
    difficulty: "Beginner",
    instructions: [
      "Place same-side knee and hand on a bench with back flat and parallel to the floor.",
      "Grip dumbbell with opposite hand, letting arm hang fully extended.",
      "Pull dumbbell up toward your hip crease, driving with your elbow and retracting your shoulder blade.",
      "Squeeze back muscles at the peak for 1 second, then lower under full control."
    ],
    formTips: [
      "Do not twist your torso or yank the weight with your bicep.",
      "Think of pulling your elbow toward your back pocket."
    ],
    beginnerModification: "Use a lighter dumbbell or resistance band anchored to a door frame.",
    advancedProgression: "Pause for 2 full seconds at peak contraction on each rep.",
    gifUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80"
  },
  "overhead_dumbbell_press": {
    id: "wc_overhead_press",
    name: "Standing Dumbbell Overhead Shoulder Press",
    muscleGroups: ["Anterior & Lateral Deltoids", "Triceps", "Core"],
    targetMuscles: "Shoulder Taper & Upper Body Posture",
    sets: 3,
    reps: "12 reps",
    restPeriod: "45s",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    instructions: [
      "Stand with feet shoulder-width apart, holding dumbbells at ear level with palms facing forward or semi-neutral.",
      "Brace core tightly, squeeze glutes, and press dumbbells overhead in a smooth arc.",
      "Lock out arms gently at the top without shrugging shoulders to ears.",
      "Lower under control over 2 seconds back to ear level."
    ],
    formTips: [
      "Avoid arching your lower back as you press overhead; keep ribs pinned down.",
      "Breathe out as you press, inhale as you lower."
    ],
    beginnerModification: "Perform seated on a sturdy chair with back support.",
    advancedProgression: "Perform alternating single-arm overhead presses to challenge anti-rotational core stability.",
    gifUrl: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop&q=80"
  },
  "dead_bug_core": {
    id: "wc_dead_bug",
    name: "Contralateral Dead Bug",
    muscleGroups: ["Transverse Abdominis", "Rectus Abdominis", "Hip Flexors"],
    targetMuscles: "Deep Core Tightening & Pelvic Control",
    sets: 3,
    reps: "10 reps per side (slow)",
    restPeriod: "30s",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Lie on back with arms extended toward ceiling and hips/knees bent at 90-degree tabletop.",
      "Flatten lower back firmly into the floor, eliminating any lumbar gap.",
      "Slowly extend right arm overhead while lowering left leg straight out until hovering inches off floor.",
      "Return to starting tabletop position using core tension, then repeat with opposite limbs."
    ],
    formTips: [
      "If your lower back arches off the floor at any moment, do not lower your leg as far.",
      "Move with deliberate 3-second tempo on each extension."
    ],
    beginnerModification: "Keep knees bent and tap heels to the floor instead of extending legs straight.",
    advancedProgression: "Hold a light dumbbell in each hand or press a stability ball between hands and knees.",
    gifUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80"
  },
  "side_plank_hip_dips": {
    id: "wc_side_plank",
    name: "Side Plank with Glute Abduction",
    muscleGroups: ["Internal & External Obliques", "Gluteus Medius", "Quadratus Lumborum"],
    targetMuscles: "Waistline Tightening & Lateral Hip Stability",
    sets: 3,
    reps: "10 reps per side",
    restPeriod: "30s",
    equipment: "Bodyweight / Mat",
    difficulty: "Intermediate",
    instructions: [
      "Lie on your side with forearm flat on floor, elbow directly under shoulder, and legs stacked.",
      "Lift hips off floor into a rigid side plank from head to ankles.",
      "Perform a controlled hip dip touching floor and lifting high, optionally elevating top leg slightly.",
      "Hold peak elevation for 1 second before lowering."
    ],
    formTips: [
      "Keep body in one straight line; avoid rotating chest toward floor.",
      "Press through your bottom forearm actively to keep neck long."
    ],
    beginnerModification: "Perform side plank from knees rather than feet for reduced leverage.",
    advancedProgression: "Hold a light dumbbell on top hip or add continuous top-leg abduction pulses.",
    gifUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
  },
  "face_pulls_or_band_pullaparts": {
    id: "wc_band_pullaparts",
    name: "Resistance Band Pull-Aparts & Posture Opener",
    muscleGroups: ["Rear Deltoids", "Rhomboids", "Mid Trapezius", "Rotator Cuff"],
    targetMuscles: "Upper Back, Shoulder Alignment & Neck Relief",
    sets: 3,
    reps: "15-20 reps",
    restPeriod: "30s",
    equipment: "Resistance Band",
    difficulty: "Beginner",
    instructions: [
      "Hold resistance band with arms straight out in front of chest at shoulder height, palms down.",
      "Pull band apart by pinching shoulder blades together until band touches chest.",
      "Hold squeeze for 1 second, focusing on muscles between your shoulder blades.",
      "Slowly return forward resisting the band snap."
    ],
    formTips: [
      "Keep shoulders depressed away from ears throughout.",
      "Do not shrug neck or arch lower back."
    ],
    beginnerModification: "Grip the band wider to decrease tension.",
    advancedProgression: "Double up the band or perform with 3-second isometric hold at chest.",
    gifUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80"
  },
  "barbell_hip_thrust": {
    id: "wc_hip_thrust",
    name: "Barbell Hip Thrust",
    muscleGroups: ["Gluteus Maximus", "Hamstrings", "Erector Spinae"],
    targetMuscles: "Glute Hypertrophy, Hip Power & Pelvic Stability",
    sets: 3,
    reps: "10-12 reps",
    restPeriod: "60s",
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Sit on the floor with your upper back supported against a sturdy bench and barbell resting across hips.",
      "Plant feet shoulder-width apart, knees bent at 90 degrees at the top of the movement.",
      "Drive through heels to extend hips toward the ceiling until thighs and torso form a straight horizontal line.",
      "Squeeze glutes forcefully at the top for 2 seconds before lowering under control."
    ],
    formTips: ["Keep chin tucked toward chest throughout.", "Do not hyperextend lumbar spine at top."],
    beginnerModification: "Use a dumbbell across hips or bodyweight before adding a barbell.",
    advancedProgression: "Add a 3-second pause at the peak contraction or use mini-band around knees.",
    gifUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80"
  },
  "cable_glute_kickback": {
    id: "wc_glute_kickback",
    name: "Cable Glute Kickbacks",
    muscleGroups: ["Gluteus Maximus", "Gluteus Medius", "Hamstrings"],
    targetMuscles: "Isolated Upper Glute Peak & Posterior Definition",
    sets: 3,
    reps: "12-15 reps per leg",
    restPeriod: "45s",
    equipment: "Cable Machine",
    difficulty: "Beginner",
    instructions: [
      "Attach ankle strap to low cable pulley and face the machine with slight forward hip hinge.",
      "Brace core and kick working leg straight back, contracting glute at peak.",
      "Hold for 1 count, then slowly return leg without swinging."
    ],
    formTips: ["Keep hips square to the machine; do not twist spine."],
    beginnerModification: "Perform on hands and knees with resistance band or bodyweight.",
    advancedProgression: "Add 2-second hold with pulse at peak extension.",
    gifUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80"
  },
  "sumo_squat": {
    id: "wc_sumo_squat",
    name: "Sumo Squat with Pulse",
    muscleGroups: ["Adductors", "Gluteus Maximus", "Quadriceps"],
    targetMuscles: "Inner Thigh Sculpting & Glute Under-Tie",
    sets: 3,
    reps: "12-15 reps",
    restPeriod: "45s",
    equipment: "Dumbbell",
    difficulty: "Beginner",
    instructions: [
      "Stand with feet wider than shoulder-width, toes turned outward at 45 degrees.",
      "Hold dumbbell vertically at chest or between legs.",
      "Lower hips into deep squat, perform one pulse at the bottom, then drive through heels to stand."
    ],
    formTips: ["Track knees directly in line with toes.", "Keep torso proud and tall."],
    beginnerModification: "Perform bodyweight sumo squat without pulse.",
    advancedProgression: "Add 1.5 rep technique (down, half up, down, all way up).",
    gifUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80"
  },
  "curtsy_lunge": {
    id: "wc_curtsy_lunge",
    name: "Curtsy Lunges",
    muscleGroups: ["Gluteus Medius", "Gluteus Minimus", "Quadriceps", "Adductors"],
    targetMuscles: "Outer Glute Curve & Lateral Hip Stability",
    sets: 3,
    reps: "10-12 reps per side",
    restPeriod: "45s",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    instructions: [
      "Stand tall, step one foot diagonally behind the opposite leg, bending both knees into a curtsy.",
      "Lower until front thigh is parallel to the ground.",
      "Push through the front heel to return to starting position."
    ],
    formTips: ["Keep front knee aligned over front ankle.", "Keep chest upright and square."],
    beginnerModification: "Perform bodyweight curtsy step without deep knee drop.",
    advancedProgression: "Hold dumbbells at sides and add a balance lift at top.",
    gifUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80"
  },
  "step_ups": {
    id: "wc_step_ups",
    name: "Step Ups with Knee Drive",
    muscleGroups: ["Gluteus Maximus", "Quadriceps", "Calves", "Core"],
    targetMuscles: "Unilateral Lower Body Balance & Glute Power",
    sets: 3,
    reps: "12 reps per leg",
    restPeriod: "45s",
    equipment: "Bench",
    difficulty: "Beginner",
    instructions: [
      "Place one foot firmly on a stable bench or box.",
      "Drive through the heel to stand up, bringing trailing knee up to hip height.",
      "Lower back down slowly with full control."
    ],
    formTips: ["Do not bounce off bottom foot; let the elevated leg do the work."],
    beginnerModification: "Use a lower platform (8-10 inches).",
    advancedProgression: "Hold moderate dumbbells at sides.",
    gifUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80"
  },
  "incline_chest_press": {
    id: "wc_incline_chest_press",
    name: "Incline Dumbbell Chest Press",
    muscleGroups: ["Upper Pectoralis", "Anterior Deltoids", "Triceps"],
    targetMuscles: "Upper Chest Lift, Clavicle Definition & Push Strength",
    sets: 3,
    reps: "10-12 reps",
    restPeriod: "45s",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    instructions: [
      "Set bench to a 30-45 degree incline and sit back with dumbbells at shoulder height.",
      "Press weights upward and slightly inward, exhaling as arms extend.",
      "Lower smoothly until elbows reach 90 degrees."
    ],
    formTips: ["Keep shoulder blades retracted and pinched into bench."],
    beginnerModification: "Perform incline push-ups against a bench or countertop.",
    advancedProgression: "Use 3-second eccentric tempo on the lowering phase.",
    gifUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80"
  },
  "lat_pulldown": {
    id: "wc_lat_pulldown",
    name: "Lat Pulldown to Sternum",
    muscleGroups: ["Latissimus Dorsi", "Rhomboids", "Biceps", "Posterior Deltoids"],
    targetMuscles: "V-Taper Silhouette, Waist Narrowing Illusion & Posture",
    sets: 3,
    reps: "12 reps",
    restPeriod: "45s",
    equipment: "Cable Machine",
    difficulty: "Beginner",
    instructions: [
      "Sit at lat pulldown station with thighs secured under pads.",
      "Grasp bar with wide overhand grip, lean back slightly (10-15 degrees).",
      "Pull bar down toward upper chest by leading with elbows and retracting scapulae.",
      "Control the bar back up to full overhead stretch."
    ],
    formTips: ["Avoid momentum or aggressive swinging."],
    beginnerModification: "Use resistance band anchored overhead or assisted pulldown.",
    advancedProgression: "Hold contraction at clavicle for 2 full seconds.",
    gifUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80"
  },
  "lateral_raises": {
    id: "wc_lateral_raise",
    name: "Dumbbell Lateral Raises",
    muscleGroups: ["Lateral Deltoids", "Trapezius"],
    targetMuscles: "Shoulder Rounding, Hourglass Symmetry & Arm Tone",
    sets: 3,
    reps: "12-15 reps",
    restPeriod: "30s",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    instructions: [
      "Stand tall with light dumbbells at sides, slight bend in elbows.",
      "Raise arms out to sides until parallel to floor, leading with elbows.",
      "Lower under control back to sides."
    ],
    formTips: ["Do not shrug neck or swing upper body."],
    beginnerModification: "Use resistance band or lighter dumbbells.",
    advancedProgression: "Add 1-second pause at top of each repetition.",
    gifUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80"
  },
  "tricep_extension": {
    id: "wc_tricep_extension",
    name: "Overhead Triceps Rope Extension",
    muscleGroups: ["Triceps Brachii"],
    targetMuscles: "Back of Arm Tightening & Toned Elbow Extension",
    sets: 3,
    reps: "12-15 reps",
    restPeriod: "30s",
    equipment: "Cable Machine",
    difficulty: "Beginner",
    instructions: [
      "Face away from high cable with rope attachment held behind head.",
      "Extend arms forward and overhead, separating rope ends at full lockout.",
      "Bend elbows slowly to return rope behind head."
    ],
    formTips: ["Keep elbows tucked close to ears; do not let them flare wide."],
    beginnerModification: "Perform overhead dumbbell extension seated or bench dips.",
    advancedProgression: "Add 2-second hold with peak elbow extension.",
    gifUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"
  },
  "hammer_curls": {
    id: "wc_hammer_curl",
    name: "Dumbbell Hammer Curls",
    muscleGroups: ["Biceps Brachii", "Brachialis", "Forearms"],
    targetMuscles: "Arm Definition, Grip Strength & Functional Pulling",
    sets: 3,
    reps: "12 reps",
    restPeriod: "30s",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    instructions: [
      "Stand with dumbbells hanging at sides, palms facing each other (neutral grip).",
      "Curl weights upward toward shoulders while keeping elbows pinned to sides.",
      "Lower under control to full extension."
    ],
    formTips: ["Keep core braced and wrists neutral."],
    beginnerModification: "Perform alternating arms instead of simultaneous.",
    advancedProgression: "Add 3-second eccentric lowering phase.",
    gifUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"
  },
  "bird_dog": {
    id: "wc_bird_dog",
    name: "Bird Dog Stability Hold",
    muscleGroups: ["Erector Spinae", "Gluteus Maximus", "Transverse Abdominis", "Deltoids"],
    targetMuscles: "Spinal Column Health, Pelvic Anti-Rotation & Balance",
    sets: 3,
    reps: "10 reps per side",
    restPeriod: "30s",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Start on all fours with hands under shoulders and knees under hips.",
      "Simultaneously reach right arm forward and left leg straight back until parallel to floor.",
      "Hold for 2 seconds, drawing navel into spine.",
      "Return with control and repeat on opposite side."
    ],
    formTips: ["Do not let hips tilt or lower back sag."],
    beginnerModification: "Extend only the leg or only the arm until stability improves.",
    advancedProgression: "Add light ankle/wrist weights or draw elbow to knee between reps.",
    gifUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
  },
  "plank_dips": {
    id: "wc_plank_dips",
    name: "Plank Hip Dips",
    muscleGroups: ["Obliques", "Transverse Abdominis", "Shoulders"],
    targetMuscles: "Waist Tapering, Oblique Strength & Core Endurance",
    sets: 3,
    reps: "16 total dips",
    restPeriod: "30s",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    instructions: [
      "Start in a forearm plank position with core engaged.",
      "Rotate hips to tap right hip gently to the floor, return to center, then tap left hip.",
      "Continue alternating fluidly while keeping shoulders stable."
    ],
    formTips: ["Keep movement controlled; avoid dropping hips rapidly."],
    beginnerModification: "Perform standard forearm plank holds.",
    advancedProgression: "Add a 1-second pause at each side tap.",
    gifUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
  },
  "bicycle_crunches": {
    id: "wc_bicycle_crunch",
    name: "Bicycle Crunches",
    muscleGroups: ["Rectus Abdominis", "Obliques", "Hip Flexors"],
    targetMuscles: "Dynamic Core Rotational Strength & Abdominal Definition",
    sets: 3,
    reps: "20 total reps",
    restPeriod: "30s",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Lie on back with fingertips behind head and legs lifted at 90 degrees.",
      "Rotate torso to bring right elbow toward left knee while extending right leg straight.",
      "Switch sides in a smooth bicycling motion, keeping shoulder blades lifted."
    ],
    formTips: ["Rotate from the ribcage, not by pulling on the neck."],
    beginnerModification: "Keep feet on floor and lift one knee at a time.",
    advancedProgression: "Slow down the tempo with a 2-second hold on each rotation.",
    gifUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
  },
  "stomach_vacuum": {
    id: "wc_stomach_vacuum",
    name: "Stomach Vacuum & Core Bracing",
    muscleGroups: ["Transverse Abdominis", "Pelvic Floor", "Diaphragm"],
    targetMuscles: "Deep Internal Core Tightening & Waist Slimming Support",
    sets: 3,
    reps: "5 holds of 15-20s",
    restPeriod: "30s",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Stand tall or lean hands on knees. Exhale all air out of lungs completely.",
      "Without inhaling, pull navel in toward spine as far as possible (as if zipping up tight pants).",
      "Hold isometric vacuum contraction for 15-20 seconds while taking shallow sips of air if needed.",
      "Release slowly and take 2 normal recovery breaths before next set."
    ],
    formTips: ["Perform on empty stomach or before meals for best mind-muscle feedback."],
    beginnerModification: "Perform lying on back with knees bent.",
    advancedProgression: "Hold for 30 seconds while standing tall.",
    gifUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
  }
};

// Generates a fully personalized daily workout for any day from 1 to 180
export function getDailyWorkoutForDay(
  dayNumber: number,
  profile?: WomenOnboardingProfile | null
): WomenDailyWorkout {
  const phase = PROGRAM_PHASES.find(p => dayNumber >= p.startDay && dayNumber <= p.endDay) || PROGRAM_PHASES[0];
  const phaseNum = phase.phaseNumber;
  const dayInWeek = ((dayNumber - 1) % 7) + 1; // 1 to 7

  const daysPerWeek = profile?.trainingDaysPerWeek || 5;
  const location = profile?.workoutLocation || "home";
  const level = profile?.fitnessLevel || "intermediate";
  const duration = profile?.preferredDuration || "30-45";
  const focusAreas = profile?.focusAreas || ["glutes", "core", "posture"];

  let dayType: WomenDailyWorkout["dayType"] = "strength";
  let title = `Day ${dayNumber}: `;
  let subtitle = "";
  let focus = "";
  let intensity: WomenDailyWorkout["intensity"] = "Moderate";
  let estimatedMinutes = duration === "20-30" ? 25 : duration === "45-60" ? 50 : 38;

  let dayExerciseTemplates: (keyof typeof WOMEN_EXERCISE_CATALOG)[] = [];

  if (dayInWeek === 1) {
    dayType = "strength";
    title += "Glute & Posterior Chain Kinetic Awakening";
    subtitle = "Activate dormant glute motor units, reinforce hip power and pelvic alignment.";
    focus = "Glutes, Hamstrings & Hip Stability";
    intensity = phaseNum >= 4 ? "Challenging" : "Moderate";
    dayExerciseTemplates = [
      "glute_bridge",
      "barbell_hip_thrust",
      "romanian_deadlift",
      "cable_glute_kickback",
      "lateral_band_walk",
      "sumo_squat",
      "dead_bug_core",
      "stomach_vacuum",
      "side_plank_hip_dips",
      "face_pulls_or_band_pullaparts"
    ];
  } else if (dayInWeek === 2) {
    dayType = "strength";
    title += "Upper Body Posture, Sculpt & Deep Core";
    subtitle = "Open chest posture, reinforce spinal alignment, and tighten transverse abdominals.";
    focus = "Shoulders, Upper Back & Deep Core";
    intensity = "Moderate";
    dayExerciseTemplates = [
      "face_pulls_or_band_pullaparts",
      "single_arm_dumbbell_row",
      "overhead_dumbbell_press",
      "incline_chest_press",
      "lat_pulldown",
      "lateral_raises",
      "tricep_extension",
      "hammer_curls",
      "bird_dog",
      "plank_dips"
    ];
  } else if (dayInWeek === 3) {
    dayType = daysPerWeek >= 4 ? "conditioning" : "active_recovery";
    title += "Low-Impact Fat Burn & Kinetic Core Flow";
    subtitle = "Elevate metabolic heart rate without joint impact or systemic cortisol spikes.";
    focus = "Cardiovascular Conditioning & Core Tightening";
    intensity = "Moderate";
    dayExerciseTemplates = [
      "goblet_squat",
      "sumo_squat",
      "step_ups",
      "curtsy_lunge",
      "dead_bug_core",
      "bicycle_crunches",
      "plank_dips",
      "stomach_vacuum",
      "lateral_band_walk",
      "face_pulls_or_band_pullaparts"
    ];
  } else if (dayInWeek === 4) {
    dayType = "strength";
    title += "Lower Body Shape & Hamstring-Glute Tie-In";
    subtitle = "Sculpt lean quadriceps, build hamstrings, and shape the side glute curve.";
    focus = "Quads, Adductors, Gluteus Medius & Balance";
    intensity = phaseNum >= 3 ? "Challenging" : "Moderate";
    dayExerciseTemplates = [
      "bulgarian_split_squat",
      "goblet_squat",
      "romanian_deadlift",
      "barbell_hip_thrust",
      "curtsy_lunge",
      "step_ups",
      "side_plank_hip_dips",
      "bird_dog",
      "stomach_vacuum",
      "face_pulls_or_band_pullaparts"
    ];
  } else if (dayInWeek === 5) {
    dayType = daysPerWeek >= 5 ? "strength" : "walking";
    title += "Total Body Athletic Tone & Metabolic Density";
    subtitle = "Full-body compound synergy pairing upper pulls with lower drives.";
    focus = "Full Body Synergy & Caloric Oxidation";
    intensity = "Challenging";
    dayExerciseTemplates = [
      "barbell_hip_thrust",
      "incline_chest_press",
      "single_arm_dumbbell_row",
      "bulgarian_split_squat",
      "overhead_dumbbell_press",
      "lat_pulldown",
      "lateral_band_walk",
      "bicycle_crunches",
      "bird_dog",
      "stomach_vacuum"
    ];
  } else if (dayInWeek === 6) {
    dayType = "mobility";
    title += "Restorative Hip Mobility & Posture Opening";
    subtitle = "Decompress lumbar spine, open tight hip flexors, and release neck tension.";
    focus = "Hip Flexor Length, Thoracic Mobility & Recovery";
    intensity = "Low";
    estimatedMinutes = 20;
    dayExerciseTemplates = [
      "face_pulls_or_band_pullaparts",
      "bird_dog",
      "dead_bug_core",
      "stomach_vacuum",
      "glute_bridge",
      "lateral_band_walk",
      "side_plank_hip_dips",
      "sumo_squat"
    ];
  } else {
    dayType = "rest";
    title += "Restorative Recovery & Weekly Mindset Calibration";
    subtitle = "Honor your body with full cellular rest, deep sleep, and mindful hydration.";
    focus = "Systemic Recovery, Nervous System Reset & Reflection";
    intensity = "Low";
    estimatedMinutes = 15;
    dayExerciseTemplates = [
      "dead_bug_core",
      "bird_dog",
      "stomach_vacuum",
      "face_pulls_or_band_pullaparts"
    ];
  }

  // Construct curated exercises from catalog
  const baseExercises: WomenDailyExercise[] = dayExerciseTemplates.map((templateKey, idx) => {
    const raw = WOMEN_EXERCISE_CATALOG[templateKey] || WOMEN_EXERCISE_CATALOG.glute_bridge;
    return {
      ...raw,
      id: `wc_d${dayNumber}_ex${idx + 1}`
    };
  });

  // Adjust sets and reps based on Phase progression
  const scaledExercises = baseExercises.map((ex, index) => {
    let sets = ex.sets;
    let reps = ex.reps;
    let rest = ex.restPeriod;

    if (phaseNum === 1) {
      sets = 3;
      rest = "45-60s";
    } else if (phaseNum === 2) {
      sets = level === "advanced" ? 4 : 3;
      reps = "12-15 reps (progressive weight)";
    } else if (phaseNum === 3) {
      sets = 3;
      reps = "15 reps + 3s peak contraction";
    } else if (phaseNum === 4) {
      sets = 4;
      rest = "45s (higher density)";
    } else if (phaseNum === 5) {
      sets = 4;
      reps = "12-15 reps (4-second eccentric tempo)";
    } else if (phaseNum === 6) {
      sets = 4;
      reps = "15 reps (peak athletic output)";
    }

    return {
      ...ex,
      sets,
      reps,
      restPeriod: rest
    };
  });

  const coachingCues = [
    "Focus on mind-muscle connection over heavy ego lifting. Feel the glute and back muscles fire with every centimeter of motion.",
    "Breathe rhythmically. Inhale into your ribcage during the lowering phase, exhale firmly through pursed lips on exertion.",
    "Keep your shoulders depressed and shoulder blades pinned down. You are building confident, elegant posture from within.",
    "Form is your foundation. Never rush a repetition; treat each rep as an individual display of strength and grace.",
    "Hydrate between sets with steady sips. Your muscles are composed of 75% water—keep them primed for optimal kinetic output."
  ];

  const coachingCue = coachingCues[(dayNumber - 1) % coachingCues.length];

  return {
    dayNumber,
    phaseNumber: phaseNum,
    title,
    subtitle,
    focus,
    dayType,
    estimatedMinutes,
    intensity,
    calorieEstimate: dayType === "rest" ? 60 : dayType === "mobility" ? 110 : estimatedMinutes * 6.5,
    exercises: dayType === "rest" ? scaledExercises.slice(0, 3) : scaledExercises.slice(0, duration === "20-30" ? 8 : 10),
    coachingCue
  };
}

// Generates personalized daily lifestyle, hydration, nutrition, and confidence plan
export function getDailyLifestyleForDay(
  dayNumber: number,
  profile?: WomenOnboardingProfile | null
): WomenDailyLifestyle {
  const phase = PROGRAM_PHASES.find(p => dayNumber >= p.startDay && dayNumber <= p.endDay) || PROGRAM_PHASES[0];
  
  const baseWeight = profile?.currentWeight || 65;
  const calculatedWater = Math.max(2.5, Number(((baseWeight * 0.035) + 0.5).toFixed(1)));
  const calculatedSteps = profile?.dailyActivityLevel === "sedentary" ? 8000 : 10000;

  const confidenceChallenges = [
    {
      title: "Posture of Radiance",
      prompt: "Throughout today, notice whenever your shoulders slump or chin drifts toward your phone. Roll your shoulders back, lift your sternum, and take up your rightful space.",
      action: "Perform 3 posture resets today and notice how instantly your mental confidence shifts."
    },
    {
      title: "Speak with Unapologetic Clarity",
      prompt: "In your conversations today, eliminate unnecessary minimizing phrases like 'I'm just asking' or 'Sorry to bother you'. Speak with calm, assured certainty.",
      action: "Express at least one opinion or request clearly without over-apologizing."
    },
    {
      title: "Celebrate Non-Scale Strength",
      prompt: "Shift your focus from numbers on a scale to the miraculous capability of your body: your lifting strength, walking stamina, restful sleep, and vibrant energy.",
      action: "Write down 3 things your body achieved this week that make you feel genuinely proud."
    },
    {
      title: "Gentle Boundary Setting",
      prompt: "Protect your personal energy and training time. Saying 'no' to non-essential drains is saying 'yes' to your long-term health and self-respect.",
      action: "Say a polite, firm 'no' to one request that compromises your rest or wellness today."
    },
    {
      title: "Mirror Affirmation of Gratitude",
      prompt: "Look into your own eyes in the mirror today. Instead of auditing perceived flaws, look at yourself with warmth, respect, and deep appreciation for your journey.",
      action: "Spend 30 seconds smiling in the mirror and thanking yourself for showing up consistently."
    },
    {
      title: "Mindful Savoring & Nourishment",
      prompt: "Eat at least one meal today without screens or rushing. Savor the flavors, chew mindfully, and honor your food as fuel for your strength and vitality.",
      action: "Enjoy a 15-minute phone-free meal focusing purely on nourishing your body."
    },
    {
      title: "Unshakable Self-Compassion",
      prompt: "Perfection is a myth; consistency is queen. If anything deviates from your ideal routine today, embrace it with compassion and immediately reset.",
      action: "Replace any self-critical thought today with: 'I am learning, I am growing, and I am stronger every day.'"
    }
  ];

  const challenge = confidenceChallenges[(dayNumber - 1) % confidenceChallenges.length];

  const mealGuidances = [
    {
      focus: "Lean Protein Foundation for Muscle Tone",
      proteinTip: "Aim for 25-30g of high-quality protein per meal (grilled chicken, eggs, tofu, Greek yogurt, or fish) to support muscle recovery and steady satiety.",
      produceTip: "Fill half your plate with vibrant green vegetables (spinach, broccoli, zucchini, asparagus) rich in micronutrients and fiber.",
      sampleMealIdea: "Herb-baked salmon or grilled tofu with roasted sweet potato wedges and steamed garlic asparagus."
    },
    {
      focus: "Complex Carbohydrates & Sustainable Energy",
      proteinTip: "Incorporate collagen peptides or plant protein into your morning smoothie or oatmeal for joint and skin elasticity.",
      produceTip: "Add antioxidant-rich berries (blueberries, raspberries) to fight exercise-induced inflammation.",
      sampleMealIdea: "Quinoa grain bowl with grilled chicken breast or edamame, sliced avocado, cherry tomatoes, and lemon tahini dressing."
    },
    {
      focus: "Healthy Fats & Hormone Balance",
      proteinTip: "Pair plant-based proteins with healthy fats like extra virgin olive oil, walnuts, or chia seeds for cellular membrane health.",
      produceTip: "Eat the rainbow: include carrots, purple cabbage, and leafy greens to support gut microbiome diversity.",
      sampleMealIdea: "Mediterranean turkey or lentil wrap with hummus, cucumber, baby spinach, and roasted red peppers in a whole-grain wrap."
    }
  ];

  const mealGuidance = mealGuidances[(dayNumber - 1) % mealGuidances.length];

  const journalPrompts = [
    "What is one physical or mental barrier you overcame this week that proved to you just how strong you are?",
    "When you imagine yourself 6 months from now at Day 180, what does your radiant, confident presence feel like?",
    "Write down three things you genuinely love about how your body feels when you move with intention.",
    "How has your relationship with food and movement shifted toward nourishment and self-respect rather than punishment?",
    "What is one self-doubt you are ready to let go of today as you step into your full athletic confidence?"
  ];

  return {
    dayNumber,
    stepTarget: calculatedSteps,
    waterTargetLiters: calculatedWater,
    sleepTargetHours: profile?.sleepScheduleHours || 8,
    mealGuidance,
    healthyHabits: [
      `Drink 500ml water upon waking before caffeine`,
      `Hit your ${calculatedSteps.toLocaleString()} daily step target`,
      `Consume 25g+ protein at each main meal`,
      `Perform 5 minutes of mindful posture breathing`,
      `Disconnect from blue-light screens 45 minutes before bed`
    ],
    morningRoutine: "Wake up, drink 500ml lemon water, 3 deep diaphragmatic breaths, and a 2-minute posture stretch.",
    eveningRoutine: "Dim lighting, gentle 5-minute hamstring & hip opener stretch, log your confidence journal, and enjoy 8 hours of restorative sleep.",
    stressManagementTip: "Practice box breathing (4s inhale, 4s hold, 4s exhale, 4s hold) for 2 minutes whenever you feel overwhelmed.",
    confidenceChallenge: challenge,
    journalPrompt: journalPrompts[(dayNumber - 1) % journalPrompts.length]
  };
}
