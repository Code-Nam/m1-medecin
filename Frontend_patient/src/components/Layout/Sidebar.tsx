import React from 'react';
import {
  Home,
  Calendar,
  PlusCircle,
  User,
  LogOut,
  UserCircle
} from 'lucide-react';
import { usePatientStore } from '../../store/patientStore';
import { useUIStore } from '../../store/uiStore';
import { useTheme } from '../../hooks/useTheme';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const { currentPatient, logout } = usePatientStore();
  const { darkMode } = useUIStore();
  const { colors } = useTheme();
  
  // TOUJOURS en mode desktop - pas de responsive
  const isDesktop = true;
  const isCollapsed = false;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Accueil', icon: <Home className="w-5 h-5" />, path: '/' },
    { id: 'book', label: 'Prendre RDV', icon: <PlusCircle className="w-5 h-5" />, path: '/book' },
    { id: 'appointments', label: 'Mes RDV', icon: <Calendar className="w-5 h-5" />, path: '/appointments' },
    { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" />, path: '/profile' }
  ];

  if (!currentPatient) return null;

  return (
    <>
      <aside
        id="navigation"
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col border-r
          transition-all duration-300 ease-in-out
          ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'} w-64
        `}
        style={{
          backgroundColor: colors.bg.sidebar,
          borderColor: colors.border.default
        }}
        role="complementary"
        aria-label="Menu de navigation principal"
      >
        <div 
          className="flex items-center gap-3 px-4 py-5 border-b"
          style={{ borderColor: colors.border.default }}
        >
          <div 
            className="flex items-center justify-center w-10 h-10 rounded-xl text-white shadow-lg"
            style={{ 
              background: darkMode 
                ? 'linear-gradient(to bottom right, #4DB6AC, #26A69A)' 
                : 'linear-gradient(to bottom right, #00796B, #004D40)' 
            }}
          >
            <UserCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p 
              className="text-sm font-semibold truncate"
              style={{ color: colors.text.primary }}
            >
              {currentPatient.firstName} {currentPatient.surname}
            </p>
            <p 
              className="text-xs truncate"
              style={{ color: colors.text.secondary }}
            >
              Patient
            </p>
          </div>
        </div>

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
                      ? darkMode ? 'rgba(77, 182, 172, 0.2)' : 'rgba(0, 121, 107, 0.1)'
                      : 'transparent',
                    color: currentPage === item.path
                      ? darkMode ? '#4DB6AC' : '#00796B'
                      : darkMode ? '#CFD8DC' : '#1A1A1A'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== item.path) {
                      e.currentTarget.style.backgroundColor = darkMode ? colors.bg.card : colors.bg.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== item.path) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  aria-current={currentPage === item.path ? 'page' : undefined}
                >
                  <span 
                    className="flex-shrink-0"
                    aria-hidden="true"
                    style={{
                      color: currentPage === item.path
                        ? darkMode ? '#4DB6AC' : '#00796B'
                        : darkMode ? '#B0BEC5' : '#37474F'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== item.path) {
                        e.currentTarget.style.color = darkMode ? '#4DB6AC' : '#00796B';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== item.path) {
                        e.currentTarget.style.color = darkMode ? '#B0BEC5' : '#37474F';
                      }
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                  {currentPage === item.path && (
                    <span className="sr-only">(page actuelle)</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div 
          className="px-3 py-4 border-t"
          style={{ borderColor: colors.border.default }}
        >
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
            style={{
              color: colors.text.primary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? 'rgba(239, 68, 68, 0.2)' : '#FEF2F2';
              e.currentTarget.style.color = darkMode ? '#F87171' : '#DC2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.text.primary;
            }}
            aria-label="Se déconnecter"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
