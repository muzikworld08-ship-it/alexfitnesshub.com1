import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, collection, getDocs } from "firebase/firestore";
import { storage, db, isMockFirebase, safeFirestoreSetDoc, getFirebaseIdToken } from "../lib/firebase";

export interface ExerciseMediaRecord {
  exerciseId: string;
  customMediaUrl: string | null;
  customMediaType: "image" | "video";
  updatedAt: string;
}

/**
 * Uploads media file/blob directly to Firebase Storage (primary)
 * or backend /api/media/upload (server Firebase Storage + static assets).
 */
export async function uploadMediaToCloud(
  input: File | Blob | string,
  exerciseId: string,
  mediaType: "image" | "video" = "image",
  onProgress?: (pct: number, status: string) => void
): Promise<string> {
  if (typeof input === "string") {
    if (input.startsWith("http://") || input.startsWith("https://")) {
      return input;
    }
  }

  const cleanId = exerciseId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const timestamp = Date.now();

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
      console.warn("[MediaStorage] Failed to convert data URL to Blob:", e);
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
      console.warn("[MediaStorage] Firebase Storage direct upload failed, attempting authenticated server upload:", fbErr);
    }
  }

  // 2. Secondary Attempt: Backend Server Firebase Storage Upload (/api/media/upload)
  try {
    if (onProgress) onProgress(60, "Uploading to Firebase Storage via server...");
    const reader = new FileReader();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(fileBlob as Blob);
    });

    const token = await getFirebaseIdToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch("/api/media/upload", {
      method: "POST",
      headers,
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

  // 3. Offline preview Data URL fallback (caller must still check persistence)
  if (onProgress) onProgress(80, "Converting file to data URL stream...");
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(fileBlob as Blob);
  });
}

/**
 * Persists exercise media URL authoritatively to Cloud Firestore and verified Express endpoint.
 * Never returns success unless confirmed by Firestore or the backend Firestore-confirmed API.
 */
export async function saveExerciseMediaToDatabase(
  exerciseId: string,
  mediaUrl: string | null,
  mediaType: "image" | "video" = "image"
): Promise<{ success: boolean; finalUrl: string | null; error?: string }> {
  const timestamp = new Date().toISOString();
  let firestoreDirectOk = false;
  let serverOk = false;
  let serverFinalUrl: string | null = mediaUrl;
  let lastError = "";

  // A. Save directly to Cloud Firestore 'exercise_media' and 'exercises' collections
  if (!isMockFirebase && db) {
    try {
      const mediaDocRef = doc(db, "exercise_media", exerciseId);
      const exDocRef = doc(db, "exercises", exerciseId);
      const [mOk, eOk] = await Promise.all([
        safeFirestoreSetDoc(
          mediaDocRef,
          {
            exerciseId,
            customMediaUrl: mediaUrl || "none",
            gifUrl: mediaUrl || "none",
            imageUrl: mediaUrl || "none",
            originalUrlOrBase64: mediaUrl || null,
            isMediaDeleted: !mediaUrl || mediaUrl === "none" || mediaUrl === "deleted",
            customMediaType: mediaType,
            updatedAt: timestamp
          },
          { merge: true },
          true
        ),
        safeFirestoreSetDoc(
          exDocRef,
          {
            id: exerciseId,
            customMediaUrl: mediaUrl || "none",
            gifUrl: mediaUrl || "none",
            imageUrl: mediaUrl || "none",
            customMediaType: mediaType,
            updatedAt: timestamp
          },
          { merge: true },
          true
        )
      ]);

      firestoreDirectOk = mOk && eOk;
      if (firestoreDirectOk) {
        console.log(`[Firestore Media DB OK] Confirmed media record for exercise ${exerciseId}`);
      } else {
        lastError = "Client Firestore write did not confirm.";
      }
    } catch (fErr: any) {
      lastError = fErr?.message || String(fErr);
      console.warn("[Firestore Media DB Error]:", fErr);
    }
  }

  // B. Confirm persistence via backend Express server endpoint (Firestore REST + server cache)
  try {
    const token = await getFirebaseIdToken();
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

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success && data.firestoreOk !== false) {
      serverOk = true;
      if (data.customMediaUrl) {
        serverFinalUrl = data.customMediaUrl;
      }
    } else {
      lastError = data.error || `Server returned HTTP ${res.status}`;
    }
  } catch (serverErr: any) {
    lastError = serverErr?.message || String(serverErr);
    console.warn("[Express Server Media Save Notice]:", serverErr);
  }

  const confirmed = firestoreDirectOk || serverOk;
  if (!confirmed) {
    console.error(`[MediaStorage FAILED] Could not confirm Firestore media save for ${exerciseId}: ${lastError}`);
    return { success: false, finalUrl: null, error: lastError || "Failed to confirm Firestore media persistence." };
  }

  return { success: true, finalUrl: serverFinalUrl };
}

