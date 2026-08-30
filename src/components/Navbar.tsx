import React, { useState, useEffect } from "react";
import { useApp, isEmailAdmin, checkIsUserPremium } from "../context/AppContext";
import { 
  Menu, X, Shield, Lock, Award, ChevronDown, Calendar, Flame, 
  Dumbbell, Sparkles, BookOpen, Activity, Heart, Users, Video, 
  Bookmark, BarChart3, Calculator, Crown, Star, ArrowRight, LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Logo from "./Logo";
import { OptimizedImage } from "./OptimizedImage";

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  onOpenAuth: () => void;
}

export default function Navbar({ currentView, setView, onOpenAuth }: NavbarProps) {
  const { user, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isPremium = checkIsUserPremium(user);

  // Close hamburger menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCustomNav = (targetView: string, subview?: string, elementId?: string) => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    
    // Check if view requires login for guests
    const guestRestrictedViews = ["daily-plan", "coach", "dashboard", "weekly-reports", "daily-habit-tracker", "daily-calibration-desk", "handbook", "weight-trajectory", "challenges", "belly-fat-shred", "women-confidence", "saved-exercises", "nutrition"];
    if (guestRestrictedViews.includes(targetView) && !user) {
      localStorage.setItem("fit_attempted_view", targetView);
      onOpenAuth();
      return;
    }

    if (targetView === "pricing") {
      setView("home");
      setTimeout(() => {
        const el = document.getElementById("pricing");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
      return;
    }

    setView(targetView);

    if (elementId) {
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 200);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFreeInteractiveNav = (tabId: "trajectory" | "community" | "calibration" | "habits") => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setView("home");
    
    if (typeof window !== "undefined") {
      (window as any).__activeDemoTab = tabId;
      window.dispatchEvent(new CustomEvent("set-demo-tab", { detail: tabId }));
    }

    setTimeout(() => {
      const el = document.getElementById("public-live-desk");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 180);
  };

  // Top horizontal bar items
  const topMenuItems = isPremium ? [
    { id: "home", label: "HOME", action: () => handleCustomNav("home") },
    { id: "dashboard", label: "DASHBOARD", action: () => handleCustomNav("dashboard") },
    { id: "daily-plan", label: "DAILY PLAN", action: () => handleCustomNav("daily-plan") },
    { id: "women-confidence", label: "WOMEN CONFIDENCE", action: () => handleCustomNav("women-confidence") },
    { id: "belly-fat-shred", label: "BELLY SHRED", action: () => handleCustomNav("belly-fat-shred") },
    { id: "lifestyle-academy", label: "PROGRAMS", action: () => handleCustomNav("lifestyle-academy") },
    { id: "library", label: "WORKOUTS", action: () => handleCustomNav("library") },
    { id: "nutrition", label: "NUTRITION", action: () => handleCustomNav("nutrition") },
    { id: "coach", label: "AI COACH", action: () => handleCustomNav("coach") },
    { id: "community", label: "COMMUNITY", action: () => handleCustomNav("community") }
  ] : [
    { id: "home", label: "HOME", action: () => handleCustomNav("home") },
    { id: "women-confidence", label: "WOMEN CONFIDENCE", action: () => handleCustomNav("women-confidence") },
    { id: "lifestyle-academy", label: "PROGRAMS", action: () => handleCustomNav("lifestyle-academy") },
    { id: "library", label: "WORKOUTS", action: () => handleCustomNav("library") },
    { id: "workout-videos", label: "EXERCISES", action: () => handleCustomNav("workout-videos") },
    { id: "nutrition", label: "NUTRITION", action: () => handleCustomNav("nutrition") },
    { id: "calculators", label: "CALCULATORS", action: () => { if (user) { handleCustomNav("daily-calibration-desk"); } else { handleFreeInteractiveNav("calibration"); } } },
    { id: "coach", label: "AI COACH", action: () => handleCustomNav("coach") },
    { id: "community", label: "COMMUNITY", action: () => { if (user) { handleCustomNav("community"); } else { handleFreeInteractiveNav("community"); } } },
    { id: "pricing", label: "PRICING", action: () => handleCustomNav("pricing") }
  ];

  // Unified single drawer menu items (dynamic based on subscription)
  const drawerMenuItems = isPremium ? [
    { id: "dashboard", label: "Athlete Performance Desk", desc: "Your metrics, streaks & performance reports", icon: Shield, color: "text-sky-600 bg-sky-50" },
    { id: "daily-plan", label: "My Daily Plan", desc: "Personalized daily schedule & drills", icon: Calendar, color: "text-red-600 bg-red-50" },
    { id: "women-confidence", label: "Women Confidence Program", desc: "Full 180-Day progressive transformation", icon: Heart, color: "text-rose-600 bg-rose-50" },
    { id: "belly-fat-shred", label: "Belly Fat Shred System", desc: "5-Month core & metabolic shredding protocol", icon: Flame, color: "text-orange-600 bg-orange-50" },
    { id: "challenges", label: "Monthly 90-Day Challenges", desc: "Physical transformation competitions", icon: Award, color: "text-amber-600 bg-amber-50" },
    { id: "coach", label: "AI Fitness Coach", desc: "Personalized Gemini AI consultations", icon: Sparkles, color: "text-indigo-600 bg-indigo-50" },
    { id: "home", label: "Home Page", desc: "Main portal, workout search & preview", icon: Dumbbell, color: "text-red-500 bg-red-50" },
    { id: "lifestyle-academy", label: "Programs & Academy", desc: "12-Week structured physique splits", icon: BookOpen, color: "text-blue-600 bg-blue-50" },
    { id: "library", label: "Workout Library & Drills", desc: "Full exercise directory with kinetic specs", icon: Activity, color: "text-emerald-600 bg-emerald-50" },
    { id: "workout-videos", label: "Exercise Video Vault", desc: "HD form demonstrations & workouts", icon: Video, color: "text-purple-600 bg-purple-50" },
    { id: "saved-exercises", label: "Saved Drills & Workouts", desc: "Your bookmarked routine collection", icon: Bookmark, color: "text-amber-600 bg-amber-50" },
    { id: "nutrition", label: "Nutrition & Meal Matrix", desc: "Macro calibrator & localized diet plans", icon: Heart, color: "text-rose-600 bg-rose-50" },
    { id: "weight-trajectory", label: "Weight Trajectory Logs", desc: "Biometric weigh-in graph & checkpoints", icon: BarChart3, color: "text-emerald-600 bg-emerald-50" },
    { id: "daily-calibration-desk", label: "Biometric Calibration Desk", desc: "Hydration, calories & sleep targets", icon: Calculator, color: "text-indigo-600 bg-indigo-50" },
    { id: "community", label: "Community Arena", desc: "Share updates & connect with athletes", icon: Users, color: "text-teal-600 bg-teal-50" },
    { id: "success-stories", label: "Transformation Stories", desc: "Verified athlete before/after reviews", icon: Star, color: "text-yellow-600 bg-yellow-50" },
    ...((user?.role === "admin" || (user?.email && isEmailAdmin(user.email))) ? [
      { id: "admin", label: "Admin Management Console", desc: "System settings, analytics & user controls", icon: Shield, color: "text-red-700 bg-red-100" }
    ] : [])
  ] : [
    { id: "home", label: "Home Page", desc: "Main portal, features & workout search", icon: Dumbbell, color: "text-red-500 bg-red-50" },
    { id: "lifestyle-academy", label: "Programs & Academy", desc: "12-Week structured physique splits", icon: BookOpen, color: "text-blue-500 bg-blue-50" },
    { id: "library", label: "Workout Library & Drills", desc: "Full exercise directory with kinetic specs", icon: Activity, color: "text-emerald-500 bg-emerald-50" },
    { id: "workout-videos", label: "Exercise Video Vault", desc: "HD form demonstrations & workouts", icon: Video, color: "text-purple-500 bg-purple-50" },
    { id: "nutrition", label: "Nutrition & Macro Matrix", desc: "Macro calibrator & localized diet plans", icon: Heart, color: "text-rose-500 bg-rose-50" },
    { id: "community", label: "Community Arena", desc: "Share updates & connect with athletes", icon: Users, color: "text-teal-500 bg-teal-50" },
    { id: "success-stories", label: "Transformation Stories", desc: "Verified athlete before/after reviews", icon: Star, color: "text-yellow-600 bg-yellow-50" },
    { id: "pricing", label: "Upgrade to Premium Membership", desc: "Unlock Daily Plan, 90-Day Challenges & AI Coach", icon: Crown, color: "text-white bg-gradient-to-r from-red-600 to-rose-600", isHighlight: true }
  ];

  return (
    <>
      {/* Unified Sticky Top Horizontal Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#E8E8E8] h-20 shadow-sm flex items-center w-full max-w-full">
        <div className="max-w-[1400px] mx-auto w-full px-3 sm:px-6 flex items-center justify-between h-full gap-2 sm:gap-4 overflow-hidden min-w-0">
          
          {/* Logo Left */}
          <div className="flex items-center shrink-0">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleCustomNav("home");
              }}
              className="flex items-center select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E53935] rounded-lg"
              aria-label="AlexFitnessHub Home View"
            >
              <Logo size="sm" showText={true} showSubtext={false} hideTextOnMobile={false} />
            </a>
          </div>

          {/* Horizontal Quick Links Bar */}
          <nav className="hidden lg:flex items-center gap-2 sm:gap-4 lg:gap-5 overflow-x-auto whitespace-nowrap scrollbar-none py-1 min-w-0 flex-1 justify-end" aria-label="Main Desktop Navigation Menu">
            {topMenuItems.map((item) => {
              const isActive = 
                currentView === item.id || 
                (item.id === "pricing" && currentView === "home" && window.location.hash === "#pricing");
                
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-250 cursor-pointer border-b-2 py-1 shrink-0 ${
                    isActive 
                      ? "text-[#E53935] border-[#E53935]" 
                      : "text-[#2B2B2B] border-transparent hover:text-[#E53935]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Control Bar (Auth + Prominent Hamburger Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {!user ? (
              <button
                onClick={onOpenAuth}
                className="bg-[#E53935] hover:bg-[#C62828] text-white text-[11px] sm:text-[13px] font-bold uppercase tracking-wider px-3 sm:px-5 py-2 rounded-[10px] transition-all duration-250 cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {(user.role === "admin" || isEmailAdmin(user.email)) && (
                  <button
                    onClick={() => handleCustomNav("admin")}
                    className="bg-[#D32F2F] hover:bg-red-700 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-[8px] transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>ADMIN</span>
                  </button>
                )}
                <button
                  onClick={() => handleCustomNav("dashboard")}
                  className="flex items-center gap-1.5 focus:outline-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  title="Go to Dashboard"
                >
                  {user.photoURL && user.photoURL.trim() !== "" ? (
                    <OptimizedImage
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      priority={true}
                      loading="eager"
                      fetchPriority="high"
                      width={64}
                      height={64}
                      quality={85}
                      format="webp"
                      className="w-8 h-8 rounded-full object-cover border border-[#E8E8E8]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#E53935] flex items-center justify-center text-white font-black text-xs uppercase shadow-sm">
                      {user.displayName ? user.displayName[0] : (user.email ? user.email[0] : "A")}
                    </div>
                  )}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setView("home");
                  }}
                  className="hidden sm:flex border border-[#E8E8E8] hover:border-[#E53935] text-[#707070] hover:text-[#E53935] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-[8px] transition-all cursor-pointer whitespace-nowrap"
                >
                  Sign Out
                </button>
              </div>
            )}

            {/* EFFECTIVE HAMBURGER MENU BUTTON TOGGLE */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                isMenuOpen 
                  ? "bg-[#E53935] text-white border-[#E53935] shadow-md" 
                  : "bg-slate-50 hover:bg-red-50 text-slate-800 hover:text-[#E53935] border-slate-200 hover:border-red-200"
              }`}
              aria-label="Toggle Navigation Hamburger Drawer Menu"
              title="Open Navigation Menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <>
                  <Menu className="w-5 h-5 stroke-[2.5]" />
                  <span className="hidden md:inline text-[11px] font-extrabold uppercase tracking-wider ml-0.5">MENU</span>
                </>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* FULL-FEATURED SLIDE-OVER HAMBURGER DRAWER */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm sm:max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Top Header */}
              <div className="p-4 sm:p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <Logo size="sm" showText={true} showSubtext={false} />
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:border-red-300 text-slate-600 hover:text-[#E53935] transition-all cursor-pointer shadow-xs"
                  aria-label="Close Hamburger Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Account / Membership Status Header Card */}
              <div className="px-4 sm:px-5 pt-4">
                {user ? (
                  <div className="p-3.5 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl text-white shadow-md flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {user.photoURL && user.photoURL.trim() !== "" ? (
                        <OptimizedImage 
                          src={user.photoURL} 
                          alt={user.displayName || "User"} 
                          priority={true}
                          loading="eager"
                          fetchPriority="high"
                          width={80}
                          height={80}
                          className="w-10 h-10 rounded-full object-cover border-2 border-red-500" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#E53935] text-white flex items-center justify-center font-black text-sm uppercase">
                          {user.displayName ? user.displayName[0] : (user.email ? user.email[0] : "A")}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">
                          {user.displayName || user.email || "Athlete"}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {user.subscriptionStatus === "premium" || user.role === "admin" ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">
                              <Crown className="w-2.5 h-2.5 text-emerald-400" /> Premium Athlete
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                              Free Tier Athlete
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {user.subscriptionStatus !== "premium" && user.role !== "admin" && (
                      <button
                        onClick={() => handleCustomNav("pricing")}
                        className="shrink-0 bg-[#E53935] hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all"
                      >
                        Upgrade
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-red-50/80 border border-red-200/80 rounded-2xl flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-900 tracking-tight">
                        Join AlexFitnessHub
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Unlock custom workouts, AI coach & daily plans.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenAuth();
                      }}
                      className="bg-[#E53935] hover:bg-[#C62828] text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3" />
                      Login
                    </button>
                  </div>
                )}
              </div>

              {/* Scrollable Single Navigation Section */}
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
                <div className="flex items-center justify-between px-1 pb-1">
                  <h5 className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-400">
                    {isPremium ? "ATHLETE PLATFORM MENU" : "EXPLORE ALEXFITNESSHUB"}
                  </h5>
                  <span className="text-[9px] font-mono font-bold text-slate-400">
                    {drawerMenuItems.length} items
                  </span>
                </div>

                <div className="grid gap-1.5">
                  {drawerMenuItems.map((item: any) => {
                    const IconComp = item.icon;
                    const isCurrent = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleCustomNav(item.id)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                          isCurrent 
                            ? "bg-red-50/80 border-red-200 text-[#E53935] shadow-2xs font-bold" 
                            : item.isHighlight
                              ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 hover:border-red-300 text-slate-900 shadow-2xs"
                              : "bg-white hover:bg-slate-50 border-transparent hover:border-slate-200 text-slate-800"
                        }`}
                      >
                        <span className={`p-2 rounded-lg shrink-0 ${item.color}`}>
                          <IconComp className="w-4 h-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-tight truncate">
                              {item.label}
                            </span>
                            {isCurrent && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E53935] shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5 font-sans">
                            {item.desc}
                          </p>
                        </div>
                        <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isCurrent ? "text-[#E53935] translate-x-0.5" : "text-slate-300"}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Bottom Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
                {user ? (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                      setView("home");
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-[#E53935] rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of Account</span>
                  </button>
                ) : (
                  <div className="text-center w-full">
                    <p className="text-[10px] text-slate-500 font-medium">
                      AlexFitnessHub • Premium Kinesiology & Fitness System
                    </p>
                  </div>
                )}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

