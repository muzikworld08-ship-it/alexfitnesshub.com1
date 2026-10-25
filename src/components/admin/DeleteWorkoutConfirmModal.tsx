import React from "react";
import { AlertTriangle, Trash2, RefreshCw, X, ShieldAlert, Dumbbell, Sparkles, ArrowRight, Shuffle } from "lucide-react";

export interface DeleteWorkoutTarget {
  id: string;
  name: string;
  category?: string;
  muscleGroup?: string | string[];
  equipment?: string | string[];
  sets?: number | string;
  reps?: string;
  programName?: string;
  dayNumber?: number;
}

interface DeleteWorkoutConfirmModalProps {
  isOpen: boolean;
  target: DeleteWorkoutTarget | null;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onDeleteOnly?: () => void | Promise<void>;
  onAutoReplace?: () => void | Promise<void>;
  onChooseReplacement?: () => void;
  onCancel: () => void;
}

export default function DeleteWorkoutConfirmModal({
  isOpen,
  target,
  isLoading = false,
  onConfirm,
  onDeleteOnly,
  onAutoReplace,
  onChooseReplacement,
  onCancel
}: DeleteWorkoutConfirmModalProps) {
  if (!isOpen || !target) return null;

  // Ultra-fast instant action triggers: dismiss modal synchronously on click so UI has zero lag
  const handleTriggerAutoReplace = () => {
    onCancel();
    if (onAutoReplace) {
      setTimeout(() => onAutoReplace(), 0);
    }
  };

  const handleTriggerDeleteOnly = () => {
    onCancel();
    const action = onDeleteOnly || onConfirm;
    if (action) {
      setTimeout(() => action(), 0);
    }
  };

  const handleTriggerChooseReplacement = () => {
    onCancel();
    if (onChooseReplacement) {
      setTimeout(() => onChooseReplacement(), 0);
    }
  };

  const muscles = Array.isArray(target.muscleGroup) 
    ? target.muscleGroup.join(", ") 
    : target.muscleGroup || "Target Musculature";

  const equipmentStr = Array.isArray(target.equipment)
    ? target.equipment.join(", ")
    : target.equipment || "Standard Equipment";

  const hasAutoReplace = typeof onAutoReplace === "function";

  return (
    <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-100">
      <div 
        className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 text-neutral-100 animate-in zoom-in-95 duration-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 shadow-inner">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                Confirm Workout Removal
              </h3>
              <p className="text-xs text-neutral-400 font-medium">
                Admin Safeguard & Dynamic Library Replacement
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close dialog"
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workout Details Preview Card */}
        <div className="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-950/40 border border-red-900/40 px-2 py-0.5 rounded-md">
              Target for Removal
            </span>
            {target.dayNumber ? (
              <span className="text-xs font-mono text-neutral-400 font-bold">
                Day {target.dayNumber} {target.programName ? `• ${target.programName}` : ""}
              </span>
            ) : null}
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center text-neutral-400 shrink-0">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-black text-white truncate">
                {target.name}
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5 truncate">
                <span className="text-neutral-300 font-medium">{target.category || "General"}</span>
                {" • "}
                <span>{muscles}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800/60 text-[11px]">
            <div>
              <span className="text-neutral-500 block">Sets × Reps:</span>
              <span className="font-mono text-neutral-200 font-bold">
                {target.sets || 3} sets × {target.reps || "10-12"}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Equipment:</span>
              <span className="text-neutral-300 font-medium truncate block">
                {equipmentStr}
              </span>
            </div>
          </div>
        </div>

        {/* Action Strategy Selection */}
        {hasAutoReplace ? (
          <div className="space-y-3">
            <p className="text-xs text-neutral-400 font-medium">
              Choose your workout removal strategy:
            </p>

            {/* 1. Dynamic Library Replacement (Recommended) */}
            <button
              type="button"
              onClick={handleTriggerAutoReplace}
              className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-emerald-900/30 border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-950/80 transition-all group cursor-pointer shadow-lg shadow-emerald-950/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Shuffle className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                      Dynamic Library Replacement
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded font-bold">
                        Recommended
                      </span>
                    </h5>
                    <p className="text-[11px] text-neutral-300 mt-0.5">
                      Instantly replaces with an authentic matching drill from library with GIF to preserve routine volume.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </button>

            {/* 2. Delete Only (Instant Remove) */}
            <button
              type="button"
              onClick={handleTriggerDeleteOnly}
              className="w-full text-left p-3.5 rounded-2xl bg-red-950/30 border border-red-900/40 hover:border-red-600/60 hover:bg-red-950/50 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-900/40 text-red-400 flex items-center justify-center shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-red-300 uppercase tracking-wider">
                      Delete Drill Only
                    </h5>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Permanently removes this drill from today's routine without replacing it.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-red-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </button>

            {/* Manual Replacement Link */}
            {onChooseReplacement && (
              <div className="pt-1 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleTriggerChooseReplacement}
                  className="text-xs text-neutral-400 hover:text-white underline underline-offset-4 transition cursor-pointer"
                >
                  Or choose a specific replacement drill manually...
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ) : (
          /* General Workout Library Deletion Mode */
          <div className="space-y-4 pt-1">
            <div className="p-3.5 rounded-2xl bg-red-950/20 border border-red-900/40 text-left">
              <p className="text-xs text-neutral-300 font-medium">
                Are you sure you want to permanently delete <strong className="text-white font-bold">{target.name}</strong> from the exercise library?
              </p>
              <p className="text-[11px] text-neutral-400 mt-1">
                This removes the workout, its demonstration GIF, and all progressive overload records immediately across the platform.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTriggerDeleteOnly}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950/40 active:scale-95"
              >
                <Trash2 className="w-4 h-4 text-white" />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
