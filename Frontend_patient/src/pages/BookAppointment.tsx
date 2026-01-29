import React from 'react';
import { usePatientStore } from '../store/patientStore';
import { BookingForm } from '../components/Booking';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';

export const BookAppointment = () => {
    const { currentPatient } = usePatientStore();
    const { colors } = useTheme();
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/appointments');
    };

    if (!currentPatient) return <div>Veuillez vous connecter.</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <div
                className="rounded-lg shadow-sm border p-6 focus:outline-none focus:ring-2 focus:ring-offset-2"
                tabIndex={-1}
                role="main"
                aria-label="Réservation de rendez-vous"
                style={{
                    backgroundColor: colors.bg.card,
                    borderColor: colors.border.default
                }}
            >
                <BookingForm patientId={currentPatient.patientId} onSuccess={handleSuccess} />
            </div>
        </div>
    );
};
