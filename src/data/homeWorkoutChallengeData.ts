// 180 Day Home Workout Challenge Data Model & Progressive Workout Schedules
// Zero equipment bodyweight workouts for Men and Women

export interface HomeOnboardingProfile {
  gender: "Male" | "Female" | "Other";
  age: number;
  currentWeight: number; // kg
  height: number; // cm
  fitnessLevel: "Beginner" | "Intermediate" | "Advanced";
  mainGoal: "Build muscle" | "Lose body fat" | "Improve fitness" | "Build strength" | "Improve endurance" | "General fitness";
  trainingDaysPerWeek: number; // 3 to 7
  currentAbilityLevel: "Complete Beginner" | "Some Experience" | "Consistent" | "Advanced";
  workoutTimePreference: "Morning" | "Evening" | "Flexible";
  startingPhotoUrl?: string;
  startDate: string;
}

export interface HomeExercise {
  id: string;
  name: string;
  targetMuscles: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  workoutType: "reps" | "time";
  instructions: string[];
  sets: string;
  repsOrDuration: string;
  restPeriod: string;
  beginnerModification: string;
  advancedProgression: string;
  coachingCues: string[];
  gifUrl: string;
  equipment: "Zero Equipment (Bodyweight)";
  sectionName?: string;
  sectionId?: string;
}

export interface HomeWorkoutSection {
  id: string;
  title: string;
  name?: string;
  description: string;
  exerciseIndices: number[];
}

export interface HomeDailyWorkout {
  dayNumber: number;
  phaseNumber: 1 | 2 | 3 | 4;
  phaseName: string;
  title: string;
  focus: string;
  isRestDay: boolean;
  is5KmCardioDay: boolean;
  cardioTypeRecommended?: "5 KM Run" | "5 KM Walk";
  estimatedMinutes: number;
  exercises: HomeExercise[];
  sections: HomeWorkoutSection[];
  motivationalQuote: string;
}

export interface HomeProgramPhase {
  phaseNumber: 1 | 2 | 3 | 4;
  name: string;
  weekRange: string;
  dayRange: string;
  focus: string;
  description: string;
  iconName: string;
  color: string;
}

export const HOME_PROGRAM_PHASES: HomeProgramPhase[] = [
  {
    phaseNumber: 1,
    name: "Movement Foundations & Core Activation",
    weekRange: "Weeks 1 – 4",
    dayRange: "Days 1 – 30",
    focus: "Baseline Movement Mastery, Kinetic Joint Mobility & Aerobic Adaptation",
    description: "Build clean motor control, strengthen connective tissues, and activate dormant stabilizer muscles with structured bodyweight mechanics.",
    iconName: "Shield",
    color: "from-blue-600 to-cyan-600"
  },
  {
    phaseNumber: 2,
    name: "Strength Endurance & Kinetic Definition",
    weekRange: "Weeks 5 – 10",
    dayRange: "Days 31 – 75",
    focus: "Volume Accumulation, Unilateral Balance & Time-Under-Tension",
    description: "Increase repetition volume, shorten rest intervals, and introduce multi-planar bodyweight movements for muscle tone and stamina.",
    iconName: "Flame",
    color: "from-amber-600 to-orange-600"
  },
  {
    phaseNumber: 3,
    name: "High-Output Conditioning & Core Power",
    weekRange: "Weeks 11 – 18",
    dayRange: "Days 76 – 130",
    focus: "Metabolic Density, Explosive Power & Calisthenic Control",
    description: "Elevate your anaerobic threshold, strengthen your anterior/posterior core chain, and burn stubborn fat with high-efficiency home circuits.",
    iconName: "Zap",
    color: "from-rose-600 to-red-600"
  },
  {
    phaseNumber: 4,
    name: "Peak Transformation & Calisthenic Mastery",
    weekRange: "Weeks 19 – 26",
    dayRange: "Days 131 – 180",
    focus: "Total Body Mastery, Peak Cardiovascular Output & Lifelong Habit Lock-In",
    description: "Achieve pinnacle home athletic performance, complete advanced calisthenic variations, and solidify permanent lifestyle discipline.",
    iconName: "Trophy",
    color: "from-purple-600 to-indigo-600"
  }
];

