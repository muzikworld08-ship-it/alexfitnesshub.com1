import { supabase } from "../utils/supabase/client";

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
    // If bucket doesn't exist yet or fails, fallback to getPublicUrl
  }

  return getAdminMediaUrl(cleanPath);
}

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

export default {
  uploadAdminMedia,
  getAdminMediaUrl,
  deleteAdminMedia,
  listAdminMedia,
  MEDIA_BUCKET_NAME
};
