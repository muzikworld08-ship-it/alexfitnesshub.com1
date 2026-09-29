import { db, isMockFirebase } from "../lib/firebase";
import { collection, getDocs, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { Exercise } from "../data/exercises";
import { isHomeEligibleExercise } from "./dynamicWorkoutEngine";

export interface PurgedWorkoutInfo {
  id: string;
  name: string;
  category: string;
  equipment: string[];
  reason: string;
}

export interface PurgeRestrictedHomeResult {
  success: boolean;
  scannedCount: number;
  deletedCount: number;
  deletedWorkouts: PurgedWorkoutInfo[];
  message: string;
}

/**
 * Checks whether an exercise is categorized as 'home' while containing restricted equipment tags
 * such as 'barbell', 'dumbbell', or other heavy gym machinery.
 */
export function isRestrictedHomeWorkout(ex: Partial<Exercise> | any): { isViolating: boolean; reason: string } {
  if (!ex) return { isViolating: false, reason: "" };

  const name = String(ex.name || ex.exerciseName || "").toLowerCase().trim();
  const cat = String(ex.category || "").toLowerCase().trim();
  const cats = Array.isArray(ex.categories) ? ex.categories.map((c: any) => String(c).toLowerCase().trim()) : [];
  const location = String(ex.locationSuitability || "").toLowerCase().trim();
  const tags = Array.isArray(ex.tags) ? ex.tags.map((t: any) => String(t).toLowerCase().trim()) : [];
  const programs = Array.isArray(ex.programAssignments) ? ex.programAssignments.map((p: any) => String(p).toLowerCase().trim()) : [];
  const goals = Array.isArray(ex.goals) ? ex.goals.map((g: any) => String(g).toLowerCase().trim()) : [];
  const progId = String(ex.programId || "").toLowerCase().trim();

  // 1. Is this workout/exercise categorized under 'home'?
  const isCategorizedAsHome = 
    cat.includes("home") ||
    cats.some(c => c.includes("home")) ||
    location === "home" ||
    tags.some(t => t.includes("home")) ||
    programs.some(p => p.includes("home")) ||
    goals.some(g => g.includes("home")) ||
    progId.includes("home");

  if (!isCategorizedAsHome) {
    return { isViolating: false, reason: "" };
  }

  // 2. Does it contain restricted equipment tags?
  const rawEquip = Array.isArray(ex.equipment) ? ex.equipment : [String(ex.equipment || "")];
  const equipment = rawEquip.map((e: any) => String(e).toLowerCase().trim());
  const desc = String(ex.description || "").toLowerCase().trim();

  const restrictedKeywords = [
    "barbell",
    "dumbbell",
    "dumbbells",
    "dumbell",
    "db ",
    " db",
    "bb ",
    " bb",
    "(db)",
    "(bb)",
    "kettlebell",
    "cable",
    "cables",
    "pulley",
    "machine",
    "smith machine",
    "leg press",
    "hack squat",
    "pec deck",
    "lat pulldown",
    "pulldown",
    "leg extension",
    "leg curl machine",
    "ez bar",
    "ez-bar",
    "t-bar",
    "landmine",
    "trap bar",
    "bench press",
    "preacher bench",
    "preacher curl",
    "plate",
    "weight plate",
    "plates",
    "squat rack",
    "incline bench press",
    "decline bench press"
  ];

  for (const kw of restrictedKeywords) {
    if (name.includes(kw)) {
      return { isViolating: true, reason: `Workout name "${ex.name || ex.exerciseName}" contains restricted equipment keyword "${kw}" while categorized as home.` };
    }
  }

  for (const eq of equipment) {
    for (const kw of restrictedKeywords) {
      if (eq.includes(kw)) {
        return { isViolating: true, reason: `Equipment "${eq}" contains restricted keyword "${kw}" in home workout.` };
      }
    }
  }

  if (equipment.some(e => e === "gym" || e.includes("gym equipment"))) {
    return { isViolating: true, reason: "Equipment explicitly tagged as 'Gym Equipment' for a home workout." };
  }

  if (equipment.length === 0 || equipment.includes("none")) {
    for (const kw of restrictedKeywords) {
      if (desc.includes(kw)) {
        return { isViolating: true, reason: `Workout description requires "${kw}" for a home workout.` };
      }
    }
  }

  if (!isHomeEligibleExercise(ex as Exercise)) {
    return { isViolating: true, reason: "Fails strict home zero-equipment validation rules." };
  }

  return { isViolating: false, reason: "" };
}

/**
 * Admin-only utility function:
 * Scans all Firestore exercises, backend files, and active library state.
 * Identifies and permanently deletes any workouts categorized as 'home' that contain
 * restricted equipment tags like 'barbell' or 'dumbbell'.
 */
export async function purgeRestrictedHomeWorkouts(
  onProgress?: (status: string) => void,
  customAdminHeaders?: Record<string, string>
): Promise<PurgeRestrictedHomeResult> {
  const deletedWorkouts: PurgedWorkoutInfo[] = [];
  let scannedCount = 0;

  const withTimeout = <T>(p: Promise<T>, ms = 3500): Promise<T> =>
    Promise.race([
      p,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Firestore timeout")), ms))
    ]);

  try {
    onProgress?.("Auditing Cloud Firestore 'exercises' collection...");

    // 1. Scan Firestore 'exercises' collection
    if (!isMockFirebase && db) {
      try {
        const snap = await withTimeout(getDocs(collection(db, "exercises")));
        scannedCount += snap.size;
        const violatingDocIds: string[] = [];

        snap.docs.forEach(docSnap => {
          const data = docSnap.data();
          const check = isRestrictedHomeWorkout(data);
          if (check.isViolating) {
            violatingDocIds.push(docSnap.id);
            deletedWorkouts.push({
              id: docSnap.id,
              name: data.name || data.exerciseName || docSnap.id,
              category: data.category || "Home Workouts",
              equipment: Array.isArray(data.equipment) ? data.equipment : [String(data.equipment || "")],
              reason: check.reason
            });
          }
        });

        if (violatingDocIds.length > 0) {
          onProgress?.(`Deleting ${violatingDocIds.length} restricted home workouts from Firestore...`);
          let batch = writeBatch(db);
          let opCount = 0;
          for (const docId of violatingDocIds) {
            batch.delete(doc(db, "exercises", docId));
            opCount++;
            if (opCount % 400 === 0) {
              await withTimeout(batch.commit());
              batch = writeBatch(db);
            }
          }
          if (opCount % 400 !== 0) {
            await withTimeout(batch.commit());
          }
        }
      } catch (fErr) {
        console.warn("[AdminWorkoutCleaner] Firestore exercises audit notice:", fErr);
      }

      // 2. Scan Firestore 'generated_exercises' collection
      try {
        const genSnap = await withTimeout(getDocs(collection(db, "generated_exercises")));
        scannedCount += genSnap.size;
        const violatingGenIds: string[] = [];

        genSnap.docs.forEach(docSnap => {
          const data = docSnap.data();
          const check = isRestrictedHomeWorkout(data);
          if (check.isViolating) {
            violatingGenIds.push(docSnap.id);
            if (!deletedWorkouts.some(d => d.id === docSnap.id)) {
              deletedWorkouts.push({
                id: docSnap.id,
                name: data.name || data.exerciseName || docSnap.id,
                category: data.category || "Home Workouts",
                equipment: Array.isArray(data.equipment) ? data.equipment : [String(data.equipment || "")],
                reason: check.reason
              });
            }
          }
        });

        if (violatingGenIds.length > 0) {
          let genBatch = writeBatch(db);
          let gCount = 0;
          for (const docId of violatingGenIds) {
            genBatch.delete(doc(db, "generated_exercises", docId));
            gCount++;
            if (gCount % 400 === 0) {
              await withTimeout(genBatch.commit());
              genBatch = writeBatch(db);
            }
          }
          if (gCount % 400 !== 0) {
            await withTimeout(genBatch.commit());
          }
        }
      } catch (gErr) {
        console.warn("[AdminWorkoutCleaner] Firestore generated_exercises audit notice:", gErr);
      }
    }

    // 3. Trigger Backend Server Purge to synchronize custom_exercise_overrides.json & custom_deleted_exercises.json
    onProgress?.("Synchronizing with backend server storage...");
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-admin-email": (typeof window !== "undefined" && (window.localStorage.getItem("fit_saved_email") || "muzikworld08@gmail.com")) || "muzikworld08@gmail.com",
        ...(customAdminHeaders || {})
      };

      const resp = await fetch("/api/admin/workouts/purge-restricted-home", {
        method: "POST",
        headers
      });
      if (resp.ok) {
        const serverData = await resp.json();
        if (serverData.success && Array.isArray(serverData.deletedWorkouts)) {
          serverData.deletedWorkouts.forEach((sw: any) => {
            if (!deletedWorkouts.some(d => d.id === sw.id)) {
              deletedWorkouts.push(sw);
            }
          });
        }
      }
    } catch (sErr) {
      console.warn("[AdminWorkoutCleaner] Server purge endpoint warning:", sErr);
    }

    // 4. Clean local storage cache
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const stored = window.localStorage.getItem("fit_exercises");
        if (stored) {
          const list = JSON.parse(stored);
          if (Array.isArray(list)) {
            const filtered = list.filter((ex: any) => !isRestrictedHomeWorkout(ex).isViolating);
            window.localStorage.setItem("fit_exercises", JSON.stringify(filtered));
          }
        }

        const overridesRaw = window.localStorage.getItem("fit_custom_exercise_overrides");
        if (overridesRaw) {
          const overrides = JSON.parse(overridesRaw);
          if (overrides && typeof overrides === "object") {
            let modified = false;
            Object.keys(overrides).forEach(key => {
              if (isRestrictedHomeWorkout(overrides[key]).isViolating) {
                delete overrides[key];
                modified = true;
              }
            });
            if (modified) {
              window.localStorage.setItem("fit_custom_exercise_overrides", JSON.stringify(overrides));
            }
          }
        }

        // Add deleted IDs to fit_deleted_exercises
        if (deletedWorkouts.length > 0) {
          const deletedRaw = window.localStorage.getItem("fit_deleted_exercises");
          const deletedIds = deletedRaw ? JSON.parse(deletedRaw) : [];
          deletedWorkouts.forEach(dw => {
            if (!deletedIds.includes(dw.id)) deletedIds.push(dw.id);
          });
          window.localStorage.setItem("fit_deleted_exercises", JSON.stringify(deletedIds));
        }
      } catch (lErr) {
        console.warn("[AdminWorkoutCleaner] Local storage sync error:", lErr);
      }
    }

    return {
      success: true,
      scannedCount,
      deletedCount: deletedWorkouts.length,
      deletedWorkouts,
      message: deletedWorkouts.length > 0
        ? `Successfully identified and permanently deleted ${deletedWorkouts.length} workout(s) categorized as home containing restricted barbell/dumbbell equipment.`
        : "Integrity audit passed: 0 restricted equipment workouts found in the home category."
    };
  } catch (error: any) {
    console.error("[AdminWorkoutCleaner] Purge error:", error);
    return {
      success: false,
      scannedCount,
      deletedCount: deletedWorkouts.length,
      deletedWorkouts,
      message: error?.message || "Failed to purge restricted home workouts."
    };
  }
}
