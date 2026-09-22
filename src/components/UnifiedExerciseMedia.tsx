import React, { useState, useEffect, useMemo } from "react";
import { Dumbbell, Play } from "lucide-react";
import { useCentralizedExercises } from "../hooks/useCentralizedExercises";
import { OptimizedImage } from "./OptimizedImage";
import { findMatchingExercise } from "../utils/exerciseMatching";
import { resolveAdminMediaUrl } from "../lib/mediaStorage";
import { getAccurateExerciseGif } from "../data/exerciseMediaCatalog";
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

  const canonicalName = exercise?.name || exerciseName || exerciseId || "";

  const defaultFallbackUrl = useMemo(() => {
    return getAccurateExerciseGif(canonicalName, exercise?.category);
  }, [canonicalName, exercise?.category]);

  const rawCandidate = exercise?.customMediaUrl || exercise?.gifUrl || exercise?.imageUrl;
  // If candidate is a legacy broken giphy URL or a legacy misassigned squat GIF on a non-squat movement, prioritize the accurate catalog URL
  const isCandidateProblematic = useMemo(() => {
    if (!rawCandidate) return true;
    if (rawCandidate.includes("giphy.com")) return true;
    if (rawCandidate.includes("u8946fAnhQ6cH9R16e") && !canonicalName.toLowerCase().includes("squat")) return true;
    return false;
  }, [rawCandidate, canonicalName]);

  const rawMediaUrl = (!isCandidateProblematic && rawCandidate) ? rawCandidate : defaultFallbackUrl;
  const initialResolvedUrl = resolveAdminMediaUrl(rawMediaUrl) || defaultFallbackUrl;

  const [activeUrl, setActiveUrl] = useState<string>(initialResolvedUrl);
  const [prevRawUrl, setPrevRawUrl] = useState<string>(rawMediaUrl);
  const [isLoaded, setIsLoaded] = useState<boolean>(() => isImageCached(initialResolvedUrl));
  const [hasError, setHasError] = useState(false);

  // Synchronously update activeUrl on prop/exercise changes to prevent any stale GIF lingering
  if (rawMediaUrl !== prevRawUrl) {
    setPrevRawUrl(rawMediaUrl);
    const nextUrl = resolveAdminMediaUrl(rawMediaUrl) || defaultFallbackUrl;
    setActiveUrl(nextUrl);
    setHasError(false);
    setIsLoaded(isImageCached(nextUrl));
  }

  useEffect(() => {
    const nextUrl = resolveAdminMediaUrl(rawMediaUrl) || defaultFallbackUrl;
    setActiveUrl(nextUrl);
    setHasError(false);
    setIsLoaded(isImageCached(nextUrl));
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
    if (activeUrl !== defaultFallbackUrl) {
      setActiveUrl(defaultFallbackUrl);
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
        key={resolvedMediaUrl}
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
};

export default UnifiedExerciseMedia;
