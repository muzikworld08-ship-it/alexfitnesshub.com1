/**
 * Canonical Application Routes and Navigation Mapping
 * Single Source of Truth for AlexFitnessHub URL routing across all devices.
 */

export type AppView =
  | "home"
  | "library"
  | "workout-generator"
  | "workout-videos"
  | "saved-exercises"
  | "coach"
  | "nutrition"
  | "daily-plan"
  | "challenges"
  | "community"
  | "weekly-reports"
  | "daily-habit-tracker"
  | "daily-calibration-desk"
  | "handbook"
  | "weight-trajectory"
  | "dashboard"
  | "progress-tracker"
  | "belly-fat-shred"
  | "women-confidence"
  | "home-workout-challenge"
  | "lifestyle-academy"
  | "pricing"
  | "store"
  | "product-detail"
  | "onboarding"
  | "login"
  | "signin"
  | "signup"
  | "register"
  | "admin"
  | "payment-success"
  | "bmiCalculator"
  | "success-stories";

/**
 * 1:1 Canonical View -> Path mapping
 * Every view resolves to its ONE true official URL path.
 */
export const VIEW_TO_PATH_MAP: Record<string, string> = {
  home: "/",
  library: "/library",
  "workout-generator": "/workout-generator",
  "workout-videos": "/workout-videos",
  "saved-exercises": "/saved-exercises",
  coach: "/coach",
  nutrition: "/nutrition",
  "daily-plan": "/daily-plan",
  challenges: "/challenges",
  community: "/community",
  "weekly-reports": "/weekly-reports",
  "daily-habit-tracker": "/daily-habit-tracker",
  "daily-calibration-desk": "/daily-calibration-desk",
  handbook: "/handbook",
  "weight-trajectory": "/weight-trajectory",
  dashboard: "/dashboard",
  "progress-tracker": "/progress-tracker",
  "belly-fat-shred": "/belly-fat-shred",
  "women-confidence": "/women-confidence",
  "home-workout-challenge": "/home-workout-challenge",
  "lifestyle-academy": "/lifestyle-academy",
  pricing: "/pricing",
  store: "/store",
  "product-detail": "/product-detail",
  onboarding: "/onboarding",
  login: "/login",
  signin: "/login",
  signup: "/login",
  register: "/login",
  admin: "/admin",
  "payment-success": "/payment/success",
  bmiCalculator: "/body-stats-calculator",
  "success-stories": "/success-stories"
};

/**
 * Path -> View resolution mapping
 * Includes canonical paths and any legacy aliases to ensure old links work seamlessly.
 */
export const PATH_TO_VIEW_MAP: Record<string, string> = {
  "/": "home",
  "/payment/success": "payment-success",
  "/payment-success": "payment-success",
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
  "/challenge-engine": "challenges",
  "/premium/challenge-engine": "challenges",
  "/workout-engine": "challenges",
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
  "/progress-tracker": "progress-tracker",
  "/tracker": "progress-tracker",
  "/activity-tracker": "progress-tracker",
  "/premium/progress-tracker": "progress-tracker",
  "/belly-fat-shred": "belly-fat-shred",
  "/premium/belly-fat-shred": "belly-fat-shred",
  "/women-confidence": "women-confidence",
  "/premium/women-confidence": "women-confidence",
  "/home-workout-challenge": "home-workout-challenge",
  "/180-day-challenge": "home-workout-challenge",
  "/home-challenge": "home-workout-challenge",
  "/premium/home-workout-challenge": "home-workout-challenge",
  "/lifestyle-academy": "lifestyle-academy",
  "/posture-vitality": "lifestyle-academy",
  "/reclaim-posture": "lifestyle-academy",
  "/pricing": "pricing",
  "/premium/pricing": "pricing",
  "/store": "store",
  "/shop": "store",
  "/apparel": "store",
  "/merch": "store",
  "/product": "product-detail",
  "/product-detail": "product-detail",
  "/item": "product-detail",
  "/onboarding": "onboarding",
  "/login": "login",
  "/signin": "login",
  "/signup": "login",
  "/register": "login",
  "/admin": "admin",
  "/premium/admin": "admin",
  "/bmi-calculator": "bmiCalculator",
  "/bmiCalculator": "bmiCalculator",
  "/body-stats": "bmiCalculator",
  "/body-stats-calculator": "bmiCalculator",
  "/macro-calculator": "bmiCalculator",
  "/assessment": "bmiCalculator",
  "/physique-assessment": "bmiCalculator",
  "/success-stories": "success-stories"
};

/**
 * Deterministic URL Path -> View Resolver
 * Used on initial app mount and browser history events across all devices.
 */
export function resolveViewFromPath(pathname: string): string {
  // Normalize trailing slash (except root '/')
  const normalized = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

  if (PATH_TO_VIEW_MAP[normalized]) {
    return PATH_TO_VIEW_MAP[normalized];
  }

  // Fallback: Default to "home" view
  return "home";
}
