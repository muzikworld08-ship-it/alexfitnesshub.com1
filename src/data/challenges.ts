import { Exercise } from "./exercises";
import { ChallengeItem, ChallengeWorkout } from "../types";

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
    id: "lean_muscle",
    title: "90 Day Lean Muscle Challenge",
    description: "Build premium lean muscle definition, optimize progressive load, and improve baseline metabolic body composition.",
    category: "Hypertrophy",
    goal: "Build lean muscle, increase strength, and improve body composition.",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    badgeId: "badge_core_citadel",
    badgeName: "Citadel Core Overlord",
    badgeColor: "from-pink-500 to-rose-600",
    durationDays: 90,
    isPremium: true
  }
];

export const PREMIUM_CHALLENGES = FLAGSHIP_CHALLENGES;

export const CHALLENGE_SPLITS: Record<string, string[]> = {
  lean_muscle: ["Chest + Triceps", "Back + Biceps", "Legs", "Shoulders + Core", "Upper Body", "Conditioning", "Recovery"],
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
export function getChallengeWorkouts(challenge: PremiumChallenge, exercises: Exercise[]): ChallengeWorkout[] {
  // If challenge has explicit custom workouts, enrich them with real media from current exercises
  if (challenge.workouts && Array.isArray(challenge.workouts) && challenge.workouts.length > 0) {
    return challenge.workouts.map(cw => {
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
  }

  // Otherwise, intelligently derive workouts based on challenge category and splits
  const challengeId = challenge.id;
  const splitCategories = CHALLENGE_SPLITS[challengeId] || [challenge.category || "Full Body"];

  const matched: Exercise[] = [];
  const seenIds = new Set<string>();

  for (const split of splitCategories) {
    if (split.toLowerCase().includes("recovery")) continue;
    const splitWords = split.toLowerCase().split(/[ +&/]+/);

    const pool = exercises.filter(ex => {
      if (seenIds.has(ex.id)) return false;
      const mMatches = ex.muscleGroups?.some(m => splitWords.some(w => m.toLowerCase().includes(w)));
      const cMatches = ex.category.toLowerCase().includes(challenge.category.toLowerCase()) || 
                       ex.categories?.some(c => c.toLowerCase().includes(challenge.category.toLowerCase()));
      const nMatches = splitWords.some(w => ex.name.toLowerCase().includes(w));
      return mMatches || cMatches || nMatches;
    });

    for (const ex of pool.slice(0, 2)) {
      if (!seenIds.has(ex.id) && matched.length < 8) {
        seenIds.add(ex.id);
        matched.push(ex);
      }
    }
  }

  // Fallback if needed
  if (matched.length < 4) {
    const fallbacks = exercises.slice(0, 6);
    for (const fb of fallbacks) {
      if (!seenIds.has(fb.id) && matched.length < 6) {
        seenIds.add(fb.id);
        matched.push(fb);
      }
    }
  }

  return matched.map((ex, idx) => ({
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
