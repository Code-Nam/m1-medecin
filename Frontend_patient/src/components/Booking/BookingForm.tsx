import React, { useState, useEffect } from 'react';
import { useDoctorStore } from '../../store/doctorStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import { DoctorSelector } from './DoctorSelector';
import { TimeSlotSelector } from './TimeSlotSelector';
import { BookingConfirmation } from './BookingConfirmation';
import { Button } from '../Common/Button';
import { useTheme } from '../../hooks/useTheme';
import type { Doctor, AppointmentSlot } from '../../types';
import { doctorService } from '../../services';

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
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0] || ''); // Default today
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [reason, setReason] = useState('');

    const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([]);
    const [slotsLoading, setSlotsLoading] = useState(false);

    useEffect(() => {
        fetchAllDoctors();
    }, [fetchAllDoctors]);

    useEffect(() => {
        const fetchSlots = async () => {
            if (selectedDoctor && selectedDate) {
                setSlotsLoading(true);
                try {
                    const slots = await doctorService.getAvailableSlots(selectedDoctor.doctorId, selectedDate);
                    // Map API slots to AppointmentSlot type
                    const mappedSlots: AppointmentSlot[] = slots.map((s: any) => ({
                        time: s.startTime,
                        available: !s.isBooked,
                        doctorId: s.doctorId,
                        slotId: s.id
                    }));
                    setAvailableSlots(mappedSlots);
                } catch (error) {
                    console.error('Error fetching slots:', error);
                    setAvailableSlots([]);
                } finally {
                    setSlotsLoading(false);
                }
            } else {
                setAvailableSlots([]);
            }
        };

        fetchSlots();
    }, [selectedDoctor, selectedDate]);

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

    if (doctorsLoading) return (
        <div role="status" aria-live="polite" aria-busy="true">
            Chargement des médecins...
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Progress Indicator */}
            <nav aria-label="Progression de la prise de rendez-vous">
                <ol className="flex items-center justify-center gap-2 mb-6">
                    <li className={`px-3 py-1 rounded ${step >= 1 ? 'font-semibold' : ''}`}
                        style={{
                            backgroundColor: step >= 1 ? colors.accent.primary : colors.bg.secondary,
                            color: step >= 1 ? '#FFFFFF' : colors.text.secondary
                        }}
                        aria-current={step === 1 ? 'step' : undefined}>
                        1. Médecin
                    </li>
                    <li className={`px-3 py-1 rounded ${step >= 2 ? 'font-semibold' : ''}`}
                        style={{
                            backgroundColor: step >= 2 ? colors.accent.primary : colors.bg.secondary,
                            color: step >= 2 ? '#FFFFFF' : colors.text.secondary
                        }}
                        aria-current={step === 2 ? 'step' : undefined}>
                        2. Date & Heure
                    </li>
                    <li className={`px-3 py-1 rounded ${step >= 3 ? 'font-semibold' : ''}`}
                        style={{
                            backgroundColor: step >= 3 ? colors.accent.primary : colors.bg.secondary,
                            color: step >= 3 ? '#FFFFFF' : colors.text.secondary
                        }}
                        aria-current={step === 3 ? 'step' : undefined}>
                        3. Confirmation
                    </li>
                </ol>
            </nav>

            {step === 1 && (
                <DoctorSelector
                    doctors={doctors}
                    selectedDoctorId={selectedDoctor?.doctorId}
                    onSelect={handleDoctorSelect}
                />
            )}

            {step === 2 && selectedDoctor && (
                <form className="space-y-6" aria-label="Sélection de la date et de l'heure du rendez-vous">
                    <div
                        className="p-4 rounded-md mb-4"
                        style={{ backgroundColor: colors.bg.secondary }}
                        role="status"
                        aria-live="polite"
                    >
                        <p
                            className="text-sm"
                            style={{ color: colors.text.primary }}
                        >
                            Médecin sélectionné: <strong>Dr. {selectedDoctor.surname}</strong>
                        </p>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded px-2 py-1"
                            style={{
                                color: colors.accent.primary,
                                '--tw-ring-color': colors.accent.primary
                            } as React.CSSProperties}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.textDecoration = 'none';
                            }}
                            aria-label="Modifier la sélection du médecin"
                        >
                            <span aria-hidden="true">Modifier</span>
                        </button>
                    </div>

                    <fieldset>
                        <legend className="sr-only">Informations de rendez-vous</legend>
                        <div>
                            <label
                                htmlFor="appointment-date"
                                className="block text-sm font-medium mb-1"
                                style={{ color: colors.text.secondary }}
                            >
                                Date du rendez-vous <span className="text-red-500" aria-hidden="true">*</span>
                            </label>
                            <input
                                id="appointment-date"
                                type="date"
                                required
                                className="block w-full rounded-md shadow-sm sm:text-sm p-2 border"
                                style={{
                                    backgroundColor: colors.bg.card,
                                    color: colors.text.primary,
                                    borderColor: colors.border.default
                                }}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
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
                                aria-required="true"
                            />
                        </div>
                    </fieldset>

                    {/* Slots are now fetched dynamically */}
                    {slotsLoading ? (
                        <div className="text-center py-4">Chargement des créneaux...</div>
                    ) : (
                        <TimeSlotSelector
                            slots={availableSlots}
                            selectedTime={selectedTime}
                            onSelect={handleTimeSelect}
                        />
                    )}

                    <div className="pt-4">
                        <label
                            htmlFor="appointment-reason"
                            className="block text-sm font-medium mb-1"
                            style={{ color: colors.text.secondary }}
                        >
                            Motif du rendez-vous <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <textarea
                            id="appointment-reason"
                            required
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
                            aria-required="true"
                            aria-describedby="reason-help"
                        />
                        <p id="reason-help" className="text-xs mt-1" style={{ color: colors.text.muted }}>
                            Décrivez brièvement la raison de votre consultation
                        </p>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="button"
                            onClick={handleNextToConfirm}
                            disabled={!selectedTime || !reason}
                            aria-label="Continuer vers la confirmation"
                        >
                            Continuer
                        </Button>
                    </div>
                </form>
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
