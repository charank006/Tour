import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  title?: string;
  className?: string;
}

interface State {
  hasError: boolean;
}

export class SectionErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[SectionErrorBoundary Caught]:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className={`p-6 rounded-2xl border border-dashed border-border/80 bg-muted/30 text-center ${
            this.props.className || ''
          }`}
        >
          <div className="w-9 h-9 mx-auto mb-3 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <AlertCircle size={18} />
          </div>
          <h4 className="font-serif-display font-semibold text-foreground text-sm mb-1">
            {this.props.title || 'Section Temporarily Unavailable'}
          </h4>
          <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
            This module could not render. The rest of your itinerary remains unaffected.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
          >
            <RotateCcw size={12} />
            <span>Try loading section again</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SectionErrorBoundary;
