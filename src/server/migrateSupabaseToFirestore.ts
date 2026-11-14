import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { collection, doc, getDoc, getDocs, setDoc, writeBatch } from "firebase/firestore";

export interface MigrationReport {
  success: boolean;
  dryRun: boolean;
  supabaseConfigured: boolean;
  backupPath: string | null;
  startedAt: string;
  completedAt: string;
  firestoreBeforeCounts: Record<string, number>;
  firestoreAfterCounts: Record<string, number>;
  supabaseSourceCounts: Record<string, number>;
  migratedCounts: Record<string, number>;
  skippedNewerInFirestore: Record<string, number>;
  duplicatesResolved: Record<string, number>;
  errors: string[];
}

function toTimestampMs(val: any): number {
  if (!val) return 0;
  if (typeof val === "number") return val;
  if (typeof val?.toMillis === "function") return val.toMillis();
  const parsed = Date.parse(String(val));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function stripUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(stripUndefined) as unknown as T;
  if (typeof obj === "object") {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) out[k] = stripUndefined(v);
    }
    return out as T;
  }
  return obj;
}

function isNewerThanExisting(incomingUpdatedAt: any, existingData: any): boolean {
  if (!existingData) return true;
  const existingMs = toTimestampMs(existingData.updatedAt || existingData.updated_at || existingData.createdAt || existingData.created_at);
  const incomingMs = toTimestampMs(incomingUpdatedAt);
  if (existingMs === 0) return true;
  if (incomingMs === 0) return false;
  return incomingMs > existingMs;
}

/**
 * Safely backs up both Firestore and any legacy Supabase records,
 * resolves duplicates/conflicts without overwriting newer Firestore records,
 * preserves UIDs and payment/subscription fields, and migrates missing/newer records into Firestore.
 */
