import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, auth } from '../../lib/firebase/config';
import { CheckCircle, XCircle, Lock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types/auth';

interface Verification {
  type: string;
  email: string;
  companyId: string;
  verified: boolean;
  verificationStarted?: boolean;
  verificationStartedAt?: string;
  verifiedAt?: string;
  verificationFailed?: boolean;
  verificationError?: string;
  failedAt?: string;
}

const VerifyCompany: React.FC = () => {
  const { verificationId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'verifying' | 'setPassword' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [verification, setVerification] = useState<Verification | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { setUser } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (!verificationId) {
        setStatus('error');
        setError('Ungültiger Verifizierungslink');
        return;
      }

      try {
        // Get verification data
        const verificationRef = doc(db, 'verifications', verificationId);
        const verificationDoc = await getDoc(verificationRef);

        if (!verificationDoc.exists()) {
          throw new Error('Ungültiger Verifizierungslink');
        }

        const verification = verificationDoc.data() as Verification;

        // Check verification type
        if (!['company_invite', 'employer_invite', 'employer_verification'].includes(verification.type)) {
          throw new Error('Ungültiger Verifizierungstyp');
        }

        // Check if already verified
        if (verification.verified) {
          throw new Error('Dieser Link wurde bereits verwendet');
        }

        setVerification(verification);
        setStatus('setPassword');
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      }
    };

    init();
  }, [verificationId]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verification || !verificationId) {
      setError('Verification data not found');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      return;
    }

    if (password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }

    try {
      setStatus('verifying');
      console.log('Starting verification process...');

      // Sign out any existing user first
      await signOut(auth);

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, verification.email, password);
      console.log('User account created');

      try {
        // Create user document with verification data
        const userData = {
          email: verification.email,
          role: 'employer',
          companyId: verification.companyId,
          verificationId: verificationId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
          verified: true,
          // Add verification type to match security rules
          verificationType: verification.type
        };
        
        // First try to update verification document to mark as started
        await updateDoc(doc(db, 'verifications', verificationId), {
          verificationStarted: true,
          verificationStartedAt: new Date().toISOString(),
          userId: userCredential.user.uid
        });
        
        // Then create user document
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
        console.log('User document created');

        // Update company
        const companyRef = doc(db, 'companies', verification.companyId);
        await updateDoc(companyRef, {
          status: 'active',
          userId: userCredential.user.uid,
          verificationId: verificationId,
          updatedAt: new Date().toISOString()
        });
        console.log('Company updated');
      } catch (err) {
        // If company doesn't exist yet, create it
        if (err instanceof Error && err.message.includes('NOT_FOUND')) {
          await setDoc(doc(db, 'companies', verification.companyId), {
            status: 'active',
            userId: userCredential.user.uid,
            verificationId: verificationId,
            email: verification.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          console.log('Company created');
        } else {
          throw err;
        }
      }

      // Mark verification as complete
      const verificationRef = doc(db, 'verifications', verificationId);
      await updateDoc(verificationRef, {
        verified: true,
        verifiedAt: new Date().toISOString(),
        verificationStarted: false
      });
      console.log('Verification marked as complete');

      // Update auth store
      setUser({
        id: userCredential.user.uid,
        email: verification.email,
        role: 'employer' as UserRole,
        firstName: '',
        lastName: ''
      });

      setStatus('success');
      console.log('Status set to success');

      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Verification error:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');

      // If anything fails, mark verification as failed
      try {
        const verificationRef = doc(db, 'verifications', verificationId);
        await updateDoc(verificationRef, {
          verificationStarted: false,
          verificationFailed: true,
          verificationError: err instanceof Error ? err.message : 'Unknown error',
          failedAt: new Date().toISOString()
        });
      } catch (updateErr) {
        console.error('Failed to update verification status:', updateErr);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
        )}

        {status === 'setPassword' && (
          <form onSubmit={handleSetPassword} className="space-y-6">
            <Lock className="w-16 h-16 text-blue-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">
              Passwort erstellen
            </h2>
            <p className="text-gray-600">
              Bitte erstellen Sie ein Passwort für Ihren Arbeitgeber-Account
            </p>
            {error && <p className="text-red-600">{error}</p>}
            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passwort"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Passwort bestätigen"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Account erstellen
            </button>
          </form>
        )}

        {status === 'verifying' && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
            <p className="text-gray-600">Account wird erstellt...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">
              Account erfolgreich erstellt
            </h2>
            <p className="text-gray-600">
              Sie werden zum Dashboard weitergeleitet...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">
              Verifizierung fehlgeschlagen
            </h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => navigate('/companies')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Zurück zur Übersicht
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyCompany;
