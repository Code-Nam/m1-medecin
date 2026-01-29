import React from 'react';
import { Plus, Filter } from 'lucide-react';
import { CalendarView } from '../components/Calendar/CalendarView';
import { CalendarModal } from '../components/Calendar/CalendarModal';
import { DayViewTable } from '../components/Calendar/DayViewTable';
import { useUIStore } from '../stores/uiStore';
import { useTheme } from '../hooks/useTheme';
import Button from '../components/Common/Button';

export const CalendarPage: React.FC = () => {
  const { openModal } = useUIStore();
  const { colors } = useTheme();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 
            className="text-2xl font-bold"
            style={{ color: colors.text.primary }}
          >
            Calendrier
          </h2>
          <p 
            className="text-sm"
            style={{ color: colors.text.secondary }}
          >
            Gérez vos rendez-vous
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => openModal('createAppointment')}
            aria-label="Créer un nouveau rendez-vous"
          >
            Nouveau RDV
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-3">
          <CalendarView />
        </div>

        {/* Day view */}
        <div className="xl:col-span-1">
          <DayViewTable />
        </div>
      </div>

      {/* Modals */}
      <CalendarModal />
    </div>
  );
};

export default CalendarPage;

