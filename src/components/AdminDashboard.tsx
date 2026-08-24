import React, { useState, useEffect } from "react";
import { useApp, isEmailAdmin } from "../context/AppContext";
import { 
  Users, Sparkles, Dumbbell, ShieldCheck, UserCheck, Trash2, ArrowUpDown, Key, ToggleLeft, ToggleRight,
  Check, Copy, Link, Cpu, Globe, Activity, ChevronRight, AlertTriangle, Terminal, Settings, CreditCard, RefreshCw,
  Upload, Image as ImageIcon, Video, Search, Filter, Play, RotateCcw, CheckCircle2, Trophy, Layers, Edit3,
  SlidersHorizontal, CheckSquare, Eye, ExternalLink
} from "lucide-react";
import { TestimonialAdminManager } from "./TestimonialAdminManager";
import AdminAssetManager from "./AdminAssetManager";
import AdminWorkoutEditor from "./admin/AdminWorkoutEditor";
import AdminChallengeManager from "./admin/AdminChallengeManager";
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { PREMIUM_CHALLENGES } from "./Premium90DayChallenge";
import UnifiedExerciseMedia from "./UnifiedExerciseMedia";
import { AssetManifestService } from "../services/AssetManifestService";
import { uploadMediaToCloud, saveExerciseMediaToDatabase } from "../utils/mediaStorageService";
import { uploadAdminMedia, getAdminMediaUrl, resolveAdminMediaUrl } from "../lib/mediaStorage";

