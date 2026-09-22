import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Crown, Sparkles, X, CheckCircle2, ShieldAlert, ArrowRight, 
  Dumbbell, Activity, Video, Heart, Zap, Lock
} from "lucide-react";

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
  onUpgrade: () => void;
}

export default function PremiumUpgradeModal({
  isOpen,
  onClose,
  featureName = "Premium Feature",
  onUpgrade
}: PremiumUpgradeModalProps) {
  if (!isOpen) return null;

  const benefits = [
    {
      title: "Unlimited AI Kinesiology Coach",
      desc: "24/7 personal coaching, instant workout generation & biomechanical advice.",
      icon: Sparkles,
      color: "text-amber-500 bg-amber-50 border-amber-200"
    },
    {
      title: "Full 90-Day Challenge & Belly Fat Shred",
      desc: "Specialized daily core sculpting protocols, fat burning splits & certificates.",
      icon: Zap,
      color: "text-red-500 bg-red-50 border-red-200"
    },
    {
      title: "Complete Athlete Performance Desk",
      desc: "Biometric hydration desks, weight trajectory graphs, habit trackers & weekly reports.",
      icon: Activity,
      color: "text-blue-500 bg-blue-50 border-blue-200"
    },
    {
      title: "HD Exercise Video Demonstration Vault",
      desc: "500+ HD kinetic movement guides with slow-mo form cues for maximum gains.",
      icon: Video,
      color: "text-purple-500 bg-purple-50 border-purple-200"
    },
    {
      title: "Localized Macro & Meal Matrix",
      desc: "Exact protein, carbohydrate & healthy fat balances tailored to your exact goal.",
      icon: Heart,
      color: "text-emerald-500 bg-emerald-50 border-emerald-200"
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto"
        >
          {/* Header Banner */}
          <div className="relative p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-red-950 text-white overflow-hidden border-b border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer border border-white/10"
              aria-label="Close Upgrade Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-mono font-black uppercase tracking-widest mb-3">
              <Lock className="w-3 h-3 text-red-400" />
              <span>Premium Access Required</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-white">
              Unlock <span className="text-[#E53935]">AlexFitnessHub</span> Premium
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              You selected <strong className="text-amber-400">{featureName}</strong>, an exclusive feature available exclusively on active Premium plans.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="p-6 sm:p-8 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <h4 className="text-xs font-mono font-black uppercase tracking-wider text-slate-400">
              PREMIUM ATHLETE MEMBERSHIP BENEFITS
            </h4>

            <div className="grid gap-3">
              {benefits.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div 
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5 hover:border-red-300:border-red-800 transition-all"
                  >
                    <div className={`p-2.5 rounded-xl border shrink-0 ${b.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                        {b.title}
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </h5>
                      <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-relaxed font-sans">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Footer / CTA */}
          <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900:text-white transition-all cursor-pointer text-center"
            >
              Maybe Later
            </button>

            <button
              onClick={onUpgrade}
              className="w-full sm:w-auto flex-1 px-6 py-3.5 bg-gradient-to-r from-[#E53935] to-[#C62828] hover:from-[#C62828] hover:to-[#B71C1C] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Upgrade to Premium</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
