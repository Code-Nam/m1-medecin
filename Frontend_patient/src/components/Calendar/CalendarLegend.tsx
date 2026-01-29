import React from 'react';
import { AppointmentStatus } from '../../types';
import { useTheme } from '../../hooks/useTheme';

export const CalendarLegend = () => {
    const { colors } = useTheme();

    const items = [
        { label: 'Confirmé', color: colors.semantic.success, status: AppointmentStatus.CONFIRMED },
        { label: 'En attente', color: colors.semantic.warning, status: AppointmentStatus.PENDING },
        { label: 'Proposé', color: colors.semantic.success, status: AppointmentStatus.DOCTOR_CREATED },
        // Cancelled often not shown or shown in red
        { label: 'Annulé', color: colors.semantic.danger, status: AppointmentStatus.CANCELLED },
    ];

    return (
        <div 
            className="flex flex-wrap gap-4 p-4 border rounded-lg shadow-sm"
            style={{
                backgroundColor: colors.bg.card,
                borderColor: colors.border.default
            }}
        >
            <span 
                className="text-sm font-medium"
                style={{ color: colors.text.primary }}
            >
                Légende :
            </span>
            {items.map((item) => (
                <div key={item.status} className="flex items-center">
                    <span 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                    ></span>
                    <span 
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                    >
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};
