import React, { useState, useEffect } from "react";
import {
  Bell,
  BellRing,
  Clock,
  Calendar,
  Volume2,
  VolumeX,
  ShieldCheck,
  AlertCircle,
  X,
  Check,
  Zap,
  Sparkles,
  Info,
  Mail
} from "lucide-react";
import {
  WorkoutReminderSchedule,
  getSavedReminderSchedule,
  saveReminderSchedule,
  getNotificationPermission,
  requestNotificationPermission,
  sendTestWorkoutReminder,
  playWorkoutReminderChime,
  formatTime12Hour,
  getNextScheduledReminderInfo,
  PushPermissionStatus
} from "../utils/pushNotificationService";
import { useApp } from "../context/AppContext";

interface WorkoutReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DAYS_OF_WEEK = [
  { id: 0, label: "Sun", name: "Sunday" },
  { id: 1, label: "Mon", name: "Monday" },
  { id: 2, label: "Tue", name: "Tuesday" },
  { id: 3, label: "Wed", name: "Wednesday" },
  { id: 4, label: "Thu", name: "Thursday" },
  { id: 5, label: "Fri", name: "Friday" },
  { id: 6, label: "Sat", name: "Saturday" },
];

const TIME_PRESETS = [
  { label: "06:00 AM", time: "06:00", name: "Early Rise" },
  { label: "08:30 AM", time: "08:30", name: "Morning Shred" },
  { label: "12:30 PM", time: "12:30", name: "Midday Boost" },
  { label: "05:30 PM", time: "17:30", name: "Post-Work Peak" },
  { label: "07:30 PM", time: "19:30", name: "Evening Power" },
];

const LEAD_TIME_OPTIONS = [
  { value: 0, label: "At workout time" },
  { value: 15, label: "15 minutes before" },
  { value: 30, label: "30 minutes before" },
  { value: 60, label: "1 hour before" },
];

