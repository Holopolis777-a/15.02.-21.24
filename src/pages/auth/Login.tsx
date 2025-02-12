import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { loginUser } from '../../services/authService';
import AdminRegistration from './components/AdminRegistration';
import { useAdminLogo } from '../../hooks/useAdminLogo';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const logoUrl = useAdminLogo();
  console.log('Logo URL in Login component:', logoUrl);

  // Check for pending error in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorType = params.get('error');
    if (errorType === 'pending_employee') {
      setError('Ihr Arbeitgeber hat Sie noch nicht freigeschaltet. Sie erhalten eine E-Mail, sobald Ihr Konto freigeschaltet wurde.');
    } else if (errorType === 'pending') {
      setError('Ihr Konto wartet noch auf die Freischaltung durch Ihren Arbeitgeber. Sie erhalten eine E-Mail, sobald Ihr Konto freigeschaltet wurde.');
    }
  }, [location]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminRegistration, setShowAdminRegistration] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { user, userData } = await loginUser(email, password);
      setUser(user);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        if (err.message === 'PENDING_APPROVAL') {
          setError('Ihr Arbeitgeber hat Sie noch nicht freigeschaltet. Sie erhalten eine E-Mail, sobald Ihr Konto freigeschaltet wurde.');
        } else if (err.message.includes('auth/invalid-credential')) {
          setError('Ungültige Anmeldeinformationen. Bitte überprüfen Sie Ihre E-Mail-Adresse und Ihr Passwort.');
        } else {
          setError(`Anmeldung fehlgeschlagen: ${err.message}`);
        }
      } else {
        setError('Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-[#f5f0e6] to-[#fff8e8]">
      {/* Left side - Login Form */}
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-md p-8 space-y-6">
            <form className="space-y-8" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <label htmlFor="email" className="block text-base text-gray-600">
                  E-Mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-5 py-4 rounded-xl bg-[#f5f0e6] text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#c5d86d] focus:border-transparent transition-colors border-0"
                  placeholder="ihre@email.de"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="password" className="block text-base text-gray-600">
                  Passwort
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-5 py-4 rounded-xl bg-[#f5f0e6] text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#c5d86d] focus:border-transparent transition-colors border-0"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="/reset-password" className="text-gray-400 hover:text-gray-600 transition-colors">
                    Passwort vergessen?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-5 rounded-xl text-base font-medium text-white bg-[#c5d86d] hover:bg-[#b3c55d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c5d86d] disabled:opacity-50 transition-all shadow-sm"
              >
                {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
              </button>
            </form>

            <div>
              <button
                type="button"
                onClick={() => setShowAdminRegistration(true)}
                className="w-full flex justify-center py-4 px-5 rounded-xl text-base font-medium text-gray-700 bg-[#f5f0e6] hover:bg-[#ede8de] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c5d86d] transition-all shadow-sm"
              >
                Als Administrator registrieren
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Logo and Welcome Text */}
      <div className="hidden md:flex flex-col items-center justify-center p-12 bg-white/20 backdrop-blur-sm">
        <div className="max-w-lg text-center space-y-12">
          {logoUrl && (
            <img 
              src={logoUrl} 
              alt="Vilocar Logo" 
              className="h-28 mx-auto object-contain"
            />
          )}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">
              Herzlich Willkommen<br />bei VILOCAR
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed max-w-md mx-auto">
              Ihr Full-Service-Partner für<br />
              Firmenwagen, Gehaltsumwandlung<br />
              und Privatfahrzeuge
            </p>
          </div>
        </div>
      </div>

      {showAdminRegistration && (
        <AdminRegistration onClose={() => setShowAdminRegistration(false)} />
      )}
    </div>
  );
};

export default Login;
