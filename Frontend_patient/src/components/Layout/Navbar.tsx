import { Link, useLocation } from 'react-router-dom';
import { usePatientStore } from '../../store/patientStore';
import { useUIStore } from '../../store/uiStore';
import { useTheme } from '../../hooks/useTheme';
import { Calendar, User, LogOut, Moon, Sun } from 'lucide-react';

export const Navbar = () => {
    const { currentPatient, logout } = usePatientStore();
    const { darkMode, toggleDarkMode } = useUIStore();
    const { colors } = useTheme();
    const location = useLocation();

    if (!currentPatient) return null;

    return (
        <nav 
            className="border-b"
            style={{
                backgroundColor: colors.bg.secondary,
                borderColor: colors.border.default
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span 
                                className="text-xl font-bold"
                                style={{ color: colors.accent.primary }}
                            >
                                PlanityClone
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-md transition-colors"
                            style={{
                                color: colors.text.secondary
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = colors.text.primary;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = colors.text.secondary;
                            }}
                            title={darkMode ? "Mode clair" : "Mode sombre"}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <Link
                            to="/appointments"
                            className="p-2 rounded-md transition-colors"
                            style={{
                                color: location.pathname === '/appointments' 
                                    ? colors.accent.primary 
                                    : colors.text.secondary,
                                backgroundColor: location.pathname === '/appointments'
                                    ? darkMode ? 'rgba(77, 182, 172, 0.2)' : 'rgba(67, 167, 139, 0.1)'
                                    : 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                if (location.pathname !== '/appointments') {
                                    e.currentTarget.style.color = colors.text.primary;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (location.pathname !== '/appointments') {
                                    e.currentTarget.style.color = colors.text.secondary;
                                }
                            }}
                            title="Mes rendez-vous"
                        >
                            <Calendar size={20} />
                        </Link>

                        <Link
                            to="/profile"
                            className="p-2 rounded-md transition-colors"
                            style={{
                                color: location.pathname === '/profile' 
                                    ? colors.accent.primary 
                                    : colors.text.secondary,
                                backgroundColor: location.pathname === '/profile'
                                    ? darkMode ? 'rgba(77, 182, 172, 0.2)' : 'rgba(67, 167, 139, 0.1)'
                                    : 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                if (location.pathname !== '/profile') {
                                    e.currentTarget.style.color = colors.text.primary;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (location.pathname !== '/profile') {
                                    e.currentTarget.style.color = colors.text.secondary;
                                }
                            }}
                            title="Mon profil"
                        >
                            <User size={20} />
                        </Link>

                        <button
                            onClick={logout}
                            className="p-2 rounded-md transition-colors"
                            style={{
                                color: colors.text.secondary
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = colors.semantic.danger;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = colors.text.secondary;
                            }}
                            title="Déconnexion"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
