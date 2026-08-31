import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Shield, CheckCircle, ArrowRight, Zap, Flame, 
  Play, Users, X, HelpCircle, Clipboard, ChevronDown, Star, Lock, MessageCircle, ChevronLeft,
  Mail, Bell, Heart, Sparkles, Activity, Crown,
  Scale, Clock, Plus, TrendingUp, Droplet, ChevronRight, Target, Award, Dumbbell, Compass
} from "lucide-react";
import { motion } from "motion/react";
import { NewsletterSubscription } from "./NewsletterSubscription";
import Logo from "./Logo";
import { OptimizedImage } from "./OptimizedImage";
import ContinueProgramTracker from "./ContinueProgramTracker";
import { PROGRAMS } from "../data/exercises";

const workoutCategories = [
  {
    id: "chest",
    title: "Chest Isolation",
    desc: "Sculpt upper chest divisions using premium cable flyes & barbell press alignments.",
    exercises: "45 Drills",
    image: "https://workoutguru.fit/wp-content/uploads/2024/02/african-bodybuilder-posing-gym-1-edited.jpg",
    tag: "Upper Body",
  },
  {
    id: "back",
    title: "Lat & Back Columns",
    desc: "Build high flare lats and thick upper rhomboids with rows & pullup layouts.",
    exercises: "38 Drills",
    image: "https://generationiron.com/wp-content/uploads/2022/02/How-To-Do-Wide-grip-Lat-Pulldown-1200x675-1-1024x576.jpg",
    tag: "V-Taper",
  },
  {
    id: "biceps",
    title: "Bicep Peak Triggers",
    desc: "Engage peak brachialis fibers under supreme tension with seated dumbbell curls.",
    exercises: "24 Drills",
    image: "https://learn.athleanx.com/wp-content/uploads/2024/06/HOW-TO-BICEPS.jpg",
    tag: "Hypertrophy",
  },
  {
    id: "triceps",
    title: "Tricep Horseshoe",
    desc: "Isolate lateral push heads utilizing heavy overhead rope extensions.",
    exercises: "28 Drills",
    image: "https://learn.athleanx.com/wp-content/uploads/2021/09/MAIN-IMAGE.png",
    tag: "Push Power",
  },
  {
    id: "shoulders",
    title: "Deltoid Cap Boulder",
    desc: "Target anterior and posterior caps with scapular plane stability guides.",
    exercises: "35 Drills",
    image: "https://i.ytimg.com/vi/yS80o90nm_k/maxresdefault.jpg",
    tag: "Symmetry",
  },
  {
    id: "legs",
    title: "Quad & Leg Pillars",
    desc: "Stimulate depth hypertrophy using back squats and clean hamstring curls.",
    exercises: "50 Drills",
    image: "https://guycounseling.com/wp-content/uploads/2014/10/leg-workout.jpg",
    tag: "Lower Body",
  },
  {
    id: "abs",
    title: "Abdominal Shred",
    desc: "Slam abdominal walls utilizing leg raises and controlled core compression.",
    exercises: "22 Drills",
    image: "https://learn.athleanx.com/wp-content/uploads/2021/08/MAIN-MAGE.png",
    tag: "Core Core",
  }
];

const verifiedUserReviews = [
  {
    name: "Amara K.",
    location: "Lagos Resident",
    period: "12 Weeks",
    achievement: "Lost 18.6 KG • 34% to 21% Body Fat",
    content: "The 12-30-3 cardio walk saved my knees! Combined with the local diet calibrator to substitute yams for lean fish and egg whites, I lost substantial belly fat without going hungry. The AI coach guided my macros every single Sunday.",
    rating: 5,
    goal: "Weight Loss"
  },
  {
    name: "Tobi S.",
    location: "Abuja Athlete",
    period: "16 Weeks",
    achievement: "Lost 19.8 KG • 29% to 13% Body Fat",
    content: "My absolute objective was to expose my abdominal muscles and rebuild a deep chest alignment. Tracking slow eccentric sets and training compound lifts with the custom barbell routines helped me gain muscle while shredding 20 kg.",
    rating: 5,
    goal: "Muscle Building"
  },
  {
    name: "David O.",
    location: "Port Harcourt",
    period: "8 Weeks",
    achievement: "Lost 9.5 KG • 26% to 17% Body Fat",
    content: "Needed to drop weight rapidly to secure a military physical fitness score. The targeted ab isolation guides and zero-fluff nutrition matrix got me there in only two months. Absolute clinical standard programs.",
    rating: 5,
    goal: "Weight Loss"
  },
  {
    name: "Chioma A.",
    location: "Enugu Executive",
    period: "10 Weeks",
    achievement: "Lost 12.1 KG • 30% to 18% Body Fat",
    content: "Balancing long corporate hours meant I needed extreme efficiency. Executing the 12% treadmill incline walks while tracking my routines kept me disciplined daily. Unbeatable layout and superb mobile-friendly flow.",
    rating: 5,
    goal: "General Journey"
  },
  {
    name: "Babajide Y.",
    location: "Ibadan Trainee",
    period: "6 Weeks",
    achievement: "Gained 4 KG Muscle • Re-composed Frame",
    content: "The local meal plans are the best part. Substituting high-carb processed foods with localized portions of beans, chicken breast, and green vegetables gave me constant energy for my compound lifts.",
    rating: 5,
    goal: "Muscle Building"
  },
  {
    name: "Fatima B.",
    location: "Kano",
    period: "14 Weeks",
    achievement: "Lost 15.2 KG • Improved Cardio",
    content: "Highly safe and private home routines. I followed the bodyweight core plans in my living room. The step-by-step videos make correct forms incredibly easy to learn without standard gym stress.",
    rating: 5,
    goal: "Weight Loss"
  },
  {
    name: "Emeka N.",
    location: "Onitsha Strongman",
    period: "20 Weeks",
    achievement: "Bench Press +35 KG • Squat +50 KG",
    content: "Barbell coaching is pristine. Learning the correct biomechanics for progressive overload completely resolved my shoulder discomfort. The absolute gold standard of online strength tracking.",
    rating: 5,
    goal: "Muscle Building"
  },
  {
    name: "Yetunde O.",
    location: "Lekki Practitioner",
    period: "12 Weeks",
    achievement: "Lost 14.0 KG • Shredded Obliques",
    content: "The interface is exceptionally polished! Tracking my water intake and following the low-carb guidelines was seamless. Lowered my resting heart rate significantly.",
    rating: 5,
    goal: "General Journey"
  },
  {
    name: "Chinedu E.",
    location: "Asaba Elite",
    period: "8 Weeks",
    achievement: "Lost 8.2 KG • Enhanced Stamina",
    content: "No unnecessary features or annoying popups. The plan builder lets me log custom repetitions and weight curves. My strength endurance has quadrupled over the past two months.",
    rating: 5,
    goal: "General Journey"
  },
  {
    name: "Amina U.",
    location: "Kaduna Scholar",
    period: "10 Weeks",
    achievement: "Lost 11.0 KG • Postpartum Recovery",
    content: "Perfect low-impact routines that didn't stress my joints. The customized advice and simple steps tracker helped me get back to my active weight safely and consistently.",
    rating: 5,
    goal: "Weight Loss"
  },
  {
    name: "Osas I.",
    location: "Benin Builder",
    period: "12 Weeks",
    achievement: "Gained 5.5 KG Muscle • Reduced Fat",
    content: "Simple instructions and highly realistic local diet advice without any expensive imported supplements. I highly recommend the high tension bicep isolation splits.",
    rating: 5,
    goal: "Muscle Building"
  },
  {
    name: "Kelechi O.",
    location: "Owerri",
    period: "12 Weeks",
    achievement: "Lost 13.5 KG • Waist -5 Inches",
    content: "I love the clean, modern look of the app. Checking off daily water and step targets has become an automatic habit. Highly responsive UI and zero friction.",
    rating: 5,
    goal: "Weight Loss"
  },
  {
    name: "Funmi A.",
    location: "Akure Executive",
    period: "16 Weeks",
    achievement: "Blood Pressure Normalized • Lost 16 KG",
    content: "Helped me prioritize long term cardio health. The pacing guidelines for inclined walks and daily physical routine checks completely transformed my physical state.",
    rating: 5,
    goal: "General Journey"
  },
  {
    name: "Tari Q.",
    location: "Yenagoa Dancer",
    period: "6 Weeks",
    achievement: "Improved Mobility • Core Flex Strength",
    content: "The lateral delt and glute programs are extremely optimized. Every exercise has clear instruction targets that ensure absolute safety during eccentric movements.",
    rating: 5,
    goal: "General Journey"
  },
  {
    name: "Ibrahim M.",
    location: "Jos Runner",
    period: "12 Weeks",
    achievement: "5K Run time -6 Mins • Lost 10 KG",
    content: "Finally broke my fat loss plateau with progressive overload sets. The custom barbell routines are incredibly effective and perfectly timed for busy schedules.",
    rating: 5,
    goal: "Weight Loss"
  },
  {
    name: "Blessing E.",
    location: "Calabar Gymnast",
    period: "14 Weeks",
    achievement: "Gained Lean Definition • Flex Level Up",
    content: "The absolute focus on hamstring and knee health is amazing. My balance has improved, and I feel vastly stronger in daily functional movements.",
    rating: 5,
    goal: "Muscle Building"
  },
  {
    name: "Yusuf T.",
    location: "Ilorin Athlete",
    period: "10 Weeks",
    achievement: "Lost 12.5 KG • Sculpted Deltoids",
    content: "I save thousands of Naira using these home barbell splits instead of paying for expensive gym coaches. The app serves as a perfect pocket personal trainer.",
    rating: 5,
    goal: "General Journey"
  },
  {
    name: "Ngozi P.",
    location: "Aba Retailer",
    period: "8 Weeks",
    achievement: "Lost 7.8 KG • Cardio Restored",
    content: "Excellent mobile view. I can easily log my daily steps and calorie count while on the move. Super clean layout and very encouraging flow.",
    rating: 5,
    goal: "Weight Loss"
  },
  {
    name: "Victor C.",
    location: "Warri Engineer",
    period: "12 Weeks",
    achievement: "Squat Depth Peak • Gained 6 KG Muscle",
    content: "Zero fluff. The local dietary guidelines actually fit the local foods I eat every day. Bench, squat, and curl isolation guides are top tier.",
    rating: 5,
    goal: "Muscle Building"
  },
  {
    name: "Aisha K.",
    location: "Sokoto Teacher",
    period: "18 Weeks",
    achievement: "Lost 17.5 KG • Body Fat -12%",
    content: "Excellent high-contrast design that is easy on the eyes. Following the structured body weight cardiorespiratory program has made me incredibly consistent.",
    rating: 5,
    goal: "Weight Loss"
  }
];

const getGenderForName = (name: string, content?: string): "female" | "male" | "neutral" => {
  const norm = name.trim().toLowerCase();
  
  const femaleNames = ["amara", "chioma", "fatima", "yetunde", "amina", "funmi", "blessing", "ngozi", "aisha", "sarah", "emma", "olivia", "sophia", "mia", "grace", "lily", "chloe", "ava", "isabella", "amelia", "charlotte", "ella", "harper", "evelyn", "clara"];
  const maleNames = ["tobi", "david", "babajide", "emeka", "chinedu", "osas", "kelechi", "tari", "ibrahim", "yusuf", "victor", "john", "michael", "james", "daniel", "noah", "ethan", "ryan", "lucas", "benjamin", "henry", "jack", "william", "mason", "sam", "samuel", "alex"];

  for (const fn of femaleNames) {
    if (norm.startsWith(fn)) return "female";
  }
  for (const mn of maleNames) {
    if (norm.startsWith(mn)) return "male";
  }

  const text = (content || "").toLowerCase();
  if (/\b(she|her|hers)\b/.test(text)) return "female";
  if (/\b(he|his|him)\b/.test(text)) return "male";

  return "neutral";
};

interface HomeViewProps {
  setView: (view: string) => void;
  onOpenAuth: () => void;
}

