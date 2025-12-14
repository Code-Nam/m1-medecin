import React from 'react';
import { Appointment } from '../../types';
import { Bell } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dataFormater';

interface AppointmentReminderProps {
    appointment: Appointment | undefined;
}

export const AppointmentReminder: React.FC<AppointmentReminderProps> = ({ appointment }) => {
    if (!appointment) return null;

    return (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md shadow-sm mb-6">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <Bell className="h-5 w-5 text-blue-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800">Prochain Rendez-vous</p>
                    <div className="mt-1 text-sm text-blue-700">
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
