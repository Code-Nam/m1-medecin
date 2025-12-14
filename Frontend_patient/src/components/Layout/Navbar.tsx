import { Link, useLocation } from 'react-router-dom';
import { usePatientStore } from '../../store/patientStore';
import { Calendar, User, LogOut } from 'lucide-react';

export const Navbar = () => {
    const { currentPatient, logout } = usePatientStore();
    const location = useLocation();

    if (!currentPatient) return null;

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-blue-600">PlanityClone</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            to="/appointments"
                            className={`p-2 rounded-md ${location.pathname === '/appointments' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900'
                                }`}
                            title="Mes rendez-vous"
                        >
                            <Calendar size={20} />
                        </Link>

                        <Link
                            to="/profile"
                            className={`p-2 rounded-md ${location.pathname === '/profile' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900'
                                }`}
                            title="Mon profil"
                        >
                            <User size={20} />
                        </Link>

                        <button
                            onClick={logout}
                            className="p-2 text-gray-500 hover:text-red-600 rounded-md transition-colors"
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
