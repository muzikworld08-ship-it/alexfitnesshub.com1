import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

export type TimerPhase = "idle" | "prep" | "work" | "rest" | "completed";

export interface ActiveExerciseInfo {
  id?: string;
  name: string;
  targetSets?: number;
  currentSet?: number;
  repsOrTime?: string;
  weight?: number;
  restDuration?: number;
}

export interface WorkoutTimerState {
  isActive: boolean;
  workoutTitle: string;
  exercises: ActiveExerciseInfo[];
  currentExerciseIndex: number;
  currentExercise: ActiveExerciseInfo | null;
  currentSet: number;
  totalSets: number;
  phase: TimerPhase;
  secondsRemaining: number;
  totalPhaseDuration: number;
  elapsedWorkoutSeconds: number;
  isPaused: boolean;
  isMinimized: boolean;
  soundEnabled: boolean;
  voiceEnabled: boolean;
}

export interface WorkoutTimerContextType extends WorkoutTimerState {
  startWorkout: (options: {
    title: string;
    exercises?: (string | { name: string; sets?: number; restDuration?: number })[];
    restDuration?: number;
  }) => void;
  startQuickRest: (seconds?: number, exerciseName?: string, setNumber?: number, totalSets?: number) => void;
  startActiveSet: (exerciseName?: string, setNumber?: number, totalSets?: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  togglePause: () => void;
  addSeconds: (seconds: number) => void;
  setRestDuration: (seconds: number) => void;
  skipRest: () => void;
  nextExercise: () => void;
  prevExercise: () => void;
  stopWorkout: () => void;
  toggleMinimize: () => void;
  setMinimized: (minimized: boolean) => void;
  toggleSound: () => void;
  toggleVoice: () => void;
}

const WorkoutTimerContext = createContext<WorkoutTimerContextType | undefined>(undefined);

// Web Audio API Sound Synthesizer for high-performance audio alerts without external assets
const playBeep = (frequency: number, durationMs: number, type: OscillatorType = "sine") => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, durationMs + 100);
  } catch (e) {
    // Audio might be blocked by user gesture requirements
  }
};

const playChimeTone = () => {
  // Pleasant two-tone completion chime (E5 -> A5)
  playBeep(659.25, 180, "sine");
  setTimeout(() => {
    playBeep(880.0, 350, "triangle");
  }, 120);
};

const playTickTone = () => {
  playBeep(440, 70, "sine");
};

