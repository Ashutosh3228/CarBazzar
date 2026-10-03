import React, { Component } from 'react';
import ErrorState from './ErrorState';

/**
 * ErrorBoundary Component
 * Catches JavaScript rendering errors anywhere in child component tree.
 * Prevents full app crash by displaying a graceful automotive error fallback.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production, errors can also be forwarded to logging service like Sentry
    console.error('CarBazaar UI Runtime Exception caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback({
              error: this.state.error,
              resetError: this.handleReset
            })
          : this.props.fallback;
      }

      return (
        <div style={{ padding: '40px 20px', minHeight: '350px', display: 'flex', alignItems: 'center' }}>
          <ErrorState
            type="500"
            title="Application Interface Crash"
            description="A component encountered an unexpected runtime failure. The error has been captured safely to prevent data loss."
            errorCode="UI_RUNTIME_EXCEPTION"
            errorDetails={
              this.state.error?.stack ||
              (this.state.errorInfo?.componentStack
                ? `${this.state.error?.toString()}\nComponent Stack:${this.state.errorInfo.componentStack}`
                : this.state.error?.toString())
            }
            onRetry={this.handleReset}
            onHome={() => {
              window.location.href = '/';
            }}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
