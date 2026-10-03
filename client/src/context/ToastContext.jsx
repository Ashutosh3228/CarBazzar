import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import ToastContainer from '../components/common/Toast/ToastContainer';

const ToastContext = createContext(null);

let toastCounter = 0;

/**
 * ToastProvider Component
 * Supplies global toast notification methods to entire application tree.
 *
 * @param {'top-right'|'top-left'|'bottom-right'|'bottom-left'|'top-center'|'bottom-center'} defaultPosition
 * @param {number} maxToasts - Maximum concurrent visible toasts
 */
export const ToastProvider = ({
  children,
  defaultPosition = 'top-right',
  maxToasts = 5
}) => {
  const [toasts, setToasts] = useState([]);
  const [position, setPosition] = useState(defaultPosition);

  // Dismiss a toast by id
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Clear all active toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Update an existing toast (e.g. For promise progression)
  const updateToast = useCallback((id, updates) => {
    setToasts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        return item;
      })
    );
  }, []);

  // Core add toast method
  const addToast = useCallback(
    (options = {}) => {
      const id = options.id || `cb-toast-${Date.now()}-${++toastCounter}`;
      const newToast = {
        id,
        type: options.type || 'info',
        title: options.title,
        message: typeof options === 'string' ? options : options.message,
        duration: options.duration !== undefined ? options.duration : 4500,
        action: options.action,
        dismissible: options.dismissible !== undefined ? options.dismissible : true
      };

      setToasts((prev) => {
        const filtered = prev.filter((item) => item.id !== id);
        const updated = [...filtered, newToast];
        if (updated.length > maxToasts) {
          return updated.slice(updated.length - maxToasts);
        }
        return updated;
      });

      return id;
    },
    [maxToasts]
  );

  // Convenience helper methods
  const toastHelpers = useMemo(() => {
    const handler = (messageOrOptions, options = {}) => {
      if (typeof messageOrOptions === 'string') {
        return addToast({ ...options, message: messageOrOptions });
      }
      return addToast(messageOrOptions);
    };

    handler.success = (message, options = {}) =>
      addToast({ ...options, type: 'success', message });

    handler.error = (message, options = {}) =>
      addToast({ ...options, type: 'error', message });

    handler.warning = (message, options = {}) =>
      addToast({ ...options, type: 'warning', message });

    handler.info = (message, options = {}) =>
      addToast({ ...options, type: 'info', message });

    handler.loading = (message, options = {}) =>
      addToast({ ...options, type: 'loading', message, duration: 0 });

    handler.promise = (promise, { loading, success, error }, options = {}) => {
      const id = addToast({
        ...options,
        type: 'loading',
        message: typeof loading === 'string' ? loading : loading?.message || 'Processing...',
        title: loading?.title,
        duration: 0
      });

      return promise
        .then((result) => {
          const successMsg =
            typeof success === 'function'
              ? success(result)
              : typeof success === 'string'
              ? success
              : success?.message || 'Action completed successfully';

          updateToast(id, {
            type: 'success',
            message: successMsg,
            title: success?.title || 'Success',
            duration: options.duration || 4500
          });
          return result;
        })
        .catch((err) => {
          const errorMsg =
            typeof error === 'function'
              ? error(err)
              : typeof error === 'string'
              ? error
              : error?.message || err?.message || 'An error occurred';

          updateToast(id, {
            type: 'error',
            message: errorMsg,
            title: error?.title || 'Error',
            duration: options.duration || 5000
          });
          throw err;
        });
    };

    handler.dismiss = dismissToast;
    handler.clear = clearToasts;

    return handler;
  }, [addToast, updateToast, dismissToast, clearToasts]);

  const contextValue = useMemo(
    () => ({
      toast: toastHelpers,
      toasts,
      dismissToast,
      clearToasts,
      position,
      setPosition
    }),
    [toastHelpers, toasts, dismissToast, clearToasts, position]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
        position={position}
      />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a <ToastProvider>');
  }
  return context;
};

export default ToastContext;
