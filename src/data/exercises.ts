export interface Exercise {
  id: string;
  name: string;
  muscleGroups: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructions: string[];
  equipment: string[];
  category: string;
  categories: string[];
  commonMistakes: string[];
  safetyTips: string[];
  alternativeExercises: string[];
  progressionVariations: string[];
  isPremium: boolean;
  isCustom?: boolean;
  youtubeVideoId?: string;
  
  // Real Biomechanical coaching fields
  startingPosition: string;
  movementExecution: string;
  finishingPosition: string;
  regressionVariations: string[];
  musclesWorked: string[];
  gifUrl: string; // HD professional fitness loop / video url
  customMediaType?: "image" | "video";
  customMediaUrl?: string;
  description?: string;
  imageUrl?: string;
  duration?: string;
  tags?: string[];

  // Detailed Coaching Parameters
  breathingInstructions?: string;
  recommendedSetsReps?: string;
  benefits?: string[];
  trainingRecommendations?: string;

  // Curated Refactoring Fields
  bodyPart?: string;
  recommendedSets?: string;
  recommendedReps?: string;
  restTime?: string;
  caloriesBurned?: number;
  trainerTips?: string;
  safetyNotes?: string;
  variations?: string[];

  // ALEXFITNESSHUB Intelligent Program Categorization & Classification
  secondaryMuscles?: string[];
  exerciseType?: string;
  genderSuitability?: "Unisex" | "Women" | "Men";
  locationSuitability?: "Gym" | "Home" | "Both";
  goals?: string[];
  programAssignments?: string[];
  womenCategories?: string[];
  homeCategories?: string[];
  durationMinutes?: number;
}

export function getExerciseGifUrl(name: string = "", category: string = "", usedGifs?: Set<string>): string {
  return "";
}

export interface Program {
  id: string;
  name: string;
  category: "Home Workout Programs" | "Men's Programs" | "Women's Programs" | "Calisthenics Programs" | "Training Styles";
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  searchTags: string[];
  imageUrl: string;
  isPremium: boolean;
  schedule: {
    day: string;
    focus: string;
    exercises: string[]; // exercise names or IDs
    mealPlan?: string;  // Shred, Bulk, or Lean meal plans
  }[];
}

export const BACKUP_EXERCISE_MEDIA = {
  chest: "",
  back: "",
  shoulders: "",
  arms: "",
  core: "",
  legs: "",
  neck: "",
  cardio: "",
  mobility: ""
};

export const REAL_EXERCISE_MEDIA = {
  chest: "",
  back: "",
  shoulders: "",
  arms: "",
  core: "",
  legs: "",
  neck: "",
  cardio: "",
  mobility: ""
};

