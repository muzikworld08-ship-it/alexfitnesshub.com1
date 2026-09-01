import React, { useState, useEffect } from "react";
import { 
  Shield, CheckCircle, ArrowRight, Zap, Crown, 
  Clock, X, Lock, Sparkles, HelpCircle, ChevronDown, ChevronUp, AlertCircle
} from "lucide-react";
import { motion } from "motion/react";
import { useApp, checkIsUserPremium } from "../context/AppContext";

interface PricingViewProps {
  setView: (view: string) => void;
  onOpenAuth: () => void;
}

export default function PricingView({ setView, onOpenAuth }: PricingViewProps) {
  const { user } = useApp();
  const isPremium = checkIsUserPremium(user);

  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "volume" | "annual">("volume");
  const [selectedMonths, setSelectedMonths] = useState(3);
  const [submittingPlan, setSubmittingPlan] = useState<string | null>(null);
  const [activePaymentModal, setActivePaymentModal] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [upgradeReason, setUpgradeReason] = useState<string | null>(() => {
    return typeof window !== "undefined" ? localStorage.getItem("fit_upgrade_reason") : null;
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const reason = localStorage.getItem("fit_upgrade_reason");
    if (reason) {
      setUpgradeReason(reason);
    }
  }, []);

  useEffect(() => {
    if (activePaymentModal) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [activePaymentModal]);

  const handleInitiatePayment = async (plan: "monthly" | "yearly" | "multi", customMonths?: number) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    
    setCheckoutError(null);
    setActivePaymentModal(plan);
    setSubmittingPlan(plan);

    const activeMonths = customMonths || (plan === "multi" ? selectedMonths : undefined);

    try {
      // 1. Fetch active Paystack Public Key configuration
      const configRes = await fetch("/api/payments/config");
      const configData = await configRes.json();
      const publicKey = configData.publicKey || import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";
      
      if (!publicKey) {
        throw new Error("Paystack Public Key is not configured in backend or environment.");
      }

      // 2. Initialize checkout session on our server
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          email: user.email,
          userId: user.uid,
          months: activeMonths
        })
      });
      const data = await res.json();
      if (!data.success || !data.authorization_url) {
        throw new Error(data.error || "Unable to initialize secure transaction with Paystack.");
      }

      // 3. Directly redirect user to Paystack secure payment page
      console.log(`[Redirect Flow] Redirecting user ${user.uid} to secure Paystack payment URL: ${data.authorization_url}`);
      window.location.href = data.authorization_url;

    } catch (err: any) {
      console.error("Error initiating checkout:", err);
      setCheckoutError(err.message || "Failed to initialize secure checkout. Please try again or contact support.");
      setSubmittingPlan(null);
    }
  };

  const getDueTodayAmount = () => {
    if (selectedPlan === "monthly") return "₦19,999";
    if (selectedPlan === "annual") return "₦215,989";
    if (selectedMonths === 2) return "₦35,999";
    if (selectedMonths === 3) return "₦49,999";
    if (selectedMonths === 4) return "₦63,999";
    if (selectedMonths === 5) return "₦77,999";
    if (selectedMonths === 6) return "₦89,999";
    return "₦49,999";
  };

  const getSubtotalAmount = () => {
    if (selectedPlan === "monthly") return "₦19,999";
    if (selectedPlan === "annual") return "₦239,988";
    return `₦${(19999 * selectedMonths).toLocaleString()}`;
  };

  const getDiscountAmount = () => {
    if (selectedPlan === "monthly") return "₦0";
    if (selectedPlan === "annual") return "-₦23,999 (10% Off)";
    if (selectedMonths === 2) return "-₦3,999 (10% Off)";
    if (selectedMonths === 3) return "-₦9,998 (17% Off)";
    if (selectedMonths === 4) return "-₦15,997 (20% Off)";
    if (selectedMonths === 5) return "-₦21,996 (22% Off)";
    if (selectedMonths === 6) return "-₦29,995 (25% Off)";
    return "₦0";
  };

  const faqsList = [
    {
      q: "What is the difference between Free and Premium memberships?",
      a: "Free members have access to basic bodyweight movements and sample routines. Premium members unlock our full 1,200+ scientific exercise library with 0.5x Slow-Motion kinetic breakdowns, 3s eccentric tempo coaching, AI kinesiology calibrations, 90-Day Transformation Challenges, and personalized macronutrient matrices."
    },
    {
      q: "How does the flexible multi-month volume discount work?",
      a: "You choose your exact commitment from 2 to 6 months upfront. The longer the duration, the greater the compounding discount (up to 25% off the standard monthly rate), with zero hidden recurring fees or cancellation lock-ins."
    },
    {
      q: "Is Paystack payment secure and encrypted?",
      a: "Yes. All transactions are routed directly through Paystack with bank-grade 256-bit SSL encryption. We never store or view your debit/credit card or banking credentials."
    },
    {
      q: "Can I renew or upgrade my plan before it expires?",
      a: "Yes! If you are already a member, renewing or purchasing another tier adds the new duration directly on top of your existing expiration date without losing any active days."
    },
    {
      q: "What is your 14-day refund guarantee?",
      a: "If you join AlexFitnessHub Premium and feel the kinesiology guides, nutritional systems, or AI calibrations haven't significantly elevated your workouts, contact us within 14 days for a prompt, hassle-free reimbursement."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-mono font-black uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5 text-red-400" />
            <span>MEMBERSHIP TIERS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight uppercase text-white">
            CHOOSE YOUR <span className="text-[#E53935]">TRAINING TIER</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
            Unlock the entire AlexFitnessHub ecosystem with premium slow-mo kinesiologist guides, macro calculations, and unlimited AI Coach calibrations.
          </p>

          {/* Active Subscription Status Callout if User is Already Premium */}
          {isPremium && user && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 max-w-lg mx-auto flex items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-black">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-emerald-400">
                    Active Premium Athlete
                  </h4>
                  <p className="text-[11px] text-slate-300 font-sans">
                    Expires: {user.subscriptionExpiry ? new Date(user.subscriptionExpiry).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Active Unlimited"}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg">
                Tier Verified
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Pricing Matrix Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Dynamic Upgrade Reason Callout Banner for redirected users */}
        {upgradeReason && !isPremium && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-xl flex items-center justify-between gap-4 max-w-2xl mx-auto border border-red-400">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-white/20 text-white shrink-0 shadow-inner">
                <Crown className="w-5 h-5 text-amber-300" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight truncate">
                  Upgrade to Unlock {upgradeReason}
                </h4>
                <p className="text-[11px] sm:text-xs text-red-100 mt-0.5">
                  Exclusive premium training program. Select a plan below to activate instant full access!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("fit_upgrade_reason");
                setUpgradeReason(null);
              }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-white transition-colors shrink-0 cursor-pointer"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Plan Category Quick Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto mb-10 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-md">
          <button
            onClick={() => setSelectedPlan("monthly")}
            className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-xl text-xs font-sans font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              selectedPlan === "monthly"
                ? "bg-[#D32F2F] text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            Monthly Starter
          </button>
          <button
            onClick={() => setSelectedPlan("volume")}
            className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-xl text-xs font-sans font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              selectedPlan === "volume"
                ? "bg-[#D32F2F] text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            2-6 Mo. Volume Selection
          </button>
          <button
            onClick={() => setSelectedPlan("annual")}
            className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-xl text-xs font-sans font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              selectedPlan === "annual"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            VIP Elite Club (Annual)
          </button>
        </div>

        {/* 3-Tier Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto mb-12">
          
          {/* TIER 1: MONTHLY */}
          <motion.div 
            whileHover={{ y: -4 }}
            onClick={() => setSelectedPlan("monthly")}
            className={`p-6 sm:p-8 rounded-3xl bg-white border flex flex-col justify-between cursor-pointer transition-all duration-300 relative shadow-sm ${
              selectedPlan === "monthly" 
                ? "border-2 border-[#D32F2F] ring-4 ring-red-500/10 shadow-xl" 
                : "border-slate-200 hover:border-slate-400"
            }`}
          >
            <div className="text-left">
              <span className="text-[9px] font-sans font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                MONTHLY STARTER
              </span>
              <div className="mt-4">
                <span className="text-3xl font-display font-black text-slate-900">₦19,999</span>
                <span className="text-slate-500 text-[10px] ml-1">/ 1 Month</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-3 leading-relaxed font-sans font-medium">
                Full 1-month Premium Athlete access with unhindered workouts, slow-mo guides, and AI coaching.
              </p>
              <div className="mt-5 border-t border-slate-100 pt-4 space-y-2.5 text-[11px] text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#D32F2F] shrink-0" />
                  Complete 1,200+ Exercise Library
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#D32F2F] shrink-0" />
                  Interactive Calorie Calibrator
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#D32F2F] shrink-0" />
                  HD Slow-Mo Biomechanics & Eccentrics
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#D32F2F] shrink-0" />
                  Unlimited AI Coach Calibrations
                </div>
              </div>
            </div>
            <div className="mt-6">
              <span className={`w-full block py-2.5 text-center font-sans font-bold text-xs uppercase rounded-xl transition-all duration-200 ${
                selectedPlan === "monthly"
                  ? "bg-[#D32F2F] text-white shadow-sm"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200"
              }`}>
                {selectedPlan === "monthly" ? "Selected Plan ✓" : "Select Monthly"}
              </span>
            </div>
          </motion.div>

          {/* TIER 2: VOLUME SELECTION (2 - 6 Months) */}
          <motion.div 
            whileHover={{ y: -4 }}
            onClick={() => setSelectedPlan("volume")}
            className={`p-6 sm:p-8 rounded-3xl bg-white border flex flex-col justify-between cursor-pointer transition-all duration-300 relative shadow-sm ${
              selectedPlan === "volume" 
                ? "border-2 border-[#D32F2F] ring-4 ring-red-500/10 shadow-xl" 
                : "border-slate-200 hover:border-slate-400"
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D32F2F] text-white text-[8px] font-sans font-black uppercase tracking-wider px-3 py-1 rounded-full z-10 shadow-sm">
              POPULAR VOLUME CHOICE
            </div>
            <div className="text-left">
              <span className="text-[9px] font-sans font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-[#D32F2F]">
                FLEXIBLE VOLUME
              </span>
              
              {/* Dynamic Price Display */}
              <div className="mt-4">
                <span className="text-3xl font-display font-black text-slate-900">
                  {selectedMonths === 2 && "₦35,999"}
                  {selectedMonths === 3 && "₦49,999"}
                  {selectedMonths === 4 && "₦63,999"}
                  {selectedMonths === 5 && "₦77,999"}
                  {selectedMonths === 6 && "₦89,999"}
                </span>
                <span className="text-slate-500 text-[10px] ml-1">/ {selectedMonths} Months</span>
                
                {/* Saving Badge */}
                <div className="mt-1">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-mono font-bold px-2 py-0.5 rounded inline-block">
                    {selectedMonths === 2 && "Save ₦3,999 (10% Off)"}
                    {selectedMonths === 3 && "Save ₦9,998 (17% Off)"}
                    {selectedMonths === 4 && "Save ₦15,997 (20% Off)"}
                    {selectedMonths === 5 && "Save ₦21,996 (22% Off)"}
                    {selectedMonths === 6 && "Save ₦29,995 (25% Off)"}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 mt-3 leading-relaxed font-sans font-medium">
                Unlock dynamic, high-volume duration plans with compounding package savings to match your exact transformation goal.
              </p>

              {/* Interactive Dynamic Controls */}
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-3">
                <span className="text-[9px] font-sans font-extrabold text-slate-500 uppercase block tracking-wider text-center">
                  SELECT COMMITMENT DURATION
                </span>
                
                {/* Row of Buttons */}
                <div className="grid grid-cols-5 gap-1.5">
                  {[2, 3, 4, 5, 6].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMonths(m);
                        setSelectedPlan("volume");
                      }}
                      className={`py-2 rounded-xl text-xs font-sans font-black transition-all cursor-pointer ${
                        selectedMonths === m && selectedPlan === "volume"
                          ? "bg-[#D32F2F] text-white shadow-sm scale-105"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {m}M
                    </button>
                  ))}
                </div>

                {/* Range Slider */}
                <div className="pt-1.5">
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={selectedMonths}
                    onChange={(e) => {
                      setSelectedMonths(parseInt(e.target.value));
                      setSelectedPlan("volume");
                    }}
                    className="w-full accent-[#D32F2F] cursor-pointer bg-slate-200 h-1.5 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[8px] font-mono font-bold text-slate-400 mt-1">
                    <span>2 MO</span>
                    <span>3 MO</span>
                    <span>4 MO</span>
                    <span>5 MO</span>
                    <span>6 MO</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4 space-y-2.5 text-[11px] text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#D32F2F] shrink-0" />
                  All 8 Flagship Structured Programs
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#D32F2F] shrink-0" />
                  Interactive Calorie & Macro Matrix
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#D32F2F] shrink-0" />
                  HD slow-mo guides & 3s Eccentric coaching
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#D32F2F] shrink-0" />
                  Full Biometrics Tracking & Progress Reports
                </div>
              </div>
            </div>
            <div className="mt-6">
              <span className={`w-full block py-2.5 text-center font-sans font-bold text-xs uppercase rounded-xl transition-all duration-200 ${
                selectedPlan === "volume"
                  ? "bg-[#D32F2F] text-white shadow-sm"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200"
              }`}>
                {selectedPlan === "volume" ? "Selected Plan ✓" : "Select Volume Plan"}
              </span>
            </div>
          </motion.div>

          {/* TIER 3: ANNUAL PLAN */}
          <motion.div 
            whileHover={{ y: -4 }}
            onClick={() => setSelectedPlan("annual")}
            className={`p-6 sm:p-8 rounded-3xl bg-white border flex flex-col justify-between cursor-pointer transition-all duration-300 relative shadow-sm ${
              selectedPlan === "annual" 
                ? "border-2 border-amber-500 ring-4 ring-amber-500/10 shadow-xl" 
                : "border-slate-200 hover:border-slate-400"
            }`}
          >
            <div className="absolute -top-3 right-4 bg-amber-500 text-slate-950 text-[8px] font-sans font-black uppercase tracking-wider px-2.5 py-1 rounded-full z-10 shadow-sm">
              MAXIMUM SAVINGS (10% OFF)
            </div>
            <div className="text-left">
              <span className="text-[9px] font-sans font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-extrabold">
                VIP ELITE CLUB
              </span>
              <div className="mt-4">
                <span className="text-3xl font-display font-black text-slate-900">₦215,989</span>
                <span className="text-slate-500 text-[10px] ml-1">/ 12 Months</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-3 leading-relaxed font-sans font-medium">
                Uncapped 365-day premium access for serious athletes establishing permanent high physical performance.
              </p>
              <div className="mt-5 border-t border-slate-100 pt-4 space-y-2.5 text-[11px] text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  Complete 1,200+ Exercise Video Vault
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  All Current & Future Curriculums
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  Unlimited AI Kinesiology Coach Chats
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  VIP Digital Onboarding & Priority Sync
                </div>
              </div>
            </div>
            <div className="mt-6">
              <span className={`w-full block py-2.5 text-center font-sans font-bold text-xs uppercase rounded-xl transition-all duration-200 ${
                selectedPlan === "annual"
                  ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200"
              }`}>
                {selectedPlan === "annual" ? "Selected Plan ✓" : "Select Annual"}
              </span>
            </div>
          </motion.div>

        </div>

        {/* Dynamic Billing Summary & Secure Checkout Panel */}
        <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto mb-16 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl">
          
          {/* Left: Premium Benefits Checklist */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div>
              <h3 className="text-lg font-display font-black text-slate-900 uppercase flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                Premium Elite Athlete Benefits
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-sans">
                Here is why upgrading to premium makes your physical transformation rapid and predictable:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs font-medium text-slate-700">
              <div className="space-y-3">
                <div className="flex gap-2.5 items-start">
                  <Zap className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>1,200+ Guides</strong>: Anatomical, high-contrast, looping video loops.</span>
                </div>
                <div className="flex gap-2.5 items-start">
                  <Zap className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>0.5x Slow-Motion</strong>: Complete biomechanical visual form feedback.</span>
                </div>
                <div className="flex gap-2.5 items-start">
                  <Zap className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>3s Eccentric Coaching</strong>: Maximum muscle fiber tension recruitment.</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2.5 items-start">
                  <Zap className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>AI Nutrition Matrix</strong>: High protein staple foods & macros calibration.</span>
                </div>
                <div className="flex gap-2.5 items-start">
                  <Zap className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Continuous AI Coach</strong>: Direct 24/7 access to live kinesiology advice.</span>
                </div>
                <div className="flex gap-2.5 items-start">
                  <Zap className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Athlete Performance Desk</strong>: Persistent weight trajectory & habit tracking.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Dynamic Billing Summary & Paystack Action */}
          <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 text-left">
            <div>
              <span className="text-[9px] font-mono font-black text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-md uppercase">
                ✓ SECURE SUBSCRIPTION CHECKOUT
              </span>
              <h4 className="text-sm font-sans font-black text-slate-900 uppercase mt-2.5">
                Billing Summary
              </h4>
            </div>

            {/* Dynamic Summary Values */}
            <div className="space-y-2.5 border-b border-slate-200 pb-4 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Selected Plan:</span>
                <span className="text-slate-900 font-extrabold uppercase">
                  {selectedPlan === "monthly" && "Monthly Starter (1 Month)"}
                  {selectedPlan === "volume" && `Volume Selection (${selectedMonths} Months)`}
                  {selectedPlan === "annual" && "VIP Elite Club (12 Months)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal Cost:</span>
                <span className="line-through text-slate-400">
                  {getSubtotalAmount()}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Package Discount:</span>
                <span className="font-bold">
                  {getDiscountAmount()}
                </span>
              </div>
              <div className="flex justify-between text-slate-900 text-sm font-black pt-2 border-t border-dashed border-slate-200">
                <span>DUE TODAY:</span>
                <span className="text-base text-[#D32F2F]">
                  {getDueTodayAmount()}
                </span>
              </div>
            </div>

            {/* Paystack Payment Notice */}
            <div className="flex items-center gap-2.5 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 text-[10px] text-emerald-800 font-medium">
              <Shield className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Billed securely via Paystack. Your details are encrypted with bank-level protocol protections. Premium benefits activate instantly upon completion.</span>
            </div>

            {/* Checkout CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (selectedPlan === "monthly") {
                  handleInitiatePayment("monthly", 1);
                } else if (selectedPlan === "volume") {
                  handleInitiatePayment("multi", selectedMonths);
                } else if (selectedPlan === "annual") {
                  handleInitiatePayment("yearly");
                }
              }}
              disabled={submittingPlan !== null}
              className="w-full py-4 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-sans font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer border-0 disabled:opacity-50"
            >
              {submittingPlan ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>CONTACTING PAYSTACK GATEWAY...</span>
                </span>
              ) : (
                <>
                  <span>ACTIVATE PREMIUM ACCESS NOW</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </motion.button>
            {checkoutError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{checkoutError}</span>
              </div>
            )}
          </div>

        </div>

        {/* Pricing Feature Comparison Grid */}
        <div className="max-w-5xl mx-auto mb-16 space-y-4 text-center">
          <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest block">
            DETAILED PROTOCOL COMPARISON
          </span>
          <h3 className="text-xl sm:text-2xl font-display font-black uppercase text-slate-900">
            FREE ATHLETE VS. PREMIUM ELITE
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white text-slate-800 text-xs text-left">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-sans font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4">FEATURING PROTOCOLS</th>
                  <th className="p-4 text-center">FREE ATHLETE</th>
                  <th className="p-4 text-center text-red-600 font-black">PREMIUM ELITE ATHLETE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="p-4 font-bold">1,200+ Visual Exercise Database</td>
                  <td className="p-4 text-center text-slate-400">Basic Guides Only</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓ Unrestricted Access</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">0.5x Slow-Motion Biomechanics</td>
                  <td className="p-4 text-center text-slate-400">❌ Locked</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓ Complete Loop Playback</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">3s Eccentric & Slow-Negative Guides</td>
                  <td className="p-4 text-center text-slate-400">❌ Locked</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓ All Movements Enabled</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">AI Progressive Nutrient Calibrator</td>
                  <td className="p-4 text-center text-slate-400">Standard Calculator</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓ Daily Micro-Adjustments</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">Uncapped Live AI Coach Chat</td>
                  <td className="p-4 text-center text-slate-400">❌ Locked</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓ Unlimited Calibrations</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">Transformation Progress Dashboard</td>
                  <td className="p-4 text-center text-slate-400">❌ Locked</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓ Persistent Logs & Milestones</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 100% Risk-Free 14-Day Refund Guarantee Callout */}
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white border border-slate-200 text-center flex flex-col items-center shadow-md mb-20">
          <Shield className="w-10 h-10 text-amber-500 mb-3 animate-pulse" />
          <h4 className="text-sm font-sans font-black uppercase tracking-wider text-slate-900">
            100% Risk-Free 14-Day Refund Promise
          </h4>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed font-sans max-w-md">
            Try AlexFitnessHub Premium with total peace of mind. If our workout tracking or AI kinesiology coaching does not upgrade your daily routine, request reimbursement within 14 days for rapid, secure processing.
          </p>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto space-y-4 text-left">
          <div className="text-center space-y-2 mb-8">
            <span className="text-[10px] font-mono font-black uppercase text-[#D32F2F] tracking-widest">
              COMMON INQUIRIES
            </span>
            <h3 className="text-2xl font-display font-black uppercase text-slate-900">
              MEMBERSHIP & BILLING FAQS
            </h3>
          </div>

          {faqsList.map((item, idx) => (
            <div 
              key={idx} 
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-sans font-bold text-slate-900 text-xs uppercase cursor-pointer"
              >
                <span>{item.q}</span>
                {openFAQ === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#D32F2F] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFAQ === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 font-sans leading-relaxed border-t border-slate-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Paystack Gateway Loading / Error Modal */}
      {activePaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xl relative text-slate-900">
            
            <div className="bg-slate-50 p-5 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#D32F2F] fill-[#D32F2F]" />
                <span className="font-display font-black tracking-wider text-xs uppercase text-slate-800">
                  PAYSTACK SECURE GATEWAY
                </span>
              </div>
              {checkoutError && (
                <button 
                  onClick={() => {
                    setActivePaymentModal(null);
                    setSubmittingPlan(null);
                    setCheckoutError(null);
                  }} 
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors border-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="p-6 space-y-6 text-xs font-sans">
              {checkoutError ? (
                <div className="space-y-4 py-4 text-left">
                  <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 leading-relaxed font-sans font-semibold">
                    <strong className="text-sm font-bold block mb-1 text-red-700">Initialization Failed</strong>
                    {checkoutError}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePaymentModal(null);
                      setSubmittingPlan(null);
                      setCheckoutError(null);
                    }}
                    className="w-full py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-sans font-bold text-xs uppercase rounded-xl transition duration-200 cursor-pointer border-0 shadow-sm"
                  >
                    Return to pricing plans
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center space-y-4 text-center py-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D32F2F] border-t-transparent" />
                    <div className="space-y-1">
                      <h3 className="text-base font-black text-slate-900 tracking-tight uppercase">
                        ALEXFITNESSHUB SECURE CONSOLE
                      </h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold">
                        INITIALIZING PAYSTACK CHECKOUT GATEWAY
                      </p>
                    </div>
                  </div>
 
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-3 text-left shadow-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-200 font-mono text-[10px] text-slate-500 font-bold">
                      <span>SECURE PROTOCOL</span>
                      <span className="text-emerald-600 font-bold uppercase">● CONNECTED</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-mono text-[10px] uppercase font-semibold">ATHLETE:</span>
                      <span className="font-bold text-slate-800">{user?.email}</span>
                    </div>
 
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-mono text-[10px] uppercase font-semibold">MEMBERSHIP LEVEL:</span>
                      <span className="font-bold text-[#D32F2F] uppercase">
                        {activePaymentModal === "yearly" 
                          ? "VIP Elite Club (12M)" 
                          : activePaymentModal === "multi" 
                          ? `Flexible Volume (${selectedMonths}M)` 
                          : "Monthly Starter (1M)"}
                      </span>
                    </div>
 
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200 font-bold text-slate-900">
                      <span>TOTAL PAYABLE:</span>
                      <span className="text-sm text-[#D32F2F]">
                        {activePaymentModal === "yearly" 
                          ? "₦215,989" 
                          : activePaymentModal === "multi" 
                          ? (selectedMonths === 2 ? "₦35,999" : selectedMonths === 3 ? "₦49,999" : selectedMonths === 4 ? "₦63,999" : selectedMonths === 5 ? "₦77,999" : "₦89,999") 
                          : "₦19,999"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
