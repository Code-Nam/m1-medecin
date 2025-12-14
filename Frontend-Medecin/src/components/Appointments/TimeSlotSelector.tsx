import React from 'react';
import { Clock } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface TimeSlot {
  slotId: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked: boolean;
}

interface TimeSlotSelectorProps {
  slots: TimeSlot[];
  selectedTime?: string;
  onSelect: (time: string, slotId?: string) => void;
  isLoading?: boolean;
}

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  slots,
  selectedTime,
  onSelect,
  isLoading = false,
}) => {
  const { colors } = useTheme();
  const availableSlots = slots.filter((slot) => slot.isAvailable && !slot.isBooked);

  const formatTime = (time: string): string => {
    return time;
  };

  if (isLoading) {
    return (
      <div className="text-center py-4" style={{ color: colors.text.secondary }}>
        Chargement des créneaux disponibles...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4" style={{ color: colors.text.secondary }} />
        <label className="block text-sm font-medium" style={{ color: colors.text.primary }}>
          Heure
        </label>
      </div>
      {availableSlots.length === 0 ? (
        <p className="text-sm italic" style={{ color: colors.text.secondary }}>
          Aucun créneau disponible pour cette date.
        </p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {availableSlots.map((slot) => {
            const isSelected = selectedTime === slot.startTime;
            return (
              <button
                key={slot.slotId}
                type="button"
                onClick={() => onSelect(slot.startTime, slot.slotId)}
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
                }}
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
              >
                {formatTime(slot.startTime)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

