import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { sendAdminInvitation } from '../services/emailService';

interface AdminInviteData {
  email: string;
  firstName: string;
  lastName: string;
  message?: string;
}

export const useAdminInvite = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendInvite = async (data: AdminInviteData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Create verification document
      const verificationRef = await addDoc(collection(db, 'verifications'), {
        type: 'admin_invite',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        message: data.message,
        role: 'admin',
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        verified: false,
        emailSent: false
      });

      // Send invitation email
      await sendAdminInvitation({
        email: data.email,
        firstName: data.firstName,
        verificationId: verificationRef.id,
        message: data.message
      });

      return true;
    } catch (err) {
      console.error('Error sending admin invite:', err);
      setError('Fehler beim Senden der Einladung');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendInvite,
    isLoading,
    error
  };
};