import { describe, it } from "node:test";
import assert from "node:assert";
import { getWorkoutForProgramAndDay, CHALLENGE_PROGRAMS_METADATA } from "../data/challengeEngineDatabase";
import { getScheduleOverrides, setScheduleOverridesFromAdmin, subscribeScheduleOverrides } from "../utils/scheduleOverridesStore";
import { getHomeWorkoutForDay } from "../data/homeWorkoutChallengeData";
import { getDailyWorkoutForDay } from "../data/womenConfidenceProgramData";

describe("All 8 Program & Challenge Pages Workout Manifestation Integration", () => {
  const targetPrograms = [
    { id: "immortal_90", name: "Immortal 90-Day Challenge" },
    { id: "home_180", name: "180 Day Home Workout Challenge" },
    { id: "women_confidence", name: "Women Confidence Program" },
    { id: "belly_fat_shred", name: "Belly Fat Shred System" },
    { id: "posture_vitality", name: "Posture Correction Challenge" },
    { id: "lifestyle_academy", name: "Programs & Academy" }
  ];

  it("1. Metadata verification for all flagship programs", () => {
    targetPrograms.forEach(prog => {
      assert.ok(CHALLENGE_PROGRAMS_METADATA[prog.id as any], `Metadata exists for ${prog.id}`);
      assert.ok(CHALLENGE_PROGRAMS_METADATA[prog.id as any].name, `Program name exists for ${prog.id}`);
      assert.ok(CHALLENGE_PROGRAMS_METADATA[prog.id as any].totalDays > 0, `Total days > 0 for ${prog.id}`);
    });
  });

  it("2. Admin schedule override manifestation for Immortal 90-Day Challenge", () => {
    const testOverrides = {
      ...getScheduleOverrides(),
      immortal_90: {
        "1": {
          title: "Day 1: Heavy Chest & Delts Destruction",
          category: "Push Hypertrophy",
          levels: {
            beginner: [
              { id: "test_b1", exerciseName: "Push Ups", sets: 3, reps: "10-12 reps", restTime: "60s", gifUrl: "https://example.com/pushup.gif" }
            ],
            intermediate: [
              { id: "test_i1", exerciseName: "Incline Barbell Bench Press", sets: 4, reps: "8-10 reps", restTime: "75s", gifUrl: "https://example.com/incline.gif" },
              { id: "test_i2", exerciseName: "Flat Dumbbell Press", sets: 3, reps: "10 reps", restTime: "60s", gifUrl: "https://example.com/flatdb.gif" }
            ],
            advanced: [
              { id: "test_a1", exerciseName: "Weighted Dips", sets: 5, reps: "6-8 heavy reps", restTime: "90s", gifUrl: "https://example.com/dips.gif" },
              { id: "test_a2", exerciseName: "Incline Barbell Bench Press", sets: 5, reps: "5 reps", restTime: "120s", gifUrl: "https://example.com/heavyincline.gif" },
              { id: "test_a3", exerciseName: "Cable Flyes", sets: 4, reps: "12 reps", restTime: "45s", gifUrl: "https://example.com/fly.gif" }
            ]
          }
        }
      }
    };

    setScheduleOverridesFromAdmin(testOverrides);

    // Beginner check
    const begPlan = getWorkoutForProgramAndDay("immortal_90", 1, undefined, { fitnessLevel: "Beginner" });
    assert.strictEqual(begPlan.exercises.length, 1);
    assert.strictEqual(begPlan.exercises[0].exerciseName, "Push Ups");
    assert.strictEqual(begPlan.exercises[0].gifUrl, "https://example.com/pushup.gif");

    // Intermediate check
    const intPlan = getWorkoutForProgramAndDay("immortal_90", 1, undefined, { fitnessLevel: "Intermediate" });
    assert.strictEqual(intPlan.exercises.length, 2);
    assert.strictEqual(intPlan.exercises[0].exerciseName, "Incline Barbell Bench Press");

    // Advanced check
    const advPlan = getWorkoutForProgramAndDay("immortal_90", 1, undefined, { fitnessLevel: "Advanced" });
    assert.strictEqual(advPlan.exercises.length, 3);
    assert.strictEqual(advPlan.exercises[0].exerciseName, "Weighted Dips");
  });

  it("3. Admin schedule override manifestation for 180 Day Home Workout Challenge", () => {
    const testOverrides = {
      ...getScheduleOverrides(),
      home_180: {
        "1": {
          title: "Day 1: Calisthenics Core & Push Primer",
          category: "Bodyweight Push",
          levels: {
            beginner: [
              { id: "home_b1", exerciseName: "Knee Push Ups", sets: 3, reps: "8-10 reps", restTime: "45s", gifUrl: "https://example.com/kneepush.gif" }
            ],
            advanced: [
              { id: "home_a1", exerciseName: "Handstand Push Ups", sets: 4, reps: "6-8 reps", restTime: "90s", gifUrl: "https://example.com/handstand.gif" }
            ]
          }
        }
      }
    };
    setScheduleOverridesFromAdmin(testOverrides);

    const homeWorkout = getHomeWorkoutForDay(1, "Beginner", null, undefined, "Men");
    assert.ok(homeWorkout.exercises.length > 0);
    assert.strictEqual(homeWorkout.exercises[0].name, "Knee Push Ups");
    assert.strictEqual(homeWorkout.exercises[0].gifUrl, "https://example.com/kneepush.gif");

    const homeWorkoutAdv = getHomeWorkoutForDay(1, "Advanced", null, undefined, "Men");
    assert.strictEqual(homeWorkoutAdv.exercises.length, 1);
    assert.strictEqual(homeWorkoutAdv.exercises[0].name, "Handstand Push Ups");
  });

  it("4. Admin schedule override manifestation for Women Confidence Program", () => {
    const testOverrides = {
      ...getScheduleOverrides(),
      women_confidence: {
        "1": {
          title: "Day 1: Glute Architecture & Hip Thrust Priming",
          category: "Glutes & Hamstrings",
          levels: {
            beginner: [
              { id: "wc_b1", exerciseName: "Glute Bridges", sets: 3, reps: "15 reps", restTime: "45s", gifUrl: "https://example.com/bridge.gif" },
              { id: "wc_b2", exerciseName: "Bodyweight Romanian Deadlift", sets: 3, reps: "12 reps", restTime: "45s", gifUrl: "https://example.com/bwrdl.gif" }
            ]
          }
        }
      }
    };
    setScheduleOverridesFromAdmin(testOverrides);

    const womenPlan = getDailyWorkoutForDay(1, { fitnessLevel: "Beginner" } as any);
    assert.strictEqual(womenPlan.exercises.length, 2);
    assert.strictEqual(womenPlan.exercises[0].name, "Glute Bridges");
    assert.strictEqual(womenPlan.exercises[0].gifUrl, "https://example.com/bridge.gif");
  });

  it("5. Admin schedule override manifestation for Belly Fat Shred System", () => {
    const testOverrides = {
      ...getScheduleOverrides(),
      belly_fat_shred: {
        "1": {
          title: "Day 1: Deep Transverse Abdominis & Visceral Shred",
          category: "Full Body + Core",
          levels: {
            beginner: [
              { id: "bfs_b1", exerciseName: "Stomach Vacuum Holds", sets: 3, reps: "20s hold", restTime: "30s", gifUrl: "https://example.com/vacuum.gif" },
              { id: "bfs_b2", exerciseName: "Plank Hold", sets: 3, reps: "30s hold", restTime: "30s", gifUrl: "https://example.com/plank.gif" }
            ]
          }
        }
      }
    };
    setScheduleOverridesFromAdmin(testOverrides);

    const bellyPlan = getWorkoutForProgramAndDay("belly_fat_shred", 1, undefined, { fitnessLevel: "Beginner" });
    assert.strictEqual(bellyPlan.exercises.length, 2);
    assert.strictEqual(bellyPlan.exercises[0].exerciseName, "Stomach Vacuum Holds");
    assert.strictEqual(bellyPlan.exercises[0].gifUrl, "https://example.com/vacuum.gif");
  });

  it("6. Admin schedule override manifestation for Posture Correction Challenge", () => {
    const testOverrides = {
      ...getScheduleOverrides(),
      posture_vitality: {
        "1": {
          title: "Day 1: Thoracic Extension & Scapular Depressors",
          category: "Upper Back & Posture",
          levels: {
            beginner: [
              { id: "pv_b1", exerciseName: "Prone Cobra Chest Opener", sets: 3, reps: "12 reps", restTime: "45s", gifUrl: "https://example.com/cobra.gif" },
              { id: "pv_b2", exerciseName: "Scapular Wall Slides", sets: 3, reps: "10 reps", restTime: "45s", gifUrl: "https://example.com/slides.gif" }
            ],
            advanced: [] // Empty advanced routine leaves it strictly empty!
          }
        }
      }
    };
    setScheduleOverridesFromAdmin(testOverrides);

    const posturePlan = getWorkoutForProgramAndDay("posture_vitality", 1, undefined, { fitnessLevel: "Beginner" });
    assert.strictEqual(posturePlan.exercises.length, 2);
    assert.strictEqual(posturePlan.exercises[0].exerciseName, "Prone Cobra Chest Opener");

    // Strictly empty for advanced when admin leaves it empty
    const posturePlanAdv = getWorkoutForProgramAndDay("posture_vitality", 1, undefined, { fitnessLevel: "Advanced" });
    assert.strictEqual(posturePlanAdv.exercises.length, 0);
  });

  it("7. Admin schedule override manifestation for Programs & Academy", () => {
    const testOverrides = {
      ...getScheduleOverrides(),
      lifestyle_academy: {
        "1": {
          title: "Day 1: Desk Reversal Alignment & Kinetic Reset",
          category: "Postural Longevity",
          levels: {
            beginner: [
              { id: "lfa_b1", exerciseName: "Deadbug Core Stabilization", sets: 3, reps: "10 per side", restTime: "45s", gifUrl: "https://example.com/deadbug.gif" }
            ]
          }
        }
      }
    };
    setScheduleOverridesFromAdmin(testOverrides);

    const academyPlan = getWorkoutForProgramAndDay("lifestyle_academy", 1, undefined, { fitnessLevel: "Beginner" });
    assert.strictEqual(academyPlan.exercises.length, 1);
    assert.strictEqual(academyPlan.exercises[0].exerciseName, "Deadbug Core Stabilization");
    assert.strictEqual(academyPlan.exercises[0].gifUrl, "https://example.com/deadbug.gif");
  });

  it("8. Subscriber notification triggers on admin change", () => {
    let triggered = false;
    const unsub = subscribeScheduleOverrides(() => {
      triggered = true;
    });

    setScheduleOverridesFromAdmin({
      ...getScheduleOverrides(),
      test_trigger: { "1": { title: "Test" } }
    });

    assert.strictEqual(triggered, true);
    unsub();
  });
});