export const WorkoutTimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [workoutTitle, setWorkoutTitle] = useState<string>("Active Session");
  const [exercises, setExercises] = useState<ActiveExerciseInfo[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [totalSets, setTotalSets] = useState<number>(3);
  const [phase, setPhase] = useState<TimerPhase>("idle");
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const [totalPhaseDuration, setTotalPhaseDuration] = useState<number>(60);
  const [elapsedWorkoutSeconds, setElapsedWorkoutSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("fit_timer_sound");
    return saved !== null ? saved === "true" : true;
  });
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("fit_timer_voice");
    return saved !== null ? saved === "true" : true;
  });

  const timerRef = useRef<any>(null);
  const stopwatchRef = useRef<any>(null);

  const currentExercise = exercises[currentExerciseIndex] || (isActive ? { name: workoutTitle || "Current Exercise" } : null);

  // Speech Helper
  const speakText = useCallback((text: string) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }, [voiceEnabled]);

  // Overall workout elapsed stopwatch
  useEffect(() => {
    if (isActive && !isPaused) {
      stopwatchRef.current = setInterval(() => {
        setElapsedWorkoutSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    }
    return () => {
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    };
  }, [isActive, isPaused]);

  // Countdown timer loop for Rest & Prep phases
  useEffect(() => {
    if (isActive && !isPaused && (phase === "rest" || phase === "prep")) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            // Phase completed
            if (phase === "rest") {
              if (soundEnabled) playChimeTone();
              speakText("Rest finished! Ready for the next set.");
              setPhase("work");
              return 0;
            } else if (phase === "prep") {
              if (soundEnabled) playChimeTone();
              speakText("Start exercise!");
              setPhase("work");
              return 0;
            }
            return 0;
          }

          const next = prev - 1;
          // Tick sound & voice on 3, 2, 1
          if (next <= 3 && next > 0) {
            if (soundEnabled) playTickTone();
            if (voiceEnabled) speakText(next.toString());
          }

          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused, phase, soundEnabled, voiceEnabled, speakText]);

  // Save sound and voice preferences
  useEffect(() => {
    localStorage.setItem("fit_timer_sound", soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem("fit_timer_voice", voiceEnabled.toString());
  }, [voiceEnabled]);

  const startWorkout = useCallback((options: {
    title: string;
    exercises?: (string | { name: string; sets?: number; restDuration?: number })[];
    restDuration?: number;
  }) => {
    const formattedExercises: ActiveExerciseInfo[] = (options.exercises || []).map(ex => {
      if (typeof ex === "string") {
        return { name: ex, targetSets: 3, restDuration: options.restDuration || 60 };
      }
      return {
        name: ex.name,
        targetSets: ex.sets || 3,
        restDuration: ex.restDuration || options.restDuration || 60
      };
    });

    setWorkoutTitle(options.title || "Workout Session");
    setExercises(formattedExercises);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setTotalSets(formattedExercises[0]?.targetSets || 3);
    setPhase("work");
    setIsActive(true);
    setIsPaused(false);
    setIsMinimized(false);
    setElapsedWorkoutSeconds(0);

    const defaultRest = formattedExercises[0]?.restDuration || options.restDuration || 60;
    setSecondsRemaining(defaultRest);
    setTotalPhaseDuration(defaultRest);

    speakText(`Starting ${options.title || "workout"}. Good luck!`);
  }, [speakText]);

  const startQuickRest = useCallback((seconds: number = 60, exerciseName?: string, setNum?: number, totSets?: number) => {
    setIsActive(true);
    setPhase("rest");
    setSecondsRemaining(seconds);
    setTotalPhaseDuration(seconds);
    setIsPaused(false);
    
    if (exerciseName) {
      setWorkoutTitle(exerciseName);
      if (exercises.length === 0 || !exercises.some(e => e.name === exerciseName)) {
        setExercises([{ name: exerciseName, targetSets: totSets || 3, restDuration: seconds }]);
        setCurrentExerciseIndex(0);
      }
    }
    if (setNum !== undefined) setCurrentSet(setNum);
    if (totSets !== undefined) setTotalSets(totSets);

    speakText(`Resting for ${seconds} seconds.`);
  }, [exercises, speakText]);

  const startActiveSet = useCallback((exerciseName?: string, setNum?: number, totSets?: number) => {
    setIsActive(true);
    setPhase("work");
    setIsPaused(false);
    if (exerciseName) setWorkoutTitle(exerciseName);
    if (setNum !== undefined) setCurrentSet(setNum);
    if (totSets !== undefined) setTotalSets(totSets);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const addSeconds = useCallback((secondsToAdd: number) => {
    setSecondsRemaining(prev => {
      const next = Math.max(0, prev + secondsToAdd);
      setTotalPhaseDuration(oldTot => Math.max(oldTot, next));
      return next;
    });
  }, []);

  const setRestDuration = useCallback((seconds: number) => {
    setSecondsRemaining(seconds);
    setTotalPhaseDuration(seconds);
    setPhase("rest");
    setIsPaused(false);
  }, []);

  const skipRest = useCallback(() => {
    setPhase("work");
    setSecondsRemaining(0);
    if (currentSet < totalSets) {
      setCurrentSet(prev => prev + 1);
    } else if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      const nextEx = exercises[currentExerciseIndex + 1];
      if (nextEx) setTotalSets(nextEx.targetSets || 3);
    }
    speakText("Next set started.");
  }, [currentSet, totalSets, currentExerciseIndex, exercises, speakText]);

  const nextExercise = useCallback(() => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      const nextEx = exercises[currentExerciseIndex + 1];
      if (nextEx) setTotalSets(nextEx.targetSets || 3);
      setPhase("work");
      speakText(`Up next: ${exercises[currentExerciseIndex + 1]?.name}`);
    } else {
      setPhase("completed");
      speakText("Workout session completed! Outstanding work.");
    }
  }, [currentExerciseIndex, exercises, speakText]);

  const prevExercise = useCallback(() => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setCurrentSet(1);
      const prevEx = exercises[currentExerciseIndex - 1];
      if (prevEx) setTotalSets(prevEx.targetSets || 3);
      setPhase("work");
    }
  }, [currentExerciseIndex, exercises]);

  const stopWorkout = useCallback(() => {
    setIsActive(false);
    setPhase("idle");
    setSecondsRemaining(0);
    setElapsedWorkoutSeconds(0);
    setIsPaused(false);
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled(prev => !prev);
  }, []);

  return (
    <WorkoutTimerContext.Provider
      value={{
        isActive,
        workoutTitle,
        exercises,
        currentExerciseIndex,
        currentExercise,
        currentSet,
        totalSets,
        phase,
        secondsRemaining,
        totalPhaseDuration,
        elapsedWorkoutSeconds,
        isPaused,
        isMinimized,
        soundEnabled,
        voiceEnabled,
        startWorkout,
        startQuickRest,
        startActiveSet,
        pauseTimer,
        resumeTimer,
        togglePause,
        addSeconds,
        setRestDuration,
        skipRest,
        nextExercise,
        prevExercise,
        stopWorkout,
        toggleMinimize,
        setMinimized: setIsMinimized,
        toggleSound,
        toggleVoice,
      }}
    >
      {children}
    </WorkoutTimerContext.Provider>
  );
};

export const useWorkoutTimer = () => {
  const context = useContext(WorkoutTimerContext);
  if (!context) {
    throw new Error("useWorkoutTimer must be used within a WorkoutTimerProvider");
  }
  return context;
};
