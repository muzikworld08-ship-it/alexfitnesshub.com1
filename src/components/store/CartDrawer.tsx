import React, { useState } from "react";
import { 
  X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, 
  Tag, Check, Truck, ArrowLeft
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { useApp } from "../../context/AppContext";

export const CartDrawer: React.FC = () => {
  const { setView } = useApp();
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    setIsCheckoutOpen,
    removeFromCart, 
    updateQuantity, 
    clearCart,
    cartSubtotal,
    cartCount,
    shippingFee,
    freeShippingThreshold,
    appliedPromoCode,
    discountAmount,
    applyPromoCode,
    removePromoCode,
    orderTotal
  } = useStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMsg({ text: res.message, isError: !res.success });
    if (res.success) {
      setPromoInput("");
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop - Solid Clean Normal Backdrop, No Blur */}
      <div 
        className="fixed inset-0 bg-black/60 transition-opacity cursor-pointer"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-50 text-red-600">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">Your Shopping Bag</h2>
                <p className="text-xs text-slate-500 font-medium">{cartCount} {cartCount === 1 ? "item" : "items"}</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-red-50/60 border-b border-red-100/80">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
              <span className="text-slate-800 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-red-600" />
                {amountNeededForFreeShipping > 0 ? (
                  <span>Add <strong className="text-red-600 font-mono">₦{amountNeededForFreeShipping.toLocaleString()}</strong> for <strong>FREE Delivery</strong></span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    You unlocked FREE Express Delivery!
                  </span>
                )}
              </span>
              <span className="text-[11px] font-mono text-slate-500">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-red-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-600 transition-all duration-300 rounded-full" 
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Your bag is empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Explore our high-performance fitness apparel, pump covers, and official ALEXFITNESSHUB collections.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setView("store");
                  }}
                  className="mt-2 px-5 py-2.5 bg-[#E53935] hover:bg-[#C62828] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-red-500/20 flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Start Shopping</span>
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  {/* Item Image */}
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-black text-slate-900 line-clamp-1 leading-snug">
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1 -mr-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Specs pills */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          Size: {item.size}
                        </span>
                        <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                          {item.colorHex && (
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" 
                              style={{ backgroundColor: item.colorHex }} 
                            />
                          )}
                          {item.color}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-slate-600 hover:text-slate-900 font-bold text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-black text-slate-900 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="px-2 py-0.5 text-slate-600 hover:text-slate-900 font-bold text-xs disabled:opacity-30 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Price */}
                      <span className="text-xs font-black text-slate-900 font-mono">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/70 space-y-4">
              
              {/* Promo code input */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                {appliedPromoCode ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      Promo \"{appliedPromoCode}\" Applied (-₦{discountAmount.toLocaleString()})
                    </span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-red-600 hover:text-red-700 font-bold text-[11px] underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Discount code (e.g. ALEXFIT10)"
                        className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoMsg && (
                  <p className={`text-[11px] font-medium ${promoMsg.isError ? "text-red-600" : "text-emerald-600"}`}>
                    {promoMsg.text}
                  </p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900 font-mono">₦{cartSubtotal.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span className="font-mono">-₦{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-bold font-mono">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 uppercase font-bold text-[11px]">FREE</span>
                    ) : (
                      `₦${shippingFee.toLocaleString()}`
                    )}
                  </span>
                </div>

                <div className="h-px bg-slate-200 pt-1" />

                <div className="flex justify-between text-sm font-black text-slate-900 pt-1">
                  <span>Total Due</span>
                  <span className="font-mono text-base text-red-600">₦{orderTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#E53935] hover:bg-[#C62828] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Encrypted Paystack Checkout
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    Clear Bag
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
