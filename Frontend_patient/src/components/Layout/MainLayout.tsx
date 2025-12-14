import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useUIStore } from '../../store/uiStore';
import { useTheme } from '../../hooks/useTheme';

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
  const { colors } = useTheme();

  React.useEffect(() => {
    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.classList.add('dark');
      htmlElement.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#0F0F0F';
      document.body.style.color = '#FFFFFF';
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#FCFCF7';
      document.body.style.color = '#263238';
    }
  }, [darkMode]);

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: colors.bg.primary,
        color: colors.text.primary
      }}
      >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:text-white focus:rounded-lg"
        style={{ backgroundColor: colors.accent.primary }}
      >
        Aller au contenu principal
      </a>

      <div className="flex">
        <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

        <div className="flex-1 flex flex-col min-h-screen">
          <Header pageTitle={pageTitle} breadcrumb={breadcrumb} />

          <main
            id="main-content"
            className="flex-1 p-4 lg:p-6 overflow-auto"
            tabIndex={-1}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;


