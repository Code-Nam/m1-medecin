import React from 'react';
import { AppointmentSlot } from '../../types';
import { formatTime } from '../../utils/dataFormater';
import { useTheme } from '../../hooks/useTheme';

interface TimeSlotSelectorProps {
    slots: AppointmentSlot[];
    selectedTime?: string;
    onSelect: (time: string) => void;
}

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
    slots,
    selectedTime,
    onSelect,
}) => {
    const { darkMode, colors } = useTheme();
    const availableSlots = slots.filter((slot) => slot.available);

    return (
        <div className="space-y-4">
            <h3 
                id="timeslot-selector-heading"
                className="text-lg font-medium"
                style={{ color: colors.text.primary }}
            >
                Deuxième étape : Choisissez un créneau horaire
            </h3>
            {availableSlots.length === 0 ? (
                <p 
                    className="italic"
                    style={{ color: colors.text.secondary }}
                    role="status"
                    aria-live="polite"
                >
                    Aucun créneau disponible pour cette date.
                </p>
            ) : (
                <div 
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3"
                    role="group"
                    aria-labelledby="timeslot-selector-heading"
                >
                    {availableSlots.map((slot) => {
                        const isSelected = selectedTime === slot.time;
                        const timeLabel = `Créneau de ${formatTime(slot.time)}${isSelected ? ', actuellement sélectionné' : ''}`;
                        return (
                            <button
                                key={slot.time}
                                onClick={() => onSelect(slot.time)}
                                className="py-2 px-3 text-sm font-medium rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
                                style={{
                                    backgroundColor: isSelected 
                                        ? colors.accent.primary 
                                        : colors.bg.card,
                                    color: isSelected 
                                        ? '#FFFFFF' 
                                        : colors.text.primary,
                                    borderColor: isSelected 
                                        ? colors.accent.primary 
                                        : colors.border.default,
                                    '--tw-ring-color': colors.accent.primary
                                } as React.CSSProperties}
                                onMouseEnter={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.backgroundColor = colors.bg.primary;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.backgroundColor = colors.bg.card;
                                    }
                                }}
                                type="button"
                                aria-label={timeLabel}
                                aria-pressed={isSelected}
                            >
                                {formatTime(slot.time)}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
