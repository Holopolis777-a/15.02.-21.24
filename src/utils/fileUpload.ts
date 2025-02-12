export const uploadCompanyLogo = async (file: File): Promise<string> => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Nur Bilddateien sind erlaubt');
  }

  // Validate file size (1MB limit for Firestore)
  if (file.size > 1 * 1024 * 1024) {
    throw new Error('Die Bilddatei darf nicht größer als 1MB sein');
  }

  // Convert to base64
  const base64String = await fileToBase64(file);
  
  // Validate final base64 size
  if (!validateImageSize(base64String)) {
    throw new Error('Die Bilddatei ist zu groß für die Datenbank');
  }

  return base64String;
};

export const uploadBrokerLogo = async (file: File): Promise<string> => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Nur Bilddateien sind erlaubt');
  }

  // Validate file size (1MB limit for Firestore)
  if (file.size > 1 * 1024 * 1024) {
    throw new Error('Die Bilddatei darf nicht größer als 1MB sein');
  }

  // Convert to base64
  const base64String = await fileToBase64(file);
  
  // Validate final base64 size
  if (!validateImageSize(base64String)) {
    throw new Error('Die Bilddatei ist zu groß für die Datenbank');
  }

  return base64String;
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const validateImageSize = (base64String: string): boolean => {
  // Check if base64 string is less than 1MB (Firestore document size limit is 1MB)
  const sizeInBytes = (base64String.length * 3) / 4;
  const sizeInMB = sizeInBytes / (1024 * 1024);
  return sizeInMB < 0.9; // Leave some room for other vehicle data
};
