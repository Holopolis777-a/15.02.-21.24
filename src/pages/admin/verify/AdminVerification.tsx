import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Lock } from 'lucide-react';
import { verifyAdminInvitation } from '../../../lib/firebase/services/adminInviteService';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase/config';

const AdminVerification = () => {
  const { inviteId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'valid' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [inviteData, setInviteData] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const verifyInvite = async () => {
      if (!inviteId) {
        setStatus('error');
        setError('Ungültiger Verifizierungslink');
        return;
      }

      try {
        const data = await verifyAdminInvitation(inviteId);
        setInviteData(data);
        setStatus('valid');
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      }
    };

    verifyInvite();
  }, [inviteId]);

  const validatePassword = (password: string): boolean => {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(password)) {
      setError('Das Passwort erfüllt nicht die Anforderungen');
      return;
    }

    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      return;
    }

    try {
      setStatus('loading');
      
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        inviteData.email,
        password
      );

      // Create user document
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: inviteData.email,
        firstName: inviteData.firstName,
        lastName: inviteData.lastName,
        role: 'admin',
        createdAt: new Date().toISOString()
      });

      // Update invitation status
      await setDoc(doc(db, 'admin_invites', inviteId), {
        status: 'completed',
        completedAt: new Date().toISOString()
      }, { merge: true });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setStatus('error');
      setError('Fehler bei der Registrierung. Bitte versuchen Sie es später erneut.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
            <p className="mt-4 text-gray-600">Verifizierung wird überprüft...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Verifizierung fehlgeschlagen
            </h2>
            <p className="mt-2 text-red-600">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Zum Login
            </button>
          </div>
        )}

        {status === 'valid' && (
          <div>
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="mt-4 text-xl font-bold text-gray-900">
                E-Mail bestätigt
              </h2>
              <p className="mt-2 text-gray-600">
                Bitte legen Sie ein sicheres Passwort fest.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Passwort
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Passwort bestätigen
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex">
                  <Lock className="h-5 w-5 text-blue-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Passwort-Anforderungen
                    </h3>
                    <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
                      <li>Mindestens 12 Zeichen</li>
                      <li>Mindestens ein Großbuchstabe</li>
                      <li>Mindestens ein Kleinbuchstabe</li>
                      <li>Mindestens eine Zahl</li>
                      <li>Mindestens ein Sonderzeichen</li>
                    </ul>
                  </div>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Account aktivieren
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVerification;