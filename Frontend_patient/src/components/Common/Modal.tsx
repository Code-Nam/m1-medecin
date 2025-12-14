import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    const { colors } = useTheme();

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="modal-title"
        >
            <div 
                className="relative w-full max-w-lg rounded-lg shadow-xl animate-in fade-in zoom-in duration-200"
                style={{ backgroundColor: colors.bg.card }}
            >
                <div 
                    className="flex items-center justify-between p-4 border-b"
                    style={{ borderColor: colors.border.default }}
                >
                    <h2 
                        id="modal-title" 
                        className="text-xl font-semibold"
                        style={{ color: colors.text.primary }}
                    >
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full transition-colors"
                        style={{ color: colors.text.muted }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = colors.text.secondary;
                            e.currentTarget.style.backgroundColor = colors.bg.secondary;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = colors.text.muted;
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        aria-label="Fermer"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};
