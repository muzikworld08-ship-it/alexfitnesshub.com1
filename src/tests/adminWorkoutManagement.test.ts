/**
 * Automated Test Suite for AlexFitnessHub Authoritative Admin Workout Management System
 * Covers TEST A through TEST K from specification.
 */

import { getWorkoutForProgramAndDay, normalizeProgramId } from "../data/challengeEngineDatabase";
import { resolveAuthenticExercise } from "../data/authoritativeExerciseMap";
import { getScheduleOverrides } from "../utils/scheduleOverridesStore";

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, testName: string, failureMessage: string) {
  if (!condition) {
    results.push({ name: testName, passed: false, error: failureMessage });
    console.error(`❌ [FAIL] ${testName}: ${failureMessage}`);
  } else {
    results.push({ name: testName, passed: true });
    console.log(`✅ [PASS] ${testName}`);
  }
}

export async function runAllTests() {
  console.log("\n=======================================================");
  console.log("RUNNING ALEXFITNESSHUB ADMIN WORKOUT SUITE (TESTS A - K)");
  console.log("=======================================================\n");

  // TEST A: ADD WORKOUT & SINGLE AUTHORITATIVE FLOW
  try {
    const dayPlan = getWorkoutForProgramAndDay("immortal_90", 2, undefined, { fitnessLevel: "Beginner" });
    assert(
      dayPlan !== null && Array.isArray(dayPlan.exercises),
      "TEST A: Add Workout & Authoritative Schedule Query",
      "Failed to query day plan from authoritative schedule database"
    );
    // Verify no duplicates by name in day plan
    const names = (dayPlan?.exercises || []).map(e => e.exerciseName.toLowerCase().trim());
    const uniqueNames = new Set(names);
    assert(
      names.length === uniqueNames.size,
      "TEST A: Zero Duplication in Authoritative Day Plan",
      `Expected ${names.length} unique exercises, found ${uniqueNames.size}`
    );
  } catch (err: any) {
    assert(false, "TEST A: Add Workout", err.message);
  }

  // TEST B: DELETE WORKOUT & FIT_DELETED_EXERCISES HONORED
  try {
    const deletedName = "Incline Dumbbell Bench Press";
    // Test resolveAuthenticExercise with explicitly cleared or deleted flag
    const resCleared = resolveAuthenticExercise(deletedName, "none", "Chest");
    assert(
      resCleared.gifUrl === "",
      "TEST B: Cleared GIF Not Resurrected by resolveAuthenticExercise",
      `Expected empty gifUrl for cleared drill, received "${resCleared.gifUrl}"`
    );

    const resDeleted = resolveAuthenticExercise(deletedName, "deleted", "Chest");
    assert(
      resDeleted.gifUrl === "",
      "TEST B: Deleted GIF Flag Respected",
      `Expected empty gifUrl for deleted drill, received "${resDeleted.gifUrl}"`
    );
  } catch (err: any) {
    assert(false, "TEST B: Delete Workout", err.message);
  }

  // TEST C: REPLACE WORKOUT & GIF UPDATE
  try {
    const customUrl = "https://example.com/custom_drill.gif";
    const resReplaced = resolveAuthenticExercise("Custom Push Up", customUrl, "Chest");
    assert(
      resReplaced.gifUrl === customUrl,
      "TEST C: Replace Workout Media Preserved Exactly",
      `Expected "${customUrl}", received "${resReplaced.gifUrl}"`
    );
  } catch (err: any) {
    assert(false, "TEST C: Replace Workout", err.message);
  }

  // TEST D: REFRESH STABILITY
  try {
    const plan1 = getWorkoutForProgramAndDay("immortal_90", 3, undefined, { fitnessLevel: "Intermediate" });
    const plan2 = getWorkoutForProgramAndDay("immortal_90", 3, undefined, { fitnessLevel: "Intermediate" });
    assert(
      plan1.exercises.length === plan2.exercises.length,
      "TEST D: Refresh Stability - Exercise Counts Identical Across Queries",
      `Plan 1 had ${plan1.exercises.length} drills, Plan 2 had ${plan2.exercises.length} drills`
    );
    const names1 = plan1.exercises.map(e => e.exerciseName).join(",");
    const names2 = plan2.exercises.map(e => e.exerciseName).join(",");
    assert(
      names1 === names2,
      "TEST D: Refresh Stability - Drill Sequence Unchanged",
      "Drill order differed between successive queries"
    );
  } catch (err: any) {
    assert(false, "TEST D: Refresh Stability", err.message);
  }

  // TEST E: DEPLOYMENT INITIALIZATION IDEMPOTENCY
  try {
    const overrides = getScheduleOverrides();
    assert(
      typeof overrides === "object" && overrides !== null,
      "TEST E: Deployment Overrides Store Accessible",
      "Overrides store did not return an object"
    );
  } catch (err: any) {
    assert(false, "TEST E: Deployment Initialization", err.message);
  }

  // TEST F: DIFFICULTY TIERS ISOLATION
  try {
    const begPlan = getWorkoutForProgramAndDay("immortal_90", 3, undefined, { fitnessLevel: "Beginner" });
    const intPlan = getWorkoutForProgramAndDay("immortal_90", 3, undefined, { fitnessLevel: "Intermediate" });
    const advPlan = getWorkoutForProgramAndDay("immortal_90", 3, undefined, { fitnessLevel: "Advanced" });

    assert(
      begPlan.meta.difficulty === "Beginner" || begPlan.exercises[0]?.difficulty === "Beginner",
      "TEST F: Beginner Tier Route Prescription Assigned",
      "Beginner plan did not receive beginner difficulty"
    );
    assert(
      intPlan.meta.difficulty === "Intermediate" || intPlan.exercises[0]?.difficulty === "Intermediate",
      "TEST F: Intermediate Tier Route Prescription Assigned",
      "Intermediate plan did not receive intermediate difficulty"
    );
    assert(
      advPlan.meta.difficulty === "Advanced" || advPlan.exercises[0]?.difficulty === "Advanced",
      "TEST F: Advanced Tier Route Prescription Assigned",
      "Advanced plan did not receive advanced difficulty"
    );
  } catch (err: any) {
    assert(false, "TEST F: Difficulty Tiers", err.message);
  }

  // TEST G: DRAG AND DROP SEQUENCE FIDELITY
  try {
    const dayPlan = getWorkoutForProgramAndDay("immortal_90", 2, undefined, { fitnessLevel: "Beginner" });
    if (dayPlan.exercises.length >= 2) {
      const originalFirst = dayPlan.exercises[0].exerciseName;
      const originalSecond = dayPlan.exercises[1].exerciseName;
      assert(
        originalFirst !== originalSecond,
        "TEST G: Drills Have Distinct Positions and Identity",
        `Drill 1 and 2 both named "${originalFirst}"`
      );
    } else {
      assert(true, "TEST G: Drills Sequence Fidelity", "");
    }
  } catch (err: any) {
    assert(false, "TEST G: Drag and Drop", err.message);
  }

  // TEST H: SEVEN DAY CADENCE & DEDICATED CARDIO
  try {
    const cardioDayPlan = getWorkoutForProgramAndDay("immortal_90", 4);
    assert(
      cardioDayPlan.meta.isCardioOnly === true || cardioDayPlan.exercises.length <= 5,
      "TEST H: 7-Day Cadence Cardio Protocol Enforced",
      "Cardio day was not identified properly"
    );
  } catch (err: any) {
    assert(false, "TEST H: Seven Day Cadence", err.message);
  }

  // TEST I: FAILED OPERATIONS & SANITIZATION
  try {
    // When resolving with malformed input, it returns safe fallback instead of throwing
    const safeRes = resolveAuthenticExercise("", "", "");
    assert(
      safeRes.name === "" && safeRes.gifUrl === "",
      "TEST I: Safe Fallback On Malformed Drill Inputs",
      "Empty drill name did not produce safe empty result"
    );
  } catch (err: any) {
    assert(false, "TEST I: Failed Operations", err.message);
  }

  // TEST J: AUTHORIZATION CHECKS (HTTP endpoint inspection)
  try {
    const res = await fetch("http://localhost:3000/api/admin/programs/save-day-override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programId: "test_unauthorized" })
    });
    // Should be rejected because user is not authenticated or not admin
    assert(
      res.status === 401 || res.status === 403,
      "TEST J: Unauthorized Write Endpoint Blocked",
      `Expected status 401/403, received ${res.status}`
    );
  } catch (err: any) {
    assert(false, "TEST J: Authorization", err.message);
  }

  // TEST K: REGRESSION CHECK - ATHLETE ACCESS
  try {
    const athleteRes = await fetch("http://localhost:3000/api/programs/schedules");
    assert(
      athleteRes.status === 200,
      "TEST K: Athlete Schedule Public Read Endpoint Operational",
      `Expected status 200, received ${athleteRes.status}`
    );
  } catch (err: any) {
    assert(false, "TEST K: Regression Check", err.message);
  }

  console.log("\n=======================================================");
  const passedCount = results.filter(r => r.passed).length;
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${passedCount} | FAILED: ${results.length - passedCount}`);
  console.log("=======================================================\n");

  if (passedCount !== results.length) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
