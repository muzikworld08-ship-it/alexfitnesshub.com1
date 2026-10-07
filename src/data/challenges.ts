import { Exercise, EXERCISES, getExerciseGifUrl } from "./exercises";
import { ChallengeItem, ChallengeWorkout } from "../types";
import { isHomeEligibleExercise } from "../utils/dynamicWorkoutEngine";

export interface PremiumChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  goal: string;
  image: string;
  badgeId: string;
  badgeName: string;
  badgeColor: string;
  durationDays?: number;
  isPremium?: boolean;
  workouts?: ChallengeWorkout[];
  createdAt?: string;
  createdBy?: string;
  isCustom?: boolean;
}

export const FLAGSHIP_CHALLENGES: PremiumChallenge[] = [
  {
    id: "immortal_90",
    title: "90 Immortal Challenge",
    description: "Target: Men. Strict 7-day cyclical split repeating continuously across all 90 days: Monday: Push (Chest, shoulders and triceps), Tuesday: Pull (Back, rear delts and biceps), Wednesday: Legs + Core (Quads, hamstrings, glutes, calves and abs), Thursday: Cardio + Mobility (Running, conditioning and mobility), Friday: Upper Body (Chest, back, shoulders and arms), Saturday: Athletic Conditioning + Core (Functional movements, conditioning and abdominal work), Sunday: Recovery.",
    category: "Hypertrophy & Conditioning",
    goal: "Transform full-body power, muscular density, aerobic endurance, and unbreakable physical discipline.",
    image: getExerciseGifUrl("Barbell Bench Press", "Gym Workouts"),
    badgeId: "badge_immortal_champion",
    badgeName: "Immortal 90 Champion",
    badgeColor: "from-red-600 to-amber-600",
    durationDays: 90,
    isPremium: true
  },
  {
    id: "women_confidence",
    title: "180 Women Confidence Challenge",
    description: "Target: Women. Tailored 180-day transformation repeating continuously: Monday: Glutes + Hamstrings, Tuesday: Upper Body + Core, Wednesday: Quads + Glutes, Thursday: Cardio + Core + Mobility, Friday: Glutes + Full Lower Body, Saturday: Full Body Conditioning, Sunday: Recovery.",
    category: "Glute Shaping & Core",
    goal: "Empower feminine athletic confidence, glute shape, waist definition, and elegant posture.",
    image: getExerciseGifUrl("Barbell Hip Thrust", "Gym Workouts"),
    badgeId: "badge_women_confidence",
    badgeName: "Confidence Queen",
    badgeColor: "from-pink-500 to-rose-600",
    durationDays: 180,
    isPremium: true
  },
  {
    id: "belly_fat_shred",
    title: "Belly Fat Shred",
    description: "Target: Men and Women. Visceral fat mobilization and core tapering repeating continuously: Monday: Full Body + Core, Tuesday: Cardio + Abs, Wednesday: Full Body Strength, Thursday: Cardio + Core, Friday: Full Body Conditioning, Saturday: Walking + Mobility, Sunday: Recovery.",
    category: "Conditioning & Fat Loss",
    goal: "Melt stubborn belly fat, tighten the waistline, and elevate cardiovascular conditioning.",
    image: getExerciseGifUrl("Plank", "Core"),
    badgeId: "badge_belly_shred",
    badgeName: "Visceral Shred Master",
    badgeColor: "from-rose-500 to-red-600",
    durationDays: 140,
    isPremium: true
  },
  {
    id: "home_180",
    title: "180 Days Home Workout",
    description: "Target: Men and Women (with separate workout tracks where appropriate). Zero and minimal equipment calisthenics, core armor, and functional conditioning repeating continuously across 180 days.",
    category: "Home Calisthenics",
    goal: "Master home bodyweight training, lean muscle preservation, and functional agility.",
    image: getExerciseGifUrl("Standard Push Ups", "Home Workouts"),
    badgeId: "badge_home_180",
    badgeName: "180 Day Sovereign Titan",
    badgeColor: "from-emerald-500 to-teal-600",
    durationDays: 180,
    isPremium: true
  },
  {
    id: "posture_vitality",
    title: "Posture Correction Challenge",
    description: "Target: Men and Women. Continuous 7-day cyclical split: Monday: Upper Back + Shoulder Mobility, Tuesday: Core Stability + Hip Mobility, Wednesday: Full Body Posture Training, Thursday: Recovery Mobility, Friday: Upper Back + Core, Saturday: Full Body Mobility + Stability, Sunday: Recovery.",
    category: "Posture & Joint Longevity",
    goal: "Reverse slouching, anterior shoulder rounding, and lower back tightness with clinical mobility.",
    image: getExerciseGifUrl("Face Pull", "Gym Workouts"),
    badgeId: "badge_posture_master",
    badgeName: "Postural Radiance",
    badgeColor: "from-cyan-500 to-blue-600",
    durationDays: 60,
    isPremium: true
  },
  {
    id: "lean_muscle",
    title: "90 Day Lean Muscle Challenge",
    description: "Build premium lean muscle definition, optimize progressive load, and improve baseline metabolic body composition.",
    category: "Hypertrophy",
    goal: "Build lean muscle, increase strength, and improve body composition.",
    image: getExerciseGifUrl("Barbell Squat", "Gym Workouts"),
    badgeId: "badge_muscle_champion",
    badgeName: "Lean Muscle Overlord",
    badgeColor: "from-red-500 to-amber-600",
    durationDays: 90,
    isPremium: true
  },
  {
    id: "fat_burning",
    title: "90 Day Fat Burning Challenge",
    description: "Intense cardiorespiratory conditioning designed to burn stubborn adipose tissue while locking in lean muscle preservation.",
    category: "Conditioning",
    goal: "Burn body fat while preserving muscle.",
    image: getExerciseGifUrl("Running", "Cardio"),
    badgeId: "badge_fat_burner",
    badgeName: "Adipose Vaporizer",
    badgeColor: "from-orange-500 to-red-600",
    durationDays: 90,
    isPremium: true
  },
  {
    id: "body_transformation",
    title: "90 Day Body Transformation Challenge",
    description: "The ultimate recomposition blueprint. Simultaneously stimulate local muscular development and systemic body fat depletion.",
    category: "Recomposition",
    goal: "Lose fat while gaining muscle.",
    image: getExerciseGifUrl("Pull Ups", "Gym Workouts"),
    badgeId: "badge_transformation_master",
    badgeName: "Aesthetic Shapeshifter",
    badgeColor: "from-purple-500 to-indigo-600",
    durationDays: 90,
    isPremium: true
  },
  {
    id: "athletic_performance",
    title: "90 Day Athletic Performance Challenge",
    description: "Enhance rate of force development, rotational power, agility vectors, and structural endurance for competitive dominance.",
    category: "Athleticism",
    goal: "Improve speed, power, endurance, and athletic ability.",
    image: getExerciseGifUrl("Burpees", "Calisthenics Workouts"),
    badgeId: "badge_apex_athlete",
    badgeName: "Apex Predator Rank",
    badgeColor: "from-cyan-500 to-blue-600",
    durationDays: 90,
    isPremium: true
  },
  {
    id: "strength_challenge",
    title: "90 Day Strength Challenge",
    description: "Command major barbell compound movements. Systematically overload neurological pathways to claim high personal records.",
    category: "Powerlifting",
    goal: "Increase overall strength and lifting performance.",
    image: getExerciseGifUrl("Deadlift", "Gym Workouts"),
    badgeId: "badge_strength_titan",
    badgeName: "Titanium Leviathan",
    badgeColor: "from-yellow-600 to-amber-700",
    durationDays: 90,
    isPremium: true
  },
  {
    id: "home_fitness",
    title: "90 Day Home Fitness Challenge",
    description: "Maximal mechanical tension utilizing advanced bodyweight progressions and minimal load setups. Zero excuses.",
    category: "Calisthenics",
    goal: "Train effectively at home using bodyweight or minimal equipment.",
    image: getExerciseGifUrl("Standard Push Ups", "Home Workouts"),
    badgeId: "badge_home_elite",
    badgeName: "Sovereign Domestic Warrior",
    badgeColor: "from-emerald-500 to-teal-600",
    durationDays: 90,
    isPremium: true
  },
  {
    id: "six_pack_core",
    title: "90 Day Six Pack & Core Challenge",
    description: "Build deep anterior and posterior core stability, define the rectus abdominis, and strengthen vital bracing systems.",
    category: "Core Force",
    goal: "Build a stronger core and visible abdominal muscles.",
    image: getExerciseGifUrl("Plank", "Core"),
    badgeId: "badge_core_citadel",
    badgeName: "Citadel Core Overlord",
    badgeColor: "from-pink-500 to-rose-600",
    durationDays: 90,
    isPremium: true
  }
];

