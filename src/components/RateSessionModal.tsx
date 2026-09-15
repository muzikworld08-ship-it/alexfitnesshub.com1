import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Star, X, Check, Flame, Award, Dumbbell, Sparkles, HeartPulse,
  ThumbsUp, CheckCircle2, MessageSquare
} from "lucide-react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export interface SessionRatingData {
  id: string;
  sessionTitle: string;
  subtitle?: string;
  stars: number;
  rpe: number; // 1-10 rate of perceived exertion
  effortLabel: string;
  tags: string[];
  notes: string;
  setsCount?: number;
  totalSets?: number;
  createdAt: string;
}

interface RateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData?: {
    title: string;
    subtitle?: string;
    setsCount?: number;
    totalSets?: number;
    durationMinutes?: number;
  } | null;
  onSaveRating?: (rating: SessionRatingData) => void;
}

const STAR_LABELS: Record<number, string> = {
  1: "High Fatigue • Struggled to finish",
  2: "Challenging • Pushed through",
  3: "Good Effort • Solid routine",
  4: "Strong Session • Great muscle pump",
  5: "Peak Performance • Completely crushed it!"
};

const RPE_OPTIONS = [
  { val: 6, label: "Light / Active Recovery", desc: "Plenty in reserve", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { val: 7.5, label: "Moderate / Hypertrophy", desc: "Optimal working intensity", color: "bg-sky-50 text-sky-700 border-sky-200" },
  { val: 9, label: "Heavy / High Strain", desc: "1-2 reps left in tank", color: "bg-amber-50 text-amber-800 border-amber-200" },
  { val: 10, label: "Maximum / Failure", desc: "Absolute limit reached", color: "bg-red-50 text-red-700 border-red-200" }
];

const QUICK_TAGS = [
  "Insane Pump",
  "Hit Target Reps",
  "Clean Form",
  "New PR / Overload",
  "Felt Strong",
  "Fast Tempo",
  "High Fatigue",
  "Joints Felt Great"
];

export default function RateSessionModal({
  isOpen,
  onClose,
  sessionData,
  onSaveRating
}: RateSessionModalProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [selectedRpe, setSelectedRpe] = useState<number>(7.5);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Hit Target Reps"]);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const sessionTitle = sessionData?.title || "Workout Session";
  const setsCount = sessionData?.setsCount;
  const totalSets = sessionData?.totalSets;
  const activeStarDisplay = hoveredStar || selectedStars;

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitRating = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    const rpeObj = RPE_OPTIONS.find(r => r.val === selectedRpe) || RPE_OPTIONS[1];
    const ratingRecord: SessionRatingData = {
      id: "rate_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      sessionTitle,
      subtitle: sessionData?.subtitle,
      stars: selectedStars,
      rpe: selectedRpe,
      effortLabel: rpeObj.label,
      tags: selectedTags,
      notes: notes.trim(),
      setsCount,
      totalSets,
      createdAt: new Date().toISOString()
    };

    // 1. Save to local storage for instant offline resilience
    try {
      const existing = JSON.parse(localStorage.getItem("alexfit_session_ratings") || "[]");
      const updated = [ratingRecord, ...existing];
      localStorage.setItem("alexfit_session_ratings", JSON.stringify(updated.slice(0, 50)));
    } catch (err) {
      console.warn("Failed to write rating to localStorage", err);
    }

    // 2. Persist to Firestore if authenticated or online
    try {
      const currentUser = auth.currentUser;
      const userUid = currentUser?.uid || localStorage.getItem("fit_active_uid") || "guest";
      await setDoc(doc(db, "session_ratings", ratingRecord.id), {
        ...ratingRecord,
        userId: userUid,
        userEmail: currentUser?.email || null
      });
    } catch (err) {
      console.warn("Firestore session rating save warning:", err);
    }

    if (onSaveRating) {
      onSaveRating(ratingRecord);
    }

    setIsSubmitting(false);
    setIsSuccess(true);

    // Auto-close after celebration
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div 
        id="rate-session-modal-overlay" 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      >
        <motion.div
          id="rate-session-modal-container"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto"
        >
          {/* Top banner accent */}
          <div className="h-2 bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close Rating Modal"
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 sm:p-10 text-center space-y-4"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-sans font-black uppercase tracking-tight text-slate-900">
                Session Logged & Rated!
              </h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Your effort metrics and feedback have been added to your training record. Keep the momentum going!
              </p>
            </motion.div>
          ) : (
            <div className="p-5 sm:p-7 space-y-5">
              {/* Header */}
              <div className="space-y-1.5 text-center sm:text-left pr-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-mono font-black uppercase tracking-wider mb-1">
                  <Award className="w-3 h-3" />
                  <span>Workout Completed</span>
                </div>
                <h3 className="text-lg sm:text-xl font-sans font-black uppercase tracking-tight text-slate-900">
                  Rate Your Session
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 justify-center sm:justify-start">
                  <Dumbbell className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-700 truncate">{sessionTitle}</span>
                  {setsCount !== undefined && (
                    <span className="text-slate-400 font-mono text-[11px]">
                      • {setsCount} {totalSets ? `/ ${totalSets}` : ""} sets logged
                    </span>
                  )}
                </p>
              </div>

              {/* 1. Star Rating Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  Overall Workout Satisfaction
                </p>
                <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelectedStars(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(null)}
                      className="p-1 sm:p-1.5 transition-transform hover:scale-120 active:scale-95 cursor-pointer focus:outline-none"
                      aria-label={`Rate ${star} star`}
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          star <= activeStarDisplay
                            ? "text-amber-400 fill-amber-400 drop-shadow-xs"
                            : "text-slate-200 fill-slate-100 hover:text-amber-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs font-semibold text-slate-700 min-h-[1.25rem]">
                  {STAR_LABELS[activeStarDisplay]}
                </p>
              </div>

              {/* 2. Intensity & Perceived Exertion (RPE) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-red-500" />
                    <span>Workout Intensity (RPE)</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">Rate of exertion</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {RPE_OPTIONS.map((opt) => {
                    const isSelected = selectedRpe === opt.val;
                    return (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setSelectedRpe(opt.val)}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 w-full">
                          <span className="text-[11px] font-bold tracking-tight">{opt.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        </div>
                        <span className={`text-[9px] mt-0.5 ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Quick Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Session Highlights</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? "bg-red-50 text-red-700 border-red-200 font-bold"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Optional Athlete Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>Athlete Notes (Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., Added 2.5kg on bench press. Energy peaked after set 2."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500 text-slate-900 resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Skip for Now
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmitRating()}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#D32F2F] hover:bg-[#B71C1C] disabled:bg-slate-400 text-white font-sans font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Save Rating</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
