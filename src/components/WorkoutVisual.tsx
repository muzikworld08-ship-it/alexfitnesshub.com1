import React from "react";
import { 
  Compass, 
  CheckCircle2, 
  AlertCircle, 
  Dumbbell, 
  Activity, 
  ListTodo, 
  Sparkles, 
  ShieldCheck 
} from "lucide-react";
import { useCentralizedExercises } from "../hooks/useCentralizedExercises";
import { findMatchingExercise } from "../utils/exerciseMatching";
import { resolveAdminMediaUrl } from "../lib/mediaStorage";
import { getExerciseGifUrl } from "../data/exercises";
import { getSupabaseCdnUrl } from "../utils/supabaseImage";
import { isImageCached, markImageCached } from "../utils/imageCache";

interface WorkoutVisualProps {
  exerciseId?: string;
  category?: string;
  muscleGroups?: string[];
  className?: string;
  animate?: boolean;
  exerciseName?: string;
  customMediaUrl?: string;
  customMediaType?: "image" | "video";
  isCard?: boolean;
  priority?: boolean;
}

const WorkoutVisual = React.memo(function WorkoutVisual({ 
  exerciseId,
  category = "", 
  muscleGroups = [], 
  className = "w-full", 
  exerciseName = "",
  customMediaUrl,
  customMediaType,
  isCard = false,
  priority = false
}: WorkoutVisualProps) {

  const { exercises } = useCentralizedExercises();

  // Try to find the detailed exercise object from our centralized database cleanly
  const exercise = findMatchingExercise(exercises, exerciseId, exerciseName);

  const displayCategory = exercise?.category || category || "General Fitness";
  const displayMuscles = exercise?.muscleGroups || muscleGroups || [];
  const displayEquipment = exercise?.equipment || [];
  const displayDifficulty = exercise?.difficulty || "Beginner";

  const defaultGifUrl = React.useMemo(() => {
    return getExerciseGifUrl(exercise?.name || exerciseName || category || "");
  }, [exercise?.name, exerciseName, category]);

  const primaryRawUrl = customMediaUrl || exercise?.customMediaUrl || exercise?.gifUrl || exercise?.imageUrl || defaultGifUrl;
  const initialResolvedUrl = resolveAdminMediaUrl(primaryRawUrl) || defaultGifUrl;
  
  // Performance & Robustness states
  const [activeMediaUrl, setActiveMediaUrl] = React.useState<string>(initialResolvedUrl);
  const [loading, setLoading] = React.useState<boolean>(() => !isImageCached(initialResolvedUrl));
  const [hasError, setHasError] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    const nextUrl = resolveAdminMediaUrl(primaryRawUrl) || defaultGifUrl;
    setActiveMediaUrl(nextUrl);
    setHasError(false);
    setRetryCount(0);
    if (isImageCached(nextUrl)) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [primaryRawUrl, defaultGifUrl]);

  const resolvedMediaUrl = activeMediaUrl || initialResolvedUrl;
  const resolvedMediaType = customMediaType || exercise?.customMediaType || "image";

  const handleMediaError = () => {
    if (retryCount < 2) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 800);
    } else {
      // Try falling back to default exercise gifUrl or imageUrl if customMediaUrl failed
      const stdGif = exercise?.gifUrl ? resolveAdminMediaUrl(exercise.gifUrl) : "";
      const stdImg = exercise?.imageUrl ? resolveAdminMediaUrl(exercise.imageUrl) : "";
      const catGif = defaultGifUrl;

      if (activeMediaUrl !== stdGif && stdGif && stdGif !== activeMediaUrl) {
        setRetryCount(0);
        setActiveMediaUrl(stdGif);
      } else if (activeMediaUrl !== stdImg && stdImg && stdImg !== activeMediaUrl) {
        setRetryCount(0);
        setActiveMediaUrl(stdImg);
      } else if (activeMediaUrl !== catGif && catGif && catGif !== activeMediaUrl) {
        setRetryCount(0);
        setActiveMediaUrl(catGif);
      } else {
        setHasError(true);
        setLoading(false);
      }
    }
  };

  const formatMediaSrc = (url: string, retry: number) => {
    if (!url) return "";
    const isGif = url.toLowerCase().includes(".gif");
    if (isGif) return url;
    const cdnOptimized = getSupabaseCdnUrl(url, {
      width: isCard ? 500 : 900,
      quality: 80,
      format: "webp",
    });
    if (retry === 0) return cdnOptimized;
    return cdnOptimized.includes("?") ? `${cdnOptimized}&retry=${retry}` : `${cdnOptimized}?retry=${retry}`;
  };

  const handleImageRef = (node: HTMLImageElement | null) => {
    imgRef.current = node;
    if (node && node.complete && node.naturalWidth > 0 && loading) {
      setLoading(false);
      markImageCached(resolvedMediaUrl);
    }
  };

  const handleImageLoadSuccess = () => {
    setLoading(false);
    markImageCached(resolvedMediaUrl);
  };

  // Card Mode Layout Helper
  if (isCard) {
    return (
      <div 
        id={`visual-card-${(exerciseName || exercise?.name || "exercise").replace(/\s+/g, '-').toLowerCase()}`} 
        className={`relative w-full ${className} workout-media-frameless workout-gif-frameless overflow-hidden flex flex-col items-center justify-center bg-transparent`}
      >
        {resolvedMediaUrl && !hasError ? (
          <div className="relative w-full h-full flex items-center justify-center bg-transparent">
            {loading && (
              <div className="absolute inset-0 bg-transparent animate-pulse z-10 flex flex-col items-center justify-center space-y-2 min-h-[160px]">
                <Dumbbell className="w-5 h-5 text-slate-400 animate-spin" />
                <span className="text-[8px] font-mono font-bold text-slate-400 tracking-wider">LOADING</span>
              </div>
            )}
            {resolvedMediaType === "video" || (resolvedMediaUrl && (resolvedMediaUrl.toLowerCase().endsWith(".mp4") || resolvedMediaUrl.toLowerCase().endsWith(".webm") || resolvedMediaUrl.toLowerCase().endsWith(".mov") || resolvedMediaUrl.startsWith("data:video/"))) ? (
              <video
                src={formatMediaSrc(resolvedMediaUrl, retryCount)}
                autoPlay
                loop
                muted
                playsInline
                className={`w-full h-full block object-contain workout-gif-display workout-gif-frameless transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
                onCanPlay={() => setLoading(false)}
                onError={handleMediaError}
              />
            ) : formatMediaSrc(resolvedMediaUrl, retryCount) ? (
              <img 
                ref={handleImageRef}
                src={formatMediaSrc(resolvedMediaUrl, retryCount)} 
                alt={exerciseName || "Exercise Preview"} 
                className={`w-full h-full block object-contain workout-gif-display workout-gif-frameless transition-opacity duration-200 ${loading ? 'opacity-0' : 'opacity-100'}`} 
                referrerPolicy="no-referrer"
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                {...({ fetchPriority: priority ? "high" : "auto" } as any)}
                onLoad={handleImageLoadSuccess}
                onError={handleMediaError}
              />
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col h-full min-h-[180px] justify-center items-center relative z-10 p-4 w-full bg-transparent">
            <div className="flex flex-col items-center justify-center space-y-2 py-4">
              <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-[#C0392B]" />
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                {exerciseName || exercise?.name || "EXERCISE ACTIVE"}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="workout-visual-root" className="w-full max-w-full overflow-hidden flex flex-col space-y-3 min-w-0">
      {/* Manually uploaded GIF / custom media display */}
      <div id="exercise-demo-media-box" className="relative w-full aspect-video overflow-hidden workout-media-frameless workout-gif-frameless flex items-center justify-center bg-transparent">
        {resolvedMediaUrl && !hasError ? (
          <>
            {loading && (
              <div className="absolute inset-0 bg-transparent animate-pulse z-20 flex flex-col items-center justify-center space-y-2">
                <div className="relative z-30 flex flex-col items-center justify-center space-y-1.5 p-3 bg-black/40 backdrop-blur-xs rounded-xl text-white">
                  <Dumbbell className="w-6 h-6 text-slate-400 animate-spin" />
                  <span className="text-[9px] font-mono font-bold text-slate-400 tracking-wider">LOADING STREAM</span>
                </div>
              </div>
            )}
            {resolvedMediaType === "video" || (resolvedMediaUrl && (resolvedMediaUrl.toLowerCase().endsWith(".mp4") || resolvedMediaUrl.toLowerCase().endsWith(".webm") || resolvedMediaUrl.toLowerCase().endsWith(".mov") || resolvedMediaUrl.startsWith("data:video/"))) ? (
              <video
                src={formatMediaSrc(resolvedMediaUrl, retryCount)}
                autoPlay
                loop
                muted
                playsInline
                className={`w-full h-full object-contain workout-gif-display workout-gif-frameless transition-all duration-300 ease-out ${loading ? 'opacity-0' : 'opacity-100'}`}
                onCanPlay={() => setLoading(false)}
                onError={handleMediaError}
              />
            ) : formatMediaSrc(resolvedMediaUrl, retryCount) ? (
              <img 
                ref={handleImageRef}
                src={formatMediaSrc(resolvedMediaUrl, retryCount)} 
                alt={exerciseName || "Exercise Demo GIF"} 
                decoding="async"
                className={`w-full h-full object-contain workout-gif-display transition-all duration-200 ease-out ${loading ? 'opacity-0' : 'opacity-100'}`} 
                referrerPolicy="no-referrer"
                loading={priority ? "eager" : "lazy"}
                {...({ fetchPriority: priority ? "high" : "auto" } as any)}
                onLoad={handleImageLoadSuccess}
                onError={handleMediaError}
              />
            ) : null}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 p-6 text-center">
            <div className="h-14 w-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg">
              <Dumbbell className="w-6 h-6 text-[#C0392B]" />
            </div>
            <p className="text-xs text-slate-400 font-medium max-w-sm">
              Kinetic guidance active
            </p>
          </div>
        )}
      </div>

      {/* 3-Part Movement Biomechanics Details */}
      {exercise && (
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 shadow-xs">
            <span className="text-[8px] font-mono font-black text-blue-600 uppercase tracking-widest block">
              Phase 1: Starting Position
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              {exercise.startingPosition || "Establish standard athletic grip, lock core alignment, and load stabilization frames."}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 shadow-xs">
            <span className="text-[8px] font-mono font-black text-orange-600 uppercase tracking-widest block">
              Phase 2: Execution Drive
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              {exercise.movementExecution || "Concentric contraction through target muscular fibers with complete control."}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 shadow-xs">
            <span className="text-[8px] font-mono font-black text-purple-600 uppercase tracking-widest block">
              Phase 3: Finish Contraction
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              {exercise.finishingPosition || "Isometric lock at peak squeeze point, then execute high-tempo eccentric release."}
            </p>
          </div>
        </div>
      )}

      {/* Movement Instructions / Discrimination Steps */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-750 flex items-center gap-1.5 font-sans border-b border-slate-100 pb-2">
          <ListTodo className="w-4 h-4 text-[#C0392B]" />
          <span>Step-by-Step Training Instructions</span>
        </h4>
        
        {exercise && exercise.instructions && exercise.instructions.length > 0 ? (
          <div className="space-y-2.5">
            {exercise.instructions.map((step, idx) => (
              <div key={idx} className="flex gap-3 items-start text-xs text-slate-600 leading-relaxed">
                <span className="h-5 w-5 rounded-full bg-slate-100 text-[#C0392B] font-bold text-[10px] font-mono flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            Standard performance: Retract scapula, establish neutral head position, maintain active core brace, and execute targeted concentric load with tempo control.
          </p>
        )}
      </div>

      {/* Target Muscles & Equipment tags */}
      <div className="grid sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
        {displayMuscles.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono uppercase font-extrabold text-slate-400 tracking-wider block">
              Anatomical Muscle Targets
            </span>
            <div className="flex flex-wrap gap-1">
              {displayMuscles.map((muscle) => (
                <span key={muscle} className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200/50">
                  {muscle}
                </span>
              ))}
            </div>
          </div>
        )}

        {displayEquipment.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono uppercase font-extrabold text-slate-400 tracking-wider block">
              Required Equipment Setup
            </span>
            <div className="flex flex-wrap gap-1">
              {displayEquipment.map((eq) => (
                <span key={eq} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-150">
                  {eq}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Safety Compliance Tips */}
      {exercise && exercise.safetyTips && exercise.safetyTips.length > 0 && (
        <div className="p-3.5 bg-red-50/50 border border-red-100 rounded-xl space-y-1.5">
          <span className="text-[9px] font-mono font-black text-[#C0392B] uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Injury Prevention & Safety Guidelines
          </span>
          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600 leading-relaxed font-sans">
            {exercise.safetyTips.slice(0, 2).map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
});

export default WorkoutVisual;
