import { ProgramId, ProgramMetadata, ChallengeExerciseItem, DayWorkoutMeta, DayExecutionPlan } from "../types/challengeEngine";

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
    coverImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"
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
    coverImage: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&auto=format&fit=crop&q=80"
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
    coverImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80"
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
    coverImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80"
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
    coverImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80"
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
    exerciseName: "Barbell Flat Bench Press",
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
    gifUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"
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
    exerciseName: "Parallel Bar Chest Dips",
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
    exerciseName: "Standing Cable Pec Flyes",
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
    exerciseName: "Decline Dumbbell Press",
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
    exerciseName: "Standard Strict Push-ups",
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
    exerciseName: "Cable Rope Tricep Pushdowns",
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
    exerciseName: "EZ-Bar Lying Skull Crushers",
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
    exerciseName: "Overhead Dumbbell Tricep Extension",
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
    exerciseName: "Diamond Push-ups",
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
  }
];

const IMMORTAL_BACK_BICEPS: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back + Biceps",
    muscleGroup: ["Back"],
    exerciseName: "Conventional Barbell Deadlift",
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
    exerciseName: "Wide-Grip Pull-ups",
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
    exerciseName: "Bent-Over Barbell Row",
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
    exerciseName: "Lat Pulldown (Cable)",
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
    exerciseName: "Standing Barbell Bicep Curl",
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
    exerciseName: "Incline Dumbbell Bicep Curl",
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
    exerciseName: "Preacher Curl with EZ-Bar",
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
  }
];

const IMMORTAL_CARDIO_RECOVERY: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "5 to 10 KM Cardio / Walking",
    muscleGroup: ["Cardio"],
    exerciseName: "5 to 10 KM Continuous Paced Run or Walk",
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
    exerciseName: "Post-Cardio Full Decompression & Hydration Protocol",
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
    exerciseName: "Barbell Back Squats",
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
    exerciseName: "Romanian Deadlift (Dumbbell/Barbell)",
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
    exerciseName: "Leg Press Machine",
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
    exerciseName: "Walking Lunges (Weighted)",
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
    exerciseName: "Standing Calf Raises",
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
    exerciseName: "Seated Dumbbell Overhead Shoulder Press",
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
    exerciseName: "Standing Dumbbell Lateral Raises",
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
    exerciseName: "Face Pulls with Rope",
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
    exerciseName: "Bent-Over Rear Delt Flyes",
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
  ...IMMORTAL_BACK_BICEPS.slice(0, 6).map(ex => ({ ...ex, category: "Back + Biceps + Forearm" })),
  {
    programId: "immortal_90",
    programName: "Immortal 90 Day Challenge",
    category: "Back + Biceps + Forearm",
    muscleGroup: ["Forearms"],
    exerciseName: "Barbell Palms-Up Wrist Curls",
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
    exerciseName: "Reverse EZ-Bar Forearm Curls",
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
    exerciseName: "Farmer's Heavy Dumbbell Carry",
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
    exerciseName: "Hanging Leg Raises",
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
    exerciseName: "Ab Wheel Rollouts",
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
    exerciseName: "Weighted Cable Rope Crunches",
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
    exerciseName: "5 to 10 KM Continuous Running or Walking",
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
    exerciseName: "Post-Cardio Decompression, Rehydration & Complete Rest",
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
const HOME_180_EXERCISES_POOL: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "home_180",
    programName: "180 Day Home Workout Challenge",
    category: "Chest",
    muscleGroup: ["Chest"],
    exerciseName: "Tempo Calisthenic Push-ups",
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
    exerciseName: "Chair / Couch Tricep Dips",
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
    exerciseName: "Prone Floor Cobra Hold",
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
    category: "Shoulders",
    muscleGroup: ["Shoulders"],
    exerciseName: "Pike Push-ups for Deltoid Power",
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
    exerciseName: "Doorframe Isometric Bicep Curls",
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
    exerciseName: "Bodyweight Air Squats & Pulse",
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
    category: "Core and abs",
    muscleGroup: ["Abs"],
    exerciseName: "Dead Bug Core Bracing",
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
    exerciseName: "5 to 10 KM Calibrated Walk or Jog",
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
    category: "Mobility and recovery",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "World's Greatest Stretch & Spinal Flow",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 2,
    reps: "8 reps per side",
    duration: "10 mins",
    instructions: ["Deep lunge with elbow to instep, then rotate arm towards sky."],
    restTime: "Active flow"
  }
];

