import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export const loginUser = async (email: string, password: string) => {
  try {
    // Sign in user
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    
    // Get user document
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    // If admin, store password securely
    if (userDoc.exists() && userDoc.data().role === 'admin') {
      sessionStorage.setItem('adminPassword', password);
    }
    
    return {
      user,
      userData: userDoc.exists() ? userDoc.data() : null
    };
  } catch (error) {
    console.error('Login error:', error);
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