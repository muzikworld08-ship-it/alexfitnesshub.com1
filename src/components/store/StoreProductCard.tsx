import React, { useState, memo } from "react";
import { 
  RotateCcw, Eye, ShoppingBag, Zap, Star, ShieldCheck, 
  Trash2, Check, Flame, Award
} from "lucide-react";
import { Product } from "../../types";

interface StoreProductCardProps {
  product: Product;
  isAdmin: boolean;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onBuyNow: (product: Product, size: string, color: string) => void;
  onDeletePrompt: (product: Product) => void;
}

export const StoreProductCard: React.FC<StoreProductCardProps> = memo(({
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

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize, selectedColor);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1800);
  };

  const handleBuyNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow(product, selectedSize, selectedColor);
  };

  const handleFlipToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div 
      className="group relative bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Product Image Stage */}
      <div 
        className="relative aspect-4/5 bg-slate-100 overflow-hidden cursor-pointer select-none"
        onClick={() => onOpenDetail(product)}
      >
        <img
          src={currentDisplayImage}
          alt={product.name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#E53935] text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
          {product.stock <= 5 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Flame className="w-3 h-3 fill-current" />
              Only {product.stock} Left
            </span>
          )}
        </div>

        {/* Action Buttons Overlay (Flip View, Quick View, Admin Delete) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          {/* Flip Front/Back Button */}
          {hasBackView && (
            <button
              type="button"
              onClick={handleFlipToggle}
              className={`p-2 rounded-xl border backdrop-blur-sm transition-all cursor-pointer shadow-sm ${
                isFlipped
                  ? "bg-slate-900 text-white border-slate-700"
                  : "bg-white/90 hover:bg-white text-slate-700 border-slate-200"
              }`}
              title={isFlipped ? "Show Front View" : "Show Back View"}
            >
              <RotateCcw className={`w-3.5 h-3.5 transition-transform ${isFlipped ? "rotate-180" : ""}`} />
            </button>
          )}

          {/* Quick View Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(product);
            }}
            className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 border border-slate-200 backdrop-blur-sm transition-all cursor-pointer shadow-sm"
            title="Inspect Details & Specifications"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Admin Permanent Delete Button */}
          {isAdmin && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeletePrompt(product);
              }}
              className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white border border-red-700 transition-all cursor-pointer shadow-sm group/del"
              title="Admin: Permanently delete this product from catalog"
            >
              <Trash2 className="w-3.5 h-3.5 group-hover/del:scale-110 transition-transform" />
            </button>
          )}
        </div>

        {/* View indicator badge */}
        {hasBackView && (
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/70 text-white text-[9px] font-mono font-bold backdrop-blur-xs">
            {isFlipped ? "Back" : "Front"}
          </div>
        )}
      </div>

      {/* Product Information Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating & Category */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating || "4.9"}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount || 18})</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onOpenDetail(product)}
            className="font-black text-sm sm:text-base text-slate-900 line-clamp-1 group-hover:text-[#E53935] transition-colors cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price Strip */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base sm:text-lg font-black text-slate-950 font-mono">
              ₦{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through font-mono">
                ₦{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Color:
              </span>
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(c.name);
                  }}
                  className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                    selectedColor === c.name
                      ? "ring-2 ring-red-500 ring-offset-1 scale-110 border-white"
                      : "border-slate-300 hover:scale-105"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              <span className="text-[10px] font-semibold text-slate-600 ml-1">
                {selectedColor}
              </span>
            </div>
          )}

          {/* Size Selector Chips */}
          <div className="mt-2.5 flex items-center gap-1 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Size:
            </span>
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(s);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase transition-all cursor-pointer ${
                  selectedSize === s
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Card Purchase Actions */}
        <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleAddToCartClick}
            className={`py-2 px-2.5 rounded-xl font-black text-xs uppercase tracking-wider border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              isAddedRecently
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
            }`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleBuyNowClick}
            className="py-2 px-2.5 rounded-xl bg-[#E53935] hover:bg-[#C62828] text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>

      </div>
    </div>
  );
});

StoreProductCard.displayName = "StoreProductCard";
