import { Exercise } from "./exercises";
import { filterExercisesForSplit } from "../utils/dynamicWorkoutEngine";

export interface WomenOnboardingProfile {
  age: number;
  height: number;
  currentWeight: number;
  targetWeight?: number;
  mainGoal: "lose_weight" | "burn_fat" | "build_muscle" | "tone_shape" | "maintain_weight" | "improve_fitness" | "build_curves" | "increase_strength" | "improve_health";
  focusAreas: string[];
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  workoutLocation: "home" | "gym" | "both";
  availableEquipment: string[];
  trainingDaysPerWeek: number;
  preferredDuration: "20-30" | "30-45" | "45-60";
  previousExperience: "none" | "occasional" | "consistent" | "former_athlete";
  dailyActivityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active";
  dietaryPreference: "balanced" | "high_protein" | "plant_based" | "pescatarian" | "keto_low_carb" | "intermittent_fasting";
  sleepScheduleHours: number;
  currentWaterIntakeLiters: number;
  lifestyleRoutine: "desk_job" | "on_feet" | "busy_parent" | "shift_work" | "student";
  exerciseLimitations: string;
  motivation: string;
  completedAt: string;
}

export interface WomenDailyExercise {
  id: string;
  name: string;
  muscleGroups: string[];
  sets: number;
  reps: string;
  restPeriod: string;
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
    bannerImage: ""
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
    bannerImage: ""
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
    bannerImage: ""
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
    bannerImage: ""
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
    bannerImage: ""
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
    bannerImage: ""
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
    title: "Strength Unlocked",
    badgeName: "Metabolic Dynamo",
    icon: "Zap",
    color: "text-fuchsia-500 bg-fuchsia-50 border-fuchsia-200",
    description: "Crushed 60 days of progressive loading, strength gains, and sustainable body recomposition."
  },
  {
    day: 90,
    id: "milestone_day_90",
    title: "Halfway Immortal",
    badgeName: "Sculpted Sovereign",
    icon: "Crown",
    color: "text-pink-500 bg-pink-50 border-pink-200",
    description: "Reached the midpoint of your transformation. Your posture, physique, and mindset are transformed."
  },
  {
    day: 130,
    id: "milestone_day_130",
    title: "Athletic Dominance",
    badgeName: "Empowered Valkyrie",
    icon: "Award",
    color: "text-purple-500 bg-purple-50 border-purple-200",
    description: "Conquered 130 days of high-density training with remarkable stamina and resilience."
  },
  {
    day: 180,
    id: "milestone_day_180",
    title: "Total Transformation",
    badgeName: "Radiant Empress of Strength",
    icon: "Trophy",
    color: "text-amber-500 bg-amber-50 border-amber-200",
    description: "Completed all 180 days. You stand transformed with permanent confidence and power."
  }
];

// Strong men / heavy bodybuilding exercise blocklist to strictly prevent unwanted male workouts (like cable fly, heavy bench, etc.)
export const STRONG_MEN_EXERCISE_BLOCKLIST = [
  "cable fly",
  "cable flyes",
  "cable crossover",
  "pec deck",
  "pec fly",
  "chest fly",
  "incline fly",
  "decline fly",
  "dumbbell fly",
  "flat dumbbell fly",
  "cable chest",
  "bench press",
  "barbell bench",
  "decline bench",
  "incline bench",
  "guillotine press",
  "heavy deadlift",
  "powerlifting",
  "atlas stone",
  "tire flip",
  "log press",
  "behind neck",
  "behind the neck",
  "shrug",
  "barbell shrug",
  "heavy shrugs",
  "trap builder",
  "chest dips",
  "weighted dip",
  "cable press",
  "heavy press"
];

/**
 * Validates that an exercise is suitable for women's confidence/sculpting routines.
 * Strictly excludes heavy chest builders, cable flyes, and aggressive male strongman exercises.
 */
export function isWomenWorkoutEligibleExercise(ex: Exercise | { name?: string; category?: string; muscleGroups?: string[]; genderSuitability?: string }): boolean {
  if (!ex) return false;
  if ((ex as any).genderSuitability === "Men") return false;
  const name = ((ex as any).name || (ex as any).exerciseName || "").toLowerCase().trim();
  const cat = ((ex as any).category || "").toLowerCase().trim();
  const desc = ((ex as any).description || "").toLowerCase().trim();

  // 1. Strict check against blocklisted heavy male exercises
  for (const blocked of STRONG_MEN_EXERCISE_BLOCKLIST) {
    if (name.includes(blocked) || cat.includes(blocked) || desc.includes(blocked)) {
      return false;
    }
  }

  return true;
}

/**
 * Checks whether an exercise is explicitly designated as a women / female workout
 * by admin configuration (genderSuitability === "Women", women categories assigned, or women program assignment).
 */
export function isExplicitlyMarkedWomenWorkout(ex: any): boolean {
  if (!ex) return false;
  if (ex.genderSuitability === "Women") return true;
  if (Array.isArray(ex.womenCategories) && ex.womenCategories.length > 0) return true;
  if (Array.isArray(ex.programAssignments) && ex.programAssignments.some((p: string) => p.toLowerCase().includes("women"))) return true;
  if (typeof ex.category === "string" && ex.category.toLowerCase().includes("women")) return true;
  return false;
}

// Comprehensive catalog of authentic women's exercises for 180 days of sculpted confidence
interface WomenCatalogItem {
  name: string;
  muscleGroups: string[];
  equipment: string;
  defaultReps: string;
  defaultSets: number;
  instructions: string[];
  formTips: string[];
  targetMuscles: string;
}

