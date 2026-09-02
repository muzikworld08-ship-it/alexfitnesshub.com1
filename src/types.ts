export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: "user" | "admin";
  subscription?: "free" | "premium" | "none";
  subscriptionStatus: "free" | "premium";
  isPremium?: boolean;
  premiumAccess?: boolean;
  subscriptionTier: "monthly" | "yearly" | "none";
  subscriptionExpiry?: string | null;
  subscriptionPlan?: "monthly" | "yearly" | "multi" | "none";
  subscriptionActivationDate?: string;
  paymentReference?: string;
  accountType?: string;
  badge?: string;
  isFreeTrial?: boolean;
  freeTrialStatus?: "active" | "expired" | "none";
  freeTrialDaysRemaining?: number;
  fitnessGoals?: string;
  weight?: number; // in kg
  height?: number; // in cm
  gender?: string;
  createdAt?: string;

  // Onboarding & Personalization Details
  onboarded?: boolean;
  age?: number;
  targetWeight?: number;
  activityLevel?: string;
  workoutExperience?: string;
  workoutPreference?: string;
  dietaryPreference?: string;
  availableDays?: number;
  trainingLocation?: "Home" | "Gym";

  // Detailed AI Coach Onboarding Fields
  availableEquipment?: string;
  foodAllergies?: string;
  healthRestrictions?: string;
  dailySchedule?: string;
  wakeUpTime?: string;
  bedTime?: string;
  countryRegion?: string;

  // Hydration Daily Progress
  waterGoal?: number; // calculated target in ml
  waterIntakeToday?: number; // accumulated ml
  waterLastLogged?: string; // date string YYYY-MM-DD
  status?: string;
  isBlocked?: boolean;
}

export interface SavedWorkout {
  id: string; // exercise ID
  savedAt: string;
}

export interface ActivityLog {
  id: string;
  exerciseId: string;
  exerciseName: string;
  date: string; // ISO string
  weight?: number; // logged load
  reps?: number;
  duration?: string; // duration of cardiovascular
  notes?: string;
}

export interface WeightGoalLog {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // in kg
  bodyFat?: number; // optional %
}

export interface PaystackTransaction {
  id: string;
  reference: string;
  amount: number;
  plan: "monthly" | "yearly" | "multi";
  status: string;
  paidAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  message: string;
  timestamp: string;
}

// Social Community Post
export interface CommunityPost {
  id: string;
  userId: string;
  userDisplayName: string;
  userEmail: string;
  content: string;
  category: "Progress Picture" | "Workout Result" | "Transformation Story" | "Achievement" | "General Discussion" | "Challenge";
  imageUrl?: string;
  likes: string[]; // list of user Uids
  comments: {
    id: string;
    userId: string;
    userDisplayName: string;
    content: string;
    createdAt: string;
  }[];
  reports?: string[]; // list of user Uids who reported it
  status: "active" | "moderated" | "reported";
  createdAt: string; // ISO string
}

// Dedicated Success Testimonial (Success Story)
export interface Testimonial {
  id: string;
  userId: string;
  userDisplayName: string;
  userEmail: string;
  category: "Weight Loss" | "Muscle Building" | "General Journey" | "Transformation Story";
  rating: number; // 1-5 star rating
  content: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  approved: boolean; // Needs admin approval before listed globally
  createdAt: string; // ISO string
}

export interface PopupTestimonial {
  id: string;
  name: string;
  country: string;
  avatar: string;
  rating: number;
  review: string;
  membership_plan: string;
  created_at: string;
  status: "enabled" | "disabled";
  action?: string;
  timeText?: string;
}

export interface CustomProgram {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: string;
  schedule: {
    day: string;
    focus: string;
    exercises: {
      id: string;
      name: string;
      sets: number;
      reps: number;
      notes?: string;
    }[];
    mealPlan?: string;
  }[];
}

