import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  loadingText?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  loadingText,
  type = 'button',
  ...props
}) => {
  const { darkMode, colors } = useTheme();
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const isDisabled = disabled || isLoading;

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { bg: colors.accent.primary, text: '#FFFFFF', hoverBg: colors.accent.hover };
      case 'secondary':
        return { bg: darkMode ? colors.border.light : '#F3F4F6', text: colors.text.primary, hoverBg: darkMode ? colors.border.default : '#E5E7EB' };
      case 'danger':
        return { bg: colors.semantic.danger, text: '#FFFFFF', hoverBg: darkMode ? '#D32F2F' : '#C62828' };
      case 'ghost':
        return { bg: 'transparent', text: colors.text.secondary, hoverBg: darkMode ? colors.bg.card : '#F3F4F6' };
      case 'outline':
        return { bg: 'transparent', text: colors.accent.primary, hoverBg: darkMode ? 'rgba(77, 182, 172, 0.2)' : 'rgba(67, 167, 139, 0.1)', border: colors.accent.primary };
      default:
        return { bg: colors.accent.primary, text: '#FFFFFF', hoverBg: colors.accent.hover };
    }
  };

  const variantStyles = getVariantStyles();

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2'
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: variantStyles.bg,
        color: variantStyles.text,
        border: variant === 'outline' ? `2px solid ${variantStyles.border}` : 'none',
        '--tw-ring-color': variantStyles.hoverBg
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.backgroundColor = variantStyles.hoverBg || variantStyles.bg;
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.backgroundColor = variantStyles.bg;
        }
      }}
      disabled={isDisabled}
      aria-busy={isLoading}
      aria-disabled={isDisabled}
      aria-live={isLoading ? "polite" : undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          <span className="sr-only">Chargement en cours</span>
        </>
      ) : leftIcon ? (
        <span aria-hidden="true">{leftIcon}</span>
      ) : null}
      <span>{isLoading && loadingText ? loadingText : children}</span>
      {!isLoading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
    </button>
  );
};

export default Button;

