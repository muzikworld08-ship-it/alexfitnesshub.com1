import React from "react";

const CHUNK_RELOAD_STORAGE_KEY = "afh_chunk_reload_attempted";

export function isChunkLoadError(err: unknown): boolean {
  if (!err) return false;
  const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
  const lower = msg.toLowerCase();
  return (
    lower.includes("chunkloaderror") ||
    lower.includes("failed to fetch dynamically imported module") ||
    lower.includes("importing a module script failed") ||
    lower.includes("error loading dynamically imported module") ||
    lower.includes("loading chunk") ||
    lower.includes("failed to fetch")
  );
}

/**
 * Wraps React.lazy with automatic retry + safe single-shot cache recovery
 * so transient network blips or post-deploy chunk updates never trap a user
 * on "Module Temporarily Unavailable".
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  moduleName?: string
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    const delays = [0, 300, 800];
    let lastError: unknown;

    for (let attempt = 0; attempt < delays.length; attempt++) {
      if (delays[attempt] > 0) {
        await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
      }
      try {
        const mod = await factory();
        try {
          sessionStorage.removeItem(CHUNK_RELOAD_STORAGE_KEY);
        } catch {}
        return mod;
      } catch (err) {
        lastError = err;
        console.warn(
          `[lazyWithRetry] Attempt ${attempt + 1}/${delays.length} failed${moduleName ? ` for ${moduleName}` : ""}:`,
          err
        );
      }
    }

    // If all retries fail due to a stale/missing dynamic chunk after a deployment or server restart,
    // perform one clean reload to fetch the current asset manifest.
    if (typeof window !== "undefined" && isChunkLoadError(lastError)) {
      try {
        const alreadyReloaded = sessionStorage.getItem(CHUNK_RELOAD_STORAGE_KEY);
        if (!alreadyReloaded) {
          sessionStorage.setItem(CHUNK_RELOAD_STORAGE_KEY, String(Date.now()));
          window.location.reload();
          // Return a never-resolving promise so React keeps Suspense fallback while the browser reloads
          return new Promise<{ default: T }>(() => {});
        }
      } catch {}
    }

    throw lastError;
  });
}
