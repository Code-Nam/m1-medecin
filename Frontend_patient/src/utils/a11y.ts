/**
 * Utilitaires d'accessibilité pour le Narrateur Windows en français
 * Génère des descriptions textuelles complètes pour les lecteurs d'écran
 */

import { AppointmentStatus } from '../types';

/**
 * Annonce une action pour les lecteurs d'écran
 * @param message Message à annoncer
 * @param priority 'polite' ou 'assertive'
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Nettoyer après l'annonce
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Génère une description complète d'un rendez-vous pour les lecteurs d'écran
 */
export const getAppointmentDescription = (appointment: {
  reason: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  doctorName?: string;
}): string => {
  const statusText = getStatusText(appointment.status);
  const doctorPart = appointment.doctorName ? ` avec ${appointment.doctorName}` : '';
  
  return `Rendez-vous${doctorPart} : ${appointment.reason}. Prévu le ${formatDateForSpeech(appointment.date)} à ${formatTimeForSpeech(appointment.time)}. Statut : ${statusText}`;
};

/**
 * Convertit une date au format français lisible par le Narrateur
 * @param date Date au format dd-MM-yyyy ou yyyy-MM-dd
 */
export const formatDateForSpeech = (date: string): string => {
  const parts = date.includes('-') ? date.split('-') : [];
  if (parts.length !== 3) return date;
  
  // Si format yyyy-MM-dd
  let day, month, year;
  if (parts[0].length === 4) {
    [year, month, day] = parts;
  } else {
    [day, month, year] = parts;
  }
  
  const monthNames = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];
  
  const monthIndex = parseInt(month, 10) - 1;
  const monthName = monthNames[monthIndex] || month;
  
  return `${parseInt(day, 10)} ${monthName} ${year}`;
};

/**
 * Convertit une heure au format français lisible par le Narrateur
 * @param time Heure au format HH:mm
 */
export const formatTimeForSpeech = (time: string): string => {
  const [hours, minutes] = time.split(':');
  
  if (minutes === '00') {
    return `${parseInt(hours, 10)} heures`;
  }
  
  return `${parseInt(hours, 10)} heures ${parseInt(minutes, 10)}`;
};

/**
 * Retourne le texte du statut en français
 */
export const getStatusText = (status: AppointmentStatus): string => {
  switch (status) {
    case AppointmentStatus.CONFIRMED:
      return 'confirmé';
    case AppointmentStatus.PENDING:
      return 'en attente de confirmation';
    case AppointmentStatus.CANCELLED:
      return 'annulé';
    case AppointmentStatus.DOCTOR_CREATED:
      return 'proposé par le médecin';
    default:
      return status.toString();
  }
};

/**
 * Génère une description pour un formulaire multi-étapes
 */
export const getStepDescription = (currentStep: number, totalSteps: number, stepName: string): string => {
  return `Étape ${currentStep} sur ${totalSteps} : ${stepName}`;
};

/**
 * Annonce le changement de page
 */
export const announcePageChange = (pageName: string) => {
  announceToScreenReader(`Page ${pageName} chargée`, 'polite');
};

/**
 * Annonce un message d'erreur
 */
export const announceError = (error: string) => {
  announceToScreenReader(`Erreur : ${error}`, 'assertive');
};

/**
 * Annonce un succès
 */
export const announceSuccess = (message: string) => {
  announceToScreenReader(`Succès : ${message}`, 'polite');
};

/**
 * Génère une description pour un élément de liste
 */
export const getListItemDescription = (index: number, total: number, itemName: string): string => {
  return `Élément ${index} sur ${total} : ${itemName}`;
};

/**
 * Génère une description pour un bouton d'action
 */
export const getActionButtonLabel = (action: string, target: string): string => {
  return `${action} ${target}`;
};
