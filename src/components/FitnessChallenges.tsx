import React from "react";
import Premium90DayChallenge from "./Premium90DayChallenge";

export default function FitnessChallenges({ initialChallengeId }: { initialChallengeId?: string } = {}) {
  return (
    <div id="fitness_challenges_root" className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Premium90DayChallenge initialChallengeId={initialChallengeId} />
    </div>
  );
}

