import React from 'react';
import { PatientList } from '../components/Patients/PatientList';
import { PatientModal } from '../components/Patients/PatientModal';
import { CalendarModal } from '../components/Calendar/CalendarModal';

export const PatientsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Patients
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
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

