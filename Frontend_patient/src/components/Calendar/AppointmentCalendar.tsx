import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Appointment, AppointmentStatus } from '../../types';
import './calendar.css'; // We will create this for any custom overrides if needed

interface AppointmentCalendarProps {
    appointments: Appointment[];
    onSelectSlot?: (date: Date) => void;
    onEventClick?: (appointmentId: string) => void;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
    appointments,
    onSelectSlot,
    onEventClick,
}) => {
    const getEventColor = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.CONFIRMED:
                return '#22c55e'; // green-500
            case AppointmentStatus.PENDING:
                return '#eab308'; // yellow-500
            case AppointmentStatus.CANCELLED:
                return '#ef4444'; // red-500
            case AppointmentStatus.DOCTOR_CREATED:
                return '#3b82f6'; // blue-500
            default:
                return '#6b7280'; // gray-500
        }
    };

    const events = appointments.map((appt) => ({
        id: appt.appointmentId,
        title: appt.reason,
        start: `${appt.date}T${appt.time}`,
        backgroundColor: getEventColor(appt.status),
        borderColor: getEventColor(appt.status),
        extendedProps: {
            status: appt.status,
            doctorId: appt.appointedDoctor,
        },
    }));

    return (
        <div className="calendar-container p-4 bg-white rounded-lg shadow border border-gray-200">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                eventClick={(info) => {
                    if (onEventClick) {
                        onEventClick(info.event.id);
                    }
                }}
                dateClick={(info) => {
                    if (onSelectSlot) {
                        onSelectSlot(info.date);
                    }
                }}
                locale="fr"
                buttonText={{
                    today: "Aujourd'hui",
                    month: 'Mois',
                    week: 'Semaine',
                    day: 'Jour',
                    list: 'Liste'
                }}
                height="auto"
                aspectRatio={1.5}
            />
        </div>
    );
};
