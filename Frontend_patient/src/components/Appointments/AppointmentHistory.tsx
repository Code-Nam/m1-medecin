import React from 'react';
import { Appointment } from '../../types';
import { AppointmentCard } from './AppointmentCard';

interface AppointmentHistoryProps {
    appointments: Appointment[];
    getDoctorName: (id: string) => string;
}

export const AppointmentHistory: React.FC<AppointmentHistoryProps> = ({
    appointments,
    getDoctorName,
}) => {
    if (appointments.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">Aucun historique de rendez-vous.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Historique</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                {appointments.map((appt) => (
                    <AppointmentCard
                        key={appt.appointmentId}
                        appointment={appt}
                        doctorName={getDoctorName(appt.appointedDoctor)}
                    />
                ))}
            </div>
        </div>
    );
};
