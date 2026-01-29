import React, { useState } from 'react';
import { AlertTriangle, Bell } from 'lucide-react';
import { useAppointmentStore } from '../../stores/appointmentStore';
import { usePatientStore } from '../../stores/patientStore';
import { useUIStore } from '../../stores/uiStore';
import { useTheme } from '../../hooks/useTheme';
import Button from '../Common/Button';
import Textarea from '../Common/Textarea';
import type { Appointment } from '../../types';

interface AppointmentDeleteConfirmProps {
  appointment: Appointment | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AppointmentDeleteConfirm: React.FC<AppointmentDeleteConfirmProps> = ({
  appointment,
  onConfirm,
  onCancel
}) => {
  const { cancelAppointment } = useAppointmentStore();
  const { patients } = usePatientStore();
  const { addToast } = useUIStore();
  const { colors, darkMode } = useTheme();
  const [reason, setReason] = useState('');
  const [notifyPatient, setNotifyPatient] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!appointment) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);

    try {
      cancelAppointment(appointment.appointmentId);

      if (notifyPatient) {
      }

      addToast('success', 'Rendez-vous annulé');
      onConfirm();
    } catch (error) {
      addToast('error', 'Erreur lors de l\'annulation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPatientName = (patientId: string): string => {
    const patient = patients.find(p => p.patientId === patientId);
    return patient ? `${patient.FirstName} ${patient.Surname}` : 'Patient inconnu';
  };

  return (
    <div className="space-y-5">
      {/* Warning */}
      <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-red-800 dark:text-red-400">
            Êtes-vous sûr de vouloir annuler ce rendez-vous ?
          </h4>
          <p className="text-sm text-red-600 dark:text-red-300 mt-1">
            Cette action ne peut pas être annulée.
          </p>
        </div>
      </div>

      {/* Appointment details */}
      <div
        className="p-4 rounded-lg space-y-2"
        style={{ backgroundColor: colors.bg.secondary }}
      >
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Patient</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {getPatientName(appointment.appointedPatient)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Date</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {appointment.date}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Heure</span>
          <span className="font-medium text-gray-900 dark:text-white font-mono">
            {appointment.time}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Motif</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {appointment.reason}
          </span>
        </div>
      </div>

      {/* Reason for cancellation */}
      <Textarea
        label="Raison de l'annulation (optionnel)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Indiquez la raison de l'annulation..."
        rows={3}
        aria-label="Raison de l'annulation du rendez-vous"
      />

      {/* Notify patient */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={notifyPatient}
          onChange={(e) => setNotifyPatient(e.target.checked)}
          className="w-4 h-4 border-gray-300 rounded"
          style={{ accentColor: darkMode ? '#4DB6AC' : '#43A78B' }}
        />
        <Bell className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Notifier le patient par email
        </span>
      </label>

      {/* Actions */}
      <div
        className="flex justify-end gap-3 pt-4 border-t"
        style={{ borderColor: colors.border.default }}
      >
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          aria-label="Annuler et fermer"
        >
          Retour
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={handleConfirm}
          isLoading={isSubmitting}
          aria-label="Confirmer l'annulation du rendez-vous"
        >
          Confirmer l'annulation
        </Button>
      </div>
    </div>
  );
};

export default AppointmentDeleteConfirm;

