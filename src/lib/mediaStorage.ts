import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { storage, getFirebaseIdToken } from "../lib/firebase";
import { getMediaCdnUrl, MediaImageOptions } from "../utils/mediaCdn";

export const MEDIA_BUCKET_NAME = "exercise_media";

/**
 * Uploads media (images, gifs, videos) directly to Firebase Storage,
 * with server /api/media/upload fallback returning a permanent asset URL.
 */
export async function uploadAdminMedia(
  file: File | Blob,
  pathName: string
): Promise<string> {
  const cleanPath = pathName.startsWith("/") ? pathName.slice(1) : pathName;
  const contentType =
    file.type ||
    (cleanPath.endsWith(".mp4") ? "video/mp4" : cleanPath.endsWith(".gif") ? "image/gif" : "image/png");

  if (storage) {
    try {
      const storageRef = ref(storage, `${MEDIA_BUCKET_NAME}/${cleanPath}`);
      await uploadBytes(storageRef, file, { contentType });
      return await getDownloadURL(storageRef);
    } catch (fbErr: any) {
      console.warn(`[Firebase Storage] Upload fallback to server for '${cleanPath}':`, fbErr?.message || fbErr);
    }
  }

  const reader = new FileReader();
  const dataUrl = await new Promise<string>((resolve, reject) => {
    reader.onload = (e) => resolve(String(e.target?.result || ""));
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });

  const token = await getFirebaseIdToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch("/api/media/upload", {
    method: "POST",
    headers,
    body: JSON.stringify({
      fileData: dataUrl,
      filename: cleanPath.split("/").pop() || `media_${Date.now()}`,
      mimeType: contentType
    })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success || !data.url) {
    throw new Error(data.error || "Failed to upload media to Firebase Storage / server");
  }
  return data.url;
}

export const uploadMedia = uploadAdminMedia;

export function getAdminMediaUrl(pathName: string): string {
  const cleanPath = pathName.startsWith("/") ? pathName.slice(1) : pathName;
  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://") || cleanPath.startsWith("assets/")) {
    return cleanPath.startsWith("assets/") ? `/${cleanPath}` : cleanPath;
  }
  return getMediaCdnUrl(cleanPath);
}

export const getPublicMediaUrl = getAdminMediaUrl;

export function getOptimizedMediaUrl(rawUrl?: string, options: MediaImageOptions = {}): string {
  if (!rawUrl) return "";
  const resolved = resolveAdminMediaUrl(rawUrl);
  return getMediaCdnUrl(resolved, options);
}

export function resolveAdminMediaUrl(rawUrl?: string, options?: MediaImageOptions): string {
  if (!rawUrl) return "";
  const trimmed = rawUrl.trim();
  let baseResolved = trimmed;

  if (
    !trimmed.startsWith("http://") &&
    !trimmed.startsWith("https://") &&
    !trimmed.startsWith("data:") &&
    !trimmed.startsWith("blob:") &&
    !trimmed.startsWith("/")
  ) {
    if (trimmed.startsWith("assets/")) {
      baseResolved = `/${trimmed}`;
    } else {
      baseResolved = getAdminMediaUrl(trimmed);
    }
  }

  if (options && Object.keys(options).length > 0) {
    return getMediaCdnUrl(baseResolved, options);
  }
  return baseResolved;
}

export async function downloadMedia(pathName: string): Promise<Blob | null> {
  try {
    if (storage) {
      const url = await getDownloadURL(ref(storage, `${MEDIA_BUCKET_NAME}/${pathName.replace(/^\/+/, "")}`));
      const res = await fetch(url);
      if (res.ok) return await res.blob();
    }
  } catch (err: any) {
    console.warn(`[Firebase Storage] Download notice for '${pathName}':`, err?.message || err);
  }
  return null;
}

export async function deleteAdminMedia(pathName: string): Promise<boolean> {
  try {
    if (storage) {
      await deleteObject(ref(storage, `${MEDIA_BUCKET_NAME}/${pathName.replace(/^\/+/, "")}`));
      return true;
    }
  } catch (err: any) {
    console.warn(`[Firebase Storage] Delete notice for '${pathName}':`, err?.message || err);
  }
  return false;
}

export const deleteMedia = deleteAdminMedia;

export async function listAdminMedia(folder: string = ""): Promise<any[]> {
  try {
    if (storage) {
      const listRef = ref(storage, `${MEDIA_BUCKET_NAME}/${folder.replace(/^\/+/, "")}`);
      const res = await listAll(listRef);
      return res.items.map((item) => ({ name: item.name, fullPath: item.fullPath }));
    }
  } catch (err: any) {
    console.warn("[Firebase Storage] List media notice:", err?.message || err);
  }
  return [];
}

export const listMedia = listAdminMedia;

export default {
  uploadAdminMedia,
  uploadMedia,
  getAdminMediaUrl,
  getPublicMediaUrl,
  resolveAdminMediaUrl,
  downloadMedia,
  deleteAdminMedia,
  deleteMedia,
  listAdminMedia,
  listMedia,
  MEDIA_BUCKET_NAME
};
