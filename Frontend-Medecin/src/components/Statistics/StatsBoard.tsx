import React, { useMemo } from 'react';
import { Calendar, Users, Clock, TrendingDown, RefreshCw } from 'lucide-react';
import { useAppointmentStore } from '../../stores/appointmentStore';
import { usePatientStore } from '../../stores/patientStore';
import { useDoctor } from '../../stores/authStore';
import { useTheme } from '../../hooks/useTheme';
import { KPICard } from './KPICard';
import { AppointmentsPerDayChart, ReasonsChart, PresenceRateChart } from './Charts';
import Button from '../Common/Button';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export const StatsBoard: React.FC = () => {
  const doctor = useDoctor();
  const { appointments, getAppointmentsByDoctor, getTodayAppointments } = useAppointmentStore();
  const { patients, getPatientsByDoctor } = usePatientStore();
  const { colors } = useTheme();

  const doctorAppointments = doctor ? getAppointmentsByDoctor(doctor.id) : [];
  const todayAppointments = doctor ? getTodayAppointments(doctor.id) : [];
  const doctorPatients = doctor ? getPatientsByDoctor(doctor.id) : [];

  const occupationRate = useMemo(() => {
    const confirmedToday = todayAppointments.filter(a => 
      a.status === 'confirmed' || a.status === 'doctor_created'
    ).length;
    const totalSlots = 11;
    return Math.round((confirmedToday / totalSlots) * 100);
  }, [todayAppointments]);

  const noShowRate = useMemo(() => {
    const cancelled = doctorAppointments.filter(a => a.status === 'cancelled').length;
    const total = doctorAppointments.length;
    return total > 0 ? Math.round((cancelled / total) * 100) : 0;
  }, [doctorAppointments]);

  const appointmentsPerDay = useMemo(() => {
    const days: { day: string; appointments: number }[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'dd-MM-yyyy');
      const dayName = format(date, 'EEE', { locale: fr });
      
      const count = doctorAppointments.filter(a => a.date === dateStr).length;
      days.push({ day: dayName, appointments: count });
    }
    
    return days;
  }, [doctorAppointments]);

  const reasonsData = useMemo(() => {
    const reasonCounts: Record<string, number> = {};
    
    doctorAppointments.forEach(a => {
      const reason = a.reason.toLowerCase().includes('général') ? 'Consultation générale' :
                     a.reason.toLowerCase().includes('suivi') ? 'Suivi' :
                     a.reason.toLowerCase().includes('vaccin') ? 'Vaccination' :
                     a.reason.toLowerCase().includes('ordonnance') ? 'Ordonnance' :
                     a.reason.toLowerCase().includes('bilan') ? 'Bilan' :
                     'Autre';
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    });

    return Object.entries(reasonCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [doctorAppointments]);

  const presenceRateData = useMemo(() => {
    const days: { day: string; rate: number }[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'dd-MM-yyyy');
      const dayName = format(date, 'EEE', { locale: fr });
      
      const dayAppointments = doctorAppointments.filter(a => a.date === dateStr);
      const confirmed = dayAppointments.filter(a => 
        a.status === 'confirmed' || a.status === 'doctor_created'
      ).length;
      const cancelled = dayAppointments.filter(a => a.status === 'cancelled').length;
      
      const rate = (confirmed + cancelled) > 0 
        ? Math.round((confirmed / (confirmed + cancelled)) * 100)
        : 100;
        
      days.push({ day: dayName, rate });
    }
    
    return days;
  }, [doctorAppointments]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
            Statistiques
          </h2>
          <p className="text-sm" style={{ color: colors.text.muted }}>
            Vue d'ensemble de votre activité
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={handleRefresh}
          aria-label="Rafraîchir les statistiques"
        >
          Rafraîchir
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Taux d'occupation"
          value={occupationRate}
          suffix="%"
          icon={<Calendar className="w-5 h-5" />}
          color="cyan"
          trend={{ value: 5, isPositive: true }}
        />
        <KPICard
          title="RDV aujourd'hui"
          value={todayAppointments.length}
          icon={<Clock className="w-5 h-5" />}
          color="green"
        />
        <KPICard
          title="Taux de no-show"
          value={noShowRate}
          suffix="%"
          icon={<TrendingDown className="w-5 h-5" />}
          color={noShowRate > 20 ? 'red' : 'yellow'}
          trend={{ value: -2, isPositive: true }}
        />
        <KPICard
          title="Patients actifs"
          value={doctorPatients.length}
          icon={<Users className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentsPerDayChart data={appointmentsPerDay} />
        <ReasonsChart data={reasonsData} />
      </div>

      <div className="grid grid-cols-1">
        <PresenceRateChart data={presenceRateData} />
      </div>
    </div>
  );
};

export default StatsBoard;

