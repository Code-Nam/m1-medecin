import React from 'react';
import { Appointment } from '../../types';
import { AppointmentStatus } from './AppointmentStatus';
import { formatDate, formatTime } from '../../utils/dataFormater';
import { Calendar, Clock, User } from 'lucide-react';
import { Button } from '../Common/Button';

interface AppointmentCardProps {
    appointment: Appointment;
    doctorName?: string;
    onCancel?: (id: string) => void;
    onEdit?: (id: string) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
    appointment,
    doctorName,
    onCancel,
    onEdit,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {appointment.reason}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                        <User size={16} className="mr-2" />
                        <span className="text-sm">{doctorName || 'Médecin inconnu'}</span>
                    </div>
                </div>
                <AppointmentStatus status={appointment.status} />
            </div>

            <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center text-gray-700">
                    <Calendar size={18} className="mr-2 text-blue-500" />
                    <span>{formatDate(appointment.date)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <Clock size={18} className="mr-2 text-blue-500" />
                    <span>{formatTime(appointment.time)}</span>
                </div>
            </div>

            {(onCancel || onEdit) && (
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                    {onEdit && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(appointment.appointmentId)}
                        >
                            Modifier
                        </Button>
                    )}
                    {onCancel && (
                        <Button
                            variant="danger" // Using ghost or outline for cancel usually better, but sticking to danger per prompt vibe
                            className="bg-white text-red-600 border border-red-200 hover:bg-red-50"
                            size="sm"
                            onClick={() => onCancel(appointment.appointmentId)}
                        >
                            Annuler
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};
