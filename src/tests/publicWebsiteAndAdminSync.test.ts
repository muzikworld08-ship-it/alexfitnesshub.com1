import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import {
  getWorkoutForProgramAndDay,
  normalizeProgramId,
  CHALLENGE_PROGRAMS_METADATA
} from "../data/challengeEngineDatabase";
import { getChallengeWorkouts, CHALLENGE_SPLITS } from "../data/challenges";
import {
  getScheduleOverrides,
  setScheduleOverridesFromAdmin,
  addExerciseToProgramSchedule
} from "../utils/scheduleOverridesStore";
import { purgeMismatchedExercisesFromRoutine } from "../utils/dynamicWorkoutEngine";

const readSrc = (relPath: string) =>
  fs.readFileSync(path.join(process.cwd(), relPath), "utf-8");

describe("Public Website Sync & Unrestricted Admin Workout Assignment", () => {
  it("1. AddWorkoutModal & ExerciseReplacementModal show all library workouts without exclusion gates", () => {
    const addModalSrc = readSrc("src/components/admin/AddWorkoutModal.tsx");
    const replaceModalSrc = readSrc("src/components/admin/ExerciseReplacementModal.tsx");

    assert.ok(!addModalSrc.includes("if (isHomeProgram && !isHomeEligibleExercise(ex))"), "AddWorkoutModal must not hide gym exercises from home programs");
    assert.ok(!addModalSrc.includes("if (isWomenProgram && !isWomenWorkoutEligibleExercise(ex))"), "AddWorkoutModal must not hide exercises from women programs");
    assert.ok(!addModalSrc.includes("if (!isWomenProgram && isExplicitlyMarkedWomenWorkout(ex))"), "AddWorkoutModal must not hide women-tagged exercises");

    assert.ok(!replaceModalSrc.includes("if (isHomeProgram && !isHomeEligibleExercise(ex))"), "ExerciseReplacementModal must not hide gym exercises");
    assert.ok(!replaceModalSrc.includes("if (isWomenProgram && !isWomenWorkoutEligibleExercise(ex))"), "ExerciseReplacementModal must not hide exercises from women programs");
    assert.ok(!replaceModalSrc.includes("if (!isWomenProgram && isExplicitlyMarkedWomenWorkout(ex))"), "ExerciseReplacementModal must not hide women-tagged exercises");
  });

  it("2. All 15 standard programs have metadata, splits, exact normalizeProgramId, and appear in Admin Challenge Engine", () => {
    const expectedPrograms = [
      "immortal_90",
      "women_confidence",
      "belly_fat_shred",
      "home_180",
      "posture_vitality",
      "lean_muscle",
      "fat_burning",
      "body_transformation",
      "athletic_performance",
      "strength_challenge",
      "home_fitness",
      "six_pack_core",
      "gym_hypertrophy",
      "cardio_calisthenics",
      "lifestyle_academy"
    ];

    const engineSrc = readSrc("src/components/admin/AdminWorkoutChallengeEngine.tsx");
    assert.strictEqual(normalizeProgramId("home_fitness"), "home_fitness", "home_fitness must not collide into home_180");
    assert.strictEqual(normalizeProgramId("custom_test_challenge_1"), "custom_test_challenge_1", "Custom challenge ID must stay intact");

    for (const id of expectedPrograms) {
      assert.ok(CHALLENGE_PROGRAMS_METADATA[id], `CHALLENGE_PROGRAMS_METADATA includes ${id}`);
      assert.ok(CHALLENGE_SPLITS[id], `CHALLENGE_SPLITS includes ${id}`);
      assert.ok(engineSrc.includes(`id: "${id}"`), `AdminWorkoutChallengeEngine includes ${id} in selector`);
    }
  });

  it("3. getWorkoutForProgramAndDay excludes unadded legacy seed drills when addedByAdmin drills exist and preserves >10 admin drills", () => {
    const original = getScheduleOverrides();
    try {
      const twelveAdminDrills = Array.from({ length: 12 }, (_, idx) => ({
        id: `adm_${idx + 1}`,
        exerciseName: `Admin Drill ${idx + 1}`,
        name: `Admin Drill ${idx + 1}`,
        sets: 3,
        reps: "10-12",
        restTime: "60s",
        gifUrl: `https://example.com/adm_${idx + 1}.gif`,
        addedByAdmin: true
      }));

      const mixedList = [
        {
          id: "unadded_legacy_1",
          exerciseName: "Unadded Seed Exercise",
          name: "Unadded Seed Exercise",
          sets: 3,
          reps: "12",
          restTime: "60s",
          gifUrl: "https://example.com/legacy.gif"
        },
        ...twelveAdminDrills
      ];

      setScheduleOverridesFromAdmin({
        ...original,
        gym_hypertrophy: {
          cycle_1: {
            title: "Day 1: Admin Push",
            category: "Chest & Triceps",
            exercises: mixedList,
            levels: { beginner: mixedList },
            beginnerExercises: mixedList,
            intermediateExercises: [] // legacy empty placeholder without intermediateExplicitlyCleared
          }
        }
      });

      const begPlan = getWorkoutForProgramAndDay("gym_hypertrophy", 1, undefined, { fitnessLevel: "Beginner" });
      assert.strictEqual(begPlan.exercises.length, 12, "All 12 admin-added drills must render without 10-item truncation");
      assert.ok(
        !begPlan.exercises.some(e => e.exerciseName === "Unadded Seed Exercise"),
        "Unadded legacy seed drill must be excluded once admin drills exist"
      );

      // Intermediate user without explicit Intermediate customization should receive Beginner's admin drills
      const intPlan = getWorkoutForProgramAndDay("gym_hypertrophy", 1, undefined, { fitnessLevel: "Intermediate" });
      assert.strictEqual(intPlan.exercises.length, 12, "Uncustomized Intermediate tier must inherit all 12 Beginner admin drills instead of 0");
      assert.strictEqual(intPlan.exercises[0].exerciseName, "Admin Drill 1");
    } finally {
      setScheduleOverridesFromAdmin(original);
    }
  });

  it("4. getChallengeWorkouts respects admin overrides without injecting unadded fallback workouts or slicing at 10", () => {
    const original = getScheduleOverrides();
    try {
      const twelveDrills = Array.from({ length: 12 }, (_, i) => ({
        id: `hf_${i + 1}`,
        exerciseName: `Home Fitness Admin ${i + 1}`,
        name: `Home Fitness Admin ${i + 1}`,
        sets: 3,
        reps: "12",
        restTime: "45s",
        gifUrl: `https://example.com/hf_${i + 1}.gif`,
        addedByAdmin: true
      }));

      setScheduleOverridesFromAdmin({
        ...original,
        home_fitness: {
          cycle_1: {
            title: "Day 1: Home Fitness Admin",
            category: "Home Fitness",
            exercises: twelveDrills,
            levels: { beginner: twelveDrills }
          },
          cycle_2: {
            title: "Day 2: Admin Cleared Routine",
            category: "Rest",
            isRestDay: true,
            exercises: [],
            levels: { beginner: [] }
          }
        }
      });

      const ch: any = {
        id: "home_fitness",
        title: "90 Day Home Fitness Challenge",
        description: "Test",
        category: "Calisthenics",
        goal: "Fitness",
        image: "",
        badgeId: "b1",
        badgeName: "B1",
        badgeColor: ""
      };

      const d1 = getChallengeWorkouts(ch, undefined, 1, "Beginner");
      assert.strictEqual(d1.length, 12, "getChallengeWorkouts must return all 12 admin drills without 10-item cap");
      assert.strictEqual(d1[0].name, "Home Fitness Admin 1");

      const d2 = getChallengeWorkouts(ch, undefined, 2, "Beginner");
      assert.strictEqual(d2.length, 0, "Explicit admin rest/empty override must NOT synthesize unadded exercises");
    } finally {
      setScheduleOverridesFromAdmin(original);
    }
  });

  it("5. WorkoutPlayer, DailyPlanView, WorkoutLibrary, and purgeMismatchedExercisesFromRoutine never inject unadded stretches or slice at 10", () => {
    const playerSrc = readSrc("src/components/WorkoutPlayer.tsx");
    const dailySrc = readSrc("src/components/DailyPlanView.tsx");
    const libSrc = readSrc("src/components/WorkoutLibrary.tsx");

    assert.ok(!playerSrc.includes("getPreWorkoutStretchesForDay"), "WorkoutPlayer must not inject unadded Warm-up Stretch exercises");
    assert.ok(!playerSrc.includes("safeExercises.slice(0, 10)"), "WorkoutPlayer must not truncate exercises at 10");
    assert.ok(!dailySrc.includes("getPreWorkoutStretchesForDay"), "DailyPlanView must not inject unadded Pre-Workout stretches");
    assert.ok(libSrc.includes("hasExplicitOverride"), "WorkoutLibrary modal must check explicit admin overrides before legacy fallback");

    const thirteenBench = Array.from({ length: 13 }, (_, i) => ({
      id: `b_${i}`,
      exerciseName: `Chest Bench ${i + 1}`,
      category: "Chest",
      muscleGroup: ["Chest"],
      addedByAdmin: true
    }));
    const purged = purgeMismatchedExercisesFromRoutine(thirteenBench, ["Chest"], "Chest Hypertrophy", [], "immortal_90", 1);
    assert.strictEqual(purged.cleanedExercises.length, 13, "purgeMismatchedExercisesFromRoutine must preserve all >10 kept admin drills");
  });

  it("6. addExerciseToProgramSchedule stamps addedByAdmin: true and replaces unadded legacy seed drills cleanly", () => {
    const original = getScheduleOverrides();
    try {
      setScheduleOverridesFromAdmin({
        ...original,
        strength_challenge: {
          "1": {
            title: "Day 1: Heavy Squats",
            exercises: [{ id: "seed_1", name: "Unadded Seed Squat", exerciseName: "Unadded Seed Squat" }],
            levels: {
              beginner: [{ id: "seed_1", name: "Unadded Seed Squat", exerciseName: "Unadded Seed Squat" }]
            }
          }
        }
      });

      addExerciseToProgramSchedule(
        {
          id: "admin_dl_1",
          name: "Admin Barbell Deadlift",
          category: "Strength",
          recommendedSets: "4",
          recommendedReps: "6-8",
          gifUrl: "https://example.com/deadlift.gif"
        },
        "strength_challenge",
        1,
        "beginner"
      );

      const plan = getWorkoutForProgramAndDay("strength_challenge", 1, undefined, { fitnessLevel: "Beginner" });
      assert.strictEqual(plan.exercises.length, 1, "Adding first admin drill clears legacy unadded seed drills");
      assert.strictEqual(plan.exercises[0].exerciseName, "Admin Barbell Deadlift");
      assert.strictEqual((plan.exercises[0] as any).addedByAdmin, true);
    } finally {
      setScheduleOverridesFromAdmin(original);
    }
  });
});
