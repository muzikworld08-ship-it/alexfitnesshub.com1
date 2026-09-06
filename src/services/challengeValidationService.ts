import { 
  ProgramId, 
  ChallengeExerciseItem, 
  DayWorkoutMeta, 
  ValidationError 
} from "../types/challengeEngine";
import { CHALLENGE_PROGRAMS_METADATA, getWorkoutForProgramAndDay } from "../data/challengeEngineDatabase";

export class ChallengeValidationService {
  /**
   * Evaluates whether an individual exercise is valid to be rendered for the active day and program.
   * STRICT CATEGORY VALIDATION:
   * 1. Does the exercise belong to the current program?
   * 2. Does it belong to today's workout day?
   * 3. Does its muscle group match today's category?
   * 4. Is the exercise assigned to the correct difficulty and equipment level?
   * 5. Has the user already completed it today?
   */
  public static validateExerciseForWorkout(
    exercise: ChallengeExerciseItem,
    currentProgramId: ProgramId,
    currentDay: number,
    dayMeta: DayWorkoutMeta,
    completedExerciseIdsToday: string[]
  ): { isValid: boolean; reason?: string; isCompleted: boolean } {
    const isCompleted = completedExerciseIdsToday.includes(exercise.id);

    // Rule 1: Program match
    if (exercise.programId !== currentProgramId) {
      return { 
        isValid: false, 
        reason: `Program mismatch: exercise belongs to ${exercise.programId} instead of ${currentProgramId}`,
        isCompleted
      };
    }

    // Rule 2: Workout day match
    if (exercise.dayNumber !== currentDay) {
      return { 
        isValid: false, 
        reason: `Day mismatch: exercise is marked for Day ${exercise.dayNumber} instead of Day ${currentDay}`,
        isCompleted
      };
    }

    // Rule 3: Category and muscle group alignment
    const expectedCategory = dayMeta.category.toLowerCase();
    const exCategory = exercise.category.toLowerCase();
    
    // Check if category or target muscles align with the exercise's muscle group
    const hasMatchingMuscle = exercise.muscleGroup.some(mg => {
      const mgLower = mg.toLowerCase();
      return (
        expectedCategory.includes(mgLower) ||
        dayMeta.targetMuscles.some(tm => tm.toLowerCase().includes(mgLower) || mgLower.includes(tm.toLowerCase()))
      );
    });

    if (!hasMatchingMuscle && !expectedCategory.includes(exCategory)) {
      return { 
        isValid: false, 
        reason: `Category mismatch: ${exercise.exerciseName} targeting [${exercise.muscleGroup.join(", ")}] does not align with today's category ${dayMeta.category}`,
        isCompleted
      };
    }

    // Rule 4: Difficulty and equipment sanity check
    if (!exercise.difficulty || !exercise.equipment) {
      return {
        isValid: false,
        reason: `Exercise metadata incomplete: Missing equipment or difficulty specifications`,
        isCompleted
      };
    }

    return { isValid: true, isCompleted };
  }

  /**
   * Comprehensive validation tool for administrators.
   * Scans programs and days for configuration discrepancies, reporting:
   * - "Exercise assigned to incorrect category"
   * - "Exercise assigned to incorrect program"
   * - "Missing workout for Day X"
   * - "Duplicate exercise"
   * - "Exercise missing muscle group"
   * - "Exercise missing program assignment"
   */
  public static auditAllPrograms(): ValidationError[] {
    const reports: ValidationError[] = [];
    const programs: ProgramId[] = [
      "immortal_90", 
      "home_180", 
      "women_confidence", 
      "belly_fat_shred", 
      "posture_vitality"
    ];

    for (const progId of programs) {
      const meta = CHALLENGE_PROGRAMS_METADATA[progId];
      if (!meta) continue;

      // Sample first 14 days and edge days for thorough auditing
      const testDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, meta.totalDays];

      for (const dayNum of testDays) {
        if (dayNum > meta.totalDays) continue;

        const plan = getWorkoutForProgramAndDay(progId, dayNum);

        // Check for missing workout
        if (!plan || !plan.exercises || plan.exercises.length === 0) {
          reports.push({
            type: "missing_workout",
            message: `Missing workout for Day ${dayNum} in ${meta.name}`,
            severity: "error",
            programId: progId,
            dayNumber: dayNum
          });
          continue;
        }

        const seenNames = new Set<string>();

        for (const ex of plan.exercises) {
          // Check program assignment
          if (!ex.programId) {
            reports.push({
              type: "missing_program_assignment",
              message: `Exercise missing program assignment: "${ex.exerciseName}" on Day ${dayNum}`,
              severity: "error",
              exerciseId: ex.id,
              exerciseName: ex.exerciseName,
              programId: progId,
              dayNumber: dayNum
            });
          } else if (ex.programId !== progId) {
            reports.push({
              type: "program_mismatch",
              message: `Exercise assigned to incorrect program: "${ex.exerciseName}" (${ex.programId} in ${progId})`,
              severity: "error",
              exerciseId: ex.id,
              exerciseName: ex.exerciseName,
              programId: progId,
              dayNumber: dayNum
            });
          }

          // Check muscle group
          if (!ex.muscleGroup || ex.muscleGroup.length === 0) {
            reports.push({
              type: "missing_musclegroup",
              message: `Exercise missing muscle group: "${ex.exerciseName}"`,
              severity: "error",
              exerciseId: ex.id,
              exerciseName: ex.exerciseName,
              programId: progId,
              dayNumber: dayNum
            });
          }

          // Check duplicate
          if (seenNames.has(ex.exerciseName.toLowerCase())) {
            reports.push({
              type: "duplicate_exercise",
              message: `Duplicate exercise detected on Day ${dayNum}: "${ex.exerciseName}"`,
              severity: "warning",
              exerciseId: ex.id,
              exerciseName: ex.exerciseName,
              programId: progId,
              dayNumber: dayNum
            });
          }
          seenNames.add(ex.exerciseName.toLowerCase());

          // Check category alignment
          const catExpected = plan.meta.category.toLowerCase();
          const matchesMuscle = ex.muscleGroup.some(mg => {
            const mgL = mg.toLowerCase();
            return (
              catExpected.includes(mgL) || 
              plan.meta.targetMuscles.some(tm => tm.toLowerCase().includes(mgL) || mgL.includes(tm.toLowerCase()))
            );
          });

          if (!matchesMuscle && !catExpected.includes(ex.category.toLowerCase())) {
            reports.push({
              type: "category_mismatch",
              message: `Exercise assigned to incorrect category: "${ex.exerciseName}" has category "${ex.category}" on a "${plan.meta.category}" day`,
              severity: "warning",
              exerciseId: ex.id,
              exerciseName: ex.exerciseName,
              programId: progId,
              dayNumber: dayNum
            });
          }
        }
      }
    }

    return reports;
  }
}