export default function HomeView({ setView, onOpenAuth }: HomeViewProps) {
  const { 
    user, 
    upgradeWithPaystack,
    weightLogs, 
    addWeightLogAction, 
    communityPosts, 
    addCommunityPost, 
    likePost, 
    commentOnPost 
  } = useApp();

  // Public Interactive Preview Widgets state
  const [activeDemoTab, setActiveDemoTab] = useState<"trajectory" | "community" | "calibration" | "habits">(() => {
    if (typeof window !== "undefined" && (window as any).__activeDemoTab) {
      return (window as any).__activeDemoTab;
    }
    return "trajectory";
  });

  useEffect(() => {
    const handleSetTab = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && ["trajectory", "community", "calibration", "habits"].includes(detail)) {
        setActiveDemoTab(detail as any);
      }
    };
    window.addEventListener("set-demo-tab", handleSetTab);

    return () => {
      window.removeEventListener("set-demo-tab", handleSetTab);
    };
  }, []);
  
  // Weight Trajectory preview states
  const [localWeightLogs, setLocalWeightLogs] = useState<any[]>([]);
  const [publicNewWeight, setPublicNewWeight] = useState("");
  const [submittingPublicWeight, setSubmittingPublicWeight] = useState(false);
  const [weightToast, setWeightToast] = useState<string | null>(null);

  // Community preview states
  const [localPosts, setLocalPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmittingNewPost, setIsSubmittingNewPost] = useState(false);
  const [postToast, setPostToast] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Calibration Desk preview states
  const [publicGlasses, setPublicGlasses] = useState(() => parseInt(localStorage.getItem("alexfit_public_hydration") || "4"));
  const [publicCaloriesIn, setPublicCaloriesIn] = useState(2000);
  const [publicCaloriesOut, setPublicCaloriesOut] = useState(2500);
  const [publicRemTime, setPublicRemTime] = useState(() => localStorage.getItem("alexfit_public_reminder_time") || "08:00");
  const [calibrationToast, setCalibrationToast] = useState<string | null>(null);

  // Daily Habit Tracker preview states
  const [publicHabits, setPublicHabits] = useState<any[]>([
    { id: "h1", name: "Lemon & Cucumber Hydration Protocol", desc: "Consumed at least 8 glasses of cucumber/lemon ambient water", done: false },
    { id: "h2", name: "Lean Protein Target", desc: "Secure 1.6g to 2.2g of high quality protein per kg of body weight", done: false },
    { id: "h3", name: "8 Hours Growth Sleep", desc: "Optimal sleep hygiene for nocturnal growth hormone release", done: false },
    { id: "h4", name: "Daily Core Conditioning", desc: "Completed 5-10 minute specialized kinetic abdominal strengthening", done: false },
    { id: "h5", name: "Post-Workout Eccentric Stretch", desc: "3-5 sets of passive active stretch to release tissue micro-tears", done: false }
  ]);
  const [streakCount, setStreakCount] = useState(() => parseInt(localStorage.getItem("alexfit_public_streak") || "3"));
  const [habitToast, setHabitToast] = useState<string | null>(null);

  // Weight Trajectory state sync
  useEffect(() => {
    if (user && weightLogs && weightLogs.length > 0) {
      setLocalWeightLogs(weightLogs);
    } else {
      const saved = localStorage.getItem("alexfit_public_weight_logs");
      if (saved) {
        try {
          setLocalWeightLogs(JSON.parse(saved));
        } catch (e) {
          const defaultLogs = [
            { date: "07/15", weight: 85.2 },
            { date: "07/16", weight: 84.8 },
            { date: "07/17", weight: 84.1 },
            { date: "07/18", weight: 83.5 },
            { date: "07/19", weight: 82.9 },
            { date: "07/20", weight: 82.2 }
          ];
          setLocalWeightLogs(defaultLogs);
        }
      } else {
        const defaultLogs = [
          { date: "07/15", weight: 85.2 },
          { date: "07/16", weight: 84.8 },
          { date: "07/17", weight: 84.1 },
          { date: "07/18", weight: 83.5 },
          { date: "07/19", weight: 82.9 },
          { date: "07/20", weight: 82.2 }
        ];
        setLocalWeightLogs(defaultLogs);
        localStorage.setItem("alexfit_public_weight_logs", JSON.stringify(defaultLogs));
      }
    }
  }, [user, weightLogs]);

  // Community posts state sync
  useEffect(() => {
    if (communityPosts && communityPosts.length > 0) {
      setLocalPosts(communityPosts.filter(p => p.status === "active").slice(0, 5));
    }
  }, [communityPosts]);

  // Weight Logging action
  const handlePublicWeightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(publicNewWeight);
    if (isNaN(parsed) || parsed <= 30 || parsed >= 250) {
      alert("Please specify a valid biometric weight value (30kg - 250kg).");
      return;
    }

    setSubmittingPublicWeight(true);
    try {
      if (user && addWeightLogAction) {
        await addWeightLogAction(parsed);
        setWeightToast("Successfully logged weight checkpoint to Firebase!");
      } else {
        const todayStr = new Date().toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' });
        const newLog = { date: todayStr, weight: parsed };
        const updated = [...localWeightLogs, newLog].slice(-10);
        setLocalWeightLogs(updated);
        localStorage.setItem("alexfit_public_weight_logs", JSON.stringify(updated));
        setWeightToast("Saved to browser preview! Sign In to persist on Cloud Run.");
      }
      setPublicNewWeight("");
      setTimeout(() => setWeightToast(null), 4000);
    } catch (err) {
      console.warn("Could not submit weight log:", err);
    } finally {
      setSubmittingPublicWeight(false);
    }
  };

  // Community post submit action
  const handlePublicPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsSubmittingNewPost(true);
    try {
      if (user && addCommunityPost) {
        await addCommunityPost(newPostContent, "General Discussion");
        setPostToast("Post shared with the whole community!");
      } else {
        const tempId = `temp_post_${Date.now()}`;
        const newPostItem = {
          id: tempId,
          userDisplayName: "Visitor Pro",
          content: newPostContent,
          category: "General Discussion",
          createdAt: new Date().toISOString(),
          likes: [],
          comments: [],
          status: "active"
        };
        const updated = [newPostItem, ...localPosts];
        setLocalPosts(updated);
        setPostToast("Shared to local preview! Sign In to post publicly.");
      }
      setNewPostContent("");
      setTimeout(() => setPostToast(null), 4000);
    } catch (err) {
      console.warn("Error posting:", err);
    } finally {
      setIsSubmittingNewPost(false);
    }
  };

  // Community like action
  const handlePublicLike = async (postId: string) => {
    if (user && likePost) {
      try {
        await likePost(postId);
      } catch (err) {
        console.warn("Could not like post:", err);
      }
    } else {
      setLocalPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const hasLiked = p.likes.includes("visitor_temp_uid");
          const nextLikes = hasLiked 
            ? p.likes.filter((id: string) => id !== "visitor_temp_uid")
            : [...p.likes, "visitor_temp_uid"];
          return { ...p, likes: nextLikes };
        }
        return p;
      }));
      setPostToast("Liked! Sign In to persist your engagement.");
      setTimeout(() => setPostToast(null), 3000);
    }
  };

  // Community comment action
  const handlePublicComment = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    if (user && commentOnPost) {
      try {
        await commentOnPost(postId, commentText);
        setCommentInputs(prev => ({ ...prev, [postId]: "" }));
        setPostToast("Comment added successfully!");
      } catch (err) {
        console.warn("Could not comment on post:", err);
      }
    } else {
      setLocalPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const newComment = {
            id: `temp_comm_${Date.now()}`,
            userDisplayName: "Visitor Pro",
            content: commentText,
            createdAt: new Date().toISOString()
          };
          return { ...p, comments: [...p.comments, newComment] };
        }
        return p;
      }));
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
      setPostToast("Comment added to preview! Sign In to sync.");
    }
    setTimeout(() => setPostToast(null), 3500);
  };

  // Calibration water incrementer
  const handlePublicGlassChange = (diff: number) => {
    const next = Math.max(0, publicGlasses + diff);
    setPublicGlasses(next);
    localStorage.setItem("alexfit_public_hydration", String(next));
    if (next >= 10) {
      setCalibrationToast("⭐ Hydration targets fully met! Perfect cellular water balance.");
      setTimeout(() => setCalibrationToast(null), 4000);
    }
  };

  // Calibration time reminder
  const savePublicReminder = (time: string) => {
    setPublicRemTime(time);
    localStorage.setItem("alexfit_public_reminder_time", time);
    setCalibrationToast("⏰ Reminder scheduled successfully! Alert system initialized.");
    setTimeout(() => setCalibrationToast(null), 3500);
  };

  // Habits checkbox toggle
  const togglePublicHabit = (id: string) => {
    const updated = publicHabits.map(h => {
      if (h.id === id) {
        return { ...h, done: !h.done };
      }
      return h;
    });
    setPublicHabits(updated);
    
    const allChecked = updated.every(h => h.done);
    if (allChecked) {
      const nextStreak = streakCount + 1;
      setStreakCount(nextStreak);
      localStorage.setItem("alexfit_public_streak", String(nextStreak));
      setHabitToast(`🏆 Compliance 100%! Growth streak increased to ${nextStreak} Days!`);
    } else {
      setHabitToast(null);
    }
  };

  // Sort the verified user reviews according to their name gender
  const sortedVerifiedReviews = React.useMemo(() => {
    return [...verifiedUserReviews].sort((a, b) => {
      const genA = getGenderForName(a.name, a.content);
      const genB = getGenderForName(b.name, b.content);
      if (genA !== genB) {
        return genA.localeCompare(genB); // Grouping females first, then males, then neutrals
      }
      return a.name.localeCompare(b.name);
    });
  }, []);

  // Carousel slider state for Hero
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      eyebrow: "PHYSIQUE SPECIALIZATION",
      wordOne: "FORGE",
      wordTwo: "ATHLETICISM",
      desc: "Experience world-class body sculpting. Unified by certified clinical kinesiologists, interactive progress logs, and advanced multi-modal Gemini AI coaching. Track actual metric goals with absolute precision.",
      imageUrl: "https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2019/01/Young-Muscular-Fitness-Model-Near-Barbell-Bench.jpg?quality=86&strip=all"
    },
    {
      eyebrow: "NUTRITIONAL METRICS",
      wordOne: "SHRED",
      wordTwo: "PLATEAUS",
      desc: "Calibrate localized macronutrient diet plans tailored precisely for high protein staples, tracking absolute body weight goals daily with the assistance of interactive progress reports.",
      imageUrl: "https://img.magnific.com/free-photo/strong-bodybuilder-demonstrating-muscular-body-sports-gym_7502-10713.jpg"
    },
    {
      eyebrow: "AI POWERED SOLUTIONS",
      wordOne: "COMMAND",
      wordTwo: "INTELLIGENCE",
      desc: "Unlock server-side Gemini intelligence models to consult your lifting technique, optimize water ratios, and design recovery splits tailored for performance athletes.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcaCK8cFkIl7siMw7nHkiPhCfUj9Nzu_fURv1oSooC03cyOt1LpLTuG_2B&s=10"
    }
  ];

  // Auto-play interval for hero carousel (5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // States for reviews/testimonials
  const [reviewFilter, setReviewFilter] = useState("All");
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Contact Form state engines
  const [contactName, setContactName] = useState(user?.displayName || "");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [contactGoal, setContactGoal] = useState("hypertrophy");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !contactName) {
      alert("Please provide valid name and email targets.");
      return;
    }
    setIsSubmittingContact(true);
    setTimeout(() => {
      setIsSubmittingContact(false);
      setContactSubmitted(true);
      setContactMessage("");
    }, 950);
  };

  useEffect(() => {
    if (user) {
      setContactEmail(user.email || "");
      setContactName(user.displayName || user.email?.split("@")[0] || "");
    }
  }, [user]);

  const faqsList = [
    {
      q: "How does the Treadmill Walk 12-30-3 function?",
      a: "Treadmill Walk 12-30-3 is a globally verified protocol: 12% incline gradient, 3.0 mph speed pace, for 30 minutes continuous. This targets local fat oxidation directly, bypassing standard systemic glycogen burn while protecting knee joints from impact damage."
    },
    {
      q: "How secure is my subscription status and account data?",
      a: "All subscription and training history is securely saved within our cloud infrastructure using standard industrial AES-256 equivalent socket layers. We do not hold or process any billing credentials directly on our platforms. Your profile is kept entirely private and can be closed or cleared anytime."
    },
    {
      q: "What is the differences between Free and Premium memberships?",
      a: "Free members have standard access to base movements and basic progress logging. Premium members unlock our full 1,200+ scaled fitness database, complete HD anatomical movement loops with 0.5x Slow and 3s Eccentric coaching models, custom V-Taper curriculums, and unlimited AI coach calibrations."
    },
    {
      q: "Can I cancel or alter my multi-month selections?",
      a: "Absolutely. Standard multi-month selections are valid for the selected calendar span and are not bound by long-term legal liabilities. You can upgrade, downgrade, or return to the free athlete tier without any extra administrative penalties."
    },
    {
      q: "Are meal recommendation profiles customizable for local foods?",
      a: "Yes! Our intelligence systems understand regional food databases (including high-protein staples such as egg whites, plantains, lean beef, beans, local greens, and fish). The macros are calibrated dynamically onto your current biological weight targets."
    }
  ];

  return (
    <div id="home-view-root" className="bg-background text-foreground min-h-screen relative font-sans animate-fade-in">
      
      {/* 1. HERO SECTION - COMPELLING BRIGHT SOLO VISUAL BANNER */}
      <section id="hero-segment" className="relative h-[55vh] sm:h-[65vh] lg:h-[75vh] w-full overflow-hidden bg-background border-b border-border">
        
        {/* Cinematic Background Image - Ultra-Bright, High-Exposure & Clear */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="https://github.com/muzikmail2-arch/Git/blob/main/ChatGPT%20Image%20Jul%2018,%202026,%2006_59_52%20PM.png?raw=true" 
            alt="Alex Fitness Hub Elite Training Facility"
            loading="eager"
            decoding="async"
            {...({ fetchPriority: "high" } as any)}
            className="w-full h-full object-cover object-center scale-100 filter brightness-125 contrast-110 saturate-105"
            referrerPolicy="no-referrer"
          />
          {/* Subtle light vignettes just to frame the layout gently while keeping everything bright and white-based */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/15 to-transparent" />
        </div>

        {/* Dynamic visual badge for the solo hero */}
        <div className="absolute bottom-6 right-6 z-10 bg-card/95 backdrop-blur-md border border-border rounded-full px-5 py-2 flex items-center gap-2 shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[10px] font-mono font-black text-foreground tracking-widest uppercase">
            ALEX FIT CENTER • LIVE SESSION READY
          </p>
        </div>
      </section>

      {/* CONTINUATION SECTION - RESUME WHERE YOU LEFT OFF */}
      <section id="continue-program-section" className="py-6 sm:py-8 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContinueProgramTracker onNavigate={setView} />
        </div>
      </section>

      {/* NEW PROMOTIONAL ADVERT BANNER - LIFESTYLE FITNESS ACADEMY */}
      <section id="academy-promo-advert" className="py-8 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-card rounded-3xl border border-border shadow-md overflow-hidden flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 gap-8 text-left relative"
          >
            {/* Background absolute highlights */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full filter blur-xl pointer-events-none" />
            
            {/* Left side: Premium Image */}
            <div className="w-full md:w-1/3 h-52 sm:h-60 rounded-2xl overflow-hidden relative shadow-inner shrink-0 bg-slate-100 border border-slate-150">
              <OptimizedImage 
                src="https://github.com/muzikmail2-arch/Git/blob/main/ChatGPT%20Image%20Jul%2018,%202026,%2007_10_59%20PM.png?raw=true" 
                alt="Lifestyle Fitness Academy Stretching & Mobility Coaching"
                priority={true}
                loading="eager"
                fetchPriority="high"
                aspectRatio="16/9"
                className="w-full h-full object-cover object-center filter brightness-105 contrast-105"
              />
              <div className="absolute top-3 left-3 bg-red-600 text-white font-mono font-black text-[9px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Coaching Course
              </div>
            </div>

            {/* Middle: Content */}
            <div className="flex-grow space-y-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider rounded-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                  FREE TRIAL AVAILABLE
                </div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight leading-tight">
                  LIFESTYLE FITNESS ACADEMY
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed max-w-xl">
                  Learn to prevent and overcome modern health challenges. From <strong className="text-slate-900 uppercase font-bold">AI Desk Body Syndrome</strong> to <strong className="text-slate-900 uppercase font-bold">Sitting Disease</strong> and <strong className="text-slate-900 uppercase font-bold">Stress Burnout</strong>, build ironclad habits with Alex's structured corrective protocols.
                </p>
              </div>

              {/* Quick Perks Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-700 font-bold">
                  <CheckCircle className="w-4 h-4 text-[#D32F2F] shrink-0" />
                  <span>10 Core Wellness Programs</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-bold">
                  <CheckCircle className="w-4 h-4 text-[#D32F2F] shrink-0" />
                  <span>Interactive Habit Sync</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-bold">
                  <CheckCircle className="w-4 h-4 text-[#D32F2F] shrink-0" />
                  <span>Adaptive Training Plans</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-bold">
                  <CheckCircle className="w-4 h-4 text-[#D32F2F] shrink-0" />
                  <span>Stretching Routines</span>
                </div>
              </div>
            </div>

            {/* Right: CTA Button */}
            <div className="shrink-0 w-full md:w-auto flex flex-col items-center sm:items-start md:items-end gap-2">
              <button
                onClick={() => setView("lifestyle-academy")}
                className="w-full md:w-auto px-8 py-4 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-sans font-black text-xs uppercase rounded-full shadow-lg hover:shadow-red-500/20 hover:-translate-y-0.5 transition duration-200 cursor-pointer text-center whitespace-nowrap inline-flex items-center justify-center gap-2"
              >
                <span>ENTER THE ACADEMY</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                First 2 challenges 100% Free
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW PROMOTIONAL ADVERT BANNER - IMMORTAL 90-DAY PREMIUM CHALLENGE */}
      <section id="immortal-challenge-promo-advert" className="py-8 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-slate-900 via-red-950 to-slate-950 rounded-3xl border border-red-900/40 shadow-xl overflow-hidden flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 gap-8 text-left relative"
          >
            {/* Background absolute highlights */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full filter blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-red-500/10 rounded-full filter blur-2xl pointer-events-none" />
            
            {/* Left side: Premium Image */}
            <div className="w-full md:w-1/3 h-52 sm:h-60 rounded-2xl overflow-hidden relative shadow-inner shrink-0 bg-slate-900 border border-red-900/30">
              <OptimizedImage 
                src="https://github.com/muzikmail2-arch/Git/blob/main/ChatGPT%20Image%20Jul%2018,%202026,%2007_15_20%20PM.png?raw=true" 
                alt="Immortal 90-Day Challenge Athletic Training"
                aspectRatio="16/9"
                className="w-full h-full object-cover object-center filter brightness-110 contrast-110 saturate-100"
              />
              <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-mono font-black text-[9px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                PREMIUM FLAGSHIP
              </div>
            </div>

            {/* Middle: Content */}
            <div className="flex-grow space-y-4 text-white">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-wider rounded-lg border border-amber-500/20">
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  IMMORTAL ELITE BLUEPRINT
                </div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight text-white">
                  Immortal 90-Day Challenge
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-semibold leading-relaxed max-w-xl">
                  Unlock our ultimate 90-day athletic transformation system. Complete with daily progressive overload kinesiologist guides, interactive biological metrics tracking, official trophy cabinets, and live personal coach assignment.
                </p>
              </div>

              {/* Quick Perks Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md pt-1 text-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>90 Days Custom Workouts</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Personal Coach Assigned</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Interactive Bio-Metrics</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Official Graduation PDF</span>
                </div>
              </div>
            </div>

            {/* Right: CTA Button */}
            <div className="shrink-0 w-full md:w-auto flex flex-col items-center sm:items-start md:items-end gap-2">
              <button
                onClick={() => {
                  if (!user) {
                    onOpenAuth();
                    return;
                  }
                  if (user.subscriptionStatus === "premium" || user.role === "admin") {
                    setView("challenges");
                  } else {
                    setView("pricing");
                  }
                }}
                className="w-full md:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-black text-xs uppercase rounded-full shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 transition duration-200 cursor-pointer text-center whitespace-nowrap inline-flex items-center justify-center gap-2"
              >
                <span>JOIN 90-DAY CHALLENGE</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                {user && (user.subscriptionStatus === "premium" || user.role === "admin") ? "Unlocked for Premium" : "Requires Premium Upgrade"}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 1.1 INTERACTIVE ENGINE & PREMIUM SLIDESHOW - PLACED DIRECTLY BELOW THE HERO */}
      <section id="hero-carousel-segment" className="py-12 sm:py-16 lg:py-20 bg-background border-b border-border relative overflow-hidden">
        {/* Decorative background visual accents */}
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-red-500/5 rounded-full filter blur-3xl pointer-events-none select-none" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none select-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center">
            
            {/* Premium bright high-contrast card ensuring absolutely no word is hidden */}
            <div className="w-full max-w-4xl bg-slate-50 rounded-[2.5rem] border border-slate-200 p-6 sm:p-10 lg:p-12 shadow-xl flex flex-col justify-center items-center text-center text-slate-900 relative">
              <div className="relative min-h-[340px] sm:min-h-[260px] md:min-h-[220px] lg:min-h-[180px] w-full">
                {heroSlides.map((slide, idx) => {
                  const isActive = idx === currentSlide;
                  return (
                    <div 
                      key={idx}
                      className={`transition-all duration-[350ms] ease-out space-y-5 flex flex-col items-center ${
                        isActive 
                          ? "opacity-100 translate-y-0 scale-100" 
                          : "opacity-0 translate-y-4 scale-98 absolute inset-0 pointer-events-none"
                      }`}
                    >
                      <span className="text-[10px] font-mono font-black tracking-[0.25em] text-white uppercase bg-[#D32F2F] px-4 py-1.5 rounded-full inline-block shadow-md">
                        {slide.eyebrow}
                      </span>
                      
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black tracking-tight leading-tight uppercase select-none">
                        <span className="bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent">
                          {slide.wordOne}
                        </span>{" "}
                        <span className="text-slate-950">
                          {slide.wordTwo}
                        </span>
                      </h1>

                      <p className="text-xs sm:text-sm text-slate-700 max-w-2xl leading-relaxed font-sans font-semibold">
                        {slide.desc}
                      </p>

                      <div className="flex flex-wrap justify-center gap-4 pt-1">
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 20px rgba(211,47,47,0.4)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setView("library")}
                          className="px-6 py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-sans font-extrabold text-xs uppercase rounded-full shadow-lg transition-all duration-200 cursor-pointer"
                        >
                          Start Training
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setView("pricing")}
                          className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 font-sans font-black text-xs uppercase rounded-full border border-slate-200 shadow-md transition-all duration-200 cursor-pointer"
                        >
                          View Pricing
                        </motion.button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Carousel Navigation Mechanics */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200 w-full">
                
                {/* Pagination dots: active = red dot, inactive = slate-200 */}
                <div className="flex items-center gap-3">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`transition-all duration-300 cursor-pointer ${
                        idx === currentSlide 
                          ? "bg-[#D32F2F] w-8 h-2 rounded-full shadow-[0_0_10px_rgba(211,47,47,0.4)]" 
                          : "bg-slate-300 w-3 h-2 rounded-full hover:bg-slate-400"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Round arrow nav buttons: light circle, dark chevron */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevSlide}
                    className="p-3 rounded-full bg-white text-slate-800 hover:bg-[#D32F2F] hover:text-white transition-colors duration-200 shadow-sm cursor-pointer border border-slate-200"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="p-3 rounded-full bg-white text-slate-800 hover:bg-[#D32F2F] hover:text-white transition-colors duration-200 shadow-sm cursor-pointer border border-slate-200"
                    aria-label="Next slide"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 1.1 ELITE PERFORMANCE GALLERY & DEMONSTRATION */}
      <section id="elite-gallery-segment" className="py-16 bg-background border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side: Premium High-Definition Video Player Container (Moved from Hero) */}
            <div className="lg:col-span-6 relative w-full flex flex-col justify-center">
              <div className="mb-4 text-left">
                <span className="text-[9px] font-mono font-black tracking-widest text-[#D32F2F] uppercase bg-red-50 px-2.5 py-1 rounded-full">
                  Elite Live Demonstration
                </span>
                <h3 className="text-xl font-sans font-black text-slate-900 uppercase mt-2">
                  Alex Fitness Hub Live Session
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Witness real-time training biomechanics and dynamic feedback in action.
                </p>
              </div>
              <div className="relative w-full aspect-[16/10] rounded-3xl p-2 bg-gradient-to-tr from-[#D4AF37] to-amber-500 shadow-xl group overflow-hidden border border-slate-200">
                <div className="w-full h-full rounded-[1.4rem] overflow-hidden bg-black relative">
                  <OptimizedImage
                    src="https://builtwithscience.com/wp-content/uploads/2026/01/F3-8.webp"
                    alt="Alex Fitness Hub Live Session"
                    aspectRatio="16/9"
                    className="w-full h-full object-cover opacity-100 scale-100 transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Glowing Premium Highlight Badges */}
                  <div className="absolute top-4 left-4 bg-[#D32F2F] text-white text-[9px] font-sans font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 z-10 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                    LIVE SESSIONS
                  </div>

                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-[9px] font-mono tracking-widest px-3 py-1.5 rounded-lg border border-white/10 z-10">
                    HD 1080P | ACTIVE FORM RECON
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Dynamic Slide Imagery Showcase (Moved from Hero) */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="mb-4 text-left">
                <span className="text-[9px] font-mono font-black tracking-widest text-[#D4AF37] uppercase bg-amber-50 px-2.5 py-1 rounded-full">
                  Specialization Spotlights
                </span>
                <h3 className="text-xl font-sans font-black text-slate-900 uppercase mt-2">
                  Training & Nutrition Curriculums
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Explore our core visual pillars from the active training guide programs.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {heroSlides.map((slide, idx) => (
                  <motion.div 
                    whileHover={{ y: -4, scale: 1.03, boxShadow: "0 12px 24px -10px rgba(0,0,0,0.15)" }}
                    whileTap={{ scale: 0.98 }}
                    key={idx} 
                    className={`rounded-2xl overflow-hidden border transition-all duration-300 relative group bg-slate-100 h-40 cursor-pointer shadow-sm ${
                      idx === currentSlide 
                        ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-md" 
                        : "border-slate-200 opacity-85"
                    }`}
                    onClick={() => setCurrentSlide(idx)}
                  >
                    <OptimizedImage 
                      src={slide.imageUrl} 
                      alt={slide.eyebrow}
                      aspectRatio="16/9"
                      className="w-full h-full object-cover transition-transform duration-[700ms] filter brightness-110"
                    />
                    
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-white/95 backdrop-blur-xs border-t border-slate-100 text-left">
                      <p className="text-[8px] font-mono font-black tracking-widest text-[#D32F2F] uppercase">
                        {slide.wordOne}
                      </p>
                      <h4 className="text-[11px] font-sans font-black text-slate-900 uppercase mt-0.5 leading-tight">
                        {slide.wordTwo} Suite
                      </h4>
                    </div>

                    {idx === currentSlide && (
                      <span className="absolute top-2 right-2 text-[8px] font-mono font-black tracking-wider text-white bg-[#D4AF37] px-2 py-0.5 rounded-full uppercase">
                        Active
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
              
              {/* Highlight card for currently active details */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono font-black text-[#D32F2F] bg-red-50 px-2 py-0.5 rounded uppercase">
                    {heroSlides[currentSlide].eyebrow}
                  </span>
                  <span className="text-[8px] font-mono font-black tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                    PRO CLINICAL TRACKER
                  </span>
                </div>
                <h4 className="text-sm font-sans font-black text-slate-900 uppercase mt-2">
                  {heroSlides[currentSlide].wordOne} {heroSlides[currentSlide].wordTwo}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {heroSlides[currentSlide].desc}
                </p>
              </div>

            </div>

          </div>
        </motion.div>
      </section>



      {/* 1.2 THE SPECTACULAR CORE HD WORKOUT COACHING STREAM */}
      <section id="hd-video-stream" className="py-20 bg-secondary border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-sans font-black tracking-[0.25em] text-[#D32F2F] uppercase bg-red-50 px-3.5 py-1.5 rounded-full inline-block">
              HD WORKOUT PREVIEW
            </span>
            <h2 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-slate-900 uppercase">
              ALEXFITNESSHUB <span className="text-[#D32F2F]">HD TRAINING STREAM</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-lg mx-auto leading-relaxed font-sans">
              Examine real-time biomechanics under perfect studio lighting. Learn correct hip hinge depth, chest contraction lines, and eccentric deceleration ratios.
            </p>
            <div className="h-1 w-16 bg-[#D32F2F] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* The Massive Bright HD Video View (7/12 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-4 border border-gray-200 shadow-lg flex flex-col justify-between">
              <div>
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-slate-100">
                  <OptimizedImage
                    src="https://manofmany.com/_next/image?url=https%3A%2F%2Fapi.manofmany.com%2Fwp-content%2Fuploads%2F2023%2F08%2F14-Best-Dumbbell-Workouts-and-Exercises-For-a-Full-Body-Workout.jpg&w=1200&q=75"
                    alt="AlexFitnessHub HD Training Stream"
                    aspectRatio="16/9"
                    className="w-full h-full object-cover opacity-100"
                  />

                  {/* Absolute Bright Overlays */}
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-[9px] font-sans font-black tracking-widest px-3 py-1 rounded-full uppercase shadow flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-ping"></span>
                    ACTIVE INSTRUCTOR FEED
                  </div>

                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white text-[10px] space-y-1 text-left">
                    <p className="font-black uppercase tracking-wider text-white">CURRENT FOCUS: SLOW LATERAL SHIFT</p>
                    <div className="flex gap-4 font-mono text-[9px] text-gray-300">
                      <span>TIME: 00:14 / 00:30</span>
                      <span>TEMPO: 3-0-1-1</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 text-left space-y-2">
                  <h3 className="text-lg font-sans font-black text-[#D32F2F] uppercase">
                    ECCENTRIC TENSION OVERVIEW: LATERAL CARDIO KETTLEBELL
                  </h3>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans">
                    Watch the hips shift backward cleanly to maximize hamstring leverage and posterior chain load distribution. This specific form safely locks the lumbar spine to target core stabilization while accelerating local heart-rate fat oxidation.
                  </p>
                </div>
              </div>

              {/* Form Calibration Markers */}
              <div className="mt-6 pt-5 border-t border-gray-150 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-100/50 text-left">
                  <span className="block text-[8px] font-sans font-black text-[#6B6B6B] uppercase tracking-wider">HEART RATE GOAL</span>
                  <p className="text-sm font-sans font-black text-[#D32F2F] uppercase">135 - 155 BPM</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-left">
                  <span className="block text-[8px] font-sans font-black text-[#6B6B6B] uppercase tracking-wider">TARGET MUSCLE</span>
                  <p className="text-sm font-sans font-black text-[#2E7D32] uppercase">VISCERAL GLUTE / CORES</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-left">
                  <span className="block text-[8px] font-sans font-black text-[#6B6B6B] uppercase tracking-wider">EST. FAT SHRED RATIO</span>
                  <p className="text-sm font-sans font-black text-black uppercase">94% CAL / HR</p>
                </div>
              </div>

            </div>

            {/* Sidebar Lift Channel Guide (4/12 cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-xs font-sans font-black uppercase text-[#D32F2F] tracking-wider pb-3 border-b border-gray-150 text-left">
                  RECOMMENDED HD LIFT CHANNELS
                </h4>
                
                {/* Channel List */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border border-[#C8E6C9] bg-[#E8F5E9] flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-full bg-[#2E7D32] flex items-center justify-center text-white shrink-0">
                      <Play className="w-3.5 h-3.5 text-white fill-current" />
                    </div>
                    <div>
                      <p className="text-xs font-sans font-black uppercase text-[#2E7D32]">12-30-3 LIPOLYSIS WALK</p>
                      <p className="text-[10px] text-emerald-800 leading-none mt-0.5">Cardio Zone 2 | Target Belly Adipose</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-gray-200 hover:border-red-200 bg-white flex items-center gap-3 text-left transition cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-slate-900 hover:bg-[#D32F2F] flex items-center justify-center text-white shrink-0">
                      <Play className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-sans font-black uppercase text-black">CHEST FLYES ISOLATION</p>
                      <p className="text-[10px] text-[#6B6B6B] leading-none mt-0.5">Continuous Cable Tension | 3s Hold</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-gray-200 hover:border-red-200 bg-white flex items-center gap-3 text-left transition cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-slate-900 hover:bg-[#D32F2F] flex items-center justify-center text-white shrink-0">
                      <Play className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-sans font-black uppercase text-black">LAT COLUMNS DEEP ROW</p>
                      <p className="text-[10px] text-[#6B6B6B] leading-none mt-0.5">Rhomboid Flexion | Strict Elbow Sweep</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-gray-200 hover:border-red-200 bg-white flex items-center gap-3 text-left transition cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-slate-900 hover:bg-[#D32F2F] flex items-center justify-center text-white shrink-0">
                      <Play className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-sans font-black uppercase text-black">DEPTH SQUATS ALIGNMENT</p>
                      <p className="text-[10px] text-[#6B6B6B] leading-none mt-0.5">Full Hip Crease Clearance | Safe Quadriceps</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-150">
                <button
                  onClick={() => setView("workout-videos")}
                  className="w-full py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-sans font-black text-xs uppercase rounded-xl transition duration-200"
                >
                  EXPLORE FULL VIDEO ARCHIVE
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      </section>

      {/* 1.3 INTERACTIVE LIFESTYLE & EXERCISE DIRECTORY */}
      <section id="lifestyle-exercise-directory" className="py-24 bg-background border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] font-sans font-black tracking-[0.2em] text-[#6B6B6B] uppercase block">
              NAVIGATIONAL HUB
            </span>
            <h2 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-slate-900 uppercase">
              CHOOSE YOUR <span className="text-[#D32F2F]">ATHLETIC PATHWAY</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-lg mx-auto leading-relaxed">
              Click on any directory target below to instantly redirect to targeted training libraries, nutrition macro profiles, or physical video walkthroughs.
            </p>
            <div className="h-1 w-16 bg-[#D32F2F] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* CARD 1: EXERCISE LIBRARY */}
            <div 
              onClick={() => setView("library")}
              className="group relative rounded-3xl overflow-hidden border border-gray-200 bg-white h-[340px] flex flex-col cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="h-44 w-full overflow-hidden relative bg-slate-100 border-b border-gray-100">
                <OptimizedImage 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCbe0AW9uRYSPjXXgL3nwdjYa1JzOdUvZEz3fxoDa8Qw&s=10" 
                  alt="Elite Exercise Library"
                  aspectRatio="16/9"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5 flex-1 bg-white text-left flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[8px] font-sans font-black tracking-widest text-[#D32F2F] bg-red-50 px-2 py-0.5 rounded uppercase">
                    1,200+ DRILLS
                  </span>
                  <h3 className="text-sm font-sans font-black text-slate-900 uppercase mt-1">
                    EXERCISE LIBRARY
                  </h3>
                  <p className="text-[10px] text-slate-600 leading-normal line-clamp-2">
                    Complete muscle contraction drills, equipment targets, and slow tempo setups.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-[#D32F2F] font-bold uppercase mt-2 group-hover:translate-x-1.5 transition-transform">
                  EXPLORE DRILLS <ArrowRight className="w-3 h-3 text-[#D32F2F]" />
                </span>
              </div>
            </div>

            {/* CARD 2: MEAL PLANS & LIFESTYLE */}
            <div 
              onClick={() => setView("nutrition")}
              className="group relative rounded-3xl overflow-hidden border border-gray-200 bg-white h-[340px] flex flex-col cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="h-44 w-full overflow-hidden relative bg-slate-100 border-b border-gray-100">
                <OptimizedImage 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRaMrGT8LyvfZbPnJafBlhFFt_2Uu7bSoic5qq0Mikg-SxnSqkOvlxAR_1&s=10" 
                  alt="Macro & Meal Planner"
                  aspectRatio="16/9"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5 flex-1 bg-white text-left flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[8px] font-sans font-black tracking-widest text-[#2E7D32] bg-emerald-50 px-2 py-0.5 rounded uppercase">
                    LOCAL INGREDIENTS
                  </span>
                  <h3 className="text-sm font-sans font-black text-slate-900 uppercase mt-1">
                    NUTRITION PORTAL
                  </h3>
                  <p className="text-[10px] text-slate-600 leading-normal line-clamp-2">
                    Calibrate plantains, beans, egg whites, and clean fish for macro targets.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-[#D32F2F] font-bold uppercase mt-2 group-hover:translate-x-1.5 transition-transform">
                  CALIBRATE DIET <ArrowRight className="w-3 h-3 text-[#D32F2F]" />
                </span>
              </div>
            </div>

            {/* CARD 3: BIOMECHANICAL VIDEOS */}
            <div 
              onClick={() => setView("workout-videos")}
              className="group relative rounded-3xl overflow-hidden border border-gray-200 bg-white h-[340px] flex flex-col cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="h-44 w-full overflow-hidden relative bg-slate-100 border-b border-gray-100">
                <OptimizedImage 
                  src="https://www.healthyads.com/wp-content/uploads/2025/10/Best-Gym-Advertisement-Examples-featured.webp" 
                  alt="Form Technique Videos"
                  aspectRatio="16/9"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5 flex-1 bg-white text-left flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[8px] font-sans font-black tracking-widest text-[#D32F2F] bg-red-50 px-2 py-0.5 rounded uppercase">
                    HD VISUALS
                  </span>
                  <h3 className="text-sm font-sans font-black text-slate-900 uppercase mt-1">
                    TECHNIQUE SHOWCASE
                  </h3>
                  <p className="text-[10px] text-slate-600 leading-normal line-clamp-2">
                    0.5x slow-motion loops demonstrating exact eccentric biomechanics.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-[#D32F2F] font-bold uppercase mt-2 group-hover:translate-x-1.5 transition-transform">
                  LAUNCH CHANNEL <ArrowRight className="w-3 h-3 text-[#D32F2F]" />
                </span>
              </div>
            </div>

            {/* CARD 4: GEMINI COACH CONSULT */}
            <div 
              onClick={() => setView("coach")}
              className="group relative rounded-3xl overflow-hidden border border-gray-200 bg-white h-[340px] flex flex-col cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="h-44 w-full overflow-hidden relative bg-slate-100 border-b border-gray-100">
                <OptimizedImage 
                  src="https://www.blenderbottle.com/cdn/shop/articles/Strategies_for_Success.jpg?v=1772976464&width=2048" 
                  alt="AI Coach Consultation"
                  aspectRatio="16/9"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5 flex-1 bg-white text-left flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[8px] font-sans font-black tracking-widest text-[#2E7D32] bg-emerald-50 px-2 py-0.5 rounded uppercase">
                    GEMINI CALIBRATED
                  </span>
                  <h3 className="text-sm font-sans font-black text-slate-900 uppercase mt-1">
                    GEMINI AI CHAT
                  </h3>
                  <p className="text-[10px] text-slate-600 leading-normal line-clamp-2">
                    Acquire direct posture tuning, customized cardio plans, and meal corrections instantly.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-[#D32F2F] font-bold uppercase mt-2 group-hover:translate-x-1.5 transition-transform">
                  CHAT WITH COACH <ArrowRight className="w-3 h-3 text-[#D32F2F]" />
                </span>
              </div>
            </div>

          </div>

        </motion.div>
      </section>

      {/* 1.5 INTERACTIVE PLATFORM TECHNIQUE GUIDE */}
      <section id="technique-walkthrough" className="py-24 bg-secondary border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#C0392B] uppercase bg-[#C0392B]/10 px-3.5 py-1 rounded-full inline-block">
              MASTER YOUR MECHANICS
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#1C1C1C] uppercase">
              How to Use <span className="text-[#C0392B]">AlexFitnessHub</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-lg mx-auto leading-relaxed font-sans">
              Unlock the secrets of perfect lifting technique and whole-body biomechanical accuracy in three simple steps.
            </p>
            <div className="h-1 w-16 bg-[#C0392B] mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 relative shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div className="absolute top-6 right-8 text-4xl font-black text-slate-100 font-mono group-hover:text-[#C0392B]/10 transition-colors font-sans">01</div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#C0392B]/5 text-[#C0392B] flex items-center justify-center">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black uppercase text-[#1C1C1C] tracking-tight font-display">Search for Exercises</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans font-normal">
                  Head over to our <strong>Workout Library</strong> to search and filter over 1,200+ specific kinesis exercises and muscle group isolation drills curated by our clinical experts.
                </p>
              </div>
              <button 
                onClick={() => setView("library")}
                className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-[#C0392B] text-white rounded-xl text-[10px] font-bold tracking-wider uppercase transition-colors font-mono cursor-pointer"
              >
                Go to Library
              </button>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 relative shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div className="absolute top-6 right-8 text-4xl font-black text-slate-100 font-mono group-hover:text-[#C0392B]/10 transition-colors font-sans">02</div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Play className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black uppercase text-[#1C1C1C] tracking-tight font-display">Study the Video Technique</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans font-normal">
                  Watch ultra-clear, high-definition motion loops demonstrating exact physical setup, muscle activation points, and tempo rules on our dedicated video page.
                </p>
              </div>
              <button 
                onClick={() => setView("workout-videos")}
                className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-sky-600 text-white rounded-xl text-[10px] font-bold tracking-wider uppercase transition-colors font-mono cursor-pointer"
              >
                Watch Videos
              </button>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 relative shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div className="absolute top-6 right-8 text-4xl font-black text-slate-100 font-mono group-hover:text-[#C0392B]/10 transition-colors font-sans">03</div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black uppercase text-[#1C1C1C] tracking-tight font-display">Lock Form & Track Progress</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans font-normal">
                  Apply advanced coaching tips during your lifting sessions. Save exercises, monitor slow eccentric phases, and track training targets in real-time.
                </p>
              </div>
              <button 
                onClick={() => setView("saved-exercises")}
                className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-bold tracking-wider uppercase transition-colors font-mono cursor-pointer"
              >
                Saved Exercises
              </button>
            </div>

          </div>
        </motion.div>
      </section>

      {/* 2. ALTERNATING ROW SECTIONS: CLINICAL METHODOLOGY */}
      <section id="why-choose-us" className="py-24 bg-background border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-2">
            <span className="text-[10px] font-sans font-black tracking-[0.2em] text-[#6B6B6B] uppercase block">
              CLINICAL STANDARDS
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#1C1C1C] uppercase">
              REVOLUTIONIZING <span className="text-[#C0392B]">PERFORMANCE</span>
            </h2>
            <div className="h-1 w-16 bg-[#C0392B] mx-auto mt-3" />
          </div>

          <div className="space-y-20">
            {/* Row 1: Red Icon, Right Text */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="w-20 h-20 rounded-full bg-[#C0392B] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#C0392B]/10">
                <Flame className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-xl font-display font-black text-[#1C1C1C] uppercase tracking-tight">
                  1,200+ <span className="text-[#C0392B]">Kinesis Blueprints</span>
                </h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed font-sans">
                  Deploy targeted kinesis movements charted with high-resolution anatomical guides, custom equipment splits, and precise intensity thresholds. Perfect for breaking physical plateaus.
                </p>
              </div>
            </div>

            {/* Row 2: Dark Charcoal Icon, Left Text (Alternating) */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
              <div className="w-20 h-20 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center shrink-0 shadow-lg">
                <Zap className="w-10 h-10 text-[#C0392B]" />
              </div>
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-xl font-display font-black text-[#1C1C1C] uppercase tracking-tight">
                  Gemini <span className="text-[#C0392B]">Diet Calibration</span>
                </h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed font-sans">
                  Our secure server-side systems understand localized African staples (plantains, boiled yams, beans, fish indexes) and calibrate them perfectly matching your physical weight targets.
                </p>
              </div>
            </div>

            {/* Row 3: Red Icon, Right Text (Alternating) */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="w-20 h-20 rounded-full bg-[#C0392B] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#C0392B]/10">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-xl font-display font-black text-[#1C1C1C] uppercase tracking-tight">
                  Industrial-Grade <span className="text-[#C0392B]">Account Security</span>
                </h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed font-sans">
                  Seamless premium subscription activations guarded by standard enterprise security. Cancel, extend, or alter settings instantly with total transparent local management.
                </p>
              </div>
            </div>
          </div>

        </motion.div>
      </section>

      {/* 3. SHOWCASE OF CATEGORIES SECTION */}
      <section id="categories-segment" className="py-24 bg-secondary border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] font-sans font-black tracking-[0.2em] text-[#6B6B6B] uppercase block">
              PHYSIQUE INDEX
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#1C1C1C] uppercase">
              TRAINING <span className="text-[#C0392B]">SPECIALIZATION</span>
            </h2>
            <div className="h-1 w-16 bg-[#C0392B] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {workoutCategories.map((cat) => (
              <div 
                key={cat.id}
                className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[360px]"
              >
                 <div className="h-44 w-full overflow-hidden relative">
                   <OptimizedImage 
                     src={cat.image} 
                     alt={cat.title}
                     aspectRatio="16/9"
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-110"
                   />
                   <span className="absolute top-3 left-3 bg-white/95 border border-slate-200 text-[#D32F2F] text-[9px] font-sans font-black tracking-wider px-2.5 py-1 rounded-md uppercase z-20 shadow-sm">
                     {cat.tag}
                   </span>
                   <span className="absolute bottom-3 right-3 bg-[#D32F2F] text-white text-[10px] font-sans font-black px-2.5 py-1 rounded-md z-20 shadow-sm">
                     {cat.exercises}
                   </span>
                 </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1 text-left">
                    <h4 className="font-display font-black text-sm text-[#1C1C1C] uppercase leading-snug">
                      {cat.title}
                    </h4>
                    <p className="text-xs text-[#6B6B6B] leading-normal line-clamp-2">
                      {cat.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => setView("library")}
                    className="mt-4 w-full py-2.5 bg-[#1C1C1C] hover:bg-[#C0392B] text-white hover:text-white rounded-xl text-[10px] font-sans font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1"
                  >
                    <span>Deploy Routine</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </motion.div>
      </section>

      {/* 3.5 CLINICALLY STRUCTURED TRAINING PROGRAMS & WHAT THEY DO */}
      <section id="programs-curriculum" className="py-24 bg-[#FAFAFA] border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-sans font-black tracking-[0.25em] text-[#D32F2F] uppercase bg-red-50 border border-red-150 px-3.5 py-1.5 rounded-full inline-block">
              COMPLETE ROADMAP DIRECTORY
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#1C1C1C] uppercase">
              STRUCTURED PROGRAMS <span className="text-[#C0392B]">& HOW THEY WORK</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-2xl mx-auto leading-relaxed font-sans font-normal">
              Every body has distinct physiological demands. Explore our certified curriculums designed to eliminate guesswork, accelerate fat oxidation, and build lasting strength safely.
            </p>
            <div className="h-1 w-16 bg-[#C0392B] mx-auto mt-4" />
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROGRAMS.map((program) => {
              const totalDays = program.schedule.length;
              const isBellyFat = program.id === "5-month-belly-fat";
              return (
                <div
                  key={program.id}
                  className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-[#D32F2F]/40"
                >
                  <div>
                    {/* Image / Header Media */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                      <OptimizedImage
                        src={program.imageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop"}
                        alt={program.name}
                        aspectRatio="16/9"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                        <span className="px-2.5 py-1 rounded-md text-[9px] font-mono font-black uppercase tracking-wider bg-white text-[#1C1C1C] shadow-sm">
                          {program.category}
                        </span>
                        {program.isPremium ? (
                          <span className="px-2.5 py-1 rounded-md text-[9px] font-mono font-black uppercase tracking-wider bg-[#D32F2F] text-white flex items-center gap-1 shadow-sm">
                            <Crown className="w-3 h-3 fill-current" />
                            Premium
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md text-[9px] font-mono font-black uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
                            Free Access
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10">
                        <span className="text-[11px] font-mono font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#D32F2F]" />
                          {program.duration}
                        </span>
                        <span className="text-[10px] font-mono font-bold uppercase bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded">
                          {program.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Program Information Content */}
                    <div className="p-6 space-y-4 text-left">
                      <div className="space-y-1">
                        <h4 className="font-display font-black text-lg text-[#1C1C1C] uppercase leading-tight group-hover:text-[#D32F2F] transition-colors">
                          {program.name}
                        </h4>
                        <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans">
                          {program.description}
                        </p>
                      </div>

                      {/* What this program does & how it helps */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 space-y-2">
                        <div className="flex items-center gap-1.5 text-[#D32F2F] text-[10px] font-mono font-black uppercase tracking-wider">
                          <Target className="w-3.5 h-3.5" />
                          <span>Primary Outcomes & Benefits</span>
                        </div>
                        <ul className="space-y-1.5 text-[11px] text-slate-700 font-sans">
                          {program.id === "5-month-belly-fat" && (
                            <>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Visceral Fat Oxidation:</strong> Systematically attacks deep organ fat.</span>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Transverse Core Strength:</strong> Flattens lower belly pouch and improves posture.</span>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Zone 2 Incline Protocol:</strong> Preserves joints while optimizing resting metabolism.</span>
                              </li>
                            </>
                          )}
                          {program.id === "30-day-challenge" && (
                            <>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Daily Consistency:</strong> Builds unbreakable 30-day exercise habits.</span>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Cardiovascular Stamina:</strong> Enhances VO2 max and overall daily energy.</span>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Low Friction:</strong> Minimal equipment needed for high-adherence home training.</span>
                              </li>
                            </>
                          )}
                          {program.id === "7-day-quick-burn" && (
                            <>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Rapid Calorie Deficit:</strong> High-intensity bursts in just 15 minutes a day.</span>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>EPOC Afterburn:</strong> Elevates metabolic rate for hours post-workout.</span>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Time-Efficient:</strong> Engineered for busy executives and packed schedules.</span>
                              </li>
                            </>
                          )}
                          {program.id === "women-confidence-180" && (
                            <>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Glute & Hip Shaping:</strong> Progressive overload targeting glute medius & maximus.</span>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Hourglass Waist Toning:</strong> Vacuum holds and deep abdominal compression.</span>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Scapular Alignment:</strong> Opens chest, pulls back shoulders, and elevates posture.</span>
                              </li>
                            </>
                          )}
                          {program.id === "athletic-conditioning-hybrid" && (
                            <>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Explosive Power & Torque:</strong> Kettlebell swings, cleans, and rotational velocity.</span>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Unbreakable Work Capacity:</strong> Blends sprint conditioning with functional carries.</span>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Real-World Athleticism:</strong> Prevents sport-related injuries and joint imbalances.</span>
                              </li>
                            </>
                          )}
                          {program.id === "bodyweight-training" && (
                            <>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Relative Strength Mastery:</strong> Planche, handstand, and lever progressions.</span>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Zero Equipment Needed:</strong> Transform anywhere with bodyweight physics.</span>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Tendon & Scapular Health:</strong> Strengthens connective tissues and stabilizing joints.</span>
                              </li>
                            </>
                          )}
                          {program.id === "core-strength" && (
                            <>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Spinal Decompression:</strong> Bulletproofs lower back and lumbar vertebrae.</span>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Transverse Wall Bracing:</strong> Creates a tight, functional natural weight belt.</span>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Posture Stability:</strong> Eliminates anterior pelvic tilt and slouching habits.</span>
                              </li>
                            </>
                          )}
                          {program.id === "functional-mobility-longevity" && (
                            <>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Hip & Thoracic Mobility:</strong> Unlocks tight desk-bound hips and stiff spines.</span>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Pain-Free Movement:</strong> Eliminates morning stiffness and joint friction.</span>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>Parasympathetic Recovery:</strong> Reduces systemic stress and improves sleep.</span>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>

                      {/* Schedule Breakdown Sneak Peek */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                          Curriculum Structure ({totalDays} Phased Rotations):
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {program.schedule.slice(0, 3).map((sch, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-[9px] font-mono text-slate-600 border border-slate-200/60"
                            >
                              {sch.focus.split(":")[0]}
                            </span>
                          ))}
                          {totalDays > 3 && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[9px] font-mono text-slate-400">
                              +{totalDays - 3} more phases
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Program Action Button */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => {
                        if (isBellyFat) {
                          setView("belly-fat-shred");
                        } else if (program.id === "women-confidence-180") {
                          setView("women-confidence");
                        } else if (program.id === "30-day-challenge" || program.id === "7-day-quick-burn" || program.id === "athletic-conditioning-hybrid") {
                          setView("challenges");
                        } else {
                          setView("library");
                        }
                      }}
                      className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                        isBellyFat
                          ? "bg-[#D32F2F] hover:bg-[#B71C1C] text-white shadow-[#D32F2F]/20"
                          : "bg-[#1C1C1C] hover:bg-[#C0392B] text-white"
                      }`}
                    >
                      <span>{isBellyFat ? "Launch 5-Month Melt" : "Start This Program"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Banner Callout */}
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-lg">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>100% Biomechanically Verified</span>
              </div>
              <h4 className="text-xl font-display font-black uppercase tracking-tight">
                Not Sure Which Program Matches Your Goal?
              </h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Take our AI-assisted Physique Assessment or chat with our automated Gemini coach to formulate your ideal nutrition deficit, macro ratios, and program schedule.
              </p>
            </div>
            <button
              onClick={() => setView("bmiCalculator")}
              className="py-3 px-6 rounded-2xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-sans font-black text-xs uppercase tracking-wider transition duration-200 shrink-0 shadow-lg cursor-pointer flex items-center gap-2 border-0"
            >
              <Activity className="w-4 h-4" />
              <span>Calculate Body Stats & Macros</span>
            </button>
          </div>

        </motion.div>
      </section>

      {/* 4. PREMIUM INSTRUMENTS SECTION */}
      <section className="py-24 bg-background border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] font-sans font-black tracking-[0.2em] text-[#6B6B6B] uppercase block">
              PREMIUM UTILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#1C1C1C] uppercase">
              HIGH PERFORMANCE <span className="text-[#C0392B]">FEATURES</span>
            </h2>
            <div className="h-1 w-16 bg-[#C0392B] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-[#F7F7F7] rounded-2xl border border-gray-200 hover:border-[#C0392B] transition-all duration-250 text-left">
              <div className="w-10 h-10 rounded-full bg-[#C0392B] flex items-center justify-center text-white mb-5">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <h4 className="font-display font-black text-sm uppercase text-[#1C1C1C] mb-2">0.5x Slow Biomechanics</h4>
              <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans">
                Observe precision muscle insertions with ultra-slow performance playback. Lock perfect concentric angles easily.
              </p>
            </div>

            <div className="p-6 bg-[#F7F7F7] rounded-2xl border border-gray-200 hover:border-[#C0392B] transition-all duration-250 text-left">
              <div className="w-10 h-10 rounded-full bg-[#1C1C1C] flex items-center justify-center text-white mb-5">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-display font-black text-sm uppercase text-[#1C1C1C] mb-2">3s Eccentric Guidance</h4>
              <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans">
                Focus on high-tension eccentric phases with dynamic countdown tools. Maximize motor unit recruitment safely.
              </p>
            </div>

            <div className="p-6 bg-[#F7F7F7] rounded-2xl border border-gray-200 hover:border-[#C0392B] transition-all duration-250 text-left">
              <div className="w-10 h-10 rounded-full bg-[#C0392B] flex items-center justify-center text-white mb-5">
                <Clipboard className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-display font-black text-sm uppercase text-[#1C1C1C] mb-2">Anatomical Guides</h4>
              <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans">
                Prevent joints from heavy strain. See crystal clear muscle activation layouts for back, legs, and shoulder splits.
              </p>
            </div>

            <div className="p-6 bg-[#F7F7F7] rounded-2xl border border-gray-200 hover:border-[#C0392B] transition-all duration-250 text-left">
              <div className="w-10 h-10 rounded-full bg-[#1C1C1C] flex items-center justify-center text-white mb-5">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-display font-black text-sm uppercase text-[#1C1C1C] mb-2">Secured Access System</h4>
              <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans">
                Direct clearances with completely transparent renewals management. Start or change subscription terms instantly.
              </p>
            </div>
          </div>

        </motion.div>
      </section>

      {/* 4.6 THE SCIENCE OF BELLY FAT OXIDATION & WEIGHT REDUCTION */}
      <section id="fat-loss-blueprint" className="py-24 bg-secondary border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-sans font-black tracking-[0.25em] text-[#D32F2F] uppercase bg-red-50 px-3.5 py-1.5 rounded-full inline-block">
              SCIENTIFIC METABOLIC TRUTH
            </span>
            <h2 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-slate-900 uppercase">
              HOW TO BURN BELLY FAT <span className="text-[#D32F2F]">& LOSE WEIGHT</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-lg mx-auto leading-relaxed font-sans font-normal">
              Banish useless fitness myths. Explore the clinical biochemistry of lipid mobilization and learn exactly how to shred deep visceral belly fat safely.
            </p>
            <div className="h-1 w-16 bg-[#D32F2F] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: The 4 Step Lipolysis Formula */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 text-left space-y-8">
              <h3 className="text-xl font-sans font-black uppercase text-black pb-3 border-b border-gray-150">
                THE 4-PHASE LIPID MOBILIZATION PROTOCOL
              </h3>

              <div className="space-y-6">
                
                {/* Step 1 */}
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#D32F2F] text-white flex items-center justify-center shrink-0 text-xs font-sans font-black">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-sans font-black text-black uppercase">
                      Establish a Caloric Deficit Defensible Line
                    </h4>
                    <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans font-normal">
                      Fat loss is governed by thermodynamics. You must consume 15% to 20% fewer calories than your Total Daily Energy Expenditure (TDEE). The server-side Gemini calibrator helps you customize this margin seamlessly using regional whole food staples.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#D32F2F] text-white flex items-center justify-center shrink-0 text-xs font-sans font-black">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-sans font-black text-black uppercase">
                      Trigger Lipolysis with 12-30-3 Incline Cardio
                    </h4>
                    <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans font-normal">
                      Walking at a 12% incline gradient, at 3.0 mph speed pace, for 30 minutes continuous, pushes your cardiovascular system into **Heart Rate Zone 2** (approx. 65% of max HR). This maximizes fat oxidation rates while preserving knee and joint cartilage.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#D32F2F] text-white flex items-center justify-center shrink-0 text-xs font-sans font-black">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-sans font-black text-black uppercase">
                      Prioritize High Eccentric-Tension Compound Lifts
                    </h4>
                    <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans font-normal">
                      Isolating abs does not "spot-reduce" belly fat. Spot reduction is a biological impossibility. Instead, deploy heavy rows, depth squats, and chest presses. These activate major skeletal muscle groups, keeping insulin sensitivity high and resting metabolic rate elevated.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#D32F2F] text-white flex items-center justify-center shrink-0 text-xs font-sans font-black">
                    4
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-sans font-black text-black uppercase">
                      Manage Cortisol, Satiety & Sleep Cycles
                    </h4>
                    <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans font-normal">
                      High cortisol stress levels force the endocrine system to store visceral fat in the lower stomach area. Protect your sleep schedule, focus on high-volume high-satiety foods (spinach, local beans, lean beef, boiled plantains), and hydrate with 3.5L of water daily.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Visceral Fat Visual Guide Card */}
            <div className="lg:col-span-5 bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 text-left flex flex-col justify-between relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D32F2F]/5 rounded-full blur-2xl" />
              
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-[#D32F2F]" />
                  <span className="font-sans font-black text-xs uppercase tracking-widest text-[#D32F2F]">FAT RECON PROFILE</span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-sans font-black text-black uppercase leading-snug">
                    UNDERSTANDING VISCERAL ADIPOSE TISSUE
                  </h4>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans font-normal">
                    Visceral belly fat wraps around your inner organs. It is highly active metabolically but can be systematically metabolized by following a sustained deficit coupled with incline compound cardio. 
                  </p>
                </div>

                {/* Bio indicators */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-150 space-y-3">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-500 font-sans font-normal">Cardio Incline Target:</span>
                    <span className="font-mono text-[#D32F2F] font-black">12% Gradient</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] border-t border-gray-250 pt-2">
                    <span className="text-gray-500 font-sans font-normal">Protein Intake Minimum:</span>
                    <span className="font-mono text-[#2E7D32] font-bold">2.0g per kg BW</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] border-t border-gray-250 pt-2">
                    <span className="text-gray-500 font-sans font-normal">Lifting Session Goal:</span>
                    <span className="font-mono text-black font-bold">3s Eccentric Sets</span>
                  </div>
                </div>
              </div>



            </div>

          </div>
        </motion.div>
      </section>

      {/* 4.5 SOCIAL PROOF TESTIMONIALS */}
      <section id="social-proof" className="py-24 bg-background border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] font-sans font-black tracking-[0.2em] text-[#6B6B6B] uppercase block">
              SOCIAL PROOF • ATHLETE VERIFICATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 uppercase tracking-tight">
              Real Results From <span className="text-[#D32F2F]">Dedicated Athletes</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-sans max-w-lg mx-auto font-semibold">
              Join 3,400+ members who have successfully re-engineered their body weight, athletic stamina, and muscle definition.
            </p>
          </div>

          {/* Testimonial Filter Category Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-2.5 mb-10">
            {["All", "Weight Loss", "Muscle Building", "General Journey"].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setReviewFilter(filter);
                  setShowAllReviews(false);
                }}
                className={`px-4 py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition cursor-pointer ${
                  reviewFilter === filter
                    ? "bg-[#D32F2F] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedVerifiedReviews
              .filter(r => reviewFilter === "All" || r.goal === reviewFilter)
              .slice(0, showAllReviews ? undefined : 6)
              .map((review, idx) => (
                <div
                  key={idx}
                  className="bg-[#F7F7F7] border border-gray-200 p-6 rounded-2xl flex flex-col justify-between space-y-6 hover:border-gray-300 transition duration-150"
                >
                  <div className="space-y-4">
                    {/* Stars & Location Banner */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5 text-amber-500">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[9px] font-mono font-bold text-[#2E7D32] bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                        {review.goal}
                      </span>
                    </div>

                    {/* Review text */}
                    <p className="text-xs text-gray-600 font-sans leading-relaxed italic font-semibold">
                      "{review.content}"
                    </p>
                  </div>

                  {/* Profile Details footer */}
                  <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between">
                    <div>
                      <h4 className="font-sans font-bold text-xs text-black leading-tight">
                        {review.name}
                      </h4>
                      <p className="text-[9px] text-gray-400 font-mono">
                        {review.location} • {review.period}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-black text-[#D32F2F] uppercase block">
                        RESULT
                      </span>
                      <span className="text-[9px] font-sans font-bold text-gray-600 max-w-[150px] inline-block">
                        {review.achievement}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Load More Button */}
          {sortedVerifiedReviews.filter(r => reviewFilter === "All" || r.goal === reviewFilter).length > 6 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="px-6 py-3 bg-black hover:bg-gray-900 text-white font-mono text-[10px] font-black uppercase tracking-widest rounded-xl transition cursor-pointer"
              >
                {showAllReviews ? "SHOW FEWER STORIES" : "EXPLORE ALL VERIFIED STORIES"}
              </button>
            </div>
          )}

        </motion.div>
      </section>

      {/* 4.5 PREMIUM TRANSLATION SHOWCASE: 5-MONTH BELLY FAT SHRED PROGRAM */}
      <section className="py-24 bg-background border-b border-border overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full bg-[#D32F2F] filter blur-[150px]" />
          <div className="absolute bottom-1/4 left-10 w-96 h-96 rounded-full bg-amber-500 filter blur-[150px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-mono font-black tracking-[0.25em] text-[#D32F2F] uppercase bg-[#D32F2F]/10 border border-[#D32F2F]/20 px-4 py-1.5 rounded-full inline-block">
              👑 ELITE CORE TRANSFORMATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-slate-900 uppercase leading-none">
              5 Month <span className="text-[#D32F2F]">Belly Fat Shred</span> Program
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed font-sans font-semibold">
              Deploy our masterfully sequenced, science-first transformation suite. 
              Accelerate metabolic conditioning and target sustainable deep visceral fat loss.
            </p>
            <div className="h-1 w-20 bg-[#D32F2F] mx-auto mt-4" />
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Scientific Integrity Panel */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-8 rounded-3xl space-y-6 text-left shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#D32F2F]/10 border border-[#D32F2F]/20 rounded-2xl flex items-center justify-center text-[#D32F2F] shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase text-slate-900 font-display">Biomechanical Fact Check</h3>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed font-semibold">
                    Spot reduction is a biological myth. Adipose tissue breakdown is systemic. 
                    Our program centers on maximizing full-body metabolic output, compound mechanical tension, and calorie-deficit preservation. 
                    As total body fat decreases, your midsection defines itself permanently.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Flame className="w-4 h-4 text-[#D32F2F]" />
                    <h4 className="text-xs font-black uppercase text-[#D32F2F]">Metabolic Conditioning</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                    Progressive core isolation mixed with compound calorie crushers (Day 1, 3, 5, 7).
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Zap className="w-4 h-4 text-[#D32F2F]" />
                    <h4 className="text-xs font-black uppercase text-[#D32F2F]">Aerobic Runs (2-3x/Wk)</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                    Sequenced 3-5 KM steady-state cardio to maximize lipid transport and oxidation.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs font-black uppercase text-emerald-600">Thermal Post-Meal Walks</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                    Activating 10-20 minute walks after major meals to elevate immediate caloric dispersion.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-900">
                    <CheckCircle className="w-4 h-4 text-[#D32F2F]" />
                    <h4 className="text-xs font-black uppercase text-[#D32F2F]">Fluid Balance Ring</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                    Hourly calculated hydration targets combined with 3x weekly Lemon-Cucumber water infusions.
                  </p>
                </div>

              </div>
            </div>

            {/* Right: Immersive Product Preview and CTA Callout */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 p-8 rounded-3xl text-center flex flex-col justify-between h-full min-h-[380px] relative overflow-hidden group shadow-sm">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#D32F2F]/5 group-hover:bg-[#D32F2F]/10 transition-colors duration-500" />
              
              <div className="space-y-4 relative z-10 text-left">
                <span className="text-[8px] font-mono font-black text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded uppercase border border-amber-200">
                  👑 PREMIUM GOLD LABEL
                </span>
                <h3 className="text-lg font-black uppercase text-slate-950 font-display">
                  Interactive Dashboard Included
                </h3>
                
                <p className="text-xs text-slate-700 leading-relaxed font-sans font-semibold">
                  Gain a persistent, premium dashboard to track your 20-week milestones, log weight/waist metrics, 
                  upload progress diaries, calculate daily scores, and configure alert schedules.
                </p>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold uppercase">
                    <span>Program Duration</span>
                    <span className="text-slate-900 font-black">5 Months (20 Weeks)</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold uppercase">
                    <span>Target Frequency</span>
                    <span className="text-slate-900 font-black">3-4 Workouts / Week</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold uppercase">
                    <span>Nutrition Framework</span>
                    <span className="text-emerald-700 font-black">Caloric Deficit Matrix</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 relative z-10">
                {user && (user.subscriptionStatus === "premium" || user.role === "admin") ? (
                  <button
                    onClick={() => setView("belly-fat-shred")}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-black text-xs uppercase tracking-widest rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer border-0"
                  >
                    <span>LAUNCH MY TRANSFORMATION DASHBOARD</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                ) : (
                  <button
                    onClick={() => setView("pricing")}
                    className="w-full py-4 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-sans font-black text-xs uppercase tracking-widest rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer border-0"
                  >
                    <Lock className="w-4 h-4 text-white" />
                    <span>UNLOCK WITH PREMIUM ACTIVE</span>
                  </button>
                )}
                <p className="text-[8px] text-slate-500 font-mono mt-3 uppercase font-semibold">
                  Zero additional cost for Premium Subscriptions.
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* PUBLIC INTERACTIVE PREVIEW HUB: DYNAMIC ATHLETE DESK */}
      <section id="public-live-desk" className="py-24 bg-background border-b border-border relative overflow-hidden">
        {/* Ambient background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D32F2F]/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-sans font-black tracking-[0.2em] text-[#D32F2F] uppercase block">
              LIVE PREVIEW PLAYGROUND
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-slate-900 uppercase">
              INTERACTIVE <span className="text-[#D32F2F]">ATHLETE WORKSPACE</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed font-sans font-medium">
              Test drive the core features of the premium AlexFitnessHub platform. Monitor kinesiologist weight charts, explore community boards, check calibrations, and log habits.
            </p>
            <div className="h-1 w-16 bg-[#D32F2F] mx-auto mt-3" />
          </div>

          {/* Tab Selection Row */}
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto mb-12 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/60 shadow-inner">
            {[
              { id: "trajectory", label: "Weight Trajectory", icon: Scale, desc: "Biometric slopes" },
              { id: "community", label: "Community Feed", icon: Users, desc: "Live social board" },
              { id: "calibration", label: "Calibration Desk", icon: Clock, desc: "Physiological vitals" },
              { id: "habits", label: "Habit Tracker", icon: CheckCircle, desc: "Routine compliance" }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeDemoTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDemoTab(tab.id as any)}
                  className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-sans font-black text-[10px] uppercase tracking-wider transition-all duration-250 cursor-pointer border-0 ${
                    isActive 
                      ? "bg-white text-[#D32F2F] shadow-md" 
                      : "text-slate-600 hover:text-slate-800:text-slate-200 bg-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE TAB CONTENT BOX */}
          <div className="bg-card rounded-[2.5rem] border border-border p-6 sm:p-10 lg:p-12 shadow-xl relative max-w-5xl mx-auto">
            {activeDemoTab === "trajectory" && (
              <div className="space-y-8 animate-fade-in" id="public-weight-trajectory">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-sans font-black uppercase text-slate-900">
                      Weight Recomposition <span className="text-[#D32F2F]">Trajectory Index</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Plot your absolute biometric checkpoints, monitor recomposition slopes, and map target weights dynamically.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    LIVE PLOT MODEL ACTIVE
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Visual SVG Trajectory Trend (Last 6 Checkpoints) */}
                  <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-50 border border-slate-150 shadow-inner space-y-4">
                    <h4 className="text-xs font-sans font-black text-slate-400 uppercase tracking-wider">Weight Slope Calibration Chart</h4>
                    
                    {localWeightLogs.length > 1 ? (
                      <div className="relative w-full overflow-hidden">
                        {/* SVG Custom Line Graph */}
                        {(() => {
                          const displayLogs = localWeightLogs.slice(-6);
                          const minW = Math.min(...displayLogs.map(l => l.weight)) - 1;
                          const maxW = Math.max(...displayLogs.map(l => l.weight)) + 1;
                          const diffW = maxW - minW || 1;
                          const width = 480;
                          const height = 180;
                          const padding = 25;

                          const points = displayLogs.map((l, i) => {
                            const x = padding + (i / (displayLogs.length - 1 || 1)) * (width - 2 * padding);
                            const y = height - padding - ((l.weight - minW) / diffW) * (height - 2 * padding);
                            return { x, y, weight: l.weight, date: l.date };
                          });

                          const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(" ");
                          const areaPath = points.length > 0 
                            ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z` 
                            : "";

                          return (
                            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto text-slate-350 overflow-visible">
                              {[0, 0.25, 0.5, 0.75, 1].map((val, idx) => {
                                const y = padding + val * (height - 2 * padding);
                                const wVal = (maxW - val * diffW).toFixed(1);
                                return (
                                  <g key={idx}>
                                    <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="text-slate-200" />
                                    <text x={padding - 5} y={y + 3} textAnchor="end" className="text-[8px] font-mono font-bold fill-slate-400">{wVal}</text>
                                  </g>
                                );
                              })}

                              <path d={areaPath} fill="url(#gradAreaPublic)" />
                              <path d={linePath} fill="none" stroke="#D32F2F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                              {points.map((p, idx) => (
                                <g key={idx} className="group cursor-pointer">
                                  <circle cx={p.x} cy={p.y} r="4.5" fill="#D32F2F" stroke="white" strokeWidth="2" />
                                  <text x={p.x} y={p.y - 8} textAnchor="middle" className="text-[8px] font-mono font-black fill-slate-800">{p.weight}kg</text>
                                  <text x={p.x} y={height - 8} textAnchor="middle" className="text-[7px] font-mono font-bold fill-slate-400">{p.date}</text>
                                </g>
                              ))}

                              <defs>
                                <linearGradient id="gradAreaPublic" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#D32F2F" stopOpacity="0.18" />
                                  <stop offset="100%" stopColor="#D32F2F" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>
                            </svg>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-slate-450">
                        <Scale className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-bounce" />
                        <p className="text-[10px] font-sans font-bold uppercase tracking-wider">Awaiting weight logs</p>
                      </div>
                    )}
                  </div>

                  {/* Weight checkpoint Submission Panel */}
                  <div className="flex flex-col justify-between p-6 rounded-2xl bg-slate-50 border border-slate-150 shadow-inner">
                    <div className="space-y-4">
                      <h4 className="text-xs font-sans font-black text-slate-400 uppercase tracking-wider">Biometric Checkpoint</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        Input your current body weight to calibrate the trajectory graph. Changes are modeled immediately on the preview chart.
                      </p>
                      <form onSubmit={handlePublicWeightSubmit} className="space-y-3">
                        <div className="relative">
                          <input 
                            type="number" 
                            step="0.1"
                            value={publicNewWeight}
                            onChange={(e) => setPublicNewWeight(e.target.value)}
                            placeholder="e.g. 82.5" 
                            className="w-full pl-4 pr-12 py-3 bg-white rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:border-[#D32F2F]"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400 uppercase">KG</span>
                        </div>
                        <button
                          type="submit"
                          disabled={submittingPublicWeight}
                          className="w-full py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-sans font-black text-[10px] uppercase tracking-wider rounded-xl transition shadow-md cursor-pointer border-0"
                        >
                          {submittingPublicWeight ? "Logging Metric..." : "Log Weight Checkpoint"}
                        </button>
                      </form>
                    </div>

                    {weightToast && (
                      <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/15 text-[10px] text-emerald-600 font-bold leading-normal text-center animate-fade-in">
                        {weightToast}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeDemoTab === "community" && (
              <div className="space-y-8 animate-fade-in" id="public-community">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-sans font-black uppercase text-slate-900">
                      AlexFitnessHub Live <span className="text-[#D32F2F]">Community Feed</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Read dynamic transformation logs, share lifting results, and check active discussions with fellow athletes.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D32F2F]/10 border border-[#D32F2F]/20 rounded-full text-[10px] font-mono font-bold text-[#D32F2F] uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-[#D32F2F] animate-ping" />
                    LIVE SOCIAL BRIDGE ENGAGED
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Create New Post Form */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-150 shadow-inner flex flex-col justify-between h-fit">
                    <div className="space-y-4">
                      <h4 className="text-xs font-sans font-black text-slate-400 uppercase tracking-wider">Share an Achievement</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        What did you train today? Share a lifting achievement or ask the community a physiological question.
                      </p>
                      <form onSubmit={handlePublicPostSubmit} className="space-y-3">
                        <textarea 
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          placeholder="My Bench Press is up 5kg today! Thanks to the 12-30-3 protocol..." 
                          rows={3}
                          className="w-full p-4 bg-white rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#D32F2F] resize-none"
                        />
                        <button
                          type="submit"
                          disabled={isSubmittingNewPost}
                          className="w-full py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-sans font-black text-[10px] uppercase tracking-wider rounded-xl transition shadow-md cursor-pointer border-0"
                        >
                          {isSubmittingNewPost ? "Publishing..." : "Publish Post"}
                        </button>
                      </form>
                    </div>

                    {postToast && (
                      <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/15 text-[10px] text-emerald-600 font-bold leading-normal text-center animate-fade-in">
                        {postToast}
                      </div>
                    )}
                  </div>

                  {/* Active Posts Feed */}
                  <div className="lg:col-span-2 space-y-4 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin">
                    {localPosts.length > 0 ? (
                      localPosts.map((post) => {
                        const hasLiked = post.likes?.includes("visitor_temp_uid") || (user && post.likes?.includes(user.uid));
                        return (
                          <div 
                            key={post.id} 
                            className="p-5 bg-slate-50 border border-slate-150 rounded-2xl shadow-sm space-y-3 animate-fade-in"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white font-sans font-black text-[10px] uppercase flex items-center justify-center shadow-inner">
                                  {post.userDisplayName ? post.userDisplayName.substring(0, 2).toUpperCase() : "VP"}
                                </div>
                                <div>
                                  <div className="text-xs font-black uppercase text-slate-900 leading-none">
                                    {post.userDisplayName}
                                  </div>
                                  <span className="text-[8px] font-mono text-slate-400">
                                    {new Date(post.createdAt).toLocaleDateString(undefined, { hour: "2-digit", minute:"2-digit" })}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[8px] font-mono font-black uppercase px-2 py-0.5 bg-slate-100 rounded text-slate-500 border border-slate-200/50">
                                {post.category || "General"}
                              </span>
                            </div>

                            <p className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-wrap break-words">
                              {post.content}
                            </p>

                            {post.imageUrl ? (
                              <div className="w-full max-h-48 rounded-xl overflow-hidden border border-slate-150 shadow-sm">
                                <img src={post.imageUrl} alt="Uploaded progress" className="w-full h-full object-cover" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
                              </div>
                            ) : null}

                            {/* Likes and comments display */}
                            <div className="flex items-center gap-4 pt-2 border-t border-slate-200/50 text-[10px] font-mono">
                              <button 
                                onClick={() => handlePublicLike(post.id)}
                                className={`flex items-center gap-1 cursor-pointer transition bg-transparent border-0 ${hasLiked ? 'text-red-500 font-bold' : 'text-slate-400 hover:text-red-500'}`}
                              >
                                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                                <span>{post.likes?.length || 0} Likes</span>
                              </button>
                              <span className="text-slate-400">{post.comments?.length || 0} Comments</span>
                            </div>

                            {/* Comment thread list */}
                            {post.comments && post.comments.length > 0 && (
                              <div className="space-y-2 mt-2 bg-slate-100 p-3 rounded-xl border border-slate-200/40">
                                {post.comments.slice(0, 3).map((comm: any, idx: number) => (
                                  <div key={idx} className="text-[10px] leading-relaxed">
                                    <strong className="text-slate-850 uppercase font-black mr-1">{comm.userDisplayName}</strong>
                                    <span className="text-slate-600 font-sans break-words">{comm.content}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add comment inline */}
                            <form onSubmit={(e) => handlePublicComment(post.id, e)} className="flex gap-2 pt-1">
                              <input 
                                type="text"
                                placeholder="Type a response..."
                                value={commentInputs[post.id] || ""}
                                onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#D32F2F]"
                              />
                              <button 
                                type="submit"
                                className="px-3 bg-slate-800 hover:bg-slate-900 text-white font-sans font-black text-[9px] uppercase tracking-wider rounded-xl cursor-pointer transition border-0"
                              >
                                Send
                              </button>
                            </form>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-12 text-center text-slate-450 border border-dashed border-slate-150 rounded-2xl">
                        <MessageCircle className="w-8 h-8 text-slate-350 mx-auto mb-2 animate-pulse" />
                        <p className="text-[10px] font-sans font-bold uppercase tracking-wider">Feed is loading...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeDemoTab === "calibration" && (
              <div className="space-y-8 animate-fade-in" id="public-calibration">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-sans font-black uppercase text-slate-900">
                      Physiological <span className="text-[#D32F2F]">Calibration Desk</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Fine-tune metabolic multipliers, balance cellular hydration, and schedule active workout alerts.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    METRICS CALIBRATED
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Hydration Tracker Card */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-150 shadow-inner space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-sans font-black text-slate-400 uppercase tracking-wider">Hydration Protocol</h4>
                      <Droplet className="w-5 h-5 text-blue-500 fill-blue-500/20" />
                    </div>
                    <div className="space-y-3 text-center">
                      <div className="text-3xl font-sans font-black text-slate-850 font-mono">
                        {publicGlasses} <span className="text-xs text-slate-400">/ 10 glasses</span>
                      </div>
                      
                      {/* Water Meter Progress bar */}
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full transition-all duration-300" 
                          style={{ width: `${Math.min(100, (publicGlasses / 10) * 100)}%` }} 
                        />
                      </div>

                      <p className="text-[9px] text-slate-500 leading-relaxed font-medium">
                        Includes lemon infusion & cucumber mineral rounds to secure optimum glycogen re-synthesis.
                      </p>

                      <div className="flex gap-2 justify-center pt-2">
                        <button 
                          onClick={() => handlePublicGlassChange(-1)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white hover:bg-slate-100 transition cursor-pointer"
                        >
                          -1 Glass
                        </button>
                        <button 
                          onClick={() => handlePublicGlassChange(1)}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition cursor-pointer shadow-sm border-0"
                        >
                          +1 Glass
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Deficit Calorie Calibration Slider */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-150 shadow-inner space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-sans font-black text-slate-400 uppercase tracking-wider">Calorie Deficit Slider</h4>
                      <Flame className="w-5 h-5 text-orange-500 fill-orange-500/20" />
                    </div>
                    <div className="space-y-4 font-sans text-xs">
                      {/* Intake Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between font-bold">
                          <span className="text-slate-500">Intake Calibration:</span>
                          <span className="font-mono text-slate-800">{publicCaloriesIn} kcal</span>
                        </div>
                        <input 
                          type="range" 
                          min="1200" 
                          max="3500" 
                          step="50"
                          value={publicCaloriesIn}
                          onChange={(e) => setPublicCaloriesIn(parseInt(e.target.value))}
                          className="w-full accent-orange-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                        />
                      </div>

                      {/* Burn Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between font-bold">
                          <span className="text-slate-500">Active Metabolic Rate:</span>
                          <span className="font-mono text-emerald-500">{publicCaloriesOut} kcal</span>
                        </div>
                        <input 
                          type="range" 
                          min="1500" 
                          max="4000" 
                          step="50"
                          value={publicCaloriesOut}
                          onChange={(e) => setPublicCaloriesOut(parseInt(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                        />
                      </div>

                      {/* Calorie Balance net result */}
                      {(() => {
                        const balance = publicCaloriesOut - publicCaloriesIn;
                        return (
                          <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                            <span className="text-[10px] font-sans font-black text-slate-400 uppercase tracking-wider">NET DEFICIT BALANCE</span>
                            <span className={`text-sm font-mono font-black ${balance >= 400 ? 'text-emerald-500' : 'text-orange-500'}`}>
                              {balance} kcal
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Reminder Alarm Clock */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-150 shadow-inner space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-sans font-black text-slate-400 uppercase tracking-wider">Compliance Alarm</h4>
                      <Clock className="w-5 h-5 text-[#D32F2F]" />
                    </div>
                    <div className="space-y-4 text-center">
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        Configure kinesiologist check-in times. Active alerts prompt you with direct structural notifications.
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <input 
                          type="time" 
                          value={publicRemTime}
                          onChange={(e) => savePublicReminder(e.target.value)}
                          className="p-2 border border-slate-200 bg-white rounded-xl text-sm font-mono font-bold focus:outline-none focus:border-[#D32F2F] text-center"
                        />
                        <span className="text-xs text-slate-450 uppercase font-black">Daily Clock</span>
                      </div>
                      <div className="text-[9px] text-emerald-500 font-black tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/15 py-1.5 rounded-lg">
                        ALERT CONTROLLER ACTIVE
                      </div>
                    </div>
                  </div>
                </div>

                {calibrationToast && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/15 text-[10px] text-emerald-600 font-bold text-center animate-fade-in">
                    {calibrationToast}
                  </div>
                )}
              </div>
            )}

            {activeDemoTab === "habits" && (
              <div className="space-y-8 animate-fade-in" id="public-habit-tracker">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-sans font-black uppercase text-slate-900">
                      AlexFitnessHub Daily <span className="text-[#D32F2F]">Habit Tracker</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Check off essential biometric habits daily. Securing compliance increments your streak and locks in muscle recovery.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#D32F2F]/10 rounded-full text-xs font-black text-[#D32F2F] uppercase tracking-wider">
                    <Activity className="w-4 h-4 text-[#D32F2F] shrink-0" />
                    <span>Active Streak: {streakCount} Days</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Habits Checklist */}
                  <div className="lg:col-span-8 space-y-3">
                    {publicHabits.map((habit) => (
                      <div 
                        key={habit.id}
                        onClick={() => togglePublicHabit(habit.id)}
                        className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                          habit.done 
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-800' 
                            : 'bg-slate-50 border-slate-150 text-slate-700 hover:bg-slate-100/50:bg-slate-900/50'
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-black uppercase tracking-tight leading-none">{habit.name}</p>
                          <p className="text-[10px] text-slate-450 leading-relaxed font-medium">{habit.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          habit.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {habit.done && <CheckCircle className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Habit Metrics Stats Panel */}
                  <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-50 border border-slate-150 shadow-inner space-y-4 text-center">
                    <h4 className="text-xs font-sans font-black text-slate-400 uppercase tracking-wider">Streak Level Metric</h4>
                    
                    {/* Ring Radial progress circle */}
                    {(() => {
                      const completedCount = publicHabits.filter(h => h.done).length;
                      const percent = Math.round((completedCount / publicHabits.length) * 100);
                      return (
                        <div className="space-y-4">
                          <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-slate-200"
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="text-emerald-500 transition-all duration-500"
                                strokeWidth="3"
                                strokeDasharray={`${percent}, 100`}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                              <span className="text-2xl font-sans font-black text-slate-800 font-mono">{percent}%</span>
                              <span className="text-[8px] font-sans font-black text-slate-400 uppercase tracking-widest">Compliance</span>
                            </div>
                          </div>

                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                            {completedCount === publicHabits.length 
                              ? "Excellent! Perfect compliance locks in 24h anabolic recovery." 
                              : `Completed ${completedCount} out of ${publicHabits.length} daily habits. Securing the remaining habits locks in streak protection.`
                            }
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {habitToast && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/15 text-xs text-emerald-600 font-bold text-center animate-fade-in">
                    {habitToast}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. DYNAMIC ACCORDION FAQS SYSTEM */}
      <section id="faqs-segment" className="py-24 bg-background border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] font-sans font-black tracking-[0.2em] text-[#6B6B6B] uppercase block">
              GET RESPONSES
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#1C1C1C] uppercase">
              FREQUENTLY ASKED <span className="text-[#C0392B]">QUESTIONS</span>
            </h2>
            <div className="h-1 w-16 bg-[#C0392B] mx-auto mt-3" />
          </div>

          <div className="space-y-4">
            {faqsList.map((item, idx) => (
              <div 
                key={idx} 
                className="overflow-hidden rounded-xl border border-gray-200 bg-[#F7F7F7]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-sans font-extrabold text-[#1C1C1C] text-xs uppercase cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4.5 h-4.5 text-[#C0392B] shrink-0" />
                    {item.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-300 ${openFAQ === idx ? "rotate-180" : ""}`} />
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openFAQ === idx ? "max-h-[300px] border-t border-gray-200 p-5 bg-white" : "max-h-0"
                  }`}
                >
                  <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </motion.div>
      </section>

      {/* 7. CONTACT / PREMIUM CONSULTATION FORM */}
      <section id="contact" className="py-24 bg-secondary border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] font-sans font-black tracking-[0.2em] text-[#6B6B6B] uppercase block">
              SUPPORT CHANNELS
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#1C1C1C] uppercase">
              CONNECT WITH <span className="text-[#C0392B]">COACHES</span>
            </h2>
            <div className="h-1 w-16 bg-[#C0392B] mx-auto mt-3" />
          </div>

          <div className="max-w-2xl mx-auto bg-white border border-gray-200 p-8 sm:p-10 rounded-2xl shadow-sm relative overflow-hidden">
            {contactSubmitted ? (
              <div className="text-center py-8 space-y-4 text-left">
                <div className="mx-auto w-12 h-12 bg-[#C0392B]/10 text-[#C0392B] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-display font-black text-[#1C1C1C] uppercase text-center">Inquiry Received</h4>
                <p className="text-xs text-[#6B6B6B] max-w-md mx-auto leading-relaxed text-center">
                  Thank you, <strong className="text-[#1C1C1C]">{contactName}</strong>! Your inquiry regarding <strong className="text-[#1C1C1C]">{contactGoal.toUpperCase()}</strong> has been captured. The coaching desk will evaluate your requirements and follow up via <span className="underline">{contactEmail}</span> within 24 working hours.
                </p>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setContactSubmitted(false)}
                    className="mt-4 px-5 py-2.5 bg-[#1C1C1C] hover:bg-black text-white rounded-full text-[10px] font-sans font-black uppercase tracking-wider transition inline-block mx-auto text-center"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6 text-left">
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-sans font-black text-[#6B6B6B] uppercase tracking-widest">YOUR FULL NAME</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F7F7F7] text-[#1C1C1C] focus:ring-2 focus:ring-[#C0392B]/20 focus:outline-none transition text-xs font-sans"
                      placeholder="e.g. Alex Johnson"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-sans font-black text-[#6B6B6B] uppercase tracking-widest">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F7F7F7] text-[#1C1C1C] focus:ring-2 focus:ring-[#C0392B]/20 focus:outline-none transition text-xs font-sans"
                      placeholder="e.g. alex@domain.com"
                    />
                  </div>
                </div>

                {/* Goal category field */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-sans font-black text-[#6B6B6B] uppercase tracking-widest">PRIMARY PHYSICAL GOAL</label>
                  <select
                    value={contactGoal}
                    onChange={(e) => setContactGoal(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F7F7F7] text-[#1C1C1C] focus:ring-2 focus:ring-[#C0392B]/20 focus:outline-none transition text-xs font-sans uppercase font-bold"
                  >
                    <option value="hypertrophy">Hypertrophy (Anabolic Muscle Gain)</option>
                    <option value="fat_loss">Fat Shred Cycles (Metabolic Burn)</option>
                    <option value="calisthenics">Bodyweight Leverage stability</option>
                    <option value="rehabilitation">Joint Posture Rehabilitation</option>
                    <option value="nutrition">Custom Macronutrient profiling</option>
                  </select>
                </div>

                {/* Message details field */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-sans font-black text-[#6B6B6B] uppercase tracking-widest">SPECIFIC ATHLETIC ENQUIRY</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F7F7F7] text-[#1C1C1C] focus:ring-2 focus:ring-[#C0392B]/20 focus:outline-none transition text-xs leading-relaxed"
                    placeholder="Describe your current lifting stats, weekly training splits, and any dietary requirements..."
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmittingContact}
                  className="w-full py-4 bg-[#C0392B] hover:bg-[#A82E22] text-white font-sans font-black text-xs uppercase cursor-pointer rounded-xl transition duration-200 flex items-center justify-center gap-2 tracking-widest shadow-md active:scale-98"
                >
                  {isSubmittingContact ? "TRANSMITTING INQUIRY..." : "SEND SIGNAL MESSAGE"}
                </button>
              </form>
            )}
          </div>

        </motion.div>
      </section>



      {/* 10. SYSTEM FOOTER */}
      <footer className="bg-white text-slate-800 border-t border-slate-200 py-16 font-sans text-left transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          <div className="space-y-4 col-span-1 sm:col-span-2 lg:col-span-1">
            <Logo size="sm" showSubtext={true} />
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Deploying elite exercise kinesis benchmarks, absolute macronutrient nutrition tracking, and unified AI-powered consultation.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-sans font-black uppercase tracking-widest text-[#C0392B] mb-3">Training Solutions</h4>
            <ul className="space-y-1.5 text-xs text-slate-600 font-sans">
              <li><button onClick={() => setView("library")} className="hover:text-[#C0392B]:text-[#C0392B] transition-colors cursor-pointer text-left">Treadmill Walk 12-30-3</button></li>
              <li><button onClick={() => setView("library")} className="hover:text-[#C0392B]:text-[#C0392B] transition-colors cursor-pointer text-left">Chest Isolation Press</button></li>
              <li><button onClick={() => setView("library")} className="hover:text-[#C0392B]:text-[#C0392B] transition-colors cursor-pointer text-left">Home Shred Workouts</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-sans font-black uppercase tracking-widest text-[#C0392B] mb-3">Premium Features</h4>
            <ul className="space-y-1.5 text-xs text-slate-600 font-sans">
              <li><button onClick={() => setView("home")} className="hover:text-[#C0392B]:text-[#C0392B] transition-colors cursor-pointer text-left">Flexible Selectors</button></li>
              <li><button onClick={() => setView("daily-plan")} className="hover:text-[#C0392B]:text-[#C0392B] transition-colors cursor-pointer text-left">Daily Training Schedule</button></li>
              <li><button onClick={() => setView("coach")} className="hover:text-[#C0392B]:text-[#C0392B] transition-colors cursor-pointer text-left">Gemini AI Assistant</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-sans font-black uppercase tracking-widest text-[#C0392B] mb-3">Customer Support</h4>
            <div className="text-xs text-slate-600 leading-relaxed font-sans space-y-2">
              <p>Have questions or transaction inquiries? Contact Coach Alex:</p>
              <div>
                <span className="font-bold text-[#C0392B] uppercase text-[9px] block">Email Address</span>
                <a href="mailto:alexfitnesshub@gmail.com" className="text-[10px] text-white bg-[#C0392B] px-2.5 py-1 rounded inline-block font-mono hover:bg-[#A82E22] transition-colors mt-0.5">alexfitnesshub@gmail.com</a>
              </div>
              <div className="pt-1">
                <span className="font-bold text-[#C0392B] uppercase text-[9px] block">WhatsApp / Phone</span>
                <a href="https://wa.me/2347073307875" target="_blank" rel="noopener noreferrer" className="text-[10px] text-white bg-[#C0392B] px-2.5 py-1 rounded inline-block font-mono hover:bg-[#A82E22] transition-colors mt-0.5">+2347073307875</a>
              </div>

            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <NewsletterSubscription />
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-200 text-left text-xs text-slate-500">
          <p>© 2026 Alex Fitness Inc. All rights reserved.</p>
        </div>

      </footer>
    </div>
  );
}
