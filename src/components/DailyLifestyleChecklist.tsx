import React, { useState, useEffect } from "react";
import { 
  Droplets, 
  Clock, 
  Footprints, 
  Moon, 
  Check, 
  Sparkles, 
  Plus, 
  Minus, 
  Flame, 
  AlertCircle, 
  ChevronRight,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface DailyLifestyleHabits {
  walkAfterMeals: boolean;
  noEatingAfter730PM: boolean;
  water3Liters: boolean;
  sleep8Hours: boolean;
  waterAmountMl?: number;
  walkMinutes?: number;
}

interface DailyLifestyleChecklistProps {
  dateStr?: string;
  data: DailyLifestyleHabits;
  onToggle: (key: keyof DailyLifestyleHabits, customValue?: any) => void;
  className?: string;
  isCompact?: boolean;
}

export const DailyLifestyleChecklist: React.FC<DailyLifestyleChecklistProps> = ({
  dateStr = new Date().toISOString().split("T")[0],
  data,
  onToggle,
  className = "",
  isCompact = false
}) => {
  const [currentHour, setCurrentHour] = useState<number>(() => new Date().getHours());
  const [currentMinute, setCurrentMinute] = useState<number>(() => new Date().getMinutes());

  // Track real-time clock for the 7:30 PM cutoff notice
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentHour(now.getHours());
      setCurrentMinute(now.getMinutes());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const isPast730PM = currentHour > 19 || (currentHour === 19 && currentMinute >= 30);
  const waterMl = data.waterAmountMl ?? (data.water3Liters ? 3000 : 0);
  const waterPercent = Math.min(100, Math.round((waterMl / 3000) * 100));
  const isWaterDone = data.water3Liters || waterMl >= 3000;

  // Calculate completion percentage
  const habitsCount = 3; // Core 3: Water, 7:30 PM, Walking (+ optional Sleep)
  const completedCount = [
    isWaterDone,
    data.noEatingAfter730PM,
    data.walkAfterMeals
  ].filter(Boolean).length;

  const allCompleted = completedCount === 3;
  const scorePercent = Math.round((completedCount / habitsCount) * 100);

  const handleAddWater = (amount: number) => {
    const newAmount = Math.max(0, Math.min(5000, waterMl + amount));
    onToggle("waterAmountMl", newAmount);
    if (newAmount >= 3000 && !data.water3Liters) {
      onToggle("water3Liters", true);
    } else if (newAmount < 3000 && data.water3Liters) {
      onToggle("water3Liters", false);
    }
  };

  const formattedDate = new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  return (
    <div className={`bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden ${className}`}>
      
      {/* Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
              Daily Protocol
            </span>
            <span className="text-[11px] font-mono text-slate-300 font-semibold">
              {formattedDate}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white mt-1 flex items-center gap-2">
            <span>Daily Lifestyle Checklist</span>
            {allCompleted && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white font-mono lowercase">
                <Sparkles className="w-3 h-3" /> 100% complete
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Key non-negotiable habits for digestion, metabolism, and rapid recovery.
          </p>
        </div>

        {/* Score Ring / Bar */}
        <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-2xl border border-white/10 shrink-0">
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-300 uppercase font-bold">Discipline Score</div>
            <div className="text-base sm:text-lg font-black font-mono text-amber-400">
              {completedCount} / {habitsCount} <span className="text-xs text-white">({scorePercent}%)</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-amber-500/30 relative">
            <div 
              className={`w-3 h-3 rounded-full ${allCompleted ? "bg-emerald-400 shadow-xs shadow-emerald-400 animate-pulse" : "bg-amber-400"}`} 
            />
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
        <motion.div 
          className="bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${scorePercent}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Habits Grid */}
      <div className="p-5 sm:p-6 space-y-4">
        
        {/* Habit 1: 3 Liters Daily Clean Water */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
          isWaterDone 
            ? "bg-cyan-50/70 border-cyan-300 text-cyan-950 shadow-xs" 
            : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-900"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <button
                type="button"
                onClick={() => {
                  if (isWaterDone) {
                    onToggle("waterAmountMl", 0);
                    onToggle("water3Liters", false);
                  } else {
                    onToggle("waterAmountMl", 3000);
                    onToggle("water3Liters", true);
                  }
                }}
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition shrink-0 cursor-pointer ${
                  isWaterDone 
                    ? "bg-cyan-600 text-white shadow-xs" 
                    : "border-2 border-slate-300 bg-white hover:border-cyan-500"
                }`}
                title="Toggle 3L water complete"
              >
                {isWaterDone && <Check className="w-4 h-4 stroke-[3]" />}
              </button>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-tight flex items-center gap-1.5 text-cyan-900">
                    <Droplets className="w-4 h-4 text-cyan-600" />
                    3 Liters Daily Clean Water
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800 border border-cyan-200">
                    {waterMl} ml / 3000 ml ({waterPercent}%)
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Hydrate throughout morning and afternoon. Lubricates joints, flushes cellular waste, and curbs false hunger.
                </p>
              </div>
            </div>

            {/* Quick Water Step Buttons */}
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handleAddWater(-250)}
                disabled={waterMl <= 0}
                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-600 transition cursor-pointer"
                title="Subtract 250ml"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleAddWater(250)}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-mono text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                title="Add 1 glass (250ml)"
              >
                <Plus className="w-3 h-3" /> 250ml
              </button>
              <button
                type="button"
                onClick={() => handleAddWater(500)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white font-mono text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                title="Add 1 bottle (500ml)"
              >
                <Plus className="w-3 h-3" /> 500ml
              </button>
            </div>
          </div>

          {/* Liquid Gauge Bar */}
          <div className="mt-3 w-full bg-cyan-100/70 h-2 rounded-full overflow-hidden">
            <motion.div 
              className="bg-cyan-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${waterPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Habit 2: No Eating After 7:30 PM */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
          data.noEatingAfter730PM 
            ? "bg-amber-50/80 border-amber-300 text-amber-950 shadow-xs" 
            : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-900"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <button
                type="button"
                onClick={() => onToggle("noEatingAfter730PM")}
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition shrink-0 cursor-pointer ${
                  data.noEatingAfter730PM 
                    ? "bg-amber-600 text-white shadow-xs" 
                    : "border-2 border-slate-300 bg-white hover:border-amber-500"
                }`}
                title="Toggle 7:30 PM cutoff"
              >
                {data.noEatingAfter730PM && <Check className="w-4 h-4 stroke-[3]" />}
              </button>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-tight flex items-center gap-1.5 text-amber-950">
                    <Clock className="w-4 h-4 text-amber-600" />
                    No Eating After 7:30 PM Cut-off
                  </span>
                  {isPast730PM ? (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-600" /> Past 7:30 PM Window
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                      Dinner by 7:00 PM
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Finish all caloric intake by 7:30 PM. Allows 3-4 hours of gastric emptying before sleep, prevents acid reflux, and optimizes overnight fat oxidation.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggle("noEatingAfter730PM")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5 shrink-0 self-end sm:self-center cursor-pointer ${
                data.noEatingAfter730PM
                  ? "bg-amber-600 text-white shadow-xs hover:bg-amber-700"
                  : "bg-white border border-slate-300 text-slate-700 hover:bg-amber-50 hover:border-amber-400"
              }`}
            >
              {data.noEatingAfter730PM ? (
                <>
                  <Check className="w-3.5 h-3.5" /> 7:30 PM Locked
                </>
              ) : (
                <>
                  <span>Mark Fasting Started</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Habit 3: Daily Walking Goals (Post-Meal Walk) */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
          data.walkAfterMeals 
            ? "bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-xs" 
            : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-900"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <button
                type="button"
                onClick={() => onToggle("walkAfterMeals")}
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition shrink-0 cursor-pointer ${
                  data.walkAfterMeals 
                    ? "bg-emerald-600 text-white shadow-xs" 
                    : "border-2 border-slate-300 bg-white hover:border-emerald-500"
                }`}
                title="Toggle daily walking goal"
              >
                {data.walkAfterMeals && <Check className="w-4 h-4 stroke-[3]" />}
              </button>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-tight flex items-center gap-1.5 text-emerald-950">
                    <Footprints className="w-4 h-4 text-emerald-600" />
                    Daily Walking Goal (15-Min Post-Meal / 8,000 Steps)
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Glucose Thermal Walk
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Take a brisk 10 to 15 minute walk directly after principal meals. Blunts insulin spikes and drives glucose directly into muscle cells without insulin spikes.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggle("walkAfterMeals")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5 shrink-0 self-end sm:self-center cursor-pointer ${
                data.walkAfterMeals
                  ? "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700"
                  : "bg-white border border-slate-300 text-slate-700 hover:bg-emerald-50 hover:border-emerald-400"
              }`}
            >
              {data.walkAfterMeals ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Walk Completed
                </>
              ) : (
                <>
                  <span>Mark Walk Done</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Habit 4: 7-8 Hours Restorative Sleep */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
          data.sleep8Hours 
            ? "bg-indigo-50/80 border-indigo-300 text-indigo-950 shadow-xs" 
            : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-900"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <button
                type="button"
                onClick={() => onToggle("sleep8Hours")}
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition shrink-0 cursor-pointer ${
                  data.sleep8Hours 
                    ? "bg-indigo-600 text-white shadow-xs" 
                    : "border-2 border-slate-300 bg-white hover:border-indigo-500"
                }`}
                title="Toggle restorative sleep goal"
              >
                {data.sleep8Hours && <Check className="w-4 h-4 stroke-[3]" />}
              </button>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-tight flex items-center gap-1.5 text-indigo-950">
                    <Moon className="w-4 h-4 text-indigo-600" />
                    7 to 8 Hours Restorative Sleep
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200">
                    CNS & Muscle Repair
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Keep sleeping area cool and dark. Crucial for human growth hormone (HGH) release and physical muscle reconstruction.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggle("sleep8Hours")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5 shrink-0 self-end sm:self-center cursor-pointer ${
                data.sleep8Hours
                  ? "bg-indigo-600 text-white shadow-xs hover:bg-indigo-700"
                  : "bg-white border border-slate-300 text-slate-700 hover:bg-indigo-50 hover:border-indigo-400"
              }`}
            >
              {data.sleep8Hours ? (
                <>
                  <Check className="w-3.5 h-3.5" /> 8 Hrs Logged
                </>
              ) : (
                <>
                  <span>Mark Sleep Logged</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Motivational completion footer */}
      {allCompleted && (
        <div className="p-4 bg-emerald-50 border-t border-emerald-200 text-emerald-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Outstanding discipline! All daily lifestyle protocols locked in for today.</span>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md shrink-0">
            Day Streak Active
          </span>
        </div>
      )}

    </div>
  );
};
