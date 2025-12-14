import React from 'react';
import { Appointment } from '../../types';
import { AppointmentStatus } from './AppointmentStatus';
import { formatDate, formatTime } from '../../utils/dataFormater';
import { Calendar, Clock, User } from 'lucide-react';
import { Button } from '../Common/Button';
import { useTheme } from '../../hooks/useTheme';

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
    const { colors } = useTheme();

    return (
        <div 
            className="rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
            style={{
                backgroundColor: colors.bg.card,
                borderColor: colors.border.default
            }}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 
                        className="text-lg font-semibold mb-1"
                        style={{ color: colors.text.primary }}
                    >
                        {appointment.reason}
                    </h3>
                    <div 
                        className="flex items-center mb-2"
                        style={{ color: colors.text.secondary }}
                    >
                        <User size={16} className="mr-2" />
                        <span className="text-sm">{doctorName || 'Médecin inconnu'}</span>
                    </div>
                </div>
                <AppointmentStatus status={appointment.status} />
            </div>

            <div className="flex items-center gap-6 mb-6">
                <div 
                    className="flex items-center"
                    style={{ color: colors.text.primary }}
                >
                    <Calendar size={18} className="mr-2" style={{ color: colors.accent.primary }} />
                    <span>{formatDate(appointment.date)}</span>
                </div>
                <div 
                    className="flex items-center"
                    style={{ color: colors.text.primary }}
                >
                    <Clock size={18} className="mr-2" style={{ color: colors.accent.primary }} />
                    <span>{formatTime(appointment.time)}</span>
                </div>
            </div>

            {(onCancel || onEdit) && (
                <div 
                    className="flex gap-3 justify-end pt-4 border-t"
                    style={{ borderColor: colors.border.default }}
                >
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
                            variant="danger"
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
