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
  instructions: string[];
  sets: string;
  repsOrDuration: string;
  restPeriod: string;
  beginnerModification: string;
  advancedProgression: string;
  coachingCues: string[];
  gifUrl: string;
  equipment: "Zero Equipment (Bodyweight)";
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

// Core 0-Equipment Home Workout Exercise Catalog
export const HOME_EXERCISES_CATALOG: Record<string, HomeExercise> = {
  push_ups: {
    id: "push_ups",
    name: "Standard Push-Ups",
    targetMuscles: ["Chest", "Triceps", "Anterior Deltoids", "Core"],
    difficulty: "Beginner",
    instructions: [
      "Place your hands slightly wider than shoulder-width apart on the floor with fingers spread.",
      "Engage your glutes and core so your body forms a rigid, straight line from head to heels.",
      "Lower your chest until it is approximately 2 inches off the floor, keeping elbows tucked at a 45-degree angle.",
      "Press explosively through the palms to return to the starting position without arching your lower back."
    ],
    sets: "3 - 4 sets",
    repsOrDuration: "10 - 15 reps",
    restPeriod: "45 - 60 seconds",
    beginnerModification: "Incline Push-Ups (hands on a sturdy wall, counter, or sofa) or Knee Push-Ups.",
    advancedProgression: "Diamond Push-Ups, Tempo (3-sec eccentric) Push-Ups, or Archer Push-Ups.",
    coachingCues: ["Do not let hips sag", "Keep neck neutral", "Squeeze glutes throughout"],
    gifUrl: "https://media.giphy.com/media/3o84U6421O1IIXbowg/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  bodyweight_squats: {
    id: "bodyweight_squats",
    name: "Bodyweight Squats",
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Calves"],
    difficulty: "Beginner",
    instructions: [
      "Stand with feet shoulder-width apart, toes pointed slightly outward (15-20 degrees).",
      "Brace your core, hinge at the hips, and push your knees out as you lower down as if sitting into a chair.",
      "Descend until your hip crease drops below or parallel to your knees while maintaining an upright chest.",
      "Drive through your mid-foot and heels to stand back up, squeezing glutes at the top."
    ],
    sets: "3 - 4 sets",
    repsOrDuration: "15 - 20 reps",
    restPeriod: "45 seconds",
    beginnerModification: "Assisted Chair Squats (tap a chair behind you) or Box Squats.",
    advancedProgression: "Jump Squats, 1.5 Rep Squats, or Pistol Squats.",
    coachingCues: ["Keep heels glued to the floor", "Chest tall", "Knees track in line with toes"],
    gifUrl: "https://media.giphy.com/media/l41lI4bYmcsPJX9Go/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  glute_bridges: {
    id: "glute_bridges",
    name: "Floor Glute Bridges",
    targetMuscles: ["Gluteus Maximus", "Hamstrings", "Erector Spinae", "Core"],
    difficulty: "Beginner",
    instructions: [
      "Lie on your back with knees bent and feet flat on the floor, hip-width apart and roughly 8-10 inches from your hips.",
      "Press your arms flat along the floor for stabilization.",
      "Drive through your heels to raise your pelvis until thighs, hips, and torso form a straight diagonal.",
      "Pause for 2 seconds at the peak contraction, squeezing your glutes tightly before lowering slowly."
    ],
    sets: "3 sets",
    repsOrDuration: "15 - 20 reps",
    restPeriod: "30 - 45 seconds",
    beginnerModification: "Standard 2-Leg Glute Bridge with reduced range of motion.",
    advancedProgression: "Single-Leg Glute Bridges or 5-second peak isometric holds.",
    coachingCues: ["Do not hyperextend lower back", "Drive through heels", "Breathe out as you lift"],
    gifUrl: "https://media.giphy.com/media/26AHG5KGFxSkUWw1i/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  plank: {
    id: "plank",
    name: "Forearm Plank",
    targetMuscles: ["Transverse Abdominis", "Rectus Abdominis", "Shoulders", "Glutes"],
    difficulty: "Beginner",
    instructions: [
      "Place forearms on the floor with elbows directly under shoulders, forearms parallel.",
      "Extend legs behind you with toes planted, forming a straight rigid line from shoulders to heels.",
      "Engage your deep core by pulling your navel toward your spine, squeeze glutes, and push the floor away.",
      "Hold with steady diaphragmatic breathing without letting hips drop or rise."
    ],
    sets: "3 sets",
    repsOrDuration: "30 - 60 seconds",
    restPeriod: "45 seconds",
    beginnerModification: "Knee Plank or Incline Plank against a sturdy sofa.",
    advancedProgression: "Plank with Shoulder Taps or Body Saw Planks.",
    coachingCues: ["Do not hold breath", "Squeeze quads and glutes", "Gaze down at hands"],
    gifUrl: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  mountain_climbers: {
    id: "mountain_climbers",
    name: "Mountain Climbers",
    targetMuscles: ["Core", "Hip Flexors", "Shoulders", "Cardio System"],
    difficulty: "Beginner",
    instructions: [
      "Start in a high plank position with hands under shoulders and body straight.",
      "Drive your right knee up toward your chest without letting your hips pike into the air.",
      "Quickly step the right foot back and drive the left knee forward in a rhythmic running cadence.",
      "Maintain active core bracing and keep your shoulders locked over wrists throughout."
    ],
    sets: "3 sets",
    repsOrDuration: "30 - 45 seconds",
    restPeriod: "45 seconds",
    beginnerModification: "Elevated Hands Slow Climbers (hands on sofa, stepping one foot at a time).",
    advancedProgression: "Cross-Body Mountain Climbers or Double-Foot Hops.",
    coachingCues: ["Keep hips level with shoulders", "Quiet feet on landing", "Pump with controlled rhythm"],
    gifUrl: "https://media.giphy.com/media/26vUAAkP2u7BvI4uY/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  walking_lunges: {
    id: "walking_lunges",
    name: "Bodyweight Forward / Walking Lunges",
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Calves", "Balance"],
    difficulty: "Intermediate",
    instructions: [
      "Stand tall with feet hip-width apart and hands on hips or at chest level.",
      "Take a controlled step forward with your right leg, landing heel-first.",
      "Lower your body until both front and back knees form 90-degree angles, back knee hovering 1 inch off the floor.",
      "Drive through the front heel to stand up and either step forward into the next lunge or return to start."
    ],
    sets: "3 sets",
    repsOrDuration: "12 - 16 reps (6-8 per leg)",
    restPeriod: "45 - 60 seconds",
    beginnerModification: "Reverse Static Lunges holding a wall for balance.",
    advancedProgression: "Jumping Switch Lunges or Deficit Lunges.",
    coachingCues: ["Torso stays upright", "Front knee stays behind or over front toes", "Smooth deceleration"],
    gifUrl: "https://media.giphy.com/media/3oKIPcfXQIETynxKZ2/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  burpees: {
    id: "burpees",
    name: "Full Body Burpees",
    targetMuscles: ["Full Body", "Chest", "Legs", "Core", "Cardiovascular"],
    difficulty: "Intermediate",
    instructions: [
      "Stand with feet shoulder-width apart.",
      "Hinge and squat down, placing your hands flat on the floor inside your feet.",
      "Jump or step both feet back into a high plank position.",
      "Perform a push-up (or drop chest to floor), then jump feet forward back to your hands.",
      "Explode vertically into the air with hands reaching overhead, landing softly on mid-feet."
    ],
    sets: "3 sets",
    repsOrDuration: "8 - 12 reps",
    restPeriod: "60 seconds",
    beginnerModification: "Step-Back Burpee without push-up and without final jump.",
    advancedProgression: "Burpee with Tuck Jump or Single-Leg Burpees.",
    coachingCues: ["Land softly on toes/midfoot", "Keep core braced in plank", "Continuous smooth cadence"],
    gifUrl: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  crunches: {
    id: "crunches",
    name: "Controlled Abdominal Crunches",
    targetMuscles: ["Rectus Abdominis (Upper Abs)", "Obliques"],
    difficulty: "Beginner",
    instructions: [
      "Lie flat on your back with knees bent at 90 degrees and feet flat on the floor.",
      "Place fingertips gently behind your ears without pulling on your neck.",
      "Exhale forcefully as you peel your shoulder blades 3-4 inches off the floor by contracting your abs.",
      "Hold the peak squeeze for 1 second, then lower slowly with control."
    ],
    sets: "3 sets",
    repsOrDuration: "15 - 20 reps",
    restPeriod: "30 seconds",
    beginnerModification: "Reach-Through Crunches (sliding hands on thighs).",
    advancedProgression: "Bicycle Crunches or V-Ups.",
    coachingCues: ["Do not pull on head", "Gaze up at ceiling", "Breathe out on way up"],
    gifUrl: "https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  leg_raises: {
    id: "leg_raises",
    name: "Lying Lower Ab Leg Raises",
    targetMuscles: ["Lower Rectus Abdominis", "Hip Flexors", "Transverse Abdominis"],
    difficulty: "Beginner",
    instructions: [
      "Lie on your back with legs straight together and hands flat under your glutes for lumbar support.",
      "Press your lower back firmly into the floor so there is zero gap between your spine and the mat.",
      "Slowly raise your straight legs upward until they are perpendicular to the floor.",
      "Lower legs slowly until heels are 2 inches off the ground, pausing before the next rep."
    ],
    sets: "3 sets",
    repsOrDuration: "12 - 15 reps",
    restPeriod: "45 seconds",
    beginnerModification: "Bent-Knee Reverse Crunches or Alternating Heel Taps.",
    advancedProgression: "Dragon Flags or Hanging Leg Raises.",
    coachingCues: ["Lower back stays pinned down", "Control the downward speed", "Inhale as legs lower"],
    gifUrl: "https://media.giphy.com/media/3o7TKUM3IgJBX2WGY8/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  calf_raises: {
    id: "calf_raises",
    name: "Standing Bodyweight Calf Raises",
    targetMuscles: ["Gastrocnemius", "Soleus", "Ankle Stabilizers"],
    difficulty: "Beginner",
    instructions: [
      "Stand tall with feet hip-width apart near a wall for fingertip balance.",
      "Press firmly through the balls of both feet to elevate your heels as high as possible.",
      "Hold the peak contraction at the very top for 2 full seconds.",
      "Lower down slowly over a 3-second count until heels gently touch the ground."
    ],
    sets: "3 sets",
    repsOrDuration: "20 - 25 reps",
    restPeriod: "30 seconds",
    beginnerModification: "Seated Calf Raises with hands pushing on knees.",
    advancedProgression: "Single-Leg Elevated Deficit Calf Raises.",
    coachingCues: ["Full range of motion", "Do not bounce", "Squeeze calves at apex"],
    gifUrl: "https://media.giphy.com/media/3o7TKxOzWkgxIIMhrs/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  wall_sits: {
    id: "wall_sits",
    name: "Isometric Wall Sit",
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
    difficulty: "Beginner",
    instructions: [
      "Lean your back flat against a sturdy wall and slide down until your thighs are parallel to the floor.",
      "Position your knees directly above ankles at a 90-degree bend.",
      "Keep entire back and head pressed into the wall, hands resting on chest or straight out (not pushing on knees).",
      "Hold the position while breathing steadily through your nose."
    ],
    sets: "3 sets",
    repsOrDuration: "30 - 60 seconds",
    restPeriod: "45 seconds",
    beginnerModification: "High Wall Sit (45-degree knee angle rather than 90).",
    advancedProgression: "Single-Leg Wall Sit or Wall Sit with Heel Raises.",
    coachingCues: ["Weight through heels", "Keep knees tracking straight", "Stay calm and breathe"],
    gifUrl: "https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  high_knees: {
    id: "high_knees",
    name: "Cardio High Knees",
    targetMuscles: ["Hip Flexors", "Quadriceps", "Calves", "Cardiovascular"],
    difficulty: "Beginner",
    instructions: [
      "Stand tall with feet hip-width apart and arms bent at 90 degrees.",
      "Drive your right knee up to hip height while pumping your left arm forward.",
      "Quickly switch legs, landing softly on the balls of your feet in a rapid running motion.",
      "Maintain an upright posture with tight core engagement."
    ],
    sets: "3 sets",
    repsOrDuration: "30 - 45 seconds",
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
    instructions: [
      "Stand with feet together and arms resting at your sides.",
      "Jump your feet out shoulder-width apart while swinging your arms outward and overhead.",
      "Without pausing, jump back to the starting stance, lowering arms back down.",
      "Maintain a smooth, rhythmic cadence with light landings."
    ],
    sets: "3 sets",
    repsOrDuration: "45 - 60 seconds",
    restPeriod: "30 seconds",
    beginnerModification: "Step Jacks (step one foot out at a time without jumping).",
    advancedProgression: "Star Jumps or Plank Jacks.",
    coachingCues: ["Soft knees on landings", "Rhythmic breathing", "Full arm extension"],
    gifUrl: "https://media.giphy.com/media/l41lI4bYmcsPJX9Go/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  bear_crawls: {
    id: "bear_crawls",
    name: "Bear Crawl Kinetic Hold & Steps",
    targetMuscles: ["Shoulders", "Core", "Quadriceps", "Serratus Anterior"],
    difficulty: "Intermediate",
    instructions: [
      "Start on all fours with hands under shoulders and knees directly under hips.",
      "Tuck your toes and hover your knees just 1 to 2 inches off the floor.",
      "Maintain a flat tabletop spine and take small, controlled steps forward (opposite hand and foot move together).",
      "Keep hips low and steady without rocking side to side."
    ],
    sets: "3 sets",
    repsOrDuration: "30 - 45 seconds",
    restPeriod: "45 seconds",
    beginnerModification: "Bear Plank Isometric Hold (hold static hover for 20-30 seconds).",
    advancedProgression: "Lateral Bear Crawls or Forward/Backward Continuous Crawls.",
    coachingCues: ["Knees stay 1 inch off floor", "Tabletop back", "Opposite hand and foot sync"],
    gifUrl: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  pike_pushups: {
    id: "pike_pushups",
    name: "Pike Push-Ups",
    targetMuscles: ["Shoulders (Deltoids)", "Triceps", "Upper Chest", "Upper Back"],
    difficulty: "Intermediate",
    instructions: [
      "Start in a downward dog position with hips driven high into the air and hands shoulder-width apart.",
      "Lower your head forward between your hands by bending your elbows out at 45 degrees.",
      "Touch crown of head lightly toward the floor.",
      "Press through palms to return to the pike position, pushing head back through arms."
    ],
    sets: "3 sets",
    repsOrDuration: "8 - 12 reps",
    restPeriod: "60 seconds",
    beginnerModification: "Elevated Hands Pike Push-Up (hands on sofa or bench).",
    advancedProgression: "Feet-Elevated Pike Push-Ups or Wall Handstand Push-Ups.",
    coachingCues: ["Gaze toward feet", "Hips stay high in A-frame", "Control the descent"],
    gifUrl: "https://media.giphy.com/media/3o84U6421O1IIXbowg/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  bicycle_crunches: {
    id: "bicycle_crunches",
    name: "Bicycle Crunches",
    targetMuscles: ["Obliques", "Rectus Abdominis", "Hip Flexors"],
    difficulty: "Intermediate",
    instructions: [
      "Lie on back with hands behind head, shoulder blades elevated off floor, and knees at 90 degrees.",
      "Extend your right leg straight out while rotating your right elbow toward your left knee.",
      "Hold the contraction for 1 second, then smoothly alternate sides.",
      "Keep lower back flat and move with tempo rather than momentum."
    ],
    sets: "3 sets",
    repsOrDuration: "16 - 20 total reps (8-10 per side)",
    restPeriod: "45 seconds",
    beginnerModification: "Static Deadbug or Floor Alternating Knee-to-Elbow.",
    advancedProgression: "Slow 3-Second Isometric Hold Bicycles.",
    coachingCues: ["Rotate from ribcage not neck", "Keep extended leg hovering", "Smooth pedal rhythm"],
    gifUrl: "https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  },
  superman_holds: {
    id: "superman_holds",
    name: "Prone Superman Holds",
    targetMuscles: ["Lower Back", "Glutes", "Hamstrings", "Rear Delts"],
    difficulty: "Beginner",
    instructions: [
      "Lie face down on the floor with arms extended overhead and legs straight.",
      "Simultaneously lift your arms, chest, and legs 4-6 inches off the floor by squeezing your glutes and upper back.",
      "Hold the peak contraction for 2-3 seconds while keeping your neck neutral (gaze down).",
      "Lower smoothly and repeat."
    ],
    sets: "3 sets",
    repsOrDuration: "12 - 15 reps (or 3 x 30s holds)",
    restPeriod: "30 seconds",
    beginnerModification: "Alternating Prone Swimmers (opposite arm and leg lift).",
    advancedProgression: "Superman with Lat Pulldown Arm Squeeze.",
    coachingCues: ["Squeeze glutes tightly", "Do not jerk neck up", "Breathe smoothly at peak"],
    gifUrl: "https://media.giphy.com/media/26AHG5KGFxSkUWw1i/giphy.gif",
    equipment: "Zero Equipment (Bodyweight)"
  }
};

// Daily motivational and educational quotes
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

// Generator for all 180 Days of the Challenge
export function getHomeWorkoutForDay(dayNumber: number): HomeDailyWorkout {
  // Clamp day between 1 and 180
  const day = Math.min(180, Math.max(1, dayNumber));
  
  // Determine Phase
  let phaseNumber: 1 | 2 | 3 | 4 = 1;
  let phaseName = "Phase 1: Movement Foundations & Core Activation";
  if (day > 130) {
    phaseNumber = 4;
    phaseName = "Phase 4: Peak Transformation & Calisthenic Mastery";
  } else if (day > 75) {
    phaseNumber = 3;
    phaseName = "Phase 3: High-Output Conditioning & Core Power";
  } else if (day > 30) {
    phaseNumber = 2;
    phaseName = "Phase 2: Strength Endurance & Kinetic Definition";
  }

  // Determine Day in the 7-day weekly cycle (1 to 7)
  const dayInWeek = ((day - 1) % 7) + 1;
  
  // Weekly Structure:
  // Day 1: Full Body Strength & Foundations
  // Day 2: Core & Posterior Kinetic Chain
  // Day 3: 5 KM Cardio Session (5 KM Run or Walk) + Mobility Recovery
  // Day 4: Upper Body & Conditioning
  // Day 5: Lower Body & Kinetic Stamina
  // Day 6: 5 KM Cardio Session (5 KM Run or Walk) + Deep Stretch
  // Day 7: Active Recovery & Rest / Weekly Reset

  const quote = HOME_DAILY_QUOTES[(day - 1) % HOME_DAILY_QUOTES.length];

  if (dayInWeek === 7) {
    // Rest / Recovery Day
    return {
      dayNumber: day,
      phaseNumber,
      phaseName,
      title: `Day ${day}: Active Recovery & Joint Restoration`,
      focus: "Mobility, Hydration, Mental Reset & Weekly Calibration",
      isRestDay: true,
      is5KmCardioDay: false,
      estimatedMinutes: 20,
      exercises: [
        HOME_EXERCISES_CATALOG.superman_holds,
        HOME_EXERCISES_CATALOG.plank,
        HOME_EXERCISES_CATALOG.glute_bridges
      ],
      motivationalQuote: `Day ${day} of 180: Recovery is where muscle fibers rebuild and nervous systems recharge. Take a relaxing walk and hydrate!`
    };
  }

  if (dayInWeek === 3 || dayInWeek === 6) {
    // 5 KM Run/Walk Cardio Day
    const cardioLabel = dayInWeek === 3 ? "Mid-Week 5 KM Cardio Circuit" : "Weekend 5 KM Aerobic Milestone";
    return {
      dayNumber: day,
      phaseNumber,
      phaseName,
      title: `Day ${day}: ${cardioLabel}`,
      focus: "5 KM Run or 5 KM Walk + Core & Postural Stability",
      isRestDay: false,
      is5KmCardioDay: true,
      cardioTypeRecommended: day <= 60 ? "5 KM Walk" : "5 KM Run",
      estimatedMinutes: 45,
      exercises: [
        HOME_EXERCISES_CATALOG.plank,
        HOME_EXERCISES_CATALOG.glute_bridges,
        HOME_EXERCISES_CATALOG.calf_raises,
        HOME_EXERCISES_CATALOG.superman_holds
      ],
      motivationalQuote: `Day ${day} of 180: Complete your 5 KM Run or 5 KM Walk today. Cardiovascular endurance accelerates metabolic fat burn and mental toughness.`
    };
  }

  if (dayInWeek === 1) {
    // Day 1 of week: Full Body Strength
    const exList = phaseNumber === 1 ? [
      HOME_EXERCISES_CATALOG.push_ups,
      HOME_EXERCISES_CATALOG.bodyweight_squats,
      HOME_EXERCISES_CATALOG.glute_bridges,
      HOME_EXERCISES_CATALOG.plank,
      HOME_EXERCISES_CATALOG.jumping_jacks
    ] : phaseNumber === 2 ? [
      HOME_EXERCISES_CATALOG.push_ups,
      HOME_EXERCISES_CATALOG.walking_lunges,
      HOME_EXERCISES_CATALOG.bodyweight_squats,
      HOME_EXERCISES_CATALOG.mountain_climbers,
      HOME_EXERCISES_CATALOG.plank
    ] : phaseNumber === 3 ? [
      HOME_EXERCISES_CATALOG.burpees,
      HOME_EXERCISES_CATALOG.push_ups,
      HOME_EXERCISES_CATALOG.walking_lunges,
      HOME_EXERCISES_CATALOG.pike_pushups,
      HOME_EXERCISES_CATALOG.bicycle_crunches
    ] : [
      HOME_EXERCISES_CATALOG.burpees,
      HOME_EXERCISES_CATALOG.pike_pushups,
      HOME_EXERCISES_CATALOG.walking_lunges,
      HOME_EXERCISES_CATALOG.bear_crawls,
      HOME_EXERCISES_CATALOG.mountain_climbers,
      HOME_EXERCISES_CATALOG.plank
    ];

    return {
      dayNumber: day,
      phaseNumber,
      phaseName,
      title: `Day ${day}: Full Body Strength & Kinetic Foundations`,
      focus: "Compound Bodyweight Strength & Aerobic Conditioning",
      isRestDay: false,
      is5KmCardioDay: false,
      estimatedMinutes: 30 + (phaseNumber * 5),
      exercises: exList,
      motivationalQuote: quote
    };
  }

  if (dayInWeek === 2) {
    // Core & Posterior Chain
    const exList = phaseNumber <= 2 ? [
      HOME_EXERCISES_CATALOG.crunches,
      HOME_EXERCISES_CATALOG.leg_raises,
      HOME_EXERCISES_CATALOG.glute_bridges,
      HOME_EXERCISES_CATALOG.plank,
      HOME_EXERCISES_CATALOG.superman_holds
    ] : [
      HOME_EXERCISES_CATALOG.bicycle_crunches,
      HOME_EXERCISES_CATALOG.leg_raises,
      HOME_EXERCISES_CATALOG.mountain_climbers,
      HOME_EXERCISES_CATALOG.bear_crawls,
      HOME_EXERCISES_CATALOG.superman_holds
    ];

    return {
      dayNumber: day,
      phaseNumber,
      phaseName,
      title: `Day ${day}: Deep Core & Posterior Chain Armor`,
      focus: "Transverse Abdominis, Glute Stability & Lumbar Protection",
      isRestDay: false,
      is5KmCardioDay: false,
      estimatedMinutes: 28 + (phaseNumber * 4),
      exercises: exList,
      motivationalQuote: quote
    };
  }

  if (dayInWeek === 4) {
    // Upper Body & Calisthenics
    const exList = phaseNumber <= 2 ? [
      HOME_EXERCISES_CATALOG.push_ups,
      HOME_EXERCISES_CATALOG.bear_crawls,
      HOME_EXERCISES_CATALOG.plank,
      HOME_EXERCISES_CATALOG.superman_holds,
      HOME_EXERCISES_CATALOG.mountain_climbers
    ] : [
      HOME_EXERCISES_CATALOG.pike_pushups,
      HOME_EXERCISES_CATALOG.push_ups,
      HOME_EXERCISES_CATALOG.bear_crawls,
      HOME_EXERCISES_CATALOG.burpees,
      HOME_EXERCISES_CATALOG.plank
    ];

    return {
      dayNumber: day,
      phaseNumber,
      phaseName,
      title: `Day ${day}: Upper Body Calisthenics & Push Mastery`,
      focus: "Chest, Deltoids, Triceps & Scapular Control",
      isRestDay: false,
      is5KmCardioDay: false,
      estimatedMinutes: 30 + (phaseNumber * 4),
      exercises: exList,
      motivationalQuote: quote
    };
  }

  // DayInWeek === 5: Lower Body & Conditioning
  const exList = phaseNumber <= 2 ? [
    HOME_EXERCISES_CATALOG.bodyweight_squats,
    HOME_EXERCISES_CATALOG.walking_lunges,
    HOME_EXERCISES_CATALOG.wall_sits,
    HOME_EXERCISES_CATALOG.glute_bridges,
    HOME_EXERCISES_CATALOG.calf_raises
  ] : [
    HOME_EXERCISES_CATALOG.walking_lunges,
    HOME_EXERCISES_CATALOG.bodyweight_squats,
    HOME_EXERCISES_CATALOG.high_knees,
    HOME_EXERCISES_CATALOG.wall_sits,
    HOME_EXERCISES_CATALOG.calf_raises,
    HOME_EXERCISES_CATALOG.burpees
  ];

  return {
    dayNumber: day,
    phaseNumber,
    phaseName,
    title: `Day ${day}: Lower Body Power & Kinetic Stamina`,
    focus: "Quadriceps, Glutes, Hamstrings & Unilateral Balance",
    isRestDay: false,
    is5KmCardioDay: false,
    estimatedMinutes: 32 + (phaseNumber * 4),
    exercises: exList,
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
