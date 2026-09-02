import React, { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { auth } from "./lib/firebase";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppProvider, useApp, checkIsUserPremium } from "./context/AppContext";
import { motion, AnimatePresence, type Variants } from "motion/react";
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";
import WorkoutLibrary from "./components/WorkoutLibrary";
import WorkoutGeneratorView from "./components/WorkoutGeneratorView";
import CoachView from "./components/CoachView";
import AdminDashboard from "./components/AdminDashboard";
import OnboardingWizard from "./components/OnboardingWizard";
import AuthModal from "./components/AuthModal";
import AuthView from "./components/AuthView";
import NutritionView from "./components/NutritionView";
import CommunityView from "./components/CommunityView";
import SuccessView from "./components/SuccessView";
import SavedExercisesView from "./components/SavedExercisesView";
import WorkoutVideos from "./components/WorkoutVideos";
import DailyPlanView from "./components/DailyPlanView";
import DashboardView from "./components/DashboardView";
import PaymentSuccessView from "./components/PaymentSuccessView";
import FitnessChallenges from "./components/FitnessChallenges";
import BellyFatShredView from "./components/BellyFatShredView";
import LifestyleFitnessAcademy from "./components/LifestyleFitnessAcademy";
import WomenConfidenceProgram from "./components/WomenConfidenceProgram";
import HomeWorkoutChallengeView from "./components/HomeWorkoutChallengeView";
import BodyStatsCalculatorView from "./components/BodyStatsCalculatorView";
import PricingView from "./components/PricingView";
import { TestimonialPopup } from "./components/TestimonialPopup";
import DailyNotificationController from "./components/DailyNotificationController";
import GlobalSkeletonLoader, { DashboardSkeleton, CardGridSkeleton, ListSkeleton } from "./components/SkeletonLoader";
import GlobalTransitionOverlay from "./components/GlobalTransitionOverlay";
import PremiumUpgradeModal from "./components/PremiumUpgradeModal";
import { preloadCriticalFitnessAssets } from "./utils/imageCache";
import { WorkoutTimerProvider } from "./context/WorkoutTimerContext";
import { StoreProvider } from "./context/StoreContext";
import StoreView from "./components/StoreView";
import FloatingWorkoutTimerOverlay from "./components/FloatingWorkoutTimerOverlay";
import { OfflineIndicator } from "./components/OfflineIndicator";

const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(2px)",
    transition: {
      duration: 0.18,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};



const PATH_TO_VIEW_MAP: Record<string, string> = {
  "/": "home",
  "/payment/success": "payment-success",
  "/library": "library",
  "/premium/library": "library",
  "/workout-generator": "workout-generator",
  "/premium/workout-generator": "workout-generator",
  "/workout-videos": "workout-videos",
  "/premium/workout-videos": "workout-videos",
  "/saved-exercises": "saved-exercises",
  "/premium/saved-exercises": "saved-exercises",
  "/coach": "coach",
  "/premium/coach": "coach",
  "/nutrition": "nutrition",
  "/premium/nutrition": "nutrition",
  "/daily-plan": "daily-plan",
  "/premium/daily-plan": "daily-plan",
  "/challenges": "challenges",
  "/premium/challenges": "challenges",
  "/community": "community",
  "/premium/community": "community",
  "/weekly-reports": "weekly-reports",
  "/premium/weekly-reports": "weekly-reports",
  "/daily-habit-tracker": "daily-habit-tracker",
  "/premium/daily-habit-tracker": "daily-habit-tracker",
  "/daily-calibration-desk": "daily-calibration-desk",
  "/premium/daily-calibration-desk": "daily-calibration-desk",
  "/handbook": "handbook",
  "/premium/handbook": "handbook",
  "/weight-trajectory": "weight-trajectory",
  "/premium/weight-trajectory": "weight-trajectory",
  "/dashboard": "dashboard",
  "/premium/dashboard": "dashboard",
  "/belly-fat-shred": "belly-fat-shred",
  "/premium/belly-fat-shred": "belly-fat-shred",
  "/women-confidence": "women-confidence",
  "/premium/women-confidence": "women-confidence",
  "/home-workout-challenge": "home-workout-challenge",
  "/180-day-challenge": "home-workout-challenge",
  "/home-challenge": "home-workout-challenge",
  "/premium/home-workout-challenge": "home-workout-challenge",
  "/lifestyle-academy": "lifestyle-academy",
  "/pricing": "pricing",
  "/premium/pricing": "pricing",
  "/store": "store",
  "/shop": "store",
  "/apparel": "store",
  "/merch": "store",
  "/onboarding": "onboarding",
  "/login": "login",
  "/signin": "signin",
  "/signup": "signup",
  "/register": "register",
  "/admin": "admin",
  "/premium/admin": "admin",
};

