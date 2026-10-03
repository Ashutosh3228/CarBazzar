import React from 'react';
import Toast from './Toast';

/**
 * ToastContainer Component
 * Viewport fixed overlay that positions and stacks active toast notifications.
 */
export const ToastContainer = ({
  toasts = [],
  onDismiss,
  position = 'top-right'
}) => {
  if (!toasts || toasts.length === 0) return null;

  const getPositionStyles = () => {
    const base = {
      position: 'fixed',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      pointerEvents: 'none',
      maxHeight: '100vh',
      overflow: 'hidden'
    };

    switch (position) {
      case 'top-left':
        return {
          ...base,
          top: 0,
          left: 0,
          alignItems: 'flex-start'
        };
      case 'top-center':
        return {
          ...base,
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          alignItems: 'center'
        };
      case 'bottom-right':
        return {
          ...base,
          bottom: 0,
          right: 0,
          alignItems: 'flex-end',
          flexDirection: 'column-reverse'
        };
      case 'bottom-left':
        return {
          ...base,
          bottom: 0,
          left: 0,
          alignItems: 'flex-start',
          flexDirection: 'column-reverse'
        };
      case 'bottom-center':
        return {
          ...base,
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          alignItems: 'center',
          flexDirection: 'column-reverse'
        };
      case 'top-right':
      default:
        return {
          ...base,
          top: 0,
          right: 0,
          alignItems: 'flex-end'
        };
    }
  };

  return (
    <div
      aria-live="polite"
      className={`cb-toast-container cb-toast-${position}`}
      style={getPositionStyles()}
    >
      {toasts.map((item) => (
        <Toast
          key={item.id}
          {...item}
          position={position}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
