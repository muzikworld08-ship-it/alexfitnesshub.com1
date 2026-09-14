import React, { useState } from "react";
import { ShoppingBag, Zap, Trash2, Check, Eye, Star } from "lucide-react";
import { Product } from "../../types";

interface StoreCompactRowProps {
  product: Product;
  isAdmin: boolean;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onBuyNow: (product: Product, size: string, color: string) => void;
  onDeletePrompt: (product: Product) => void;
}

export const StoreCompactRow: React.FC<StoreCompactRowProps> = ({
  product,
  isAdmin,
  onOpenDetail,
  onAddToCart,
  onBuyNow,
  onDeletePrompt
}) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].name : "Standard"
  );
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 hover:border-slate-300 hover:shadow-md transition-all flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      
      {/* Thumbnail + Basic Info */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div 
          onClick={() => onOpenDetail(product)}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 cursor-pointer border border-slate-200"
        >
          <img
            src={product.frontImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover hover:scale-110 transition-transform"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {product.category}
            </span>
            {product.badge && (
              <span className="px-2 py-0.2 rounded-full bg-red-50 text-red-600 text-[9px] font-black uppercase">
                {product.badge}
              </span>
            )}
          </div>

          <h4 
            onClick={() => onOpenDetail(product)}
            className="text-sm font-black text-slate-900 truncate hover:text-red-600 transition-colors cursor-pointer"
          >
            {product.name}
          </h4>

          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono font-black text-sm text-slate-950">
              ₦{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-mono text-xs text-slate-400 line-through">
                ₦{product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-[11px] text-slate-400 font-medium">
              &bull; Stock: {product.stock}
            </span>
          </div>
        </div>
      </div>

      {/* Selectors: Color, Size & Actions */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
        
        {/* Color dropdown if multiple */}
        {product.colors && product.colors.length > 1 && (
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="text-xs font-semibold bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200"
          >
            {product.colors.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        )}

        {/* Size dropdown */}
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="text-xs font-bold bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200"
        >
          {product.sizes.map(sz => (
            <option key={sz} value={sz}>{sz}</option>
          ))}
        </select>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAdd}
          className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 ${
            isAdded
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </>
          )}
        </button>

        {/* Buy Now */}
        <button
          type="button"
          onClick={() => onBuyNow(product, selectedSize, selectedColor)}
          className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Buy</span>
        </button>

        {/* Detail Button */}
        <button
          type="button"
          onClick={() => onOpenDetail(product)}
          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Inspect Details"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Admin Delete */}
        {isAdmin && (
          <button
            type="button"
            onClick={() => onDeletePrompt(product)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Admin: Permanently Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

      </div>

    </div>
  );
};
