import React, { useState, useEffect, useRef } from "react";
import { getSupabaseCdnUrl, getSupabaseSrcSet, SupabaseImageOptions } from "../utils/supabaseImage";
import { isImageCached, markImageCached } from "../utils/imageCache";

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: "origin" | "webp" | "avif" | "jpeg" | "png";
  resize?: "cover" | "contain" | "fill";
  srcSetWidths?: number[];
  fallbackSrc?: string;
  fallbackType?: "none" | "dumbbell" | "pulsing";
  showSkeleton?: boolean;
  aspectRatio?: string; // e.g. "16/9", "4/3", "1/1"
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 80,
  format = "webp",
  resize = "cover",
  srcSetWidths,
  fallbackSrc = "https://picsum.photos/seed/alexfitness/600/400",
  fallbackType,
  showSkeleton = true,
  aspectRatio,
  priority = false,
  fetchPriority,
  className = "",
  style,
  loading,
  referrerPolicy = "no-referrer",
  onError,
  onLoad,
  ...restProps
}) => {
  // If priority is true or loading is explicitly provided, use it. Default to "eager" when priority is true.
  const effectiveLoading = loading || (priority ? "eager" : "lazy");
  const effectiveFetchPriority = fetchPriority || (priority ? "high" : "auto");

  const computeInitialSrc = () => {
    if (src && src.trim() !== "") {
      return getSupabaseCdnUrl(src, { width, height, quality, format, resize });
    }
    if (fallbackSrc && fallbackSrc.trim() !== "") {
      return getSupabaseCdnUrl(fallbackSrc, { width, height, quality, format });
    }
    return undefined;
  };

  const initialComputedSrc = computeInitialSrc();
  const initiallyCached = isImageCached(src) || isImageCached(initialComputedSrc);

  const [isLoaded, setIsLoaded] = useState<boolean>(initiallyCached);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(initialComputedSrc);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Sync source updates
  useEffect(() => {
    if (!src || src.trim() === "") {
      setHasError(true);
      setCurrentSrc(fallbackSrc && fallbackSrc.trim() !== "" ? fallbackSrc : undefined);
      return;
    }

    const options: SupabaseImageOptions = {
      width,
      height,
      quality,
      format,
      resize,
    };

    const cdnUrl = getSupabaseCdnUrl(src, options);
    const resolvedUrl = cdnUrl || (fallbackSrc && fallbackSrc.trim() !== "" ? fallbackSrc : undefined);
    
    setCurrentSrc(resolvedUrl);
    setHasError(false);

    if (isImageCached(src) || isImageCached(resolvedUrl)) {
      setIsLoaded(true);
    }
  }, [src, width, height, quality, format, resize, fallbackSrc]);

  // Check if image is already complete in DOM cache immediately
  const handleRef = (node: HTMLImageElement | null) => {
    imgRef.current = node;
    if (node && node.complete && node.naturalWidth > 0 && !isLoaded) {
      setIsLoaded(true);
      markImageCached(currentSrc);
      markImageCached(src);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        const fallbackOptions: SupabaseImageOptions = { width, height, quality, format: "webp" };
        setCurrentSrc(getSupabaseCdnUrl(fallbackSrc, fallbackOptions));
      }
    }
    if (onError) {
      onError(e);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    markImageCached(currentSrc);
    markImageCached(src);
    if (onLoad) {
      onLoad(e);
    }
  };

  const options: SupabaseImageOptions = { quality, format, resize };
  const targetWidths = srcSetWidths || (width ? [Math.round(width * 0.5), width, Math.round(width * 1.5), Math.round(width * 2)] : [380, 640, 960, 1280]);
  const computedSrcSet = !hasError && src && !src.startsWith("data:") && !src.startsWith("blob:") && !src.toLowerCase().includes(".gif")
    ? getSupabaseSrcSet(src, targetWidths, options)
    : undefined;

  const containerStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
    overflow: "hidden",
    ...(aspectRatio ? { aspectRatio } : {}),
    ...style,
  };

  return (
    <div className={`optimized-image-container ${className}`} style={containerStyle}>
      {/* Non-shifting skeleton placeholder */}
      {showSkeleton && !isLoaded && (
        <div
          className="absolute inset-0 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[inherit] z-10 flex items-center justify-center transition-opacity duration-300"
          aria-hidden="true"
        >
          <div className="w-4 h-4 border-2 border-emerald-500/40 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Rendered Image */}
      {currentSrc && currentSrc.trim() !== "" ? (
        <img
          ref={handleRef}
          src={currentSrc}
          srcSet={computedSrcSet}
          alt={alt || "AlexFitness Media"}
          width={width}
          height={height}
          loading={effectiveLoading}
          decoding="async"
          {...({ fetchPriority: effectiveFetchPriority } as any)}
          referrerPolicy={referrerPolicy}
          onError={handleImageError}
          onLoad={handleImageLoad}
          className={`w-full h-full ${className?.includes('object-contain') ? 'object-contain' : 'object-cover'} transition-opacity duration-200 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          {...restProps}
        />
      ) : null}
    </div>
  );
};

// Aliases for developer convenience & explicit naming requirements
export const CdnImage = OptimizedImage;
export const SupabaseImage = OptimizedImage;

export default OptimizedImage;
