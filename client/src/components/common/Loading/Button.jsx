import React from 'react';
import Spinner from './Spinner';

/**
 * Button Component with Loading State
 * Automotive styled button supporting inline loading indicators, icons, and variants.
 *
 * @param {boolean} isLoading - Shows spinner and disables interaction
 * @param {string} loadingText - Optional text to show during loading
 * @param {'primary'|'secondary'|'cyan'|'outline'|'danger'|'ghost'} variant - Visual style
 * @param {'sm'|'md'|'lg'} size - Button size
 * @param {React.ReactNode} icon - Optional icon element
 * @param {'left'|'right'} iconPosition - Icon position
 * @param {boolean} disabled - Standard disabled state
 * @param {React.ReactNode} children - Button label/content
 */
export const Button = ({
  isLoading = false,
  loadingText,
  variant = 'primary',
  size = 'md',
  icon = null,
  iconPosition = 'left',
  disabled = false,
  children,
  className = '',
  style = {},
  onClick,
  type = 'button',
  ...props
}) => {
  const sizeStyles = {
    sm: {
      padding: '7px 14px',
      fontSize: '0.8125rem',
      borderRadius: 'var(--cb-radius-sm)',
      gap: '6px',
      spinnerSize: 'xs'
    },
    md: {
      padding: '10px 18px',
      fontSize: '0.9375rem',
      borderRadius: 'var(--cb-radius-md)',
      gap: '8px',
      spinnerSize: 'sm'
    },
    lg: {
      padding: '13px 26px',
      fontSize: '1.05rem',
      borderRadius: 'var(--cb-radius-md)',
      gap: '10px',
      spinnerSize: 'md'
    }
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--cb-primary)',
      color: '#FFFFFF',
      border: '1px solid transparent',
      boxShadow: '0 2px 8px var(--cb-primary-glow)'
    },
    secondary: {
      backgroundColor: 'var(--cb-bg-card)',
      color: 'var(--cb-text-primary)',
      border: '1px solid var(--cb-border-medium)',
      boxShadow: 'var(--cb-shadow-sm)'
    },
    cyan: {
      backgroundColor: 'var(--cb-cyan)',
      color: '#0B0F19',
      fontWeight: 700,
      border: '1px solid transparent',
      boxShadow: '0 2px 8px rgba(6, 182, 212, 0.35)'
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--cb-text-primary)',
      border: '1px solid var(--cb-border-medium)'
    },
    danger: {
      backgroundColor: 'var(--cb-error)',
      color: '#FFFFFF',
      border: '1px solid transparent',
      boxShadow: '0 2px 8px var(--cb-error-bg)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--cb-text-secondary)',
      border: '1px solid transparent'
    }
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;
  const currentVariant = variantStyles[variant] || variantStyles.primary;
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      className={`cb-button ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontFamily: 'var(--cb-font-body)',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.72 : 1,
        transition: 'all var(--cb-transition-fast)',
        position: 'relative',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        ...currentSize,
        ...currentVariant,
        ...style
      }}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner
            size={currentSize.spinnerSize}
            variant={variant === 'cyan' ? 'muted' : 'white'}
          />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span style={{ display: 'inline-flex' }}>{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span style={{ display: 'inline-flex' }}>{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
