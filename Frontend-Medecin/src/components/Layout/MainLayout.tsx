import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { ToastContainer } from '../Common/Toast';
import { useUIStore } from '../../stores/uiStore';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  pageTitle: string;
  breadcrumb?: string[];
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentPage,
  onNavigate,
  pageTitle,
  breadcrumb
}) => {
  const { darkMode } = useUIStore();

  // Appliquer la classe dark sur l'élément html et forcer les styles
  React.useEffect(() => {
    const htmlElement = document.documentElement;
    // S'assurer que la classe dark est correctement appliquée ou retirée
    if (darkMode) {
      htmlElement.classList.add('dark');
      htmlElement.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#0F0F0F';
      document.body.style.color = '#FFFFFF';
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#F5F5F5';
      document.body.style.color = '#1F1F1F';
    }
    
    // Nettoyer au démontage
    return () => {
      // Ne pas nettoyer ici car on veut garder l'état
    };
  }, [darkMode]);

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-950 text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}
      style={darkMode ? {} : { backgroundColor: '#F5F5F5', color: '#1F1F1F' }}
    >
        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:text-white focus:rounded-lg"
          style={{ backgroundColor: darkMode ? '#4DB6AC' : '#43A78B' }}
        >
          Aller au contenu principal
        </a>

        <div className="flex">
          {/* Sidebar */}
          <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

          {/* Main content area */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Header */}
            <Header pageTitle={pageTitle} breadcrumb={breadcrumb} />

            {/* Page content */}
            <main
              id="main-content"
              className="flex-1 p-4 lg:p-6 overflow-auto"
              tabIndex={-1}
            >
              {children}
            </main>
          </div>
        </div>

        {/* Toast notifications */}
        <ToastContainer />
      </div>
  );
};

export default MainLayout;

