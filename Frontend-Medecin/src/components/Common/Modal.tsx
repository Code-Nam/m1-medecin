import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { trapFocus, focusFirstElement } from '../../utils/focusTrap';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  description?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  description
}) => {
  const { colors, darkMode } = useTheme();
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

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative w-full ${sizeClasses[size]} mx-4 rounded-xl shadow-2xl transform transition-all animate-modal-enter`}
        style={{
          backgroundColor: colors.bg.secondary
        }}
        role="document"
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: colors.border.default }}
        >
          <div className="flex-1">
            <h2
              id="modal-title"
              className="text-lg font-semibold"
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
            className="p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ 
              color: colors.text.muted,
              '--tw-ring-color': colors.accent.primary 
            } as React.CSSProperties}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? colors.bg.card : '#F3F4F6';
              e.currentTarget.style.color = colors.text.secondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.text.muted;
            }}
            aria-label="Fermer la fenêtre de dialogue"
            type="button"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto" role="region" aria-label="Contenu de la fenêtre">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

