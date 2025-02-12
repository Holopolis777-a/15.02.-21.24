import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { generateToken } from '../utils/tokenUtils';

// Error class for verification errors
export class VerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VerificationError';
  }
}

interface BaseVerificationData {
  email: string;
  fullName: string;
  companyName: string;
}

interface BrokerInviteData extends BaseVerificationData {
  type: 'broker_invite';
  brokerId: string;
}

interface EmployerVerificationData extends BaseVerificationData {
  type: 'employer_verification';
  employerId: string;
}

type VerificationData = BrokerInviteData | EmployerVerificationData;

export const createVerification = async (data: VerificationData) => {
  try {
    // Create verification document
    const verificationRef = await addDoc(collection(db, 'verifications'), {
      ...data,
      email: data.email.toLowerCase(),
      token: generateToken(32),
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      verified: false,
      emailSent: false
    });

    return {
      id: verificationRef.id,
      token: verificationRef.id // Using doc ID as token for simplicity
    };
  } catch (error) {
    console.error('Error creating verification:', error);
    throw new Error('Fehler beim Erstellen der Verifizierung');
  }
};

export const updateVerificationStatus = async (verificationId: string, userId: string) => {
  try {
    const verificationRef = doc(db, 'verifications', verificationId);
    await updateDoc(verificationRef, {
      verified: true,
      verifiedAt: serverTimestamp(),
      userId: userId
    });
  } catch (error) {
    console.error('Error updating verification status:', error);
    throw new VerificationError('Fehler beim Aktualisieren des Verifizierungsstatus');
  }
};

export const startVerification = async (verificationId: string) => {
  try {
    const verificationRef = doc(db, 'verifications', verificationId);
    await updateDoc(verificationRef, {
      verificationStarted: true,
      verificationStartedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error starting verification:', error);
    throw new VerificationError('Fehler beim Starten der Verifizierung');
  }
};

export const markVerificationFailed = async (verificationId: string, error: string) => {
  try {
    const verificationRef = doc(db, 'verifications', verificationId);
    await updateDoc(verificationRef, {
      verificationFailed: true,
      verificationError: error,
      failedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error marking verification as failed:', error);
    throw new VerificationError('Fehler beim Markieren der Verifizierung als fehlgeschlagen');
  }
};
