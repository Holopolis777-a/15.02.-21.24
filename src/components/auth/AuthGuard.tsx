import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { auth, db } from '../../lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, isLoading, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();
        
        // Check if user is pending
        if (userData?.status === 'pending') {
          await auth.signOut();
          setUser(null);
          setLoading(false);
          
          // Spezifische Fehlermeldung für Mitarbeiter
          if (userData?.role === 'employee_normal' || userData?.role === 'employee_salary') {
            navigate('/login?error=pending_employee');
          } else {
            navigate('/login?error=pending');
          }
          return;
        }

        // Convert Firebase user to our User type with all required fields
        const user = {
          id: firebaseUser.uid,
          email: firebaseUser.email || userData?.email || '',
          role: userData?.role || null,
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
          street: userData?.street || '',
          houseNumber: userData?.houseNumber || '',
          postalCode: userData?.postalCode || '',
          city: userData?.city || '',
          mobileNumber: userData?.mobileNumber || '',
          avatarUrl: userData?.avatarUrl,
          companyId: userData?.companyId,
          brokerId: userData?.brokerId,
          status: userData?.status,
          isProfileComplete: userData?.isProfileComplete ?? false,
          portalType: userData?.portalType,
          inviteId: userData?.inviteId,
          updatedAt: userData?.updatedAt,
          createdAt: userData?.createdAt
        };

        console.log('AuthGuard - Setting user:', {
          id: user.id,
          role: user.role,
          companyId: user.companyId,
          hasCompanyData: !!userData?.companyId
        });
        
        setUser(user);
        setLoading(false);
      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  // Handle navigation based on auth state
  useEffect(() => {
    const isVerificationPage = location.pathname.startsWith('/verify/');
    const isLoginPage = location.pathname === '/login';
    const isResetPasswordPage = location.pathname === '/reset-password';
    const isRegisterPage = location.pathname.startsWith('/register/');
    const isPublicPage = isVerificationPage || isLoginPage || isResetPasswordPage || isRegisterPage;

    if (!isLoading) {
      if (!user && !isPublicPage) {
        // Save the attempted URL
        const returnUrl = location.pathname + location.search;
        navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      } else if (user && (isLoginPage || isResetPasswordPage)) {
        // Get the return URL from query params
        const params = new URLSearchParams(location.search);
        const returnUrl = params.get('returnUrl');
        navigate(returnUrl || '/dashboard');
      }
    }
  }, [isLoading, user, navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