export const PREMIUM_CHALLENGES = FLAGSHIP_CHALLENGES;

export const CHALLENGE_SPLITS: Record<string, string[]> = {
  immortal_90: [
    "Push (Chest, Shoulders & Triceps)",
    "Pull (Back, Rear Delts & Biceps)",
    "Legs + Core (Quads, Hamstrings, Glutes, Calves & Abs)",
    "Cardio + Mobility",
    "Upper Body (Chest, Back, Shoulders & Arms)",
    "Athletic Conditioning + Core",
    "Recovery"
  ],
  women_confidence: [
    "Glutes + Hamstrings",
    "Upper Body + Core",
    "Quads + Glutes",
    "Cardio + Core + Mobility",
    "Glutes + Full Lower Body",
    "Full Body Conditioning",
    "Recovery"
  ],
  belly_fat_shred: [
    "Full Body + Core",
    "Cardio + Abs",
    "Full Body Strength",
    "Cardio + Core",
    "Full Body Conditioning",
    "Walking + Mobility",
    "Recovery"
  ],
  home_180: [
    "Upper Body Push & Calisthenics",
    "Core & Abs Shred",
    "Lower Body & Legs",
    "Cardio + Mobility",
    "Upper Body Pull & Back",
    "Athletic Full Body Conditioning",
    "Recovery"
  ],
  posture_vitality: [
    "Upper Back + Shoulder Mobility",
    "Core Stability + Hip Mobility",
    "Full Body Posture Training",
    "Recovery Mobility",
    "Upper Back + Core",
    "Full Body Mobility + Stability",
    "Recovery"
  ],
  lean_muscle: [
    "Chest and Triceps",
    "Back and Biceps",
    "Cardio and Mobility",
    "Legs and Shoulders",
    "Chest, Triceps and Forearms",
    "Back, Biceps and Core",
    "Rest and Recovery"
  ],
  fat_burning: ["HIIT Cardio", "Lower Body Conditioning", "Aerobic Cardio", "Upper Body Circuit", "Full Body Shred", "HIIT Endurance", "Recovery"],
  body_transformation: ["Upper Body Strength", "Lower Body Strength", "Core + Mobility", "Full Body Hypertrophy", "HIIT Cardio", "Core + Conditioning", "Recovery"],
  athletic_performance: ["Plyometrics & Speed", "Lower Body Power", "Conditioning", "Upper Body Power", "Agility + Core", "Endurance Running", "Recovery"],
  strength_challenge: ["Squats & Legs", "Bench Press & Chest", "Active Recovery", "Deadlifts & Back", "Overhead Press & Shoulders", "Heavy Bracing Core", "Recovery"],
  home_fitness: ["Bodyweight Full Body", "Core & Mobility", "Home HIIT Cardio", "Bodyweight Upper Body", "Bodyweight Lower Body", "Home Conditioning", "Recovery"],
  six_pack_core: ["Upper Abs + Obliques", "Lower Abs + Deep Core", "Cardio + Core Burn", "Planks & Isometrics", "Rotational Core Strength", "Full Core Circuit", "Recovery"]
};

