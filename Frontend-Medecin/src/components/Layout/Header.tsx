import React, { useState, useEffect } from 'react';
import { Sun, Moon, Bell, ChevronRight, Menu } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAppointmentStore } from '../../stores/appointmentStore';
import { useDoctor } from '../../stores/authStore';
import { useTheme } from '../../hooks/useTheme';
import { DoctorSelector } from '../Common/DoctorSelector';

interface HeaderProps {
  pageTitle: string;
  breadcrumb?: string[];
}

export const Header: React.FC<HeaderProps> = ({ pageTitle, breadcrumb = [] }) => {
  const { darkMode, toggleDarkMode, toggleSidebar } = useUIStore();
  const { getPendingAppointments } = useAppointmentStore();
  const { colors } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  const doctor = useDoctor();
  const pendingCount = doctor?.id ? getPendingAppointments(doctor.id).length : 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <header 
      role="banner"
      className="sticky top-0 z-30 backdrop-blur-md border-b"
      style={{
        backgroundColor: colors.bg.header,
        borderColor: colors.border.default
      }}
      aria-label="En-tête de l'application"
    >
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Left - Breadcrumb */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg transition-colors lg:hidden"
            style={{
              color: colors.text.secondary,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? colors.bg.card : colors.bg.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Ouvrir le menu de navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <nav aria-label="Fil d'Ariane" className="hidden sm:block">
            <ol className="flex items-center gap-2 text-sm">
              {breadcrumb.length > 0 ? (
                breadcrumb.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {index > 0 && (
                      <ChevronRight 
                        className="w-4 h-4" 
                        style={{ color: colors.text.muted }}
                        aria-hidden="true" 
                      />
                    )}
                    <span
                      className={index === breadcrumb.length - 1 ? 'font-medium' : ''}
                      style={{
                        color: index === breadcrumb.length - 1
                          ? colors.text.primary
                          : colors.text.secondary
                      }}
                      aria-current={index === breadcrumb.length - 1 ? 'page' : undefined}
                    >
                      {item}
                    </span>
                  </li>
                ))
              ) : (
                <li className="font-medium" style={{ color: colors.text.primary }}>
                  {pageTitle}
                </li>
              )}
            </ol>
          </nav>
        </div>

        {/* Right - Clinic selector, Time, notifications, dark mode */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Doctor Selector for Secretaries */}
          <DoctorSelector />
          
          {/* Date/Time */}
          <div className="hidden md:block text-right">
            <p 
              className="text-sm font-medium font-mono"
              style={{ color: colors.text.primary }}
            >
              {formatTime(currentTime)}
            </p>
            <p 
              className="text-xs capitalize"
              style={{ color: colors.text.secondary }}
            >
              {formatDate(currentTime)}
            </p>
          </div>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg transition-colors"
            style={{
              color: colors.text.secondary,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? colors.bg.card : colors.bg.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label={`Notifications${pendingCount > 0 ? ` (${pendingCount} en attente)` : ''}`}
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            {pendingCount > 0 && (
              <span 
                className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                style={{ color: 'rgba(255, 255, 255, 1)' }}
                aria-hidden="true"
              >
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg transition-colors"
            style={{
              color: colors.text.secondary,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? colors.bg.card : colors.bg.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label={darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" aria-hidden="true" />
            ) : (
              <Moon className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

