import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "../common/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("Uncaught error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-coffee-50 dark:bg-coffee-950 p-4">
          <div className="max-w-md w-full bg-white dark:bg-coffee-900 rounded-2xl shadow-xl p-8 text-center border border-coffee-100 dark:border-coffee-800">
            <div className="w-16 h-16 bg-error/10 dark:bg-error/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-error" />
            </div>

            <h1 className="text-2xl font-bold text-coffee-900 dark:text-white mb-2">
              Something went wrong
            </h1>

            <p className="text-coffee-600 dark:text-coffee-300 mb-6">
              We apologize for the inconvenience. The application has
              encountered an unexpected error.
            </p>

            {this.state.error && (
              <div className="bg-error/10 dark:bg-error/20 p-4 rounded-lg text-left mb-6 overflow-auto max-h-40">
                <p className="text-xs font-mono text-error break-all mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre className="text-xs text-coffee-500 overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={this.handleGoHome}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
              <Button
                onClick={this.handleRetry}
                className="gap-2 bg-coffee-600 hover:bg-coffee-700 text-white"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to throw errors to boundary
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  if (error) {
    throw error;
  }

  return setError;
}

// Compact error fallback for smaller sections
export const CompactErrorFallback: React.FC<{ onRetry?: () => void }> = ({
  onRetry,
}) => (
  <div className="p-6 text-center bg-error/5 rounded-xl border border-error/20">
    <AlertTriangle className="w-8 h-8 text-error mx-auto mb-3" />
    <p className="text-coffee-900 dark:text-white font-medium mb-2">
      Failed to load
    </p>
    <p className="text-sm text-coffee-500 dark:text-coffee-400 mb-4">
      Something went wrong while loading this section.
    </p>
    {onRetry && (
      <Button size="sm" variant="outline" onClick={onRetry} className="gap-2">
        <RefreshCw className="w-3 h-3" />
        Retry
      </Button>
    )}
  </div>
);
