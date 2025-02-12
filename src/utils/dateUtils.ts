export const formatDate = (date: Date | string | number | null | undefined): string => {
  if (!date) return '-';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

export const formatDistanceToNow = (date: Date | string | number | null | undefined): string => {
  if (!date) return '-';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Gerade eben';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `Vor ${diffInMinutes} ${diffInMinutes === 1 ? 'Minute' : 'Minuten'}`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `Vor ${diffInHours} ${diffInHours === 1 ? 'Stunde' : 'Stunden'}`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `Vor ${diffInDays} ${diffInDays === 1 ? 'Tag' : 'Tagen'}`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `Vor ${diffInMonths} ${diffInMonths === 1 ? 'Monat' : 'Monaten'}`;
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `Vor ${diffInYears} ${diffInYears === 1 ? 'Jahr' : 'Jahren'}`;
  } catch (error) {
    console.error('Error calculating time distance:', error);
    return '-';
  }
};
