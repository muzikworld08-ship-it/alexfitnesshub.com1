import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ShoppingBag, ArrowRight, X } from "lucide-react";
import { useStore } from "../../context/StoreContext";

export const CartAddedToast: React.FC = () => {
  const { 
    lastAddedItem, 
    clearLastAddedItem, 
    setIsCartOpen, 
    setIsCheckoutOpen,
    cartCount,
    cartSubtotal 
  } = useStore();

  if (!lastAddedItem) return null;

  const { product, size, color, quantity } = lastAddedItem;
  const colorObj = product.colors.find(c => c.name === color) || product.colors[0];
  const itemImage = colorObj?.image || product.frontImage || product.images?.[0] || "";

  const handleOpenCart = () => {
    clearLastAddedItem();
    setIsCartOpen(true);
  };

  const handleProceedCheckout = () => {
    clearLastAddedItem();
    setIsCheckoutOpen(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="cart-added-toast"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-5 right-4 left-4 sm:left-auto sm:right-6 sm:w-[400px] z-50 pointer-events-auto"
        role="status"
        aria-live="polite"
      >
        <div className="bg-slate-950 text-white rounded-2xl p-4 shadow-2xl border border-white/15 relative overflow-hidden">
          {/* Subtle Accent Edge */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#E53935] via-emerald-500 to-[#E53935]" />

          {/* Close Button */}
          <button
            type="button"
            onClick={clearLastAddedItem}
            className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Status */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Added to Cart
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-slate-400 text-xs font-medium">
              Cart has {cartCount} {cartCount === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Product Thumbnail & Details */}
          <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5 mb-3.5">
            <div className="w-14 h-14 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
              {itemImage ? (
                <img
                  src={itemImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <ShoppingBag className="w-6 h-6 text-slate-600" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-4">
              <h4 className="text-xs font-bold text-white truncate leading-tight">
                {product.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-white/10 text-slate-200">
                  Size: {size}
                </span>
                {color && (
                  <span className="flex items-center gap-1 text-[10px] text-slate-300 font-medium">
                    <span 
                      className="w-2 h-2 rounded-full border border-white/20" 
                      style={{ backgroundColor: colorObj?.hex || "#fff" }} 
                    />
                    {color}
                  </span>
                )}
                {quantity > 1 && (
                  <span className="text-[10px] text-slate-400 font-bold">
                    Qty: {quantity}
                  </span>
                )}
              </div>
              <div className="text-xs font-black text-[#E53935] mt-1">
                ₦{product.price.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleOpenCart}
              className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/10"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-slate-300" />
              <span>View Cart ({cartCount})</span>
            </button>

            <button
              type="button"
              onClick={handleProceedCheckout}
              className="w-full py-2.5 px-3 rounded-xl bg-[#E53935] hover:bg-[#C62828] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-red-900/30"
            >
              <span>Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
