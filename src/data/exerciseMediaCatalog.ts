/**
 * Clean Exercise Media Catalog.
 * All old hardcoded exercises and third-party GIFs have been completely removed.
 * Demonstrations are solely provided by Admin-uploaded media or custom URLs.
 */

export const BASE_MEDIA_URL = "";

export const CATEGORY_FALLBACK_POOLS: Record<string, string[]> = {};

export const EXERCISE_ACCURATE_MEDIA_CATALOG: Record<string, string> = {};

export function getAccurateExerciseGif(
  name: string = "",
  category: string = "",
  usedGifs?: Set<string>
): string {
  // Returns empty string by default. Admin-added exercises provide their own media.
  return "";
}

export default getAccurateExerciseGif;
