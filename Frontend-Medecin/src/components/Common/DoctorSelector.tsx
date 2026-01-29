import React from 'react';
import { Stethoscope } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../hooks/useTheme';

export const DoctorSelector: React.FC = () => {
  const { user, selectedDoctorId, setSelectedDoctor } = useAuthStore();
  const { colors } = useTheme();

  if (!user || user.role !== 'SECRETARY' || !user.doctors || user.doctors.length <= 1) {
    return null;
  }

  const selectedDoctor = user.doctors.find(d => d.id === selectedDoctorId) || user.doctors[0];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const doctor = user.doctors?.find(d => d.id === e.target.value);
    if (doctor) {
      setSelectedDoctor(doctor.id);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Stethoscope size={16} style={{ color: colors.text.secondary }} />
      <select
        value={selectedDoctorId || selectedDoctor.id}
        onChange={handleChange}
        className="text-sm font-medium min-w-[250px] px-3 py-1.5 rounded-lg border transition-colors"
        style={{
          backgroundColor: colors.bg.card,
          color: colors.text.primary,
          borderColor: colors.border.default,
        }}
      >
        {user.doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.title || 'Dr.'} {doctor.firstName} {doctor.surname} - {doctor.specialization}
          </option>
        ))}
      </select>
    </div>
  );
};