/**
 * Fetches all saved exercise custom media records authoritatively from Cloud Firestore.
 */
export async function fetchAllExerciseMediaFromDatabase(): Promise<Record<string, { customMediaUrl: string; customMediaType: "image" | "video" }>> {
  const result: Record<string, { customMediaUrl: string; customMediaType: "image" | "video" }> = {};

  const setEntry = (key: string, url: string, type: "image" | "video") => {
    if (!key || !url) return;
    result[key] = { customMediaUrl: url, customMediaType: type };

    const cleanKey = key.replace(/^exercise[-_]/, "").replace(/^exercise/, "");
    result[cleanKey] = { customMediaUrl: url, customMediaType: type };
    result[`exercise-${cleanKey}`] = { customMediaUrl: url, customMediaType: type };
  };

  if (!isMockFirebase && db) {
    const deletedSet = new Set<string>();
    try {
      const delSnap = await getDocs(collection(db, "deleted_exercises"));
      delSnap.forEach((d) => {
        deletedSet.add(d.id);
        const data = d.data();
        if (data?.id) deletedSet.add(String(data.id));
        if (data?.name) deletedSet.add(String(data.name).toLowerCase().trim());
      });
    } catch {}

    try {
      const mediaSnap = await getDocs(collection(db, "exercise_media"));
      mediaSnap.forEach((docSnap) => {
        const d = docSnap.data();
        if (deletedSet.has(docSnap.id) || (d?.exerciseId && deletedSet.has(d.exerciseId))) return;
        if (d?.isMediaDeleted) {
          setEntry(docSnap.id, "none", "image");
          return;
        }
        const url = d.customMediaUrl || d.gifUrl || d.imageUrl || d.originalUrlOrBase64 || d.url;
        if (url) {
          setEntry(docSnap.id, url, d.customMediaType === "video" ? "video" : "image");
          if (d.exerciseName) {
            setEntry(d.exerciseName.toLowerCase().trim(), url, d.customMediaType === "video" ? "video" : "image");
          }
        }
      });
    } catch (e) {
      console.warn("[MediaStorage] Firestore exercise_media fetch notice:", e);
    }

    try {
      const exSnap = await getDocs(collection(db, "exercises"));
      exSnap.forEach((docSnap) => {
        const d = docSnap.data();
        if (d?.isDeleted || deletedSet.has(docSnap.id)) return;
        const url = d.customMediaUrl || d.gifUrl || d.imageUrl;
        if (url) {
          setEntry(docSnap.id, url, d.customMediaType === "video" ? "video" : "image");
          if (d.name) {
            setEntry(d.name.toLowerCase().trim(), url, d.customMediaType === "video" ? "video" : "image");
          }
        }
      });
    } catch (e) {
      console.warn("[MediaStorage] Firestore exercises fetch notice:", e);
    }

    try {
      const manifestSnap = await getDocs(collection(db, "assets_manifest"));
      manifestSnap.forEach((docSnap) => {
        const d = docSnap.data();
        const id = d.assetId || docSnap.id;
        if (deletedSet.has(id)) return;
        const url = d.mediaUrl || d.url;
        if (url) {
          setEntry(id, url, d.mediaType === "video" ? "video" : "image");
        }
      });
    } catch (e) {
      console.warn("[MediaStorage] Firestore assets_manifest fetch notice:", e);
    }
  }

  return result;
}