// --- PROGRAM 3: WOMEN CONFIDENCE PROGRAM CATALOG ---
const WOMEN_EXERCISES_POOL: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Glutes",
    muscleGroup: ["Glutes"],
    exerciseName: "Banded Glute Bridge Abductions",
    equipment: "Booty Band & Yoga Mat",
    difficulty: "Beginner",
    sets: 4,
    reps: "15 reps + 10 abductions",
    duration: "45s set",
    instructions: ["Place resistance band above knees. Drive hips up, flare knees out at top, lower slowly."],
    restTime: "60s"
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Lower body",
    muscleGroup: ["Glutes", "Legs"],
    exerciseName: "Dumbbell Bulgarian Split Squats",
    equipment: "Dumbbells & Bench/Chair",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10 reps per leg",
    duration: "50s set",
    instructions: ["Rear foot elevated on bench, drop back knee toward floor while keeping front knee tracking toes."],
    restTime: "75s"
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Legs",
    muscleGroup: ["Legs"],
    exerciseName: "Goblet Sumo Squat",
    equipment: "Single Dumbbell",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    duration: "45s set",
    instructions: ["Wide stance with toes pointed at 45 degrees. Lower hips deep feeling inner thigh and glute stretch."],
    restTime: "60s"
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Core and abs",
    muscleGroup: ["Abs"],
    exerciseName: "Stomach Vacuum & Transverse Bracing",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 4,
    reps: "20s hold",
    duration: "30s set",
    instructions: ["Exhale all air, pull belly button deeply toward spine, hold while maintaining shallow breathing."],
    restTime: "30s"
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Upper body",
    muscleGroup: ["Upper body"],
    exerciseName: "Incline Push-ups for Toned Upper Chest",
    equipment: "Bench or Countertop",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    duration: "40s set",
    instructions: ["Hands placed on elevated surface. Keep body in a straight plank, lower chest to edge and press."],
    restTime: "45s"
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Back",
    muscleGroup: ["Back"],
    exerciseName: "Dumbbell Dual Arm Row for Posture",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    sets: 3,
    reps: "12",
    duration: "40s set",
    instructions: ["Hinge at waist, pull elbows up toward ceiling, pinning shoulder blades together."],
    restTime: "60s"
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Confidence and wellness sessions",
    muscleGroup: ["Mobility and recovery"],
    exerciseName: "Mindset Calibration & Posture Self-Alignment",
    equipment: "Quiet Room & Mat",
    difficulty: "Beginner",
    sets: 1,
    reps: "10 mins",
    duration: "10 mins",
    instructions: ["Affirm physical strength, breathe deeply into ribs, align crown of head above tailbone."],
    restTime: "Rest"
  },
  {
    programId: "women_confidence",
    programName: "Women Confidence Program",
    category: "Cardio",
    muscleGroup: ["Cardio"],
    exerciseName: "5 to 10 KM Power Walking or Trail Run",
    equipment: "Running Shoes",
    difficulty: "Beginner",
    sets: 1,
    reps: "5-10 KM",
    duration: "50 mins",
    instructions: ["Brisk aerobic walk or gentle run. Workouts removed today so muscles can recover completely."],
    restTime: "Post-cardio rest"
  }
];

// --- PROGRAM 4: BELLY FAT SHRED SYSTEM CATALOG ---
const BELLY_FAT_EXERCISES_POOL: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "belly_fat_shred",
    programName: "Belly Fat Shred System",
    category: "Core",
    muscleGroup: ["Abs"],
    exerciseName: "Isometric Plank with Posterior Pelvic Tilt",
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
    exerciseName: "Russian Twist with Controlled Tempo",
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
    exerciseName: "Mountain Climbers Sprint Intervals",
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
    exerciseName: "Jump Rope Double Taps or Speed Skips",
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
    exerciseName: "5 to 10 KM Incline Walk or Outdoor Run",
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
const POSTURE_VITALITY_POOL: Omit<ChallengeExerciseItem, "id" | "dayNumber">[] = [
  {
    programId: "posture_vitality",
    programName: "Reclaim Your Posture & Vitality",
    category: "Posture correction",
    muscleGroup: ["Upper back"],
    exerciseName: "Wall Angels for Scapular Depression",
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
    category: "Neck mobility",
    muscleGroup: ["Neck mobility"],
    exerciseName: "Chin Tucks against Headrest/Wall",
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
    exerciseName: "Doorway Pectoral & Bicep Stretch",
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
    category: "Spinal mobility",
    muscleGroup: ["Spinal mobility"],
    exerciseName: "Cat-Cow Dynamic Spinal Waves",
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
    category: "Hip mobility",
    muscleGroup: ["Hip mobility"],
    exerciseName: "90/90 Hip Flow with Forward Fold",
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
    category: "Glute activation",
    muscleGroup: ["Glutes"],
    exerciseName: "Prone Hip Extension with Knee Bent",
    equipment: "Yoga Mat",
    difficulty: "Beginner",
    sets: 3,
    reps: "15 reps per leg",
    duration: "40s set",
    instructions: ["Lie on stomach, bend knee to 90 degrees, stamp sole of foot toward ceiling using glute."],
    restTime: "30s"
  }
];

