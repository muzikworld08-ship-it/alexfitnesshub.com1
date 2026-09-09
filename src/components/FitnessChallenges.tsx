import React, { useState } from "react";
import Premium90DayChallenge from "./Premium90DayChallenge";
import WorkoutChallengeDashboard from "./WorkoutChallengeDashboard";
import { Zap, Trophy, ShieldCheck, Flame } from "lucide-react";

export default function FitnessChallenges() {
  const [activeMode, setActiveMode] = useState<"engine" | "classic">("engine");

  return (
    <div id="fitness_challenges_root" className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* Challenge View Mode Selector Bar */}
      <div className="bg-neutral-900 border-b border-neutral-800 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 font-mono">
              ALEXFITNESSHUB CHALLENGE SUITE
            </span>
          </div>

          <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
            <button
              onClick={() => setActiveMode("engine")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeMode === "engine"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Workout Challenge Engine</span>
            </button>

            <button
              onClick={() => setActiveMode("classic")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeMode === "classic"
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Classic Challenge Hub</span>
            </button>
          </div>
        </div>
      </div>

      {activeMode === "engine" ? (
        <WorkoutChallengeDashboard />
      ) : (
        <div className="bg-slate-50 text-slate-900">
          <Premium90DayChallenge />
        </div>
      )}
    </div>
  );
}

