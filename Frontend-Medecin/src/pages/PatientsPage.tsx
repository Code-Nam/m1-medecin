import React, { useEffect } from 'react';
import { PatientList } from '../components/Patients/PatientList';
import { PatientModal } from '../components/Patients/PatientModal';
import { AssignPatientModal } from '../components/Patients/AssignPatientModal';
import { CalendarModal } from '../components/Calendar/CalendarModal';
import { usePatientStore } from '../stores/patientStore';
import { useDoctor } from '../stores/authStore';
import { useTheme } from '../hooks/useTheme';

export const PatientsPage: React.FC = () => {
  const doctor = useDoctor();
  const { fetchPatients } = usePatientStore();
  const { colors } = useTheme();

  useEffect(() => {
    if (doctor?.id) {
      fetchPatients(doctor.id);
    }
  }, [doctor?.id, fetchPatients]);

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
      <AssignPatientModal />
      <CalendarModal />
    </div>
  );
};

export default PatientsPage;

