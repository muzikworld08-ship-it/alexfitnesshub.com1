import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "fs";
import path from "path";
import { DEFAULT_DELETED_PDF_IDS, getDeletedPdfIds, getPdfProducts, INITIAL_PDF_PRODUCTS } from "../server/printablePdfEngine";
import { DEFAULT_CLIENT_DELETED_PDF_IDS, getClientDeletedPdfIds } from "../services/printablePdfService";
import { buildDynamicDayPlan } from "../utils/dynamicWorkoutEngine";
import { EXERCISES } from "../data/exercises";

describe("ALEXFITNESSHUB: PDF Deletion, Cardio Message & Rest Day Validation", () => {
  it("TEST V1: Initial default PDF products must be empty", () => {
    assert.strictEqual(INITIAL_PDF_PRODUCTS.length, 0, "INITIAL_PDF_PRODUCTS must be empty so default seed never re-seeds");
  });

  it("TEST V2: The 5 specified PDF products are permanently in deleted IDs set", () => {
    const expectedDeleted = [
      "afh-guide-stamina-nutrition",
      "afh-journal-fitness-progress",
      "afh-journal-weight-loss",
      "afh-planner-gym-energy",
      "afh-tracker-workout-pro"
    ];

    expectedDeleted.forEach(id => {
      assert.ok(DEFAULT_DELETED_PDF_IDS.includes(id), `DEFAULT_DELETED_PDF_IDS must include ${id}`);
      assert.ok(DEFAULT_CLIENT_DELETED_PDF_IDS.includes(id), `DEFAULT_CLIENT_DELETED_PDF_IDS must include ${id}`);
    });

    const deletedSet = getDeletedPdfIds();
    expectedDeleted.forEach(id => {
      assert.ok(deletedSet.has(id), `getDeletedPdfIds() must include ${id}`);
    });

    const clientSet = getClientDeletedPdfIds();
    expectedDeleted.forEach(id => {
      assert.ok(clientSet.has(id), `getClientDeletedPdfIds() must include ${id}`);
    });
  });

  it("TEST V3: getPdfProducts returns 0 default seed products", () => {
    const prods = getPdfProducts();
    const expectedDeleted = [
      "afh-guide-stamina-nutrition",
      "afh-journal-fitness-progress",
      "afh-journal-weight-loss",
      "afh-planner-gym-energy",
      "afh-tracker-workout-pro"
    ];
    prods.forEach(p => {
      assert.ok(!expectedDeleted.includes(p.id), `Product ${p.id} must NOT be returned in catalog`);
    });
  });

  it("TEST V4: Cardio Day returns 0 weightlifting exercises across engines", () => {
    // Thursday is cardio on immortal_90
    const cardioPlan = buildDynamicDayPlan("immortal_90", 4, EXERCISES);
    assert.strictEqual(cardioPlan.meta.isCardioOnly, true, "Day 4 must be isCardioOnly");
    assert.strictEqual(cardioPlan.exercises.length, 0, "Cardio Day must have 0 weightlifting exercises");
  });

  it("TEST V5: Rest Day returns 0 exercises across engines", () => {
    // Sunday is rest day on immortal_90
    const restPlan = buildDynamicDayPlan("immortal_90", 7, EXERCISES);
    assert.strictEqual(restPlan.meta.isRestDay, true, "Day 7 must be isRestDay");
    assert.strictEqual(restPlan.exercises.length, 0, "Rest Day must have 0 exercises");
  });

  it("TEST V6: User rest day asset exists on disk", () => {
    const assetPath = path.join(process.cwd(), "public", "assets", "aistudio", "image_68aeee33.png");
    assert.ok(fs.existsSync(assetPath), "Rest day image asset /public/assets/aistudio/image_68aeee33.png must exist");
    const stats = fs.statSync(assetPath);
    assert.ok(stats.size > 10000, "Rest day image asset must be a valid image file");
  });
});
