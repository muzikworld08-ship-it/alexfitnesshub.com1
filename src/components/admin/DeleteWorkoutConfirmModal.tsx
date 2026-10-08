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
    <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
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

        {/* Deletion Warning & Action Buttons */}
        <div className="space-y-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-red-950/20 border border-red-900/40 text-left">
            <p className="text-xs text-neutral-300 font-medium">
              Are you sure you want to permanently delete <strong className="text-white font-bold">{target.name}</strong>?
            </p>
            <p className="text-[11px] text-neutral-400 mt-1">
              This will permanently remove this exercise and its demonstration GIF from this workout routine.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={onDeleteOnly || onConfirm}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950/40 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 text-white" />
              <span>{isLoading ? "Deleting..." : "Delete Permanently"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
