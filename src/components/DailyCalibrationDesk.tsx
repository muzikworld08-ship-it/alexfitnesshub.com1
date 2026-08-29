import React, { useState, useMemo, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, Droplet, Moon, Heart, Sparkles, CheckCircle2, 
  Info, Clock, Flame, Trash2, Calendar, AlertCircle, 
  TrendingUp, Zap, Award, ArrowUpRight, BarChart3, Plus, Minus,
  Target, Settings2, Sliders, Check, RefreshCw
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart
} from "recharts";
import { calculateReadinessScore, ReadinessCalculationResult } from "../utils/readiness";
import { VitalsLog, CalibrationGoals } from "../types";

export default function DailyCalibrationDesk() {
  const { 
    vitalsLogs, 
    addVitalsLogAction, 
    deleteVitalsLogAction, 
    calibrationGoals, 
    updateCalibrationGoalsAction,
    theme, 
    user 
  } = useApp();

  // Reminder & Fast-Hydration Local States
  const [remTime, setRemTime] = useState(() => localStorage.getItem("alexfit_reminder_time") || "08:00");
  const [liveGlasses, setLiveGlasses] = useState(() => parseInt(localStorage.getItem("alexfit_hydration_today") || "8", 10));

  // Form State for Vitals Checkpoint
  const [logDate, setLogDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [sleepHours, setSleepHours] = useState<number | string>(7.5);
  const [hydrationInput, setHydrationInput] = useState<number | string>(8);
  const [heartRateInput, setHeartRateInput] = useState<number | string>("");
  const [energyLevel, setEnergyLevel] = useState<number>(4);
  const [notesInput, setNotesInput] = useState<string>("");
  
  // Goals Configuration Form State
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [goalHydration, setGoalHydration] = useState<number>(calibrationGoals?.dailyHydrationGoal || 10);
  const [goalSleep, setGoalSleep] = useState<number>(calibrationGoals?.dailySleepGoal || 8.0);
  const [goalReadiness, setGoalReadiness] = useState<number>(calibrationGoals?.targetReadinessScore || 85);
  const [goalRestingHR, setGoalRestingHR] = useState<number>(calibrationGoals?.targetRestingHeartRate || 60);
  const [savingGoals, setSavingGoals] = useState(false);
  const [goalsSuccessMsg, setGoalsSuccessMsg] = useState<string | null>(null);

  // Sync goal inputs with context changes
  useEffect(() => {
    if (calibrationGoals) {
      setGoalHydration(calibrationGoals.dailyHydrationGoal || 10);
      setGoalSleep(calibrationGoals.dailySleepGoal || 8.0);
      setGoalReadiness(calibrationGoals.targetReadinessScore || 85);
      setGoalRestingHR(calibrationGoals.targetRestingHeartRate || 60);
    }
  }, [calibrationGoals]);

  // UI Interaction States
  const [loggingInProgress, setLoggingInProgress] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"7" | "14" | "30" | "all">("14");

  // Today's Date representation
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Today's logged record (or latest fallback)
  const todayLog = useMemo<VitalsLog | null>(() => {
    if (!vitalsLogs || vitalsLogs.length === 0) return null;
    const found = vitalsLogs.find(l => l.date === todayStr);
    return found || null;
  }, [vitalsLogs, todayStr]);

  // Latest logged record
  const latestLog = useMemo<VitalsLog | null>(() => {
    if (!vitalsLogs || vitalsLogs.length === 0) return null;
    return [...vitalsLogs].sort((a, b) => b.date.localeCompare(a.date))[0];
  }, [vitalsLogs]);

  // Current active numbers for today's progress
  const currentTodayHydration = todayLog ? (todayLog.hydrationGlasses || 0) : liveGlasses;
  const currentTodaySleep = todayLog ? todayLog.sleepDuration : (typeof sleepHours === "number" ? sleepHours : parseFloat(sleepHours as string) || 0);
  const currentTodayReadiness = todayLog 
    ? (todayLog.readinessScore || calculateReadinessScore(todayLog.sleepDuration, todayLog.hydrationGlasses || 8, todayLog.restingHeartRate, todayLog.energyLevel).score)
    : calculateReadinessScore(currentTodaySleep, currentTodayHydration).score;

  // Calculated Real-time Preview for form
  const previewReadiness = useMemo<ReadinessCalculationResult>(() => {
    const s = typeof sleepHours === "number" ? sleepHours : parseFloat(sleepHours as string) || 0;
    const h = typeof hydrationInput === "number" ? hydrationInput : parseInt(hydrationInput as string, 10) || 0;
    const hr = heartRateInput ? parseInt(heartRateInput as string, 10) : undefined;
    return calculateReadinessScore(s, h, hr, energyLevel);
  }, [sleepHours, hydrationInput, heartRateInput, energyLevel]);

  // Historical Averages
  const stats = useMemo(() => {
    if (!vitalsLogs || vitalsLogs.length === 0) {
      return { avgReadiness: 85, avgSleep: 7.5, avgHydration: 8, totalLogs: 0 };
    }
    const recent = vitalsLogs.slice(-7);
    const sumReadiness = recent.reduce((acc, curr) => {
      const r = curr.readinessScore || calculateReadinessScore(curr.sleepDuration, curr.hydrationGlasses || 8, curr.restingHeartRate, curr.energyLevel).score;
      return acc + r;
    }, 0);
    const sumSleep = recent.reduce((acc, curr) => acc + (curr.sleepDuration || 0), 0);
    const sumHydration = recent.reduce((acc, curr) => acc + (curr.hydrationGlasses || 8), 0);

    return {
      avgReadiness: Math.round(sumReadiness / recent.length),
      avgSleep: parseFloat((sumSleep / recent.length).toFixed(1)),
      avgHydration: parseFloat((sumHydration / recent.length).toFixed(1)),
      totalLogs: vitalsLogs.length
    };
  }, [vitalsLogs]);

  // Filtered Chart Data
  const chartData = useMemo(() => {
    if (!vitalsLogs || vitalsLogs.length === 0) return [];
    let list = [...vitalsLogs].sort((a, b) => a.date.localeCompare(b.date));
    if (timeRange === "7") list = list.slice(-7);
    else if (timeRange === "14") list = list.slice(-14);
    else if (timeRange === "30") list = list.slice(-30);

    return list.map(log => {
      const s = log.sleepDuration || 0;
      const h = log.hydrationGlasses || 8;
      const hr = log.restingHeartRate;
      const score = log.readinessScore || calculateReadinessScore(s, h, hr, log.energyLevel).score;
      return {
        date: log.date.length > 5 ? log.date.substring(5) : log.date,
        fullDate: log.date,
        "Readiness Score": score,
        "Sleep (Hours)": s,
        "Hydration (Glasses)": h,
        "Resting HR (BPM)": hr || null,
        "Sleep Target": calibrationGoals?.dailySleepGoal || 8.0,
        "Hydration Target": calibrationGoals?.dailyHydrationGoal || 10
      };
    });
  }, [vitalsLogs, timeRange, calibrationGoals]);

  const saveReminder = (time: string) => {
    setRemTime(time);
    localStorage.setItem("alexfit_reminder_time", time);
  };

  const handleLiveGlassChange = (diff: number) => {
    const next = Math.max(0, liveGlasses + diff);
    setLiveGlasses(next);
    localStorage.setItem("alexfit_hydration_today", String(next));
    setHydrationInput(next);

    // If today already has a log, update it synchronously in context/Firestore
    if (todayLog) {
      addVitalsLogAction({
        ...todayLog,
        hydrationGlasses: next,
        date: todayStr
      }).catch(err => console.warn("Failed to auto-update today's hydration in log:", err));
    }
  };

  // Save Calibration Goals to Firestore
  const handleSaveGoals = async (e: React.FormEvent) => {
    e.preventDefault();
    if (goalHydration < 1 || goalHydration > 40) {
      alert("Please enter a hydration goal between 1 and 40 glasses.");
      return;
    }
    if (goalSleep < 3 || goalSleep > 16) {
      alert("Please enter a sleep goal between 3 and 16 hours.");
      return;
    }

    setSavingGoals(true);
    try {
      await updateCalibrationGoalsAction({
        dailyHydrationGoal: Number(goalHydration),
        dailySleepGoal: Number(goalSleep),
        targetReadinessScore: Number(goalReadiness),
        targetRestingHeartRate: Number(goalRestingHR)
      });
      setGoalsSuccessMsg("Daily calibration targets securely stored in Firestore!");
      setTimeout(() => {
        setGoalsSuccessMsg(null);
        setShowGoalsModal(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to save goals:", err);
      alert("Failed to save goals to database. Please try again.");
    } finally {
      setSavingGoals(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const s = typeof sleepHours === "number" ? sleepHours : parseFloat(sleepHours as string);
    const h = typeof hydrationInput === "number" ? hydrationInput : parseInt(hydrationInput as string, 10);
    const hr = heartRateInput ? parseInt(heartRateInput as string, 10) : undefined;

    if (isNaN(s) || s < 0 || s > 24) {
      setErrorMessage("Please specify a realistic sleep duration between 0 and 24 hours.");
      return;
    }
    if (isNaN(h) || h < 0 || h > 40) {
      setErrorMessage("Please enter daily hydration between 0 and 40 glasses (approx. 0 - 10 Liters).");
      return;
    }
    if (hr !== undefined && (isNaN(hr) || hr < 30 || hr > 220)) {
      setErrorMessage("Resting heart rate must be between 30 and 220 bpm if provided.");
      return;
    }

    setLoggingInProgress(true);
    try {
      await addVitalsLogAction({
        sleepDuration: s,
        hydrationGlasses: h,
        restingHeartRate: hr,
        energyLevel,
        notes: notesInput.trim() || undefined,
        date: logDate
      });

      // Update local quick hydration tracker to match if date is today
      if (logDate === todayStr) {
        setLiveGlasses(h);
        localStorage.setItem("alexfit_hydration_today", String(h));
      }

      setSuccessToast(`Logged checkpoint for ${logDate}! Calculated Readiness Score: ${previewReadiness.score}%`);
      setTimeout(() => setSuccessToast(null), 5000);
      setNotesInput("");
    } catch (err: any) {
      console.error("Failed to store vitals in Firestore:", err);
      setErrorMessage("Failed to synchronize with Firestore database. Please try again.");
    } finally {
      setLoggingInProgress(false);
    }
  };

  const handleDeleteLog = async (logId: string, date: string) => {
    if (window.confirm(`Are you sure you want to delete the calibration checkpoint for ${date}?`)) {
      try {
        await deleteVitalsLogAction(logId);
      } catch (err) {
        console.error("Error deleting log:", err);
      }
    }
  };

  // Progress Calculations against Firestore targets
  const hydGoal = calibrationGoals?.dailyHydrationGoal || 10;
  const hydCurrent = currentTodayHydration;
  const hydPct = Math.min(100, Math.round((hydCurrent / hydGoal) * 100));
  const hydRemaining = Math.max(0, hydGoal - hydCurrent);
  const hydSurplus = hydCurrent > hydGoal ? hydCurrent - hydGoal : 0;

  const slpGoal = calibrationGoals?.dailySleepGoal || 8.0;
  const slpCurrent = currentTodaySleep;
  const slpPct = Math.min(100, Math.round((slpCurrent / slpGoal) * 100));
  const slpDiff = parseFloat((slpCurrent - slpGoal).toFixed(1));

  const readTarget = calibrationGoals?.targetReadinessScore || 85;
  const readCurrent = currentTodayReadiness;
  const readPct = Math.min(100, Math.round((readCurrent / readTarget) * 100));

  // Combined Daily Calibration Score (Weighted average of Hydration and Sleep)
  const combinedComplianceScore = Math.min(100, Math.round((hydPct * 0.5) + (slpPct * 0.5)));

  return (
    <div className="space-y-8 animate-fade-in" id="daily_calibration_desk_container">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-[#D32F2F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D32F2F]/20 border border-[#D32F2F]/40 text-[#ff6b6b] text-[10px] font-extrabold uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5" />
            Physiological Diagnostics Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
            Daily <span className="text-[#D32F2F]">Calibration & Target Tracking</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Configure custom hydration and sleep targets stored directly in Firestore. Monitor real-time progress bars against today's biometric checkpoints and kinetic readiness scores.
          </p>
        </div>

        {/* Action Button & Quick Average Widget */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setShowGoalsModal(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-black uppercase tracking-wider shadow-md shadow-red-500/20 transition cursor-pointer"
            id="configure_targets_button"
          >
            <Sliders className="w-4 h-4" />
            <span>Set Daily Targets</span>
          </button>

          <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur-md p-3.5 px-4 rounded-2xl border border-slate-700/60">
            <div className="text-center px-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">7-Day Readiness</span>
              <span className="text-xl font-black text-[#D32F2F] font-mono">{stats.avgReadiness}%</span>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div className="text-center px-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Avg Sleep</span>
              <span className="text-xl font-black text-blue-400 font-mono">{stats.avgSleep}h</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TODAY'S TARGET PROGRESS BARS & FIRESTORE TARGETS SUMMARY (PROMINENT SECTION) */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6" id="today_target_progress_section">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  Today's Target Progress & Goal Adherence
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono font-bold">
                  {todayStr}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Live compliance progress bars calculated against your Firestore targets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Daily Compliance:</span>
              <span className={`text-xs font-mono font-black ${combinedComplianceScore >= 100 ? 'text-emerald-500' : combinedComplianceScore >= 75 ? 'text-blue-500' : 'text-amber-500'}`}>
                {combinedComplianceScore}%
              </span>
            </div>
            <button
              onClick={() => setShowGoalsModal(true)}
              className="text-xs font-bold text-[#D32F2F] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Settings2 className="w-3.5 h-3.5" />
              Adjust Targets
            </button>
          </div>
        </div>

        {/* Progress Bars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Daily Hydration Progress */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/60 to-white dark:from-slate-850 dark:to-slate-900 border border-blue-100 dark:border-blue-900/40 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Droplet className="w-4 h-4 fill-blue-500/20" />
                <span className="text-xs font-black uppercase tracking-wider">Hydration Protocol</span>
              </div>
              <span className="text-xs font-mono font-black text-blue-600 dark:text-blue-400">
                {hydPct}%
              </span>
            </div>

            {/* Main Progress Metric */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {hydCurrent}
                </span>
                <span className="text-xs font-bold text-slate-400 ml-1">
                  / {hydGoal} glasses ({hydGoal * 0.25}L)
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {(hydCurrent * 0.25).toFixed(2)}L logged
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
              <motion.div 
                className={`h-full rounded-full transition-all duration-500 ${
                  hydPct >= 100 
                    ? 'bg-gradient-to-r from-blue-500 to-emerald-500' 
                    : 'bg-blue-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${hydPct}%` }}
              />
            </div>

            {/* Status Footer & Quick Controls */}
            <div className="flex items-center justify-between text-[11px] font-medium pt-1">
              {hydPct >= 100 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Target Met! {hydSurplus > 0 ? `(+${hydSurplus} glass surplus)` : ""}
                </span>
              ) : (
                <span className="text-blue-700 dark:text-blue-300 font-semibold">
                  💧 {hydRemaining} glass{hydRemaining > 1 ? 'es' : ''} ({hydRemaining * 0.25}L) remaining
                </span>
              )}
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => handleLiveGlassChange(-1)}
                  className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                  title="Minus 1 glass"
                >
                  -
                </button>
                <button
                  onClick={() => handleLiveGlassChange(1)}
                  className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xs font-bold hover:bg-blue-600 transition cursor-pointer shadow-xs"
                  title="Add 1 glass"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 2. Daily Sleep Progress */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-white dark:from-slate-850 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/40 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Moon className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wider">Restorative Sleep</span>
              </div>
              <span className="text-xs font-mono font-black text-indigo-600 dark:text-indigo-400">
                {slpPct}%
              </span>
            </div>

            {/* Main Progress Metric */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {slpCurrent}
                </span>
                <span className="text-xs font-bold text-slate-400 ml-1">
                  / {slpGoal} hrs target
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {slpDiff >= 0 ? `+${slpDiff}h surplus` : `${slpDiff}h deficit`}
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
              <motion.div 
                className={`h-full rounded-full transition-all duration-500 ${
                  slpPct >= 100 
                    ? 'bg-gradient-to-r from-indigo-500 to-emerald-500' 
                    : 'bg-indigo-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${slpPct}%` }}
              />
            </div>

            {/* Status Footer */}
            <div className="flex items-center justify-between text-[11px] font-medium pt-1">
              {slpPct >= 100 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Target Rest Achieved!
                </span>
              ) : (
                <span className="text-indigo-700 dark:text-indigo-300 font-semibold">
                  🌙 {Math.abs(slpDiff)}h under target sleep
                </span>
              )}
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {todayLog ? "Logged Today" : "Estimated Checkpoint"}
              </span>
            </div>
          </div>

          {/* 3. Kinetic Readiness vs Target Threshold */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-red-50/60 to-white dark:from-slate-850 dark:to-slate-900 border border-red-100 dark:border-red-900/40 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#D32F2F]">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wider">Kinetic Readiness</span>
              </div>
              <span className="text-xs font-mono font-black text-[#D32F2F]">
                {readPct}%
              </span>
            </div>

            {/* Main Progress Metric */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {readCurrent}%
                </span>
                <span className="text-xs font-bold text-slate-400 ml-1">
                  / {readTarget}% target
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {readCurrent >= readTarget ? "Optimal Capacity" : "Recovery State"}
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
              <motion.div 
                className={`h-full rounded-full transition-all duration-500 ${
                  readCurrent >= readTarget 
                    ? 'bg-gradient-to-r from-[#D32F2F] to-emerald-500' 
                    : 'bg-[#D32F2F]'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${readPct}%` }}
              />
            </div>

            {/* Status Footer */}
            <div className="flex items-center justify-between text-[11px] font-medium pt-1">
              <span className="text-slate-600 dark:text-slate-300 font-semibold truncate">
                {readCurrent >= 80 ? "⚡ High Training Capacity" : "🔋 Focus On Recovery"}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Goal: {readTarget}%+
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GOALS SETTING MODAL / DRAWER */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showGoalsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-[#D32F2F]/10 text-[#D32F2F]">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                      Daily Calibration Targets
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Configured targets are synced and stored in Firestore database
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGoalsModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-xs font-bold transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {goalsSuccessMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{goalsSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveGoals} className="space-y-5" id="calibration_goals_form">
                {/* Hydration Goal Setting */}
                <div className="space-y-2 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                      <Droplet className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                      Daily Hydration Target (Glasses)
                    </label>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      {(goalHydration * 0.25).toFixed(1)} Liters / Day
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGoalHydration(prev => Math.max(4, prev - 1))}
                      className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 font-bold hover:bg-blue-100 transition cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input 
                      type="number"
                      min="4"
                      max="40"
                      value={goalHydration}
                      onChange={(e) => setGoalHydration(parseInt(e.target.value, 10) || 0)}
                      className="flex-1 p-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 text-center font-mono font-black text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setGoalHydration(prev => Math.min(40, prev + 1))}
                      className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold hover:bg-blue-600 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Preset goal chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[8, 10, 12, 14, 16].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGoalHydration(g)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer ${
                          goalHydration === g 
                            ? "bg-blue-600 text-white" 
                            : "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80"
                        }`}
                      >
                        {g} glasses ({g * 0.25}L)
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sleep Goal Setting */}
                <div className="space-y-2 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                      <Moon className="w-4 h-4 text-indigo-500" />
                      Daily Sleep Target (Hours)
                    </label>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      Rest Goal
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGoalSleep(prev => Math.max(4, parseFloat((prev - 0.5).toFixed(1))))}
                      className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 font-bold hover:bg-indigo-100 transition cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input 
                      type="number"
                      step="0.1"
                      min="4"
                      max="16"
                      value={goalSleep}
                      onChange={(e) => setGoalSleep(parseFloat(e.target.value) || 0)}
                      className="flex-1 p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-center font-mono font-black text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setGoalSleep(prev => Math.min(16, parseFloat((prev + 0.5).toFixed(1))))}
                      className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold hover:bg-indigo-600 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Preset sleep chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setGoalSleep(s)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer ${
                          goalSleep === s 
                            ? "bg-indigo-600 text-white" 
                            : "bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80"
                        }`}
                      >
                        {s} hrs
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Target Readiness Threshold */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-500">
                      Target Readiness (%)
                    </label>
                    <input 
                      type="number"
                      min="50"
                      max="100"
                      value={goalReadiness}
                      onChange={(e) => setGoalReadiness(parseInt(e.target.value, 10) || 85)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-mono font-bold text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-500">
                      Target Resting HR (BPM)
                    </label>
                    <input 
                      type="number"
                      min="40"
                      max="100"
                      value={goalRestingHR}
                      onChange={(e) => setGoalRestingHR(parseInt(e.target.value, 10) || 60)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-mono font-bold text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGoalsModal(false)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingGoals}
                    className="flex-1 py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-black uppercase tracking-wider shadow-md shadow-red-500/20 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    {savingGoals ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Targets</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Grid: Data Entry Form + Live Readiness Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Data Entry Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#D32F2F]/10 text-[#D32F2F]">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  Log Daily Biometrics Checkpoint
                </h2>
                <p className="text-[11px] text-slate-500">
                  Record daily outputs to calibrate progress bars and kinetic readiness
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 rounded-full text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Firestore Connected
            </div>
          </div>

          {/* Form Success / Error Messages */}
          {successToast && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-3 font-semibold"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successToast}</span>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-center gap-3 font-semibold"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6" id="daily_calibration_form">
            {/* Date Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#D32F2F]" />
                Calibration Date Checkpoint
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="date"
                  required
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="flex-1 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:ring-2 focus:ring-[#D32F2F] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setLogDate(todayStr)}
                  className="px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Today
                </button>
              </div>
            </div>

            {/* Hydration Input with Presets */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                  Daily Hydration (Glasses / Water Intake)
                </label>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  Target: {hydGoal} glasses ({(hydGoal * 0.25).toFixed(1)}L)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setHydrationInput(prev => Math.max(0, (typeof prev === "number" ? prev : parseInt(prev as string, 10) || 0) - 1))}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold hover:bg-blue-100 transition cursor-pointer shrink-0 shadow-xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input 
                  type="number"
                  required
                  min="0"
                  max="40"
                  value={hydrationInput}
                  onChange={(e) => setHydrationInput(e.target.value)}
                  className="flex-1 p-3 rounded-2xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 text-center text-base font-mono font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. 8"
                />
                <button
                  type="button"
                  onClick={() => setHydrationInput(prev => Math.min(40, (typeof prev === "number" ? prev : parseInt(prev as string, 10) || 0) + 1))}
                  className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold hover:bg-blue-600 transition cursor-pointer shrink-0 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Hydration Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[6, 8, 10, 12, 14].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setHydrationInput(g)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition cursor-pointer ${
                      Number(hydrationInput) === g 
                        ? "bg-blue-600 text-white shadow-xs" 
                        : "bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 hover:bg-blue-100/60"
                    }`}
                  >
                    {g} Glasses ({(g * 0.25).toFixed(1)}L)
                  </button>
                ))}
              </div>
            </div>

            {/* Sleep Hours Input with Presets */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-500" />
                  Sleep Duration (Hours)
                </label>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  Target: {slpGoal} hours
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="number"
                  required
                  min="0"
                  max="24"
                  step="0.1"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-center text-base font-mono font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g. 7.5"
                />
              </div>

              {/* Quick Sleep Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[6.0, 7.0, 7.5, 8.0, 8.5, 9.0].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSleepHours(s)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition cursor-pointer ${
                      Number(sleepHours) === s 
                        ? "bg-indigo-600 text-white shadow-xs" 
                        : "bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/60"
                    }`}
                  >
                    {s} hrs
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Biometrics: Resting Heart Rate & Energy Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#D32F2F]" />
                  Resting Heart Rate (BPM) <span className="text-[9px] text-slate-400 font-normal">(Optional)</span>
                </label>
                <input 
                  type="number"
                  min="30"
                  max="220"
                  value={heartRateInput}
                  onChange={(e) => setHeartRateInput(e.target.value)}
                  placeholder="e.g. 62"
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:ring-2 focus:ring-[#D32F2F] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Subjective Energy Level
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setEnergyLevel(lvl)}
                      className={`py-2.5 rounded-xl text-xs font-black transition cursor-pointer flex flex-col items-center justify-center ${
                        energyLevel === lvl 
                          ? "bg-amber-500 text-white shadow-xs" 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      <span>{lvl === 1 ? "😴" : lvl === 2 ? "🥱" : lvl === 3 ? "⚡" : lvl === 4 ? "🔥" : "🚀"}</span>
                      <span className="text-[9px] mt-0.5">{lvl}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional Athlete Notes */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Athlete Vitals Notes & Electrolyte Status <span className="text-[9px] text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea 
                rows={2}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="e.g. Took magnesium & lemon cucumber water, woke up with high energy and restored readiness."
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#D32F2F] focus:outline-none resize-none"
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loggingInProgress}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#D32F2F] hover:bg-[#B71C1C] disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-sans font-black uppercase text-xs tracking-wider shadow-lg shadow-red-500/20 transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loggingInProgress ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Syncing to Firestore Database...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Log & Calculate Readiness Score</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Live Readiness Score Card & Recovery Prescription */}
        <div className="lg:col-span-5 space-y-6">
          {/* Real-time Dynamic Readiness Score Preview */}
          <div className={`p-6 sm:p-7 rounded-3xl border shadow-sm transition-all duration-300 space-y-5 bg-white dark:bg-slate-900 ${previewReadiness.borderClass}`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Live Readiness Calculation
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border ${previewReadiness.badgeClass}`}>
                {previewReadiness.label}
              </span>
            </div>

            {/* Prominent Score Gauge */}
            <div className="flex items-center justify-between gap-4 py-2">
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className={`text-5xl font-black font-mono tracking-tight ${previewReadiness.colorClass}`}>
                    {previewReadiness.score}
                  </span>
                  <span className="text-base font-bold text-slate-400">/ 100</span>
                </div>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Neuromuscular Kinetic Index
                </p>
              </div>

              {/* Radial Meter Visual */}
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={previewReadiness.colorClass}
                    strokeDasharray={`${previewReadiness.score}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className={`w-5 h-5 ${previewReadiness.colorClass}`} />
                </div>
              </div>
            </div>

            {/* Metric Breakdown Bars */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-500">Sleep Score ({sleepHours} hrs vs {slpGoal}h goal)</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">{previewReadiness.breakdown.sleepScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${previewReadiness.breakdown.sleepScore}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-500">Hydration Factor ({hydrationInput} / {hydGoal} glasses)</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">{previewReadiness.breakdown.hydrationScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${previewReadiness.breakdown.hydrationScore}%` }}
                  />
                </div>
              </div>

              {previewReadiness.breakdown.heartRateScore !== undefined && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-500">Resting HR Factor ({heartRateInput} bpm)</span>
                    <span className="text-red-600 dark:text-red-400 font-mono">{previewReadiness.breakdown.heartRateScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-red-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${previewReadiness.breakdown.heartRateScore}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Coach Prescription Callout */}
            <div className={`p-4 rounded-2xl text-xs leading-relaxed font-medium ${previewReadiness.bgClass} ${previewReadiness.colorClass}`}>
              <div className="flex items-center gap-2 font-bold mb-1 uppercase tracking-wider text-[10px]">
                <Award className="w-4 h-4" />
                Training Intensity Prescription
              </div>
              {previewReadiness.recommendation}
            </div>
          </div>

          {/* Quick Target Settings Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-850 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-[#D32F2F]" />
                Active Firestore Targets
              </h3>
              <button
                onClick={() => setShowGoalsModal(true)}
                className="text-[10px] uppercase font-black tracking-wider text-[#D32F2F] hover:underline cursor-pointer"
              >
                Edit Targets
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                <span className="text-[9px] font-black uppercase text-blue-500 block">Hydration Target</span>
                <span className="text-lg font-black font-mono text-blue-950 dark:text-blue-200">
                  {hydGoal} <span className="text-[10px] font-normal text-blue-600">glasses</span>
                </span>
                <span className="text-[9px] text-blue-600/80 block mt-0.5">{(hydGoal * 0.25).toFixed(1)}L per day</span>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
                <span className="text-[9px] font-black uppercase text-indigo-500 block">Sleep Target</span>
                <span className="text-lg font-black font-mono text-indigo-950 dark:text-indigo-200">
                  {slpGoal} <span className="text-[10px] font-normal text-indigo-600">hours</span>
                </span>
                <span className="text-[9px] text-indigo-600/80 block mt-0.5">Restorative sleep</span>
              </div>
            </div>

            {/* Reminder Setting */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#D32F2F]" />
                Daily Alert Time
              </span>
              <input 
                type="time" 
                value={remTime}
                onChange={(e) => saveReminder(e.target.value)}
                className="p-1.5 px-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#D32F2F]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BIOMETRIC RECOVERY SLOPE (Recharts Analytics with Target Lines) */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#D32F2F]" />
              <h2 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                Biometric Recovery Trends & Readiness Trajectory
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Interactive timeline visualizer tracking sleep duration, cellular hydration, and readiness scores compared against targets.
            </p>
          </div>

          {/* Time Range Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl shrink-0">
            {(["7", "14", "30", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition cursor-pointer ${
                  timeRange === range
                    ? "bg-[#D32F2F] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                {range === "all" ? "All Time" : `${range} Days`}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Curve */}
        <div className="w-full h-[320px] flex items-center justify-center">
          {chartData.length === 0 ? (
            <div className="text-center p-8 space-y-2">
              <Activity className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-400 italic">No biometric logs recorded yet. Use the form above to log your first checkpoint.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="readinessGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D32F2F" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#D32F2F" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#1F2937" : "#e2e8f0"} className="opacity-60" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis yAxisId="score" domain={[0, 100]} stroke="#D32F2F" fontSize={10} tickLine={false} />
                <YAxis yAxisId="secondary" orientation="right" domain={[0, 14]} stroke="#0ea5e9" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff", 
                    color: theme === "dark" ? "#f8fafc" : "#0f172a", 
                    borderRadius: '16px', 
                    border: theme === "dark" ? "1px solid #1e293b" : "1px solid #e2e8f0", 
                    fontSize: '11px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                <Area yAxisId="score" name="Readiness Score (0-100)" type="monotone" dataKey="Readiness Score" stroke="#D32F2F" strokeWidth={3} fill="url(#readinessGradient)" activeDot={{ r: 6 }} dot={{ r: 3 }} />
                <Line yAxisId="secondary" name="Sleep (Hours)" type="monotone" dataKey="Sleep (Hours)" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line yAxisId="secondary" name="Hydration (Glasses)" type="monotone" dataKey="Hydration (Glasses)" stroke="#0ea5e9" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2.5 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HISTORICAL CHECKPOINTS AUDIT LOG TABLE */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D32F2F]" />
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Historical Checkpoints Audit Log
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">
            {vitalsLogs.length} Records Stored in Firestore
          </span>
        </div>

        {vitalsLogs.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center italic">No checkpoints logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Readiness Score</th>
                  <th className="py-3 px-4">Sleep Hours</th>
                  <th className="py-3 px-4">Hydration</th>
                  <th className="py-3 px-4">Resting HR</th>
                  <th className="py-3 px-4">Energy</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[...vitalsLogs].reverse().map((log) => {
                  const s = log.sleepDuration || 7.5;
                  const h = log.hydrationGlasses || 8;
                  const hr = log.restingHeartRate;
                  const score = log.readinessScore || calculateReadinessScore(s, h, hr, log.energyLevel).score;
                  const res = calculateReadinessScore(s, h, hr, log.energyLevel);

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {log.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black font-mono border ${res.badgeClass}`}>
                          {score}% • {res.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-indigo-600 dark:text-indigo-400 font-bold whitespace-nowrap">
                        {s} hrs
                      </td>
                      <td className="py-3.5 px-4 font-mono text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap">
                        {h} glasses ({(h * 0.25).toFixed(1)}L)
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {hr ? `${hr} bpm` : "—"}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {log.energyLevel ? `${"⭐".repeat(log.energyLevel)}` : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-[200px] truncate" title={log.notes}>
                        {log.notes || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteLog(log.id, log.date)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                          title="Delete Checkpoint"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