export default function WorkoutReminderModal({ isOpen, onClose }: WorkoutReminderModalProps) {
  const { user } = useApp();

  const [schedule, setSchedule] = useState<WorkoutReminderSchedule>(() => getSavedReminderSchedule());
  const [permission, setPermission] = useState<PushPermissionStatus>(() => getNotificationPermission());
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSchedule(getSavedReminderSchedule());
      setPermission(getNotificationPermission());
      setTestResult(null);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    setIsRequestingPermission(true);
    const newPerm = await requestNotificationPermission();
    setPermission(newPerm);
    setIsRequestingPermission(false);

    if (newPerm === "granted") {
      const updated = { ...schedule, enabled: true };
      setSchedule(updated);
      await saveReminderSchedule(updated, user?.uid);
    }
  };

  const handleToggleEnabled = async () => {
    if (!schedule.enabled && permission !== "granted") {
      const newPerm = await requestNotificationPermission();
      setPermission(newPerm);
      if (newPerm !== "granted") {
        return;
      }
    }

    const updated = { ...schedule, enabled: !schedule.enabled };
    setSchedule(updated);
    await saveReminderSchedule(updated, user?.uid);
  };

  const handleDayToggle = (dayId: number) => {
    let newDays = [...schedule.activeDays];
    if (newDays.includes(dayId)) {
      if (newDays.length > 1) {
        newDays = newDays.filter((d) => d !== dayId);
      }
    } else {
      newDays.push(dayId);
      newDays.sort((a, b) => a - b);
    }
    const updated = { ...schedule, activeDays: newDays };
    setSchedule(updated);
    saveReminderSchedule(updated, user?.uid);
  };

  const handleSetQuickDays = (type: "all" | "weekdays" | "weekends") => {
    let days: number[] = [];
    if (type === "all") days = [0, 1, 2, 3, 4, 5, 6];
    else if (type === "weekdays") days = [1, 2, 3, 4, 5];
    else if (type === "weekends") days = [0, 6];

    const updated = { ...schedule, activeDays: days };
    setSchedule(updated);
    saveReminderSchedule(updated, user?.uid);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value || "08:00";
    const updated = { ...schedule, scheduledTime: val };
    setSchedule(updated);
    saveReminderSchedule(updated, user?.uid);
  };

  const handleSelectPreset = (timeStr: string) => {
    const updated = { ...schedule, scheduledTime: timeStr };
    setSchedule(updated);
    saveReminderSchedule(updated, user?.uid);
  };

  const handleLeadTimeChange = (leadMinutes: number) => {
    const updated = { ...schedule, leadTimeMinutes: leadMinutes };
    setSchedule(updated);
    saveReminderSchedule(updated, user?.uid);
  };

  const handleToggleSound = () => {
    const updated = { ...schedule, soundEnabled: !schedule.soundEnabled };
    setSchedule(updated);
    saveReminderSchedule(updated, user?.uid);
    if (updated.soundEnabled) {
      playWorkoutReminderChime();
    }
  };

  const handleSendTestNotification = async () => {
    setIsSendingTest(true);
    setTestResult(null);
    try {
      const result = await sendTestWorkoutReminder(schedule, user?.displayName);
      setTestResult(result);
      if (result.success) {
        setPermission(getNotificationPermission());
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || "Failed to trigger test alert."
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleManualSave = async () => {
    await saveReminderSchedule(schedule, user?.uid);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const nextOccurrence = getNextScheduledReminderInfo(schedule);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh] my-auto animate-scale-in text-slate-900">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white p-5 sm:p-6 flex items-start justify-between border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0 shadow-inner">
              <BellRing className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white font-sans">
                  Daily Workout Reminders
                </h3>
                {schedule.enabled && permission === "granted" && (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Receive browser-based push alerts at your scheduled training times.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">

          {/* Permission Status Banner */}
          {permission === "granted" ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-emerald-950">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold">Browser Push Permission Granted</p>
                  <p className="text-[11px] text-emerald-700">
                    Your browser will alert you at your scheduled workout time.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleEnabled}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  schedule.enabled ? "bg-emerald-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    schedule.enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ) : permission === "denied" ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-950">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-red-900">Notifications Blocked by Browser</p>
                <p className="text-red-700 mt-1 leading-relaxed">
                  To receive daily workout reminders, tap the lock or site settings icon in your browser address bar and change <strong>Notifications</strong> to <strong>Allow</strong>.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-900">Browser Permission Required</p>
                  <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                    Allow notifications to receive daily popups for your training times even when browsing other tabs.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRequestPermission}
                disabled={isRequestingPermission}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-xs shrink-0 flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isRequestingPermission ? "Allowing..." : "Enable Push"}</span>
              </button>
            </div>
          )}

          {/* Section 1: Scheduled Workout Time */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-black uppercase text-slate-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                <span>Scheduled Workout Time</span>
              </label>
              <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                {formatTime12Hour(schedule.scheduledTime)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-48">
                <input
                  type="time"
                  value={schedule.scheduledTime}
                  onChange={handleTimeChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 w-full sm:flex-1">
                {TIME_PRESETS.map((preset) => {
                  const isSelected = schedule.scheduledTime === preset.time;
                  return (
                    <button
                      key={preset.time}
                      type="button"
                      onClick={() => handleSelectPreset(preset.time)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? "bg-red-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      <span>{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Lead Time Alert */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-black uppercase text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Reminder Timing</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LEAD_TIME_OPTIONS.map((opt) => {
                const isSelected = schedule.leadTimeMinutes === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleLeadTimeChange(opt.value)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                      isSelected
                        ? "bg-red-50 text-red-700 border-red-300 ring-1 ring-red-400"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Active Workout Days */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-black uppercase text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-600" />
                <span>Active Workout Days</span>
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSetQuickDays("all")}
                  className="text-[10px] font-bold text-slate-500 hover:text-red-600 bg-slate-100 px-2 py-0.5 rounded-md cursor-pointer"
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickDays("weekdays")}
                  className="text-[10px] font-bold text-slate-500 hover:text-red-600 bg-slate-100 px-2 py-0.5 rounded-md cursor-pointer"
                >
                  Mon-Fri
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickDays("weekends")}
                  className="text-[10px] font-bold text-slate-500 hover:text-red-600 bg-slate-100 px-2 py-0.5 rounded-md cursor-pointer"
                >
                  Sat-Sun
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {DAYS_OF_WEEK.map((day) => {
                const isActive = schedule.activeDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => handleDayToggle(day.id)}
                    className={`py-3 px-1 rounded-xl text-center text-xs font-black transition cursor-pointer flex flex-col items-center gap-1 ${
                      isActive
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    <span>{day.label}</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? "bg-red-500" : "bg-transparent"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Chime Audio Toggle */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={playWorkoutReminderChime}
                title="Preview sound chime"
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-red-600 flex items-center justify-center shrink-0 cursor-pointer transition shadow-2xs"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <div>
                <p className="text-xs font-bold text-slate-900">Audio Chime</p>
                <p className="text-[11px] text-slate-500">
                  Plays a high-frequency athletic audio chime alongside browser notification.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleSound}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                schedule.soundEnabled
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-white text-slate-400 border-slate-200"
              }`}
            >
              {schedule.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{schedule.soundEnabled ? "On" : "Muted"}</span>
            </button>
          </div>

          {/* Section 5: Direct Email Workout Dispatches */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <Mail className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Direct Email Dispatches</p>
                  <p className="text-[11px] text-slate-500">
                    Deliver morning workout alerts directly to your personal email based on your program & tracking.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const updated = {
                    ...schedule,
                    emailNotificationsEnabled: schedule.emailNotificationsEnabled !== false ? false : true,
                    notificationEmail: schedule.notificationEmail || user?.email || ""
                  };
                  setSchedule(updated);
                  saveReminderSchedule(updated, user?.uid);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  schedule.emailNotificationsEnabled !== false
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-white text-slate-400 border-slate-200"
                }`}
              >
                <span>{schedule.emailNotificationsEnabled !== false ? "Enabled" : "Disabled"}</span>
              </button>
            </div>

            {schedule.emailNotificationsEnabled !== false && (
              <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="email"
                  placeholder="Enter email for daily workout dispatches"
                  value={schedule.notificationEmail ?? (user?.email || "")}
                  onChange={(e) => {
                    const updated = { ...schedule, notificationEmail: e.target.value };
                    setSchedule(updated);
                  }}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-sans"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (schedule.notificationEmail) {
                      localStorage.setItem("alexfit_reminder_email", schedule.notificationEmail);
                    }
                    saveReminderSchedule(schedule, user?.uid);
                  }}
                  className="w-full sm:w-auto px-3 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase rounded-xl tracking-wider shrink-0 cursor-pointer"
                >
                  Save Email
                </button>
              </div>
            )}
          </div>

          {/* Next Reminder Occurrence Display */}
          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-700 font-medium">
              <Clock className="w-4 h-4 text-red-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">Next Reminder: </span>
                <span>{nextOccurrence.displaySummary}</span>
              </div>
            </div>
            {nextOccurrence.timeRemaining && (
              <span className="font-mono font-bold text-red-700 bg-white/80 px-2.5 py-1 rounded-lg border border-red-200/60 shrink-0">
                {nextOccurrence.timeRemaining}
              </span>
            )}
          </div>

          {/* Test Status Toast */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                testResult.success
                  ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                  : "bg-amber-50 text-amber-900 border border-amber-200"
              }`}
            >
              {testResult.success ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <p className="leading-relaxed">{testResult.message}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSendTestNotification}
            disabled={isSendingTest}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{isSendingTest ? "Testing..." : "Send Test Push Alert"}</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleManualSave}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Reminder</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
