import React, { useState } from "react";
import { 
  Moon, 
  Sparkles, 
  CheckCircle2, 
  Droplets, 
  BedDouble, 
  Utensils, 
  Heart,
  ShieldCheck,
  Calendar,
  Flame,
  Clock
} from "lucide-react";
import { recordDailyWorkoutCompletion } from "../utils/programWaitManager";

interface RestDayCardProps {
  programId: string;
  programName: string;
  dayNumber: number;
  totalDays?: number;
  isCompleted?: boolean;
  onComplete?: () => void;
  accentColor?: string;
  notes?: string;
}

export default function RestDayCard({
  programId,
  programName,
  dayNumber,
  totalDays = 90,
  isCompleted = false,
  onComplete,
  accentColor = "#2563EB",
  notes
}: RestDayCardProps) {
  const [completed, setCompleted] = useState(isCompleted);
  const [isHovered, setIsHovered] = useState(false);

  const handleMarkComplete = () => {
    setCompleted(true);
    recordDailyWorkoutCompletion(programId, dayNumber);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div 
      id={`rest-day-card-day-${dayNumber}`}
      className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-200/80 bg-white shadow-xl transition-all duration-300"
    >
      {/* Visual Header featuring user-provided Rest Day Sticker */}
      <div className="relative w-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-10 flex flex-col items-center justify-center overflow-hidden">
        {/* Ambient glow behind sticker */}
        <div className="absolute inset-0 bg-radial from-amber-500/10 via-rose-500/5 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="w-full flex items-center justify-between z-10 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg border border-blue-400/30">
              <Moon className="w-3.5 h-3.5 fill-white" />
              REST & CELLULAR RECOVERY
            </span>
            <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-slate-200 text-xs font-mono font-bold border border-white/10">
              Day {dayNumber} of {totalDays}
            </span>
          </div>

          {completed && (
            <span className="px-3.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg">
              <CheckCircle2 className="w-4 h-4" /> COMPLETED
            </span>
          )}
        </div>

        {/* User Rest Day Artwork */}
        <div className="relative z-10 max-w-xs sm:max-w-sm flex items-center justify-center py-2">
          <img 
            src="/assets/aistudio/image_68aeee33.png" 
            alt="Today is my rest day" 
            className="w-full h-auto max-h-[340px] object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Bottom Title on Overlay */}
        <div className="w-full text-center z-10 mt-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-sans tracking-tight drop-shadow-md">
            Scheduled Rest & Recovery
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto mt-1 drop-shadow-xs">
            Zero weightlifting or workout drills today. Pure rest, active recovery, and cellular supercompensation.
          </p>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Notice Banner */}
        <div className="rounded-2xl p-5 bg-blue-50 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-900 font-black text-sm uppercase font-mono">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Growth Happens During Rest</span>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed font-medium">
              Muscles do not grow in the gym—they break down under load and synthesize new protein during deep sleep and rest. Enjoy today's decompression!
            </p>
          </div>

          <button
            type="button"
            onClick={handleMarkComplete}
            disabled={completed}
            className={`px-6 py-3 rounded-xl font-bold font-sans text-xs uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer shrink-0 flex items-center gap-2 ${
              completed
                ? "bg-emerald-600 text-white cursor-default"
                : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg active:scale-98"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {completed ? "Rest Day Logged ✓" : "Log Rest Day as Completed"}
          </button>
        </div>

        {/* 4 Pillars of Rest & Recovery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Pillar 1 */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Droplets className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black uppercase text-slate-900 tracking-wide">
              Electrolyte Hydration
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Drink 3 to 4 liters of water today. Add a pinch of sea salt or lemon to rehydrate fascial tissue and joints.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Utensils className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black uppercase text-slate-900 tracking-wide">
              Anabolic Nutrition
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Prioritize clean whole-food protein (1.6g to 2.2g per kg) to supply amino acids for muscle tissue synthesis.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <BedDouble className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black uppercase text-slate-900 tracking-wide">
              8h Restorative Sleep
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Aim for 8 to 9 hours of quality sleep. Turn off screens 60 minutes before bed to maximize natural growth hormone.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black uppercase text-slate-900 tracking-wide">
              Gentle Active Walk
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Take an easy 15–20 minute relaxing walk outdoors in fresh air to flush lactic acid without elevating cortisol.
            </p>
          </div>
        </div>

        {/* Coach alex directive */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-black tracking-wider">Coach Alex Guidance</span>
            <p className="text-xs text-slate-300 font-medium">
              "Respect the rest day as much as the heaviest lift. Champions are built through disciplined recovery."
            </p>
          </div>
          <span className="text-xs font-mono font-black text-amber-400 shrink-0">
            DAY {dayNumber} OF {totalDays}
          </span>
        </div>

      </div>
    </div>
  );
}
