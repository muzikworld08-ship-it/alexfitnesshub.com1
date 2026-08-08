import React, { useState, useEffect } from "react";
import { Dumbbell } from "lucide-react";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackType?: "pulsing" | "dumbbell" | "none";
  aspectRatio?: "16/9" | "4/3" | "1/1" | "auto" | string;
  blurDataURL?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = "",
  fallbackType = "pulsing",
  loading = "lazy",
  aspectRatio = "auto",
  blurDataURL,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // Determine aspect ratio class / style
  const getAspectRatioClass = () => {
    if (aspectRatio === "16/9") return "aspect-video";
    if (aspectRatio === "4/3") return "aspect-[4/3]";
    if (aspectRatio === "1/1") return "aspect-square";
    return "";
  };

  if (!src) {
    return (
      <div className={`relative overflow-hidden w-full h-full flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-xl p-4 text-center ${getAspectRatioClass()} ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-2 p-3 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800/80 text-slate-200">
          <Dumbbell className="w-5 h-5 text-slate-400 animate-pulse" />
          <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">ALEX FITNESS</span>
        </div>
      </div>
    );
  }

  // Only generate AVIF/WebP picture sources for Unsplash CDN URLs that support auto-format
  let avifSrc = "";
  let webpSrc = "";
  let fallbackSrc = src;

  if (src.includes("unsplash.com")) {
    avifSrc = `${src.split("?")[0]}?auto=format&fm=avif&q=70&w=1200`;
    webpSrc = `${src.split("?")[0]}?auto=format&fm=webp&q=80&w=1200`;
  }

  // Create highly performing responsive srcsets for Unsplash
  const generateSrcset = (baseSrc: string) => {
    if (baseSrc && baseSrc.includes("unsplash.com")) {
      const baseUrl = baseSrc.split("&w=")[0];
      const fmParam = baseSrc.includes("fm=avif") ? "fm=avif" : baseSrc.includes("fm=webp") ? "fm=webp" : "fm=jpg";
      return [
        `${baseUrl}&auto=format&${fmParam}&q=70&w=480 480w`,
        `${baseUrl}&auto=format&${fmParam}&q=70&w=768 768w`,
        `${baseUrl}&auto=format&${fmParam}&q=80&w=1080 1080w`,
        `${baseUrl}&auto=format&${fmParam}&q=80&w=1400 1400w`
      ].join(", ");
    }
    return undefined;
  };

  const avifSrcset = generateSrcset(avifSrc);
  const webpSrcset = generateSrcset(webpSrc);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    if (retryCount < 2) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 1000);
    } else {
      setHasError(true);
    }
  };

  const isDataOrBlob = src.startsWith("data:") || src.startsWith("blob:");
  const retryUrl = retryCount > 0 && !isDataOrBlob 
    ? `${fallbackSrc}${fallbackSrc.includes("?") ? "&" : "?"}retry=${retryCount}` 
    : fallbackSrc;

  if (hasError) {
    return (
      <div className={`relative overflow-hidden w-full h-full flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-xl p-4 text-center ${getAspectRatioClass()} ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-2 p-3 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800/80 text-slate-200">
          <Dumbbell className="w-5 h-5 text-amber-500 animate-pulse" />
          <span className="text-[9px] font-mono font-bold tracking-wider text-slate-300 uppercase">ALEX FITNESS ASSET</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden w-full h-full block ${getAspectRatioClass()}`}>
      {/* Blur-up placeholder backdrop & skeleton loading animation */}
      {!isLoaded && fallbackType !== "none" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md animate-pulse">
          {/* Blur background image preview if blurDataURL or src exists */}
          <div 
            className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110 opacity-30"
            style={{ backgroundImage: `url(${blurDataURL || src})` }}
          />
          <div className="relative z-20 flex flex-col items-center justify-center space-y-1.5 p-2 bg-slate-950/80 backdrop-blur-md rounded-xl text-white border border-slate-800">
            <Dumbbell className="w-4 h-4 text-amber-500 animate-spin" />
            <span className="text-[8px] font-mono font-bold text-slate-200 tracking-wider">LOADING ASSET...</span>
          </div>
        </div>
      )}

      <picture className="w-full h-full block">
        {/* AVIF Optimized format */}
        {avifSrc && (
          <source
            type="image/avif"
            srcSet={avifSrcset || avifSrc}
            sizes="(max-width: 640px) 480px, (max-width: 1024px) 768px, 1200px"
          />
        )}
        {/* WebP Optimized format */}
        {webpSrc && (
          <source
            type="image/webp"
            srcSet={webpSrcset || webpSrc}
            sizes="(max-width: 640px) 480px, (max-width: 1024px) 768px, 1200px"
          />
        )}
        {/* Fallback image with blur-up animation and lazy decoding */}
        <img
          src={retryUrl}
          alt={alt}
          loading={loading}
          decoding="async"
          className={`${className} transition-all duration-700 ease-out ${
            !isLoaded ? "opacity-0 filter blur-md scale-105" : "opacity-100 filter-none scale-100"
          }`}
          onLoad={handleLoad}
          onError={handleError}
          referrerPolicy="no-referrer"
          {...props}
        />
      </picture>
    </div>
  );
};

export default OptimizedImage;
