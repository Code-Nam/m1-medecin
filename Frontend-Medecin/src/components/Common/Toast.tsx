import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useTheme } from '../../hooks/useTheme';

interface ToastItemProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ id, type, message, onClose }) => {
  const { darkMode, colors } = useTheme();
  
  const icons = {
    success: <CheckCircle className="w-5 h-5" style={{ color: darkMode ? '#4DB6AC' : '#43A78B' }} />,
    error: <XCircle className="w-5 h-5" style={{ color: darkMode ? '#EF5350' : '#E63946' }} />,
    warning: <AlertCircle className="w-5 h-5" style={{ color: darkMode ? '#FFD54F' : '#FFE082' }} />,
    info: <Info className="w-5 h-5" style={{ color: darkMode ? '#4DB6AC' : '#43A78B' }} />
  };

  const bgClasses = {
    success: darkMode ? 'bg-[rgba(77,182,172,0.2)] border-[rgba(77,182,172,0.5)]' : 'bg-[rgba(67,167,139,0.1)] border-[rgba(67,167,139,0.3)]',
    error: darkMode ? 'bg-[rgba(239,83,80,0.2)] border-[rgba(239,83,80,0.5)]' : 'bg-[rgba(230,57,70,0.1)] border-[rgba(230,57,70,0.3)]',
    warning: darkMode ? 'bg-[rgba(255,213,79,0.2)] border-[rgba(255,213,79,0.5)]' : 'bg-[rgba(255,224,130,0.2)] border-[rgba(255,224,130,0.4)]',
    info: darkMode ? 'bg-[rgba(77,182,172,0.2)] border-[rgba(77,182,172,0.5)]' : 'bg-[rgba(67,167,139,0.1)] border-[rgba(67,167,139,0.3)]'
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in ${bgClasses[type]}`}
    >
      <span aria-hidden="true">{icons[type]}</span>
      <p className="flex-1 text-sm font-medium text-gray-900 dark:text-white">
        {message}
      </p>
      <button
        onClick={() => onClose(id)}
        className="p-1 rounded transition-colors"
        style={{
          backgroundColor: 'transparent',
          color: colors.text.muted
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? colors.bg.card : colors.bg.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        aria-label="Fermer la notification"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer;

