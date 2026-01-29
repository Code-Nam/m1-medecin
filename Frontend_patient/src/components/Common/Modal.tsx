import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { trapFocus, focusFirstElement } from '../../utils/focusTrap';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    description?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, description }) => {
    const { colors } = useTheme();
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement as HTMLElement;
            document.body.style.overflow = 'hidden';
            // Annoncer l'ouverture de la modale au lecteur d'écran
            document.body.setAttribute('aria-hidden', 'true');
            
            // Focus sur le premier élément focusable après un court délai
            setTimeout(() => {
                if (modalRef.current) {
                    focusFirstElement(modalRef.current);
                }
            }, 50);
        } else {
            document.body.style.overflow = 'unset';
            document.body.removeAttribute('aria-hidden');
            previousActiveElement.current?.focus();
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.body.removeAttribute('aria-hidden');
        };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen || !modalRef.current) return;

            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            } else if (e.key === 'Tab') {
                trapFocus(modalRef.current, e);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="modal-title"
            aria-describedby={description ? "modal-description" : undefined}
        >
            <div 
                ref={modalRef}
                className="relative w-full max-w-lg rounded-lg shadow-xl animate-in fade-in zoom-in duration-200"
                style={{ backgroundColor: colors.bg.card }}
                role="document"
                tabIndex={-1}
            >
                <div 
                    className="flex items-center justify-between p-4 border-b"
                    style={{ borderColor: colors.border.default }}
                >
                    <div className="flex-1">
                        <h2 
                            id="modal-title" 
                            className="text-xl font-semibold"
                            style={{ color: colors.text.primary }}
                        >
                            {title}
                        </h2>
                        {description && (
                            <p 
                                id="modal-description" 
                                className="text-sm mt-1"
                                style={{ color: colors.text.secondary }}
                            >
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        ref={closeButtonRef}
                        onClick={onClose}
                        className="p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{ 
                            color: colors.text.muted,
                            '--tw-ring-color': colors.accent.primary 
                        } as React.CSSProperties}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = colors.text.secondary;
                            e.currentTarget.style.backgroundColor = colors.bg.secondary;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = colors.text.muted;
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        aria-label="Fermer la fenêtre de dialogue"
                        type="button"
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                </div>
                <div className="p-6" role="region" aria-label="Contenu de la fenêtre">
                    {children}
                </div>
            </div>
        </div>
    );
};
