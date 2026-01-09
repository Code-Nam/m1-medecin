import React from 'react';
import { PatientList } from '../components/Patients/PatientList';
import { PatientModal } from '../components/Patients/PatientModal';
import { CalendarModal } from '../components/Calendar/CalendarModal';
import { useTheme } from '../hooks/useTheme';

export const PatientsPage: React.FC = () => {
  const { colors } = useTheme();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 
          className="text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          Patients
        </h2>
        <p 
          className="text-sm"
          style={{ color: colors.text.secondary }}
        >
          Gérez la liste de vos patients
        </p>
      </div>

      {/* Patient list */}
      <PatientList />

      {/* Modals */}
      <PatientModal />
      <CalendarModal />
    </div>
  );
};

export default PatientsPage;

