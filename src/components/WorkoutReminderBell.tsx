import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import WorkoutReminderModal from "./WorkoutReminderModal";
import {
  getSavedReminderSchedule,
  getNotificationPermission,
  REMINDER_SCHEDULE_EVENT,
  WorkoutReminderSchedule
} from "../utils/pushNotificationService";

interface WorkoutReminderBellProps {
  className?: string;
}

export default function WorkoutReminderBell({ className = "" }: WorkoutReminderBellProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedule, setSchedule] = useState<WorkoutReminderSchedule>(() => getSavedReminderSchedule());
  const [permission, setPermission] = useState(() => getNotificationPermission());

  useEffect(() => {
    const handleUpdate = () => {
      setSchedule(getSavedReminderSchedule());
      setPermission(getNotificationPermission());
    };

    window.addEventListener(REMINDER_SCHEDULE_EVENT, handleUpdate);
    window.addEventListener("focus", handleUpdate);
    return () => {
      window.removeEventListener(REMINDER_SCHEDULE_EVENT, handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, []);

  const isConfigured = schedule.enabled && permission === "granted";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`relative p-2.5 rounded-xl border border-slate-200 hover:border-red-200 bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-[#E53935] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${className}`}
        title="Scheduled Workout Reminders & Push Notifications"
        aria-label="Open Workout Reminders Settings"
      >
        <Bell className="w-5 h-5 stroke-[2.2]" />
        
        {/* Status Dot */}
        {isConfigured ? (
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white shadow-xs"
            title="Workout Reminders Active"
          />
        ) : schedule.enabled && permission !== "granted" ? (
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white animate-pulse"
            title="Permission required for reminders"
          />
        ) : null}
      </button>

      <WorkoutReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
