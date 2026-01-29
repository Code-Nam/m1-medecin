import React from 'react';
import { Building2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../hooks/useTheme';

export const ClinicSelector: React.FC = () => {
  const { user, selectedClinicId, setSelectedClinic } = useAuthStore();
  const { colors } = useTheme();

  if (!user || user.role !== 'SECRETARY' || !user.clinics || user.clinics.length <= 1) {
    return null;
  }

  const selectedClinic = user.clinics.find(c => c.id === selectedClinicId) || user.clinics[0];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clinic = user.clinics?.find(c => c.id === e.target.value);
    if (clinic) {
      setSelectedClinic(clinic.id);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Building2 size={16} style={{ color: colors.text.secondary }} />
      <select
        value={selectedClinicId || selectedClinic.id}
        onChange={handleChange}
        className="text-sm font-medium min-w-[200px] px-3 py-1.5 rounded-lg border transition-colors"
        style={{
          backgroundColor: colors.bg.card,
          color: colors.text.primary,
          borderColor: colors.border.default,
        }}
      >
        {user.clinics.map((clinic) => (
          <option key={clinic.id} value={clinic.id}>
            {clinic.name}
          </option>
        ))}
      </select>
    </div>
  );
};

