import React from 'react';

/**
 * Spinner Component
 * Automotive styled spinning indicator with dual-tone ring and optional glow.
 *
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|number} size - Size of the spinner
 * @param {'primary'|'cyan'|'white'|'success'|'danger'|'muted'} variant - Color variant
 * @param {string} label - Accessible label for screen readers
 * @param {string} className - Optional additional CSS class
 * @param {boolean} glow - Whether to display a subtle pulse glow
 */
export const Spinner = ({
  size = 'md',
  variant = 'primary',
  label = 'Loading...',
  className = '',
  glow = false,
  style = {}
}) => {
  const sizeMap = {
    xs: 14,
    sm: 18,
    md: 26,
    lg: 38,
    xl: 52
  };

  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || 26;

  const colorMap = {
    primary: {
      track: 'rgba(37, 99, 235, 0.15)',
      active: '#2563EB',
      glow: 'rgba(37, 99, 235, 0.4)'
    },
    cyan: {
      track: 'rgba(6, 182, 212, 0.15)',
      active: '#06B6D4',
      glow: 'rgba(6, 182, 212, 0.4)'
    },
    white: {
      track: 'rgba(255, 255, 255, 0.2)',
      active: '#FFFFFF',
      glow: 'rgba(255, 255, 255, 0.3)'
    },
    success: {
      track: 'rgba(16, 185, 129, 0.15)',
      active: '#10B981',
      glow: 'rgba(16, 185, 129, 0.4)'
    },
    danger: {
      track: 'rgba(239, 68, 68, 0.15)',
      active: '#EF4444',
      glow: 'rgba(239, 68, 68, 0.4)'
    },
    muted: {
      track: 'rgba(148, 163, 184, 0.15)',
      active: '#94A3B8',
      glow: 'rgba(148, 163, 184, 0.3)'
    }
  };

  const colors = colorMap[variant] || colorMap.primary;
  const strokeWidth = pixelSize <= 18 ? 3 : pixelSize <= 38 ? 3.5 : 4;
  const radius = (pixelSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${circumference * 0.7} ${circumference * 0.3}`;

  return (
    <div
      role="status"
      aria-label={label}
      className={`cb-spinner-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: pixelSize,
        height: pixelSize,
        ...style
      }}
    >
      {glow && (
        <div
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            background: colors.glow,
            filter: 'blur(8px)',
            opacity: 0.6,
            animation: 'cb-pulse-glow 2s ease-in-out infinite'
          }}
        />
      )}
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox={`0 0 ${pixelSize} ${pixelSize}`}
        style={{
          animation: 'cb-spin 0.85s linear infinite',
          transformOrigin: 'center center',
          display: 'block'
        }}
      >
        {/* Track circle */}
        <circle
          cx={pixelSize / 2}
          cy={pixelSize / 2}
          r={radius}
          fill="none"
          stroke={colors.track}
          strokeWidth={strokeWidth}
        />
        {/* Active spinning arc */}
        <circle
          cx={pixelSize / 2}
          cy={pixelSize / 2}
          r={radius}
          fill="none"
          stroke={colors.active}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
        />
      </svg>
      <span
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0
        }}
      >
        {label}
      </span>
    </div>
  );
};

export default Spinner;
