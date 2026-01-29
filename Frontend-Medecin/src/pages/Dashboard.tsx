import React, { useEffect } from 'react';
import { Calendar, Users, Clock, AlertCircle, Plus, TrendingUp } from 'lucide-react';
import { useAppointmentStore } from '../stores/appointmentStore';
import { usePatientStore } from '../stores/patientStore';
import { useDoctor } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { useTheme } from '../hooks/useTheme';
import { DayViewTable } from '../components/Calendar/DayViewTable';
import { KPICard } from '../components/Statistics/KPICard';
import Button from '../components/Common/Button';
// import { getPatientName } from '../utils/mockData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const Dashboard: React.FC = () => {
  const doctor = useDoctor();
  const { getTodayAppointments, getPendingAppointments, confirmAppointment, fetchAppointments } = useAppointmentStore();
  const { patients, getPatientsByDoctor, fetchPatients } = usePatientStore();
  const { openModal, addToast } = useUIStore();
  const { darkMode, colors } = useTheme();

  useEffect(() => {
    if (doctor?.id) {
      fetchPatients(doctor.id);
      fetchAppointments(doctor.id);
    }
  }, [doctor?.id, fetchPatients, fetchAppointments]);

  const getPatientName = (patientId: string): string => {
    const patient = patients.find(p => p.patientId === patientId);
    return patient ? `${patient.FirstName} ${patient.Surname}` : 'Patient inconnu';
  };

  const todayAppointments = doctor ? getTodayAppointments(doctor.id) : [];
  const pendingAppointments = doctor ? getPendingAppointments(doctor.id) : [];
  const doctorPatients = doctor ? getPatientsByDoctor(doctor.id) : [];

  const confirmedToday = todayAppointments.filter(a =>
    a.status === 'CONFIRMED' || a.status === 'DOCTOR_CREATED'
  ).length;

  const handleConfirmAppointment = (appointmentId: string) => {
    confirmAppointment(appointmentId);
    addToast('success', 'Rendez-vous confirmé');
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div
        className="dashboard-welcome rounded-2xl p-6 text-white shadow-lg"
        style={{
          background: darkMode
            ? 'linear-gradient(to right, #4DB6AC, #26A69A)'
            : 'linear-gradient(to right, #43A78B, #2E7D6B)'
        }}
      >
        <h1 className="text-2xl font-bold mb-2 text-white">
          Bonjour, Dr. {doctor?.firstName} {doctor?.surname} 👋
        </h1>
        <p className="text-white">
          {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => openModal('createAppointment')}
            className="!bg-white/20 !text-white hover:!bg-white/30"
            aria-label="Créer un nouveau rendez-vous"
          >
            Nouveau RDV
          </Button>
          <Button
            variant="secondary"
            leftIcon={<Users className="w-4 h-4" />}
            onClick={() => openModal('createPatient')}
            className="!bg-white/20 !text-white hover:!bg-white/30"
            aria-label="Créer un nouveau patient"
          >
            Nouveau patient
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="RDV aujourd'hui"
          value={todayAppointments.length}
          icon={<Calendar className="w-5 h-5" />}
          color="cyan"
        />
        <KPICard
          title="Confirmés"
          value={confirmedToday}
          icon={<Clock className="w-5 h-5" />}
          color="green"
        />
        <KPICard
          title="En attente"
          value={pendingAppointments.length}
          icon={<AlertCircle className="w-5 h-5" />}
          color={pendingAppointments.length > 0 ? 'yellow' : 'green'}
        />
        <KPICard
          title="Mes patients"
          value={doctorPatients.length}
          icon={<Users className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's appointments */}
        <div className="lg:col-span-2">
          <DayViewTable />
        </div>

        {/* Pending appointments */}
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
            <AlertCircle className="w-5 h-5" style={{ color: colors.accent.secondary || '#F57C00' }} />
            Rendez-vous à valider
            {pendingAppointments.length > 0 && (
              <span
                className="ml-auto text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  backgroundColor: darkMode ? 'rgba(234, 179, 8, 0.3)' : '#FEF3C7',
                  color: darkMode ? '#FACC15' : '#92400E'
                }}
              >
                {pendingAppointments.length}
              </span>
            )}
          </h3>

          {pendingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p style={{ color: colors.text.muted }}>
                Aucune demande en attente
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingAppointments.slice(0, 5).map((appointment) => (
                <div
                  key={appointment.appointmentId}
                  className="p-3 rounded-lg border"
                  style={{
                    backgroundColor: darkMode ? 'rgba(234, 179, 8, 0.2)' : '#FEFCE8',
                    borderColor: darkMode ? 'rgba(234, 179, 8, 0.5)' : '#FDE047'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm" style={{ color: colors.text.primary }}>
                      {(appointment as any).patientName || getPatientName(appointment.appointedPatient)}
                    </span>
                    <span className="text-xs font-mono" style={{ color: colors.text.muted }}>
                      {appointment.time}
                    </span>
                  </div>
                  <p className="text-xs mb-2" style={{ color: colors.text.secondary }}>
                    {appointment.date} - {appointment.reason}
                  </p>
                  <div className="flex gap-2" role="group" aria-label="Actions">
                    <button
                      type="button"
                      onClick={() => handleConfirmAppointment(appointment.appointmentId)}
                      className="flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      style={{ color: 'rgba(255, 255, 255, 1)' }}
                      aria-label={`Confirmer le rendez-vous de ${getPatientName(appointment.appointedPatient)} à ${appointment.time}`}
                      tabIndex={0}
                    >
                      Confirmer
                    </button>
                    <button
                      type="button"
                      onClick={() => openModal('deleteAppointment', appointment)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                      style={{
                        backgroundColor: colors.border.light,
                        color: colors.text.secondary
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.border.default;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.border.light;
                      }}
                      aria-label={`Refuser le rendez-vous de ${getPatientName(appointment.appointedPatient)} à ${appointment.time}`}
                      tabIndex={0}
                    >
                      Refuser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

