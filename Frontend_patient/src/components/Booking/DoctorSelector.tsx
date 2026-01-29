import React from 'react';
import type { Doctor } from '../../types';
import { User } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface DoctorSelectorProps {
    doctors: Doctor[];
    selectedDoctorId?: string;
    onSelect: (doctor: Doctor) => void;
}

export const DoctorSelector: React.FC<DoctorSelectorProps> = ({
    doctors,
    selectedDoctorId,
    onSelect,
}) => {
    const { darkMode, colors } = useTheme();

    return (
        <div className="space-y-4">
            <h3
                id="doctor-selector-heading"
                className="text-lg font-medium"
                style={{ color: colors.text.primary }}
            >
                Première étape : Choisissez un médecin
            </h3>
            <div
                className="grid gap-4 sm:grid-cols-2"
                role="radiogroup"
                aria-labelledby="doctor-selector-heading"
                aria-required="true"
            >
                {Array.isArray(doctors) && doctors.length > 0 ? (
                    doctors.map((doctor) => {
                        const isSelected = selectedDoctorId === doctor.doctorId;
                        const doctorLabel = `Docteur ${doctor.firstName} ${doctor.surname}, ${doctor.specialization}`;
                        return (
                            <div
                                key={doctor.doctorId}
                                onClick={() => onSelect(doctor)}
                                className="cursor-pointer p-4 rounded-lg border transition-all"
                                style={{
                                    borderColor: isSelected
                                        ? colors.accent.primary
                                        : colors.border.default,
                                    backgroundColor: isSelected
                                        ? darkMode ? 'rgba(77, 182, 172, 0.2)' : 'rgba(67, 167, 139, 0.1)'
                                        : 'transparent',
                                    boxShadow: isSelected
                                        ? `0 0 0 2px ${darkMode ? 'rgba(77, 182, 172, 0.3)' : 'rgba(67, 167, 139, 0.2)'}`
                                        : undefined
                                }}
                                role="radio"
                                aria-checked={isSelected}
                                aria-label={doctorLabel}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onSelect(doctor);
                                    }
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.borderColor = colors.accent.primary;
                                        e.currentTarget.style.backgroundColor = darkMode ? colors.bg.card : colors.bg.primary;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.borderColor = colors.border.default;
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0" aria-hidden="true">
                                        <div
                                            className="h-10 w-10 rounded-full flex items-center justify-center"
                                            style={{
                                                backgroundColor: darkMode ? 'rgba(77, 182, 172, 0.3)' : 'rgba(67, 167, 139, 0.2)',
                                                color: colors.accent.primary
                                            }}
                                        >
                                            <User size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <p
                                            className="font-medium"
                                            style={{ color: colors.text.primary }}
                                            aria-hidden="true"
                                        >
                                            Dr. {doctor.firstName} {doctor.surname}
                                        </p>
                                        <p
                                            className="text-sm"
                                            style={{ color: colors.text.secondary }}
                                            aria-hidden="true"
                                        >
                                            {doctor.specialization}
                                        </p>
                                        {isSelected && (
                                            <span className="sr-only">
                                                Médecin actuellement sélectionné
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">
                        Aucun médecin disponible pour le moment.
                    </div>
                )}
            </div>
        </div>
    );
};
