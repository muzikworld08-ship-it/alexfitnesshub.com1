import React from "react";
import AdminWorkoutEditor from "./admin/AdminWorkoutEditor";

interface WorkoutGeneratorViewProps {
  setView?: (view: string) => void;
}

/**
 * Replaces legacy AI Workout Generator with the authoritative Workout Management Desk
 * and Program Schedule Architect & 7-Day Split Manager.
 */
export default function WorkoutGeneratorView({ setView: _setView }: WorkoutGeneratorViewProps) {
  return <AdminWorkoutEditor />;
}
