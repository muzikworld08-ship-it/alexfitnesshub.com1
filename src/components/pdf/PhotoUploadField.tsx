import React, { useState, useRef } from "react";
import { Upload, X, CheckCircle2, AlertTriangle, Image as ImageIcon, RefreshCw } from "lucide-react";

interface PhotoUploadFieldProps {
  onPhotoSelected: (base64: string | null, file: File | null) => void;
  required?: boolean;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const PhotoUploadField: React.FC<PhotoUploadFieldProps> = ({
  onPhotoSelected,
  required = true,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSizeMb, setFileSizeMb] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);

    // 1. File Type Validation
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      setError("Invalid file format. Please upload a JPG, JPEG, PNG, or WEBP image.");
      return;
    }

    // 2. File Size Validation (<= 5MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const actualMb = (file.size / (1024 * 1024)).toFixed(2);
      setError(`File is too large (${actualMb} MB). Maximum allowed size is 5 MB.`);
      return;
    }

    // 3. Read file and generate base64 data URL preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
      setFileName(file.name);
      setFileSizeMb((file.size / (1024 * 1024)).toFixed(2));
      onPhotoSelected(result, file);
    };
    reader.onerror = () => {
      setError("Unable to read the selected image file. Please try another image.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Exactly ONE file allowed
      processFile(files[0]);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    setFileName("");
    setFileSizeMb("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onPhotoSelected(null, null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <span>Personalization Photo</span>
          {required ? (
            <span className="text-red-600 font-bold">* (Required)</span>
          ) : (
            <span className="text-slate-400 font-normal">(Optional)</span>
          )}
        </label>
        <span className="text-[11px] font-mono text-slate-500">Max 5MB • JPG, PNG, WEBP</span>
      </div>

      {previewUrl ? (
        <div className="relative p-3.5 bg-slate-50 border-2 border-emerald-500/40 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="relative w-20 h-24 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0 shadow-xs">
            <img
              src={previewUrl}
              alt="Personalization photo preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Photo Attached</span>
            </div>
            <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{fileName}</p>
            <p className="text-[11px] font-mono text-slate-500 mt-0.5">{fileSizeMb} MB • Ready for print</p>

            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-red-500 bg-red-50/50 scale-[1.01]"
              : "border-slate-300 hover:border-red-500/70 bg-white hover:bg-slate-50/80"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6" />
          </div>

          <p className="text-sm font-bold text-slate-900">
            Click to upload or drag & drop your photo
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            This photo will be professionally rendered directly onto your personalized PDF journal/guide.
          </p>
          <div className="inline-flex items-center gap-2 mt-3 text-[11px] font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Exactly 1 photo • Up to 5 MB (JPG, PNG, WEBP)</span>
          </div>
        </div>
      )}

      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