const VIEW_TO_PATH_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(PATH_TO_VIEW_MAP).map(([path, view]) => [view, path])
);


function FitnessAppContent() {
  const { 
    user, 
    loading, 
    isBlockedUser, 
    authDatabaseError, 
    setAuthDatabaseError,
    currentView,
    setView
  } = useApp();

  const renderSkeletonForView = (view: string) => {
    if (["dashboard", "weekly-reports", "daily-habit-tracker", "daily-calibration-desk", "handbook", "weight-trajectory"].includes(view)) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
          <DashboardSkeleton />
        </div>
      );
    }
    if (["library", "saved-exercises", "workout-videos"].includes(view)) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6 mt-4">
          <div className="space-y-2 pb-4">
            <div className="h-6 w-48 rounded bg-slate-200 animate-pulse" />
            <div className="h-4 w-96 rounded bg-slate-200 animate-pulse" />
          </div>
          <CardGridSkeleton count={3} />
        </div>
      );
    }
    if (["community", "challenges"].includes(view)) {
      return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6 mt-4">
          <div className="space-y-2 pb-4">
            <div className="h-6 w-48 rounded bg-slate-200 animate-pulse" />
            <div className="h-4 w-96 rounded bg-slate-200 animate-pulse" />
          </div>
          <ListSkeleton count={4} />
        </div>
      );
    }
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
        <DashboardSkeleton />
      </div>
    );
  };

  // Instantly enforce pure white light theme on initial render and warm critical media cache
  React.useLayoutEffect(() => {
    try {
      const root = window.document.documentElement;
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      localStorage.setItem("fit_theme", "light");
    } catch (e) {}
    preloadCriticalFitnessAssets();
  }, []);

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Refactored Auth Sync: Track previous uid to trigger redirect immediately on login/logout
  const prevUserUid = React.useRef<string | undefined>(undefined);
  const isInitialMount = React.useRef<boolean>(true);

  React.useEffect(() => {
    const currentUid = user?.uid;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevUserUid.current = currentUid;
      if (currentUid && (currentView === "home" || currentView === "login" || currentView === "signin" || currentView === "signup" || currentView === "register")) {
        const attempted = localStorage.getItem("fit_attempted_view");
        if (attempted && attempted !== "home" && attempted !== "login" && attempted !== "signin" && attempted !== "signup" && attempted !== "register") {
          localStorage.removeItem("fit_attempted_view");
          setView(attempted);
        } else {
          setView("dashboard");
        }
      }
      return;
    }

    const previousUid = prevUserUid.current;
    prevUserUid.current = currentUid;

    // Transition: Logged out -> Logged in
    if (currentUid && !previousUid) {
      setIsAuthOpen(false);
      const attempted = localStorage.getItem("fit_attempted_view");
      if (attempted && attempted !== "home" && attempted !== "login" && attempted !== "signin" && attempted !== "signup" && attempted !== "register") {
        localStorage.removeItem("fit_attempted_view");
        console.log(`[DevOps Auth Sync] Redirecting to attempted view: ${attempted}`);
        setView(attempted);
      } else {
        console.log("[DevOps Auth Sync] Successfully authenticated. Redirecting user to dashboard.");
        setView("dashboard");
      }
    } else if (!currentUid && previousUid) {
      // Transition: Logged in -> Logged out
      console.log("[DevOps Auth Sync] Signed out. Redirecting to Home view.");
      setIsAuthOpen(false);
      setView("home");
    }
  }, [user, currentView, setView]);

  // Handle explicit /login, /signin, /signup routing triggers and redirect guards
  React.useEffect(() => {
    if (loading) return;

    if (currentView === "login" || currentView === "signin" || currentView === "signup" || currentView === "register" || currentView === "auth") {
      if (user) {
        // Already logged in, redirect away from login screen immediately!
        setIsAuthOpen(false);
        const attempted = localStorage.getItem("fit_attempted_view");
        if (attempted && attempted !== "home" && attempted !== "login" && attempted !== "signin" && attempted !== "signup" && attempted !== "register") {
          localStorage.removeItem("fit_attempted_view");
          setView(attempted);
        } else {
          setView("dashboard");
        }
      } else {
        // Close modal so full-page AuthView renders cleanly without popup obstruction
        setIsAuthOpen(false);
      }
    } else if (currentView === "onboarding") {
      if (!user) {
        // Route to login if trying to access onboarding unauthenticated
        setView("login");
      }
    }
  }, [currentView, user, loading, setView]);

  // General Guard to catch any unauthorized entries to protected views for unauthenticated guests or free-tier users
  React.useEffect(() => {
    if (!loading) {
      const PREMIUM_PROGRAMS: Record<string, string> = {
        "home-workout-challenge": "180 Day Home Workout Challenge",
        "180-day-challenge": "180 Day Home Workout Challenge",
        "home-challenge": "180 Day Home Workout Challenge",
        "women-confidence": "Women Confidence Program",
        "belly-fat-shred": "Belly Fat Shred System",
        "challenges": "Monthly 90-Day Challenges",
        "daily-plan": "My Daily Plan",
        "coach": "AI Fitness Coach",
        "dashboard": "Athlete Performance Desk",
        "weight-trajectory": "Weight Trajectory Logs",
        "daily-calibration-desk": "Biometric Calibration Desk",
        "saved-exercises": "Saved Drills & Workouts",
        "weekly-reports": "Weekly Progress Reports",
        "handbook": "Athlete Handbook",
        "workout-generator": "AI Workout Generator"
      };

      const loginRequiredViews = [
        ...Object.keys(PREMIUM_PROGRAMS),
        "nutrition", "community", "success-stories"
      ];

      const activeUid = localStorage.getItem("fit_active_uid");
      if (loginRequiredViews.includes(currentView) && !user && !activeUid) {
        console.log(`[DevOps Security] Unauthenticated user attempted to access protected view: ${currentView}. Saving destination and navigating to login.`);
        localStorage.setItem("fit_attempted_view", currentView);
        setView("login");
        return;
      }

      // Check if user is signed in but on FREE tier trying to access a premium-only view directly
      const isUserPrem = checkIsUserPremium(user);
      if (user && !isUserPrem && PREMIUM_PROGRAMS[currentView]) {
        const progName = PREMIUM_PROGRAMS[currentView];
        console.log(`[Subscription Guard] Free tier user attempted to access premium view: ${currentView}. Redirecting to pricing.`);
        localStorage.setItem("fit_upgrade_reason", progName);
        setPremiumModalFeatureName(progName);
        setIsPremiumModalOpen(true);
        setView("pricing");
      }
    }
  }, [user, currentView, loading, setView]);

  // Keep window.location.pathname in sync with currentView
  React.useEffect(() => {
    const targetPath = VIEW_TO_PATH_MAP[currentView] || "/";
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  }, [currentView]);

  // Listen to popstate event for browser back/forward buttons
  React.useEffect(() => {
    const handlePopState = () => {
      const targetView = PATH_TO_VIEW_MAP[window.location.pathname] || "home";
      setView(targetView);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Global Scroll Restoration Solution
  // 1. Force the browser to manual scroll restoration on mount to prevent native jumpy behavior on back/forward
  React.useEffect(() => {
    // Safe stub to prevent any residual button actions from crashing
    (window as any).openLiveSupportChat = () => {
      console.log("Live Support Chat has been deactivated by customer request.");
    };

    if (typeof window !== "undefined" && window.history && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // 2. Perform robust scroll to top whenever the current view/route changes
  React.useLayoutEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };

    // Execute scroll immediately to prevent flashing content scrolled down
    handleScrollToTop();

    // Staggered timeouts to ensure the viewport is pinned to the top as elements and lazy-loaded views mount
    const timer1 = setTimeout(handleScrollToTop, 10);
    const timer2 = setTimeout(handleScrollToTop, 50);
    const timer3 = setTimeout(handleScrollToTop, 150);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [currentView]);

  // 3. Smart scroll handler: ensure clicked elements or state transitions scroll into view in front of the user when needed without jumping to top
  React.useEffect(() => {
    const handleGlobalNavigationClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Find closest interactive element if clicked on inner icon or text
      const clickable = target.closest("button, [role='tab'], .cursor-pointer, a, input, select");
      if (clickable) {
        // Allow brief frame for UI expansion or accordion toggle then ensure element is smoothly in view if off-screen
        setTimeout(() => {
          if (clickable && document.body.contains(clickable)) {
            const rect = clickable.getBoundingClientRect();
            // If the element was pushed out of the viewport after expansion, scroll it gently into view
            if (rect.top < 0 || rect.bottom > window.innerHeight) {
              clickable.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          }
        }, 120);
      }
    };

    window.addEventListener("click", handleGlobalNavigationClick, { passive: true });

    return () => {
      window.removeEventListener("click", handleGlobalNavigationClick);
    };
  }, []);

  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [premiumModalFeatureName, setPremiumModalFeatureName] = useState("Premium Feature");

  // Reliable pricing navigation to dedicated PricingView
  const navigateToPricing = () => {
    setIsPremiumModalOpen(false);
    setView("pricing");
  };

  // Protected navigation handler
  const handleSetView = (targetView: string) => {
    if (targetView === "pricing") {
      setIsPremiumModalOpen(false);
      setView("pricing");
      return;
    }

    let resolvedView = targetView;
    if (targetView.startsWith("/")) {
      resolvedView = PATH_TO_VIEW_MAP[targetView] || targetView.replace(/^\/premium\//, "").replace(/^\//, "");
    }

    const PREMIUM_PROGRAMS_MAP: Record<string, string> = {
      "home-workout-challenge": "180 Day Home Workout Challenge",
      "180-day-challenge": "180 Day Home Workout Challenge",
      "home-challenge": "180 Day Home Workout Challenge",
      "women-confidence": "Women Confidence Program (180 Days)",
      "belly-fat-shred": "Belly Fat Shred System",
      "challenges": "Monthly 90-Day Challenges",
      "daily-plan": "My Daily Plan",
      "coach": "AI Fitness Coach",
      "dashboard": "Athlete Performance Desk",
      "weight-trajectory": "Weight Trajectory Logs",
      "daily-calibration-desk": "Biometric Calibration Desk",
      "saved-exercises": "Saved Drills & Workouts",
      "weekly-reports": "Weekly Progress Reports",
      "handbook": "Athlete Handbook",
      "workout-generator": "AI Workout Generator"
    };

    const loginRequiredViews = [
      ...Object.keys(PREMIUM_PROGRAMS_MAP),
      "nutrition", "community", "success-stories"
    ];

    const progName = PREMIUM_PROGRAMS_MAP[resolvedView] || resolvedView;

    // 1. Unauthenticated guest trying to access protected program -> direct to login
    if (loginRequiredViews.includes(resolvedView) && !user) {
      localStorage.setItem("fit_attempted_view", resolvedView);
      setIsAuthOpen(true);
      setView("login");
      return;
    }

    // 2. Free-tier user trying to access premium program -> tell them to upgrade & direct to pricing
    const isUserPrem = checkIsUserPremium(user);
    if (user && !isUserPrem && PREMIUM_PROGRAMS_MAP[resolvedView]) {
      localStorage.setItem("fit_upgrade_reason", progName);
      setPremiumModalFeatureName(progName);
      setIsPremiumModalOpen(true);
      setView("pricing");
      return;
    }

    setView(resolvedView);
  };

  if (loading) {
    return (
      <>
        <GlobalTransitionOverlay isVisible={true} />
        <GlobalSkeletonLoader />
      </>
    );
  }

  if (isBlockedUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#090d16] text-white p-6 font-sans select-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-display tracking-tight text-red-500 uppercase">Account Suspended</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your AlexFitnessHub Athlete profile has been suspended by an administrator. Access to workouts, AI calibration, and community channels is currently restricted.
            </p>
          </div>

          <div className="h-[1px] bg-slate-800 w-full" />

          <div className="space-y-4 text-left">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coach Alex Support Desk</h3>
            
            <div className="space-y-3">
              <a 
                href="mailto:alexfitnesshub@gmail.com" 
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-red-500/30 hover:bg-slate-900 transition-all duration-200"
              >
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Email Address</div>
                  <div className="text-xs font-mono text-slate-200">alexfitnesshub@gmail.com</div>
                </div>
              </a>

              <a 
                href="https://wa.me/2347073307875" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-red-500/30 hover:bg-slate-900 transition-all duration-200"
              >
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">WhatsApp Desktop / Mobile</div>
                  <div className="text-xs font-mono text-slate-200">+2347073307875</div>
                </div>
              </a>

              <div 
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800"
              >
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Phone Hotline</div>
                  <div className="text-xs font-mono text-slate-200">+2347073307875</div>
                </div>
              </div>

            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => {
                try {
                  localStorage.removeItem("fit_saved_email");
                  localStorage.removeItem("fit_saved_password");
                  localStorage.removeItem("fit_active_uid");
                } catch(e){}
                window.location.reload();
              }}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all duration-200"
            >
              Sign Out & Reload
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (authDatabaseError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#090d16] text-[#F8FAFC] p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-950/50 border border-amber-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-display tracking-tight text-amber-500 uppercase">Database Error</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {authDatabaseError}
            </p>
          </div>

          <div className="pt-2 flex gap-4">
            <button 
              onClick={() => {
                setAuthDatabaseError(null);
              }}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all duration-200"
            >
              Continue Offline
            </button>
            <button 
              onClick={() => {
                window.location.reload();
              }}
              className="flex-1 py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl font-bold transition-all duration-200"
            >
              Retry Connection
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground transition-colors duration-200">
      
      {/* Dynamic Header Navbar navigation */}
      <Navbar 
        currentView={currentView} 
        setView={handleSetView} 
        onOpenAuth={() => handleSetView("login")} 
      />

      {/* Main Switchboard Route Mounting with Staggered Transitions */}
      <main className="pt-20 lg:pt-24 pb-16 min-h-screen w-full max-w-full flex flex-col justify-start overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-full flex-grow flex flex-col min-w-0 overflow-x-hidden"
          >
            <React.Suspense fallback={renderSkeletonForView(currentView)}>
              {currentView === "home" && (
                <HomeView setView={handleSetView} onOpenAuth={() => handleSetView("login")} />
              )}
              {currentView === "onboarding" && (
                <OnboardingWizard />
              )}
              {currentView === "payment-success" && (
                <PaymentSuccessView />
              )}
              {currentView === "library" && (
                <WorkoutLibrary setView={handleSetView} />
              )}
              {currentView === "workout-generator" && (
                <WorkoutGeneratorView />
              )}
              {currentView === "nutrition" && (
                <NutritionView />
              )}
              {currentView === "daily-plan" && (
                <DailyPlanView />
              )}
              {["dashboard", "weekly-reports", "daily-habit-tracker", "daily-calibration-desk", "handbook", "weight-trajectory"].includes(currentView) && (
                <DashboardView activeView={currentView} setView={handleSetView} />
              )}
              {currentView === "coach" && (
                <CoachView />
              )}
              {currentView === "community" && (
                <CommunityView />
              )}
              {currentView === "challenges" && (
                <FitnessChallenges />
              )}
              {currentView === "success-stories" && (
                <SuccessView />
              )}
              {currentView === "saved-exercises" && (
                <SavedExercisesView setView={handleSetView} />
              )}
              {currentView === "workout-videos" && (
                <WorkoutVideos />
              )}
              {currentView === "belly-fat-shred" && (
                <BellyFatShredView />
              )}
              {currentView === "women-confidence" && (
                <WomenConfidenceProgram />
              )}
              {["home-workout-challenge", "180-day-challenge", "home-challenge"].includes(currentView) && (
                <HomeWorkoutChallengeView />
              )}
              {currentView === "lifestyle-academy" && (
                <LifestyleFitnessAcademy />
              )}
              {currentView === "pricing" && (
                <PricingView setView={handleSetView} onOpenAuth={() => handleSetView("login")} />
              )}
              {["bmiCalculator", "calculator", "body-calculator", "macro-calculator", "body-stats", "body-stats-calculator", "bmi-calculator", "assessment", "physique-assessment"].includes(currentView) && (
                <BodyStatsCalculatorView />
              )}
              {["login", "signin", "signup", "register", "auth"].includes(currentView) && (
                <AuthView initialMode={currentView === "signup" || currentView === "register" ? "signup" : "signin"} />
              )}

              {currentView === "store" && (
                <StoreView setView={handleSetView} onOpenAuth={() => handleSetView("login")} />
              )}

              {currentView === "admin" && (
                <AdminDashboard />
              )}
            </React.Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Auth State Modal */}
      <React.Suspense fallback={null}>
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
        />
      </React.Suspense>

      {/* Customer Reviews & Testimonial Popup */}
      <TestimonialPopup />

      {/* Daily Reminders & System Compliance Alerts Desk */}
      <DailyNotificationController />

      {/* Premium Upgrade Modal Screen */}
      <PremiumUpgradeModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
        featureName={premiumModalFeatureName} 
        onUpgrade={navigateToPricing} 
      />



      {/* Persistent Floating Workout Rest Timer Overlay */}
      <FloatingWorkoutTimerOverlay />

      {/* Network Connectivity & PWA Offline Status Indicator */}
      <OfflineIndicator />

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <StoreProvider>
          <WorkoutTimerProvider>
            <FitnessAppContent />
          </WorkoutTimerProvider>
        </StoreProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
