import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { EXERCISES, AUTHENTIC_STRETCH_EXERCISES, getExerciseGifUrl } from "../data/exercises";
import { resolveAuthenticExercise } from "../data/authoritativeExerciseMap";
import { isExplicitlyMarkedWomenWorkout } from "../data/womenConfidenceProgramData";
import { isExerciseMatch } from "../utils/exerciseMatching";
import { hydrateHiddenOverrideExercises, buildTombstoneMatcher } from "../utils/exerciseHydration";

const readSrc = (relPath: string) =>
  fs.readFileSync(path.join(process.cwd(), relPath), "utf-8");

describe("Exercise Visibility, Duplicate Prevention & GIF Integrity Suite", () => {
  it("1. getExerciseGifUrl never assigns Bench Press or another exercise's GIF to unknown/new exercises", () => {
    const customNames = [
      ["Bulgarian Split Press XYZ", "Chest"],
      ["Cable Pallof Iso Hold 999", "Core"],
      ["Weighted Diamond Push Up Custom", "Chest"],
      ["Unilateral Kettlebell Z Press", "Shoulders"]
    ] as const;

    for (const [name, cat] of customNames) {
      const gif = getExerciseGifUrl(name, cat);
      assert.strictEqual(gif, "", `Expected empty GIF for non-canonical "${name}", got "${gif}"`);
    }
  });

  it("2. resolveAuthenticExercise honors explicit fallbackGifUrl instead of substring-matching another exercise", () => {
    const customUrl = "https://example.com/weighted-diamond-pushup.gif";
    const resolved = resolveAuthenticExercise("Weighted Diamond Push Up", customUrl, "Chest");
    assert.strictEqual(resolved.gifUrl, customUrl);

    assert.strictEqual(
      isExerciseMatch("Face Pull", "Triceps Cable Rope Pushdown"),
      false,
      "Face Pull must never alias to Triceps Cable Rope Pushdown"
    );
    assert.strictEqual(
      isExerciseMatch("Dead Bug", "Bicycle Crunches"),
      false,
      "Dead Bug must never alias to Bicycle Crunches"
    );
  });

  it("3. isExplicitlyMarkedWomenWorkout does not hide Unisex/general workouts from public library", () => {
    assert.strictEqual(
      isExplicitlyMarkedWomenWorkout({
        name: "T BAR ROW",
        category: "Back",
        genderSuitability: "Unisex",
        womenCategories: ["Tone & Posture"]
      }),
      false
    );
    assert.strictEqual(
      isExplicitlyMarkedWomenWorkout({
        name: "Sumo Deadlift",
        category: "Legs",
        womenCategories: ["Glute & Lower Body Shaping"],
        programAssignments: ["Women Confidence Program"]
      }),
      false
    );
    assert.strictEqual(
      isExplicitlyMarkedWomenWorkout({
        name: "Sculpting Glute Kickback",
        category: "Women Glutes",
        genderSuitability: "Women"
      }),
      true
    );
  });

  it("4. hydrateHiddenOverrideExercises recovers non-deleted exerciseName-only and exercise-* slug entries with their own GIFs while honoring tombstones", () => {
    const overridesObj = JSON.parse(readSrc("src/data/custom_exercise_overrides.json"));
    const deletedArr: string[] = JSON.parse(readSrc("src/data/custom_deleted_exercises.json"));

    const isUsableMedia = (u: any): u is string => {
      if (!u || typeof u !== "string") return false;
      const t = u.trim().toLowerCase();
      return Boolean(t && t !== "none" && t !== "deleted" && t !== "null");
    };

    const hydrated = hydrateHiddenOverrideExercises(
      overridesObj,
      [...EXERCISES, ...AUTHENTIC_STRETCH_EXERCISES],
      deletedArr,
      isUsableMedia,
      getExerciseGifUrl
    );

    const byName = new Map(hydrated.map((ex) => [ex.name.toLowerCase().trim(), ex]));
    const tombstoneMatcher = buildTombstoneMatcher(deletedArr);

    // Previously hidden exerciseName-only custom exercises MUST appear with their exact GIFs
    for (const expectedName of [
      "face pull",
      "push up",
      "dumbbell 6 way raise",
      "leaning single arm dumbbell lateral raise",
      "seated rear lateral dumbbell raise"
    ]) {
      const found = byName.get(expectedName);
      assert.ok(found, `Hidden exercise "${expectedName}" must hydrate into active library`);
      assert.ok(isUsableMedia(found.gifUrl), `Hydrated "${expectedName}" must retain its GIF URL`);
    }

    // Previously hidden exercise-* slug exercises MUST appear with clean Title Case names & exact GIFs
    for (const expectedSlugName of ["arnold press", "dead bug", "12 3 30 treadmill walk"]) {
      const found = byName.get(expectedSlugName);
      assert.ok(found, `Hidden slug exercise "${expectedSlugName}" must hydrate into active library`);
      assert.ok(isUsableMedia(found.gifUrl), `Hydrated slug "${expectedSlugName}" must retain its GIF URL`);
    }

    // Tombstoned exercises (including singular/plural variant exercise-bicycle-crunch) MUST remain deleted
    for (const ex of hydrated) {
      assert.strictEqual(
        tombstoneMatcher(ex.id, ex.name),
        false,
        `Tombstoned exercise "${ex.name}" (${ex.id}) must stay hidden`
      );
    }
    assert.strictEqual(byName.has("bicycle crunch"), false, "Tombstoned bicycle crunch must not resurrect");
  });

  it("5. Admin & Server creation paths preserve blank/custom GIFs cleanly and skip bare media stubs on duplicate checks", () => {
    const appCtxSrc = readSrc("src/context/AppContext.tsx");
    const serverSrc = readSrc("server.ts");
    const addModalSrc = readSrc("src/components/admin/AddWorkoutModal.tsx");
    const editorSrc = readSrc("src/components/admin/AdminWorkoutEditor.tsx");
    const engineSrc = readSrc("src/components/admin/AdminWorkoutChallengeEngine.tsx");

    assert.ok(appCtxSrc.includes("hydrateHiddenOverrideExercises"), "AppContext must use shared hidden override hydration");
    assert.ok(appCtxSrc.includes('onSnapshot(collection(db, "generated_exercises")'), "AppContext must listen to generated_exercises in real time");
    assert.ok(serverSrc.includes("deriveExerciseNameFromEntry"), "server.ts must normalize exerciseName-only & exercise-* overrides");
    assert.ok(serverSrc.includes("hasExerciseFields"), "server.ts /api/exercises/create must ignore bare media stubs when checking duplicates");
    assert.ok(!addModalSrc.includes("customGifUrl.trim() || getExerciseGifUrl"), "AddWorkoutModal must not auto-substitute fallback GIF URLs on blank input");
    assert.ok(editorSrc.includes("handleCloseAddModal"), "AdminWorkoutEditor must reset modal state on close so previous GIF URLs never leak");
    assert.ok(!engineSrc.includes("usedGifsInRoutine.has(assignedGif)"), "ChallengeEngine must not overwrite an exercise's own GIF on usedGifsInRoutine collision");
  });
});
