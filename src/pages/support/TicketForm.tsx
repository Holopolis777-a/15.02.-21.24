import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { TicketFormData } from '../../types/ticket';
import { useAuthStore } from '../../store/authStore';
import { useCurrentCompany } from '../../hooks/useCurrentCompany';

interface TicketFormProps {
  onSubmit: (data: TicketFormData, companyId?: string, companyName?: string) => Promise<void>;
  isLoading?: boolean;
}

const TicketForm: React.FC<TicketFormProps> = ({ onSubmit, isLoading }) => {
  const { user } = useAuthStore();
  const { company } = useCurrentCompany();
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.title.length > 100) {
      setError('Der Titel darf maximal 100 Zeichen lang sein.');
      return;
    }

    try {
      await onSubmit(formData, company?.id, company?.name);
      setFormData({
        title: '',
        description: ''
      });
    } catch (err) {
      setError('Fehler beim Erstellen des Tickets');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Titel <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          maxLength={100}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.title.length}/100 Zeichen
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Beschreibung <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          rows={5}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Wird erstellt...' : 'Ticket erstellen'}
        </button>
      </div>
    </form>
  );
};

export default TicketForm;
