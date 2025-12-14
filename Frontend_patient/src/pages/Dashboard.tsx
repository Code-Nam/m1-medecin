import React, { useEffect } from 'react';
import { usePatientStore } from '../store/patientStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useDoctorStore } from '../store/doctorStore';
import { AppointmentReminder, AppointmentCard } from '../components/Appointments';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

export const Dashboard = () => {
    const { currentPatient } = usePatientStore();
    const { appointments, fetchAppointments, getUpcomingAppointments, isLoading } = useAppointmentStore();
    const { doctors, fetchAllDoctors } = useDoctorStore();
    const { colors } = useTheme();

    useEffect(() => {
        if (currentPatient) {
            fetchAppointments(currentPatient.patientId);
            fetchAllDoctors();
        }
    }, [currentPatient, fetchAppointments, fetchAllDoctors]);

    const upcoming = getUpcomingAppointments();
    const nextAppointment = upcoming.length > 0 ? upcoming[0] : undefined;

    // Display contextually relevant upcoming appointments (excluding the immediate next one if desired, or just list a few)
    // Showing the next 3 upcoming appointments
    const displayAppointments = upcoming.slice(1, 4);

    const getDoctorName = (doctorId: string) => {
        const doc = doctors.find(d => d.doctorId === doctorId);
        return doc ? `Dr. ${doc.surname}` : 'Médecin inconnu';
    };

    return (
        <div className="max-w-4xl mx-auto">
                    <header className="mb-8">
                        <h1 
                            className="text-3xl font-bold"
                            style={{ color: colors.text.primary }}
                        >
                            Bonjour, {currentPatient?.firstName} 👋
                        </h1>
                        <p 
                            className="mt-2"
                            style={{ color: colors.text.secondary }}
                        >
                            Bienvenue sur votre espace patient. Voici un aperçu de vos activités.
                        </p>
                    </header>

                    {isLoading ? (
                        <div 
                            className="p-8 text-center"
                            style={{ color: colors.text.secondary }}
                        >
                            Chargement...
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 
                                        className="text-xl font-semibold"
                                        style={{ color: colors.text.primary }}
                                    >
                                        Prochain Rendez-vous
                                    </h2>
                                    <Link
                                        to="/book"
                                        className="inline-flex items-center text-sm font-medium transition-colors"
                                        style={{ color: colors.accent.primary }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = colors.accent.hover;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = colors.accent.primary;
                                        }}
                                    >
                                        <PlusCircle className="w-4 h-4 mr-1" />
                                        Nouveau RDV
                                    </Link>
                                </div>
                                {nextAppointment ? (
                                    <AppointmentReminder appointment={nextAppointment} />
                                ) : (
                                    <div 
                                        className="p-6 rounded-lg shadow-sm border text-center"
                                        style={{
                                            backgroundColor: colors.bg.card,
                                            borderColor: colors.border.default
                                        }}
                                    >
                                        <p style={{ color: colors.text.secondary }}>
                                            Aucun rendez-vous à venir.
                                        </p>
                                        <Link 
                                            to="/book" 
                                            className="mt-4 inline-block transition-colors"
                                            style={{ color: colors.accent.primary }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.textDecoration = 'underline';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.textDecoration = 'none';
                                            }}
                                        >
                                            Prendre un rendez-vous
                                        </Link>
                                    </div>
                                )}
                            </section>

                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 
                                        className="text-xl font-semibold"
                                        style={{ color: colors.text.primary }}
                                    >
                                        Rendez-vous à venir
                                    </h2>
                                    <Link 
                                        to="/appointments" 
                                        className="text-sm transition-colors"
                                        style={{ color: colors.accent.primary }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.textDecoration = 'underline';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.textDecoration = 'none';
                                        }}
                                    >
                                        Voir tout
                                    </Link>
                                </div>

                                {displayAppointments.length > 0 ? (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {displayAppointments.map(appt => (
                                            <AppointmentCard
                                                key={appt.appointmentId}
                                                appointment={appt}
                                                doctorName={getDoctorName(appt.appointedDoctor)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div 
                                        className="rounded-lg p-6 text-center italic border border-dashed"
                                        style={{
                                            backgroundColor: colors.bg.secondary,
                                            color: colors.text.secondary,
                                            borderColor: colors.border.default
                                        }}
                                    >
                                        {upcoming.length <= 1 ? "Pas d'autres rendez-vous prévus." : ""}
                                    </div>
                                )}
                            </section>
                        </div>
                    )}
                </div>
    );
};
