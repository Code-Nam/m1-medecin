import React, { useEffect } from 'react';
import { usePatientStore } from '../store/patientStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useDoctorStore } from '../store/doctorStore';
import { AppointmentReminder, AppointmentCard } from '../components/Appointments';
import { Sidebar } from '../components/Layout';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

export const Dashboard = () => {
    const { currentPatient } = usePatientStore();
    const { appointments, fetchAppointments, getUpcomingAppointments, isLoading } = useAppointmentStore();
    const { doctors, fetchAllDoctors } = useDoctorStore();

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
        <div className="flex h-screen bg-gray-50 w-full">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8 w-full">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Bonjour, {currentPatient?.firstName} 👋
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Bienvenue sur votre espace patient. Voici un aperçu de vos activités.
                        </p>
                    </header>

                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500">Chargement...</div>
                    ) : (
                        <div className="space-y-8">
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">Prochain Rendez-vous</h2>
                                    <Link
                                        to="/book"
                                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        <PlusCircle className="w-4 h-4 mr-1" />
                                        Nouveau RDV
                                    </Link>
                                </div>
                                {nextAppointment ? (
                                    <AppointmentReminder appointment={nextAppointment} />
                                ) : (
                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                                        <p className="text-gray-500">Aucun rendez-vous à venir.</p>
                                        <Link to="/book" className="mt-4 inline-block text-blue-600 hover:underline">
                                            Prendre un rendez-vous
                                        </Link>
                                    </div>
                                )}
                            </section>

                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">Rendez-vous à venir</h2>
                                    <Link to="/appointments" className="text-sm text-blue-600 hover:underline">
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
                                    <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500 italic border border-dashed">
                                        {upcoming.length <= 1 ? "Pas d'autres rendez-vous prévus." : ""}
                                    </div>
                                )}
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
