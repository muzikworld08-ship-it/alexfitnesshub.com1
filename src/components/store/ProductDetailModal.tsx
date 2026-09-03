import React, { useState } from "react";
import { 
  X, Star, ShoppingBag, Zap, Ruler, ShieldCheck, 
  RotateCcw, Truck, Check, AlertCircle, Eye, Flame,
  Sparkles, CheckCircle2, ChevronRight, Info
} from "lucide-react";
import { Product } from "../../types";
import { useStore } from "../../context/StoreContext";
import { SizeGuideModal } from "./SizeGuideModal";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose
}) => {
  const { addToCart, buyNow } = useStore();

  const [activeView, setActiveView] = useState<"front" | "back">("front");
  const [selectedSize, setSelectedSize] = useState<string>(() => product?.sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState<string>(() => product?.colors[0]?.name || "");
  const [quantity, setQuantity] = useState<number>(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Sync state if product changes
  React.useEffect(() => {
    if (product) {
      setActiveView("front");
      setSelectedSize(product.sizes[0] || "M");
      setSelectedColor(product.colors[0]?.name || "");
      setQuantity(1);
      setJustAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const currentImage = activeView === "front" 
    ? product.frontImage 
    : (product.backImage || product.frontImage);

  const selectedColorObj = product.colors.find(c => c.name === selectedColor) || product.colors[0];
  const sizeStockCount = product.sizeStock?.[selectedSize] ?? product.stock ?? 20;
  const isOutOfStock = sizeStockCount <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    buyNow(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <>
      {/* 1. SOLID CLEAN BACKDROP - ZERO BLUR */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 animate-fade-in overflow-y-auto"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col md:flex-row max-h-[94vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Crisp Solid Button, No Blur */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2 text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-full shadow-md border border-slate-200 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT: Dynamic Product Images & Front/Back Switcher */}
          <div className="w-full md:w-1/2 bg-slate-100 p-6 flex flex-col justify-between relative select-none">
            {/* Badges Strip */}
            <div className="flex items-center gap-2 mb-3">
              {product.badge && (
                <span className="px-3 py-1 bg-[#E53935] text-white font-black text-[10px] uppercase tracking-wider rounded-md shadow-xs flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-white" />
                  {product.badge}
                </span>
              )}
              {discountPercent && (
                <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-md shadow-xs">
                  SAVE {discountPercent}%
                </span>
              )}
              <span className="px-2 py-1 bg-white text-slate-700 font-bold text-[10px] uppercase tracking-wider rounded-md border border-slate-200 shadow-xs">
                Official AFH
              </span>
            </div>

            {/* Main Stage Image */}
            <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden shadow-sm bg-slate-200 border border-slate-200">
              <img
                src={currentImage}
                alt={`${product.name} - ${activeView} view`}
                className="w-full h-full object-cover object-center transition-all duration-300"
                loading="eager"
              />

              {/* Quick Front / Back Flip Pill - Solid Crisp Pill, No Blur */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-slate-900 rounded-full shadow-lg border border-white/20">
                <button
                  type="button"
                  onClick={() => setActiveView("front")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeView === "front" 
                      ? "bg-[#E53935] text-white shadow-xs" 
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Front View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("back")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeView === "back" 
                      ? "bg-[#E53935] text-white shadow-xs" 
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Back View</span>
                </button>
              </div>
            </div>

            {/* Thumbnail Pickers */}
            <div className="flex items-center gap-3 mt-4 justify-center">
              <button
                type="button"
                onClick={() => setActiveView("front")}
                className={`relative w-14 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeView === "front" ? "border-red-600 ring-2 ring-red-500/20" : "border-slate-300 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={product.frontImage} alt="Front" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-slate-900 text-[9px] text-white font-bold text-center py-0.5">FRONT</span>
              </button>

              {product.backImage && (
                <button
                  type="button"
                  onClick={() => setActiveView("back")}
                  className={`relative w-14 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeView === "back" ? "border-red-600 ring-2 ring-red-500/20" : "border-slate-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={product.backImage} alt="Back" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-900 text-[9px] text-white font-bold text-center py-0.5">BACK</span>
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: TEMU-STYLE PRODUCT SPECIFICATIONS & PURCHASE ACTIONS */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[94vh]">
            <div className="space-y-5">
              
              {/* Temu Lightning Deal / Social Proof Strip */}
              <div className="flex items-center justify-between bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Flash Deal</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px] font-bold">
                  <span>⚡ 94% Claimed</span>
                </div>
              </div>

              {/* Title & Category */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span>{product.rating || 4.9}</span>
                    <span className="text-slate-400 font-normal">({product.reviewsCount || 128} reviews)</span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h2>

                {/* Big Temu-Style Price Display */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#E53935] font-mono tracking-tight">
                    ₦{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm sm:text-base text-slate-400 line-through font-mono">
                      ₦{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 font-black text-xs uppercase rounded-md">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 font-bold">
                  🔥 1,240+ sold in Activewear &bull; <span className="text-emerald-600">Verified Authentic</span>
                </p>
              </div>

              {/* Temu Trust & Delivery Highlights */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px]">
                <div className="flex items-center gap-2 text-slate-700">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Free Shipping</strong> &gt; ₦25k</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Purchase Guarantee</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>7-Day Free Swaps</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>24h Fast Dispatch</strong></span>
                </div>
              </div>

              {/* Color Swatch Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 uppercase tracking-wider">Colour:</span>
                    <span className="font-semibold text-slate-700">{selectedColor}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {product.colors.map((c) => {
                      const isSelected = selectedColor === c.name;
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColor(c.name)}
                          className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            isSelected 
                              ? "border-slate-900 bg-slate-900 text-white shadow-xs" 
                              : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                          }`}
                        >
                          <span 
                            className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0" 
                            style={{ backgroundColor: c.hex }} 
                          />
                          <span>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector + Size Guide Link */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 uppercase tracking-wider">Select Size:</span>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>View Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    const stockForThisSize = product.sizeStock?.[sz] ?? product.stock ?? 10;
                    const isSizeSoldOut = stockForThisSize <= 0;

                    return (
                      <button
                        key={sz}
                        type="button"
                        disabled={isSizeSoldOut}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center border ${
                          isSizeSoldOut
                            ? "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed line-through"
                            : isSelected
                              ? "bg-[#E53935] text-white border-[#E53935] shadow-xs"
                              : "bg-white text-slate-800 border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        <span>{sz}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Stock Indicator Status */}
                <div className="pt-0.5 flex items-center gap-2 text-xs">
                  {isOutOfStock ? (
                    <span className="text-red-600 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Size {selectedSize} is currently out of stock
                    </span>
                  ) : sizeStockCount <= 5 ? (
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Hurry! Only {sizeStockCount} left in Size {selectedSize}
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      In Stock — Ready to ship in 24 hours
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 pt-1">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-1 text-slate-600 hover:text-slate-900 font-black disabled:opacity-40 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-black text-slate-900 font-mono">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.min(sizeStockCount, q + 1))}
                    disabled={quantity >= sizeStockCount}
                    className="px-3 py-1 text-slate-600 hover:text-slate-900 font-black disabled:opacity-40 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* TEMU-STYLE ITEM DETAILS & SPECIFICATIONS TABLE */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-red-600" />
                    Item Details & Specifications
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Temu-Standard Specs</span>
                </div>

                {/* Structured Specifications Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Material</span>
                    <span className="font-semibold text-slate-800">
                      {product.fabric || "Breathable Poly-Mesh / 4-Way Spandex"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Fit Type</span>
                    <span className="font-semibold text-slate-800">
                      {product.sizeGuide?.fitType || "Athletic Tapered / Kinetic Ergonomic"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Elasticity</span>
                    <span className="font-semibold text-slate-800">
                      4-Way Kinetic High Stretch
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Care Instructions</span>
                    <span className="font-semibold text-slate-800">
                      Machine Wash Cold &bull; Hang Dry
                    </span>
                  </div>

                  <div className="flex flex-col sm:col-span-2">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Special Performance Features</span>
                    <span className="font-semibold text-slate-800">
                      Squat-Proof &bull; Anti-Chafe Flatlock Seams &bull; Moisture Wicking
                    </span>
                  </div>
                </div>

                {/* Detailed Description */}
                <div className="pt-2 border-t border-slate-200/80">
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {product.description}
                  </p>
                </div>

                {/* Bulleted Highlights */}
                {product.features && product.features.length > 0 && (
                  <ul className="grid grid-cols-1 gap-1.5 pt-1">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>

            {/* Bottom Actions: Add to Cart + Buy Now (Dual action bar) */}
            <div className="pt-6 border-t border-slate-100 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`py-3.5 px-5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  isOutOfStock 
                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" 
                    : justAdded
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                      : "bg-white hover:bg-slate-50 text-slate-900 border-slate-300 hover:border-slate-400 shadow-xs"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-red-600" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className={`py-3.5 px-5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  isOutOfStock
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-[#E53935] hover:bg-[#C62828] text-white shadow-red-500/20 active:scale-[0.98]"
                }`}
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Size Guide Modal Sub-layer */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
        productName={product.name}
        sizeGuide={product.sizeGuide}
      />
    </>
  );
};
