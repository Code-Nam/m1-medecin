import React from 'react';
import { Clock, User, FileText, CheckCircle, XCircle, Edit2, Trash2 } from 'lucide-react';
import { useAppointmentStore } from '../../stores/appointmentStore';
import { usePatientStore } from '../../stores/patientStore';
import { useDoctor } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { useTheme } from '../../hooks/useTheme';
// import { getPatientName } from '../../utils/mockData';
import Button from '../Common/Button';

export const DayViewTable: React.FC = () => {
  const doctor = useDoctor();
  const { getTodayAppointments, selectAppointment, confirmAppointment, cancelAppointment } = useAppointmentStore();
  const { openModal, addToast } = useUIStore();
  const { darkMode, colors } = useTheme();
  const { patients } = usePatientStore();

  const getPatientName = (patientId: string): string => {
    const patient = patients.find(p => p.patientId === patientId);
    return patient ? `${patient.FirstName} ${patient.Surname}` : 'Patient inconnu';
  };

  const todayAppointments = doctor ? getTodayAppointments(doctor.id) : [];

  const getStatusBadge = (status: string) => {
    const styleMap: Record<string, { bg: string; text: string }> = {
      confirmed: {
        bg: darkMode ? 'rgba(16, 185, 129, 0.3)' : '#D1FAE5',
        text: darkMode ? '#4ADE80' : '#065F46'
      },
      pending: {
        bg: darkMode ? 'rgba(234, 179, 8, 0.3)' : '#FEF3C7',
        text: darkMode ? '#FACC15' : '#92400E'
      },
      cancelled: {
        bg: darkMode ? colors.bg.card : '#F3F4F6',
        text: colors.text.secondary
      },
      doctor_created: {
        bg: darkMode ? 'rgba(59, 130, 246, 0.3)' : '#DBEAFE',
        text: darkMode ? '#60A5FA' : '#1E40AF'
      }
    };

    const labels = {
      confirmed: 'Confirmé',
      pending: 'En attente',
      cancelled: 'Annulé',
      doctor_created: 'Créé par médecin'
    };

    const style = styleMap[status] || styleMap.confirmed!;

    return (
      <span
        className="px-2 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const handleEdit = (appointment: any) => {
    selectAppointment(appointment);
    openModal('editAppointment', appointment);
  };

  const handleDelete = (appointment: any) => {
    selectAppointment(appointment);
    openModal('deleteAppointment', appointment);
  };

  const handleConfirm = (appointmentId: string) => {
    confirmAppointment(appointmentId);
    addToast('success', 'Rendez-vous confirmé');
  };

  const handleCancel = (appointment: any) => {
    selectAppointment(appointment);
    openModal('deleteAppointment', appointment);
  };

  if (todayAppointments.length === 0) {
    return (
      <div
        className="rounded-xl shadow-sm border p-6"
        style={{
          backgroundColor: colors.bg.card,
          borderColor: colors.border.default
        }}
      >
        <h3
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: colors.text.primary }}
        >
          <Clock className="w-5 h-5 text-cyan-600" />
          Rendez-vous du jour
        </h3>
        <div className="text-center py-8">
          <p style={{ color: colors.text.muted }}>
            Aucun rendez-vous prévu aujourd'hui
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl shadow-sm border p-6"
      style={{
        backgroundColor: colors.bg.card,
        borderColor: colors.border.default
      }}
    >
      <h3
        className="text-lg font-semibold mb-4 flex items-center gap-2"
        style={{ color: colors.text.primary }}
      >
        <Clock className="w-5 h-5 text-cyan-600" />
        Rendez-vous du jour
        <span className="ml-auto text-sm font-normal" style={{ color: colors.text.muted }}>
          {todayAppointments.length} RDV
        </span>
      </h3>

      <div className="space-y-3">
        {todayAppointments.map((appointment) => (
          <div
            key={appointment.appointmentId}
            className="p-4 rounded-lg border transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: appointment.status === 'cancelled'
                ? (darkMode ? 'rgba(30, 30, 30, 0.5)' : '#F9FAFB')
                : colors.bg.secondary,
              borderColor: colors.border.default,
              opacity: appointment.status === 'cancelled' ? 0.6 : 1
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Heure */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold font-mono" style={{ color: '#0891B2' }}>
                    {appointment.time}
                  </span>
                  {getStatusBadge(appointment.status)}
                </div>

                {/* Patient */}
                <div className="flex items-center gap-2 text-sm mb-1" style={{ color: colors.text.secondary }}>
                  <User className="w-4 h-4" style={{ color: colors.text.muted }} />
                  <span className="font-medium">{getPatientName(appointment.appointedPatient)}</span>
                </div>

                {/* Motif */}
                <div className="flex items-center gap-2 text-sm" style={{ color: colors.text.muted }}>
                  <FileText className="w-4 h-4" />
                  <span className="truncate">{appointment.reason}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {appointment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleConfirm(appointment.appointmentId)}
                      className="p-2 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                      aria-label="Confirmer le rendez-vous"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleCancel(appointment)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      aria-label="Refuser le rendez-vous"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </>
                )}
                {appointment.status !== 'cancelled' && (
                  <>
                    <button
                      onClick={() => handleEdit(appointment)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: colors.text.muted }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = darkMode ? colors.bg.card : '#F3F4F6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      aria-label="Modifier le rendez-vous"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(appointment)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: colors.text.muted }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = darkMode ? colors.bg.card : '#F3F4F6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      aria-label="Annuler le rendez-vous"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayViewTable;

