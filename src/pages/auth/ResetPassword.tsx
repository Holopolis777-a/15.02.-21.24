import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { resetPassword } from '../../lib/auth';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/10 backdrop-blur-sm py-8 px-4 shadow-md rounded-3xl sm:px-10">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-4">
                E-Mail wurde versendet
              </h2>
              <p className="text-gray-300">
                Bitte überprüfen Sie Ihren Posteingang und folgen Sie den Anweisungen in der E-Mail.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Lock className="w-12 h-12 text-white/90" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Passwort zurücksetzen
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/10 backdrop-blur-sm py-8 px-4 shadow-md rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                E-Mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-5 py-4 rounded-xl bg-white/10 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-white/25 focus:border-transparent transition-colors border-0"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-4 px-5 rounded-xl text-base font-medium text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/25 disabled:opacity-50 transition-all shadow-sm"
            >
              {isLoading ? 'Wird gesendet...' : 'Link zum Zurücksetzen senden'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
