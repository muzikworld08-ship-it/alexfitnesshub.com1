import React, { useState } from "react";
import { 
  RotateCcw, Eye, ShoppingBag, Zap, Star, ShieldCheck, 
  Trash2, Check, Flame, Sparkles, ArrowRight, Layers
} from "lucide-react";
import { Product } from "../../types";

interface StoreLookbookCardProps {
  product: Product;
  isAdmin: boolean;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onBuyNow: (product: Product, size: string, color: string) => void;
  onDeletePrompt: (product: Product) => void;
}

export const StoreLookbookCard: React.FC<StoreLookbookCardProps> = ({
  product,
  isAdmin,
  onOpenDetail,
  onAddToCart,
  onBuyNow,
  onDeletePrompt
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0].name : "Standard"
  );
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const hasBackView = Boolean(product.backImage);
  const currentDisplayImage = isFlipped && product.backImage ? product.backImage : product.frontImage;

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1800);
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row">
        
        {/* Left: Large Editorial Lookbook Visual */}
        <div className="relative w-full lg:w-1/2 aspect-4/3 lg:aspect-auto min-h-[380px] bg-slate-900 overflow-hidden select-none">
          <img
            src={currentDisplayImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
          />

          {/* Editorial Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            <span className="px-3 py-1 rounded-full bg-black/80 text-white text-[11px] font-black uppercase tracking-wider backdrop-blur-md border border-white/20">
              Lookbook 2026 // {product.category}
            </span>
            {product.badge && (
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                {product.badge}
              </span>
            )}
          </div>

          {/* Quick Flip Button */}
          {hasBackView && (
            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className={`w-3.5 h-3.5 transition-transform ${isFlipped ? "rotate-180" : ""}`} />
              <span>{isFlipped ? "Show Front View" : "Show Reverse Angle"}</span>
            </button>
          )}

          {/* Admin Delete */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => onDeletePrompt(product)}
              className="absolute top-4 right-4 p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white border border-red-700 shadow-md cursor-pointer group"
              title="Admin: Permanently delete product"
            >
              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>

        {/* Right: Technical Atelier Specifications & Direct Buy Form */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            {/* Header: Rating & Product Code */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating || "4.9"}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount || 24} reviews)</span>
              </div>
              <span className="font-mono text-slate-400 text-[11px]">ID: {product.id}</span>
            </div>

            {/* Title */}
            <div>
              <h3 
                onClick={() => onOpenDetail(product)}
                className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 hover:text-red-600 transition-colors cursor-pointer"
              >
                {product.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Price Tag */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-slate-950 font-mono">
                ₦{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-slate-400 line-through font-mono">
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-black text-red-600 uppercase">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Fabric & Engineering Highlights */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Material Composition
                </span>
                <span className="font-semibold text-slate-800 text-[11px] block mt-0.5">
                  {product.fabric || "88% Aeromesh Polyester, 12% Spandex"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Cut & Silhouette
                </span>
                <span className="font-semibold text-slate-800 text-[11px] block mt-0.5">
                  {product.fitType || "Athletic Tapered // V-Taper"}
                </span>
              </div>
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Selected Color:
                  </span>
                  <span className="font-bold text-slate-900">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                        selectedColor === c.name
                          ? "border-red-600 bg-red-50 text-red-700 shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Select Athlete Size:
                </span>
                <span className="text-[11px] text-slate-400">Fits true to size</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`w-11 h-9 rounded-xl text-xs font-black uppercase transition-all cursor-pointer flex items-center justify-center ${
                      selectedSize === s
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isAddedRecently
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
              }`}
            >
              {isAddedRecently ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onBuyNow(product, selectedSize, selectedColor)}
              className="flex-1 py-3 px-4 rounded-xl bg-[#E53935] hover:bg-[#C62828] text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Instant Buy Now</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenDetail(product)}
              className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Full Product Page"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
