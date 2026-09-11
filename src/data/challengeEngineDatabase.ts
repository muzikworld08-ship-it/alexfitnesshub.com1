import { ProgramId, ProgramMetadata, ChallengeExerciseItem, DayWorkoutMeta, DayExecutionPlan } from "../types/challengeEngine";
import { getExerciseGifUrl } from "./exercises";
import {
  HOME_UPPER_BODY_EXERCISES,
  HOME_LEGS_GLUTES_EXERCISES,
  HOME_CARDIO_EXERCISES,
  HOME_BACK_EXERCISES,
  HOME_CORE_ABS_EXERCISES,
  HOME_MOBILITY_EXERCISES,
  HOME_180_EXERCISES_POOL
} from "./home180ProgramData";
import {
  BELLY_CORE_EXERCISES,
  BELLY_HIIT_EXERCISES,
  BELLY_CARDIO_EXERCISES,
  BELLY_OBLIQUES_EXERCISES,
  BELLY_CONDITIONING_EXERCISES,
  BELLY_FAT_EXERCISES_POOL
} from "./bellyFatProgramData";
import {
  POSTURE_CORRECTION_EXERCISES,
  POSTURE_CHEST_OPENING_EXERCISES,
  POSTURE_HIP_MOBILITY_EXERCISES,
  POSTURE_SPINAL_MOBILITY_EXERCISES,
  POSTURE_GLUTE_ACTIVATION_EXERCISES,
  POSTURE_DAILY_MOVEMENT_EXERCISES,
  POSTURE_VITALITY_POOL
} from "./postureVitalityProgramData";

// Re-export pools so external consumers remain backwards compatible
export {
  HOME_UPPER_BODY_EXERCISES,
  HOME_LEGS_GLUTES_EXERCISES,
  HOME_CARDIO_EXERCISES,
  HOME_BACK_EXERCISES,
  HOME_CORE_ABS_EXERCISES,
  HOME_MOBILITY_EXERCISES,
  HOME_180_EXERCISES_POOL,
  BELLY_CORE_EXERCISES,
  BELLY_HIIT_EXERCISES,
  BELLY_CARDIO_EXERCISES,
  BELLY_OBLIQUES_EXERCISES,
  BELLY_CONDITIONING_EXERCISES,
  BELLY_FAT_EXERCISES_POOL,
  POSTURE_CORRECTION_EXERCISES,
  POSTURE_CHEST_OPENING_EXERCISES,
  POSTURE_HIP_MOBILITY_EXERCISES,
  POSTURE_SPINAL_MOBILITY_EXERCISES,
  POSTURE_GLUTE_ACTIVATION_EXERCISES,
  POSTURE_DAILY_MOVEMENT_EXERCISES,
  POSTURE_VITALITY_POOL
};

// ============================================================================
// 1. FIVE INDEPENDENT PROGRAM METADATA
// ============================================================================
export const CHALLENGE_PROGRAMS_METADATA: Record<ProgramId, ProgramMetadata> = {
  immortal_90: {
    id: "immortal_90",
    name: "Immortal 90 Day Challenge",
    tagline: "The 7-Day Science-Based Muscle Split with Progressive Overload",
    totalDays: 90,
    description: "The premier 90-day hypertrophy and athletic conditioning cycle. Built upon a strict 7-day rolling cadence alternating targeted muscle groups with dedicated 5-10 KM cardio pacing and rest.",
    accentColor: "from-amber-500 to-red-600",
    badge: "Flagship 90 Days",
    categories: [
      "Chest + Triceps",
      "Back + Biceps + Forearm",
      "5 to 10 KM Cardio / Walking",
      "Legs + Shoulders + Abs",
      "Chest + Triceps",
      "Back + Biceps",
      "5 to 10 KM Running / Walking"
    ],
    equipmentRequired: ["Barbell", "Dumbbells", "Cable Machine", "Bench", "Pull-up Bar"],
    coverImage: "https://media.giphy.com/media/3o84U6421O1IIXbowg/giphy.gif"
  },
  home_180: {
    id: "home_180",
    name: "180 Day Home Workout Challenge",
    tagline: "Zero & Minimal Equipment Bodyweight & Calisthenics Mastery",
    totalDays: 180,
    description: "180 days of progressive home-compatible training. Features calisthenics, core armor, mobility flows, and cardiovascular conditioning that can be executed anywhere.",
    accentColor: "from-emerald-500 to-teal-700",
    badge: "180 Days Home",
    categories: [
      "Upper body",
      "Chest",
      "Back",
      "Shoulders",
      "Arms",
      "Core and abs",
      "Legs and glutes",
      "Full body",
      "Cardio",
      "Mobility and recovery"
    ],
    equipmentRequired: ["Bodyweight", "Optional Resistance Bands", "Yoga Mat"],
    coverImage: "https://media.giphy.com/media/3o84U6421O1IIXbowg/giphy.gif"
  },
  women_confidence: {
    id: "women_confidence",
    name: "Women Confidence Program",
    tagline: "Glute Sculpting, Athletic Toning, Core Stability & Vitality",
    totalDays: 180,
    description: "A comprehensive 180-day program specifically engineered for female biomechanics, metabolic health, glute hypertrophy, posture alignment, and hormonal vitality.",
    accentColor: "from-pink-500 to-rose-600",
    badge: "180 Days Women",
    categories: [
      "Lower body",
      "Glutes",
      "Legs",
      "Core and abs",
      "Upper body",
      "Arms",
      "Back",
      "Shoulders",
      "Full body",
      "Cardio",
      "Mobility",
      "Confidence and wellness sessions"
    ],
    equipmentRequired: ["Dumbbells", "Booty Bands", "Yoga Mat", "Bench or Chair"],
    coverImage: "https://media.giphy.com/media/v1F0A8f5Ff6hO/giphy.gif"
  },
  belly_fat_shred: {
    id: "belly_fat_shred",
    name: "Belly Fat Shred System",
    tagline: "Deep Visceral Fat Mobilization, Core Armor & Metabolic Conditioning",
    totalDays: 150,
    description: "A high-density core strengthening and cardiovascular protocol designed to accelerate full-body fat loss, enhance aerobic capacity, and build an unbreakable abdominal wall.",
    accentColor: "from-orange-500 to-amber-600",
    badge: "5 Months Core & Shred",
    scientificDisclaimer: "Scientific Notice: Targeted abdominal exercises build, thicken, and strengthen the abdominal muscles, but spot reduction of fat is biologically impossible. Overall systemic fat loss is driven by consistent energy balance (caloric deficit), cardiovascular activity, progressive resistance training, and metabolic recovery.",
    categories: [
      "Core",
      "Abs",
      "Obliques",
      "Full body conditioning",
      "Cardio",
      "HIIT",
      "Walking or running",
      "Mobility and recovery"
    ],
    equipmentRequired: ["Bodyweight", "Jump Rope", "Treadmill or Outdoors", "Light Dumbbells"],
    coverImage: "https://media.giphy.com/media/xT8qB7Sbwskk27Rdy8/giphy.gif"
  },
  posture_vitality: {
    id: "posture_vitality",
    name: "Reclaim Your Posture & Vitality",
    tagline: "Spinal Decompression, Joint Longevity, Scapular Control & Freedom",
    totalDays: 60,
    description: "Eradicate tech neck, anterior pelvic tilt, rounded shoulders, and lower back tension through corrective biomechanics, dynamic mobility, and deep stabilizer recruitment.",
    accentColor: "from-blue-500 to-indigo-700",
    badge: "60 Days Corrective",
    categories: [
      "Posture correction",
      "Upper back",
      "Neck mobility",
      "Shoulder mobility",
      "Chest opening",
      "Spinal mobility",
      "Hip mobility",
      "Core stability",
      "Glute activation",
      "Balance",
      "Stretching",
      "Recovery",
      "Daily movement"
    ],
    equipmentRequired: ["Yoga Mat", "Resistance Band or Towel", "Foam Roller"],
    coverImage: "https://media.giphy.com/media/26AHG5KGFxSkUWw1i/giphy.gif"
  }
};

// ============================================================================
// 2. EXERCISE DATABASE CATALOG (STRICTLY ASSIGNED WITH METADATA)
// ============================================================================

