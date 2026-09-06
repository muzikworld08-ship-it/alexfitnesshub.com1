import React, { useState } from "react";
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Search, Filter, 
  Layers, Dumbbell, Calendar, RefreshCw, Eye, Edit3, Trash2, 
  Plus, Save, Check, ExternalLink, HelpCircle
} from "lucide-react";
import { ProgramId, ChallengeExerciseItem, ValidationError } from "../../types/challengeEngine";
import { CHALLENGE_PROGRAMS_METADATA, getWorkoutForProgramAndDay } from "../../data/challengeEngineDatabase";
import { ChallengeValidationService } from "../../services/challengeValidationService";

export default function AdminWorkoutChallengeEngine() {
  const [selectedProgramId, setSelectedProgramId] = useState<ProgramId>("immortal_90");
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [validationReports, setValidationReports] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [auditTimestamp, setAuditTimestamp] = useState<string | null>(null);

  // Edit Exercise modal / panel
  const [editingExercise, setEditingExercise] = useState<ChallengeExerciseItem | null>(null);
  const [customExercises, setCustomExercises] = useState<Record<string, ChallengeExerciseItem>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Exercise Form State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newMuscleGroup, setNewMuscleGroup] = useState("");
  const [newEquipment, setNewEquipment] = useState("Bodyweight");
  const [newDifficulty, setNewDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [newSets, setNewSets] = useState("3");
  const [newReps, setNewReps] = useState("10-12");
  const [newInstructions, setNewInstructions] = useState("");

  const currentProgramMeta = CHALLENGE_PROGRAMS_METADATA[selectedProgramId];
  const dayPlan = getWorkoutForProgramAndDay(selectedProgramId, selectedDayNumber);

  // Run the validation tool across all programs
  const handleRunValidationAudit = () => {
    setIsValidating(true);
    setTimeout(() => {
      const reports = ChallengeValidationService.auditAllPrograms();
      setValidationReports(reports);
      setAuditTimestamp(new Date().toLocaleTimeString());
      setIsValidating(false);
    }, 400);
  };

  const handleSaveExerciseEdit = () => {
    if (!editingExercise) return;
    setCustomExercises(prev => ({
      ...prev,
      [editingExercise.id]: editingExercise
    }));
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setEditingExercise(null);
    }, 1200);
  };

  const handleCreateNewExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExerciseName.trim()) return;

    const newEx: ChallengeExerciseItem = {
      id: `custom_${selectedProgramId}_d${selectedDayNumber}_${Date.now()}`,
      programId: selectedProgramId,
      programName: currentProgramMeta.name,
      dayNumber: selectedDayNumber,
      category: newCategory || dayPlan.meta.category,
      muscleGroup: newMuscleGroup ? newMuscleGroup.split(",").map(s => s.trim()) : dayPlan.meta.targetMuscles,
      exerciseName: newExerciseName.trim(),
      equipment: newEquipment,
      difficulty: newDifficulty,
      sets: newSets,
      reps: newReps,
      duration: "45s set",
      instructions: newInstructions.split("\n").filter(Boolean)
    };

    setCustomExercises(prev => ({
      ...prev,
      [newEx.id]: newEx
    }));

    setIsAddingNew(false);
    setNewExerciseName("");
    setNewCategory("");
    setNewMuscleGroup("");
    setNewInstructions("");
    alert(`Exercise "${newEx.exerciseName}" assigned successfully to Day ${selectedDayNumber}!`);
  };

  return (
    <div id="admin_challenge_engine_root" className="space-y-8 text-neutral-100 font-sans">
      {/* 1. HEADER & CONTROLS */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-red-600/20 text-red-400 border border-red-500/30">
                ADMIN CONSOLE
              </span>
              <span className="text-xs text-neutral-400">Workout Challenge Engine Architect</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mt-1">
              Program & Day Exercise Hierarchy Manager
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
              Strict deterministic mapping: <strong className="text-red-400">PROGRAM → DAY → CATEGORY → MUSCLE GROUP → EXERCISE</strong>. Ensure no cross-contamination between programs.
            </p>
          </div>

          {/* Automated Validation Tool Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRunValidationAudit}
              disabled={isValidating}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/25 transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isValidating ? "animate-spin" : ""}`} />
              <span>RUN SYSTEM VALIDATION AUDIT</span>
            </button>
          </div>
        </div>

        {/* 2. PROGRAM & DAY SELECTORS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Active Program
            </label>
            <select
              value={selectedProgramId}
              onChange={(e) => {
                setSelectedProgramId(e.target.value as ProgramId);
                setSelectedDayNumber(1);
              }}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              {(Object.keys(CHALLENGE_PROGRAMS_METADATA) as ProgramId[]).map((pid) => (
                <option key={pid} value={pid}>
                  {CHALLENGE_PROGRAMS_METADATA[pid].name} ({CHALLENGE_PROGRAMS_METADATA[pid].totalDays} Days)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Inspect Day Number (1 - {currentProgramMeta.totalDays})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={currentProgramMeta.totalDays}
                value={selectedDayNumber}
                onChange={(e) => setSelectedDayNumber(Math.max(1, Math.min(currentProgramMeta.totalDays, parseInt(e.target.value) || 1)))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Prescribed Category
            </label>
            <div className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-bold text-red-400 truncate">
              {dayPlan.meta.category}
            </div>
          </div>

          <div className="space-y-1.5 flex flex-col justify-end">
            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add Exercise to Day</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. VALIDATION TOOL REPORT SECTION */}
      {auditTimestamp && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-black text-white">
                Validation Audit Results ({validationReports.length} Discrepancies)
              </h3>
            </div>
            <span className="text-xs text-neutral-400">Last scanned: {auditTimestamp}</span>
          </div>

          {validationReports.length === 0 ? (
            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-sm">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <strong>All Programs Verified Pristine!</strong> Zero category mismatches, zero missing workouts, zero unassigned muscle groups detected across all 5 programs.
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
              {validationReports.map((report, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border flex items-start gap-3 text-xs ${
                    report.severity === "error"
                      ? "bg-red-950/30 border-red-500/40 text-red-200"
                      : "bg-amber-950/30 border-amber-500/40 text-amber-200"
                  }`}
                >
                  <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${report.severity === "error" ? "text-red-400" : "text-amber-400"}`} />
                  <div>
                    <span className="font-bold uppercase tracking-wider block">[{report.type}]:</span>
                    <span>{report.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. DAY WORKOUT PREVIEW & EXERCISE MANAGER */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-neutral-800 text-neutral-300">
                DAY {selectedDayNumber} PREVIEW
              </span>
              <span className="text-xs font-semibold text-neutral-400">
                {currentProgramMeta.name}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              {dayPlan.meta.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Exercises count:</span>
            <span className="px-2.5 py-1 rounded-lg bg-neutral-800 text-white font-bold text-xs">
              {dayPlan.exercises.length}
            </span>
          </div>
        </div>

        {/* Exercises Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pr-4">#</th>
                <th className="pb-3 pr-4">Exercise Name</th>
                <th className="pb-3 pr-4">Assigned Category</th>
                <th className="pb-3 pr-4">Muscle Group</th>
                <th className="pb-3 pr-4">Sets × Reps</th>
                <th className="pb-3 pr-4">Equipment</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {dayPlan.exercises.map((ex, index) => {
                const currentEx = customExercises[ex.id] || ex;
                return (
                  <tr key={ex.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3.5 pr-4 text-neutral-400 font-mono">{index + 1}</td>
                    <td className="py-3.5 pr-4 font-bold text-white">{currentEx.exerciseName}</td>
                    <td className="py-3.5 pr-4">
                      <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-medium">
                        {currentEx.category}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="px-2 py-0.5 rounded-md bg-red-950/40 text-red-300 font-medium border border-red-500/20">
                        {currentEx.muscleGroup.join(", ")}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-mono text-neutral-200">
                      {currentEx.sets} × {currentEx.reps}
                    </td>
                    <td className="py-3.5 pr-4 text-neutral-400">{currentEx.equipment}</td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => setEditingExercise(currentEx)}
                        className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition-all text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MODAL: EDIT EXERCISE METADATA */}
      {editingExercise && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-red-500" />
                Edit Exercise Specs
              </h4>
              <button
                onClick={() => setEditingExercise(null)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-400 font-semibold block mb-1">Exercise Name</label>
                <input
                  type="text"
                  value={editingExercise.exerciseName}
                  onChange={(e) => setEditingExercise({ ...editingExercise, exerciseName: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 font-semibold block mb-1">Category</label>
                  <input
                    type="text"
                    value={editingExercise.category}
                    onChange={(e) => setEditingExercise({ ...editingExercise, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 font-semibold block mb-1">Muscle Groups (comma-separated)</label>
                  <input
                    type="text"
                    value={editingExercise.muscleGroup.join(", ")}
                    onChange={(e) => setEditingExercise({ ...editingExercise, muscleGroup: e.target.value.split(",").map(s => s.trim()) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-neutral-400 font-semibold block mb-1">Sets</label>
                  <input
                    type="text"
                    value={editingExercise.sets}
                    onChange={(e) => setEditingExercise({ ...editingExercise, sets: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 font-semibold block mb-1">Reps</label>
                  <input
                    type="text"
                    value={editingExercise.reps}
                    onChange={(e) => setEditingExercise({ ...editingExercise, reps: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 font-semibold block mb-1">Equipment</label>
                  <input
                    type="text"
                    value={editingExercise.equipment}
                    onChange={(e) => setEditingExercise({ ...editingExercise, equipment: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingExercise(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExerciseEdit}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{saveSuccess ? "Saved!" : "Save Specs"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: CREATE NEW EXERCISE */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateNewExercise} className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Assign New Exercise to Day {selectedDayNumber}
              </h4>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-400 font-semibold block mb-1">Exercise Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Incline Cable Crossover"
                  value={newExerciseName}
                  onChange={(e) => setNewExerciseName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 font-semibold block mb-1">Category</label>
                  <input
                    type="text"
                    placeholder={dayPlan.meta.category}
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 font-semibold block mb-1">Muscle Group(s)</label>
                  <input
                    type="text"
                    placeholder={dayPlan.meta.targetMuscles.join(", ")}
                    value={newMuscleGroup}
                    onChange={(e) => setNewMuscleGroup(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-neutral-400 font-semibold block mb-1">Sets</label>
                  <input
                    type="text"
                    value={newSets}
                    onChange={(e) => setNewSets(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 font-semibold block mb-1">Reps</label>
                  <input
                    type="text"
                    value={newReps}
                    onChange={(e) => setNewReps(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 font-semibold block mb-1">Equipment</label>
                  <input
                    type="text"
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 font-semibold block mb-1">Execution Instructions</label>
                <textarea
                  rows={3}
                  placeholder="One instruction per line..."
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-medium resize-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Exercise</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
