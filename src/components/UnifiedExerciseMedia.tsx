import React, { useState, useEffect, useMemo } from "react";
import { Dumbbell, Play } from "lucide-react";
import { useCentralizedExercises } from "../hooks/useCentralizedExercises";
import { OptimizedImage } from "./OptimizedImage";
import { findMatchingExercise } from "../utils/exerciseMatching";
import { resolveAdminMediaUrl } from "../lib/mediaStorage";
import { getExerciseGifUrl } from "../data/exercises";
import { resolveAuthenticExercise } from "../data/authoritativeExerciseMap";
import { isImageCached } from "../utils/imageCache";

const isValidMediaUrl = (u?: string | null): u is string => {
  if (!u || typeof u !== "string") return false;
  const trimmed = u.trim().toLowerCase();
  return Boolean(trimmed && trimmed !== "none" && trimmed !== "deleted" && trimmed !== "null");
};

interface UnifiedExerciseMediaProps {
  exerciseId?: string;
  exerciseName?: string;
  mediaUrl?: string;
  className?: string;
  fallbackType?: "pulsing" | "dumbbell" | "none";
  aspectRatio?: "16/9" | "4/3" | "1/1" | "auto" | string;
  priority?: boolean;
}

export const UnifiedExerciseMedia: React.FC<UnifiedExerciseMediaProps> = React.memo(({
  exerciseId,
  exerciseName = "",
  mediaUrl,
  className = "w-full h-full",
  fallbackType = "pulsing",
  aspectRatio = "auto",
  priority = false,
}) => {
  const { exercises, loading: hookLoading } = useCentralizedExercises();

  // Search for the centralized exercise matching ID or Name cleanly
  const exercise = useMemo(
    () => findMatchingExercise(exercises, exerciseId, exerciseName),
    [exercises, exerciseId, exerciseName]
  );
  const canonicalName = exerciseName || exercise?.name || exerciseId || "";

  // Guaranteed authentic matching GIF resolved cleanly across all sources
  const authentic = useMemo(() => {
    const candidate =
      (isValidMediaUrl(mediaUrl) ? mediaUrl : "") ||
      (isValidMediaUrl(exercise?.customMediaUrl) ? exercise?.customMediaUrl : "") ||
      (isValidMediaUrl(exercise?.gifUrl) ? exercise?.gifUrl : "") ||
      (isValidMediaUrl(exercise?.imageUrl) ? exercise?.imageUrl : "");
    return resolveAuthenticExercise(canonicalName, candidate, exercise?.category);
  }, [canonicalName, mediaUrl, exercise?.customMediaUrl, exercise?.gifUrl, exercise?.imageUrl, exercise?.category]);

  const defaultFallbackUrl = useMemo(
    () => getExerciseGifUrl(canonicalName, exercise?.category),
    [canonicalName, exercise?.category]
  );
  const rawMediaUrl = (isValidMediaUrl(authentic.gifUrl) ? authentic.gifUrl : "") || defaultFallbackUrl;
  const computedResolvedUrl = useMemo(
    () => resolveAdminMediaUrl(rawMediaUrl) || defaultFallbackUrl,
    [rawMediaUrl, defaultFallbackUrl]
  );

  const [fallbackOverrideUrl, setFallbackOverrideUrl] = useState<string | null>(null);
  const resolvedMediaUrl = fallbackOverrideUrl !== null ? fallbackOverrideUrl : computedResolvedUrl;

  const [isLoaded, setIsLoaded] = useState<boolean>(() => isImageCached(computedResolvedUrl));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setFallbackOverrideUrl(null);
    setHasError(false);
    setIsLoaded(isImageCached(computedResolvedUrl));
  }, [computedResolvedUrl]);

  const isVideoUrl = resolvedMediaUrl
    ? (resolvedMediaUrl.toLowerCase().endsWith(".mp4") ||
       resolvedMediaUrl.toLowerCase().endsWith(".webm") ||
       resolvedMediaUrl.toLowerCase().endsWith(".mov") ||
       resolvedMediaUrl.startsWith("data:video/"))
    : false;
  const resolvedMediaType = exercise?.customMediaType || (isVideoUrl ? "video" : "image");

  const handleMediaError = () => {
    if (defaultFallbackUrl && resolvedMediaUrl !== defaultFallbackUrl) {
      setFallbackOverrideUrl(defaultFallbackUrl);
    } else {
      setHasError(true);
    }
  };

  if (hookLoading && !exercise) {
    return (
      <div className={`flex flex-col items-center justify-center bg-transparent workout-gif-frameless ${className}`}>
        <Dumbbell className="w-5 h-5 text-slate-400 animate-spin" />
        <span className="text-[10px] font-mono font-bold text-slate-400 mt-2">LOADING DEMO</span>
      </div>
    );
  }

  if (!resolvedMediaUrl || hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-transparent workout-gif-frameless ${className}`}>
        <Dumbbell className="w-5 h-5 text-slate-400 animate-pulse" />
        <span className="text-[10px] font-mono font-bold text-slate-400 mt-2 uppercase tracking-tight text-center px-2 truncate w-full">
          {canonicalName || "EXERCISE DEMO"}
        </span>
      </div>
    );
  }

  if (resolvedMediaType === "video") {
    return (
      <div className={`relative ${className} workout-media-frameless workout-gif-frameless flex items-center justify-center`}>
        <video
          src={resolvedMediaUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain workout-gif-display workout-gif-frameless"
          onCanPlay={() => setIsLoaded(true)}
          onError={handleMediaError}
        />
        {!isLoaded && (
          <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center space-y-1.5 z-10 animate-pulse">
            <Dumbbell className="w-5 h-5 text-slate-400 animate-spin" />
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">STREAM LOADING</span>
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded text-[8px] font-mono font-bold text-emerald-400 flex items-center gap-1 border border-emerald-500/20">
          <Play className="w-2.5 h-2.5 fill-emerald-400 stroke-none" /> VIDEO ACTIVE
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} workout-media-frameless workout-gif-frameless flex items-center justify-center`}>
      <OptimizedImage
        src={resolvedMediaUrl}
        alt={exercise?.name || exerciseName || "Exercise Media"}
        className="w-full h-full object-contain workout-gif-display workout-gif-frameless"
        format={resolvedMediaUrl?.toLowerCase()?.includes(".gif") ? "origin" : "webp"}
        fallbackType={fallbackType}
        aspectRatio={aspectRatio}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onError={handleMediaError}
      />
    </div>
  );
});

export default UnifiedExerciseMedia;