export function determineCategories(
  name: string,
  primary: string = "",
  secondary: string[] = [],
  equipment: string[] = [],
  difficulty: string = "Intermediate",
  originalCategories: string[] = []
): string[] {
  const cats: string[] = [];
  const nameL = (name || "").toLowerCase();
  const primaryL = (primary || "").toLowerCase();
  const secondaryL = (secondary || []).map(s => s.toLowerCase());
  const allMuscles = [primaryL, ...secondaryL];

  // Chest
  if (
    allMuscles.some(m => m.includes("chest") || m.includes("pectoral")) ||
    nameL.includes("bench press") ||
    nameL.includes("chest press") ||
    nameL.includes("pushup") ||
    nameL.includes("push up") ||
    nameL.includes("pec deck") ||
    nameL.includes("crossover") ||
    (nameL.includes("fly") && !nameL.includes("rear delt")) ||
    (nameL.includes("dip") && (nameL.includes("chest") || nameL === "dips"))
  ) {
    cats.push("Chest");
  }

  // Back & Lats
  if (
    allMuscles.some(m => m.includes("back") || m.includes("lat") || m.includes("traps") || m.includes("rhomboid")) ||
    (nameL.includes("row") && !nameL.includes("upright row") && !nameL.includes("rowing machine")) ||
    nameL.includes("pullup") ||
    nameL.includes("pull-up") ||
    nameL.includes("pull up") ||
    nameL.includes("pulldown") ||
    nameL.includes("deadlift") ||
    nameL.includes("latissimus")
  ) {
    cats.push("Back");
  }

  // Shoulders / Deltoids
  if (
    allMuscles.some(m => m.includes("shoulder") || m.includes("delt") || m.includes("trapezius")) ||
    nameL.includes("overhead press") ||
    nameL.includes("shoulder press") ||
    nameL.includes("military press") ||
    nameL.includes("arnold press") ||
    nameL.includes("lateral raise") ||
    nameL.includes("front raise") ||
    nameL.includes("rear delt") ||
    nameL.includes("face pull") ||
    nameL.includes("shrug")
  ) {
    cats.push("Shoulders");
  }

  // Biceps
  if (
    allMuscles.some(m => m.includes("bicep")) ||
    (nameL.includes("curl") && !nameL.includes("leg curl") && !nameL.includes("hamstring") && !nameL.includes("wrist"))
  ) {
    cats.push("Biceps");
  }

  // Triceps
  if (
    allMuscles.some(m => m.includes("tricep")) ||
    nameL.includes("pushdown") ||
    nameL.includes("skull crusher") ||
    nameL.includes("kickback") ||
    (nameL.includes("dip") && !nameL.includes("hip dip")) ||
    nameL.includes("close grip bench")
  ) {
    cats.push("Triceps");
  }

  // Legs, Quads, Hamstrings, Glutes, Calves
  if (
    allMuscles.some(m => m.includes("leg") || m.includes("quad") || m.includes("hamstring") || m.includes("glute") || m.includes("calf") || m.includes("calves")) ||
    nameL.includes("squat") ||
    nameL.includes("lunge") ||
    nameL.includes("leg press") ||
    nameL.includes("leg curl") ||
    nameL.includes("leg extension") ||
    nameL.includes("hip thrust") ||
    nameL.includes("glute bridge") ||
    nameL.includes("calf raise")
  ) {
    cats.push("Legs");
  }

  // Core & Abs
  if (
    allMuscles.some(m => m.includes("core") || m.includes("abs") || m.includes("oblique")) ||
    nameL.includes("plank") ||
    nameL.includes("crunch") ||
    nameL.includes("sit up") ||
    nameL.includes("situp") ||
    nameL.includes("leg raise") ||
    nameL.includes("russian twist") ||
    nameL.includes("dead bug")
  ) {
    cats.push("Core");
    cats.push("Abs");
  }

  // Cardio
  if (
    allMuscles.some(m => m.includes("cardio")) ||
    nameL.includes("run") ||
    nameL.includes("sprint") ||
    nameL.includes("walk") ||
    nameL.includes("jump rope") ||
    nameL.includes("hiit") ||
    nameL.includes("burpee") ||
    nameL.includes("jumping jack") ||
    nameL.includes("mountain climber")
  ) {
    cats.push("Cardio");
  }

  // Mobility
  if (
    allMuscles.some(m => m.includes("mobility") || m.includes("stretch")) ||
    nameL.includes("stretch") ||
    nameL.includes("mobility") ||
    nameL.includes("warmup") ||
    nameL.includes("warm up") ||
    nameL.includes("cooldown") ||
    nameL.includes("recovery")
  ) {
    cats.push("Mobility");
  }

  // Include difficulty
  if (difficulty) cats.push(difficulty);

  // Maintain original categories if present
  originalCategories.forEach(c => {
    if (c && !cats.includes(c)) cats.push(c);
  });

  return Array.from(new Set(cats));
}

// Pristine clean default: No legacy hardcoded exercises.
// All exercises are added by the Admin and dynamically persisted.
export const EXERCISES: Exercise[] = [];

