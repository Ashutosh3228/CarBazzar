import React, { useState } from 'react';
import {
  WifiOff,
  FileX,
  ShieldAlert,
  ServerCrash,
  AlertTriangle,
  RotateCcw,
  Home,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react';
import Button from '../Loading/Button';

/**
 * ErrorState Component
 * Displays clear, professional error messages with recovery options and debugging details.
 *
 * @param {'network'|'404'|'403'|'500'|'generic'} type - Error classification preset
 * @param {string} title - Main error title
 * @param {string} description - User-facing description
 * @param {string|number} errorCode - Optional HTTP/Internal error code
 * @param {string|Error} errorDetails - Stack trace or raw error message
 * @param {Function} onRetry - Callback when user clicks 'Try Again'
 * @param {Function} onHome - Callback when user clicks 'Back to Home'
 * @param {Function} onBack - Callback when user clicks 'Go Back'
 * @param {boolean} compact - Compact variant for widget embedding
 */
export const ErrorState = ({
  type = 'generic',
  title,
  description,
  errorCode,
  errorDetails,
  onRetry,
  onHome,
  onBack,
  compact = false,
  className = '',
  style = {}
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  // Preset definitions
  const presets = {
    network: {
      icon: <WifiOff size={compact ? 28 : 44} strokeWidth={1.5} />,
      title: 'Connection Disconnected',
      description: 'Unable to reach the CarBazaar server. Please verify your internet connection and attempt to reconnect.',
      code: 'ERR_NETWORK',
      color: 'var(--cb-warning)'
    },
    404: {
      icon: <FileX size={compact ? 28 : 44} strokeWidth={1.5} />,
      title: 'Vehicle or Page Not Found',
      description: 'The car listing or page you requested could not be located. It may have been sold or recently taken down.',
      code: '404',
      color: 'var(--cb-info)'
    },
    403: {
      icon: <ShieldAlert size={compact ? 28 : 44} strokeWidth={1.5} />,
      title: 'Access Restricted',
      description: 'You do not have the necessary permissions to access this seller resource or admin module.',
      code: '403',
      color: 'var(--cb-error)'
    },
    500: {
      icon: <ServerCrash size={compact ? 28 : 44} strokeWidth={1.5} />,
      title: 'Internal System Failure',
      description: 'The CarBazaar marketplace engine encountered an unexpected error while processing your request.',
      code: '500',
      color: 'var(--cb-error)'
    },
    generic: {
      icon: <AlertTriangle size={compact ? 28 : 44} strokeWidth={1.5} />,
      title: 'Something Went Wrong',
      description: 'An unexpected issue occurred while updating the interface. Please retry or return to safety.',
      code: 'ERR_UNKNOWN',
      color: 'var(--cb-error)'
    }
  };

  const preset = presets[type] || presets.generic;
  const displayTitle = title || preset.title;
  const displayDesc = description || preset.description;
  const displayCode = errorCode || preset.code;
  const errorColor = preset.color || 'var(--cb-error)';

  const formattedDetails = errorDetails
    ? typeof errorDetails === 'object'
      ? errorDetails.stack || errorDetails.message || JSON.stringify(errorDetails, null, 2)
      : String(errorDetails)
    : null;

  const handleCopy = () => {
    if (formattedDetails) {
      navigator.clipboard.writeText(formattedDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`cb-error-state ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: compact ? '24px 18px' : '52px 28px',
        backgroundColor: 'var(--cb-bg-card)',
        borderRadius: 'var(--cb-radius-lg)',
        border: '1px solid var(--cb-border-subtle)',
        maxWidth: compact ? '100%' : '600px',
        margin: '0 auto',
        boxShadow: 'var(--cb-shadow-lg)',
        position: 'relative',
        animation: 'cb-fade-in 250ms ease-out',
        ...style
      }}
    >
      {/* Error Badge with Glow */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: compact ? '52px' : '84px',
          height: compact ? '52px' : '84px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: `1px solid ${errorColor}`,
          color: errorColor,
          marginBottom: compact ? '14px' : '20px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            backgroundColor: errorColor,
            opacity: 0.15,
            filter: 'blur(14px)'
          }}
        />
        {preset.icon}
      </div>

      {/* Error Code Pill */}
      {displayCode && (
        <span
          style={{
            display: 'inline-block',
            padding: '3px 10px',
            fontSize: '0.75rem',
            fontFamily: 'var(--cb-font-mono)',
            fontWeight: 600,
            borderRadius: 'var(--cb-radius-full)',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            color: 'var(--cb-text-secondary)',
            marginBottom: '10px',
            border: '1px solid var(--cb-border-subtle)'
          }}
        >
          {displayCode}
        </span>
      )}

      {/* Title */}
      <h3
        style={{
          fontSize: compact ? '1.1rem' : '1.4rem',
          fontWeight: 700,
          color: 'var(--cb-text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '8px'
        }}
      >
        {displayTitle}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: compact ? '0.85rem' : '0.95rem',
          color: 'var(--cb-text-secondary)',
          lineHeight: 1.55,
          maxWidth: '460px',
          marginBottom: onRetry || onHome || onBack ? (compact ? '18px' : '26px') : '12px'
        }}
      >
        {displayDesc}
      </p>

      {/* Action Buttons */}
      {(onRetry || onHome || onBack) && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: formattedDetails ? '16px' : '0'
          }}
        >
          {onRetry && (
            <Button
              size={compact ? 'sm' : 'md'}
              variant="primary"
              icon={<RotateCcw size={16} />}
              onClick={onRetry}
            >
              Try Again
            </Button>
          )}

          {onHome && (
            <Button
              size={compact ? 'sm' : 'md'}
              variant="outline"
              icon={<Home size={16} />}
              onClick={onHome}
            >
              Back to Home
            </Button>
          )}

          {onBack && !onHome && (
            <Button
              size={compact ? 'sm' : 'md'}
              variant="ghost"
              onClick={onBack}
            >
              Go Back
            </Button>
          )}
        </div>
      )}

      {/* Developer Error Details Accordion */}
      {formattedDetails && (
        <div style={{ width: '100%', marginTop: '12px', textAlign: 'left' }}>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '8px 12px',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--cb-border-subtle)',
              borderRadius: 'var(--cb-radius-sm)',
              color: 'var(--cb-text-muted)',
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            <span>Technical Diagnostics ({showDetails ? 'Hide' : 'Show'})</span>
            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showDetails && (
            <div
              style={{
                position: 'relative',
                marginTop: '8px',
                padding: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                borderRadius: 'var(--cb-radius-sm)',
                border: '1px solid var(--cb-border-subtle)',
                overflowX: 'auto',
                maxHeight: '160px'
              }}
            >
              <button
                type="button"
                onClick={handleCopy}
                title="Copy error details"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--cb-radius-sm)',
                  color: 'var(--cb-text-secondary)',
                  fontSize: '0.75rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {copied ? <Check size={12} color="var(--cb-success)" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <pre
                style={{
                  fontFamily: 'var(--cb-font-mono)',
                  fontSize: '0.75rem',
                  color: '#F87171',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {formattedDetails}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ErrorState;
