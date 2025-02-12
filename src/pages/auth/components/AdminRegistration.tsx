import React, { useState } from 'react';
import { signUp } from '../../../lib/firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { loginUser } from '../../../services/authService';
import { useAuthStore } from '../../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface AdminRegistrationProps {
  onClose: () => void;
}

const AdminRegistration: React.FC<AdminRegistrationProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    adminCode: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Verify admin code from environment variable
    const adminCode = import.meta.env.VITE_ADMIN_REGISTRATION_CODE;
    if (!adminCode || formData.adminCode !== adminCode) {
      setError('Ungültiger Administrator-Code');
      setIsLoading(false);
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await signUp(formData.email, formData.password);
      
      // Create verification document with specific ID
      const verificationRef = doc(db, 'verifications', userCredential.user.uid);
      await setDoc(verificationRef, {
        type: 'admin_invite',
        email: formData.email.toLowerCase(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'admin',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        verified: true,
        emailSent: true
      });

      // Create user document with UID as document ID
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, {
        email: formData.email.toLowerCase(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'admin',
        verificationId: userCredential.user.uid,
        createdAt: new Date().toISOString(),
        status: 'active'
      });

      // Automatically log in after registration
      const { user } = await loginUser(formData.email, formData.password);
      setUser(user);
      onClose();
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      if (err instanceof Error) {
        setError(`Registrierung fehlgeschlagen: ${err.message}`);
      } else {
        setError('Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Administrator-Registrierung</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">E-Mail</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Passwort</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vorname</label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nachname</label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Administrator-Code</label>
            <input
              type="password"
              name="adminCode"
              required
              value={formData.adminCode}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Wird registriert...' : 'Registrieren'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegistration;
