export interface MediaImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "origin" | "webp" | "avif" | "jpeg" | "png";
  resize?: "cover" | "contain" | "fill";
  useProxyFallback?: boolean;
}

/**
 * Normalizes and optimizes an image/GIF/video URL using Firebase Storage, trusted CDNs,
 * local `/assets/*` paths, or the Express `/api/cdn-image` endpoint.
 */
export function getMediaCdnUrl(
  src: string,
  options: MediaImageOptions = {}
): string {
  if (!src) return "";

  let trimmed = src.trim();

  // Upgrade http to https to avoid mixed-content blocks on deployed HTTPS sites
  if (trimmed.startsWith("http://")) {
    trimmed = "https://" + trimmed.slice(7);
  }

  // Data URLs, Blob URLs, inline SVGs, and animated GIFs pass through untouched
  if (
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:") ||
    trimmed.endsWith(".svg") ||
    trimmed.toLowerCase().includes(".gif") ||
    trimmed.includes("giphy.com") ||
    trimmed.includes("giphy.net")
  ) {
    return trimmed;
  }

  // Handle trusted direct CDNs including Firebase Storage & Unsplash
  if (
    trimmed.includes("firebasestorage.googleapis.com") ||
    trimmed.includes("storage.googleapis.com") ||
    trimmed.includes("firebasestorage.app") ||
    trimmed.includes("images.unsplash.com") ||
    trimmed.includes("gstatic.com") ||
    trimmed.includes("googleusercontent.com") ||
    trimmed.includes("shopify.com") ||
    trimmed.includes("theathletesphysique.com") ||
    trimmed.includes("picsum.photos") ||
    trimmed.includes("cloudinary.com") ||
    trimmed.includes("cloudfront.net") ||
    trimmed.includes("githubusercontent.com") ||
    trimmed.includes("imgur.com") ||
    trimmed.includes("ytimg.com") ||
    trimmed.includes("fitnessprogramer.com")
  ) {
    if (trimmed.includes("images.unsplash.com")) {
      try {
        const unsplashUrl = new URL(trimmed);
        if (options.width) unsplashUrl.searchParams.set("w", options.width.toString());
        if (options.quality) unsplashUrl.searchParams.set("q", options.quality.toString());
        unsplashUrl.searchParams.set("auto", "format");
        unsplashUrl.searchParams.set("fit", "crop");
        return unsplashUrl.toString();
      } catch {
        return trimmed;
      }
    }
    return trimmed;
  }

  // Local static assets (/assets/... or /images/...)
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  // Relative asset path -> normalize to /assets/
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return trimmed.startsWith("assets/") ? `/${trimmed}` : `/assets/${trimmed}`;
  }

  if (options.useProxyFallback === true) {
    const queryParams = new URLSearchParams();
    if (options.width && options.width > 0) queryParams.set("width", options.width.toString());
    if (options.height && options.height > 0) queryParams.set("height", options.height.toString());
    if (options.quality) queryParams.set("quality", Math.min(100, Math.max(1, options.quality)).toString());
    if (options.format && options.format !== "origin") queryParams.set("format", options.format);
    if (options.resize && options.resize !== "cover") queryParams.set("resize", options.resize);
    const qs = queryParams.toString();
    const proxyUrl = `/api/cdn-image?url=${encodeURIComponent(trimmed)}`;
    return qs ? `${proxyUrl}&${qs}` : proxyUrl;
  }

  return trimmed;
}

/**
 * Generates responsive srcSet values for dynamic CDNs such as Unsplash.
 */
export function getMediaSrcSet(
  src: string,
  widths: number[] = [320, 640, 960, 1280],
  options: Omit<MediaImageOptions, "width"> = {}
): string {
  if (!src) return "";
  if (
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    src.endsWith(".svg") ||
    src.toLowerCase().includes(".gif")
  ) {
    return "";
  }

  if (!src.includes("images.unsplash.com")) {
    return "";
  }

  return widths
    .map((w) => {
      const url = getMediaCdnUrl(src, { ...options, width: w });
      return `${url} ${w}w`;
    })
    .join(", ");
}

export default {
  getMediaCdnUrl,
  getMediaSrcSet,
};
