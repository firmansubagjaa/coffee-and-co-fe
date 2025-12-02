import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-coffee-50 dark:bg-coffee-950 p-4">
          <div className="max-w-md w-full bg-white dark:bg-coffee-900 rounded-2xl shadow-xl p-8 text-center border border-coffee-100 dark:border-coffee-800">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-coffee-900 dark:text-white mb-2">
              Something went wrong
            </h1>
            
            <p className="text-coffee-600 dark:text-coffee-300 mb-6">
              We apologize for the inconvenience. The application has encountered an unexpected error.
            </p>

            {this.state.error && (
              <div className="bg-red-50 dark:bg-red-950/50 p-4 rounded-lg text-left mb-6 overflow-auto max-h-40">
                <p className="text-xs font-mono text-red-800 dark:text-red-300 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => window.location.reload()}
                className="gap-2 bg-coffee-600 hover:bg-coffee-700 text-white"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Application
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
