import React from 'react';
import { AppointmentSlot } from '../../types';
import { formatTime } from '../../utils/dataFormater';

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
    const availableSlots = slots.filter((slot) => slot.available);

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">2. Choisissez un créneau</h3>
            {availableSlots.length === 0 ? (
                <p className="text-gray-500 italic">Aucun créneau disponible.</p>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {availableSlots.map((slot) => (
                        <button
                            key={slot.time}
                            onClick={() => onSelect(slot.time)}
                            className={`py-2 px-3 text-sm font-medium rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${selectedTime === slot.time
                                    ? 'bg-blue-600 text-white border-blue-600 focus:ring-blue-500'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-gray-500'
                                }`}
                            type="button"
                        >
                            {formatTime(slot.time)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
