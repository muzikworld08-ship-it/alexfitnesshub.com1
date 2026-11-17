import type { ProgramId } from "../types/challengeEngine";

/**
 * Normalizes program id string aliases cleanly with zero heavy data dependencies.
 */
export function normalizeProgramId(rawId: string = ""): ProgramId {
  const clean = rawId.toLowerCase().trim();
  if (!clean) return "immortal_90";
  if (clean.startsWith("custom_") || clean.startsWith("ch_")) return clean as ProgramId;
  if (clean === "home_180_women" || (clean.includes("home") && (clean.includes("women") || clean.includes("female")))) return "home_180_women" as any;
  if (clean === "home_fitness" || clean === "90_day_home_fitness" || clean === "90-day-home-fitness" || clean.includes("home_fitness") || clean.includes("home fitness")) return "home_fitness";
  if (clean === "home_180" || clean === "180_day_home" || clean.includes("home_180") || clean.includes("home")) return "home_180";
  if (clean.includes("immortal") || clean === "90_day_immortal" || clean === "90-days-immortal") return "immortal_90";
  if (clean.includes("belly") || clean.includes("shred") || clean === "belly_fat_shred") return "belly_fat_shred";
  if (clean.includes("posture") || clean === "posture_vitality") return "posture_vitality";
  if (clean.includes("women") || clean === "women_confidence") return "women_confidence";
  if (clean.includes("lifestyle") || clean === "lifestyle_academy") return "lifestyle_academy";
  if (clean.includes("tactical") || clean.includes("military") || clean === "cardio_calisthenics") return "cardio_calisthenics";
  if (clean === "gym_hypertrophy" || clean.includes("hypertrophy")) return "gym_hypertrophy";
  if (clean === "lean_muscle" || clean.includes("lean_muscle") || clean.includes("lean muscle")) return "lean_muscle";
  if (clean === "fat_burning" || clean.includes("fat_burning") || clean.includes("fat burning")) return "fat_burning";
  if (clean === "body_transformation" || clean.includes("body_transformation") || clean.includes("transformation")) return "body_transformation";
  if (clean === "athletic_performance" || clean.includes("athletic_performance") || clean.includes("athletic")) return "athletic_performance";
  if (clean === "strength_challenge" || clean.includes("strength_challenge")) return "strength_challenge";
  if (clean === "six_pack_core" || clean.includes("six_pack") || clean.includes("six pack")) return "six_pack_core";
  return (clean as ProgramId);
}
