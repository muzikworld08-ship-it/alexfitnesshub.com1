import React, { useState, useMemo } from "react";
import { X, Search, Check, Dumbbell, Filter, Sparkles, RefreshCw, ArrowRightLeft, ShieldCheck, Flame } from "lucide-react";
import { EXERCISES, Exercise } from "../data/exercises";
import UnifiedExerciseMedia from "./UnifiedExerciseMedia";
import { useApp } from "../context/AppContext";

export interface SwappableExercise {
  id?: string;
  name?: string;
  exerciseName?: string;
  category?: string;
  muscleGroups?: string[];
  muscleGroup?: string[];
  equipment?: string[] | string;
  difficulty?: string;
  sets?: any;
  reps?: string;
  [key: string]: any;
}

interface UniversalExerciseSwapperModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentExercise: SwappableExercise | null;
  onSelectSwap: (newExercise: Exercise) => void;
  availableLibrary?: Exercise[];
}

const EQUIPMENT_FILTERS = [
  "All Equipment",
  "Bodyweight / None",
  "Dumbbells",
  "Resistance Bands",
  "Machines",
  "Cable",
  "Barbell"
];

export default function UniversalExerciseSwapperModal({
  isOpen,
  onClose,
  currentExercise,
  onSelectSwap,
  availableLibrary
}: UniversalExerciseSwapperModalProps) {
  const { exercises: appContextExercises } = useApp();
  const poolExercises = (availableLibrary && availableLibrary.length > 0)
    ? availableLibrary
    : (appContextExercises && appContextExercises.length > 0 ? appContextExercises : EXERCISES);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEquipmentFilter, setSelectedEquipmentFilter] = useState("All Equipment");
  const [forceAllCategories, setForceAllCategories] = useState(false);

  // Extract current exercise attributes
  const currentName = currentExercise?.name || currentExercise?.exerciseName || "Exercise";
  const currentCategory = (currentExercise?.category || "").trim();
  const currentMuscles = (
    Array.isArray(currentExercise?.muscleGroups) 
      ? currentExercise?.muscleGroups 
      : Array.isArray(currentExercise?.muscleGroup)
        ? currentExercise?.muscleGroup
        : [currentExercise?.muscleGroups || currentExercise?.category || ""]
  ).map(m => String(m).toLowerCase().trim()).filter(Boolean);

  // Determine Primary Category
  const primaryCategory = useMemo(() => {
    const c = currentCategory.toLowerCase();
    const n = currentName.toLowerCase();
    const mg = currentMuscles.join(" ");

    if (c.includes("bicep") || n.includes("curl") || mg.includes("bicep")) return "Biceps";
    if (c.includes("tricep") || n.includes("pushdown") || n.includes("skull crusher") || n.includes("dip") || mg.includes("tricep")) return "Triceps";
    if (c.includes("chest") || n.includes("bench") || n.includes("pushup") || n.includes("pec") || mg.includes("chest")) return "Chest";
    if (c.includes("back") || n.includes("row") || n.includes("pulldown") || n.includes("pullup") || mg.includes("back") || mg.includes("lat")) return "Back";
    if (c.includes("leg") || c.includes("quad") || c.includes("hamstring") || c.includes("glute") || n.includes("squat") || n.includes("lunge") || mg.includes("leg")) return "Legs";
    if (c.includes("shoulder") || n.includes("press") || mg.includes("shoulder") || mg.includes("delt")) return "Shoulders";
    if (c.includes("core") || c.includes("abs") || n.includes("plank") || n.includes("crunch") || mg.includes("core") || mg.includes("abs")) return "Core";
    if (c.includes("cardio") || n.includes("run") || n.includes("walk") || mg.includes("cardio")) return "Cardio";
    return currentCategory || "Full Body";
  }, [currentCategory, currentName, currentMuscles]);

  const filteredExercises = useMemo(() => {
    if (!currentExercise) return [];

    const currentId = currentExercise.id;
    const cleanCurrentName = currentName.toLowerCase().trim();

    return poolExercises.filter(ex => {
      // Don't show the exact same exercise as an alternative
      if (ex.id === currentId || ex.name.toLowerCase().trim() === cleanCurrentName) {
        return false;
      }

      const exName = ex.name.toLowerCase();
      const exCat = (ex.category || "").toLowerCase();
      const exMuscles = (ex.muscleGroups || []).map(m => m.toLowerCase());
      const exEquip = (Array.isArray(ex.equipment) ? ex.equipment : [String(ex.equipment || "")]).map(e => e.toLowerCase());

      // 1. Same category requirement (unless user explicitly toggles force all)
      if (!forceAllCategories) {
        const pCatLower = primaryCategory.toLowerCase();
        let matchesPrimary = 
          exCat.includes(pCatLower) || 
          exMuscles.some(m => m.includes(pCatLower)) ||
          currentMuscles.some(cm => exMuscles.some(em => em.includes(cm) || cm.includes(em)));

        // Category-specific semantic recognition
        if (!matchesPrimary) {
          if (pCatLower === "biceps") {
            matchesPrimary = exCat.includes("bicep") || exMuscles.some(m => m.includes("bicep")) || 
              (exName.includes("curl") && !exName.includes("leg curl") && !exName.includes("hamstring curl")) || exName.includes("bicep");
          } else if (pCatLower === "triceps") {
            matchesPrimary = exCat.includes("tricep") || exMuscles.some(m => m.includes("tricep")) || 
              exName.includes("tricep") || exName.includes("pushdown") || exName.includes("skull crusher") || (exName.includes("dip") && !exName.includes("hip dip")) || exName.includes("kickback");
          } else if (pCatLower === "chest") {
            matchesPrimary = exCat.includes("chest") || exMuscles.some(m => m.includes("chest")) || 
              exName.includes("bench") || exName.includes("pushup") || exName.includes("push up") || exName.includes("pec") || exName.includes("fly");
          } else if (pCatLower === "back") {
            matchesPrimary = exCat.includes("back") || exMuscles.some(m => m.includes("back") || m.includes("lat")) || 
              exName.includes("row") || exName.includes("pullup") || exName.includes("pull up") || exName.includes("pulldown") || exName.includes("lat") || exName.includes("deadlift");
          } else if (pCatLower === "legs") {
            matchesPrimary = exCat.includes("leg") || exCat.includes("quad") || exMuscles.some(m => m.includes("leg") || m.includes("quad") || m.includes("hamstring") || m.includes("glute") || m.includes("calf")) || 
              exName.includes("squat") || exName.includes("lunge") || exName.includes("leg") || exName.includes("calf") || exName.includes("glute") || exName.includes("hamstring");
          } else if (pCatLower === "shoulders") {
            matchesPrimary = exCat.includes("shoulder") || exMuscles.some(m => m.includes("shoulder") || m.includes("delt")) || 
              exName.includes("overhead press") || exName.includes("shoulder press") || exName.includes("lateral raise") || exName.includes("delt") || exName.includes("arnold");
          } else if (pCatLower === "core") {
            matchesPrimary = exCat.includes("core") || exCat.includes("abs") || exMuscles.some(m => m.includes("core") || m.includes("abs")) || 
              exName.includes("plank") || exName.includes("crunch") || exName.includes("sit up") || exName.includes("sit-up") || exName.includes("twist") || exName.includes("dead bug");
          } else if (pCatLower === "cardio") {
            matchesPrimary = exCat.includes("cardio") || exName.includes("run") || exName.includes("walk") || exName.includes("jump") || exName.includes("burpee") || exName.includes("climber");
          }
        }

        if (!matchesPrimary) return false;
      }

      // 2. Equipment filter
      if (selectedEquipmentFilter !== "All Equipment") {
        if (selectedEquipmentFilter === "Bodyweight / None") {
          const isBodyweight = exEquip.some(e => e.includes("bodyweight") || e.includes("none") || e.includes("zero") || e === "mat");
          if (!isBodyweight) return false;
        } else if (selectedEquipmentFilter === "Dumbbells") {
          const hasDumbbell = exEquip.some(e => e.includes("dumbbell"));
          if (!hasDumbbell) return false;
        } else if (selectedEquipmentFilter === "Resistance Bands") {
          const hasBand = exEquip.some(e => e.includes("band"));
          if (!hasBand) return false;
        } else if (selectedEquipmentFilter === "Machines") {
          const hasMachine = exEquip.some(e => e.includes("machine") || e.includes("smith") || e.includes("press"));
          if (!hasMachine) return false;
        } else if (selectedEquipmentFilter === "Cable") {
          const hasCable = exEquip.some(e => e.includes("cable") || e.includes("pulley"));
          if (!hasCable) return false;
        } else if (selectedEquipmentFilter === "Barbell") {
          const hasBarbell = exEquip.some(e => e.includes("barbell"));
          if (!hasBarbell) return false;
        }
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQ = 
          exName.includes(q) || 
          exCat.includes(q) || 
          exMuscles.some(m => m.includes(q)) || 
          exEquip.some(e => e.includes(q));
        if (!matchesQ) return false;
      }

      return true;
    });
  }, [poolExercises, currentExercise, currentName, currentMuscles, primaryCategory, forceAllCategories, selectedEquipmentFilter, searchQuery]);

  if (!isOpen || !currentExercise) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in text-slate-900">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black uppercase text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                <ArrowRightLeft className="w-3 h-3" />
                Equipment & Exercise Swapper
              </span>
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md">
                Category: {primaryCategory}
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-black text-slate-900 mt-1">
              Swap <span className="text-red-600">"{currentName}"</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Missing equipment or need an alternative? Choose an equivalent workout from the same category below.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-slate-100 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${primaryCategory} alternative workouts by name, muscle, equipment...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-red-600 font-sans"
            />
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
              {EQUIPMENT_FILTERS.map(eq => (
                <button
                  key={eq}
                  type="button"
                  onClick={() => setSelectedEquipmentFilter(eq)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                    selectedEquipmentFilter === eq
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {eq}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setForceAllCategories(!forceAllCategories)}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer shrink-0 ${
                forceAllCategories
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {forceAllCategories ? "✓ Showing All Categories" : `Strict: ${primaryCategory} Only`}
            </button>
          </div>
        </div>

        {/* Exercise Alternative List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <Dumbbell className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No matching alternative workouts found</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try switching the equipment filter to "All Equipment" or toggle "Showing All Categories" above.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedEquipmentFilter("All Equipment");
                  setSearchQuery("");
                  setForceAllCategories(true);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                Reset Filters & Show All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredExercises.map(ex => {
                const equip = Array.isArray(ex.equipment) ? ex.equipment.join(", ") : (ex.equipment || "Bodyweight");
                return (
                  <div
                    key={ex.id}
                    className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-red-400 rounded-2xl p-3.5 flex flex-col justify-between gap-3 transition-all shadow-xs group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        <UnifiedExerciseMedia
                          exerciseId={ex.id}
                          exerciseName={ex.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-mono font-bold uppercase text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                            {ex.category || primaryCategory}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500">
                            {ex.difficulty || "Intermediate"}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 mt-1 truncate group-hover:text-red-600 transition">
                          {ex.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          Equipment: <span className="font-bold text-slate-700">{equip}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
                        <span>{ex.recommendedSets || currentExercise.sets || "3-4"} Sets</span>
                        <span>•</span>
                        <span>{ex.recommendedReps || currentExercise.reps || "10-12 Reps"}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectSwap(ex);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Swap to this</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 text-xs text-slate-500">
          <span>Found <strong>{filteredExercises.length}</strong> matching alternatives in {primaryCategory}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
