import { EXERCISES, Exercise, getExerciseGifUrl } from "../data/exercises";
import { getWorkoutForProgramAndDay } from "../data/challengeEngineDatabase";
import {
  AIDailyWorkoutPlan,
  DailyWorkoutProgramType,
  DailyWorkoutExerciseItem,
  DailyWorkoutWarmupItem,
  DailyWorkoutCooldownItem,
  GenerateDailyWorkoutParams
} from "../types/dailyWorkout";

// ============================================================================
// 1. EXACT & FUZZY RESOLVER OVER THE 237 MASTER EXERCISES
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

  // 3. Substring inclusion
  found = EXERCISES.find(e => {
    const eNorm = e.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    return eNorm.includes(nameNorm) || (nameNorm.length > 5 && nameNorm.includes(eNorm));
  });
  if (found) return found;

  // 4. Token overlap
  const words = nameLower.split(/\s+/).filter(w => w.length > 2 && !["and", "with", "the", "for"].includes(w));
  let bestMatch: Exercise | null = null;
  let bestScore = 0;

  for (const ex of EXERCISES) {
    const exWords = ex.name.toLowerCase().split(/\s+/);
    let score = 0;
    for (const w of words) {
      if (exWords.includes(w)) score += 2;
      else if (exWords.some(ew => ew.includes(w) || w.includes(ew))) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = ex;
    }
  }

  if (bestScore >= 2 && bestMatch) return bestMatch;

  // 5. Category hint fallback
  if (categoryHint) {
    const catLower = categoryHint.toLowerCase();
    const catMatch = EXERCISES.find(e =>
      e.category.toLowerCase().includes(catLower) ||
      e.categories?.some(c => c.toLowerCase().includes(catLower)) ||
      e.muscleGroups?.some(m => m.toLowerCase().includes(catLower))
    );
    if (catMatch) return catMatch;
  }

  // 6. Return first exercise in library rather than broken entry
  return EXERCISES[0] || null;
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
// 3. SCIENTIFIC CLINICAL LOCAL FALLBACK ENGINE
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

  let title = `${config.name} • Day ${safeDay}`;
  let tagline = config.focusDescription;
  let coachingBrief = `Welcome to Day ${safeDay}. Coach Alex focus: prioritize controlled 3-second eccentric tempo, strict breathing, and relentless mind-muscle connection.`;
  let targetMusclesList = [targetMuscle || "Full Body"];
  let rawExercises: { name: string; sets?: number; reps?: string | number; rest?: number; notes?: string; targetMuscle?: string }[] = [];

  // Check if program maps to challengeEngineDatabase
  if (
    programType === "immortal_90" ||
    programType === "women_confidence" ||
    programType === "belly_fat_shred" ||
    programType === "home_workout" ||
    programType === "posture_vitality"
  ) {
    const engineProgramId =
      programType === "home_workout"
        ? "home_180"
        : (programType as any);

    try {
      const plan = getWorkoutForProgramAndDay(engineProgramId, safeDay);
      if (plan && plan.exercises && plan.exercises.length > 0) {
        title = plan.meta.title || title;
        tagline = plan.meta.category || tagline;
        coachingBrief = plan.meta.coachingNotes || coachingBrief;
        targetMusclesList = [plan.meta.category || "Full Body"];

        rawExercises = plan.exercises.map(ex => ({
          name: ex.exerciseName || (ex as any).name,
          sets: typeof ex.sets === "number" ? ex.sets : parseInt(String(ex.sets)) || 3,
          reps: String(ex.reps || "10-12 reps"),
          rest: ex.restTime ? parseInt(ex.restTime) : 60,
          notes: (Array.isArray(ex.coachingCues) ? ex.coachingCues.join(" ") : (ex as any).coachingCues) || (ex as any).notes || "Maintain rigid core alignment and slow negative.",
          targetMuscle: ex.category || plan.meta.category
        }));
      }
    } catch (e) {
      console.warn("Fallback to program exercise pool:", e);
    }
  }

  // If no rawExercises yet (e.g. custom or academy), pull from 237 master pool
  if (rawExercises.length === 0) {
    const pool = get237ExercisesForProgram(programType);
    let filtered = pool;

    if (targetMuscle) {
      const tLower = targetMuscle.toLowerCase();
      const matched = pool.filter(e =>
        e.name.toLowerCase().includes(tLower) ||
        e.category.toLowerCase().includes(tLower) ||
        e.categories?.some(c => c.toLowerCase().includes(tLower)) ||
        e.muscleGroups?.some(m => m.toLowerCase().includes(tLower))
      );
      if (matched.length >= 3) filtered = matched;
    }

    // Pick up to 12 exercises deterministically based on dayNumber
    const count = Math.min(12, filtered.length);
    for (let i = 0; i < count; i++) {
      const index = (safeDay * 2 + i) % filtered.length;
      const ex = filtered[index];
      rawExercises.push({
        name: ex.name,
        sets: fitnessLevel === "Advanced" || fitnessLevel === "Immortal" ? 4 : 3,
        reps: ex.category.includes("Cardio") || ex.categories?.includes("Abs") ? "15-20 reps" : "10-12 reps",
        rest: 60,
        notes: ex.movementExecution || "Focus on peak contraction at apex of movement.",
        targetMuscle: ex.musclesWorked?.[0] || ex.muscleGroups?.[0] || "Target Muscle"
      });
    }
  }

  // Format into DailyWorkoutExerciseItem with 100% genuine GIFs and coaching fields
  const exercises: DailyWorkoutExerciseItem[] = rawExercises.map((raw, idx) => {
    const matched = findMatchingMasterExercise(raw.name, raw.targetMuscle || targetMuscle);
    const exName = matched ? matched.name : raw.name;
    const sets = raw.sets || (fitnessLevel === "Advanced" ? 4 : 3);
    const reps = raw.reps || "10-12 reps";
    const rest = raw.rest || 60;
    const gif = matched ? matched.gifUrl : getExerciseGifUrl(exName, raw.targetMuscle);

    return {
      id: matched ? matched.id : `gen_ex_${safeDay}_${idx + 1}`,
      name: exName,
      sets,
      reps,
      restSeconds: rest,
      tempo: "3-0-1-0",
      coachingCues: raw.notes || matched?.movementExecution || "Brace your core, breathe rhythmically, control the eccentric return.",
      targetMuscle: raw.targetMuscle || matched?.musclesWorked?.[0] || matched?.muscleGroups?.[0] || "Target Muscle",
      equipment: matched?.equipment || [equipment || "Bodyweight"],
      difficulty: matched?.difficulty || (fitnessLevel as any) || "Intermediate",
      gifUrl: gif,
      instructions: matched?.instructions || [
        "Position yourself with balanced spinal alignment.",
        "Engage the target muscle group through full active range.",
        "Return smoothly under controlled eccentric tension."
      ],
      startingPosition: matched?.startingPosition || "Position with feet shoulder-width apart, spine neutral and core braced.",
      movementExecution: matched?.movementExecution || "Initiate movement with primary muscle group, maintaining smooth continuous tempo.",
      finishingPosition: matched?.finishingPosition || "Complete full repetition without losing postural tension.",
      safetyTips: matched?.safetyTips || ["Do not hold your breath under exertion.", "Avoid excessive arching of lower back."],
      commonMistakes: matched?.commonMistakes || ["Using momentum to heave the load.", "Rushing through the lowering phase."],
      matchedMasterExercise: matched || undefined
    };
  });

  // Dynamic Warmup
  const warmup: DailyWorkoutWarmupItem[] = [
    {
      name: "Arm Circles & Thoracic Rotations",
      durationOrReps: "60 Seconds",
      instructions: "Rotate arms forward and backward in wide arcs; twist torso gently side to side to unlock spine.",
      gifUrl: "https://media.giphy.com/media/l41lO3n0m50K1oQ52/giphy.gif"
    },
    {
      name: "World's Greatest Stretch & Hip Opener",
      durationOrReps: "45 Seconds per side",
      instructions: "Deep lunge with elbow to instep, then rotate arm skyward to decompress hip flexors and mid-back.",
      gifUrl: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif"
    },
    {
      name: "Jumping Jacks & Glute Bridges",
      durationOrReps: "60 Seconds",
      instructions: "Elevate systemic heart rate and activate glute firing prior to loaded resistance sets.",
      gifUrl: "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif"
    }
  ];

  // Dynamic Cooldown
  const cooldown: DailyWorkoutCooldownItem[] = [
    {
      name: "Deep Diaphragmatic Box Breathing",
      duration: "2 Minutes",
      instructions: "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds to trigger parasympathetic recovery.",
      gifUrl: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif"
    },
    {
      name: "Couch Stretch & Hamstring Release",
      duration: "90 Seconds per side",
      instructions: "Knee against wall or bench, drive hips forward to lengthen tight hip flexors and quadriceps.",
      gifUrl: "https://media.giphy.com/media/l41lO3n0m50K1oQ52/giphy.gif"
    },
    {
      name: "Child's Pose Lat Reach",
      duration: "60 Seconds",
      instructions: "Sit hips onto heels, extend arms forward and walk hands slightly to each side to stretch latissimus dorsi.",
      gifUrl: "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif"
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
    isFallback: true
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
