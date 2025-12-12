import React, { useState, useEffect } from 'react';
import { useDoctorStore } from '../../store/doctorStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import { DoctorSelector } from './DoctorSelector';
import { TimeSlotSelector } from './TimeSlotSelector';
import { BookingConfirmation } from './BookingConfirmation';
import { Button } from '../Common/Button';
import { Doctor } from '../../types';

interface BookingFormProps {
    patientId: string;
    onSuccess: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ patientId, onSuccess }) => {
    const { doctors, fetchAllDoctors, isLoading: doctorsLoading } = useDoctorStore();
    const { createAppointment, isLoading: bookingLoading } = useAppointmentStore();

    const [step, setStep] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default today
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        fetchAllDoctors();
    }, [fetchAllDoctors]);

    const handleDoctorSelect = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setStep(2);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
    };

    const handleNextToConfirm = () => {
        if (selectedDoctor && selectedTime && reason) {
            setStep(3);
        }
    };

    const handleConfirm = async () => {
        if (!selectedDoctor || !selectedTime) return;

        try {
            await createAppointment({
                appointedPatient: patientId,
                appointedDoctor: selectedDoctor.doctorId,
                date: selectedDate,
                time: selectedTime,
                reason: reason,
                status: 'pending' as any, // Using string literal or import Enum
            });
            onSuccess();
        } catch (error) {
            console.error('Booking failed', error);
        }
    };

    if (doctorsLoading) return <div>Chargement des médecins...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Progress Indicator could go here */}

            {step === 1 && (
                <DoctorSelector
                    doctors={doctors}
                    selectedDoctorId={selectedDoctor?.doctorId}
                    onSelect={handleDoctorSelect}
                />
            )}

            {step === 2 && selectedDoctor && (
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <p className="text-sm text-gray-700">Médecin sélectionné: <strong>Dr. {selectedDoctor.surname}</strong></p>
                        <button onClick={() => setStep(1)} className="text-blue-600 text-xs hover:underline">Modifier</button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date du rendez-vous</label>
                        <input
                            type="date"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* Ideally we fetch slots for this date here. For now using doctor.availableSlots from store if static, 
              or we assume slots are daily repetitive for this simple version. 
              In real app, we'd fetch slots by doctor and date. */}
                    <TimeSlotSelector
                        slots={selectedDoctor.availableSlots || []}
                        selectedTime={selectedTime}
                        onSelect={handleTimeSelect}
                    />

                    <div className="pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Motif du rendez-vous</label>
                        <textarea
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Ex: Consultation de routine, Mal de dos..."
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleNextToConfirm}
                            disabled={!selectedTime || !reason}
                        >
                            Continuer
                        </Button>
                    </div>
                </div>
            )}

            {step === 3 && selectedDoctor && (
                <BookingConfirmation
                    doctor={selectedDoctor}
                    date={selectedDate}
                    time={selectedTime}
                    reason={reason}
                    onConfirm={handleConfirm}
                    onBack={() => setStep(2)}
                    isLoading={bookingLoading}
                />
            )}
        </div>
    );
};