// Expanded 0-Equipment Home Workout Catalog (40+ movements, verified reps/time types)
export const HOME_EXERCISES_CATALOG: Record<string, HomeExercise> = {
  // Push & Upper Body
  push_ups: {
    id: "push_ups",
    name: "Standard Push-Ups",
    targetMuscles: ["Chest", "Triceps", "Anterior Deltoids", "Core"],
    difficulty: "Beginner",
    workoutType: "reps",
    instructions: [
      "Place your hands slightly wider than shoulder-width apart on the floor with fingers spread.",
      "Engage your glutes and core so your body forms a rigid, straight line from head to heels.",
      "Lower your chest until it is approximately 2 inches off the floor, keeping elbows tucked at a 45-degree angle.",
      "Press explosively through the palms to return to the starting position without arching your lower back."
    ],
    sets: "3 - 4 Sets",
    repsOrDuration: "12 - 15 Reps",
    restPeriod: "45 - 60 seconds",
    beginnerModification: "Incline Push-Ups (hands on a sturdy wall, counter, or sofa) or Knee Push-Ups.",
    advancedProgression: "Diamond Push-Ups, Tempo (3-sec eccentric) Push-Ups, or Archer Push-Ups.",
    coachingCues: ["Do not let hips sag", "Keep neck neutral", "Squeeze glutes throughout"],
    gifUrl: "https://media.giphy.com/media/3o84U6421O1IIXbowg/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  diamond_pushups: {
    id: "diamond_pushups",
    name: "Diamond Close-Grip Push-Ups",
    targetMuscles: ["Triceps", "Inner Chest", "Anterior Deltoids", "Core"],
    difficulty: "Intermediate",
    workoutType: "reps",
    instructions: [
      "Form a high plank with thumbs and index fingers touching to create a diamond shape under your chest.",
      "Brace your core and glutes firmly to prevent lumbar sag.",
      "Lower your chest with elbows tucked closely against your ribs until your sternum lightly taps your hands.",
      "Drive hard through the palms, focusing on triceps lockout at the top."
    ],
    sets: "3 Sets",
    repsOrDuration: "8 - 12 Reps",
    restPeriod: "60 seconds",
    beginnerModification: "Knee Diamond Push-Ups or Hands-Elevated Diamond Push-Ups.",
    advancedProgression: "Decline Feet-Elevated Diamond Push-Ups.",
    coachingCues: ["Keep elbows tight to ribs", "Exhale on upward press", "Full tricep extension"],
    gifUrl: "https://media.giphy.com/media/3o84U6421O1IIXbowg/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  incline_pushups: {
    id: "incline_pushups",
    name: "Incline Hand-Elevated Push-Ups",
    targetMuscles: ["Lower Chest", "Triceps", "Shoulders", "Core"],
    difficulty: "Beginner",
    workoutType: "reps",
    instructions: [
      "Place hands shoulder-width apart on a sturdy sofa, sturdy table, or wall.",
      "Step feet back into a rigid plank position with glutes squeezed.",
      "Lower your chest until it lightly touches the elevated surface.",
      "Push back to straight arms with controlled cadence."
    ],
    sets: "3 Sets",
    repsOrDuration: "12 - 16 Reps",
    restPeriod: "45 seconds",
    beginnerModification: "Wall Push-Ups standing closer to the wall.",
    advancedProgression: "Standard Floor Push-Ups.",
    coachingCues: ["Chest stays open", "No hip piking", "Smooth rhythmic push"],
    gifUrl: "https://media.giphy.com/media/3o84U6421O1IIXbowg/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  pike_pushups: {
    id: "pike_pushups",
    name: "Pike Push-Ups",
    targetMuscles: ["Shoulders (Deltoids)", "Triceps", "Upper Chest", "Upper Back"],
    difficulty: "Intermediate",
    workoutType: "reps",
    instructions: [
      "Start in a downward dog position with hips driven high into the air and hands shoulder-width apart.",
      "Lower your head forward between your hands by bending your elbows out at 45 degrees.",
      "Touch crown of head lightly toward the floor.",
      "Press through palms to return to the pike position, pushing head back through arms."
    ],
    sets: "3 - 4 Sets",
    repsOrDuration: "8 - 12 Reps",
    restPeriod: "60 seconds",
    beginnerModification: "Elevated Hands Pike Push-Up (hands on sofa or bench).",
    advancedProgression: "Feet-Elevated Pike Push-Ups or Wall Handstand Push-Ups.",
    coachingCues: ["Gaze toward feet", "Hips stay high in A-frame", "Control the descent"],
    gifUrl: "https://media.giphy.com/media/3o84U6421O1IIXbowg/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  tricep_dips: {
    id: "tricep_dips",
    name: "Bodyweight Chair / Sofa Dips",
    targetMuscles: ["Triceps", "Anterior Deltoids", "Pectorals"],
    difficulty: "Beginner",
    workoutType: "reps",
    instructions: [
      "Sit on the edge of a sturdy sofa, bench, or chair with hands gripping the edge next to your hips.",
      "Slide your hips forward off the edge with knees bent at 90 degrees (or legs straight for more resistance).",
      "Lower your hips by bending elbows to 90 degrees, keeping back close to the furniture.",
      "Press through palms to fully extend arms and squeeze triceps."
    ],
    sets: "3 Sets",
    repsOrDuration: "12 - 15 Reps",
    restPeriod: "45 seconds",
    beginnerModification: "Feet closer to chair with knees bent at 90 degrees.",
    advancedProgression: "Straight legs with heels elevated on another stool.",
    coachingCues: ["Keep back close to the seat", "Elbows point straight back", "Do not shrug shoulders"],
    gifUrl: "https://media.giphy.com/media/3o84U6421O1IIXbowg/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  tempo_pushups: {
    id: "tempo_pushups",
    name: "3-Second Eccentric Tempo Push-Ups",
    targetMuscles: ["Pectorals", "Triceps", "Shoulders", "Core"],
    difficulty: "Intermediate",
    workoutType: "reps",
    instructions: [
      "Set up in a standard high plank.",
      "Lower down slowly over a strict 3-second count: 3... 2... 1...",
      "Pause 1 second hovering 1 inch above the floor.",
      "Explode back up to the top in 1 second."
    ],
    sets: "3 Sets",
    repsOrDuration: "8 - 10 Reps",
    restPeriod: "60 seconds",
    beginnerModification: "Tempo Incline Push-Ups with hands on sofa.",
    advancedProgression: "4-Second Eccentric Push-Ups.",
    coachingCues: ["Count 3 full seconds down", "Core stays rigid", "Explosive lockout"],
    gifUrl: "https://media.giphy.com/media/3o84U6421O1IIXbowg/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },

  // Lower Body & Legs
  bodyweight_squats: {
    id: "bodyweight_squats",
    name: "Bodyweight Squats",
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Calves"],
    difficulty: "Beginner",
    workoutType: "reps",
    instructions: [
      "Stand with feet shoulder-width apart, toes pointed slightly outward (15-20 degrees).",
      "Brace your core, hinge at the hips, and push your knees out as you lower down as if sitting into a chair.",
      "Descend until your hip crease drops below or parallel to your knees while maintaining an upright chest.",
      "Drive through your mid-foot and heels to stand back up, squeezing glutes at the top."
    ],
    sets: "3 - 4 Sets",
    repsOrDuration: "15 - 20 Reps",
    restPeriod: "45 seconds",
    beginnerModification: "Assisted Chair Squats (tap a chair behind you) or Box Squats.",
    advancedProgression: "Jump Squats, 1.5 Rep Squats, or Pistol Squats.",
    coachingCues: ["Keep heels glued to the floor", "Chest tall", "Knees track in line with toes"],
    gifUrl: "https://media.giphy.com/media/u8946fAnhQ6cH9R16e/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  walking_lunges: {
    id: "walking_lunges",
    name: "Bodyweight Forward / Walking Lunges",
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Calves", "Balance"],
    difficulty: "Intermediate",
    workoutType: "reps",
    instructions: [
      "Stand tall with feet hip-width apart and hands on hips or at chest level.",
      "Take a controlled step forward with your right leg, landing heel-first.",
      "Lower your body until both front and back knees form 90-degree angles, back knee hovering 1 inch off the floor.",
      "Drive through the front heel to stand up and step forward into the next lunge."
    ],
    sets: "3 Sets",
    repsOrDuration: "14 - 16 Reps (7-8 per leg)",
    restPeriod: "45 - 60 seconds",
    beginnerModification: "Reverse Static Lunges holding a wall for balance.",
    advancedProgression: "Jumping Switch Lunges or Deficit Lunges.",
    coachingCues: ["Torso stays upright", "Front knee stays behind or over front toes", "Smooth deceleration"],
    gifUrl: "https://media.giphy.com/media/u8946fAnhQ6cH9R16e/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  reverse_lunges: {
    id: "reverse_lunges",
    name: "Static Reverse Lunges",
    targetMuscles: ["Glutes", "Quadriceps", "Hamstrings", "Knee Stabilizers"],
    difficulty: "Beginner",
    workoutType: "reps",
    instructions: [
      "Stand with feet together and hands on hips.",
      "Step your right foot back and lower your hips until front thigh is parallel to floor.",
      "Keep front shin vertical and press through the front heel to step back to starting stance.",
      "Alternate legs each repetition."
    ],
    sets: "3 Sets",
    repsOrDuration: "16 - 20 Reps (8-10 per leg)",
    restPeriod: "45 seconds",
    beginnerModification: "Hold onto a wall for fingertip balance.",
    advancedProgression: "Deficit Reverse Lunges off a 2-inch book or block.",
    coachingCues: ["Shin vertical on front leg", "Chest proud", "Drive through front heel"],
    gifUrl: "https://media.giphy.com/media/u8946fAnhQ6cH9R16e/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  squat_jumps: {
    id: "squat_jumps",
    name: "Explosive Squat Jumps",
    targetMuscles: ["Quadriceps", "Glutes", "Calves", "Fast-Twitch Muscle Fibers"],
    difficulty: "Intermediate",
    workoutType: "reps",
    instructions: [
      "Start in a bodyweight squat stance.",
      "Lower hips into a quarter squat, then explosively drive through mid-foot and toes into the air.",
      "Extend hips and reach arms upwards at the apex.",
      "Land smoothly toe-to-heel, absorbing impact immediately into the next squat."
    ],
    sets: "3 Sets",
    repsOrDuration: "10 - 12 Reps",
    restPeriod: "60 seconds",
    beginnerModification: "Speed Squats with rapid calf raise at top without jumping.",
    advancedProgression: "Tuck Jump Squats.",
    coachingCues: ["Land softly like a cat", "Absorb through knees and hips", "Full hip extension in air"],
    gifUrl: "https://media.giphy.com/media/u8946fAnhQ6cH9R16e/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  jump_lunges: {
    id: "jump_lunges",
    name: "Plyometric Split Jump Lunges",
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Power"],
    difficulty: "Advanced",
    workoutType: "reps",
    instructions: [
      "Drop into a standard lunge.",
      "Explode vertically into the air, switching your front and back legs mid-flight.",
      "Land softly in the opposite lunge and immediately descend.",
      "Maintain balance and upright posture."
    ],
    sets: "3 Sets",
    repsOrDuration: "10 - 12 Reps (5-6 per leg)",
    restPeriod: "60 seconds",
    beginnerModification: "Fast alternating reverse lunges without jumping.",
    advancedProgression: "Continuous 15-rep plyo lunges.",
    coachingCues: ["Stay light on feet", "Switch legs smoothly in air", "Keep torso perpendicular"],
    gifUrl: "https://media.giphy.com/media/u8946fAnhQ6cH9R16e/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  glute_bridges: {
    id: "glute_bridges",
    name: "Floor Glute Bridges",
    targetMuscles: ["Gluteus Maximus", "Hamstrings", "Erector Spinae", "Core"],
    difficulty: "Beginner",
    workoutType: "reps",
    instructions: [
      "Lie on your back with knees bent and feet flat on the floor, hip-width apart and roughly 8-10 inches from your hips.",
      "Press your arms flat along the floor for stabilization.",
      "Drive through your heels to raise your pelvis until thighs, hips, and torso form a straight diagonal.",
      "Pause for 2 seconds at the peak contraction, squeezing your glutes tightly before lowering slowly."
    ],
    sets: "3 Sets",
    repsOrDuration: "15 - 20 Reps",
    restPeriod: "30 - 45 seconds",
    beginnerModification: "Standard 2-Leg Glute Bridge with reduced range of motion.",
    advancedProgression: "Single-Leg Glute Bridges or 5-second peak isometric holds.",
    coachingCues: ["Do not hyperextend lower back", "Drive through heels", "Breathe out as you lift"],
    gifUrl: "https://media.giphy.com/media/v1F0A8f5Ff6hO/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  single_leg_glute_bridge: {
    id: "single_leg_glute_bridge",
    name: "Unilateral Single-Leg Glute Bridge",
    targetMuscles: ["Gluteus Maximus", "Hamstrings", "Pelvic Stabilizers"],
    difficulty: "Intermediate",
    workoutType: "reps",
    instructions: [
      "Lie on back with knees bent, feet flat.",
      "Extend one leg straight out at a 45-degree angle.",
      "Drive through the heel of the planted foot, raising hips high without twisting the pelvis.",
      "Hold peak contraction for 1 full second, then lower under control."
    ],
    sets: "3 Sets",
    repsOrDuration: "10 - 12 Reps (each leg)",
    restPeriod: "45 seconds",
    beginnerModification: "Standard 2-leg glute bridge with 2-second hold.",
    advancedProgression: "Elevated-Foot Single Leg Bridge on sofa edge.",
    coachingCues: ["Keep pelvis level", "Drive heel into the floor", "Do not arch lower back"],
    gifUrl: "https://media.giphy.com/media/v1F0A8f5Ff6hO/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  calf_raises: {
    id: "calf_raises",
    name: "Standing Bodyweight Calf Raises",
    targetMuscles: ["Gastrocnemius", "Soleus", "Ankle Stabilizers"],
    difficulty: "Beginner",
    workoutType: "reps",
    instructions: [
      "Stand tall with feet hip-width apart near a wall for fingertip balance.",
      "Press firmly through the balls of both feet to elevate your heels as high as possible.",
      "Hold the peak contraction at the very top for 2 full seconds.",
      "Lower down slowly over a 3-second count until heels gently touch the ground."
    ],
    sets: "3 Sets",
    repsOrDuration: "20 - 25 Reps",
    restPeriod: "30 seconds",
    beginnerModification: "Seated Calf Raises with hands pushing on knees.",
    advancedProgression: "Single-Leg Elevated Deficit Calf Raises.",
    coachingCues: ["Full range of motion", "Do not bounce", "Squeeze calves at apex"],
    gifUrl: "https://media.giphy.com/media/u8946fAnhQ6cH9R16e/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  wall_sits: {
    id: "wall_sits",
    name: "Isometric Wall Sit",
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
    difficulty: "Beginner",
    workoutType: "time",
    instructions: [
      "Lean your back flat against a sturdy wall and slide down until your thighs are parallel to the floor.",
      "Position your knees directly above ankles at a 90-degree bend.",
      "Keep entire back and head pressed into the wall, hands resting on chest or straight out.",
      "Hold the position while breathing steadily through your nose."
    ],
    sets: "3 Sets",
    repsOrDuration: "45 - 60 Seconds",
    restPeriod: "45 seconds",
    beginnerModification: "High Wall Sit (45-degree knee angle rather than 90).",
    advancedProgression: "Single-Leg Wall Sit or Wall Sit with Heel Raises.",
    coachingCues: ["Weight through heels", "Keep knees tracking straight", "Stay calm and breathe"],
    gifUrl: "https://media.giphy.com/media/u8946fAnhQ6cH9R16e/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },

  // Core & Abdominals
  plank: {
    id: "plank",
    name: "Forearm Plank",
    targetMuscles: ["Transverse Abdominis", "Rectus Abdominis", "Shoulders", "Glutes"],
    difficulty: "Beginner",
    workoutType: "time",
    instructions: [
      "Place forearms on the floor with elbows directly under shoulders, forearms parallel.",
      "Extend legs behind you with toes planted, forming a straight rigid line from shoulders to heels.",
      "Engage your deep core by pulling your navel toward your spine, squeeze glutes, and push the floor away.",
      "Hold with steady diaphragmatic breathing without letting hips drop or rise."
    ],
    sets: "3 Sets",
    repsOrDuration: "45 - 60 Seconds",
    restPeriod: "45 seconds",
    beginnerModification: "Knee Plank or Incline Plank against a sturdy sofa.",
    advancedProgression: "Plank with Shoulder Taps or Body Saw Planks.",
    coachingCues: ["Do not hold breath", "Squeeze quads and glutes", "Gaze down at hands"],
    gifUrl: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  side_plank: {
    id: "side_plank",
    name: "Side Plank Isometric Hold",
    targetMuscles: ["Obliques", "Quadratus Lumborum", "Glute Medius", "Shoulder Stabilizers"],
    difficulty: "Intermediate",
    workoutType: "time",
    instructions: [
      "Lie on your right side with elbow under shoulder and feet stacked or staggered.",
      "Lift hips up until your body creates a straight diagonal line from head to feet.",
      "Extend top arm straight up or rest hand on hip.",
      "Hold tight without letting hips sag toward the floor, then switch sides."
    ],
    sets: "3 Sets",
    repsOrDuration: "30 - 45 Seconds (per side)",
    restPeriod: "30 seconds",
    beginnerModification: "Side Plank with bottom knee bent on the floor.",
    advancedProgression: "Side Plank with Top Leg Lift.",
    coachingCues: ["Push floor away through forearm", "Hips high and aligned", "Breathe smoothly"],
    gifUrl: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  shoulder_taps: {
    id: "shoulder_taps",
    name: "High Plank Anti-Rotation Shoulder Taps",
    targetMuscles: ["Core", "Anti-Rotational Obliques", "Deltoids", "Serratus"],
    difficulty: "Intermediate",
    workoutType: "time",
    instructions: [
      "Start in a high plank with feet slightly wider than hip-width for balance.",
      "Lock your pelvis in place and tap your left shoulder with your right hand.",
      "Return hand smoothly to floor and tap your right shoulder with your left hand.",
      "Focus on zero hip wobble or rotation throughout."
    ],
    sets: "3 Sets",
    repsOrDuration: "30 - 45 Seconds",
    restPeriod: "45 seconds",
    beginnerModification: "Kneeling Shoulder Taps.",
    advancedProgression: "Feet-together Shoulder Taps.",
    coachingCues: ["Glue hips parallel to ground", "Slow controlled cadence", "Breathe evenly"],
    gifUrl: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  crunches: {
    id: "crunches",
    name: "Controlled Abdominal Crunches",
    targetMuscles: ["Rectus Abdominis (Upper Abs)", "Obliques"],
    difficulty: "Beginner",
    workoutType: "reps",
    instructions: [
      "Lie flat on your back with knees bent at 90 degrees and feet flat on the floor.",
      "Place fingertips gently behind your ears without pulling on your neck.",
      "Exhale forcefully as you peel your shoulder blades 3-4 inches off the floor by contracting your abs.",
      "Hold the peak squeeze for 1 second, then lower slowly with control."
    ],
    sets: "3 Sets",
    repsOrDuration: "15 - 20 Reps",
    restPeriod: "30 seconds",
    beginnerModification: "Reach-Through Crunches (sliding hands on thighs).",
    advancedProgression: "Bicycle Crunches or V-Ups.",
    coachingCues: ["Do not pull on head", "Gaze up at ceiling", "Breathe out on way up"],
    gifUrl: "https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  bicycle_crunches: {
    id: "bicycle_crunches",
    name: "Bicycle Crunches",
    targetMuscles: ["Obliques", "Rectus Abdominis", "Hip Flexors"],
    difficulty: "Intermediate",
    workoutType: "reps",
    instructions: [
      "Lie on back with hands behind head, shoulder blades elevated off floor, and knees at 90 degrees.",
      "Extend your right leg straight out while rotating your right elbow toward your left knee.",
      "Hold the contraction for 1 second, then smoothly alternate sides.",
      "Keep lower back flat and move with tempo rather than momentum."
    ],
    sets: "3 Sets",
    repsOrDuration: "16 - 20 Reps (8-10 per side)",
    restPeriod: "45 seconds",
    beginnerModification: "Static Deadbug or Floor Alternating Knee-to-Elbow.",
    advancedProgression: "Slow 3-Second Isometric Hold Bicycles.",
    coachingCues: ["Rotate from ribcage not neck", "Keep extended leg hovering", "Smooth pedal rhythm"],
    gifUrl: "https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  leg_raises: {
    id: "leg_raises",
    name: "Lying Lower Ab Leg Raises",
    targetMuscles: ["Lower Rectus Abdominis", "Hip Flexors", "Transverse Abdominis"],
    difficulty: "Beginner",
    workoutType: "reps",
    instructions: [
      "Lie on your back with legs straight together and hands flat under your glutes for lumbar support.",
      "Press your lower back firmly into the floor so there is zero gap between your spine and the mat.",
      "Slowly raise your straight legs upward until they are perpendicular to the floor.",
      "Lower legs slowly until heels are 2 inches off the ground, pausing before the next rep."
    ],
    sets: "3 Sets",
    repsOrDuration: "12 - 15 Reps",
    restPeriod: "45 seconds",
    beginnerModification: "Bent-Knee Reverse Crunches or Alternating Heel Taps.",
    advancedProgression: "Dragon Flags or Hanging Leg Raises.",
    coachingCues: ["Lower back stays pinned down", "Control the downward speed", "Inhale as legs lower"],
    gifUrl: "https://media.giphy.com/media/3o7TKUM3IgJBX2WGY8/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  flutter_kicks: {
    id: "flutter_kicks",
    name: "Lying Scissor Flutter Kicks",
    targetMuscles: ["Lower Abs", "Hip Flexors", "Transverse Abdominis"],
    difficulty: "Intermediate",
    workoutType: "time",
    instructions: [
      "Lie flat on back with hands under hips, lower back pinned down.",
      "Hover both legs 4 to 6 inches off the floor with toes pointed.",
      "Make small, rapid vertical scissor kicks with straight legs.",
      "Keep core clamped tight throughout the time interval."
    ],
    sets: "3 Sets",
    repsOrDuration: "30 - 45 Seconds",
    restPeriod: "30 seconds",
    beginnerModification: "Hover legs higher at 45 degrees to reduce lumbar load.",
    advancedProgression: "Hands behind head with shoulder blades lifted.",
    coachingCues: ["Point toes forward", "Lower back glued to floor", "Quick rhythmic flutter"],
    gifUrl: "https://media.giphy.com/media/3o7TKUM3IgJBX2WGY8/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  russian_twists: {
    id: "russian_twists",
    name: "Bodyweight Russian Twists",
    targetMuscles: ["Obliques", "Transverse Abdominis", "Hip Flexors"],
    difficulty: "Intermediate",
    workoutType: "reps",
    instructions: [
      "Sit on the floor with knees bent, feet flat or hovering 2 inches.",
      "Lean your torso back to a 45-degree angle to engage your core.",
      "Clasp hands together and rotate your torso smoothly from right to left, touching the floor beside your hips.",
      "Rotate from the thoracic spine while keeping knees steady."
    ],
    sets: "3 Sets",
    repsOrDuration: "20 - 24 Reps (10-12 per side)",
    restPeriod: "45 seconds",
    beginnerModification: "Keep heels firmly planted on the floor.",
    advancedProgression: "Feet hovering in full V-sit position.",
    coachingCues: ["Rotate shoulders and chest", "Keep chest proud", "Controlled tempo"],
    gifUrl: "https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  dead_bug: {
    id: "dead_bug",
    name: "Dead Bug Core Stabilization",
    targetMuscles: ["Transverse Abdominis", "Pelvic Floor", "Spinal Stabilizers"],
    difficulty: "Beginner",
    workoutType: "reps",
    instructions: [
      "Lie on back with arms straight toward ceiling and knees at 90 degrees above hips.",
      "Press lower back into floor with zero gap.",
      "Slowly extend right arm overhead while lowering left leg straight toward the floor.",
      "Pause 1 inch above floor, return to start, and alternate with opposite limbs."
    ],
    sets: "3 Sets",
    repsOrDuration: "14 - 16 Reps (7-8 per side)",
    restPeriod: "30 seconds",
    beginnerModification: "Heel taps with bent knees instead of straight leg extension.",
    advancedProgression: "Add 2-second hold at extension point.",
    coachingCues: ["Do not let lower back arch", "Move slowly like molasses", "Breathe out as limbs extend"],
    gifUrl: "https://media.giphy.com/media/3o7TKUM3IgJBX2WGY8/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  hollow_body_hold: {
    id: "hollow_body_hold",
    name: "Gymnastic Hollow Body Hold",
    targetMuscles: ["Entire Abdominal Wall", "Hip Flexors", "Serratus Anterior"],
    difficulty: "Advanced",
    workoutType: "time",
    instructions: [
      "Lie flat on back with legs straight and arms extended overhead.",
      "Flatten lower back into the floor completely.",
      "Lift shoulder blades, arms, and legs 4 to 6 inches off the floor to create a shallow banana curve.",
      "Hold this rigid isometric position, breathing shallowly into the ribcage."
    ],
    sets: "3 Sets",
    repsOrDuration: "20 - 30 Seconds",
    restPeriod: "45 seconds",
    beginnerModification: "Tuck knees toward chest (Hollow Tuck).",
    advancedProgression: "Rocking Hollow Body.",
    coachingCues: ["Zero lower back arch", "Lock knees and point toes", "Tuck chin slightly"],
    gifUrl: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  superman_holds: {
    id: "superman_holds",
    name: "Prone Superman Holds",
    targetMuscles: ["Lower Back", "Glutes", "Hamstrings", "Rear Delts"],
    difficulty: "Beginner",
    workoutType: "time",
    instructions: [
      "Lie face down on the floor with arms extended overhead and legs straight.",
      "Simultaneously lift your arms, chest, and legs 4-6 inches off the floor by squeezing your glutes and upper back.",
      "Hold the peak contraction while keeping your neck neutral (gaze down).",
      "Lower smoothly and repeat for the duration."
    ],
    sets: "3 Sets",
    repsOrDuration: "30 - 45 Seconds",
    restPeriod: "30 seconds",
    beginnerModification: "Alternating Prone Swimmers (opposite arm and leg lift).",
    advancedProgression: "Superman with Lat Pulldown Arm Squeeze.",
    coachingCues: ["Squeeze glutes tightly", "Do not jerk neck up", "Breathe smoothly at peak"],
    gifUrl: "https://media.giphy.com/media/26AHG5KGFxSkUWw1i/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  bird_dog: {
    id: "bird_dog",
    name: "Quadruped Bird Dog",
    targetMuscles: ["Erector Spinae", "Gluteus Maximus", "Deltoids", "Core"],
    difficulty: "Beginner",
    workoutType: "reps",
    instructions: [
      "Start on all fours with hands directly below shoulders and knees below hips.",
      "Brace core to keep spine flat like a tabletop.",
      "Extend right arm forward and left leg backward until both are parallel to the floor.",
      "Pause 1-2 seconds at full extension, return to quadruped, and repeat on opposite side."
    ],
    sets: "3 Sets",
    repsOrDuration: "14 - 16 Reps (7-8 per side)",
    restPeriod: "30 seconds",
    beginnerModification: "Move only the legs, keeping both hands on floor.",
    advancedProgression: "Add elbow-to-knee crunch between reps.",
    coachingCues: ["Do not let hips tilt", "Reach fingers and heel far", "Spine stays flat"],
    gifUrl: "https://media.giphy.com/media/26AHG5KGFxSkUWw1i/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },

  // Cardio, Agility & Dynamic Calisthenics
  mountain_climbers: {
    id: "mountain_climbers",
    name: "Mountain Climbers",
    targetMuscles: ["Core", "Hip Flexors", "Shoulders", "Cardio System"],
    difficulty: "Beginner",
    workoutType: "time",
    instructions: [
      "Start in a high plank position with hands under shoulders and body straight.",
      "Drive your right knee up toward your chest without letting your hips pike into the air.",
      "Quickly step the right foot back and drive the left knee forward in a rhythmic running cadence.",
      "Maintain active core bracing and keep your shoulders locked over wrists throughout."
    ],
    sets: "3 Sets",
    repsOrDuration: "30 - 45 Seconds",
    restPeriod: "45 seconds",
    beginnerModification: "Elevated Hands Slow Climbers (hands on sofa, stepping one foot at a time).",
    advancedProgression: "Cross-Body Mountain Climbers or Double-Foot Hops.",
    coachingCues: ["Keep hips level with shoulders", "Quiet feet on landing", "Pump with controlled rhythm"],
    gifUrl: "https://media.giphy.com/media/26vUAAkP2u7BvI4uY/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  cross_body_climbers: {
    id: "cross_body_climbers",
    name: "Cross-Body Mountain Climbers",
    targetMuscles: ["Obliques", "Core", "Shoulders", "Cardiovascular"],
    difficulty: "Intermediate",
    workoutType: "time",
    instructions: [
      "Begin in high plank position.",
      "Drive right knee across your torso toward your left elbow.",
      "Quickly alternate and drive left knee toward your right elbow.",
      "Maintain brisk rotational cadence with shoulders square."
    ],
    sets: "3 Sets",
    repsOrDuration: "30 - 45 Seconds",
    restPeriod: "45 seconds",
    beginnerModification: "Hands on sofa cross-body step.",
    advancedProgression: "Fast sprint cross-body climbers.",
    coachingCues: ["Drive knee diagonally", "Keep hips flat", "Strong push into floor"],
    gifUrl: "https://media.giphy.com/media/26vUAAkP2u7BvI4uY/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  high_knees: {
    id: "high_knees",
    name: "Cardio High Knees",
    targetMuscles: ["Hip Flexors", "Quadriceps", "Calves", "Cardiovascular"],
    difficulty: "Beginner",
    workoutType: "time",
    instructions: [
      "Stand tall with feet hip-width apart and arms bent at 90 degrees.",
      "Drive your right knee up to hip height while pumping your left arm forward.",
      "Quickly switch legs, landing softly on the balls of your feet in a rapid running motion.",
      "Maintain an upright posture with tight core engagement."
    ],
    sets: "3 Sets",
    repsOrDuration: "30 - 45 Seconds",
    restPeriod: "45 seconds",
    beginnerModification: "High Knee March (low impact march in place without jumping).",
    advancedProgression: "High Knee Sprints with Resistance Band.",
    coachingCues: ["Knees up to hip level", "Stay light on balls of feet", "Keep chest proud"],
    gifUrl: "https://media.giphy.com/media/26vUAAkP2u7BvI4uY/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  jumping_jacks: {
    id: "jumping_jacks",
    name: "Dynamic Jumping Jacks",
    targetMuscles: ["Full Body", "Calves", "Deltoids", "Cardiovascular"],
    difficulty: "Beginner",
    workoutType: "time",
    instructions: [
      "Stand with feet together and arms resting at your sides.",
      "Jump your feet out shoulder-width apart while swinging your arms outward and overhead.",
      "Without pausing, jump back to the starting stance, lowering arms back down.",
      "Maintain a smooth, rhythmic cadence with light landings."
    ],
    sets: "3 Sets",
    repsOrDuration: "45 - 60 Seconds",
    restPeriod: "30 seconds",
    beginnerModification: "Step Jacks (step one foot out at a time without jumping).",
    advancedProgression: "Star Jumps or Plank Jacks.",
    coachingCues: ["Soft knees on landings", "Rhythmic breathing", "Full arm extension"],
    gifUrl: "https://media.giphy.com/media/l41lI4bYmcsPJX9Go/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  step_jacks: {
    id: "step_jacks",
    name: "Low-Impact Cardio Step Jacks",
    targetMuscles: ["Shoulders", "Calves", "Heart Rate Warm-up"],
    difficulty: "Beginner",
    workoutType: "time",
    instructions: [
      "Stand tall with feet together.",
      "Step right foot out wide while raising both arms overhead.",
      "Step right foot back while lowering arms.",
      "Immediately step left foot out wide, alternating with steady tempo."
    ],
    sets: "3 Sets",
    repsOrDuration: "45 - 60 Seconds",
    restPeriod: "20 seconds",
    beginnerModification: "Arm raises without step.",
    advancedProgression: "Fast tempo jumping jacks.",
    coachingCues: ["Keep arms snappy", "Land softly on balls of feet", "Steady breathing"],
    gifUrl: "https://media.giphy.com/media/l41lI4bYmcsPJX9Go/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  butt_kicks: {
    id: "butt_kicks",
    name: "Dynamic Cardio Butt Kicks",
    targetMuscles: ["Hamstrings", "Quadriceps Stretch", "Cardiovascular"],
    difficulty: "Beginner",
    workoutType: "time",
    instructions: [
      "Stand tall with feet hip-width apart.",
      "Jog in place, kicking your heels up towards your glutes on each step.",
      "Pump arms in rhythm with your strides.",
      "Maintain a slight forward lean at the ankles."
    ],
    sets: "3 Sets",
    repsOrDuration: "30 - 45 Seconds",
    restPeriod: "30 seconds",
    beginnerModification: "Low-impact standing hamstring curls in place.",
    advancedProgression: "High-cadence sprint butt kicks.",
    coachingCues: ["Stay light on midfoot", "Knees point down", "Smooth arm drive"],
    gifUrl: "https://media.giphy.com/media/26vUAAkP2u7BvI4uY/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  skater_hops: {
    id: "skater_hops",
    name: "Lateral Speed Skater Hops",
    targetMuscles: ["Glute Medius", "Quadriceps", "Lateral Ankle Balance", "Power"],
    difficulty: "Intermediate",
    workoutType: "time",
    instructions: [
      "Start standing on your right foot with knees soft.",
      "Push laterally off right foot and bound sideways onto your left foot, sweeping right leg behind you.",
      "Land softly on left foot, absorbing shock through knee and hip.",
      "Immediately bound back to the right side in a continuous athletic rhythm."
    ],
    sets: "3 Sets",
    repsOrDuration: "30 - 45 Seconds",
    restPeriod: "45 seconds",
    beginnerModification: "Lateral step and tap without flight phase.",
    advancedProgression: "Deep deficit skater hops with floor tap.",
    coachingCues: ["Stay low in athletic stance", "Absorb landing softly", "Use arms for counter-balance"],
    gifUrl: "https://media.giphy.com/media/u8946fAnhQ6cH9R16e/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  burpees: {
    id: "burpees",
    name: "Full Body Burpees",
    targetMuscles: ["Full Body", "Chest", "Legs", "Core", "Cardiovascular"],
    difficulty: "Intermediate",
    workoutType: "reps",
    instructions: [
      "Stand with feet shoulder-width apart.",
      "Hinge and squat down, placing your hands flat on the floor inside your feet.",
      "Jump or step both feet back into a high plank position.",
      "Perform a push-up (or drop chest to floor), then jump feet forward back to your hands.",
      "Explode vertically into the air with hands reaching overhead, landing softly on mid-feet."
    ],
    sets: "3 Sets",
    repsOrDuration: "10 - 12 Reps",
    restPeriod: "60 seconds",
    beginnerModification: "Step-Back Burpee without push-up and without final jump.",
    advancedProgression: "Burpee with Tuck Jump or Single-Leg Burpees.",
    coachingCues: ["Land softly on toes/midfoot", "Keep core braced in plank", "Continuous smooth cadence"],
    gifUrl: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  bear_crawls: {
    id: "bear_crawls",
    name: "Bear Crawl Kinetic Hold & Steps",
    targetMuscles: ["Shoulders", "Core", "Quadriceps", "Serratus Anterior"],
    difficulty: "Intermediate",
    workoutType: "time",
    instructions: [
      "Start on all fours with hands under shoulders and knees directly under hips.",
      "Tuck your toes and hover your knees just 1 to 2 inches off the floor.",
      "Maintain a flat tabletop spine and take small, controlled steps forward (opposite hand and foot move together).",
      "Keep hips low and steady without rocking side to side."
    ],
    sets: "3 Sets",
    repsOrDuration: "30 - 45 Seconds",
    restPeriod: "45 seconds",
    beginnerModification: "Bear Plank Isometric Hold (hold static hover for 20-30 seconds).",
    advancedProgression: "Lateral Bear Crawls or Forward/Backward Continuous Crawls.",
    coachingCues: ["Knees stay 1 inch off floor", "Tabletop back", "Opposite hand and foot sync"],
    gifUrl: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  inchworms: {
    id: "inchworms",
    name: "Hand Walkout Inchworms",
    targetMuscles: ["Hamstrings", "Shoulders", "Core", "Wrist Mobility"],
    difficulty: "Beginner",
    workoutType: "reps",
    instructions: [
      "Stand tall with feet hip-width apart.",
      "Hinge at the hips and place hands on the floor in front of your toes.",
      "Walk hands forward one by one until you reach a high plank position.",
      "Pause 1 second in solid plank, then walk hands back toward feet and stand up."
    ],
    sets: "3 Sets",
    repsOrDuration: "8 - 10 Reps",
    restPeriod: "45 seconds",
    beginnerModification: "Bend knees slightly as you reach for the floor.",
    advancedProgression: "Add a push-up at the bottom of the inchworm.",
    coachingCues: ["Keep core braced", "Feel gentle hamstring stretch", "Walk hands with control"],
    gifUrl: "https://media.giphy.com/media/3o7TKUM3IgJBX2WGY8/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },

  // Mobility, Prehab & Cool-Down
  arm_circles: {
    id: "arm_circles",
    name: "Dynamic Deltoid & Scapular Arm Circles",
    targetMuscles: ["Rotator Cuff", "Deltoids", "Upper Back"],
    difficulty: "Beginner",
    workoutType: "time",
    instructions: [
      "Stand tall with feet shoulder-width apart, arms extended out to the sides at shoulder height.",
      "Make smooth circular rotations forward for half the time, then reverse direction.",
      "Keep core braced and shoulders down away from ears.",
      "Gradually increase circle diameter to open shoulder capsule."
    ],
    sets: "2 - 3 Sets",
    repsOrDuration: "30 - 45 Seconds",
    restPeriod: "20 seconds",
    beginnerModification: "Smaller diameter circles.",
    advancedProgression: "Forward and backward arm circles holding water bottles.",
    coachingCues: ["Chest proud", "Shoulders relaxed down", "Fluid rotation"],
    gifUrl: "https://media.giphy.com/media/l41lI4bYmcsPJX9Go/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  cat_cow_stretch: {
    id: "cat_cow_stretch",
    name: "Dynamic Cat-Cow Spinal Mobility",
    targetMuscles: ["Spine Flexors & Extensors", "Thoracic Spine", "Abdominals"],
    difficulty: "Beginner",
    workoutType: "reps",
    instructions: [
      "Start on hands and knees with wrists under shoulders and knees under hips.",
      "Inhale, arch your back, drop belly toward floor, and gaze gently upward (Cow pose).",
      "Exhale, round your spine toward the ceiling, tucking chin and pelvis (Cat pose).",
      "Flow smoothly between both positions in rhythm with your breathing."
    ],
    sets: "2 - 3 Sets",
    repsOrDuration: "10 - 12 Reps",
    restPeriod: "20 seconds",
    beginnerModification: "Gentle reduced range of spinal movement.",
    advancedProgression: "Add gentle lateral side bend into each spinal flex.",
    coachingCues: ["Sync motion with breath", "Articulate each vertebra", "Relax shoulders"],
    gifUrl: "https://media.giphy.com/media/26AHG5KGFxSkUWw1i/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  childs_pose: {
    id: "childs_pose",
    name: "Deep Restorative Child's Pose",
    targetMuscles: ["Lats", "Hips", "Lower Back", "Nervous System Reset"],
    difficulty: "Beginner",
    workoutType: "time",
    instructions: [
      "Kneel on the floor with big toes touching and knees spread comfortably wide.",
      "Sit your hips back onto your heels and fold your torso forward between your thighs.",
      "Reach your arms out long on the floor, resting forehead gently on the ground.",
      "Take deep, expanding breaths into your lower back and ribcage."
    ],
    sets: "2 Sets",
    repsOrDuration: "45 - 60 Seconds",
    restPeriod: "20 seconds",
    beginnerModification: "Place a pillow between calves and thighs if hips feel tight.",
    advancedProgression: "Walk hands diagonally to the right and left to stretch lats.",
    coachingCues: ["Breathe deep into belly", "Let hips sink into heels", "Relax neck and jaw"],
    gifUrl: "https://media.giphy.com/media/26AHG5KGFxSkUWw1i/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  cobra_stretch: {
    id: "cobra_stretch",
    name: "Prone Abdominal Cobra Stretch",
    targetMuscles: ["Abdominals", "Hip Flexors", "Chest Opener"],
    difficulty: "Beginner",
    workoutType: "time",
    instructions: [
      "Lie face down with legs extended and tops of feet on the floor.",
      "Place palms under your shoulders with elbows tucked close to torso.",
      "Gently press through hands to lift chest off the floor, keeping hips grounded.",
      "Roll shoulders back and hold the gentle stretch across your front torso."
    ],
    sets: "2 Sets",
    repsOrDuration: "30 - 45 Seconds",
    restPeriod: "20 seconds",
    beginnerModification: "Sphinx pose with forearms on floor.",
    advancedProgression: "Full extended arm upward facing dog.",
    coachingCues: ["Do not pinch lower back", "Open chest wide", "Gaze softly ahead"],
    gifUrl: "https://media.giphy.com/media/26AHG5KGFxSkUWw1i/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  standing_quad_stretch: {
    id: "standing_quad_stretch",
    name: "Standing Unilateral Quad Stretch",
    targetMuscles: ["Quadriceps", "Hip Flexors", "Ankle Balance"],
    difficulty: "Beginner",
    workoutType: "time",
    instructions: [
      "Stand tall near a wall for balance support.",
      "Bend right knee and grasp right ankle behind you with right hand.",
      "Gently draw heel toward right glute while keeping knees together and pelvis tucked.",
      "Hold for the duration, feeling front of thigh elongate, then switch legs."
    ],
    sets: "2 Sets",
    repsOrDuration: "30 - 45 Seconds (each leg)",
    restPeriod: "20 seconds",
    beginnerModification: "Use a towel wrapped around ankle if reaching foot is difficult.",
    advancedProgression: "No wall assist for balance challenge.",
    coachingCues: ["Keep knees side-by-side", "Tuck pelvis under", "Chest upright"],
    gifUrl: "https://media.giphy.com/media/u8946fAnhQ6cH9R16e/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  standing_oblique_crunches: {
    id: "standing_oblique_crunches",
    name: "Standing Knee-to-Elbow Oblique Crunches",
    targetMuscles: ["Obliques", "Hip Flexors", "Balance"],
    difficulty: "Beginner",
    workoutType: "reps",
    instructions: [
      "Stand with feet shoulder-width apart, hands behind head.",
      "Shift weight to left foot and drive right knee up and out to the side.",
      "Simultaneously crunch right elbow down toward right knee.",
      "Squeeze side abs at apex, return to start, and alternate."
    ],
    sets: "3 Sets",
    repsOrDuration: "16 - 20 Reps (8-10 per side)",
    restPeriod: "30 seconds",
    beginnerModification: "Lower knee lift height.",
    advancedProgression: "Fast tempo standing oblique march.",
    coachingCues: ["Crunch from ribcage", "Keep standing leg strong", "Exhale on crunch"],
    gifUrl: "https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  worlds_greatest_stretch: {
    id: "worlds_greatest_stretch",
    name: "World's Greatest Dynamic Lunge & Rotation",
    targetMuscles: ["Hips", "Thoracic Spine", "Hamstrings", "Groin"],
    difficulty: "Intermediate",
    workoutType: "reps",
    instructions: [
      "Step forward into a deep lunge with hands planted on floor inside front foot.",
      "Keep back knee elevated and drop inside elbow toward the floor.",
      "Rotate torso upward, extending arm toward the ceiling and following hand with gaze.",
      "Return hand to floor, switch legs, and repeat on other side."
    ],
    sets: "2 - 3 Sets",
    repsOrDuration: "8 - 10 Reps (4-5 per side)",
    restPeriod: "30 seconds",
    beginnerModification: "Back knee resting on the floor.",
    advancedProgression: "3-second rotation hold at top.",
    coachingCues: ["Drive back heel back", "Rotate through thoracic spine", "Breathe smoothly"],
    gifUrl: "https://media.giphy.com/media/u8946fAnhQ6cH9R16e/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  t_spine_rotations: {
    id: "t_spine_rotations",
    name: "Quadruped Thoracic Spine Rotations",
    targetMuscles: ["Thoracic Spine", "Upper Back", "Rotator Cuff"],
    difficulty: "Beginner",
    workoutType: "reps",
    instructions: [
      "Start on all fours with one hand behind head.",
      "Rotate elbow down toward opposite wrist.",
      "Then rotate elbow up toward ceiling, opening chest and following with gaze.",
      "Complete reps on one side before switching."
    ],
    sets: "2 - 3 Sets",
    repsOrDuration: "10 - 12 Reps (each side)",
    restPeriod: "20 seconds",
    beginnerModification: "Sit hips back on heels to isolate thoracic spine.",
    advancedProgression: "Full extended arm windmill rotation.",
    coachingCues: ["Keep lower back still", "Rotate through upper ribcage", "Exhale as you open"],
    gifUrl: "https://media.giphy.com/media/26AHG5KGFxSkUWw1i/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  }
};

// Daily motivational quotes
export const HOME_DAILY_QUOTES = [
  "Consistency is building your strength every single day. Trust the process.",
  "Your living room is your transformation arena. Zero equipment needed when you have iron focus.",
  "Small daily improvements over 180 days compound into life-changing results.",
  "Discipline is choosing what you want most over what you want right now.",
  "Every repetition performed at home is a deposit into your future vitality.",
  "Keep going. Your stamina, posture, and strength are evolving with every session.",
  "The secret of getting ahead is getting started, and you showed up today.",
  "No gym commute, no wasted time. Pure focused execution right at home.",
  "Nutrition and recovery are your superpower. Fuel your body with whole foods.",
  "Strength does not come from physical capacity alone. It comes from an indomitable will."
];

// Helper to attach section info to exercises
function attachSections(
  exercises: HomeExercise[],
  sectionConfigs: { id: string; title: string; description: string; count: number }[]
): { exercises: HomeExercise[]; sections: HomeWorkoutSection[] } {
  let currentIndex = 0;
  const sections: HomeWorkoutSection[] = [];
  const taggedExercises = [...exercises];

  for (const config of sectionConfigs) {
    const indices: number[] = [];
    const targetCount = config.count;
    for (let i = 0; i < targetCount && currentIndex < taggedExercises.length; i++) {
      indices.push(currentIndex);
      taggedExercises[currentIndex] = {
        ...taggedExercises[currentIndex],
        sectionId: config.id,
        sectionName: config.title
      };
      currentIndex++;
    }
    sections.push({
      id: config.id,
      title: config.title,
      description: config.description,
      exerciseIndices: indices
    });
  }

  // Any remaining exercises roll into the last section
  if (currentIndex < taggedExercises.length && sections.length > 0) {
    const lastSection = sections[sections.length - 1];
    while (currentIndex < taggedExercises.length) {
      lastSection.exerciseIndices.push(currentIndex);
      taggedExercises[currentIndex] = {
        ...taggedExercises[currentIndex],
        sectionId: lastSection.id,
        sectionName: lastSection.title
      };
      currentIndex++;
    }
  }

  return { exercises: taggedExercises, sections };
}

// Generates an exact, structured daily workout (10 to 15 exercises) for all 180 days
export function getHomeWorkoutForDay(dayNumber: number): HomeDailyWorkout {
  const day = Math.min(180, Math.max(1, dayNumber));

  // Determine Program Phase
  let phaseNumber: 1 | 2 | 3 | 4 = 1;
  let phaseName = HOME_PROGRAM_PHASES[0].name;
  if (day >= 131) {
    phaseNumber = 4;
    phaseName = HOME_PROGRAM_PHASES[3].name;
  } else if (day >= 76) {
    phaseNumber = 3;
    phaseName = HOME_PROGRAM_PHASES[2].name;
  } else if (day >= 31) {
    phaseNumber = 2;
    phaseName = HOME_PROGRAM_PHASES[1].name;
  }

  const quote = HOME_DAILY_QUOTES[(day - 1) % HOME_DAILY_QUOTES.length];
  const dayInWeek = ((day - 1) % 7) + 1; // 1 to 7

  // -------------------------------------------------------------------------
  // DAY 7 OF WEEK: ACTIVE RECOVERY, DECOMPRESSION & REPAIR (11 EXERCISES)
  // -------------------------------------------------------------------------
  if (dayInWeek === 7) {
    const rawList: HomeExercise[] = [
      // Section 1: Breath & Gentle Activation (3 movements)
      HOME_EXERCISES_CATALOG.cat_cow_stretch,
      HOME_EXERCISES_CATALOG.arm_circles,
      HOME_EXERCISES_CATALOG.t_spine_rotations,

      // Section 2: Core & Posterior Decompression (3 movements)
      HOME_EXERCISES_CATALOG.bird_dog,
      HOME_EXERCISES_CATALOG.dead_bug,
      HOME_EXERCISES_CATALOG.superman_holds,

      // Section 3: Pelvic & Glute Alignment (3 movements)
      HOME_EXERCISES_CATALOG.glute_bridges,
      HOME_EXERCISES_CATALOG.plank,
      HOME_EXERCISES_CATALOG.standing_quad_stretch,

      // Section 4: Deep Tissue Restoration (2 movements)
      HOME_EXERCISES_CATALOG.childs_pose,
      HOME_EXERCISES_CATALOG.cobra_stretch
    ];

    const { exercises, sections } = attachSections(rawList, [
      { id: "s1", title: "Activation & Joint Mobility", description: "Awaken joint lubrication and relieve spinal tightness.", count: 3 },
      { id: "s2", title: "Spinal & Core Decompression", description: "Gentle stabilizer recruitment without fatigue.", count: 3 },
      { id: "s3", title: "Pelvic & Lower Chain Reset", description: "Restore glute activation and hip flexor length.", count: 3 },
      { id: "s4", title: "Deep Restorative Release", description: "Parasympathetic breathing and full myofascial relaxation.", count: 2 }
    ]);

    return {
      dayNumber: day,
      phaseNumber,
      phaseName,
      title: `Day ${day}: Active Recovery & Joint Restoration`,
      focus: "Mobility Flow, Posture Decompression, Hydration & Weekly Reset",
      isRestDay: true,
      is5KmCardioDay: false,
      estimatedMinutes: 25,
      exercises,
      sections,
      motivationalQuote: `Day ${day} of 180: Recovery is where muscle fibers rebuild and nervous systems recharge. Take a relaxing walk, hydrate, and enjoy this restorative sequence!`
    };
  }

  // -------------------------------------------------------------------------
  // DAY 3 & 6 OF WEEK: 5 KM CARDIO & POST-CARDIO COMPLETE REST (WORKOUTS REMOVED)
  // -------------------------------------------------------------------------
  if (dayInWeek === 3 || dayInWeek === 6) {
    const isMidWeek = dayInWeek === 3;
    const cardioTitle = isMidWeek ? "Mid-Week 5 KM Cardio & Rest" : "Weekend 5 KM Cardio & Rest";

    const rawList: HomeExercise[] = [
      // Section 1: Gentle Warm-Up Before Cardio (2 movements)
      HOME_EXERCISES_CATALOG.step_jacks,
      HOME_EXERCISES_CATALOG.arm_circles,

      // Section 2: Post-Cardio Rest, Gentle Breath & Spinal Reset (2 movements)
      HOME_EXERCISES_CATALOG.childs_pose,
      HOME_EXERCISES_CATALOG.cat_cow_stretch
    ];

    const { exercises, sections } = attachSections(rawList, [
      { id: "s1", title: "Gentle Warm-Up", description: "Easy ankle and shoulder prep before logging your 5 KM cardio.", count: 2 },
      { id: "s2", title: "Post-Cardio Complete Rest & Recovery", description: "Workout removed entirely today. Rest your muscles completely, rehydrate, and recharge after the cardio session.", count: 2 }
    ]);

    return {
      dayNumber: day,
      phaseNumber,
      phaseName,
      title: `Day ${day}: ${cardioTitle}`,
      focus: "5 KM Run or Walk + Complete Post-Cardio Rest (Workouts Removed)",
      isRestDay: false,
      is5KmCardioDay: true,
      cardioTypeRecommended: day <= 60 ? "5 KM Walk" : "5 KM Run",
      estimatedMinutes: 45,
      exercises,
      sections,
      motivationalQuote: `Day ${day} of 180: Complete your 5 KM cardio session today. Calisthenics and strength workouts are removed entirely today so you can rest and recover fully after your cardio!`
    };
  }

  // -------------------------------------------------------------------------
  // DAY 1 OF WEEK: FULL BODY STRENGTH & KINETIC FOUNDATIONS (13 EXERCISES)
  // -------------------------------------------------------------------------
  if (dayInWeek === 1) {
    const rawList: HomeExercise[] = phaseNumber <= 2 ? [
      // Section 1: Activation & Dynamic Prep (3 movements)
      HOME_EXERCISES_CATALOG.jumping_jacks,
      HOME_EXERCISES_CATALOG.inchworms,
      HOME_EXERCISES_CATALOG.cat_cow_stretch,

      // Section 2: Primary Compound Strength (4 movements)
      HOME_EXERCISES_CATALOG.push_ups,
      HOME_EXERCISES_CATALOG.bodyweight_squats,
      HOME_EXERCISES_CATALOG.walking_lunges,
      HOME_EXERCISES_CATALOG.glute_bridges,

      // Section 3: Core Armor & Stability (3 movements)
      HOME_EXERCISES_CATALOG.plank,
      HOME_EXERCISES_CATALOG.mountain_climbers,
      HOME_EXERCISES_CATALOG.crunches,

      // Section 4: Stamina Finisher & Cool-Down (3 movements)
      HOME_EXERCISES_CATALOG.calf_raises,
      HOME_EXERCISES_CATALOG.superman_holds,
      HOME_EXERCISES_CATALOG.childs_pose
    ] : [
      // Advanced Phase 3 & 4 (13 movements)
      HOME_EXERCISES_CATALOG.jumping_jacks,
      HOME_EXERCISES_CATALOG.inchworms,
      HOME_EXERCISES_CATALOG.worlds_greatest_stretch,

      HOME_EXERCISES_CATALOG.burpees,
      HOME_EXERCISES_CATALOG.push_ups,
      HOME_EXERCISES_CATALOG.squat_jumps,
      HOME_EXERCISES_CATALOG.walking_lunges,

      HOME_EXERCISES_CATALOG.mountain_climbers,
      HOME_EXERCISES_CATALOG.shoulder_taps,
      HOME_EXERCISES_CATALOG.bicycle_crunches,

      HOME_EXERCISES_CATALOG.single_leg_glute_bridge,
      HOME_EXERCISES_CATALOG.superman_holds,
      HOME_EXERCISES_CATALOG.cobra_stretch
    ];

    const { exercises, sections } = attachSections(rawList, [
      { id: "s1", title: "Activation & Dynamic Prep", description: "Fire up the nervous system and warm up major joint capsules.", count: 3 },
      { id: "s2", title: "Primary Compound Strength", description: "High-yield full body bodyweight movements for muscle tone.", count: 4 },
      { id: "s3", title: "Core Armor & Conditioning", description: "Anti-rotational abdominal stability and metabolic tempo.", count: 3 },
      { id: "s4", title: "Stamina Finisher & Cooldown", description: "Postural balance, posterior chain work, and guided breathing.", count: 3 }
    ]);

    return {
      dayNumber: day,
      phaseNumber,
      phaseName,
      title: `Day ${day}: Full Body Strength & Kinetic Foundations`,
      focus: "Compound Bodyweight Strength, Balance & Kinetic Conditioning",
      isRestDay: false,
      is5KmCardioDay: false,
      estimatedMinutes: 36 + (phaseNumber * 3),
      exercises,
      sections,
      motivationalQuote: quote
    };
  }

  // -------------------------------------------------------------------------
  // DAY 2 OF WEEK: DEEP CORE ARMOR & POSTERIOR KINETIC CHAIN (13 EXERCISES)
  // -------------------------------------------------------------------------
  if (dayInWeek === 2) {
    const rawList: HomeExercise[] = phaseNumber <= 2 ? [
      // Section 1: Core Prep & Mobility (3 movements)
      HOME_EXERCISES_CATALOG.cat_cow_stretch,
      HOME_EXERCISES_CATALOG.dead_bug,
      HOME_EXERCISES_CATALOG.bird_dog,

      // Section 2: Anterior Abdominal Power (4 movements)
      HOME_EXERCISES_CATALOG.crunches,
      HOME_EXERCISES_CATALOG.leg_raises,
      HOME_EXERCISES_CATALOG.plank,
      HOME_EXERCISES_CATALOG.bicycle_crunches,

      // Section 3: Obliques & Anti-Rotation (3 movements)
      HOME_EXERCISES_CATALOG.side_plank,
      HOME_EXERCISES_CATALOG.russian_twists,
      HOME_EXERCISES_CATALOG.shoulder_taps,

      // Section 4: Posterior Chain & Lumbar Guard (3 movements)
      HOME_EXERCISES_CATALOG.glute_bridges,
      HOME_EXERCISES_CATALOG.superman_holds,
      HOME_EXERCISES_CATALOG.childs_pose
    ] : [
      // Advanced Core Routine (13 movements)
      HOME_EXERCISES_CATALOG.dead_bug,
      HOME_EXERCISES_CATALOG.t_spine_rotations,
      HOME_EXERCISES_CATALOG.bird_dog,

      HOME_EXERCISES_CATALOG.hollow_body_hold,
      HOME_EXERCISES_CATALOG.leg_raises,
      HOME_EXERCISES_CATALOG.bicycle_crunches,
      HOME_EXERCISES_CATALOG.flutter_kicks,

      HOME_EXERCISES_CATALOG.side_plank,
      HOME_EXERCISES_CATALOG.russian_twists,
      HOME_EXERCISES_CATALOG.cross_body_climbers,

      HOME_EXERCISES_CATALOG.single_leg_glute_bridge,
      HOME_EXERCISES_CATALOG.superman_holds,
      HOME_EXERCISES_CATALOG.cobra_stretch
    ];

    const { exercises, sections } = attachSections(rawList, [
      { id: "s1", title: "Deep Core Priming & Mobility", description: "Activate transverse abdominis and lumbar spinal integrity.", count: 3 },
      { id: "s2", title: "Anterior Core & Rectus Strength", description: "Target upper and lower abdominal fibers with controlled tempos.", count: 4 },
      { id: "s3", title: "Oblique Dynamics & Anti-Rotation", description: "Build lateral core stability, waist definition, and pelvic balance.", count: 3 },
      { id: "s4", title: "Posterior Chain Armor & Relief", description: "Strengthen lower back, glutes, and finish with decompressive reset.", count: 3 }
    ]);

    return {
      dayNumber: day,
      phaseNumber,
      phaseName,
      title: `Day ${day}: Deep Core Armor & Posterior Chain Protection`,
      focus: "Transverse Abdominis, Oblique Definition & Glute Stabilizers",
      isRestDay: false,
      is5KmCardioDay: false,
      estimatedMinutes: 34 + (phaseNumber * 3),
      exercises,
      sections,
      motivationalQuote: quote
    };
  }

  // -------------------------------------------------------------------------
  // DAY 4 OF WEEK: UPPER BODY CALISTHENICS & PUSH MASTERY (13 EXERCISES)
  // -------------------------------------------------------------------------
  if (dayInWeek === 4) {
    const rawList: HomeExercise[] = phaseNumber <= 2 ? [
      // Section 1: Shoulder & Scapular Prep (3 movements)
      HOME_EXERCISES_CATALOG.arm_circles,
      HOME_EXERCISES_CATALOG.inchworms,
      HOME_EXERCISES_CATALOG.t_spine_rotations,

      // Section 2: Primary Push & Chest Hypertrophy (4 movements)
      HOME_EXERCISES_CATALOG.push_ups,
      HOME_EXERCISES_CATALOG.incline_pushups,
      HOME_EXERCISES_CATALOG.pike_pushups,
      HOME_EXERCISES_CATALOG.tricep_dips,

      // Section 3: Kinetic Shoulder & Core Endurance (3 movements)
      HOME_EXERCISES_CATALOG.bear_crawls,
      HOME_EXERCISES_CATALOG.shoulder_taps,
      HOME_EXERCISES_CATALOG.mountain_climbers,

      // Section 4: Postural Finisher & Cool-Down (3 movements)
      HOME_EXERCISES_CATALOG.superman_holds,
      HOME_EXERCISES_CATALOG.plank,
      HOME_EXERCISES_CATALOG.childs_pose
    ] : [
      // Advanced Upper Body (13 movements)
      HOME_EXERCISES_CATALOG.arm_circles,
      HOME_EXERCISES_CATALOG.inchworms,
      HOME_EXERCISES_CATALOG.cat_cow_stretch,

      HOME_EXERCISES_CATALOG.push_ups,
      HOME_EXERCISES_CATALOG.diamond_pushups,
      HOME_EXERCISES_CATALOG.pike_pushups,
      HOME_EXERCISES_CATALOG.tempo_pushups,

      HOME_EXERCISES_CATALOG.tricep_dips,
      HOME_EXERCISES_CATALOG.bear_crawls,
      HOME_EXERCISES_CATALOG.burpees,

      HOME_EXERCISES_CATALOG.superman_holds,
      HOME_EXERCISES_CATALOG.side_plank,
      HOME_EXERCISES_CATALOG.childs_pose
    ];

    const { exercises, sections } = attachSections(rawList, [
      { id: "s1", title: "Rotator Cuff & Shoulder Mobility", description: "Lubricate shoulder sockets and prime scapular stabilizers.", count: 3 },
      { id: "s2", title: "Primary Push & Deltoid Block", description: "Build chest, shoulder, and tricep definition with bodyweight angles.", count: 4 },
      { id: "s3", title: "Kinetic Upper Body Conditioning", description: "Isometric holds, shoulder taps, and core endurance integration.", count: 3 },
      { id: "s4", title: "Posterior Finisher & Chest Opener", description: "Balance push volume with spinal extension and lat stretches.", count: 3 }
    ]);

    return {
      dayNumber: day,
      phaseNumber,
      phaseName,
      title: `Day ${day}: Upper Body Calisthenics & Push Mastery`,
      focus: "Chest Tone, Deltoid Strength, Triceps Power & Scapular Control",
      isRestDay: false,
      is5KmCardioDay: false,
      estimatedMinutes: 35 + (phaseNumber * 3),
      exercises,
      sections,
      motivationalQuote: quote
    };
  }

  // -------------------------------------------------------------------------
  // DAY 5 OF WEEK: LOWER BODY POWER & KINETIC STAMINA (13 EXERCISES)
  // -------------------------------------------------------------------------
  const rawList: HomeExercise[] = phaseNumber <= 2 ? [
    // Section 1: Hip & Ankle Dynamic Mobility (3 movements)
    HOME_EXERCISES_CATALOG.step_jacks,
    HOME_EXERCISES_CATALOG.butt_kicks,
    HOME_EXERCISES_CATALOG.worlds_greatest_stretch,

    // Section 2: Quad & Glute Compound Power (4 movements)
    HOME_EXERCISES_CATALOG.bodyweight_squats,
    HOME_EXERCISES_CATALOG.walking_lunges,
    HOME_EXERCISES_CATALOG.reverse_lunges,
    HOME_EXERCISES_CATALOG.glute_bridges,

    // Section 3: Isometric Stamina & Ankle Durability (3 movements)
    HOME_EXERCISES_CATALOG.wall_sits,
    HOME_EXERCISES_CATALOG.calf_raises,
    HOME_EXERCISES_CATALOG.high_knees,

    // Section 4: Unilateral Core & Cooldown (3 movements)
    HOME_EXERCISES_CATALOG.standing_oblique_crunches,
    HOME_EXERCISES_CATALOG.standing_quad_stretch,
    HOME_EXERCISES_CATALOG.childs_pose
  ] : [
    // Advanced Lower Body Routine (13 movements)
    HOME_EXERCISES_CATALOG.jumping_jacks,
    HOME_EXERCISES_CATALOG.butt_kicks,
    HOME_EXERCISES_CATALOG.worlds_greatest_stretch,

    HOME_EXERCISES_CATALOG.squat_jumps,
    HOME_EXERCISES_CATALOG.walking_lunges,
    HOME_EXERCISES_CATALOG.reverse_lunges,
    HOME_EXERCISES_CATALOG.bodyweight_squats,

    HOME_EXERCISES_CATALOG.skater_hops,
    HOME_EXERCISES_CATALOG.wall_sits,
    HOME_EXERCISES_CATALOG.single_leg_glute_bridge,

    HOME_EXERCISES_CATALOG.calf_raises,
    HOME_EXERCISES_CATALOG.standing_quad_stretch,
    HOME_EXERCISES_CATALOG.cobra_stretch
  ];

  const { exercises, sections } = attachSections(rawList, [
    { id: "s1", title: "Hip Mobility & Dynamic Activation", description: "Open adductors, prime quads, and elevate lower body blood flow.", count: 3 },
    { id: "s2", title: "Primary Leg & Glute Strength", description: "Compound bodyweight squats, lunges, and glute contractions.", count: 4 },
    { id: "s3", title: "Unilateral Stamina & Isometric Burn", description: "Wall sit holds, calf endurance, and athletic agility bounds.", count: 3 },
    { id: "s4", title: "Lower Chain Cooldown & Length", description: "Release tension in quads, hamstrings, and lower back.", count: 3 }
  ]);

  return {
    dayNumber: day,
    phaseNumber,
    phaseName,
    title: `Day ${day}: Lower Body Power & Kinetic Stamina`,
    focus: "Quadriceps, Glutes, Hamstring Definition & Unilateral Balance",
    isRestDay: false,
    is5KmCardioDay: false,
    estimatedMinutes: 35 + (phaseNumber * 3),
    exercises,
    sections,
    motivationalQuote: quote
  };
}

// Milestone Badges
export interface HomeMilestoneBadge {
  id: string;
  name: string;
  requirement: string;
  requiredDays: number;
  iconName: string;
  color: string;
}

export const HOME_MILESTONE_BADGES: HomeMilestoneBadge[] = [
  {
    id: "badge_first_step",
    name: "Ignition Spark",
    requirement: "Complete Day 1 Workout",
    requiredDays: 1,
    iconName: "Zap",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "badge_week_1",
    name: "Week 1 Master",
    requirement: "Complete 7 Days of Challenge",
    requiredDays: 7,
    iconName: "CheckCircle2",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: "badge_phase_1",
    name: "Foundations Champion",
    requirement: "Complete Phase 1 (Day 30)",
    requiredDays: 30,
    iconName: "Shield",
    color: "from-blue-600 to-indigo-600"
  },
  {
    id: "badge_day_60",
    name: "Habit Warrior",
    requirement: "Complete 60 Consecutive Days",
    requiredDays: 60,
    iconName: "Flame",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: "badge_phase_2",
    name: "Kinetic Definition",
    requirement: "Complete Phase 2 (Day 75)",
    requiredDays: 75,
    iconName: "Award",
    color: "from-orange-600 to-rose-600"
  },
  {
    id: "badge_day_90",
    name: "Halfway Immortal",
    requirement: "Reach 90 Days of Transformation",
    requiredDays: 90,
    iconName: "Crown",
    color: "from-rose-600 to-red-600"
  },
  {
    id: "badge_phase_3",
    name: "Conditioning Beast",
    requirement: "Complete Phase 3 (Day 130)",
    requiredDays: 130,
    iconName: "Zap",
    color: "from-purple-600 to-indigo-600"
  },
  {
    id: "badge_phase_4",
    name: "180 Day Sovereign Titan",
    requirement: "Complete the Entire 180 Day Challenge",
    requiredDays: 180,
    iconName: "Trophy",
    color: "from-amber-400 via-yellow-500 to-amber-600"
  }
];
