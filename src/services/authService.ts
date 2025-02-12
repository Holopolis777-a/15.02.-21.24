import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase/config';
import { User } from '../types/auth';

class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoginError';
  }
}

export const loginUser = async (email: string, password: string) => {
  try {
    // Sign in user
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    
    // Get user document
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new LoginError('Benutzer nicht gefunden');
    }

    const userData = userDoc.data();

    // Für Mitarbeiter: Prüfe auch den Status in employeeInvites
    if (userData.role === 'employee_normal' || userData.role === 'employee_salary') {
      const invitesQuery = await getDoc(doc(db, 'employeeInvites', userData.inviteId));
      if (invitesQuery.exists() && invitesQuery.data().status === 'pending') {
        throw new Error('PENDING_APPROVAL');
      }
    }

    // Check if user is pending
    if (userData.status === 'pending') {
      throw new Error('PENDING_APPROVAL');
    }

    // If admin, store password securely
    if (userData.role === 'admin') {
      sessionStorage.setItem('adminPassword', password);
    }

    // Convert to our User type
    const appUser: User = {
      id: user.uid,
      email: user.email || '',
      role: userData.role,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      companyId: userData.companyId,
      brokerId: userData.brokerId,
      status: userData.status
    };
    
    return {
      user: appUser,
      userData
    };
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error && error.message === 'PENDING_APPROVAL') {
      throw error;
    }
    throw new Error('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.');
  }
};

export const logoutUser = async () => {
  try {
    await auth.signOut();
    sessionStorage.removeItem('adminPassword');
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Fehler beim Abmelden');
  }
};
