import React, { useState } from "react";
import { Download, Share2, X, Smartphone, Check } from "lucide-react";
import { usePWAInstall } from "../hooks/usePWAInstall";

interface PWAInstallButtonProps {
  className?: string;
  variant?: "primary" | "compact" | "banner";
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = "",
  variant = "primary"
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // Suppress if already installed in standalone mode
  if (isInstalled) {
    return null;
  }

  const handleInstall = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 3000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  // If browser does not support install prompt and is not iOS, keep it subtle or hidden
  if (!isInstallable && !isIOS) {
    return null;
  }

  if (variant === "compact") {
    return (
      <>
        <button
          onClick={handleInstall}
          id="pwa-install-compact-btn"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 border border-slate-200 bg-slate-900 text-white hover:bg-slate-800 shadow-xs cursor-pointer ${className}`}
          title="Install ALEX FITNESS HUB on your device"
        >
          {installSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Installed!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-orange-400" />
              <span>Install App</span>
            </>
          )}
        </button>

        {showIOSGuide && <IOSGuideModal onClose={() => setShowIOSGuide(false)} />}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleInstall}
        id="pwa-install-btn"
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 bg-slate-950 text-white hover:bg-slate-800 shadow-sm hover:shadow-md active:scale-98 cursor-pointer border border-slate-800 ${className}`}
      >
        <div className="w-5 h-5 rounded-md bg-orange-500/20 flex items-center justify-center text-orange-400">
          <Smartphone className="w-3.5 h-3.5" />
        </div>
        <span>{isIOS ? "Add to Home Screen" : "Install App"}</span>
      </button>

      {showIOSGuide && <IOSGuideModal onClose={() => setShowIOSGuide(false)} />}
    </>
  );
};

const IOSGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 text-slate-900 relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <img src="/icons/icon-192.png" alt="ALEX FITNESS HUB" className="w-12 h-12 rounded-xl shadow-xs" />
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase">Install ALEX FITNESS HUB</h3>
            <p className="text-xs text-slate-500">Fast access on your iPhone or iPad</p>
          </div>
        </div>

        <div className="space-y-3 pt-2 text-xs text-slate-700">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">1</div>
            <div>
              Tap the <strong className="text-slate-900 font-bold inline-flex items-center gap-1">Share <Share2 className="w-3 h-3 text-blue-600 inline" /></strong> button in the bottom Safari toolbar.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">2</div>
            <div>
              Scroll down and select <strong className="text-slate-900 font-bold">"Add to Home Screen"</strong>.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">3</div>
            <div>
              Tap <strong className="text-slate-900 font-bold">Add</strong> at the top right to launch directly from your home screen.
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition cursor-pointer"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