export interface VitalsLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  restingHeartRate?: number; // in bpm
  sleepDuration: number; // in hours
  hydrationGlasses?: number; // in glasses (default 8)
  readinessScore?: number; // calculated 0-100 score
  energyLevel?: number; // 1-5 scale (optional)
  notes?: string;
  createdAt?: string;
}

export interface CalibrationGoals {
  id?: string;
  userId: string;
  dailyHydrationGoal: number; // target glasses (e.g., 10)
  dailySleepGoal: number; // target hours (e.g., 8.0)
  targetReadinessScore?: number; // target readiness % (e.g., 85)
  targetRestingHeartRate?: number; // target RHR in bpm (e.g., 60)
  updatedAt?: string;
}

export interface WorkoutLibraryFilters {
  searchQuery: string;
  selectedCategory: string;
  selectedDifficulty: string;
  selectedMuscleGroup: string;
  selectedEquipment: string;
  selectedExerciseType: string;
  selectedTrainingGoal: string;
  activeBrowseTab: "bodyparts" | "cardio" | "mobility" | "programs" | "all";
}

export interface ChallengeWorkout {
  id: string;
  name: string;
  sets: string | number;
  reps: string | number;
  customMediaUrl?: string;
  customMediaType?: "image" | "video";
  gifUrl?: string;
  imageUrl?: string;
  category?: string;
  muscleGroups?: string[];
  restTime?: string;
  notes?: string;
}

export interface ProgramProgressItem {
  programId: string;
  programTitle: string;
  category?: string;
  imageUrl?: string;
  viewName?: string; // view to navigate to e.g. "90-day-challenge", "belly-fat-shred", "academy", etc.
  enrolled: boolean;
  enrolledAt: string;
  currentDay: number;
  currentWeek?: number;
  currentWorkoutIndex: number;
  lastStoppedWorkoutName: string;
  lastStoppedWorkoutId?: string;
  lastStoppedAt: string; // ISO date
  completedWorkoutIds: string[];
  totalWorkouts: number;
  progressPercent: number; // 0 - 100
  notes?: string;
  challengeId?: string | number;
  challengeTitle?: string;
  completedCount?: number;
  metadata?: Record<string, any>;
  [key: string]: any;
}

export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  category: string;
  goal: string;
  image: string;
  badgeId: string;
  badgeName: string;
  badgeColor: string;
  durationDays: number;
  isPremium: boolean;
  workouts: ChallengeWorkout[];
  createdAt?: string;
  createdBy?: string;
  isCustom?: boolean;
}

// --- ALEXFITNESSHUB STORE TYPES ---
export type ProductCategory = "Men" | "Women" | "ALEXFITNESSHUB Collections";

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductSizeGuide {
  chest?: string;
  waist?: string;
  hips?: string;
  length?: string;
  inseam?: string;
  fitType?: "Compression" | "Athletic Tapered" | "True to Size" | "Oversized Fit";
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number; // in NGN
  originalPrice?: number; // optional strike-through price
  frontImage: string;
  backImage: string;
  images?: string[];
  sizes: string[]; // e.g. ["S", "M", "L", "XL", "XXL"]
  colors: ProductColor[];
  stock: number;
  sizeStock?: Record<string, number>;
  sizeGuide?: ProductSizeGuide;
  fabric?: string;
  features?: string[];
  featured?: boolean;
  isNewArrival?: boolean;
  badge?: string;
  rating?: number;
  reviewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string; // unique item key e.g. `${productId}-${size}-${color}`
  productId: string;
  name: string;
  category: ProductCategory;
  price: number;
  image: string;
  size: string;
  color: string;
  colorHex?: string;
  quantity: number;
  maxStock: number;
}

export interface StoreDeliveryInfo {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  deliveryNotes?: string;
}

export interface StoreOrder {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: StoreDeliveryInfo;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  currency: string;
  paymentStatus: "pending" | "paid" | "failed";
  paymentReference?: string;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

