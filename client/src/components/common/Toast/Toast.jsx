import React, { useEffect, useState, useRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import Spinner from '../Loading/Spinner';

/**
 * Toast Item Component
 * Sleek automotive toast notification with animated countdown bar,
 * icon badge, pause-on-hover, action support, and exit animation.
 */
export const Toast = ({
  id,
  type = 'info',
  title,
  message,
  duration = 4500,
  action,
  dismissible = true,
  onDismiss,
  position = 'top-right'
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const remainingTimeRef = useRef(duration);
  const lastTickRef = useRef(Date.now());

  const isPersistent = duration === 0 || type === 'loading';

  // Preset definitions
  const typeConfig = {
    success: {
      icon: <CheckCircle2 size={20} color="var(--cb-success)" strokeWidth={2.2} />,
      borderColor: 'var(--cb-success)',
      barColor: 'var(--cb-success)',
      accentBg: 'rgba(16, 185, 129, 0.1)',
      defaultTitle: 'Success'
    },
    error: {
      icon: <AlertCircle size={20} color="var(--cb-error)" strokeWidth={2.2} />,
      borderColor: 'var(--cb-error)',
      barColor: 'var(--cb-error)',
      accentBg: 'rgba(239, 68, 68, 0.1)',
      defaultTitle: 'Error'
    },
    warning: {
      icon: <AlertTriangle size={20} color="var(--cb-warning)" strokeWidth={2.2} />,
      borderColor: 'var(--cb-warning)',
      barColor: 'var(--cb-warning)',
      accentBg: 'rgba(245, 158, 11, 0.1)',
      defaultTitle: 'Warning'
    },
    info: {
      icon: <Info size={20} color="var(--cb-info)" strokeWidth={2.2} />,
      borderColor: 'var(--cb-info)',
      barColor: 'var(--cb-info)',
      accentBg: 'rgba(59, 130, 246, 0.1)',
      defaultTitle: 'Information'
    },
    loading: {
      icon: <Spinner size="sm" variant="cyan" />,
      borderColor: 'var(--cb-cyan)',
      barColor: 'var(--cb-cyan)',
      accentBg: 'rgba(6, 182, 212, 0.1)',
      defaultTitle: 'Processing'
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const displayTitle = title !== undefined ? title : (!message ? config.defaultTitle : null);
  const displayMessage = message || (title !== undefined ? null : config.defaultTitle);

  // Auto-dismiss countdown timer
  useEffect(() => {
    if (isPersistent || isExiting) return;

    lastTickRef.current = Date.now();

    const interval = setInterval(() => {
      if (!isPaused) {
        const now = Date.now();
        const elapsed = now - lastTickRef.current;
        remainingTimeRef.current -= elapsed;
        lastTickRef.current = now;

        const percentage = Math.max(0, (remainingTimeRef.current / duration) * 100);
        setProgress(percentage);

        if (remainingTimeRef.current <= 0) {
          clearInterval(interval);
          triggerExit();
        }
      } else {
        lastTickRef.current = Date.now();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isPaused, isPersistent, duration, isExiting]);

  const triggerExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(id);
    }, 280);
  };

  // Determine enter animation according to container position
  const getAnimation = () => {
    if (isExiting) {
      return 'cb-toast-exit-right 280ms forwards cubic-bezier(0.4, 0, 0.2, 1)';
    }
    if (position.includes('left')) {
      return 'cb-toast-enter-left 320ms cubic-bezier(0.16, 1, 0.3, 1)';
    }
    if (position.includes('top')) {
      return 'cb-toast-enter-top 320ms cubic-bezier(0.16, 1, 0.3, 1)';
    }
    if (position.includes('bottom')) {
      return 'cb-toast-enter-bottom 320ms cubic-bezier(0.16, 1, 0.3, 1)';
    }
    return 'cb-toast-enter-right 320ms cubic-bezier(0.16, 1, 0.3, 1)';
  };

  return (
    <div
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="cb-toast-item"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        minWidth: '320px',
        maxWidth: '420px',
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--cb-border-medium)',
        borderLeft: `4px solid ${config.borderColor}`,
        borderRadius: 'var(--cb-radius-md)',
        boxShadow: 'var(--cb-shadow-toast)',
        overflow: 'hidden',
        pointerEvents: 'auto',
        animation: getAnimation(),
        transition: 'all var(--cb-transition-fast)',
        marginBottom: '10px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', padding: '14px 16px', gap: '12px' }}>
        {/* Type Icon Badge */}
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--cb-radius-sm)',
            backgroundColor: config.accentBg,
            marginTop: '1px'
          }}
        >
          {config.icon}
        </div>

        {/* Text Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {displayTitle && (
            <h5
              style={{
                fontSize: '0.925rem',
                fontWeight: 600,
                color: 'var(--cb-text-primary)',
                margin: 0,
                lineHeight: 1.3
              }}
            >
              {displayTitle}
            </h5>
          )}

          {displayMessage && (
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--cb-text-secondary)',
                marginTop: displayTitle ? '4px' : '0',
                lineHeight: 1.45,
                wordBreak: 'break-word'
              }}
            >
              {displayMessage}
            </p>
          )}

          {/* Action Button */}
          {action && (
            <div style={{ marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  action.onClick?.();
                  if (action.dismissOnClick !== false) {
                    triggerExit();
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 10px',
                  fontSize: '0.775rem',
                  fontWeight: 600,
                  color: 'var(--cb-text-primary)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--cb-radius-sm)',
                  border: '1px solid var(--cb-border-subtle)',
                  cursor: 'pointer',
                  transition: 'background var(--cb-transition-fast)'
                }}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={triggerExit}
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              padding: 0,
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: 'var(--cb-radius-sm)',
              color: 'var(--cb-text-muted)',
              cursor: 'pointer',
              transition: 'color var(--cb-transition-fast), background var(--cb-transition-fast)'
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Countdown Progress Bar */}
      {!isPersistent && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2.5px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: config.barColor,
              opacity: 0.8,
              transition: isPaused ? 'none' : 'width 50ms linear'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Toast;
