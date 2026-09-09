import { useState, useEffect, useCallback, useMemo } from "react";
import { ProgramId, ProgramProgressState, DayExecutionPlan } from "../types/challengeEngine";
import { CHALLENGE_PROGRAMS_METADATA, getWorkoutForProgramAndDay } from "../data/challengeEngineDatabase";
import { ChallengeValidationService } from "../services/challengeValidationService";
import { useApp } from "../context/AppContext";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { 
  getProgramWaitState, 
  recordDailyWorkoutCompletion, 
  clearProgramWaitState 
} from "../utils/programWaitManager";

const STORAGE_KEY_PREFIX = "alex_challenge_engine_state_v3_";

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

    const cleanLoadedState = (raw?: Partial<ProgramProgressState>, pid?: ProgramId): ProgramProgressState => {
      const base = DEFAULT_PROGRAM_STATE(pid || "immortal_90");
      return {
        ...base,
        ...(raw || {}),
        nextWorkoutUnlockTime: null // Clear any legacy strict lock
      };
    };

    const merged: Record<ProgramId, ProgramProgressState> = {
      immortal_90: cleanLoadedState(loadedStates.immortal_90, "immortal_90"),
      home_180: cleanLoadedState(loadedStates.home_180, "home_180"),
      women_confidence: cleanLoadedState(loadedStates.women_confidence, "women_confidence"),
      belly_fat_shred: cleanLoadedState(loadedStates.belly_fat_shred, "belly_fat_shred"),
      posture_vitality: cleanLoadedState(loadedStates.posture_vitality, "posture_vitality")
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
              immortal_90: cleanLoadedState({ ...prev.immortal_90, ...(remoteData.immortal_90 || {}) }, "immortal_90"),
              home_180: cleanLoadedState({ ...prev.home_180, ...(remoteData.home_180 || {}) }, "home_180"),
              women_confidence: cleanLoadedState({ ...prev.women_confidence, ...(remoteData.women_confidence || {}) }, "women_confidence"),
              belly_fat_shred: cleanLoadedState({ ...prev.belly_fat_shred, ...(remoteData.belly_fat_shred || {}) }, "belly_fat_shred"),
              posture_vitality: cleanLoadedState({ ...prev.posture_vitality, ...(remoteData.posture_vitality || {}) }, "posture_vitality")
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

  // 5-Hour Cool-down Recovery Timer State
  const [cooldownWaitState, setCooldownWaitState] = useState(() => getProgramWaitState(activeProgramId));

  useEffect(() => {
    setCooldownWaitState(getProgramWaitState(activeProgramId));
    const interval = setInterval(() => {
      const state = getProgramWaitState(activeProgramId);
      setCooldownWaitState(state);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeProgramId]);

  const unlockCountdown = cooldownWaitState.isWaiting ? cooldownWaitState.remainingFormatted : null;
  const isLockedAwaitingTimer = cooldownWaitState.isWaiting;

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
    const completedAtStr = new Date().toISOString();

    // Trigger mandatory 5-hour cool-down recovery logic
    const waitRecord = recordDailyWorkoutCompletion(activeProgramId, currentProgress.currentDay);
    setCooldownWaitState(getProgramWaitState(activeProgramId));

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
      nextWorkoutUnlockTime: waitRecord.nextUnlockAt,
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

  // Advance to next workout day immediately without strict lock
  const advanceToNextDay = useCallback(() => {
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

  // Admin / Test bypass to unlock cooldown immediately
  const adminBypassUnlock = useCallback(() => {
    clearProgramWaitState(activeProgramId);
    setCooldownWaitState(getProgramWaitState(activeProgramId));
    advanceToNextDay();
  }, [activeProgramId, advanceToNextDay]);

  // Jump to specific day (e.g. Day 1, 2, 3, 4, 5, 6, 7... 90)
  const jumpToDay = useCallback((day: number) => {
    const maxDays = CHALLENGE_PROGRAMS_METADATA[activeProgramId].totalDays;
    const targetDay = Math.max(1, Math.min(maxDays, day));

    const updated: ProgramProgressState = {
      ...currentProgress,
      currentDay: targetDay,
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
    isLockedAwaitingTimer,
    cooldownWaitState,
    startTodayWorkout,
    toggleExerciseComplete,
    completeTodayWorkout,
    advanceToNextDay,
    adminBypassUnlock,
    jumpToDay,
    resetProgramProgress
  };
}
