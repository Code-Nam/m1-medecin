import React, { useState } from 'react';
import { User, Mail, Phone } from 'lucide-react';
import { usePatientStore } from '../../stores/patientStore';
import { useDoctor } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { useTheme } from '../../hooks/useTheme';
import Button from '../Common/Button';
import Input from '../Common/Input';
import { isValidName, isValidEmail, isValidPhone, validationMessages } from '../../utils/validation';
import type { Patient } from '../../utils/mockData';

interface PatientFormProps {
  patient?: Patient | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  patient,
  onSuccess,
  onCancel
}) => {
  const doctor = useDoctor();
  const { addPatient, updatePatient } = usePatientStore();
  const { addToast } = useUIStore();
  const { darkMode, colors } = useTheme();

  const isEditing = !!patient;

  const [formData, setFormData] = useState({
    Surname: patient?.Surname || '',
    FirstName: patient?.FirstName || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    assignToDoctor: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.Surname) {
      newErrors.Surname = validationMessages.required;
    } else if (!isValidName(formData.Surname)) {
      newErrors.Surname = validationMessages.name;
    }

    if (!formData.FirstName) {
      newErrors.FirstName = validationMessages.required;
    } else if (!isValidName(formData.FirstName)) {
      newErrors.FirstName = validationMessages.name;
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = validationMessages.email;
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = validationMessages.phone;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const patientData = {
        Surname: formData.Surname,
        FirstName: formData.FirstName,
        email: formData.email,
        phone: formData.phone,
        assigned_doctor: formData.assignToDoctor && doctor ? doctor.id : undefined
      };

      if (isEditing && patient) {
        await updatePatient(patient.patientId, patientData);
        addToast('success', 'Patient modifié avec succès');
      } else {
        await addPatient(patientData);
        addToast('success', 'Patient créé avec succès');
      }

      onSuccess();
    } catch (error: any) {
      addToast('error', error.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (typeof value === 'string' && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nom */}
      <Input
        label="Nom"
        value={formData.Surname}
        onChange={(e) => handleChange('Surname', e.target.value)}
        error={errors.Surname}
        required
        placeholder="Dupont"
        leftIcon={<User className="w-4 h-4" />}
        aria-label="Nom du patient"
      />

      {/* Prénom */}
      <Input
        label="Prénom"
        value={formData.FirstName}
        onChange={(e) => handleChange('FirstName', e.target.value)}
        error={errors.FirstName}
        required
        placeholder="Jean"
        leftIcon={<User className="w-4 h-4" />}
        aria-label="Prénom du patient"
      />

      {/* Email */}
      <Input
        type="email"
        label="Email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
        placeholder="jean.dupont@mail.fr"
        leftIcon={<Mail className="w-4 h-4" />}
        aria-label="Email du patient"
        helperText="Optionnel"
      />

      {/* Téléphone */}
      <Input
        type="tel"
        label="Téléphone"
        value={formData.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
        error={errors.phone}
        placeholder="0612345678"
        leftIcon={<Phone className="w-4 h-4" />}
        aria-label="Téléphone du patient"
        helperText="Optionnel - Format: 0612345678"
      />

      {/* Assign to doctor */}
      {!isEditing && (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.assignToDoctor}
            onChange={(e) => handleChange('assignToDoctor', e.target.checked)}
            className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Assigner ce patient à mon compte
          </span>
        </label>
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
          aria-label={isEditing ? 'Enregistrer les modifications' : 'Créer le patient'}
        >
          {isEditing ? 'Enregistrer' : 'Créer le patient'}
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;

