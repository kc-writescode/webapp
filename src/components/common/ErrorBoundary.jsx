/**
 * ErrorBoundary Component
 * Catches JavaScript errors in child component tree and displays fallback UI
 */

import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });

    // You could also log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="mx-auto w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-white mb-2">
              Something went wrong
            </h1>

            {/* Error Description */}
            <p className="text-slate-400 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page or go back to the home page.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
              >
                <Home className="w-5 h-5" />
                Go Home
              </button>
            </div>

            {/* Error Details (Development Only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mt-8 text-left">
                <details className="bg-slate-800 rounded-lg p-4">
                  <summary className="text-slate-300 cursor-pointer font-medium mb-2">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs text-red-400 overflow-auto max-h-40 mt-2">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="text-xs text-slate-500 overflow-auto max-h-40 mt-2">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </details>
              </div>
            )}

            {/* Report Issue Link */}
            <p className="mt-6 text-sm text-slate-500">
              If this problem persists, please{' '}
              <a
                href="https://github.com/kc-writescode/webapp/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                report the issue
              </a>
              .
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
