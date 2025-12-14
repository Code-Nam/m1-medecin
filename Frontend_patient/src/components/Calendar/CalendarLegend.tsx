import React from 'react';
import { AppointmentStatus } from '../../types';

export const CalendarLegend = () => {
    const items = [
        { label: 'Confirmé', color: 'bg-green-500', status: AppointmentStatus.CONFIRMED },
        { label: 'En attente', color: 'bg-yellow-500', status: AppointmentStatus.PENDING },
        { label: 'Proposé', color: 'bg-blue-500', status: AppointmentStatus.DOCTOR_CREATED },
        // Cancelled often not shown or shown in red
        { label: 'Annulé', color: 'bg-red-500', status: AppointmentStatus.CANCELLED },
    ];

    return (
        <div className="flex flex-wrap gap-4 p-4 bg-white border rounded-lg shadow-sm">
            <span className="text-sm font-medium text-gray-700">Légende :</span>
            {items.map((item) => (
                <div key={item.status} className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${item.color}`}></span>
                    <span className="text-sm text-gray-600">{item.label}</span>
                </div>
            ))}
        </div>
    );
};
