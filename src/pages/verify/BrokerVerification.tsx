import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { db } from '../../lib/firebase/config';
import { startVerification, updateVerificationStatus, markVerificationFailed } from '../../services/verificationService';

const BrokerVerification = () => {
  const { verificationId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'verifying' | 'password' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteData, setInviteData] = useState<any>(null);

  useEffect(() => {
    const verifyInvitation = async () => {
      if (!verificationId) {
        setStatus('error');
        setError('Ungültiger Verifizierungslink');
        return;
      }

      try {
        // Check verification document
        const verificationRef = doc(db, 'verifications', verificationId);
        const verificationDoc = await getDoc(verificationRef);

        if (!verificationDoc.exists() || verificationDoc.data().type !== 'broker_invite') {
          setStatus('error');
          setError('Ungültiger Verifizierungslink');
          return;
        }

        const inviteRef = doc(db, 'brokerInvites', verificationId);
        const inviteDoc = await getDoc(inviteRef);

        if (!inviteDoc.exists()) {
          setStatus('error');
          setError('Einladung nicht gefunden');
          return;
        }

        const data = inviteDoc.data();
        setInviteData(data);
        
        if (data.status === 'accepted') {
          setStatus('error');
          setError('Diese Einladung wurde bereits angenommen');
          return;
        }

        setStatus('password');

      } catch (err) {
        console.error('Error verifying invitation:', err);
        setStatus('error');
        setError('Ein Fehler ist aufgetreten');
      }
    };

    verifyInvitation();
  }, [verificationId, navigate]);

  const handleSetPassword = async (e: React.FormEvent) => {
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
      setStatus('verifying');
      const auth = getAuth();
      
      if (!verificationId) {
        throw new Error('Verification ID is missing');
      }
      
      try {
        // Create user account first
        const userCredential = await createUserWithEmailAndPassword(auth, inviteData.email, password);
        
        // Get broker document first to ensure it exists
        const brokerRef = doc(db, 'brokers', inviteData.email);
        const brokerDoc = await getDoc(brokerRef);
        
        if (!brokerDoc.exists()) {
          throw new Error('Broker document not found');
        }

        const existingBrokerData = brokerDoc.data();
        if (!existingBrokerData.brokerId) {
          throw new Error('Broker ID not found');
        }

        // Create user document with broker role
        const userDoc = {
          email: inviteData.email,
          role: 'broker',
          createdAt: new Date(),
          inviteType: 'broker',
          inviteId: verificationId,
          status: 'active',
          verificationId: verificationId,
          brokerId: existingBrokerData.brokerId // Link to broker ID
        };
        
        // Set user document
        await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
        
        // Create user document first
        await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
        
        // Wait for user document to be properly created and propagated
        let attempts = 0;
        let userDocCheck;
        while (attempts < 5) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          userDocCheck = await getDoc(doc(db, 'users', userCredential.user.uid));
          if (userDocCheck.exists() && userDocCheck.data()?.role === 'broker') {
            break;
          }
          attempts++;
          if (attempts < 5) {
            // Try setting the document again
            await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
          }
        }
        
        if (!userDocCheck?.exists() || userDocCheck.data()?.role !== 'broker') {
          throw new Error('Failed to create user document with broker role');
        }

        // Start verification process after user document is confirmed
        await startVerification(verificationId);

        // Update broker document
        await setDoc(brokerRef, {
          ...existingBrokerData,
          userId: userCredential.user.uid,
          status: 'active',
          inviteStatus: 'accepted'
        }, { merge: true });

        // Update verification status
        await updateVerificationStatus(verificationId, userCredential.user.uid);

        // Update broker invite
        await setDoc(doc(db, 'brokerInvites', verificationId), {
          ...inviteData,
          status: 'accepted',
          acceptedAt: new Date(),
          userId: userCredential.user.uid,
          brokerId: existingBrokerData.brokerId
        }, { merge: true });
      } catch (error: any) {
        console.error('Error in registration process:', error);
        await markVerificationFailed(verificationId!, error.message || 'Unknown error during registration');
        throw error;
      }

      setStatus('success');
      
      // Redirect to broker portal after short delay
      setTimeout(() => {
        const portalUrl = import.meta.env.VITE_BROKER_PORTAL_URL || '/login';
        window.location.href = portalUrl;
      }, 3000);

    } catch (err: any) {
      console.error('Error setting up account:', err);
      
      // If error is email-already-in-use, treat as success since user can still login
      if (err.code === 'auth/email-already-in-use') {
        setStatus('success');
        // Redirect to broker portal after short delay
        setTimeout(() => {
          const portalUrl = import.meta.env.VITE_BROKER_PORTAL_URL || '/login';
          window.location.href = portalUrl;
        }, 3000);
      } else {
        await markVerificationFailed(verificationId!, err.message);
        setStatus('error');
        setError('Ein Fehler ist beim Erstellen Ihres Kontos aufgetreten');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Broker Einladung
        </h2>
        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {(status === 'loading' || status === 'verifying') && (
            <div className="text-center">
              <p className="text-gray-600">
                {status === 'loading' ? 'Einladung wird verifiziert...' : 'Konto wird erstellt...'}
              </p>
            </div>
          )}

          {status === 'password' && (
            <form onSubmit={handleSetPassword}>
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                Ihr Konto wurde erfolgreich erstellt. Sie werden in Kürze weitergeleitet...
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

export default BrokerVerification;