const AUTHENTIC_WOMEN_WORKOUT_LIBRARY: Record<string, WomenCatalogItem[]> = {
  glutes: [
    {
      name: "Banded Barbell Hip Thrust with 2s Pause",
      muscleGroups: ["Glutes", "Hamstrings", "Pelvic Floor"],
      equipment: "Barbell, Resistance Band, Bench",
      defaultReps: "12-15 reps",
      defaultSets: 4,
      instructions: [
        "Place upper back across bench with resistance band wrapped just above knees.",
        "Drive through heels to extend hips toward ceiling until thighs and torso align.",
        "Squeeze glutes maximally at the top for 2 full seconds, then lower with control."
      ],
      formTips: ["Keep chin tucked and ribs pulled down to avoid arching lumbar spine."],
      targetMuscles: "Gluteus Maximus, Gluteus Medius, Upper Hamstrings"
    },
    {
      name: "Dumbbell Romanian Deadlift (Glute-Ham Focus)",
      muscleGroups: ["Glutes", "Hamstrings", "Lower Back"],
      equipment: "Dumbbells",
      defaultReps: "12-15 reps",
      defaultSets: 4,
      instructions: [
        "Stand tall with dumbbells in front of thighs, slight soft bend in knees.",
        "Hinge backward at hips as if touching wall with glutes, keeping weights close to shins.",
        "Feel deep stretch in hamstrings and glutes, then drive hips forward to lockout."
      ],
      formTips: ["Push hips backward rather than bending forward; keep spine neutral."],
      targetMuscles: "Gluteal Fold, Hamstrings, Spinal Erectors"
    },
    {
      name: "Elevated Glute Bridge with Resistance Loop",
      muscleGroups: ["Glutes", "Hamstrings", "Core"],
      equipment: "Bench / Step, Resistance Band",
      defaultReps: "15-20 reps",
      defaultSets: 3,
      instructions: [
        "Lie supine with feet elevated on a sturdy low bench or step, band above knees.",
        "Push through heels to elevate pelvis until full hip extension is achieved.",
        "Abduct knees slightly against band tension at peak contraction before lowering."
      ],
      formTips: ["Focus all driving force through heels rather than balls of feet."],
      targetMuscles: "Gluteus Maximus, Gluteus Medius"
    },
    {
      name: "Standing Cable Glute Kickbacks (Sculpt Focus)",
      muscleGroups: ["Glutes", "Posterior Chain"],
      equipment: "Cable Machine / Ankle Strap",
      defaultReps: "15 reps per leg",
      defaultSets: 3,
      instructions: [
        "Attach ankle cuff to low pulley, lean torso slightly forward supporting on tower.",
        "Kick working leg backward and slightly outward in a 45-degree arc using glute contraction.",
        "Pause for 1 second at top peak, return under strict control without swinging."
      ],
      formTips: ["Do not hyperextend lower back; maintain steady core engagement."],
      targetMuscles: "Upper Glute Shelf, Gluteus Medius"
    },
    {
      name: "Alternating Curtsy Lunges",
      muscleGroups: ["Glutes", "Hips", "Quads"],
      equipment: "Bodyweight / Light Dumbbells",
      defaultReps: "12 reps per side",
      defaultSets: 3,
      instructions: [
        "Stand hip-width apart, step rear leg diagonally behind front leg like a polite curtsy.",
        "Lower hips until front thigh is parallel to ground, loading outside glute.",
        "Drive through front heel to return to start and alternate sides seamlessly."
      ],
      formTips: ["Keep front knee aligned with front toes throughout movement."],
      targetMuscles: "Gluteus Medius, Outer Hip Stabilizers, Quadriceps"
    },
    {
      name: "Dumbbell Sumo Squat with Glute Squeeze",
      muscleGroups: ["Glutes", "Inner Thighs", "Quads"],
      equipment: "Dumbbell",
      defaultReps: "15 reps",
      defaultSets: 4,
      instructions: [
        "Take a wide stance with toes turned outward at 45 degrees, holding dumbbell vertically.",
        "Descend by tracking knees wide over toes until hips descend below knee level.",
        "Drive upward through heels, aggressively squeezing glutes and adductors at the top."
      ],
      formTips: ["Keep chest tall and upright throughout the entire descent."],
      targetMuscles: "Gluteus Maximus, Adductor Magnus, Vagus Medialis"
    },
    {
      name: "Bodyweight Frog Pumps (High Rep Glute Burner)",
      muscleGroups: ["Glutes", "Pelvic Stability"],
      equipment: "Mat",
      defaultReps: "25-30 reps",
      defaultSets: 3,
      instructions: [
        "Lie on back with soles of feet pressed together and knees flared wide like a frog.",
        "Drive outer edges of feet into floor and squeeze glutes to elevate hips.",
        "Pulse at top for rapid muscular metabolic recruitment."
      ],
      formTips: ["Maintain continuous glute contraction with minimal rest between reps."],
      targetMuscles: "Gluteus Maximus, Deep Hip External Rotators"
    },
    {
      name: "Bench Glute Step-Ups",
      muscleGroups: ["Glutes", "Hamstrings", "Quads"],
      equipment: "Bench / Plyo Box, Dumbbells",
      defaultReps: "12 reps per leg",
      defaultSets: 3,
      instructions: [
        "Place entire foot firmly on bench, lean torso slightly forward to bias glutes.",
        "Drive through heel of elevated foot without pushing off back trailing toes.",
        "Lower back down with 3-second controlled eccentric cadence."
      ],
      formTips: ["Do not let trailing foot bounce off the floor; isolate top leg completely."],
      targetMuscles: "Gluteus Maximus, Hamstrings, Quadriceps"
    },
    {
      name: "Banded Clamshells with Top Isometric Hold",
      muscleGroups: ["Glutes", "Hip Abductors"],
      equipment: "Resistance Band, Mat",
      defaultReps: "15-20 reps per side",
      defaultSets: 3,
      instructions: [
        "Lie on side with knees bent at 90 degrees and feet aligned with hips, band above knees.",
        "Keeping feet glued together, open top knee as high as possible toward ceiling.",
        "Hold top peak contraction for 2 seconds before slowly closing."
      ],
      formTips: ["Keep pelvis locked upright; do not let top hip roll backward."],
      targetMuscles: "Gluteus Medius, Gluteus Minimus, Tensor Fasciae Latae"
    },
    {
      name: "Single-Leg Romanian Deadlift (Balance & Shape)",
      muscleGroups: ["Glutes", "Hamstrings", "Core"],
      equipment: "Dumbbell / Bodyweight",
      defaultReps: "10-12 reps per leg",
      defaultSets: 3,
      instructions: [
        "Stand on one foot, hold dumbbell in opposite hand with soft standing knee.",
        "Hinge forward at hip while extending non-working leg straight behind for counter-balance.",
        "Lower until torso is parallel to floor, squeeze glute to pull yourself upright."
      ],
      formTips: ["Keep hips square to the ground; avoid opening up hip of back leg."],
      targetMuscles: "Gluteus Medius, Gluteus Maximus, Hamstrings"
    },
    {
      name: "Donkey Kicks with Resistance Loop",
      muscleGroups: ["Glutes", "Hamstrings"],
      equipment: "Resistance Band, Mat",
      defaultReps: "15 reps per leg",
      defaultSets: 3,
      instructions: [
        "Begin on all fours on mat, band looped around mid-thighs.",
        "Keeping knee bent at 90 degrees, kick heel upward toward ceiling.",
        "Squeeze glute at top until thigh is parallel to floor, lower under control."
      ],
      formTips: ["Keep core braced and spine flat; do not arch lower back."],
      targetMuscles: "Gluteus Maximus, Upper Posterior Chain"
    },
    {
      name: "Fire Hydrants with 2s Pulse",
      muscleGroups: ["Glutes", "Outer Thighs"],
      equipment: "Resistance Band / Mat",
      defaultReps: "15 reps per leg",
      defaultSets: 3,
      instructions: [
        "Assume tabletop position with wrists under shoulders and knees under hips.",
        "Lift one knee out to the side while keeping 90-degree knee angle.",
        "Perform a micro-pulse at top height before lowering smoothly."
      ],
      formTips: ["Distribute weight evenly across hands without leaning excessively."],
      targetMuscles: "Gluteus Medius, Gluteus Minimus, Piriformis"
    },
    {
      name: "Bulgarian Split Squat (Forward Torso Glute Bias)",
      muscleGroups: ["Glutes", "Hamstrings", "Quads"],
      equipment: "Bench, Dumbbells",
      defaultReps: "10-12 reps per leg",
      defaultSets: 3,
      instructions: [
        "Place top of rear foot on bench behind you, step forward into wide lunge stance.",
        "Hinge torso slightly forward at 15 degrees to shift maximum loading into front glute.",
        "Lower straight down until front thigh is parallel, push through front heel to rise."
      ],
      formTips: ["Forward torso lean places maximal stretch on glute fibres."],
      targetMuscles: "Gluteus Maximus, Hamstrings, Quad Stabilizers"
    },
    {
      name: "Side-Lying Hip Abduction with Toe Inversion",
      muscleGroups: ["Glutes", "Hip Sculpt"],
      equipment: "Ankle Weights / Resistance Band, Mat",
      defaultReps: "20 reps per side",
      defaultSets: 3,
      instructions: [
        "Lie on side with bottom leg bent for stability and top leg completely straight.",
        "Turn top toes slightly downward toward floor to isolate gluteus medius.",
        "Raise top leg upward in controlled arc and lower without touching bottom leg."
      ],
      formTips: ["Slight inward toe angle prevents hip flexor takeover."],
      targetMuscles: "Gluteus Medius, Hip Abductors"
    },
    {
      name: "Glute Bridge March with Core Bracing",
      muscleGroups: ["Glutes", "Pelvic Core", "Hamstrings"],
      equipment: "Mat",
      defaultReps: "20 alternating marches",
      defaultSets: 3,
      instructions: [
        "Elevate hips into high glute bridge with glutes tightly squeezed.",
        "Without dropping pelvis, lift one knee toward chest into a marching motion.",
        "Place foot down and march opposite knee, keeping hips level as a tabletop."
      ],
      formTips: ["Place hands on hip bones to ensure zero dipping or twisting."],
      targetMuscles: "Gluteus Maximus, Transverse Abdominis, Pelvic Stabilizers"
    }
  ],
  upper_body_posture: [
    {
      name: "Resistance Band Face Pulls (Posture & Rear Delts)",
      muscleGroups: ["Upper Back", "Rear Delts", "Posture"],
      equipment: "Resistance Band / Cable Rope",
      defaultReps: "15-20 reps",
      defaultSets: 4,
      instructions: [
        "Anchor band at eye level, hold ends with overhand grip and thumbs pointing back.",
        "Pull band directly toward face, flaring elbows wide and rotating wrists back.",
        "Squeeze shoulder blades tightly together for 2 seconds to correct rounded shoulders."
      ],
      formTips: ["Focus on pulling with rear deltoids and mid-traps, keeping neck relaxed."],
      targetMuscles: "Rear Deltoids, Rhomboids, Middle Trapezius, Rotator Cuff"
    },
    {
      name: "Prone Cobra Back & Scapular Lift",
      muscleGroups: ["Upper Back", "Erectors", "Posture"],
      equipment: "Mat",
      defaultReps: "12-15 reps (3s hold)",
      defaultSets: 3,
      instructions: [
        "Lie face down on mat with arms resting along sides, thumbs pointing outward.",
        "Simultaneously lift chest and arms off floor while externally rotating hands upward.",
        "Squeeze shoulder blades down and back, holding peak contraction for 3 seconds."
      ],
      formTips: ["Look down at mat to keep cervical spine elongated and relaxed."],
      targetMuscles: "Lower & Middle Trapezius, Rhomboids, Infraspinatus"
    },
    {
      name: "Standing Dumbbell Lateral Raises (Slender Shoulders)",
      muscleGroups: ["Shoulders", "Deltoids"],
      equipment: "Light Dumbbells",
      defaultReps: "12-15 reps",
      defaultSets: 4,
      instructions: [
        "Stand tall with core braced, holding light dumbbells at sides with soft elbows.",
        "Raise arms outward in scapular plane until parallel to floor, pouring out slight pitcher angle.",
        "Control lowering for 3 seconds to build sculpted lateral cap definition."
      ],
      formTips: ["Keep shoulders depressed away from ears; do not shrug."],
      targetMuscles: "Lateral Deltoids, Supraspinatus"
    },
    {
      name: "Dumbbell Neutral-Grip Overhead Shoulder Press",
      muscleGroups: ["Shoulders", "Triceps", "Upper Body"],
      equipment: "Dumbbells",
      defaultReps: "10-12 reps",
      defaultSets: 3,
      instructions: [
        "Hold dumbbells at shoulder height with palms facing each other (neutral grip).",
        "Press overhead smoothly until arms are extended without locking elbows.",
        "Lower dumbbells slowly over 3 seconds back to shoulder level."
      ],
      formTips: ["Neutral grip protects shoulder joints and creates lean muscle tone."],
      targetMuscles: "Anterior Deltoids, Lateral Deltoids, Triceps"
    },
    {
      name: "Bench Tricep Dips (Sculpted Arm Tone)",
      muscleGroups: ["Triceps", "Shoulders"],
      equipment: "Bench / Chair",
      defaultReps: "12-15 reps",
      defaultSets: 3,
      instructions: [
        "Sit on edge of bench, place hands shoulder-width apart with fingers facing forward.",
        "Slide hips off bench and lower body by bending elbows straight back to 90 degrees.",
        "Press through palms to lockout arms, squeezing back of arms at the top."
      ],
      formTips: ["Keep back close to bench to protect anterior shoulder capsules."],
      targetMuscles: "Triceps Brachii, Anterior Deltoid"
    },
    {
      name: "Dumbbell Single-Arm Sculpting Row",
      muscleGroups: ["Back", "Lats", "Posture"],
      equipment: "Dumbbell, Bench",
      defaultReps: "12 reps per arm",
      defaultSets: 3,
      instructions: [
        "Place one knee and hand on bench for support, holding dumbbell in free hand.",
        "Pull dumbbell up toward hip crease, driving elbow toward ceiling.",
        "Squeeze lat at top for 1 second, then lower with full stretch."
      ],
      formTips: ["Pull with your back muscles rather than your bicep; avoid rotating torso."],
      targetMuscles: "Latissimus Dorsi, Rhomboids, Rear Deltoids"
    },
    {
      name: "Standing Dumbbell Front-to-Lateral Sculpt Raise",
      muscleGroups: ["Shoulders", "Upper Body"],
      equipment: "Light Dumbbells",
      defaultReps: "10-12 combo reps",
      defaultSets: 3,
      instructions: [
        "Raise light dumbbells straight forward to shoulder height with neutral palms.",
        "Open arms smoothly outward to sides while maintaining shoulder height.",
        "Lower dumbbells to sides with control, then reverse the sequence."
      ],
      formTips: ["Use light weight (2-4 kg) and emphasize seamless continuous tension."],
      targetMuscles: "Anterior Deltoids, Lateral Deltoids"
    },
    {
      name: "Incline Dumbbell Chest-Supported Row (Postural Alignment)",
      muscleGroups: ["Upper Back", "Rhomboids", "Mid Traps"],
      equipment: "Incline Bench, Dumbbells",
      defaultReps: "12-15 reps",
      defaultSets: 3,
      instructions: [
        "Lie face down on incline bench set at 30-45 degrees with dumbbells hanging straight down.",
        "Row weights upward with elbows flared at 45 degrees, squeezing shoulder blades together.",
        "Pause at top contraction, lowering smoothly with zero body momentum."
      ],
      formTips: ["Chest support completely removes lower back strain for pure posture focus."],
      targetMuscles: "Rhomboids, Middle & Lower Trapezius, Rear Delts"
    },
    {
      name: "Overhead Dumbbell Tricep Extension",
      muscleGroups: ["Triceps", "Arm Tone"],
      equipment: "Dumbbell",
      defaultReps: "12-15 reps",
      defaultSets: 3,
      instructions: [
        "Stand tall or sit upright holding one dumbbell overhead with both hands cup-gripped.",
        "Lower weight behind head by bending elbows while keeping upper arms pointing up.",
        "Extend arms fully overhead to peak tricep contraction."
      ],
      formTips: ["Keep elbows pinned inward; do not allow them to flare wide."],
      targetMuscles: "Triceps Long Head (eliminates arm sag)"
    },
    {
      name: "Resistance Band Pull-Apart (Thoracic Opening)",
      muscleGroups: ["Upper Back", "Rear Delts", "Posture"],
      equipment: "Resistance Band",
      defaultReps: "20 reps",
      defaultSets: 3,
      instructions: [
        "Hold resistance band in front of chest at shoulder height with arms straight.",
        "Pull band apart until it touches sternum, squeezing shoulder blades hard.",
        "Return under elastic control without letting band go slack."
      ],
      formTips: ["Keep shoulders down and neck long; stand tall with proud chest."],
      targetMuscles: "Rhomboids, Posterior Deltoid, Mid Trapezius"
    },
    {
      name: "Dumbbell Hammer Curl to Press Combo",
      muscleGroups: ["Biceps", "Shoulders", "Arm Tone"],
      equipment: "Dumbbells",
      defaultReps: "10-12 reps",
      defaultSets: 3,
      instructions: [
        "Hold dumbbells with neutral palms facing inward at sides.",
        "Curl weights to shoulders keeping elbows stationary, then immediately press overhead.",
        "Lower smoothly back to shoulders and down to sides in reverse motion."
      ],
      formTips: ["Keep core tight to prevent arching back during overhead transition."],
      targetMuscles: "Brachialis, Biceps, Deltoids, Triceps"
    },
    {
      name: "Superman Hold with Lat Retraction",
      muscleGroups: ["Back", "Glutes", "Posture"],
      equipment: "Mat",
      defaultReps: "10 reps (3s hold)",
      defaultSets: 3,
      instructions: [
        "Lie face down on mat, arms extended overhead in 'Y' shape.",
        "Lift chest and legs off floor, then pull elbows down toward ribs in a lat pulldown motion.",
        "Re-extend arms overhead and lower back down to mat."
      ],
      formTips: ["Engage glutes and upper back in synchrony to support entire spine."],
      targetMuscles: "Latissimus Dorsi, Posterior Chain, Scapular Retractors"
    },
    {
      name: "Standing Cable Rear Delt Fly (High Rep Tone)",
      muscleGroups: ["Rear Delts", "Upper Back"],
      equipment: "Cable Machine (Cross Pulley)",
      defaultReps: "15-20 reps",
      defaultSets: 3,
      instructions: [
        "Set pulleys at chest height, grab right cable with left hand and left cable with right hand.",
        "Pull arms outward and back in wide horizontal arc without bending elbows excessively.",
        "Squeeze rear delts at peak contraction, return under resistance."
      ],
      formTips: ["Use light weight and high reps for sleek scapular sculpting."],
      targetMuscles: "Rear Deltoid, Infraspinatus, Teres Minor"
    },
    {
      name: "Bird-Dog Arm & Leg Posture Reach",
      muscleGroups: ["Back", "Core", "Glutes"],
      equipment: "Mat",
      defaultReps: "12 reps per side",
      defaultSets: 3,
      instructions: [
        "Begin in tabletop position on hands and knees with neutral spine.",
        "Reach right arm forward and left leg straight back until parallel to floor.",
        "Hold for 2 seconds with abdominal bracing, return and alternate sides."
      ],
      formTips: ["Do not let hips dip or rotate; imagine balancing a glass of water on your lower back."],
      targetMuscles: "Multifidus, Transverse Abdominis, Gluteus Maximus"
    },
    {
      name: "Scapular Wall Slides (Shoulder Health & Poise)",
      muscleGroups: ["Upper Back", "Rotator Cuff", "Posture"],
      equipment: "Wall",
      defaultReps: "15 reps",
      defaultSets: 3,
      instructions: [
        "Stand with heels, glutes, upper back, and back of head flat against a wall.",
        "Place forearms and backs of hands against wall at 90-degree goalpost position.",
        "Slowly slide arms upward overhead while maintaining continuous wall contact."
      ],
      formTips: ["Ensure lower ribs stay flat against wall without flaring outward."],
      targetMuscles: "Serratus Anterior, Lower Trapezius, Rotator Cuff"
    }
  ],
  core_waist: [
    {
      name: "Pilates Roll-Up with Deep Abdominal Scoop",
      muscleGroups: ["Core", "Transverse Abdominis", "Abs"],
      equipment: "Mat",
      defaultReps: "10-12 controlled reps",
      defaultSets: 3,
      instructions: [
        "Lie flat on back with legs together and arms extended overhead.",
        "Inhale and lift arms toward ceiling, exhale and peel spine off mat vertebra by vertebra.",
        "Reach forward past toes while hollowing out abdominal wall, then articulate back down."
      ],
      formTips: ["Do not use momentum; move with slow, surgical breath control."],
      targetMuscles: "Rectus Abdominis, Transverse Abdominis, Spinal Articulators"
    },
    {
      name: "Dead Bug Core Stabilization",
      muscleGroups: ["Core", "Pelvic Floor", "Deep Abs"],
      equipment: "Mat",
      defaultReps: "16 alternating reps",
      defaultSets: 3,
      instructions: [
        "Lie on back with arms pointing to ceiling and knees bent at 90 degrees above hips.",
        "Press lower back firmly into mat, eliminating any arch gap.",
        "Slowly lower opposite arm and leg toward floor while maintaining flat lumbar anchor."
      ],
      formTips: ["If lower back arches off mat, do not lower limbs as far."],
      targetMuscles: "Transverse Abdominis, Pelvic Floor, Internal Obliques"
    },
    {
      name: "Side Plank with Gentle Hip Dip",
      muscleGroups: ["Obliques", "Waist", "Core"],
      equipment: "Mat",
      defaultReps: "12-15 reps per side",
      defaultSets: 3,
      instructions: [
        "Prop yourself up on forearm with elbow directly under shoulder, feet stacked.",
        "Lift hips into a straight diagonal line from head to heels.",
        "Dip hips 2 inches toward floor, then drive upward using oblique contraction."
      ],
      formTips: ["Stack shoulders and hips vertically without rotating forward."],
      targetMuscles: "Internal & External Obliques, Quadratus Lumborum"
    },
    {
      name: "Transverse Abdominis Stomach Vacuum Bracing",
      muscleGroups: ["Deep Core", "Waist Tightening"],
      equipment: "Mat / Standing",
      defaultReps: "5 holds (20-30s each)",
      defaultSets: 3,
      instructions: [
        "Exhale all air completely from lungs through mouth.",
        "Without inhaling, pull belly button inward toward spine and upward toward ribcage.",
        "Hold this tight cinched vacuum while taking small shallow breaths through nose."
      ],
      formTips: ["This tightens the internal kinetic corset to naturally narrow waistline."],
      targetMuscles: "Transverse Abdominis (Internal Kinetic Corset)"
    },
    {
      name: "Alternating Bicycle Crunches (Oblique Taper)",
      muscleGroups: ["Obliques", "Abs"],
      equipment: "Mat",
      defaultReps: "20 controlled reps",
      defaultSets: 3,
      instructions: [
        "Lie on back with hands gently cradling head, shoulder blades elevated off mat.",
        "Rotate torso to bring right armpit toward left knee while extending right leg straight.",
        "Pause for 1 second, then rotate seamlessly to opposite side in rhythmic cadence."
      ],
      formTips: ["Do not yank on neck; rotate from thoracic ribcage."],
      targetMuscles: "External Obliques, Internal Obliques, Rectus Abdominis"
    },
    {
      name: "Plank with Alternating Knee-to-Elbow",
      muscleGroups: ["Core", "Obliques", "Shoulders"],
      equipment: "Mat",
      defaultReps: "16 reps",
      defaultSets: 3,
      instructions: [
        "Hold high plank position with hands under shoulders and glutes squeezed.",
        "Bring right knee outward toward right elbow, crunching side waist.",
        "Return to plank and repeat with left knee to left elbow."
      ],
      formTips: ["Keep hips level with shoulders throughout entire movement."],
      targetMuscles: "Obliques, Serratus Anterior, Transverse Abdominis"
    },
    {
      name: "Reverse Abdominal Curl to Hip Lift",
      muscleGroups: ["Lower Abs", "Deep Core"],
      equipment: "Mat",
      defaultReps: "12-15 reps",
      defaultSets: 3,
      instructions: [
        "Lie on back with hands pressed into floor at sides, knees bent at 90 degrees.",
        "Using lower abdominal contraction, roll pelvis off floor and lift hips straight up.",
        "Lower hips back down with controlled resistance without swinging legs."
      ],
      formTips: ["Focus on lifting hips toward ceiling rather than kicking feet backward."],
      targetMuscles: "Lower Rectus Abdominis, Deep Pelvic Stabilizers"
    },
    {
      name: "Hollow Body Hold Progression",
      muscleGroups: ["Core", "Pelvic Tilt"],
      equipment: "Mat",
      defaultReps: "4 holds (20-30s)",
      defaultSets: 3,
      instructions: [
        "Lie on back, press lumbar spine into floor with posterior pelvic tilt.",
        "Elevate shoulder blades and straight legs a few inches off mat.",
        "Reach arms overhead or by sides, creating a shallow curved banana shape."
      ],
      formTips: ["If lower back lifts, tuck knees slightly to maintain lumbar contact."],
      targetMuscles: "Transverse Abdominis, Rectus Abdominis"
    },
    {
      name: "Standing Oblique Sculpt with Overhead Reach",
      muscleGroups: ["Obliques", "Waistline"],
      equipment: "Light Dumbbell / Bodyweight",
      defaultReps: "15 reps per side",
      defaultSets: 3,
      instructions: [
        "Stand tall holding light dumbbell in one hand, opposite hand behind head.",
        "Reach dumbbell down side of thigh toward knee while contracting opposite oblique.",
        "Return through center and slightly crunch toward opposite side."
      ],
      formTips: ["Move strictly side-to-side in frontal plane without leaning forward."],
      targetMuscles: "Obliques, Quadratus Lumborum"
    },
    {
      name: "Russian Twists (Controlled Bodyweight / Light)",
      muscleGroups: ["Obliques", "Rotational Core"],
      equipment: "Mat",
      defaultReps: "20 reps",
      defaultSets: 3,
      instructions: [
        "Sit on mat with knees bent, lean torso back at 45 degrees with proud chest.",
        "Clasp hands in front of chest, rotate torso from side to side tapping mat.",
        "Keep knees steady without letting them sway excessively."
      ],
      formTips: ["Rotate your chest and shoulders, not just your hands."],
      targetMuscles: "Internal & External Obliques"
    },
    {
      name: "Scissor Kicks with Lumbar Press",
      muscleGroups: ["Lower Core", "Hip Flexors"],
      equipment: "Mat",
      defaultReps: "20 alternating kicks",
      defaultSets: 3,
      instructions: [
        "Lie on back, hands under tailbone for support, lower back pressed down.",
        "Elevate legs 6 inches off ground and alternate crossing one leg over the other.",
        "Breathe steadily while maintaining abdominal hollow."
      ],
      formTips: ["Keep movements crisp, controlled, and low to the ground."],
      targetMuscles: "Transverse Abdominis, Lower Abs, Adductors"
    },
    {
      name: "Mountain Climbers (Controlled Pilates Tempo)",
      muscleGroups: ["Core", "Cardio Conditioning"],
      equipment: "Mat",
      defaultReps: "24 controlled steps",
      defaultSets: 3,
      instructions: [
        "Assume high plank position with shoulders stacked over wrists.",
        "Drive one knee toward chest with controlled 1-second pause, not a frantic run.",
        "Step back and alternate with opposite knee, keeping hips flat."
      ],
      formTips: ["Maintain flat back and neutral neck; focus on abdominal squeeze."],
      targetMuscles: "Core, Shoulders, Hip Flexors"
    },
    {
      name: "Bird-Dog Plank Isometric Hold",
      muscleGroups: ["Core", "Posterior Stabilization"],
      equipment: "Mat",
      defaultReps: "10 alternating holds (5s each)",
      defaultSets: 3,
      instructions: [
        "From tabletop position, float knees 1 inch off floor (bear plank).",
        "Maintain deep core compression while lifting opposite hand and foot momentarily.",
        "Lower and alternate sides without twisting hips."
      ],
      formTips: ["Incredible exercise for stabilizing the sacroiliac joint and waist."],
      targetMuscles: "Deep Core, Multifidus, Obliques"
    },
    {
      name: "Bear Plank Knee Taps",
      muscleGroups: ["Deep Core", "Serratus"],
      equipment: "Mat",
      defaultReps: "16 taps",
      defaultSets: 3,
      instructions: [
        "Set up on hands and knees with toes tucked, hover knees 2 inches above mat.",
        "Tap one hand to opposite knee while keeping core completely braced.",
        "Return hand and alternate sides without allowing hips to sway."
      ],
      formTips: ["Keep knees close to floor throughout to keep tension on lower abs."],
      targetMuscles: "Transverse Abdominis, Internal Obliques"
    },
    {
      name: "Forearm Plank with Serratus Protraction",
      muscleGroups: ["Core", "Shoulder Poise"],
      equipment: "Mat",
      defaultReps: "3 holds (45-60s)",
      defaultSets: 3,
      instructions: [
        "Hold forearm plank with elbows directly under shoulders, body in a rigid line.",
        "Push floor away through forearms to lightly round upper back (protraction).",
        "Squeeze glutes, pull belly button to spine, and breathe rhythmically."
      ],
      formTips: ["Do not allow hips to sag or pike into an inverted V."],
      targetMuscles: "Transverse Abdominis, Serratus Anterior, Glutes"
    }
  ],
  cardio_walking: [
    {
      name: "Brisk Incline Walking Cadence Drill",
      muscleGroups: ["Cardio", "Glutes", "Calves"],
      equipment: "Treadmill / Outdoor Route",
      defaultReps: "10 Minutes Continuous",
      defaultSets: 1,
      instructions: [
        "Walk at a brisk pace (5.5 - 6.0 km/h) on moderate incline.",
        "Drive through heels and push off big toes to recruit glutes with every stride.",
        "Keep shoulders back and swing arms rhythmically from shoulders."
      ],
      formTips: ["Do not hold onto treadmill rails; let your core stabilize each stride."],
      targetMuscles: "Cardiovascular System, Glutes, Calves"
    },
    {
      name: "Low-Impact High Knees with Arm Drivers",
      muscleGroups: ["Cardio", "Core", "Hip Flexors"],
      equipment: "Bodyweight",
      defaultReps: "40 reps",
      defaultSets: 3,
      instructions: [
        "Stand tall, drive one knee up to hip level while pulling opposite elbow back.",
        "Step down softly and alternate knees with energetic marching cadence.",
        "Keep posture upright and engage lower abs on every knee drive."
      ],
      formTips: ["Land softly on midfoot to eliminate joint impact."],
      targetMuscles: "Cardiovascular System, Lower Abs, Hip Flexors"
    },
    {
      name: "Speed Skater Hops (Low-Impact Glute Drift)",
      muscleGroups: ["Glutes", "Cardio", "Hips"],
      equipment: "Bodyweight",
      defaultReps: "20 alternating reps",
      defaultSets: 3,
      instructions: [
        "Leap laterally to right, landing softly on right foot with knee bent.",
        "Sweep left leg behind right ankle, reaching left hand across toward right toe.",
        "Immediately bound to left and repeat in smooth fluid rhythm."
      ],
      formTips: ["Stay low in hips to maximize gluteus medius loading."],
      targetMuscles: "Gluteus Medius, Outer Thighs, Aerobic Conditioning"
    },
    {
      name: "Standing Oblique Knee-to-Elbow Marches",
      muscleGroups: ["Cardio", "Obliques", "Balance"],
      equipment: "Bodyweight",
      defaultReps: "20 reps per side",
      defaultSets: 3,
      instructions: [
        "Stand with hands behind head, elbows wide.",
        "Drive right knee outward to side while crunching right elbow down to meet it.",
        "Return foot to floor and repeat with rhythmic athletic tempo."
      ],
      formTips: ["Crunch from side waist, keeping chest open."],
      targetMuscles: "Obliques, Hip Abductors, Heart Rate"
    },
    {
      name: "Step Jacks (Low-Impact Heart Rate Elevation)",
      muscleGroups: ["Cardio", "Full Body"],
      equipment: "Bodyweight",
      defaultReps: "40 reps",
      defaultSets: 3,
      instructions: [
        "Step right foot out to side while swinging both arms overhead.",
        "Step right foot back to center while lowering arms.",
        "Immediately step left foot out and repeat with continuous brisk cadence."
      ],
      formTips: ["Zero jump impact makes this easy on joints while burning calories."],
      targetMuscles: "Full Body Cardiovascular Endurance"
    },
    {
      name: "Shadow Boxing Cardio Punches (Tone & Core)",
      muscleGroups: ["Cardio", "Shoulders", "Core"],
      equipment: "Bodyweight",
      defaultReps: "50 continuous punches",
      defaultSets: 3,
      instructions: [
        "Stand in athletic staggered stance, hands guarding chin.",
        "Throw alternating jab-cross-hook combinations extending from hips and core.",
        "Pivot rear foot on cross to engage obliques and waist rotation."
      ],
      formTips: ["Snap punches with control; do not hyperextend elbows."],
      targetMuscles: "Shoulders, Obliques, Aerobic Stamina"
    },
    {
      name: "Butt Kickers with Scapular Squeeze",
      muscleGroups: ["Cardio", "Hamstrings", "Upper Back"],
      equipment: "Bodyweight",
      defaultReps: "30 reps",
      defaultSets: 3,
      instructions: [
        "Jog or march in place bringing heels toward glutes.",
        "Simultaneously pull elbows back in rhythmic rowing motion to squeeze posture muscles.",
        "Maintain light spring in ankles and steady breathing."
      ],
      formTips: ["Stretches quads dynamically while activating hamstrings."],
      targetMuscles: "Hamstrings, Rhomboids, Aerobic System"
    },
    {
      name: "Calf Spring & Bounce Drill",
      muscleGroups: ["Calves", "Cardio", "Ankle Mobility"],
      equipment: "Bodyweight",
      defaultReps: "45 seconds",
      defaultSets: 3,
      instructions: [
        "Stay light on balls of feet, simulating jump rope with rhythmic micro-bounces.",
        "Keep ankles reactive and core drawn in tightly.",
        "Breathe smoothly in and out through nose."
      ],
      formTips: ["Builds athletic ankle resilience and lean calf definition."],
      targetMuscles: "Gastrocnemius, Soleus, Plantar Fascia"
    },
    {
      name: "Lateral Monster Band Walks",
      muscleGroups: ["Glutes", "Cardio", "Hips"],
      equipment: "Resistance Band",
      defaultReps: "20 steps each direction",
      defaultSets: 3,
      instructions: [
        "Place resistance band around ankles or just above knees, sink into quarter squat.",
        "Step sideways keeping feet parallel and band taut throughout.",
        "Step smoothly without letting knees collapse inward."
      ],
      formTips: ["Maintain constant tension on band; never let feet touch."],
      targetMuscles: "Gluteus Medius, Tensor Fasciae Latae"
    },
    {
      name: "Standing Wall Push Intervals",
      muscleGroups: ["Cardio", "Legs", "Core"],
      equipment: "Wall",
      defaultReps: "30 seconds",
      defaultSets: 3,
      instructions: [
        "Place hands against wall at 45-degree body lean.",
        "Drive knees rhythmically into chest with high-cadence walking/running motion.",
        "Keep core rigid from head to heels."
      ],
      formTips: ["Engage anterior core to drive each knee forward."],
      targetMuscles: "Cardiovascular, Core, Hip Flexors"
    }
  ],
  full_body: [
    {
      name: "Dumbbell Squat to Overhead Press",
      muscleGroups: ["Full Body", "Glutes", "Shoulders"],
      equipment: "Dumbbells",
      defaultReps: "12 reps",
      defaultSets: 4,
      instructions: [
        "Hold dumbbells at shoulders, descend into parallel squat with chest tall.",
        "Drive through heels out of squat, using upward momentum to press dumbbells overhead.",
        "Lower dumbbells back to shoulders under control and repeat."
      ],
      formTips: ["Seamlessly combine the squat ascent and overhead press into one fluid wave."],
      targetMuscles: "Glutes, Quadriceps, Deltoids, Core"
    },
    {
      name: "Curtsy Lunge to Bicep Curl",
      muscleGroups: ["Glutes", "Biceps", "Legs"],
      equipment: "Dumbbells",
      defaultReps: "10 reps per side",
      defaultSets: 3,
      instructions: [
        "Step rear leg diagonally into curtsy lunge while arms hang at sides.",
        "As you lower into lunge, curl dumbbells toward shoulders with palms up.",
        "Drive up through front heel and lower dumbbells back to sides."
      ],
      formTips: ["Coordinates lower body sculpting with sleek arm definition."],
      targetMuscles: "Gluteus Medius, Biceps, Core Stabilizers"
    },
    {
      name: "Sumo Squat with Light Upright Row",
      muscleGroups: ["Glutes", "Inner Thighs", "Shoulders"],
      equipment: "Light Dumbbells",
      defaultReps: "12-15 reps",
      defaultSets: 3,
      instructions: [
        "Stand wide with toes flared, dumbbells hanging in front of pelvis.",
        "Squat deep tracking knees over toes, then rise through heels.",
        "As you stand, pull dumbbells up along chest with elbows leading high."
      ],
      formTips: ["Keep weights close to body; do not pull higher than mid-chest."],
      targetMuscles: "Glutes, Adductors, Deltoids, Upper Back"
    },
    {
      name: "Inchworm Walkout to Knee Tuck",
      muscleGroups: ["Full Body", "Core", "Hamstrings"],
      equipment: "Mat",
      defaultReps: "8-10 reps",
      defaultSets: 3,
      instructions: [
        "Stand tall, hinge at hips and place hands on floor (bend knees if needed).",
        "Walk hands forward until in a high plank position.",
        "Tuck right knee then left knee to chest, then walk hands back to feet and stand."
      ],
      formTips: ["Stretches hamstrings while strengthening core and shoulders."],
      targetMuscles: "Hamstrings, Core, Shoulders, Kinetic Chain"
    },
    {
      name: "Reverse Lunge to Front Kick (Glute & Core)",
      muscleGroups: ["Glutes", "Core", "Legs"],
      equipment: "Bodyweight",
      defaultReps: "12 reps per leg",
      defaultSets: 3,
      instructions: [
        "Step back into deep reverse lunge, front knee bent 90 degrees.",
        "Push through front heel to rise and smoothly kick back leg forward at waist height.",
        "Return leg directly back into lunge in one continuous flow."
      ],
      formTips: ["Keep torso tall and brace abs at peak of kick."],
      targetMuscles: "Gluteus Maximus, Lower Abs, Balance"
    },
    {
      name: "Plank Jacks to Tap",
      muscleGroups: ["Full Body", "Core", "Cardio"],
      equipment: "Mat",
      defaultReps: "20 reps",
      defaultSets: 3,
      instructions: [
        "Begin in high plank with feet together.",
        "Jump or step feet wide apart, then immediately jump or step them back together.",
        "Keep shoulders packed and hips level with floor."
      ],
      formTips: ["Maintain steady core brace so hips do not bounce up and down."],
      targetMuscles: "Core, Abductors, Shoulder Stabilizers"
    },
    {
      name: "Side Lunge to Balance Drive",
      muscleGroups: ["Glutes", "Inner Thighs", "Core"],
      equipment: "Bodyweight",
      defaultReps: "12 reps per side",
      defaultSets: 3,
      instructions: [
        "Take a wide step to right, sitting hips back and bending right knee deeply.",
        "Push off right foot to return to center, driving right knee up to chest in balance.",
        "Hold balance for 1 second before stepping back out into side lunge."
      ],
      formTips: ["Trailing leg stays straight; hips push backward."],
      targetMuscles: "Gluteus Medius, Adductors, Quadriceps, Core"
    },
    {
      name: "Glute Bridge to Pullover (Sculpt Wave)",
      muscleGroups: ["Glutes", "Lats", "Core"],
      equipment: "Mat, Dumbbell",
      defaultReps: "12-15 reps",
      defaultSets: 3,
      instructions: [
        "Lie on back holding single dumbbell over chest with both hands.",
        "Elevate hips into glute bridge.",
        "Holding bridge high, lower dumbbell in an arc overhead toward floor, then pull back over chest."
      ],
      formTips: ["Keep glutes locked high while arms perform the lat pullover."],
      targetMuscles: "Gluteus Maximus, Lats, Ribcage Stabilizers"
    },
    {
      name: "Step-Through Reverse Lunges with Pulse",
      muscleGroups: ["Glutes", "Quads", "Legs"],
      equipment: "Bodyweight / Light Weights",
      defaultReps: "10 reps per leg (2 pulses each)",
      defaultSets: 3,
      instructions: [
        "Step backward into lunge, pulse down twice at bottom.",
        "Drive through front heel to step directly into forward lunge and pulse twice.",
        "Complete all reps on one leg before switching sides."
      ],
      formTips: ["Constant time-under-tension builds lean muscular endurance."],
      targetMuscles: "Glutes, Quadriceps, Calves"
    },
    {
      name: "Pike Push-Up to Child's Pose Reset",
      muscleGroups: ["Shoulders", "Upper Body", "Mobility"],
      equipment: "Mat",
      defaultReps: "10 reps",
      defaultSets: 3,
      instructions: [
        "Start in downward dog/pike with hips elevated high in inverted V.",
        "Lower crown of head toward floor between hands, press back up.",
        "Drop knees to mat and glide back into gentle child's pose for 2 seconds before next rep."
      ],
      formTips: ["Builds elegant shoulder strength without heavy benching."],
      targetMuscles: "Anterior & Lateral Deltoids, Triceps, Spine"
    }
  ],
  mobility_stretch: [
    {
      name: "Deep Kneeling Hip Flexor Stretch with Overhead Reach",
      muscleGroups: ["Hip Flexors", "Psoas", "Spine"],
      equipment: "Mat",
      defaultReps: "5 deep breaths per side",
      defaultSets: 2,
      instructions: [
        "Kneel in half-kneeling lunge with back knee cushioned on mat.",
        "Tuck pelvis under (posterior tilt) and shift hips forward slightly.",
        "Reach arm on trailing leg side high overhead and gently lean away from hip."
      ],
      formTips: ["Crucial for reversing hours of seated desk posture and releasing lower back."],
      targetMuscles: "Iliopsoas, Rectus Femoris, Latissimus Dorsi"
    },
    {
      name: "90/90 Hip Mobility Flow & Rotation",
      muscleGroups: ["Hips", "Glutes", "Pelvic Floor"],
      equipment: "Mat",
      defaultReps: "8 rotations per side",
      defaultSets: 2,
      instructions: [
        "Sit on floor with front leg bent at 90 degrees and back leg bent at 90 degrees.",
        "Keep spine tall, gently hinge torso forward over front shin for deep glute release.",
        "Sit up and rotate knees across center to opposite 90/90 position without hands if possible."
      ],
      formTips: ["Expands hip internal and external rotation for pain-free squatting."],
      targetMuscles: "Hip Capsules, Piriformis, Gluteus Medius"
    },
    {
      name: "Pigeon Pose with Diaphragmatic Breathing",
      muscleGroups: ["Glutes", "Hips", "Lower Back"],
      equipment: "Mat",
      defaultReps: "10 deep breaths per side",
      defaultSets: 2,
      instructions: [
        "From plank, bring right knee behind right wrist, shin angled across mat.",
        "Slide left leg straight back, sink hips level toward floor.",
        "Walk hands forward and fold torso over front leg, taking slow 4-second belly breaths."
      ],
      formTips: ["Keep hips square; do not collapse onto right hip."],
      targetMuscles: "Piriformis, Gluteal Complex, Hip Rotators"
    },
    {
      name: "Cat-Cow Spinal Articulation with Rib Circles",
      muscleGroups: ["Spine", "Thoracic", "Core"],
      equipment: "Mat",
      defaultReps: "10 cycles",
      defaultSets: 2,
      instructions: [
        "Begin on all fours on mat with wrists under shoulders and knees under hips.",
        "Inhale: drop belly, lift tailbone, and look up (Cow).",
        "Exhale: round spine toward ceiling, tuck chin, and scoop abs (Cat)."
      ],
      formTips: ["Move vertebra by vertebra like a rolling ocean wave."],
      targetMuscles: "Spinal Erectors, Rectus Abdominis, Cervical Spine"
    },
    {
      name: "Thread the Needle Thoracic Spine Opener",
      muscleGroups: ["Upper Back", "Shoulders", "Thoracic Spine"],
      equipment: "Mat",
      defaultReps: "8 reps per side",
      defaultSets: 2,
      instructions: [
        "From hands and knees, slide right arm underneath body along floor with palm up.",
        "Lower right shoulder and temple down to mat, feeling deep stretch behind shoulder blade.",
        "Hold for 3 seconds, then return and reach right arm high toward ceiling."
      ],
      formTips: ["Opens mid-back rotation and counteracts forward computer slouch."],
      targetMuscles: "Rhomboids, Posterior Deltoid, Thoracic Spine"
    },
    {
      name: "Butterfly Stretch with Tall Spine Decompression",
      muscleGroups: ["Inner Thighs", "Pelvis", "Lower Back"],
      equipment: "Mat",
      defaultReps: "8 deep breaths",
      defaultSets: 2,
      instructions: [
        "Sit upright with soles of feet together, knees dropping open toward floor.",
        "Hold ankles and lengthen spine upward toward ceiling.",
        "Gently hinge forward from hips without rounding upper back."
      ],
      formTips: ["Allow knees to release with gravity; do not force them down."],
      targetMuscles: "Adductors, Groin, Pelvic Diaphragm"
    },
    {
      name: "Child's Pose with Lateral Lat Reach",
      muscleGroups: ["Lats", "Hips", "Spine"],
      equipment: "Mat",
      defaultReps: "5 breaths center, 5 breaths each side",
      defaultSets: 2,
      instructions: [
        "Kneel with big toes touching and knees wide, sit hips back onto heels.",
        "Extend arms forward along mat, dropping forehead to floor.",
        "Walk both hands 45 degrees to right for deep side-body stretch, repeat on left."
      ],
      formTips: ["Breathe into ribcage to expand intercostal muscles."],
      targetMuscles: "Latissimus Dorsi, Thoracolumbar Fascia, Glutes"
    },
    {
      name: "Standing Forward Fold with Hamstring Decompression",
      muscleGroups: ["Hamstrings", "Calves", "Lower Back"],
      equipment: "Mat",
      defaultReps: "60 seconds continuous",
      defaultSets: 2,
      instructions: [
        "Stand with feet hip-width apart, soft bend in knees.",
        "Hinge at hips, fold torso over legs, and grasp opposite elbows (ragdoll).",
        "Let crown of head dangle with gravity, releasing all neck and lumbar compression."
      ],
      formTips: ["Bend knees as much as needed so chest can rest on thighs."],
      targetMuscles: "Entire Posterior Chain, Hamstrings, Neck"
    },
    {
      name: "Supine Spinal Twist with Gentle Chest Opener",
      muscleGroups: ["Spine", "Chest", "Glutes"],
      equipment: "Mat",
      defaultReps: "8 breaths per side",
      defaultSets: 2,
      instructions: [
        "Lie on back, hug right knee into chest, then guide it across body to left.",
        "Open right arm out to right at shoulder level and turn gaze toward right hand.",
        "Breathe deeply, allowing right shoulder to settle into mat with every exhale."
      ],
      formTips: ["Gently de-rotates the spine after lifting and walking sessions."],
      targetMuscles: "Spinal Rotators, Gluteus Medius, Pectoralis Minor"
    },
    {
      name: "Downward Dog to Gentle Upward Cobra Flow",
      muscleGroups: ["Full Body", "Calves", "Core", "Spine"],
      equipment: "Mat",
      defaultReps: "6 smooth flows",
      defaultSets: 2,
      instructions: [
        "From high plank, push hips up and back into downward facing dog, pressing heels down.",
        "Roll forward through spine back to plank, lower hips into gentle upward cobra.",
        "Lift chest and roll shoulders down and away from ears, hold for 2 seconds."
      ],
      formTips: ["Keep glutes lightly engaged in cobra to safeguard lumbar vertebrae."],
      targetMuscles: "Posterior Chain, Abdominal Wall, Chest, Calves"
    }
  ],
  recovery_rest: [
    {
      name: "Legs-Up-The-Wall Restoration (Viparita Karani)",
      muscleGroups: ["Vascular Circulation", "Hamstrings", "Nervous System"],
      equipment: "Wall, Mat",
      defaultReps: "5 Minutes Hold",
      defaultSets: 1,
      instructions: [
        "Sit sideways against a wall, swing legs up onto wall while lowering back onto mat.",
        "Rest arms out to sides with palms facing up, close eyes.",
        "Practice slow 4-7-8 parasympathetic breathing to promote lymphatic drainage."
      ],
      formTips: ["Reduces leg fatigue, flushes stagnant fluids, and down-regulates cortisol."],
      targetMuscles: "Lymphatic Flow, Venous Return, Hamstrings"
    },
    {
      name: "Diaphragmatic Belly Breathing with Pelvic Release",
      muscleGroups: ["Diaphragm", "Pelvic Floor", "Core"],
      equipment: "Mat",
      defaultReps: "10 deep breaths (4s in, 6s out)",
      defaultSets: 2,
      instructions: [
        "Lie on back with knees bent and feet flat on floor, one hand on belly, one on chest.",
        "Inhale deeply through nose, feeling hand on belly rise while chest stays calm.",
        "Exhale slowly through mouth, feeling pelvic floor and abdominal wall soften."
      ],
      formTips: ["Activates the vagus nerve and accelerates muscle recovery."],
      targetMuscles: "Diaphragm, Pelvic Floor, Parasympathetic Nervous System"
    },
    {
      name: "Reclined Bound Angle Pose (Supta Baddha Konasana)",
      muscleGroups: ["Inner Thighs", "Hips", "Pelvic Floor"],
      equipment: "Mat, Optional Pillow",
      defaultReps: "3 Minutes Hold",
      defaultSets: 1,
      instructions: [
        "Lie on back, bring soles of feet together and let knees fall open to sides.",
        "Place hands on lower belly or overhead in diamond shape.",
        "Surrender hip tension completely with each slow exhalation."
      ],
      formTips: ["Gently opens the pelvic bowl and releases emotional pelvic tension."],
      targetMuscles: "Adductors, Groin, Sacroiliac Joint"
    },
    {
      name: "Seated Neck & Trapezius Decompression",
      muscleGroups: ["Neck", "Upper Traps", "Shoulders"],
      equipment: "Mat / Chair",
      defaultReps: "30 seconds per side",
      defaultSets: 2,
      instructions: [
        "Sit tall, place right hand behind back and gently tilt left ear toward left shoulder.",
        "Rest left hand lightly on right side of head for subtle gentle traction (do not pull).",
        "Take 5 deep breaths, then switch to opposite side."
      ],
      formTips: ["Releases chronic shoulder tension from screen time and stress."],
      targetMuscles: "Upper Trapezius, Levator Scapulae, Scalenes"
    },
    {
      name: "Supine Glute Figure-4 Stretch",
      muscleGroups: ["Glutes", "Piriformis", "Hips"],
      equipment: "Mat",
      defaultReps: "60 seconds per leg",
      defaultSets: 2,
      instructions: [
        "Lie on back, cross right ankle over left knee creating a figure-4 shape.",
        "Reach hands through to grasp behind left thigh, gently drawing left knee toward chest.",
        "Keep right foot flexed to protect right knee joint."
      ],
      formTips: ["Sinks deep into piriformis and relieves sciatic tightness."],
      targetMuscles: "Piriformis, Gluteus Medius, Deep Rotators"
    },
    {
      name: "Gentle Supported Bridge with Pillow / Block",
      muscleGroups: ["Lower Back", "Psoas", "Pelvis"],
      equipment: "Yoga Block / Pillow",
      defaultReps: "3 Minutes Hold",
      defaultSets: 1,
      instructions: [
        "Lie on back with knees bent, lift hips slightly and slide yoga block or pillow under sacrum.",
        "Rest full pelvic weight onto support, letting arms relax along sides.",
        "Feel front of hips open naturally without any muscular effort."
      ],
      formTips: ["Decompresses the lumbosacral junction and releases psoas grip."],
      targetMuscles: "Sacrum, Iliopsoas, Anterior Pelvis"
    },
    {
      name: "Side-Lying Quad & Hip Flexor Stretch",
      muscleGroups: ["Quadriceps", "Hip Flexors"],
      equipment: "Mat",
      defaultReps: "45 seconds per leg",
      defaultSets: 2,
      instructions: [
        "Lie on left side with bottom leg slightly bent for balance.",
        "Reach back with right hand to grasp top of right foot or ankle.",
        "Gently draw heel toward glute while pushing hips forward slightly."
      ],
      formTips: ["Keep knees close together; do not let top knee flare up toward ceiling."],
      targetMuscles: "Rectus Femoris, Vastus Lateralis, Psoas"
    },
    {
      name: "Supine Happy Baby Pose (Ananda Balasana)",
      muscleGroups: ["Hips", "Spine", "Inner Thighs"],
      equipment: "Mat",
      defaultReps: "60 seconds continuous",
      defaultSets: 2,
      instructions: [
        "Lie on back, bend knees toward armpits, grab outer edges of feet with hands.",
        "Keep shins perpendicular to floor and pull down gently through hands.",
        "Rock slowly side to side on sacrum like a content baby."
      ],
      formTips: ["Keep tailbone rooted down toward mat."],
      targetMuscles: "Hamstrings, Hip Openers, Sacral Spine"
    },
    {
      name: "Thoracic Foam Roller / Towel Extension",
      muscleGroups: ["Upper Back", "Thoracic Spine", "Posture"],
      equipment: "Foam Roller / Rolled Towel",
      defaultReps: "2 Minutes Hold",
      defaultSets: 1,
      instructions: [
        "Place foam roller or rolled bath towel horizontally across mid-upper back.",
        "Lie back over roller supporting head with interlaced fingers.",
        "Gently extend upper back over roller, taking deep restorative breaths."
      ],
      formTips: ["Keep hips on floor; extend solely through thoracic mid-back."],
      targetMuscles: "Thoracic Extension, Pectoralis Major, Intercostals"
    },
    {
      name: "Mindful Full-Body Kinetic Scan & Savasana",
      muscleGroups: ["Total Body Nervous Reset", "Mind-Muscle"],
      equipment: "Mat",
      defaultReps: "5 Minutes Relaxation",
      defaultSets: 1,
      instructions: [
        "Lie completely flat on mat, feet falling open and arms resting comfortably.",
        "Close eyes and bring mindful awareness to feet, calves, thighs, glutes, core, shoulders, and jaw.",
        "Consciously release all lingering tension on every slow, grounding exhale."
      ],
      formTips: ["Consolidates the neural adaptations from your training journey."],
      targetMuscles: "Total Body Neuromuscular Regeneration"
    }
  ]
};