// --- PROGRAM 1: IMMORTAL 90 DAY CHALLENGE MASTER EXERCISES ---
const IMMORTAL_CHEST_TRICEPS: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest + Triceps",
    muscleGroup: ["Chest"],
    exerciseName: "Barbell Bench Press",
    equipment: "Barbell & Bench",
    difficulty: "Intermediate",
    sets: 4,
    reps: "8-10",
    duration: "45s set",
    instructions: [
      "Lie flat on the bench with feet driven firmly into the floor.",
      "Grip the barbell slightly wider than shoulder-width and retract your shoulder blades.",
      "Lower the bar with control to your mid-sternum, then press up explosively to lockout."
    ],
    restTime: "90s",
    coachingCues: ["Keep elbows tucked at ~45 degrees", "Drive with your legs without arching excessively"],
    gifUrl: "https://media.giphy.com/media/3o84U6421O1IIXbowg/giphy.gif"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest + Triceps",
    muscleGroup: ["Chest"],
    exerciseName: "Incline Dumbbell Chest Press",
    equipment: "Dumbbells & Incline Bench",
    difficulty: "Intermediate",
    sets: 4,
    reps: "10-12",
    duration: "45s set",
    instructions: [
      "Set an incline bench to 30 degrees.",
      "Press the dumbbells upward above your upper chest with wrists stacked over elbows.",
      "Lower under control feeling a deep stretch across the clavicular head of the pectorals."
    ],
    restTime: "75s",
    coachingCues: ["Do not bang dumbbells at the top", "Squeeze upper pecs hard at contraction"]
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest + Triceps",
    muscleGroup: ["Chest"],
    exerciseName: "Chest Dips",
    equipment: "Dip Station",
    difficulty: "Advanced",
    sets: 3,
    reps: "10-12",
    duration: "40s set",
    instructions: [
      "Grip parallel bars and lean your torso slightly forward (~30 degrees).",
      "Lower your body until your shoulders are slightly below elbows.",
      "Contract pectorals to push back to starting position."
    ],
    restTime: "90s",
    coachingCues: ["Forward lean targets chest; upright posture shifts focus to triceps"]
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest + Triceps",
    muscleGroup: ["Chest"],
    exerciseName: "Cable Chest Fly",
    equipment: "Cable Machine",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    duration: "40s set",
    instructions: [
      "Step forward into a staggered stance with pulleys at chest height.",
      "Keep a slight bend in your elbows and bring hands together in a hugging motion.",
      "Pause for 1 second at full squeeze, resisting the weight on the way back."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest + Triceps",
    muscleGroup: ["Chest"],
    exerciseName: "Decline Bench Press",
    equipment: "Dumbbells & Decline Bench",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12",
    duration: "45s set",
    instructions: [
      "Secure legs in decline bench, bring dumbbells to lower chest line.",
      "Press directly upward, locking in lower pectoral engagement.",
      "Control the descent for 3 seconds."
    ],
    restTime: "75s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest + Triceps",
    muscleGroup: ["Chest"],
    exerciseName: "Standard Push Ups",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: 3,
    reps: "15-20",
    duration: "40s set",
    instructions: [
      "Assume a rigid high plank with hands directly beneath shoulders.",
      "Lower chest until 1 inch off the floor, keeping core engaged and glutes tight.",
      "Press through palms to full arm extension."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest + Triceps",
    muscleGroup: ["Triceps"],
    exerciseName: "Triceps Pushdown",
    equipment: "Cable Machine & Rope",
    difficulty: "Beginner",
    sets: 4,
    reps: "12-15",
    duration: "40s set",
    instructions: [
      "Attach a rope to high pulley, pin elbows against your ribcage.",
      "Extend arms downward and flare the rope outwards at the bottom.",
      "Squeeze lateral and medial triceps heads intensely before returning with control."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest + Triceps",
    muscleGroup: ["Triceps"],
    exerciseName: "Skull Crushers",
    equipment: "EZ-Bar & Flat Bench",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12",
    duration: "45s set",
    instructions: [
      "Lie on flat bench holding EZ-bar with narrow overhand grip.",
      "Keeping upper arms stationary, hinge at elbows to lower bar towards your forehead.",
      "Extend forearms upward using triceps force alone."
    ],
    restTime: "75s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest + Triceps",
    muscleGroup: ["Triceps"],
    exerciseName: "Overhead Triceps Extension",
    equipment: "Single Heavy Dumbbell",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12",
    duration: "40s set",
    instructions: [
      "Sit upright, cup a dumbbell with both hands directly above your head.",
      "Lower dumbbell behind head while keeping elbows pointing forward.",
      "Press weight back up to lock out the long head of the triceps."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest + Triceps",
    muscleGroup: ["Triceps"],
    exerciseName: "Diamond Push Ups",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-15",
    duration: "40s set",
    instructions: [
      "Form a diamond shape with index fingers and thumbs under your sternum.",
      "Lower chest to touch diamond and press up with triceps lockout."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest + Triceps",
    muscleGroup: ["Chest"],
    exerciseName: "Dumbbell Pullover",
    equipment: "Dumbbell & Flat Bench",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12",
    duration: "45s set",
    instructions: [
      "Lie perpendicular across a flat bench with shoulder blades supported and hips slightly dropped.",
      "Hold a dumbbell with both hands in a diamond cup grip over your chest.",
      "Lower the dumbbell in a slow arc behind your head, feeling a deep stretch across pectorals and serratus anterior.",
      "Pull the dumbbell back up in a controlled arc to chest level."
    ],
    restTime: "75s",
    coachingCues: ["Keep a slight bend in elbows throughout", "Focus on chest expansion at the bottom"]
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest + Triceps",
    muscleGroup: ["Triceps"],
    exerciseName: "Close-Grip Barbell Bench Press",
    equipment: "Barbell & Flat Bench",
    difficulty: "Intermediate",
    sets: 3,
    reps: "8-10",
    duration: "45s set",
    instructions: [
      "Lie on flat bench with hands spaced shoulder-width apart on the barbell.",
      "Keep elbows tucked close to your torso as you lower the bar to your lower chest.",
      "Drive upward forcefully through the palms, focusing on triceps contraction at lockout."
    ],
    restTime: "90s",
    coachingCues: ["Do not grip excessively narrow to protect wrists", "Lock out triceps cleanly at the apex"]
  }
];

const IMMORTAL_BACK_BICEPS: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back + Biceps",
    muscleGroup: ["Back"],
    exerciseName: "Deadlift",
    equipment: "Barbell & Plates",
    difficulty: "Advanced",
    sets: 4,
    reps: "5-6",
    duration: "50s set",
    instructions: [
      "Stand with shins 1 inch from bar, feet hip-width apart.",
      "Hinge at hips, grip bar firmly, set lats back and lock core.",
      "Drive through heels and extend hips and knees simultaneously."
    ],
    restTime: "120s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back + Biceps",
    muscleGroup: ["Back"],
    exerciseName: "Pull Ups",
    equipment: "Pull-up Bar",
    difficulty: "Advanced",
    sets: 4,
    reps: "8-10",
    duration: "40s set",
    instructions: [
      "Grip bar wider than shoulder width with overhand grip.",
      "Retract scapulae and pull chest up to the bar.",
      "Lower with a 3-second eccentric stretch to a dead hang."
    ],
    restTime: "90s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back + Biceps",
    muscleGroup: ["Back"],
    exerciseName: "Barbell Row",
    equipment: "Barbell",
    difficulty: "Intermediate",
    sets: 4,
    reps: "8-10",
    duration: "45s set",
    instructions: [
      "Hinge at hips to a 45-degree angle with a flat spine.",
      "Row bar toward your belly button, driving with elbows.",
      "Lower bar under control."
    ],
    restTime: "90s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back + Biceps",
    muscleGroup: ["Back"],
    exerciseName: "Lat Pulldown",
    equipment: "Lat Pulldown Machine",
    difficulty: "Beginner",
    sets: 3,
    reps: "10-12",
    duration: "40s set",
    instructions: [
      "Sit with thighs snug under pads, grip bar wide.",
      "Pull bar down to upper clavicle, squeezing lats downward.",
      "Slowly extend arms back to starting stretch."
    ],
    restTime: "75s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back + Biceps",
    muscleGroup: ["Back"],
    exerciseName: "Seated Cable Row",
    equipment: "Low Row Cable Machine",
    difficulty: "Beginner",
    sets: 3,
    reps: "10-12",
    duration: "40s set",
    instructions: [
      "Sit upright with slight knee bend, grip close-grip handle.",
      "Pull handle into midsection while pinning shoulder blades together."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back + Biceps",
    muscleGroup: ["Biceps"],
    exerciseName: "Barbell Curl",
    equipment: "Barbell",
    difficulty: "Intermediate",
    sets: 4,
    reps: "8-10",
    duration: "40s set",
    instructions: [
      "Stand tall holding barbell shoulder-width with underhand grip.",
      "Curl bar upward without swinging your hips.",
      "Squeeze biceps at the top and lower with 3-second cadence."
    ],
    restTime: "75s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back + Biceps",
    muscleGroup: ["Biceps"],
    exerciseName: "Incline Dumbbell Curl",
    equipment: "Dumbbells & Incline Bench",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12",
    duration: "40s set",
    instructions: [
      "Sit on 45-degree incline bench with arms hanging fully extended.",
      "Curl dumbbells upward while supinating wrists (palms facing shoulders).",
      "Maximizes stretch on the long head of the biceps."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back + Biceps",
    muscleGroup: ["Biceps"],
    exerciseName: "Dumbbell Hammer Curls",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    sets: 3,
    reps: "10-12",
    duration: "40s set",
    instructions: [
      "Hold dumbbells with neutral grip (palms facing each other).",
      "Curl weights upward targeting the brachialis and brachioradialis.",
      "Control the descent."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back + Biceps",
    muscleGroup: ["Biceps"],
    exerciseName: "Preacher Curl",
    equipment: "Preacher Bench & EZ-Bar",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12",
    duration: "40s set",
    instructions: [
      "Rest upper arms flat against preacher pad.",
      "Curl EZ-bar upward to peak contraction without lifting elbows off pad."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back + Biceps",
    muscleGroup: ["Back"],
    exerciseName: "Single-Arm Dumbbell Row",
    equipment: "Dumbbell & Flat Bench",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12 / side",
    duration: "45s set",
    instructions: [
      "Place one knee and hand on flat bench, keeping back flat and spine neutral.",
      "Pull dumbbell up towards your hip pocket, driving elbow towards the ceiling.",
      "Lower with a full stretch at the bottom of each repetition."
    ],
    restTime: "60s",
    coachingCues: ["Do not rotate torso at the top", "Squeeze lat peak at hip pocket"]
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back + Biceps",
    muscleGroup: ["Back"],
    exerciseName: "T-Bar Row",
    equipment: "T-Bar Landmine Station",
    difficulty: "Intermediate",
    sets: 3,
    reps: "8-10",
    duration: "45s set",
    instructions: [
      "Straddle the bar with feet shoulder-width apart, hinge at hips with flat back.",
      "Pull handles into your upper abdomen, retracting shoulder blades with maximum force.",
      "Lower under control without rounding lower spine."
    ],
    restTime: "75s",
    coachingCues: ["Maintain 45-degree hip hinge", "Drive with elbows not biceps"]
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back + Biceps",
    muscleGroup: ["Biceps"],
    exerciseName: "Concentration Curl",
    equipment: "Dumbbell & Flat Bench",
    difficulty: "Beginner",
    sets: 3,
    reps: "10-12 / side",
    duration: "40s set",
    instructions: [
      "Sit on flat bench with legs spread, brace elbow against inner thigh.",
      "Curl dumbbell upward towards your face, keeping upper body completely still.",
      "Squeeze bicep peak at the top for 1 full second."
    ],
    restTime: "60s",
    coachingCues: ["No momentum or swinging", "Isolate the bicep peak"]
  }
];

const IMMORTAL_CARDIO_RECOVERY: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "5 to 10 KM Cardio / Walking",
    muscleGroup: ["Cardio"],
    exerciseName: "Running",
    equipment: "Running Shoes & Outdoors or Treadmill",
    difficulty: "Beginner",
    sets: 1,
    reps: "5-10 KM",
    duration: "45-75 mins",
    instructions: [
      "Complete a 5 to 10 kilometer outdoor jog, brisk walk, or treadmill session.",
      "Maintain a steady Zone 2 heart rate (conversational pace).",
      "Hydrate continuously with water and electrolytes.",
      "No resistance or weight training is permitted today — prioritize aerobic efficiency and joint decompression."
    ],
    restTime: "Continuous pacing",
    coachingCues: ["Keep cadence light and smooth", "Breathe through nose and diaphragm"]
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "5 to 10 KM Cardio / Walking",
    muscleGroup: ["Recovery"],
    exerciseName: "Walking",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 1,
    reps: "15 mins",
    duration: "15 mins",
    instructions: [
      "Lie supine with legs elevated against a wall for 5 minutes.",
      "Practice 4-7-8 diaphragmatic breathing to stimulate parasympathetic recovery.",
      "Drink 1 liter of mineral-rich water to restore cellular hydration."
    ],
    restTime: "Complete rest post-cardio",
    coachingCues: ["Let all skeletal muscles completely disengage"]
  }
];

const IMMORTAL_LEGS_SHOULDERS: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs + Shoulders",
    muscleGroup: ["Legs"],
    exerciseName: "Barbell Squat",
    equipment: "Squat Rack & Barbell",
    difficulty: "Advanced",
    sets: 4,
    reps: "8-10",
    duration: "50s set",
    instructions: [
      "Rest bar across traps, brace core 360 degrees.",
      "Squat down until hips pass knees, maintaining neutral spine.",
      "Drive out of hole through midfoot and heels."
    ],
    restTime: "120s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs + Shoulders",
    muscleGroup: ["Legs"],
    exerciseName: "Romanian Deadlift",
    equipment: "Dumbbells or Barbell",
    difficulty: "Intermediate",
    sets: 4,
    reps: "10-12",
    duration: "45s set",
    instructions: [
      "Hold weights at hips, soft bend in knees.",
      "Hinge hips straight backward, lowering weights along shins until hamstrings are stretched.",
      "Drive hips forward to stand."
    ],
    restTime: "90s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs + Shoulders",
    muscleGroup: ["Legs"],
    exerciseName: "Leg Press",
    equipment: "Leg Press",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12-15",
    duration: "45s set",
    instructions: [
      "Position feet shoulder-width on sled.",
      "Lower sled until knees reach 90 degrees.",
      "Press through full foot without locking knees."
    ],
    restTime: "75s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs + Shoulders",
    muscleGroup: ["Legs"],
    exerciseName: "Walking Lunges",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12 steps per leg",
    duration: "45s set",
    instructions: [
      "Step forward into deep lunge, back knee tapping floor softly.",
      "Drive up through front heel into the next stride."
    ],
    restTime: "75s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs + Shoulders",
    muscleGroup: ["Legs"],
    exerciseName: "Calf Raises",
    equipment: "Calf Machine or Step & Dumbbell",
    difficulty: "Beginner",
    sets: 4,
    reps: "15-20",
    duration: "40s set",
    instructions: [
      "Stand on balls of feet, drop heels down for full stretch.",
      "Press up onto big toes for 2-second isometric contraction."
    ],
    restTime: "45s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs + Shoulders",
    muscleGroup: ["Shoulders"],
    exerciseName: "Standing Dumbbell Overhead Shoulder Press",
    equipment: "Dumbbells & 90-degree Bench",
    difficulty: "Intermediate",
    sets: 4,
    reps: "8-10",
    duration: "45s set",
    instructions: [
      "Sit upright, bring dumbbells to ear height.",
      "Press dumbbells upward in slight arc until arms are extended overhead.",
      "Lower under control for 3 seconds."
    ],
    restTime: "90s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs + Shoulders",
    muscleGroup: ["Shoulders"],
    exerciseName: "Dumbbell Lateral Raises",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    sets: 4,
    reps: "12-15",
    duration: "40s set",
    instructions: [
      "Stand tall, raise dumbbells out to sides leading with elbows.",
      "Pause at shoulder height, then lower smoothly without swinging."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs + Shoulders",
    muscleGroup: ["Shoulders"],
    exerciseName: "Face Pulls",
    equipment: "Cable Machine & Rope",
    difficulty: "Beginner",
    sets: 3,
    reps: "15",
    duration: "40s set",
    instructions: [
      "Set cable at eye level, pull rope handles toward bridge of nose while externally rotating hands."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs + Shoulders",
    muscleGroup: ["Shoulders"],
    exerciseName: "Rear Delt Fly",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    duration: "40s set",
    instructions: [
      "Hinge forward at hips, fly dumbbells out wide squeezing posterior deltoids."
    ],
    restTime: "60s"
  }
];

const IMMORTAL_BACK_BICEPS_FOREARMS: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  ...IMMORTAL_BACK_BICEPS.slice(0, 9).map(ex => ({ ...ex, category: "Back + Biceps + Forearm" })),
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back + Biceps + Forearm",
    muscleGroup: ["Forearms"],
    exerciseName: "Behind-the-Back Barbell Wrist Curl",
    equipment: "Barbell & Flat Bench",
    difficulty: "Beginner",
    sets: 3,
    reps: "15-20",
    duration: "35s set",
    instructions: [
      "Rest forearms on bench with wrists hanging over the edge, palms facing upward.",
      "Curl wrists upward, squeezing forearm flexors tightly.",
      "Lower bar slowly down into finger tips."
    ],
    restTime: "45s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back + Biceps + Forearm",
    muscleGroup: ["Forearms"],
    exerciseName: "Zottman Dumbbell Reverse Curls",
    equipment: "EZ-Bar",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    duration: "40s set",
    instructions: [
      "Grip EZ-bar with overhand (pronated) grip.",
      "Curl bar upward to develop top brachioradialis and wrist extensors.",
      "Lower bar with smooth eccentric control."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back + Biceps + Forearm",
    muscleGroup: ["Forearms"],
    exerciseName: "Dumbbell Suitcase Carry",
    equipment: "Heavy Dumbbells",
    difficulty: "Intermediate",
    sets: 3,
    reps: "45 seconds walk",
    duration: "45s set",
    instructions: [
      "Pick up heavy dumbbells with crushing grip.",
      "Walk with proud posture, shoulders pinned back, without allowing weights to swing."
    ],
    restTime: "60s"
  }
];

const IMMORTAL_LEGS_SHOULDERS_ABS: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  ...IMMORTAL_LEGS_SHOULDERS.map(ex => ({ ...ex, category: "Legs + Shoulders + Abs" })),
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs + Shoulders + Abs",
    muscleGroup: ["Abs"],
    exerciseName: "Hanging Leg Raise",
    equipment: "Pull-up Bar",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12-15",
    duration: "40s set",
    instructions: [
      "Hang from bar with overhand grip.",
      "Without swinging, raise feet up to bar level by flexing lower abdominals and tilting pelvis.",
      "Lower slowly for 3 seconds."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs + Shoulders + Abs",
    muscleGroup: ["Abs"],
    exerciseName: "Ab Wheel Rollout",
    equipment: "Ab Wheel",
    difficulty: "Advanced",
    sets: 3,
    reps: "10-12",
    duration: "40s set",
    instructions: [
      "Kneel on mat, grasp wheel handles.",
      "Roll forward maintaining a hollow body pelvic tuck.",
      "Pull back with abdominal wall power alone."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs + Shoulders + Abs",
    muscleGroup: ["Abs"],
    exerciseName: "Cable Crunch",
    equipment: "Cable Machine & Rope",
    difficulty: "Intermediate",
    sets: 3,
    reps: "15",
    duration: "40s set",
    instructions: [
      "Kneel facing high pulley with rope held at temples.",
      "Crunch elbows down towards mid-thighs, rolling spine like a carpet."
    ],
    restTime: "60s"
  }
];

const IMMORTAL_DAY7_RUNNING_WALKING_CARDIO: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "5 to 10 KM Running / Walking",
    muscleGroup: ["Cardio"],
    exerciseName: "Running",
    equipment: "Running Shoes & Outdoors or Treadmill",
    difficulty: "Beginner",
    sets: 1,
    reps: "5-10 KM",
    duration: "45-75 mins",
    instructions: [
      "Complete a steady 5 to 10 kilometer running or brisk walking session.",
      "Maintain a consistent conversational pace (aerobic Zone 2).",
      "Strict rule: No weight training or resistance exercise on cardio days.",
      "Immediately following cardio, transition to complete muscular rest and recovery."
    ],
    restTime: "Full rest post-cardio",
    coachingCues: ["Relax upper torso and arms", "Breathe smoothly through nose and diaphragm"]
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "5 to 10 KM Running / Walking",
    muscleGroup: ["Recovery"],
    exerciseName: "Walking",
    equipment: "Yoga Mat or Bed",
    difficulty: "Beginner",
    sets: 1,
    reps: "Rest Protocol",
    duration: "Rest & Recover",
    instructions: [
      "Lie supine with legs elevated for 10-15 minutes to aid circulation and flush metabolic waste.",
      "Rehydrate thoroughly with water and minerals.",
      "Zero resistance training permitted today. Full rest prepares your muscles to repeat the 7-day cycle on Day 1."
    ],
    restTime: "Complete rest",
    coachingCues: ["Let all skeletal tension dissolve completely"]
  }
];

