import React, { useState } from "react";
import { MAIN_PROGRAM_CATEGORIES, ProgramMainCategory } from "../../data/programsSystem";
import Immortal90DayView from "./Immortal90DayView";
import WomenWorkoutView from "./WomenWorkoutView";
import HomeWorkoutView from "./HomeWorkoutView";
import GymWorkoutView from "./GymWorkoutView";
import GoalBasedWorkoutsView from "./GoalBasedWorkoutsView";
import { 
  Trophy, 
  Dumbbell, 
  Heart, 
  Home, 
  Target, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Flame,
  Layers
} from "lucide-react";

interface ProgramHubViewProps {
  initialCategory?: string;
  onOpenWorkoutLibrary?: () => void;
  onNavigateToView?: (view: string) => void;
}

export default function ProgramHubView({ 
  initialCategory, 
  onOpenWorkoutLibrary,
  onNavigateToView 
}: ProgramHubViewProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory || null);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "90-days-immortal": return <Trophy className="w-6 h-6 text-amber-400" />;
      case "gym-programs": return <Dumbbell className="w-6 h-6 text-red-400" />;
      case "women-programs": return <Heart className="w-6 h-6 text-pink-400" />;
      case "home-programs": return <Home className="w-6 h-6 text-emerald-400" />;
      case "goal-based-programs": return <Target className="w-6 h-6 text-cyan-400" />;
      case "workout-library": return <BookOpen className="w-6 h-6 text-purple-400" />;
      default: return <Layers className="w-6 h-6 text-amber-400" />;
    }
  };

  // If a subcategory view is active, render its dedicated interface
  if (activeCategory === "90-days-immortal") {
    return (
      <div>
        <CategorySubNav 
          activeId="90-days-immortal" 
          onSelectCategory={(id) => {
            if (id === "workout-library") onOpenWorkoutLibrary?.();
            else setActiveCategory(id);
          }} 
          onBack={() => setActiveCategory(null)}
        />
        <Immortal90DayView 
          onBackToPrograms={() => setActiveCategory(null)} 
          onNavigateToCategory={(catId) => setActiveCategory(catId)}
        />
      </div>
    );
  }

  if (activeCategory === "women-programs") {
    return (
      <div>
        <CategorySubNav 
          activeId="women-programs" 
          onSelectCategory={(id) => {
            if (id === "workout-library") onOpenWorkoutLibrary?.();
            else setActiveCategory(id);
          }} 
          onBack={() => setActiveCategory(null)}
        />
        <WomenWorkoutView 
          onBackToPrograms={() => setActiveCategory(null)}
          onOpenExerciseLibrary={onOpenWorkoutLibrary}
        />
      </div>
    );
  }

  if (activeCategory === "home-programs") {
    return (
      <div>
        <CategorySubNav 
          activeId="home-programs" 
          onSelectCategory={(id) => {
            if (id === "workout-library") onOpenWorkoutLibrary?.();
            else setActiveCategory(id);
          }} 
          onBack={() => setActiveCategory(null)}
        />
        <HomeWorkoutView 
          onBackToPrograms={() => setActiveCategory(null)}
          onOpenExerciseLibrary={onOpenWorkoutLibrary}
        />
      </div>
    );
  }

  if (activeCategory === "gym-programs") {
    return (
      <div>
        <CategorySubNav 
          activeId="gym-programs" 
          onSelectCategory={(id) => {
            if (id === "workout-library") onOpenWorkoutLibrary?.();
            else setActiveCategory(id);
          }} 
          onBack={() => setActiveCategory(null)}
        />
        <GymWorkoutView 
          onBackToPrograms={() => setActiveCategory(null)}
          onOpenExerciseLibrary={onOpenWorkoutLibrary}
        />
      </div>
    );
  }

  if (activeCategory === "goal-based-programs") {
    return (
      <div>
        <CategorySubNav 
          activeId="goal-based-programs" 
          onSelectCategory={(id) => {
            if (id === "workout-library") onOpenWorkoutLibrary?.();
            else setActiveCategory(id);
          }} 
          onBack={() => setActiveCategory(null)}
        />
        <GoalBasedWorkoutsView 
          onBackToPrograms={() => setActiveCategory(null)}
          onOpenExerciseLibrary={onOpenWorkoutLibrary}
          onSelectProgramCategory={(catId) => setActiveCategory(catId)}
        />
      </div>
    );
  }

  // MASTER CATEGORY HUB (Default View)
  return (
    <div id="programs-hub-container" className="min-h-screen bg-neutral-950 text-white pb-24">
      {/* Hero Banner */}
      <div className="relative border-b border-neutral-800 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            AlexFitnessHub Intelligent Architecture
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Workout Program Categories
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Choose your training system. Every program is mathematically structured, biomechanically classified, and connects directly to our master Workout Library.
          </p>
        </div>
      </div>

      {/* 6 Core Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MAIN_PROGRAM_CATEGORIES.map((cat, index) => {
            return (
              <div
                key={cat.id}
                onClick={() => {
                  if (cat.id === "workout-library") {
                    if (onOpenWorkoutLibrary) onOpenWorkoutLibrary();
                    else onNavigateToView?.("library");
                  } else {
                    setActiveCategory(cat.id);
                  }
                }}
                className="group relative bg-neutral-900/90 border border-neutral-800 hover:border-neutral-600 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                {/* Background Image with Gradient Overlay */}
                <div className="relative h-48 w-full overflow-hidden bg-neutral-950">
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-80" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-neutral-950/80 backdrop-blur-md border border-neutral-700 text-white rounded-lg">
                      {cat.badge}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg">
                      {cat.totalWorkoutsOrDays}
                    </span>
                  </div>

                  {/* Icon floating */}
                  <div className="absolute bottom-3 left-4 p-3 bg-neutral-950/90 border border-neutral-800 rounded-xl shadow-lg">
                    {getCategoryIcon(cat.id)}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                      {cat.subtitle}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition">
                      {cat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-4 line-clamp-3">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-bold text-white group-hover:text-amber-400 transition">
                    <span>Explore Program</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Category Sub-Navigation Bar for seamless switching between the 6 categories
function CategorySubNav({ 
  activeId, 
  onSelectCategory, 
  onBack 
}: { 
  activeId: string; 
  onSelectCategory: (id: string) => void; 
  onBack: () => void;
}) {
  return (
    <div className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 px-4 py-2.5 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition flex items-center gap-1.5 flex-shrink-0"
        >
          &larr; Hub
        </button>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {MAIN_PROGRAM_CATEGORIES.map(cat => {
            const isCurrent = activeId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  isCurrent
                    ? "bg-amber-500 text-neutral-950 shadow"
                    : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                {cat.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
