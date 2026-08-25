import React, { useState, useEffect, useMemo } from "react";
import { Dumbbell, Play } from "lucide-react";
import { useCentralizedExercises } from "../hooks/useCentralizedExercises";
import { OptimizedImage } from "./OptimizedImage";
import { findMatchingExercise } from "../utils/exerciseMatching";
import { resolveAdminMediaUrl } from "../lib/mediaStorage";
import { getExerciseGifUrl } from "../data/exercises";
import { isImageCached } from "../utils/imageCache";

interface UnifiedExerciseMediaProps {
  exerciseId?: string;
  exerciseName?: string;
  className?: string;
  fallbackType?: "pulsing" | "dumbbell" | "none";
  aspectRatio?: "16/9" | "4/3" | "1/1" | "auto" | string;
  priority?: boolean;
}

export const UnifiedExerciseMedia: React.FC<UnifiedExerciseMediaProps> = ({
  exerciseId,
  exerciseName = "",
  className = "w-full h-full",
  fallbackType = "pulsing",
  aspectRatio = "auto",
  priority = false,
}) => {
  const { exercises, loading: hookLoading } = useCentralizedExercises();

  // Search for the centralized exercise matching ID or Name cleanly
  const exercise = findMatchingExercise(exercises, exerciseId, exerciseName);

  const defaultFallbackUrl = useMemo(() => {
    return getExerciseGifUrl(exerciseName || exerciseId || exercise?.name || "");
  }, [exerciseName, exerciseId, exercise?.name]);

  const rawMediaUrl = exercise?.customMediaUrl || exercise?.gifUrl || exercise?.imageUrl || defaultFallbackUrl;
  const initialResolvedUrl = resolveAdminMediaUrl(rawMediaUrl) || defaultFallbackUrl;

  const [activeUrl, setActiveUrl] = useState<string>(initialResolvedUrl);
  const [isLoaded, setIsLoaded] = useState<boolean>(() => isImageCached(initialResolvedUrl));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const nextUrl = resolveAdminMediaUrl(rawMediaUrl) || defaultFallbackUrl;
    setActiveUrl(nextUrl);
    setHasError(false);
    if (isImageCached(nextUrl)) {
      setIsLoaded(true);
    }
  }, [rawMediaUrl, defaultFallbackUrl]);

  const resolvedMediaUrl = activeUrl || initialResolvedUrl;
  const isVideoUrl = resolvedMediaUrl
    ? (resolvedMediaUrl.toLowerCase().endsWith(".mp4") ||
       resolvedMediaUrl.toLowerCase().endsWith(".webm") ||
       resolvedMediaUrl.toLowerCase().endsWith(".mov") ||
       resolvedMediaUrl.startsWith("data:video/"))
    : false;
  const resolvedMediaType = exercise?.customMediaType || (isVideoUrl ? "video" : "image");

  const handleMediaError = () => {
    const stdGif = exercise?.gifUrl ? resolveAdminMediaUrl(exercise.gifUrl) : "";
    const stdImg = exercise?.imageUrl ? resolveAdminMediaUrl(exercise.imageUrl) : "";
    const catGif = defaultFallbackUrl;

    if (activeUrl !== stdGif && stdGif && stdGif !== activeUrl) {
      setActiveUrl(stdGif);
    } else if (activeUrl !== stdImg && stdImg && stdImg !== activeUrl) {
      setActiveUrl(stdImg);
    } else if (activeUrl !== catGif && catGif && catGif !== activeUrl) {
      setActiveUrl(catGif);
    } else {
      setHasError(true);
    }
  };

  if (hookLoading && !exercise) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-900/90 rounded-xl ${className}`}>
        <Dumbbell className="w-5 h-5 text-slate-400 animate-spin" />
        <span className="text-[10px] font-mono font-bold text-slate-400 mt-2">LOADING MEDIA</span>
      </div>
    );
  }

  if (!resolvedMediaUrl || hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-900/90 rounded-xl ${className}`}>
        <Dumbbell className="w-5 h-5 text-slate-400 animate-pulse" />
        <span className="text-[10px] font-mono font-bold text-slate-400 mt-2 uppercase tracking-tight text-center px-2 truncate w-full">
          {exerciseName || exercise?.name || "EXERCISE DEMO"}
        </span>
      </div>
    );
  }

  if (resolvedMediaType === "video") {
    return (
      <div className={`relative ${className} workout-media-frameless flex items-center justify-center`}>
        <video
          src={resolvedMediaUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain workout-gif-display"
          onCanPlay={() => setIsLoaded(true)}
          onError={handleMediaError}
        />
        {!isLoaded && (
          <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center space-y-1.5 z-10 animate-pulse">
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
    <div className={`${className} workout-media-frameless flex items-center justify-center`}>
      <OptimizedImage
        src={resolvedMediaUrl}
        alt={exercise?.name || exerciseName || "Exercise Media"}
        className="w-full h-full object-contain workout-gif-display"
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
};

export default UnifiedExerciseMedia;