const IMMORTAL_CHEST_TRICEPS_FOREARMS = IMMORTAL_CHEST_TRICEPS;
const IMMORTAL_BACK_BICEPS_ABS = IMMORTAL_BACK_BICEPS_FOREARMS;

const IMMORTAL_REST_WALKING: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Rest + Walking",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "Full Active Rest & Gentle Walking Reset",
    equipment: "None / Walking Shoes",
    difficulty: "Beginner",
    sets: 1,
    reps: "30-45 mins gentle walk",
    duration: "30-45 mins",
    instructions: [
      "Absolute rest from weight training and strenuous resistance work.",
      "Optional light conversational walking (2-4 km) in natural sunlight.",
      "Honor your central nervous system with complete muscular rest, 8+ hours sleep, and nutritious foods."
    ],
    restTime: "Full Day Recovery",
    coachingCues: ["Zero heavy loading", "Allow joints and ligaments to rebuild"]
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Rest + Walking",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "Passive Spine & Hip Flexor Decompression",
    equipment: "Yoga Mat & Pillow",
    difficulty: "Beginner",
    sets: 1,
    reps: "10 mins",
    duration: "10 mins",
    instructions: [
      "Relax in child's pose and supine twist.",
      "Allow all muscular tension in the spine to soften completely."
    ],
    restTime: "Rest",
    coachingCues: ["Deep slow exhalations"]
  }
];

// --- PROGRAM 2: 180 DAY HOME WORKOUT CHALLENGE CATALOG ---
const _OLD_HOME_180_POOL: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Chest",
    muscleGroup: ["Chest"],
    exerciseName: "Push Ups",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    sets: 4,
    reps: "15-20",
    duration: "45s set",
    instructions: ["3 seconds down, 1 second pause at bottom, 1 second explosive push."],
    restTime: "60s"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Upper body",
    muscleGroup: ["Chest", "Shoulders", "Arms"],
    exerciseName: "Dips",
    equipment: "Sturdy Chair or Couch",
    difficulty: "Beginner",
    sets: 3,
    reps: "15-20",
    duration: "40s set",
    instructions: ["Hands on chair edge, lower hips close to chair until elbows reach 90 degrees."],
    restTime: "45s"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Back",
    muscleGroup: ["Back"],
    exerciseName: "Prone Cobra Chest Opener",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "45s hold",
    duration: "45s set",
    instructions: ["Lie on stomach, squeeze upper back and glutes, lift chest and rotate thumbs to sky."],
    restTime: "45s"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Back",
    muscleGroup: ["Back", "Arms"],
    exerciseName: "Inverted Bodyweight Row on Smith Machine",
    equipment: "Doorframe or Sturdy Table",
    difficulty: "Beginner",
    sets: 4,
    reps: "12-15",
    duration: "45s set",
    instructions: ["Grip edge of sturdy doorframe with feet positioned forward, pull chest firmly toward frame squeezing mid-back."],
    restTime: "45s"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Back",
    muscleGroup: ["Back"],
    exerciseName: "Y-T-W Scapular Raises (Bodyweight)",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "10 cycles",
    duration: "45s set",
    instructions: ["Lie prone, transition arms smoothly between Y, T, and W shapes while maintaining active scapular retraction."],
    restTime: "45s"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Shoulders",
    muscleGroup: ["Shoulders"],
    exerciseName: "Decline Push Ups",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12",
    duration: "40s set",
    instructions: ["Form an inverted V-shape, lower crown of head between hands and press up."],
    restTime: "60s"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Arms",
    muscleGroup: ["Arms"],
    exerciseName: "Dips",
    equipment: "Doorframe",
    difficulty: "Beginner",
    sets: 3,
    reps: "30s hold each arm",
    duration: "40s set",
    instructions: ["Grip doorframe with underhand grip and apply maximal upward bicep isometric force."],
    restTime: "45s"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Legs and glutes",
    muscleGroup: ["Legs", "Glutes"],
    exerciseName: "Bodyweight Squats",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: 4,
    reps: "20 reps + 10s pulse",
    duration: "50s set",
    instructions: ["Squat deep, stand up squeezing glutes, hold at parallel for final 10 seconds."],
    restTime: "60s"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Legs and glutes",
    muscleGroup: ["Legs", "Glutes"],
    exerciseName: "Walking Lunges",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    sets: 3,
    reps: "20 total lunges",
    duration: "45s set",
    instructions: ["Step forward into a 90-degree knee bend, keeping chest tall, driving through front heel."],
    restTime: "60s"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Legs and glutes",
    muscleGroup: ["Glutes", "Legs"],
    exerciseName: "Single Leg Glute Bridge",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "12 reps per leg",
    duration: "40s set",
    instructions: ["One foot flat, extend opposing leg upward, drive hips skyward squeezing active glute at apex."],
    restTime: "45s"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Legs and glutes",
    muscleGroup: ["Legs"],
    exerciseName: "Calf Raises",
    equipment: "Step or Flat Ground",
    difficulty: "Beginner",
    sets: 3,
    reps: "20 reps per leg",
    duration: "40s set",
    instructions: ["Balance on ball of single foot, elevate heel to full plantarflexion, pause, lower under control."],
    restTime: "45s"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Core and abs",
    muscleGroup: ["Abs"],
    exerciseName: "Dead Bug",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "16 alternating reps",
    duration: "45s set",
    instructions: ["Press lower back into mat, extend opposite arm and leg without losing spinal contact."],
    restTime: "45s"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Core and abs",
    muscleGroup: ["Abs"],
    exerciseName: "Hollow Body Hold",
    equipment: "Yoga Mat",
    difficulty: "Intermediate",
    sets: 4,
    reps: "35-45s hold",
    duration: "45s set",
    instructions: ["Posterior pelvic tilt pressed firmly to floor, arms extended overhead, legs hover 6 inches off ground."],
    restTime: "45s"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Core and abs",
    muscleGroup: ["Abs"],
    exerciseName: "Plank",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "20 alternating taps",
    duration: "45s set",
    instructions: ["Lock into solid forearm plank, gently tap alternating knees to floor while keeping pelvic girdle rigid."],
    restTime: "45s"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Core and abs",
    muscleGroup: ["Abs"],
    exerciseName: "Bicycle Crunches",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "20 alternating reps",
    duration: "45s set",
    instructions: ["Slow tempo rotation bringing armpit toward opposing knee, hold peak contraction for 1 full second."],
    restTime: "45s"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Full body",
    muscleGroup: ["Full body"],
    exerciseName: "Full Athletic Burpees",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12-15",
    duration: "45s set",
    instructions: ["Drop chest to floor, jump feet to hands, leap vertically with hands overhead."],
    restTime: "60s"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Cardio",
    muscleGroup: ["Cardio"],
    exerciseName: "Walking",
    equipment: "Running Shoes",
    difficulty: "Beginner",
    sets: 1,
    reps: "5-10 KM",
    duration: "50 mins",
    instructions: ["Continuous steady-state aerobic distance. All workouts removed today."],
    restTime: "Post-cardio rest"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Cardio",
    muscleGroup: ["Cardio"],
    exerciseName: "High Knees",
    equipment: "Bodyweight & Running Shoes",
    difficulty: "Intermediate",
    sets: 4,
    reps: "45s on / 15s off",
    duration: "30 mins",
    instructions: ["Pumping arms with high knee drive followed by crisp lateral shuffles for aerobic stamina."],
    restTime: "60s"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Mobility and recovery",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "World's Greatest Stretch Complex",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 2,
    reps: "8 reps per side",
    duration: "10 mins",
    instructions: ["Deep lunge with elbow to instep, then rotate arm towards sky."],
    restTime: "Active flow"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Mobility and recovery",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "90/90 Active Hip Opener",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "45s hold",
    duration: "10 mins",
    instructions: ["Sink deep into prayer squat, use elbows to gently pry inner knees outward, elongating spine."],
    restTime: "Active flow"
  },
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Mobility and recovery",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "Scorpion Stretch for Spinal Rotation",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 2,
    reps: "8 alternating reps",
    duration: "8 mins",
    instructions: ["Lie flat on stomach with arms spread, swing one foot across back toward opposing hand to stretch hip flexor and chest."],
    restTime: "Active flow"
  }
];

