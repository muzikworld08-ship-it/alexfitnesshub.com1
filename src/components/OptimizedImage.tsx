import React, { useState, useEffect } from "react";
import { getSupabaseCdnUrl, getSupabaseSrcSet, SupabaseImageOptions } from "../utils/supabaseImage";

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
  className = "",
  style,
  loading = "lazy",
  referrerPolicy = "no-referrer",
  onError,
  onLoad,
  ...restProps
}) => {
  const computeInitialSrc = () => {
    if (src && src.trim() !== "") {
      return getSupabaseCdnUrl(src, { width, height, quality, format, resize });
    }
    if (fallbackSrc && fallbackSrc.trim() !== "") {
      return getSupabaseCdnUrl(fallbackSrc, { width, height, quality, format });
    }
    return undefined;
  };

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(computeInitialSrc);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);

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
    setCurrentSrc(cdnUrl || (fallbackSrc && fallbackSrc.trim() !== "" ? fallbackSrc : undefined));
  }, [src, width, height, quality, format, resize, fallbackSrc]);

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
    if (onLoad) {
      onLoad(e);
    }
  };

  const options: SupabaseImageOptions = { quality, format, resize };
  const computedSrcSet = srcSetWidths && srcSetWidths.length > 0 && !hasError
    ? getSupabaseSrcSet(src, srcSetWidths, options)
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
      {/* Loading Skeleton */}
      {showSkeleton && !isLoaded && (
        <div
          className="absolute inset-0 bg-neutral-800/40 dark:bg-neutral-800/60 animate-pulse rounded-[inherit] z-10 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin opacity-40" />
        </div>
      )}

      {/* Rendered Image */}
      {currentSrc && currentSrc.trim() !== "" ? (
        <img
          src={currentSrc}
          srcSet={computedSrcSet}
          alt={alt || "AlexFitness Media"}
          width={width}
          height={height}
          loading={loading}
          referrerPolicy={referrerPolicy}
          onError={handleImageError}
          onLoad={handleImageLoad}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
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
