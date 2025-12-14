import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAppointmentStore } from '../../stores/appointmentStore';
import { useDoctor } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { useTheme } from '../../hooks/useTheme';
import { getPatientName } from '../../utils/mockData';

export const CalendarView: React.FC = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const doctor = useDoctor();
  const { getAppointmentsForCalendar, selectAppointment, setSelectedDate } = useAppointmentStore();
  const { openModal } = useUIStore();
  const { colors } = useTheme();

  const events = doctor ? getAppointmentsForCalendar(doctor.id) : [];

  const enrichedEvents = events.map(event => ({
    ...event,
    title: `${event.extendedProps.time} - ${getPatientName(event.extendedProps.appointedPatient)}`
  }));

  const handleDateClick = (info: any) => {
    setSelectedDate(info.date);
    openModal('createAppointment', { date: info.dateStr });
  };

  const handleEventClick = (info: any) => {
    const appointment = info.event.extendedProps;
    selectAppointment({
      appointmentId: info.event.id,
      ...appointment
    });
    openModal('editAppointment', appointment);
  };

  const handleDateSelect = (info: any) => {
    openModal('createAppointment', {
      date: info.startStr.split('T')[0],
      time: info.startStr.includes('T') ? info.startStr.split('T')[1].substring(0, 5) : '09:00'
    });
  };

  return (
    <div 
      className="rounded-xl shadow-sm border p-4 lg:p-6"
      style={{
        backgroundColor: colors.bg.card,
        borderColor: colors.border.default
      }}
    >
      <FullCalendar
        ref={calendarRef}
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
          day: 'Jour'
        }}
        events={enrichedEvents}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        selectable={true}
        select={handleDateSelect}
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
        eventClassNames="cursor-pointer transition-transform hover:scale-[1.02]"
        dayCellClassNames="cursor-pointer transition-colors"
      />
    </div>
  );
};

export default CalendarView;

