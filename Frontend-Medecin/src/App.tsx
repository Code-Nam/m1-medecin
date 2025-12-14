import React, { useState } from 'react';
import { MainLayout } from './components/Layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { CalendarPage } from './pages/CalendarPage';
import { PatientsPage } from './pages/PatientsPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { CalendarModal } from './components/Calendar/CalendarModal';
import { PatientModal } from './components/Patients/PatientModal';
import { ThemeProvider } from './components/ThemeProvider';
import './index.css';

type PageType = 'dashboard' | 'calendar' | 'patients' | 'statistics' | 'settings';

const pageConfig: Record<PageType, { title: string; breadcrumb: string[] }> = {
  dashboard: { title: 'Tableau de bord', breadcrumb: ['Accueil', 'Tableau de bord'] },
  calendar: { title: 'Calendrier', breadcrumb: ['Accueil', 'Calendrier'] },
  patients: { title: 'Patients', breadcrumb: ['Accueil', 'Patients'] },
  statistics: { title: 'Statistiques', breadcrumb: ['Accueil', 'Statistiques'] },
  settings: { title: 'Paramètres', breadcrumb: ['Accueil', 'Paramètres'] }
};

export function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'calendar':
        return <CalendarPage />;
      case 'patients':
        return <PatientsPage />;
      case 'statistics':
        return <StatisticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  const { title, breadcrumb } = pageConfig[currentPage];

  return (
    <ThemeProvider>
      <MainLayout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        pageTitle={title}
        breadcrumb={breadcrumb}
      >
        {renderPage()}
        {/* Global modals for pages that don't include them */}
        {currentPage === 'dashboard' && (
          <>
            <CalendarModal />
            <PatientModal />
          </>
        )}
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;
