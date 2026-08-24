import React from "react";
import { useApp } from "../context/AppContext";
import { 
  Play, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Trophy, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Activity,
  BookmarkCheck
} from "lucide-react";
import { motion } from "motion/react";
import { ProgramProgressItem } from "../types";

interface ContinueProgramTrackerProps {
  compact?: boolean;
  onNavigate?: (view: string) => void;
}

export default function ContinueProgramTracker({ compact = false, onNavigate }: ContinueProgramTrackerProps) {
  const { 
    programProgress, 
    resumeProgram, 
    setView, 
    getActiveEnrolledPrograms,
    enrollProgram
  } = useApp();

  const activePrograms = getActiveEnrolledPrograms();

  const handleResume = (item: ProgramProgressItem) => {
    if (onNavigate) {
      onNavigate(item.viewName || (item.programId === "90_day_immortal" ? "challenges" : item.programId === "belly_fat_shred" ? "belly-fat-shred" : "lifestyle-academy"));
    } else {
      resumeProgram(item.programId);
    }
  };

  const handleEnrollOrResume = (programId: string, title: string, viewName: string) => {
    if (!programProgress[programId]) {
      enrollProgram(programId, { programTitle: title, viewName });
    }
    if (onNavigate) {
      onNavigate(viewName);
    } else {
      setView(viewName);
    }
  };

  if (activePrograms.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#D32F2F]/10 text-[#D32F2F] flex items-center justify-center mx-auto">
          <BookmarkCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-black uppercase tracking-tight text-slate-900 font-sans">
            Start Your First Training Program
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 font-semibold">
            Choose an elite transformation challenge below. Your exact workout stopping point and progress will be tracked automatically across sessions.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => handleEnrollOrResume("90_day_immortal", "90 Days Immortal Challenge", "challenges")}
            className="px-4 py-2.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow-sm cursor-pointer inline-flex items-center gap-2"
          >
            <Flame className="w-4 h-4" />
            <span>90 Days Immortal</span>
          </button>
          <button
            onClick={() => handleEnrollOrResume("belly_fat_shred", "Belly Fat Shred", "belly-fat-shred")}
            className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow-sm cursor-pointer inline-flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            <span>Belly Fat Shred</span>
          </button>
          <button
            onClick={() => handleEnrollOrResume("lifestyle_academy", "Lifestyle Academy", "lifestyle-academy")}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider rounded-xl transition border border-slate-250 cursor-pointer inline-flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            <span>Lifestyle Academy</span>
          </button>
        </div>
      </div>
    );
  }

  // Primary top program (most recently stopped / active)
  const primaryProgram = activePrograms[0];
  const otherPrograms = activePrograms.slice(1);

  return (
    <div className="space-y-4 w-full">
      {/* Primary Highlighted Resume Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-red-950 border border-slate-800 text-white p-5 sm:p-7 shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D32F2F]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left Thumbnail + Meta */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5 w-full md:w-auto">
            {primaryProgram.imageUrl && (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-700/80 shadow-md relative bg-slate-800">
                <img 
                  src={primaryProgram.imageUrl} 
                  alt={primaryProgram.programTitle} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 bg-[#D32F2F] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded">
                  Day {primaryProgram.currentDay || 1}
                </div>
              </div>
            )}

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/20 border border-red-500/30 text-red-300 text-[9px] font-black uppercase tracking-wider">
                  <Flame className="w-3 h-3" />
                  Active Program
                </span>
                {primaryProgram.category && (
                  <span className="text-[9px] font-mono text-slate-400 uppercase">
                    • {primaryProgram.category}
                  </span>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-sans font-black uppercase tracking-tight text-white truncate">
                {primaryProgram.programTitle}
              </h3>

              <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-slate-300">Stopped At:</span>
                <span className="text-amber-300 font-bold truncate max-w-xs sm:max-w-md">
                  {primaryProgram.lastStoppedWorkoutName || `Day ${primaryProgram.currentDay || 1} Workout`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="pt-1.5 max-w-md space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-300">
                  <span>Progress Completion</span>
                  <span className="font-bold text-white">{primaryProgram.progressPercent || 0}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                  <div 
                    className="h-full bg-gradient-to-r from-[#D32F2F] to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, primaryProgram.progressPercent || 5)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={() => handleResume(primaryProgram)}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-lg hover:shadow-red-600/30 cursor-pointer inline-flex items-center justify-center gap-2.5 group"
            >
              <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              <span>Continue Where You Stopped</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <span className="text-[10px] text-slate-400 font-mono text-center md:text-right">
              {primaryProgram.completedWorkoutIds?.length || 0} of {primaryProgram.totalWorkouts || 90} sessions completed
            </span>
          </div>
        </div>
      </motion.div>

      {/* Other Enrolled Programs Grid (if more than 1) */}
      {otherPrograms.length > 0 && !compact && (
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 px-1 font-sans">
            Other Active Programs
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {otherPrograms.map((prog) => (
              <div 
                key={prog.programId}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 flex items-center justify-between gap-4 transition shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {prog.imageUrl && (
                    <img 
                      src={prog.imageUrl} 
                      alt={prog.programTitle} 
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-100"
                    />
                  )}
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 uppercase truncate">
                      {prog.programTitle}
                    </h5>
                    <p className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">
                      Stopped at: <span className="text-[#D32F2F] font-bold">{prog.lastStoppedWorkoutName}</span>
                    </p>
                    <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400 mt-1">
                      <span>Day {prog.currentDay || 1}</span>
                      <span>•</span>
                      <span>{prog.progressPercent || 0}% Done</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleResume(prog)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition shrink-0 cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
