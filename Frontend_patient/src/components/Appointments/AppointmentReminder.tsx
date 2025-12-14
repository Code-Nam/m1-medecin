import React from 'react';
import { Appointment } from '../../types';
import { Bell } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dataFormater';
import { useTheme } from '../../hooks/useTheme';

interface AppointmentReminderProps {
    appointment: Appointment | undefined;
}

export const AppointmentReminder: React.FC<AppointmentReminderProps> = ({ appointment }) => {
    const { darkMode, colors } = useTheme();

    if (!appointment) return null;

    return (
        <div 
            className="border-l-4 p-4 rounded-r-md shadow-sm mb-6"
            style={{
                backgroundColor: darkMode ? 'rgba(77, 182, 172, 0.2)' : 'rgba(67, 167, 139, 0.1)',
                borderColor: colors.accent.primary
            }}
        >
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <Bell 
                        className="h-5 w-5" 
                        style={{ color: colors.accent.primary }} 
                        aria-hidden="true" 
                    />
                </div>
                <div className="ml-3">
                    <p 
                        className="text-sm font-medium"
                        style={{ color: colors.accent.primary }}
                    >
                        Prochain Rendez-vous
                    </p>
                    <div 
                        className="mt-1 text-sm"
                        style={{ color: colors.accent.primary }}
                    >
                        <p>
                            Le <span className="font-semibold">{formatDate(appointment.date)}</span> à{' '}
                            <span className="font-semibold">{formatTime(appointment.time)}</span>
                        </p>
                        <p className="mt-1">Motif: {appointment.reason}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