export const PROGRAMS: Program[] = [
  {
    id: "beginner-muscle-building",
    name: "Beginner Muscle Building",
    category: "Men's Programs",
    description: "Construct a rock-solid foundation of muscular hypertrophy with controlled lifts. Perfect starting point for physical adaptation.",
    duration: "8 Weeks",
    difficulty: "Beginner",
    searchTags: ["beginner", "hypertrophy", "muscle building"],
    imageUrl: "",
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Horizontal Upper Push & Pull", exercises: [] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Zone 2 Kinetic Walking & Aerobic Flush", exercises: [] },
      { day: "Day 3", focus: "Glute & Lower Quad Stability", exercises: [] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Low-Impact Cardio Conditioning", exercises: [] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Outdoor Walking", exercises: [] }
    ]
  },
  {
    id: "advanced-hypertrophy",
    name: "Advanced Hypertrophy Mastery",
    category: "Training Styles",
    description: "Target peak muscular fiber failure through systematic progressive overload and dedicated volume.",
    duration: "12 Weeks",
    difficulty: "Advanced",
    searchTags: ["advanced", "hypertrophy", "bodybuilding"],
    imageUrl: "",
    isPremium: true,
    schedule: [
      { day: "Day 1", focus: "Chest & Triceps Overload", exercises: [] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Low-Impact Cardio & Incline Walk", exercises: [] },
      { day: "Day 3", focus: "Back & Biceps Thickness", exercises: [] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Zone 2 Kinetic Walking & Mobility Flush", exercises: [] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Walking & Metabolic Recovery", exercises: [] }
    ]
  },
  {
    id: "fat-loss",
    name: "Fat Loss Accelerator",
    category: "Home Workout Programs",
    description: "Melt fat fast using calorie-blasting compound bodyweight movements, metabolic intervals, and conditioning tracks.",
    duration: "6 Weeks",
    difficulty: "Beginner",
    searchTags: ["fat loss", "cardio", "shred"],
    imageUrl: "",
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Metabolic HIIT Blast", exercises: [] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Incline Walking & Aerobic Base", exercises: [] },
      { day: "Day 3", focus: "Low-Intensity Fat Burn", exercises: [] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Low-Impact Steady Cardio & Steps", exercises: [] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Outdoor Walking & Hip Decompression", exercises: [] }
    ]
  },
  {
    id: "strength",
    name: "Max Power Strength",
    category: "Training Styles",
    description: "Build raw neural strength on compound lifts using systematic powerlifting principles.",
    duration: "10 Weeks",
    difficulty: "Advanced",
    searchTags: ["strength", "power", "heavy"],
    imageUrl: "",
    isPremium: true,
    schedule: [
      { day: "Day 1", focus: "Posterior Chain Power", exercises: [] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Incline Walk & Parasympathetic Reset", exercises: [] },
      { day: "Day 3", focus: "Anterior Squat Drive", exercises: [] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Zone 2 Walking & Joint Flushing", exercises: [] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Walking & Hip Mobility", exercises: [] }
    ]
  },
  {
    id: "womens-fitness",
    name: "Women's Toning & Glute Lift",
    category: "Women's Programs",
    description: "Sculpt, tone, and build athletic curves with glute lifts, core stabilization, and full body conditioning.",
    duration: "6 Weeks",
    difficulty: "Beginner",
    searchTags: ["women", "toning", "glute lift"],
    imageUrl: "",
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Glute & Hamstring Lift", exercises: [] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Incline Treadmill Walk & Glute Flow", exercises: [] },
      { day: "Day 3", focus: "Core & Leg Definition", exercises: [] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Low-Impact Cardio & Core Reset", exercises: [] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Outdoor Walk & Hip Mobility", exercises: [] }
    ]
  },
  {
    id: "home-workouts",
    name: "Total Home Workouts",
    category: "Home Workout Programs",
    description: "Build muscle, burn fat, and stay active directly from your home with minimal or zero equipment.",
    duration: "4 Weeks",
    difficulty: "Beginner",
    searchTags: ["home", "no equipment", "dumbbells"],
    imageUrl: "",
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Full Body Fat Burn", exercises: [] },
      { day: "Day 2 (Recovery Day)", focus: "Active Recovery: Living Room Kinetic Walking & Mobility", exercises: [] },
      { day: "Day 3", focus: "Living Room Cardio", exercises: [] },
      { day: "Day 4 (Recovery Day)", focus: "Active Recovery: Zone 2 Step Walking & Low-Impact Flow", exercises: [] },
      { day: "Day 6 (Recovery Day)", focus: "Active Recovery: LISS Walking & Full Body Flush", exercises: [] }
    ]
  }
];

export const MUSCLE_GROUPS = [
  "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Forearms", "Legs", "Quadriceps", "Hamstrings", "Glutes", "Calves", "Core", "Abs", "Obliques", "Cardio", "Full Body", "Mobility"
];

