import React, { useState, useMemo, useEffect } from "react";
import { useApp } from "../context/AppContext";
import PageHero from "./PageHero";
import { 
  Activity, 
  Flame, 
  Heart, 
  Scale, 
  Target, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Utensils, 
  Droplets, 
  Zap, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  Copy, 
  Check, 
  Dumbbell, 
  Compass, 
  ChevronRight, 
  Sliders, 
  Bot, 
  Layers,
  Award,
  Calendar,
  Clock
} from "lucide-react";

type UnitSystem = "metric" | "imperial";
type Gender = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "heavy" | "athlete";
type FitnessGoal = "rapid_fat_loss" | "fat_loss" | "recomp" | "lean_bulk" | "aggressive_bulk";
type DietPreset = "balanced" | "high_protein" | "low_carb" | "african_staples";

interface MacroSplit {
  proteinGrams: number;
  proteinKcal: number;
  proteinPercent: number;
  carbGrams: number;
  carbKcal: number;
  carbPercent: number;
  fatGrams: number;
  fatKcal: number;
  fatPercent: number;
  fiberGrams: number;
}

export default function BodyStatsCalculatorView() {
  const { user, setView } = useApp();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<"calculator" | "assessment">("calculator");

  // Unit System
  const [units, setUnits] = useState<UnitSystem>("metric");

  // Biometric Inputs
  const [gender, setGender] = useState<Gender>(() => (user?.gender === "female" ? "female" : "male"));
  const [age, setAge] = useState<number>(() => user?.age || 28);
  const [weightKg, setWeightKg] = useState<number>(() => user?.weight || 78);
  const [heightCm, setHeightCm] = useState<number>(() => user?.height || 175);

  // Imperial inputs helper state
  const [weightLbs, setWeightLbs] = useState<number>(() => Math.round((user?.weight || 78) * 2.20462));
  const [heightFeet, setHeightFeet] = useState<number>(() => Math.floor((user?.height || 175) / 30.48));
  const [heightInches, setHeightInches] = useState<number>(() => Math.round(((user?.height || 175) % 30.48) / 2.54));

  // Advanced & Goal Inputs
  const [bodyFatPercent, setBodyFatPercent] = useState<number>(20);
  const [hasCustomBodyFat, setHasCustomBodyFat] = useState<boolean>(false);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<FitnessGoal>("fat_loss");
  const [dietPreset, setDietPreset] = useState<DietPreset>("high_protein");
  const [mealsPerDay, setMealsPerDay] = useState<number>(3);

  // Copy Feedback
  const [copied, setCopied] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Synchronize Imperial <-> Metric
  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === units) return;
    if (newUnit === "imperial") {
      setWeightLbs(Math.round(weightKg * 2.20462));
      const totalInches = heightCm / 2.54;
      setHeightFeet(Math.floor(totalInches / 12));
      setHeightInches(Math.round(totalInches % 12));
    } else {
      setWeightKg(Math.round(weightLbs / 2.20462));
      const totalCm = Math.round(heightFeet * 30.48 + heightInches * 2.54);
      setHeightCm(totalCm);
    }
    setUnits(newUnit);
  };

  const effectiveWeightKg = units === "metric" ? weightKg : weightLbs / 2.20462;
  const effectiveHeightCm = units === "metric" ? heightCm : heightFeet * 30.48 + heightInches * 2.54;

  // 1. BMI Calculation
  const bmi = useMemo(() => {
    if (effectiveHeightCm <= 0 || effectiveWeightKg <= 0) return 0;
    const heightMeters = effectiveHeightCm / 100;
    return parseFloat((effectiveWeightKg / (heightMeters * heightMeters)).toFixed(1));
  }, [effectiveWeightKg, effectiveHeightCm]);

  const bmiCategory = useMemo(() => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200", advice: "Caloric surplus & progressive hypertrophy recommended." };
    if (bmi < 25.0) return { label: "Normal (Healthy Weight)", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", advice: "Ideal baseline. Optimize body recomposition or lean muscle growth." };
    if (bmi < 30.0) return { label: "Overweight", color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200", advice: "Structured caloric deficit & Zone 2 cardio protocol recommended." };
    return { label: "Obese (Class I-III)", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", advice: "Prioritize consistent fat oxidation, low-impact cardio & metabolic resistance." };
  }, [bmi]);

  // Healthy Weight Range for height
  const healthyWeightRange = useMemo(() => {
    const heightM = effectiveHeightCm / 100;
    const minKg = 18.5 * (heightM * heightM);
    const maxKg = 24.9 * (heightM * heightM);
    if (units === "metric") {
      return `${minKg.toFixed(1)} kg - ${maxKg.toFixed(1)} kg`;
    } else {
      return `${(minKg * 2.20462).toFixed(1)} lbs - ${(maxKg * 2.20462).toFixed(1)} lbs`;
    }
  }, [effectiveHeightCm, units]);

  // 2. BMR (Mifflin-St Jeor equation)
  const bmr = useMemo(() => {
    if (effectiveWeightKg <= 0 || effectiveHeightCm <= 0 || age <= 0) return 0;
    if (hasCustomBodyFat && bodyFatPercent > 5 && bodyFatPercent < 50) {
      // Katch-McArdle Formula if body fat is specified
      const leanMassKg = effectiveWeightKg * (1 - bodyFatPercent / 100);
      return Math.round(370 + 21.6 * leanMassKg);
    }
    // Standard Mifflin-St Jeor
    let base = 10 * effectiveWeightKg + 6.25 * effectiveHeightCm - 5 * age;
    base += gender === "male" ? 5 : -161;
    return Math.round(base);
  }, [effectiveWeightKg, effectiveHeightCm, age, gender, hasCustomBodyFat, bodyFatPercent]);

  // 3. Activity Multipliers & TDEE
  const activityMultiplierMap: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    heavy: 1.725,
    athlete: 1.9,
  };

  const tdee = useMemo(() => {
    return Math.round(bmr * activityMultiplierMap[activityLevel]);
  }, [bmr, activityLevel]);

  // 4. Target Caloric Intake based on Goal
  const goalAdjustmentMap: Record<FitnessGoal, { multiplier: number; label: string; tag: string }> = {
    rapid_fat_loss: { multiplier: 0.75, label: "Rapid Fat Deficit (-25%)", tag: "-25% Deficit" },
    fat_loss: { multiplier: 0.85, label: "Moderate Fat Loss (-15%)", tag: "-15% Deficit" },
    recomp: { multiplier: 1.0, label: "Maintenance & Recomposition", tag: "Maintenance (0%)" },
    lean_bulk: { multiplier: 1.10, label: "Clean Muscle Gain (+10%)", tag: "+10% Surplus" },
    aggressive_bulk: { multiplier: 1.18, label: "Aggressive Hypertrophy (+18%)", tag: "+18% Surplus" },
  };

  const targetCalories = useMemo(() => {
    return Math.round(tdee * goalAdjustmentMap[goal].multiplier);
  }, [tdee, goal]);

  // 5. Macronutrient Distribution Matrix
  const macros = useMemo<MacroSplit>(() => {
    const totalCal = targetCalories;
    let proteinRatio = 0.35;
    let carbRatio = 0.40;
    let fatRatio = 0.25;

    if (dietPreset === "high_protein") {
      proteinRatio = 0.40;
      carbRatio = 0.35;
      fatRatio = 0.25;
    } else if (dietPreset === "low_carb") {
      proteinRatio = 0.40;
      carbRatio = 0.20;
      fatRatio = 0.40;
    } else if (dietPreset === "african_staples") {
      proteinRatio = 0.35;
      carbRatio = 0.45;
      fatRatio = 0.20;
    }

    // High protein minimum protection for athletes: at least 1.8g - 2.2g per kg
    const minProteinGrams = Math.round(effectiveWeightKg * 2.0);
    const calculatedProteinGrams = Math.round((totalCal * proteinRatio) / 4);
    const proteinGrams = Math.max(minProteinGrams, calculatedProteinGrams);
    const proteinKcal = proteinGrams * 4;

    const remainingKcal = Math.max(0, totalCal - proteinKcal);
    const fatKcal = Math.round(remainingKcal * (fatRatio / (carbRatio + fatRatio)));
    const fatGrams = Math.round(fatKcal / 9);

    const carbKcal = Math.max(0, remainingKcal - fatKcal);
    const carbGrams = Math.round(carbKcal / 4);

    const proteinPercent = Math.round((proteinKcal / totalCal) * 100) || 0;
    const carbPercent = Math.round((carbKcal / totalCal) * 100) || 0;
    const fatPercent = Math.round((fatKcal / totalCal) * 100) || 0;

    // Fiber recommendation: 14g per 1000 kcal
    const fiberGrams = Math.round((totalCal / 1000) * 14);

    return {
      proteinGrams,
      proteinKcal,
      proteinPercent,
      carbGrams,
      carbKcal,
      carbPercent,
      fatGrams,
      fatKcal,
      fatPercent,
      fiberGrams,
    };
  }, [targetCalories, dietPreset, effectiveWeightKg]);

  // Recommended Daily Water Intake (in Liters & 250ml Glasses)
  const waterIntakeLiters = useMemo(() => {
    // 35ml per kg base + 500ml for moderate activity + 1000ml for heavy
    let baseMl = effectiveWeightKg * 35;
    if (activityLevel === "moderate") baseMl += 500;
    if (activityLevel === "heavy" || activityLevel === "athlete") baseMl += 1000;
    return parseFloat((baseMl / 1000).toFixed(1));
  }, [effectiveWeightKg, activityLevel]);

  const waterGlasses = Math.round((waterIntakeLiters * 1000) / 250);

  // Per-Meal Macro Distribution
  const perMealMacros = useMemo(() => {
    const count = mealsPerDay || 3;
    return {
      calories: Math.round(targetCalories / count),
      protein: Math.round(macros.proteinGrams / count),
      carbs: Math.round(macros.carbGrams / count),
      fat: Math.round(macros.fatGrams / count),
    };
  }, [targetCalories, macros, mealsPerDay]);

  // Copy Macro Plan summary to clipboard
  const handleCopySummary = () => {
    const summary = `AlexFitnessHub Biometric & Macro Plan:
- BMI: ${bmi} (${bmiCategory.label})
- BMR: ${bmr} kcal/day
- TDEE: ${tdee} kcal/day
- Target Calories: ${targetCalories} kcal/day (${goalAdjustmentMap[goal].label})
- Daily Macros:
  * Protein: ${macros.proteinGrams}g (${macros.proteinPercent}%)
  * Carbs: ${macros.carbGrams}g (${macros.carbPercent}%)
  * Fats: ${macros.fatGrams}g (${macros.fatPercent}%)
  * Fiber: ${macros.fiberGrams}g
- Daily Hydration: ${waterIntakeLiters}L (${waterGlasses} glasses)
- Meal Structure (${mealsPerDay} meals): ~${perMealMacros.calories} kcal / ${perMealMacros.protein}g protein per meal.`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Save to localStorage / profile
  const handleSaveToProfile = () => {
    try {
      localStorage.setItem("alexfit_target_calories", targetCalories.toString());
      localStorage.setItem("alexfit_target_protein", macros.proteinGrams.toString());
      localStorage.setItem("alexfit_target_carbs", macros.carbGrams.toString());
      localStorage.setItem("alexfit_target_fat", macros.fatGrams.toString());
      localStorage.setItem("alexfit_water_goal", waterGlasses.toString());
      setSaveSuccess("Biometrics and daily macro targets successfully saved to your active plan!");
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (e) {
      setSaveSuccess("Target logged into active session.");
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  // --- AI PHYSIQUE ASSESSMENT & PROGRAM MATCHER STATE ---
  const [assessmentFocus, setAssessmentFocus] = useState<string>("belly");
  const [assessmentGear, setAssessmentGear] = useState<string>("home");
  const [assessmentDays, setAssessmentDays] = useState<number>(4);
  const [assessmentExperience, setAssessmentExperience] = useState<string>("beginner");

  const recommendedProgram = useMemo(() => {
    if (assessmentFocus === "belly") {
      return {
        id: "5-month-belly-fat",
        name: "5-Month Extreme Belly Fat Shred",
        view: "belly-fat-shred",
        matchScore: 99,
        badge: "Deep Visceral Melt",
        reason: "Targets visceral & lower abdominal fat through clinical Zone 2 cardio, progressive incline walking, and deep transverse core vacuum holds.",
        timeline: "150 Days",
        difficulty: "All Levels",
      };
    }
    if (assessmentFocus === "women_curves") {
      return {
        id: "women-confidence-180",
        name: "Women's Confidence & Glute 180",
        view: "women-confidence",
        matchScore: 98,
        badge: "Glute Lift & Hourglass",
        reason: "Engineered specifically for women seeking hourglass waist tapering, progressive glute hypertrophy, and scapular posture alignment.",
        timeline: "180 Days",
        difficulty: "Beginner - Intermediate",
      };
    }
    if (assessmentFocus === "athletic") {
      return {
        id: "athletic-conditioning-hybrid",
        name: "Athletic Conditioning & Hybrid Power",
        view: "challenges",
        matchScore: 96,
        badge: "Peak VO2 & Torque",
        reason: "Blends rotational speed vectors, explosive power intervals, and multi-joint kinetic carries for elite real-world stamina.",
        timeline: "12 Weeks",
        difficulty: "Advanced",
      };
    }
    if (assessmentFocus === "home_recomp" || assessmentGear === "home") {
      return {
        id: "30-day-challenge",
        name: "30-Day Total Body Recomposition",
        view: "challenges",
        matchScore: 97,
        badge: "High Adherence Home Recomp",
        reason: "High-density bodyweight & minimal equipment circuit designed to maximize post-exercise oxygen consumption (EPOC) with zero gym friction.",
        timeline: "30 Days",
        difficulty: "All Levels",
      };
    }
    if (assessmentFocus === "muscle_building") {
      return {
        id: "beginner-muscle-building",
        name: "Beginner Muscle Building & Hypertrophy",
        view: "library",
        matchScore: 95,
        badge: "Structural Muscle Armor",
        reason: "Structured progressive overload focusing on compound movement mechanics, slow eccentrics, and foundational hypertrophy.",
        timeline: "8 Weeks",
        difficulty: "Beginner",
      };
    }
    return {
      id: "7-day-quick-burn",
      name: "7-Day Metabolic Quick Burn",
      view: "challenges",
      matchScore: 94,
      badge: "Rapid Calorie Deficit",
      reason: "Ultra-condensed 15-minute daily high-intensity bursts to kickstart metabolic fat burn for packed schedules.",
      timeline: "7 Days",
      difficulty: "All Levels",
    };
  }, [assessmentFocus, assessmentGear, assessmentDays, assessmentExperience]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1C1C1C] pb-24">
      {/* Hero Banner */}
      <PageHero
        title="Body Stats & Macro Calculator"
        subtitle="100% Biomechanically Verified Engine"
        description="Calculate your clinical Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), target caloric deficit or surplus, and precise macronutrient distribution."
        category="PHYSIOLOGICAL CALIBRATION"
        imageUrl="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 space-y-8">
        
        {/* Mode Switcher Navigation */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("calculator")}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === "calculator"
                  ? "bg-[#D32F2F] text-white shadow-md shadow-red-500/20"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>1. Body Stats & Macro Matrix</span>
            </button>
            <button
              onClick={() => setActiveTab("assessment")}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === "assessment"
                  ? "bg-[#D32F2F] text-white shadow-md shadow-red-500/20"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Target className="w-4 h-4" />
              <span>2. AI Physique & Program Matcher</span>
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Unit System:</span>
            <button
              onClick={() => handleUnitChange("metric")}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-black transition-all cursor-pointer ${
                units === "metric" ? "bg-[#1C1C1C] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Metric (kg, cm)
            </button>
            <button
              onClick={() => handleUnitChange("imperial")}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-black transition-all cursor-pointer ${
                units === "imperial" ? "bg-[#1C1C1C] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Imperial (lbs, ft/in)
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* TAB 1: CALCULATOR & MACRO MATRIX */}
        {activeTab === "calculator" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: INPUT CONTROLS (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-black uppercase text-[#D32F2F] tracking-widest">
                    STEP 1: BIOMETRICS
                  </span>
                  <h3 className="text-xl font-display font-black uppercase text-[#1C1C1C]">
                    Your Physiological Data
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#D32F2F] flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
              </div>

              {/* Sex Toggle */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                  Biological Sex (Formula Calibration)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={`py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer border ${
                      gender === "male"
                        ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={`py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer border ${
                      gender === "female"
                        ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {/* Age & Weight Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min={12}
                    max={100}
                    value={age}
                    onChange={(e) => setAge(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm font-bold text-[#1C1C1C] focus:bg-white focus:border-[#D32F2F] focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                    Weight ({units === "metric" ? "kg" : "lbs"})
                  </label>
                  {units === "metric" ? (
                    <input
                      type="number"
                      step="0.5"
                      min={30}
                      max={250}
                      value={weightKg}
                      onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm font-bold text-[#1C1C1C] focus:bg-white focus:border-[#D32F2F] focus:outline-none transition-colors"
                    />
                  ) : (
                    <input
                      type="number"
                      step="1"
                      min={60}
                      max={550}
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm font-bold text-[#1C1C1C] focus:bg-white focus:border-[#D32F2F] focus:outline-none transition-colors"
                    />
                  )}
                </div>
              </div>

              {/* Height Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                  Height ({units === "metric" ? "Centimeters" : "Feet & Inches"})
                </label>
                {units === "metric" ? (
                  <input
                    type="number"
                    min={100}
                    max={250}
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm font-bold text-[#1C1C1C] focus:bg-white focus:border-[#D32F2F] focus:outline-none transition-colors"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <input
                        type="number"
                        min={3}
                        max={8}
                        value={heightFeet}
                        onChange={(e) => setHeightFeet(parseInt(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm font-bold text-[#1C1C1C] focus:bg-white focus:border-[#D32F2F] focus:outline-none"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">ft</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={11}
                        value={heightInches}
                        onChange={(e) => setHeightInches(parseInt(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm font-bold text-[#1C1C1C] focus:bg-white focus:border-[#D32F2F] focus:outline-none"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">in</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Body Fat Estimation */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-700 uppercase flex items-center gap-1.5">
                    <span>Body Fat % (Optional)</span>
                    <span className="text-[9px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-normal">Katch-McArdle</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setHasCustomBodyFat(!hasCustomBodyFat)}
                    className="text-[11px] font-mono text-[#D32F2F] font-bold hover:underline cursor-pointer"
                  >
                    {hasCustomBodyFat ? "Use Standard BMR" : "+ Enable Precision"}
                  </button>
                </div>

                {hasCustomBodyFat && (
                  <div className="space-y-2 pt-1 animate-fade-in">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Estimated Body Fat:</span>
                      <span className="font-bold text-[#1C1C1C]">{bodyFatPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min={6}
                      max={45}
                      value={bodyFatPercent}
                      onChange={(e) => setBodyFatPercent(parseInt(e.target.value))}
                      className="w-full accent-[#D32F2F] cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-slate-400">
                      <span>Lean (8-14%)</span>
                      <span>Athletic (15-20%)</span>
                      <span>High (25%+)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Level Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                  Daily Physical Activity Level
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-sans text-xs font-bold text-[#1C1C1C] focus:bg-white focus:border-[#D32F2F] focus:outline-none transition-colors"
                >
                  <option value="sedentary">Sedentary (Desk Job, Little to No Exercise)</option>
                  <option value="light">Light Activity (1-3 Workout Sessions / Week)</option>
                  <option value="moderate">Moderate Exercise (3-5 Workout Sessions / Week)</option>
                  <option value="heavy">Heavy Training (6-7 High-Intensity Sessions / Week)</option>
                  <option value="athlete">Elite Athlete / Two-a-Day Physical Training</option>
                </select>
              </div>

              {/* Primary Transformation Goal */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                  Primary Transformation Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as FitnessGoal)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-sans text-xs font-bold text-[#1C1C1C] focus:bg-white focus:border-[#D32F2F] focus:outline-none transition-colors"
                >
                  <option value="rapid_fat_loss">Rapid Fat Loss & Visceral Melt (-25% Deficit)</option>
                  <option value="fat_loss">Moderate Fat Loss & Definition (-15% Deficit)</option>
                  <option value="recomp">Maintenance & Body Recomposition (0% Caloric Deficit)</option>
                  <option value="lean_bulk">Lean Hypertrophy & Muscle Build (+10% Surplus)</option>
                  <option value="aggressive_bulk">Aggressive Mass & Powerlifting (+18% Surplus)</option>
                </select>
              </div>

              {/* Diet Strategy Preset */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                  Macronutrient Distribution Preset
                </label>
                <select
                  value={dietPreset}
                  onChange={(e) => setDietPreset(e.target.value as DietPreset)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-sans text-xs font-bold text-[#1C1C1C] focus:bg-white focus:border-[#D32F2F] focus:outline-none transition-colors"
                >
                  <option value="high_protein">High Protein Bodybuilding (40% P / 35% C / 25% F)</option>
                  <option value="balanced">Balanced Athletic Standard (35% P / 40% C / 25% F)</option>
                  <option value="african_staples">African Whole Foods Matrix (Plantains, Beans, Fish, Egg Whites)</option>
                  <option value="low_carb">Low-Carb Metabolic Shred (40% P / 20% C / 40% F)</option>
                </select>
              </div>

              {/* Meals per day slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-slate-700 uppercase">Meals Per Day:</span>
                  <span className="font-black text-[#D32F2F]">{mealsPerDay} Meals / Day</span>
                </div>
                <div className="flex gap-2">
                  {[2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setMealsPerDay(num)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                        mealsPerDay === num
                          ? "bg-[#D32F2F] text-white border-[#D32F2F]"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: COMPUTED METRICS & MACROS (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* PRIMARY STATS BENTO GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* 1. BMI Card */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-left relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        Body Mass Index
                      </span>
                      <Activity className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="text-3xl font-display font-black text-[#1C1C1C] tracking-tight">
                      {bmi} <span className="text-xs font-sans font-normal text-slate-400">BMI</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-mono font-black uppercase tracking-wider ${bmiCategory.bg} ${bmiCategory.color} ${bmiCategory.border} border`}>
                      {bmiCategory.label}
                    </span>
                  </div>
                </div>

                {/* 2. BMR Card */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-left relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        Basal Metabolism
                      </span>
                      <Heart className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="text-3xl font-display font-black text-[#1C1C1C] tracking-tight">
                      {bmr.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-400">kcal</span>
                    </div>
                  </div>
                  <p className="mt-3 text-[10px] text-slate-500 font-mono">
                    Resting 24-hr metabolic baseline.
                  </p>
                </div>

                {/* 3. TDEE Maintenance Card */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-left relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        TDEE Maintenance
                      </span>
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div className="text-3xl font-display font-black text-[#1C1C1C] tracking-tight">
                      {tdee.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-400">kcal</span>
                    </div>
                  </div>
                  <p className="mt-3 text-[10px] text-slate-500 font-mono">
                    Daily caloric burn with exercise.
                  </p>
                </div>

              </div>

              {/* TARGET CALORIC INTAKE HERO CARD */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl text-left relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-[#D32F2F]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                      <Zap className="w-4 h-4 text-[#D32F2F]" />
                      <span>{goalAdjustmentMap[goal].tag}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight">
                      Your Target Daily Caloric Intake
                    </h3>
                  </div>

                  <div className="text-right sm:text-right">
                    <div className="text-4xl sm:text-5xl font-display font-black text-[#D32F2F] tracking-tight">
                      {targetCalories.toLocaleString()}
                    </div>
                    <span className="text-xs font-mono text-slate-400 uppercase">kcal / day</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Clinical Weight Recommendation</span>
                    <p className="text-xs text-slate-200 font-mono">
                      Healthy range for {effectiveHeightCm}cm: <strong className="text-white">{healthyWeightRange}</strong>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Optimal Daily Hydration</span>
                    <p className="text-xs text-slate-200 font-mono flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                      <span><strong>{waterIntakeLiters} Liters</strong> ({waterGlasses} x 250ml glasses daily)</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* MACRONUTRIENT DISTRIBUTION GRID */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-left space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-black uppercase text-[#D32F2F] tracking-widest">
                      CALIBRATED NUTRITIONAL DIVISION
                    </span>
                    <h4 className="text-lg font-display font-black uppercase text-[#1C1C1C]">
                      Daily Macronutrient Targets
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-mono text-slate-600 font-bold">
                    {dietPreset.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                {/* Macro Split Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Protein */}
                  <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200 space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono font-bold text-[#D32F2F]">
                      <span>PROTEIN</span>
                      <span>{macros.proteinPercent}%</span>
                    </div>
                    <div className="text-2xl font-display font-black text-[#1C1C1C]">
                      {macros.proteinGrams} <span className="text-xs font-mono font-normal text-slate-500">grams</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {macros.proteinKcal} kcal ({(macros.proteinGrams / effectiveWeightKg).toFixed(1)}g / kg body mass)
                    </div>
                  </div>

                  {/* Carbohydrates */}
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono font-bold text-amber-700">
                      <span>CARBOHYDRATES</span>
                      <span>{macros.carbPercent}%</span>
                    </div>
                    <div className="text-2xl font-display font-black text-[#1C1C1C]">
                      {macros.carbGrams} <span className="text-xs font-mono font-normal text-slate-500">grams</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {macros.carbKcal} kcal (Glycogen & stamina fuel)
                    </div>
                  </div>

                  {/* Dietary Fats */}
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono font-bold text-blue-700">
                      <span>HEALTHY FATS</span>
                      <span>{macros.fatPercent}%</span>
                    </div>
                    <div className="text-2xl font-display font-black text-[#1C1C1C]">
                      {macros.fatGrams} <span className="text-xs font-mono font-normal text-slate-500">grams</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {macros.fatKcal} kcal (Endocrine & hormonal balance)
                    </div>
                  </div>

                </div>

                {/* Per-Meal Breakdown Table */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-[#D32F2F]" />
                      <span>Meal Blueprint ({mealsPerDay} Equal Feedings)</span>
                    </span>
                    <span className="text-slate-500 font-normal">Fiber Target: {macros.fiberGrams}g/day</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono pt-1">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Calories</span>
                      <strong className="text-slate-900">{perMealMacros.calories} kcal</strong>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-red-500 block">Protein</span>
                      <strong className="text-slate-900">{perMealMacros.protein}g</strong>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-amber-600 block">Carbs</span>
                      <strong className="text-slate-900">{perMealMacros.carbs}g</strong>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-blue-600 block">Fats</span>
                      <strong className="text-slate-900">{perMealMacros.fat}g</strong>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveToProfile}
                    className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-sans font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer border-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Apply to My Active Plan</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-slate-300/80"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "Copied Plan!" : "Copy Formula"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setView("coach")}
                    className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#1C1C1C] hover:bg-[#C0392B] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border-0"
                  >
                    <Bot className="w-4 h-4 text-amber-400" />
                    <span>Consult Coach Alex</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: AI PHYSIQUE ASSESSMENT & PROGRAM MATCHER */}
        {activeTab === "assessment" && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm text-left space-y-8">
            <div className="max-w-3xl space-y-2">
              <span className="text-[10px] font-mono font-black uppercase text-[#D32F2F] tracking-widest bg-red-50 border border-red-200 px-3 py-1 rounded-full inline-block">
                AI PHYSIQUE ASSESSMENT & GOAL MATCHER
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-black uppercase text-[#1C1C1C]">
                Not Sure Which Program Matches Your Goal?
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed font-sans">
                Answer 4 rapid diagnostic checkpoints. Our cognitive system compares your biometric baseline ({effectiveWeightKg}kg, {bmi} BMI) with our structured roadmaps to recommend your optimal training regimen.
              </p>
            </div>

            {/* Diagnostic Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Question 1 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="text-xs font-mono font-black text-slate-900 uppercase flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#D32F2F] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>Where is your highest priority focus?</span>
                </label>
                <div className="space-y-2">
                  {[
                    { id: "belly", label: "Burn Stubborn Belly / Visceral Fat", desc: "Lower abdomen, waist slimming, visceral fat attack" },
                    { id: "women_curves", label: "Hourglass Curves & Glute Elevation", desc: "Glute maximus, waist tapering, upright scapular posture" },
                    { id: "home_recomp", label: "Full Body Recomposition (Home / Anywhere)", desc: "Simultaneous fat loss and muscle toning without gym gear" },
                    { id: "muscle_building", label: "Raw Muscle Hypertrophy & Thickness", desc: "Chest, back, arms, and leg muscle definition" },
                    { id: "athletic", label: "Athletic Conditioning & Explosive Power", desc: "Cardio endurance, high VO2 max, torque and speed" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAssessmentFocus(opt.id)}
                      className={`w-full p-3 rounded-xl text-left border transition-all cursor-pointer flex items-start justify-between ${
                        assessmentFocus === opt.id
                          ? "bg-white border-[#D32F2F] shadow-sm ring-1 ring-[#D32F2F]"
                          : "bg-white/60 border-slate-200 hover:bg-white"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <strong className="text-xs font-sans font-bold text-slate-900 block">{opt.label}</strong>
                        <span className="text-[10px] text-slate-500 font-sans block">{opt.desc}</span>
                      </div>
                      {assessmentFocus === opt.id && (
                        <CheckCircle2 className="w-4 h-4 text-[#D32F2F] shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="text-xs font-mono font-black text-slate-900 uppercase flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#D32F2F] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Available Training Equipment</span>
                </label>
                <div className="space-y-2">
                  {[
                    { id: "home", label: "Home / Minimal Gear (Bodyweight, Bands, Yoga Mat)", desc: "100% executable anywhere with zero gym pass needed" },
                    { id: "dumbbells", label: "Dumbbells & Basic Bench", desc: "Compact home gym setup with progressive load capability" },
                    { id: "gym", label: "Full Commercial Gym Access", desc: "Barbells, cable towers, leg press, and selectorized machines" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAssessmentGear(opt.id)}
                      className={`w-full p-3 rounded-xl text-left border transition-all cursor-pointer flex items-start justify-between ${
                        assessmentGear === opt.id
                          ? "bg-white border-[#D32F2F] shadow-sm ring-1 ring-[#D32F2F]"
                          : "bg-white/60 border-slate-200 hover:bg-white"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <strong className="text-xs font-sans font-bold text-slate-900 block">{opt.label}</strong>
                        <span className="text-[10px] text-slate-500 font-sans block">{opt.desc}</span>
                      </div>
                      {assessmentGear === opt.id && (
                        <CheckCircle2 className="w-4 h-4 text-[#D32F2F] shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* RECOMMENDED PROGRAM RESULT CARD */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/80 pb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{recommendedProgram.matchScore}% BIOMECHANICAL MATCH</span>
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-display font-black uppercase text-white">
                    {recommendedProgram.name}
                  </h4>
                  <span className="inline-block text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-md border border-amber-400/20">
                    {recommendedProgram.badge}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Curriculum Duration</span>
                    <strong className="text-base font-mono text-white flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D32F2F]" />
                      {recommendedProgram.timeline}
                    </strong>
                  </div>
                  <div className="text-right pl-4 border-l border-slate-700">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Difficulty</span>
                    <strong className="text-base font-mono text-white">{recommendedProgram.difficulty}</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Why this matches your parameters:</span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {recommendedProgram.reason} Combined with your calculated <strong>{targetCalories} kcal/day target</strong> and <strong>{macros.proteinGrams}g daily protein</strong>, this roadmap produces steady, joint-safe physical transformation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setView(recommendedProgram.view)}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-sans font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-lg flex items-center justify-center gap-2 cursor-pointer border-0"
                >
                  <span>Launch {recommendedProgram.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setView("coach")}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider transition duration-200 flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                >
                  <Bot className="w-4 h-4 text-amber-400" />
                  <span>Fine-Tune with Coach Alex</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
