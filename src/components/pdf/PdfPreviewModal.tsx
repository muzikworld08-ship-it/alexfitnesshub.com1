import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, FileText, Download, ShieldCheck, Eye } from "lucide-react";
import { PrintablePdfProduct } from "../../types/printablePdf";

interface PdfPreviewModalProps {
  product: PrintablePdfProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onBuyNow?: () => void;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  product,
  isOpen,
  onClose,
  onBuyNow,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  if (!isOpen || !product) return null;

  const pages = product.previewPages && product.previewPages.length > 0
    ? product.previewPages
    : [product.coverImage];

  const currentPreview = pages[currentPageIndex] || product.coverImage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                {product.title}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Sample Preview • Page {currentPageIndex + 1} of {pages.length} ({product.pageCount} Total Pages)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Preview Display */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-center bg-slate-100/70 min-h-[360px] sm:min-h-[500px]">
          <div className="relative max-w-md w-full rounded-2xl shadow-xl border border-slate-200 overflow-hidden bg-white group">
            <img
              src={currentPreview}
              alt={`Preview page ${currentPageIndex + 1}`}
              className="w-full h-auto object-cover select-none"
            />

            {/* Professional Watermark Overlay for Digital Rights Protection */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-black/5">
              <div className="transform -rotate-25 bg-red-600/90 text-white font-black tracking-widest text-xs sm:text-sm uppercase px-6 py-1.5 rounded-full shadow-lg border border-white/20 select-none">
                ALEXFITNESSHUB PREVIEW SAMPLE
              </div>
            </div>

            {/* Page number badge */}
            <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs">
              Page {currentPageIndex + 1}
            </div>
          </div>
        </div>

        {/* Bottom Controller Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-150 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Pagination buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentPageIndex === 0}
              className="p-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Previous sample page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-600 px-2">
              {currentPageIndex + 1} / {pages.length}
            </span>
            <button
              onClick={() => setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
              disabled={currentPageIndex === pages.length - 1}
              className="p-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Next sample page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Pricing & CTA */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">One-time payment</span>
              <span className="text-lg font-black text-slate-900 font-sans">
                ₦{product.priceNGN.toLocaleString()}
              </span>
            </div>

            {onBuyNow && (
              <button
                onClick={() => {
                  onClose();
                  onBuyNow();
                }}
                className="flex-1 sm:flex-initial py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Buy & Download</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
