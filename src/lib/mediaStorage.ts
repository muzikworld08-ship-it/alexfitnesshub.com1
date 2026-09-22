import { supabase } from "../utils/supabase/client";
import { getSupabaseCdnUrl, SupabaseImageOptions } from "../utils/supabaseImage";

export const MEDIA_BUCKET_NAME = "exercise_media";

/**
 * Uploads media (images, gifs, videos) directly to Supabase Storage bucket.
 * Returns the permanent public CDN URL for the uploaded file.
 */
export async function uploadAdminMedia(
  file: File | Blob,
  pathName: string
): Promise<string> {
  const cleanPath = pathName.startsWith("/") ? pathName.slice(1) : pathName;
  
  // Ensure content type is preserved
  const contentType = file.type || (cleanPath.endsWith(".mp4") ? "video/mp4" : cleanPath.endsWith(".gif") ? "image/gif" : "image/png");

  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET_NAME)
    .upload(cleanPath, file, {
      upsert: true,
      contentType,
      cacheControl: "360000"
    });

  if (error) {
    console.warn(`[Supabase Storage] Upload error for path '${cleanPath}':`, error.message);
    throw new Error(`Supabase Storage upload error: ${error.message}`);
  }

  return getAdminMediaUrl(cleanPath);
}

/** Alias for uploadAdminMedia for generic usage */
export const uploadMedia = uploadAdminMedia;

/**
 * Retrieves the permanent public URL for a file stored in Supabase Storage.
 */
export function getAdminMediaUrl(pathName: string): string {
  const cleanPath = pathName.startsWith("/") ? pathName.slice(1) : pathName;
  
  const { data } = supabase.storage
    .from(MEDIA_BUCKET_NAME)
    .getPublicUrl(cleanPath);

  return data.publicUrl;
}

/** Alias for getAdminMediaUrl for generic usage */
export const getPublicMediaUrl = getAdminMediaUrl;

/**
 * Returns an optimized CDN URL with custom sizing and format parameters
 */
export function getOptimizedMediaUrl(rawUrl?: string, options: SupabaseImageOptions = {}): string {
  if (!rawUrl) return "";
  const resolved = resolveAdminMediaUrl(rawUrl);
  return getSupabaseCdnUrl(resolved, options);
}

/**
 * Resolves any media reference (including local static server asset paths & data URLs)
 * to a functional, stable display URL with CDN optimization support.
 */
export function resolveAdminMediaUrl(rawUrl?: string, options?: SupabaseImageOptions): string {
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
    return getSupabaseCdnUrl(baseResolved, options);
  }

  return baseResolved;
}

/**
 * Downloads a media file blob from Supabase Storage.
 */
export async function downloadMedia(pathName: string): Promise<Blob | null> {
  const cleanPath = pathName.startsWith("/") ? pathName.slice(1) : pathName;

  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET_NAME)
    .download(cleanPath);

  if (error) {
    console.warn(`[Supabase Storage] Download error for '${cleanPath}':`, error.message);
    return null;
  }

  return data;
}

/**
 * Deletes a file from Supabase Storage bucket.
 */
export async function deleteAdminMedia(pathName: string): Promise<boolean> {
  const cleanPath = pathName.startsWith("/") ? pathName.slice(1) : pathName;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET_NAME)
    .remove([cleanPath]);

  if (error) {
    console.warn(`[Supabase Storage] Delete error for '${cleanPath}':`, error.message);
    return false;
  }
  return true;
}

export const deleteMedia = deleteAdminMedia;

/**
 * Lists stored media files in the bucket under a directory prefix.
 */
export async function listAdminMedia(folder: string = ""): Promise<any[]> {
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET_NAME)
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" }
    });

  if (error) {
    console.warn("[Supabase Storage] List media error:", error.message);
    return [];
  }

  return data || [];
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

