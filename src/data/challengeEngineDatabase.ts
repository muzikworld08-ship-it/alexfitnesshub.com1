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
  POSTURE_VITALITY_POOL,
  IMMORTAL_CHEST_TRICEPS,
  IMMORTAL_BACK_BICEPS,
  IMMORTAL_CARDIO_MOBILITY,
  IMMORTAL_LEGS_SHOULDERS,
  IMMORTAL_CHEST_TRICEPS_FOREARMS,
  IMMORTAL_BACK_BICEPS_CORE,
  IMMORTAL_REST_RECOVERY,
  IMMORTAL_PURE_LOWER_BODY,
  IMMORTAL_CARDIO_RECOVERY,
  IMMORTAL_BACK_BICEPS_FOREARMS,
  IMMORTAL_LEGS_SHOULDERS_ABS
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
      "Chest and Triceps",
      "Back and Biceps",
      "Cardio and Mobility",
      "Legs and Shoulders",
      "Chest, Triceps and Forearms",
      "Back, Biceps and Core",
      "Rest and Recovery"
    ],
    equipmentRequired: ["Barbell", "Dumbbells", "Cable Machine", "Bench", "Pull-up Bar"],
    coverImage: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0025-EIeI8Vf.gif"
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
    coverImage: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif"
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
    coverImage: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1409-qKBpF7I.gif"
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
    coverImage: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0464-CosupLu.gif"
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
    coverImage: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1407-PzNxakt.gif"
  },
  gym_hypertrophy: {
    id: "gym_hypertrophy",
    name: "Gym Muscle Builder & Strength",
    tagline: "Heavy Mechanical Tension, Progressive Overload & Pure Hypertrophy",
    totalDays: 90,
    description: "The gold-standard gym bodybuilding split. Focuses on heavy multi-joint compound barbell and dumbbell lifts combined with high-tension isolation movements.",
    accentColor: "from-violet-600 to-purple-800",
    badge: "90 Days Gym Split",
    categories: [
      "Chest + Triceps",
      "Back + Biceps",
      "5 KM Active Flush",
      "Legs + Calves",
      "Shoulders + Arms + Abs",
      "5 KM Conditioning",
      "Anabolic Rest"
    ],
    equipmentRequired: ["Barbell", "Dumbbells", "Cables", "Leg Press", "Bench"],
    coverImage: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0025-EIeI8Vf.gif"
  },
  cardio_calisthenics: {
    id: "cardio_calisthenics",
    name: "Cardio, Calisthenics & Military",
    tagline: "Elite Bodyweight Relative Strength, Running Cadence & Combat Stamina",
    totalDays: 90,
    description: "Military-inspired athletic conditioning protocol combining high-volume push/pull calisthenics, core armor, jump rope agility, and 5-10 KM running stamina.",
    accentColor: "from-amber-600 to-yellow-700",
    badge: "90 Days Tactical",
    categories: [
      "Tactical Push",
      "5-10 KM Tempo Run",
      "Pull & Core Armor",
      "Agility & HIIT",
      "Endurance Calisthenics",
      "5-10 KM Military Ruck",
      "Joint Decompression"
    ],
    equipmentRequired: ["Pull-up Bar", "Dip Station", "Jump Rope", "Running Shoes"],
    coverImage: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0652-lBDjFxJ.gif"
  },
  lifestyle_academy: {
    id: "lifestyle_academy",
    name: "Lifestyle Fitness Academy",
    tagline: "Sedentary Reset, Posture Realignment & Functional Longevity",
    totalDays: 90,
    description: "Built for modern desk workers and active lifestyle seekers to reverse prolonged sitting, alleviate anterior rounded posture, activate glutes, and foster metabolic vitality.",
    accentColor: "from-cyan-600 to-blue-700",
    badge: "90 Days Academy",
    categories: [
      "Posture Alignment",
      "Hip Flexor Reset",
      "Aerobic Walking",
      "Chest Opening",
      "Spinal Core Stability",
      "Glute Kinetic Chain",
      "Restorative Recovery"
    ],
    equipmentRequired: ["Yoga Mat", "Light Resistance Band", "Walking Shoes"],
    coverImage: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1407-PzNxakt.gif"
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
    gifUrl: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0025-EIeI8Vf.gif"
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

const IMMORTAL_CARDIO_MOBILITY: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Cardio and Mobility",
    muscleGroup: ["Cardio", "Cardiovascular System"],
    exerciseName: "Dedicated Cardio Session: Running, Brisk Walking, Cycling, or Jogging",
    equipment: "Running Shoes, Treadmill, Outdoor Route, or Stationary Bike",
    difficulty: "Beginner",
    sets: 1,
    reps: "5 to 10 KM",
    duration: "45-75 mins",
    instructions: [
      "Select your cardio modality: Outdoor running, brisk walking, cycling, or jogging.",
      "Target 5 to 10 KM based on your current fitness level (Beginner: 5 km, Intermediate: 7.5 km, Advanced: 10 km).",
      "Maintain a steady aerobic Zone 2 heart rate (conversational pace).",
      "Strict rule: No weight training or resistance workouts are permitted today. Dedicated cardio only.",
      "Hydrate continuously with water and electrolytes throughout the session."
    ],
    restTime: "Continuous pacing",
    coachingCues: ["Keep cadence light and smooth", "Breathe through nose and diaphragm"]
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Cardio and Mobility",
    muscleGroup: ["Mobility"],
    exerciseName: "Thoracic Spine Foam Rolling & Extension",
    equipment: "Foam Roller & Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "10 extensions",
    duration: "3 mins",
    instructions: [
      "Position foam roller across mid-back with hands cradling neck.",
      "Gently extend upper back over roller while keeping hips on floor.",
      "Roll up and down mid-thoracic region to mobilize thoracic vertebrae."
    ],
    restTime: "30s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Cardio and Mobility",
    muscleGroup: ["Mobility"],
    exerciseName: "Dynamic Hip Flexor & Psoas Stretch",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "45s per side",
    duration: "3 mins",
    instructions: [
      "Kneel in half-kneeling lunge position with upright torso.",
      "Tuck pelvis under (posterior pelvic tilt) and gently shift forward.",
      "Feel deep release through anterior hip flexor and psoas."
    ],
    restTime: "30s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Cardio and Mobility",
    muscleGroup: ["Mobility"],
    exerciseName: "90/90 Dynamic Hip Mobility Flow",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "8 transitions / side",
    duration: "3 mins",
    instructions: [
      "Sit on floor with front and rear legs at 90-degree angles.",
      "Smoothly rotate knees across without using hands if mobility permits.",
      "Mobilizes internal and external hip rotation for squat depth."
    ],
    restTime: "30s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Cardio and Mobility",
    muscleGroup: ["Mobility"],
    exerciseName: "Standing Ankle Dorsiflexion & Calf Mobility Stretch",
    equipment: "Wall or Step",
    difficulty: "Beginner",
    sets: 3,
    reps: "40s per leg",
    duration: "3 mins",
    instructions: [
      "Place toes against wall with heel down, drive knee over center of toes.",
      "Improves closed-chain ankle dorsiflexion, Achilles elasticity, and running stride."
    ],
    restTime: "30s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Cardio and Mobility",
    muscleGroup: ["Mobility"],
    exerciseName: "Scapular Wall Slides & Shoulder Dislocates",
    equipment: "Resistance Band or Broomstick & Wall",
    difficulty: "Beginner",
    sets: 3,
    reps: "12 repetitions",
    duration: "3 mins",
    instructions: [
      "Stand with back, elbows, and wrists against wall, sliding arms upward without arching back.",
      "Use band/stick to pass arms overhead in controlled arcs to open shoulder capsules."
    ],
    restTime: "30s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Cardio and Mobility",
    muscleGroup: ["Mobility", "Recovery"],
    exerciseName: "Supine Lumbar Decompression & Diaphragmatic Box Breathing",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 1,
    reps: "5 minutes",
    duration: "5 mins",
    instructions: [
      "Lie supine with calves elevated on bench or couch in 90/90 position.",
      "Inhale 4 seconds, hold 4 seconds, exhale 4 seconds, hold 4 seconds.",
      "Activates parasympathetic vagus nerve and decompresses lumbar spine."
    ],
    restTime: "Full recovery"
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
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs + Shoulders",
    muscleGroup: ["Legs", "Glutes"],
    exerciseName: "Bulgarian Split Squats",
    equipment: "Dumbbells & Bench",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12 each leg",
    duration: "45s set",
    instructions: [
      "Elevate rear foot on bench behind you. Lower front thigh parallel to floor and drive through front heel."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs + Shoulders",
    muscleGroup: ["Legs", "Hamstrings"],
    exerciseName: "Lying Leg Curls",
    equipment: "Leg Curl Machine",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    duration: "40s set",
    instructions: [
      "Lie face down with roller padded behind ankles. Curl heels toward glutes and control eccentric descent."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs + Shoulders",
    muscleGroup: ["Shoulders"],
    exerciseName: "Arnold Dumbbell Press",
    equipment: "Dumbbells & Bench",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12",
    duration: "45s set",
    instructions: [
      "Hold dumbbells in front with palms facing you. Rotate wrists outward as you press up into overhead extension."
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
  ...IMMORTAL_LEGS_SHOULDERS.slice(0, 9).map(ex => ({ ...ex, category: "Legs + Shoulders + Abs" })),
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

const IMMORTAL_PURE_LOWER_BODY: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  ...IMMORTAL_LEGS_SHOULDERS.slice(0, 5).map(ex => ({ ...ex, category: "Legs & Lower Body" })),
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs & Lower Body",
    muscleGroup: ["Legs", "Glutes"],
    exerciseName: "Bulgarian Split Squat",
    equipment: "Dumbbells & Bench",
    difficulty: "Advanced",
    sets: 3,
    reps: "10-12 per leg",
    duration: "45s set",
    instructions: [
      "Place rear foot on bench behind you.",
      "Lower front knee toward floor while keeping torso upright.",
      "Drive through front heel to return to top."
    ],
    restTime: "75s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs & Lower Body",
    muscleGroup: ["Hamstrings"],
    exerciseName: "Lying Leg Curls",
    equipment: "Leg Curl Machine",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12-15",
    duration: "40s set",
    instructions: [
      "Lie face down with roller padded behind ankles.",
      "Curl heels smoothly toward glutes, pausing for 1 second at top.",
      "Lower under control for 3 seconds."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs & Lower Body",
    muscleGroup: ["Glutes"],
    exerciseName: "Barbell Hip Thrust",
    equipment: "Barbell & Bench",
    difficulty: "Intermediate",
    sets: 4,
    reps: "10-12",
    duration: "45s set",
    instructions: [
      "Rest upper back on bench with padded barbell across pelvis.",
      "Drive hips toward ceiling until thighs and torso align.",
      "Squeeze glutes hard at apex for 2 seconds."
    ],
    restTime: "90s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs & Lower Body",
    muscleGroup: ["Legs", "Quads"],
    exerciseName: "Goblet Squat",
    equipment: "Kettlebell or Dumbbell",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    duration: "40s set",
    instructions: [
      "Hold weight vertically against chest with elbows tucked.",
      "Squat deeply between hips, keeping chest elevated.",
      "Drive up through midfoot."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs & Lower Body",
    muscleGroup: ["Legs", "Glutes"],
    exerciseName: "Sumo Deadlift",
    equipment: "Barbell or Dumbbells",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12",
    duration: "45s set",
    instructions: [
      "Set a wide stance with toes pointed 45 degrees outward.",
      "Hinge hips back and grasp barbell inside knees.",
      "Drive floor away through heels, locking out hips cleanly."
    ],
    restTime: "90s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs & Lower Body",
    muscleGroup: ["Legs", "Quads"],
    exerciseName: "Dumbbell Step-Ups",
    equipment: "Dumbbells & Plyo Box",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12 per leg",
    duration: "45s set",
    instructions: [
      "Step whole foot firmly onto box surface.",
      "Drive through lead heel to elevate body without pushing off back toes.",
      "Step down smoothly under control."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Legs & Lower Body",
    muscleGroup: ["Calves"],
    exerciseName: "Seated Calf Raise",
    equipment: "Calf Machine or Dumbbells",
    difficulty: "Beginner",
    sets: 3,
    reps: "15-20",
    duration: "40s set",
    instructions: [
      "Sit with knees bent at 90 degrees and weight resting on lower thighs.",
      "Lower heels below platform edge for deep stretch.",
      "Elevate toes as high as possible, holding contraction."
    ],
    restTime: "45s"
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

const IMMORTAL_CHEST_TRICEPS_FOREARMS: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest, Triceps and Forearms",
    muscleGroup: ["Chest"],
    exerciseName: "Incline Barbell Bench Press",
    equipment: "Barbell & Incline Bench",
    difficulty: "Intermediate",
    sets: 4,
    reps: "8-10",
    duration: "45s set",
    instructions: [
      "Set bench at 30 degrees, grip barbell shoulder-width apart.",
      "Lower bar with control to upper chest, then press explosively upward."
    ],
    restTime: "90s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest, Triceps and Forearms",
    muscleGroup: ["Chest"],
    exerciseName: "Flat Dumbbell Bench Press",
    equipment: "Dumbbells & Flat Bench",
    difficulty: "Intermediate",
    sets: 4,
    reps: "10-12",
    duration: "45s set",
    instructions: [
      "Lie on flat bench, press dumbbells up over chest with neutral or pronated grip.",
      "Lower deep into chest stretch with elbows at 45 degrees."
    ],
    restTime: "75s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest, Triceps and Forearms",
    muscleGroup: ["Chest"],
    exerciseName: "Cable Crossover Pec Fly",
    equipment: "Cable Machine",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    duration: "40s set",
    instructions: [
      "Step forward from high pulleys, pull handles in an arc until knuckles meet in front of chest.",
      "Squeeze pectorals intensely for 1 second."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest, Triceps and Forearms",
    muscleGroup: ["Chest", "Triceps"],
    exerciseName: "Parallel Bar Dips",
    equipment: "Dip Station",
    difficulty: "Advanced",
    sets: 3,
    reps: "10-12",
    duration: "45s set",
    instructions: [
      "Grip dip bars, lower body until elbows reach 90 degrees.",
      "Press through palms to lockout, engaging triceps and lower chest."
    ],
    restTime: "75s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest, Triceps and Forearms",
    muscleGroup: ["Triceps"],
    exerciseName: "Close-Grip Barbell Bench Press",
    equipment: "Barbell & Bench",
    difficulty: "Intermediate",
    sets: 3,
    reps: "8-10",
    duration: "45s set",
    instructions: [
      "Grip bar shoulder-width, keep elbows tucked against torso.",
      "Press to lockout focusing entirely on triceps extension."
    ],
    restTime: "75s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest, Triceps and Forearms",
    muscleGroup: ["Triceps"],
    exerciseName: "Cable Tricep Pushdown",
    equipment: "Cable Machine & Rope",
    difficulty: "Beginner",
    sets: 4,
    reps: "12-15",
    duration: "40s set",
    instructions: [
      "Pin elbows against ribcage, push rope downward and flare handles apart at bottom.",
      "Squeeze lateral triceps heads hard."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest, Triceps and Forearms",
    muscleGroup: ["Triceps"],
    exerciseName: "Overhead EZ-Bar French Press",
    equipment: "EZ-Bar & Bench",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12",
    duration: "40s set",
    instructions: [
      "Sit upright, press EZ-bar overhead, hinge at elbows lowering behind head.",
      "Extend arms upward targeting the long head of the triceps."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest, Triceps and Forearms",
    muscleGroup: ["Triceps"],
    exerciseName: "Dumbbell Tricep Kickbacks",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    duration: "35s set",
    instructions: [
      "Hinge at hips, keep upper arm parallel to floor, extend forearm backward.",
      "Hold peak contraction for 1 second."
    ],
    restTime: "45s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest, Triceps and Forearms",
    muscleGroup: ["Forearms"],
    exerciseName: "Standing Barbell Wrist Curl",
    equipment: "Barbell",
    difficulty: "Beginner",
    sets: 3,
    reps: "15-20",
    duration: "35s set",
    instructions: [
      "Hold barbell with underhand grip, curl wrists upward contracting forearm flexors.",
      "Lower bar slowly to fingertips for deep stretch."
    ],
    restTime: "45s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest, Triceps and Forearms",
    muscleGroup: ["Forearms"],
    exerciseName: "Reverse Grip EZ-Bar Curl",
    equipment: "EZ-Bar",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12-15",
    duration: "40s set",
    instructions: [
      "Grip EZ-bar with overhand pronated grip, curl upward toward collarbones.",
      "Isolates brachioradialis and wrist extensor muscles."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest, Triceps and Forearms",
    muscleGroup: ["Forearms"],
    exerciseName: "Behind-the-Back Barbell Wrist Curl",
    equipment: "Barbell",
    difficulty: "Beginner",
    sets: 3,
    reps: "15-20",
    duration: "35s set",
    instructions: [
      "Stand holding barbell behind back with palms facing away.",
      "Curl wrists upward toward ceiling, squeezing forearm flexors tightly."
    ],
    restTime: "45s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Chest, Triceps and Forearms",
    muscleGroup: ["Forearms"],
    exerciseName: "Farmer's Heavy Suitcase Walk",
    equipment: "Heavy Dumbbells or Kettlebells",
    difficulty: "Intermediate",
    sets: 3,
    reps: "45s carry",
    duration: "45s set",
    instructions: [
      "Pick up heavy weights with crushing grip, stand tall with shoulders pinned back.",
      "Walk with steady controlled cadence building grip endurance and forearm density."
    ],
    restTime: "60s"
  }
];

const IMMORTAL_BACK_BICEPS_CORE: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back, Biceps and Core",
    muscleGroup: ["Back", "Biceps"],
    exerciseName: "Neutral-Grip Pull-ups / Chin-ups",
    equipment: "Pull-up Bar",
    difficulty: "Advanced",
    sets: 4,
    reps: "8-10",
    duration: "45s set",
    instructions: [
      "Grip parallel bars with palms facing each other.",
      "Pull chest to bar level, driving elbows down and squeezing lats and biceps.",
      "Lower under control with full eccentric extension."
    ],
    restTime: "90s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back, Biceps and Core",
    muscleGroup: ["Back"],
    exerciseName: "Chest-Supported Dumbbell Row",
    equipment: "Dumbbells & Incline Bench",
    difficulty: "Intermediate",
    sets: 4,
    reps: "10-12",
    duration: "45s set",
    instructions: [
      "Lie face down on 30-degree incline bench.",
      "Row dumbbells up toward hips, retracting scapulae with zero lower back strain."
    ],
    restTime: "75s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back, Biceps and Core",
    muscleGroup: ["Back"],
    exerciseName: "Wide Grip Lat Pulldown",
    equipment: "Lat Pulldown Machine",
    difficulty: "Beginner",
    sets: 4,
    reps: "10-12",
    duration: "40s set",
    instructions: [
      "Grip wide bar, pull downward to clavicle while keeping chest lifted.",
      "Squeeze lats at bottom for 1 second."
    ],
    restTime: "75s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back, Biceps and Core",
    muscleGroup: ["Back"],
    exerciseName: "Straight-Arm Cable Lat Pushdown",
    equipment: "Cable Machine & Wide Bar",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    duration: "40s set",
    instructions: [
      "Stand with arms extended, push bar in a wide arc down to thighs.",
      "Isolates lats without bicep involvement."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back, Biceps and Core",
    muscleGroup: ["Biceps"],
    exerciseName: "Standing EZ-Bar Bicep Curl",
    equipment: "EZ-Bar",
    difficulty: "Intermediate",
    sets: 4,
    reps: "8-10",
    duration: "40s set",
    instructions: [
      "Hold EZ-bar with underhand grip, curl upward with stationary elbows.",
      "Squeeze biceps hard at apex, lower slowly for 3 seconds."
    ],
    restTime: "75s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back, Biceps and Core",
    muscleGroup: ["Biceps"],
    exerciseName: "Incline Alternating Dumbbell Curl",
    equipment: "Dumbbells & Incline Bench",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12 / arm",
    duration: "45s set",
    instructions: [
      "Lie back on incline bench, curl dumbbell while supinating wrist.",
      "Maximizes stretch on long head of bicep."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back, Biceps and Core",
    muscleGroup: ["Biceps"],
    exerciseName: "Cable Rope Hammer Curl",
    equipment: "Cable Machine & Rope",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    duration: "40s set",
    instructions: [
      "Grip rope handles with neutral palms, curl upward targeting brachialis and bicep width.",
      "Spread rope apart at top of contraction."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back, Biceps and Core",
    muscleGroup: ["Core"],
    exerciseName: "Hanging Leg / Knee Raise",
    equipment: "Pull-up Bar",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12-15",
    duration: "45s set",
    instructions: [
      "Hang from pull-up bar, raise legs or knees to 90 degrees by tucking pelvis.",
      "Lower under strict control without swinging."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back, Biceps and Core",
    muscleGroup: ["Core"],
    exerciseName: "Ab Wheel Rollout",
    equipment: "Ab Wheel & Yoga Mat",
    difficulty: "Advanced",
    sets: 3,
    reps: "10-12",
    duration: "40s set",
    instructions: [
      "Kneel on mat, roll wheel forward maintaining hollow body pelvic tilt.",
      "Pull back using abdominal wall contraction."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back, Biceps and Core",
    muscleGroup: ["Core"],
    exerciseName: "Cable Kneeling Crunch",
    equipment: "Cable Machine & Rope",
    difficulty: "Intermediate",
    sets: 3,
    reps: "15",
    duration: "40s set",
    instructions: [
      "Kneel beneath high cable pulley holding rope at temples.",
      "Flex spine downward, curling ribs toward pelvis."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back, Biceps and Core",
    muscleGroup: ["Core"],
    exerciseName: "Decline Sit-up with Controlled Twist",
    equipment: "Decline Bench",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12-15",
    duration: "45s set",
    instructions: [
      "Hook legs on decline bench, curl torso upward and rotate elbow toward opposite knee.",
      "Engages rectus abdominis and internal/external obliques."
    ],
    restTime: "60s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back, Biceps and Core",
    muscleGroup: ["Core"],
    exerciseName: "Plank to Pike Hold",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "45s set",
    duration: "45s set",
    instructions: [
      "Hold rigid plank, drive hips upward toward ceiling into pike position.",
      "Lower back with tight core stabilization."
    ],
    restTime: "45s"
  }
];

const IMMORTAL_REST_RECOVERY: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Rest and Recovery",
    muscleGroup: ["Cardio", "Recovery"],
    exerciseName: "Dedicated Cardio Session: Brisk Walking, Light Jogging, or Low-Impact Cycling",
    equipment: "Running Shoes, Treadmill, Outdoor Route, or Stationary Bike",
    difficulty: "Beginner",
    sets: 1,
    reps: "5 to 10 KM",
    duration: "45-75 mins",
    instructions: [
      "Complete your second dedicated cardio session of the week: Brisk walking, light recovery jogging, or easy cycling.",
      "Target 5 to 10 KM based on your fitness level (Beginner: 5 km, Intermediate: 7.5 km, Advanced: 10 km).",
      "Maintain a gentle aerobic Zone 1-2 recovery cadence.",
      "Strict rule: No heavy resistance or weight training is permitted today — prioritize active recovery.",
      "Following this session, enjoy complete muscular rest before beginning the next 7-day cycle."
    ],
    restTime: "Continuous pacing",
    coachingCues: ["Keep heart rate relaxed and conversational", "Breathe smoothly through nose"]
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Rest and Recovery",
    muscleGroup: ["Recovery", "Mobility"],
    exerciseName: "Active Lower Body Hamstring & Quad Flushes",
    equipment: "Yoga Mat or Foam Roller",
    difficulty: "Beginner",
    sets: 3,
    reps: "60s per leg",
    duration: "4 mins",
    instructions: [
      "Perform gentle dynamic leg swings and light foam rolling on quads and hamstrings.",
      "Flushes lactic acid and restores tissue pliability."
    ],
    restTime: "30s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Rest and Recovery",
    muscleGroup: ["Recovery", "Mobility"],
    exerciseName: "Pigeon Pose Glute & Piriformis Decompression",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "60s per side",
    duration: "4 mins",
    instructions: [
      "Place shin across front of mat, extend rear leg straight back.",
      "Sink chest toward floor releasing deep tension in gluteus medius and piriformis."
    ],
    restTime: "30s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Rest and Recovery",
    muscleGroup: ["Recovery", "Mobility"],
    exerciseName: "Spinal Erector & Thoracic Foam Rolling Release",
    equipment: "Foam Roller & Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "2 mins",
    duration: "3 mins",
    instructions: [
      "Roll along thoracic spine and gluteal attachments.",
      "Relieves spinal compression and muscle tightness."
    ],
    restTime: "30s"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Rest and Recovery",
    muscleGroup: ["Recovery"],
    exerciseName: "Deep Diaphragmatic Box Breathing & Cellular Hydration",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 1,
    reps: "10 mins",
    duration: "10 mins",
    instructions: [
      "Lie flat with knees bent or legs elevated on a couch.",
      "Practice 4-4-4-4 box breathing to activate deep parasympathetic nervous system recovery.",
      "Drink 1 liter of mineral-rich water with electrolytes."
    ],
    restTime: "Full rest"
  },
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Rest and Recovery",
    muscleGroup: ["Recovery"],
    exerciseName: "Full Muscular & Central Nervous System Rest Protocol",
    equipment: "None / Bed or Recliner",
    difficulty: "Beginner",
    sets: 1,
    reps: "Rest Day",
    duration: "Rest Protocol",
    instructions: [
      "Zero resistance or weight training today. Full systemic rest.",
      "Restores intramuscular glycogen reserves and prepares body for Day 1 of the repeating 7-day cycle."
    ],
    restTime: "Full rest"
  }
];

const IMMORTAL_CHEST_TRICEPS_NECK = IMMORTAL_CHEST_TRICEPS_FOREARMS;
const IMMORTAL_BACK_BICEPS_FOREARMS_ABS = IMMORTAL_BACK_BICEPS_CORE;
const IMMORTAL_CARDIO_RECOVERY = IMMORTAL_CARDIO_MOBILITY;

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
    gifUrl: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1409-qKBpF7I.gif"
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
    exerciseName: "Frog Pump Glute Burner",
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
// GYM HYPERTROPHY EXERCISE POOLS (PURE GYM COMPOUND & ISOLATION)
// ============================================================================
export const GYM_HYPERTROPHY_CHEST_TRICEPS: Omit<ChallengeExerciseItem, "dayNumber">[] = [
  {
    id: "gym_chest_1",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Chest + Triceps",
    muscleGroup: ["Chest", "Pectorals"],
    exerciseName: "Barbell Bench Press",
    equipment: "Barbell",
    difficulty: "Intermediate",
    sets: 4,
    reps: "8-10 reps",
    duration: "60s set",
    instructions: ["Retract scapulae against bench, plant feet, grip barbell slightly wider than shoulder-width, lower bar to mid-chest under 3s control, press upward."],
    restTime: "90s"
  },
  {
    id: "gym_chest_2",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Chest + Triceps",
    muscleGroup: ["Chest", "Upper Pectorals"],
    exerciseName: "Incline Dumbbell Press",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    sets: 4,
    reps: "10-12 reps",
    duration: "50s set",
    instructions: ["Set bench to 30-45 degrees. Press dumbbells upward with elbows at 45 degrees, squeezing upper chest at peak."],
    restTime: "75s"
  },
  {
    id: "gym_chest_3",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Chest + Triceps",
    muscleGroup: ["Chest"],
    exerciseName: "Dumbbell Flyes",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12-15 reps",
    duration: "45s set",
    instructions: ["Lie flat on bench, open arms wide with slight elbow bend, feel deep pec stretch, hug dumbbells together."],
    restTime: "60s"
  },
  {
    id: "gym_chest_4",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Chest + Triceps",
    muscleGroup: ["Chest", "Triceps"],
    exerciseName: "Chest Dips",
    equipment: "Parallel Bars",
    difficulty: "Advanced",
    sets: 3,
    reps: "10-12 reps",
    duration: "45s set",
    instructions: ["Lean torso forward 30 degrees, flare elbows slightly, descend until shoulders are below elbows, drive back up."],
    restTime: "75s"
  },
  {
    id: "gym_chest_5",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Chest + Triceps",
    muscleGroup: ["Triceps"],
    exerciseName: "Triceps Pushdown",
    equipment: "Cable",
    difficulty: "Intermediate",
    sets: 4,
    reps: "12-15 reps",
    duration: "45s set",
    instructions: ["Pin elbows to ribs, press rope/bar downward until triceps fully contract, control negative return."],
    restTime: "60s"
  },
  {
    id: "gym_chest_6",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Chest + Triceps",
    muscleGroup: ["Triceps", "Long Head"],
    exerciseName: "Overhead Dumbbell Triceps Extension",
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12 reps",
    duration: "45s set",
    instructions: ["Hold dumbbell overhead with both hands, lower behind head keeping elbows pointed forward, press back up."],
    restTime: "60s"
  },
  {
    id: "gym_chest_7",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Chest + Triceps",
    muscleGroup: ["Triceps", "Chest"],
    exerciseName: "Close-Grip Barbell Bench Press",
    equipment: "Barbell",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10 reps",
    duration: "50s set",
    instructions: ["Grip bar shoulder-width, keep elbows tucked to sides, lower to lower sternum, drive through triceps."],
    restTime: "75s"
  },
  {
    id: "gym_chest_8",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Chest + Triceps",
    muscleGroup: ["Chest", "Triceps"],
    exerciseName: "Push Ups",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: 3,
    reps: "15-20 reps",
    duration: "40s set",
    instructions: ["Maintain rigid plank line, lower chest to floor with elbows 45 degrees, push up explosively."],
    restTime: "60s"
  }
];

export const GYM_HYPERTROPHY_BACK_BICEPS: Omit<ChallengeExerciseItem, "dayNumber">[] = [
  {
    id: "gym_back_1",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Back + Biceps",
    muscleGroup: ["Back", "Posterior Chain"],
    exerciseName: "Barbell Deadlift",
    equipment: "Barbell",
    difficulty: "Advanced",
    sets: 4,
    reps: "6-8 reps",
    duration: "60s set",
    instructions: ["Hinge at hips, grip bar outside shins, brace core, drive through floor keeping spine neutral throughout."],
    restTime: "120s"
  },
  {
    id: "gym_back_2",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Back + Biceps",
    muscleGroup: ["Back", "Lats", "Rhomboids"],
    exerciseName: "Barbell Bent-Over Row",
    equipment: "Barbell",
    difficulty: "Intermediate",
    sets: 4,
    reps: "8-10 reps",
    duration: "50s set",
    instructions: ["Hinge torso to 45 degrees, pull bar to navel driving elbows backward, squeeze scapulae together."],
    restTime: "90s"
  },
  {
    id: "gym_back_3",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Back + Biceps",
    muscleGroup: ["Back", "Lats"],
    exerciseName: "Lat Pulldown",
    equipment: "Cable",
    difficulty: "Intermediate",
    sets: 4,
    reps: "10-12 reps",
    duration: "45s set",
    instructions: ["Grip wide, depress shoulders, pull bar to upper chest arching thoracic spine slightly."],
    restTime: "75s"
  },
  {
    id: "gym_back_4",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Back + Biceps",
    muscleGroup: ["Back", "Mid-Back"],
    exerciseName: "Seated Cable Row",
    equipment: "Cable",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12 reps",
    duration: "45s set",
    instructions: ["Sit tall, pull attachment into lower abdomen, keep chest tall and avoid torso swinging."],
    restTime: "60s"
  },
  {
    id: "gym_back_5",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Back + Biceps",
    muscleGroup: ["Biceps"],
    exerciseName: "Barbell Bicep Curl",
    equipment: "Barbell",
    difficulty: "Intermediate",
    sets: 4,
    reps: "10-12 reps",
    duration: "45s set",
    instructions: ["Pin elbows to sides, curl barbell upward without rocking hips, lower under 3-second control."],
    restTime: "60s"
  },
  {
    id: "gym_back_6",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Back + Biceps",
    muscleGroup: ["Biceps", "Brachialis"],
    exerciseName: "Dumbbell Hammer Curls",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12 reps",
    duration: "45s set",
    instructions: ["Palms facing inward throughout, curl dumbbells smoothly, targeting brachialis and forearm thickness."],
    restTime: "60s"
  },
  {
    id: "gym_back_7",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Back + Biceps",
    muscleGroup: ["Rear Deltoids", "Upper Back"],
    exerciseName: "Cable Face Pull",
    equipment: "Cable",
    difficulty: "Intermediate",
    sets: 3,
    reps: "15 reps",
    duration: "45s set",
    instructions: ["Set pulley to eye level, pull rope toward nose while externally rotating hands backward."],
    restTime: "60s"
  },
  {
    id: "gym_back_8",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Back + Biceps",
    muscleGroup: ["Biceps"],
    exerciseName: "Preacher Curl",
    equipment: "EZ Bar / Bench",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12 reps",
    duration: "45s set",
    instructions: ["Rest arms flat against preacher pad, eliminate momentum, curl bar until biceps peak."],
    restTime: "60s"
  }
];

export const GYM_HYPERTROPHY_LEGS_CALVES: Omit<ChallengeExerciseItem, "dayNumber">[] = [
  {
    id: "gym_leg_1",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Legs + Calves",
    muscleGroup: ["Quads", "Glutes"],
    exerciseName: "Barbell Back Squat",
    equipment: "Barbell",
    difficulty: "Advanced",
    sets: 4,
    reps: "8-10 reps",
    duration: "60s set",
    instructions: ["Bar across upper traps, brace core 360 degrees, sit deep below parallel with knees tracking over toes."],
    restTime: "120s"
  },
  {
    id: "gym_leg_2",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Legs + Calves",
    muscleGroup: ["Hamstrings", "Glutes"],
    exerciseName: "Romanian Deadlift",
    equipment: "Barbell",
    difficulty: "Intermediate",
    sets: 4,
    reps: "10-12 reps",
    duration: "50s set",
    instructions: ["Slight knee bend, push hips far backward until deep hamstring stretch is felt, drive hips forward to lockout."],
    restTime: "90s"
  },
  {
    id: "gym_leg_3",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Legs + Calves",
    muscleGroup: ["Quads", "Glutes"],
    exerciseName: "Leg Press",
    equipment: "Machine",
    difficulty: "Intermediate",
    sets: 4,
    reps: "12-15 reps",
    duration: "50s set",
    instructions: ["Feet shoulder-width on sled, lower platform until knees are 90 degrees without rounding lower back, press up."],
    restTime: "90s"
  },
  {
    id: "gym_leg_4",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Legs + Calves",
    muscleGroup: ["Hamstrings"],
    exerciseName: "Lying Leg Curls",
    equipment: "Machine",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12 reps",
    duration: "45s set",
    instructions: ["Lie prone, curl pad toward glutes holding peak contraction for 1 second, control the 3s negative."],
    restTime: "60s"
  },
  {
    id: "gym_leg_5",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Legs + Calves",
    muscleGroup: ["Quads"],
    exerciseName: "Leg Extensions",
    equipment: "Machine",
    difficulty: "Intermediate",
    sets: 3,
    reps: "15 reps",
    duration: "45s set",
    instructions: ["Extend knees fully, lock out quads briefly at top, control eccentric return without letting weight stack slam."],
    restTime: "60s"
  },
  {
    id: "gym_leg_6",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Legs + Calves",
    muscleGroup: ["Calves"],
    exerciseName: "Standing Calf Raises",
    equipment: "Machine",
    difficulty: "Intermediate",
    sets: 4,
    reps: "15-20 reps",
    duration: "45s set",
    instructions: ["Full stretch at bottom of step for 1s, rise high on balls of feet, squeeze calves at peak."],
    restTime: "45s"
  },
  {
    id: "gym_leg_7",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Legs + Calves",
    muscleGroup: ["Glutes", "Quads"],
    exerciseName: "Walking Dumbbell Lunges",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12 steps per leg",
    duration: "50s set",
    instructions: ["Hold dumbbells at sides, step forward into 90-degree lunge, drive through front heel to step next leg."],
    restTime: "75s"
  }
];

export const GYM_HYPERTROPHY_SHOULDERS_ARMS_ABS: Omit<ChallengeExerciseItem, "dayNumber">[] = [
  {
    id: "gym_shld_1",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Shoulders + Arms + Abs",
    muscleGroup: ["Shoulders", "Deltoids"],
    exerciseName: "Overhead Barbell Shoulder Press",
    equipment: "Barbell",
    difficulty: "Advanced",
    sets: 4,
    reps: "8-10 reps",
    duration: "55s set",
    instructions: ["Bar across clavicles, lock glutes and abs, press straight overhead clearing chin, lock out elbows."],
    restTime: "90s"
  },
  {
    id: "gym_shld_2",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Shoulders + Arms + Abs",
    muscleGroup: ["Shoulders", "Lateral Delts"],
    exerciseName: "Dumbbell Lateral Raise",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    sets: 4,
    reps: "12-15 reps",
    duration: "45s set",
    instructions: ["Lead with elbows, raise dumbbells to shoulder height, slight forward lean, pause briefly at top."],
    restTime: "60s"
  },
  {
    id: "gym_shld_3",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Shoulders + Arms + Abs",
    muscleGroup: ["Rear Deltoids"],
    exerciseName: "Bent-Over Dumbbell Reverse Fly",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    sets: 3,
    reps: "15 reps",
    duration: "45s set",
    instructions: ["Hinge at waist, raise dumbbells outward with arms rounded, squeeze rear delts at peak."],
    restTime: "60s"
  },
  {
    id: "gym_shld_4",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Shoulders + Arms + Abs",
    muscleGroup: ["Triceps"],
    exerciseName: "Lying Triceps Extension (Skull Crushers)",
    equipment: "EZ Bar / Bench",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12 reps",
    duration: "45s set",
    instructions: ["Lie on flat bench, lower bar toward forehead by bending elbows only, extend triceps back to vertical."],
    restTime: "60s"
  },
  {
    id: "gym_shld_5",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Shoulders + Arms + Abs",
    muscleGroup: ["Biceps"],
    exerciseName: "Incline Dumbbell Curl",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12 reps",
    duration: "45s set",
    instructions: ["Set bench to 45 degrees, allow arms to hang fully extended for deep bicep stretch, curl upward."],
    restTime: "60s"
  },
  {
    id: "gym_shld_6",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Shoulders + Arms + Abs",
    muscleGroup: ["Abs", "Core"],
    exerciseName: "Hanging Leg Raises",
    equipment: "Pull-Up Bar",
    difficulty: "Advanced",
    sets: 3,
    reps: "12-15 reps",
    duration: "45s set",
    instructions: ["Hang from bar, curl pelvis upward, raise knees or toes to bar height without swinging."],
    restTime: "60s"
  },
  {
    id: "gym_shld_7",
    programId: "gym_hypertrophy",
    programName: "Gym Muscle Builder & Strength",
    category: "Shoulders + Arms + Abs",
    muscleGroup: ["Abs"],
    exerciseName: "Cable Crunch",
    equipment: "Cable",
    difficulty: "Intermediate",
    sets: 3,
    reps: "15 reps",
    duration: "45s set",
    instructions: ["Kneel with rope behind head, flex spine to bring elbows toward knees, squeeze abdominals tightly."],
    restTime: "60s"
  }
];

// ============================================================================
// TACTICAL CALISTHENICS & MILITARY EXERCISE POOLS
// ============================================================================
export const TACTICAL_PUSH_EXERCISES: Omit<ChallengeExerciseItem, "dayNumber">[] = [
  {
    id: "tact_push_1",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "Tactical Calisthenics & Push",
    muscleGroup: ["Chest", "Triceps", "Core"],
    exerciseName: "Standard Push Ups",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: 4,
    reps: "20-25 reps",
    duration: "45s set",
    instructions: ["Rigid body plank, lower chest until touching floor, push back up with full protraction."],
    restTime: "60s"
  },
  {
    id: "tact_push_2",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "Tactical Calisthenics & Push",
    muscleGroup: ["Triceps", "Chest"],
    exerciseName: "Diamond Push Ups",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12-15 reps",
    duration: "40s set",
    instructions: ["Thumbs and index fingers touching under chest, lower under control, drive through triceps."],
    restTime: "60s"
  },
  {
    id: "tact_push_3",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "Tactical Calisthenics & Push",
    muscleGroup: ["Chest", "Triceps", "Shoulders"],
    exerciseName: "Parallel Bar Dips",
    equipment: "Dip Bars",
    difficulty: "Intermediate",
    sets: 4,
    reps: "12-15 reps",
    duration: "45s set",
    instructions: ["Lower under control until elbows reach 90 degrees, press upward explosively."],
    restTime: "75s"
  },
  {
    id: "tact_push_4",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "Tactical Calisthenics & Push",
    muscleGroup: ["Shoulders", "Triceps"],
    exerciseName: "Pike Push Ups",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12 reps",
    duration: "40s set",
    instructions: ["Hips piked high in inverted V, lower head forward between hands, press backward to starting pike."],
    restTime: "60s"
  },
  {
    id: "tact_push_5",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "Tactical Calisthenics & Push",
    muscleGroup: ["Full Body", "Conditioning"],
    exerciseName: "Burpees",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    sets: 3,
    reps: "15 reps",
    duration: "45s set",
    instructions: ["Drop into squat, kick feet back to push up, lower chest to floor, jump feet in, leap vertically."],
    restTime: "60s"
  },
  {
    id: "tact_push_6",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "Tactical Calisthenics & Push",
    muscleGroup: ["Core", "Shoulders"],
    exerciseName: "Plank to Push-Up",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12 reps",
    duration: "45s set",
    instructions: ["Forearm plank position, press hand into ground to push up to top pushup position, return down."],
    restTime: "45s"
  }
];

export const TACTICAL_PULL_CORE_EXERCISES: Omit<ChallengeExerciseItem, "dayNumber">[] = [
  {
    id: "tact_pull_1",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "Military Pull & Core Armor",
    muscleGroup: ["Back", "Biceps", "Core"],
    exerciseName: "Pull Ups",
    equipment: "Pull-Up Bar",
    difficulty: "Advanced",
    sets: 4,
    reps: "8-12 reps",
    duration: "45s set",
    instructions: ["Overhand grip wider than shoulders, pull chest to bar without kipping, lower to full dead-hang."],
    restTime: "90s"
  },
  {
    id: "tact_pull_2",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "Military Pull & Core Armor",
    muscleGroup: ["Biceps", "Lats"],
    exerciseName: "Chin Ups",
    equipment: "Pull-Up Bar",
    difficulty: "Intermediate",
    sets: 3,
    reps: "8-10 reps",
    duration: "40s set",
    instructions: ["Underhand grip shoulder-width, drive elbows down, pull chin clearing bar, lower with control."],
    restTime: "75s"
  },
  {
    id: "tact_pull_3",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "Military Pull & Core Armor",
    muscleGroup: ["Upper Back", "Biceps"],
    exerciseName: "Inverted Rows",
    equipment: "Low Bar / Rings",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12 reps",
    duration: "45s set",
    instructions: ["Hang under bar with heels planted, pull sternum to bar squeezing scapulae, lower smooth."],
    restTime: "60s"
  },
  {
    id: "tact_pull_4",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "Military Pull & Core Armor",
    muscleGroup: ["Abs", "Hip Flexors"],
    exerciseName: "Hanging Leg Raises",
    equipment: "Pull-Up Bar",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12-15 reps",
    duration: "45s set",
    instructions: ["Hang stationary from bar, curl pelvis up and lift straight legs to horizontal or higher."],
    restTime: "60s"
  },
  {
    id: "tact_pull_5",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "Military Pull & Core Armor",
    muscleGroup: ["Core", "Abs"],
    exerciseName: "Plank Hold",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: 3,
    reps: "60s hold",
    duration: "60s set",
    instructions: ["Forearms on ground, glutes squeezed, abs hollowed, breathe rhythmically without hips sagging."],
    restTime: "45s"
  },
  {
    id: "tact_pull_6",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "Military Pull & Core Armor",
    muscleGroup: ["Obliques", "Rotational Core"],
    exerciseName: "Russian Twists",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: 3,
    reps: "20 reps per side",
    duration: "45s set",
    instructions: ["Balance on sit bones with feet elevated, rotate torso touching hands to floor on each side."],
    restTime: "45s"
  }
];

export const TACTICAL_AGILITY_HIIT_EXERCISES: Omit<ChallengeExerciseItem, "dayNumber">[] = [
  {
    id: "tact_agi_1",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "Functional Agility & Jump Rope HIIT",
    muscleGroup: ["Cardio", "Calves", "Coordination"],
    exerciseName: "Jump Rope",
    equipment: "Jump Rope",
    difficulty: "Intermediate",
    sets: 4,
    reps: "2 mins continuous",
    duration: "2 mins",
    instructions: ["Light on balls of feet, turn rope with wrists, stay bouncy with minimal knee flexion."],
    restTime: "45s"
  },
  {
    id: "tact_agi_2",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "Functional Agility & Jump Rope HIIT",
    muscleGroup: ["Cardio", "Hip Flexors"],
    exerciseName: "High Knees",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: 4,
    reps: "45s sprint",
    duration: "45s set",
    instructions: ["Drive knees to hip height at maximum sprint cadence, pumping arms in rhythm."],
    restTime: "30s"
  },
  {
    id: "tact_agi_3",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "Functional Agility & Jump Rope HIIT",
    muscleGroup: ["Core", "Cardio"],
    exerciseName: "Mountain Climbers",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: 4,
    reps: "45s sprint",
    duration: "45s set",
    instructions: ["Top of push-up position, alternate driving knees to chest without bouncing hips."],
    restTime: "30s"
  },
  {
    id: "tact_agi_4",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "Functional Agility & Jump Rope HIIT",
    muscleGroup: ["Legs", "Explosive Power"],
    exerciseName: "Jump Squats",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    sets: 3,
    reps: "15 reps",
    duration: "40s set",
    instructions: ["Descend into full squat, explode vertically off floor reaching high, absorb landing softly into next squat."],
    restTime: "60s"
  },
  {
    id: "tact_agi_5",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "Functional Agility & Jump Rope HIIT",
    muscleGroup: ["Cardio", "Full Body"],
    exerciseName: "Jumping Jacks",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: 3,
    reps: "60s continuous",
    duration: "60s set",
    instructions: ["Rhythmic arm and leg abduction, light landing on toes, maintain elevated breathing rate."],
    restTime: "30s"
  }
];

export const TACTICAL_ENDURANCE_EXERCISES: Omit<ChallengeExerciseItem, "dayNumber">[] = [
  {
    id: "tact_end_1",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "High-Volume Calisthenics Endurance",
    muscleGroup: ["Chest", "Triceps", "Shoulders"],
    exerciseName: "Push-Up Pyramid",
    equipment: "Bodyweight",
    difficulty: "Advanced",
    sets: 5,
    reps: "15-20 reps",
    duration: "45s set",
    instructions: ["Perform sets of 20, 18, 16, 14, 12 reps with strict tempo and minimal rest."],
    restTime: "45s"
  },
  {
    id: "tact_end_2",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "High-Volume Calisthenics Endurance",
    muscleGroup: ["Quads", "Glutes"],
    exerciseName: "Bodyweight Air Squats",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: 4,
    reps: "30 reps",
    duration: "60s set",
    instructions: ["Full depth squats, hips below knees, continuous cadence without pausing at top."],
    restTime: "45s"
  },
  {
    id: "tact_end_3",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "High-Volume Calisthenics Endurance",
    muscleGroup: ["Legs", "Glutes"],
    exerciseName: "Walking Lunges",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: 3,
    reps: "20 steps per leg",
    duration: "60s set",
    instructions: ["Continuous walking lunges, trailing knee grazing floor, upright torso."],
    restTime: "60s"
  },
  {
    id: "tact_end_4",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "High-Volume Calisthenics Endurance",
    muscleGroup: ["Abs", "Hip Flexors"],
    exerciseName: "Flutter Kicks",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: 3,
    reps: "50 kicks",
    duration: "45s set",
    instructions: ["Lie flat, lower back pinned to mat, scissor legs 6 inches off ground continuously."],
    restTime: "30s"
  },
  {
    id: "tact_end_5",
    programId: "cardio_calisthenics",
    programName: "Cardio, Calisthenics & Military",
    category: "High-Volume Calisthenics Endurance",
    muscleGroup: ["Core"],
    exerciseName: "Hollow Body Hold",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    sets: 3,
    reps: "45s hold",
    duration: "45s set",
    instructions: ["Press lower spine into floor, raise arms and legs into banana shape, hold isometric contraction."],
    restTime: "45s"
  }
];

// ============================================================================
// 3. DETERMINISTIC WORKOUT GENERATOR WITH STRICT HIERARCHY
// PROGRAM -> DAY -> CATEGORY -> MUSCLE GROUP -> EXERCISE
// ============================================================================

export function normalizeProgramId(raw: string | undefined | null): ProgramId {
  const p = (raw || "").toString().toLowerCase().trim();
  if (p.includes("immortal") || p === "90-days-immortal" || p === "90_day_immortal") return "immortal_90";
  if (p.includes("women") || p.includes("confidence")) return "women_confidence";
  if (p.includes("home") || p.includes("180")) return "home_180";
  if (p.includes("belly") || p.includes("shred")) return "belly_fat_shred";
  if (p.includes("posture") || p.includes("vitality")) return "posture_vitality";
  if (p.includes("gym") || p.includes("hypertrophy")) return "gym_hypertrophy";
  if (p.includes("calisthenics") || p.includes("military") || p.includes("tactical") || p.includes("cardio_calisthenics")) return "cardio_calisthenics";
  if (p.includes("academy") || p.includes("lifestyle")) return "lifestyle_academy";
  return "immortal_90";
}

function finalizePlan(meta: DayWorkoutMeta, exercises: ChallengeExerciseItem[]): DayExecutionPlan {
  return {
    meta,
    exercises: exercises.map(ex => {
      const exerciseName = ex.exerciseName || (ex as any).name || "";
      const gif = ex.gifUrl || getExerciseGifUrl(exerciseName, ex.category);
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

export function getWorkoutForProgramAndDay(
  programId: ProgramId | string, 
  dayNumber: number, 
  _targetMuscleHint?: string
): DayExecutionPlan {
  const safeDay = Math.max(1, Number(dayNumber) || 1);
  const pid = normalizeProgramId(programId);

  // --------------------------------------------------------------------------
  // ADMIN PROGRAM SCHEDULE OVERRIDES (Cardio Days, Custom Workouts, Edited Sets)
  // --------------------------------------------------------------------------
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const cached = window.localStorage.getItem("fit_program_schedule_overrides");
      if (cached) {
        const allOverrides = JSON.parse(cached);
        const programOverrides = allOverrides[programId as string] || allOverrides[pid] || allOverrides[normalizeProgramId(programId)];
        const cycleKey = `cycle_${((safeDay - 1) % 7) + 1}`;
        const dayOverride = programOverrides ? (programOverrides[String(safeDay)] || programOverrides[cycleKey]) : null;
        if (dayOverride) {
          if (dayOverride.isCardioOnly) {
            const cardioKm = dayOverride.cardioDistance || dayOverride.targetCardioKm || "5.0 - 10.0 KM";
            const meta: DayWorkoutMeta = {
              dayNumber: safeDay,
              programId: pid,
              title: dayOverride.title || `Day ${safeDay}: ${cardioKm} Cardio Endurance Protocol`,
              category: dayOverride.focus || "Cardiovascular & Aerobic Capacity",
              targetMuscles: ["Cardiovascular System", "Legs", "Full Body Stamina"],
              estimatedDuration: dayOverride.duration || "45-60 mins",
              estimatedCalories: 480,
              isRestDay: false,
              isCardioOnly: true,
              cardioDistance: cardioKm,
              guidelines: [
                `Target ${cardioKm} continuous distance.`,
                "Maintain steady Zone 2 or rhythmic cadence.",
                "Zero heavy resistance weight training on pure cardio days."
              ],
              coachingNotes: dayOverride.coachingNotes || `Admin Assigned Cardio Protocol: Target ${cardioKm} at steady Zone 2 or interval tempo.`
            };
            const exercises: ChallengeExerciseItem[] = (dayOverride.exercises && dayOverride.exercises.length > 0)
              ? dayOverride.exercises.map((ex: any, idx: number) => ({
                  id: ex.id || `cardio_${pid}_d${safeDay}_${idx + 1}`,
                  programId: pid,
                  programName: String(programId),
                  dayNumber: safeDay,
                  category: ex.category || "Cardio",
                  muscleGroup: Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup || "Cardio"],
                  exerciseName: ex.exerciseName || ex.name || "5 to 10 KM Cardio / Running",
                  equipment: ex.equipment || "Running Shoes / Treadmill",
                  difficulty: ex.difficulty || "Intermediate",
                  sets: typeof ex.sets === "number" ? ex.sets : 1,
                  reps: ex.reps || cardioKm,
                  duration: ex.duration || "45-60 mins",
                  instructions: Array.isArray(ex.instructions) ? ex.instructions : [ex.instructions || "Maintain steady aerobic rhythm."],
                  gifUrl: ex.gifUrl || getExerciseGifUrl(ex.exerciseName || "Treadmill Running", "Cardio")
                }))
              : [
                {
                  id: `cardio_${pid}_d${safeDay}_1`,
                  programId: pid,
                  programName: String(programId),
                  dayNumber: safeDay,
                  category: "Cardio",
                  muscleGroup: ["Cardio", "Legs"],
                  exerciseName: `Zone 2 Steady-State ${cardioKm} Jog / Walk`,
                  equipment: "Running Shoes / Treadmill",
                  difficulty: "Intermediate",
                  sets: 1,
                  reps: cardioKm,
                  duration: "45-60 mins",
                  instructions: [
                    "Warm up with 5 minutes of brisk walking.",
                    `Establish steady aerobic rhythm for ${cardioKm}.`,
                    "Cool down with light walking and lower body stretches."
                  ],
                  gifUrl: getExerciseGifUrl("Treadmill Running", "Cardio")
                }
              ];
            return finalizePlan(meta, exercises);
          } else if (dayOverride.exercises && Array.isArray(dayOverride.exercises) && dayOverride.exercises.length > 0) {
            const meta: DayWorkoutMeta = {
              dayNumber: safeDay,
              programId: pid,
              title: dayOverride.title || `Day ${safeDay}: ${dayOverride.focus || "Custom Admin Training Protocol"}`,
              category: dayOverride.focus || "Custom Targeted Split",
              targetMuscles: dayOverride.targetMuscles || ["Target Muscles"],
              estimatedDuration: dayOverride.duration || "45-55 mins",
              estimatedCalories: 500,
              isRestDay: false,
              isCardioOnly: false,
              guidelines: [
                "Admin-curated workout protocol for this scheduled day.",
                "Execute each prescribed set and rep with strict form.",
                "Adhere to rest intervals between work sets."
              ],
              coachingNotes: dayOverride.coachingNotes || "Execute with maximum mind-muscle connection and controlled tempo."
            };
            const exercises: ChallengeExerciseItem[] = dayOverride.exercises.map((ex: any, idx: number) => ({
              id: ex.id || `override_${pid}_d${safeDay}_${idx + 1}`,
              programId: pid,
              programName: String(programId),
              dayNumber: safeDay,
              category: ex.category || meta.category,
              muscleGroup: Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup || "Full Body"],
              exerciseName: ex.exerciseName || ex.name,
              equipment: ex.equipment || "Standard",
              difficulty: ex.difficulty || "Intermediate",
              sets: typeof ex.sets === "number" ? ex.sets : parseInt(String(ex.sets)) || 3,
              reps: String(ex.reps || "10-12 reps"),
              duration: ex.duration || "45s set",
              instructions: Array.isArray(ex.instructions) ? ex.instructions : [ex.instructions || ex.notes || "Execute with controlled form."],
              gifUrl: ex.gifUrl || getExerciseGifUrl(ex.exerciseName || ex.name, ex.category)
            }));
            return finalizePlan(meta, exercises);
          }
        }
      }
    }
  } catch (e) {
    console.warn("Error reading schedule overrides in getWorkoutForProgramAndDay:", e);
  }

  // --------------------------------------------------------------------------
  // PROGRAM 1: IMMORTAL 90 DAY CHALLENGE (STRICT 7-DAY REPEATING CADENCE)
  // DAY 1: Chest and Triceps
  // DAY 2: Back and Biceps
  // DAY 3: Cardio and Mobility (First cardio day - 5 to 10 km)
  // DAY 4: Legs and Shoulders
  // DAY 5: Chest, Triceps and Forearms
  // DAY 6: Back, Biceps and Core
  // DAY 7: Rest and Recovery (Second cardio session + recovery)
  // Every day includes 30-min evening walk before bed reminder
  // --------------------------------------------------------------------------
  if (pid === "immortal_90") {
    const cycleDay = ((safeDay - 1) % 7) + 1; // 1 to 7

    // 90-Day Progression Phase Calculation
    let phaseNumber: 1 | 2 | 3 | 4 = 1;
    let phaseName = "Foundation & Hypertrophy Base";
    let phaseWeeks = "Weeks 1-4 (Days 1-30)";
    let targetCardioKm = "5.0 - 7.5 KM";
    let progressionNotes = "Phase 1: Establishing movement execution, muscular endurance, and aerobic conditioning baseline.";
    let setProgressionMultiplier = 0; // standard sets

    if (safeDay > 75) {
      phaseNumber = 4;
      phaseName = "Championship Mastery & Maximum Density";
      phaseWeeks = "Weeks 11-13 (Days 76-90)";
      targetCardioKm = "8.0 - 10.0 KM";
      progressionNotes = "Phase 4: Championship peak intensity, high mechanical tension, and maximal aerobic capacity.";
      setProgressionMultiplier = 1;
    } else if (safeDay > 60) {
      phaseNumber = 3;
      phaseName = "Peak Performance & High Intensity";
      phaseWeeks = "Weeks 9-10 (Days 61-75)";
      targetCardioKm = "7.5 - 10.0 KM";
      progressionNotes = "Phase 3: High threshold motor unit recruitment, load escalation, and expanded cardiovascular endurance.";
      setProgressionMultiplier = 1;
    } else if (safeDay > 30) {
      phaseNumber = 2;
      phaseName = "Progressive Overload & Density";
      phaseWeeks = "Weeks 5-8 (Days 31-60)";
      targetCardioKm = "6.0 - 8.0 KM";
      progressionNotes = "Phase 2: Progressive overload with increased training volume, density, and sustained cardio distance.";
      setProgressionMultiplier = 0;
    }

    const eveningWalkReminder = {
      title: "EVENING WALK",
      timing: "30 minutes before bed",
      pace: "Easy to moderate walking pace",
      durationMinutes: 30,
      instructions: "Every single day of the 90 day challenge must include a 30 minute evening walk before bed. This evening walk will send you an email reminder (not a workout in the website). The evening walk must not replace your dedicated cardio sessions on Day 3 and Day 7."
    };

    if (cycleDay === 1) {
      const meta: DayWorkoutMeta = {
        dayNumber: safeDay,
        programId: "immortal_90",
        title: `Day ${safeDay}: Chest and Triceps`,
        category: "Chest and Triceps",
        targetMuscles: ["Chest", "Triceps"],
        estimatedDuration: "50-60 mins",
        estimatedCalories: 460,
        isRestDay: false,
        isCardioOnly: false,
        phase: phaseNumber,
        phaseName: phaseName,
        eveningWalk: eveningWalkReminder,
        guidelines: [
          "DAY 1 SPLIT: Focus strictly on Chest and Triceps.",
          "Perform primary compound chest presses followed by targeted triceps extensions.",
          "Maintain strict tempo: 2-3 second eccentrics and explosive concentric drives.",
          "Every single day includes a 30-minute evening walk before bed (sent via email reminder)."
        ],
        coachingNotes: `Immortal Day 1: ${progressionNotes} Pure anterior push focus.`
      };
      const exercises: ChallengeExerciseItem[] = IMMORTAL_CHEST_TRICEPS.slice(0, 12).map((ex, idx) => ({
        ...ex,
        id: `immortal_d${safeDay}_ex_${idx + 1}`,
        dayNumber: safeDay,
        category: "Chest and Triceps",
        sets: typeof ex.sets === "number" ? ex.sets + setProgressionMultiplier : ex.sets
      }));
      return finalizePlan(meta, exercises);
    }

    if (cycleDay === 2) {
      const meta: DayWorkoutMeta = {
        dayNumber: safeDay,
        programId: "immortal_90",
        title: `Day ${safeDay}: Back and Biceps`,
        category: "Back and Biceps",
        targetMuscles: ["Back", "Biceps"],
        estimatedDuration: "50-60 mins",
        estimatedCalories: 480,
        isRestDay: false,
        isCardioOnly: false,
        phase: phaseNumber,
        phaseName: phaseName,
        eveningWalk: eveningWalkReminder,
        guidelines: [
          "DAY 2 SPLIT: Focus strictly on Back and Biceps.",
          "Initiate vertical and horizontal pulls through scapular retraction and lat drive.",
          "Isolate the biceps with strict curl variations with zero momentum.",
          "Every single day includes a 30-minute evening walk before bed (sent via email reminder)."
        ],
        coachingNotes: `Immortal Day 2: ${progressionNotes} Total posterior pulling development.`
      };
      const exercises: ChallengeExerciseItem[] = IMMORTAL_BACK_BICEPS.slice(0, 12).map((ex, idx) => ({
        ...ex,
        id: `immortal_d${safeDay}_ex_${idx + 1}`,
        dayNumber: safeDay,
        category: "Back and Biceps",
        sets: typeof ex.sets === "number" ? ex.sets + setProgressionMultiplier : ex.sets
      }));
      return finalizePlan(meta, exercises);
    }

    if (cycleDay === 3) {
      const meta: DayWorkoutMeta = {
        dayNumber: safeDay,
        programId: "immortal_90",
        title: `Day ${safeDay}: Cardio and Mobility`,
        category: "Cardio and Mobility",
        targetMuscles: ["Cardio", "Mobility"],
        estimatedDuration: "50-75 mins",
        estimatedCalories: 550,
        isRestDay: false,
        isCardioOnly: true,
        cardioDistance: targetCardioKm,
        phase: phaseNumber,
        phaseName: phaseName,
        eveningWalk: eveningWalkReminder,
        guidelines: [
          "CARDIO RULE: Day 3 is the FIRST dedicated cardio day of the week.",
          "Cardio target: 5 to 10 km (Running, brisk walking, cycling, or jogging based on fitness level).",
          "Dedicated mobility exercises are included to decompress joints and restore tissue pliability.",
          "STRICT RULE: Do NOT perform random resistance or weight training on dedicated cardio days.",
          "Every single day includes a 30-minute evening walk before bed (sent via email reminder)."
        ],
        coachingNotes: `Immortal Day 3: Dedicated Cardio Day 1. Complete your 5 to 10 km cardio target (${targetCardioKm}) and mobility flow.`
      };
      const exercises: ChallengeExerciseItem[] = IMMORTAL_CARDIO_MOBILITY.map((ex, idx) => ({
        ...ex,
        id: `immortal_d${safeDay}_ex_${idx + 1}`,
        dayNumber: safeDay,
        category: "Cardio and Mobility"
      }));
      return finalizePlan(meta, exercises);
    }

    if (cycleDay === 4) {
      const meta: DayWorkoutMeta = {
        dayNumber: safeDay,
        programId: "immortal_90",
        title: `Day ${safeDay}: Legs and Shoulders`,
        category: "Legs and Shoulders",
        targetMuscles: ["Legs", "Shoulders"],
        estimatedDuration: "60-70 mins",
        estimatedCalories: 550,
        isRestDay: false,
        isCardioOnly: false,
        phase: phaseNumber,
        phaseName: phaseName,
        eveningWalk: eveningWalkReminder,
        guidelines: [
          "DAY 4 SPLIT: Focus strictly on Legs and Shoulders.",
          "Prioritize lower body quad/hamstring power followed by 3D shoulder deltoid development.",
          "Lock in strict knee alignment and deep hip hinge mechanics.",
          "Every single day includes a 30-minute evening walk before bed (sent via email reminder)."
        ],
        coachingNotes: `Immortal Day 4: ${progressionNotes} High-output lower body and shoulder overhead strength.`
      };
      const exercises: ChallengeExerciseItem[] = IMMORTAL_LEGS_SHOULDERS.slice(0, 12).map((ex, idx) => ({
        ...ex,
        id: `immortal_d${safeDay}_ex_${idx + 1}`,
        dayNumber: safeDay,
        category: "Legs and Shoulders",
        sets: typeof ex.sets === "number" ? ex.sets + setProgressionMultiplier : ex.sets
      }));
      return finalizePlan(meta, exercises);
    }

    if (cycleDay === 5) {
      const meta: DayWorkoutMeta = {
        dayNumber: safeDay,
        programId: "immortal_90",
        title: `Day ${safeDay}: Chest, Triceps and Forearms`,
        category: "Chest, Triceps and Forearms",
        targetMuscles: ["Chest", "Triceps", "Forearms"],
        estimatedDuration: "55-65 mins",
        estimatedCalories: 490,
        isRestDay: false,
        isCardioOnly: false,
        phase: phaseNumber,
        phaseName: phaseName,
        eveningWalk: eveningWalkReminder,
        guidelines: [
          "DAY 5 SPLIT: Focus strictly on Chest, Triceps and Forearms.",
          "Re-stimulate anterior pushing chain with heavy volume on pectorals and triceps lockout.",
          "Complete dedicated wrist flexor, extensor, and grip carry finishers for forearm density.",
          "Every single day includes a 30-minute evening walk before bed (sent via email reminder)."
        ],
        coachingNotes: `Immortal Day 5: ${progressionNotes} Targeted chest density, tricep definition, and forearm grip power.`
      };
      const exercises: ChallengeExerciseItem[] = IMMORTAL_CHEST_TRICEPS_FOREARMS.slice(0, 12).map((ex, idx) => ({
        ...ex,
        id: `immortal_d${safeDay}_ex_${idx + 1}`,
        dayNumber: safeDay,
        category: "Chest, Triceps and Forearms",
        sets: typeof ex.sets === "number" ? ex.sets + setProgressionMultiplier : ex.sets
      }));
      return finalizePlan(meta, exercises);
    }

    if (cycleDay === 6) {
      const meta: DayWorkoutMeta = {
        dayNumber: safeDay,
        programId: "immortal_90",
        title: `Day ${safeDay}: Back, Biceps and Core`,
        category: "Back, Biceps and Core",
        targetMuscles: ["Back", "Biceps", "Core"],
        estimatedDuration: "55-65 mins",
        estimatedCalories: 510,
        isRestDay: false,
        isCardioOnly: false,
        phase: phaseNumber,
        phaseName: phaseName,
        eveningWalk: eveningWalkReminder,
        guidelines: [
          "DAY 6 SPLIT: Focus strictly on Back, Biceps and Core.",
          "High density pulling: lat pulldowns, rows, and bicep peaks paired with core stabilization.",
          "Perform hanging leg raises, ab wheel rollouts, and cable crunches for core bracing.",
          "Every single day includes a 30-minute evening walk before bed (sent via email reminder)."
        ],
        coachingNotes: `Immortal Day 6: ${progressionNotes} Lat width, mid-back thickness, bicep development, and core armor.`
      };
      const exercises: ChallengeExerciseItem[] = IMMORTAL_BACK_BICEPS_CORE.slice(0, 12).map((ex, idx) => ({
        ...ex,
        id: `immortal_d${safeDay}_ex_${idx + 1}`,
        dayNumber: safeDay,
        category: "Back, Biceps and Core",
        sets: typeof ex.sets === "number" ? ex.sets + setProgressionMultiplier : ex.sets
      }));
      return finalizePlan(meta, exercises);
    }

    // DAY 7: Rest and Recovery (Second dedicated cardio session while recovery focused)
    const meta: DayWorkoutMeta = {
      dayNumber: safeDay,
      programId: "immortal_90",
      title: `Day ${safeDay}: Rest and Recovery`,
      category: "Rest and Recovery",
      targetMuscles: ["Recovery", "Cardio", "Mobility"],
      estimatedDuration: "50-75 mins",
      estimatedCalories: 520,
      isRestDay: true,
      isCardioOnly: true,
      cardioDistance: targetCardioKm,
      phase: phaseNumber,
      phaseName: phaseName,
      eveningWalk: eveningWalkReminder,
      guidelines: [
        "CARDIO RULE: Day 7 includes your SECOND dedicated cardio session while still being a recovery focused day.",
        "Cardio target: 5 to 10 km (Running, brisk walking, cycling, or jogging at a recovery Zone 1-2 pace).",
        "Perform active lower body flushes, glute decompression, and diaphragmatic breathing.",
        "STRICT RULE: Zero heavy weight training on recovery days.",
        "Every single day includes a 30-minute evening walk before bed (sent via email reminder)."
      ],
      coachingNotes: `Immortal Day 7: Dedicated Cardio Day 2 & Recovery. Complete your 5 to 10 km cardio session (${targetCardioKm}) followed by full recovery to reset for Day 1.`
    };
    const exercises: ChallengeExerciseItem[] = IMMORTAL_REST_RECOVERY.map((ex, idx) => ({
      ...ex,
      id: `immortal_d${safeDay}_ex_${idx + 1}`,
      dayNumber: safeDay,
      category: "Rest and Recovery"
    }));
    return finalizePlan(meta, exercises);
  }

  // --------------------------------------------------------------------------
  // PROGRAM 2: 180 DAY HOME WORKOUT CHALLENGE (CALISTHENICS & BODYWEIGHT ONLY)
  // Day 1: Upper body Conditioning
  // Day 2: Legs and glutes Power
  // Day 3: 5 KM Cardio / Walking Endurance (isCardioOnly: true)
  // Day 4: Back Calisthenics
  // Day 5: Core and abs Density
  // Day 6: Full Body Calisthenics
  // Day 7: Mobility, Joint Decompression & Recovery (isRestDay: true)
  // --------------------------------------------------------------------------
  if (pid === "home_180") {
    const cycleDay = ((safeDay - 1) % 7) + 1;

    let category = "Upper body";
    let targetMuscles = ["Chest", "Shoulders", "Arms"];
    let pool = HOME_UPPER_BODY_EXERCISES;
    let isRestDay = false;
    let isCardioOnly = false;
    let cardioDistance: string | undefined = undefined;

    if (cycleDay === 1) {
      category = "Upper body";
      targetMuscles = ["Chest", "Shoulders", "Arms"];
      pool = HOME_UPPER_BODY_EXERCISES;
    } else if (cycleDay === 2) {
      category = "Legs and glutes";
      targetMuscles = ["Legs", "Glutes"];
      pool = HOME_LEGS_GLUTES_EXERCISES;
    } else if (cycleDay === 3) {
      category = "5 KM Cardio / Walking Endurance";
      targetMuscles = ["Cardio", "Vascular Health"];
      pool = HOME_CARDIO_EXERCISES;
      isCardioOnly = true;
      cardioDistance = "5 KM";
    } else if (cycleDay === 4) {
      category = "Back Calisthenics";
      targetMuscles = ["Back", "Arms"];
      pool = HOME_BACK_EXERCISES;
    } else if (cycleDay === 5) {
      category = "Core and abs Density";
      targetMuscles = ["Abs", "Core"];
      pool = HOME_CORE_ABS_EXERCISES;
    } else if (cycleDay === 6) {
      category = "Full Body Calisthenics";
      targetMuscles = ["Full Body"];
      pool = [...HOME_UPPER_BODY_EXERCISES.slice(0, 6), ...HOME_LEGS_GLUTES_EXERCISES.slice(0, 6)];
    } else {
      category = "Mobility, Joint Decompression & Recovery";
      targetMuscles = ["Mobility and recovery"];
      pool = HOME_MOBILITY_EXERCISES;
      isRestDay = true;
    }

    const count = isCardioOnly ? 1 : isRestDay ? 6 : 12;
    const exercisesToUse = pool.slice(0, count);

    const meta: DayWorkoutMeta = {
      dayNumber: safeDay,
      programId: "home_180",
      title: `Day ${safeDay}: ${category}`,
      category,
      targetMuscles,
      estimatedDuration: isCardioOnly ? "45-60 mins" : isRestDay ? "20-30 mins" : "35-45 mins",
      estimatedCalories: isCardioOnly ? 400 : isRestDay ? 150 : 380,
      isRestDay,
      isCardioOnly,
      cardioDistance,
      guidelines: [
        "Home equipment & bodyweight priority.",
        "Zero gym machine dependencies.",
        "Calibrated strictly for progressive calisthenics mastery."
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
  // Day 1: Glutes & Hamstrings Hypertrophy
  // Day 2: Core and abs Waist Sculpting
  // Day 3: 5 KM Cardio Walking / Running (isCardioOnly: true)
  // Day 4: Legs & Lower Body Sculpt
  // Day 5: Upper Body Sculpt & Posture
  // Day 6: Full Body Metabolic Sculpt
  // Day 7: Confidence and wellness sessions (isRestDay: true)
  // --------------------------------------------------------------------------
  if (pid === "women_confidence") {
    const cycleDay = ((safeDay - 1) % 7) + 1;

    let category = "Glutes";
    let targetMuscles = ["Glutes", "Lower body"];
    let pool = WOMEN_GLUTES_EXERCISES;
    let isRestDay = false;
    let isCardioOnly = false;
    let cardioDistance: string | undefined = undefined;

    if (cycleDay === 1) {
      category = "Glutes";
      targetMuscles = ["Glutes", "Lower body"];
      pool = WOMEN_GLUTES_EXERCISES;
    } else if (cycleDay === 2) {
      category = "Core and abs";
      targetMuscles = ["Abs", "Core"];
      pool = WOMEN_CORE_EXERCISES;
    } else if (cycleDay === 3) {
      category = "5 KM Cardio Walking / Running";
      targetMuscles = ["Cardio"];
      pool = WOMEN_CARDIO_EXERCISES;
      isCardioOnly = true;
      cardioDistance = "5 KM";
    } else if (cycleDay === 4) {
      category = "Legs";
      targetMuscles = ["Legs", "Glutes"];
      pool = WOMEN_LEGS_EXERCISES;
    } else if (cycleDay === 5) {
      category = "Upper body";
      targetMuscles = ["Upper body", "Back", "Shoulders"];
      pool = WOMEN_UPPER_BODY_EXERCISES;
    } else if (cycleDay === 6) {
      category = "Full Body Metabolic Sculpt";
      targetMuscles = ["Full Body", "Toning"];
      pool = [...WOMEN_GLUTES_EXERCISES.slice(0, 6), ...WOMEN_CORE_EXERCISES.slice(0, 6)];
    } else {
      category = "Confidence and wellness sessions";
      targetMuscles = ["Mobility and recovery"];
      pool = WOMEN_WELLNESS_EXERCISES;
      isRestDay = true;
    }

    const count = isCardioOnly ? 1 : isRestDay ? 6 : 12;
    const exercisesToUse = pool.slice(0, count);

    const meta: DayWorkoutMeta = {
      dayNumber: safeDay,
      programId: "women_confidence",
      title: `Day ${safeDay}: ${category} Focus`,
      category,
      targetMuscles,
      estimatedDuration: isCardioOnly ? "45-60 mins" : isRestDay ? "20-30 mins" : "35-45 mins",
      estimatedCalories: isCardioOnly ? 380 : isRestDay ? 150 : 350,
      isRestDay,
      isCardioOnly,
      cardioDistance,
      guidelines: [
        "Specifically engineered around women's aesthetic, posture, and wellness goals.",
        "Calibrated for continuous tone, empowerment, and kinetic health.",
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
  // Day 1: Core & Transverse Stability
  // Day 2: Metabolic HIIT & Core Burn
  // Day 3: 5 to 10 KM Walking or Running (isCardioOnly: true)
  // Day 4: Obliques & Waist Tapering
  // Day 5: Full Body Conditioning & Jump Rope
  // Day 6: Core Meltdown & Metabolic HIIT
  // Day 7: Active Rest & Cellular Recovery (isRestDay: true)
  // --------------------------------------------------------------------------
  if (pid === "belly_fat_shred") {
    const cycleDay = ((safeDay - 1) % 7) + 1;

    let category = "Core";
    let targetMuscles = ["Abs"];
    let pool = BELLY_CORE_EXERCISES;
    let isRestDay = false;
    let isCardioOnly = false;
    let cardioDistance: string | undefined = undefined;

    if (cycleDay === 1) {
      category = "Core";
      targetMuscles = ["Abs"];
      pool = BELLY_CORE_EXERCISES;
    } else if (cycleDay === 2) {
      category = "HIIT";
      targetMuscles = ["Full body"];
      pool = BELLY_HIIT_EXERCISES;
    } else if (cycleDay === 3) {
      category = "5 to 10 KM Walking or Running";
      targetMuscles = ["Cardio"];
      pool = BELLY_CARDIO_EXERCISES;
      isCardioOnly = true;
      cardioDistance = "5 to 10 KM";
    } else if (cycleDay === 4) {
      category = "Obliques";
      targetMuscles = ["Abs"];
      pool = BELLY_OBLIQUES_EXERCISES;
    } else if (cycleDay === 5) {
      category = "Full body conditioning";
      targetMuscles = ["Full body"];
      pool = BELLY_CONDITIONING_EXERCISES;
    } else if (cycleDay === 6) {
      category = "Core Meltdown & HIIT";
      targetMuscles = ["Core", "Full Body"];
      pool = [...BELLY_CORE_EXERCISES.slice(0, 6), ...BELLY_HIIT_EXERCISES.slice(0, 6)];
    } else {
      category = "Active Rest & Cellular Recovery";
      targetMuscles = ["Rest", "Recovery"];
      pool = POSTURE_DAILY_MOVEMENT_EXERCISES;
      isRestDay = true;
    }

    const count = isCardioOnly ? 1 : isRestDay ? 4 : 12;
    const exercisesToUse = pool.slice(0, count);

    const meta: DayWorkoutMeta = {
      dayNumber: safeDay,
      programId: "belly_fat_shred",
      title: `Day ${safeDay}: ${category} Protocol`,
      category,
      targetMuscles,
      estimatedDuration: isCardioOnly ? "45-60 mins" : isRestDay ? "20 mins" : "40-50 mins",
      estimatedCalories: isCardioOnly ? 480 : isRestDay ? 120 : 460,
      isRestDay,
      isCardioOnly,
      cardioDistance,
      guidelines: [
        "Core stabilization and systemic lipid oxidation.",
        "Targeted exercises daily designed for core density and metabolic burn.",
        "Zero weight training on cardio days."
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
  // PROGRAM 5: GYM HYPERTROPHY & MUSCLE BUILDER
  // Day 1: Chest & Triceps Hypertrophy
  // Day 2: Back & Biceps Hypertrophy
  // Day 3: 5 KM Active Flush & Aerobic Recovery (isCardioOnly: true)
  // Day 4: Legs & Calves Hypertrophy
  // Day 5: Shoulders, Arms & Abs Hypertrophy
  // Day 6: 5 KM Conditioning Run / Walk (isCardioOnly: true)
  // Day 7: Complete Anabolic Rest & Recovery (isRestDay: true)
  // --------------------------------------------------------------------------
  if (pid === "gym_hypertrophy") {
    const cycleDay = ((safeDay - 1) % 7) + 1;

    let category = "Chest + Triceps";
    let targetMuscles = ["Chest", "Triceps"];
    let pool: any[] = GYM_HYPERTROPHY_CHEST_TRICEPS;
    let isRestDay = false;
    let isCardioOnly = false;
    let cardioDistance: string | undefined = undefined;

    if (cycleDay === 1) {
      category = "Chest + Triceps";
      targetMuscles = ["Chest", "Triceps"];
      pool = GYM_HYPERTROPHY_CHEST_TRICEPS;
    } else if (cycleDay === 2) {
      category = "Back + Biceps";
      targetMuscles = ["Back", "Biceps"];
      pool = GYM_HYPERTROPHY_BACK_BICEPS;
    } else if (cycleDay === 3) {
      category = "5 KM Active Flush & Aerobic Recovery";
      targetMuscles = ["Cardio", "Active Recovery"];
      pool = IMMORTAL_CARDIO_RECOVERY;
      isCardioOnly = true;
      cardioDistance = "5 KM";
    } else if (cycleDay === 4) {
      category = "Legs + Calves";
      targetMuscles = ["Quads", "Hamstrings", "Calves"];
      pool = GYM_HYPERTROPHY_LEGS_CALVES;
    } else if (cycleDay === 5) {
      category = "Shoulders + Arms + Abs";
      targetMuscles = ["Shoulders", "Biceps", "Triceps", "Abs"];
      pool = GYM_HYPERTROPHY_SHOULDERS_ARMS_ABS;
    } else if (cycleDay === 6) {
      category = "5 KM Conditioning Run / Walk";
      targetMuscles = ["Cardio", "Stamina"];
      pool = IMMORTAL_DAY7_RUNNING_WALKING_CARDIO;
      isCardioOnly = true;
      cardioDistance = "5 KM";
    } else {
      category = "Complete Anabolic Rest & CNS Recovery";
      targetMuscles = ["Full Body Recovery"];
      pool = POSTURE_DAILY_MOVEMENT_EXERCISES;
      isRestDay = true;
    }

    const count = isCardioOnly ? 1 : isRestDay ? 4 : pool.length;
    const exercisesToUse = pool.slice(0, count);

    const meta: DayWorkoutMeta = {
      dayNumber: safeDay,
      programId: "gym_hypertrophy",
      title: `Day ${safeDay}: ${category}`,
      category,
      targetMuscles,
      estimatedDuration: isCardioOnly ? "45-60 mins" : isRestDay ? "20 mins" : "55-65 mins",
      estimatedCalories: isCardioOnly ? 450 : isRestDay ? 100 : 520,
      isRestDay,
      isCardioOnly,
      cardioDistance,
      guidelines: [
        "Pure gym compound and isolation progressive overload.",
        "Execute every set with 2-3 second eccentric tempo and explosive concentric.",
        "Zero cross-contamination with bodyweight or home protocols."
      ],
      coachingNotes: "Gym Hypertrophy: Heavy mechanical tension, progressive overload, and full muscular recruitment."
    };

    const exercises = exercisesToUse.map((ex, idx) => ({
      ...ex,
      id: `gym_d${safeDay}_ex_${idx + 1}`,
      dayNumber: safeDay
    }));
    return finalizePlan(meta, exercises);
  }

  // --------------------------------------------------------------------------
  // PROGRAM 6: CARDIO, CALISTHENICS & MILITARY FITNESS
  // Day 1: Tactical Calisthenics & Push
  // Day 2: 5 to 10 KM Tempo Run & Aerobic Threshold (isCardioOnly: true)
  // Day 3: Military Pull & Core Armor
  // Day 4: Functional Agility & Jump Rope HIIT
  // Day 5: High-Volume Calisthenics Endurance
  // Day 6: 5 to 10 KM Military Ruck / Run & Stamina (isCardioOnly: true)
  // Day 7: Tactical CNS Rest & Joint Decompression (isRestDay: true)
  // --------------------------------------------------------------------------
  if (pid === "cardio_calisthenics") {
    const cycleDay = ((safeDay - 1) % 7) + 1;

    let category = "Tactical Calisthenics & Push";
    let targetMuscles = ["Chest", "Triceps", "Shoulders"];
    let pool: any[] = TACTICAL_PUSH_EXERCISES;
    let isRestDay = false;
    let isCardioOnly = false;
    let cardioDistance: string | undefined = undefined;

    if (cycleDay === 1) {
      category = "Tactical Calisthenics & Push";
      targetMuscles = ["Chest", "Triceps", "Shoulders"];
      pool = TACTICAL_PUSH_EXERCISES;
    } else if (cycleDay === 2) {
      category = "5 to 10 KM Tempo Run & Aerobic Threshold";
      targetMuscles = ["Cardio", "Aerobic Threshold"];
      pool = IMMORTAL_CARDIO_RECOVERY;
      isCardioOnly = true;
      cardioDistance = "5 to 10 KM";
    } else if (cycleDay === 3) {
      category = "Military Pull & Core Armor";
      targetMuscles = ["Back", "Biceps", "Core"];
      pool = TACTICAL_PULL_CORE_EXERCISES;
    } else if (cycleDay === 4) {
      category = "Functional Agility & Jump Rope HIIT";
      targetMuscles = ["Cardio", "Calves", "Coordination"];
      pool = TACTICAL_AGILITY_HIIT_EXERCISES;
    } else if (cycleDay === 5) {
      category = "High-Volume Calisthenics Endurance";
      targetMuscles = ["Full Body", "Muscular Endurance"];
      pool = TACTICAL_ENDURANCE_EXERCISES;
    } else if (cycleDay === 6) {
      category = "5 to 10 KM Military Ruck / Run & Stamina";
      targetMuscles = ["Cardio", "Stamina"];
      pool = IMMORTAL_DAY7_RUNNING_WALKING_CARDIO;
      isCardioOnly = true;
      cardioDistance = "5 to 10 KM";
    } else {
      category = "Tactical CNS Rest & Joint Decompression";
      targetMuscles = ["Rest", "Recovery"];
      pool = POSTURE_DAILY_MOVEMENT_EXERCISES;
      isRestDay = true;
    }

    const count = isCardioOnly ? 1 : isRestDay ? 4 : pool.length;
    const exercisesToUse = pool.slice(0, count);

    const meta: DayWorkoutMeta = {
      dayNumber: safeDay,
      programId: "cardio_calisthenics",
      title: `Day ${safeDay}: ${category}`,
      category,
      targetMuscles,
      estimatedDuration: isCardioOnly ? "50-70 mins" : isRestDay ? "20 mins" : "45-55 mins",
      estimatedCalories: isCardioOnly ? 550 : isRestDay ? 120 : 490,
      isRestDay,
      isCardioOnly,
      cardioDistance,
      guidelines: [
        "Military-grade bodyweight mastery and aerobic endurance.",
        "Zero rest between agility circuits; strict cadence on pull-ups and push-ups.",
        "Complete running distances with relentless discipline."
      ],
      coachingNotes: "Tactical Calisthenics: Functional strength-to-weight ratio, combat stamina, and unwavering mental toughness."
    };

    const exercises = exercisesToUse.map((ex, idx) => ({
      ...ex,
      id: `tactical_d${safeDay}_ex_${idx + 1}`,
      dayNumber: safeDay
    }));
    return finalizePlan(meta, exercises);
  }

  // --------------------------------------------------------------------------
  // PROGRAM 7: LIFESTYLE FITNESS ACADEMY (POSTURE, SEDENTARY REVERSAL & LONGEVITY)
  // Day 1: Posture Alignment & Posterior Chain
  // Day 2: Hip Flexor Decompression & Sedentary Reset
  // Day 3: Aerobic Circulation & 5-10 KM Brisk Walking (isCardioOnly: true)
  // Day 4: Chest Opening & Anterior Shoulder Mobility
  // Day 5: Spinal Decompression & Core Pillar Stability
  // Day 6: Glute Activation & Lower Body Kinetic Chain
  // Day 7: Restorative Mobility & Parasympathetic Recovery (isRestDay: true)
  // --------------------------------------------------------------------------
  if (pid === "lifestyle_academy") {
    const cycleDay = ((safeDay - 1) % 7) + 1;

    let category = "Posture Alignment & Posterior Chain";
    let targetMuscles = ["Upper Back", "Scapular Stabilizers"];
    let pool = POSTURE_CORRECTION_EXERCISES;
    let isRestDay = false;
    let isCardioOnly = false;
    let cardioDistance: string | undefined = undefined;

    if (cycleDay === 1) {
      category = "Posture Alignment & Posterior Chain";
      targetMuscles = ["Upper Back", "Scapular Stabilizers"];
      pool = POSTURE_CORRECTION_EXERCISES;
    } else if (cycleDay === 2) {
      category = "Hip Flexor Decompression & Sedentary Reset";
      targetMuscles = ["Hip Flexors", "Pelvis", "Glutes"];
      pool = POSTURE_HIP_MOBILITY_EXERCISES;
    } else if (cycleDay === 3) {
      category = "Aerobic Circulation & 5-10 KM Brisk Walking";
      targetMuscles = ["Cardio", "Vascular Health"];
      pool = POSTURE_DAILY_MOVEMENT_EXERCISES;
      isCardioOnly = true;
      cardioDistance = "5 to 10 KM";
    } else if (cycleDay === 4) {
      category = "Chest Opening & Anterior Shoulder Mobility";
      targetMuscles = ["Pectorals", "Anterior Deltoids"];
      pool = POSTURE_CHEST_OPENING_EXERCISES;
    } else if (cycleDay === 5) {
      category = "Spinal Decompression & Core Pillar Stability";
      targetMuscles = ["Spine", "Transverse Abdominis"];
      pool = POSTURE_SPINAL_MOBILITY_EXERCISES;
    } else if (cycleDay === 6) {
      category = "Glute Activation & Lower Body Kinetic Chain";
      targetMuscles = ["Glutes", "Hamstrings", "Quads"];
      pool = POSTURE_GLUTE_ACTIVATION_EXERCISES;
    } else {
      category = "Restorative Mobility & Parasympathetic Recovery";
      targetMuscles = ["Total Body Recovery"];
      pool = POSTURE_DAILY_MOVEMENT_EXERCISES;
      isRestDay = true;
    }

    const count = isCardioOnly ? 1 : isRestDay ? 6 : 10;
    const exercisesToUse = pool.slice(0, count);

    const meta: DayWorkoutMeta = {
      dayNumber: safeDay,
      programId: "lifestyle_academy",
      title: `Day ${safeDay}: ${category}`,
      category,
      targetMuscles,
      estimatedDuration: isCardioOnly ? "45-60 mins" : isRestDay ? "20-30 mins" : "30-40 mins",
      estimatedCalories: isCardioOnly ? 350 : isRestDay ? 120 : 240,
      isRestDay,
      isCardioOnly,
      cardioDistance,
      guidelines: [
        "Specifically engineered to counteract prolonged sitting, tech neck, and sedentary stiffness.",
        "Targeted exercises daily designed for posture alignment, joint longevity, and metabolic renewal."
      ],
      coachingNotes: "Lifestyle Academy: Reverse the sedentary curve with clinical movement patterns and active breathing."
    };

    const exercises = exercisesToUse.map((ex, idx) => ({
      ...ex,
      id: `lifestyle_d${safeDay}_ex_${idx + 1}`,
      dayNumber: safeDay
    }));
    return finalizePlan(meta, exercises);
  }

  // --------------------------------------------------------------------------
  // PROGRAM 8: RECLAIM YOUR POSTURE & VITALITY (60 DAYS)
  // Day 1: Posture correction
  // Day 2: Chest opening
  // Day 3: 3 to 5 KM Mindful Posture Walk (isCardioOnly: true)
  // Day 4: Spinal mobility
  // Day 5: Glute activation
  // Day 6: Daily movement flow
  // Day 7: Complete Spinal Rest & Nervous System Reset (isRestDay: true)
  // --------------------------------------------------------------------------
  const cycleDay = ((safeDay - 1) % 7) + 1;

  let category = "Posture correction";
  let targetMuscles = ["Upper back", "Neck mobility"];
  let pool = POSTURE_CORRECTION_EXERCISES;
  let isRestDay = false;
  let isCardioOnly = false;
  let cardioDistance: string | undefined = undefined;

  if (cycleDay === 1) {
    category = "Posture correction";
    targetMuscles = ["Upper back", "Neck mobility"];
    pool = POSTURE_CORRECTION_EXERCISES;
  } else if (cycleDay === 2) {
    category = "Chest opening";
    targetMuscles = ["Chest", "Shoulders"];
    pool = POSTURE_CHEST_OPENING_EXERCISES;
  } else if (cycleDay === 3) {
    category = "3 to 5 KM Mindful Posture Walk";
    targetMuscles = ["Cardio", "Spinal Decompression"];
    pool = POSTURE_DAILY_MOVEMENT_EXERCISES;
    isCardioOnly = true;
    cardioDistance = "3 to 5 KM";
  } else if (cycleDay === 4) {
    category = "Spinal mobility";
    targetMuscles = ["Spinal mobility"];
    pool = POSTURE_SPINAL_MOBILITY_EXERCISES;
  } else if (cycleDay === 5) {
    category = "Glute activation";
    targetMuscles = ["Glutes", "Core stability"];
    pool = POSTURE_GLUTE_ACTIVATION_EXERCISES;
  } else if (cycleDay === 6) {
    category = "Daily movement";
    targetMuscles = ["Daily movement", "Mobility and recovery"];
    pool = POSTURE_DAILY_MOVEMENT_EXERCISES;
  } else {
    category = "Complete Spinal Rest & Reset";
    targetMuscles = ["Total Body Relaxation"];
    pool = POSTURE_DAILY_MOVEMENT_EXERCISES;
    isRestDay = true;
  }

  const count = isCardioOnly ? 1 : isRestDay ? 5 : 10;
  const exercisesToUse = pool.slice(0, count);

  const meta: DayWorkoutMeta = {
    dayNumber: safeDay,
    programId: "posture_vitality",
    title: `Day ${safeDay}: ${category}`,
    category,
    targetMuscles,
    estimatedDuration: isCardioOnly ? "40-50 mins" : isRestDay ? "15-20 mins" : "25-35 mins",
    estimatedCalories: isCardioOnly ? 300 : isRestDay ? 100 : 180,
    isRestDay,
    isCardioOnly,
    cardioDistance,
    guidelines: [
      "Corrective biomechanics, spinal elongation, and postural alignment.",
      "Targeted therapeutic exercises daily with mindful breathing and zero joint compression."
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
