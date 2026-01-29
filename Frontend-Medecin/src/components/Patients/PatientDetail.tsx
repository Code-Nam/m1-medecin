import React from 'react';
import { User, Mail, Phone, Calendar, Clock, FileText } from 'lucide-react';
import { useAppointmentStore } from '../../stores/appointmentStore';
import { useUIStore } from '../../stores/uiStore';
import { useTheme } from '../../hooks/useTheme';
import { formatPhoneDisplay } from '../../utils/validation';
import Button from '../Common/Button';
import type { Patient } from '../../types';

interface PatientDetailProps {
  patient: Patient | null;
  onClose: () => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onClose }) => {
  const { getAppointmentsByPatient } = useAppointmentStore();
  const { openModal } = useUIStore();
  const { darkMode, colors } = useTheme();

  if (!patient) return null;

  const appointments = getAppointmentsByPatient(patient.patientId);
  const sortedAppointments = [...appointments].sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split('-').map(Number);
    const [dayB, monthB, yearB] = b.date.split('-').map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateB.getTime() - dateA.getTime();
  });

  const getStatusBadge = (status: string) => {
    const styleMap: Record<string, { bg: string; text: string }> = {
      CONFIRMED: {
        bg: darkMode ? 'rgba(16, 185, 129, 0.3)' : '#D1FAE5',
        text: darkMode ? '#4ADE80' : '#065F46'
      },
      PENDING: {
        bg: darkMode ? 'rgba(234, 179, 8, 0.3)' : '#FEF3C7',
        text: darkMode ? '#FACC15' : '#92400E'
      },
      CANCELLED: {
        bg: darkMode ? colors.bg.card : '#F3F4F6',
        text: colors.text.secondary
      },
      DOCTOR_CREATED: {
        bg: darkMode ? 'rgba(59, 130, 246, 0.3)' : '#DBEAFE',
        text: darkMode ? '#60A5FA' : '#1E40AF'
      }
    };

    const labels = {
      CONFIRMED: 'Confirmé',
      PENDING: 'En attente',
      CANCELLED: 'Annulé',
      DOCTOR_CREATED: 'Médecin'
    };

    const style = styleMap[status] || styleMap.confirmed;

    return (
      <span
        className="px-2 py-0.5 rounded-full text-xs font-medium"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const handleCreateAppointment = () => {
    openModal('createAppointment', { patientId: patient.patientId });
  };

  return (
    <div className="space-y-6">
      {/* Patient info */}
      <div className="flex items-start gap-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
          style={{
            background: darkMode
              ? 'linear-gradient(to bottom right, #4DB6AC, #26A69A)'
              : 'linear-gradient(to bottom right, #43A78B, #2E7D6B)'
          }}
        >
          {patient.FirstName[0]}{patient.Surname[0]}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {patient.FirstName} {patient.Surname}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ID: {patient.patientId}
          </p>
        </div>
      </div>

      {/* Contact info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className="flex items-center gap-3 p-3 rounded-lg"
          style={{ backgroundColor: darkMode ? colors.bg.secondary : '#F9FAFB' }}
        >
          <Phone className="w-5 h-5" style={{ color: darkMode ? '#4DB6AC' : '#43A78B' }} />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Téléphone</p>
            <p className="font-medium text-gray-900 dark:text-white font-mono">
              {patient.phone ? formatPhoneDisplay(patient.phone) : 'Non renseigné'}
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-3 p-3 rounded-lg"
          style={{ backgroundColor: darkMode ? colors.bg.secondary : '#F9FAFB' }}
        >
          <Mail className="w-5 h-5" style={{ color: darkMode ? '#4DB6AC' : '#43A78B' }} />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {patient.email || 'Non renseigné'}
            </p>
          </div>
        </div>
      </div>

      {/* Appointments history */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" style={{ color: darkMode ? '#4DB6AC' : '#43A78B' }} />
            Historique des rendez-vous
          </h4>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {appointments.length} RDV
          </span>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2">
          {sortedAppointments.length === 0 ? (
            <p className="text-center py-4 text-gray-500 dark:text-gray-400">
              Aucun rendez-vous
            </p>
          ) : (
            sortedAppointments.map((appt) => (
              <div
                key={appt.appointmentId}
                className="p-3 rounded-lg border transition-colors"
                style={{
                  backgroundColor: appt.status === 'CANCELLED'
                    ? (darkMode ? 'rgba(30, 30, 30, 0.5)' : '#F9FAFB')
                    : colors.bg.card,
                  borderColor: colors.border.default,
                  opacity: appt.status === 'CANCELLED' ? 0.6 : 1
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {appt.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                        {appt.time}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(appt.status)}
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <FileText className="w-4 h-4" />
                  <span className="truncate">{appt.reason}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        className="flex justify-end gap-3 pt-4 border-t"
        style={{ borderColor: colors.border.default }}
      >
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          aria-label="Fermer"
        >
          Fermer
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleCreateAppointment}
          aria-label="Créer un rendez-vous pour ce patient"
        >
          Nouveau RDV
        </Button>
      </div>
    </div>
  );
};

export default PatientDetail;

