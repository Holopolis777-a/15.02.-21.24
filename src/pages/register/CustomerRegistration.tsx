import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuthStore } from '../../store/authStore';

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const CustomerRegistration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const { setUser } = useAuthStore();

  // Hole die brokerId und inviteId aus den URL-Parametern
  const searchParams = new URLSearchParams(location.search);
  const brokerId = searchParams.get('brokerId');
  const inviteId = searchParams.get('inviteId');

  useEffect(() => {
    const validateInvite = async () => {
      if (!inviteId || !brokerId) {
        setError('Ungültiger Einladungslink');
        return;
      }

      const db = getFirestore();
      const inviteRef = doc(db, 'customerInvites', inviteId);
      
      try {
        const inviteDoc = await getDoc(inviteRef);
        if (!inviteDoc.exists()) {
          setError('Einladung nicht gefunden');
          return;
        }

        const inviteData = inviteDoc.data();
        if (inviteData.status !== 'pending') {
          setError('Diese Einladung ist nicht mehr gültig');
          return;
        }

        if (inviteData.brokerId !== brokerId) {
          setError('Ungültige Broker-Zuordnung');
          return;
        }

        if (new Date(inviteData.expiresAt.toDate()) < new Date()) {
          setError('Diese Einladung ist abgelaufen');
          return;
        }
      } catch (err) {
        console.error('Fehler beim Validieren der Einladung:', err);
        setError('Fehler beim Validieren der Einladung');
      }
    };

    validateInvite();
  }, [inviteId, brokerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!brokerId || !inviteId) {
      setError('Ungültiger Registrierungslink');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth();
      const db = getFirestore();

      // Erstelle den Benutzer
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Speichere den Benutzer mit der Rolle 'customer'
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: formData.email,
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Speichere die Kundendaten
      await setDoc(doc(db, 'customers', userCredential.user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        brokerId: brokerId,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Aktualisiere den Einladungsstatus
      await setDoc(doc(db, 'customerInvites', inviteId), {
        status: 'accepted',
        acceptedAt: new Date()
      }, { merge: true });

      // Setze den Auth-Store
      setUser({
        id: userCredential.user.uid,
        email: formData.email,
        role: 'customer'
      });

      // Zeige Erfolgsmeldung und leite weiter
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error('Registrierungsfehler:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten');
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-red-600 text-center">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-green-600 text-center">
              <div className="text-lg font-medium mb-2">Registrierung erfolgreich!</div>
              <div className="text-sm">Sie werden zum Dashboard weitergeleitet...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Registrierung für das Customer Portal
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Registrierung läuft...' : 'Registrieren'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegistration;
