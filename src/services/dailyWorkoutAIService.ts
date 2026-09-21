import { EXERCISES, Exercise, getExerciseGifUrl } from "../data/exercises";
import { getWorkoutForProgramAndDay, normalizeProgramId } from "../data/challengeEngineDatabase";
import {
  AIDailyWorkoutPlan,
  DailyWorkoutProgramType,
  DailyWorkoutExerciseItem,
  DailyWorkoutWarmupItem,
  DailyWorkoutCooldownItem,
  GenerateDailyWorkoutParams
} from "../types/dailyWorkout";

// ============================================================================
// 1. EXACT & FUZZY RESOLVER OVER THE 237 MASTER EXERCISES (METADATA ENRICHMENT ONLY)
// ============================================================================
export function findMatchingMasterExercise(
  name: string,
  categoryHint: string = ""
): Exercise | null {
  if (!name) return null;
  const cleanName = name.trim();
  const nameLower = cleanName.toLowerCase();
  const nameNorm = nameLower.replace(/[^a-z0-9]/g, "");

  // 1. Exact case-insensitive match
  let found = EXERCISES.find(e => e.name.toLowerCase().trim() === nameLower);
  if (found) return found;

  // 2. Normalized alphanumeric match
  found = EXERCISES.find(e => e.name.toLowerCase().replace(/[^a-z0-9]/g, "") === nameNorm);
  if (found) return found;

  // 3. Substring inclusion (high confidence only)
  found = EXERCISES.find(e => {
    const eNorm = e.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    return (nameNorm.length >= 7 && eNorm.includes(nameNorm)) || (eNorm.length >= 7 && nameNorm.includes(eNorm));
  });
  if (found) return found;

  // 4. Token overlap (strict: high overlap only)
  const words = nameLower.split(/\s+/).filter(w => w.length > 2 && !["and", "with", "the", "for", "set", "reps"].includes(w));
  let bestMatch: Exercise | null = null;
  let bestScore = 0;

  for (const ex of EXERCISES) {
    const exWords = ex.name.toLowerCase().split(/\s+/);
    let score = 0;
    for (const w of words) {
      if (exWords.includes(w)) score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = ex;
    }
  }

  if (bestScore >= 4 && bestMatch) return bestMatch;

  // NEVER return EXERCISES[0] or an unrelated category match!
  // Preserving null ensures the program schedule's prescribed exercise remains untouched.
  return null;
}

// ============================================================================
// 2. FILTER MASTER EXERCISES BY PROGRAM
// ============================================================================
export function get237ExercisesForProgram(programType: DailyWorkoutProgramType): Exercise[] {
  switch (programType) {
    case "immortal_90":
      return EXERCISES.filter(e =>
        e.programAssignments?.includes("90-days-immortal") ||
        e.category.includes("Gym") ||
        e.categories?.some(c => ["Chest", "Back", "Legs", "Shoulders", "Triceps", "Biceps"].includes(c))
      );
    case "women_confidence":
      return EXERCISES.filter(e =>
        e.categories?.includes("Women Confidence Program") ||
        e.categories?.includes("Women's Programs") ||
        e.categories?.some(c => ["Glutes", "Core", "Abs", "Legs", "Stretching"].includes(c)) ||
        e.category.includes("Women")
      );
    case "belly_fat_shred":
      return EXERCISES.filter(e =>
        e.categories?.some(c => ["Abs", "Core", "Obliques", "HIIT", "Cardio", "Full Body"].includes(c)) ||
        e.name.toLowerCase().includes("belly") ||
        e.name.toLowerCase().includes("plank") ||
        e.name.toLowerCase().includes("crunch") ||
        e.name.toLowerCase().includes("vacuum") ||
        e.name.toLowerCase().includes("mountain")
      );
    case "home_workout":
      return EXERCISES.filter(e =>
        e.categories?.includes("Home Workouts") ||
        e.equipment?.includes("Bodyweight") ||
        e.equipment?.includes("Resistance Band") ||
        e.equipment?.length === 0
      );
    case "lifestyle_academy":
      return EXERCISES.filter(e =>
        e.category.includes("Gym") ||
        e.categories?.includes("Full Body") ||
        e.difficulty === "Intermediate" ||
        e.difficulty === "Advanced"
      );
    case "cardio_calisthenics":
      return EXERCISES.filter(e =>
        e.categories?.some(c => ["Cardio", "Cardio Workouts", "Calisthenics Workouts", "Military Style Fitness", "HIIT", "Running"].includes(c))
      );
    case "gym_hypertrophy":
    default:
      return EXERCISES.filter(e => e.category.includes("Gym") || e.equipment.some(eq => ["Barbell", "Dumbbell", "Cable Machine"].includes(eq)));
  }
}

