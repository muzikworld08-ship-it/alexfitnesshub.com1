import React, { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw, Activity, ShieldAlert, LifeBuoy } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { 
      hasError: true, 
      error, 
      errorInfo: null,
      showDetails: false 
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Uncaught Render Error - ErrorBoundary]:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    try {
      // Clear specific temporary keys if they are causing cyclic rendering failures
      localStorage.removeItem("fit_attempted_view");
      localStorage.removeItem("fit_workout_filters_guest");
    } catch (e) {}
    
    // Hard refresh to boot the application with clean state
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6 sm:p-12 font-sans selection:bg-red-500/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(211,47,47,0.15),rgba(255,255,255,0))]" />
          
          <div className="relative w-full max-w-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] space-y-8 overflow-hidden">
            {/* Top Warning Badge */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center shadow-lg shadow-red-950/20">
                <AlertTriangle className="w-8 h-8 text-[#D32F2F] animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-red-950/40 border border-red-500/20 text-red-400">
                  <Activity className="w-3 h-3 text-[#D32F2F]" /> System Interruption
                </span>
                <h1 className="text-2xl sm:text-3xl font-sans font-black uppercase tracking-tight text-white mt-1">
                  Something <span className="text-[#D32F2F]">Went Wrong</span>
                </h1>
                <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  The training engine encountered an unexpected runtime exception. Don't worry—your athletic progress remains safe.
                </p>
              </div>
            </div>

            {/* Collapsible Error Diagnosis Details */}
            {this.state.error && (
              <div className="border border-slate-800 bg-slate-950/60 rounded-2xl overflow-hidden transition-all duration-300">
                <button
                  onClick={() => this.setState((prev) => ({ showDetails: !prev }))}
                  className="w-full flex items-center justify-between p-4 font-mono text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider select-none"
                >
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-slate-500" />
                    Diagnostics Report
                  </span>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                    {this.state.showDetails ? "Hide" : "Show"}
                  </span>
                </button>

                {this.state.showDetails && (
                  <div className="p-4 pt-0 border-t border-slate-900 font-mono text-left text-xs text-red-400/90 space-y-3 overflow-auto max-h-60 leading-relaxed">
                    <div className="font-bold text-slate-300 select-all p-2 rounded bg-slate-900/50">
                      Exception: {this.state.error.toString()}
                    </div>
                    {this.state.errorInfo && (
                      <pre className="text-[10px] text-slate-500 select-all overflow-x-auto whitespace-pre-wrap font-mono p-2 rounded bg-slate-950 border border-slate-900">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions Panel */}
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-2xl font-bold transition-all duration-200 active:scale-[0.98] shadow-lg shadow-red-950/20 font-sans tracking-wide text-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Reset & Reload App
              </button>
              
              <a
                href="mailto:alexfitnesshub@gmail.com"
                className="w-full flex items-center justify-center gap-2.5 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-bold transition-all duration-200 active:scale-[0.98] border border-slate-700/50 font-sans tracking-wide text-sm"
              >
                <LifeBuoy className="w-4 h-4 text-slate-400" />
                Contact Support Desk
              </a>
            </div>

            {/* Footer */}
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

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-4xl mx-auto my-8 p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-center space-y-4 font-sans">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              {this.props.fallbackTitle || "Training Module Temporarily Interrupted"}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              We encountered an issue loading this workout routine module. Your saved data, workouts, and athlete account are completely intact.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={this.handleRetry}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload Routine</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

