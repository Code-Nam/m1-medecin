import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import { useAppointmentStore } from '../../stores/appointmentStore';
import { usePatientStore } from '../../stores/patientStore';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { useTheme } from '../../hooks/useTheme';
import Button from '../Common/Button';
import Input from '../Common/Input';
import Select from '../Common/Select';
import Textarea from '../Common/Textarea';
import { isValidReason, isValidTime, isDateValid, validationMessages } from '../../utils/validation';
import type { Appointment } from '../../utils/mockData';

interface AppointmentFormProps {
  appointment?: Appointment | null;
  initialDate?: string;
  initialTime?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  initialDate,
  initialTime,
  onSuccess,
  onCancel
}) => {
  const { doctor } = useAuthStore();
  const { patients } = usePatientStore();
  const { addAppointment, updateAppointment } = useAppointmentStore();
  const { addToast } = useUIStore();
  const { colors } = useTheme();

  const isEditing = !!appointment;

  // Convertir date format yyyy-MM-dd vers dd-MM-yyyy pour l'API
  const convertToAPIDate = (isoDate: string): string => {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  // Convertir date format dd-MM-yyyy vers yyyy-MM-dd pour l'input
  const convertToInputDate = (apiDate: string): string => {
    if (!apiDate) return '';
    const parts = apiDate.split('-');
    if (parts.length !== 3) return apiDate;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const [formData, setFormData] = useState({
    patientId: appointment?.appointedPatient || '',
    date: appointment?.date ? convertToInputDate(appointment.date) : initialDate || '',
    time: appointment?.time || initialTime || '09:00',
    reason: appointment?.reason || '',
    createdBy: appointment?.createdBy || 'doctor' as 'patient' | 'doctor'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Patients du médecin
  const doctorPatients = patients.filter(p => p.assigned_doctor === doctor?.doctorId);
  const patientOptions = doctorPatients.map(p => ({
    value: p.patientId,
    label: `${p.FirstName} ${p.Surname}`
  }));

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) {
      newErrors.patientId = validationMessages.required;
    }

    if (!formData.date) {
      newErrors.date = validationMessages.required;
    } else if (!isDateValid(convertToAPIDate(formData.date))) {
      newErrors.date = validationMessages.date;
    }

    if (!formData.time) {
      newErrors.time = validationMessages.required;
    } else if (!isValidTime(formData.time)) {
      newErrors.time = validationMessages.time;
    }

    if (!formData.reason) {
      newErrors.reason = validationMessages.required;
    } else if (!isValidReason(formData.reason)) {
      newErrors.reason = validationMessages.reason;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!doctor) return;

    setIsSubmitting(true);

    try {
      const appointmentData = {
        appointedPatient: formData.patientId,
        appointedDoctor: doctor.doctorId,
        date: convertToAPIDate(formData.date),
        time: formData.time,
        reason: formData.reason,
        status: (formData.createdBy === 'doctor' ? 'doctor_created' : 'pending') as Appointment['status'],
        createdBy: formData.createdBy as 'patient' | 'doctor'
      };

      if (isEditing && appointment) {
        updateAppointment(appointment.appointmentId, appointmentData);
        addToast('success', 'Rendez-vous modifié avec succès');
      } else {
        addAppointment(appointmentData);
        addToast('success', 'Rendez-vous créé avec succès');
      }

      onSuccess();
    } catch (error) {
      addToast('error', 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Patient */}
      <Select
        label="Patient"
        options={patientOptions}
        value={formData.patientId}
        onChange={(e) => handleChange('patientId', e.target.value)}
        error={errors.patientId}
        required
        disabled={isEditing}
        aria-label="Sélectionner un patient"
      />

      {/* Date et Heure */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          error={errors.date}
          required
          min={new Date().toISOString().split('T')[0]}
          leftIcon={<Calendar className="w-4 h-4" />}
          aria-label="Sélectionner la date du rendez-vous"
        />

        <Input
          type="time"
          label="Heure"
          value={formData.time}
          onChange={(e) => handleChange('time', e.target.value)}
          error={errors.time}
          required
          min="08:00"
          max="19:00"
          step="900"
          leftIcon={<Clock className="w-4 h-4" />}
          aria-label="Sélectionner l'heure du rendez-vous"
        />
      </div>

      {/* Motif */}
      <Textarea
        label="Motif de la consultation"
        value={formData.reason}
        onChange={(e) => handleChange('reason', e.target.value)}
        error={errors.reason}
        required
        placeholder="Ex: Consultation générale, Suivi tension, Renouvellement ordonnance..."
        aria-label="Saisir le motif de la consultation"
      />

      {/* Type de RDV */}
      {!isEditing && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type de rendez-vous
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="createdBy"
                value="doctor"
                checked={formData.createdBy === 'doctor'}
                onChange={(e) => handleChange('createdBy', e.target.value)}
                className="w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Créé par médecin (confirmé)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="createdBy"
                value="patient"
                checked={formData.createdBy === 'patient'}
                onChange={(e) => handleChange('createdBy', e.target.value)}
                className="w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Demande patient (en attente)
              </span>
            </label>
          </div>
        </div>
      )}

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
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          aria-label={isEditing ? 'Enregistrer les modifications' : 'Créer le rendez-vous'}
        >
          {isEditing ? 'Enregistrer' : 'Créer le rendez-vous'}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;

