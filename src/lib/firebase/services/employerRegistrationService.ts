import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config';
import { createEmployerInvite } from './employerInviteService';

export const registerEmployer = async (companyId: string, data: {
  email: string;
  contactPerson: string;
  companyName: string;
}, adminEmail?: string, adminPassword?: string) => {
  try {
    // Create employer invite
    const verificationId = await createEmployerInvite({
      email: data.email,
      contactPerson: data.contactPerson,
      companyId: companyId,
      companyName: data.companyName
    });

    // If admin credentials were provided, sign back in as admin
    if (adminEmail && adminPassword) {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    }

    return verificationId;
  } catch (error) {
    console.error('Error registering employer:', error);
    throw error;
  }
};
