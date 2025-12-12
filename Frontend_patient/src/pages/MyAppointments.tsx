import React, { useEffect, useState } from 'react';
import { usePatientStore } from '../store/patientStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useDoctorStore } from '../store/doctorStore';
import { AppointmentCard } from '../components/Appointments';
import { AppointmentCalendar, CalendarLegend } from '../components/Calendar';
import { Sidebar } from '../components/Layout';
import { Calendar, List } from 'lucide-react';

export const MyAppointments = () => {
    const { currentPatient } = usePatientStore();
    const { appointments, fetchAppointments, isLoading } = useAppointmentStore();
    const { doctors, fetchAllDoctors } = useDoctorStore();
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

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
        <div className="flex h-screen bg-gray-50 w-full">
            <Sidebar />
            <div className="flex-1 overflow-auto p-4 md:p-8 w-full">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                            <h1 className="text-2xl font-bold text-gray-900">Mes Rendez-vous</h1>
                            <p className="text-gray-500">Gérez vos rendez-vous passés et à venir.</p>
                        </div>
                        <div className="flex bg-gray-200 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'calendar'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Calendar size={16} className="mr-2" />
                                Calendrier
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'list'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <List size={16} className="mr-2" />
                                Liste
                            </button>
                        </div>
                    </header>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[500px]">
                        {viewMode === 'calendar' ? (
                            <>
                                <AppointmentCalendar appointments={appointments} />
                                <div className="mt-6 border-t pt-4">
                                    <CalendarLegend />
                                </div>
                            </>
                        ) : (
                            <>
                                {appointments.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">Vous n'avez aucun rendez-vous.</p>
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
            </div>
        </div>
    );
};
