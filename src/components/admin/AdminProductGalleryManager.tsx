import React, { useState, useRef } from "react";
import { 
  Upload, Trash2, ArrowUp, ArrowDown, Star, Sparkles, 
  Image as ImageIcon, Check, AlertCircle, RefreshCw, Eye 
} from "lucide-react";
import { uploadAdminMedia } from "../../lib/mediaStorage";

interface AdminProductGalleryManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export const AdminProductGalleryManager: React.FC<AdminProductGalleryManagerProps> = ({
  images,
  onChange
}) => {
  // Ensure we always represent exactly 7 slots
  const slots = [0, 1, 2, 3, 4, 5, 6];
  const [activeSlotInput, setActiveSlotInput] = useState<number | null>(null);
  const [urlInputVal, setUrlInputVal] = useState("");
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [targetSlotForFile, setTargetSlotForFile] = useState<number | null>(null);

  // Normalize images array to ensure safe array
  const currentImages = Array.isArray(images) ? [...images] : [];

  const handleSetSlotUrl = (slotIndex: number, url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const updated = [...currentImages];
    updated[slotIndex] = trimmed;
    // Clean up trailing empty slots if needed, but maintain order
    onChange(updated);
    setActiveSlotInput(null);
    setUrlInputVal("");
    setErrorMsg(null);
  };

  const handleClearSlot = (slotIndex: number) => {
    const updated = [...currentImages];
    updated.splice(slotIndex, 1);
    onChange(updated);
  };

  const handleMakePrimary = (slotIndex: number) => {
    if (slotIndex === 0 || !currentImages[slotIndex]) return;
    const updated = [...currentImages];
    const [selected] = updated.splice(slotIndex, 1);
    updated.unshift(selected);
    onChange(updated);
  };

  const handleMove = (slotIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? slotIndex - 1 : slotIndex + 1;
    if (targetIndex < 0 || targetIndex >= 7 || !currentImages[slotIndex]) return;

    const updated = [...currentImages];
    const temp = updated[slotIndex];
    updated[slotIndex] = updated[targetIndex] || "";
    updated[targetIndex] = temp;
    onChange(updated.filter(Boolean));
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || targetSlotForFile === null) return;

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 10MB limit. Please choose a smaller file.");
      return;
    }

    setUploadingSlot(targetSlotForFile);
    setErrorMsg(null);

    try {
      // Attempt Supabase upload or fallback to base64 data URL
      const path = `store/products/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      let finalUrl = "";
      try {
        finalUrl = await uploadAdminMedia(file, path);
      } catch (err) {
        // Fallback to FileReader base64 for offline resiliency
        finalUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      handleSetSlotUrl(targetSlotForFile, finalUrl);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload image file.");
    } finally {
      setUploadingSlot(null);
      setTargetSlotForFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const validCount = currentImages.filter(Boolean).length;
  const isSatisfied = validCount >= 6 && validCount <= 7;

  return (
    <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept="image/*"
        className="hidden"
      />

      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Product Image Gallery (7 Slots)
            </h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isSatisfied 
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-amber-100 text-amber-800 border border-amber-300"
            }`}>
              {validCount} of 7 Uploaded {isSatisfied ? "✓ Ready" : "(Recommend 6-7)"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            <strong>Image 1</strong> is the Primary catalog image. Upload between 6 and 7 high-resolution views.
          </p>
        </div>

        {/* Quick Help */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Drag, reorder, or replace any slot</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 7 SLOTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {slots.map((index) => {
          const slotNumber = index + 1;
          const imageUrl = currentImages[index] || "";
          const isPrimary = index === 0;
          const isUploading = uploadingSlot === index;
          const isInputActive = activeSlotInput === index;

          return (
            <div
              key={`slot-${index}`}
              className={`relative flex flex-col justify-between rounded-xl border-2 transition-all p-2 bg-white ${
                isPrimary
                  ? "border-red-500 ring-2 ring-red-500/10 shadow-xs"
                  : imageUrl
                  ? "border-slate-300 shadow-2xs"
                  : "border-dashed border-slate-300 bg-slate-50/50"
              }`}
            >
              {/* Slot Tag */}
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                  isPrimary 
                    ? "bg-red-600 text-white" 
                    : "bg-slate-200 text-slate-700"
                }`}>
                  Image {slotNumber}
                </span>

                {isPrimary && (
                  <span className="text-[9px] font-bold text-red-600 flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-red-600" />
                    Primary
                  </span>
                )}
              </div>

              {/* Slot Visual / Preview */}
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <RefreshCw className="w-5 h-5 text-red-600 animate-spin" />
                    <span className="text-[9px] text-slate-500 font-bold">Uploading...</span>
                  </div>
                ) : imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={`Slot ${slotNumber}`}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        (e.target as HTMLElement).classList.add("opacity-40");
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                      <button
                        type="button"
                        onClick={() => {
                          setTargetSlotForFile(index);
                          fileInputRef.current?.click();
                        }}
                        className="p-1.5 bg-white text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer shadow-xs"
                        title="Replace Image"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleClearSlot(index)}
                        className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer shadow-xs"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <ImageIcon className="w-6 h-6 text-slate-300 mb-1" />
                    <span className="text-[10px] text-slate-400 font-medium">Empty Slot</span>
                  </div>
                )}
              </div>

              {/* Slot Controls */}
              <div className="mt-2 space-y-1.5">
                {imageUrl ? (
                  <div className="flex items-center justify-between gap-1">
                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleMakePrimary(index)}
                        className="text-[9px] font-bold text-red-600 hover:underline cursor-pointer flex items-center gap-0.5"
                        title="Make this the Primary Image"
                      >
                        <Star className="w-2.5 h-2.5" />
                        Set Main
                      </button>
                    )}

                    <div className="flex items-center gap-0.5 ml-auto">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMove(index, "up")}
                          className="p-1 hover:bg-slate-100 text-slate-600 rounded cursor-pointer"
                          title="Move Left/Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                      )}
                      {index < currentImages.length - 1 && index < 6 && (
                        <button
                          type="button"
                          onClick={() => handleMove(index, "down")}
                          className="p-1 hover:bg-slate-100 text-slate-600 rounded cursor-pointer"
                          title="Move Right/Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetSlotForFile(index);
                        fileInputRef.current?.click();
                      }}
                      className="w-full py-1 px-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <Upload className="w-2.5 h-2.5" />
                      Upload
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveSlotInput(isInputActive ? null : index);
                        setUrlInputVal("");
                      }}
                      className="w-full py-0.5 text-[9px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      {isInputActive ? "Cancel URL" : "Paste URL"}
                    </button>
                  </div>
                )}

                {/* Direct URL Input Popup for Slot */}
                {isInputActive && (
                  <div className="pt-1 border-t border-slate-100">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={urlInputVal}
                      onChange={(e) => setUrlInputVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSetSlotUrl(index, urlInputVal);
                        }
                      }}
                      className="w-full text-[9px] font-mono px-2 py-1 rounded border border-slate-300 mb-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleSetSlotUrl(index, urlInputVal)}
                      className="w-full py-0.5 bg-red-600 text-white text-[9px] font-bold rounded cursor-pointer"
                    >
                      Apply URL
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