/**
 * Resolves full list of workout items for any challenge (flagship or admin custom).
 * Ensures workout media images, names, sets, and reps are always present.
 */
export function getChallengeWorkouts(challenge: PremiumChallenge, exercisesList?: Exercise[]): ChallengeWorkout[] {
  const exercises = exercisesList && exercisesList.length > 0 ? exercisesList : EXERCISES;

  let rawWorkouts: ChallengeWorkout[] = [];

  // If challenge has explicit custom workouts, enrich them with real media from current exercises
  if (challenge.workouts && Array.isArray(challenge.workouts) && challenge.workouts.length > 0) {
    rawWorkouts = challenge.workouts.map(cw => {
      const match = exercises.find(e => e.id === cw.id || e.name.toLowerCase() === cw.name?.toLowerCase());
      return {
        id: cw.id || match?.id || `cw_${Math.random()}`,
        name: cw.name || match?.name || "Target Exercise",
        sets: cw.sets || match?.recommendedSets || "3-4",
        reps: cw.reps || match?.recommendedReps || "10-12",
        customMediaUrl: cw.customMediaUrl || match?.customMediaUrl || match?.gifUrl || match?.imageUrl,
        customMediaType: cw.customMediaType || match?.customMediaType || "image",
        gifUrl: cw.gifUrl || match?.gifUrl || match?.imageUrl,
        imageUrl: cw.imageUrl || match?.imageUrl || match?.gifUrl,
        category: cw.category || match?.category || challenge.category,
        muscleGroups: cw.muscleGroups || match?.muscleGroups || [challenge.category],
        restTime: cw.restTime || match?.restTime || "60s"
      };
    });
  } else {
    // Otherwise, intelligently derive workouts based on challenge category and splits
    const challengeId = challenge.id;
    const isHomeChallenge = challengeId.includes("home") || 
      challenge.category.toLowerCase().includes("home") || 
      challenge.category.toLowerCase().includes("calisthenics") ||
      challenge.title.toLowerCase().includes("home");

    const splitCategories = CHALLENGE_SPLITS[challengeId] || [challenge.category || "Full Body"];

    const matched: Exercise[] = [];
    const seenIds = new Set<string>();

    for (const split of splitCategories) {
      if (split.toLowerCase().includes("recovery")) continue;
      const splitWords = split.toLowerCase().split(/[ +&/]+/);

      const pool = exercises.filter(ex => {
        if (seenIds.has(ex.id)) return false;
        if (isHomeChallenge && !isHomeEligibleExercise(ex)) return false;
        const mMatches = ex.muscleGroups?.some(m => splitWords.some(w => m.toLowerCase().includes(w)));
        const cMatches = ex.category.toLowerCase().includes(challenge.category.toLowerCase()) || 
                         ex.categories?.some(c => c.toLowerCase().includes(challenge.category.toLowerCase()));
        const nMatches = splitWords.some(w => ex.name.toLowerCase().includes(w));
        return mMatches || cMatches || nMatches;
      });

      for (const ex of pool.slice(0, 4)) {
        if (!seenIds.has(ex.id) && matched.length < 10) {
          seenIds.add(ex.id);
          matched.push(ex);
        }
      }
    }

    // Ensure program workouts are strictly capped at maximum 10 daily workouts
    if (matched.length < 10) {
      const categoryMatches = exercises.filter(ex => 
        !seenIds.has(ex.id) && 
        (!isHomeChallenge || isHomeEligibleExercise(ex)) && (
          ex.category.toLowerCase().includes(challenge.category.toLowerCase()) ||
          ex.categories?.some(c => c.toLowerCase().includes(challenge.category.toLowerCase()))
        )
      );
      for (const ex of categoryMatches) {
        if (!seenIds.has(ex.id) && matched.length < 10) {
          seenIds.add(ex.id);
          matched.push(ex);
        }
      }
    }

    // Fallback to general exercises to populate up to 10 workouts
    if (matched.length < 10) {
      for (const ex of exercises) {
        if (!seenIds.has(ex.id) && (!isHomeChallenge || isHomeEligibleExercise(ex)) && matched.length < 10) {
          seenIds.add(ex.id);
          matched.push(ex);
        }
      }
    }

    rawWorkouts = matched.slice(0, 10).map((ex) => ({
      id: ex.id,
      name: ex.name,
      sets: ex.recommendedSets || "3-4",
      reps: ex.recommendedReps || "10-12",
      customMediaUrl: ex.customMediaUrl || ex.gifUrl || ex.imageUrl,
      customMediaType: ex.customMediaType || "image",
      gifUrl: ex.gifUrl || ex.imageUrl,
      imageUrl: ex.imageUrl || ex.gifUrl,
      category: ex.category,
      muscleGroups: ex.muscleGroups,
      restTime: ex.restTime || "60s"
    }));
  }

  // Strictly enforce deduplication of both exercise names and GIFs
  const seenNames = new Set<string>();
  const seenGifs = new Set<string>();
  const finalWorkouts: ChallengeWorkout[] = [];

  for (const w of rawWorkouts) {
    const cleanName = (w.name || "").trim();
    if (!cleanName) continue;
    const lower = cleanName.toLowerCase();
    if (seenNames.has(lower)) continue;
    seenNames.add(lower);

    let gif = w.gifUrl || w.customMediaUrl;
    if (!gif || seenGifs.has(gif)) {
      gif = getExerciseGifUrl(cleanName, w.category, seenGifs);
    } else {
      seenGifs.add(gif);
    }

    finalWorkouts.push({
      ...w,
      name: cleanName,
      gifUrl: gif,
      imageUrl: gif,
      customMediaUrl: gif
    });
  }

  return finalWorkouts;
}
