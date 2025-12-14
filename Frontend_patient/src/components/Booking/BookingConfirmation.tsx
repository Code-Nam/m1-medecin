import React from 'react';
import { Doctor } from '../../types';
import { formatDate, formatTime } from '../../utils/dataFormater';
import { Button } from '../Common/Button';

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
    return (
        <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-green-800 mb-4">Confirmez votre rendez-vous</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-green-700">Médecin</dt>
                        <dd className="mt-1 text-sm text-green-900">Dr. {doctor.firstName} {doctor.surname}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-green-700">Spécialité</dt>
                        <dd className="mt-1 text-sm text-green-900">{doctor.specialization}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-green-700">Date</dt>
                        <dd className="mt-1 text-sm text-green-900">{formatDate(date)}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-green-700">Heure</dt>
                        <dd className="mt-1 text-sm text-green-900">{formatTime(time)}</dd>
                    </div>
                    <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-green-700">Motif</dt>
                        <dd className="mt-1 text-sm text-green-900">{reason}</dd>
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
