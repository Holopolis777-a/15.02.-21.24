export const getDateFromTimestamp = (timestamp: any): Date => {
  if (!timestamp) return new Date();
  
  // Wenn es ein Firestore-Timestamp ist
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  // Wenn es bereits ein Date-Objekt ist
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  // Wenn es ein String oder eine Zahl ist
  return new Date(timestamp);
};
