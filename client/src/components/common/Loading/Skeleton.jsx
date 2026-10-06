import React from 'react';

/**
 * Skeleton Component
 * Sleek content placeholder with realistic shimmer animation.
 *
 * @param {'text'|'rectangular'|'circular'|'rounded'} variant - Shape variant
 * @param {string|number} width - CSS width
 * @param {string|number} height - CSS height
 * @param {string} radius - Custom border-radius
 * @param {boolean} animate - Whether to apply the animated shimmer gradient
 * @param {string} className - Additional CSS class
 */
export const Skeleton = ({
  variant = 'text',
  width,
  height,
  radius,
  animate = true,
  className = '',
  style = {}
}) => {
  // Determine default height based on variant
  const getDefaultHeight = () => {
    switch (variant) {
      case 'text':
        return '1rem';
      case 'circular':
        return width || '40px';
      default:
        return '100px';
    }
  };

  // Determine border radius based on variant
  const getBorderRadius = () => {
    if (radius) return radius;
    switch (variant) {
      case 'circular':
        return '50%';
      case 'rounded':
        return 'var(--cb-radius-md)';
      case 'text':
        return 'var(--cb-radius-sm)';
      default:
        return 'var(--cb-radius-sm)';
    }
  };

  const computedWidth = width || (variant === 'circular' ? getDefaultHeight() : '100%');
  const computedHeight = height || getDefaultHeight();

  const shimmerBackground = animate
    ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.04) 25%, rgba(255, 255, 255, 0.12) 50%, rgba(255, 255, 255, 0.04) 75%)'
    : 'rgba(255, 255, 255, 0.06)';

  return (
    <div
      aria-hidden="true"
      className={`cb-skeleton ${className}`}
      style={{
        display: 'inline-block',
        width: typeof computedWidth === 'number' ? `${computedWidth}px` : computedWidth,
        height: typeof computedHeight === 'number' ? `${computedHeight}px` : computedHeight,
        borderRadius: getBorderRadius(),
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        backgroundImage: shimmerBackground,
        backgroundSize: '200% 100%',
        animation: animate ? 'cb-shimmer 1.8s infinite linear' : 'none',
        verticalAlign: 'middle',
        ...style
      }}
    />
  );
};

export default Skeleton;
