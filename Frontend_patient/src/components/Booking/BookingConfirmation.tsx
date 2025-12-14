import React from 'react';
import { Doctor } from '../../types';
import { formatDate, formatTime } from '../../utils/dataFormater';
import { Button } from '../Common/Button';
import { useTheme } from '../../hooks/useTheme';

interface BookingConfirmationProps {
    doctor: Doctor;
    date: string;
    time: string;
    reason: string;
    onConfirm: () => void;
    onBack: () => void;
    isLoading?: boolean;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
    doctor,
    date,
    time,
    reason,
    onConfirm,
    onBack,
    isLoading
}) => {
    const { darkMode, colors } = useTheme();

    return (
        <div className="space-y-6">
            <div 
                className="border rounded-lg p-6"
                style={{
                    backgroundColor: darkMode ? 'rgba(77, 182, 172, 0.2)' : 'rgba(67, 167, 139, 0.1)',
                    borderColor: darkMode ? 'rgba(77, 182, 172, 0.4)' : 'rgba(67, 167, 139, 0.3)'
                }}
            >
                <h3 
                    className="text-lg font-medium mb-4"
                    style={{ color: colors.accent.primary }}
                >
                    Confirmez votre rendez-vous
                </h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <dt 
                            className="text-sm font-medium"
                            style={{ color: colors.accent.primary }}
                        >
                            Médecin
                        </dt>
                        <dd 
                            className="mt-1 text-sm"
                            style={{ color: colors.text.primary }}
                        >
                            Dr. {doctor.firstName} {doctor.surname}
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt 
                            className="text-sm font-medium"
                            style={{ color: colors.accent.primary }}
                        >
                            Spécialité
                        </dt>
                        <dd 
                            className="mt-1 text-sm"
                            style={{ color: colors.text.primary }}
                        >
                            {doctor.specialization}
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt 
                            className="text-sm font-medium"
                            style={{ color: colors.accent.primary }}
                        >
                            Date
                        </dt>
                        <dd 
                            className="mt-1 text-sm"
                            style={{ color: colors.text.primary }}
                        >
                            {formatDate(date)}
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt 
                            className="text-sm font-medium"
                            style={{ color: colors.accent.primary }}
                        >
                            Heure
                        </dt>
                        <dd 
                            className="mt-1 text-sm"
                            style={{ color: colors.text.primary }}
                        >
                            {formatTime(time)}
                        </dd>
                    </div>
                    <div className="sm:col-span-2">
                        <dt 
                            className="text-sm font-medium"
                            style={{ color: colors.accent.primary }}
                        >
                            Motif
                        </dt>
                        <dd 
                            className="mt-1 text-sm"
                            style={{ color: colors.text.primary }}
                        >
                            {reason}
                        </dd>
                    </div>
                </dl>
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={onBack} disabled={isLoading}>
                    Retour
                </Button>
                <Button onClick={onConfirm} isLoading={isLoading}>
                    Confirmer le rendez-vous
                </Button>
            </div>
        </div>
    );
};
