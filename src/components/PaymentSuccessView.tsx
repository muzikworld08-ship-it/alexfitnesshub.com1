import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, Loader2, Sparkles, ArrowRight } from "lucide-react";

const VIEW_TO_PATH_MAP: Record<string, string> = {
  "home": "/",
  "payment-success": "/payment/success",
  "library": "/premium/library",
  "workout-generator": "/premium/workout-generator",
  "workout-videos": "/premium/workout-videos",
  "saved-exercises": "/premium/saved-exercises",
  "coach": "/premium/coach",
  "nutrition": "/premium/nutrition",
  "daily-plan": "/premium/daily-plan",
  "challenges": "/premium/challenges",
  "community": "/premium/community",
  "weekly-reports": "/premium/weekly-reports",
  "daily-habit-tracker": "/premium/daily-habit-tracker",
  "daily-calibration-desk": "/premium/daily-calibration-desk",
  "handbook": "/premium/handbook",
  "weight-trajectory": "/premium/weight-trajectory",
  "dashboard": "/premium/dashboard",
  "belly-fat-shred": "/premium/belly-fat-shred",
  "lifestyle-academy": "/lifestyle-academy",
};

export default function PaymentSuccessView() {
  const { user, upgradeWithPaystack } = useApp();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("reference") || params.get("trxref") || "";
    setReference(ref);

    if (!ref) {
      setStatus("error");
      setErrorMessage("No payment reference found in the callback URL.");
      return;
    }

    let isMounted = true;

    const verifyPayment = async () => {
      try {
        console.log(`[PaymentSuccessView] Launching direct verification for reference: ${ref}`);
        const resultUser = await upgradeWithPaystack(ref);
        if (isMounted) {
          setStatus("success");
        }
      } catch (err: any) {
        console.error("[PaymentSuccessView Verification Error]", err);
        if (isMounted) {
          setStatus("error");
          setErrorMessage(err.message || "We were unable to verify your payment reference. Please contact support.");
        }
      }
    };

    verifyPayment();

    return () => {
      isMounted = false;
    };
  }, []);

  // Automated premium redirect to original requested page
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        const attemptedView = localStorage.getItem("fit_attempted_view");
        localStorage.removeItem("fit_attempted_view");
        const path = attemptedView ? (VIEW_TO_PATH_MAP[attemptedView] || "/") : "/";
        window.location.assign(path);
      }, 3000); // Redirect after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-4 py-12 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xl shadow-slate-100/50">
        
        {/* White Background, Red Header / Accent */}
        <div className="flex justify-center mb-6">
          <span className="text-sm font-mono tracking-widest text-[#D32F2F] uppercase font-bold">
            AlexFitnessHub Premium
          </span>
        </div>

        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <Loader2 className="h-16 w-16 text-[#D32F2F] animate-spin mb-6" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 font-sans mb-3">
              Verifying Your Payment
            </h1>
            <p className="text-slate-600 text-sm max-w-xs mx-auto leading-relaxed">
              We are verifying your transaction securely with Paystack. Please do not close or refresh this window.
            </p>
            {reference && (
              <span className="mt-6 text-[11px] font-mono bg-slate-100 px-3 py-1 text-slate-500 rounded-md">
                Ref: {reference}
              </span>
            )}
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 relative">
              <CheckCircle2 className="h-12 w-12" />
              <motion.div 
                className="absolute inset-0 rounded-full border border-emerald-400"
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 font-sans mb-3">
              Payment Confirmed!
            </h1>
            <p className="text-slate-700 font-medium text-sm mb-4">
              Your AlexFitnessHub Premium membership is now <span className="text-emerald-600 font-bold">ACTIVE</span>.
            </p>

            {/* Alex's Premium Insights Welcome Card */}
            <div className="w-full bg-slate-900 text-white rounded-2xl p-5 mb-6 text-left border border-slate-800 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 font-mono">
                  Alex's Premium Insights
                </h3>
              </div>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed font-sans">
                Welcome to the premium hub! Here are high-fidelity capabilities designed exclusively for you:
              </p>

              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    520+ Exercise Database
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-3">
                    Access video-guided movement tutorials on the main library segment with absolute target sets.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Dynamic AI Regeneration Daily
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-3">
                    Utilize feedback triggers to automatically loosen or tighten calories parameters and target protocols.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const attemptedView = localStorage.getItem("fit_attempted_view");
                localStorage.removeItem("fit_attempted_view");
                const path = attemptedView ? (VIEW_TO_PATH_MAP[attemptedView] || "/") : "/";
                window.location.assign(path);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-red-100 transition-all cursor-pointer group"
            >
              Enter Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
              <XCircle className="h-10 w-10" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 font-sans mb-3">
              Verification Failed
            </h1>
            <p className="text-red-600 font-medium text-xs mb-6 max-w-xs mx-auto leading-relaxed bg-red-50 p-3 rounded-xl border border-red-100">
              {errorMessage}
            </p>
            <p className="text-slate-500 text-xs mb-8 leading-relaxed">
              If money has been deducted from your account, don't worry. Our backend processes Paystack webhook updates automatically. Click below to return home and check your status in a few moments.
            </p>

            <button
              onClick={() => {
                window.location.assign("/");
              }}
              className="w-full bg-slate-950 hover:bg-slate-900 text-white font-semibold py-4 px-6 rounded-2xl transition-all cursor-pointer"
            >
              Return Home
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
