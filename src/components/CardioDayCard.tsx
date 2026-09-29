import React, { useState } from "react";
import { 
  Footprints, 
  Flame, 
  Clock, 
  Heart, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  Compass, 
  Play, 
  Pause, 
  RotateCcw,
  Zap
} from "lucide-react";
import { recordDailyWorkoutCompletion } from "../utils/programWaitManager";

interface CardioDayCardProps {
  programId: string;
  programName: string;
  dayNumber: number;
  totalDays?: number;
  isCompleted?: boolean;
  distanceKm?: number;
  onComplete?: () => void;
  accentColor?: string;
  notes?: string;
}

export default function CardioDayCard({
  programId,
  programName,
  dayNumber,
  totalDays = 90,
  isCompleted = false,
  distanceKm = 5,
  onComplete,
  accentColor = "#D32F2F",
  notes
}: CardioDayCardProps) {
  const [completed, setCompleted] = useState(isCompleted);
  const [selectedDistance, setSelectedDistance] = useState<number>(distanceKm);
  const [selectedActivity, setSelectedActivity] = useState<"run" | "walk" | "interval" | "cycling">("run");
  
  // Lightweight interactive workout stopwatch
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  React.useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMarkComplete = () => {
    setIsRunning(false);
    setCompleted(true);
    recordDailyWorkoutCompletion(programId, dayNumber);
    if (onComplete) {
      onComplete();
    }
  };

  const estimatedCalories = Math.round(selectedDistance * 75);

  return (
    <div 
      id={`cardio-day-card-day-${dayNumber}`}
      className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-200/80 bg-white shadow-xl transition-all duration-300"
    >
      {/* Visual Header featuring Cardio Trail Running Image */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] bg-slate-950 overflow-hidden flex items-center justify-center">
        <img 
          src="/images/cardio-day.jpg" 
          alt="Athletic woman trail running on scenic dirt path in sunny forest" 
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105 transition-transform duration-700 hover:scale-105"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />

        {/* Cinematic Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg border border-emerald-400/30">
              <Footprints className="w-3.5 h-3.5 fill-white" />
              AEROBIC CARDIO & STAMINA
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

        {/* Bottom Title on Overlay */}
        <div className="absolute bottom-4 left-5 right-5 z-10">
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase font-sans tracking-tight drop-shadow-md">
            {selectedDistance} Kilometer Cardio Protocol
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl mt-1 drop-shadow-xs">
            No weightlifting exercises today. Focus purely on aerobic output, steady mitochondrial respiration, and cardiovascular fat oxidation.
          </p>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 sm:p-8 space-y-6">

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-mono font-bold uppercase mb-1">
              <Footprints className="w-3.5 h-3.5" /> Distance
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-950">
              {selectedDistance} KM
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-700 text-xs font-mono font-bold uppercase mb-1">
              <Flame className="w-3.5 h-3.5 fill-amber-500" /> Est. Burn
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-amber-950">
              ~{estimatedCalories} kcal
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-center">
            <div className="flex items-center justify-center gap-1 text-rose-700 text-xs font-mono font-bold uppercase mb-1">
              <Heart className="w-3.5 h-3.5 fill-rose-500" /> Target Zone
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-rose-950">
              Zone 2 (65-75%)
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200/80 text-center">
            <div className="flex items-center justify-center gap-1 text-blue-700 text-xs font-mono font-bold uppercase mb-1">
              <Clock className="w-3.5 h-3.5" /> Duration
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-blue-950">
              35 - 50 mins
            </div>
          </div>
        </div>

        {/* Activity & Distance Selection */}
        <div className="rounded-2xl p-5 border border-slate-200 bg-slate-50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-mono font-black uppercase text-slate-800 tracking-wider">
              Choose Cardio Modality
            </span>
            <div className="flex items-center gap-2">
              {[
                { id: "run", label: "Trail / Road Run" },
                { id: "walk", label: "Power Walk" },
                { id: "cycling", label: "Cycling" },
                { id: "interval", label: "HIIT Intervals" }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedActivity(opt.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                    selectedActivity === opt.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Distance pills */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
            <span className="text-[11px] font-mono text-slate-500 font-bold uppercase">Target Distance:</span>
            {[3, 5, 8, 10].map(km => (
              <button
                key={km}
                type="button"
                onClick={() => setSelectedDistance(km)}
                className={`px-3 py-1 rounded-md text-xs font-mono font-bold cursor-pointer ${
                  selectedDistance === km 
                    ? "bg-emerald-600 text-white shadow-xs" 
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {km} KM
              </button>
            ))}
          </div>
        </div>

        {/* Active Session Stopwatch & Action Banner */}
        <div className="rounded-2xl p-5 bg-gradient-to-r from-slate-900 to-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/10 border border-white/10 font-mono text-2xl font-black text-emerald-400">
              {formatTimer(timerSeconds)}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider">
                Active Session Stopwatch
              </span>
              <span className="text-xs text-slate-200 font-semibold">
                {isRunning ? "Session in Progress (Tracking Time)..." : timerSeconds > 0 ? "Session Paused" : "Ready to Start"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {!isRunning ? (
              <button
                type="button"
                onClick={() => setIsRunning(true)}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Start Timer
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsRunning(false)}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <Pause className="w-3.5 h-3.5 fill-white" /> Pause
              </button>
            )}

            {timerSeconds > 0 && (
              <button
                type="button"
                onClick={() => { setIsRunning(false); setTimerSeconds(0); }}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleMarkComplete}
              disabled={completed}
              className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold font-sans text-xs uppercase tracking-wider shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all ${
                completed
                  ? "bg-emerald-600 text-white cursor-default"
                  : "bg-[#D32F2F] hover:bg-[#B71C1C] text-white hover:shadow-lg active:scale-98"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {completed ? "Cardio Completed ✓" : "Complete Cardio Day"}
            </button>
          </div>
        </div>

        {/* Tactical Guidance */}
        <div className="grid sm:grid-cols-3 gap-3 text-left">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
            <span className="text-[10px] font-mono text-emerald-600 font-black uppercase">Pacing Strategy</span>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Maintain an easy conversation pace. You should be able to speak in complete sentences without gasping.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
            <span className="text-[10px] font-mono text-blue-600 font-black uppercase">Hydration Tip</span>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Take small sips of water every 15 minutes. Hydrate with 500ml water 30 minutes before stepping out.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
            <span className="text-[10px] font-mono text-purple-600 font-black uppercase">Post-Run Stretch</span>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Spend 5 minutes stretching calves, hip flexors, and hamstrings immediately upon finishing your distance.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
