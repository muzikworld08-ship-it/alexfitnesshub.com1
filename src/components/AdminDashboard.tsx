import React, { useState, useEffect } from "react";
import { useApp, isEmailAdmin } from "../context/AppContext";
import { 
  Users, Sparkles, Dumbbell, ShieldCheck, UserCheck, Trash2, ArrowUpDown, Key, ToggleLeft, ToggleRight,
  Check, Copy, Link, Cpu, Globe, Activity, ChevronRight, AlertTriangle, Terminal, Settings, CreditCard, RefreshCw,
  Upload, Image as ImageIcon, Video, Search, Filter, Play, RotateCcw, CheckCircle2
} from "lucide-react";
import { TestimonialAdminManager } from "./TestimonialAdminManager";
import AdminAssetManager from "./AdminAssetManager";
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { PREMIUM_CHALLENGES } from "./Premium90DayChallenge";
import UnifiedExerciseMedia from "./UnifiedExerciseMedia";
import { AssetManifestService } from "../services/AssetManifestService";

export default function AdminDashboard() {
  const { 
    user, 
    exercises, 
    allSystemUsers, 
    adminTogglePremium, 
    adminUpdateUserTier, 
    adminModifySubscription,
    uploadExerciseMedia 
  } = useApp();
  
  const [userQuery, setUserQuery] = useState("");
  const [exerciseQuery, setExerciseQuery] = useState("");
  const [activeAdminTab, setActiveAdminTab] = useState<"media" | "directory" | "paystack">("media");

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

  const handleFileUpload = (exerciseId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset value so choosing the same file again triggers onChange
    e.target.value = "";

    if (file.size > 20 * 1024 * 1024) {
      alert("File size exceeds 20MB limit. Please upload a compressed GIF, image, or video.");
      return;
    }

    setUploadingId(exerciseId);
    const isVideo = file.type.startsWith("video/");
    const reader = new FileReader();

    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      if (base64Data) {
        try {
          await uploadExerciseMedia(exerciseId, base64Data, isVideo ? "video" : "image");
          AssetManifestService.recordUploadedAssetSignature(exerciseId, base64Data, isVideo ? "video" : "image");
          setMediaUpdateSuccess(exerciseId);
          setTimeout(() => setMediaUpdateSuccess(null), 3500);
        } catch (err) {
          console.error("Failed to upload media:", err);
          alert("Failed to update media. Please try again.");
        }
      }
      setUploadingId(null);
    };

    reader.onerror = () => {
      alert("Failed to read the file.");
      setUploadingId(null);
    };

    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = async (exerciseId: string) => {
    const rawUrl = urlInputs[exerciseId]?.trim();
    if (!rawUrl) return;

    setUploadingId(exerciseId);
    const isVideo = rawUrl.toLowerCase().endsWith(".mp4") || rawUrl.toLowerCase().endsWith(".webm");

    try {
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
      setEnrollStatus("Please select a user to enroll.");
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

  // Keep current scroll position on admin tab switch

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
            This module represents the primary administrative dashboard, accessible strictly to <code className="bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-900 border border-slate-200">alexfitnesshub@gmail.com</code>.
          </p>
        </div>
      </div>
    );
  }

  // Aggregate stats
  const totalUsers = allSystemUsers.length;
  const premiumCount = allSystemUsers.filter(u => u.subscriptionStatus === "premium").length;
  const estimatedMonthlyRevenue = premiumCount * 19999;
  const totalCustomMedia = exercises.filter(e => !!e.customMediaUrl).length;

  // Filtered exercises for Media Manager Tab
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
      
      {/* Admin Title Panel */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 text-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-red-600">System Admin Control Center</span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 font-sans text-slate-900">
            AlexFitnessHub Admin Dashboard
          </h2>
          <p className="text-xs text-slate-600 max-w-xl mt-1 leading-relaxed font-medium">
            Manage exercise GIF/video media across the entire website, update athlete accounts, and oversee Paystack webhook connections.
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-mono font-bold uppercase shrink-0">
          <ShieldCheck className="w-4 h-4 text-red-600" />
          alexfitnesshub@gmail.com Active
        </div>
      </div>

      {/* CORE STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <Dumbbell className="w-5 h-5 text-red-600 mb-2" />
          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">Total Workouts</span>
          <h4 className="text-2xl font-black text-slate-900 mt-1">{exercises.length}</h4>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <ImageIcon className="w-5 h-5 text-emerald-600 mb-2" />
          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">Custom Media Uploaded</span>
          <h4 className="text-2xl font-black text-emerald-600 mt-1">{totalCustomMedia}</h4>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <Users className="w-5 h-5 text-blue-600 mb-2" />
          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">Total Active Athletes</span>
          <h4 className="text-2xl font-black text-slate-900 mt-1">{totalUsers}</h4>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <Sparkles className="w-5 h-5 text-amber-500 mb-2" />
          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">Premium Athletes</span>
          <h4 className="text-2xl font-black text-amber-600 mt-1">{premiumCount}</h4>
        </div>

      </div>

      {/* TAB NAVIGATION SELECTOR */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveAdminTab("media")}
          className={`pb-3 px-6 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeAdminTab === "media"
              ? "border-red-600 text-red-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Video className="w-4 h-4" />
          All Workouts Media Manager ({exercises.length})
        </button>

        <button
          onClick={() => setActiveAdminTab("directory")}
          className={`pb-3 px-6 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeAdminTab === "directory"
              ? "border-red-600 text-red-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          Athletes & Premium Overrides
        </button>

        <button
          onClick={() => setActiveAdminTab("paystack")}
          className={`pb-3 px-6 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeAdminTab === "paystack"
              ? "border-red-600 text-red-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Paystack Webhooks & Live Setup
        </button>
      </div>

      {/* VIEW 1: WORKOUTS GIF & VIDEO MEDIA MANAGER */}
      {activeAdminTab === "media" && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Secure Drag & Drop Asset Manager for Admin */}
          <AdminAssetManager />
          
          {/* Overview & Instructions Header */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Upload className="w-5 h-5 text-red-600" />
                  Global Workout Image & GIF Demonstrator
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl font-medium">
                  Upload an image, animated GIF, or MP4 video for any workout below. With 1-click, your media will instantly broadcast live across every program, library, daily plan, and challenge on this entire website!
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant 1-Click Site-Wide Live Broadcast</span>
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

      {/* VIEW 2: ATHLETES DIRECTORY & PREMIUM OVERRIDES */}
      {activeAdminTab === "directory" && (
        <div className="grid lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* LEFT COLUMN: ACTIVE USER DIRECTORY OVERRIDES */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Active Athlete Profiles</h3>
                  <p className="text-[11px] text-slate-500 leading-normal">Database student record catalog with direct account upgrade override toggles.</p>
                </div>
                
                <input
                  type="text"
                  placeholder="Filter email / names..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-red-600 max-w-[200px]"
                />
              </div>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {filteredUsers.length === 0 ? (
                  <p className="text-center py-8 text-xs text-slate-500">No matching athlete records identified.</p>
                ) : (
                  filteredUsers.map((userProfile) => {
                    const isUserPremium = userProfile.subscriptionStatus === "premium";
                    return (
                      <div key={userProfile.uid} className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/60 flex justify-between items-center gap-4 hover:border-slate-300 transition">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            {userProfile.displayName || "Athlete"}
                            {userProfile.role === "admin" && (
                              <span className="text-[8px] font-bold bg-blue-500/10 text-blue-600 px-1.5 py-0.2 rounded uppercase font-mono">ROOT ADMIN</span>
                            )}
                          </h5>
                          <span className="text-[10px] text-slate-500 font-mono tracking-wide">{userProfile.email}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono uppercase font-bold py-0.5 px-1.5 rounded ${
                            isUserPremium 
                              ? "bg-emerald-500/15 text-emerald-600" 
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
                                className="px-2 py-1 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-600 hover:text-white text-[9px] font-black uppercase rounded transition-all cursor-pointer"
                              >
                                Activate
                              </button>
                              <button
                                onClick={() => adminModifySubscription(userProfile.uid, "extend")}
                                title="Extend subscription (+30 days)"
                                className="px-2 py-1 bg-blue-500/10 text-blue-700 hover:bg-blue-600 hover:text-white text-[9px] font-black uppercase rounded transition-all cursor-pointer"
                              >
                                Extend
                              </button>
                              {isUserPremium ? (
                                <button
                                  onClick={() => adminModifySubscription(userProfile.uid, "suspend")}
                                  title="Suspend Premium access immediately"
                                  className="px-2 py-1 bg-amber-500/10 text-amber-700 hover:bg-amber-600 hover:text-white text-[9px] font-black uppercase rounded transition-all cursor-pointer"
                                >
                                  Suspend
                                </button>
                              ) : (
                                <button
                                  onClick={() => adminModifySubscription(userProfile.uid, "cancel")}
                                  title="Cancel Premium subscription completely"
                                  className="px-2 py-1 bg-rose-500/10 text-rose-700 hover:bg-rose-600 hover:text-white text-[9px] font-black uppercase rounded transition-all cursor-pointer"
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
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Database Exercises</h3>
                  <p className="text-[11px] text-slate-500 leading-normal">Toggle exercises as standard Free or locked under Premium.</p>
                </div>
                
                <input
                  type="text"
                  placeholder="Filter names..."
                  value={exerciseQuery}
                  onChange={(e) => setExerciseQuery(e.target.value)}
                  className="text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-red-600 max-w-[150px]"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {filteredExercises.map((ex) => (
                  <div key={ex.id} className="p-2.5 border border-slate-200 rounded-lg flex items-center justify-between text-xs hover:bg-slate-50 transition">
                    <div className="truncate max-w-[200px]">
                      <h5 className="font-semibold text-slate-900 truncate">{ex.name}</h5>
                      <span className="text-[9px] text-slate-500 font-mono italic">{ex.category}</span>
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
                          Standard Lite
                        </span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* MANUAL CHALLENGE ENROLLMENT & OVERRIDE CARD */}
            <div className="lg:col-span-12 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm text-left">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    Manual 90-Day Challenge Enrollment & Overrides
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instantly enroll any premium athlete into a customized flagship challenge, assign their head coach, and override standard onboarding questions.
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
                    <option value="Coach Marcus">Coach Marcus (Default)</option>
                    <option value="Coach Stephanie">Coach Stephanie (Physiotherapist)</option>
                    <option value="Coach Sarah">Coach Sarah (Nutritional Kinesiologist)</option>
                    <option value="Coach Alex">Coach Alex (Strength Specialist)</option>
                    <option value="Coach David">Coach David (Cardiorespiratory Lead)</option>
                  </select>
                </div>

                {/* Fitness Level */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-500">Overridden Fitness Level</label>
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
                  <label className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-500">Overridden Location Setup</label>
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
                  className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white hover:bg-red-700 disabled:bg-slate-300 font-sans font-extrabold text-xs uppercase rounded-xl shadow-md transition duration-150 cursor-pointer text-center inline-flex items-center justify-center gap-2"
                >
                  {enrollLoading ? "Enrolling Athlete..." : "FORCE MANUAL ENROLLMENT OVERRIDE"}
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
      )}

      {/* VIEW 3: PAYSTACK GATEWAY & WEBHOOKS */}
      {activeAdminTab === "paystack" && (
        <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
            
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-red-600" />
                Paystack Gateway Connection Status
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your application communicates directly with Paystack’s payment core. Configure these values inside your Paystack Merchant account to activate live or test flows.
              </p>
            </div>

            {/* STATUS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">Secret Key (`PAYSTACK_SECRET_KEY`)</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-800">
                    {paystackStatus?.secretKeySet ? "Loaded ✓" : "Fallback Key"}
                  </span>
                  <span className={`h-2.5 w-2.5 rounded-full ${paystackStatus?.secretKeySet ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
                </div>
                <p className="text-[9px] text-slate-500 font-mono">
                  Active key: <code className="text-slate-700 font-bold">{paystackStatus?.secretKeyMasked}</code>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">Public Key (`VITE_PAYSTACK_PUBLIC_KEY`)</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-800">
                    {paystackStatus?.publicKeySet ? "Loaded ✓" : "Fallback Key"}
                  </span>
                  <span className={`h-2.5 w-2.5 rounded-full ${paystackStatus?.publicKeySet ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
                </div>
                <p className="text-[9px] text-slate-500 font-mono">
                  Active key: <code className="text-slate-700 font-bold">{paystackStatus?.publicKeyMasked}</code>
                </p>
              </div>
            </div>

            {/* INTEGRATION TARGETS */}
            <div className="space-y-4 pt-2">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-500">Required Paystack Webhook URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={paystackStatus?.detectedWebhookUrl || ""}
                    className="w-full text-xs font-mono p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(paystackStatus?.detectedWebhookUrl || "", "webhook")}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition flex items-center justify-center text-xs text-slate-700 font-bold cursor-pointer shrink-0"
                  >
                    {copiedField === "webhook" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-500">Required Callback / Redirect URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={paystackStatus?.detectedCallbackUrl || ""}
                    className="w-full text-xs font-mono p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(paystackStatus?.detectedCallbackUrl || "", "callback")}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition flex items-center justify-center text-xs text-slate-700 font-bold cursor-pointer shrink-0"
                  >
                    {copiedField === "callback" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Testimonials popup and scheduling management hub */}
      <TestimonialAdminManager />

    </div>
  );
}
