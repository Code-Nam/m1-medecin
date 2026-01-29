import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Dashboard, BookAppointment, MyAppointments, Profile, Login, Register } from './pages';
import { MainLayout } from './components/Layout';
import { ErrorBoundary, ThemeProvider } from './components/Common';
import './index.css';
import { usePatientStore } from './store/patientStore';
import { useEffect } from 'react';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentPatient, isAuthenticated, isInitialized, initialize, fetchPatient } = usePatientStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isAuthenticated && !currentPatient) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.patientId) {
        fetchPatient(user.patientId);
      }
    }
  }, [isAuthenticated, currentPatient, fetchPatient]);

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

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Si on est connecté mais qu'on essaie d'aller sur login ou register, on redirige vers l'accueil
  if (location.pathname === '/login' || location.pathname === '/register') {
    return <Navigate to="/" replace />;
  }

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
