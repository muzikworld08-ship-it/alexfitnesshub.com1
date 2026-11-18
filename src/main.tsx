import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface RootBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<{ children: ReactNode }, RootBoundaryState> {
  state: RootBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): RootBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[RootErrorBoundary] Uncaught render failure:', error, info);
  }

  private handleSoftRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleReload = () => {
    try {
      sessionStorage.removeItem('afh_stale_chunk_reload');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b', color: '#f8fafc', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <div style={{ maxWidth: '480px', width: '100%', background: '#18181b', border: '1px solid #27272a', borderRadius: '20px', padding: '32px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(211,47,47,0.15)', border: '1px solid rgba(211,47,47,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px' }}>Unable to Load View</h1>
            <p style={{ fontSize: '14px', color: '#a1a1aa', margin: '0 0 24px', lineHeight: 1.5 }}>
              Your saved workouts and progress are safe. Try restoring the view or reloading the page.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={this.handleSoftRetry}
                style={{ padding: '12px 20px', borderRadius: '12px', border: 'none', background: '#dc2626', color: '#ffffff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #3f3f46', background: '#27272a', color: '#f4f4f5', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    </StrictMode>,
  );
}