// Catalog dictionary export for backward compatibility
export const WOMEN_EXERCISE_CATALOG: Record<string, WomenDailyExercise> = {};

function getActiveExercisesFromStorage(): Exercise[] {
  if (typeof window === "undefined" || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem("fit_exercises");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

/**
 * Dynamically resolves the daily workout for Women Confidence Program.
 * Strictly guarantees EXACTLY 10 women-specific exercises daily for all 180 days!
 * Enforces removal of male/heavy bodybuilding movements like cable fly, bench press, etc.
 */
export function getDailyWorkoutForDay(
  dayNumber: number,
  profile?: WomenOnboardingProfile | null,
  activeExercisesList?: Exercise[]
): WomenDailyWorkout {
  const safeDay = Math.max(1, Math.min(180, Number(dayNumber) || 1));
  const phaseNum = Math.min(6, Math.ceil(safeDay / 30));
  const dayInWeek = ((safeDay - 1) % 7) + 1;

  let title = `Day ${safeDay}: `;
  let subtitle = "";
  let focus = "";
  let dayType: "strength" | "conditioning" | "mobility" | "walking" | "stretching" | "active_recovery" | "rest" = "strength";
  let estimatedMinutes = 35;
  let intensity: "Low" | "Moderate" | "Challenging" | "High" = "Moderate";
  let targetTargets: string[] = [];
  let primaryPoolKey: keyof typeof AUTHENTIC_WOMEN_WORKOUT_LIBRARY = "glutes";

  if (dayInWeek === 1) {
    dayType = "strength";
    title += "Monday: Glutes + Hamstrings";
    subtitle = "Target glutes, hamstrings, and the posterior kinetic chain with progressive volume and hip thrust variations.";
    focus = "Glutes + Hamstrings";
    intensity = phaseNum <= 2 ? "Moderate" : "Challenging";
    estimatedMinutes = 35;
    targetTargets = ["Glutes", "Hamstrings", "Lower Body", "Hips"];
    primaryPoolKey = "glutes";
  } else if (dayInWeek === 2) {
    dayType = "strength";
    title += "Tuesday: Upper Body + Core";
    subtitle = "Sculpt postural back fibers, sleek shoulders, toned arms, and compress the deep transverse core.";
    focus = "Upper Body + Core";
    intensity = phaseNum <= 2 ? "Moderate" : "Challenging";
    estimatedMinutes = 30;
    targetTargets = ["Upper Body", "Back", "Shoulders", "Arms", "Core", "Abs"];
    primaryPoolKey = "upper_body_posture";
  } else if (dayInWeek === 3) {
    dayType = "strength";
    title += "Wednesday: Quads + Glutes";
    subtitle = "Sculpt quadriceps definition and round out the glutes with goblet squats, walking lunges, and step-ups.";
    focus = "Quads + Glutes";
    intensity = phaseNum <= 2 ? "Moderate" : "Challenging";
    estimatedMinutes = 35;
    targetTargets = ["Quadriceps", "Glutes", "Legs", "Lower Body"];
    primaryPoolKey = "glutes";
  } else if (dayInWeek === 4) {
    dayType = "conditioning";
    title += "Thursday: Cardio + Core + Mobility";
    subtitle = "Elevate caloric output with low-impact cardio flows, waist compression drills, and thoracic mobility.";
    focus = "Cardio + Core + Mobility";
    intensity = "Moderate";
    estimatedMinutes = 35;
    targetTargets = ["Cardio", "Core", "Abs", "Mobility", "Walking"];
    primaryPoolKey = "cardio_walking";
  } else if (dayInWeek === 5) {
    dayType = "strength";
    title += "Friday: Glutes + Full Lower Body";
    subtitle = "Intense lower body sculpt targeting glute max, glute medius, hamstrings, quads, and calves.";
    focus = "Glutes + Full Lower Body";
    intensity = phaseNum <= 2 ? "Moderate" : "High";
    estimatedMinutes = 40;
    targetTargets = ["Glutes", "Hamstrings", "Quadriceps", "Calves", "Lower Body"];
    primaryPoolKey = "glutes";
  } else if (dayInWeek === 6) {
    dayType = "conditioning";
    title += "Saturday: Full Body Conditioning";
    subtitle = "High-energy metabolic circuit combining multi-planar movements for full body tone and endurance.";
    focus = "Full Body Conditioning";
    intensity = "Challenging";
    estimatedMinutes = 35;
    targetTargets = ["Full Body", "Conditioning", "Cardio", "Tone"];
    primaryPoolKey = "full_body";
  } else {
    dayType = "active_recovery";
    title += "Sunday: Recovery";
    subtitle = "Gentle parasympathetic decompression, full body stretches, and restorative recovery.";
    focus = "Recovery";
    intensity = "Low";
    estimatedMinutes = 30;
    targetTargets = ["Recovery", "Mobility", "Stretching", "Rest"];
    primaryPoolKey = "recovery_rest";
  }

  // 1. Gather all active exercises from library, filtering out ANY strong men / cable fly exercises
  const allActiveRaw = Array.isArray(activeExercisesList) && activeExercisesList.length > 0
    ? activeExercisesList
    : getActiveExercisesFromStorage();

  const womenEligibleActive = allActiveRaw.filter(isWomenWorkoutEligibleExercise);
  const matchedActive = filterExercisesForSplit(womenEligibleActive, targetTargets);

  // 2. Curated pool of authentic women's exercises for this day
  const authenticPool = AUTHENTIC_WOMEN_WORKOUT_LIBRARY[primaryPoolKey] || AUTHENTIC_WOMEN_WORKOUT_LIBRARY.glutes;
  const secondaryPool = primaryPoolKey === "glutes" 
    ? AUTHENTIC_WOMEN_WORKOUT_LIBRARY.core_waist 
    : primaryPoolKey === "upper_body_posture"
      ? AUTHENTIC_WOMEN_WORKOUT_LIBRARY.full_body
      : AUTHENTIC_WOMEN_WORKOUT_LIBRARY.glutes;

  // 3. Assemble exactly 10 exercises daily
  const finalExercisesList: WomenDailyExercise[] = [];
  const seenExerciseNames = new Set<string>();

  // 0. Check admin schedule overrides specifically saved for Women Confidence in AdminWorkoutChallengeEngine
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem("fit_program_schedule_overrides");
      if (stored) {
        const parsed = JSON.parse(stored);
        const womenOverrides = parsed.women_confidence || parsed["women-confidence"] || {};
        const cycleKey = `cycle_${dayInWeek}`;
        const dayOverride = womenOverrides[String(safeDay)] || womenOverrides[cycleKey];
        if (dayOverride && Array.isArray(dayOverride.exercises) && dayOverride.exercises.length > 0) {
          const overrideList: WomenDailyExercise[] = [];
          for (const ovEx of dayOverride.exercises) {
            const exName = (ovEx.exerciseName || ovEx.name || "").trim();
            const lower = exName.toLowerCase();
            if (exName && !seenExerciseNames.has(lower) && isWomenWorkoutEligibleExercise(ovEx)) {
              seenExerciseNames.add(lower);
              overrideList.push({
                id: ovEx.id || `wc_ov_d${safeDay}_${overrideList.length + 1}`,
                name: exName,
                muscleGroups: Array.isArray(ovEx.muscleGroup) ? ovEx.muscleGroup : [ovEx.muscleGroup || targetTargets[0] || "Full Body"],
                sets: Number(ovEx.sets) || 3,
                reps: String(ovEx.reps || "10-12 reps"),
                restPeriod: ovEx.restTime || "45-60s",
                equipment: Array.isArray(ovEx.equipment) ? ovEx.equipment.join(", ") : String(ovEx.equipment || "Bodyweight"),
                difficulty: ovEx.difficulty || "Intermediate",
                instructions: Array.isArray(ovEx.instructions) && ovEx.instructions.length > 0 ? ovEx.instructions : [`Perform ${exName} with strict posture and smooth control.`],
                formTips: ovEx.coachingCues || ["Maintain tight core posture and elongated spine."],
                beginnerModification: "Perform at bodyweight or reduce repetition range.",
                advancedProgression: "Add tempo pause at peak contraction.",
                gifUrl: ovEx.gifUrl || "",
                targetMuscles: Array.isArray(ovEx.muscleGroup) ? ovEx.muscleGroup.join(", ") : String(ovEx.muscleGroup || "Full Body")
              });
            }
          }

          if (overrideList.length > 0) {
            return {
              dayNumber: safeDay,
              phaseNumber: phaseNum,
              dayType: dayOverride.isCardioOnly ? "conditioning" : dayType,
              title: dayOverride.title || title,
              subtitle: dayOverride.focus || subtitle,
              focus: dayOverride.focus || focus,
              estimatedMinutes: dayOverride.estimatedDuration || estimatedMinutes,
              intensity,
              calorieEstimate: 320 + safeDay * 2,
              exercises: overrideList,
              coachingCue: "Focus on deep mind-muscle connection and deliberate tempo on every single rep."
            };
          }
        }
      }
    }
  } catch (e) {}

  // Add eligible matched exercises from custom library first (if any)
  for (const ex of matchedActive) {
    if (finalExercisesList.length >= 10) break;
    const cleanName = (ex.name || "").trim();
    const lower = cleanName.toLowerCase();
    if (!seenExerciseNames.has(lower) && isWomenWorkoutEligibleExercise(ex)) {
      seenExerciseNames.add(lower);
      const mediaUrl = ex.customMediaUrl || ex.gifUrl || ex.imageUrl || "";
      finalExercisesList.push({
        id: `wc_d${safeDay}_ex${finalExercisesList.length + 1}`,
        name: cleanName,
        muscleGroups: ex.muscleGroups || targetTargets,
        sets: Number(ex.recommendedSets) || (phaseNum >= 3 ? 4 : 3),
        reps: ex.recommendedReps || (phaseNum >= 4 ? "10-12 reps" : "12-15 reps"),
        restPeriod: ex.restTime || "45-60s",
        equipment: Array.isArray(ex.equipment) ? ex.equipment.join(", ") : String(ex.equipment || "Bodyweight"),
        difficulty: ex.difficulty || (phaseNum >= 4 ? "Advanced" : "Intermediate"),
        instructions: ex.instructions && ex.instructions.length > 0 ? ex.instructions : [
          `Assume starting alignment for ${cleanName}.`,
          `Execute with smooth cadence and deep mind-muscle connection.`,
          `Squeeze target muscle at peak contraction, return under control.`
        ],
        formTips: ex.trainerTips ? [ex.trainerTips] : ["Maintain elongated neutral spine and controlled breathing."],
        beginnerModification: "Perform at bodyweight or reduce repetition range slightly.",
        advancedProgression: "Add a 2-second isometric pause at peak contraction.",
        gifUrl: mediaUrl,
        targetMuscles: (ex.muscleGroups || targetTargets).join(", ")
      });
    }
  }

  // Replenish from authentic pool with deterministic offset for 180 distinct day rotations
  const dayOffset = (safeDay * 3 + phaseNum * 2) % authenticPool.length;
  for (let i = 0; i < authenticPool.length; i++) {
    if (finalExercisesList.length >= 10) break;
    const item = authenticPool[(dayOffset + i) % authenticPool.length];
    const lower = item.name.toLowerCase();
    if (!seenExerciseNames.has(lower)) {
      seenExerciseNames.add(lower);
      finalExercisesList.push({
        id: `wc_d${safeDay}_ex${finalExercisesList.length + 1}`,
        name: item.name,
        muscleGroups: item.muscleGroups,
        sets: phaseNum >= 4 ? Math.min(4, item.defaultSets + 1) : item.defaultSets,
        reps: phaseNum >= 4 && !item.defaultReps.includes("min") && !item.defaultReps.includes("s")
          ? "10-12 reps (heavier)"
          : item.defaultReps,
        restPeriod: "45-60s",
        equipment: item.equipment,
        difficulty: phaseNum >= 4 ? "Advanced" : phaseNum >= 2 ? "Intermediate" : "Beginner",
        instructions: item.instructions,
        formTips: item.formTips,
        beginnerModification: "Reduce repetition count by 2-3 reps or perform at bodyweight.",
        advancedProgression: "Slow down eccentric phase to 3 seconds or increase resistance band tension.",
        gifUrl: "",
        targetMuscles: item.targetMuscles
      });
    }
  }

  // If still fewer than 10, pull from complementary secondary pool
  for (let i = 0; i < secondaryPool.length; i++) {
    if (finalExercisesList.length >= 10) break;
    const item = secondaryPool[(safeDay + i) % secondaryPool.length];
    const lower = item.name.toLowerCase();
    if (!seenExerciseNames.has(lower)) {
      seenExerciseNames.add(lower);
      finalExercisesList.push({
        id: `wc_d${safeDay}_ex${finalExercisesList.length + 1}`,
        name: item.name,
        muscleGroups: item.muscleGroups,
        sets: item.defaultSets,
        reps: item.defaultReps,
        restPeriod: "45-60s",
        equipment: item.equipment,
        difficulty: "Intermediate",
        instructions: item.instructions,
        formTips: item.formTips,
        beginnerModification: "Perform at comfortable pace.",
        advancedProgression: "Add tempo pulse.",
        gifUrl: "",
        targetMuscles: item.targetMuscles
      });
    }
  }

  // Strictly enforce EXACTLY 10 workouts daily
  const guaranteed10Exercises = finalExercisesList.slice(0, 10);

  const coachingCues = [
    "Focus on mind-muscle connection over heavy ego lifting. Feel the target glute and posture fibers ignite with every repetition.",
    "Breathe rhythmically. Inhale into your ribcage during the lowering phase, exhale firmly through pursed lips on exertion.",
    "Keep your shoulders depressed and shoulder blades pinned down. You are building confident, elegant posture from within.",
    "Form is your foundation. Never rush a repetition; treat each rep as an individual display of feminine strength and grace.",
    "Hydrate between sets with steady sips. Prime your body for optimal kinetic output."
  ];

  const coachingCue = coachingCues[(safeDay - 1) % coachingCues.length];

  return {
    dayNumber: safeDay,
    phaseNumber: phaseNum,
    title,
    subtitle,
    focus,
    dayType,
    estimatedMinutes,
    intensity,
    calorieEstimate: (dayType as string) === "active_recovery" ? 220 : (dayType as string) === "mobility" ? 240 : estimatedMinutes * 8,
    exercises: guaranteed10Exercises,
    coachingCue
  };
}