export async function runOneWaySupabaseToFirestoreMigration(options: {
  firestoreDb: any;
  supabaseUrl?: string;
  supabaseKey?: string;
  dryRun?: boolean;
}): Promise<MigrationReport> {
  const startedAt = new Date().toISOString();
  const dryRun = options.dryRun === true;
  const errors: string[] = [];

  const sbUrl = (
    options.supabaseUrl ||
    process.env.LEGACY_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    ""
  ).trim();
  const sbKey = (
    options.supabaseKey ||
    process.env.LEGACY_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    ""
  ).trim();

  const supabaseConfigured = Boolean(sbUrl && sbKey && sbUrl.startsWith("https://"));
  let supabaseClient: SupabaseClient | null = null;
  if (supabaseConfigured) {
    try {
      supabaseClient = createSupabaseClient(sbUrl, sbKey);
    } catch (e: any) {
      errors.push(`Failed initializing legacy Supabase reader: ${e?.message || e}`);
    }
  }

  const firestoreCollectionsToAudit = [
    "users",
    "exercises",
    "exercise_media",
    "deleted_exercises",
    "program_schedules",
    "challenges",
    "progress_logs",
    "user_workout_actions",
    "vitals_logs",
    "saved_workouts",
    "printable_pdf_products",
    "orders",
    "transactions",
    "todos"
  ];

  const firestoreBeforeCounts: Record<string, number> = {};
  const firestoreSnapshotDump: Record<string, Record<string, any>> = {};

  if (options.firestoreDb) {
    for (const colName of firestoreCollectionsToAudit) {
      try {
        const snap = await getDocs(collection(options.firestoreDb, colName));
        firestoreBeforeCounts[colName] = snap.size;
        firestoreSnapshotDump[colName] = {};
        snap.docs.forEach((d) => {
          firestoreSnapshotDump[colName][d.id] = d.data();
        });
      } catch (e: any) {
        firestoreBeforeCounts[colName] = -1;
        errors.push(`Firestore read notice for "${colName}": ${e?.message || e}`);
      }
    }
  }

  const supabaseTables = [
    "profiles",
    "exercise_media",
    "program_schedules",
    "progress_logs",
    "activity_logs",
    "vitals_logs",
    "saved_workouts",
    "printable_pdf_products",
    "todos"
  ];
  const supabaseSourceCounts: Record<string, number> = {};
  const supabaseDump: Record<string, any[]> = {};

  if (supabaseClient) {
    for (const table of supabaseTables) {
      try {
        const { data, error } = await supabaseClient.from(table).select("*");
        if (error) {
          supabaseSourceCounts[table] = -1;
          errors.push(`Supabase inspect notice for "${table}": ${error.message}`);
        } else {
          const rows = Array.isArray(data) ? data : [];
          supabaseSourceCounts[table] = rows.length;
          supabaseDump[table] = rows;
        }
      } catch (e: any) {
        supabaseSourceCounts[table] = -1;
        errors.push(`Supabase inspect exception for "${table}": ${e?.message || e}`);
      }
    }
  }

  // Always write backup snapshot before mutating anything
  let backupPath: string | null = null;
  try {
    const backupsDir = path.join(process.cwd(), "data", "backups");
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }
    const safeStamp = startedAt.replace(/[:.]/g, "-");
    backupPath = path.join(backupsDir, `pre-migration-${safeStamp}.json`);
    fs.writeFileSync(
      backupPath,
      JSON.stringify(
        {
          createdAt: startedAt,
          dryRun,
          firestoreBeforeCounts,
          supabaseSourceCounts,
          firestoreSnapshot: firestoreSnapshotDump,
          supabaseSnapshot: supabaseDump
        },
        null,
        2
      ),
      "utf-8"
    );
  } catch (backupErr: any) {
    errors.push(`Backup creation error: ${backupErr?.message || backupErr}`);
  }

  const migratedCounts: Record<string, number> = {
    users: 0,
    exercise_media: 0,
    program_schedules: 0,
    progress_logs: 0,
    vitals_logs: 0,
    saved_workouts: 0,
    printable_pdf_products: 0,
    todos: 0
  };
  const skippedNewerInFirestore: Record<string, number> = {
    users: 0,
    exercise_media: 0,
    program_schedules: 0,
    progress_logs: 0,
    vitals_logs: 0,
    saved_workouts: 0,
    printable_pdf_products: 0,
    todos: 0
  };
  const duplicatesResolved: Record<string, number> = {};

  if (!dryRun && supabaseClient && options.firestoreDb) {
    // 1. Profiles -> users (preserving UIDs, subscription & payment fields)
    const profiles = supabaseDump.profiles || [];
    const seenUids = new Set<string>();
    for (const p of profiles) {
      const uid = String(p.uid || p.id || "").trim();
      if (!uid) continue;
      if (seenUids.has(uid)) {
        duplicatesResolved.users = (duplicatesResolved.users || 0) + 1;
        continue;
      }
      seenUids.add(uid);

      const ref = doc(options.firestoreDb, "users", uid);
      const existingSnap = await getDoc(ref).catch(() => null);
      const existingData = existingSnap?.exists() ? existingSnap.data() : null;

      if (!isNewerThanExisting(p.updated_at || p.created_at, existingData)) {
        skippedNewerInFirestore.users++;
        continue;
      }

      const payload = stripUndefined({
        ...(existingData || {}),
        uid,
        email: p.email || existingData?.email || "",
        displayName: p.display_name || existingData?.displayName || "Athlete",
        photoURL: p.photo_url || existingData?.photoURL || null,
        role: existingData?.role === "admin" ? "admin" : (p.role || existingData?.role || "user"),
        subscriptionStatus: existingData?.subscriptionStatus || p.subscription_status || "free",
        subscriptionTier: existingData?.subscriptionTier || p.subscription_tier || "none",
        subscriptionPlan: existingData?.subscriptionPlan || p.subscription_plan || "none",
        subscriptionActivationDate: existingData?.subscriptionActivationDate || p.subscription_activation_date || null,
        subscriptionExpiry: existingData?.subscriptionExpiry || p.subscription_expiry || null,
        paymentReference: existingData?.paymentReference || p.payment_reference || null,
        fitnessGoals: p.fitness_goals ?? existingData?.fitnessGoals,
        weight: p.weight ?? existingData?.weight,
        height: p.height ?? existingData?.height,
        targetWeight: p.target_weight ?? existingData?.targetWeight,
        gender: p.gender ?? existingData?.gender,
        updatedAt: p.updated_at || new Date().toISOString(),
        migratedFromSupabaseAt: new Date().toISOString()
      });

      await setDoc(ref, payload, { merge: true });
      migratedCounts.users++;
    }

    // 2. Exercise Media -> exercise_media (only if not deleted in deleted_exercises & not newer in Firestore)
    const deletedDocs = firestoreSnapshotDump.deleted_exercises || {};
    const deletedSet = new Set<string>(Object.keys(deletedDocs));
    for (const row of supabaseDump.exercise_media || []) {
      const exId = String(row.exercise_id || row.id || "").trim();
      if (!exId || deletedSet.has(exId) || !row.media_url) continue;

      const ref = doc(options.firestoreDb, "exercise_media", exId);
      const existingSnap = await getDoc(ref).catch(() => null);
      const existingData = existingSnap?.exists() ? existingSnap.data() : null;
      if (!isNewerThanExisting(row.updated_at, existingData)) {
        skippedNewerInFirestore.exercise_media++;
        continue;
      }

      await setDoc(
        ref,
        stripUndefined({
          exerciseId: exId,
          customMediaUrl: row.media_url,
          gifUrl: row.media_url,
          imageUrl: row.media_url,
          customMediaType: row.media_type || "image",
          updatedAt: row.updated_at || new Date().toISOString(),
          migratedFromSupabaseAt: new Date().toISOString()
        }),
        { merge: true }
      );
      migratedCounts.exercise_media++;
    }

    // 3. Program Schedules -> program_schedules
    for (const row of supabaseDump.program_schedules || []) {
      const progId = String(row.id || "").trim();
      if (!progId || progId === "overrides" || !row.data || typeof row.data !== "object") continue;

      const ref = doc(options.firestoreDb, "program_schedules", progId);
      const existingSnap = await getDoc(ref).catch(() => null);
      const existingData = existingSnap?.exists() ? existingSnap.data() : null;
      if (!isNewerThanExisting(row.updated_at, existingData)) {
        skippedNewerInFirestore.program_schedules++;
        continue;
      }

      await setDoc(
        ref,
        stripUndefined({
          programId: progId,
          schedule: row.data,
          updatedAt: row.updated_at || new Date().toISOString(),
          updatedBy: "supabase_oneway_migration"
        }),
        { merge: false }
      );
      migratedCounts.program_schedules++;
    }

    // 4. Progress Logs -> progress_logs (batched)
    {
      let batch = writeBatch(options.firestoreDb);
      let ops = 0;
      for (const row of supabaseDump.progress_logs || []) {
        const id = String(row.id || "").trim();
        const userId = String(row.user_id || "").trim();
        if (!id || !userId) continue;
        const existingData = firestoreSnapshotDump.progress_logs?.[id];
        if (!isNewerThanExisting(row.created_at, existingData)) {
          skippedNewerInFirestore.progress_logs++;
          continue;
        }
        batch.set(
          doc(options.firestoreDb, "progress_logs", id),
          stripUndefined({
            id,
            userId,
            weight: row.weight,
            bodyFat: row.body_fat ?? null,
            date: row.date || row.created_at || new Date().toISOString(),
            notes: row.notes || ""
          }),
          { merge: true }
        );
        migratedCounts.progress_logs++;
        ops++;
        if (ops >= 400) {
          await batch.commit();
          batch = writeBatch(options.firestoreDb);
          ops = 0;
        }
      }
      if (ops > 0) await batch.commit();
    }

    // 5. Vitals Logs -> vitals_logs
    for (const row of supabaseDump.vitals_logs || []) {
      const id = String(row.id || "").trim();
      const userId = String(row.user_id || "").trim();
      if (!id || !userId) continue;
      const existingData = firestoreSnapshotDump.vitals_logs?.[id];
      if (!isNewerThanExisting(row.created_at, existingData)) {
        skippedNewerInFirestore.vitals_logs++;
        continue;
      }
      await setDoc(
        doc(options.firestoreDb, "vitals_logs", id),
        stripUndefined({
          id,
          userId,
          date: row.date,
          restingHeartRate: row.resting_heart_rate ?? null,
          sleepDuration: row.sleep_duration ?? 0,
          hydrationGlasses: row.hydration_glasses ?? 0,
          readinessScore: row.readiness_score ?? 0,
          energyLevel: row.energy_level ?? null,
          notes: row.notes ?? null,
          createdAt: row.created_at || new Date().toISOString()
        }),
        { merge: true }
      );
      migratedCounts.vitals_logs++;
    }

    // 6. Saved Workouts -> saved_workouts
    for (const row of supabaseDump.saved_workouts || []) {
      const userId = String(row.user_id || "").trim();
      if (!userId || !Array.isArray(row.workout_ids)) continue;
      const existingData = firestoreSnapshotDump.saved_workouts?.[userId];
      if (!isNewerThanExisting(row.updated_at, existingData)) {
        skippedNewerInFirestore.saved_workouts++;
        continue;
      }
      const mergedWorkoutIds = Array.from(
        new Set([...(existingData?.workoutIds || []), ...row.workout_ids].map(String))
      );
      await setDoc(
        doc(options.firestoreDb, "saved_workouts", userId),
        {
          userId,
          workoutIds: mergedWorkoutIds,
          updatedAt: row.updated_at || new Date().toISOString()
        },
        { merge: true }
      );
      migratedCounts.saved_workouts++;
    }

    // 7. Todos -> todos
    for (const row of supabaseDump.todos || []) {
      const id = String(row.id || "").trim();
      if (!id) continue;
      const existingData = firestoreSnapshotDump.todos?.[id];
      if (!isNewerThanExisting(row.created_at, existingData)) {
        skippedNewerInFirestore.todos++;
        continue;
      }
      await setDoc(
        doc(options.firestoreDb, "todos", id),
        stripUndefined({
          id,
          title: row.title || "",
          completed: Boolean(row.completed),
          userId: row.user_id || "",
          created_at: row.created_at || new Date().toISOString()
        }),
        { merge: true }
      );
      migratedCounts.todos++;
    }
  }

  // Post-migration verification counts
  const firestoreAfterCounts: Record<string, number> = {};
  if (options.firestoreDb) {
    for (const colName of firestoreCollectionsToAudit) {
      try {
        const snap = await getDocs(collection(options.firestoreDb, colName));
        firestoreAfterCounts[colName] = snap.size;
      } catch {
        firestoreAfterCounts[colName] = firestoreBeforeCounts[colName] ?? -1;
      }
    }
  }

  return {
    success: errors.length === 0,
    dryRun,
    supabaseConfigured,
    backupPath,
    startedAt,
    completedAt: new Date().toISOString(),
    firestoreBeforeCounts,
    firestoreAfterCounts,
    supabaseSourceCounts,
    migratedCounts,
    skippedNewerInFirestore,
    duplicatesResolved,
    errors
  };
}
