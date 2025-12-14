import React, { useState, useEffect } from 'react';
import { useDoctorStore } from '../../store/doctorStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import { doctorService } from '../../services/doctorService';
import { DoctorSelector } from './DoctorSelector';
import { TimeSlotSelector } from './TimeSlotSelector';
import { BookingConfirmation } from './BookingConfirmation';
import { Button } from '../Common/Button';
import { useTheme } from '../../hooks/useTheme';
import { Doctor, AppointmentSlot } from '../../types';

interface BookingFormProps {
    patientId: string;
    onSuccess: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ patientId, onSuccess }) => {
    const { doctors, fetchAllDoctors, isLoading: doctorsLoading } = useDoctorStore();
    const { createAppointment, isLoading: bookingLoading } = useAppointmentStore();
    const { colors } = useTheme();

    const [step, setStep] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default today
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [reason, setReason] = useState('');
    const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    useEffect(() => {
        fetchAllDoctors();
    }, [fetchAllDoctors]);

    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            fetchAvailableSlots(selectedDoctor.doctorId, selectedDate);
        } else {
            setAvailableSlots([]);
        }
    }, [selectedDoctor, selectedDate]);

    const fetchAvailableSlots = async (doctorId: string, date: string) => {
        setLoadingSlots(true);
        try {
            const response = await doctorService.getAvailableSlots(doctorId, date);
            const slots: AppointmentSlot[] = (response.slots || []).map((slot: any) => ({
                time: slot.startTime,
                available: slot.isAvailable && !slot.isBooked,
                slotId: slot.slotId,
            }));
            setAvailableSlots(slots);
        } catch (error) {
            setAvailableSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleDoctorSelect = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setStep(2);
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setSelectedTime(''); // Réinitialiser l'heure sélectionnée quand la date change
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
                appointedPatientId: patientId,
                appointedDoctorId: selectedDoctor.doctorId,
                date: selectedDate,
                time: selectedTime,
                reason: reason,
            });
            onSuccess();
        } catch (error) {
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
                    <div 
                        className="p-4 rounded-md mb-4"
                        style={{ backgroundColor: colors.bg.secondary }}
                    >
                        <p 
                            className="text-sm"
                            style={{ color: colors.text.primary }}
                        >
                            Médecin sélectionné: <strong>Dr. {selectedDoctor.surname}</strong>
                        </p>
                        <button 
                            onClick={() => setStep(1)} 
                            className="text-xs transition-colors"
                            style={{ color: colors.accent.primary }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.textDecoration = 'none';
                            }}
                        >
                            Modifier
                        </button>
                    </div>

                    <div>
                        <label 
                            className="block text-sm font-medium mb-1"
                            style={{ color: colors.text.secondary }}
                        >
                            Date du rendez-vous
                        </label>
                        <input
                            type="date"
                            className="block w-full rounded-md shadow-sm sm:text-sm p-2 border"
                            style={{
                                backgroundColor: colors.bg.card,
                                color: colors.text.primary,
                                borderColor: colors.border.default
                            }}
                            value={selectedDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = colors.accent.primary;
                                e.currentTarget.style.outline = `2px solid ${colors.accent.primary}`;
                                e.currentTarget.style.outlineOffset = '2px';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = colors.border.default;
                                e.currentTarget.style.outline = 'none';
                            }}
                        />
                    </div>

                    <div>
                        <label 
                            className="block text-sm font-medium mb-1"
                            style={{ color: colors.text.secondary }}
                        >
                            2. Choisissez un créneau
                        </label>
                        {loadingSlots ? (
                            <div className="text-sm italic" style={{ color: colors.text.secondary }}>
                                Chargement des créneaux...
                            </div>
                        ) : availableSlots.length === 0 ? (
                            <div className="text-sm italic" style={{ color: colors.text.secondary }}>
                                Aucun créneau disponible.
                            </div>
                        ) : (
                            <TimeSlotSelector
                                slots={availableSlots}
                                selectedTime={selectedTime}
                                onSelect={handleTimeSelect}
                            />
                        )}
                    </div>

                    <div className="pt-4">
                        <label 
                            className="block text-sm font-medium mb-1"
                            style={{ color: colors.text.secondary }}
                        >
                            Motif du rendez-vous
                        </label>
                        <textarea
                            className="block w-full rounded-md shadow-sm sm:text-sm p-2 border"
                            style={{
                                backgroundColor: colors.bg.card,
                                color: colors.text.primary,
                                borderColor: colors.border.default
                            }}
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Ex: Consultation de routine, Mal de dos..."
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = colors.accent.primary;
                                e.currentTarget.style.outline = `2px solid ${colors.accent.primary}`;
                                e.currentTarget.style.outlineOffset = '2px';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = colors.border.default;
                                e.currentTarget.style.outline = 'none';
                            }}
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
