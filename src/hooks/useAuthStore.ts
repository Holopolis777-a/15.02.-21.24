import { create } from 'zustand';
import type { User } from '../types/auth';
import { auth, db } from '../lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Set up Firebase auth state listener
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: userData.role || 'customer',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            avatarUrl: userData.avatarUrl,
            logoUrl: userData.logoUrl
          };
          console.log('Loaded user data:', user); // Debug log
          set({ user, isLoading: false });
        } else {
          console.log('No user document found'); // Debug log
          set({ user: null, isLoading: false });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        set({ user: null, isLoading: false });
      }
    } else {
      set({ user: null, isLoading: false });
    }
  });

  return {
    user: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ isLoading: loading }),
  };
});