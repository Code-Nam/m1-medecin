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
      DOCTOR_CREATED: 'Créé par médecin'
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
              backgroundColor: appointment.status === 'CANCELLED'
                ? (darkMode ? 'rgba(30, 30, 30, 0.5)' : '#F9FAFB')
                : colors.bg.secondary,
              borderColor: colors.border.default,
              opacity: appointment.status === 'CANCELLED' ? 0.6 : 1
            }}
          >
            <div className="flex flex-col gap-2">
              {/* Top line: Time + Status + Actions */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold font-mono" style={{ color: '#0891B2' }}>
                    {appointment.time}
                  </span>
                  {getStatusBadge(appointment.status)}
                </div>

                {/* Actions groupées */}
                <div className="flex items-center gap-1 bg-white/10 dark:bg-black/10 rounded-lg p-0.5">
                  {appointment.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleConfirm(appointment.appointmentId)}
                        className="p-1.5 rounded-md text-green-600 hover:bg-green-50 dark:hover:bg-green-900/40 transition-colors"
                        aria-label={`Confirmer ${getPatientName(appointment.appointedPatient)}`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCancel(appointment)}
                        className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors"
                        aria-label={`Refuser ${getPatientName(appointment.appointedPatient)}`}
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {appointment.status !== 'CANCELLED' && (
                    <>
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="p-1.5 rounded-md transition-colors"
                        style={{ color: colors.text.muted }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255,255,255,0.1)' : '#F3F4F6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        aria-label={`Modifier ${getPatientName(appointment.appointedPatient)}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(appointment)}
                        className="p-1.5 rounded-md transition-colors"
                        style={{ color: colors.text.muted }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255,255,255,0.1)' : '#F3F4F6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        aria-label={`Supprimer ${getPatientName(appointment.appointedPatient)}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom lines: Patient and Reason */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm" style={{ color: colors.text.primary }}>
                  <User className="w-3.5 h-3.5" style={{ color: colors.text.muted }} aria-hidden="true" />
                  <span className="font-medium truncate">{getPatientName(appointment.appointedPatient)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: colors.text.muted }}>
                  <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="truncate italic">{appointment.reason}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayViewTable;

