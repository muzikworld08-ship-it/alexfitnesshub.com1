import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { useApp } from "../context/AppContext";
import { Loader2, CheckCircle2, Shield, Sparkles } from "lucide-react";

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

interface PaystackUpgradeButtonProps {
  plan?: "monthly" | "yearly" | "multi";
  months?: number;
  className?: string;
  buttonText?: string;
  onSuccess?: () => void;
}

export default function PaystackUpgradeButton({
  plan = "monthly",
  months = 1,
  className = "",
  buttonText = "Upgrade to Premium",
  onSuccess
}: PaystackUpgradeButtonProps) {
  const { user } = useApp();
  const [status, setStatus] = useState<"idle" | "confirming" | "done">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentUser = auth.currentUser;
  const activeUid = user?.uid || currentUser?.uid;

  // Real-time Firestore snapshot listener: Webhook flips isPremium on users/{uid}
  useEffect(() => {
    if (!activeUid) return;

    const userDocRef = doc(db, "users", activeUid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const isNowPremium =
            data?.isPremium === true ||
            data?.subscriptionStatus === "premium" ||
            data?.subscription === "premium";

          if (isNowPremium && status === "confirming") {
            setStatus("done");
            if (onSuccess) onSuccess();
          }
        }
      },
      (err) => {
        console.warn("Notice: Real-time upgrade listener snapshot:", err?.message || err);
      }
    );

    return () => unsubscribe();
  }, [status, activeUid, onSuccess]);

  const handleUpgrade = async () => {
    setErrorMsg(null);

    const email = user?.email || currentUser?.email;
    const uid = activeUid;

    if (!email || !uid) {
      setErrorMsg("You must be logged in to upgrade.");
      return;
    }

    try {
      // 1. Fetch live Paystack Public Key
      const configRes = await fetch("/api/payments/config");
      const configData = await configRes.json();
      const publicKey = configData.publicKey || import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error("Paystack Public Key is not configured in backend or environment settings.");
      }

      // Calculate amount in Kobo
      const amountNGN = plan === "yearly" ? 215989 : plan === "multi" ? 19999 * (months || 1) : 19999;
      const amountInKobo = Math.round(amountNGN * 100);

      // Dynamically load Paystack inline JS if not present
      if (!window.PaystackPop) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://js.paystack.co/v1/inline.js";
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Paystack inline script."));
          document.body.appendChild(script);
        });
      }

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: email,
        amount: amountInKobo,
        currency: "NGN",
        metadata: {
          uid: uid, // Passed directly to identify user in webhook without email-matching guesswork
          userId: uid,
          email: email,
          plan: plan,
          months: months,
          custom_fields: [
            { display_name: "User ID", variable_name: "user_id", value: uid },
            { display_name: "Plan", variable_name: "plan", value: plan }
          ]
        },
        callback: (response: any) => {
          // Do NOT upgrade directly on client. Show confirming state while webhook updates Firestore.
          console.log("[Paystack Pop] Payment successful on client. Awaiting webhook upgrade...", response);
          setStatus("confirming");

          // Optional backup fast-path: ping verify endpoint in background
          if (response?.reference) {
            fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference: response.reference, userId: uid, email, plan })
            }).catch((err) => console.warn("Background verification fallback notice:", err));
          }
        },
        onClose: () => {
          console.log("[Paystack Pop] Payment window closed");
        }
      });

      handler.openIframe();
    } catch (err: any) {
      console.error("[Paystack Upgrade Error]", err);
      setErrorMsg(err?.message || "Could not initialize Paystack popup.");
    }
  };

  if (status === "done" || user?.isPremium || user?.subscriptionStatus === "premium") {
    return (
      <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        <span className="text-sm">🎉 You're an active Premium Athlete!</span>
      </div>
    );
  }

  if (status === "confirming") {
    return (
      <div className="flex items-center gap-3 text-slate-700 bg-amber-50 px-4 py-3 rounded-xl border border-amber-200 font-sans text-xs">
        <Loader2 className="w-5 h-5 text-amber-600 animate-spin shrink-0" />
        <div>
          <p className="font-bold text-amber-900">Confirming your payment…</p>
          <p className="text-[11px] text-amber-700">Listening for Paystack webhook confirmation. This usually takes a few seconds.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleUpgrade}
        className={
          className ||
          "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-sans font-bold text-sm tracking-wide shadow-md shadow-red-500/10 hover:shadow-lg transition-all duration-200 cursor-pointer border-0"
        }
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>{buttonText}</span>
      </button>

      {errorMsg && (
        <p className="text-xs text-rose-600 font-medium mt-1">{errorMsg}</p>
      )}
    </div>
  );
}
