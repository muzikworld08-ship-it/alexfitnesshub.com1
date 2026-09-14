import React, { useState, useEffect } from "react";
import {
  Bell,
  Clock,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Zap,
  Sliders,
  Check
} from "lucide-react";
import {
  WorkoutReminderSchedule,
  getSavedReminderSchedule,
  saveReminderSchedule,
  getNotificationPermission,
  requestNotificationPermission,
  sendTestWorkoutReminder,
  formatTime12Hour,
  getNextScheduledReminderInfo,
  REMINDER_SCHEDULE_EVENT,
  PushPermissionStatus
} from "../utils/pushNotificationService";
import WorkoutReminderModal from "./WorkoutReminderModal";
import { useApp } from "../context/AppContext";

interface WorkoutReminderCardProps {
  className?: string;
  variant?: "full" | "compact";
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WorkoutReminderCard({
  className = "",
  variant = "full"
}: WorkoutReminderCardProps) {
  const { user } = useApp();
  const [schedule, setSchedule] = useState<WorkoutReminderSchedule>(() => getSavedReminderSchedule());
  const [permission, setPermission] = useState<PushPermissionStatus>(() => getNotificationPermission());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testNotice, setTestNotice] = useState<string | null>(null);

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

  const handleToggle = async () => {
    if (!schedule.enabled && permission !== "granted") {
      const newPerm = await requestNotificationPermission();
      setPermission(newPerm);
      if (newPerm !== "granted") {
        setIsModalOpen(true);
        return;
      }
    }

    const updated = { ...schedule, enabled: !schedule.enabled };
    setSchedule(updated);
    saveReminderSchedule(updated, user?.uid);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...schedule, scheduledTime: e.target.value || "08:00" };
    setSchedule(updated);
    saveReminderSchedule(updated, user?.uid);
  };

  const handleDayToggle = (dayIndex: number) => {
    let newDays = [...schedule.activeDays];
    if (newDays.includes(dayIndex)) {
      if (newDays.length > 1) {
        newDays = newDays.filter((d) => d !== dayIndex);
      }
    } else {
      newDays.push(dayIndex);
      newDays.sort((a, b) => a - b);
    }
    const updated = { ...schedule, activeDays: newDays };
    setSchedule(updated);
    saveReminderSchedule(updated, user?.uid);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestNotice(null);
    try {
      const res = await sendTestWorkoutReminder(schedule, user?.displayName);
      setTestNotice(res.message);
      if (res.success) {
        setPermission(getNotificationPermission());
      }
    } catch (e: any) {
      setTestNotice(e?.message || "Failed to trigger alert");
    } finally {
      setIsTesting(false);
      setTimeout(() => setTestNotice(null), 4000);
    }
  };

  const nextOccurrence = getNextScheduledReminderInfo(schedule);

  if (variant === "compact") {
    return (
      <>
        <div className={`p-4 bg-white border border-slate-200 rounded-2xl shadow-xs ${className}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-slate-900">Workout Reminder</p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {formatTime12Hour(schedule.scheduledTime)} ({schedule.enabled ? "Active" : "Paused"})
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Configure
            </button>
          </div>
        </div>
        <WorkoutReminderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className={`bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 ${className}`}>
        
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
                  Scheduled Workout Push Reminders
                </h3>
                {schedule.enabled && permission === "granted" && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Native browser alerts sent at your chosen training times.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              title="Advanced Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                schedule.enabled ? "bg-red-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  schedule.enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Permission Warning / Prompt if Needed */}
        {permission !== "granted" && schedule.enabled && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-amber-950 text-xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Browser permission required to show notifications.</span>
            </div>
            <button
              type="button"
              onClick={async () => {
                const res = await requestNotificationPermission();
                setPermission(res);
              }}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs cursor-pointer shrink-0"
            >
              Allow
            </button>
          </div>
        )}

        {/* Inline Schedule Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Time Picker */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
            <label className="text-[11px] font-mono font-black uppercase text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              <span>Scheduled Daily Time</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={schedule.scheduledTime}
                onChange={handleTimeChange}
                className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:border-red-500 w-36"
              />
              <span className="text-xs font-mono font-bold text-red-600 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
                {formatTime12Hour(schedule.scheduledTime)}
              </span>
            </div>
          </div>

          {/* Active Days */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
            <label className="text-[11px] font-mono font-black uppercase text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-red-600" />
              <span>Workout Days</span>
            </label>
            <div className="flex flex-wrap gap-1">
              {DAYS.map((name, i) => {
                const active = schedule.activeDays.includes(i);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleDayToggle(i)}
                    className={`px-2 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                      active
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Next Occurrence & Test Alert Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              <strong>Next alert:</strong> {nextOccurrence.displaySummary}
            </span>
            {nextOccurrence.timeRemaining && (
              <span className="font-mono text-red-600 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                {nextOccurrence.timeRemaining}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
            className="text-xs font-bold text-slate-700 hover:text-red-600 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{isTesting ? "Testing..." : "Test Push Alert"}</span>
          </button>
        </div>

        {testNotice && (
          <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 animate-fade-in">
            {testNotice}
          </p>
        )}
      </div>

      <WorkoutReminderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
