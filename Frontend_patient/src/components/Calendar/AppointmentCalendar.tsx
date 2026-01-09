import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Appointment, AppointmentStatus } from '../../types';
import { useTheme } from '../../hooks/useTheme';
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
    const { darkMode, colors } = useTheme();

    const getEventColor = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.CONFIRMED:
                return colors.semantic.success; // Teal - Palette IIM
            case AppointmentStatus.PENDING:
                return colors.semantic.warning; // Jaune - Palette IIM
            case AppointmentStatus.CANCELLED:
                return colors.semantic.danger; // Rouge - Palette IIM
            case AppointmentStatus.DOCTOR_CREATED:
                return colors.semantic.success; // Teal - Palette IIM
            default:
                return colors.text.secondary; // Texte secondaire - Palette IIM
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
        <div 
            className="rounded-xl shadow-sm border p-4 lg:p-6"
            style={{
                backgroundColor: colors.bg.card,
                borderColor: colors.border.default
            }}
            role="region"
            aria-label="Calendrier des rendez-vous"
        >
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                locale="fr"
                firstDay={1}
                buttonText={{
                    today: "Aujourd'hui",
                    month: 'Mois',
                    week: 'Semaine',
                    day: 'Jour',
                    list: 'Liste'
                }}
                events={events}
                dateClick={(info) => {
                    if (onSelectSlot) {
                        onSelectSlot(info.date);
                    }
                }}
                eventClick={(info) => {
                    if (onEventClick) {
                        onEventClick(info.event.id);
                    }
                }}
                selectable={true}
                editable={false}
                eventDisplay="block"
                dayMaxEvents={3}
                moreLinkText={(n) => `+${n} autres`}
                slotMinTime="08:00:00"
                slotMaxTime="19:00:00"
                allDaySlot={false}
                slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }}
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }}
                height="auto"
                aspectRatio={1.8}
                eventClassNames="cursor-pointer transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2"
                dayCellClassNames="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                navLinks={true}
                navLinkDayClick="timeGridDay"
                dayMaxEventRows={true}
                views={{
                    dayGridMonth: {
                        titleFormat: { year: 'numeric', month: 'long' }
                    },
                    timeGridWeek: {
                        titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
                    },
                    timeGridDay: {
                        titleFormat: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
                    }
                }}
            />
        </div>
    );
};
