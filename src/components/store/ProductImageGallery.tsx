import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  ChevronLeft, ChevronRight, Maximize2, X, Sparkles, 
  ZoomIn, Check, ShieldCheck 
} from "lucide-react";
import { Product } from "../../types";

interface ProductImageGalleryProps {
  product: Product;
  selectedColor?: string;
  className?: string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  product,
  selectedColor,
  className = ""
}) => {
  // Extract all valid image URLs from product (up to 7 images)
  const rawImages: string[] = React.useMemo(() => {
    const list: string[] = [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach(img => {
        if (typeof img === "string" && img.trim() && !list.includes(img.trim())) {
          list.push(img.trim());
        }
      });
    }
    if (product.frontImage && !list.includes(product.frontImage.trim())) {
      list.unshift(product.frontImage.trim());
    }
    if (product.backImage && !list.includes(product.backImage.trim())) {
      list.push(product.backImage.trim());
    }
    // Fallback if no images
    if (list.length === 0) {
      list.push("https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=900&auto=format&fit=crop&q=80");
    }
    return list.slice(0, 7);
  }, [product.images, product.frontImage, product.backImage]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Touch Swipe Gesture State for Mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 45; // in px

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % rawImages.length);
  }, [rawImages.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + rawImages.length) % rawImages.length);
  }, [rawImages.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === "Escape") setIsLightboxOpen(false);
        if (e.key === "ArrowRight") setLightboxIndex(prev => (prev + 1) % rawImages.length);
        if (e.key === "ArrowLeft") setLightboxIndex(prev => (prev - 1 + rawImages.length) % rawImages.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, rawImages.length]);

  const currentMainImage = rawImages[activeIndex] || rawImages[0];

  return (
    <div className={`flex flex-col gap-3 w-full select-none ${className}`}>
      {/* MAIN HERO IMAGE CONTAINER */}
      <div 
        className="relative w-full aspect-4/5 sm:aspect-square bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs group"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Main Image with Smooth Fade */}
        <img
          src={currentMainImage}
          alt={`${product.name} - View ${activeIndex + 1}`}
          onError={() => setImageErrors(prev => ({ ...prev, [currentMainImage]: true }))}
          className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-[1.02]"
          loading="eager"
        />

        {/* Primary Image Ribbon (When index 0 is active) */}
        {activeIndex === 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Primary View
            </span>
          </div>
        )}

        {/* Dynamic Image Counter Pill (e.g., 1 / 7) */}
        <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 bg-slate-950/80 text-white backdrop-blur-md rounded-full text-[11px] font-mono font-black tracking-wider border border-white/10 shadow-md">
          {activeIndex + 1} / {rawImages.length}
        </div>

        {/* Lightbox / Zoom Trigger Button */}
        <button
          type="button"
          onClick={() => {
            setLightboxIndex(activeIndex);
            setIsLightboxOpen(true);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-white/90 hover:bg-white text-slate-900 shadow-md transition-all cursor-pointer opacity-90 hover:opacity-100 hover:scale-105"
          title="Open Fullscreen Gallery"
          aria-label="Zoom image"
        >
          <Maximize2 className="w-4 h-4 text-slate-800" />
        </button>

        {/* Navigation Arrows (Visible if more than 1 image) */}
        {rawImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-md transition-all cursor-pointer opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-md transition-all cursor-pointer opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
            </button>
          </>
        )}

        {/* Swipe instruction hint on mobile */}
        <div className="sm:hidden absolute bottom-3 left-3 z-10 text-[10px] text-white/70 font-mono tracking-tight bg-black/40 px-2 py-0.5 rounded-md pointer-events-none">
          Swipe to explore
        </div>
      </div>

      {/* MOBILE DOT INDICATORS */}
      {rawImages.length > 1 && (
        <div className="flex sm:hidden items-center justify-center gap-1.5 py-1">
          {rawImages.map((_, idx) => (
            <button
              key={`dot-${idx}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeIndex === idx 
                  ? "w-6 bg-red-600" 
                  : "w-1.5 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* DESKTOP & TABLET THUMBNAIL STRIP (Up to 7 slots) */}
      {rawImages.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300">
          {rawImages.map((imgUrl, idx) => {
            const isActive = activeIndex === idx;
            const isPrimary = idx === 0;

            return (
              <button
                key={`thumb-${idx}-${imgUrl.slice(-15)}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  isActive
                    ? "border-red-600 ring-2 ring-red-500/20 scale-102"
                    : "border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                {isPrimary && (
                  <span className="absolute top-0.5 left-0.5 bg-red-600 text-white text-[7px] font-black uppercase px-1 rounded shadow-xs">
                    Main
                  </span>
                )}
                <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[8px] font-mono font-bold px-1 rounded">
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fade-in">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <span className="text-sm font-black uppercase tracking-wider text-white">
                {product.name}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-mono font-bold">
                {lightboxIndex + 1} of {rawImages.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer hover:scale-105"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Fullscreen Viewer */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 max-h-[78vh]">
            <img
              src={rawImages[lightboxIndex]}
              alt={`${product.name} Fullscreen View`}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300"
            />

            {rawImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setLightboxIndex((prev) => (prev - 1 + rawImages.length) % rawImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={() => setLightboxIndex((prev) => (prev + 1) % rawImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails in Lightbox */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 max-w-3xl mx-auto w-full">
            {rawImages.map((img, idx) => (
              <button
                key={`lb-thumb-${idx}`}
                type="button"
                onClick={() => setLightboxIndex(idx)}
                className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  lightboxIndex === idx ? "border-red-500 scale-110 ring-2 ring-red-500/40" : "border-white/20 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
