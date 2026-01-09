import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface LoadingProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Chargement en cours', size = 'md' }) => {
    const { colors } = useTheme();
    
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div 
            className="flex items-center justify-center p-8"
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <Loader2 
                className={`${sizeClasses[size]} animate-spin`}
                style={{ color: colors.accent.primary }}
                aria-hidden="true"
            />
            <span className="sr-only">{message}...</span>
        </div>
    );
};
