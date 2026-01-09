import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    loadingText?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, loadingText, type = 'button', ...props }, ref) => {
        const { darkMode, colors } = useTheme();
        
        const isDisabled = disabled || isLoading;

        const getVariantStyles = () => {
            switch (variant) {
                case 'primary':
                    return { 
                        bg: colors.accent.primary, 
                        text: '#FFFFFF', 
                        hoverBg: colors.accent.hover,
                        focusRing: colors.accent.primary
                    };
                case 'secondary':
                    return { 
                        bg: darkMode ? colors.border.light : '#E0E0E0', 
                        text: colors.text.primary, 
                        hoverBg: darkMode ? colors.border.default : '#D0D0D0',
                        focusRing: colors.text.secondary
                    };
                case 'danger':
                    return { 
                        bg: colors.semantic.danger, 
                        text: '#FFFFFF', 
                        hoverBg: darkMode ? colors.accent.accent2 : '#C62828',
                        focusRing: colors.semantic.danger
                    };
                case 'ghost':
                    return { 
                        bg: 'transparent', 
                        text: colors.text.secondary, 
                        hoverBg: darkMode ? colors.bg.card : colors.bg.primary,
                        focusRing: colors.text.secondary
                    };
                case 'outline':
                    return { 
                        bg: 'transparent', 
                        text: colors.accent.primary, 
                        hoverBg: darkMode ? 'rgba(77, 182, 172, 0.2)' : 'rgba(67, 167, 139, 0.1)',
                        border: colors.accent.primary,
                        focusRing: colors.accent.primary
                    };
                default:
                    return { 
                        bg: colors.accent.primary, 
                        text: '#FFFFFF', 
                        hoverBg: colors.accent.hover,
                        focusRing: colors.accent.primary
                    };
            }
        };

        const variantStyles = getVariantStyles();
        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg',
        };

        return (
            <button
                ref={ref}
                type={type}
                className={cn(
                    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
                    sizes[size],
                    className
                )}
                style={{
                    backgroundColor: variantStyles.bg,
                    color: variantStyles.text,
                    border: variant === 'outline' ? `1px solid ${variantStyles.border}` : 'none',
                    '--tw-ring-color': variantStyles.focusRing
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
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        <span className="sr-only">Chargement en cours</span>
                    </>
                ) : leftIcon ? (
                    <span className="mr-2" aria-hidden="true">{leftIcon}</span>
                ) : null}
                <span>{isLoading && loadingText ? loadingText : children}</span>
                {!isLoading && rightIcon && <span className="ml-2" aria-hidden="true">{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = 'Button';