export default function AdminDashboard() {
  const { 
    user, 
    exercises, 
    allChallenges,
    allSystemUsers, 
    adminTogglePremium, 
    adminUpdateUserTier, 
    adminModifySubscription,
    uploadExerciseMedia 
  } = useApp();
  
  const [userQuery, setUserQuery] = useState("");
  const [exerciseQuery, setExerciseQuery] = useState("");
  const [activeAdminTab, setActiveAdminTab] = useState<"workouts" | "challenges" | "media" | "directory" | "paystack">("workouts");

  // Media Manager Filters & Local Inputs
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState("all");
  const [mediaStatusFilter, setMediaStatusFilter] = useState<"all" | "custom" | "default">("all");
  const [urlInputs, setUrlInputs] = useState<Record<string, string>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [mediaUpdateSuccess, setMediaUpdateSuccess] = useState<string | null>(null);

  // Manual Enrollment Form States
  const [enrollUserUid, setEnrollUserUid] = useState("");
  const [enrollChallengeId, setEnrollChallengeId] = useState("lean_muscle");
  const [enrollDayNum, setEnrollDayNum] = useState(1);
  const [enrollCoach, setEnrollCoach] = useState("Coach Marcus");
  const [enrollFitnessLevel, setEnrollFitnessLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [enrollGymOrHome, setEnrollGymOrHome] = useState<"Gym" | "Home">("Gym");
  const [enrollStatus, setEnrollStatus] = useState("");
  const [enrollLoading, setEnrollLoading] = useState(false);

  const handleFileUpload = async (exerciseId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    if (file.size > 20 * 1024 * 1024) {
      alert("File size exceeds 20MB limit. Please upload a compressed GIF, image, or video.");
      return;
    }

    setUploadingId(exerciseId);
    const isVideo = file.type.startsWith("video/");

    try {
      const finalCloudUrl = await uploadMediaToCloud(file, exerciseId, isVideo ? "video" : "image");
      await saveExerciseMediaToDatabase(exerciseId, finalCloudUrl, isVideo ? "video" : "image");
      await uploadExerciseMedia(exerciseId, finalCloudUrl, isVideo ? "video" : "image");
      AssetManifestService.recordUploadedAssetSignature(exerciseId, finalCloudUrl, isVideo ? "video" : "image");
      
      setMediaUpdateSuccess(exerciseId);
      setTimeout(() => setMediaUpdateSuccess(null), 3500);
    } catch (err) {
      console.error("Failed to upload media:", err);
      alert("Failed to update media. Please try again.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleUrlSubmit = async (exerciseId: string) => {
    const rawUrl = urlInputs[exerciseId]?.trim();
    if (!rawUrl) return;

    setUploadingId(exerciseId);
    const isVideo = rawUrl.toLowerCase().endsWith(".mp4") || rawUrl.toLowerCase().endsWith(".webm");

    try {
      await saveExerciseMediaToDatabase(exerciseId, rawUrl, isVideo ? "video" : "image");
      await uploadExerciseMedia(exerciseId, rawUrl, isVideo ? "video" : "image");
      AssetManifestService.recordUploadedAssetSignature(exerciseId, rawUrl, isVideo ? "video" : "image");
      setMediaUpdateSuccess(exerciseId);
      setTimeout(() => setMediaUpdateSuccess(null), 3500);
      setUrlInputs(prev => ({ ...prev, [exerciseId]: "" }));
    } catch (err) {
      console.error("Failed to set media URL:", err);
      alert("Failed to set media URL.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleResetMedia = async (exerciseId: string) => {
    if (!confirm("Are you sure you want to reset this exercise back to its default demonstration media?")) return;
    setUploadingId(exerciseId);
    try {
      await uploadExerciseMedia(exerciseId, null);
      AssetManifestService.clearManifestCache(exerciseId);
      setMediaUpdateSuccess(exerciseId);
      setTimeout(() => setMediaUpdateSuccess(null), 3500);
    } catch (err) {
      console.error("Failed to reset exercise media:", err);
    } finally {
      setUploadingId(null);
    }
  };

  const handleManualEnroll = async () => {
    if (!enrollUserUid) {
      setEnrollStatus("Please select an athlete to enroll.");
      return;
    }
    setEnrollLoading(true);
    setEnrollStatus("");

    const initialProgress = {
      userId: enrollUserUid,
      challengeId: enrollChallengeId,
      currentDay: enrollDayNum,
      onboarding: {
        age: 28,
        gender: "Male",
        height: 175,
        currentWeight: 80,
        goalWeight: 75,
        fitnessGoal: "Build Muscle & Lose Fat (Manual Override)",
        fitnessLevel: enrollFitnessLevel,
        gymOrHome: enrollGymOrHome,
        availableEquipment: enrollGymOrHome === "Gym" ? "Full Gym" : "Home Minimal",
        trainingDays: 5,
        preferredWorkoutTime: "Morning",
        injuries: "None (Bypassed)",
        medicalRestrictions: "None (Bypassed)"
      },
      completedDays: Array.from({ length: Math.max(0, enrollDayNum - 1) }, (_, i) => i + 1),
      workoutHistory: Array.from({ length: Math.max(0, enrollDayNum - 1) }, (_, i) => ({
        dayNum: i + 1,
        date: new Date(Date.now() - (enrollDayNum - 1 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        durationMinutes: 45,
        caloriesBurned: 350
      })),
      bodyMeasurements: [],
      personalRecords: [],
      streaks: {
        currentStreak: Math.min(7, enrollDayNum - 1),
        longestStreak: Math.max(7, enrollDayNum - 1)
      },
      achievements: enrollDayNum > 1 ? ["first_workout"] : [],
      notificationsSettings: {
        workoutTime: true,
        hydration: true,
        recovery: true,
        stretching: true,
        restDay: true,
        weeklyProgress: true,
        monthlyReport: true
      },
      updatedAt: new Date().toISOString(),
      assignedCoach: enrollCoach
    };

    try {
      const targetDocRef = doc(db, "user_premium_challenges", enrollUserUid);
      await setDoc(targetDocRef, initialProgress);
      localStorage.setItem(`premium_90_day_challenge_${enrollUserUid}`, JSON.stringify(initialProgress));
      setEnrollStatus("Successfully enrolled athlete and initialized progressive overload splits!");
    } catch (err: any) {
      console.warn("Firestore enroll failed. Backing up to localStorage:", err);
      localStorage.setItem(`premium_90_day_challenge_${enrollUserUid}`, JSON.stringify(initialProgress));
      setEnrollStatus("Saved to local session database!");
    } finally {
      setEnrollLoading(false);
    }
  };

  const [paystackStatus, setPaystackStatus] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchPaystackStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch("/api/payments/status");
      const data = await res.json();
      if (data.success) {
        setPaystackStatus(data);
      }
    } catch (err) {
      console.warn("Failed to fetch Paystack status:", err);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === "admin" || isEmailAdmin(user.email))) {
      fetchPaystackStatus();
    }
  }, [user]);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Strict Admin Safeguard
  const isAdminUser = user && (
    user.role === "admin" || 
    isEmailAdmin(user.email)
  );

  if (!isAdminUser) {
    return (
      <div className="max-w-md mx-auto py-16 text-center px-4">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-slate-800 shadow-xl space-y-4">
          <div className="h-12 w-12 bg-rose-500/10 text-rose-600 border border-rose-200 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-extrabold uppercase tracking-wider font-mono text-rose-600">Access Restricted</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            This module represents the primary administrative dashboard, accessible strictly to verified administrators (<code className="bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-900 border border-slate-200">alexfitnesshub@gmail.com</code>).
          </p>
        </div>
      </div>
    );
  }

  // Aggregate stats
  const totalUsers = allSystemUsers.length;
  const premiumCount = allSystemUsers.filter(u => u.subscriptionStatus === "premium").length;
  const totalCustomMedia = exercises.filter(e => !!e.customMediaUrl).length;

  const categoriesList = Array.from(new Set(exercises.map(e => e.category))).filter(Boolean);

  const filteredMediaExercises = exercises.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(mediaSearch.toLowerCase()) || 
                          e.id.toLowerCase().includes(mediaSearch.toLowerCase()) ||
                          e.category.toLowerCase().includes(mediaSearch.toLowerCase());
    
    const matchesCategory = mediaCategoryFilter === "all" || e.category.toLowerCase() === mediaCategoryFilter.toLowerCase();
    
    const matchesStatus = mediaStatusFilter === "all" ? true :
                          mediaStatusFilter === "custom" ? !!e.customMediaUrl :
                          !e.customMediaUrl;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredUsers = allSystemUsers.filter(u => 
    u.displayName?.toLowerCase().includes(userQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(userQuery.toLowerCase())
  );

  const filteredExercises = exercises.filter(e => 
    e.name.toLowerCase().includes(exerciseQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(exerciseQuery.toLowerCase())
  );

  return (
    <div id="admin_dashboard_root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      
      {/* Admin Title Panel - Athlete Performance Desk Header Style */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 text-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full border border-red-200">
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              Executive Admin Control
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              Live Gateway Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-sans text-slate-900">
            AlexFitnessHub Administrative Operations
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-1 leading-relaxed font-medium">
            Centralized management console for workout prescriptions, challenge programs, athlete subscriptions, and Paystack live transaction monitoring.
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl text-xs font-mono font-bold shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-900">{user?.email || "alexfitnesshub@gmail.com"}</span>
        </div>
      </div>

      {/* CORE STATS GRID - 4 Column Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider block">Total Workouts</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{exercises.length}</h3>
            <span className="text-[10px] text-slate-500 font-mono">Catalog database</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
            <Dumbbell className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider block">Custom Media Uploads</span>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-600">{totalCustomMedia}</h3>
            <span className="text-[10px] text-slate-500 font-mono">GIF & Video assets</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider block">Active Athletes</span>
            <h3 className="text-2xl sm:text-3xl font-black text-blue-600">{totalUsers}</h3>
            <span className="text-[10px] text-slate-500 font-mono">Registered accounts</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider block">Premium Subscribers</span>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-600">{premiumCount}</h3>
            <span className="text-[10px] text-slate-500 font-mono">Verified members</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* TAB NAVIGATION SELECTOR - Athlete Performance Desk Pill Strip */}
      <div className="flex bg-slate-200/80 p-1.5 rounded-2xl overflow-x-auto gap-1 border border-slate-200 scrollbar-none">
        <button
          onClick={() => setActiveAdminTab("workouts")}
          className={`py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeAdminTab === "workouts"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Dumbbell className="w-4 h-4 text-red-600" />
          Workouts & Reps Manager ({exercises.length})
        </button>

        <button
          onClick={() => setActiveAdminTab("challenges")}
          className={`py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeAdminTab === "challenges"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          Challenges Engine ({allChallenges?.length || 7})
        </button>

        <button
          onClick={() => setActiveAdminTab("media")}
          className={`py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeAdminTab === "media"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Video className="w-4 h-4 text-emerald-600" />
          Media Hub & Asset Library
        </button>

        <button
          onClick={() => setActiveAdminTab("directory")}
          className={`py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeAdminTab === "directory"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4 text-blue-600" />
          Athletes & Subscriptions ({totalUsers})
        </button>

        <button
          onClick={() => setActiveAdminTab("paystack")}
          className={`py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeAdminTab === "paystack"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <CreditCard className="w-4 h-4 text-indigo-600" />
          Paystack Live Setup
        </button>
      </div>

      {/* VIEW 1: WORKOUTS MANAGER */}
      {activeAdminTab === "workouts" && (
        <div className="space-y-6 animate-fade-in">
          <AdminWorkoutEditor />
        </div>
      )}

      {/* VIEW 2: CHALLENGES MANAGER */}
      {activeAdminTab === "challenges" && (
        <div className="space-y-6 animate-fade-in">
          <AdminChallengeManager />
        </div>
      )}

      {/* VIEW 3: WORKOUTS GIF & VIDEO MEDIA MANAGER */}
      {activeAdminTab === "media" && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Secure Drag & Drop Asset Manager for Admin */}
          <AdminAssetManager />
          
          {/* Overview & Instructions Header */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Upload className="w-5 h-5 text-red-600" />
                  Global Workout Image & GIF Demonstrator
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-2xl font-medium">
                  Upload an image, animated GIF, or MP4 video for any workout below. Updates broadcast live across every program, library, and 90-day challenge split immediately.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant Site-Wide Live Broadcast</span>
              </div>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search workouts by name or ID..."
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <select
                  value={mediaCategoryFilter}
                  onChange={(e) => setMediaCategoryFilter(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                >
                  <option value="all">All Target Muscles ({exercises.length})</option>
                  {categoriesList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={mediaStatusFilter}
                  onChange={(e) => setMediaStatusFilter(e.target.value as any)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
                >
                  <option value="all">All Exercises ({exercises.length})</option>
                  <option value="custom">Custom Media Uploaded ({totalCustomMedia})</option>
                  <option value="default">Default Demonstration Media ({exercises.length - totalCustomMedia})</option>
                </select>
              </div>
            </div>
          </div>

          {/* Exercises Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMediaExercises.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
                <Dumbbell className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No matching workouts found.</p>
                <p className="text-xs text-slate-500">Try adjusting your search query or filter settings.</p>
              </div>
            ) : (
              filteredMediaExercises.map((exercise) => {
                const isSuccess = mediaUpdateSuccess === exercise.id;
                const isUploading = uploadingId === exercise.id;

                return (
                  <div 
                    key={exercise.id} 
                    className={`p-5 bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between shadow-xs ${
                      isSuccess ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Workout Title Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{exercise.name}</h4>
                          <span className="inline-block mt-0.5 text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            {exercise.category} • ID: {exercise.id}
                          </span>
                        </div>

                        {exercise.customMediaUrl ? (
                          <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                            Custom GIF/Media
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 shrink-0">
                            Default
                          </span>
                        )}
                      </div>

                      {/* Live Media Visual Preview */}
                      <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center">
                        <UnifiedExerciseMedia 
                          exerciseId={exercise.id} 
                          exerciseName={exercise.name}
                          className="w-full h-full object-cover" 
                        />

                        {isUploading && (
                          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2 z-20">
                            <RefreshCw className="w-6 h-6 animate-spin text-red-500" />
                            <span className="text-xs font-bold font-mono">Uploading & Updating...</span>
                          </div>
                        )}

                        {isSuccess && (
                          <div className="absolute inset-0 bg-emerald-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-1 z-20">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                            <span className="text-xs font-black uppercase tracking-wider">Live Site Broadcasted!</span>
                          </div>
                        )}
                      </div>

                      {/* Controls: File Upload */}
                      <div className="space-y-2 pt-1">
                        <label className="block text-[10px] font-extrabold uppercase font-mono text-slate-600">
                          Option A: 1-Click File Upload (GIF, Image, Video)
                        </label>
                        <label className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choose GIF / Video File</span>
                          <input 
                            type="file" 
                            accept="image/gif,image/jpeg,image/png,image/webp,video/mp4,video/webm"
                            onChange={(e) => handleFileUpload(exercise.id, e)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Controls: URL Input */}
                      <div className="space-y-1.5 pt-1">
                        <label className="block text-[10px] font-extrabold uppercase font-mono text-slate-600">
                          Option B: Paste Direct GIF or Video URL
                        </label>
                        <div className="flex gap-1.5">
                          <input 
                            type="text" 
                            placeholder="https://example.com/workout.gif"
                            value={urlInputs[exercise.id] || ""}
                            onChange={(e) => setUrlInputs(prev => ({ ...prev, [exercise.id]: e.target.value }))}
                            className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-red-600"
                          />
                          <button
                            onClick={() => handleUrlSubmit(exercise.id)}
                            disabled={!urlInputs[exercise.id]?.trim() || isUploading}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold uppercase rounded-xl transition cursor-pointer shrink-0"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Reset Button */}
                    {exercise.customMediaUrl && (
                      <div className="pt-3 border-t border-slate-100 mt-3 flex justify-end">
                        <button
                          onClick={() => handleResetMedia(exercise.id)}
                          className="text-[10px] font-mono font-bold text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reset to Default
                        </button>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* VIEW 4: ATHLETES DIRECTORY & SUBSCRIPTION CONTROLS */}
      {activeAdminTab === "directory" && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: ATHLETE USER ACCOUNTS */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight uppercase">Active Athlete Accounts</h3>
                  <p className="text-xs text-slate-500">Database user directory with direct subscription overrides.</p>
                </div>
                
                <input
                  type="text"
                  placeholder="Filter athletes..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-red-600 max-w-[200px]"
                />
              </div>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {filteredUsers.length === 0 ? (
                  <p className="text-center py-8 text-xs text-slate-500">No matching athlete records identified.</p>
                ) : (
                  filteredUsers.map((userProfile) => {
                    const isUserPremium = userProfile.subscriptionStatus === "premium";
                    return (
                      <div key={userProfile.uid} className="p-3.5 border border-slate-200 rounded-2xl bg-slate-50/70 flex justify-between items-center gap-4 hover:border-slate-300 transition">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            {userProfile.displayName || "Athlete"}
                            {userProfile.role === "admin" && (
                              <span className="text-[8px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded uppercase font-mono">ADMIN</span>
                            )}
                          </h5>
                          <span className="text-[10px] text-slate-500 font-mono tracking-wide">{userProfile.email}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono uppercase font-bold py-0.5 px-2 rounded-md ${
                            isUserPremium 
                              ? "bg-emerald-500/15 text-emerald-700 border border-emerald-200" 
                              : "bg-slate-200 text-slate-600"
                          }`}>
                            {userProfile.subscriptionStatus || "free"}
                          </span>
                          
                          {/* Only toggle non-root admin accounts */}
                          {userProfile.role !== "admin" && (
                            <div className="flex items-center gap-1.5 flex-wrap justify-end">
                              <button
                                onClick={() => adminModifySubscription(userProfile.uid, "activate")}
                                title="Activate Premium (30 days)"
                                className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white text-[9px] font-black uppercase rounded-lg border border-emerald-200 transition-all cursor-pointer"
                              >
                                Activate
                              </button>
                              <button
                                onClick={() => adminModifySubscription(userProfile.uid, "extend")}
                                title="Extend subscription (+30 days)"
                                className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-[9px] font-black uppercase rounded-lg border border-blue-200 transition-all cursor-pointer"
                              >
                                Extend
                              </button>
                              {isUserPremium ? (
                                <button
                                  onClick={() => adminModifySubscription(userProfile.uid, "suspend")}
                                  title="Suspend Premium access immediately"
                                  className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white text-[9px] font-black uppercase rounded-lg border border-amber-200 transition-all cursor-pointer"
                                >
                                  Suspend
                                </button>
                              ) : (
                                <button
                                  onClick={() => adminModifySubscription(userProfile.uid, "cancel")}
                                  title="Cancel Premium subscription completely"
                                  className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white text-[9px] font-black uppercase rounded-lg border border-rose-200 transition-all cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: ROUTINE LOCK AND RELEASE OVERRIDES */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight uppercase">Exercise Tier Locks</h3>
                  <p className="text-xs text-slate-500">Toggle exercises between Free and Premium.</p>
                </div>
                
                <input
                  type="text"
                  placeholder="Filter exercises..."
                  value={exerciseQuery}
                  onChange={(e) => setExerciseQuery(e.target.value)}
                  className="text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-red-600 max-w-[140px]"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {filteredExercises.map((ex) => (
                  <div key={ex.id} className="p-2.5 border border-slate-200 rounded-xl flex items-center justify-between text-xs hover:bg-slate-50 transition">
                    <div className="truncate max-w-[180px]">
                      <h5 className="font-bold text-slate-900 truncate">{ex.name}</h5>
                      <span className="text-[9px] text-slate-500 font-mono">{ex.category}</span>
                    </div>

                    <button
                      onClick={() => adminTogglePremium(ex.id)}
                      title={ex.isPremium ? "Click to set standard FREE" : "Click to lock under PREMIUM"}
                      className="flex items-center gap-1.5 focus:outline-none cursor-pointer"
                    >
                      {ex.isPremium ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-mono text-[10px] font-bold">
                          <ToggleRight className="w-6 h-6 text-emerald-600" />
                          Premium
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
                          <ToggleLeft className="w-6 h-6" />
                          Free Tier
                        </span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* MANUAL CHALLENGE ENROLLMENT & OVERRIDE CARD */}
            <div className="lg:col-span-12 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-xs text-left">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <ShieldCheck className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                    Manual 90-Day Challenge Enrollment & Overrides
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Directly enroll any athlete into a customized flagship challenge, assign their coach, and initialize custom split days.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Select Athlete */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-500">Target Athlete Profile</label>
                  <select
                    value={enrollUserUid}
                    onChange={(e) => setEnrollUserUid(e.target.value)}
                    className="w-full text-xs font-bold p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-red-600"
                  >
                    <option value="">-- Choose Athlete --</option>
                    {allSystemUsers.map((u) => (
                      <option key={u.uid} value={u.uid}>
                        {u.displayName || u.email} ({u.subscriptionStatus === "premium" ? "Premium" : "Free"})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Choose Challenge */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-500">90-Day Premium Blueprint</label>
                  <select
                    value={enrollChallengeId}
                    onChange={(e) => setEnrollChallengeId(e.target.value)}
                    className="w-full text-xs font-bold p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-red-600"
                  >
                    {PREMIUM_CHALLENGES.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.title} ({ch.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Choose Day Offset */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-500">Initial Day Offset (1-90)</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={enrollDayNum}
                    onChange={(e) => setEnrollDayNum(Math.max(1, Math.min(90, parseInt(e.target.value) || 1)))}
                    className="w-full text-xs font-bold p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                {/* Personal Coach */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-500">Assigned Head Coach</label>
                  <select
                    value={enrollCoach}
                    onChange={(e) => setEnrollCoach(e.target.value)}
                    className="w-full text-xs font-bold p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-red-600"
                  >
                    <option value="Coach Marcus">Coach Marcus (Head Coach)</option>
                    <option value="Coach Stephanie">Coach Stephanie (Physiotherapist)</option>
                    <option value="Coach Sarah">Coach Sarah (Nutritional Lead)</option>
                    <option value="Coach Alex">Coach Alex (Strength Specialist)</option>
                    <option value="Coach David">Coach David (Cardio & Conditioning)</option>
                  </select>
                </div>

                {/* Fitness Level */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-500">Fitness Level</label>
                  <select
                    value={enrollFitnessLevel}
                    onChange={(e) => setEnrollFitnessLevel(e.target.value as any)}
                    className="w-full text-xs font-bold p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-red-600"
                  >
                    <option value="Beginner">Beginner Level</option>
                    <option value="Intermediate">Intermediate Level</option>
                    <option value="Advanced">Advanced Level</option>
                  </select>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-500">Training Facility</label>
                  <select
                    value={enrollGymOrHome}
                    onChange={(e) => setEnrollGymOrHome(e.target.value as any)}
                    className="w-full text-xs font-bold p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-red-600"
                  >
                    <option value="Gym">Commercial Gym Facilities</option>
                    <option value="Home">Home Workout Setup</option>
                  </select>
                </div>

              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4">
                <button
                  onClick={handleManualEnroll}
                  disabled={enrollLoading}
                  className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white hover:bg-red-700 disabled:bg-slate-300 font-sans font-extrabold text-xs uppercase rounded-xl shadow-xs transition duration-150 cursor-pointer text-center inline-flex items-center justify-center gap-2"
                >
                  {enrollLoading ? "Enrolling Athlete..." : "Save Athlete Challenge Blueprint"}
                </button>

                {enrollStatus && (
                  <p className={`text-xs font-bold p-3 rounded-xl ${
                    enrollStatus.includes("Successfully") ? "text-emerald-700 bg-emerald-50" : "text-amber-700 bg-amber-50"
                  }`}>
                    {enrollStatus}
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 5: PAYSTACK GATEWAY & WEBHOOKS */}
      {activeAdminTab === "paystack" && (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-xs">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase flex items-center gap-2">
                  <Globe className="w-5 h-5 text-red-600" />
                  Paystack Payment Gateway Status
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  AlexFitnessHub uses server-side Paystack webhooks and REST verification as the source of truth for Premium Athlete subscriptions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchPaystackStatus}
                  disabled={loadingStatus}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? "animate-spin" : ""}`} />
                  Refresh Gateway
                </button>
              </div>
            </div>

            {/* MODE ALERT */}
            {paystackStatus?.keyMismatch ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold">Key Mode Mismatch Detected:</span>
                  <p>Your Paystack Secret Key and Public Key are in different modes (one is Test, one is Live). Please ensure both keys in your environment settings are in the same mode.</p>
                </div>
              </div>
            ) : (
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                paystackStatus?.isLive 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : paystackStatus?.isTest
                  ? "bg-blue-50 border-blue-200 text-blue-900"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full shrink-0 ${
                    paystackStatus?.isLive ? "bg-emerald-500 animate-pulse" : paystackStatus?.isTest ? "bg-blue-500" : "bg-slate-400"
                  }`} />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider font-mono">
                      {paystackStatus?.mode || "Configuration Status"}
                    </div>
                    <p className="text-[11px] opacity-80">
                      {paystackStatus?.isLive
                        ? "Live production gateway active. Real payments from athletes are verified securely on the backend."
                        : paystackStatus?.isTest
                        ? "Test sandbox keys active. Payments use test card numbers for staging verification."
                        : "Keys configured securely in backend environment variables."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STATUS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">Secret Key (`PAYSTACK_SECRET_KEY`)</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-800">
                    {paystackStatus?.secretKeySet ? "Securely Stored ✓" : "Not Configured"}
                  </span>
                  <span className={`h-2.5 w-2.5 rounded-full ${paystackStatus?.secretKeySet ? "bg-emerald-500" : "bg-amber-400"}`} />
                </div>
                <p className="text-[9px] text-slate-500 font-mono">
                  Environment: <code className="text-slate-700 font-bold">{paystackStatus?.secretKeySet ? "Server-side Secret (Invisible)" : "Pending Configuration"}</code>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">Public Key (`PAYSTACK_PUBLIC_KEY`)</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-800">
                    {paystackStatus?.publicKeySet ? "Securely Stored ✓" : "Standard"}
                  </span>
                  <span className={`h-2.5 w-2.5 rounded-full ${paystackStatus?.publicKeySet ? "bg-emerald-500" : "bg-blue-400"}`} />
                </div>
                <p className="text-[9px] text-slate-500 font-mono">
                  Environment: <code className="text-slate-700 font-bold">{paystackStatus?.publicKeySet ? "Active on Gateway" : "Standard"}</code>
                </p>
              </div>
            </div>

            {/* INTEGRATION TARGETS & SETUP GUIDE */}
            <div className="space-y-4 pt-2">
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-500">
                    Live Webhook URL (Paste into Paystack Dashboard Settings → API Keys & Webhooks)
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={paystackStatus?.detectedWebhookUrl || ""}
                    className="w-full text-xs font-mono p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(paystackStatus?.detectedWebhookUrl || "", "webhook")}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition flex items-center justify-center text-xs text-slate-700 font-bold cursor-pointer shrink-0 gap-1.5 shadow-xs"
                  >
                    {copiedField === "webhook" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>Copy</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Paystack delivers asynchronous `charge.success` notifications to this endpoint. The server validates HMAC SHA-512 signatures and immediately upgrades the athlete.
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-500">
                  Callback / Redirect URL (Optional fallback in Paystack Dashboard)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={paystackStatus?.detectedCallbackUrl || ""}
                    className="w-full text-xs font-mono p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(paystackStatus?.detectedCallbackUrl || "", "callback")}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition flex items-center justify-center text-xs text-slate-700 font-bold cursor-pointer shrink-0 gap-1.5 shadow-xs"
                  >
                    {copiedField === "callback" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>Copy</span>
                  </button>
                </div>
              </div>

            </div>

            {/* RECENT PAYMENTS LOG */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider font-mono text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Recent Verified Paystack Payments ({paystackStatus?.recentPayments?.length || 0})
              </h4>
              
              {paystackStatus?.recentPayments && paystackStatus.recentPayments.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] uppercase font-mono text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="p-3">Reference</th>
                        <th className="p-3">User Email</th>
                        <th className="p-3">Plan</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paystackStatus.recentPayments.map((p: any) => (
                        <tr key={p.id || p.reference} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono font-bold text-slate-800">{p.reference}</td>
                          <td className="p-3 text-slate-600">{p.email || p.userId || "—"}</td>
                          <td className="p-3 capitalize font-semibold text-slate-700">{p.plan || "Monthly"}</td>
                          <td className="p-3 font-bold text-emerald-600">NGN {p.amount ? p.amount.toLocaleString() : "19,999"}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              {p.status || "success"}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 font-mono text-[11px]">
                            {p.paidAt || p.timestamp ? new Date(p.paidAt || p.timestamp).toLocaleDateString() : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
                  No verified payments recorded in database yet. Payments will automatically appear here as athletes upgrade.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Testimonials popup and scheduling management hub */}
      <TestimonialAdminManager />

    </div>
  );
}
