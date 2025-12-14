import React from 'react';
import { usePatientStore } from '../store/patientStore';
import { BookingForm } from '../components/Booking';
import { Sidebar } from '../components/Layout';
import { useNavigate } from 'react-router-dom';

export const BookAppointment = () => {
    const { currentPatient } = usePatientStore();
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/appointments');
    };

    if (!currentPatient) return <div>Veuillez vous connecter.</div>;

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-3xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Prendre un Rendez-vous</h1>
                        <p className="text-gray-500">Sélectionnez un médecin et un créneau horaire.</p>
                    </header>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <BookingForm patientId={currentPatient.patientId} onSuccess={handleSuccess} />
                    </div>
                </div>
            </div>
        </div>
    );
};
