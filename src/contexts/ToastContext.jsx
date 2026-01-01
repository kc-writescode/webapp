/**
 * Toast Context
 * Global toast notification system for user feedback
 */

import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ type = 'info', message, duration = 4000 }) => {
    const id = Date.now() + Math.random();

    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }

    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Convenience methods
  const success = useCallback((message, duration) => {
    return showToast({ type: 'success', message, duration });
  }, [showToast]);

  const error = useCallback((message, duration) => {
    return showToast({ type: 'error', message, duration });
  }, [showToast]);

  const warning = useCallback((message, duration) => {
    return showToast({ type: 'warning', message, duration });
  }, [showToast]);

  const info = useCallback((message, duration) => {
    return showToast({ type: 'info', message, duration });
  }, [showToast]);

  const value = {
    toasts,
    showToast,
    dismissToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContext;
