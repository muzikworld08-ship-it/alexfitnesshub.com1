/**
 * High-Performance Client-Side Image & GIF Cache Engine
 * Provides instant sync cache checks, preloading, and prevents flickering or layout shifts.
 */

// In-memory set of loaded image URLs
const LOADED_IMAGE_URLS = new Set<string>();

// Preload promise registry to avoid duplicate in-flight network requests
const PRELOAD_PROMISES = new Map<string, Promise<boolean>>();

// Hydrate from sessionStorage if available to maintain warm cache across page refreshes
try {
  if (typeof window !== "undefined" && window.sessionStorage) {
    const raw = sessionStorage.getItem("fit_image_cache_keys");
    if (raw) {
      const keys: string[] = JSON.parse(raw);
      keys.forEach((k) => LOADED_IMAGE_URLS.add(k));
    }
  }
} catch (e) {
  // Ignore storage errors in restrictive environments
}

/**
 * Checks synchronously if an image is already cached/loaded in this session.
 */
export function isImageCached(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) return true;
  return LOADED_IMAGE_URLS.has(trimmed);
}

/**
 * Marks an image URL as cached/loaded.
 */
export function markImageCached(url?: string | null): void {
  if (!url || typeof url !== "string") return;
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) return;

  if (!LOADED_IMAGE_URLS.has(trimmed)) {
    LOADED_IMAGE_URLS.add(trimmed);
    
    // Periodically save top keys to sessionStorage
    try {
      if (typeof window !== "undefined" && window.sessionStorage && LOADED_IMAGE_URLS.size <= 300) {
        sessionStorage.setItem(
          "fit_image_cache_keys",
          JSON.stringify(Array.from(LOADED_IMAGE_URLS))
        );
      }
    } catch (e) {}
  }
}

/**
 * Preloads an image asynchronously and caches it in memory/browser cache.
 * Avoids duplicate requests if a preload is already in flight.
 */
export function preloadImage(src: string, isPriority: boolean = false): Promise<boolean> {
  if (!src || typeof src !== "string" || typeof window === "undefined") {
    return Promise.resolve(false);
  }

  const trimmed = src.trim();
  if (!trimmed) return Promise.resolve(false);

  if (LOADED_IMAGE_URLS.has(trimmed)) {
    return Promise.resolve(true);
  }

  if (PRELOAD_PROMISES.has(trimmed)) {
    return PRELOAD_PROMISES.get(trimmed)!;
  }

  const promise = new Promise<boolean>((resolve) => {
    const img = new Image();
    if (isPriority) {
      (img as any).fetchPriority = "high";
    }
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";

    img.onload = () => {
      markImageCached(trimmed);
      PRELOAD_PROMISES.delete(trimmed);
      resolve(true);
    };

    img.onerror = () => {
      PRELOAD_PROMISES.delete(trimmed);
      resolve(false);
    };

    img.src = trimmed;
  });

  PRELOAD_PROMISES.set(trimmed, promise);
  return promise;
}

/**
 * Preloads critical core app assets and top demonstration loops on idle.
 */
export function preloadCriticalFitnessAssets(): void {
  if (typeof window === "undefined") return;

  const CRITICAL_URLS = [
    "https://media.giphy.com/media/3o84U6421O1IIXbowg/giphy.gif",
    "https://media.giphy.com/media/u8946fAnhQ6cH9R16e/giphy.gif",
    "https://media.giphy.com/media/xT8qB7Sbwskk27Rdy8/giphy.gif",
    "https://media.giphy.com/media/v1F0A8f5Ff6hO/giphy.gif",
    "https://media.giphy.com/media/duuVpx00In40Syc7m6/giphy.gif",
    "https://media.giphy.com/media/13sc1CHidbO6S4/giphy.gif",
    "https://media.giphy.com/media/3o7qE1YN7aBOFPRw8E/giphy.gif",
    "https://media.giphy.com/media/3o84U39K5Cj6D0v2w0/giphy.gif",
    "https://media.giphy.com/media/3o7qE6b39zV1LALZRe/giphy.gif",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80"
  ];

  const schedulePreload = () => {
    CRITICAL_URLS.forEach((url, idx) => {
      // Stagger slightly so network isn't saturated at 0ms
      setTimeout(() => {
        preloadImage(url, idx < 2);
      }, idx * 100);
    });
  };

  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(schedulePreload, { timeout: 2000 });
  } else {
    setTimeout(schedulePreload, 800);
  }
}

export default {
  isImageCached,
  markImageCached,
  preloadImage,
  preloadCriticalFitnessAssets,
};
