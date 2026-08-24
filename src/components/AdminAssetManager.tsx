import React, { useState, useEffect, useRef } from "react";
import { useApp, isEmailAdmin } from "../context/AppContext";
import { useCentralizedExercises } from "../hooks/useCentralizedExercises";
import { db, storage, handleFirestoreError, OperationType } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { 
  Upload, Image as ImageIcon, Video, CheckCircle2, AlertTriangle, Search, 
  Dumbbell, RefreshCw, ShieldCheck, Film, Sparkles, FileType, Check, X, ArrowRight 
} from "lucide-react";
import UnifiedExerciseMedia from "./UnifiedExerciseMedia";
import { Exercise } from "../data/exercises";
import { AssetManifestService } from "../services/AssetManifestService";
import { uploadMediaToCloud, saveExerciseMediaToDatabase } from "../utils/mediaStorageService";
import { uploadAdminMedia, getAdminMediaUrl, resolveAdminMediaUrl } from "../lib/mediaStorage";

export const AdminAssetManager: React.FC = () => {
  const { user, uploadExerciseMedia } = useApp();
  const { exercises, loading: exercisesLoading } = useCentralizedExercises();

  // Search & Selected Exercise State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Drag & Drop / File State
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isFileTypeValid, setIsFileTypeValid] = useState<boolean>(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Upload Progress & Feedback State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatusPhase, setUploadStatusPhase] = useState<string>("");
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [uploadErrorMsg, setUploadErrorMsg] = useState<string | null>(null);

  // Manual URL Option
  const [manualUrlInput, setManualUrlInput] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verification: Restricted to alexfitnesshub@gmail.com and system admins
  const isAdminAuthorized = isEmailAdmin(user?.email) || user?.email === "alexfitnesshub@gmail.com" || user?.role === "admin";

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (filePreviewUrl && filePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  // Handle Drag Events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateAndSetFile = (file: File) => {
    setValidationError(null);
    setUploadErrorMsg(null);
    setUploadSuccessMsg(null);

    // Validate size (e.g. 25MB limit)
    const MAX_SIZE_MB = 25;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setValidationError(`File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the ${MAX_SIZE_MB} MB limit.`);
      setIsFileTypeValid(false);
      setSelectedFile(null);
      setFilePreviewUrl(null);
      return;
    }

    // Validate mime type: GIF, Video (mp4, webm, mov) or Image (png, jpg, jpeg, webp)
    const validMimeTypes = [
      "image/gif", 
      "image/png", 
      "image/jpeg", 
      "image/jpg", 
      "image/webp",
      "video/mp4", 
      "video/webm", 
      "video/quicktime"
    ];

    const isExtensionValid = /\.(gif|mp4|webm|mov|png|jpe?g|webp)$/i.test(file.name);

    if (!validMimeTypes.includes(file.type) && !isExtensionValid) {
      setValidationError("Invalid file format. Please upload an exercise GIF, MP4/WEBM video, or PNG/JPEG image.");
      setIsFileTypeValid(false);
      setSelectedFile(null);
      setFilePreviewUrl(null);
      return;
    }

    setIsFileTypeValid(true);
    setSelectedFile(file);

    // Create instant local object URL for previewing
    const preview = URL.createObjectURL(file);
    setFilePreviewUrl(preview);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
      e.target.value = ""; // reset value for re-selection
    }
  };

  // Execute Upload Process to Firebase Storage & Update Firestore Document
  const handleStartUpload = async () => {
    if (!selectedExercise) {
      setUploadErrorMsg("Please select a target exercise from the database first.");
      return;
    }

    if (!selectedFile && !manualUrlInput.trim()) {
      setUploadErrorMsg("Please choose a file or enter a valid media URL.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadErrorMsg(null);
    setUploadSuccessMsg(null);

    const exerciseId = selectedExercise.id;
    const isVideo = selectedFile
      ? selectedFile.type.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(selectedFile.name)
      : (manualUrlInput.toLowerCase().endsWith(".mp4") || manualUrlInput.toLowerCase().endsWith(".webm"));

    const mediaType = isVideo ? "video" : "image";

    try {
      let finalMediaUrl = "";

      if (selectedFile) {
        setUploadStatusPhase("Phase 1: Validating file integrity...");
        await new Promise((r) => setTimeout(r, 200));

        // Upload to Firebase / Supabase persistent cloud storage
        finalMediaUrl = await uploadMediaToCloud(
          selectedFile, 
          exerciseId, 
          mediaType,
          (pct, statusMsg) => {
            setUploadProgress(pct);
            setUploadStatusPhase(statusMsg);
          }
        );
      } else {
        finalMediaUrl = manualUrlInput.trim();
        setUploadProgress(50);
      }

      // Phase 3: Persist URL to Supabase DB + Cloud Firestore + App State
      setUploadStatusPhase("Phase 3: Deploying asset & syncing database records...");
      setUploadProgress(85);

      await saveExerciseMediaToDatabase(exerciseId, finalMediaUrl, mediaType);
      await uploadExerciseMedia(exerciseId, finalMediaUrl, mediaType);
      AssetManifestService.recordUploadedAssetSignature(exerciseId, finalMediaUrl, mediaType);

      setUploadProgress(100);
      setUploadStatusPhase("Upload Complete!");
      setUploadSuccessMsg(`Successfully deployed ${mediaType.toUpperCase()} asset for exercise "${selectedExercise.name}"!`);

      // Update selected exercise in local state to immediately show updated media
      setSelectedExercise({
        ...selectedExercise,
        customMediaUrl: finalMediaUrl,
        customMediaType: mediaType
      });

      // Reset file selection
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setManualUrlInput("");

    } catch (err: any) {
      console.error("AdminAssetManager upload error:", err);
      setUploadErrorMsg(err?.message || "Failed to complete asset upload. Please check network connection and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Filter exercises list for target exercise picker
  const allCategoryTags = Array.from(
    new Set([
      "Women Confidence Program",
      "Gym Workouts",
      "Home Workouts",
      "Cardio Workouts",
      "Calisthenics Workouts",
      "Military Style Fitness",
      "Chest",
      "Back",
      "Shoulders",
      "Biceps",
      "Triceps",
      "Glutes",
      "Abs",
      "HIIT",
      "Mobility",
      ...exercises.map((e) => e.category).filter(Boolean),
      ...exercises.flatMap((e) => e.categories || [])
    ])
  ).filter(Boolean);

  const categories = ["all", ...allCategoryTags];

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroups.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ex.categories && ex.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCategory = 
      selectedCategory === "all" || 
      ex.category === selectedCategory || 
      (ex.categories && ex.categories.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  if (!isAdminAuthorized) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-3xl text-center space-y-4 max-w-2xl mx-auto my-8">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-black text-rose-600 uppercase font-mono tracking-wide">
          Admin Access Restricted
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
          The <code className="bg-white px-2 py-0.5 rounded border border-rose-200 text-rose-700 font-bold font-mono">AdminAssetManager</code> module is strictly restricted to administrator <code className="bg-white px-2 py-0.5 rounded border border-rose-200 text-rose-700 font-bold font-mono">alexfitnesshub@gmail.com</code>.
        </p>
      </div>
    );
  }

  return (
    <div id="admin-asset-manager" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black font-mono uppercase bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              ADMINISTRATIVE ASSET ENGINE
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              [Authorized: alexfitnesshub@gmail.com]
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-2 tracking-tight flex items-center gap-2">
            <Film className="w-6 h-6 text-emerald-500" />
            Exercise Asset Manager & Storage Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Upload custom exercise GIFs, videos, or images directly to Firebase Storage. Automatically update Firestore database documents and sync live workout cards.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-xs font-mono font-bold text-slate-600">
          <Dumbbell className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Catalog Exercises: {exercises.length}</span>
        </div>
      </div>

      {/* FEEDBACK MESSAGES */}
      {uploadSuccessMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-bold text-emerald-700 flex items-center gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <div className="flex-1 min-w-0">{uploadSuccessMsg}</div>
          <button onClick={() => setUploadSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {uploadErrorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs font-bold text-rose-700 flex items-center gap-3 animate-fade-in shadow-xs">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
          <div className="flex-1 min-w-0">{uploadErrorMsg}</div>
          <button onClick={() => setUploadErrorMsg(null)} className="text-rose-500 hover:text-rose-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TWO-COLUMN GRID: EXERCISE SELECTOR (LEFT) & DRAG-AND-DROP UPLOADER (RIGHT) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: TARGET EXERCISE SELECTOR */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <h3 className="text-xs font-black uppercase font-mono tracking-wider text-slate-900 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-emerald-500" />
              1. Select Target Exercise
            </h3>
            {selectedExercise && (
              <span className="text-[9px] bg-emerald-500 text-white font-mono font-black px-2 py-0.5 rounded">
                SELECTED
              </span>
            )}
          </div>

          {/* Search & Category Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search exercise name or muscle..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded-lg shrink-0 transition ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Exercises List Box */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white max-h-72 overflow-y-auto divide-y divide-slate-100">
            {exercisesLoading ? (
              <div className="p-8 text-center text-xs font-mono text-slate-400 flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-emerald-500" />
                Fetching Exercises...
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-slate-400">
                No exercises found matching criteria.
              </div>
            ) : (
              filteredExercises.map((ex) => {
                const isSelected = selectedExercise?.id === ex.id;
                const hasCustomMedia = Boolean(ex.customMediaUrl);
                return (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExercise(ex)}
                    className={`w-full text-left p-3 flex items-center justify-between gap-3 transition cursor-pointer ${
                      isSelected
                        ? "bg-emerald-500/10 border-l-4 border-emerald-500 font-bold"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden">
                        <UnifiedExerciseMedia exerciseId={ex.id} exerciseName={ex.name} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{ex.name}</h4>
                        <span className="text-[9px] text-slate-400 font-mono block truncate">
                          {ex.category} • {ex.muscleGroups.join(", ") || "General"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {hasCustomMedia ? (
                        <span className="inline-flex items-center gap-1 text-[8px] bg-emerald-100 text-emerald-800 font-mono font-bold px-1.5 py-0.5 rounded">
                          <Check className="w-2.5 h-2.5" /> CUSTOM GIF
                        </span>
                      ) : (
                        <span className="text-[8px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                          DEFAULT
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Selected Exercise Preview Card */}
          {selectedExercise ? (
            <div className="p-4 bg-white border border-emerald-500/30 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono font-black text-emerald-600 uppercase">
                  ACTIVE TARGET SELECTION
                </span>
                <span className="text-[9px] font-mono text-slate-400">ID: {selectedExercise.id}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shrink-0 bg-slate-950">
                  <UnifiedExerciseMedia exerciseId={selectedExercise.id} exerciseName={selectedExercise.name} />
                </div>

                <div className="space-y-1 min-w-0">
                  <h4 className="text-xs font-black text-slate-900 leading-tight">{selectedExercise.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Category: {selectedExercise.category}
                  </p>
                  <p className="text-[9px] text-slate-400 font-mono truncate">
                    Current URL: {selectedExercise.customMediaUrl || selectedExercise.gifUrl || "None"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[10px] text-amber-800 font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Select an exercise above to attach your uploaded GIF/video.</span>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DRAG-AND-DROP FILE UPLOADER & REAL-TIME FEEDBACK */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h3 className="text-xs font-black uppercase font-mono tracking-wider text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-500" />
                2. Drag & Drop Exercise GIF / Video
              </h3>
              <span className="text-[9px] text-slate-400 font-mono uppercase">
                Firebase Storage Protected
              </span>
            </div>

            {/* DRAG AND DROP ZONE */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-3 ${
                isDragging
                  ? "border-emerald-500 bg-emerald-500/10 scale-[1.01]"
                  : selectedFile
                  ? "border-emerald-500/50 bg-white"
                  : "border-slate-300 bg-white hover:border-emerald-400 hover:bg-slate-50/80"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/gif,video/mp4,video/webm,video/quicktime,image/png,image/jpeg,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />

              {filePreviewUrl ? (
                <div className="space-y-3 w-full flex flex-col items-center">
                  <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-950 flex items-center justify-center">
                    {selectedFile?.type.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(selectedFile?.name || "") ? (
                      <video
                        src={filePreviewUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={filePreviewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] font-mono px-1.5 py-0.5 rounded uppercase">
                      LOCAL PREVIEW
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900 font-mono truncate max-w-xs">
                      {selectedFile?.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Size: {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : "0"} MB • Format: {selectedFile?.type || "GIF/Video"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setFilePreviewUrl(null);
                    }}
                    className="text-[10px] text-rose-500 hover:text-rose-700 font-mono uppercase font-bold underline"
                  >
                    Remove & Select Different File
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                    <Upload className="w-6 h-6 animate-bounce" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900">
                      Drag & Drop your Exercise GIF or Video file here
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      or <span className="text-emerald-600 underline font-bold">click to browse from computer</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                    <span className="text-[9px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded border border-slate-200">
                      .GIF
                    </span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded border border-slate-200">
                      .MP4 / .WEBM
                    </span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded border border-slate-200">
                      .PNG / .JPG
                    </span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded border border-slate-200">
                      Max 25 MB
                    </span>
                  </div>
                </>
              )}
            </div>

            {validationError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-700 text-[10px] font-mono font-bold rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                {validationError}
              </div>
            )}

            {/* OR MANUAL URL INPUT OPTION */}
            <div className="pt-2 border-t border-slate-200/80 space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono">
                Or Provide External GIF / Storage URL directly
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={manualUrlInput}
                  onChange={(e) => {
                    setManualUrlInput(e.target.value);
                    if (e.target.value.trim()) {
                      setSelectedFile(null);
                      setFilePreviewUrl(null);
                    }
                  }}
                  placeholder="https://firebasestorage.googleapis.com/... or https://media.giphy.com/..."
                  className="flex-1 p-2.5 rounded-xl text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* REAL-TIME PROGRESS BAR & STATUS PHASE */}
            {isUploading && (
              <div className="p-4 bg-white border border-emerald-500/30 rounded-2xl space-y-3 animate-fade-in shadow-sm">
                <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-800">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-emerald-500 animate-spin" />
                    {uploadStatusPhase || "Uploading media..."}
                  </span>
                  <span className="text-emerald-600">{uploadProgress}%</span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 p-0.5">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300 shadow-sm"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* ACTION SUBMIT BUTTON */}
            <button
              type="button"
              onClick={handleStartUpload}
              disabled={isUploading || (!selectedFile && !manualUrlInput.trim()) || !selectedExercise}
              className={`w-full py-4 rounded-2xl text-xs font-black font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md ${
                isUploading || (!selectedFile && !manualUrlInput.trim()) || !selectedExercise
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer hover:shadow-lg active:scale-[0.99]"
              }`}
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  DEPLOYING TO FIRESTORE & STORAGE...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  UPLOAD & COMMIT ASSET TO EXERCISE
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAssetManager;
