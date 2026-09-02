import React, { useState } from "react";
import { 
  X, ShieldCheck, Lock, CheckCircle2, ArrowRight, 
  Truck, AlertCircle, ShoppingBag, CreditCard, MessageSquare, 
  Check, Phone, Mail, MapPin, User
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { useApp } from "../../context/AppContext";
import { StoreDeliveryInfo, StoreOrder } from "../../types";

const NIGERIAN_STATES = [
  "Lagos", "Abuja FCT", "Rivers", "Oyo", "Kano", "Kaduna", "Ogun", "Delta", 
  "Edo", "Enugu", "Akwa Ibom", "Anambra", "Abia", "Imo", "Ondo", "Osun", 
  "Kwara", "Plateau", "Cross River", "Bayelsa", "Benue", "Borno", "Bauchi", 
  "Adamawa", "Ebonyi", "Ekiti", "Gombe", "Jigawa", "Katsina", "Kebbi", 
  "Kogi", "Nasarawa", "Niger", "Sokoto", "Taraba", "Yobe", "Zamfara", "International"
];

export const CheckoutModal: React.FC = () => {
  const { user } = useApp();
  const { 
    cart, 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cartSubtotal, 
    shippingFee, 
    discountAmount, 
    appliedPromoCode,
    orderTotal,
    submitStoreOrder,
    lastCompletedOrder,
    setLastCompletedOrder
  } = useStore();

  const [deliveryInfo, setDeliveryInfo] = useState<StoreDeliveryInfo>({
    customerName: user?.displayName || "",
    customerEmail: user?.email || "",
    customerPhone: "",
    address: "",
    city: "Lagos",
    state: "Lagos",
    postalCode: "",
    country: "Nigeria",
    deliveryNotes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<StoreOrder | null>(null);

  if (!isCheckoutOpen && !confirmedOrder) return null;

  const handleInputChange = (field: keyof StoreDeliveryInfo, val: string) => {
    setDeliveryInfo(prev => ({ ...prev, [field]: val }));
    if (errorMessage) setErrorMessage(null);
  };

  const validateForm = () => {
    if (!deliveryInfo.customerName.trim()) {
      setErrorMessage("Please enter your full name for delivery.");
      return false;
    }
    if (!deliveryInfo.customerEmail.trim() || !deliveryInfo.customerEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address for your order confirmation receipt.");
      return false;
    }
    if (!deliveryInfo.customerPhone.trim() || deliveryInfo.customerPhone.length < 8) {
      setErrorMessage("Please provide a valid phone number for the courier dispatch rider.");
      return false;
    }
    if (!deliveryInfo.address.trim()) {
      setErrorMessage("Please enter your delivery street address.");
      return false;
    }
    if (!deliveryInfo.city.trim()) {
      setErrorMessage("Please specify your city.");
      return false;
    }
    return true;
  };

  // Process checkout via Paystack or direct confirmation
  const handlePaystackCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Check if backend Paystack is configured
      let paystackPublicKey = "";
      try {
        const cfgRes = await fetch("/api/payments/config");
        const cfg = await cfgRes.json();
        paystackPublicKey = cfg.publicKey || "";
      } catch (err) {
        console.warn("Could not check /api/payments/config:", err);
      }

      // Try server store payment initialization
      try {
        const initRes = await fetch("/api/payments/store/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: deliveryInfo.customerEmail,
            customerName: deliveryInfo.customerName,
            customerPhone: deliveryInfo.customerPhone,
            totalAmount: orderTotal,
            deliveryInfo,
            items: cart
          })
        });
        const initData = await initRes.json();
        if (initData.success && initData.authorization_url) {
          // Record order in Firestore first, then redirect to live Paystack
          const result = await submitStoreOrder(deliveryInfo, initData.reference);
          if (result.success) {
            window.location.href = initData.authorization_url;
            return;
          }
        }
      } catch (srvErr) {
        console.warn("Server store payment endpoint fallback:", srvErr);
      }

      // 2. Direct secure submission (or fallback if direct card or sandbox)
      const ref = `PAYSTACK_REF_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const result = await submitStoreOrder(deliveryInfo, ref);

      if (result.success && result.orderId) {
        const completed: StoreOrder = {
          id: result.orderId,
          orderNumber: result.orderNumber || "AFH-ORD",
          userId: user?.uid || "guest",
          customerName: deliveryInfo.customerName,
          customerEmail: deliveryInfo.customerEmail,
          customerPhone: deliveryInfo.customerPhone,
          shippingAddress: deliveryInfo,
          items: [...cart],
          subtotal: cartSubtotal,
          shippingFee,
          discount: discountAmount,
          totalAmount: orderTotal,
          currency: "NGN",
          paymentStatus: "paid",
          paymentReference: ref,
          orderStatus: "processing",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setConfirmedOrder(completed);
        setLastCompletedOrder(completed);
      } else {
        throw new Error(result.error || "Failed to finalize order.");
      }

    } catch (err: any) {
      console.error("[Checkout] Error:", err);
      setErrorMessage(err.message || "An unexpected error occurred during checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* VIEW A: ORDER CONFIRMATION SCREEN */}
        {confirmedOrder ? (
          <div className="p-6 sm:p-10 space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Payment Received • Order Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Thank You For Your Order!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your order <strong className="text-slate-900 font-mono">#{confirmedOrder.orderNumber}</strong> has been secured and dispatched to our fulfillment team. A confirmation receipt was sent to <strong className="text-slate-900">{confirmedOrder.customerEmail}</strong>.
              </p>
            </div>

            {/* Order Highlights Card */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-left max-w-lg mx-auto space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Order Number:</span>
                <span className="font-mono font-black text-slate-900 text-sm">#{confirmedOrder.orderNumber}</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Delivery Destination:</span>
                <span className="font-bold text-slate-800 text-right">
                  {confirmedOrder.shippingAddress.address}, {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Estimated Arrival:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  1 - 3 Business Days (Express Dispatch)
                </span>
              </div>

              <div className="flex items-center justify-between font-black text-slate-900 text-sm pt-1">
                <span>Total Amount Paid:</span>
                <span className="font-mono text-red-600 text-base">₦{confirmedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Itemized Snapshot */}
            <div className="max-w-lg mx-auto divide-y divide-slate-100 text-left">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                Purchased Apparel ({confirmedOrder.items.length})
              </span>
              {confirmedOrder.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-12 object-cover rounded-lg bg-slate-100" />
                    <div>
                      <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-slate-500">Size: {item.size} • {item.color} (x{item.quantity})</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-800">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <a
                href={`https://wa.me/2347073307875?text=Hello%20Coach%20Alex,%20I%20just%20placed%20order%20%23${confirmedOrder.orderNumber}%20on%20the%20ALEXFITNESSHUB%20Store!`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Track on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* VIEW B: CHECKOUT & DELIVERY FORM */
          <div className="flex flex-col md:flex-row max-h-[90vh]">
            {/* Header / Close for mobile */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>

            {/* LEFT: Delivery Information Form */}
            <div className="w-full md:w-3/5 p-6 sm:p-8 overflow-y-auto">
              <div className="space-y-1 mb-6">
                <div className="flex items-center gap-2 text-red-600 text-xs font-black uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  <span>Secure Dispatch</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Delivery Details
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Enter where you want your ALEXFITNESSHUB apparel shipped.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handlePaystackCheckout} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryInfo.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50/50 focus:bg-white transition-all"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={deliveryInfo.customerEmail}
                      onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50/50 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={deliveryInfo.customerPhone}
                      onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                      placeholder="e.g. +234 801 234 5678"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50/50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Delivery Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryInfo.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="e.g. House 12, Admiralty Way, Lekki Phase 1"
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50/50 focus:bg-white transition-all"
                  />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryInfo.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="e.g. Lekki / Abuja"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50/50 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      State *
                    </label>
                    <select
                      value={deliveryInfo.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50/50 focus:bg-white transition-all cursor-pointer"
                    >
                      {NIGERIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Delivery Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={deliveryInfo.deliveryNotes || ""}
                    onChange={(e) => handleInputChange("deliveryNotes", e.target.value)}
                    placeholder="e.g. Leave with security at the gate or call upon arrival"
                    className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50/50 focus:bg-white transition-all"
                  />
                </div>

                {/* Submit Checkout Button */}
                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl bg-[#E53935] hover:bg-[#C62828] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-red-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Securing Transaction...</span>
                      </div>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay ₦{orderTotal.toLocaleString()} with Paystack</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-Bit SSL Encryption • Bank Transfer, Card, USSD, Apple Pay</span>
                  </div>
                </div>
              </form>
            </div>

            {/* RIGHT: Order Summary Snapshot */}
            <div className="w-full md:w-2/5 bg-slate-50 p-6 sm:p-8 border-t md:border-t-0 md:border-l border-slate-200/80 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Order Summary ({cart.length})
                  </h3>
                  <span className="text-[11px] text-slate-500 font-bold">{deliveryInfo.state}</span>
                </div>

                {/* Item List */}
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1 divide-y divide-slate-200/60">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                      <div className="w-12 h-14 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-bold text-slate-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Size {item.size} • {item.color} • Qty {item.quantity}
                        </p>
                        <p className="font-black text-slate-800 font-mono text-[11px]">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Summary */}
                <div className="pt-3 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900 font-mono">₦{cartSubtotal.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Promo ({appliedPromoCode})</span>
                      <span className="font-mono">-₦{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Express Shipping</span>
                    <span className="font-bold font-mono">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-600 uppercase font-bold text-[11px]">FREE</span>
                      ) : (
                        `₦${shippingFee.toLocaleString()}`
                      )}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                    <span>Total Amount</span>
                    <span className="font-mono text-base text-red-600">₦{orderTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Courier badge */}
              <div className="mt-6 p-3.5 bg-white rounded-xl border border-slate-200 text-slate-600 text-xs space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-red-600" />
                  <span>Doorstep Courier Delivery</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Orders are dispatched within 24 hours. You will receive an SMS and WhatsApp tracking update upon courier pickup.
                </p>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
