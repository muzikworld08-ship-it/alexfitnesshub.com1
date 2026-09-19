import React, { useState, useMemo, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Activity, Droplets, Utensils, Dumbbell, Flame, Heart, 
  Calendar, CheckCircle2, TrendingUp, Plus, Trash2, Clock, 
  Award, ArrowUpRight, Bell, Sparkles, AlertCircle, ChevronRight
} from "lucide-react";
import { checkAndTriggerSevenDayProgressReminder } from "../utils/pushNotificationService";

interface CardioLog {
  id: string;
  type: string;
  durationMinutes: number;
  distanceKm?: number;
  caloriesBurned: number;
  date: string;
  notes?: string;
}

interface MealLog {
  id: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack" | "Pre-Workout" | "Post-Workout";
  foodItems: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  date: string;
}

export default function ProgressTrackerView({ setView }: { setView?: (view: string) => void }) {
  const { user, activityLogs, vitalsLogs, addVitalsLogAction } = useApp();

  const [activeTab, setActiveTab] = useState<"overview" | "workouts" | "cardio" | "water" | "meals" | "weekly">("overview");

  // Local persistence for cardio & meals logs
  const [cardioLogs, setCardioLogs] = useState<CardioLog[]>(() => {
    try {
      const saved = localStorage.getItem(`alexfit_cardio_logs_${user?.uid || "guest"}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "cardio_1",
        type: "5KM Road Running",
        durationMinutes: 28,
        distanceKm: 5.0,
        caloriesBurned: 380,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        notes: "Consistent cadence, steady pace."
      },
      {
        id: "cardio_2",
        type: "HIIT Jump Rope",
        durationMinutes: 18,
        distanceKm: 0,
        caloriesBurned: 220,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Tabata style 45s work / 15s rest."
      }
    ];
  });

  const [mealLogs, setMealLogs] = useState<MealLog[]>(() => {
    try {
      const saved = localStorage.getItem(`alexfit_meal_logs_${user?.uid || "guest"}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "meal_1",
        mealType: "Breakfast",
        foodItems: "Oatmeal with whey protein, chia seeds & banana",
        calories: 520,
        proteinGrams: 42,
        carbsGrams: 68,
        fatGrams: 10,
        date: new Date().toISOString()
      },
      {
        id: "meal_2",
        mealType: "Lunch",
        foodItems: "Grilled chicken breast with brown rice & broccoli",
        calories: 640,
        proteinGrams: 55,
        carbsGrams: 70,
        fatGrams: 12,
        date: new Date().toISOString()
      }
    ];
  });

  // Save cardio & meal logs
  useEffect(() => {
    try {
      localStorage.setItem(`alexfit_cardio_logs_${user?.uid || "guest"}`, JSON.stringify(cardioLogs));
    } catch {}
  }, [cardioLogs, user?.uid]);

  useEffect(() => {
    try {
      localStorage.setItem(`alexfit_meal_logs_${user?.uid || "guest"}`, JSON.stringify(mealLogs));
    } catch {}
  }, [mealLogs, user?.uid]);

  // Live water counter
  const [liveWaterGlasses, setLiveWaterGlasses] = useState(() => {
    const saved = localStorage.getItem("alexfit_hydration_today");
    return saved ? parseInt(saved, 10) : 8;
  });

  const handleUpdateWater = (delta: number) => {
    const nextVal = Math.max(0, liveWaterGlasses + delta);
    setLiveWaterGlasses(nextVal);
    localStorage.setItem("alexfit_hydration_today", nextVal.toString());
    addVitalsLogAction({
      sleepDuration: 7.5,
      hydrationGlasses: nextVal,
      date: new Date().toISOString().split("T")[0]
    }).catch(() => {});
  };

  // Add Cardio Form state
  const [cardioType, setCardioType] = useState("Running / Jogging");
  const [cardioMinutes, setCardioMinutes] = useState("30");
  const [cardioDistance, setCardioDistance] = useState("5.0");
  const [cardioCalories, setCardioCalories] = useState("350");
  const [cardioNotes, setCardioNotes] = useState("");

  const handleAddCardio = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: CardioLog = {
      id: "cardio_" + Date.now(),
      type: cardioType,
      durationMinutes: parseInt(cardioMinutes, 10) || 30,
      distanceKm: parseFloat(cardioDistance) || 0,
      caloriesBurned: parseInt(cardioCalories, 10) || 300,
      date: new Date().toISOString(),
      notes: cardioNotes.trim()
    };
    setCardioLogs(prev => [newEntry, ...prev]);
    setCardioNotes("");
    alert("Cardio session logged successfully!");
  };

  // Add Meal Form state
  const [mealType, setMealType] = useState<MealLog["mealType"]>("Post-Workout");
  const [mealFoodItems, setMealFoodItems] = useState("");
  const [mealCalories, setMealCalories] = useState("550");
  const [mealProtein, setMealProtein] = useState("45");
  const [mealCarbs, setMealCarbs] = useState("60");
  const [mealFat, setMealFat] = useState("12");

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealFoodItems.trim()) {
      alert("Please describe the meal or food items.");
      return;
    }
    const newEntry: MealLog = {
      id: "meal_" + Date.now(),
      mealType,
      foodItems: mealFoodItems.trim(),
      calories: parseInt(mealCalories, 10) || 0,
      proteinGrams: parseInt(mealProtein, 10) || 0,
      carbsGrams: parseInt(mealCarbs, 10) || 0,
      fatGrams: parseInt(mealFat, 10) || 0,
      date: new Date().toISOString()
    };
    setMealLogs(prev => [newEntry, ...prev]);
    setMealFoodItems("");
    alert("Meal registered in your daily macro matrix!");
  };

  // 7-Day progress stats
  const sevenDaysAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  }, []);

  const workouts7Days = useMemo(() => {
    return (activityLogs || []).filter(l => new Date(l.date) >= sevenDaysAgo);
  }, [activityLogs, sevenDaysAgo]);

  const cardio7Days = useMemo(() => {
    return cardioLogs.filter(l => new Date(l.date) >= sevenDaysAgo);
  }, [cardioLogs, sevenDaysAgo]);

  const totalCardioMinutes7Days = useMemo(() => {
    return cardio7Days.reduce((sum, c) => sum + c.durationMinutes, 0);
  }, [cardio7Days]);

  const totalCaloriesBurned7Days = useMemo(() => {
    const workoutCals = workouts7Days.length * 320;
    const cardioCals = cardio7Days.reduce((sum, c) => sum + c.caloriesBurned, 0);
    return workoutCals + cardioCals;
  }, [workouts7Days, cardio7Days]);

  const totalWaterIntakeLiters = ((liveWaterGlasses * 250) / 1000).toFixed(1);

  // Manual trigger for 7-day progress audit check
  const [auditMsg, setAuditMsg] = useState<string | null>(null);
  const handleTriggerAudit = async () => {
    const res = await checkAndTriggerSevenDayProgressReminder(
      user?.displayName || "Athlete",
      user?.email,
      workouts7Days.length,
      Math.min(100, Math.round((liveWaterGlasses / 10) * 100)),
      true
    );
    setAuditMsg(res.message);
    setTimeout(() => setAuditMsg(null), 6000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Active Telemetry Hub
            </span>
            <span className="text-xs text-slate-400">All-in-One Fitness Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Athlete Progress & Activity Record
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Continuous tracking for <strong className="text-emerald-400">Workouts</strong>, <strong className="text-sky-400">Cardio</strong>, <strong className="text-blue-400">Water Intake</strong>, and <strong className="text-amber-400">Meals</strong>. 
            Automated records keep you accountable with scheduled 7-day effort assessments.
          </p>
        </div>

        {/* 7-Day Audit Notification Trigger */}
        <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
          <button
            type="button"
            onClick={handleTriggerAudit}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span>Run 7-Day Progress Audit</span>
          </button>
          <span className="text-[10px] text-slate-400">
            Dispatches browser push & email status alert
          </span>
        </div>
      </div>

      {auditMsg && (
        <div className="p-4 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl flex items-center gap-3 text-emerald-200 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{auditMsg}</span>
        </div>
      )}

      {/* 4 Core Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Workouts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Workouts (7d)</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E53935] flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {workouts7Days.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {workouts7Days.length >= 4 ? "🔥 On Track (High Effort)" : "⚡ Goal: 4+ sessions / wk"}
            </p>
          </div>
        </div>

        {/* Card 2: Cardio */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Cardio (7d)</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {totalCardioMinutes7Days} <span className="text-sm font-sans font-medium text-slate-500">mins</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {cardio7Days.length} total aerobic session(s)
            </p>
          </div>
        </div>

        {/* Card 3: Water */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Today's Hydration</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {totalWaterIntakeLiters} <span className="text-sm font-sans font-medium text-slate-500">L</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {liveWaterGlasses} / 10 glasses ({Math.min(100, liveWaterGlasses * 10)}% goal)
            </p>
          </div>
        </div>

        {/* Card 4: Meals */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Meals Logged</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {mealLogs.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Calories & macros calibrated
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: "overview", label: "Overview" },
          { id: "workouts", label: "Workouts History" },
          { id: "cardio", label: "Cardio Tracker" },
          { id: "water", label: "Water Intake" },
          { id: "meals", label: "Meal Matrix" },
          { id: "weekly", label: "7-Day Progress Audit" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id 
                ? "bg-[#E53935] text-white shadow-sm" 
                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Quick Water Intake Logger */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  Rapid Water Intake Logger
                </h3>
                <p className="text-xs text-slate-500">
                  Target: 2.5L - 3.0L pure water daily for peak cellular recovery.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleUpdateWater(-1)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg flex items-center justify-center transition cursor-pointer"
              >
                -
              </button>
              <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl font-mono text-center">
                <span className="text-xl font-black text-blue-700">{liveWaterGlasses}</span>
                <span className="text-xs text-blue-600 block">glasses</span>
              </div>
              <button
                type="button"
                onClick={() => handleUpdateWater(1)}
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg flex items-center justify-center transition shadow-sm cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Activity Logs Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Workouts */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-[#E53935]" />
                  Recent Workouts & Drills
                </h3>
                <span className="text-xs text-slate-400 font-mono">{activityLogs?.length || 0} total</span>
              </div>
              {activityLogs && activityLogs.length > 0 ? (
                <div className="space-y-2.5">
                  {activityLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{log.exerciseName || "Biomechanical Drill"}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(log.date).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-800 font-mono">{log.reps || 12} reps</span>
                        {log.weight ? <span className="text-[10px] text-slate-500 block">{log.weight} kg</span> : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500">No workout records logged yet. Finish any drill to see instant telemetry.</p>
                </div>
              )}
            </div>

            {/* Recent Cardio & Aerobics */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-sky-600" />
                  Recent Cardio Sessions
                </h3>
                <span className="text-xs text-slate-400 font-mono">{cardioLogs.length} total</span>
              </div>
              {cardioLogs.length > 0 ? (
                <div className="space-y-2.5">
                  {cardioLogs.slice(0, 5).map(c => (
                    <div key={c.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{c.type}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {c.durationMinutes} mins {c.distanceKm ? `• ${c.distanceKm} km` : ""}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-sky-600 font-mono">{c.caloriesBurned} kcal</span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {new Date(c.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500">No cardio logged yet. Track your 5KM runs or sprints here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Cardio Tracker */}
      {activeTab === "cardio" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
              Log Cardio Session
            </h3>
            <form onSubmit={handleAddCardio} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Cardio Type</label>
                <select
                  value={cardioType}
                  onChange={e => setCardioType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                >
                  <option>Running / Jogging</option>
                  <option>5KM Road Running</option>
                  <option>Sprint Intervals (HIIT)</option>
                  <option>Jump Rope (Skips)</option>
                  <option>Stationary Cycling</option>
                  <option>Treadmill Incline Walk</option>
                  <option>Rowing Machine</option>
                  <option>Swimming</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={cardioMinutes}
                    onChange={e => setCardioMinutes(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={cardioDistance}
                    onChange={e => setCardioDistance(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                    placeholder="5.0"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Calories Burned (kcal)</label>
                <input
                  type="number"
                  value={cardioCalories}
                  onChange={e => setCardioCalories(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                  placeholder="350"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes / Terrain</label>
                <input
                  type="text"
                  value={cardioNotes}
                  onChange={e => setCardioNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  placeholder="e.g. Heart rate zone 2, outdoor track"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold uppercase tracking-wider transition shadow-sm cursor-pointer mt-2"
              >
                Log Cardio Activity
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
              Cardio History Log
            </h3>
            {cardioLogs.length > 0 ? (
              <div className="space-y-3">
                {cardioLogs.map(c => (
                  <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{c.type}</h4>
                        <span className="text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded-md font-bold">
                          {c.durationMinutes} mins
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {c.notes || "No notes"} • {new Date(c.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-sky-600 font-mono">{c.caloriesBurned} kcal</span>
                      {c.distanceKm ? <span className="text-xs text-slate-500 block font-mono">{c.distanceKm} km</span> : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No cardio sessions logged yet.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Water Intake */}
      {activeTab === "water" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="max-w-xl space-y-2">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              Daily Hydration Monitoring
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Proper cellular hydration increases metabolic rate, lubricates joints during heavy loads, and boosts muscle hypertrophy synthesis.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
                💧
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-blue-700">Today's Progress</span>
                <div className="text-3xl font-black text-slate-900 font-mono">
                  {totalWaterIntakeLiters} <span className="text-base font-sans font-medium text-slate-600">/ 3.0 Liters</span>
                </div>
                <span className="text-xs text-blue-800 font-medium">
                  {liveWaterGlasses} of 10 standard glasses logged
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleUpdateWater(-1)}
                className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-slate-800 font-black text-xl hover:bg-slate-50 transition cursor-pointer shadow-xs"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => handleUpdateWater(1)}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-wider transition shadow-md cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Log Glass (250ml)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Meal Matrix */}
      {activeTab === "meals" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
              Log Meal & Macros
            </h3>
            <form onSubmit={handleAddMeal} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Meal Timing</label>
                <select
                  value={mealType}
                  onChange={e => setMealType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                >
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                  <option>Snack</option>
                  <option>Pre-Workout</option>
                  <option>Post-Workout</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Food Items / Ingredients</label>
                <textarea
                  rows={2}
                  value={mealFoodItems}
                  onChange={e => setMealFoodItems(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  placeholder="e.g. 200g Grilled salmon, sweet potatoes & green asparagus"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={mealCalories}
                    onChange={e => setMealCalories(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                    placeholder="550"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={mealProtein}
                    onChange={e => setMealProtein(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                    placeholder="45"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={mealCarbs}
                    onChange={e => setMealCarbs(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                    placeholder="60"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={mealFat}
                    onChange={e => setMealFat(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                    placeholder="12"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold uppercase tracking-wider transition shadow-sm cursor-pointer mt-2"
              >
                Register Meal In Log
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
              Nutrition Logs History
            </h3>
            {mealLogs.length > 0 ? (
              <div className="space-y-3">
                {mealLogs.map(m => (
                  <div key={m.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-800">
                          {m.mealType}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{m.foodItems}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono mt-1.5">
                        <span>P: {m.proteinGrams}g</span>
                        <span>C: {m.carbsGrams}g</span>
                        <span>F: {m.fatGrams}g</span>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-base font-black text-amber-600">{m.calories} kcal</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No meals logged yet.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 7-Day Progress Audit */}
      {activeTab === "weekly" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                7-Day Automated Performance Audit
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                The platform computes your weekly trajectory and dispatches push alerts & emails every 7 days.
              </p>
            </div>
            <button
              onClick={handleTriggerAudit}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase transition flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Send 7-Day Notice Now</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500 font-bold uppercase">Workouts Logged</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                {workouts7Days.length} sessions
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {workouts7Days.length >= 4 ? "✅ Target met (4+)" : "⚠️ Needs more effort (<4)"}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500 font-bold uppercase">Cardio Minutes</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                {totalCardioMinutes7Days} mins
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {cardio7Days.length} total sessions
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500 font-bold uppercase">Total Energy Expenditure</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                {totalCaloriesBurned7Days} kcal
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Active kinetic energy output
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
