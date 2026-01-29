import { format, parse, isValid, isBefore, startOfDay, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDateAPI = (date: Date): string => {
  return format(date, 'dd-MM-yyyy');
};

export const formatDateCalendar = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatDateDisplay = (date: Date): string => {
  return format(date, 'EEEE d MMMM yyyy', { locale: fr });
};

export const formatDateShort = (date: Date): string => {
  return format(date, 'd MMM yyyy', { locale: fr });
};

export const parseDateAPI = (dateString: string): Date => {
  return parse(dateString, 'dd-MM-yyyy', new Date());
};

export const parseDateCalendar = (dateString: string): Date => {
  return parse(dateString, 'yyyy-MM-dd', new Date());
};

export const apiToCalendar = (dateString: string): string => {
  const date = parseDateAPI(dateString);
  return formatDateCalendar(date);
};

export const calendarToAPI = (dateString: string): string => {
  const date = parseDateCalendar(dateString);
  return formatDateAPI(date);
};

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

export const isFutureOrToday = (date: Date): boolean => {
  return !isBefore(date, startOfDay(new Date()));
};

export const getTodayFormatted = (): string => {
  return formatDateAPI(new Date());
};

export const getLast7Days = (): Date[] => {
  const days: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    days.push(subDays(new Date(), i));
  }
  return days;
};

export const isValidDate = (dateString: string): boolean => {
  const parsed = parseDateAPI(dateString);
  return isValid(parsed);
};

export const formatDateTime = (dateString: string, time: string): string => {
  const date = parseDateAPI(dateString);
  return `${formatDateDisplay(date)} à ${time}`;
};

export const getDayOfWeek = (date: Date): string => {
  return format(date, 'EEEE', { locale: fr });
};

export const getMonthName = (date: Date): string => {
  return format(date, 'MMMM yyyy', { locale: fr });
};

