import React from 'react';
import Spinner from './Spinner';

/**
 * LoadingOverlay Component
 * Glassmorphic overlay for asynchronous loading operations.
 * Can be used as a container overlay or full-screen modal overlay.
 *
 * @param {boolean} show - Whether the overlay is active
 * @param {string} message - Primary loading headline
 * @param {string} subMessage - Secondary contextual status
 * @param {boolean} fullScreen - Whether overlay covers entire viewport
 * @param {boolean} blur - Whether to apply backdrop blur
 * @param {string} spinnerSize - 'sm'|'md'|'lg'|'xl'
 * @param {string} spinnerVariant - 'primary'|'cyan'|'white'
 * @param {React.ReactNode} children - Optional wrapped content
 */
export const LoadingOverlay = ({
  show = true,
  message = 'Loading...',
  subMessage = '',
  fullScreen = false,
  blur = true,
  spinnerSize = 'lg',
  spinnerVariant = 'primary',
  children = null,
  className = ''
}) => {
  if (!show && !children) return null;

  const overlayContent = show ? (
    <div
      role="alert"
      aria-busy="true"
      className={`cb-loading-overlay ${className}`}
      style={{
        position: fullScreen ? 'fixed' : 'absolute',
        inset: 0,
        zIndex: fullScreen ? 9999 : 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(11, 15, 25, 0.78)',
        backdropFilter: blur ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: blur ? 'blur(10px)' : 'none',
        padding: '24px',
        animation: 'cb-fade-in 200ms ease-out',
        userSelect: 'none'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '360px',
          textAlign: 'center',
          padding: '28px 32px',
          borderRadius: 'var(--cb-radius-lg)',
          backgroundColor: 'rgba(30, 41, 59, 0.75)',
          border: '1px solid var(--cb-border-subtle)',
          boxShadow: 'var(--cb-shadow-xl)',
          animation: 'cb-scale-up 220ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <Spinner size={spinnerSize} variant={spinnerVariant} glow />

        {message && (
          <h4
            style={{
              marginTop: '16px',
              fontSize: '1.05rem',
              fontWeight: 600,
              color: 'var(--cb-text-primary)',
              letterSpacing: '-0.01em'
            }}
          >
            {message}
          </h4>
        )}

        {subMessage && (
          <p
            style={{
              marginTop: '6px',
              fontSize: '0.875rem',
              color: 'var(--cb-text-secondary)',
              lineHeight: 1.45
            }}
          >
            {subMessage}
          </p>
        )}
      </div>
    </div>
  ) : null;

  if (children) {
    return (
      <div style={{ position: 'relative', width: '100%', minHeight: show ? '120px' : 'auto' }}>
        {children}
        {overlayContent}
      </div>
    );
  }

  return overlayContent;
};

export default LoadingOverlay;
