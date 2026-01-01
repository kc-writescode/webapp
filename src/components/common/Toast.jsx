/**
 * Toast Component
 * Displays toast notifications at bottom-center of screen
 */

import { useToast } from '@contexts/ToastContext';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const toastStyles = {
  success: {
    bg: 'bg-green-500/90',
    border: 'border-green-400',
    icon: CheckCircle,
    iconColor: 'text-green-100',
  },
  error: {
    bg: 'bg-red-500/90',
    border: 'border-red-400',
    icon: XCircle,
    iconColor: 'text-red-100',
  },
  warning: {
    bg: 'bg-yellow-500/90',
    border: 'border-yellow-400',
    icon: AlertTriangle,
    iconColor: 'text-yellow-100',
  },
  info: {
    bg: 'bg-blue-500/90',
    border: 'border-blue-400',
    icon: Info,
    iconColor: 'text-blue-100',
  },
};

const ToastItem = ({ toast, onDismiss }) => {
  const style = toastStyles[toast.type] || toastStyles.info;
  const Icon = style.icon;

  return (
    <div
      className={`
        ${style.bg} ${style.border}
        flex items-center gap-3 px-4 py-3 rounded-lg border
        shadow-lg backdrop-blur-sm
        animate-slide-up
        min-w-[280px] max-w-[400px]
      `}
      role="alert"
    >
      <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0`} />
      <p className="text-white text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-white/70 hover:text-white transition-colors flex-shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={dismissToast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
