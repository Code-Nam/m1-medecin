export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  let dateToFormat: Date;

  // Check if dateString is in dd-MM-yyyy format
  const simpleDateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
  const match = dateString.match(simpleDateRegex);

  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    dateToFormat = new Date(year, month - 1, day);
  } else {
    dateToFormat = new Date(dateString);
  }

  if (isNaN(dateToFormat.getTime())) {
    return 'Date invalide';
  }

  return dateToFormat.toLocaleDateString('fr-FR', options);
};

export const formatTime = (timeString: string): string => {
  return timeString.replace(':', 'h');
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};
