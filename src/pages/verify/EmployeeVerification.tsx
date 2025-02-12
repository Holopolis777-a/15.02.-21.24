import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { db } from '../../lib/firebase/config';

const EmployeeVerification = () => {
  const { verificationId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'verifying' | 'register' | 'setPassword' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [inviteData, setInviteData] = useState<any>(null);

  useEffect(() => {
    const handleVerification = async () => {
      if (!verificationId) {
        setStatus('error');
        setError('Ungültiger Verifizierungslink');
        return;
      }

      // First check if it's an email invite
      try {
        const inviteRef = doc(db, 'employeeInvites', verificationId);
        const inviteDoc = await getDoc(inviteRef);

        if (inviteDoc.exists()) {
          const data = inviteDoc.data();
          
          // Check if invite is already used
          if (data.status === 'active' && data.userId) {
            setStatus('error');
            setError('Diese Einladung wurde bereits verwendet');
            return;
          }

          setInviteData(data);
          setFormData(prev => ({
            ...prev,
            email: data.email || ''
          }));
          setStatus('register');
          return;
        }

        // If no email invite found, check if it's a link-based registration
        const url = new URL(window.location.href);
        const type = url.pathname.split('/').pop(); // Get 'normal' or 'salary'
        const companyId = url.searchParams.get('company');
        const inviteId = url.searchParams.get('invite');
        
        if (type && companyId && inviteId && (type === 'normal' || type === 'salary')) {
          // Check if invite exists and is valid
          const inviteRef = doc(db, 'employeeInvites', inviteId);
          const inviteDoc = await getDoc(inviteRef);
          
          if (inviteDoc.exists()) {
            const data = inviteDoc.data();
            if (data.status === 'active' && data.userId) {
              setStatus('error');
              setError('Diese Einladung wurde bereits verwendet');
              return;
            }
            setInviteData(data);
            setStatus('register');
            return;
          }
          // Verify company exists
          const companyRef = doc(db, 'companies', companyId);
          const companyDoc = await getDoc(companyRef);
          
          if (!companyDoc.exists()) {
            setStatus('error');
            setError('Ungültige Firma');
            return;
          }

          setInviteData({
            companyId,
            employerCompanyId: companyId,
            portalType: type === 'normal' ? 'normal' : 'salary',
            type: 'employee_invite',
            inviteType: 'employee',
            method: 'link',
            role: type === 'normal' ? 'employee_normal' : 'employee_salary'
          });
          setStatus('register');
          return;
        }

        setStatus('error');
        setError('Ungültiger Verifizierungslink');
      } catch (error) {
        console.error('Error handling verification:', error);
        setStatus('error');
        setError('Ein Fehler ist aufgetreten');
      }
    };

    handleVerification();
  }, [verificationId]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      return;
    }

    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    try {
      setStatus('verifying');
      const auth = getAuth();
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, password);
      
      // First update invite with user details
      await updateDoc(doc(db, 'employeeInvites', verificationId!), {
        status: 'active',
        registeredAt: new Date(),
        userId: userCredential.user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      });

      // Then create user document with data from invite
      const userData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyId: inviteData.companyId,
        employerCompanyId: inviteData.employerCompanyId,
        role: inviteData.role,
        portalType: inviteData.portalType,
        status: inviteData.method === 'link' ? 'pending' : 'active',
        inviteId: verificationId,
        inviteType: inviteData.inviteType,
        method: inviteData.method || 'email',
        registeredAt: new Date()
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      setStatus('success');

    } catch (err: any) {
      console.error('Error setting up account:', err);
      
      if (err.code === 'auth/email-already-in-use') {
        setStatus('success');
      } else {
        setStatus('error');
        setError('Ein Fehler ist beim Erstellen Ihres Kontos aufgetreten');
      }
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = formData;
    
    if (!firstName || !lastName || !email) {
      setError('Bitte füllen Sie alle Felder aus');
      return;
    }

    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      return;
    }

    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    try {
      setStatus('verifying');
      const auth = getAuth();
      
      // For link-based registrations, create an invite document first
      let inviteId;
      if (inviteData.method === 'link') {
        inviteId = `${inviteData.portalType}_${inviteData.companyId}_${Date.now()}`;
        const newInviteData = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyId: inviteData.companyId,
          employerCompanyId: inviteData.employerCompanyId,
          portalType: inviteData.portalType,
          status: 'pending',
          type: 'employee_invite',
          inviteType: 'employee',
          method: 'link',
          role: inviteData.role,
          registeredAt: new Date()
        };
        
        // Create invite document first
        await setDoc(doc(db, 'employeeInvites', inviteId), newInviteData);
      }

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, password);

      if (inviteData.method === 'link') {
        // Update invite with user ID
        await updateDoc(doc(db, 'employeeInvites', inviteId!), {
          userId: userCredential.user.uid
        });

        // Create user document
        const userData = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyId: inviteData.companyId,
          employerCompanyId: inviteData.employerCompanyId,
          role: inviteData.role,
          portalType: inviteData.portalType,
          status: 'active',
          inviteId: inviteId,
          inviteType: 'employee',
          method: 'link',
          registeredAt: new Date()
        };
        
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      } else {
        // For email invites, just create the user document
        const userData = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyId: inviteData.companyId,
          employerCompanyId: inviteData.employerCompanyId,
          role: inviteData.role,
          portalType: inviteData.portalType,
          status: 'active',
          inviteId: verificationId,
          inviteType: inviteData.inviteType,
          method: 'email',
          registeredAt: new Date()
        };
        
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      }

      setStatus('success');

    } catch (err: any) {
      console.error('Error setting up account:', err);
      
      if (err.code === 'auth/email-already-in-use') {
        setStatus('success');
      } else {
        setStatus('error');
        setError('Ein Fehler ist beim Erstellen Ihres Kontos aufgetreten');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Mitarbeiter Einladung
        </h2>
        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {(status === 'loading' || status === 'verifying') && (
            <div className="text-center">
              <p className="text-gray-600">
                {status === 'loading' ? 'Einladung wird verifiziert...' : 'Konto wird erstellt...'}
              </p>
            </div>
          )}

          {status === 'setPassword' && (
            <form onSubmit={handleSetPassword}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Vorname
                  </label>
                  <div className="mt-1">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Nachname
                  </label>
                  <div className="mt-1">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-Mail
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    disabled={inviteData?.method === 'email'}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${inviteData?.method === 'email' ? 'bg-gray-50 text-gray-500' : 'placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500'} sm:text-sm`}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Passwort
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Passwort bestätigen
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Passwort setzen
                </button>
              </div>
            </form>
          )}

          {status === 'register' && (
            <form onSubmit={handleRegistration}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Vorname
                  </label>
                  <div className="mt-1">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Nachname
                  </label>
                  <div className="mt-1">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-Mail
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Passwort
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Passwort bestätigen
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Konto erstellen
                </button>
              </div>
            </form>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="rounded-full bg-green-100 p-3 mx-auto w-fit">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mt-4 text-gray-600">
                {inviteData?.method === 'link' 
                  ? 'Ihre Registrierung wurde erfolgreich abgeschlossen. Ihr Arbeitgeber muss Sie noch freischalten, bevor Sie sich einloggen können.'
                  : 'Ihre Registrierung wurde erfolgreich abgeschlossen. Sie können sich jetzt mit Ihrer E-Mail-Adresse und Ihrem Passwort einloggen.'}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Sie können diese Seite jetzt schließen.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="rounded-full bg-red-100 p-3 mx-auto w-fit">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="mt-4 text-red-600">
                {error || 'Ein unbekannter Fehler ist aufgetreten'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeVerification;
