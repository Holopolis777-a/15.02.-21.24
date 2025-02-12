import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { inviteEmployer } from '../../lib/firebase/services/employerInviteService';
import { useEmployerInvites } from '../../hooks/useEmployerInvites';

interface InviteForm {
  companyName: string;
  contactName: string;
  email: string;
}

const Recommend = () => {
  const { user } = useAuthStore();
  const { stats, loading: statsLoading } = useEmployerInvites();
  const [form, setForm] = useState<InviteForm>({
    companyName: '',
    contactName: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!user?.id) {
        throw new Error('Benutzer nicht gefunden');
      }

      await inviteEmployer(form.email, user.id);
      
      setSuccess(true);
      setForm({
        companyName: '',
        contactName: '',
        email: ''
      });
    } catch (err) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Weiterempfehlen</h1>
        
        <div className="mb-8 text-gray-600">
          <p className="mb-4">Hi, du bist begeistert von VILOCAR?</p>
          <p>Dann hilf uns, anderen zu helfen und empfehle uns weiter.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="font-semibold mb-2">Gesendete Einladungen</h3>
            <p className="text-2xl text-blue-600">{statsLoading ? '...' : stats.total}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="font-semibold mb-2">Akzeptierte Einladungen</h3>
            <p className="text-2xl text-green-600">{statsLoading ? '...' : stats.accepted}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="font-semibold mb-2">Akzeptanzrate</h3>
            <p className="text-2xl text-purple-600">
              {statsLoading ? '...' : `${stats.acceptanceRate.toFixed(1)}%`}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Name des Unternehmens
            </label>
            <input
              type="text"
              id="companyName"
              placeholder="z.B. Musterfirma GmbH"
              className="w-full p-2 border rounded-md"
              value={form.companyName}
              onChange={(e) => setForm(prev => ({ ...prev, companyName: e.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
              Name des Ansprechpartners
            </label>
            <input
              type="text"
              id="contactName"
              placeholder="z.B. Max Mustermann"
              className="w-full p-2 border rounded-md"
              value={form.contactName}
              onChange={(e) => setForm(prev => ({ ...prev, contactName: e.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-Mail-Adresse
            </label>
            <input
              type="email"
              id="email"
              placeholder="kontakt@musterfirma.de"
              className="w-full p-2 border rounded-md"
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          {success && (
            <div className="text-green-600 text-sm">
              Einladung wurde erfolgreich versendet!
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Wird gesendet...' : 'Einladung senden'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Recommend;
