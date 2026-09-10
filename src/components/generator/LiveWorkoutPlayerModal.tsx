import React, { useState, useEffect, useRef } from "react";
import {
  X, Play, Pause, RotateCcw, Check, CheckCircle2, ChevronLeft, ChevronRight,
  Volume2, VolumeX, Award, Flame, Clock, Dumbbell, Sparkles, ShieldCheck, HeartPulse
} from "lucide-react";
import { AIDailyWorkoutPlan, DailyWorkoutExerciseItem } from "../../types/dailyWorkout";
import { recordDailyWorkoutCompletion } from "../../utils/programWaitManager";

interface LiveWorkoutPlayerModalProps {
  workout: AIDailyWorkoutPlan;
  onClose: () => void;
  onWorkoutCompleted?: (stats: { completedAt: string; totalExercises: number; estimatedCalories: string }) => void;
}

export default function LiveWorkoutPlayerModal({
  workout,
  onClose,
  onWorkoutCompleted
}: LiveWorkoutPlayerModalProps) {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [completedSetsByExercise, setCompletedSetsByExercise] = useState<Record<number, boolean[]>>({});
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number | null>(null);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);

  const exercises = workout.exercises || [];
  const currentExercise: DailyWorkoutExerciseItem | undefined = exercises[currentExerciseIdx];

  // Initialize set checkboxes
  useEffect(() => {
    const initial: Record<number, boolean[]> = {};
    exercises.forEach((ex, idx) => {
      const setsCount = typeof ex.sets === "number" ? Math.max(1, ex.sets) : 3;
      initial[idx] = new Array(setsCount).fill(false);
    });
    setCompletedSetsByExercise(initial);
  }, [workout]);

  // Overall workout elapsed timer
  useEffect(() => {
    if (isFinished || isTimerPaused) return;
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isFinished, isTimerPaused]);

  // Rest countdown timer
  useEffect(() => {
    if (!isRestTimerActive || restSecondsRemaining === null || restSecondsRemaining <= 0) {
      if (restSecondsRemaining === 0) {
        playBeepChime();
        setIsRestTimerActive(false);
        setRestSecondsRemaining(null);
      }
      return;
    }

    restTimerRef.current = setInterval(() => {
      setRestSecondsRemaining(prev => {
        if (prev === null || prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [isRestTimerActive, restSecondsRemaining]);

  // Web Audio API chime
  const playBeepChime = () => {
    if (!isSoundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Pleasant 2-tone melodic chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc1.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.3); // E6
      gain1.gain.setValueAtTime(0.2, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start();
      osc1.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn("Audio chime unavailable:", e);
    }
  };

  const toggleSetCompleted = (setIdx: number) => {
    const currentSets = completedSetsByExercise[currentExerciseIdx] || [];
    const updated = [...currentSets];
    const willBeCompleted = !updated[setIdx];
    updated[setIdx] = willBeCompleted;

    setCompletedSetsByExercise(prev => ({
      ...prev,
      [currentExerciseIdx]: updated
    }));

    // Trigger rest timer if set was completed
    if (willBeCompleted && currentExercise) {
      const rest = currentExercise.restSeconds || 60;
      setRestSecondsRemaining(rest);
      setIsRestTimerActive(true);
    }
  };

  const handleNext = () => {
    if (currentExerciseIdx < exercises.length - 1) {
      setCurrentExerciseIdx(prev => prev + 1);
      setIsRestTimerActive(false);
      setRestSecondsRemaining(null);
    } else {
      handleCompleteWorkout();
    }
  };

  const handlePrev = () => {
    if (currentExerciseIdx > 0) {
      setCurrentExerciseIdx(prev => prev - 1);
      setIsRestTimerActive(false);
      setRestSecondsRemaining(null);
    }
  };

  const handleCompleteWorkout = () => {
    setIsFinished(true);
    setIsRestTimerActive(false);

    // Record completion in programWaitManager
    if (workout.programType) {
      recordDailyWorkoutCompletion(workout.programType, workout.dayNumber || 1);
    }

    if (onWorkoutCompleted) {
      onWorkoutCompleted({
        completedAt: new Date().toISOString(),
        totalExercises: exercises.length,
        estimatedCalories: workout.estimatedCalories
      });
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentSets = completedSetsByExercise[currentExerciseIdx] || [];
  const completedSetsCount = currentSets.filter(Boolean).length;
  const progressPercent = exercises.length > 0 ? Math.round(((currentExerciseIdx + 1) / exercises.length) * 100) : 0;

  if (isFinished) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-3xl max-w-lg w-full p-8 text-center space-y-6 shadow-2xl border border-slate-100 animate-scale-up">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-550/20 flex items-center justify-center text-emerald-500 shadow-inner animate-bounce">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Session Accomplished
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Day {workout.dayNumber} Crushed!
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              Outstanding discipline. Your session progress, streak, and mandatory 5-hour recovery window have been logged.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Duration</span>
              <span className="text-sm font-black text-slate-800">{formatTime(elapsedSeconds)}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Exercises</span>
              <span className="text-sm font-black text-slate-800">{exercises.length} Drills</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Est. Burn</span>
              <span className="text-sm font-black text-emerald-600">{workout.estimatedCalories}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              Coach Alex Recovery Directive
            </span>
            <p className="text-xs text-amber-900 leading-relaxed">
              {workout.nutritionTip}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition shadow-lg"
          >
            Return to Workout Deck
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col justify-between overflow-y-auto animate-fade-in text-slate-900">
      {/* Top Header */}
      <div className="bg-white/95 border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 border border-red-500/20 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            Live Session
          </span>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
              {workout.title}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Exercise {currentExerciseIdx + 1} of {exercises.length} • {workout.programName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
            title={isSoundEnabled ? "Mute Timer Chime" : "Enable Timer Chime"}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Overall Elapsed Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl font-mono text-xs font-bold text-slate-700">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1 flex flex-col justify-center">
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
            <span>Progress: {progressPercent}%</span>
            <span>{currentExerciseIdx + 1} / {exercises.length} Movements</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {currentExercise && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Left: GIF Display */}
            <div className="md:col-span-5 bg-slate-950 flex flex-col items-center justify-center p-4 relative min-h-[280px] sm:min-h-[340px]">
              {currentExercise.gifUrl ? (
                <img
                  src={currentExercise.gifUrl}
                  alt={currentExercise.name}
                  className="max-h-[320px] w-auto max-w-full object-contain rounded-2xl shadow-md"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
              ) : (
                <div className="text-center p-8 text-slate-400 space-y-2">
                  <Dumbbell className="w-12 h-12 mx-auto text-slate-600 animate-pulse" />
                  <p className="text-xs">Dynamic Movement</p>
                </div>
              )}

              <span className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-sm text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-lg border border-white/10">
                237 Master GIF Library
              </span>
            </div>

            {/* Right: Exercise Controls & Cues */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {currentExercise.targetMuscle}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                    {currentExercise.equipment.join(", ") || "Bodyweight"}
                  </span>
                  {currentExercise.tempo && (
                    <span className="text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Tempo: {currentExercise.tempo}
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {currentExercise.name}
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100 font-sans">
                  <strong className="text-slate-800 font-bold block mb-1">Coach Alex Cue:</strong>
                  {currentExercise.coachingCues}
                </p>
              </div>

              {/* Set-by-Set Interactive Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 uppercase">
                  <span>Sets Tracker ({completedSetsCount}/{currentSets.length})</span>
                  <span className="text-blue-600 font-extrabold">{currentExercise.reps}</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {currentSets.map((done, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => toggleSetCompleted(sIdx)}
                      className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition-all font-sans text-xs font-extrabold ${
                        done
                          ? "bg-emerald-500 text-white border-emerald-500 shadow-md scale-102"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {done ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="text-slate-400">Set</span>}
                      <span>{sIdx + 1}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rest Countdown Timer Card */}
              {restSecondsRemaining !== null && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-between animate-slide-down">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-mono font-black text-sm shadow-md animate-pulse">
                      {restSecondsRemaining}s
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-blue-900 block">Rest Interval</span>
                      <span className="text-xs text-blue-700">Breathe deeply through nose</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsRestTimerActive(!isRestTimerActive)}
                      className="p-2 bg-white text-blue-700 rounded-xl border border-blue-200 hover:bg-blue-100 text-xs font-bold transition"
                    >
                      {isRestTimerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setRestSecondsRemaining(prev => (prev || 0) + 15)}
                      className="px-2.5 py-1.5 bg-white text-blue-700 rounded-xl border border-blue-200 hover:bg-blue-100 text-[10px] font-bold font-mono transition"
                    >
                      +15s
                    </button>
                    <button
                      onClick={() => {
                        setIsRestTimerActive(false);
                        setRestSecondsRemaining(null);
                      }}
                      className="p-2 bg-white text-slate-500 rounded-xl border border-blue-200 hover:bg-red-50 hover:text-red-500 text-xs transition"
                      title="Skip Rest"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="bg-white/95 border-t border-slate-200 p-4 sm:p-5 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={currentExerciseIdx === 0}
            className="px-4 py-3 bg-slate-100 text-slate-700 rounded-2xl hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition text-xs font-bold flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous Drill</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCompleteWorkout}
              className="px-4 py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-2xl transition text-xs font-extrabold flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Finish Workout
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition text-xs font-extrabold flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <span>{currentExerciseIdx === exercises.length - 1 ? "Finish & Log Workout" : "Next Exercise"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
