import React, { useState, useEffect } from 'react';
import { Menu, Sun, Moon, Bell, ChevronRight } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAppointmentStore } from '../../stores/appointmentStore';
import { useAuthStore } from '../../stores/authStore';

interface HeaderProps {
  pageTitle: string;
  breadcrumb?: string[];
}

export const Header: React.FC<HeaderProps> = ({ pageTitle, breadcrumb = [] }) => {
  const { darkMode, toggleDarkMode, toggleSidebar } = useUIStore();
  const { doctor } = useAuthStore();
  const { getPendingAppointments } = useAppointmentStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  const pendingCount = doctor ? getPendingAppointments(doctor.doctorId).length : 0;

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
      className="sticky top-0 z-30 backdrop-blur-md border-b"
      style={{
        backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        borderColor: darkMode ? '#374151' : '#E5E7EB'
      }}
    >
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Left - Menu toggle + Breadcrumb */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
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
                        style={{ color: darkMode ? '#9CA3AF' : '#4B5563' }}
                        aria-hidden="true" 
                      />
                    )}
                    <span
                      className={index === breadcrumb.length - 1 ? 'font-medium' : ''}
                      style={{
                        color: index === breadcrumb.length - 1
                          ? darkMode ? '#FFFFFF' : '#111827'
                          : darkMode ? '#9CA3AF' : '#374151'
                      }}
                      aria-current={index === breadcrumb.length - 1 ? 'page' : undefined}
                    >
                      {item}
                    </span>
                  </li>
                ))
              ) : (
                <li className="font-medium" style={{ color: darkMode ? '#FFFFFF' : '#111827' }}>
                  {pageTitle}
                </li>
              )}
            </ol>
          </nav>
        </div>

        {/* Right - Time, notifications, dark mode */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Date/Time */}
          <div className="hidden md:block text-right">
            <p 
              className="text-sm font-medium font-mono"
              style={{ color: darkMode ? '#FFFFFF' : '#111827' }}
            >
              {formatTime(currentTime)}
            </p>
            <p 
              className="text-xs capitalize"
              style={{ color: darkMode ? '#9CA3AF' : '#374151' }}
            >
              {formatDate(currentTime)}
            </p>
          </div>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={`Notifications${pendingCount > 0 ? ` (${pendingCount} en attente)` : ''}`}
          >
            <Bell className="w-5 h-5" />
            {pendingCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

