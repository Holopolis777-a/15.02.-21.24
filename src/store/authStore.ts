import { create } from 'zustand';
import type { User } from '../types/auth';
import { auth } from '../lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  let unsubscribe: (() => void) | null = null;

  const initialize = () => {
    // Clean up previous subscription if exists
    if (unsubscribe) {
      unsubscribe();
    }

    // Set up Firebase auth state listener
    unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Check if we're on a verification page
          const isVerificationPage = window.location.pathname.startsWith('/verify/');

          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();

          // During verification, we might not have user data yet
          if (userData || isVerificationPage) {
            // Get user data from invite if on verification page
            let role = userData?.role;
            let portalType = userData?.portalType;

            if (isVerificationPage && !role) {
              const pathname = window.location.pathname;
              const url = new URL(window.location.href);
              
              // Check if it's a fixed registration link
              if (pathname.includes('/verify/')) {
                const verificationId = pathname.split('/').pop();
                if (verificationId) {
                  // First check verifications collection
                  const verificationDoc = await getDoc(doc(db, 'verifications', verificationId));
                  if (verificationDoc.exists()) {
                    const verificationData = verificationDoc.data();
                    if (verificationData.type === 'employer_verification' ||
                        verificationData.type === 'employer_invite' ||
                        verificationData.type === 'company_invite') {
                      role = 'employer';
                    } else if (verificationData.type === 'broker_invite') {
                      role = 'broker';
                    }
                  }
                  
                  // If not an employer verification, check employee invites
                  if (!role && pathname.includes('/verify/employee/')) {
                    const type = pathname.split('/').pop();
                    if (type === 'normal' || type === 'salary') {
                      portalType = type;
                      role = type === 'normal' ? 'employee_normal' : 'employee_salary';
                    } else {
                      const inviteDoc = await getDoc(doc(db, 'employeeInvites', verificationId));
                      if (inviteDoc.exists()) {
                        const inviteData = inviteDoc.data();
                        portalType = inviteData.portalType;
                        role = portalType === 'normal' ? 'employee_normal' : 'employee_salary';
                      }
                    }
                  }
                }
              }
            }

            console.log('AuthStore - Determining user role:', {
              storedRole: userData?.role,
              portalType: portalType,
              finalRole: role,
              isVerificationPage
            });

            // If user is a broker, fetch their broker document
            let brokerId = null;
            if (userData?.role === 'broker' || role === 'broker') {
              try {
                // First try to find broker by user ID
                const brokerByUserDoc = await getDoc(doc(db, 'brokers', firebaseUser.uid));
                if (brokerByUserDoc.exists()) {
                  brokerId = firebaseUser.uid;
                } else {
                  // If not found, query by email
                  const brokerByEmailDoc = await getDoc(doc(db, 'brokers', userData?.email || firebaseUser.email || ''));
                  if (brokerByEmailDoc.exists()) {
                    brokerId = userData?.email || firebaseUser.email;
                  }
                }
                console.log('Found brokerId:', brokerId);
              } catch (error) {
                console.error('Error fetching broker document:', error);
              }
            }

            // Create base user object from userData
            const user: User = {
              ...userData,
              id: firebaseUser.uid,
              email: firebaseUser.email || userData?.email || '',
              role: role || userData?.role || 'customer',
              brokerId: brokerId, // Add brokerId to user object
              // Ensure required fields have fallbacks
              firstName: userData?.firstName || '',
              lastName: userData?.lastName || '',
              street: userData?.street || '',
              houseNumber: userData?.houseNumber || '',
              postalCode: userData?.postalCode || '',
              city: userData?.city || '',
              mobileNumber: userData?.mobileNumber || '',
              // Admin and broker users are always considered complete, otherwise check profile fields
              isProfileComplete: (role === 'admin' || role === 'broker') ? true : (userData?.isProfileComplete ?? Boolean(
                userData?.firstName &&
                userData?.lastName &&
                userData?.street &&
                userData?.houseNumber &&
                userData?.postalCode &&
                userData?.city &&
                userData?.mobileNumber
              ))
            };
            console.log('AuthStore - Setting user with role:', user.role);
            set({ user, isLoading: false });
          } else {
            // If no Firestore data and not on verification page, sign out
            await auth.signOut();
            set({ user: null, isLoading: false });
          }
        } else {
          // Check if we're on a verification page
          const isVerificationPage = window.location.pathname.startsWith('/verify/');
          const isLoginPage = window.location.pathname === '/login';
          const isResetPasswordPage = window.location.pathname === '/reset-password';

          // Only set user to null if not on verification page
          if (!isVerificationPage && !isLoginPage && !isResetPasswordPage) {
            set({ user: null, isLoading: false });
          } else {
            // On verification pages, just update loading state
            set({ isLoading: false });
          }
        }
      } catch (error) {
        console.error('Auth state error:', error);
        set({ user: null, isLoading: false });
      }
    });
  };

  return {
    user: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ isLoading: loading }),
    initialize,
  };
});
