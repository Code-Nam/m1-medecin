import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, User, PlusCircle } from 'lucide-react';

export const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { icon: Home, label: 'Accueil', path: '/' },
        { icon: PlusCircle, label: 'Prendre RDV', path: '/book' },
        { icon: Calendar, label: 'Mes RDV', path: '/appointments' },
        { icon: User, label: 'Profil', path: '/profile' },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
            <div className="p-4">
                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};
