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
  const exercise = findMatchingExercise(exercises, exerciseId, exerciseName);

  const canonicalName = exercise?.name || exerciseName || exerciseId || "";

  const defaultFallbackUrl = useMemo(() => {
    return getAccurateExerciseGif(canonicalName, exercise?.category);
  }, [canonicalName, exercise?.category]);

  const rawCandidate = mediaUrl || exercise?.customMediaUrl || exercise?.gifUrl || exercise?.imageUrl;
  // If candidate is a legacy broken giphy URL, mismatched exercise GIF, or wrong movement pattern, prioritize the accurate catalog URL
  const isCandidateProblematic = useMemo(() => {
    const candidateToCheck = mediaUrl || rawCandidate;
    if (!candidateToCheck) return true;
    const candLower = candidateToCheck.toLowerCase();
    const nameLower = canonicalName.toLowerCase();
    const isFacePull = nameLower.includes("face pull") || nameLower.includes("facepull");
    const isChestDip = nameLower.includes("dip") || nameLower.includes("chest dip");
    const isPullUp = nameLower.includes("pull-up") || nameLower.includes("pull up") || nameLower.includes("pullup") || nameLower.includes("chin up") || nameLower.includes("chin-up");

    if (candLower.includes("giphy.com")) return true;
    if (candLower.includes("0174-8b6lc55")) return true; // known 404 URL
    if (candLower.includes("0337-l2v5nan") && isFacePull) return true; // lying across-face press wrongly on face pull
    if (candLower.includes("0139-50betrz") && isFacePull) return true;
    if (candLower.includes("0991-vttbip3") && isFacePull) return true;
    if (candLower.includes("0063-elhhvgj") && !nameLower.includes("squat")) return true;
    if (candLower.includes("u8946fanhq6ch9r16e") && !nameLower.includes("squat")) return true;

    // Biomechanical validation: Detect Pull Ups vs Chest Dips mismatch
    if (isChestDip && (candLower.includes("0652-lbdjfxj") || candLower.includes("2808-bmrwwzo") || candLower.includes("pullup") || candLower.includes("pull-up") || candLower.includes("pull_up"))) {
      return true;
    }
    if (isPullUp && (candLower.includes("0251-9wtm7dq") || candLower.includes("3288-rwobmi5") || candLower.includes("3289-05cf2v8") || candLower.includes("dip"))) {
      return true;
    }

    return false;
  }, [mediaUrl, rawCandidate, canonicalName]);

  // Derive mediaUrl safely: if candidate is problematic or mismatched, default to accurate canonical catalog
  const rawMediaUrl = useMemo(() => {
    if (isCandidateProblematic) {
      return defaultFallbackUrl;
    }
    if (mediaUrl && !mediaUrl.includes("giphy.com") && !mediaUrl.includes("0174-8b6lC55")) {
      return mediaUrl;
    }
    if (rawCandidate) {
      return rawCandidate;
    }
    return defaultFallbackUrl;
  }, [mediaUrl, isCandidateProblematic, rawCandidate, defaultFallbackUrl]);

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
    setActiveUrl(prev => (prev === nextUrl ? prev : nextUrl));
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
});

export default UnifiedExerciseMedia;