// Program display metadata helper
export const PROGRAM_METADATA_CONFIG: Record<
  DailyWorkoutProgramType,
  { name: string; badge: string; color: string; icon: string; defaultDays: number; defaultDuration: number; focusDescription: string }
> = {
  immortal_90: {
    name: "Immortal 90 Day Challenge",
    badge: "Flagship 90 Days",
    color: "from-amber-600 via-red-600 to-rose-700",
    icon: "Shield",
    defaultDays: 90,
    defaultDuration: 45,
    focusDescription: "Strict 7-day science-based muscle hypertrophy and 5-10km cardio cycle with progressive overload."
  },
  women_confidence: {
    name: "Women Confidence Program",
    badge: "180 Days Women",
    color: "from-pink-500 via-rose-600 to-purple-600",
    icon: "Sparkles",
    defaultDays: 180,
    defaultDuration: 35,
    focusDescription: "Glute activation & thrusts, transverse abdominis core vacuuming, waist trimming, and athletic female posture."
  },
  lifestyle_academy: {
    name: "Lifestyle Fitness Academy",
    badge: "12-Week Physique Splits",
    color: "from-blue-600 via-indigo-600 to-violet-700",
    icon: "BookOpen",
    defaultDays: 84,
    defaultDuration: 45,
    focusDescription: "Periodized bodybuilding splits, eccentric tempo tension, biomechanics mastery, and structural mobility."
  },
  home_workout: {
    name: "180-Day Home Workout Challenge",
    badge: "180 Days Home Mastery",
    color: "from-emerald-600 via-teal-600 to-cyan-700",
    icon: "Home",
    defaultDays: 180,
    defaultDuration: 30,
    focusDescription: "Calisthenics, zero-equipment levers, dynamic bodyweight density, and high-energy home conditioning."
  },
  belly_fat_shred: {
    name: "5-Month Belly Fat Shred System",
    badge: "5 Months Core & Melt",
    color: "from-orange-500 via-amber-600 to-red-600",
    icon: "Flame",
    defaultDays: 150,
    defaultDuration: 35,
    focusDescription: "Deep visceral fat mobilization, core armor conditioning, metabolic intervals, and abdominal vacuuming."
  },
  gym_hypertrophy: {
    name: "Gym Muscle Builder & Strength",
    badge: "PPL & Compound Power",
    color: "from-slate-800 via-zinc-800 to-stone-900",
    icon: "Dumbbell",
    defaultDays: 60,
    defaultDuration: 50,
    focusDescription: "Heavy barbell compound loading, cable flyes, row variations, and maximum muscle cross-section hypertrophy."
  },
  cardio_calisthenics: {
    name: "Cardio, Calisthenics & Military",
    badge: "Tactical Stamina",
    color: "from-emerald-700 via-lime-700 to-green-800",
    icon: "Zap",
    defaultDays: 60,
    defaultDuration: 40,
    focusDescription: "Explosive burpee complexes, pull-up cadences, jump rope intervals, and functional athletic endurance."
  },
  posture_vitality: {
    name: "Posture & Joint Vitality",
    badge: "Mobility & Alignment",
    color: "from-teal-600 via-cyan-600 to-sky-700",
    icon: "Heart",
    defaultDays: 30,
    defaultDuration: 25,
    focusDescription: "Thoracic spine extension, hip flexor release, glute medius stability, and restorative mobility flows."
  },
  custom: {
    name: "Custom AI Blueprint",
    badge: "Hyper-Personalized",
    color: "from-indigo-600 via-purple-600 to-pink-600",
    icon: "Sparkles",
    defaultDays: 30,
    defaultDuration: 45,
    focusDescription: "Direct AI synthesis calibrated to your exact target muscle, equipment constraints, and personal fitness goals."
  }
};