// ============================================================================
// 3. DETERMINISTIC WORKOUT GENERATOR WITH STRICT HIERARCHY
// PROGRAM -> DAY -> CATEGORY -> MUSCLE GROUP -> EXERCISE
// ============================================================================

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
      return { meta, exercises };
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
      return { meta, exercises };
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
      return { meta, exercises };
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
      return { meta, exercises };
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
      return { meta, exercises };
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
      return { meta, exercises };
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
    return { meta, exercises };
  }

  // --------------------------------------------------------------------------
  // PROGRAM 2: 180 DAY HOME WORKOUT CHALLENGE (CALISTHENICS & BODYWEIGHT ONLY)
  // --------------------------------------------------------------------------
  if (programId === "home_180") {
    const dayMod = ((safeDay - 1) % 6);
    let category = "Full body";
    let targetMuscles = ["Full body"];
    let exercisesToUse = HOME_180_EXERCISES_POOL;

    if (dayMod === 0) {
      category = "Upper body";
      targetMuscles = ["Chest", "Shoulders", "Arms"];
      exercisesToUse = HOME_180_EXERCISES_POOL.filter(e => ["Chest", "Upper body", "Shoulders", "Arms"].includes(e.category));
    } else if (dayMod === 1) {
      category = "Legs and glutes";
      targetMuscles = ["Legs", "Glutes"];
      exercisesToUse = HOME_180_EXERCISES_POOL.filter(e => ["Legs and glutes", "Core and abs"].includes(e.category));
    } else if (dayMod === 2) {
      category = "Cardio";
      targetMuscles = ["Cardio"];
      exercisesToUse = HOME_180_EXERCISES_POOL.filter(e => e.category === "Cardio" || e.category === "Mobility and recovery");
    } else if (dayMod === 3) {
      category = "Back";
      targetMuscles = ["Back", "Arms"];
      exercisesToUse = HOME_180_EXERCISES_POOL.filter(e => ["Back", "Arms", "Core and abs"].includes(e.category));
    } else if (dayMod === 4) {
      category = "Core and abs";
      targetMuscles = ["Abs"];
      exercisesToUse = HOME_180_EXERCISES_POOL.filter(e => ["Core and abs", "Full body"].includes(e.category));
    } else {
      category = "Mobility and recovery";
      targetMuscles = ["Mobility and recovery"];
      exercisesToUse = HOME_180_EXERCISES_POOL.filter(e => e.category === "Mobility and recovery");
    }

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
        "Strict category assignment without pulling from Immortal 90 Day Challenge."
      ],
      coachingNotes: "180 Day Home Challenge maintains strict bodyweight and home-compatible biomechanics."
    };

    const exercises = exercisesToUse.map((ex, idx) => ({
      ...ex,
      id: `home_d${safeDay}_ex_${idx + 1}`,
      dayNumber: safeDay
    }));
    return { meta, exercises };
  }

  // --------------------------------------------------------------------------
  // PROGRAM 3: WOMEN CONFIDENCE PROGRAM (180 DAYS)
  // --------------------------------------------------------------------------
  if (programId === "women_confidence") {
    const dayMod = ((safeDay - 1) % 6);
    let category = "Glutes";
    let targetMuscles = ["Glutes"];
    let exercisesToUse = WOMEN_EXERCISES_POOL;

    if (dayMod === 0) {
      category = "Glutes";
      targetMuscles = ["Glutes", "Lower body"];
      exercisesToUse = WOMEN_EXERCISES_POOL.filter(e => ["Glutes", "Lower body"].includes(e.category));
    } else if (dayMod === 1) {
      category = "Core and abs";
      targetMuscles = ["Abs"];
      exercisesToUse = WOMEN_EXERCISES_POOL.filter(e => ["Core and abs", "Upper body"].includes(e.category));
    } else if (dayMod === 2) {
      category = "Cardio";
      targetMuscles = ["Cardio"];
      exercisesToUse = WOMEN_EXERCISES_POOL.filter(e => e.category === "Cardio");
    } else if (dayMod === 3) {
      category = "Legs";
      targetMuscles = ["Legs", "Glutes"];
      exercisesToUse = WOMEN_EXERCISES_POOL.filter(e => ["Legs", "Glutes"].includes(e.category));
    } else if (dayMod === 4) {
      category = "Upper body";
      targetMuscles = ["Back", "Upper body"];
      exercisesToUse = WOMEN_EXERCISES_POOL.filter(e => ["Upper body", "Back"].includes(e.category));
    } else {
      category = "Confidence and wellness sessions";
      targetMuscles = ["Mobility and recovery"];
      exercisesToUse = WOMEN_EXERCISES_POOL.filter(e => e.category === "Confidence and wellness sessions");
    }

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
        "Zero cross-contamination with unrelated Immortal 90 workouts."
      ],
      coachingNotes: "Women Confidence Program: Focus on glute drive, transverse abdominis vacuuming, and empowered consistency."
    };

    const exercises = exercisesToUse.map((ex, idx) => ({
      ...ex,
      id: `women_d${safeDay}_ex_${idx + 1}`,
      dayNumber: safeDay
    }));
    return { meta, exercises };
  }

  // --------------------------------------------------------------------------
  // PROGRAM 4: BELLY FAT SHRED SYSTEM (150 DAYS)
  // --------------------------------------------------------------------------
  if (programId === "belly_fat_shred") {
    const dayMod = ((safeDay - 1) % 5);
    let category = "Core";
    let targetMuscles = ["Abs"];
    let exercisesToUse = BELLY_FAT_EXERCISES_POOL;

    if (dayMod === 0) {
      category = "Core";
      targetMuscles = ["Abs"];
      exercisesToUse = BELLY_FAT_EXERCISES_POOL.filter(e => e.category === "Core" || e.category === "Obliques");
    } else if (dayMod === 1) {
      category = "HIIT";
      targetMuscles = ["Full body"];
      exercisesToUse = BELLY_FAT_EXERCISES_POOL.filter(e => e.category === "HIIT" || e.category === "Full body conditioning");
    } else if (dayMod === 2) {
      category = "Walking or running";
      targetMuscles = ["Cardio"];
      exercisesToUse = BELLY_FAT_EXERCISES_POOL.filter(e => e.category === "Walking or running");
    } else if (dayMod === 3) {
      category = "Obliques";
      targetMuscles = ["Abs"];
      exercisesToUse = BELLY_FAT_EXERCISES_POOL.filter(e => e.category === "Obliques" || e.category === "Core");
    } else {
      category = "Full body conditioning";
      targetMuscles = ["Full body"];
      exercisesToUse = BELLY_FAT_EXERCISES_POOL.filter(e => e.category === "Full body conditioning" || e.category === "HIIT");
    }

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
        "Remember: Abdominal movements strengthen core muscles; overall fat loss comes from sustained energy balance and activity."
      ],
      coachingNotes: "Belly Fat Shred System builds deep core density while elevating caloric expenditure safely."
    };

    const exercises = exercisesToUse.map((ex, idx) => ({
      ...ex,
      id: `belly_d${safeDay}_ex_${idx + 1}`,
      dayNumber: safeDay
    }));
    return { meta, exercises };
  }

  // --------------------------------------------------------------------------
  // PROGRAM 5: RECLAIM YOUR POSTURE & VITALITY (60 DAYS)
  // --------------------------------------------------------------------------
  const dayMod = ((safeDay - 1) % 6);
  let category = "Posture correction";
  let targetMuscles = ["Upper back"];
  let exercisesToUse = POSTURE_VITALITY_POOL;

  if (dayMod === 0) {
    category = "Posture correction";
    targetMuscles = ["Upper back", "Neck mobility"];
    exercisesToUse = POSTURE_VITALITY_POOL.filter(e => ["Posture correction", "Neck mobility"].includes(e.category));
  } else if (dayMod === 1) {
    category = "Chest opening";
    targetMuscles = ["Chest", "Shoulders"];
    exercisesToUse = POSTURE_VITALITY_POOL.filter(e => ["Chest opening", "Spinal mobility"].includes(e.category));
  } else if (dayMod === 2) {
    category = "Hip mobility";
    targetMuscles = ["Hip mobility", "Glutes"];
    exercisesToUse = POSTURE_VITALITY_POOL.filter(e => ["Hip mobility", "Glute activation"].includes(e.category));
  } else if (dayMod === 3) {
    category = "Spinal mobility";
    targetMuscles = ["Spinal mobility"];
    exercisesToUse = POSTURE_VITALITY_POOL.filter(e => ["Spinal mobility", "Posture correction"].includes(e.category));
  } else if (dayMod === 4) {
    category = "Glute activation";
    targetMuscles = ["Glutes", "Core stability"];
    exercisesToUse = POSTURE_VITALITY_POOL.filter(e => ["Glute activation", "Hip mobility"].includes(e.category));
  } else {
    category = "Daily movement";
    targetMuscles = ["Mobility and recovery"];
    exercisesToUse = POSTURE_VITALITY_POOL;
  }

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
      "Move with mindful breathing and zero joint compression."
    ],
    coachingNotes: "Reclaim Your Posture & Vitality repairs anterior shoulder rounding, neck tension, and hip tightness."
  };

  const exercises = exercisesToUse.map((ex, idx) => ({
    ...ex,
    id: `posture_d${safeDay}_ex_${idx + 1}`,
    dayNumber: safeDay
  }));
  return { meta, exercises };
}
