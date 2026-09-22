import React from "react";
import { Flame, ShieldCheck, Truck, RotateCcw, Sparkles, ChevronRight, ShoppingBag, Award } from "lucide-react";

interface StoreHeroBannerProps {
  cartCount: number;
  onOpenCart: () => void;
  onSelectCategory?: (category: string) => void;
}

export const StoreHeroBanner: React.FC<StoreHeroBannerProps> = ({
  cartCount,
  onOpenCart,
  onSelectCategory
}) => {
  return (
    <section className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800">
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left Column: Brand & Atelier Pitch */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-red-950/90 border border-red-600/50 text-[#E53935] text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <Flame className="w-3.5 h-3.5 fill-[#E53935]" />
                AlexFitness Atelier 2026
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-400" />
                Tested by 1,200+ Nigerian Athletes
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight font-sans">
              ELITE ATHLETIC <span className="text-[#E53935]">PERFORMANCE</span> WEAR
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed max-w-xl">
              Engineered for compound power, high-rep training, and aesthetic physique presentation. Micro-perforated aeromesh and 4-way squat-proof compression.
            </p>

            {/* Quick Collections Jump */}
            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mr-1">Explore:</span>
              <button
                type="button"
                onClick={() => onSelectCategory && onSelectCategory("Men")}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-[11px] font-bold uppercase transition-colors cursor-pointer"
              >
                Men's Pro Series
              </button>
              <button
                type="button"
                onClick={() => onSelectCategory && onSelectCategory("Women")}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-[11px] font-bold uppercase transition-colors cursor-pointer"
              >
                Women's Sculpt
              </button>
              <button
                type="button"
                onClick={() => onSelectCategory && onSelectCategory("ALEXFITNESSHUB Collections")}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-[11px] font-bold uppercase transition-colors cursor-pointer"
              >
                Signature Pump Covers
              </button>
            </div>
          </div>

          {/* Right Column: Key Trust Badges & Cart Trigger */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 shrink-0">
            {/* View Bag Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-[#E53935] hover:bg-[#C62828] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/50 hover:shadow-red-900/60 transition-all cursor-pointer group"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 w-4 h-4 rounded-full bg-white text-red-600 text-[10px] font-black flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>Open Bag ({cartCount})</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Quick Guarantees Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
                <Truck className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>48h Express Lagos/Abuja</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100% Squat-Proof</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
                <RotateCcw className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Free 7-Day Size Swaps</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Free Ship &gt; ₦50k</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