export function getDailyLifestyleForDay(
  dayNumber: number,
  profile?: WomenOnboardingProfile | null
): WomenDailyLifestyle {
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
      prompt: "In your conversations today, eliminate unnecessary minimizing phrases like 'I'm just asking'. Speak with calm, assured certainty.",
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
      prompt: "Look into your own eyes in the mirror today with warmth, respect, and deep appreciation for your journey.",
      action: "Spend 30 seconds smiling in the mirror and thanking yourself for showing up consistently."
    }
  ];

  const challenge = confidenceChallenges[(dayNumber - 1) % confidenceChallenges.length];

  return {
    dayNumber,
    stepTarget: calculatedSteps,
    waterTargetLiters: calculatedWater,
    sleepTargetHours: profile?.sleepScheduleHours || 8,
    mealGuidance: {
      focus: "Lean Protein Foundation for Muscle Tone",
      proteinTip: "Aim for 25-30g of high-quality protein per meal to support muscle recovery and steady satiety.",
      produceTip: "Fill half your plate with vibrant green vegetables rich in micronutrients and fiber.",
      sampleMealIdea: "Herb-baked salmon or grilled tofu with roasted sweet potato wedges and steamed asparagus."
    },
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
    journalPrompt: "What is one physical or mental barrier you overcame this week that proved to you just how strong you are?"
  };
}
