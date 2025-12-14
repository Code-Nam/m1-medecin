import React, { useEffect, useState } from 'react';
import { usePatientStore } from '../store/patientStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useDoctorStore } from '../store/doctorStore';
import { AppointmentCard } from '../components/Appointments';
import { AppointmentCalendar, CalendarLegend } from '../components/Calendar';
import { useTheme } from '../hooks/useTheme';
import { Calendar, List } from 'lucide-react';

export const MyAppointments = () => {
    const { currentPatient } = usePatientStore();
    const { appointments, fetchAppointments, isLoading } = useAppointmentStore();
    const { doctors, fetchAllDoctors } = useDoctorStore();
    const { darkMode, colors } = useTheme();
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');

    useEffect(() => {
        if (currentPatient) {
            fetchAppointments(currentPatient.patientId);
            fetchAllDoctors();
        }
    }, [currentPatient, fetchAppointments, fetchAllDoctors]);

    const getDoctorName = (doctorId: string) => {
        const doc = doctors.find(d => d.doctorId === doctorId);
        return doc ? `Dr. ${doc.surname}` : 'Médecin inconnu';
    };

    if (isLoading) {
        return <div className="p-8 text-center">Chargement...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto">
                    <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                            <h1 
                                className="text-2xl font-bold"
                                style={{ color: colors.text.primary }}
                            >
                                Mes Rendez-vous
                            </h1>
                            <p 
                                style={{ color: colors.text.secondary }}
                            >
                                Gérez vos rendez-vous passés et à venir.
                            </p>
                        </div>
                        <div 
                            className="flex p-1 rounded-lg"
                            style={{ backgroundColor: colors.border.light }}
                        >
                            <button
                                onClick={() => setViewMode('calendar')}
                                className="flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all"
                                style={{
                                    backgroundColor: viewMode === 'calendar' ? colors.bg.card : 'transparent',
                                    color: viewMode === 'calendar' ? colors.accent.primary : colors.text.secondary,
                                    boxShadow: viewMode === 'calendar' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (viewMode !== 'calendar') {
                                        e.currentTarget.style.color = colors.text.primary;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (viewMode !== 'calendar') {
                                        e.currentTarget.style.color = colors.text.secondary;
                                    }
                                }}
                            >
                                <Calendar size={16} className="mr-2" />
                                Calendrier
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className="flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all"
                                style={{
                                    backgroundColor: viewMode === 'list' ? colors.bg.card : 'transparent',
                                    color: viewMode === 'list' ? colors.accent.primary : colors.text.secondary,
                                    boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (viewMode !== 'list') {
                                        e.currentTarget.style.color = colors.text.primary;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (viewMode !== 'list') {
                                        e.currentTarget.style.color = colors.text.secondary;
                                    }
                                }}
                            >
                                <List size={16} className="mr-2" />
                                Liste
                            </button>
                        </div>
                    </header>

                    <div 
                        className="rounded-lg shadow-sm border p-6 min-h-[500px]"
                        style={{
                            backgroundColor: colors.bg.card,
                            borderColor: colors.border.default
                        }}
                    >
                        {viewMode === 'calendar' ? (
                            <>
                                <AppointmentCalendar appointments={appointments} />
                                <div 
                                    className="mt-6 border-t pt-4"
                                    style={{ borderColor: colors.border.default }}
                                >
                                    <CalendarLegend />
                                </div>
                            </>
                        ) : (
                            <>
                                {appointments.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p style={{ color: colors.text.secondary }}>
                                            Vous n'avez aucun rendez-vous.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                        {appointments.map((appt) => (
                                            <AppointmentCard
                                                key={appt.appointmentId}
                                                appointment={appt}
                                                doctorName={getDoctorName(appt.appointedDoctor)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
        </div>
    );
};
