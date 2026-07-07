"use client";

import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
  message?: string;
}

/**
 * Generic React Error Boundary. Used to wrap canvas / 3D / particle
 * components so a runtime failure never blanks the whole page — it
 * renders a graceful fallback instead.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    console.error("[KRITAM ErrorBoundary]", this.props.label ?? "", error.message);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return <>{this.props.fallback}</>;
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-amber-400" />
          <p className="text-sm font-medium">Visual module unavailable</p>
          <p className="max-w-xs text-xs text-muted-foreground">
            {this.props.label ?? "This component"} could not initialise on your
            device. The rest of KRITAM OS continues to run.
          </p>
          <button
            onClick={this.handleReset}
            className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/40 px-3 py-1.5 text-xs font-semibold hover:bg-accent/50"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
