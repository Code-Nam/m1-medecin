import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, BookAppointment, MyAppointments, Profile } from './pages';
import { Navbar, Footer } from './components/Layout';
import { ErrorBoundary } from './components/Common';
import './index.css';

// Mock setup for development - In real app, this might be in a dedicated init file
import { usePatientStore } from './store/patientStore';
import { useEffect } from 'react';

function App() {
  const { currentPatient, fetchPatient } = usePatientStore();

  // Temporary: Simulate login for development purposes
  // In a real app, this would be handled by a Login page and AuthContext
  useEffect(() => {
    // Fetch a mock patient if not logged in
    // This assumes backend has seed data or we mock the service response
    if (!currentPatient) {
      // patientId '1' or similar
      fetchPatient('1');
    }
  }, [currentPatient, fetchPatient]);

  return (
    <ErrorBoundary>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/book" element={<BookAppointment />} />
              <Route path="/appointments" element={<MyAppointments />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export { App };
export default App;
