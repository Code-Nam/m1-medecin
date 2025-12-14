// Utilitaires de validation

// Validation email
export const isValidEmail = (email: string): boolean => {
  if (!email) return true; // Optionnel
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation téléphone français
export const isValidPhone = (phone: string): boolean => {
  if (!phone) return true; // Optionnel
  const phoneRegex = /^0[1-9][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Validation nom/prénom (min 2 caractères)
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2;
};

// Validation motif RDV (min 5 caractères)
export const isValidReason = (reason: string): boolean => {
  return reason.trim().length >= 5;
};

// Validation heure (format HH:MM, entre 08:00 et 19:00)
export const isValidTime = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  if (!timeRegex.test(time)) return false;
  
  const [hours] = time.split(':').map(Number);
  return hours >= 8 && hours < 19;
};

// Validation date (au moins aujourd'hui)
export const isDateValid = (dateString: string): boolean => {
  const parts = dateString.split('-');
  if (parts.length !== 3) return false;
  
  const [day, month, year] = parts.map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date >= today;
};

// Messages d'erreur
export const validationMessages = {
  email: "Format d'email invalide",
  phone: "Format de téléphone invalide (ex: 0612345678)",
  name: "Minimum 2 caractères requis",
  reason: "Minimum 5 caractères requis",
  time: "Heure invalide (08:00 - 19:00)",
  date: "La date doit être aujourd'hui ou dans le futur",
  required: "Ce champ est requis"
};

// Formater un numéro de téléphone pour l'affichage
export const formatPhoneDisplay = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\s/g, '');
  return cleaned.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
};

