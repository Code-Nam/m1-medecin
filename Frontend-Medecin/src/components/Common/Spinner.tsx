import React from 'react';
import { useTheme } from '../../hooks/useTheme';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const { darkMode } = useTheme();
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div
      role="status"
      aria-label="Chargement en cours"
      className={`${sizeClasses[size]} border-t-transparent rounded-full animate-spin ${className}`}
      style={{ borderColor: darkMode ? '#4DB6AC' : '#43A78B' }}
    >
      <span className="sr-only">Chargement en cours...</span>
    </div>
  );
};

// Full page spinner
export const PageSpinner: React.FC = () => {
  const { darkMode } = useTheme();
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
      style={{ backgroundColor: darkMode ? 'rgba(15, 15, 15, 0.8)' : 'rgba(255, 255, 255, 0.8)' }}
    >
      <Spinner size="lg" />
    </div>
  );
};

// Inline spinner for buttons or small areas
export const InlineSpinner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={`animate-spin h-5 w-5 text-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export default Spinner;

