import React from "react";
import { AlertTriangle, Trash2, RefreshCw, X, ShieldAlert, Dumbbell } from "lucide-react";

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
  onChooseReplacement?: () => void;
  onCancel: () => void;
}

export default function DeleteWorkoutConfirmModal({
  isOpen,
  target,
  isLoading = false,
  onConfirm,
  onDeleteOnly,
  onChooseReplacement,
  onCancel
}: DeleteWorkoutConfirmModalProps) {
  if (!isOpen || !target) return null;

  const muscles = Array.isArray(target.muscleGroup) 
    ? target.muscleGroup.join(", ") 
    : target.muscleGroup || "Target Musculature";

  const equipmentStr = Array.isArray(target.equipment)
    ? target.equipment.join(", ")
    : target.equipment || "Standard Equipment";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 text-neutral-100"
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
              <p className="text-xs text-neutral-400">
                Admin Safeguard & Dynamic Library Replacement
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workout Details Preview Card */}
        <div className="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-950/40 border border-red-900/40 px-2 py-0.5 rounded-md">
              Target for Deletion
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
            <div>
              <h4 className="text-sm font-black text-white">
                {target.name}
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
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

        {/* Informative Guard Note & Selection Options */}
        <div className="space-y-2.5 pt-1">
          {onChooseReplacement && (
            <button
              type="button"
              disabled={isLoading}
              onClick={onChooseReplacement}
              className="w-full p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/20 text-left transition flex items-center justify-between group cursor-pointer"
            >
              <div>
                <p className="text-xs font-black text-amber-300 group-hover:text-amber-200">
                  Select Specific Replacement Exercise
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Browse the exercise library to swap in a specific drill
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 ml-2 shrink-0">Browse Library →</span>
            </button>
          )}

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="w-full p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/60 text-left transition flex items-center justify-between group cursor-pointer"
          >
            <div>
              <p className="text-xs font-black text-white group-hover:text-red-400">
                Auto-Replace with Library Counterpart
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Automatically assign a verified biomechanical counterpart from library
              </p>
            </div>
            <span className="text-xs font-bold text-red-400 ml-2 shrink-0">Auto-Swap</span>
          </button>

          {onDeleteOnly && (
            <button
              type="button"
              disabled={isLoading}
              onClick={onDeleteOnly}
              className="w-full p-3.5 rounded-2xl bg-red-950/20 border border-red-900/40 hover:border-red-600/60 hover:bg-red-950/40 text-left transition flex items-center justify-between group cursor-pointer"
            >
              <div>
                <p className="text-xs font-black text-red-400 group-hover:text-red-300">
                  Delete Permanently (No Replacement)
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Remove this exercise completely from the routine without adding a substitute
                </p>
              </div>
              <Trash2 className="w-4 h-4 text-red-500 ml-2 shrink-0" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
