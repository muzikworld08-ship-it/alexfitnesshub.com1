import { useState, useEffect, useCallback, useMemo } from "react";
import { ProgramId, ProgramProgressState, DayExecutionPlan } from "../types/challengeEngine";
import { CHALLENGE_PROGRAMS_METADATA, getWorkoutForProgramAndDay } from "../data/challengeEngineDatabase";
import { ChallengeValidationService } from "../services/challengeValidationService";
import { useApp } from "../context/AppContext";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const STORAGE_KEY_PREFIX = "alex_challenge_engine_state_v3_";
const UNLOCK_HOURS = 7;
const UNLOCK_MILLISECONDS = UNLOCK_HOURS * 60 * 60 * 1000; // Exactly 7 hours in ms

const DEFAULT_PROGRAM_STATE = (programId: ProgramId): ProgramProgressState => ({
  programId,
  programName: CHALLENGE_PROGRAMS_METADATA[programId]?.name || programId,
  currentDay: 1,
  workoutStarted: false,
  workoutCompleted: false,
  startedAt: null,
  completedAt: null,
  exercisesCompleted: [],
  completionPercentage: 0,
  nextWorkoutUnlockTime: null,
  totalCompletedWorkouts: 0,
  currentStreak: 0,
  history: {}
});

export function useChallengeEngine(initialProgramId: ProgramId = "immortal_90") {
  const { user } = useApp();
  const userId = user?.uid || "guest_athlete";

  const [activeProgramId, setActiveProgramId] = useState<ProgramId>(initialProgramId);
  const [allProgramStates, setAllProgramStates] = useState<Record<ProgramId, ProgramProgressState>>({
    immortal_90: DEFAULT_PROGRAM_STATE("immortal_90"),
    home_180: DEFAULT_PROGRAM_STATE("home_180"),
    women_confidence: DEFAULT_PROGRAM_STATE("women_confidence"),
    belly_fat_shred: DEFAULT_PROGRAM_STATE("belly_fat_shred"),
    posture_vitality: DEFAULT_PROGRAM_STATE("posture_vitality")
  });
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(Date.now());

  // 1. Ticking clock for exact 7-hour unlock calculation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeMs(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Load independent program progress from local storage & Firestore
  useEffect(() => {
    const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
    let loadedStates: Partial<Record<ProgramId, ProgramProgressState>> = {};

    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        loadedStates = JSON.parse(cached);
      }
    } catch (e) {
      console.warn("Could not read local challenge engine state:", e);
    }

    const merged: Record<ProgramId, ProgramProgressState> = {
      immortal_90: { ...DEFAULT_PROGRAM_STATE("immortal_90"), ...(loadedStates.immortal_90 || {}) },
      home_180: { ...DEFAULT_PROGRAM_STATE("home_180"), ...(loadedStates.home_180 || {}) },
      women_confidence: { ...DEFAULT_PROGRAM_STATE("women_confidence"), ...(loadedStates.women_confidence || {}) },
      belly_fat_shred: { ...DEFAULT_PROGRAM_STATE("belly_fat_shred"), ...(loadedStates.belly_fat_shred || {}) },
      posture_vitality: { ...DEFAULT_PROGRAM_STATE("posture_vitality"), ...(loadedStates.posture_vitality || {}) }
    };

    setAllProgramStates(merged);
    setIsLoaded(true);

    // Sync with Firestore if authenticated
    if (user?.uid && db) {
      const docRef = doc(db, "users", user.uid, "engine_progress", "all_challenges");
      getDoc(docRef).then((snap) => {
        if (snap.exists()) {
          const remoteData = snap.data() as Partial<Record<ProgramId, ProgramProgressState>>;
          setAllProgramStates(prev => {
            const remoteMerged: Record<ProgramId, ProgramProgressState> = {
              immortal_90: { ...prev.immortal_90, ...(remoteData.immortal_90 || {}) },
              home_180: { ...prev.home_180, ...(remoteData.home_180 || {}) },
              women_confidence: { ...prev.women_confidence, ...(remoteData.women_confidence || {}) },
              belly_fat_shred: { ...prev.belly_fat_shred, ...(remoteData.belly_fat_shred || {}) },
              posture_vitality: { ...prev.posture_vitality, ...(remoteData.posture_vitality || {}) }
            };
            try {
              localStorage.setItem(storageKey, JSON.stringify(remoteMerged));
            } catch (err) {
              // ignore
            }
            return remoteMerged;
          });
        }
      }).catch(err => {
        console.warn("Firestore progress sync failed:", err);
      });
    }
  }, [userId, user?.uid]);

  // Save changes to localStorage and Firestore
  const persistState = useCallback((updatedStates: Record<ProgramId, ProgramProgressState>) => {
    const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedStates));
    } catch (e) {
      console.warn("Could not cache challenge progress:", e);
    }

    if (user?.uid && db) {
      const docRef = doc(db, "users", user.uid, "engine_progress", "all_challenges");
      setDoc(docRef, updatedStates, { merge: true }).catch(err => {
        console.warn("Could not sync to cloud:", err);
      });
    }
  }, [userId, user?.uid]);

  // Current active program's progress state
  const currentProgress = allProgramStates[activeProgramId] || DEFAULT_PROGRAM_STATE(activeProgramId);
  const metadata = CHALLENGE_PROGRAMS_METADATA[activeProgramId];

  // Check 7-hour unlock condition: Has unlock time expired?
  useEffect(() => {
    if (!isLoaded) return;

    let hasChanges = false;
    const nextStates = { ...allProgramStates };

    (Object.keys(nextStates) as ProgramId[]).forEach((pid) => {
      const prog = nextStates[pid];
      if (prog.workoutCompleted && prog.nextWorkoutUnlockTime) {
        if (currentTimeMs >= prog.nextWorkoutUnlockTime) {
          // 7 hours have elapsed! Advance to next day and unlock!
          const maxDays = CHALLENGE_PROGRAMS_METADATA[pid].totalDays;
          const nextDay = Math.min(maxDays, prog.currentDay + 1);

          nextStates[pid] = {
            ...prog,
            currentDay: nextDay,
            workoutStarted: false,
            workoutCompleted: false,
            startedAt: null,
            completedAt: null,
            exercisesCompleted: [],
            completionPercentage: 0,
            nextWorkoutUnlockTime: null
          };
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      setAllProgramStates(nextStates);
      persistState(nextStates);
    }
  }, [currentTimeMs, isLoaded, allProgramStates, persistState]);

  // Resolve today's workout plan
  const workoutPlan: DayExecutionPlan = useMemo(() => {
    return getWorkoutForProgramAndDay(activeProgramId, currentProgress.currentDay);
  }, [activeProgramId, currentProgress.currentDay]);

  // Strict Exercise Validation: Filter exercises before displaying
  const validatedExercises = useMemo(() => {
    if (!workoutPlan || !workoutPlan.exercises) return [];

    return workoutPlan.exercises.filter((ex) => {
      const check = ChallengeValidationService.validateExerciseForWorkout(
        ex,
        activeProgramId,
        currentProgress.currentDay,
        workoutPlan.meta,
        currentProgress.exercisesCompleted
      );
      return check.isValid;
    });
  }, [workoutPlan, activeProgramId, currentProgress.currentDay, currentProgress.exercisesCompleted]);

  // Unlock Timer Countdown formatted string (e.g. "06:59:59")
  const unlockCountdown = useMemo(() => {
    if (!currentProgress.workoutCompleted || !currentProgress.nextWorkoutUnlockTime) {
      return null;
    }
    const diff = currentProgress.nextWorkoutUnlockTime - currentTimeMs;
    if (diff <= 0) return "00:00:00";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  }, [currentProgress.workoutCompleted, currentProgress.nextWorkoutUnlockTime, currentTimeMs]);

  // Actions
  const startTodayWorkout = useCallback(() => {
    const updated: ProgramProgressState = {
      ...currentProgress,
      workoutStarted: true,
      startedAt: currentProgress.startedAt || new Date().toISOString()
    };
    const nextStates = { ...allProgramStates, [activeProgramId]: updated };
    setAllProgramStates(nextStates);
    persistState(nextStates);
  }, [currentProgress, allProgramStates, activeProgramId, persistState]);

  const toggleExerciseComplete = useCallback((exerciseId: string) => {
    const alreadyDone = currentProgress.exercisesCompleted.includes(exerciseId);
    let nextCompleted: string[];

    if (alreadyDone) {
      nextCompleted = currentProgress.exercisesCompleted.filter(id => id !== exerciseId);
    } else {
      nextCompleted = [...currentProgress.exercisesCompleted, exerciseId];
    }

    const totalExercises = validatedExercises.length || 1;
    const completionPercentage = Math.min(100, Math.round((nextCompleted.length / totalExercises) * 100));

    const updated: ProgramProgressState = {
      ...currentProgress,
      workoutStarted: true,
      startedAt: currentProgress.startedAt || new Date().toISOString(),
      exercisesCompleted: nextCompleted,
      completionPercentage
    };

    const nextStates = { ...allProgramStates, [activeProgramId]: updated };
    setAllProgramStates(nextStates);
    persistState(nextStates);
  }, [currentProgress, validatedExercises.length, allProgramStates, activeProgramId, persistState]);

  const completeTodayWorkout = useCallback(() => {
    const now = Date.now();
    const unlockTime = now + UNLOCK_MILLISECONDS; // Exactly 7 hours from now
    const completedAtStr = new Date().toISOString();

    const historyRecord = {
      dayNumber: currentProgress.currentDay,
      category: workoutPlan.meta.category,
      completedAt: completedAtStr,
      exercisesCount: validatedExercises.length
    };

    const updated: ProgramProgressState = {
      ...currentProgress,
      workoutStarted: true,
      workoutCompleted: true,
      completedAt: completedAtStr,
      completionPercentage: 100,
      nextWorkoutUnlockTime: unlockTime,
      totalCompletedWorkouts: currentProgress.totalCompletedWorkouts + 1,
      currentStreak: currentProgress.currentStreak + 1,
      history: {
        ...currentProgress.history,
        [currentProgress.currentDay]: historyRecord
      }
    };

    const nextStates = { ...allProgramStates, [activeProgramId]: updated };
    setAllProgramStates(nextStates);
    persistState(nextStates);
  }, [currentProgress, workoutPlan.meta.category, validatedExercises.length, allProgramStates, activeProgramId, persistState]);

  // Admin bypass to test next workout without waiting 7 hours
  const adminBypassUnlock = useCallback(() => {
    const maxDays = CHALLENGE_PROGRAMS_METADATA[activeProgramId].totalDays;
    const nextDay = Math.min(maxDays, currentProgress.currentDay + 1);

    const updated: ProgramProgressState = {
      ...currentProgress,
      currentDay: nextDay,
      workoutStarted: false,
      workoutCompleted: false,
      startedAt: null,
      completedAt: null,
      exercisesCompleted: [],
      completionPercentage: 0,
      nextWorkoutUnlockTime: null
    };

    const nextStates = { ...allProgramStates, [activeProgramId]: updated };
    setAllProgramStates(nextStates);
    persistState(nextStates);
  }, [activeProgramId, currentProgress, allProgramStates, persistState]);

  // Reset program progress for testing/restart
  const resetProgramProgress = useCallback((progId: ProgramId = activeProgramId) => {
    const nextStates = {
      ...allProgramStates,
      [progId]: DEFAULT_PROGRAM_STATE(progId)
    };
    setAllProgramStates(nextStates);
    persistState(nextStates);
  }, [allProgramStates, activeProgramId, persistState]);

  return {
    isLoaded,
    activeProgramId,
    setActiveProgramId,
    metadata,
    currentProgress,
    allProgramStates,
    workoutPlan,
    validatedExercises,
    unlockCountdown,
    isLockedAwaitingTimer: currentProgress.workoutCompleted && (currentProgress.nextWorkoutUnlockTime ? currentTimeMs < currentProgress.nextWorkoutUnlockTime : false),
    startTodayWorkout,
    toggleExerciseComplete,
    completeTodayWorkout,
    adminBypassUnlock,
    resetProgramProgress
  };
}
