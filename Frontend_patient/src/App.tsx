import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Dashboard, BookAppointment, MyAppointments, Profile } from './pages';
import { MainLayout } from './components/Layout';
import { ErrorBoundary, ThemeProvider } from './components/Common';
import './index.css';
import { usePatientStore } from './store/patientStore';
import { useEffect } from 'react';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentPatient, fetchPatient } = usePatientStore();

  useEffect(() => {
    if (!currentPatient) {
      fetchPatient('1');
    }
  }, [currentPatient, fetchPatient]);

  const getPageInfo = (pathname: string) => {
    switch (pathname) {
      case '/':
        return { title: 'Tableau de bord', breadcrumb: [] };
      case '/book':
        return { title: 'Prendre un rendez-vous', breadcrumb: ['Tableau de bord', 'Prendre un rendez-vous'] };
      case '/appointments':
        return { title: 'Mes rendez-vous', breadcrumb: ['Tableau de bord', 'Mes rendez-vous'] };
      case '/profile':
        return { title: 'Mon profil', breadcrumb: ['Tableau de bord', 'Mon profil'] };
      default:
        return { title: 'Tableau de bord', breadcrumb: [] };
    }
  };

  const pageInfo = getPageInfo(location.pathname);
  const currentPage = location.pathname === '/' ? 'dashboard' : location.pathname.substring(1);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <MainLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      pageTitle={pageInfo.title}
      breadcrumb={pageInfo.breadcrumb}
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/appointments" element={<MyAppointments />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export { App };
export default App;
