import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { db } from '../../lib/firebase/config';
import { sendRegistrationConfirmationEmail } from '../../lib/email/employeeEmails';

const EmployeeRegistration = () => {
  const { inviteId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'form' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteData, setInviteData] = useState<any>(null);

  useEffect(() => {
    const verifyInvitation = async () => {
      if (!inviteId) {
        setStatus('error');
        setError('Ungültiger Registrierungslink');
        return;
      }

      try {
        // Check invite document
        const inviteDoc = await getDoc(doc(db, 'employeeInvites', inviteId));
        if (!inviteDoc.exists()) {
          setStatus('error');
          setError('Einladung nicht gefunden');
          return;
        }

        const data = inviteDoc.data();
        if (data.status === 'accepted') {
          setStatus('error');
          setError('Diese Einladung wurde bereits angenommen');
          return;
        }

        if (!data.employerCompanyId) {
          setStatus('error');
          setError('Ungültige Einladung: Keine Firma zugeordnet');
          return;
        }

        console.log('Invite data:', { ...data, id: inviteId });
        setInviteData({ ...data, id: inviteId });
        setStatus('form');

      } catch (err) {
        console.error('Error verifying invitation:', err);
        setStatus('error');
        setError('Ein Fehler ist aufgetreten');
      }
    };

    verifyInvitation();
  }, [inviteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      return;
    }

    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    try {
      const auth = getAuth();
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document with role and portalType
      const portalType = inviteData.portalType;
      
      if (!inviteData?.employerCompanyId) {
        console.error('Missing employerCompanyId in invite data:', inviteData);
        throw new Error('Ungültige Einladung: Keine Firma zugeordnet');
      }

      console.log('Creating user with invite data:', inviteData);

      const userData = {
        email,
        firstName: firstname,
        lastName: lastname,
        companyId: inviteData.employerCompanyId,
        role: inviteData.portalType === 'normal' ? 'employee_normal' : 'employee_salary',
        createdAt: new Date(),
        portalType: inviteData.portalType,
        inviteType: 'employee',
        inviteId: inviteId,
        invitedBy: inviteData.invitedBy,
        status: 'pending'
      };

      console.log('Creating user with data:', userData);

      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, userData);

      // Verify the user was created correctly
      const createdUser = await getDoc(userRef);
      console.log('Created user document:', { id: createdUser.id, ...createdUser.data() });

      // Update invite status to pending
      await updateDoc(doc(db, 'employeeInvites', inviteId!), {
        status: 'pending',
        registeredAt: new Date(),
        userId: userCredential.user.uid,
        email // Store the email used for registration
      });

      // Send confirmation email
      await sendRegistrationConfirmationEmail(email, firstname, lastname);

      // Set success status and redirect to login after 2 seconds
      setStatus('success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('Error setting up account:', err);
      // Check if the error is a Firebase Auth error
      if (err && typeof err === 'object' && 'code' in err && typeof err.code === 'string' && err.code.includes('auth/')) {
        setError('Ein Fehler ist bei der Authentifizierung aufgetreten. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort.');
      } else {
        setError('Ein Fehler ist beim Erstellen Ihres Kontos aufgetreten');
      }
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Mitarbeiter Registrierung
        </h2>
        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status === 'loading' && (
            <div className="text-center">
              <p className="text-gray-600">Einladung wird verifiziert...</p>
            </div>
          )}

          {status === 'form' && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                    Vorname
                  </label>
                  <div className="mt-1">
                    <input
                      id="firstname"
                      name="firstname"
                      type="text"
                      required
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                    Nachname
                  </label>
                  <div className="mt-1">
                    <input
                      id="lastname"
                      name="lastname"
                      type="text"
                      required
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    E-Mail Adresse
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Passwort bestätigen
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Registrieren
                  </button>
                </div>
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
                Vielen Dank für Ihre Registrierung. Sie erhalten eine Benachrichtigung, sobald Ihr Arbeitgeber Sie freigeschaltet hat.
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

export default EmployeeRegistration;
