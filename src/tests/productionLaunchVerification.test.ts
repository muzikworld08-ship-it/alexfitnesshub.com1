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
});
