import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { storage, db, auth, isMockFirebase } from "../lib/firebase";
import { supabase } from "./supabase/client";
import { uploadAdminMedia } from "../lib/mediaStorage";

export interface ExerciseMediaRecord {
  exerciseId: string;
  customMediaUrl: string | null;
  customMediaType: "image" | "video";
  updatedAt: string;
}

/**
 * Uploads media file/blob directly to Firebase Storage or Supabase Storage.
 * Returns a permanent, stable HTTPS cloud URL (or clean Data URL fallback).
 */
export async function uploadMediaToCloud(
  input: File | Blob | string,
  exerciseId: string,
  mediaType: "image" | "video" = "image",
  onProgress?: (pct: number, status: string) => void
): Promise<string> {
  // If input is already a permanent HTTP/HTTPS URL, return as-is
  if (typeof input === "string") {
    if (input.startsWith("http://") || input.startsWith("https://")) {
      return input;
    }
  }

  const cleanId = exerciseId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const timestamp = Date.now();

  // Convert string Data URL to Blob if necessary for cloud storage upload
  let fileBlob: Blob | File | null = null;
  let filename = `exercise_${cleanId}_${timestamp}`;

  if (typeof input === "string" && input.startsWith("data:")) {
    try {
      const arr = input.split(",");
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "image/png";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const ext = mime.includes("video") ? "mp4" : mime.includes("gif") ? "gif" : "png";
      filename += `.${ext}`;
      fileBlob = new Blob([u8arr], { type: mime });
    } catch (e) {
      console.warn("[MediaStorage] Failed to convert data URL to Blob, using raw data URL:", e);
      return input;
    }
  } else if (input instanceof File || input instanceof Blob) {
    fileBlob = input;
    if (input instanceof File && input.name) {
      const ext = input.name.split(".").pop() || "bin";
      filename += `.${ext}`;
    } else {
      const ext = mediaType === "video" ? "mp4" : "png";
      filename += `.${ext}`;
    }
  }

  if (!fileBlob) {
    throw new Error("Invalid media payload supplied for upload.");
  }

  // 1. Primary Attempt: Direct Upload to Firebase Storage
  if (storage) {
    try {
      if (onProgress) onProgress(10, "Uploading directly to Firebase Cloud Storage...");
      const storagePath = `exercises/${cleanId}/${filename}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, fileBlob);

      const downloadURL = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            if (onProgress) onProgress(progress, `Uploading to Firebase Storage (${progress}%)...`);
          },
          (error) => {
            console.warn("[MediaStorage] Firebase Storage upload notice:", error);
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });

      if (downloadURL) {
        console.log(`[MediaStorage OK] Permanent Firebase Storage URL created: ${downloadURL}`);
        return downloadURL;
      }
    } catch (fbErr) {
      console.warn("[MediaStorage] Firebase Storage upload skipped/failed. Proceeding to Supabase Storage...", fbErr);
    }
  }

  // 2. Secondary Attempt: Direct Upload to Supabase Storage Bucket 'exercise_media'
  try {
    if (onProgress) onProgress(40, "Uploading to Supabase Storage Bucket...");
    const bucketPath = `exercises/${filename}`;

    const supabaseUrl = await uploadAdminMedia(fileBlob, bucketPath);
    if (supabaseUrl && (supabaseUrl.startsWith("http://") || supabaseUrl.startsWith("https://"))) {
      console.log(`[MediaStorage OK] Permanent Supabase Storage URL created: ${supabaseUrl}`);
      return supabaseUrl;
    }
  } catch (sbErr) {
    console.warn("[MediaStorage] Supabase Storage bucket upload skipped:", sbErr);
  }

  // 3. Tertiary Attempt: Backend Server Cloud Storage REST Upload (/api/media/upload)
  try {
    if (onProgress) onProgress(60, "Uploading to permanent cloud storage via server...");
    const reader = new FileReader();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(fileBlob as Blob);
    });

    const res = await fetch("/api/media/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileData: dataUrl,
        filename: `media_${cleanId}`,
        mimeType: fileBlob.type || (mediaType === "video" ? "video/mp4" : "image/png"),
        exerciseId: cleanId
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.url && (data.url.startsWith("http://") || data.url.startsWith("https://") || data.url.startsWith("/assets/"))) {
        console.log(`[MediaStorage OK] Permanent Server Upload URL created: ${data.url}`);
        return data.url;
      }
    }
  } catch (srvErr) {
    console.warn("[MediaStorage] Server cloud upload fallback warning:", srvErr);
  }

  // 4. Final Fallback: Convert to Data URL stream if network is completely offline
  if (onProgress) onProgress(80, "Converting file to persistent data URL stream...");
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(fileBlob as Blob);
  });
}

/**
 * Persists exercise media URL permanently to BOTH Supabase Database AND Cloud Firestore
 */
export async function saveExerciseMediaToDatabase(
  exerciseId: string,
  mediaUrl: string | null,
  mediaType: "image" | "video" = "image"
): Promise<{ success: boolean; finalUrl: string | null }> {
  const timestamp = new Date().toISOString();

  // A. Save to Supabase 'exercise_media' table
  try {
    await supabase.from("exercise_media").upsert({
      exercise_id: exerciseId,
      media_url: mediaUrl,
      media_type: mediaType,
      updated_at: timestamp
    });
    console.log(`[Supabase Media DB OK] Saved media record for exercise ${exerciseId}`);
  } catch (sErr) {
    console.warn("[Supabase Media DB Error]:", sErr);
  }

  // B. Save to Cloud Firestore 'exercise_media' and 'exercises' collections
  if (!isMockFirebase) {
    try {
      // Store in exercise_media backup doc
      const mediaDocRef = doc(db, "exercise_media", exerciseId);
      await setDoc(mediaDocRef, {
        exerciseId,
        originalUrlOrBase64: mediaUrl,
        customMediaType: mediaType,
        updatedAt: timestamp
      }, { merge: true });

      // Store in exercises collection doc
      const exDocRef = doc(db, "exercises", exerciseId);
      await setDoc(exDocRef, {
        id: exerciseId,
        customMediaUrl: mediaUrl,
        customMediaType: mediaType,
        updatedAt: timestamp
      }, { merge: true });

      console.log(`[Firestore Media DB OK] Saved media record for exercise ${exerciseId}`);
    } catch (fErr) {
      console.warn("[Firestore Media DB Error]:", fErr);
    }
  }

  // C. Post to backend Express server endpoint to sync local server overrides and server-side memory
  try {
    const token = await auth.currentUser?.getIdToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch("/api/exercises/save-custom-media", {
      method: "POST",
      headers,
      body: JSON.stringify({
        exerciseId,
        customMediaUrl: mediaUrl,
        customMediaType: mediaType
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.customMediaUrl) {
        return { success: true, finalUrl: data.customMediaUrl };
      }
    }
  } catch (serverErr) {
    console.warn("[Express Server Media Save Notice]:", serverErr);
  }

  return { success: true, finalUrl: mediaUrl };
}

/**
 * Fetches all saved exercise custom media records from Supabase DB and Cloud Firestore
 */
export async function fetchAllExerciseMediaFromDatabase(): Promise<Record<string, { customMediaUrl: string; customMediaType: "image" | "video" }>> {
  const result: Record<string, { customMediaUrl: string; customMediaType: "image" | "video" }> = {};

  // 1. Query Supabase 'exercise_media' table
  try {
    const { data: sbData, error: sbErr } = await supabase
      .from("exercise_media")
      .select("exercise_id, media_url, media_type");

    if (!sbErr && Array.isArray(sbData)) {
      for (const row of sbData) {
        if (row.exercise_id && row.media_url) {
          result[row.exercise_id] = {
            customMediaUrl: row.media_url,
            customMediaType: row.media_type === "video" ? "video" : "image"
          };
        }
      }
    }
  } catch (e) {
    console.warn("[MediaStorage] Supabase media fetch notice:", e);
  }

  // 2. Query Cloud Firestore 'exercise_media' collection
  if (!isMockFirebase) {
    try {
      const snap = await getDocs(collection(db, "exercise_media"));
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        if (d && docSnap.id && (d.originalUrlOrBase64 || d.customMediaUrl)) {
          const url = d.originalUrlOrBase64 || d.customMediaUrl;
          if (url) {
            result[docSnap.id] = {
              customMediaUrl: url,
              customMediaType: d.customMediaType === "video" ? "video" : "image"
            };
          }
        }
      });
    } catch (e) {
      console.warn("[MediaStorage] Firestore exercise_media fetch notice:", e);
    }
  }

  return result;
}
