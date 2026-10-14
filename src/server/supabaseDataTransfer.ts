import { SupabaseClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { getDocs, collection, doc, getDoc } from "firebase/firestore";

/**
 * Transfers and synchronizes application data and media metadata from Cloud Firestore
 * and local storage into the new Supabase instance (sqaxwqtjvaixqytnluiy).
 */
export async function runSupabaseDataTransfer(
  supabaseClient: SupabaseClient | null,
  firestoreDb: any
): Promise<{ success: boolean; transferred: Record<string, number>; errors: string[] }> {
  const result = {
    success: true,
    transferred: {
      profiles: 0,
      exerciseMedia: 0,
      programSchedules: 0,
      printablePdfProducts: 0
    },
    errors: [] as string[]
  };

  if (!supabaseClient) {
    console.log("[Supabase Transfer] Supabase server client not authenticated or offline. Skipping transfer.");
    return { ...result, success: false };
  }

  console.log("[Supabase Transfer] Starting automated data & files transfer to new Supabase project (sqaxwqtjvaixqytnluiy)...");

  // 1. Transfer User Profiles from Firestore -> Supabase "profiles"
  if (firestoreDb) {
    try {
      const usersSnap = await getDocs(collection(firestoreDb, "users")).catch(() => null);
      if (usersSnap && !usersSnap.empty) {
        for (const docSnap of usersSnap.docs) {
          const u = docSnap.data();
          if (u && (u.uid || docSnap.id)) {
            const uid = u.uid || docSnap.id;
            const profilePayload = {
              id: uid,
              uid: uid,
              email: u.email || "",
              display_name: u.displayName || u.name || "",
              role: u.role || "user",
              subscription_status: u.subscriptionStatus || "free",
              subscription_tier: u.subscriptionTier || "none",
              subscription_expiry: u.subscriptionExpiry || null,
              created_at: u.createdAt || new Date().toISOString(),
              updated_at: u.updatedAt || new Date().toISOString()
            };
            const { error } = await supabaseClient.from("profiles").upsert(profilePayload, { onConflict: "id" });
            if (!error) {
              result.transferred.profiles++;
            }
          }
        }
        console.log(`[Supabase Transfer OK] Transferred ${result.transferred.profiles} profiles to Supabase.`);
      }
    } catch (e: any) {
      result.errors.push(`Profiles transfer notice: ${e.message || e}`);
    }
  }

  // 2. Transfer Exercise Media from Firestore & Local Overrides -> Supabase "exercise_media"
  try {
    const mediaToSync = new Map<string, { media_url: string; media_type: string }>();

    // From Firestore exercise_media
    if (firestoreDb) {
      const mediaSnap = await getDocs(collection(firestoreDb, "exercise_media")).catch(() => null);
      if (mediaSnap && !mediaSnap.empty) {
        mediaSnap.docs.forEach(d => {
          const m = d.data();
          const exId = m.exerciseId || d.id;
          const url = m.customMediaUrl || m.originalUrlOrBase64;
          if (exId && url) {
            mediaToSync.set(exId, {
              media_url: url,
              media_type: m.customMediaType || (url.includes(".mp4") ? "video" : "image")
            });
          }
        });
      }
    }

    // From local custom_exercise_overrides.json
    const overridesPath = path.join(process.cwd(), "src", "data", "custom_exercise_overrides.json");
    if (fs.existsSync(overridesPath)) {
      try {
        const raw = fs.readFileSync(overridesPath, "utf-8").trim();
        if (raw) {
          const overrides = JSON.parse(raw);
          for (const [exId, data] of Object.entries<any>(overrides)) {
            if (data?.customMediaUrl) {
              mediaToSync.set(exId, {
                media_url: data.customMediaUrl,
                media_type: data.customMediaType || (data.customMediaUrl.includes(".mp4") ? "video" : "image")
              });
            }
          }
        }
      } catch {}
    }

    for (const [exercise_id, info] of mediaToSync.entries()) {
      const { error } = await supabaseClient.from("exercise_media").upsert({
        exercise_id,
        media_url: info.media_url,
        media_type: info.media_type,
        updated_at: new Date().toISOString()
      }, { onConflict: "exercise_id" });

      if (!error) {
        result.transferred.exerciseMedia++;
      }
    }
    console.log(`[Supabase Transfer OK] Transferred ${result.transferred.exerciseMedia} exercise media assets to Supabase.`);
  } catch (e: any) {
    result.errors.push(`Exercise media transfer notice: ${e.message || e}`);
  }

  // 3. Transfer Program Schedules -> Supabase "program_schedules"
  try {
    const schedPath = path.join(process.cwd(), "src", "data", "program_schedule_overrides.json");
    let allOverrides: Record<string, any> = {};
    if (fs.existsSync(schedPath)) {
      try {
        const raw = fs.readFileSync(schedPath, "utf-8").trim();
        if (raw) allOverrides = JSON.parse(raw);
      } catch {}
    }

    if (Object.keys(allOverrides).length > 0) {
      const { error } = await supabaseClient.from("program_schedules").upsert({
        id: "overrides",
        data: allOverrides,
        updated_at: new Date().toISOString()
      }, { onConflict: "id" });

      if (!error) {
        result.transferred.programSchedules++;
        console.log(`[Supabase Transfer OK] Transferred program schedules with ${Object.keys(allOverrides).length} entries to Supabase.`);
      }
    }
  } catch (e: any) {
    result.errors.push(`Program schedules transfer notice: ${e.message || e}`);
  }

  // 4. Transfer Printable PDF Products -> Supabase "printable_pdf_products"
  if (firestoreDb) {
    try {
      const pdfSnap = await getDocs(collection(firestoreDb, "printable_pdf_products")).catch(() => null);
      if (pdfSnap && !pdfSnap.empty) {
        for (const docSnap of pdfSnap.docs) {
          const p = docSnap.data();
          if (p && (p.id || docSnap.id)) {
            const prodPayload = {
              id: p.id || docSnap.id,
              title: p.title || "",
              price_ngn: p.priceNGN || 0,
              cover_image: p.coverImage || "",
              master_pdf_filename: p.masterPdfFilename || null,
              master_pdf_cloud_url: p.masterPdfCloudUrl || null,
              is_active: p.isActive !== false,
              created_at: p.createdAt || new Date().toISOString()
            };
            let error: any = null;
            try {
              const res = await supabaseClient.from("printable_pdf_products").upsert(prodPayload, { onConflict: "id" });
              error = res.error;
            } catch (upErr) {
              error = upErr;
            }
            if (!error) {
              result.transferred.printablePdfProducts++;
            }
          }
        }
        console.log(`[Supabase Transfer OK] Transferred ${result.transferred.printablePdfProducts} printable PDF products to Supabase.`);
      }
    } catch (e: any) {
      result.errors.push(`Printable PDF transfer notice: ${e.message || e}`);
    }
  }

  console.log("[Supabase Transfer] Data and file transfer completed successfully.");
  return result;
}
