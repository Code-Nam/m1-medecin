import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Stethoscope
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { doctor, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar, darkMode } = useUIStore();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-5 h-5" />, path: 'dashboard' },
    { id: 'calendar', label: 'Calendrier', icon: <Calendar className="w-5 h-5" />, path: 'calendar' },
    { id: 'patients', label: 'Patients', icon: <Users className="w-5 h-5" />, path: 'patients' },
    { id: 'statistics', label: 'Statistiques', icon: <BarChart3 className="w-5 h-5" />, path: 'statistics' },
    { id: 'settings', label: 'Paramètres', icon: <Settings className="w-5 h-5" />, path: 'settings' }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col border-r
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64'}
        `}
        style={{
          backgroundColor: darkMode ? '#111827' : '#FFFFFF',
          borderColor: darkMode ? '#374151' : '#E5E7EB'
        }}
        aria-label="Menu de navigation principal"
      >
        {/* Header */}
        <div 
          className="flex items-center gap-3 px-4 py-5 border-b"
          style={{ borderColor: darkMode ? '#374151' : '#E5E7EB' }}
        >
          <div 
            className="flex items-center justify-center w-10 h-10 rounded-xl text-white shadow-lg"
            style={{ 
              background: darkMode 
                ? 'linear-gradient(to bottom right, #4DB6AC, #26A69A)' 
                : 'linear-gradient(to bottom right, #43A78B, #2E7D6B)' 
            }}
          >
            <Stethoscope className="w-6 h-6" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p 
                className="text-sm font-semibold truncate"
                style={{ color: darkMode ? '#FFFFFF' : '#111827' }}
              >
                Dr. {doctor?.FirstName} {doctor?.Surname}
              </p>
              <p 
                className="text-xs truncate"
                style={{ color: darkMode ? '#9CA3AF' : '#374151' }}
              >
                {doctor?.specialization}
              </p>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
            aria-label={sidebarCollapsed ? 'Ouvrir le menu' : 'Fermer le menu'}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto" role="navigation">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200 group font-medium
                  `}
                  style={{
                    backgroundColor: currentPage === item.path
                      ? darkMode ? 'rgba(77, 182, 172, 0.2)' : 'rgba(67, 167, 139, 0.1)'
                      : 'transparent',
                    color: currentPage === item.path
                      ? darkMode ? '#4DB6AC' : '#43A78B'
                      : darkMode ? '#D1D5DB' : '#263238'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== item.path) {
                      e.currentTarget.style.backgroundColor = darkMode ? '#1F2937' : '#F3F4F6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== item.path) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  aria-current={currentPage === item.path ? 'page' : undefined}
                  aria-label={item.label}
                >
                  <span 
                    className="flex-shrink-0"
                    style={{
                      color: currentPage === item.path
                        ? darkMode ? '#4DB6AC' : '#43A78B'
                        : darkMode ? '#9CA3AF' : '#546E7A'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== item.path) {
                        e.currentTarget.style.color = darkMode ? '#4DB6AC' : '#43A78B';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== item.path) {
                        e.currentTarget.style.color = darkMode ? '#9CA3AF' : '#546E7A';
                      }
                    }}
                  >
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {currentPage === item.path && (
                    <span className="sr-only">(page actuelle)</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer - Logout */}
        <div 
          className="px-3 py-4 border-t"
          style={{ borderColor: darkMode ? '#374151' : '#E5E7EB' }}
        >
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
            style={{
              color: darkMode ? '#D1D5DB' : '#111827'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? 'rgba(239, 68, 68, 0.2)' : '#FEF2F2';
              e.currentTarget.style.color = darkMode ? '#F87171' : '#DC2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = darkMode ? '#D1D5DB' : '#111827';
            }}
            aria-label="Se déconnecter"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