export const WORKOUT_CATEGORIES = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Forearms",
  "Legs",
  "Glutes",
  "Core & Abs",
  "Cardio",
  "HIIT & Fat Burning",
  "Gym Workouts",
  "Home Workouts",
  "Calisthenics Workouts",
  "Military Style Fitness",
  "Women Confidence Program",
  "Stretching & Mobility",
  "Mobility & Recovery",
  "Full Body"
];

/**
 * Authentic Pre-Workout Dynamic Stretch & Mobility Workouts.
 * Every daily workout begins with 2 prescribed stretch workouts with full GIF demonstrations.
 * Fully editable and customizable by Admin.
 */
export const AUTHENTIC_STRETCH_EXERCISES: Exercise[] = [
  {
    id: "stretch-worlds-greatest",
    name: "World's Greatest Dynamic Stretch",
    category: "Stretching & Mobility",
    categories: ["Stretching & Mobility", "Mobility & Recovery", "Full Body"],
    muscleGroups: ["Hip Flexors", "Hamstrings", "Thoracic Spine", "Glutes"],
    difficulty: "Beginner",
    instructions: [
      "Step forward into a deep lunge with your back leg extended.",
      "Place both hands flat inside your front foot on the floor.",
      "Rotate your torso toward your front knee, reaching your top arm straight to the ceiling.",
      "Lower your hand, drive your hips up and back to briefly straighten both legs for a hamstring stretch.",
      "Switch sides and repeat with steady rhythmic breathing."
    ],
    equipment: ["Bodyweight"],
    commonMistakes: ["Rounding lower back", "Rushing the thoracic rotation"],
    safetyTips: ["Keep back knee cushioned if needed", "Move smoothly without bouncing"],
    alternativeExercises: ["Deep Kneeling Hip Flexor Stretch", "Downward Dog to Cobra Mobility Flow"],
    progressionVariations: ["Add deep elbow-to-instep drop"],
    regressionVariations: ["Kneeling lunge rotation"],
    startingPosition: "High plank or standing tall ready to lunge forward.",
    movementExecution: "Fluid dynamic rotation through hips, thoracic spine, and hamstrings.",
    finishingPosition: "Return to neutral athletic stance.",
    musclesWorked: ["Iliopsoas", "Hamstrings", "Thoracic Spine", "Gluteus Maximus"],
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/05/Worlds-Greatest-Stretch.gif",
    customMediaUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/05/Worlds-Greatest-Stretch.gif",
    duration: "60s Dynamic Flow",
    recommendedSets: "1",
    recommendedReps: "60s continuous",
    restTime: "15s transition",
    isPremium: false,
    isCustom: false,
    genderSuitability: "Unisex",
    locationSuitability: "Both"
  },
  {
    id: "stretch-cat-cow",
    name: "Cat-Cow Dynamic Spine & Core Stretch",
    category: "Stretching & Mobility",
    categories: ["Stretching & Mobility", "Core", "Mobility & Recovery"],
    muscleGroups: ["Spine", "Thoracic", "Core", "Lower Back"],
    difficulty: "Beginner",
    instructions: [
      "Start on all fours with wrists directly under shoulders and knees beneath hips.",
      "Inhale deeply: drop your belly toward the floor, tilt your pelvis up, and gently look up (Cow).",
      "Exhale slowly: tuck your chin, round your entire spine toward the ceiling, and scoop your abdominals (Cat).",
      "Flow continuously with your breath for 10-12 smooth cycles."
    ],
    equipment: ["Bodyweight", "Mat"],
    commonMistakes: ["Forcing excessive neck extension", "Bending elbows"],
    safetyTips: ["Avoid hyper-extending the lower back if sensitive"],
    alternativeExercises: ["Child's Pose with Lateral Lat Reach"],
    progressionVariations: ["Add lateral ribcage circles"],
    regressionVariations: ["Seated cat-cow on a chair"],
    startingPosition: "Quadruped tabletop position on mat.",
    movementExecution: "Vertebra-by-vertebra wave like articulation with rhythmic breathing.",
    finishingPosition: "Return to neutral spine tabletop.",
    musclesWorked: ["Spinal Erectors", "Rectus Abdominis", "Thoracolumbar Fascia"],
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/06/Cat-Cow-Stretch.gif",
    customMediaUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/06/Cat-Cow-Stretch.gif",
    duration: "60s Smooth Flow",
    recommendedSets: "1",
    recommendedReps: "10-12 cycles",
    restTime: "15s transition",
    isPremium: false,
    isCustom: false,
    genderSuitability: "Unisex",
    locationSuitability: "Both"
  },
  {
    id: "stretch-kneeling-hip-flexor",
    name: "Deep Kneeling Hip Flexor & Psoas Stretch",
    category: "Stretching & Mobility",
    categories: ["Stretching & Mobility", "Legs", "Mobility & Recovery"],
    muscleGroups: ["Hip Flexors", "Psoas", "Quadriceps", "Lower Back"],
    difficulty: "Beginner",
    instructions: [
      "Kneel on your left knee with your right foot flat on the floor in front, forming 90-degree angles.",
      "Gently tuck your pelvis under (posterior pelvic tilt) to lock the stretch into the hip flexor.",
      "Shift your hips forward slightly until you feel a deep stretch in the front of your left hip.",
      "Raise your left arm straight overhead and lean subtly to the right.",
      "Hold for 30-45 seconds, then switch legs."
    ],
    equipment: ["Bodyweight", "Mat"],
    commonMistakes: ["Arching lumbar spine instead of tucking pelvis", "Lurching too far forward"],
    safetyTips: ["Pad the kneeling knee with a mat or towel"],
    alternativeExercises: ["Standing Quadriceps Stretch", "World's Greatest Dynamic Stretch"],
    progressionVariations: ["Add gentle torso rotation toward front knee"],
    regressionVariations: ["Hold onto a stable wall or chair for balance"],
    startingPosition: "Half-kneeling 90/90 split stance.",
    movementExecution: "Squeeze trailing glute and posteriorly tilt pelvis with overhead reach.",
    finishingPosition: "Step back to kneeling and switch legs.",
    musclesWorked: ["Iliopsoas", "Rectus Femoris", "Tensor Fasciae Latae"],
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/05/Kneeling-Hip-Flexor-Stretch.gif",
    customMediaUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/05/Kneeling-Hip-Flexor-Stretch.gif",
    duration: "45s Each Leg",
    recommendedSets: "1",
    recommendedReps: "45s hold per side",
    restTime: "15s transition",
    isPremium: false,
    isCustom: false,
    genderSuitability: "Unisex",
    locationSuitability: "Both"
  },
  {
    id: "stretch-thread-needle",
    name: "Thoracic Thread the Needle Shoulder Opener",
    category: "Stretching & Mobility",
    categories: ["Stretching & Mobility", "Back", "Shoulders", "Mobility & Recovery"],
    muscleGroups: ["Thoracic Spine", "Upper Back", "Shoulders", "Rhomboids"],
    difficulty: "Beginner",
    instructions: [
      "Begin on hands and knees with your hands beneath shoulders.",
      "Slide your right arm under your chest and torso across the floor with palm facing up.",
      "Gently lower your right shoulder and temple to the floor, feeling the stretch across your upper back.",
      "Hold for 30-45 seconds while breathing deeply into your ribcage.",
      "Press back up and switch to the left arm."
    ],
    equipment: ["Bodyweight", "Mat"],
    commonMistakes: ["Twisting hips out of alignment", "Tensing neck muscles"],
    safetyTips: ["Rest cheek comfortably on mat or a folded towel"],
    alternativeExercises: ["Doorway Chest Stretch", "Standing Overhead Lat Stretch"],
    progressionVariations: ["Extend non-threading arm overhead along mat"],
    regressionVariations: ["Keep torso higher without lowering head all the way"],
    startingPosition: "Hands and knees tabletop on mat.",
    movementExecution: "Smooth rotational reach beneath torso with relaxed shoulder resting.",
    finishingPosition: "Press back to tabletop.",
    musclesWorked: ["Posterior Deltoid", "Rhomboids", "Middle Trapezius", "Thoracic Rotators"],
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/09/Thread-The-Needle.gif",
    customMediaUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/09/Thread-The-Needle.gif",
    duration: "45s Each Side",
    recommendedSets: "1",
    recommendedReps: "45s hold per side",
    restTime: "15s transition",
    isPremium: false,
    isCustom: false,
    genderSuitability: "Unisex",
    locationSuitability: "Both"
  },
  {
    id: "stretch-downward-dog-cobra",
    name: "Downward Dog to Cobra Dynamic Mobility Flow",
    category: "Stretching & Mobility",
    categories: ["Stretching & Mobility", "Full Body", "Mobility & Recovery"],
    muscleGroups: ["Calves", "Hamstrings", "Chest", "Spine", "Shoulders"],
    difficulty: "Beginner",
    instructions: [
      "From high plank, press your hands firmly into the floor and drive your hips up and back into Downward Dog.",
      "Pedal your heels toward the mat for 3 seconds to stretch calves and hamstrings.",
      "Roll forward smoothly through your spine into a plank, then lower hips toward floor into Cobra.",
      "Lift your chest, draw shoulder blades down and back, and lengthen your neck.",
      "Push back into Downward Dog and repeat for 6-8 continuous flows."
    ],
    equipment: ["Bodyweight", "Mat"],
    commonMistakes: ["Collapsing into lower back in Cobra", "Shrugging shoulders into ears"],
    safetyTips: ["Engage glutes lightly in Cobra to protect lumbar vertebrae"],
    alternativeExercises: ["Cat-Cow Dynamic Spine & Core Stretch"],
    progressionVariations: ["Full Upward Facing Dog with knees off mat"],
    regressionVariations: ["Baby Cobra on forearms (Sphinx Pose)"],
    startingPosition: "High pushup plank position.",
    movementExecution: "Rhythmic wave from inverted V Downward Dog to gentle anterior Cobra opening.",
    finishingPosition: "Return to plank or child's pose.",
    musclesWorked: ["Gastrocnemius", "Hamstrings", "Pectoralis Major", "Abdominal Wall"],
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2022/07/Downward-Facing-Dog.gif",
    customMediaUrl: "https://fitnessprogramer.com/wp-content/uploads/2022/07/Downward-Facing-Dog.gif",
    duration: "60s Dynamic Flow",
    recommendedSets: "1",
    recommendedReps: "6-8 flows",
    restTime: "15s transition",
    isPremium: false,
    isCustom: false,
    genderSuitability: "Unisex",
    locationSuitability: "Both"
  },
  {
    id: "stretch-overhead-lat-side-bend",
    name: "Standing Overhead Lat & Side Body Stretch",
    category: "Stretching & Mobility",
    categories: ["Stretching & Mobility", "Back", "Core", "Mobility & Recovery"],
    muscleGroups: ["Latissimus Dorsi", "Obliques", "Intercostals", "Shoulders"],
    difficulty: "Beginner",
    instructions: [
      "Stand tall with feet shoulder-width apart, interlace your fingers overhead with palms facing up.",
      "Inhale and reach as high as possible toward the ceiling, lengthening your spine.",
      "Exhale and gently side-bend your torso to the right, feeling the elongation all down your left lat and ribs.",
      "Hold for 3-5 deep breaths, return to center, and side-bend to the left."
    ],
    equipment: ["Bodyweight"],
    commonMistakes: ["Twisting torso forward or backward", "Holding breath"],
    safetyTips: ["Keep weight distributed evenly across both feet"],
    alternativeExercises: ["Child's Pose with Lateral Lat Reach"],
    progressionVariations: ["Cross trailing leg behind for increased fascia stretch"],
    regressionVariations: ["Seated side reach on a bench"],
    startingPosition: "Standing upright with neutral posture.",
    movementExecution: "Pure lateral flexion of torso with active axial reach.",
    finishingPosition: "Return to center standing tall.",
    musclesWorked: ["Latissimus Dorsi", "Internal & External Obliques", "Quadratus Lumborum"],
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2022/02/Side-Bend-Stretch.gif",
    customMediaUrl: "https://fitnessprogramer.com/wp-content/uploads/2022/02/Side-Bend-Stretch.gif",
    duration: "45s Each Side",
    recommendedSets: "1",
    recommendedReps: "45s per side",
    restTime: "15s transition",
    isPremium: false,
    isCustom: false,
    genderSuitability: "Unisex",
    locationSuitability: "Both"
  },
  {
    id: "stretch-glute-figure-4",
    name: "Supine Glute & Piriformis Figure-4 Stretch",
    category: "Stretching & Mobility",
    categories: ["Stretching & Mobility", "Legs", "Glutes", "Mobility & Recovery"],
    muscleGroups: ["Glutes", "Piriformis", "Hips", "Lower Back"],
    difficulty: "Beginner",
    instructions: [
      "Lie on your back with knees bent and feet flat on the floor.",
      "Cross your right ankle over your left knee, creating a figure-4 shape.",
      "Reach your hands through your legs to grasp behind your left hamstring.",
      "Gently draw your left knee toward your chest while keeping your right foot flexed.",
      "Hold for 45 seconds feeling the deep stretch in your right hip and glute, then switch sides."
    ],
    equipment: ["Bodyweight", "Mat"],
    commonMistakes: ["Lifting shoulders off mat", "Letting ankle sickle inward"],
    safetyTips: ["Keep flexed foot to stabilize knee joint"],
    alternativeExercises: ["Pigeon Pose with Diaphragmatic Breathing"],
    progressionVariations: ["Grasp front of shin instead of hamstring"],
    regressionVariations: ["Leave resting foot on a wall or chair"],
    startingPosition: "Supine lying flat on mat with bent knees.",
    movementExecution: "Gentle pull of thighs toward chest in figure-4 geometry.",
    finishingPosition: "Lower feet to floor and switch legs.",
    musclesWorked: ["Piriformis", "Gluteus Medius", "Deep Hip External Rotators"],
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2022/04/Figure-Four-Stretch.gif",
    customMediaUrl: "https://fitnessprogramer.com/wp-content/uploads/2022/04/Figure-Four-Stretch.gif",
    duration: "45s Each Leg",
    recommendedSets: "1",
    recommendedReps: "45s hold per side",
    restTime: "15s transition",
    isPremium: false,
    isCustom: false,
    genderSuitability: "Unisex",
    locationSuitability: "Both"
  },
  {
    id: "stretch-standing-quad",
    name: "Standing Quadriceps & Anterior Hip Stretch",
    category: "Stretching & Mobility",
    categories: ["Stretching & Mobility", "Legs", "Mobility & Recovery"],
    muscleGroups: ["Quadriceps", "Hip Flexors", "Patellar Tendon"],
    difficulty: "Beginner",
    instructions: [
      "Stand tall on your left leg. If needed, touch a wall or sturdy object for balance.",
      "Bend your right knee and grasp your right foot or ankle behind you with your right hand.",
      "Keep your knees touching and gently push your hips forward while drawing your heel toward your glute.",
      "Hold for 45 seconds maintaining a tall, upright torso, then switch sides."
    ],
    equipment: ["Bodyweight"],
    commonMistakes: ["Letting knee drift out to the side", "Excessive arching of lower back"],
    safetyTips: ["Do not pull foot so hard as to stress the knee joint"],
    alternativeExercises: ["Deep Kneeling Hip Flexor & Psoas Stretch"],
    progressionVariations: ["Reach opposite arm straight overhead"],
    regressionVariations: ["Side-lying quad stretch on mat"],
    startingPosition: "Standing upright with neutral posture.",
    movementExecution: "Knee flexion with slight hip extension and glute squeeze.",
    finishingPosition: "Release foot gently to floor and switch.",
    musclesWorked: ["Rectus Femoris", "Vastus Lateralis", "Vastus Medialis"],
    gifUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/05/Standing-Quad-Stretch.gif",
    customMediaUrl: "https://fitnessprogramer.com/wp-content/uploads/2021/05/Standing-Quad-Stretch.gif",
    duration: "45s Each Leg",
    recommendedSets: "1",
    recommendedReps: "45s hold per side",
    restTime: "15s transition",
    isPremium: false,
    isCustom: false,
    genderSuitability: "Unisex",
    locationSuitability: "Both"
  }
];
