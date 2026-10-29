import React, { Component, ErrorInfo, ReactNode } from 'react';
import { LostCompassIllustration } from './illustrations/TravelIllustrations';
import { RotateCcw, Home, Sparkles } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[PlanYours ErrorBoundary Caught]:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-background selection:bg-primary/20">
          <div className="max-w-md w-full text-center bg-card border border-border/80 rounded-2xl p-8 sm:p-10 shadow-warm">
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <LostCompassIllustration className="w-full h-full text-primary" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles size={12} />
              <span>Trail Recalibration</span>
            </div>

            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
              {this.props.fallbackTitle || 'Off the Beaten Path'}
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              {this.props.fallbackMessage ||
                'A brief disturbance in the itinerary occurred. Your preferences are preserved, and our backup trail is ready.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-warm hover:brightness-105 active:scale-95 transition-all"
              >
                <RotateCcw size={15} />
                <span>Resume Journey</span>
              </button>

              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border/90 bg-card hover:bg-muted text-foreground font-medium text-sm transition-all"
              >
                <Home size={15} />
                <span>Back to Home</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
