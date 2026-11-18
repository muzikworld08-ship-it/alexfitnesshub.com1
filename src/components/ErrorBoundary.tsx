import React, { ErrorInfo, ReactNode } from "react";
import { isChunkLoadError } from "../utils/lazyWithRetry";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

function InlineAlertIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function InlineActivityIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  );
}

function InlineRotateIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function InlineLifeBuoyIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
      <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
      <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
    </svg>
  );
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      showDetails: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Uncaught Render Error - ErrorBoundary]:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleSoftRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
  };

  private handleReset = () => {
    try {
      localStorage.removeItem("fit_attempted_view");
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6 sm:p-12 font-sans selection:bg-red-500/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(211,47,47,0.15),rgba(255,255,255,0))]" />
          
          <div className="relative w-full max-w-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] space-y-8 overflow-hidden">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center shadow-lg shadow-red-950/20 text-[#D32F2F]">
                <InlineAlertIcon className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-800 border border-slate-700 text-slate-300">
                  <InlineActivityIcon className="w-3 h-3 text-[#D32F2F]" /> Routine Recovery
                </span>
                <h1 className="text-2xl sm:text-3xl font-sans font-black uppercase tracking-tight text-white mt-1">
                  Workout Temporarily Unavailable
                </h1>
                <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  Workout temporarily unavailable. Your progress is safe. Please try again.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={this.handleSoftRetry}
                className="w-full flex items-center justify-center gap-2 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all duration-200 border border-slate-700/50 font-sans tracking-wide text-sm cursor-pointer"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-2xl font-bold transition-all duration-200 active:scale-[0.98] shadow-lg shadow-red-950/20 font-sans tracking-wide text-sm cursor-pointer"
              >
                <InlineRotateIcon className="w-4 h-4" />
                Reload App
              </button>
              <a
                href="mailto:alexfitnesshub@gmail.com"
                className="w-full flex items-center justify-center gap-2.5 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-bold transition-all duration-200 active:scale-[0.98] border border-slate-700/50 font-sans tracking-wide text-sm"
              >
                <InlineLifeBuoyIcon className="w-4 h-4 text-slate-400" />
                Support Desk
              </a>
            </div>

            <p className="text-[10px] font-mono text-slate-500 text-center select-none uppercase tracking-wider">
              Secure Athlete Recovery Protocol Enabled
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface SectionErrorBoundaryProps {
  children?: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
  resetKey?: any;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class SectionErrorBoundary extends React.Component<SectionErrorBoundaryProps, SectionErrorBoundaryState> {
  public state: SectionErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): SectionErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Section Render Error - SectionErrorBoundary]:", error, errorInfo);
  }

  public componentDidUpdate(prevProps: SectionErrorBoundaryProps) {
    if (this.state.hasError && (prevProps.resetKey !== this.props.resetKey || prevProps.children !== this.props.children)) {
      this.setState({ hasError: false, error: null });
    }
  }

  private handleRetry = () => {
    if (isChunkLoadError(this.state.error)) {
      this.handleClearCacheAndReload();
      return;
    }
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleClearCacheAndReload = () => {
    try {
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("fit_attempted_view");
          sessionStorage.clear();
        } catch {}
        if ("caches" in window) {
          caches.keys().then((keys) => {
            keys.forEach((k) => caches.delete(k));
          });
        }
        window.location.reload();
      }
    } catch {
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-4xl mx-auto my-8 p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-center space-y-5 font-sans">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
            <InlineAlertIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {this.props.fallbackTitle || "Workout Temporarily Unavailable"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Workout temporarily unavailable. Your progress is safe. Please try again.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={this.handleRetry}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <InlineRotateIcon className="w-3.5 h-3.5" />
              <span>Reload Routine</span>
            </button>
            <button
              type="button"
              onClick={this.handleGoHome}
              className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              Return to Home
            </button>
            <button
              type="button"
              onClick={this.handleClearCacheAndReload}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border border-slate-200"
            >
              Clear Cache & Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

