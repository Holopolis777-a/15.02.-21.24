import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config';

export const uploadFAQImage = async (file: File): Promise<string> => {
  // Validate file
  if (!file.type.startsWith('image/')) {
    throw new Error('Ungültiger Dateityp. Nur Bilder sind erlaubt.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Datei zu groß. Maximale Größe ist 5MB.');
  }

  // Create unique filename
  const filename = `faqs/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const fileRef = ref(storage, filename);

  // Upload file
  await uploadBytes(fileRef, file);

  // Get and return download URL
  return await getDownloadURL(fileRef);
};