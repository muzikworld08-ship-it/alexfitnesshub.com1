import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  Clock, 
  Sparkles, 
  Ban, 
  Moon, 
  Trophy, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw,
  Flame,
  ShieldCheck,
  Zap
} from "lucide-react";
import { formatRemainingTime, clearProgramWaitState } from "../utils/programWaitManager";
import ResendEmailWidget from "./ResendEmailWidget";

interface ProgramCooldownWaitingScreenProps {
  programId: string;
  programName: string;
  completedDay: number;
  nextDay: number;
  nextUnlockAt: number;
  onReviewTodayWorkout?: () => void;
  onUnlocked?: () => void;
}

export default function ProgramCooldownWaitingScreen({
  programId,
  programName,
  completedDay,
  nextDay,
  nextUnlockAt,
  onReviewTodayWorkout,
  onUnlocked
}: ProgramCooldownWaitingScreenProps) {
  const [remainingMs, setRemainingMs] = useState<number>(() => Math.max(0, nextUnlockAt - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(0, nextUnlockAt - Date.now());
      setRemainingMs(diff);
      if (diff <= 0) {
        clearInterval(interval);
        if (onUnlocked) onUnlocked();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextUnlockAt, onUnlocked]);

  const handleBypassForTesting = () => {
    clearProgramWaitState(programId);
    if (onUnlocked) onUnlocked();
  };

  return (
    <div 
      id="program-cooldown-waiting-screen"
      className="w-full max-w-4xl mx-auto my-8 px-4 sm:px-6"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 text-white shadow-2xl overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-red-600/15 via-amber-500/10 to-transparent pointer-events-none" />

        {/* Status Header */}
        <div className="relative text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Day {completedDay} Completed &bull; Recovery Cooldown Active</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black font-sans uppercase tracking-tight text-white">
            Congratulations On Crushing Today's Workout!
          </h2>
          
          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            You pushed through today's challenge in <strong className="text-white">{programName}</strong>. 
            To trigger deep muscular adaptation and maximize metabolic fat burning, your next routine is locked for a <strong>5-hour recovery window</strong>.
          </p>
        </div>

        {/* 5-Hour Countdown Card */}
        <div className="bg-gradient-to-b from-neutral-950 to-neutral-900/90 border border-amber-500/40 rounded-2xl p-6 sm:p-8 text-center mb-8 shadow-inner relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Clock className="w-4 h-4" />
            <span>5-Hour System Cooldown in Progress</span>
          </div>

          <div className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white my-3 drop-shadow-md">
            {formatRemainingTime(remainingMs)}
          </div>

          <p className="text-xs sm:text-sm text-amber-200/90 max-w-lg mx-auto font-medium">
            🌅 Tomorrow morning (or once this 5-hour rest window concludes), <strong>Day {nextDay}</strong> will be unlocked and waiting for you to crush!
          </p>

          <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-center gap-6 text-xs text-neutral-400 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Progress Saved to Cloud
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Day {nextDay} Queued
            </span>
          </div>
        </div>

        {/* MANDATORY COACHING DIRECTIVES: CUT OUT SUGAR & NO LATE NIGHT EATING */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-xs font-mono font-bold uppercase tracking-wider text-red-400">
            <Sparkles className="w-4 h-4" />
            <span>Coach Alex's Mandatory Post-Workout Directives</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Directive 1: Cut Out Sugar */}
            <div className="bg-neutral-950/80 border border-red-900/40 rounded-2xl p-5 hover:border-red-500/40 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                  <Ban className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider">Protocol #1</span>
                  <h4 className="text-base font-black uppercase text-white">Strictly Cut Out Sugar</h4>
                </div>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Eliminate all added sugars, fruit juices, sodas, pastries, and candy. High circulating insulin prevents your mitochondria from accessing stored body fat for fuel. Keep your insulin low to lock in continuous fat oxidation.
              </p>
            </div>

            {/* Directive 2: No Late-Night Eating */}
            <div className="bg-neutral-950/80 border border-amber-900/40 rounded-2xl p-5 hover:border-amber-500/40 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">Protocol #2</span>
                  <h4 className="text-base font-black uppercase text-white">No Late-Night Eating</h4>
                </div>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Cease eating completely after 7:30 PM. Sleeping on an empty stomach triggers human growth hormone (HGH) release, supports cellular autophagy, and converts your sleep into an active fat-shredding cycle.
              </p>
            </div>
          </div>
        </div>

        {/* Resend Email Notification Widget */}
        <div className="mb-8">
          <ResendEmailWidget
            programName={programName}
            dayNumber={completedDay}
            defaultSubject={`🎉 Day ${completedDay} Completed - ${programName} Protocol`}
          />
        </div>

        {/* Actions / Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-800">
          {onReviewTodayWorkout && (
            <button
              type="button"
              onClick={onReviewTodayWorkout}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Review Day {completedDay} Completed Drills</span>
            </button>
          )}

          <div className="w-full sm:w-auto flex items-center justify-end gap-3 text-right">
            <button
              type="button"
              onClick={handleBypassForTesting}
              className="text-[11px] font-mono text-neutral-500 hover:text-neutral-300 underline cursor-pointer"
              title="Instantly bypass the 5-hour wait period for testing"
            >
              [Admin / Test Bypass: Unlock Next Day Now]
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
