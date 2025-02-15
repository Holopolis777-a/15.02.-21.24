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
    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const isVerificationPage = window.location.pathname.startsWith('/verify/');
          const isEmployerRegistration = window.location.pathname.startsWith('/employer-registration');

          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();

          // Determine role and portal type
          let role = userData?.role;
          let portalType = userData?.portalType;

          // Check for role if we're on verification/registration page
          if (!role && (isVerificationPage || isEmployerRegistration)) {
            const pathname = window.location.pathname;
            const verificationId = pathname.includes('/verify/') ? 
              pathname.split('/').pop() : 
              new URLSearchParams(window.location.search).get('inviteId');

            if (verificationId) {
              const verificationDoc = await getDoc(doc(db, 'verifications', verificationId));
              if (verificationDoc.exists()) {
                const verificationData = verificationDoc.data();
                switch (verificationData.type) {
                  case 'employer_verification':
                  case 'employer_invite':
                  case 'company_invite':
                    role = 'employer';
                    break;
                  case 'broker_invite':
                    role = 'broker';
                    break;
                  default:
                    console.log('Unbekannter Verifikationstyp:', verificationData.type);
                    break;
                }
                console.log('Verifikationstyp gefunden:', verificationData.type, 'Rolle gesetzt auf:', role);
              }
              
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

          console.log('AuthStore - Determining user role:', {
            storedRole: userData?.role,
            portalType: portalType,
            finalRole: role,
            isVerificationPage,
            isEmployerRegistration
          });

          let brokerId = null;
          if (userData?.role === 'broker') {
            try {
              const brokerByUserDoc = await getDoc(doc(db, 'brokers', firebaseUser.uid));
              if (brokerByUserDoc.exists()) {
                brokerId = firebaseUser.uid;
              } else {
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

          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || userData?.email || '',
            role: role || userData?.role || 'customer',
            brokerId: brokerId,
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            street: userData?.street || '',
            houseNumber: userData?.houseNumber || '',
            postalCode: userData?.postalCode || '',
            city: userData?.city || '',
            mobileNumber: userData?.mobileNumber || '',
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
          const isVerificationPage = window.location.pathname.startsWith('/verify/');
          const isLoginPage = window.location.pathname === '/login';
          const isResetPasswordPage = window.location.pathname === '/reset-password';
          const isEmployerRegistration = window.location.pathname.startsWith('/employer-registration');

          if (!isVerificationPage && !isLoginPage && !isResetPasswordPage && !isEmployerRegistration) {
            set({ user: null, isLoading: false });
          } else {
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