// --- PROGRAM 3: WOMEN CONFIDENCE PROGRAM CATALOG (12 EXERCISES PER CATEGORY) ---
export const WOMEN_GLUTES_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Glutes",
    muscleGroup: ["Glutes", "Lower body"],
    exerciseName: "Barbell Hip Thrust",
    equipment: "Barbell & Bench",
    difficulty: "Intermediate",
    sets: 4,
    reps: "10-12",
    duration: "45s set",
    instructions: ["Upper back pinned across bench, drive through heels, lift hips into full lockout with posterior pelvic tilt."],
    restTime: "75s",
    coachingCues: ["Keep chin tucked and ribs down", "Hold peak squeeze at the top for 2 full seconds"],
    gifUrl: "https://media.giphy.com/media/v1F0A8f5Ff6hO/giphy.gif"
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Glutes",
    muscleGroup: ["Glutes", "Lower body"],
    exerciseName: "Banded Glute Bridge",
    equipment: "Booty Band & Yoga Mat",
    difficulty: "Beginner",
    sets: 4,
    reps: "15 reps + 5s hold",
    duration: "45s set",
    instructions: ["Place resistance band above knees. Drive hips up, flare knees outward against band tension, lower slowly."],
    restTime: "60s",
    coachingCues: ["Keep heels glued to the floor", "Do not hyperextend lumbar spine"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Glutes",
    muscleGroup: ["Glutes", "Lower body"],
    exerciseName: "Dumbbell Romanian Deadlift (RDL)",
    equipment: "Pair of Dumbbells",
    difficulty: "Beginner",
    sets: 4,
    reps: "12",
    duration: "45s set",
    instructions: ["Hinge backward at hips with soft knees, glide dumbbells along shins, squeeze glutes firmly to stand."],
    restTime: "60s",
    coachingCues: ["Push your hips toward the back wall", "Keep shoulder blades retracted"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Glutes",
    muscleGroup: ["Glutes", "Lower body"],
    exerciseName: "Bulgarian Split Squat",
    equipment: "Dumbbells & Bench/Chair",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10 reps per leg",
    duration: "50s set",
    instructions: ["Rear foot elevated on bench, drop back knee toward floor while keeping front shin relatively vertical."],
    restTime: "75s",
    coachingCues: ["Lean torso slightly forward to target gluteus maximus", "Drive through front heel"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Glutes",
    muscleGroup: ["Glutes", "Lower body"],
    exerciseName: "Cable Glute Kickbacks",
    equipment: "Cable Ankle Strap or Band",
    difficulty: "Beginner",
    sets: 3,
    reps: "15 per leg",
    duration: "40s set",
    instructions: ["Attach ankle strap to low cable, kick leg backward and slightly outward, contracting glute at the peak."],
    restTime: "45s",
    coachingCues: ["Lock your lower back in place without arching", "Slow eccentric return"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Glutes",
    muscleGroup: ["Glutes", "Lower body"],
    exerciseName: "Lateral Mini-Band Glute Walk",
    equipment: "Booty Band & Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "16 steps per direction",
    duration: "45s set",
    instructions: ["Place band around ankles or above knees. Sink into partial squat and step laterally against resistance."],
    restTime: "45s",
    coachingCues: ["Keep toes pointing straight ahead", "Maintain constant tension on band"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Glutes",
    muscleGroup: ["Glutes", "Lower body"],
    exerciseName: "Sumo Squat with Pulse",
    equipment: "Single Dumbbell / Kettlebell",
    difficulty: "Beginner",
    sets: 3,
    reps: "12 reps + 3 pulses",
    duration: "45s set",
    instructions: ["Take a wide stance with toes turned outward 45 degrees. Descend deep into hips and pulse at bottom."],
    restTime: "60s",
    coachingCues: ["Keep knees tracking over toes", "Squeeze glutes and adductors to stand"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Glutes",
    muscleGroup: ["Glutes", "Lower body"],
    exerciseName: "Elevated Single-Leg Glute Bridge",
    equipment: "Bench or Step & Mat",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12 per leg",
    duration: "40s set",
    instructions: ["Place working heel on bench, elevate other leg straight. Drive hips upward focusing purely on single glute."],
    restTime: "45s",
    coachingCues: ["Keep pelvis square to ceiling", "Do not let hips tilt"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Glutes",
    muscleGroup: ["Glutes", "Lower body"],
    exerciseName: "Frog Pumps",
    equipment: "Yoga Mat & Dumbbell",
    difficulty: "Beginner",
    sets: 3,
    reps: "20 reps",
    duration: "40s set",
    instructions: ["Lie on back with soles of feet pressed together and knees flared wide. Drive hips up in high-rep burn."],
    restTime: "45s",
    coachingCues: ["Tuck chin and squeeze glutes hard at the top", "Fast pumping rhythm with control"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Glutes",
    muscleGroup: ["Glutes", "Lower body"],
    exerciseName: "Banded Clamshells with Abduction",
    equipment: "Booty Band & Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "15 per side",
    duration: "40s set",
    instructions: ["Lie on side with knees bent at 90 degrees. Open top knee like a clamshell against resistance band."],
    restTime: "40s",
    coachingCues: ["Do not roll hips backward", "Focus on upper side glute (gluteus medius)"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Glutes",
    muscleGroup: ["Glutes", "Lower body"],
    exerciseName: "Cable Pull-Throughs",
    equipment: "Cable Machine & Rope",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    duration: "45s set",
    instructions: ["Facing away from low pulley with rope between legs, hinge back at hips and thrust forward with glute squeeze."],
    restTime: "60s",
    coachingCues: ["Do not squat the weight; hinge hips backward", "Lock hips out at top"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Glutes",
    muscleGroup: ["Glutes", "Lower body"],
    exerciseName: "Dumbbell Step-Ups with Glute Squeeze",
    equipment: "Bench or Plyo Box & Dumbbells",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10 per leg",
    duration: "45s set",
    instructions: ["Plant front foot flat on box. Drive through whole foot to stand without pushing off back leg."],
    restTime: "60s",
    coachingCues: ["Lower slowly over 3 seconds", "Keep torso with slight forward glute-bias lean"]
  }
];

export const WOMEN_CORE_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Core and abs",
    muscleGroup: ["Abs", "Core"],
    exerciseName: "Stomach Vacuum & Core Bracing",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 4,
    reps: "25s hold",
    duration: "30s set",
    instructions: ["Exhale all air, draw belly button inward toward spine, brace transverse abdominis while breathing shallowly."],
    restTime: "30s",
    coachingCues: ["Creates a tight natural corset around waistline", "Maintain steady core pressure"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Core and abs",
    muscleGroup: ["Abs", "Core"],
    exerciseName: "Dead Bug Contralateral Reach",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "16 alternating reps",
    duration: "40s set",
    instructions: ["Press lower back flat against floor. Slowly extend opposite arm and leg while maintaining absolute lumbar contact."],
    restTime: "30s",
    coachingCues: ["Zero space between lower back and mat", "Exhale as limbs reach outward"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Core and abs",
    muscleGroup: ["Abs", "Core"],
    exerciseName: "Side Plank with Hip Lift",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "10 hip dips per side",
    duration: "35s set",
    instructions: ["Align elbow under shoulder in side plank. Lower hip gently to touch mat, then lift high engaging obliques."],
    restTime: "30s",
    coachingCues: ["Stack shoulders vertically", "Keep neck neutral with spine"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Core and abs",
    muscleGroup: ["Abs", "Core"],
    exerciseName: "Bird Dog Stability Hold",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "12 per side with 2s hold",
    duration: "40s set",
    instructions: ["From all fours, reach opposing arm and leg straight out. Hold flat table line without rotating hips."],
    restTime: "30s",
    coachingCues: ["Reach long through fingertips and heel", "Keep hips square to floor"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Core and abs",
    muscleGroup: ["Abs", "Core"],
    exerciseName: "Lying Leg Raises with Pelvic Lift",
    equipment: "Yoga Mat",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12 reps",
    duration: "40s set",
    instructions: ["Hands under hips for lumbar support. Raise straight legs to vertical, then give a slight upward pulse."],
    restTime: "40s",
    coachingCues: ["Lower legs with control without letting back arch", "Initiate pull from lower abs"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Core and abs",
    muscleGroup: ["Abs", "Core"],
    exerciseName: "Bicycle Crunches with Pause",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "20 alternating reps",
    duration: "45s set",
    instructions: ["Fingertips behind ears. Rotate elbow to opposite knee while extending other leg. Pause 1 second on each twist."],
    restTime: "35s",
    coachingCues: ["Do not yank neck forward", "Rotate through thoracic spine"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Core and abs",
    muscleGroup: ["Abs", "Core"],
    exerciseName: "Hollow Body Rock / Hold",
    equipment: "Yoga Mat",
    difficulty: "Intermediate",
    sets: 3,
    reps: "30s hold",
    duration: "35s set",
    instructions: ["Press lower back down, lift shoulders and straight legs slightly off mat into a shallow banana shape."],
    restTime: "40s",
    coachingCues: ["Point toes and squeeze inner thighs together", "Breathe steadily"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Core and abs",
    muscleGroup: ["Abs", "Core"],
    exerciseName: "Plank Hip Dips",
    equipment: "Yoga Mat",
    difficulty: "Intermediate",
    sets: 3,
    reps: "16 alternating dips",
    duration: "40s set",
    instructions: ["In a tight forearm plank, rotate hips to tap floor gently on right, then sweep over to left."],
    restTime: "35s",
    coachingCues: ["Keep forearms planted and shoulders stable", "Feel the deep oblique rotation"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Core and abs",
    muscleGroup: ["Abs", "Core"],
    exerciseName: "Russian Twists with Knee Tuck",
    equipment: "Yoga Mat & Light Dumbbell",
    difficulty: "Beginner",
    sets: 3,
    reps: "20 total reps",
    duration: "40s set",
    instructions: ["Balance on sit bones with knees bent. Rotate shoulders side to side with hands touching floor beside hips."],
    restTime: "35s",
    coachingCues: ["Chest lifted tall", "Follow hands with eyes for full rotation"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Core and abs",
    muscleGroup: ["Abs", "Core"],
    exerciseName: "Mountain Climbers with Slow Tempo",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "20 slow controlled reps",
    duration: "40s set",
    instructions: ["High plank position. Draw knee up to chest under complete muscular control, pause, and return."],
    restTime: "30s",
    coachingCues: ["Do not let hips bounce in the air", "Lock core tight as if absorbing impact"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Core and abs",
    muscleGroup: ["Abs", "Core"],
    exerciseName: "Flutter Kicks / Scissor Drills",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "30s continuous",
    duration: "35s set",
    instructions: ["Hands under hips. Keep legs straight and kick alternating feet up and down 6 inches off floor."],
    restTime: "30s",
    coachingCues: ["Point toes and keep lower back grounded", "Maintain rhythmic breathing"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Core and abs",
    muscleGroup: ["Abs", "Core"],
    exerciseName: "Abdominal Slider Pike / Knee Tucks",
    equipment: "Socks on Hard Floor or Towel",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12 reps",
    duration: "40s set",
    instructions: ["From push-up plank with toes on towel or sliders, slide feet toward hands bending knees to chest."],
    restTime: "40s",
    coachingCues: ["Squeeze abs hard at top of tuck", "Slide back slowly into flat plank"]
  }
];

export const WOMEN_CARDIO_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Cardio",
    muscleGroup: ["Cardio"],
    exerciseName: "Incline Power Walking / Light Jogging",
    equipment: "Treadmill or Outdoor Path",
    difficulty: "Beginner",
    sets: 1,
    reps: "20-30 Mins Continuous",
    duration: "25 mins",
    instructions: ["Brisk walking at 6-10% incline or conversational jog. Keeps heart rate in Zone 2 fat burning territory."],
    restTime: "Hydration break",
    coachingCues: ["Pump arms naturally", "Keep posture tall with relaxed shoulders"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Cardio",
    muscleGroup: ["Cardio"],
    exerciseName: "Low-Impact Jumping Jacks",
    equipment: "Running Shoes & Mat",
    difficulty: "Beginner",
    sets: 4,
    reps: "45s work / 15s rest",
    duration: "45s set",
    instructions: ["Step side to side while raising arms overhead into a full jack arc. Gentle on pelvic floor and joints."],
    restTime: "15s",
    coachingCues: ["Stay light on balls of feet", "Synchronize breathing with arm movements"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Cardio",
    muscleGroup: ["Cardio"],
    exerciseName: "High Knees Rhythmic Drive",
    equipment: "Running Shoes",
    difficulty: "Intermediate",
    sets: 4,
    reps: "30s work / 20s rest",
    duration: "30s set",
    instructions: ["Drive knees up toward hip level in quick cadence, pumping opposite arms dynamically."],
    restTime: "20s",
    coachingCues: ["Land softly on midfoot", "Keep core engaged and chest proud"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Cardio",
    muscleGroup: ["Cardio"],
    exerciseName: "Mountain Climber Cardio Bursts",
    equipment: "Yoga Mat",
    difficulty: "Intermediate",
    sets: 4,
    reps: "30s sprint",
    duration: "30s set",
    instructions: ["High plank position. Drive knees rapidly toward chest in sprint rhythm while keeping hips level."],
    restTime: "20s",
    coachingCues: ["Shoulders stay stacked directly above wrists", "Fast dynamic foot turnover"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Cardio",
    muscleGroup: ["Cardio"],
    exerciseName: "Jump Rope / Ghost Rope Drills",
    equipment: "Jump Rope or Bodyweight",
    difficulty: "Beginner",
    sets: 4,
    reps: "45s work / 15s rest",
    duration: "45s set",
    instructions: ["Turn wrists and bound lightly 1-2 inches off floor. Great for calf endurance and aerobic conditioning."],
    restTime: "15s",
    coachingCues: ["Stay springy through ankles", "Relax shoulders down"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Cardio",
    muscleGroup: ["Cardio"],
    exerciseName: "Lateral Skater Hops",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    sets: 3,
    reps: "16 alternating hops",
    duration: "40s set",
    instructions: ["Bound laterally from one foot to the other, sweeping trailing leg behind in athletic balance."],
    restTime: "30s",
    coachingCues: ["Absorb landing with soft knee", "Use arms for counter-balance"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Cardio",
    muscleGroup: ["Cardio"],
    exerciseName: "Dumbbell / Kettlebell Swing",
    equipment: "Kettlebell or Dumbbell",
    difficulty: "Intermediate",
    sets: 4,
    reps: "15 swings",
    duration: "40s set",
    instructions: ["Hinge deeply at hips with soft knees. Snap hips forward explosively driving weight to chest height."],
    restTime: "40s",
    coachingCues: ["Power comes from glute snap, not shoulder lifting", "Inhale on hinge, exhale on snap"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Cardio",
    muscleGroup: ["Cardio"],
    exerciseName: "Step-Back Burpees (No Push-Up)",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "10-12 reps",
    duration: "45s set",
    instructions: ["Place hands on floor, step feet back into plank, step forward, stand tall and reach arms to ceiling."],
    restTime: "30s",
    coachingCues: ["Smooth controlled pace", "Step lightly without jarring lower back"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Cardio",
    muscleGroup: ["Cardio"],
    exerciseName: "Butt Kick Running Drills",
    equipment: "Running Shoes",
    difficulty: "Beginner",
    sets: 3,
    reps: "40s work / 20s rest",
    duration: "40s set",
    instructions: ["Jog in place kicking heels straight up toward glutes to stretch quads and build hamstring speed."],
    restTime: "20s",
    coachingCues: ["Keep knees pointing down", "Pump arms in rhythm"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Cardio",
    muscleGroup: ["Cardio"],
    exerciseName: "Shadow Boxing 1-2 Combo Drills",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: 3,
    reps: "45s dynamic rounds",
    duration: "45s set",
    instructions: ["Staggered athletic stance. Throw crisp jab-cross combinations with body rotation and core bracing."],
    restTime: "20s",
    coachingCues: ["Pivot on rear foot during cross", "Keep guard up at chin level"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Cardio",
    muscleGroup: ["Cardio"],
    exerciseName: "Cardio Step-Up Bursts",
    equipment: "Low Step or Sturdy Box",
    difficulty: "Beginner",
    sets: 3,
    reps: "20 alternating step-ups",
    duration: "40s set",
    instructions: ["Step up briskly with right foot, bring left to tap, step down and alternate leading foot."],
    restTime: "30s",
    coachingCues: ["Drive through full foot", "Maintain quick rhythmic cadence"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Cardio",
    muscleGroup: ["Cardio"],
    exerciseName: "Fast-Paced Air Squat Burnout",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: 3,
    reps: "20 continuous squats",
    duration: "40s set",
    instructions: ["Descend to parallel and stand quickly without locking knees, creating sustained metabolic burn in quads."],
    restTime: "35s",
    coachingCues: ["Chest stays tall", "Squeeze glutes at top"]
  }
];

export const WOMEN_LEGS_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Legs",
    muscleGroup: ["Legs", "Glutes"],
    exerciseName: "Goblet Squats",
    equipment: "Single Dumbbell or Kettlebell",
    difficulty: "Beginner",
    sets: 4,
    reps: "12 reps",
    duration: "45s set",
    instructions: ["Hold dumbbell vertically at chest. Squat between knees tracking toes, pause at parallel, drive up."],
    restTime: "60s",
    coachingCues: ["Elbows track inside knees at bottom", "Keep chest proud and spine neutral"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Legs",
    muscleGroup: ["Legs", "Glutes"],
    exerciseName: "Dumbbell Romanian Deadlift (Hamstring Focus)",
    equipment: "Pair of Dumbbells",
    difficulty: "Beginner",
    sets: 4,
    reps: "10-12",
    duration: "45s set",
    instructions: ["Soft knee bend, push hips far back feeling deep stretch in hamstring bellies, return with glute squeeze."],
    restTime: "60s",
    coachingCues: ["Keep weights touching shins on way down", "Do not round upper back"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Legs",
    muscleGroup: ["Legs", "Glutes"],
    exerciseName: "Walking Lunges with Controlled Drop",
    equipment: "Bodyweight or Dumbbells",
    difficulty: "Intermediate",
    sets: 3,
    reps: "20 total lunges",
    duration: "50s set",
    instructions: ["Step forward into a 90/90 knee angle, back knee hovering 1 inch off floor, push off front heel."],
    restTime: "60s",
    coachingCues: ["Keep front knee over ankle", "Torso tall with core braced"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Legs",
    muscleGroup: ["Legs", "Glutes"],
    exerciseName: "Curtsy Lunges (Outer Hip & Glute Sculpt)",
    equipment: "Dumbbells or Bodyweight",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10 per leg",
    duration: "45s set",
    instructions: ["Step one leg backward and across behind supporting leg, bending knees to lower hips like a curtsy."],
    restTime: "60s",
    coachingCues: ["Keep front knee aligned with front toes", "Targets outer glutes and adductors"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Legs",
    muscleGroup: ["Legs", "Glutes"],
    exerciseName: "Bulgarian Split Squats (Quad Dominant)",
    equipment: "Bench and Dumbbells",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10 per leg",
    duration: "45s set",
    instructions: ["Rear foot on bench, upright torso posture, descend straight down to load front quadriceps deeply."],
    restTime: "60s",
    coachingCues: ["Upright torso shifts focus from glutes to quads", "Smooth continuous movement"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Legs",
    muscleGroup: ["Legs", "Glutes"],
    exerciseName: "Sumo Deadlift with Dumbbells",
    equipment: "Two Heavy Dumbbells",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12",
    duration: "45s set",
    instructions: ["Extra wide stance with toes flared. Hinge down gripping dumbbells between feet, stand tall with glute lock."],
    restTime: "60s",
    coachingCues: ["Pushes through heels and outside edges of feet", "Great inner thigh & glute tie-in"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Legs",
    muscleGroup: ["Legs", "Glutes"],
    exerciseName: "Standing Calf Raises with Pause",
    equipment: "Step or Flat Surface",
    difficulty: "Beginner",
    sets: 3,
    reps: "20 reps with 2s squeeze",
    duration: "40s set",
    instructions: ["Elevate on balls of feet, drive heels as high as possible, pause for 2 seconds, lower slowly."],
    restTime: "45s",
    coachingCues: ["Full plantarflexion at the peak", "No bouncing at bottom"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Legs",
    muscleGroup: ["Legs", "Glutes"],
    exerciseName: "Wall Sit Hold with Isometric Adduction",
    equipment: "Wall & Yoga Block or Towel",
    difficulty: "Beginner",
    sets: 3,
    reps: "45s hold",
    duration: "45s set",
    instructions: ["Back flat against wall, knees and hips at 90 degrees. Squeeze yoga block between knees while holding."],
    restTime: "45s",
    coachingCues: ["Keep thighs parallel to ground", "Breathe steadily and do not push hands on knees"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Legs",
    muscleGroup: ["Legs", "Glutes"],
    exerciseName: "Single-Leg Romanian Deadlift",
    equipment: "Single Dumbbell & Wall Balance",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10 per leg",
    duration: "45s set",
    instructions: ["Balance on one foot, hinge forward sending opposite leg straight back like a lever, squeeze glute to rise."],
    restTime: "45s",
    coachingCues: ["Keep hips parallel to floor", "Feel intense hamstring stretch on standing leg"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Legs",
    muscleGroup: ["Legs", "Glutes"],
    exerciseName: "Deficit Reverse Lunges",
    equipment: "Step or Bumper Plate & Dumbbells",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10 per leg",
    duration: "45s set",
    instructions: ["Stand on 2-4 inch platform, step backward into deep lunge getting extra depth and glute-hamstring stretch."],
    restTime: "60s",
    coachingCues: ["Take advantage of the extra depth", "Drive up through front heel"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Legs",
    muscleGroup: ["Legs", "Glutes"],
    exerciseName: "Lying Dumbbell Hamstring Curl",
    equipment: "Dumbbell & Yoga Mat",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12 reps",
    duration: "40s set",
    instructions: ["Lie face down clamping dumbbell between feet. Curl heels toward glutes, pause, lower slowly."],
    restTime: "50s",
    coachingCues: ["Control the negative return", "Keep pelvis anchored to mat"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Legs",
    muscleGroup: ["Legs", "Glutes"],
    exerciseName: "Quad Burnout Heel-Elevated Squat",
    equipment: "Books/Weight Plate under Heels",
    difficulty: "Beginner",
    sets: 3,
    reps: "15-20 reps",
    duration: "45s set",
    instructions: ["Elevate heels 1 inch on plates or small book. Squat straight down with upright torso, pumping quads."],
    restTime: "45s",
    coachingCues: ["Allows deeper knee flexion without hip restriction", "Continuous smooth tension"]
  }
];

export const WOMEN_UPPER_BODY_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Upper body",
    muscleGroup: ["Upper body", "Back", "Shoulders"],
    exerciseName: "Incline Dumbbell Chest Press",
    equipment: "Dumbbells & Incline Bench",
    difficulty: "Beginner",
    sets: 4,
    reps: "10-12",
    duration: "45s set",
    instructions: ["Set bench to 30 degrees. Press dumbbells upward, squeezing upper pecs and anterior delts at top."],
    restTime: "60s",
    coachingCues: ["Lower weights with elbows at 45 degrees", "Great for upper chest posture support"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Upper body",
    muscleGroup: ["Upper body", "Back", "Shoulders"],
    exerciseName: "Single-Arm Supported Dumbbell Row",
    equipment: "Dumbbell & Bench/Chair",
    difficulty: "Beginner",
    sets: 3,
    reps: "12 per arm",
    duration: "40s set",
    instructions: ["One hand and knee on bench, pull dumbbell toward hip pocket pinning shoulder blade tightly inward."],
    restTime: "45s",
    coachingCues: ["Drive with your elbow", "Avoid twisting torso"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Upper body",
    muscleGroup: ["Upper body", "Back", "Shoulders"],
    exerciseName: "Lat Pulldown / Resistance Band Pulldown",
    equipment: "Lat Machine or Overhead Band",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    duration: "45s set",
    instructions: ["Grip bar wide, pull down toward upper collarbone while pulling shoulder blades down and back."],
    restTime: "60s",
    coachingCues: ["Squeeze lats at bottom of pull", "Control the upward stretch"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Upper body",
    muscleGroup: ["Upper body", "Back", "Shoulders"],
    exerciseName: "Dumbbell Overhead Shoulder Press",
    equipment: "Dumbbells & Bench",
    difficulty: "Beginner",
    sets: 3,
    reps: "10-12",
    duration: "45s set",
    instructions: ["Palms facing forward or neutral. Press dumbbells overhead until arms are extended, lower slowly."],
    restTime: "60s",
    coachingCues: ["Keep ribs tucked and core braced", "Do not arch lower back"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Upper body",
    muscleGroup: ["Upper body", "Back", "Shoulders"],
    exerciseName: "Dumbbell Lateral Raises (Shoulder Sculpt)",
    equipment: "Light Dumbbells",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    duration: "40s set",
    instructions: ["Slight forward lean, raise dumbbells outward until parallel to floor, leading slightly with elbows."],
    restTime: "45s",
    coachingCues: ["Pouring water motion at peak", "Avoid shrugging neck traps"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Upper body",
    muscleGroup: ["Upper body", "Back", "Shoulders"],
    exerciseName: "Face Pulls / Band Pull-Aparts",
    equipment: "Cable Machine or Band",
    difficulty: "Beginner",
    sets: 4,
    reps: "15 reps",
    duration: "40s set",
    instructions: ["Pull rope or band toward eyes while pulling hands apart, rotating shoulders externally."],
    restTime: "45s",
    coachingCues: ["Crucial for reversing rounded desk posture", "Squeeze rear delts and mid-traps"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Upper body",
    muscleGroup: ["Upper body", "Back", "Shoulders"],
    exerciseName: "Incline Push Ups (Bench / Countertop)",
    equipment: "Bench, Step, or Wall",
    difficulty: "Beginner",
    sets: 3,
    reps: "10-15",
    duration: "40s set",
    instructions: ["Hands on elevated surface shoulder-width. Lower chest to edge in a rigid plank, press away explosively."],
    restTime: "45s",
    coachingCues: ["Body forms one straight line from heels to crown", "Elbows tuck at 45 degrees"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Upper body",
    muscleGroup: ["Upper body", "Back", "Shoulders"],
    exerciseName: "Tricep Cable Rope Pushdowns",
    equipment: "Cable Machine or Band",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    duration: "40s set",
    instructions: ["Keep elbows pinned to ribs. Push rope down, flaring ends apart at bottom for peak tricep contraction."],
    restTime: "45s",
    coachingCues: ["Only forearms move; upper arms remain stationary", "Full lockout at bottom"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Upper body",
    muscleGroup: ["Upper body", "Back", "Shoulders"],
    exerciseName: "Standing Dumbbell Bicep Curls",
    equipment: "Pair of Dumbbells",
    difficulty: "Beginner",
    sets: 3,
    reps: "12",
    duration: "40s set",
    instructions: ["Curl dumbbells upward while rotating wrists so palms face shoulders at top. Lower with 3-second tempo."],
    restTime: "45s",
    coachingCues: ["Do not swing hips", "Squeeze biceps at the peak"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Upper body",
    muscleGroup: ["Upper body", "Back", "Shoulders"],
    exerciseName: "Dumbbell Hammer Curls (Forearm & Arm Tone)",
    equipment: "Pair of Dumbbells",
    difficulty: "Beginner",
    sets: 3,
    reps: "12",
    duration: "40s set",
    instructions: ["Neutral grip (palms facing each other). Curl dumbbells upward targeting the brachialis."],
    restTime: "45s",
    coachingCues: ["Builds firm arm definition", "Keep elbows tight to body"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Upper body",
    muscleGroup: ["Upper body", "Back", "Shoulders"],
    exerciseName: "Overhead Dumbbell Tricep Extension",
    equipment: "Single Dumbbell",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    duration: "40s set",
    instructions: ["Hold dumbbell overhead with both hands under top plate. Lower behind neck feeling deep tricep stretch, press up."],
    restTime: "45s",
    coachingCues: ["Keep elbows pointing forward, not flaring out", "Brace core tight"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Upper body",
    muscleGroup: ["Upper body", "Back", "Shoulders"],
    exerciseName: "Bent-Over Rear Delt Flyes",
    equipment: "Light Dumbbells",
    difficulty: "Beginner",
    sets: 3,
    reps: "15 reps",
    duration: "40s set",
    instructions: ["Hinge forward 60 degrees with flat back. Raise dumbbells outward like wings, pinching rear shoulder blades."],
    restTime: "45s",
    coachingCues: ["Lead with pinkies slightly", "Key for posture alignment and sculpted back lines"]
  }
];

export const WOMEN_WELLNESS_EXERCISES: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Confidence and wellness sessions",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "Child's Pose Spinal Reach & Decompression",
    equipment: "Quiet Room & Yoga Mat",
    difficulty: "Beginner",
    sets: 2,
    reps: "60s deep hold",
    duration: "2 mins",
    instructions: ["Knees wide on mat, big toes touching. Sink hips onto heels, crawl fingertips forward and rest forehead."],
    restTime: "Rest",
    coachingCues: ["Breathe deeply into back ribcage", "Allow entire lumbar spine to release"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Confidence and wellness sessions",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "Cat-Cow Dynamic Breathing Flow",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 2,
    reps: "10 slow cycles",
    duration: "2 mins",
    instructions: ["Tabletop stance. Inhale, arch back, gaze up. Exhale, round spine upward like an angry cat, tucking chin."],
    restTime: "Rest",
    coachingCues: ["Mobilizes every spinal segment", "Synchronize every movement with deep belly breath"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Confidence and wellness sessions",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "90/90 Hip Opener Stretch",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 2,
    reps: "45s per side",
    duration: "2 mins",
    instructions: ["Sit with front leg bent 90 degrees in front and back leg bent 90 degrees behind. Hinge chest over front shin."],
    restTime: "Rest",
    coachingCues: ["Opens internal and external hip rotators", "Relieves pelvic and glute tightness"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Confidence and wellness sessions",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "World's Greatest Stretch & Thoracic Rotation",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 2,
    reps: "6 per side",
    duration: "2 mins",
    instructions: ["From deep runner's lunge, drop inside elbow toward floor, then reach arm skyward opening chest to ceiling."],
    restTime: "Rest",
    coachingCues: ["Follow top hand with your gaze", "Unlocks tight hips, thoracic spine, and ankles"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Confidence and wellness sessions",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "Cobra to Downward Dog Restorative Flow",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 2,
    reps: "8 slow transitions",
    duration: "2 mins",
    instructions: ["Slide from prone into gentle cobra stretching anterior abdomen, then push hips high into downward facing dog."],
    restTime: "Rest",
    coachingCues: ["Pedal feet in downward dog to stretch calves", "Do not force lumbar arch in cobra"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Confidence and wellness sessions",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "Pigeon Pose Deep Glute Opener",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 2,
    reps: "60s per side",
    duration: "2 mins",
    instructions: ["Bring one knee behind wrist, extend back leg long behind you. Fold forward over front leg resting on forearms."],
    restTime: "Rest",
    coachingCues: ["Releases piriformis and deep glute tension", "Exhale and let your weight melt downward"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Confidence and wellness sessions",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "Butterfly Hip Opener with Forward Fold",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 2,
    reps: "60s hold",
    duration: "2 mins",
    instructions: ["Sit tall with soles of feet together, knees dropping toward sides. Gently hinge forward with a flat back."],
    restTime: "Rest",
    coachingCues: ["Releases adductors and pelvic floor tension", "Breathe through tightness without bouncing"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Confidence and wellness sessions",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "Thoracic Thread the Needle Stretch",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 2,
    reps: "45s per side",
    duration: "2 mins",
    instructions: ["From all fours, slide right arm underneath chest across floor, resting right shoulder and ear gently on mat."],
    restTime: "Rest",
    coachingCues: ["Releases shoulder blade knots and upper back tension", "Keep hips square"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Confidence and wellness sessions",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "Standing Side Bend Lateral Stretch",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: 2,
    reps: "30s per side",
    duration: "1.5 mins",
    instructions: ["Reach right arm overhead, cross left foot behind right, bend gently to left opening the entire right ribcage."],
    restTime: "Rest",
    coachingCues: ["Breathe into intercostal muscles", "Lengthen tall before bending"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Confidence and wellness sessions",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "Hamstring Floss & Decompression",
    equipment: "Yoga Mat & Strap/Towel",
    difficulty: "Beginner",
    sets: 2,
    reps: "45s per leg",
    duration: "2 mins",
    instructions: ["Lie on back with strap around ball of one foot. Gently pull leg toward ceiling with soft knee, flexing ankle."],
    restTime: "Rest",
    coachingCues: ["Releases posterior kinetic chain", "Keep opposing leg grounded"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Confidence and wellness sessions",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "Deep Diaphragmatic Breath & Pelvic Reset",
    equipment: "Quiet Space & Pillow/Mat",
    difficulty: "Beginner",
    sets: 1,
    reps: "5 Mins Relaxation",
    duration: "5 mins",
    instructions: ["Lie comfortably on back, one hand on heart, one on belly. Inhale 4 seconds expanding ribs 360°, exhale 6 seconds."],
    restTime: "Rest",
    coachingCues: ["Activates parasympathetic rest-and-digest state", "Lowers cortisol and accelerates muscular recovery"]
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Confidence and wellness sessions",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "Low Lunge Quad & Hip Flexor Stretch",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 2,
    reps: "45s per side",
    duration: "2 mins",
    instructions: ["Drop into low lunge with back knee resting on mat. Gently tuck pelvis and shift weight forward into hip flexor."],
    restTime: "Rest",
    coachingCues: ["Squeeze glute of trailing leg to deepen psoas stretch", "Keep chest lifted"]
  }
];

// Combined pool for metadata / lookups
const WOMEN_EXERCISES_POOL: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  ...WOMEN_GLUTES_EXERCISES,
  ...WOMEN_CORE_EXERCISES,
  ...WOMEN_CARDIO_EXERCISES,
  ...WOMEN_LEGS_EXERCISES,
  ...WOMEN_UPPER_BODY_EXERCISES,
  ...WOMEN_WELLNESS_EXERCISES
];

// --- PROGRAM 4: BELLY FAT SHRED SYSTEM CATALOG ---
const _OLD_BELLY_FAT_POOL: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "belly_fat_shred",
    programName: "Belly Fat Shred System",
    category: "Core",
    muscleGroup: ["Abs"],
    exerciseName: "Plank",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 4,
    reps: "45-60s hold",
    duration: "60s set",
    instructions: ["Forearm plank with glutes squeezed hard and tailbone tucked, creating intense abdominal contraction."],
    restTime: "45s"
  },
  {
    programId: "belly_fat_shred",
    programName: "Belly Fat Shred System",
    category: "Obliques",
    muscleGroup: ["Abs"],
    exerciseName: "Russian Twist",
    equipment: "Bodyweight or Light Dumbbell",
    difficulty: "Beginner",
    sets: 3,
    reps: "20 total reps",
    duration: "45s set",
    instructions: ["Sit in V-position with feet elevated. Rotate shoulders from side to side with zero momentum."],
    restTime: "45s"
  },
  {
    programId: "belly_fat_shred",
    programName: "Belly Fat Shred System",
    category: "HIIT",
    muscleGroup: ["Full body"],
    exerciseName: "Mountain Climbers",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    sets: 4,
    reps: "30s work / 15s rest",
    duration: "30s set",
    instructions: ["High plank position, drive knees explosively toward chest while keeping hips low."],
    restTime: "15s"
  },
  {
    programId: "belly_fat_shred",
    programName: "Belly Fat Shred System",
    category: "Full body conditioning",
    muscleGroup: ["Full body"],
    exerciseName: "Jump Rope",
    equipment: "Jump Rope",
    difficulty: "Intermediate",
    sets: 4,
    reps: "60s continuous",
    duration: "60s set",
    instructions: ["Stay light on balls of feet, turn rope with wrists, maintaining brisk conditioning cadence."],
    restTime: "30s"
  },
  {
    programId: "belly_fat_shred",
    programName: "Belly Fat Shred System",
    category: "Walking or running",
    muscleGroup: ["Cardio"],
    exerciseName: "Running",
    equipment: "Treadmill or Outdoor Path",
    difficulty: "Beginner",
    sets: 1,
    reps: "5-10 KM",
    duration: "45-60 mins",
    instructions: ["Wednesday/Sunday Cardio Assignment. Resistance workouts removed today for full recovery."],
    restTime: "Full recovery"
  }
];

// --- PROGRAM 5: RECLAIM YOUR POSTURE & VITALITY CATALOG ---
const _OLD_POSTURE_POOL: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Posture correction",
    muscleGroup: ["Upper back"],
    exerciseName: "Y-T-W Scapular Raises (Bodyweight)",
    equipment: "Wall",
    difficulty: "Beginner",
    sets: 3,
    reps: "12 slow reps",
    duration: "40s set",
    instructions: ["Stand with heels, glutes, upper back, and head flat against wall. Slide arms up and down like snow angels without losing contact."],
    restTime: "45s"
  },
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Posture correction",
    muscleGroup: ["Upper back"],
    exerciseName: "Prone Trap-3 Scapular Raise",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "15 reps with 2s squeeze",
    duration: "40s set",
    instructions: ["Lie face down, extend arms in W shape, pinch shoulder blades deeply together while keeping neck neutral."],
    restTime: "40s"
  },
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Neck mobility",
    muscleGroup: ["Neck mobility"],
    exerciseName: "Resistance Band Pull-Aparts & Posture Opener",
    equipment: "Wall or Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "10 reps with 5s hold",
    duration: "30s set",
    instructions: ["Gently draw chin straight back creating a 'double chin' to activate deep cervical flexors."],
    restTime: "30s"
  },
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Chest opening",
    muscleGroup: ["Chest"],
    exerciseName: "Child's Pose Spinal Reach",
    equipment: "Doorframe",
    difficulty: "Beginner",
    sets: 3,
    reps: "30s per side",
    duration: "30s set",
    instructions: ["Place forearm on doorframe at 90 degrees, step forward gently opening tight chest muscles."],
    restTime: "30s"
  },
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Chest opening",
    muscleGroup: ["Chest", "Shoulders"],
    exerciseName: "Prone Cobra Chest Opener",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "30s hold per side",
    duration: "35s set",
    instructions: ["Lie on stomach, extend one arm out at 45 degrees, roll gently toward extended arm to open anterior shoulder."],
    restTime: "30s"
  },
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Chest opening",
    muscleGroup: ["Chest", "Shoulders"],
    exerciseName: "Child's Pose Spinal Reach",
    equipment: "Towel or Bodyweight",
    difficulty: "Beginner",
    sets: 3,
    reps: "35s hold",
    duration: "35s set",
    instructions: ["Interlace fingers behind lower back, roll shoulders back and down, gently lift hands away from hips."],
    restTime: "30s"
  },
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Spinal mobility",
    muscleGroup: ["Spinal mobility"],
    exerciseName: "Primal Cat-Cow Spinal Waves",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "10 slow cycles",
    duration: "45s set",
    instructions: ["On all fours, inhale arching spine gazing up, exhale tucking chin and rounding spine skyward."],
    restTime: "30s"
  },
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Spinal mobility",
    muscleGroup: ["Spinal mobility"],
    exerciseName: "Seated Thoracic Extension & Twist",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "8 reps per side",
    duration: "40s set",
    instructions: ["From tabletop, slide one arm underneath chest across floor, resting shoulder, then rotate skyward."],
    restTime: "30s"
  },
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Spinal mobility",
    muscleGroup: ["Spinal mobility"],
    exerciseName: "Child's Pose Spinal Reach",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "8 flow transitions",
    duration: "45s set",
    instructions: ["Flow smoothly from prone spinal extension into deep lumbar flexion in active child's pose."],
    restTime: "30s"
  },
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Hip mobility",
    muscleGroup: ["Hip mobility"],
    exerciseName: "90/90 Active Hip Opener",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "5 transitions per side",
    duration: "45s set",
    instructions: ["Sit with front leg bent at 90 degrees and back leg at 90 degrees. Rotate smoothly between sides."],
    restTime: "30s"
  },
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Hip mobility",
    muscleGroup: ["Hip mobility"],
    exerciseName: "Couch Stretch for Tight Hip Flexors",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "35s per side",
    duration: "40s set",
    instructions: ["Kneel on back knee, tuck tailbone to posterior tilt, shift hips forward feeling deep anterior hip stretch."],
    restTime: "30s"
  },
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Glute activation",
    muscleGroup: ["Glutes"],
    exerciseName: "Glute Bridges",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "15 reps per leg",
    duration: "40s set",
    instructions: ["Lie on stomach, bend knee to 90 degrees, stamp sole of foot toward ceiling using glute."],
    restTime: "30s"
  },
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Glute activation",
    muscleGroup: ["Glutes"],
    exerciseName: "Lateral Mini-Band Glute Walk",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "12 reps per leg",
    duration: "40s set",
    instructions: ["On hands and knees with stable core, abduct bent knee out to 45 degrees without rotating pelvis."],
    restTime: "30s"
  },
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Glute activation",
    muscleGroup: ["Glutes", "Core stability"],
    exerciseName: "Glute Bridge & Isometric Hold",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "40s hold",
    duration: "45s set",
    instructions: ["Drive through heels, squeeze glutes to form straight diagonal line from knees to shoulders, ribs locked."],
    restTime: "30s"
  },
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Daily movement",
    muscleGroup: ["Daily movement", "Mobility and recovery"],
    exerciseName: "Systemic Decompression Breathing",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: 3,
    reps: "45s hold",
    duration: "45s set",
    instructions: ["Stand tall with feet parallel, engage core, tuck chin slightly, reach crown of head upward toward ceiling."],
    restTime: "30s"
  },
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Daily movement",
    muscleGroup: ["Daily movement", "Mobility and recovery"],
    exerciseName: "World's Greatest Stretch Complex",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "8 flow cycles",
    duration: "45s set",
    instructions: ["Seamless flow through standing side reach, gentle thoracic rotation, and slow spinal roll-downs."],
    restTime: "30s"
  },
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Daily movement",
    muscleGroup: ["Daily movement", "Mobility and recovery"],
    exerciseName: "Walking",
    equipment: "Walking Shoes",
    difficulty: "Beginner",
    sets: 1,
    reps: "20 mins",
    duration: "20 mins",
    instructions: ["Brisk walking maintaining upright posture, eyes on horizon, relaxed shoulder blades, natural arm swing."],
    restTime: "Post-walk rest"
  },
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Daily movement",
    muscleGroup: ["Daily movement", "Mobility and recovery"],
    exerciseName: "Deep Diaphragmatic Box Breathing",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "10 deep breaths",
    duration: "3 mins",
    instructions: ["Supine with knees bent, one hand on belly and one on chest. Expand 360 degrees into ribcage on inhale."],
    restTime: "Full relaxation"
  }
];

// ============================================================================
// 3. DETERMINISTIC WORKOUT GENERATOR WITH STRICT HIERARCHY
// PROGRAM -> DAY -> CATEGORY -> MUSCLE GROUP -> EXERCISE
// ============================================================================

function finalizePlan(meta: DayWorkoutMeta, exercises: ChallengeExerciseItem[]): DayExecutionPlan {
  return {
    meta,
    exercises: exercises.map(ex => {
      const exerciseName = ex.exerciseName || (ex as any).name || "";
      const gif = getExerciseGifUrl(exerciseName, ex.category);
      return {
        ...ex,
        name: exerciseName,
        exerciseName: exerciseName,
        gifUrl: gif,
        imageUrl: gif
      };
    })
  };
}

export function getWorkoutForProgramAndDay(programId: ProgramId, dayNumber: number): DayExecutionPlan {
  const safeDay = Math.max(1, dayNumber);

  // --------------------------------------------------------------------------
  // PROGRAM 1: IMMORTAL 90 DAY CHALLENGE (STRICT 7-DAY REPEATING CADENCE)
  // Day 1: Chest + Triceps
  // Day 2: Back + Biceps
  // Day 3: Cardio + Recovery (5 to 10 km, no weight training)
  // Day 4: Legs + Shoulders
  // Day 5: Chest + Triceps + Forearms
  // Day 6: Back + Biceps + Abs
  // Day 7: Rest + Walking (recovery instructions and optional walking, no resistance training)
  // --------------------------------------------------------------------------
  if (programId === "immortal_90") {
    const cycleDay = ((safeDay - 1) % 7) + 1; // 1 to 7

    if (cycleDay === 1) {
      const meta: DayWorkoutMeta = {
        dayNumber: safeDay,
        programId: "immortal_90",
        title: `Day ${safeDay}: Chest + Triceps Overload`,
        category: "Chest + Triceps",
        targetMuscles: ["Chest", "Triceps"],
        estimatedDuration: "50-60 mins",
        estimatedCalories: 450,
        isRestDay: false,
        isCardioOnly: false,
        guidelines: [
          "Display ONLY chest and triceps exercises.",
          "Warm up rotator cuffs before loading the flat barbell press.",
          "Focus on peak contraction at the top of every tricep lockout."
        ],
        coachingNotes: "Immortal Day 1 strictly targets the anterior pushing chain: pectorals (upper, mid, lower) and all three triceps heads."
      };
      const exercises: ChallengeExerciseItem[] = IMMORTAL_CHEST_TRICEPS.map((ex, idx) => ({
        ...ex,
        id: `immortal_d${safeDay}_ex_${idx + 1}`,
        dayNumber: safeDay
      }));
      return finalizePlan(meta, exercises);
    }

    if (cycleDay === 2) {
      const meta: DayWorkoutMeta = {
        dayNumber: safeDay,
        programId: "immortal_90",
        title: `Day ${safeDay}: Back + Biceps + Forearm`,
        category: "Back + Biceps + Forearm",
        targetMuscles: ["Back", "Biceps", "Forearms"],
        estimatedDuration: "55-65 mins",
        estimatedCalories: 490,
        isRestDay: false,
        isCardioOnly: false,
        guidelines: [
          "Display back, biceps, and forearm exercises ONLY.",
          "Initiate pulling movements with the lats, keeping core locked.",
          "Isolate biceps with strict curls and finish with heavy forearm wrist curls and grip carries."
        ],
        coachingNotes: "Immortal Day 2 exclusively engages vertical and horizontal pulling: latissimus dorsi, rhomboids, trapezius, biceps, and forearm wrist flexors/extensors."
      };
      const exercises: ChallengeExerciseItem[] = IMMORTAL_BACK_BICEPS_FOREARMS.map((ex, idx) => ({
        ...ex,
        id: `immortal_d${safeDay}_ex_${idx + 1}`,
        dayNumber: safeDay
      }));
      return finalizePlan(meta, exercises);
    }

    if (cycleDay === 3) {
      const meta: DayWorkoutMeta = {
        dayNumber: safeDay,
        programId: "immortal_90",
        title: `Day ${safeDay}: 5 to 10 KM Cardio / Walking (Rest After)`,
        category: "5 to 10 KM Cardio / Walking",
        targetMuscles: ["Cardio", "Recovery"],
        estimatedDuration: "50-75 mins",
        estimatedCalories: 550,
        isRestDay: false,
        isCardioOnly: true,
        cardioDistance: "5 to 10 KM",
        guidelines: [
          "Display walking or running for 5 to 10 km.",
          "No exercise or weight training is permitted on cardio days.",
          "After cardio, rest completely so your body recovers deep energy reserves."
        ],
        coachingNotes: "Immortal Day 3: Resistance exercises are completely removed. Complete your 5 to 10 KM cardio or walk, and rest."
      };
      const exercises: ChallengeExerciseItem[] = IMMORTAL_CARDIO_RECOVERY.map((ex, idx) => ({
        ...ex,
        id: `immortal_d${safeDay}_ex_${idx + 1}`,
        dayNumber: safeDay
      }));
      return finalizePlan(meta, exercises);
    }

    if (cycleDay === 4) {
      const meta: DayWorkoutMeta = {
        dayNumber: safeDay,
        programId: "immortal_90",
        title: `Day ${safeDay}: Legs + Shoulders + Abs`,
        category: "Legs + Shoulders + Abs",
        targetMuscles: ["Legs", "Shoulders", "Abs"],
        estimatedDuration: "60-70 mins",
        estimatedCalories: 560,
        isRestDay: false,
        isCardioOnly: false,
        guidelines: [
          "Display leg, shoulder, and abdominal exercises ONLY.",
          "Prioritize knee tracking and deep hip hinges on squats and RDLs.",
          "Hit all three deltoid heads (anterior, lateral, posterior) and finish with ab rollouts and leg raises."
        ],
        coachingNotes: "Immortal Day 4: High metabolic demand combining lower body quad/hamstring power, 3D shoulder sculpting, and core armor."
      };
      const exercises: ChallengeExerciseItem[] = IMMORTAL_LEGS_SHOULDERS_ABS.map((ex, idx) => ({
        ...ex,
        id: `immortal_d${safeDay}_ex_${idx + 1}`,
        dayNumber: safeDay
      }));
      return finalizePlan(meta, exercises);
    }

    if (cycleDay === 5) {
      const meta: DayWorkoutMeta = {
        dayNumber: safeDay,
        programId: "immortal_90",
        title: `Day ${safeDay}: Chest + Triceps`,
        category: "Chest + Triceps",
        targetMuscles: ["Chest", "Triceps"],
        estimatedDuration: "50-60 mins",
        estimatedCalories: 450,
        isRestDay: false,
        isCardioOnly: false,
        guidelines: [
          "Display chest and triceps exercises ONLY.",
          "Progressive load on flat/incline presses followed by tricep dips and cable pushdowns."
        ],
        coachingNotes: "Immortal Day 5: Re-stimulates the anterior pushing chain with heavy volume on pectorals and triceps."
      };
      const exercises: ChallengeExerciseItem[] = IMMORTAL_CHEST_TRICEPS.map((ex, idx) => ({
        ...ex,
        id: `immortal_d${safeDay}_ex_${idx + 1}`,
        dayNumber: safeDay
      }));
      return finalizePlan(meta, exercises);
    }

    if (cycleDay === 6) {
      const meta: DayWorkoutMeta = {
        dayNumber: safeDay,
        programId: "immortal_90",
        title: `Day ${safeDay}: Back + Biceps`,
        category: "Back + Biceps",
        targetMuscles: ["Back", "Biceps"],
        estimatedDuration: "50-60 mins",
        estimatedCalories: 470,
        isRestDay: false,
        isCardioOnly: false,
        guidelines: [
          "Display back and biceps exercises ONLY.",
          "Heavy deadlifts, wide pull-ups, barbell rows, and peak bicep curls."
        ],
        coachingNotes: "Immortal Day 6: Total pulling density targeting lat width, mid-back thickness, and bicep peaks."
      };
      const exercises: ChallengeExerciseItem[] = IMMORTAL_BACK_BICEPS.map((ex, idx) => ({
        ...ex,
        id: `immortal_d${safeDay}_ex_${idx + 1}`,
        dayNumber: safeDay
      }));
      return finalizePlan(meta, exercises);
    }

    // Day 7: Running or Walking 5 to 10 KM + Rest
    const meta: DayWorkoutMeta = {
      dayNumber: safeDay,
      programId: "immortal_90",
      title: `Day ${safeDay}: 5 to 10 KM Running or Walking (Rest After)`,
      category: "5 to 10 KM Running / Walking",
      targetMuscles: ["Cardio", "Recovery"],
      estimatedDuration: "50-75 mins",
      estimatedCalories: 550,
      isRestDay: false,
      isCardioOnly: true,
      cardioDistance: "5 to 10 KM",
      guidelines: [
        "Display running or walking for 5 to 10 km.",
        "No exercise on cardio days. Strict cardio and walking only.",
        "After cardio, rest completely. No weight training or resistance workouts.",
        "Prepares your body for Day 1 of the repeating 7-day cycle."
      ],
      coachingNotes: "Immortal Day 7: Complete your 5 to 10 km running or walking. After cardio, rest completely to finish the 7-day cycle."
    };
    const exercises: ChallengeExerciseItem[] = IMMORTAL_DAY7_RUNNING_WALKING_CARDIO.map((ex, idx) => ({
      ...ex,
      id: `immortal_d${safeDay}_ex_${idx + 1}`,
      dayNumber: safeDay
    }));
    return finalizePlan(meta, exercises);
  }

  // --------------------------------------------------------------------------
  // PROGRAM 2: 180 DAY HOME WORKOUT CHALLENGE (CALISTHENICS & BODYWEIGHT ONLY)
  // --------------------------------------------------------------------------
  if (programId === "home_180") {
    const dayMod = ((safeDay - 1) % 6);
    let category = "Upper body";
    let targetMuscles = ["Chest", "Shoulders", "Arms"];
    let pool = HOME_UPPER_BODY_EXERCISES;

    if (dayMod === 0) {
      category = "Upper body";
      targetMuscles = ["Chest", "Shoulders", "Arms"];
      pool = HOME_UPPER_BODY_EXERCISES;
    } else if (dayMod === 1) {
      category = "Legs and glutes";
      targetMuscles = ["Legs", "Glutes"];
      pool = HOME_LEGS_GLUTES_EXERCISES;
    } else if (dayMod === 2) {
      category = "Cardio";
      targetMuscles = ["Cardio"];
      pool = HOME_CARDIO_EXERCISES;
    } else if (dayMod === 3) {
      category = "Back";
      targetMuscles = ["Back", "Arms"];
      pool = HOME_BACK_EXERCISES;
    } else if (dayMod === 4) {
      category = "Core and abs";
      targetMuscles = ["Abs"];
      pool = HOME_CORE_ABS_EXERCISES;
    } else {
      category = "Mobility and recovery";
      targetMuscles = ["Mobility and recovery"];
      pool = HOME_MOBILITY_EXERCISES;
    }

    // Dynamic rotation for fresh variety across 180 days while guaranteeing exactly 12 exercises
    const cycleIndex = Math.floor((safeDay - 1) / 6);
    const rotationOffset = cycleIndex % 12;
    const rotated = [...pool.slice(rotationOffset), ...pool.slice(0, rotationOffset)];
    const exercisesToUse = rotated.slice(0, 12);

    const meta: DayWorkoutMeta = {
      dayNumber: safeDay,
      programId: "home_180",
      title: `Day ${safeDay}: ${category} Conditioning`,
      category,
      targetMuscles,
      estimatedDuration: "35-45 mins",
      estimatedCalories: 380,
      isRestDay: category === "Mobility and recovery",
      isCardioOnly: category === "Cardio",
      guidelines: [
        "Home equipment & bodyweight priority.",
        "Zero gym machine dependencies.",
        "12 targeted exercises daily calibrated for progressive calisthenics mastery."
      ],
      coachingNotes: "180 Day Home Challenge maintains strict bodyweight and home-compatible biomechanics."
    };

    const exercises = exercisesToUse.map((ex, idx) => ({
      ...ex,
      id: `home_d${safeDay}_ex_${idx + 1}`,
      dayNumber: safeDay
    }));
    return finalizePlan(meta, exercises);
  }

  // --------------------------------------------------------------------------
  // PROGRAM 3: WOMEN CONFIDENCE PROGRAM (180 DAYS)
  // --------------------------------------------------------------------------
  if (programId === "women_confidence") {
    const dayMod = ((safeDay - 1) % 6);
    let category = "Glutes";
    let targetMuscles = ["Glutes", "Lower body"];
    let pool = WOMEN_GLUTES_EXERCISES;

    if (dayMod === 0) {
      category = "Glutes";
      targetMuscles = ["Glutes", "Lower body"];
      pool = WOMEN_GLUTES_EXERCISES;
    } else if (dayMod === 1) {
      category = "Core and abs";
      targetMuscles = ["Abs", "Core"];
      pool = WOMEN_CORE_EXERCISES;
    } else if (dayMod === 2) {
      category = "Cardio";
      targetMuscles = ["Cardio"];
      pool = WOMEN_CARDIO_EXERCISES;
    } else if (dayMod === 3) {
      category = "Legs";
      targetMuscles = ["Legs", "Glutes"];
      pool = WOMEN_LEGS_EXERCISES;
    } else if (dayMod === 4) {
      category = "Upper body";
      targetMuscles = ["Upper body", "Back", "Shoulders"];
      pool = WOMEN_UPPER_BODY_EXERCISES;
    } else {
      category = "Confidence and wellness sessions";
      targetMuscles = ["Mobility and recovery"];
      pool = WOMEN_WELLNESS_EXERCISES;
    }

    // Dynamic rotation for fresh variety across 180 days while guaranteeing exactly 12 exercises
    const cycleIndex = Math.floor((safeDay - 1) / 6);
    const rotationOffset = cycleIndex % 12;
    const rotated = [...pool.slice(rotationOffset), ...pool.slice(0, rotationOffset)];
    const exercisesToUse = rotated.slice(0, 12);

    const meta: DayWorkoutMeta = {
      dayNumber: safeDay,
      programId: "women_confidence",
      title: `Day ${safeDay}: ${category} Focus`,
      category,
      targetMuscles,
      estimatedDuration: "35-45 mins",
      estimatedCalories: 350,
      isRestDay: category === "Confidence and wellness sessions",
      isCardioOnly: category === "Cardio",
      guidelines: [
        "Specifically engineered around women's aesthetic, posture, and wellness goals.",
        "12 targeted exercises daily calibrated for continuous tone and empowerment.",
        "Zero cross-contamination with unrelated workouts."
      ],
      coachingNotes: "Women Confidence Program: Focus on glute drive, transverse abdominis vacuuming, and empowered consistency."
    };

    const exercises = exercisesToUse.map((ex, idx) => ({
      ...ex,
      id: `women_d${safeDay}_ex_${idx + 1}`,
      dayNumber: safeDay
    }));
    return finalizePlan(meta, exercises);
  }

  // --------------------------------------------------------------------------
  // PROGRAM 4: BELLY FAT SHRED SYSTEM (150 DAYS)
  // --------------------------------------------------------------------------
  if (programId === "belly_fat_shred") {
    const dayMod = ((safeDay - 1) % 5);
    let category = "Core";
    let targetMuscles = ["Abs"];
    let pool = BELLY_CORE_EXERCISES;

    if (dayMod === 0) {
      category = "Core";
      targetMuscles = ["Abs"];
      pool = BELLY_CORE_EXERCISES;
    } else if (dayMod === 1) {
      category = "HIIT";
      targetMuscles = ["Full body"];
      pool = BELLY_HIIT_EXERCISES;
    } else if (dayMod === 2) {
      category = "Walking or running";
      targetMuscles = ["Cardio"];
      pool = BELLY_CARDIO_EXERCISES;
    } else if (dayMod === 3) {
      category = "Obliques";
      targetMuscles = ["Abs"];
      pool = BELLY_OBLIQUES_EXERCISES;
    } else {
      category = "Full body conditioning";
      targetMuscles = ["Full body"];
      pool = BELLY_CONDITIONING_EXERCISES;
    }

    // Dynamic rotation for fresh variety across 150 days while guaranteeing exactly 12 exercises
    const cycleIndex = Math.floor((safeDay - 1) / 5);
    const rotationOffset = cycleIndex % 12;
    const rotated = [...pool.slice(rotationOffset), ...pool.slice(0, rotationOffset)];
    const exercisesToUse = rotated.slice(0, 12);

    const meta: DayWorkoutMeta = {
      dayNumber: safeDay,
      programId: "belly_fat_shred",
      title: `Day ${safeDay}: ${category} Protocol`,
      category,
      targetMuscles,
      estimatedDuration: "40-50 mins",
      estimatedCalories: 460,
      isRestDay: false,
      isCardioOnly: category === "Walking or running",
      cardioDistance: category === "Walking or running" ? "5 to 10 KM" : undefined,
      guidelines: [
        "Core stabilization and systemic lipid oxidation.",
        "12 targeted exercises daily designed for core density and metabolic burn.",
        "Remember: Abdominal movements strengthen core muscles; overall fat loss comes from sustained energy balance and activity."
      ],
      coachingNotes: "Belly Fat Shred System builds deep core density while elevating caloric expenditure safely."
    };

    const exercises = exercisesToUse.map((ex, idx) => ({
      ...ex,
      id: `belly_d${safeDay}_ex_${idx + 1}`,
      dayNumber: safeDay
    }));
    return finalizePlan(meta, exercises);
  }

  // --------------------------------------------------------------------------
  // PROGRAM 5: RECLAIM YOUR POSTURE & VITALITY (60 DAYS)
  // --------------------------------------------------------------------------
  const dayMod = ((safeDay - 1) % 6);
  let category = "Posture correction";
  let targetMuscles = ["Upper back", "Neck mobility"];
  let pool = POSTURE_CORRECTION_EXERCISES;

  if (dayMod === 0) {
    category = "Posture correction";
    targetMuscles = ["Upper back", "Neck mobility"];
    pool = POSTURE_CORRECTION_EXERCISES;
  } else if (dayMod === 1) {
    category = "Chest opening";
    targetMuscles = ["Chest", "Shoulders"];
    pool = POSTURE_CHEST_OPENING_EXERCISES;
  } else if (dayMod === 2) {
    category = "Hip mobility";
    targetMuscles = ["Hip mobility", "Glutes"];
    pool = POSTURE_HIP_MOBILITY_EXERCISES;
  } else if (dayMod === 3) {
    category = "Spinal mobility";
    targetMuscles = ["Spinal mobility"];
    pool = POSTURE_SPINAL_MOBILITY_EXERCISES;
  } else if (dayMod === 4) {
    category = "Glute activation";
    targetMuscles = ["Glutes", "Core stability"];
    pool = POSTURE_GLUTE_ACTIVATION_EXERCISES;
  } else {
    category = "Daily movement";
    targetMuscles = ["Daily movement", "Mobility and recovery"];
    pool = POSTURE_DAILY_MOVEMENT_EXERCISES;
  }

  // Dynamic rotation for fresh variety across 60 days while guaranteeing exactly 12 exercises
  const cycleIndex = Math.floor((safeDay - 1) / 6);
  const rotationOffset = cycleIndex % 12;
  const rotated = [...pool.slice(rotationOffset), ...pool.slice(0, rotationOffset)];
  const exercisesToUse = rotated.slice(0, 12);

  const meta: DayWorkoutMeta = {
    dayNumber: safeDay,
    programId: "posture_vitality",
    title: `Day ${safeDay}: ${category}`,
    category,
    targetMuscles,
    estimatedDuration: "25-35 mins",
    estimatedCalories: 180,
    isRestDay: false,
    isCardioOnly: false,
    guidelines: [
      "Corrective biomechanics, spinal elongation, and postural alignment.",
      "12 targeted therapeutic exercises daily with mindful breathing and zero joint compression."
    ],
    coachingNotes: "Reclaim Your Posture & Vitality repairs anterior shoulder rounding, neck tension, and hip tightness."
  };

  const exercises = exercisesToUse.map((ex, idx) => ({
    ...ex,
    id: `posture_d${safeDay}_ex_${idx + 1}`,
    dayNumber: safeDay
  }));
  return finalizePlan(meta, exercises);
}