// ============================================================================
// 3. SCIENTIFIC CLINICAL LOCAL FALLBACK ENGINE (SCHEDULE-FIRST, NO RANDOM FALLBACK)
// ============================================================================
export function generateLocalFallbackDailyWorkout(
  params: GenerateDailyWorkoutParams
): AIDailyWorkoutPlan {
  const {
    programType = "immortal_90",
    dayNumber = 1,
    targetMuscle = "",
    fitnessLevel = "Intermediate",
    equipment = "All",
    duration = 45,
    customFocusPrompt = ""
  } = params;

  const safeDay = Math.max(1, Number(dayNumber) || 1);
  const config = PROGRAM_METADATA_CONFIG[programType] || PROGRAM_METADATA_CONFIG.immortal_90;

  const engineProgramId = normalizeProgramId(programType);

  let plan: any = null;
  try {
    plan = getWorkoutForProgramAndDay(engineProgramId as any, safeDay, targetMuscle);
  } catch (e) {
    console.warn("Could not query workout plan from database:", e);
  }

  const isRestDay = Boolean(plan?.meta?.isRestDay);
  const isCardioOnly = Boolean(plan?.meta?.isCardioOnly);

  // A. REST DAY HANDLING (Zero resistance exercises permitted)
  if (isRestDay) {
    return {
      id: `daily_workout_${programType}_d${safeDay}_rest`,
      title: plan?.meta?.title || `Day ${safeDay}: Rest & Active Recovery Protocol`,
      tagline: "Cellular Regeneration, CNS Decompression & Muscular Remodeling",
      programType,
      programName: config.name,
      dayNumber: safeDay,
      targetMuscles: ["Total Body Recovery", "Autonomic Nervous System"],
      fitnessLevel,
      equipmentRequired: ["None (Rest Day)"],
      estimatedMinutes: 0,
      estimatedCalories: "0 kcal",
      coachingBrief: plan?.meta?.coachingNotes || `Rest and active recovery day for Day ${safeDay}. Heavy training is suspended to allow complete myofibrillar protein synthesis, glycogen replenishment, and joint recovery.`,
      warmup: [],
      exercises: [],
      cooldown: [],
      guidelines: plan?.meta?.guidelines || [
        "Full rest day. Zero resistance weight training permitted.",
        "Prioritize 8 to 9 hours of restorative sleep.",
        "Hydrate with at least 3.5 Liters of water and electrolytes.",
        "Perform light walking or gentle mobility only if feeling muscular stiffness."
      ],
      nutritionTip: "Recovery Fuel: Maintain high protein intake (1.6-2.2g/kg) and anti-inflammatory whole foods to rebuild damaged muscle fibers.",
      hydrationTip: "Hydration Target: Drink at least 3.5 Liters of pure water today. Cellular hydration is required for muscle protein synthesis.",
      createdAt: new Date().toISOString(),
      isAiGenerated: false,
      isRestDay: true,
      isCardioOnly: false,
      missingExercises: false
    };
  }

  // B. CARDIO DAY HANDLING (Specific 5-10 KM distance, running & walking only, zero weight lifting)
  if (isCardioOnly) {
    const cardioDist = plan?.meta?.cardioDistance || "5 to 10 KM";
    const cardioExercises: DailyWorkoutExerciseItem[] = (plan?.exercises && plan.exercises.length > 0)
      ? plan.exercises.map((ex: any, idx: number) => {
          const matched = findMatchingMasterExercise(ex.exerciseName || ex.name, "Cardio");
          return {
            id: ex.id || `cardio_ex_${safeDay}_${idx + 1}`,
            name: ex.exerciseName || ex.name,
            sets: ex.sets || 1,
            reps: ex.reps || cardioDist,
            restSeconds: 0,
            tempo: "Continuous Zone 2 Cadence",
            coachingCues: (Array.isArray(ex.coachingCues) ? ex.coachingCues.join(". ") : ex.coachingCues) || "Maintain steady conversational rhythm (130-145 BPM). Smooth midfoot cadence.",
            targetMuscle: "Cardiovascular System",
            equipment: ["Running Shoes / Outdoors or Treadmill"],
            difficulty: "Intermediate",
            gifUrl: ex.gifUrl || getExerciseGifUrl("Treadmill Running", "Cardio"),
            instructions: ex.instructions || ["Warm up with 5 minutes of brisk walking.", `Execute ${cardioDist} at continuous aerobic pace.`, "Cool down with light walking and hip stretches."],
            matchedMasterExercise: matched || undefined
          };
        })
      : [
          {
            id: `cardio_d${safeDay}_run`,
            name: "Zone 2 Outdoor Running or Treadmill Jog",
            sets: 1,
            reps: cardioDist,
            restSeconds: 0,
            tempo: "Continuous Aerobic Cadence",
            coachingCues: "Keep heart rate steady at 130-145 BPM. Conversational pace without gasping.",
            targetMuscle: "Cardiovascular System",
            equipment: ["Running Shoes / Treadmill"],
            difficulty: "Intermediate",
            gifUrl: getExerciseGifUrl("Treadmill Running", "Cardio"),
            instructions: ["Warm up with 5 minutes of brisk walking.", `Run or jog continuously for ${cardioDist}.`, "Cool down with light walking."]
          }
        ];

    return {
      id: `daily_workout_${programType}_d${safeDay}_cardio`,
      title: plan?.meta?.title || `Day ${safeDay}: ${cardioDist} Cardio & Recovery Protocol`,
      tagline: "Aerobic Capacity, Mitochondrial Density & Accelerated Lipolysis",
      programType,
      programName: config.name,
      dayNumber: safeDay,
      targetMuscles: ["Cardiovascular System", "Aerobic Base", "Legs"],
      fitnessLevel,
      equipmentRequired: ["Running Shoes / Outdoors or Treadmill"],
      estimatedMinutes: 50,
      estimatedCalories: "450 - 650 kcal",
      coachingBrief: plan?.meta?.coachingNotes || `Target ${cardioDist} of continuous running or brisk walking at steady Zone 2 tempo. No weight lifting is permitted on pure cardio days.`,
      warmup: [
        {
          name: "Dynamic Ankle & Calves Circles",
          durationOrReps: "45 Seconds",
          instructions: "Prepare Achilles tendon and calves for running impact."
        },
        {
          name: "Walking Knee-to-Chest Hugs",
          durationOrReps: "60 Seconds",
          instructions: "Open gluteal chain and hip capsules prior to cardio cadence."
        }
      ],
      exercises: cardioExercises,
      cooldown: [
        {
          name: "Standing Quad & Hip Flexor Stretch",
          duration: "90 Seconds per side",
          instructions: "Release hip tension following continuous running."
        },
        {
          name: "Downward Dog Calf & Achilles Decompression",
          duration: "60 Seconds",
          instructions: "Decompress calves and hamstrings."
        }
      ],
      guidelines: plan?.meta?.guidelines || [
        `Target: ${cardioDist} continuous distance.`,
        "Strictly Cardio & Recovery. Zero resistance weight training.",
        "Hydrate before, during, and after the session."
      ],
      cardioDistance: cardioDist,
      nutritionTip: `Cardio Fuel: Sip 500ml electrolyte water during your ${cardioDist} and consume light carbohydrates post-run.`,
      hydrationTip: "Hydration Target: Drink at least 3.5 Liters of water today. Replace every liter of sweat with water and electrolytes.",
      createdAt: new Date().toISOString(),
      isAiGenerated: false,
      isRestDay: false,
      isCardioOnly: true,
      missingExercises: false
    };
  }

  // C. REGULAR TRAINING SPLIT
  const title = plan?.meta?.title || `${config.name} • Day ${safeDay}`;
  const tagline = plan?.meta?.category || config.focusDescription;
  const coachingBrief = plan?.meta?.coachingNotes || `Welcome to Day ${safeDay}. Coach Alex focus: prioritize controlled 3-second eccentric tempo, strict abdominal bracing, and relentless mind-muscle connection.`;
  const targetMusclesList = plan?.meta?.targetMuscles || (plan?.meta?.category ? [plan.meta.category] : [targetMuscle || "Prescribed Muscle Group"]);

  const rawExercises = plan?.exercises || [];

  // Strict check: if no approved exercises exist for this program day, DO NOT use random exercises!
  if (rawExercises.length === 0) {
    return {
      id: `daily_workout_${programType}_d${safeDay}_missing`,
      title,
      tagline,
      programType,
      programName: config.name,
      dayNumber: safeDay,
      targetMuscles: targetMusclesList,
      fitnessLevel,
      equipmentRequired: [equipment || "Gym Equipment"],
      estimatedMinutes: duration || config.defaultDuration,
      estimatedCalories: "380 - 480 kcal",
      coachingBrief,
      warmup: [],
      exercises: [],
      cooldown: [],
      missingExercises: true,
      message: `No approved exercises found for ${config.name} Day ${safeDay} (${plan?.meta?.category || targetMuscle || 'Prescribed'}). Admin must add approved exercises to the Workout Library.`,
      guidelines: [
        "The daily workout generator is configured to only display approved exercises for this exact program and category.",
        "Random exercises are strictly prevented from replacing missing exercises.",
        "Please notify the administrator to curate exercises for this scheduled slot in the Workout Library."
      ],
      nutritionTip: "Post-workout: Fuel with 30-40g high quality protein within 45 minutes.",
      hydrationTip: "Maintain 3.0+ Liters of daily hydration.",
      createdAt: new Date().toISOString(),
      isAiGenerated: false,
      isRestDay: false,
      isCardioOnly: false
    };
  }

  // Map only approved exercises for this exact program and category
  const exercises: DailyWorkoutExerciseItem[] = rawExercises.map((raw: any, idx: number) => {
    const rawName = raw.exerciseName || raw.name;
    const rawCat = raw.category || plan?.meta?.category || targetMuscle;
    const matched = findMatchingMasterExercise(rawName, rawCat);
    // Absolute source of truth: The program schedule's prescribed exercise name is strictly preserved
    const exName = rawName;
    const sets = typeof raw.sets === "number" ? raw.sets : (parseInt(String(raw.sets)) || 3);
    const reps = String(raw.reps || "10-12 reps");
    const rest = raw.restTime ? parseInt(String(raw.restTime)) : (raw.rest || 60);
    const gif = raw.gifUrl || (matched ? matched.gifUrl : getExerciseGifUrl(exName, rawCat));

    return {
      id: raw.id || `prog_${engineProgramId}_d${safeDay}_${idx + 1}`,
      name: exName,
      sets,
      reps,
      restSeconds: rest,
      tempo: raw.tempo || "3-0-1-0",
      coachingCues: raw.notes || (Array.isArray(raw.coachingCues) ? raw.coachingCues.join(". ") : raw.coachingCues) || matched?.movementExecution || "Brace your core, breathe rhythmically, control the eccentric return.",
      targetMuscle: raw.category || rawCat || matched?.musclesWorked?.[0] || "Target Muscle",
      equipment: raw.equipment ? [raw.equipment] : (matched?.equipment || [equipment || "Standard Equipment"]),
      difficulty: raw.difficulty || matched?.difficulty || (fitnessLevel as any) || "Intermediate",
      gifUrl: gif,
      instructions: Array.isArray(raw.instructions) ? raw.instructions : (matched?.instructions || [
        "Position yourself with balanced spinal alignment.",
        "Engage the target muscle group through full active range.",
        "Return smoothly under controlled eccentric tension."
      ]),
      startingPosition: matched?.startingPosition || "Position with feet shoulder-width apart, spine neutral and core braced.",
      movementExecution: matched?.movementExecution || "Initiate movement with primary muscle group, maintaining smooth continuous tempo.",
      finishingPosition: matched?.finishingPosition || "Complete full repetition without losing postural tension.",
      safetyTips: matched?.safetyTips || ["Do not hold your breath under exertion.", "Avoid excessive arching of lower back."],
      commonMistakes: matched?.commonMistakes || ["Using momentum to heave the load.", "Rushing through the lowering phase."],
      matchedMasterExercise: matched || undefined
    };
  });

  const warmup: DailyWorkoutWarmupItem[] = [
    {
      name: "Dynamic Arm Swings & Rotational Openers",
      durationOrReps: "60 Seconds",
      instructions: "Rotate arms forward and backward in wide arcs; twist torso gently side to side to unlock spine."
    },
    {
      name: "World's Greatest Stretch & Hip Opener",
      durationOrReps: "45 Seconds per side",
      instructions: "Deep lunge with elbow to instep, then rotate arm skyward to decompress hip flexors and mid-back."
    }
  ];

  const cooldown: DailyWorkoutCooldownItem[] = [
    {
      name: "Deep Diaphragmatic Box Breathing",
      duration: "2 Minutes",
      instructions: "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds to trigger parasympathetic recovery."
    },
    {
      name: "Target Muscle Static Lengthening",
      duration: "90 Seconds per side",
      instructions: "Gently stretch worked muscle groups under slow, deep diaphragmatic respiration."
    }
  ];

  const estimatedCalories =
    programType === "belly_fat_shred"
      ? "420 - 520 kcal"
      : programType === "immortal_90"
      ? "450 - 560 kcal"
      : programType === "women_confidence"
      ? "340 - 430 kcal"
      : "350 - 450 kcal";

  return {
    id: `daily_workout_${programType}_d${safeDay}_${Date.now()}`,
    title,
    tagline,
    programType,
    programName: config.name,
    dayNumber: safeDay,
    targetMuscles: targetMusclesList,
    fitnessLevel,
    equipmentRequired: [equipment || "Gym / Dumbbells / Bodyweight"],
    estimatedMinutes: duration || config.defaultDuration,
    estimatedCalories,
    coachingBrief,
    warmup,
    exercises,
    cooldown,
    guidelines: plan?.meta?.guidelines || [
      "Follow prescribed exercise order for optimal fatigue management.",
      "Execute each working set to 1-2 reps shy of muscular failure.",
      "Track loads to ensure progressive overload across weekly blocks."
    ],
    nutritionTip:
      programType === "belly_fat_shred"
        ? "Post-workout: Prioritize 30g lean protein with leafy greens. Drink 500ml water to flush lactic acid."
        : programType === "immortal_90"
        ? "Post-workout: Fuel with 35-40g high-leucine protein (chicken, egg whites or whey) and complex carbs within 60 minutes."
        : programType === "women_confidence"
        ? "Post-workout: Focus on recovery hydration with electrolytes and 25-30g protein for glute muscle rebuilding."
        : "Post-workout: Rehydrate with water and consume a balanced 3:1 carb-to-protein recovery meal.",
    hydrationTip: "Target 3.0 to 3.5 Liters of pure water today. Sip 250ml every 15 minutes during this session.",
    createdAt: new Date().toISOString(),
    isAiGenerated: false,
    missingExercises: false,
    isRestDay: false,
    isCardioOnly: false
  };
}

