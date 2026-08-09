import { supabase } from "./supabase/client";

export interface SupabaseImageOptions {
  width?: number;
  height?: number;
  quality?: number; // 1-100, default 80
  format?: "origin" | "webp" | "avif" | "jpeg" | "png"; // default "webp"
  resize?: "cover" | "contain" | "fill"; // default "cover"
  useProxyFallback?: boolean; // Default true for non-supabase URLs
}

// Default fallback project URL
const DEFAULT_SUPABASE_PROJECT_URL = "https://ilfjiotgkdedgssachoe.supabase.co";

/**
 * Transforms an image URL into a CDN-optimized Supabase Storage render URL.
 * Automatically handles:
 * - Direct Supabase Storage URLs (.../storage/v1/object/public/...) -> transformed to (/storage/v1/render/image/public/...)
 * - Relative Supabase bucket paths
 * - External image URLs (using the server-side CDN proxy endpoint when requested)
 */
export function getSupabaseCdnUrl(
  src: string,
  options: SupabaseImageOptions = {}
): string {
  if (!src) return "";

  const trimmed = src.trim();

  // 1. Data URLs, Blob URLs, or inline SVGs are passed as-is
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:") || trimmed.endsWith(".svg")) {
    return trimmed;
  }

  const {
    width,
    height,
    quality = 80,
    format = "webp",
    resize = "cover",
    useProxyFallback = true,
  } = options;

  // Build query parameter options string
  const queryParams = new URLSearchParams();
  if (width && width > 0) queryParams.set("width", width.toString());
  if (height && height > 0) queryParams.set("height", height.toString());
  if (quality) queryParams.set("quality", Math.min(100, Math.max(1, quality)).toString());
  if (format && format !== "origin") queryParams.set("format", format);
  if (resize && resize !== "cover") queryParams.set("resize", resize);

  const queryString = queryParams.toString();

  // Helper to append query params to an URL safely
  const appendParams = (baseUrl: string) => {
    if (!queryString) return baseUrl;
    return baseUrl.includes("?") ? `${baseUrl}&${queryString}` : `${baseUrl}?${queryString}`;
  };

  // 2. Handle Supabase Render CDN URLs (.../storage/v1/render/image/public/...)
  if (trimmed.includes("/storage/v1/render/image/public/")) {
    return appendParams(trimmed);
  }

  // 3. Handle Supabase Direct Object URLs (.../storage/v1/object/public/...)
  if (trimmed.includes("/storage/v1/object/public/")) {
    const transformed = trimmed.replace(
      "/storage/v1/object/public/",
      "/storage/v1/render/image/public/"
    );
    return appendParams(transformed);
  }

  // 4. Handle generic Supabase URLs that specify a bucket
  if (trimmed.includes("supabase.co/storage/") || trimmed.includes("supabase.in/storage/")) {
    if (trimmed.includes("/public/")) {
      const parts = trimmed.split("/public/");
      const transformed = `${parts[0]}/render/image/public/${parts[1]}`;
      return appendParams(transformed);
    }
    return appendParams(trimmed);
  }

  // 5. Handle relative Supabase bucket paths (e.g. "exercise_media/squat.png" or "avatars/user.jpg")
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("/")) {
    const bucket = trimmed.startsWith("exercise_media/") ? "" : "exercise_media/";
    const fullRenderUrl = `${DEFAULT_SUPABASE_PROJECT_URL}/storage/v1/render/image/public/${bucket}${trimmed}`;
    return appendParams(fullRenderUrl);
  }

  // 6. Local static assets (e.g. /assets/hero.jpg)
  if (trimmed.startsWith("/")) {
    return appendParams(trimmed);
  }

  // 7. External URLs (Unsplash, Picsum, Firebase Storage, etc.)
  if (useProxyFallback) {
    const proxyUrl = `/api/cdn-image?url=${encodeURIComponent(trimmed)}`;
    return appendParams(proxyUrl);
  }

  return trimmed;
}

/**
 * Generates a standard srcSet attribute for responsive images using Supabase CDN width options.
 */
export function getSupabaseSrcSet(
  src: string,
  widths: number[] = [320, 640, 960, 1280],
  options: Omit<SupabaseImageOptions, "width"> = {}
): string {
  if (!src) return "";
  if (src.startsWith("data:") || src.startsWith("blob:") || src.endsWith(".svg")) {
    return "";
  }

  return widths
    .map((w) => {
      const url = getSupabaseCdnUrl(src, { ...options, width: w });
      return `${url} ${w}w`;
    })
    .join(", ");
}

export default {
  getSupabaseCdnUrl,
  getSupabaseSrcSet,
};
