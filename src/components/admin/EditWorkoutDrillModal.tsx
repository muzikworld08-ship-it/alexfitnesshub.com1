import React, { useState, useEffect } from "react";
import { X, Save, Dumbbell, Clock, ShieldCheck, Check, Sparkles, Layers } from "lucide-react";
import { ChallengeExerciseItem } from "../../types/challengeEngine";
import UnifiedExerciseMedia from "../UnifiedExerciseMedia";

interface EditWorkoutDrillModalProps {
  isOpen: boolean;
  exercise: ChallengeExerciseItem | null;
  onClose: () => void;
  onSave: (updated: ChallengeExerciseItem) => void;
  currentTier?: "all" | "beginner" | "intermediate" | "advanced";
}

export default function EditWorkoutDrillModal({
  isOpen,
  exercise,
  onClose,
  onSave,
  currentTier = "all"
}: EditWorkoutDrillModalProps) {
  if (!isOpen || !exercise) return null;

  const [sets, setSets] = useState<number>(Number(exercise.sets) || 3);
  const [reps, setReps] = useState<string>(String(exercise.reps || "10-12 reps"));
  const [restTime, setRestTime] = useState<string>(exercise.restTime || "60s");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">(
    (exercise.difficulty as any) || (currentTier !== "all" ? (currentTier.charAt(0).toUpperCase() + currentTier.slice(1)) as any : "Intermediate")
  );
  const [equipment, setEquipment] = useState<string>(
    Array.isArray(exercise.equipment) ? exercise.equipment.join(", ") : String(exercise.equipment || "Bodyweight")
  );
  const [muscleGroup, setMuscleGroup] = useState<string>(
    Array.isArray(exercise.muscleGroup) ? exercise.muscleGroup.join(", ") : String(exercise.muscleGroup || exercise.category || "Full Body")
  );
  const [coachingCues, setCoachingCues] = useState<string>(
    exercise.coachingCues?.[0] || exercise.instructions?.[0] || "Execute with strict posture, full control, and controlled eccentric tempo."
  );

  useEffect(() => {
    if (exercise) {
      setSets(Number(exercise.sets) || 3);
      setReps(String(exercise.reps || "10-12 reps"));
      setRestTime(exercise.restTime || "60s");
      setDifficulty(
        (exercise.difficulty as any) || (currentTier !== "all" ? (currentTier.charAt(0).toUpperCase() + currentTier.slice(1)) as any : "Intermediate")
      );
      setEquipment(
        Array.isArray(exercise.equipment) ? exercise.equipment.join(", ") : String(exercise.equipment || "Bodyweight")
      );
      setMuscleGroup(
        Array.isArray(exercise.muscleGroup) ? exercise.muscleGroup.join(", ") : String(exercise.muscleGroup || exercise.category || "Full Body")
      );
      setCoachingCues(
        exercise.coachingCues?.[0] || exercise.instructions?.[0] || "Execute with strict posture, full control, and controlled eccentric tempo."
      );
    }
  }, [exercise, currentTier]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exercise) return;

    const updated: ChallengeExerciseItem = {
      ...exercise,
      sets: Math.max(1, Math.min(10, Number(sets) || 3)),
      reps: reps.trim() || "10-12 reps",
      restTime: restTime.trim() || "60s",
      difficulty: difficulty as any,
      equipment: equipment.split(",").map(e => e.trim()).filter(Boolean),
      muscleGroup: muscleGroup.split(",").map(m => m.trim()).filter(Boolean),
      coachingCues: [coachingCues.trim()],
      instructions: [coachingCues.trim()]
    };

    onSave(updated);
  };

  const REP_PRESETS = [
    { label: "10-12 reps", tier: "Beginner" },
    { label: "8-10 heavy reps", tier: "Intermediate" },
    { label: "6-8 peak overload", tier: "Advanced" },
    { label: "12-15 hypertrophy", tier: "Intermediate" },
    { label: "15-20 endurance", tier: "Beginner" },
    { label: "30-45s isometric hold", tier: "All" }
  ];

  const REST_PRESETS = ["30s", "45s", "60s", "90s", "120s"];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-neutral-900 border border-neutral-700 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-black text-white truncate">
                Edit Drill Parameters
              </h3>
              <p className="text-xs text-neutral-400 truncate">
                {exercise.exerciseName} • Tier: <span className="font-bold text-amber-400">{currentTier.toUpperCase()}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Media & Drill Overview */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="w-16 h-16 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
              <UnifiedExerciseMedia
                exerciseId={exercise.id}
                exerciseName={exercise.exerciseName}
                mediaUrl={exercise.gifUrl}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-black text-white truncate">{exercise.exerciseName}</h4>
              <p className="text-xs text-neutral-400 mt-0.5">{exercise.category} • {exercise.equipment || "Bodyweight"}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/60 font-bold">
                  Active Tier: {currentTier.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                  {exercise.difficulty || "Standard"}
                </span>
              </div>
            </div>
          </div>

          {/* Difficulty Tier Radio Buttons */}
          <div>
            <label className="text-xs font-bold text-neutral-300 mb-1.5 block flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Prescribed Difficulty Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Beginner", "Intermediate", "Advanced"] as const).map(tier => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setDifficulty(tier)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                    difficulty === tier
                      ? tier === "Beginner"
                        ? "bg-emerald-950 border-emerald-500 text-emerald-200 ring-1 ring-emerald-400"
                        : tier === "Advanced"
                        ? "bg-rose-950 border-rose-500 text-rose-200 ring-1 ring-rose-400"
                        : "bg-amber-950 border-amber-500 text-amber-200 ring-1 ring-amber-400"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Sets and Reps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-300 mb-1 block">Number of Sets</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={sets}
                  onChange={(e) => setSets(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm font-bold focus:outline-none focus:border-blue-500"
                />
                <span className="text-xs text-neutral-400 font-bold shrink-0">Sets</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 mb-1 block">Rest Interval</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={restTime}
                  onChange={(e) => setRestTime(e.target.value)}
                  placeholder="e.g. 60s"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm font-bold focus:outline-none focus:border-blue-500"
                />
                <Clock className="w-4 h-4 text-neutral-500 shrink-0" />
              </div>
            </div>
          </div>

          {/* Rest Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-neutral-500 mr-1">Quick Rest:</span>
            {REST_PRESETS.map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => setRestTime(preset)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border transition cursor-pointer ${
                  restTime === preset
                    ? "bg-blue-950 border-blue-500 text-blue-300"
                    : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Rep Scheme */}
          <div>
            <label className="text-xs font-bold text-neutral-300 mb-1 block">Rep Scheme / Duration</label>
            <input
              type="text"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="e.g. 10-12 reps, 8-10 heavy reps, 45s continuous"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm font-bold focus:outline-none focus:border-blue-500"
            />
            {/* Quick Rep Presets */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              <span className="text-[11px] text-neutral-500 mr-1">Presets:</span>
              {REP_PRESETS.map(preset => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setReps(preset.label)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border transition cursor-pointer ${
                    reps === preset.label
                      ? "bg-blue-950 border-blue-500 text-blue-300"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Muscle Group and Equipment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-300 mb-1 block">Target Muscle Focus</label>
              <input
                type="text"
                value={muscleGroup}
                onChange={(e) => setMuscleGroup(e.target.value)}
                placeholder="e.g. Chest, Triceps"
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-300 mb-1 block">Equipment Required</label>
              <input
                type="text"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                placeholder="e.g. Dumbbell, Barbell, Bodyweight"
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Coaching Cues / Form Instructions */}
          <div>
            <label className="text-xs font-bold text-neutral-300 mb-1 block flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Form Tips & Coaching Cues for this Drill
            </label>
            <textarea
              rows={2}
              value={coachingCues}
              onChange={(e) => setCoachingCues(e.target.value)}
              placeholder="e.g. Retract scapula, maintain controlled descent, breathe out on exertion..."
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/30"
            >
              <Save className="w-4 h-4" />
              <span>Save Drill Parameters</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