// ============================================================================
// 4. API CALL TO SERVER-SIDE GEMINI GENERATOR
// ============================================================================
export async function generateAIDailyWorkout(
  params: GenerateDailyWorkoutParams,
  idToken?: string | null
): Promise<AIDailyWorkoutPlan> {
  try {
    const response = await fetch("/api/gemini/generate-daily-workout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {})
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.success && data.workout) {
      const plan: AIDailyWorkoutPlan = data.workout;

      // Ensure every single exercise has the correct 237 master library GIF and data
      if (Array.isArray(plan.exercises)) {
        plan.exercises = plan.exercises.map((ex, idx) => {
          const matched = findMatchingMasterExercise(ex.name, ex.targetMuscle);
          return {
            ...ex,
            id: matched ? matched.id : ex.id || `ai_ex_${idx + 1}`,
            name: matched ? matched.name : ex.name,
            gifUrl: matched ? matched.gifUrl : ex.gifUrl || getExerciseGifUrl(ex.name, ex.targetMuscle),
            startingPosition: ex.startingPosition || matched?.startingPosition,
            movementExecution: ex.movementExecution || matched?.movementExecution,
            finishingPosition: ex.finishingPosition || matched?.finishingPosition,
            safetyTips: ex.safetyTips || matched?.safetyTips,
            commonMistakes: ex.commonMistakes || matched?.commonMistakes,
            equipment: matched?.equipment || ex.equipment || ["Bodyweight"],
            difficulty: matched?.difficulty || ex.difficulty || "Intermediate",
            matchedMasterExercise: matched || undefined
          };
        });
      }

      return plan;
    }

    throw new Error(data.error || "Empty AI response");
  } catch (err: any) {
    console.warn("AI Daily Workout API failed or offline, launching clinical local engine:", err);
    return generateLocalFallbackDailyWorkout(params);
  }
}
