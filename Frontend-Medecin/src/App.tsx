import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { CalendarPage } from './pages/CalendarPage';
import { PatientsPage } from './pages/PatientsPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Login } from './pages/Login';
import { CalendarModal } from './components/Calendar/CalendarModal';
import { PatientModal } from './components/Patients/PatientModal';
import { ThemeProvider } from './components/ThemeProvider';
import { useAuthStore } from './stores/authStore';
import './index.css';

type PageType = 'dashboard' | 'calendar' | 'patients' | 'statistics' | 'settings';

const pageConfig: Record<PageType, { title: string; breadcrumb: string[] }> = {
  dashboard: { title: 'Tableau de bord', breadcrumb: ['Accueil', 'Tableau de bord'] },
  calendar: { title: 'Calendrier', breadcrumb: ['Accueil', 'Calendrier'] },
  patients: { title: 'Patients', breadcrumb: ['Accueil', 'Patients'] },
  statistics: { title: 'Statistiques', breadcrumb: ['Accueil', 'Statistiques'] },
  settings: { title: 'Paramètres', breadcrumb: ['Accueil', 'Paramètres'] }
};

function AppContent() {
  const { isAuthenticated, initialize } = useAuthStore();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  useEffect(() => {
    initialize();
  }, [initialize]);

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

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
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
  );
}

export function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
