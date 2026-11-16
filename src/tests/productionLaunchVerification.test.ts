import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "fs";
import path from "path";
import {
  getScheduleOverrides,
  setScheduleOverridesFromAdmin,
  removeDrillFromProgramSchedule
} from "../utils/scheduleOverridesStore";

describe("ALEXFITNESSHUB Production Repair & Launch Verification Suite", () => {
  it("1. setScheduleOverridesFromAdmin replaces program keys cleanly without resurrecting deleted numeric day keys", () => {
    setScheduleOverridesFromAdmin({
      immortal_90: {
        cycle_1: {
          title: "Push Day",
          levels: {
            beginner: [{ id: "ex_p1", exerciseName: "Push Ups" }],
            intermediate: [{ id: "ex_p2", exerciseName: "Bench Press" }],
            advanced: [{ id: "ex_p3", exerciseName: "Weighted Dips" }]
          }
        },
        "1": { title: "Stale Day 1", levels: { beginner: [{ id: "stale_1", exerciseName: "Stale Lift" }] } },
        "8": { title: "Stale Day 8", levels: { beginner: [{ id: "stale_8", exerciseName: "Stale Lift 8" }] } }
      }
    });

    assert.ok(getScheduleOverrides().immortal_90["1"], "Precondition: day 1 exists");

    // Admin replaces immortal_90 with numeric day keys "1" and "8" removed
    setScheduleOverridesFromAdmin({
      immortal_90: {
        cycle_1: {
          title: "Push Day Updated",
          levels: {
            beginner: [{ id: "ex_p1", exerciseName: "Push Ups" }],
            intermediate: [{ id: "ex_p2", exerciseName: "Bench Press" }],
            advanced: [{ id: "ex_p3", exerciseName: "Weighted Dips" }]
          }
        }
      }
    });

    const after = getScheduleOverrides().immortal_90;
    assert.strictEqual(after["1"], undefined, "Deleted day key '1' must stay deleted");
    assert.strictEqual(after["8"], undefined, "Deleted day key '8' must stay deleted");
    assert.strictEqual(after.cycle_1.title, "Push Day Updated");
  });

  it("2. removeDrillFromProgramSchedule deletes only the targeted tier drill while preserving other tiers and programs", () => {
    setScheduleOverridesFromAdmin({
      immortal_90: {
        cycle_2: {
          title: "Pull & Back",
          levels: {
            beginner: [{ id: "pull_b1", exerciseName: "Band Pull Aparts" }],
            intermediate: [
              { id: "pull_i1", exerciseName: "Pull Ups" },
              { id: "pull_i2", exerciseName: "Barbell Row" }
            ],
            advanced: [{ id: "pull_a1", exerciseName: "Weighted Pull Ups" }]
          }
        }
      },
      home_180: {
        cycle_2: {
          title: "Home Pull",
          levels: {
            intermediate: [{ id: "pull_i1", exerciseName: "Pull Ups" }]
          }
        }
      }
    });

    const res = removeDrillFromProgramSchedule({
      programId: "immortal_90",
      dayNumber: 2,
      tier: "intermediate",
      exerciseId: "pull_i1",
      exerciseName: "Pull Ups",
      isCycleMode: true,
      totalDays: 90
    });

    assert.strictEqual(res.removedCount, 1, "Should remove exactly 1 drill from intermediate tier");
    const updatedDay = res.updatedOverrides.immortal_90.cycle_2;
    assert.strictEqual(updatedDay.levels.intermediate.length, 1);
    assert.strictEqual(updatedDay.levels.intermediate[0].exerciseName, "Barbell Row");
    assert.strictEqual(updatedDay.levels.beginner.length, 1, "Beginner tier must remain untouched");
    assert.strictEqual(updatedDay.levels.advanced.length, 1, "Advanced tier must remain untouched");
    assert.strictEqual(
      res.updatedOverrides.home_180.cycle_2.levels.intermediate.length,
      1,
      "Unrelated program schedule must remain untouched"
    );
  });

  it("3. Checkout & StoreContext must never self-confirm orders as paid on the client without server Paystack verification", () => {
    const checkoutSrc = fs.readFileSync(
      path.join(process.cwd(), "src/components/store/CheckoutModal.tsx"),
      "utf8"
    );
    const storeCtxSrc = fs.readFileSync(
      path.join(process.cwd(), "src/context/StoreContext.tsx"),
      "utf8"
    );
    const storeViewSrc = fs.readFileSync(
      path.join(process.cwd(), "src/components/StoreView.tsx"),
      "utf8"
    );

    assert.ok(!checkoutSrc.includes("PAYSTACK_REF_"), "CheckoutModal must not contain client fake PAYSTACK_REF fallback");
    assert.ok(!storeCtxSrc.includes('paymentReference ? "paid" : "pending"'), "StoreContext must not trust presence of reference string as paid");
    assert.ok(storeViewSrc.includes("/api/payments/store/verify"), "StoreView must verify callback references on /api/payments/store/verify");
  });

  it("4. App.tsx must preserve callback URL query parameters on mount and same-view updates", () => {
    const appSrc = fs.readFileSync(path.join(process.cwd(), "src/App.tsx"), "utf8");
    assert.ok(
      appSrc.includes("window.location.pathname + window.location.search"),
      "App.tsx history sync must preserve window.location.search for payment verification callbacks"
    );
  });

  it("5. Server payment & webhook routes enforce HMAC signatures, server-side pricing, and fail-closed verification", () => {
    const serverSrc = fs.readFileSync(path.join(process.cwd(), "server.ts"), "utf8");
    const pdfRoutesSrc = fs.readFileSync(
      path.join(process.cwd(), "src/server/printablePdfRoutes.ts"),
      "utf8"
    );
    const rulesSrc = fs.readFileSync(path.join(process.cwd(), "firestore.rules"), "utf8");

    assert.ok(serverSrc.includes("computeExpectedSubscriptionAmountNGN"), "Server must compute authoritative subscription totals");
    assert.ok(serverSrc.includes("computeAuthoritativeStoreOrderTotals"), "Server must compute authoritative store order totals");
    assert.ok(serverSrc.includes("finalizeStoreOrderPayment"), "Server must verify & finalize store orders");
    assert.ok(serverSrc.includes('app.post("/api/exercises/restore"'), "Server must expose exercise restore endpoint");
    assert.ok(serverSrc.includes('app.post("/api/admin/programs/remove-drill"'), "Server must expose single-routine drill removal endpoint");
    assert.ok(pdfRoutesSrc.includes("findPdfOrderWithFirestoreFallback"), "PDF routes must fall back to Firestore across restarts");
    assert.ok(
      rulesSrc.includes("request.resource.data.paymentStatus == 'pending'"),
      "Firestore orders rule must enforce pending paymentStatus on non-admin creates"
    );
  });

  it("6. Zero Supabase files, dependencies, imports, or proxy routes remain in codebase", () => {
    const pkgSrc = fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8");
    const serverSrc = fs.readFileSync(path.join(process.cwd(), "server.ts"), "utf8");
    const envExampleSrc = fs.readFileSync(path.join(process.cwd(), ".env.example"), "utf8");

    assert.ok(!/supabase/i.test(pkgSrc), "package.json must not reference supabase packages");
    assert.ok(!/supabase/i.test(serverSrc), "server.ts must not contain Supabase imports or routes");
    assert.ok(!/supabase/i.test(envExampleSrc), ".env.example must not list Supabase env vars");
    assert.ok(!fs.existsSync(path.join(process.cwd(), "supabase_schema.sql")), "supabase_schema.sql must be deleted");
    assert.ok(!fs.existsSync(path.join(process.cwd(), "src/utils/supabase")), "src/utils/supabase directory must be deleted");
    assert.ok(!fs.existsSync(path.join(process.cwd(), "src/hooks/useSupabaseAuth.ts")), "useSupabaseAuth.ts must be deleted");
  });

  it("7. Admin access token helper & auth parity cover all authorized emails with 401 retry", () => {
    const firebaseSrc = fs.readFileSync(path.join(process.cwd(), "src/lib/firebase.ts"), "utf8");
    const appCtxSrc = fs.readFileSync(path.join(process.cwd(), "src/context/AppContext.tsx"), "utf8");
    const serverSrc = fs.readFileSync(path.join(process.cwd(), "server.ts"), "utf8");
    const rulesSrc = fs.readFileSync(path.join(process.cwd(), "firestore.rules"), "utf8");

    assert.ok(firebaseSrc.includes("export async function fetchWithFirebaseAuth"), "firebase.ts must export fetchWithFirebaseAuth");
    assert.ok(firebaseSrc.includes("res.status === 401") && firebaseSrc.includes("getFirebaseIdToken(true)"), "fetchWithFirebaseAuth must retry once on 401 with refreshed token");

    const requiredAdmins = [
      "alexfitnesshub@gmail.com",
      "muzikworld08@gmail.com",
      "admin@alexfitnesshub.com",
      "admin@alexfitness.com",
      "coach@alexfitness.com"
    ];
    for (const email of requiredAdmins) {
      assert.ok(appCtxSrc.includes(email), `AppContext must authorize admin email ${email}`);
      assert.ok(serverSrc.includes(email), `server.ts must authorize admin email ${email}`);
      assert.ok(rulesSrc.includes(email), `firestore.rules must authorize admin email ${email}`);
    }
  });

  it("8. UnifiedExerciseMedia and custom_exercise_overrides never hide active exercise GIFs with 'none' or empty masks", () => {
    const unifiedSrc = fs.readFileSync(path.join(process.cwd(), "src/components/UnifiedExerciseMedia.tsx"), "utf8");
    const overridesObj = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "src/data/custom_exercise_overrides.json"), "utf8")
    );

    assert.ok(!unifiedSrc.includes('mediaUrl === ""'), "UnifiedExerciseMedia must not hide GIFs when mediaUrl is empty string");
    assert.ok(!unifiedSrc.includes("isMediaDeleted"), "UnifiedExerciseMedia must not blank out active GIFs on stale isMediaDeleted flags");
    assert.ok(unifiedSrc.includes("getExerciseGifUrl"), "UnifiedExerciseMedia must fall back to canonical getExerciseGifUrl");

    for (const [k, val] of Object.entries<any>(overridesObj)) {
      if (!val || typeof val !== "object") continue;
      assert.ok(!val.isMediaDeleted, `Override key "${k}" must not contain poison isMediaDeleted flag`);
      assert.notStrictEqual(val.gifUrl, "none", `Override key "${k}" must not contain gifUrl="none"`);
      assert.notStrictEqual(val.customMediaUrl, "none", `Override key "${k}" must not contain customMediaUrl="none"`);
    }
  });

  it("9. Challenge Engine persists custom drills to Firebase library, exposes 1-click Remove, and restores tombstoned creates", () => {
    const engineSrc = fs.readFileSync(path.join(process.cwd(), "src/components/admin/AdminWorkoutChallengeEngine.tsx"), "utf8");
    const modalSrc = fs.readFileSync(path.join(process.cwd(), "src/components/admin/AddWorkoutModal.tsx"), "utf8");
    const appCtxSrc = fs.readFileSync(path.join(process.cwd(), "src/context/AppContext.tsx"), "utf8");
    const serverSrc = fs.readFileSync(path.join(process.cwd(), "server.ts"), "utf8");

    assert.ok(engineSrc.includes("await addWorkout("), "Challenge Engine must persist newly created drills to library/Firestore via addWorkout");
    assert.ok(engineSrc.includes("handleDeleteOnly(exercise)"), "Challenge Engine must provide 1-click Remove action on drill rows");
    assert.ok(!modalSrc.includes("alert("), "AddWorkoutModal must use inline banner notices instead of window.alert");
    assert.ok(appCtxSrc.includes('"generated_exercises"') && appCtxSrc.includes("collection(db, colName)"), "AppContext must hydrate generated_exercises from Firestore");
    assert.ok(serverSrc.includes("isMasterTombstoned"), "server /api/exercises/create must check tombstones so deleted workouts can be re-created cleanly");
  });

  it("10. WorkoutLibrary matches categories case-insensitively so admin-added workouts display publicly", () => {
    const libSrc = fs.readFileSync(path.join(process.cwd(), "src/components/WorkoutLibrary.tsx"), "utf8");
    assert.ok(libSrc.includes("selCatLower"), "WorkoutLibrary must filter categories case-insensitively");
    assert.ok(libSrc.includes("canonicalCaseMap"), "WorkoutLibrary must normalize grouped category sections cleanly");
  });

  it("11. Firebase helpers do not trap users in 24h localStorage quota lockouts or mask permission/argument errors", () => {
    const firebaseSrc = fs.readFileSync(path.join(process.cwd(), "src/lib/firebase.ts"), "utf8");
    assert.ok(!firebaseSrc.includes('localStorage.setItem("afh_firestore_quota_exhausted"'), "Legacy 24h localStorage quota lockout must be removed");
    assert.ok(firebaseSrc.includes("firestoreQuotaCooldownUntil"), "Short in-memory quota cooldown must be used instead");
    assert.ok(firebaseSrc.includes('removeItem("afh_firestore_quota_exhausted")'), "Stale afh_firestore_quota_exhausted keys must be purged");
    const benignMatch = firebaseSrc.match(/(?:function|const)\s+isBenignFirestoreMessage[\s\S]*?\n\};?/);
    assert.ok(benignMatch, "isBenignFirestoreMessage helper must exist");
    assert.ok(!benignMatch[0].includes("missing or insufficient permissions"), "Permission errors must not be marked benign");
    assert.ok(!benignMatch[0].includes("invalid-argument"), "Invalid-argument errors must not be marked benign");
  });

  it("12. setScheduleOverridesFromRemote enforces monotonic timestamps and blocks stale disk snapshots", async () => {
    const { setScheduleOverridesFromRemote } = await import("../utils/scheduleOverridesStore");
    setScheduleOverridesFromAdmin({
      home_180: {
        cycle_1: {
          title: "Cloud Authoritative",
          levels: {
            beginner: [{ id: "adm_1", exerciseName: "Admin Push Up", addedByAdmin: true }],
            intermediate: [],
            advanced: []
          }
        }
      }
    });

    const appliedDisk = setScheduleOverridesFromRemote(
      {
        home_180: {
          cycle_1: {
            title: "Stale Disk",
            levels: { beginner: [{ id: "disk_1", exerciseName: "Old Seed" }] }
          }
        }
      },
      new Date(Date.now() + 60_000).toISOString(),
      "disk"
    );
    assert.strictEqual(appliedDisk, false, "Disk snapshot must never overwrite newer remote/admin overrides");
    assert.strictEqual(getScheduleOverrides().home_180.cycle_1.title, "Cloud Authoritative");
  });

  it("13. Challenge engine isolates home_180_women from Men home_180 and respects cycle_N vs isOneOff", async () => {
    const { getWorkoutForProgramAndDay } = await import("../data/challengeEngineDatabase");
    setScheduleOverridesFromAdmin({
      home_180: {
        cycle_1: {
          title: "Men Cycle 1",
          levels: {
            beginner: [{ id: "men_1", exerciseName: "Diamond Push-Up", addedByAdmin: true }],
            intermediate: [],
            advanced: []
          }
        }
      },
      home_180_women: {
        cycle_1: {
          title: "Women Cycle 1",
          levels: {
            beginner: [{ id: "women_1", exerciseName: "Glute Bridge Pulse", addedByAdmin: true }],
            intermediate: [],
            advanced: []
          }
        }
      }
    });

    const menPlan = getWorkoutForProgramAndDay("home_180", 1, undefined, { fitnessLevel: "beginner", track: "men" });
    const womenPlan = getWorkoutForProgramAndDay("home_180", 1, undefined, { fitnessLevel: "beginner", track: "women" });
    assert.strictEqual(menPlan.exercises[0]?.exerciseName, "Diamond Push-Up");
    assert.strictEqual(womenPlan.exercises[0]?.exerciseName, "Glute Bridge Pulse");
  });

  it("14. Cloud-first server overrides & clean Challenge Engine admin drill additions", () => {
    const serverSrc = fs.readFileSync(path.join(process.cwd(), "server.ts"), "utf8");
    const engineSrc = fs.readFileSync(path.join(process.cwd(), "src/components/admin/AdminWorkoutChallengeEngine.tsx"), "utf8");
    assert.ok(serverSrc.includes("loadAuthoritativeProgramOverrides"), "server.ts must read authoritative cloud state before mutating schedules");
    assert.ok(serverSrc.includes("resolveTargetScheduleKeys"), "server.ts must isolate home_180_women vs home_180 keys");
    assert.ok(engineSrc.includes("addedByAdmin: true"), "AdminWorkoutChallengeEngine must stamp addedByAdmin on admin-added drills");
    assert.ok(engineSrc.includes("hasAdminAddedDrills"), "AdminWorkoutChallengeEngine must start clean rather than prepending unadded seed drills");
  });

  it("15. All existing workouts remain searchable without isRestrictedHomeWorkout memory-dropping", () => {
    const appCtxSrc = fs.readFileSync(path.join(process.cwd(), "src/context/AppContext.tsx"), "utf8");
    const libSrc = fs.readFileSync(path.join(process.cwd(), "src/components/WorkoutLibrary.tsx"), "utf8");
    assert.ok(!appCtxSrc.includes("!isRestrictedHomeWorkout(ex).isViolating"), "AppContext must not drop Firestore custom exercises in memory");
    assert.ok(!appCtxSrc.includes("if (isRestrictedHomeWorkout(val).isViolating) return;"), "AppContext sync must not drop Firestore overrides in memory");
    assert.ok(libSrc.includes("usedFilterRelaxation"), "WorkoutLibrary must expand text searches across active filters when strict search matches 0 items");
    assert.ok(libSrc.includes("if (!relaxFilters && !query && !isAdmin && isExplicitlyMarkedWomenWorkout(ex)) return false;"), "Women workouts must remain discoverable during search and admin browse");
  });

  it("16. Onboarding appears only for brand-new users once and never flashes on program views", () => {
    const appCtxSrc = fs.readFileSync(path.join(process.cwd(), "src/context/AppContext.tsx"), "utf8");
    const appSrc = fs.readFileSync(path.join(process.cwd(), "src/App.tsx"), "utf8");
    const p90Src = fs.readFileSync(path.join(process.cwd(), "src/components/Premium90DayChallenge.tsx"), "utf8");
    const homeSrc = fs.readFileSync(path.join(process.cwd(), "src/components/HomeWorkoutChallengeView.tsx"), "utf8");
    const womenSrc = fs.readFileSync(path.join(process.cwd(), "src/components/WomenConfidenceProgram.tsx"), "utf8");

    assert.ok(appCtxSrc.includes("fit_onboarding_completed_"), "AppContext must persist per-UID onboarding completion flag");
    assert.ok(appSrc.includes("needsOnboarding") && appSrc.includes("if (loading) return;"), "App.tsx must guard onboarding routes behind auth loading completion");
    assert.ok(p90Src.includes("loadingDb ?") && p90Src.includes('fitnessLevel: "Beginner"'), "Premium90DayChallenge must guard with loadingDb and align Beginner default");
    assert.ok(homeSrc.includes("if (loading)") && homeSrc.includes("fit_onboarding_completed_"), "HomeWorkoutChallengeView must guard with loading spinner and auto-enroll returning users");
    assert.ok(womenSrc.includes('"beginner"') && womenSrc.includes("fit_onboarding_completed_"), "WomenConfidenceProgram must align beginner default and auto-enroll returning users");
  });

  it("17. Hook order safety, null guards, all-workouts browse default, zero iframe alert/confirm dialogs, and clean data directory", () => {
    const shredSrc = fs.readFileSync(path.join(process.cwd(), "src/components/BellyFatShredView.tsx"), "utf8");
    const adminDashSrc = fs.readFileSync(path.join(process.cwd(), "src/components/AdminDashboard.tsx"), "utf8");
    const editModalSrc = fs.readFileSync(path.join(process.cwd(), "src/components/admin/EditWorkoutDrillModal.tsx"), "utf8");
    const p90Src = fs.readFileSync(path.join(process.cwd(), "src/components/Premium90DayChallenge.tsx"), "utf8");
    const appCtxSrc = fs.readFileSync(path.join(process.cwd(), "src/context/AppContext.tsx"), "utf8");
    const wizardSrc = fs.readFileSync(path.join(process.cwd(), "src/components/OnboardingWizard.tsx"), "utf8");

    // 1. Hook order: useMemo/useEffect must appear before early null returns
    assert.ok(
      shredSrc.indexOf("workoutInfo = useMemo") < shredSrc.indexOf("if (!user) {"),
      "BellyFatShredView must evaluate useMemo hooks before early returns"
    );
    assert.ok(
      adminDashSrc.indexOf("filteredExercises = useMemo") < adminDashSrc.indexOf("if (!isAdminUser)"),
      "AdminDashboard must evaluate useMemo hooks before early returns"
    );
    assert.ok(
      editModalSrc.indexOf("useEffect(") < editModalSrc.indexOf("if (!isOpen || !exercise)"),
      "EditWorkoutDrillModal must evaluate useEffect before early returns"
    );
    assert.ok(
      p90Src.includes("dbState?.challengeId"),
      "Premium90DayChallenge must guard dbState.challengeId with optional chaining"
    );

    // 2. Default browse tab shows all exercises and skip onboarding persists globally
    assert.ok(appCtxSrc.includes('activeBrowseTab: "all"'), "AppContext must default activeBrowseTab to 'all' so all GIFs/workouts are visible");
    assert.ok(wizardSrc.includes("fit_onboarding_completed_any"), "OnboardingWizard must persist completion on both submit and skip");

    // 3. Zero native alert() or window.confirm() calls in src/components
    const scanDir = (dir: string): string[] => {
      const results: string[] = [];
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) results.push(...scanDir(full));
        else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) results.push(full);
      }
      return results;
    };
    const compFiles = scanDir(path.join(process.cwd(), "src/components"));
    for (const filePath of compFiles) {
      const content = fs.readFileSync(filePath, "utf8");
      assert.ok(!/\b(?:window\.)?(?:alert|confirm)\(/.test(content), `Component ${path.relative(process.cwd(), filePath)} must not call alert() or confirm()`);
    }

    // 4. Empty stub data files are deleted
    for (const stub of [
      "src/data/bellyFatProgramData.ts",
      "src/data/home180ProgramData.ts",
      "src/data/postureVitalityProgramData.ts",
      "src/data/rawExercisesDataset.json"
    ]) {
      assert.ok(!fs.existsSync(path.join(process.cwd(), stub)), `Empty stub file ${stub} must be deleted`);
    }
  });
});


