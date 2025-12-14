import { format, parse, isValid, isBefore, startOfDay, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

// Format date en dd-MM-yyyy (format API)
export const formatDateAPI = (date: Date): string => {
  return format(date, 'dd-MM-yyyy');
};

// Format date en yyyy-MM-dd (format FullCalendar)
export const formatDateCalendar = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Format date en français pour affichage
export const formatDateDisplay = (date: Date): string => {
  return format(date, 'EEEE d MMMM yyyy', { locale: fr });
};

// Format date courte
export const formatDateShort = (date: Date): string => {
  return format(date, 'd MMM yyyy', { locale: fr });
};

// Parser une date au format dd-MM-yyyy
export const parseDateAPI = (dateString: string): Date => {
  return parse(dateString, 'dd-MM-yyyy', new Date());
};

// Parser une date au format yyyy-MM-dd (FullCalendar)
export const parseDateCalendar = (dateString: string): Date => {
  return parse(dateString, 'yyyy-MM-dd', new Date());
};

// Convertir date API vers date Calendar
export const apiToCalendar = (dateString: string): string => {
  const date = parseDateAPI(dateString);
  return formatDateCalendar(date);
};

// Convertir date Calendar vers date API
export const calendarToAPI = (dateString: string): string => {
  const date = parseDateCalendar(dateString);
  return formatDateAPI(date);
};

// Format heure en HH:MM
export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

// Vérifier si une date est dans le futur ou aujourd'hui
export const isFutureOrToday = (date: Date): boolean => {
  return !isBefore(date, startOfDay(new Date()));
};

// Obtenir la date d'aujourd'hui formatée
export const getTodayFormatted = (): string => {
  return formatDateAPI(new Date());
};

// Générer un tableau de dates pour les 7 derniers jours
export const getLast7Days = (): Date[] => {
  const days: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    days.push(subDays(new Date(), i));
  }
  return days;
};

// Vérifier si une date est valide
export const isValidDate = (dateString: string): boolean => {
  const parsed = parseDateAPI(dateString);
  return isValid(parsed);
};

// Format datetime pour affichage complet
export const formatDateTime = (dateString: string, time: string): string => {
  const date = parseDateAPI(dateString);
  return `${formatDateDisplay(date)} à ${time}`;
};

// Obtenir le jour de la semaine
export const getDayOfWeek = (date: Date): string => {
  return format(date, 'EEEE', { locale: fr });
};

// Obtenir le nom du mois
export const getMonthName = (date: Date): string => {
  return format(date, 'MMMM yyyy', { locale: fr });
};

