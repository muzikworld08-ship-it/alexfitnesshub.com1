/**
 * Athletic Physiological Readiness & Recovery Calculator
 * Computes multi-parameter readiness scores based on daily sleep duration,
 * cellular hydration, resting heart rate, and subjective energy levels.
 */

export interface ReadinessCalculationResult {
  score: number; // 0 - 100
  tier: "optimal" | "high" | "moderate" | "low";
  label: string;
  recommendation: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
  breakdown: {
    sleepScore: number;
    hydrationScore: number;
    heartRateScore?: number;
    energyScore?: number;
  };
}

export function calculateReadinessScore(
  sleepHours: number,
  hydrationGlasses: number,
  restingHeartRate?: number,
  energyLevel?: number
): ReadinessCalculationResult {
  // 1. Sleep Duration Factor (Target: 7.5 - 9.0 hrs)
  const validSleep = isNaN(sleepHours) || sleepHours < 0 ? 0 : sleepHours;
  let sleepScore = 0;
  if (validSleep >= 7.5 && validSleep <= 9.0) {
    sleepScore = 100;
  } else if (validSleep >= 7.0 && validSleep < 7.5) {
    sleepScore = 90;
  } else if (validSleep > 9.0 && validSleep <= 10.0) {
    sleepScore = 88;
  } else if (validSleep >= 6.0 && validSleep < 7.0) {
    sleepScore = 75;
  } else if (validSleep >= 5.0 && validSleep < 6.0) {
    sleepScore = 55;
  } else if (validSleep > 10.0) {
    sleepScore = 70;
  } else {
    // < 5 hours
    sleepScore = Math.max(15, Math.round((validSleep / 5.0) * 45));
  }

  // 2. Cellular Hydration Factor (Target: 8 - 12 glasses, ~2.0 - 3.0L)
  const validHydration = isNaN(hydrationGlasses) || hydrationGlasses < 0 ? 0 : hydrationGlasses;
  let hydrationScore = 0;
  if (validHydration >= 8 && validHydration <= 12) {
    hydrationScore = 100;
  } else if (validHydration >= 7) {
    hydrationScore = 88;
  } else if (validHydration >= 6) {
    hydrationScore = 75;
  } else if (validHydration >= 5) {
    hydrationScore = 60;
  } else if (validHydration >= 4) {
    hydrationScore = 45;
  } else if (validHydration > 12) {
    hydrationScore = 95;
  } else {
    hydrationScore = Math.max(10, Math.round((validHydration / 4) * 35));
  }

  // 3. Resting Heart Rate Factor (Optional, target: 50-65 bpm)
  let heartRateScore: number | undefined;
  if (typeof restingHeartRate === "number" && !isNaN(restingHeartRate) && restingHeartRate > 0) {
    if (restingHeartRate < 55) {
      heartRateScore = 100;
    } else if (restingHeartRate <= 65) {
      heartRateScore = 95;
    } else if (restingHeartRate <= 75) {
      heartRateScore = 80;
    } else if (restingHeartRate <= 85) {
      heartRateScore = 65;
    } else {
      heartRateScore = Math.max(25, Math.round(65 - (restingHeartRate - 85) * 1.5));
    }
  }

  // 4. Energy Factor (1-5 subjective scale)
  let energyScore: number | undefined;
  if (typeof energyLevel === "number" && !isNaN(energyLevel) && energyLevel >= 1 && energyLevel <= 5) {
    energyScore = (energyLevel / 5) * 100;
  }

  // Weighted calculation
  let totalScore = 0;
  if (heartRateScore !== undefined && energyScore !== undefined) {
    // Sleep: 40%, Hydration: 30%, RHR: 15%, Energy: 15%
    totalScore = sleepScore * 0.40 + hydrationScore * 0.30 + heartRateScore * 0.15 + energyScore * 0.15;
  } else if (heartRateScore !== undefined) {
    // Sleep: 45%, Hydration: 35%, RHR: 20%
    totalScore = sleepScore * 0.45 + hydrationScore * 0.35 + heartRateScore * 0.20;
  } else if (energyScore !== undefined) {
    // Sleep: 45%, Hydration: 35%, Energy: 20%
    totalScore = sleepScore * 0.45 + hydrationScore * 0.35 + energyScore * 0.20;
  } else {
    // Sleep: 55%, Hydration: 45%
    totalScore = sleepScore * 0.55 + hydrationScore * 0.45;
  }

  const score = Math.min(100, Math.max(1, Math.round(totalScore)));

  let tier: "optimal" | "high" | "moderate" | "low" = "moderate";
  let label = "Moderate Recovery";
  let recommendation = "Standard baseline readiness. Moderate volume recommended; prioritize intra-workout hydration and mobility warmups.";
  let colorClass = "text-amber-500";
  let bgClass = "bg-amber-500/10";
  let borderClass = "border-amber-500/20";
  let badgeClass = "bg-amber-50 text-amber-700 border-amber-200";

  if (score >= 85) {
    tier = "optimal";
    label = "Optimal Readiness";
    recommendation = "Prime physiological readiness! Full clearance for heavy compound lifts, PR attempts, and high-intensity athletic conditioning.";
    colorClass = "text-emerald-500";
    bgClass = "bg-emerald-500/10";
    borderClass = "border-emerald-500/20";
    badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (score >= 70) {
    tier = "high";
    label = "High Capacity";
    recommendation = "Solid recovery capacity. Well suited for hypertrophy volume, muscular endurance, and targeted functional sets.";
    colorClass = "text-blue-500";
    bgClass = "bg-blue-500/10";
    borderClass = "border-blue-500/20";
    badgeClass = "bg-blue-50 text-blue-700 border-blue-200";
  } else if (score >= 50) {
    tier = "moderate";
    label = "Moderate Recovery";
    recommendation = "Standard baseline readiness. Moderate volume recommended; maintain steady pacing and drink electrolytes.";
    colorClass = "text-amber-500";
    bgClass = "bg-amber-500/10";
    borderClass = "border-amber-500/20";
    badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
  } else {
    tier = "low";
    label = "Low Recovery / Deload";
    recommendation = "Elevated systemic fatigue or dehydration detected. Active recovery, light mobility flow, or restorative sleep protocol advised.";
    colorClass = "text-[#D32F2F]";
    bgClass = "bg-[#D32F2F]/10";
    borderClass = "border-[#D32F2F]/20";
    badgeClass = "bg-red-50 text-red-700 border-red-200";
  }

  return {
    score,
    tier,
    label,
    recommendation,
    colorClass,
    bgClass,
    borderClass,
    badgeClass,
    breakdown: {
      sleepScore,
      hydrationScore,
      heartRateScore,
      energyScore
    }
  };
}
